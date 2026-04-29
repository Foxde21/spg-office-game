# 14 — Achievements

Source: `docs/game-design.md` v2 § "Достижения и бейджи"; `docs/architecture.md` v2 (mentions `Achievement` manager, `Achievement` / `AchievementProgress` types, popup); pending `029-achievements-system.md`.

## Goal

30+ achievements across categories. Each achievement is either binary (unlocked / locked) or progressive (e.g. "23 / 100 quests"). Progressive achievements show a progress bar in the UI.

## Categories

| Category     | Examples                                                              |
| ------------ | --------------------------------------------------------------------- |
| Career       | First commit, Path chosen, Top grade (one per path), Polyglot         |
| Assessment   | Perfect session, Domain master, Quick learner (3 levels in a row)     |
| Social       | Loved by all (`respect = 100` everyone), Chatterbox, Helpful colleague |
| Mini-games   | Bug hunter (10 code reviews), Architect (5 puzzles), Sprint master    |
| Exploration  | Visit every location, Find every secret item                          |
| Hidden       | Easter eggs that don't reveal the criterion until unlocked             |

## Type contract

```ts
interface Achievement {
  id: string
  category: 'career' | 'assessment' | 'social' | 'minigames' | 'exploration' | 'hidden'
  title: string
  description: string                  // hidden until unlock for `hidden` category
  icon: string
  progressTarget?: number              // present for progressive achievements
  reward?: { respect?: number; stress?: number; items?: string[] }
}

interface AchievementProgress {
  unlocked: Record<string, number>     // unlock timestamp per id
  progress: Record<string, number>     // current count for progressive
}
```

## Trigger

`AchievementManager` listens to game events (`questCompleted`, `careerLevelUp`, `gameSaved`, `assessmentSessionEnd`, etc.) and increments / unlocks accordingly. Each unlock fires a Toast (`variant: 'success'`) and persists.

## Persistence (Q7)

Achievements may persist per-device or per-save. See [08-save-load.md](08-save-load.md#cross-device-persistence) and Q7 in `00-index.md`.

## Acceptance criteria

- AC-1 — Unlocking an achievement is idempotent — re-firing the trigger after unlock is a no-op.
- AC-2 — Progressive achievements show a progress bar; reaching `progressTarget` triggers an unlock.
- AC-3 — A `hidden` achievement does not show its description in the UI until unlocked.
- AC-4 — On unlock: emit `achievementUnlocked`, fire a `Toast`, write to persistence.
- AC-5 — Loading a save with a known achievement id whose criterion is now stricter does **not** revoke the achievement (one-way unlocks).

## Open questions

- Q7 — persistence (per save / per device / both).
- "Reset achievements" — should there be a button (debug only? always?). Deferred.
- Localised titles / descriptions — depends on Q6 locale outcome.
