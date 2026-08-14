# Test Strategy

## Unit
- pricing and margin rules,
- fitment rule evaluation,
- order/procurement transitions,
- seller scoring,
- authorization checks.

## Integration
- Postgres repositories,
- Redis lock/idempotency,
- Meilisearch indexing,
- Stripe test mode,
- provider adapters with recorded/mock responses.

## eBay scenarios
1. Browse success.
2. item disappears between search and quote.
3. price changes.
4. shipping route invalid.
5. 401 token expiry/refresh.
6. 429 rate limit.
7. 5xx timeout/circuit breaker.
8. Limited Release checkout endpoint unavailable — must fail closed.

## E2E
`login/SSO → vehicle → search → product → fitment warning/confirmation → cart → quote → payment auth → admin procurement → shipment → return/refund`.

## Security
- SAST/dependency audit,
- access-control matrix tests,
- IDOR tests,
- webhook replay/forgery,
- CSRF/XSS/SSRF,
- rate limit tests,
- secrets scan.

## Load
Search p95, quote refresh, webhook bursts, sync jobs. Define SLOs after baseline measurements.

## Release rule
No production deployment with failing migration/build/type-check/security-critical test.
