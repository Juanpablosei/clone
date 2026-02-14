"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)]">
      <AdminNavbar />
      <main className="mx-auto w-full max-w-[1600px] px-6 py-8">{children}</main>
    </div>
  );
}
