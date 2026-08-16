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
- Fixed the Meilisearch healthcheck to use `127.0.0.1`; the image-local
  `wget http://localhost:7700/health` failed while the service was available.
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
| `docker compose config` | PASS |
| `docker compose up -d postgres redis meilisearch` | PASS |
| Docker Compose health checks | PASS — Postgres, Redis, and Meilisearch healthy |
| Disposable PostgreSQL migration via container `psql` | PASS |
| `docker build -f docker/api.Dockerfile -t koli-parts-api:test .` | PASS |
| `docker build -f docker/web.Dockerfile -t koli-parts-web:test .` | PASS |

## Environment Notes

| Check | Status | Reason |
|---|---|---|
| Host `npm ci` | PASS with `C:\Program Files\nodejs` temporarily prepended to `PATH`; package postinstall scripts require `node` on PATH |
| Docker CLI | PASS with `C:\Program Files\Docker\Docker\resources\bin` temporarily prepended to `PATH` |
| Host `npm run db:migrate` | BLOCKED locally because host `psql` is not installed; CI installs `postgresql-client`, and the migration was validated against the Compose Postgres container |

The migration runner failure mode was verified without `DATABASE_URL` and exits
with `DATABASE_URL is required to run migrations.`

## Remaining Sprint 1 Work

- Confirm the new CI migration gate passes on GitHub Actions.
