# Full-Automation Go/No-Go Checklist

All applicable items must pass before enabling automatic procurement.

- [ ] eBay/provider production ordering permission is documented.
- [ ] Exact marketplace/delivery route is approved.
- [ ] Merchant-of-record model signed off.
- [ ] VAT/OSS/invoicing signed off.
- [ ] Consumer returns policy approved.
- [ ] Product safety/category policy approved.
- [ ] TecDoc/data licensing approved where used.
- [ ] VIN provider contract/privacy review complete.
- [ ] SSO threat model reviewed.
- [ ] Admin MFA enforced.
- [ ] RBAC tests pass.
- [ ] Production secrets are in managed secret store.
- [ ] Provider token encryption/rotation tested.
- [ ] Payment create/capture/refund idempotency tested.
- [ ] Webhook verification/dedupe tested.
- [ ] Procurement state machine race tests pass.
- [ ] Internal reservation lock race tests pass.
- [ ] Supplier price revalidation tested.
- [ ] Supplier availability revalidation tested.
- [ ] Shipping eligibility revalidation tested.
- [ ] Margin-floor guard tested.
- [ ] Fitment hard-reject rules tested.
- [ ] Fitment accuracy measured on representative sample.
- [ ] Wrong-fit return rate is within approved threshold.
- [ ] Seller reliability policy has production data.
- [ ] Cancellation E2E passes.
- [ ] Return E2E passes.
- [ ] Refund E2E passes.
- [ ] Payment/procurement reconciliation alert tested.
- [ ] Provider outage/circuit breaker tested.
- [ ] `DISABLE_AUTOMATIC_PROCUREMENT` kill switch tested.
- [ ] `DISABLE_PAYMENT_CAPTURE` kill switch tested.
- [ ] On-call/incident process assigned.
- [ ] Backups/PITR restore test passed.
- [ ] Security review has no unresolved critical findings.
- [ ] Dry-run operational sign-off complete.

Decision record must include date, approvers, enabled supplier/country/category scope and rollback plan.
