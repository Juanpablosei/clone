import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth-helpers";
import ConfigForm from "../../../components/admin/ConfigForm";

export default async function ConfigPage() {
  await requireAdmin();
  const config = await prisma.siteConfig.findUnique({
    where: { id: "site-config" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-foreground">Site Configuration</h1>
      <ConfigForm initialData={config} />
    </div>
  );
}

