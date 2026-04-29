# Requirements — index

Decomposed game design for Office Quest **v2 platform vision** (eight career paths, NPC-driven assessments, mini-games, multiplayer, achievements). One file per module. Source of truth for behaviour the team commits to ship; design rationale and stakeholder framing live in `inputs/briefs/`.

> Stories under `backlog/` reference these files via `requirements_ref` (e.g. `docs/requirements/10-assessments.md#session-flow`). When the spec changes, update the requirement file *first*, then update or open stories.

## Modules

| #  | File                                                  | Scope                                                       | Status      |
| -- | ----------------------------------------------------- | ----------------------------------------------------------- | ----------- |
| 01 | [01-core-loop.md](01-core-loop.md)                    | Story arcs, career paths, top grades, endings, achievements | Draft v2    |
| 02 | [02-stress-respect.md](02-stress-respect.md)          | Stress and respect meters, formulas, effects                | Draft v2    |
| 03 | [03-quests.md](03-quests.md)                          | Quest types (main / side / assessment / final), lifecycle   | Draft v2    |
| 04 | [04-dialogues.md](04-dialogues.md)                    | Dialogue tree, choices, conditions, effects, dialogue actions | Draft v2  |
| 05 | [05-inventory.md](05-inventory.md)                    | Items, types, capacity, usage                               | Draft v1.1  |
| 06 | [06-npcs.md](06-npcs.md)                              | NPC roster, assessor roles, personalities, relationships    | Draft v2    |
| 07 | [07-locations.md](07-locations.md)                    | 6 locations (incl. AI Lab, Game Room), conditional doors    | Draft v2    |
| 08 | [08-save-load.md](08-save-load.md)                    | Save format, slots, versioning, careerPath, assessment progress | Draft v2 |
| 09 | [09-ui-menus.md](09-ui-menus.md)                      | Main menu, HUD, Skill Tree, Leaderboard, Toast, Chat        | Draft v2 — partial |
| 10 | [10-assessments.md](10-assessments.md)                | AssessmentManager, sessions, domains, adaptive difficulty   | Draft v2 — NEW |
| 11 | [11-career-paths.md](11-career-paths.md)              | Plugin architecture, 8 paths, choice flow, top grades       | Draft v2 — NEW |
| 12 | [12-minigames.md](12-minigames.md)                    | Game Room, Code Review / Architecture Puzzle / Sprint Planning | Draft v2 — NEW |
| 13 | [13-multiplayer.md](13-multiplayer.md)                | Presence, chat, duels, team assessments, leaderboard        | Draft v2 — NEW |
| 14 | [14-achievements.md](14-achievements.md)              | 30+ achievements, progression bars, popups                  | Draft v2 — NEW |
| 15 | [15-ai-employee-mode.md](15-ai-employee-mode.md)      | Second mode where an LLM plays the protagonist (Wave 7)     | Draft v2 — NEW |
| 90 | [90-glossary.md](90-glossary.md)                      | Game terms, units, abbreviations                            | Living      |
| 91 | [91-personas.md](91-personas.md)                      | Target player personas (broader v2 audience)                | Draft v2    |

## Source briefs

- v1 frozen: [`inputs/briefs/2026-04-21-concept.md`](../../inputs/briefs/2026-04-21-concept.md)
- v2 (current): [`inputs/briefs/2026-04-29-platform-vision.md`](../../inputs/briefs/2026-04-29-platform-vision.md)

## Skill matrices

The BA owns five role skill exports under [`docs/spg-skill-matrix/`](../spg-skill-matrix/) — `ba_skills_export.md`, `design_skills_export.md`, `product_skills_export.md`, `qa_skills_export.md`, `software_dev_skills_export.md`. These are the source for `src/data/skillMatrices/` runtime data and feed [`10-assessments.md`](10-assessments.md) and the SkillInsights manager.

## Roles in the world

NPC roles drive quest sources, dialogue, and now also assessments. See [06-npcs.md](06-npcs.md) for the full roster and assessor mapping. Player roles map to career grades within a chosen path (e.g. AI Junior → AI Architect). See [11-career-paths.md](11-career-paths.md).

## Gaps & contradictions

Track here. Each row is a P-rated open question that must be resolved before a story that depends on it leaves DOR.

| #   | Question                                                                                     | P  | Affects        | Owner | Status |
| --- | -------------------------------------------------------------------------------------------- | -- | -------------- | ----- | ------ |
| Q1  | Exact "top grade" thresholds per career path (avg score per domain + min per domain)         | P1 | 01, 10, 11     | TBD   | Open   |
| Q2  | Per-NPC `relationship` vs global `respect` vs `SkillInsights` — overlap or distinct?         | P1 | 02, 06, 09, 10 | TBD   | Open   |
| Q3  | Daily quest cadence — real-time minutes or in-game day?                                      | P2 | 03             | TBD   | Open   |
| Q4  | Save schema migration policy when adding fields mid-development                              | P2 | 08             | TBD   | Open   |
| Q5  | Difficulty selectable per save or global; how it composes with assessment adaptive difficulty | P2 | 01, 09, 10    | TBD   | Open   |
| Q6  | Localisation scope for v1 — RU only, or RU + EN?                                             | P2 | 09             | TBD   | Open   |
| Q7  | Achievement persistence: per save, per device, or both                                       | P3 | 08, 14         | TBD   | Open   |
| ~~Q8~~  | ~~AI dialogue fallback when proxy is unreachable~~ — **Resolved by [ADR-0001](../architecture/ADR-0001-ai-proxy-fallback.md)** | P1 | 04             | Fox   | Closed |
| Q9  | Stress overflow over 100 — clamp or treat as game-over trigger only at exactly 100?          | P2 | 02             | TBD   | Open   |
| Q10 | Skill Tree (UI surface) vs Skill Insights (data manager) — overlap, naming, ADR needed       | P1 | 09, 10         | TBD   | Open   |
| Q11 | Career path choice — terminal, or can a player switch mid-game (and what happens to progress)? | P1 | 11, 08      | TBD   | Open   |
| Q12 | AI-Employee mode security — player-supplied LLM keys, sandboxing, abuse model                 | P0 if shipped | 15 | TBD   | Open   |
| Q13 | Multiplayer authentication / identity model (anonymous nicknames? account?)                   | P1 if shipped | 13 | TBD   | Open   |
| Q14 | Mini-game scoring — does it feed Skill Insights, only stress/respect, or both?                | P2 | 12, 10         | TBD   | Open   |

P0 = blocks gameplay; P1 = blocks the story that depends on it; P2 = answer before the related epic; P3 = nice to have.

## Change log

- 2026-04-29 — Q8 resolved by ADR-0001 (AI proxy fallback policy). Story `OQ-033`.
- 2026-04-29 — v2 decomposition. Added modules 10-15 (assessments, career paths, mini-games, multiplayer, achievements, AI-employee). Updated 01, 06, 07, 08, 09 for v2 vision. Refreshed gaps table.
- 2026-04-29 — initial decomposition from `docs/game-design.md` v1.
