import "dotenv/config";
import { defineConfig } from "prisma/config";

const defaultUrl = "postgresql://postgres:postgres@localhost:5432/typemaster?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL || defaultUrl,
    // @ts-ignore: directUrl is currently missing from PrismaConfig types
    directUrl: process.env.POSTGRES_URL_NON_POOLING || defaultUrl,
  },
} as any);
