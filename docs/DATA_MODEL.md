# Data Model

## Core separation

`Product` = normalized part identity.  
`SupplierListing` = one supplier's current offer for a product.  
`ListingSnapshot` = immutable facts used for a quote/order decision.

## Core aggregates

### Identity
`users`, `external_identities`, `admin_roles`

### Vehicle
`vehicles`, `vin_lookups`

### Catalog
`products`, `product_identifiers`, `product_oem_numbers`, `supplier_listings`, `listing_snapshots`, `sellers`

### Fitment
`fitments`, `fitment_evidence`, `compatibility_evaluations`

### Commerce
`carts`, `cart_items`, `quotes`, `orders`, `order_items`, `order_events`

### Money
`payments`, `payment_events`, `refunds`

### Procurement
`procurements`, `procurement_attempts`, `shipments`, `tracking_events`, `returns`

### Platform
`idempotency_keys`, `webhook_events`, `sync_runs`, `audit_logs`, `feature_flags`

## Ownership principles

- Postgres is authoritative for Koli Parts business state.
- Provider tokens are not stored in ordinary plaintext columns.
- JSONB is allowed for external/raw evidence but not as a substitute for fields required by queries and constraints.
- monetary amounts are integer minor units (`amount_minor`) with ISO currency.
- timestamps are UTC `timestamptz`.
- state transitions are append-evented where operationally important.

See `db/migrations/001_initial_schema.sql`.
