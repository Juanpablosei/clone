import { auth } from "../../lib/auth";
import AdminNavbar from "../../components/admin/AdminNavbar";
import SessionProvider from "../../components/providers/SessionProvider";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "VIEWER") {
    redirect("/");
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[var(--admin-bg)]">
        <AdminNavbar />
        <main className="mx-auto w-full max-w-[1600px] px-6 py-8">{children}</main>
      </div>
    </SessionProvider>
  );
}

