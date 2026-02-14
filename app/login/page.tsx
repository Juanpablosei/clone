import { auth } from "../../lib/auth";
import LoginForm from "../../components/login/LoginForm";
import ClientRedirectWhenSession from "../../components/login/ClientRedirectWhenSession";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage() {
  const session = await auth();

  // No usar redirect() aquí: en producción el 307 puede hacer que la siguiente
  // petición no envíe la cookie → /admin redirige a /login → bucle infinito.
  // Redirigir en el cliente con window.location.replace() para una carga completa con cookie.
  if (session) {
    return <ClientRedirectWhenSession role={session.user.role ?? ""} />;
  }

  return <LoginForm />;
}
