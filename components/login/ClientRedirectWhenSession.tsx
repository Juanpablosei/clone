"use client";

import { useEffect } from "react";

/**
 * Cuando el usuario ya tiene sesión y entra en /login, redirigimos en el CLIENTE
 * con window.location.replace(). Así la siguiente petición a /admin o / es una
 * carga completa del documento y la cookie se envía siempre. Evita el bucle
 * infinito que ocurría al hacer redirect() desde el servidor (307).
 */
export default function ClientRedirectWhenSession({
  role,
}: {
  role: string;
}) {
  useEffect(() => {
    const url = role === "VIEWER" ? "/" : "/admin";
    window.location.replace(url);
  }, [role]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)]">
      <p className="text-[var(--admin-text-muted)]">Redirigiendo...</p>
    </div>
  );
}
