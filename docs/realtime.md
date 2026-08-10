# Supabase Realtime Leaderboard Architecture

This document describes the WebSocket subscription architecture and event streaming model for live Leaderboard updates in TypeMaster Web.

---

## Architecture Overview
```
Client (Browser) <--- WebSockets (wss://) ---> Supabase Realtime Engine
                                                        ^
                                                        | CDC (WAL)
                                                        v
Prisma Client ---> Postgres Database (Session table) ---+
```

1. **Database Event Generation**: Whenever a typing session is completed, `POST /api/sessions` inserts a row into the Postgres `Session` table via Prisma.
2. **Postgres CDC Broadcasting**: Supabase CDC (Change Data Capture) listens to WAL logs and broadcasts postgres `INSERT` / `UPDATE` events on publication `supabase_realtime`.
3. **Browser WebSocket Listener**: `useLeaderboardRealtime` hook in `src/hooks/useLeaderboardRealtime.ts` receives payload events, filters by active practice mode (`mode=eq.<activeMode>`), debounces bursts (300ms window), and updates the UI state.
4. **Resiliency Fallback**: If WebSocket connection closes or fails to establish, the Leaderboard automatically activates 10-second interval polling (`fetchLeaderboard`) until connection is restored.
