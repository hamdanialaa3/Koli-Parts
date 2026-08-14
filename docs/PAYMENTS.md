# Payments

## MVP provider

Stripe first; PayPal is optional after core order/procurement reconciliation is stable.

## Preferred pattern

Where product/business rules allow, authorize funds before procurement and capture after supplier procurement is confirmed. This reduces refund churn when supplier stock disappears, but authorization windows and card-network behavior must be tested for expected procurement time.

## Requirements

- PaymentIntent metadata includes internal order ID only, not sensitive vehicle data.
- webhook signature verified before processing.
- every event deduplicated by provider event ID.
- creation/capture/refund endpoints use idempotency keys.
- payment amount/currency is reconciled against immutable quote snapshot.
- no card data stored by Koli Parts.

## Failure matrix

| Failure | Action |
|---|---|
| payment authorization fails | do not create procurement |
| supplier unavailable before capture | cancel/void authorization where possible |
| capture fails after procurement | manual finance incident, block shipment escalation path |
| duplicate webhook | return success after dedupe |
| amount mismatch | block and manual review |

## Accounting

Merchant-of-record, VAT/OSS and invoice ownership must be confirmed by Bulgarian accountant/legal counsel before production.
