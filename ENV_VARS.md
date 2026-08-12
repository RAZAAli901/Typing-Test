# Environment Variables Specification Document (v3.0.0 Supabase)

## Required Environment Variables

| Variable Name | Environment Scope | Key Type / Format | Purpose / Usage Description |
|:---|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser & Server | Public HTTPS URL | Base URL for Supabase API and WebSocket endpoints (`https://<id>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser & Server | Public JWT Key | Anon key safe for inclusion in browser JS bundles for WebSocket subscriptions. |
| `SUPABASE_URL` | Server Only | Public HTTPS URL | Server-side alias for Supabase API URL. |
| `SUPABASE_ANON_KEY` | Server Only | Public JWT Key | Server-side alias for Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Secret Admin Key | Privileged service key bypassing RLS for server-side Storage uploads (`avatars`). Must NEVER be `NEXT_PUBLIC_` prefixed. |
| `DATABASE_URL` | Server Only | Connection String | Transaction pooler URL on port **6543** with `pgbouncer=true` parameter. Must NEVER be `NEXT_PUBLIC_` prefixed. |
| `DIRECT_URL` | Server Only | Connection String | Direct PostgreSQL connection string on port **5432** for Prisma migrations. Must NEVER be `NEXT_PUBLIC_` prefixed. |
| `NEXTAUTH_SECRET` | Server Only | Secret Hash | Encryption key for signing NextAuth JWT session cookies. Must NEVER be `NEXT_PUBLIC_` prefixed. |
| `NEXTAUTH_URL` | Server Only | URL | Canonical deployment URL (`http://localhost:3000` or production domain). |
| `RESEND_API_KEY` | Server Only | Secret API Key | API key for dispatching transactional emails via Resend. Must NEVER be `NEXT_PUBLIC_` prefixed. |

> [!SECURITY]
> **Server-Only Variable Boundary Enforcement**:
> Secret keys (`NEXTAUTH_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are reserved strictly for server-side execution runtime. Prefixing any of these variables with `NEXT_PUBLIC_` is strictly prohibited to prevent client bundle exposure.

