# Remaining MVP Work Items

Original IDs are retained for traceability. Completed items are recorded in
`COMPLETED_WORK.md` and intentionally do not appear here.

## External decisions

3. **Record eBay Sandbox/Production key inventory** without secrets.
5. **Submit eBay Buy API business-model review** and record private ticket IDs.
20. **Decide TecDoc commercial and data-license path** before integration.

## Supplier catalog

4. **Implement eBay app-token service and Browse adapter** with retries and
   metrics; automated ordering stays false.
10. **Complete Product/SupplierListing write repositories**; read-only catalog
    detail already exists.
11. **Normalize eBay Browse DTO** into provider-neutral contracts.
12. **Persist immutable listing snapshots** during refresh.
13. **Implement seller entity and measured reliability foundation** without
    fabricated thresholds.

## Vehicle and fitment

22. **Implement fitment evaluation v1 and hard rejects** from persisted
    evidence; never infer compatibility from missing evidence.

## Commerce

24. **Implement quote snapshot and expiry** in EUR.
25. **Refresh supplier price, stock and shipping eligibility at quote time**.
26. **Implement Stripe authorization and verified webhook deduplication** after
    merchant approval.
27. **Create orders with idempotency keys** and replay-safe responses.

## Procurement

28. **Implement the procurement state machine** with legal transitions.
29. **Implement the internal procurement lock**; it is not supplier inventory
    reservation.
31. **Complete approve/reject operations with audit reasons**; approval exists,
    rejection remains.
32. **Enforce provider capability guards** before any supplier-side operation.

## Operations

33. **Implement cancellation, authorization void and refund flows**.
34. **Implement shipment and tracking abstraction**.
35. **Implement returns root-cause taxonomy**.
36. **Implement owner-gated kill-switch admin controls**.
37. **Add Sentry/OpenTelemetry baseline** without logging secrets or PII.

Every item requires tests, observability notes, security notes and a definition
of done before implementation starts.
