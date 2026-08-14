# Source Register

Audit date: 2026-08-15

## Existing Koli Parts source material

| Source | Status | Key facts used |
|---|---|---|
| `package.json` | inspected | npm workspaces `apps/*`, `packages/*`; Turbo; Node >=20 |
| `package-lock.json` | inspected | `apps/api` uses NestJS 11; `apps/web` uses Next.js 16.2.12 / React 19.2.4 |
| `turbo.json` | inspected | shared dev/build/lint/type-check tasks |
| `.env.example` | inspected | Postgres, Redis, Econt, Stripe, Sentry, default margin; no eBay settings |
| `START_MEIN_PLAN_1.0.md` | inspected | eBay DE → Bulgaria concept, VIN/TecDoc/OEM/DTC, fitment confidence, semi-automation, 0–36 week plan |

## Koli One design source of truth

Repository: `hamdanialaa3/koli-one`, default branch `main`.

Inspected files:
- `theme-vars.css` — generated semantic light/dark theme tokens.
- `src/index.css` — actual global CSS entry; imports theme vars and defines Inter body / Exo 2 headings.
- `src/styles/typography.ts` — type scale and font stacks.
- `src/styles/design-system.ts` — spacing, breakpoints, shadows and legacy component tokens.

Important: Koli One currently contains some token drift. Generated `theme-vars.css` defines radii 6/10/16 and motion 120/200/320ms, while `src/styles/design-system.ts` contains legacy radii 4/8/12/16/20 and motion 200/300/400ms. New Koli Parts components should prefer generated semantic theme tokens; legacy values should be migrated deliberately, not mixed silently.

## Official eBay sources reviewed

- Buy APIs Requirements: `https://developer.ebay.com/api-docs/buy/static/buy-requirements.html`
- Buy APIs Overview: `https://developer.ebay.com/api-docs/buy/static/buy-overview.html`
- Order API v1/v2: `https://developer.ebay.com/develop/api/buy/order_api_v1` and `/order_api_v2`
- Buy API marketplace support: `https://developer.ebay.com/api-docs/buy/ref-marketplace-supported.html`
- Feed API: `https://developer.ebay.com/api-docs/buy/api-feed.html`

Key current findings:
- Order API is Limited Release.
- Production Buy API access requires approval and contracts; eBay recommends approval before major checkout investment.
- Guest/member checkout methods are restricted in Sandbox until approval.
- `EBAY_DE` is a supported Buy marketplace.
- eBay Buy checkout UX requirements state items surfaced for a marketplace must be delivered within that marketplace country. For `EBAY_DE`, this means Germany, not Bulgaria.
- Feed API production is restricted and Feed is not available in Sandbox.

## Official EU sources reviewed

- Bulgaria/euro: `https://economy-finance.ec.europa.eu/euro/eu-countries-and-euro/bulgaria-and-euro_en`
- Consumer withdrawal: `https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm`
- VAT OSS: `https://vat-one-stop-shop.ec.europa.eu/`
- GPSR: Regulation (EU) 2023/988 via EUR-Lex.

Legal/accounting conclusions in this pack are checklists, not legal opinions. Bulgarian counsel/accountant must confirm the operating model before production.
