# 03 — Quests

Source: `docs/game-design.md` v2 § "Квесты", existing `backlog/done/001-quest-system.md` (shipped behaviour).

## Quest types

| Type        | Cadence    | Drives                                  | Examples                                      |
| ----------- | ---------- | --------------------------------------- | --------------------------------------------- |
| Main        | Story-paced | Career arc / promotion                  | "Run a meeting", "Resolve PM conflict", path-specific finale |
| Side        | On-demand  | Respect / items / Skill Insights        | "Find documentation", "Help the QA reproduce a bug" |
| Daily       | See Q3     | Routine stress                          | "Stand-up", "Sprint sync", "Daily code review" |
| Assessment  | NPC-triggered | Career grade progress (per path)     | "Pass an ML Fundamentals assessment with Petya" |
| Final       | Top-grade  | Path's top-grade ending                 | "AI Architect comprehensive assessment" |

Q3 (`00-index.md`): daily cadence — real-time minutes or in-game day?

## Lifecycle

```
                 +-----------+
                 | Available |  (preconditions met, NPC will offer)
                 +-----+-----+
                       | startQuest
                       v
                 +-----+-----+
                 |  Active   |
                 +-----+-----+
        progress        |   conditions failed
            v           v
        +---+---+   +--+-----+
        | Done  |   | Failed |
        +-------+   +--------+
```

States are mutually exclusive and persisted on `GameState.quests`.

## Rewards and penalties

Each quest declares:

```ts
rewards: { respect?: number; stress?: number; items?: string[]; skillInsights?: SkillInsightDelta[] }
penalties?: { respect?: number; stress?: number }
```

Reward applied on `Done`. Penalty applied on `Failed`. Items granted via inventory (see [05-inventory.md](05-inventory.md)). `skillInsights` (if present) tag the player's competency growth (see [10-assessments.md](10-assessments.md#skill-insights)).

## Quest sources

- NPC dialogue choice with `effects.startQuest` (see [04-dialogues.md](04-dialogues.md)).
- Story-driven trigger when entering a location at a specific career grade.
- Daily auto-spawn (Q3).
- Assessment session completion (auto-creates / closes a per-domain quest).

## Examples

- "Find documentation" — side; reward `respect +10`, item `dev-handbook`.
- "Fix a bug for a junior" — side; reward `respect +15`, penalty `stress +10`.
- "Run a code review" — main; reward `respect +20`.
- "ML Fundamentals — Junior" — assessment; reward `respect +3`, skill insights, level-up if thresholds met.
- "AI Architect comprehensive" — final; required to unlock the AI top-grade ending.

## Acceptance criteria

- AC-1 — A quest can be in exactly one of `Available | Active | Done | Failed`.
- AC-2 — `startQuest(id)` is idempotent; a second call on an already-active quest is a no-op.
- AC-3 — `completeQuest(id)` emits `questCompleted` with the full quest payload, applies rewards, and is no-op if quest is not `Active`.
- AC-4 — `failQuest(id)` emits `questFailed`, applies penalties, no-op if quest is not `Active`.
- AC-5 — Quest progress (`updateProgress`) is monotonic non-decreasing and clamps at 100.
- AC-6 — Promotion checks (see [01-core-loop.md](01-core-loop.md#promotion-per-path)) read assessment progress, not quest counts.

## Open questions

- Q3 — daily quest cadence definition.
