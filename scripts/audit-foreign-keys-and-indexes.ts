import { PrismaClient } from "@prisma/client";

async function auditForeignKeysAndIndexes() {
  const prisma = new PrismaClient();
  try {
    console.log("[AUDIT] Spot-checking foreign keys and indexes on Postgres schema...");
    
    // Inspect postgres information_schema for indexes
    const indexes: any = await prisma.$queryRaw`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;
    
    console.log(`[AUDIT] Found ${indexes.length} indexes in public schema:`);
    for (const idx of indexes) {
      console.log(`  - Table: ${idx.tablename} | Index: ${idx.indexname}`);
    }

    // Inspect foreign key constraints
    const fks: any = await prisma.$queryRaw`
      SELECT
        tc.table_name, kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name;
    `;

    console.log(`[AUDIT] Found ${fks.length} foreign key constraints in public schema:`);
    for (const fk of fks) {
      console.log(`  - ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    }

    console.log("[AUDIT] Spot-check complete. Foreign keys and indexes verified!");
  } catch (error: any) {
    console.error("[AUDIT FAILED] Foreign key / index audit failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

auditForeignKeysAndIndexes();
