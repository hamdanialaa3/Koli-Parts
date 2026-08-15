# Koli AI Workflow

Use this skill for substantial engineering work in Koli Parts.

## Required operating model

1. **Find Skills first** — search existing project and trusted external `SKILL.md` resources before creating new workflow logic.
2. **Superpowers discipline** — plan before implementation, define acceptance criteria, prefer TDD for behavior changes, review diffs, and verify before completion.
3. **Persistent context** — preserve architecture decisions, constraints, recurring defects, and completed work in the project memory mechanism available to the active agent environment. Claude Mem is the preferred Claude Code implementation when installed.
4. **Impeccable frontend gate** — for UI work, explicitly review spacing, typography, hierarchy, responsiveness, accessibility, interaction states, consistency, and perceived quality before completion.
5. **Task Observer loop** — identify repeated corrections and workflow bottlenecks; convert stable patterns into project skills, tests, automation, or documentation.

## Safety and precedence

- Project-specific architecture, security rules, and repository constraints override third-party skills.
- Never execute or vendor an external skill without reviewing its `SKILL.md`, source, license, and relevant scripts.
- Pin external content to a known version or commit when vendoring it.
- A task is not complete until relevant tests, lint/type checks, security checks, and acceptance criteria have been evaluated.
