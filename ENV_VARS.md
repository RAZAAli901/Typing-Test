# Environment Variables Specification Document (v3.0.0 Supabase)

## Required Environment Variables

| Variable Name | Environment Scope | Key Type / Format | Purpose / Usage Description |
|:---|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser & Server | Public HTTPS URL | Base URL for Supabase API and WebSocket endpoints (`https://<id>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser & Server | Public JWT Key | Anon key safe for inclusion in browser JS bundles for WebSocket subscriptions. |
| `SUPABASE_URL` | Server Only | Public HTTPS URL | Server-side alias for Supabase API URL. |
| `SUPABASE_ANON_KEY` | Server Only | Public JWT Key | Server-side alias for Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Secret Admin Key | Privileged service key bypassing RLS for server-side Storage uploads (`avatars`). |
| `DATABASE_URL` | Server Only | Connection String | Transaction pooler URL on port **6543** with `pgbouncer=true` parameter. |
| `DIRECT_URL` | Server Only | Connection String | Direct PostgreSQL connection string on port **5432** for Prisma migrations. |
| `NEXTAUTH_SECRET` | Server Only | Secret Hash | Encryption key for signing NextAuth JWT session cookies. |
| `NEXTAUTH_URL` | Server Only | URL | Canonical deployment URL (`http://localhost:3000` or production domain). |
