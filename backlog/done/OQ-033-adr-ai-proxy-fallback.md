---
id: OQ-033
title: ADR-0001 — AI proxy fallback policy (resolves Q8)
epic: ai
type: docs
estimate: 2
status: done
created: 2026-04-29
owner: unassigned
depends_on: []
blocks:
  - 005-more-npcs-dialogues
  - 016-competency-content-expansion
  - 017-assessment-npc-roles
  - 018-ai-architect-finale
requirements_ref:
  - docs/requirements/04-dialogues.md#ai-driven-dialogue
source_ref:
  - docs/requirements/00-index.md (Q8)
api_ref:
  - docs/api.md (AI proxy contract)
---

# OQ-033 — ADR-0001 — AI proxy fallback policy (resolves Q8)

## User story

As a **developer working on AI-driven dialogue or assessments**,
I want **a documented, agreed-upon policy for what the game does when the AI proxy is unreachable or returns an error**,
so that **I can implement consistently across all callers and stop blocking on Q8 when authoring new AI content**.

## Scope

**In:**
- New ADR `docs/architecture/ADR-0001-ai-proxy-fallback.md` with `Status: Accepted`.
- Update `docs/architecture/README.md` index to list ADR-0001.
- Update `docs/requirements/04-dialogues.md` AC-5 to reference the ADR (replacing the Q8 placeholder).
- Update `docs/requirements/00-index.md` "Gaps & contradictions" — mark Q8 as `Resolved by ADR-0001` with a link.

**Out:**
- Implementation. This story produces only the documented decision; the actual fallback wiring is implemented in the stories that depend on it (005, 016, 017, 018).
- Changes to `docs/api.md` — the proxy contract itself doesn't change; only the *consumer* behaviour does.

## Acceptance criteria

- [x] AC-1 — `docs/architecture/ADR-0001-ai-proxy-fallback.md` exists with all template sections filled (Context, Decision, Consequences, Alternatives, References) and `Status: Accepted`.
- [x] AC-2 — `docs/architecture/README.md` index includes a row for ADR-0001 with a link.
- [x] AC-3 — `docs/requirements/04-dialogues.md` AC-5 reads "AI proxy failure follows ADR-0001" instead of "per Q8 outcome", with a link to the ADR.
- [x] AC-4 — `docs/requirements/00-index.md` Q8 row reads "Resolved by ADR-0001" (struck through, status `Closed`), with a change-log entry.

### Non-happy paths

- [ ] If review uncovers a case the ADR does not cover (e.g. AI returns malformed JSON repeatedly), it is added to the ADR's "Consequences / follow-ups" rather than left silent.

## Design notes

Decision proposed (subject to your approval before this story leaves DOR):

**Three-layer fallback for any LLM call going through `server/`:**

1. **Retry transparently** up to 2 times with exponential backoff (250 ms, 1 s) on transient errors (network timeout, 5xx, rate-limit 429).
2. **If still failing**, the consumer (e.g. `AIDialogue` manager) returns a **scripted fallback line** — a per-NPC short string ("Что-то отвлёкся, давай позже") loaded from `npcPrompts.ts`. The scripted fallback is structurally a normal `DialogueLine` so the UI doesn't branch.
3. **Surface visibility** via Toast: `variant: 'warning'`, text "AI временно недоступен — продолжаем без него." Once per session, not per call (to avoid spam).

**For assessments specifically:** if the proxy fails before a session starts, the session is refused with the same scripted-fallback line and no Toast spam (assessments are gated by an explicit user action, so the failure is already visible). If it fails mid-session, the current question's pre-loaded text is used (no AI call needed mid-flow today).

**Logging:** server logs the failure with status code; client logs via the existing logger only at WARN level. No PII in logs.

This shape gives us:
- No crashes (graceful)
- Visible recovery for the player (Toast)
- Educational property: a junior reading the code sees retry logic and knows what to copy

## API impact

None — the proxy *contract* (`POST /api/ai/chat` → `{ reply: string }`) is unchanged. Only consumer behaviour on failure is normalised.

## Data / save model impact

None.

## Test strategy

- **Unit (Vitest):** none (this is a doc-only story). Implementation tests come with each consumer story (005, 016, 017, 018).
- **E2E (Playwright):** none for this story.

## Open questions

- [ ] Confirm the 250 ms / 1 s backoff numbers — reasonable default, but if the project has a different convention I'll use that.
- [ ] Confirm Toast message copy in Russian — current proposal is "AI временно недоступен — продолжаем без него.".

## DOR

Gate: [backlog/dor.md](../dor.md). Tick here when met — the story cannot move to `in-progress/` otherwise.

- [x] User story in canonical form
- [x] Acceptance criteria testable
- [x] Scope explicit
- [x] `requirements_ref` points at the relevant `docs/requirements/<NN>-*.md` section
- [x] `source_ref` linked (the gap entry that this story resolves)
- [x] Dependencies resolved or mocked (no upstream blockers)
- [x] Estimate set (2 SP — small doc story)
- [x] Test strategy drafted (n/a; doc-only)

## DOD

Gate: [backlog/dod.md](../dod.md). Tick in the PR, not here.

## Changelog

- 2026-04-29 — created via `/new-story`. DOR green; awaiting user confirmation on the proposed fallback policy (see Design notes) before `/start-story`.
- 2026-04-29 — design confirmed by Fox; started on branch `docs/OQ-033-adr-ai-proxy-fallback` (off dev).
- 2026-04-29 — ADR-0001 written; Q8 closed; AC-1..4 ticked. Doc-only story, no code/tests/build.
- 2026-04-29 — completed; PR pending.
