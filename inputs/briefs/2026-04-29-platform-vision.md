# Office Quest — platform vision (v2)

> Frozen snapshot of the v2 vision after the pivot from "single-track career simulator" to "competency development platform". Do not edit; if the concept evolves further, add a new dated brief.

**Date:** 2026-04-29
**Source:** Iterative redesign captured in `docs/game-design.md` v2 and the architecture redesign in `docs/architecture.md` v2. Predecessor: [`2026-04-21-concept.md`](./2026-04-21-concept.md).

## What changed from v1

| | v1 (2026-04-21) | v2 (2026-04-29) |
| --- | --- | --- |
| Genre | Single-track career simulator | Career simulator + competency development platform |
| Career arc | Junior → Middle → Senior → Lead (one path) | 8 parallel career paths × 4 grades, plugin-architected |
| Progression | Quest-driven counts + respect | NPC-driven assessments with adaptive difficulty + skill matrix |
| Endings | 4 fixed (Lead / Senior-forever / burnout / layoff) | Per-path "top grade" finale (e.g. AI Architect, Solution Architect, CPO) + burnout / layoff |
| Locations | 4 (Open Space, Kitchen, Meeting, CEO Office) | 6 (+ AI Lab, Game Room) |
| NPCs | 8 personalities (mostly flavour) | 8 NPCs with explicit assessor roles + 1 path-specific (Профессор Нейронов) |
| Multiplayer | Out of scope | Chat in kitchen, presence, duels (1v1), team assessments, leaderboard |
| Mini-games | Out of scope | Code Review, Architecture Puzzle, Sprint Planning |
| Achievements | 6 thematic | 30+, prog-bar, popup |
| Target audience | "IT professionals" | "All office workers" — devs + analysts + HR + product + design + QA |
| AI usage | NPC AI dialogue (flavour) | AI dialogue + planned AI-Employee mode (LLM plays the protagonist; story 032) |

## Why pivot

- Skill matrix exports (`docs/spg-skill-matrix/`) gave us a real data source for competencies. Linking those to a game loop unlocks a learning-tool framing, not just an entertainment game.
- Single career arc was thin: ~2-4 hours, low replay. Eight paths plus assessments is replayable and learning-positive.
- Mini-games and multiplayer make the platform sticky in a corporate / community setting.

## Constraints carried over

- v1 stack stands: Phaser 3 + TypeScript + Vite + Express. Adds Socket.IO (planned) for multiplayer, OpenRouter for LLM.
- All LLM calls go through `server/`. Browser never holds the API key.
- Russian first; localisation deferred (Q6).

## Out of scope (v2)

- Monetisation.
- Native mobile.
- AI-Employee mode in v2.0 — it's a Wave 7 (deferred) addition with significant security review needed (player-supplied API keys).
- VR / 3D modes.

## Open questions at brief time

These migrated into `docs/requirements/00-index.md` "Gaps & contradictions":

- Q1 — exact "top grade" thresholds per career path.
- Q2 — relationship score vs global respect (is per-NPC `relationship` distinct, multiplicative, or replaced by Skill Insights?).
- Q3 — daily quest cadence (real-time minutes or in-game day?).
- Q5 — difficulty: per save vs global, and how it interacts with assessment adaptive difficulty.
- Q6 — localisation scope.
- Q8 — AI proxy fallback when unreachable.
- Q10 — Skill Tree (UI surface) vs Skill Insights (manager / data) — overlapping concerns; needs an ADR.
- Q11 — career-path uniqueness: can a player switch path mid-game, or is the choice terminal?
- Q12 — AI-Employee mode (story 032) — security model for player-supplied LLM keys; defer to a dedicated ADR.
