
-- =========================================================================
-- ROLES
-- =========================================================================
CREATE TYPE public.app_role AS ENUM ('employee', 'hr', 'admin', 'super_admin');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'leave', 'half_day');
CREATE TYPE public.lead_stage AS ENUM ('new', 'contacted', 'interested', 'follow_up', 'converted', 'closed_lost');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- =========================================================================
-- DEPARTMENTS / TEAMS
-- =========================================================================
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  manager_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- PROFILES
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT,
  designation TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  joining_date DATE,
  avatar_url TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teams
  ADD CONSTRAINT teams_manager_fk FOREIGN KEY (manager_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- =========================================================================
-- USER ROLES (separate table, security-definer function)
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'hr' THEN 3
    WHEN 'employee' THEN 4
  END
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('hr','admin','super_admin')
  )
$$;

-- =========================================================================
-- ATTENDANCE
-- =========================================================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  working_minutes INT DEFAULT 0,
  status public.attendance_status NOT NULL DEFAULT 'absent',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID REFERENCES public.attendance(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- LIVE LOCATIONS
-- =========================================================================
CREATE TABLE public.live_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  address TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_live_locations_user_recorded ON public.live_locations(user_id, recorded_at DESC);

-- =========================================================================
-- LEADS / CRM
-- =========================================================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  stage public.lead_stage NOT NULL DEFAULT 'new',
  value NUMERIC(12,2) DEFAULT 0,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- DOCUMENTS
-- =========================================================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  storage_path TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- NOTIFICATIONS
-- =========================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- REGULARIZATION REQUESTS
-- =========================================================================
CREATE TABLE public.regularization_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_date DATE NOT NULL,
  reason TEXT NOT NULL,
  requested_check_in TIMESTAMPTZ,
  requested_check_out TIMESTAMPTZ,
  status public.request_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- SETTINGS
-- =========================================================================
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- AUTO-CREATE PROFILE + EMPLOYEE ROLE ON SIGNUP
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, employee_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'EMP-' || substr(NEW.id::text, 1, 8)
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'employee');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- GRANTS
-- =========================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT SELECT, INSERT ON public.attendance_logs TO authenticated;
GRANT SELECT, INSERT ON public.live_locations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT SELECT, INSERT ON public.lead_activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.regularization_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.settings TO authenticated;

GRANT ALL ON public.profiles, public.user_roles, public.departments, public.teams,
  public.attendance, public.attendance_logs, public.live_locations, public.leads,
  public.lead_activities, public.documents, public.notifications,
  public.regularization_requests, public.settings TO service_role;

-- =========================================================================
-- ENABLE RLS
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regularization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- POLICIES
-- =========================================================================
-- PROFILES: everyone authenticated can read all profiles (org-wide directory). Self-update; staff can update any.
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_update_staff ON public.profiles FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY profiles_insert_staff ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) OR auth.uid() = id);
CREATE POLICY profiles_delete_admin ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

-- USER_ROLES: read own, staff read all, only super_admin writes
CREATE POLICY user_roles_select_own ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY user_roles_admin_all ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- DEPARTMENTS / TEAMS: readable by all auth; manage by admin+
CREATE POLICY dept_select ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY dept_manage ON public.departments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY teams_select ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY teams_manage ON public.teams FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

-- ATTENDANCE: own + staff sees all
CREATE POLICY att_select ON public.attendance FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY att_insert_self ON public.attendance FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY att_update_self ON public.attendance FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY att_logs_select ON public.attendance_logs FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY att_logs_insert ON public.attendance_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- LIVE LOCATIONS: own + staff sees all
CREATE POLICY loc_select ON public.live_locations FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY loc_insert ON public.live_locations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- LEADS: all authenticated can read and create; assigned/creator/staff can update/delete
CREATE POLICY leads_select ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY leads_insert ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY leads_update ON public.leads FOR UPDATE TO authenticated USING (auth.uid() = assigned_to OR auth.uid() = created_by OR public.is_staff(auth.uid()));
CREATE POLICY leads_delete ON public.leads FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY lead_act_select ON public.lead_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY lead_act_insert ON public.lead_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- DOCUMENTS: own + staff. Staff updates status (approval).
CREATE POLICY docs_select ON public.documents FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY docs_insert ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY docs_update ON public.documents FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY docs_delete ON public.documents FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- NOTIFICATIONS: own only; staff can create for anyone
CREATE POLICY notif_select ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY notif_insert ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY notif_update ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- REGULARIZATION: own create; staff approves
CREATE POLICY reg_select ON public.regularization_requests FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY reg_insert ON public.regularization_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY reg_update ON public.regularization_requests FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));

-- SETTINGS: super_admin only
CREATE POLICY settings_select ON public.settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY settings_manage ON public.settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- =========================================================================
-- STORAGE BUCKETS
-- =========================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT DO NOTHING;

CREATE POLICY "avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars owner upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars owner update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars owner delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "documents owner read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid())));
CREATE POLICY "documents owner upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "documents owner delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid())));

-- =========================================================================
-- SEED DATA
-- =========================================================================
INSERT INTO public.departments (name, description) VALUES
  ('Engineering', 'Software development team'),
  ('Sales', 'Sales and business development'),
  ('Operations', 'Field operations and logistics'),
  ('Human Resources', 'People and culture')
ON CONFLICT DO NOTHING;
