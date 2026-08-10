# Supabase PgBouncer Connection Pooler Tuning Guide

## Pooler Configuration Specifications
- **Pooler Port**: `6543` (Transaction Pooler Mode).
- **Default Pool Size**: `15` connections per pooler instance.
- **Max Client Connections**: `10,000` concurrent WebSocket / API worker connections.

## Tuning Rules & Best Practices
1. **Transaction Pool Mode**: Always configure `pgbouncer=true` on `DATABASE_URL` to enable session transaction pooling.
2. **Prepared Statements**: Disable client-side prepared statements when routing queries through PgBouncer transaction poolers (`statement_cache_size=0`).
3. **Direct Port 5432**: Reserve direct port 5432 for CLI database migrations (`npx prisma db push`).
