# Operations Runbook

## Procurement queue SLA

Every authorized order enters the queue with age, authorization expiry, fitment tier, margin, supplier and blockers.

## Out-of-stock
1. refresh supplier item,
2. mark attempt `SUPPLIER_OUT_OF_STOCK`,
3. search allowed alternate supplier only if exact product/fitment rule permits,
4. do not silently substitute different part,
5. void/cancel payment authorization or issue refund as appropriate,
6. notify customer.

## Supplier price increase
- auto-accept only inside explicitly configured safe delta **and** minimum margin if policy allows;
- otherwise manual review/customer option;
- never charge more than customer-authorized total without a new compliant payment step.

## eBay account/API incident
- disable eBay sync/ordering capability,
- preserve pending orders,
- move affected cases to manual review/fallback supplier,
- rotate credentials if compromise suspected,
- open eBay support incident where relevant.

## Fitment dispute
Collect: selected vehicle/VIN fields, OEM evidence, TecDoc evidence, listing snapshot, customer photos, return reason and reviewer decision. Never edit historical evidence after the dispute; append corrections.

## Refund incident
Finance role verifies supplier/procurement status + payment ledger before refund. High-value/manual overrides require second approval according to configured policy.
