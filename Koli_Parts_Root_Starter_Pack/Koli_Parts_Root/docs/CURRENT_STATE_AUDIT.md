# Current State Audit

## Evidence inspected

The supplied root contains `package.json`, `package-lock.json`, `turbo.json`, `.env.example`, `.gitignore`, and `START_MEIN_PLAN_1.0.md`.

### Repository baseline

| Area | Finding | Status |
|---|---|---|
| Monorepo | npm workspaces `apps/*`, `packages/*` | READY |
| Task runner | Turbo 2.x | READY |
| Runtime | Node >=20 | READY |
| API | lockfile includes NestJS 11 app | VERIFY source tree locally |
| Web | lockfile includes Next.js 16.2.12 / React 19.2.4 app | VERIFY source tree locally |
| DB command | root expects `db/migrations/001_initial_schema.sql` | MISSING in supplied files |
| Redis | env placeholders exist | READY for local compose |
| eBay env | absent | MISSING |
| Stripe | test placeholders exist | PARTIAL |
| Econt | demo values exist in old env | REVIEW/ROTATE if real credentials |
| Search | SPEC mentions Meilisearch/OpenSearch; no supplied implementation evidence | VERIFY |
| TecDoc/VIN | planned only in supplied material | BLOCKED by provider selection/license |

## Contradictions

### 1. Business model wording
Root `package.json` describes “B2B wholesale from Germany”, while the plan describes eBay DE dropshipping. Recommendation: adopt a hybrid `SupplierAdapter` architecture and let business choose supplier channels without rewriting the core.

### 2. eBay automated purchasing assumption
The old plan includes an internal endpoint named as if it can execute an eBay purchase. Current eBay documentation does not justify that assumption for DE→BG. Order API is Limited Release and current Buy checkout rules require domestic delivery within the marketplace country.

### 3. Visual-system drift inside Koli One
Koli One's generated theme tokens and legacy design-system constants do not perfectly match. New Koli Parts work must use semantic generated theme variables and document migrations rather than mix both token generations.

### 4. Environment file scope
The old `.env.example` has no eBay configuration and includes supplier placeholders centered on B2B wholesalers. This pack supplies a provider-neutral and eBay-aware version.

## Immediate audit commands for the local machine

```powershell
cd C:\Users\hamda\Desktop\Koli_Parts_Root
Get-ChildItem -Recurse -Depth 3 | Select-Object FullName
npm run type-check
npm run lint
npm run build
```

Do not delete or restructure working `apps/api` or `apps/web` until their actual source is reviewed.
