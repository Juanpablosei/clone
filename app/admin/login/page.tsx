"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Correo o contraseña incorrectos.",
  missing: "Introduce email y contraseña.",
  default: "Error al iniciar sesión.",
};

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "loading" && session) {
      const url = session.user?.role === "VIEWER" ? "/" : "/admin";
      router.replace(url);
    }
  }, [session, status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim();
    const password = (form.querySelector('[name="password"]') as HTMLInputElement)?.value;
    if (!email || !password) {
      setError(ERROR_MESSAGES.missing);
      return;
    }
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    if (result?.error) {
      setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.default);
      return;
    }
    if (result?.ok) {
      // Ir a home; la home redirige a EDITOR/ADMIN a /admin y deja VIEWER en /
      router.push("/");
      router.refresh();
    }
  }

  if (status === "loading" || session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)]">
        <p className="text-[var(--admin-text-muted)]">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-[var(--admin-text)]">Login</h1>
          <p className="mt-2 text-[var(--admin-text-muted)]">Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--admin-text)]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="Enter your user"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--admin-text)]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
