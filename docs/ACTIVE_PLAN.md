# Active Plan

Updated: 2026-08-20

This is the execution entry point. It contains only unfinished work. Product
rules remain in `PROJECT_SPEC.md`; detailed domain constraints remain in the
matching document under `docs/`.

## Verified baseline

- PRs #1-#20 are merged into `main`; see `COMPLETED_WORK.md`.
- Platform/CI, Koli One sessions, CSRF/RBAC and Vehicle Garage CRUD exist.
- Catalog detail, Postgres search, normalization and initial search UI exist.
- VIN/fitment contracts, evidence persistence and FitmentStatus UI exist.
- Admin procurement queue/approval exist; the full state machine does not.

## Next execution order

1. Restore the full test gate by fixing time-sensitive idempotency fixtures.
2. **#22:** Fitment evaluation v1 and evidence-backed hard rejects.
3. **#4, #10-#13:** eBay Browse ingestion, normalization and persistence.
4. **#24-#25:** EUR quote snapshot, expiry and supplier revalidation.
5. **#26-#27:** Payment authorization and idempotent order creation.
6. **#28-#29, #31-#32:** Complete procurement transitions and guards.
7. **#33-#37:** Operations, returns, observability and hardening.
8. Controlled dry run, then apply `GO_NO_GO.md`.

## External gates

These are owner/business tasks and must not be represented as implemented:

- **#3/#5:** eBay keys inventory and Buy API business-model review.
- **#20:** TecDoc commercial and data-license decision.
- VIN provider contract/privacy approval.
- Merchant of record, VAT/OSS, invoicing and returns policy approval.
- Stripe merchant/KYC setup and production secrets.

## Rules for every task

- One task, one branch, one human-merged PR, at most 400 changed lines.
- Search the code before building and follow code when documentation is stale.
- No fake supplier, VIN, fitment, trust, price or order data.
- EUR only; automatic procurement remains disabled until all gates pass.
- Run focused tests, then type-check, lint, full tests and build before review.
