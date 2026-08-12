-- Enable Row Level Security (RLS) on all Supabase Database Tables (Default Deny)

ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Leaderboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VerificationCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "PracticeSession" ENABLE ROW LEVEL SECURITY;

-- Service Role Full Access Policies (Bypasses RLS for backend Prisma & server operations)
CREATE POLICY "service_role_user_all" ON "User" TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_session_all" ON "Session" TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_leaderboard_all" ON "Leaderboard" TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_verification_all" ON "VerificationCode" TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_practice_all" ON "PracticeSession" TO service_role USING (true) WITH CHECK (true);

-- Public Read-Only Policy on Leaderboard Table (Required for WebSocket Realtime Subscriptions)
CREATE POLICY "public_read_leaderboard" ON "Leaderboard" FOR SELECT TO anon USING (true);

-- SECURITY AUDIT CONFIRMATION:
-- Zero policies exist granting INSERT, UPDATE, or DELETE access to the `anon` or public role on any table.
-- All database mutations are strictly performed server-side via Next.js API routes using the `service_role` key.
