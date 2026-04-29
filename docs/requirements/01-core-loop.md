# 01 — Core loop, career paths, endings

Source: `inputs/briefs/2026-04-29-platform-vision.md` (canonical v2) and `docs/game-design.md` v2 § "Концепция", "Сюжет", "Карьерные пути", "Концовки", "Достижения".

## Goal

Player joins an IT company as a newcomer, picks a **career path** through dialogue with NPCs, then climbs four grades within that path by completing quests, talking to NPCs, and passing assessments — without burning out (`stress = 100`) or being laid off (`respect` low at the layoff event). Target run length: 2–4 hours; strong replayability across paths.

## Career paths

Eight parallel paths (see [11-career-paths.md](11-career-paths.md) for the plugin architecture and full mentor mapping):

| Path        | Grades (Junior → Top)                                    | Mentor NPC                  |
| ----------- | -------------------------------------------------------- | --------------------------- |
| AI / ML     | AI Junior → Middle → Senior → AI Architect               | Петя Сеньор + Профессор Нейронов |
| Engineering | Junior Dev → Middle → Senior → Solution Architect        | Тим Лид                     |
| Product     | Junior PM → PM → Senior PM → CPO                         | Ольга Продакт               |
| Design      | Junior Designer → Designer → Senior Designer → Design Lead | Лёша Дизайнер             |
| QA          | Junior QA → QA → Senior QA → QA Architect                | Маша QA                     |
| Analytics   | Junior Analyst → Analyst → Senior Analyst → Head of Analytics | Игорь Аналитик          |
| HR / People | HR Junior → HR BP → Senior HR BP → CHRO                  | Анна HR                     |
| Management  | Team Lead → Eng Manager → Director → VP / CTO            | Директор                    |

### Choice flow (current behaviour)

- At `respect ≥ 20` and `flags.careerPathChosen === false`, scripted NPCs may use a `career-choice-*` dialogue as the start dialogue (see [04-dialogues.md](04-dialogues.md#start-dialogue-resolution)).
- Choice persists as `PlayerData.careerPath` (e.g. `'ai'`) and `flags.careerPathChosen = true`.
- After the choice, NPCs may have a `career-react-<pathId>` dialogue that fires the next time the player talks to them (e.g. `career-react-ai`).
- Q11 (`00-index.md`): is the choice terminal, or can a player switch path?

## Promotion (per path)

A grade-up runs when the AssessmentManager (see [10-assessments.md](10-assessments.md)) detects:

1. **Average score** across the path's domains ≥ the level's `minAvgScore` threshold; AND
2. **Per-domain score** ≥ the level's `minPerDomain` floor; AND
3. **Stress < 70** at the moment of promotion check.

Q1 (`00-index.md`): exact thresholds per level / path are TBD; `AI_CAREER_PATH` is the only one with concrete numbers today.

## Story arcs (path-agnostic frame)

Three acts framing the path-specific content.

### Act 1 — Newcomer (Junior grade)

- Conflicts: incomprehensible tasks, legacy code, deadlines, imposter syndrome.
- Key events: first code review (`stress +20`), first prod bug (`stress +30`), helping a colleague (`respect +10`).
- **Path choice** triggers in this act (`respect ≥ 20`).

### Act 2 — Specialist (Middle grade)

- Conflicts: mentoring, speed-vs-quality, company politics, burnout.
- Key events: first NPC assessment, conflict with PM (player picks side; flag affects Act 3), AI Lab / Game Room unlock.

### Act 3 — Lead / Architect (Senior → Top grade)

- Conflicts: responsibility, layoffs, choice between team and career, **final comprehensive assessment** for the path's top grade.

## Endings

| Ending             | Condition                                                                  |
| ------------------ | -------------------------------------------------------------------------- |
| **Top grade**      | Reached the path's max grade (e.g. AI Architect, Solution Architect, CPO)  |
| **Senior forever** | Reached Senior in the path but not the top grade                           |
| **Burnout (fired)** | `stress = 100` at any point — immediate game over                          |
| **Layoff**         | Layoff event triggers (Act 3) AND `respect < 50`                           |

See Q9 for stress > 100 semantics.

## Difficulty

Selectable at game start. Q5 (`00-index.md`): per-save vs global, and how it composes with **assessment adaptive difficulty** (see [10-assessments.md](10-assessments.md#adaptive-difficulty)).

| Mode   | Stress growth | Respect gain | Bug rate | Assessment difficulty offset |
| ------ | ------------- | ------------ | -------- | ---------------------------- |
| Easy   | 0.7×          | 1.3×         | 0.7×     | -1                           |
| Normal | 1.0×          | 1.0×         | 1.0×     | 0                            |
| Hard   | 1.4×          | 0.7×         | 1.5×     | +1                           |

## Achievements

Detailed list in [14-achievements.md](14-achievements.md). Highlights:

- **First commit** — finish the first quest.
- **Path chosen** — pick any career path.
- **Top grade** — reach a path's max grade (one per path).
- **Polyglot** — finish two paths in different runs.
- **Iron nerves** — finish the game with `stress < 50` always.
- **Loved by all** — `respect = 100` with every NPC.

## Acceptance criteria (cross-cutting)

- AC-1 — `PlayerData.careerPath` is set exactly once in a run unless Q11 says otherwise.
- AC-2 — Career grade is one of the path's `levels` ids and changes only via a promotion event from AssessmentManager.
- AC-3 — Promotion event emits `careerLevelUp` with `{ path, level }`.
- AC-4 — Reaching the path's top level + Act 3 finale unlocks the corresponding `Top grade` ending.
- AC-5 — `stress = 100` triggers a `gameOver` event with `reason: 'burnout'`, regardless of act or path.
- AC-6 — Difficulty modifier multiplies all stress / respect deltas before they hit `GameStateManager`.

## Open questions

- Q1, Q5, Q11 in [00-index.md](00-index.md).
