# Koli Parts Starter Pack — Manifest

Generated: 2026-08-15
Target root: `C:\Users\hamda\Desktop\Koli_Parts_Root`

This pack turns the existing Koli Parts planning material into an implementation-ready documentation/configuration baseline. It is designed to be **overlaid carefully** onto the current repository, not to erase existing application code.

## Ground rules encoded in this pack

1. Existing repository code wins over assumptions. The uploaded root already uses npm workspaces/Turbo and the lockfile shows `apps/api` (NestJS 11) and `apps/web` (Next.js 16 / React 19).
2. `START_MEIN_PLAN_1.0.md` remains historical baseline. `PROJECT_SPEC.md` is the proposed governing spec after review.
3. eBay is treated as a supplier/discovery integration, not as a guaranteed automated procurement API. Official eBay Buy Order checkout is Limited Release and production access requires approval/contracts.
4. Direct official Buy checkout from `EBAY_DE` to a Bulgarian delivery address is **not assumed**. eBay's current Buy API requirements state checkout items for a marketplace must be delivered domestically within that marketplace country. This creates a GATE-0 condition for DE→BG procurement.
5. Koli Parts must not be architecturally captive to eBay. Supplier capabilities are explicit and adapter-based.
6. Koli One is the visual and identity source of truth. New Koli Parts UI uses Koli One's actual semantic palette, typography and design language, while parts-specific workflows remain purpose-built.
7. Production secrets are never committed. Values in `.env.example` are placeholders.

## Contents

### Root contracts/config
- `PROJECT_SPEC.md`
- `SOURCE_REGISTER.md`
- `openapi.yaml`
- `.env.example`
- `docker-compose.yml`
- `INSTALL_SAFE.ps1`

### Database
- `db/migrations/001_initial_schema.sql`
- `db/seeds/001_dev_seed.sql`
- `db/README.md`

### Product/architecture docs
- `docs/CURRENT_STATE_AUDIT.md`
- `docs/ARCHITECTURE.md`
- `docs/EBAY_FEASIBILITY_MATRIX.md`
- `docs/EBAY_INTEGRATION.md`
- `docs/AUTH_SSO.md`
- `docs/DATA_MODEL.md`
- `docs/FITMENT_ENGINE.md`
- `docs/SEARCH_ARCHITECTURE.md`
- `docs/PROCUREMENT.md`
- `docs/PAYMENTS.md`
- `docs/SECURITY.md`
- `docs/COMPLIANCE.md`
- `docs/RISK_REGISTER.md`
- `docs/ROADMAP.md`
- `docs/TEST_STRATEGY.md`
- `docs/GO_NO_GO.md`
- `docs/GITHUB_ISSUES_MVP.md`
- `docs/UNIT_ECONOMICS.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/IMPLEMENTATION_SEQUENCE.md`
- `docs/ASSUMPTION_REGISTER.md`
- `docs/DOMAIN_DNS.md`
- `docs/ADMIN_OPERATIONS.md`
- `docs/ANALYTICS_KPIS.md`

### Design
- `docs/design/KOLI_ONE_VISUAL_AUDIT.md`
- `docs/design/KOLI_PARTS_UX_ARCHITECTURE.md`
- `docs/design/VISUAL_PARITY_MATRIX.md`
- `docs/design/COMPONENT_INVENTORY.md`
- `docs/design/RESPONSIVE_SPEC.md`
- `docs/design/ACCESSIBILITY_SPEC.md`
- `packages/design-system/src/tokens.css`
- `packages/design-system/src/tokens.ts`
- `packages/design-system/src/typography.ts`

### Shared contracts/examples
- `packages/contracts/src/*`
- `examples/ebay/*`
- `examples/procurement/*`
- `examples/web/*`

### Delivery/infra
- `.github/workflows/ci.yml`
- `infra/terraform/*`
- `docker/api.Dockerfile`
- `docker/web.Dockerfile`
- `scripts/bootstrap.ps1`
- `scripts/verify-config.mjs`

### ADRs
- `docs/adr/ADR-001` through `ADR-012`

## Status vocabulary
- **READY**: can be used now as a baseline.
- **VERIFY**: implementation depends on repo/provider inspection.
- **BLOCKED**: external approval/license/legal decision is required.
- **PROPOSED**: architecture choice recommended but not yet ratified.

## First command after copying

```powershell
cd C:\Users\hamda\Desktop\Koli_Parts_Root
node .\scripts\verify-config.mjs
```

Then follow `docs/IMPLEMENTATION_SEQUENCE.md`.
