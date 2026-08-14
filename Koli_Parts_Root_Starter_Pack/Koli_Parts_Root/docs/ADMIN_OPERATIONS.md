# Admin Operations UX

Admin is an operational control center, not generic CRUD.

## Primary queues
- Procurement Review
- Failed Procurement
- Price Changed
- Out of Stock
- Fitment Review
- Returns
- Refunds
- Seller Watchlist
- Sync/API Health
- Payment Reconciliation

## Procurement row/card
Must show order age, payment authorization expiry, vehicle, part, fitment tier, seller, current price, quote price, contribution margin, delivery route and warnings.

## Actions
- approve,
- reject with reason,
- request fitment review,
- switch to permitted equivalent listing with recorded evidence,
- cancel/void/refund,
- block seller,
- disable automation.

Every sensitive action writes an audit entry.
