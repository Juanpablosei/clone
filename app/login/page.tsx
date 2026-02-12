import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "../../components/login/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    if (session.user.role === "EDITOR") {
      redirect("/admin");
    }
    redirect("/");
  }

  return <LoginForm />;
}
