---
id: OQ-XXX
title: <short imperative title>
epic: <gameplay | ui | audio | ai | core | save | docs>
type: <feature | bug | chore | refactor | spike | docs>
estimate: <1 | 2 | 3 | 5 | 8 | 13>
status: todo
created: YYYY-MM-DD
owner: <name or unassigned>
depends_on: []
blocks: []
requirements_ref:
  - docs/requirements/<NN>-<module>.md#<anchor>
source_ref:
  - inputs/briefs/<file>.md (section)
api_ref:
  - docs/api.md#<anchor>
---

# OQ-XXX — <title>

## User story

As a **<role: player | developer | designer>**,
I want **<capability>**,
so that **<outcome>**.

## Scope

**In:**
-

**Out:**
-

## Acceptance criteria

Phrased as observable behaviour. Each criterion maps to at least one test.

- [ ] AC-1 — ...
- [ ] AC-2 — ...
- [ ] AC-3 — ...

### Non-happy paths

- [ ] ...

## Design notes

<!-- Mockup paths, sequence sketches, relevant ADR links. Keep it minimal; point at the canonical doc rather than duplicating. -->

## API impact

<!-- If this touches the AI proxy or save format, describe it here and update docs/api.md. -->

## Data / save model impact

<!-- New entities in GameState, new fields in the save schema, migration notes. -->

## Test strategy

- **Unit (Vitest):** ...
- **E2E (Playwright):** ...

## Open questions

- [ ] ...

## DOR

Gate: [backlog/dor.md](./dor.md). Tick here when met — the story cannot move to `in-progress/` otherwise.

- [ ] User story in canonical form
- [ ] Acceptance criteria testable
- [ ] Scope explicit
- [ ] `requirements_ref` points at the relevant `docs/requirements/<NN>-*.md` section
- [ ] `source_ref` (mockup / brief in `inputs/`) linked when applicable
- [ ] Dependencies resolved or mocked
- [ ] Estimate set
- [ ] Test strategy drafted

## DOD

Gate: [backlog/dod.md](./dod.md). Tick in the PR, not here.

## Changelog

<!-- Append-only log of material scope changes while the story is in progress. Small clarifications can go silently. -->

- YYYY-MM-DD — created.
