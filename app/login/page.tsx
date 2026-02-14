import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "../../components/login/LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    if (session.user.role === "ADMIN" || session.user.role === "EDITOR") {
      redirect("/admin");
    }
    redirect("/");
  }

  return <LoginForm />;
}
