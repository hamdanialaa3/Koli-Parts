# Remaining Implementation Sequence

Start with `ACTIVE_PLAN.md`. Completed setup and feature steps were removed from
this sequence and preserved in `COMPLETED_WORK.md`.

1. Implement fitment evaluation v1 and hard rejects.
2. Record eBay key/application status; do not commit secrets.
3. Implement eBay app-token and Browse adapter.
4. Complete catalog normalization, persistence, snapshots and seller metrics.
5. Revisit Meilisearch only after ADR-004 is approved or Postgres search fails
   a measured requirement.
6. Add TecDoc only after its license and data contract are approved.
7. Implement quote snapshot, expiry and supplier revalidation.
8. Implement Stripe authorization and webhook dedupe after merchant approval.
9. Implement idempotent order creation.
10. Complete procurement state transitions, locking, reject path and provider
    capability guards.
11. Add cancellation/refund, tracking, returns and observability.
12. Run a controlled dry run before any automatic procurement.

Never implement eBay checkout to Bulgarian addresses from an unsupported API
assumption.
