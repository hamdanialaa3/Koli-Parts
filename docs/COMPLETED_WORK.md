# Completed Work

This ledger preserves completed context outside the active plan. Git and merged
pull requests remain the source of truth.

## Foundation and security

- PR #1 standardized project agent skills.
- PR #2 established config, CI, migration, Docker and verification baselines.
- PR #3 added Koli One Firebase assertion exchange, external identity mapping
  and opaque Koli Parts sessions.
- PR #4 added CSRF and role guards.
- PRs #5-#6 added guarded procurement approval and the admin queue API.

## Vehicle, catalog and search

- PRs #7-#12 completed authenticated Vehicle Garage CRUD.
- PR #13 added the catalog product-detail endpoint.
- PR #14 added initial Postgres catalog search.
- PR #15 added BG/EN/DE identifier normalization.
- PR #16 isolated the catalog search provider contract.
- PR #17 added the initial Bulgarian parts search UI using Koli design tokens.

## Fitment

- PR #18 added the VIN decoder provider contract and unavailable provider.
- PR #19 added the conservative FitmentStatus web component.
- PR #20 added fitment/evidence/evaluation persistence.

## Archived evidence

Sprint reports and imported drafts remain under `DDD/` as historical evidence.
