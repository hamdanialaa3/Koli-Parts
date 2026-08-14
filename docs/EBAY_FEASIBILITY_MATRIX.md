# eBay Feasibility Matrix — GATE-0

Audit date: 2026-08-15

| Capability | API | Sandbox | Production | Approval | Koli Parts status |
|---|---|---|---|---|---|
| Search/listing discovery | Browse API | generally available | subject to Buy API terms/limits | production key/growth requirements may apply | TARGET |
| `EBAY_DE` marketplace discovery | Browse API | supported marketplace semantics | supported marketplace | standard Buy API requirements | TARGET |
| Automotive compatibility data from eBay | Browse item compatibility where exposed | VERIFY test data | supported where item/category data supports it | standard requirements | SECONDARY EVIDENCE |
| Bulk feed ingestion | Feed API | **not available in Sandbox** | restricted | approvals/contracts | DEFER until approved |
| Guest checkout | Order API v2 | checkout resources require approval | Limited Release | business-unit/Buy API approval/contracts | BLOCKED |
| Member checkout | Order API v1 | checkout resources require approval | Limited Release | business-unit/Buy API approval/contracts | BLOCKED |
| EBAY_DE checkout shipped directly to Bulgaria | Order/Buy UX rules | not a valid assumed flow | current requirement says marketplace checkout items must deliver within marketplace country | requires explicit eBay-approved alternative | BLOCKED |
| eBay seller-side fulfillment | Sell Fulfillment API | seller context | seller context | seller authorization | NOT A BUYING API |
| Affiliate/referral link | Browse/EPN path | test separately | EPN policies | EPN account | POSSIBLE PATH |

## Critical finding

Current eBay Buy API requirements say delivery-country filtering is domestic to the marketplace: an `EBAY_DE` checkout surfaces items delivered in Germany. Therefore the architecture must not claim official Buy Order API can purchase on eBay Germany and ship directly to a Bulgarian customer.

## Allowed architecture assumptions

- Browse eBay DE for product discovery: yes, subject to API access/terms.
- Normalize eBay listing data into Koli Parts: yes, within licensing/data retention terms that must be respected.
- Automatic eBay purchase to Bulgarian customer: **no assumption**.
- Automatic eBay purchase to German hub then onward shipping: **proposal only**, requiring eBay approval, legal/accounting validation and unit economics.
- Direct B2B supplier integration: recommended independent channel.

## Production application workstream

1. Developer account/keysets.
2. EPN assessment/application where required.
3. Buy API application with exact user flows/data flows.
4. eBay support review.
5. Contracts/terms.
6. Growth Check / production enablement.
7. Staging validation with approved checkout resources.
8. Production smoke test.

Until completed: `EBAY_AUTOMATED_ORDERING=false`.
