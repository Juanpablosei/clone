import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

/**
 * Página intermedia después del login. NextAuth redirige aquí con la cookie ya
 * establecida (redirect completo), así el servidor ve la sesión. Desde aquí
 * redirigimos por rol: VIEWER → home, EDITOR/ADMIN → admin.
 * Evita el bucle de miles de peticiones que ocurría con router.push() en Vercel.
 */
export default async function AuthCallbackPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "VIEWER") {
    redirect("/");
  }

  redirect("/admin");
}
