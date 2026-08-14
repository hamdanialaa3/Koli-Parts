# Roadmap — Dependency Ordered

Timing is planning guidance, not a promise. External approvals can move the critical path.

## Phase 0 — Weeks 0–2: Audit & Feasibility
- inspect complete local source tree/build health,
- ratify PROJECT_SPEC 2.0,
- eBay Buy/Browse application track,
- TecDoc/VIN commercial discovery,
- Koli One auth audit,
- legal/accounting merchant/VAT kickoff,
- design token parity baseline.

**Go/No-Go:** no checkout implementation based on eBay Order API until production path is clear.

## Phase 1 — Weeks 3–5: Platform foundation
- DB schema/migrations,
- config validation,
- auth/external identity mapping,
- audit/idempotency framework,
- provider interfaces,
- CI + local compose.

## Phase 2 — Weeks 6–9: Catalog & discovery
- eBay Browse adapter,
- canonical product/listing normalization,
- seller records,
- sync logs,
- Meilisearch indexing,
- search page skeleton using Koli One design tokens.

## Phase 3 — Weeks 10–13: Vehicle & fitment
- garage,
- VIN adapter,
- TecDoc adapter when licensed,
- OEM mapping,
- fitment evidence/tiers,
- product compatibility UI.

## Phase 4 — Weeks 14–17: Commerce
- cart,
- quote snapshots,
- price/stock refresh,
- Stripe authorization,
- order state machine,
- admin procurement queue.

## Phase 5 — Weeks 18–21: Semi-manual procurement
- supplier validation,
- admin approve/reject,
- tracking abstraction,
- cancellation/refund paths,
- operations runbook.

## Phase 6 — Weeks 22–25: Returns & hardening
- returns/refunds,
- reconciliation,
- security tests,
- observability,
- seller reliability v1,
- support workflows.

## Phase 7 — Weeks 26–29: Dry run / controlled beta
- internal/small cohort,
- human-reviewed every procurement,
- measure fitment/stock/price mismatch,
- tune margins and seller policy.

## Phase 8 — Weeks 30–36: Bulgaria launch / selective automation
Only automate provider/order cases that pass `GO_NO_GO.md`.

## Critical path
External approvals (eBay/TecDoc/legal/accounting) → supplier model → fitment evidence → quote/payment/procurement → dry run → launch.
