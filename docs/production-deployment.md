# Production Deployment Runbook

## Deployment Sign-Off
1. **Preview Gate**: Verify preview build passes all automated smoke tests and health checks.
2. **Production Release Command**: Merge `main` branch to production deployment (`git push origin main`).
3. **Database Migration Verification**: Confirm PgBouncer connection pooler handles live traffic cleanly.
4. **Storage Bucket Verification**: Confirm `avatars` bucket serves live CDN profile images.
5. **Realtime CDC Replication Verification**: Confirm WebSocket channel broadcasts high scores in real time without error events.
