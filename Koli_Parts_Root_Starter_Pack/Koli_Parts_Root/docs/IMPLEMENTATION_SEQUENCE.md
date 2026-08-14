# Exact Implementation Sequence

1. Back up the current root.
2. Overlay this starter pack using `INSTALL_SAFE.ps1` or copy files manually.
3. Run `node scripts/verify-config.mjs`.
4. Inspect real `apps/api` and `apps/web`; record deviations in `CURRENT_STATE_AUDIT.md`.
5. Ratify ADR-001/002/003/005/006 before substantial coding.
6. Apply `db/migrations/001_initial_schema.sql` to a disposable local DB only.
7. Start Postgres/Redis/Meilisearch with Docker Compose.
8. Add/confirm shared `packages/contracts` package in workspace.
9. Implement config module with `.env.example` schema validation.
10. Implement auth/external identity mapping after Koli One auth audit.
11. Implement supplier interface; set eBay automated ordering false.
12. Implement eBay client-credentials token service and Browse adapter.
13. Build product/listing normalization + snapshot persistence.
14. Build search indexing and initial search UI using Koli One tokens.
15. Implement Vehicle Garage and VIN provider interface.
16. Add TecDoc only after licensing/data contract is known.
17. Implement fitment evidence/evaluation.
18. Implement quote snapshot/revalidation.
19. Implement Stripe authorization + webhook dedupe.
20. Implement order/procurement state machine + admin queue.
21. Run controlled dry-run before any automation.

Do not implement eBay Order API checkout to Bulgarian addresses based on the old assumption.
