# 02 — Stress and respect

Source: `docs/game-design.md` v2 § "Стресс", "Уважение"; `src/managers/GameState.ts` for the shipped behaviour.

## Meters

Both `stress` and `respect` are integers in `[0, 100]`. Stored on `PlayerData`. Difficulty modifiers multiply deltas before they apply (see [01-core-loop.md](01-core-loop.md#difficulty)).

## Stress

### Sources (positive deltas)

| Event                | Δ        |
| -------------------- | -------- |
| Deadline             | +10..+30 |
| Conflict             | +10..+20 |
| Production bug       | +30      |
| Working on a weekend | +40      |
| Failing an assessment question (`score < 25`) | +5..+10 |

### Reducers (negative deltas)

| Action                     | Δ    |
| -------------------------- | ---- |
| Coffee                     | -5   |
| Break                      | -10  |
| Games with colleagues      | -15  |
| Mini-game (Game Room)      | -5..-12 |
| Kitchen with other players | -2 / 30s (multiplayer) |
| Weekend off                | -20  |

### Effects by band

| Band    | Range  | Effect                                                                       |
| ------- | ------ | ---------------------------------------------------------------------------- |
| Calm    | 0–30   | Normal play.                                                                 |
| Tired   | 31–60  | Player movement / interactions slower.                                       |
| Burning | 61–90  | Random dialogue choices drop / mis-fire.                                     |
| Critical| 91–99  | Visual warning; some NPCs refuse interactions.                               |
| Burnout | 100    | Immediate `gameOver` with `reason: 'burnout'`.                               |

### Assessment interaction

- If `stress > 80` at session start, the assessment is **not started** — the assessor NPC says "Ты выглядишь уставшим…" and the dialogue ends without entering session mode.
- If a session is mid-flight and stress crosses 80 (e.g. consecutive fails), the session is interrupted gracefully with the same line.

See Q9 for stress > 100 semantics.

## Respect

### Sources

| Event                        | Δ        |
| ---------------------------- | -------- |
| Quest completed              | +5..+20  |
| Helping a colleague          | +5..+15  |
| Code review (success)        | +10      |
| Resolving a problem          | +20      |
| Assessment question (`score ≥ 70`) | +1..+3 |

### Penalties

| Event              | Δ        |
| ------------------ | -------- |
| Quest failed       | -10      |
| Conflict           | -5..-15  |
| Production bug     | -20      |

### Effects by band

| Band       | Range  | Effect                                                                        |
| ---------- | ------ | ----------------------------------------------------------------------------- |
| Ignored    | 0–30   | Most NPCs default-dialogue only; many quests and the path-choice flow locked. |
| Neutral    | 31–60  | All standard quests available; path-choice flow unlocks at `respect ≥ 20`.     |
| Respected  | 61–90  | Bonus dialogue branches unlock.                                                |
| Authority  | 91–100 | Top-grade-track quests unlock.                                                 |

## Three-way relationship: stress / respect / per-NPC `relationship` / Skill Insights

- Global `respect` is one number; per-NPC `relationship ∈ [-100, 100]` is another (see [06-npcs.md](06-npcs.md)).
- Skill Insights (per `competencyTags`) is a third axis — see [10-assessments.md](10-assessments.md) and `SkillInsightsManager`.
- Q2 (`00-index.md`): how these compose; needs an ADR to clarify whether one is derived from another or all three are persisted independently.

## Acceptance criteria

- AC-1 — `stress` and `respect` clamp to `[0, 100]` on every mutation (Q9 may revise stress upper bound).
- AC-2 — Every mutation emits the corresponding `stressChanged` / `respectChanged` event with `{ old, new }` payload.
- AC-3 — Crossing a band boundary (e.g. 60 → 61) does not require a separate event; UI subscribes to value events and computes the band locally.
- AC-4 — Band effects are deterministic: same value produces the same effect at every check.
- AC-5 — `stress = 100` immediately triggers `gameOver`, regardless of which event raised it.
- AC-6 — `stress > 80` blocks new assessment sessions (start-time check).

## Open questions

- Q2 — relationship vs respect vs Skill Insights composition.
- Q9 — stress overflow semantics.
