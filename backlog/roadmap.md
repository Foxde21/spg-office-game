# Roadmap

High-level direction. Lists waves and the epics inside them. Stories under `backlog/todo/` reference the relevant epic via `requirements_ref`. Living document — update when scope shifts. The source of truth for *behaviour* is `docs/requirements/`; this file is the source of truth for *order*.

## Vision (current — 2026-04)

Office Quest evolved from a single-track career simulator into a **competency-development platform** with eight career paths, NPC-driven assessments, mini-games, multiplayer, and achievements. **Funded as an educational platform for junior AI specialists.** v2 vision frozen in [`inputs/briefs/2026-04-29-platform-vision.md`](../inputs/briefs/2026-04-29-platform-vision.md). Story 032 (AI-Employee mode) is a planned second game mode where an LLM plays the protagonist; not in any wave yet.

## Delivery phases

The roadmap below is organised by **waves** (game-feature scope). The **phases** below map waves to educational delivery — what's needed for the platform to be usable by each cohort. Phase boundaries are gates: don't skip a phase to chase a wave further down.

| Phase | Goal                                                  | Gate to next phase                                                                                  | Maps to            |
| ----- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------ |
| **P0** | Foundation cleanup (this PR)                          | Single, clean flow live on `dev`. CLAUDE / AGENTS / `.claude/agents` / `.claude/commands` reduced to the 3-role + 4-command set. Onboarding doc shipped. | This branch        |
| **P1** | AI track playable end-to-end                          | A new contributor can pick the AI path, complete an assessment, see Skill Tree progress, hit AI Architect ending. Gaps Q1, Q10 closed. | Wave 1 + Wave 2    |
| **P2** | Cohort-ready                                          | First cohort of junior AI students can self-onboard from `docs/guides/onboarding.md` and ship a real PR. Documentation complete; "good first issues" curated. | This phase         |
| **P3** | First cohort                                          | 5–10 students complete a story end-to-end through the platform. Feedback collected and triaged.       | Cohort run         |
| **P4** | Multi-track                                           | At least 3 of the 8 career paths feature-complete (AI + 2 more).                                    | Wave 3             |
| **P5** | Community / multiplayer                               | Async chat in kitchen + leaderboard live. Identity model (Q13) decided.                              | Wave 4 + Wave 6    |
| **P6** | Mini-games for soft skills                             | Game Room shipped with all three arcade games.                                                      | Wave 5             |
| **P7** | AI-Employee mode                                      | Q12 security ADR accepted; AI-Employee mode behind a feature flag.                                  | Wave 7             |

### What "cohort-ready" (P2) means concretely

P2 is the gate to first real student use. Until P2 is met, the platform is "internal experiment". Concrete criteria:

