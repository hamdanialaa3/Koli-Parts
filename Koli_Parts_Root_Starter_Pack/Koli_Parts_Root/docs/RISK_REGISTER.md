# Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---:|---:|---|---|
| R-001 | eBay Buy Order production access denied | M | Critical | supplier abstraction; B2B/referral fallback | Product/Legal |
| R-002 | EBAY_DE cannot checkout to BG address | H | Critical | do not build direct path; evaluate German hub/direct B2B | CTO/Ops |
| R-003 | supplier stock disappears after customer pays | H | High | quote expiry, refresh, payment auth, semi-manual review | Procurement |
| R-004 | supplier price changes | H | High | max delta guard, margin floor, admin approval | Finance/Ops |
| R-005 | wrong fitment | M | Critical | TecDoc/OEM hierarchy, confidence tiers, logs | Fitment |
| R-006 | TecDoc license delay/cost | M | High | provider abstraction; OEM fallback with downgraded confidence | Product |
| R-007 | seller invoice/branding exposes source economics | H | Medium | direct seller SLA/B2B; score/allowlist; do not promise neutral packaging without agreement | Ops |
| R-008 | returns erase margin | H | High | category economics, reserve, root-cause tracking | Finance |
| R-009 | duplicate procurement | M | Critical | idempotency + locks + state machine | Engineering |
| R-010 | payment capture/procurement mismatch | M | Critical | authorize/capture strategy, reconciliation alerts | Finance/Eng |
| R-011 | SSO flaw | L/M | Critical | short-lived assertions, issuer/audience checks, PKCE/state/nonce | Security |
| R-012 | token/secret leak | M | Critical | managed secrets, encryption, rotation, CI secret scan | Security |
| R-013 | VAT/invoice error | M | Critical | Bulgarian accountant approval before production | Finance |
| R-014 | product safety category breach | M | Critical | category policy + GPSR/legal review | Legal/Ops |
| R-015 | search quality poor in BG/DE terminology | M | High | query analytics, synonym/OEM normalization | Search |
| R-016 | supplier dependency | H | High | multi-supplier adapters | CTO |
| R-017 | delivery times damage trust | M | High | ETA evidence, seller score, proactive notifications | Ops |
| R-018 | Koli One design drift | M | Medium | shared semantic tokens, parity audit | Design |
