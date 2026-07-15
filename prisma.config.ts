import "dotenv/config";
import { defineConfig } from "prisma/config";

const defaultUrl = "postgresql://postgres:postgres@localhost:5432/typemaster?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || defaultUrl,
    // @ts-ignore: directUrl is currently missing from PrismaConfig types
    directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL || defaultUrl,
  },
} as any);
