# Koli Parts

Koli Parts is a Bulgarian-first automotive parts commerce platform in the Koli ecosystem. The architecture prioritizes correct fitment, supplier abstraction, transparent evidence, safe payments and semi-automated procurement.

## Important current constraint

eBay Germany is usable as an initial discovery source through the Buy/Browse ecosystem, but the project must **not** assume direct official eBay Buy checkout from `EBAY_DE` to a Bulgarian delivery address. Current eBay Buy API checkout requirements are domestic to the marketplace and Order API is Limited Release. See `docs/EBAY_FEASIBILITY_MATRIX.md`.

## Local prerequisites

- Node.js >=20
- npm 10.x
- Docker Desktop
- Postgres CLI (`psql`) if using the root migration script directly

## Setup

```powershell
cd C:\Users\hamda\Desktop\Koli_Parts_Root
Copy-Item .env.example .env
# Edit .env with local-only values; never commit real secrets.
.\scripts\bootstrap.ps1
npm ci
npm run dev
```

## Key documents

1. `PROJECT_SPEC.md`
2. `docs/CURRENT_STATE_AUDIT.md`
3. `docs/EBAY_FEASIBILITY_MATRIX.md`
4. `docs/IMPLEMENTATION_SEQUENCE.md`
5. `docs/GO_NO_GO.md`
6. `docs/design/KOLI_ONE_VISUAL_AUDIT.md`

## Database

```powershell
npm run db:migrate
```

Use a local/disposable DB until the actual NestJS entities/modules are compared to `001_initial_schema.sql`.

## Design

Koli Parts uses Koli One's audited visual system: Inter body, Exo 2 headings, semantic teal/indigo palette and responsive tokens. Import `packages/design-system/src/tokens.css` into the web theme after verifying the existing Next.js styling approach.

## Safety

Automatic procurement is disabled by design until provider, legal, financial, fitment, security and operational gates pass.
