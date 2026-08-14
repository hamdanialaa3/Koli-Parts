# eBay Integration

## Purpose

eBay is initially a discovery/supply signal for German parts. The integration is split into Browse, OAuth, normalization, optional EPN attribution, and a procurement capability that remains disabled unless explicitly approved.

## OAuth separation

### Application token
Use client-credentials for APIs that support application authorization such as Browse discovery. Cache until shortly before expiry.

### User token
Only use authorization-code flow for APIs that require an eBay user context. Store refresh tokens encrypted and audit refresh/revocation events.

## Required environment variables

See root `.env.example`. Never commit real client secret, RuName credentials, user refresh tokens or webhook verification secrets.

## Browse request model

Header examples:

```http
Authorization: Bearer <application-access-token>
X-EBAY-C-MARKETPLACE-ID: EBAY_DE
X-EBAY-C-ENDUSERCTX: contextualLocation=country%3DDE
```

The exact `X-EBAY-C-ENDUSERCTX` use must match the selected discovery/procurement route and current eBay documentation.

## Normalization

Map eBay fields into internal records:
- `supplier = EBAY`
- external item ID
- title/source language
- image URLs
- price/currency
- condition
- seller identity/feedback where returned and permitted
- shipping options/destination context
- category/aspects
- compatibility evidence
- item URL/EPN URL
- fetched-at/expiry

Do not make the eBay item the canonical product. Resolve/associate it to `products` via OEM/MPN/brand/category evidence.

## Cache policy

- OAuth application token: cache to expiry minus safety margin.
- item detail: short TTL; refresh at quote.
- search result: short TTL.
- price/availability: never trust stale cache at checkout.

## Rate limits/resilience

- provider-specific rate limiter,
- timeout,
- retry only idempotent reads,
- exponential backoff + jitter,
- circuit breaker,
- structured provider errors,
- alert on sustained 429/5xx rates.

## Procurement rule

`EbaySupplierAdapter.capabilities.automatedOrdering` must remain false until production approval and the exact route is compliant.

No headless browser workflow is included in this architecture as a substitute for unavailable API permissions.
