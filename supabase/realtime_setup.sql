-- ============================================================================
-- SUPABASE REALTIME REPLICATION SETUP
-- ============================================================================
-- Enable Postgres WAL CDC (Change Data Capture) replication on the Session table
-- so real-time high score submissions broadcast to browser clients via WebSockets.

-- 1. Enable publication for Session table changes
ALTER PUBLICATION supabase_realtime ADD TABLE "Session";

-- 2. Verify active tables in supabase_realtime publication
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
