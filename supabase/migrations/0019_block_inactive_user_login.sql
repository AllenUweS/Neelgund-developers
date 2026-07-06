-- Reject sign-in / token issuance for users whose profile is marked inactive.
-- This runs as a Supabase Auth "Custom Access Token Hook", which Supabase Auth
-- calls every time it is about to issue a JWT (password login, OTP login,
-- token refresh, etc). Raising an exception here aborts the login at the
-- database level -- Supabase never issues the token.

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  is_user_active boolean;
begin
  select is_active
  into is_user_active
  from public.profiles
  where id = (event->>'user_id')::uuid;

  -- If the profile row is missing for some reason, don't silently block --
  -- only block when we explicitly know is_active = false.
  if is_user_active is false then
    raise exception 'Account has been deactivated. Please contact your administrator.';
  end if;

  return jsonb_build_object('claims', event->'claims');
end;
$$;

-- The hook is executed by the internal supabase_auth_admin role, not by
-- normal app roles. Grant it exactly what it needs and nothing more.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

-- profiles has RLS enabled, and supabase_auth_admin is not the table owner,
-- so it needs its own read policy to look up is_active during the hook.
grant select on table public.profiles to supabase_auth_admin;

drop policy if exists profiles_auth_admin_select on public.profiles;
create policy profiles_auth_admin_select on public.profiles
for select to supabase_auth_admin
using (true);
