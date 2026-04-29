---
id: OQ-035
title: Team-readiness final pass — Codex starter prompt + docs accuracy
epic: docs
type: docs
estimate: 3
status: in-progress
created: 2026-04-29
owner: unassigned
depends_on: []
blocks: []
requirements_ref:
  - docs/guides/onboarding.md
source_ref: []
api_ref: []
---

# OQ-035 — Team-readiness final pass — Codex starter prompt + docs accuracy

## User story

As a **maintainer about to invite the team to walk the new flow**,
I want **(a) a single copy-pasteable starter prompt for Codex CLI users in the repo and (b) every public-facing doc to reflect the current state of the project**,
so that **the team's first encounter with the repo is consistent and trustworthy, and a junior reading the docs cold doesn't trip over stale information**.

## Scope

**In:**
- New `docs/guides/codex-starter-prompt.md` — instructions for Codex users on how to start a session, plus the actual starter prompt content in a copy-pasteable code block (Russian, since the team works in Russian).
- Link to it from `docs/guides/onboarding.md` and `docs/README.md` so it's discoverable.
- `README.md`: replace the stale "Текущий статус" MVP checklist (says shipped features are unshipped) with a link to `backlog/roadmap.md`.
- `docs/contributing.md`: replace the outdated "Workflow разработки" section (predates the new flow — references `feature/001-quest-system`, no DOR/DOD/atomic commits) with a pointer to the canonical sources (`backlog/README.md`, `AGENTS.md`, `docs/guides/onboarding.md`). Replace `<repo-url>` placeholder with the real URL.
- `docs/architecture.md`: update the "Бэклог задач (009-031)" comment in the project structure tree to reflect current scope (`001-008` legacy + `009-034` numeric + `OQ-XXX` new).

**Out:**
- Rewriting the rest of `docs/contributing.md` (the style guide section is fine).
- Translating the Codex prompt to English — Russian-first; English deferred until localisation Q6 lands.
- Adding a Claude-specific starter prompt — Claude Code reads `CLAUDE.md` automatically, no separate prompt needed.

## Acceptance criteria

- [ ] AC-1 — `docs/guides/codex-starter-prompt.md` exists with: (a) usage instructions for the team member; (b) a Russian-language prompt body in a single fenced code block, ready to copy and paste as the first message in a fresh Codex CLI session; (c) a fallback for users who prefer not to install `.codex/prompts/`.
- [ ] AC-2 — `docs/guides/onboarding.md` and `docs/README.md` link to the new starter prompt file from a section visible to a Codex user (e.g. "Для новичков" / Codex Cloud / etc.).
- [ ] AC-3 — `README.md` "Текущий статус" section either removed or replaced with a one-line pointer to `backlog/roadmap.md` — no checkboxes that contradict shipped state.
- [ ] AC-4 — `docs/contributing.md` "Workflow разработки" section replaced with a short paragraph + bullet list of the canonical sources (`backlog/README.md`, `AGENTS.md`, `docs/guides/onboarding.md`). The legacy step-by-step is removed. The `<repo-url>` placeholder in the install snippet is replaced with `https://github.com/Foxde21/spg-office-game.git`.
- [ ] AC-5 — `docs/architecture.md` "Бэклог задач (009-031)" updated to reflect current numbering (legacy 001-008 + 009-034, plus OQ-prefix for new stories under the new flow).

### Non-happy paths

- [ ] If `docs/guides/onboarding.md` already references "first 30 minutes" content that overlaps with the starter prompt, both stay (different audiences — onboarding.md is for human reading, starter-prompt.md is the Codex agent's first message). They cross-link.

## Design notes

The starter prompt is in Russian because the team is Russian-speaking and the prompt is conversational. The repo-internal docs stay in English/mixed (matching the rest of the project's doc style — English structure with Russian content references).

The prompt's core instructions:

1. Read `AGENTS.md` (orientation), `docs/guides/onboarding.md` (junior walkthrough), `docs/requirements/00-index.md` (open questions).
2. Install slash-command prompts (or use manual checklist).
3. Three working principles: source of truth in `docs/requirements/`, three roles, 3-tier branching, atomic commits.
4. Ask: "what would you like to work on?"

## API impact

None.

## Data / save model impact

None.

## Test strategy

- **Unit / E2E:** none — doc-only.
- **Manual verification:** the maintainer pastes the Codex starter prompt into a fresh Codex CLI session on a clean clone and confirms the agent reads the right files and asks a sensible first question.

## Open questions

- [ ] Should we also add an English starter prompt later, when localisation lands? Logged here, not auto-converted to a story.

## DOR

Gate: [backlog/dor.md](../dor.md). Tick here when met — the story cannot move to `in-progress/` otherwise.

- [x] User story in canonical form
- [x] Acceptance criteria testable
- [x] Scope explicit
- [x] `requirements_ref` points at `docs/guides/onboarding.md` (the closest "spec" — onboarding flow)
- [x] `source_ref` linked — n/a (no specific brief; this is direct request from maintainer)
- [x] Dependencies resolved or mocked
- [x] Estimate set (3 SP — small bundled doc story across 5 files)
- [x] Test strategy drafted (manual verification)

## DOD

Gate: [backlog/dod.md](../dod.md). Tick in the PR, not here.

## Changelog

- 2026-04-29 — created. DOR green; bundles Codex starter prompt + four small doc accuracy fixes for the team-readiness P2 gate.
- 2026-04-29 — started on branch `docs/OQ-035-team-readiness` (off dev).
