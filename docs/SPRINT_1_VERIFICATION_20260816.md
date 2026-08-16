# Sprint 1 Verification — 2026-08-16

## Scope

Branch `chore/sprint-1-hardening-20260815-0302` was rebased onto
`origin/main` after the AI skills commits. This report records the verified
state after the first hardening slice.

## Completed

- Preserved the project-local AI workflow and Impeccable skills from `main`.
- Added root `npm test` and CI test execution through Turbo.
- Replaced the POSIX-only `db:migrate` command with a Node migration runner
  that reads `DATABASE_URL` from `process.env` and invokes `psql` without shell
  variable expansion.
- Hardened API config validation:
  - strict safety booleans accept only `true` or `false`;
  - required database/search values reject empty strings;
  - optional empty strings normalize to `undefined`;
  - production rejects known placeholder secret values.
- Added regression tests for config boolean parsing, optional empty strings,
  and production placeholder rejection.
- Added `.dockerignore` and copied workspace package manifests into API/Web
  Docker dependency stages so local `node_modules`, `.next`, `dist`, `.turbo`,
  and local env files are excluded from image build context.
- Added a GitHub Actions migration gate backed by a PostgreSQL service
  container and `npm run db:migrate`.

## Verification Commands

All commands were run on Windows PowerShell with
`C:\Program Files\nodejs` temporarily prepended to `PATH`.

| Command | Result |
|---|---|
| `npm ci` | PASS — 882 packages installed, 0 vulnerabilities |
| `npm run type-check` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 2 suites, 4 tests |
| `npm run build` | PASS |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run verify:config` | PASS |
| `git diff --check` | PASS |

## Blocked Local Checks

| Check | Status | Reason |
|---|---|---|
| Docker Compose service health | BLOCKED | Docker CLI is not available in the local shell |
| API Docker build | BLOCKED | Docker CLI is not available in the local shell |
| Web Docker build | BLOCKED | Docker CLI is not available in the local shell |
| Disposable DB migration execution | BLOCKED | `psql` and Docker/Postgres are not available locally |

The migration runner failure mode was verified without `DATABASE_URL` and exits
with `DATABASE_URL is required to run migrations.`

## Remaining Sprint 1 Work

- Run Docker Compose health checks for Postgres, Redis, and Meilisearch in an
  environment with Docker available.
- Run `npm run db:migrate` against a disposable PostgreSQL database.
- Build both Dockerfiles with Docker available.
- Confirm the new CI migration gate passes on GitHub Actions.
