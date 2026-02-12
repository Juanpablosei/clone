import { requireAdmin } from "../../../lib/auth-helpers";

export default async function AdminEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
