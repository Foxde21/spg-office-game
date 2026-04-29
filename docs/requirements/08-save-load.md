# 08 — Save / load

Source: `docs/api.md` § `SaveManager`, `GameState`; shipped `006-save-load-system.md`; pending `014-save-assessment-state.md`.

## Storage

`localStorage` under key `officeQuest_save` for the default slot, `officeQuest_save_<n>` for slots 1..N.

## Save schema (v2)

```ts
interface GameState {
  version: string
  player: PlayerData              // includes careerPath?: string and current grade per path
  quests: { active: QuestData[]; completed: string[] }
  inventory: ItemData[]
  npcs: Record<string, NPCState>
  flags: Record<string, boolean>  // includes careerPathChosen
  assessment: AssessmentState     // session, per-domain progress, per-domain question pool index
  achievements: AchievementProgress // ids unlocked + progress counters (see Q7)
  skillInsights: Record<string, number> // per-competencyTag aggregate (see [10-assessments.md])
  timestamp: number
}
```

`version` is a semver-ish string. Schema bumps must:

1. Increment `version`.
2. Provide a migration from the previous version, or explicitly mark prior saves incompatible (see Q4).
3. Be covered by a unit test that loads a fixture from the previous version.

## Slots

- Default unnamed slot for "continue".
- N named slots (UI in [09-ui-menus.md](09-ui-menus.md), exact count TBD).

## Behaviour

- `save(state)` — writes to default slot.
- `load()` — reads default slot. Returns `null` if absent or version-incompatible.
- `saveToSlot(n, state)`, `loadFromSlot(n)` — explicit slots.
- `deleteSave()`, `deleteSlot(n)` — removal.
- `hasSave()`, `hasSlot(n)` — existence check.

Auto-save is wired in `GameScene` for events that materially change state (`questCompleted`, `itemAdded`, plus assessment session end and achievement unlock).

## Cross-device persistence (Q7)

Achievements may persist per-device (separate from `slot`-bound progress) so a player who restarts gets credit for previous unlocks. Open question — whether to store as a sibling localStorage key (`officeQuest_achievements`) or fold into the slot save.

## Acceptance criteria

- AC-1 — A save round-trip (`save` → `load`) yields a structurally equal state for the supported version.
- AC-2 — Loading a save with a `version` we know how to migrate runs the migration; a save with a `version` we do not recognise returns `null` and logs a warning.
- AC-3 — `gameSaved` event fires after a successful write; `gameLoaded` after a successful read.
- AC-4 — Inventory, quests, NPCs, flags, **assessment**, **skillInsights**, **achievements** all round-trip identically.
- AC-5 — `currentLocation` round-trips and the player respawns at their last position in that location (see [07-locations.md](07-locations.md)).
- AC-6 — `careerPath` round-trips; a save with `flags.careerPathChosen = true` but missing `careerPath` is treated as corrupt and refused.

## Open questions

- Q4 — schema migration policy during development.
- Q7 — achievement persistence (per save vs per device vs both).
