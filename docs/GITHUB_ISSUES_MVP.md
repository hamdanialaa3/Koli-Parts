# MVP GitHub Issues

## EPIC-00 Current repository audit
1. **Audit apps/api and apps/web against PROJECT_SPEC 2.0** — acceptance: module map + build/lint/type-check status + conflicts documented.
2. **Ratify package/workspace boundaries** — acceptance: ADR-001 approved.

## EPIC-01 eBay feasibility
3. **Create eBay Sandbox/Production key inventory (no secrets in issue)** — acceptance: owners/status recorded.
4. **Implement app-token service + Browse search POC** — acceptance: EBAY_DE fixed-price search works with retries/metrics.
5. **Submit Buy API business model review** — external dependency; acceptance: application/ticket IDs recorded privately.
6. **Lock eBay automatedOrdering capability false** — acceptance: cannot execute unsupported ordering in code/config.

## EPIC-02 Identity
7. **Audit Koli One Firebase/auth flow** — acceptance: issuer/audience/session/revocation/roles documented.
8. **Implement external_identities mapping** — acceptance: one Koli One subject maps idempotently to one Koli Parts user.
9. **Implement SSO exchange endpoint** — acceptance: replay/invalid issuer/audience tests pass.

## EPIC-03 Catalog
10. **Implement Product/SupplierListing repositories**.
11. **Normalize eBay Browse DTO**.
12. **Persist listing snapshots**.
13. **Implement seller entity/metrics foundation**.

## EPIC-04 Search
14. **Start Meilisearch locally and create index schema**.
15. **Implement search provider interface**.
16. **Build BG/EN/DE identifier normalization**.
17. **Build search result UI with Koli One tokens**.

## EPIC-05 Vehicle/Fitment
18. **Vehicle Garage CRUD**.
19. **VIN provider adapter contract**.
20. **TecDoc commercial/license decision**.
21. **Fitment evidence persistence**.
22. **Fitment evaluation v1 + hard rejects**.
23. **FitmentStatus component**.

## EPIC-06 Commerce
24. **Quote snapshot + expiry**.
25. **Supplier price/availability refresh at quote**.
26. **Stripe authorization + webhook dedupe**.
27. **Create order with idempotency key**.

## EPIC-07 Procurement
28. **Procurement state machine**.
29. **Internal procurement lock**.
30. **Admin Procurement Queue**.
31. **Approve/reject with audit reason**.
32. **Provider capability guard**.

## EPIC-08 Operations
33. **Cancellation/void/refund flow**.
34. **Shipment/tracking abstraction**.
35. **Returns root-cause taxonomy**.
36. **Kill-switch admin controls**.
37. **Sentry/OpenTelemetry baseline**.

Each issue must include tests, observability, security notes and definition of done before implementation starts.
