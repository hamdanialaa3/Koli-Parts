# Security Baseline

## Threat priorities

- admin takeover,
- provider/eBay token theft,
- payment webhook spoofing/replay,
- IDOR/broken authorization,
- quote/price manipulation,
- duplicate procurement,
- refund abuse,
- VIN enumeration,
- XSS/CSRF/SSRF/injection,
- secrets in logs/client bundles,
- dependency compromise.

## Mandatory controls

- MFA for admin roles.
- RBAC: `support`, `procurement_operator`, `fitment_reviewer`, `finance`, `admin`, `super_admin`.
- server-side authorization on every resource, not UI-only role checks.
- secrets in managed secret store in staging/prod.
- provider refresh tokens encrypted using KMS/envelope encryption.
- token key version stored alongside ciphertext.
- rotation runbook and revocation path.
- rate limiting for auth/VIN/search/admin actions.
- webhook verification + dedupe.
- idempotency table for financial/write operations.
- structured audit log for procurement, fitment override, refunds, roles, seller blocks.
- SAST/dependency scan in CI.
- Content Security Policy and secure headers.

## Kill switches

- `DISABLE_EBAY_SYNC`
- `DISABLE_AUTOMATIC_PROCUREMENT`
- `DISABLE_CHECKOUT`
- `DISABLE_NEW_ORDERS`
- `DISABLE_PAYMENT_CAPTURE`

Kill switches must be server-authoritative and audited.

## Incident response

1. classify severity,
2. stop risky flows with feature flags,
3. rotate/revoke affected secrets,
4. preserve logs/evidence,
5. identify affected users/orders,
6. legal/privacy notification assessment,
7. remediation and postmortem.
