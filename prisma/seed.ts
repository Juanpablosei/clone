import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Crear usuario admin por defecto
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gradientinstitute.org" },
    update: {},
    create: {
      email: "admin@gradientinstitute.org",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Admin user created:", admin);

  // Crear usuario editor por defecto
  const editorPassword = await bcrypt.hash("editor123", 10);

  const editor = await prisma.user.upsert({
    where: { email: "editor@gradientinstitute.org" },
    update: {},
    create: {
      email: "editor@gradientinstitute.org",
      password: editorPassword,
      name: "Editor User",
      role: "EDITOR",
      active: true,
    },
  });

  console.log("Editor user created:", editor);

  // Crear usuario viewer por defecto
  const viewerPassword = await bcrypt.hash("viewer123", 10);

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@gradientinstitute.org" },
    update: {},
    create: {
      email: "viewer@gradientinstitute.org",
      password: viewerPassword,
      name: "Viewer User",
      role: "VIEWER",
      active: true,
    },
  });

  console.log("Viewer user created:", viewer);

  // Crear configuración del sitio
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: "site-config" },
    update: {},
    create: {
      id: "site-config",
      logo: "/gradient-large.svg",
      email: "info@gradientinstitute.org",
      linkedin: "https://www.linkedin.com/company/gradient-institute",
      twitter: "https://twitter.com/gradientinst",
    },
  });

  console.log("Site config created:", siteConfig);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

