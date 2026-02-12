import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL_TARGET;
if (!connectionString) {
  throw new Error("DATABASE_URL_TARGET environment variable is not set");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prismaContent: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prismaContent ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaContent = prisma;
}

