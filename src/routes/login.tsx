import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { SmokeyBackground, LoginForm } from "@/components/ui/login-form";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Neelgund Developers" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
    else navigate({ to: "/dashboard" });
  };

  return (
    <main className="relative w-screen h-screen bg-gray-900">
      <SmokeyBackground className="absolute inset-0" color="#154D8C" />
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <LoginForm
          emailValue={email}
          onEmailChange={setEmail}
          passwordValue={password}
          onPasswordChange={setPassword}
          isLoading={busy}
          onSubmit={handleSignIn}
        />
      </div>
    </main>
  );
}
