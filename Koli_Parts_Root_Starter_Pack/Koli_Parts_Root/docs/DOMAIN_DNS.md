# Domain & DNS

Proposed public domain: `koli-one.com`  
Koli One: `koli.one`

## Proposed endpoints

- `www.koli-one.com` → public web
- `api.koli-one.com` → API only if operationally needed; same-origin proxy is preferred where practical
- `admin.koli-one.com` → optional admin surface; strong auth/WAF policies
- `status.koli-one.com` → optional public status

Do not create extra subdomains merely for architecture aesthetics.

## TLS/security
- HSTS after domain/cert validation,
- TLS 1.2+ / modern managed defaults,
- secure cookies,
- exact CORS allow-list,
- CSP,
- no wildcard credentialed CORS.

## Cross-domain identity
`koli.one` and `koli-one.com` cannot share a parent-domain cookie. Use a secure identity handoff/exchange.
