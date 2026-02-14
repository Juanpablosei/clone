"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // redirect: true → NextAuth responde con Set-Cookie + 302 en la MISMA respuesta.
      // El navegador guarda la cookie y sigue el redirect; no hay petición intermedia ni bucle.
      const result = (await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/admin",
      })) as { error?: string } | undefined;

      // Solo llegamos aquí si hay error (credenciales incorrectas); si OK, el navegador ya redirigió.
      if (result?.error) {
        const msg =
          result.error === "CredentialsSignin"
            ? "Correo o contraseña incorrectos, o la cuenta está desactivada."
            : "Error al iniciar sesión. Intenta de nuevo.";
        setError(msg);
      }
      setLoading(false);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