- [ ] `docs/guides/onboarding.md` rehearsed by at least one external person who isn't on the maintainer team
- [ ] Stories tagged `good-first-issue` (frontmatter or curated list) — at least 5
- [ ] DOR / DOD verbiage reviewed for junior-friendliness
- [ ] At least one walkthrough video or written log of "first contribution" path
- [ ] An ADR per gap that blocks educational use (e.g. AI proxy fallback Q8 — students mustn't see crashes)
- [ ] Decision: do students contribute on `dev` or on a `cohort/<n>` long-running branch? (open call — not in this PR)

## Waves

### Wave 0 — Pre-platform foundation (shipped)

Original v1 MVP. Single-track career simulator before the platform pivot. Counts as "in the world" but predates the assessment / multi-track architecture.

- ✅ Quest system (`backlog/done/001-quest-system.md`)
- ✅ Inventory (`backlog/done/002-inventory-system.md`)
- ✅ Stress / respect meters (`backlog/done/003-stress-respect-system.md`)
- ✅ Multiple locations (`backlog/done/004-multiple-locations.md`)
- ✅ Save / load (`backlog/done/006-save-load-system.md`)

### Wave 1 — Core (assessment foundation, shipped)

The platform's data backbone, the first complete career path (AI), and the surfaces that frame a run.

- ✅ Main menu / pause / game over / victory (`backlog/done/007-main-menu-ui.md`)
- ✅ Generic competency types + AI domain content (`backlog/done/009-competency-matrix-types.md`)
- ✅ AssessmentManager (`backlog/done/010-assessment-manager.md`)
- ✅ AI career path choice via dialogue (`backlog/done/011-ai-career-branch.md`)
- ✅ Assessment dialogues (`backlog/done/012-assessment-dialogues.md`)

### Wave 2 — UI + AI content (in flight)

Make the AI track playable end-to-end with a real UI surface and finale. Ordering matters — the first two unblock the rest.

**Foundation (do first; blocks others):**

- 🟡 Save assessment state (`backlog/todo/014-save-assessment-state.md`) — every other Wave-2 story needs persistence to be testable beyond a single session.
- 🟡 Career Path Registry generalisation (`backlog/todo/019-career-path-registry.md`) — extracts the AI-only plumbing from `AssessmentManager` so 026-028 can land cleanly.

**Parallelisable (after the two above):**

- 🔵 Skill Tree UI (`backlog/todo/013-skill-tree-ui.md`) — blocked by Q10 (Skill Tree vs Skill Insights ADR).
- 🔵 AI Lab location + Профессор Нейронов (`backlog/todo/015-ai-lab-location.md`)
- 🔵 Competency content expansion across all AI domains (`backlog/todo/016-competency-content-expansion.md`)
- 🔵 Assessment NPC roles (`backlog/todo/017-assessment-npc-roles.md`)
- 🔵 AI Architect finale quest (`backlog/todo/018-ai-architect-finale.md`) — blocked by Q1 (top-grade thresholds).

### Wave 3 — Career paths

Bring the other seven paths up to feature parity with the AI track. Hard-blocked by Wave 2's `019-career-path-registry`.

- ◻️ Engineering track (`backlog/todo/026-career-path-engineering.md`)
- ◻️ Product + Design tracks (`backlog/todo/027-career-path-product-design.md`)
- ◻️ Analytics + HR + QA tracks (`backlog/todo/028-career-path-analytics-hr-qa.md`)
- ◻️ Management track — **no story yet**, BA owes a story when this wave starts (mentor: `director`, mirrors patterns from 026-028).

### Wave 4 — Multiplayer

Real-time presence, chat, async meetups.

- ◻️ WebSocket infrastructure (`backlog/todo/020-multiplayer-infrastructure.md`)
- ◻️ Chat system (`backlog/todo/021-chat-system.md`)

### Wave 5 — Game Room (mini-games)

Soft-skill mini-games inside arcade machines.

- ◻️ Mini-Game Framework (`backlog/todo/022-game-room-minigame-framework.md`)
- ◻️ Code Review Challenge (`backlog/todo/023-minigame-code-review.md`)
- ◻️ Architecture Puzzle (`backlog/todo/024-minigame-arch-puzzle.md`)
- ◻️ Sprint Planning Simulator (`backlog/todo/025-minigame-sprint-planning.md`)

### Wave 6 — Social

Achievements, leaderboards, team-vs-team mode. Leaderboard and team assessments hard-depend on Wave 4's WebSocket infra (`020-multiplayer-infrastructure`).

- ◻️ Achievements (`backlog/todo/029-achievements-system.md`) — local; not blocked by Wave 4.
- ◻️ Leaderboard + profiles (`backlog/todo/030-leaderboard-profiles.md`) — server-side ranking; blocked by Wave 4.
- ◻️ Team assessments / duels (`backlog/todo/031-team-assessments.md`) — blocked by Wave 4.

### Wave 7 — AI-Employee mode (deferred)

A second game mode where an LLM plays the protagonist.

- ◻️ AI-Employee mechanic (`backlog/todo/032-AI-employee-mechanic.md`) — large scope; do not start without breaking down further

### Long-running (legacy, predate the new flow)

- 🔵 More NPCs and dialogues (`backlog/in-progress/005-more-npcs-dialogues.md`) — partial: 3 of 8 NPCs placed in the world. Should split: "place the missing 5 NPCs" → small new `OQ-XXX` story; the rest stays here as long-running.
- 🔵 Character animations (`backlog/in-progress/008-character-animations.md`) — partial: walking + idle for player and 2 NPCs. Missing: interaction animation, and idle animations for the other 6 NPCs. Needs a real animations requirement (currently no `requirements/<NN>-animations.md`).

## Suggested next-up (immediate work after this PR merges)

1. **Open ADRs for Q8 (AI proxy fallback) and Q10 (Skill Tree vs Skill Insights).** Both are P1 blockers for Wave 2 stories. ADRs = `/adr` workflow; small effort, big unblock.
2. **Q1 design call: top-grade thresholds for the AI track.** Until this lands, `018-ai-architect-finale` stays in todo. Could be done as a tiny doc-only story (`OQ-033`) that fills `docs/requirements/01-core-loop.md#promotion-per-path` and `11-career-paths.md` rows for AI.
3. **Migrate `014-save-assessment-state` to the new flow.** First foundation story for Wave 2, and a clean candidate to demonstrate `/start-story` end-to-end as the cohort-readiness rehearsal (P2 gate).

## Epics → requirements

| Epic         | Requirement                                                                       | Stories                                 |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------- |
| `core-loop`  | [01-core-loop.md](../docs/requirements/01-core-loop.md)                           | (cross-cutting; no dedicated story)     |
| `meters`     | [02-stress-respect.md](../docs/requirements/02-stress-respect.md)                 | 003                                     |
| `quests`     | [03-quests.md](../docs/requirements/03-quests.md)                                 | 001                                     |
| `dialogues`  | [04-dialogues.md](../docs/requirements/04-dialogues.md)                           | 005, 011, 012                           |
| `inventory`  | [05-inventory.md](../docs/requirements/05-inventory.md)                           | 002                                     |
| `npcs`       | [06-npcs.md](../docs/requirements/06-npcs.md)                                     | 005, 008¹, 015, 017                     |
| `locations`  | [07-locations.md](../docs/requirements/07-locations.md)                           | 004, 015, 022                           |
| `save`       | [08-save-load.md](../docs/requirements/08-save-load.md)                           | 006, 014                                |
| `ui`         | [09-ui-menus.md](../docs/requirements/09-ui-menus.md)                             | 007, 013, 029, 030                      |
| `assessment` | [10-assessments.md](../docs/requirements/10-assessments.md)                       | 009, 010, 012, 014, 016, 017, 018       |
| `career`     | [11-career-paths.md](../docs/requirements/11-career-paths.md)                     | 011, 019, 026, 027, 028                 |
| `minigames`  | [12-minigames.md](../docs/requirements/12-minigames.md)                           | 022, 023, 024, 025                      |
| `multi`      | [13-multiplayer.md](../docs/requirements/13-multiplayer.md)                       | 020, 021, 030, 031                      |
| `achieve`    | [14-achievements.md](../docs/requirements/14-achievements.md)                     | 029                                     |
| `ai-mode`    | [15-ai-employee-mode.md](../docs/requirements/15-ai-employee-mode.md)             | 032                                     |

¹ Story 008 (character animations) doesn't cleanly fit `npcs` — animations cross-cut player and NPC. There's no dedicated animations module yet; revisit during P2 if it stays scope-relevant. May warrant a small `16-animations.md` requirement file.

## Dependencies that block planning

- **Q1** (top-grade thresholds per path) blocks finale stories (018, 026-028).
- **Q5** (difficulty surface) blocks the settings UI work (currently no story).
- **Q6** (localisation scope) blocks any work on copy infrastructure.
- **Q8** (AI proxy fallback) blocks any AI-dependent dialogue rework.
- **Q10** (Skill Insights ↔ Skill Tree distinction) blocks 013.

See [`docs/requirements/00-index.md`](../docs/requirements/00-index.md) "Gaps & contradictions" for the full open question list.

## Change log

- 2026-04-29 — verified roadmap against backlog: added Wave 0 (pre-platform foundation 001-006), added ordering hints to Wave 2 (014 + 019 are blockers), called out blocking gaps inline (Q1, Q10, Q12), added "Suggested next-up" pointer for the work after this PR merges, fixed epic mapping (030 moved `achieve`→`multi`, 022 added to `locations`, 014 added to `assessment`), noted Management track as no-story-yet, footnoted 008 as not fitting `npcs` cleanly.
- 2026-04-29 — added 8 educational delivery phases (P0–P7) layered over the waves; tied to the funded mission as an educational platform for junior AI specialists.
- 2026-04-29 — roadmap reorganised into 7 waves around v2 platform vision; legacy stories noted as long-running.
