# Preview Environment Deployment Guide

## Deployment Protocol
1. **Branch Push**: Push all migration commits to preview feature branch (`git push origin main`).
2. **Environment Variable Binding**: Confirm `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, and `DIRECT_URL` are bound to Preview scope in Vercel settings.
3. **Preview Deployment Verification**:
   - Check build logs on Vercel preview deployment.
   - Ping `/api/health` endpoint on preview domain.
   - Test live Realtime socket connection on Leaderboard view.
