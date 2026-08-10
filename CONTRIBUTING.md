# Contributing Guide — Local Supabase & Dev Environment Setup

## Prerequisites
- Node.js 18+ and `npm`
- Supabase CLI (`npm install -g supabase` or via `npx supabase`)

## Setting Up Local Supabase Development

1. **Initialize Local Supabase Configuration**:
   ```bash
   npx supabase init
   ```
2. **Start Local Supabase Stack**:
   ```bash
   npx supabase start
   ```
3. **Copy Local Connection Strings**:
   - `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"`
   - `NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY="<local-anon-key>"`

4. **Apply Local Schema & Seed Data**:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Run Master Test Suite**:
   ```bash
   npx tsx scripts/run-all-tests.ts
   ```
