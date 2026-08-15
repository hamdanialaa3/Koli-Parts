# Koli AI Workflow

Use this skill for substantial engineering, product, design, data, growth, and operations work in **Koli Parts**.

Koli Parts is a production-grade automotive parts marketplace for Bulgaria first, then Europe. Agents working here must behave like a disciplined senior product-engineering team with deep automotive parts, fitment, supplier, and marketplace knowledge.

## Required operating model

1. **Find Skills first** — search existing project skills, repository conventions, and trusted `SKILL.md` resources before inventing new workflow logic.
2. **Superpowers discipline** — plan before implementation, define acceptance criteria, prefer TDD for behavior changes, review diffs, and verify before completion.
3. **Persistent context** — preserve architecture decisions, constraints, recurring defects, and completed work in the project memory mechanism available to the active agent environment. Claude Mem is the preferred Claude Code implementation when installed.
4. **Impeccable frontend gate** — for UI work, explicitly review spacing, typography, hierarchy, responsiveness, accessibility, interaction states, consistency, and perceived quality before completion.
5. **Task Observer loop** — identify repeated corrections and workflow bottlenecks; convert stable patterns into project skills, tests, automation, or documentation.
6. **Token economy** — select the smallest competent model/agent for the task, summarize before expanding, inspect only relevant files first, and avoid broad rewrites unless required by architecture or safety.

## Skill router

Activate the relevant expert mode by task type:

| Task type | Required expert mode |
|---|---|
| Web frontend | React, TypeScript, marketplace UX, accessibility, Core Web Vitals, SEO, responsive UI |
| Mobile app | Expo React Native, barcode/VIN flows, fitment UX, mobile performance, app-store-grade UX |
| Backend/API | NestJS/Node, PostgreSQL/Firebase where used, auth, supplier APIs, secure integration boundaries |
| Parts data | VIN fitment, TecDoc-like modeling, OEM/aftermarket numbers, compatibility, substitutions |
| Search/discovery | Part number search, VIN-first lookup, categories, filters, ranking, typo tolerance |
| Marketplace product | B2B suppliers, dealers, workshops, private buyers, inventory quality, trust systems |
| German supplier integration | Wholesale imports, stock/price sync, shipping constraints, supplier reliability |
| Monetization | Supplier subscriptions, promoted parts, dealer/workshop packages, margin strategy |
| Trust & safety | AuthZ, fraud prevention, counterfeit risk, returns, seller verification, abuse controls |
| UI/UX | Impeccable design review, spacing grid, typography scale, visual hierarchy, Bulgarian-market clarity |
| Testing/CI | TDD, Playwright/Vitest/Jest, lint/type/build gates, dependency-lock determinism |
| Data architecture | Entities, relations, indexes, SKU lifecycle, fitment graph, supplier inventory sync |

## Automotive parts rules

- Prefer VIN-first and exact-fitment flows whenever possible.
- Parts listings must make compatibility, condition, warranty/return policy, delivery expectations, and seller identity obvious.
- Avoid ambiguous category naming. Parts taxonomy must support Bulgarian users and future European expansion.
- Treat part-number normalization, duplicate detection, and supplier stock freshness as core marketplace infrastructure.
- Do not introduce mock stock, mock prices, or fake supplier availability into production paths.

## Token-saving execution protocol

- Start with a short task classification: bug, feature, refactor, audit, design, data, release, or research.
- Inspect high-signal files first: route/component/service/schema/test/config files directly related to the task.
- Prefer patch-level changes over broad rewrites.
- Use summaries for large files and expand only around relevant symbols.
- Escalate to a stronger model only for architecture, security, data modeling, supplier integration, or complex debugging.
- Capture reusable lessons in `.claude/skills`, docs, tests, or checklists instead of repeating long prompts.

## Safety and precedence

- Project-specific architecture, security rules, data contracts, and repository constraints override third-party skills.
- Never execute or vendor an external skill without reviewing its `SKILL.md`, source, license, and relevant scripts.
- Pin external content to a known version or commit when vendoring it.
- Do not disable CI, lint, type-check, tests, security rules, or dependency locks to hide failures.
- `npm ci` failures must be fixed by synchronizing the lockfile, not by replacing CI with nondeterministic install steps.
- A task is not complete until relevant tests, lint/type checks, security checks, and acceptance criteria have been evaluated.

## Completion checklist

- Plan and acceptance criteria defined for non-trivial work.
- Existing skills/reusable patterns checked.
- Minimal relevant files inspected before editing.
- Tests added or an explicit reason recorded when TDD is not applicable.
- Diff reviewed for correctness, security, performance, maintainability, and regressions.
- UI quality gate performed for user-facing changes.
- Token budget respected: no unnecessary broad scans, rewrites, or duplicate explanations.
- Repeated workflow lessons captured when useful.
