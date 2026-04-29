# 07 — Locations

Source: `docs/game-design.md` v2 § "Локации"; `docs/architecture.md` v2 § "Система локаций" (table of 6); shipped `004-multiple-locations.md`; pending `015-ai-lab-location.md`, `022-game-room-minigame-framework.md`.

## Locations

| Id             | Name              | Status   | Function                                                          |
| -------------- | ----------------- | -------- | ----------------------------------------------------------------- |
| `open-space`   | Open Space        | shipped  | Workplaces, computers, stand-up zone. Default spawn. Notice board (leaderboard preview, future). |
| `kitchen`      | Кухня             | shipped  | Coffee machine (`stress -5`), fridge (quest items), lunch table. **Multiplayer social hub** (`stress -2`/30s with other players, chat). |
| `meeting-room` | Переговорка       | shipped  | Meetings, presentations, conflict resolution scenes.              |
| `director-office` | Кабинет директора | shipped  | Final-act quests, serious dialogues. Locked pre-Senior.            |
| `ai-lab`       | AI Lab            | planned  | Профессор Нейронов; AI-domain assessments and AI Architect finale. Unlocked when `careerPath === 'ai'`. |
| `game-room`    | Game Room         | planned  | Arcade machines for mini-games (`code-review`, `arch-puzzle`, `sprint-plan`). See [12-minigames.md](12-minigames.md). |

## Transitions

- Player moves between locations via labelled doors / portals.
- Each location is a Phaser `Scene` with its own key (`OpenSpaceScene`, `KitchenScene`, etc.) — currently the prototype uses one `GameScene` switching content via `LocationManager`; the planned refactor splits scenes per location.
- Cross-scene state lives in singleton managers; never on the scene.

## Conditional doors

`DoorData` supports a `condition` field with `flag` and `careerPath` checks:

```ts
condition?: {
  flag?: string         // requires GameState.flags[flag] === true
  careerPath?: string   // requires PlayerData.careerPath === <id>
  minRespect?: number   // requires global respect >= n
}
```

A door whose condition fails refuses entry with a visible reason (no silent ignore).

### Examples

- `open-space → ai-lab` — `condition: { careerPath: 'ai' }`.
- `open-space → director-office` — `condition: { minRespect: 60 }` plus a story flag set in Act 2.
- `open-space → game-room` — unconditional once shipped; the location itself gates per-game by player career level if needed.

## Acceptance criteria

- AC-1 — Each location is a separate `Scene` (post-refactor) or content set within `GameScene` (current); transition uses Phaser scene-switch / `LocationManager.changeLocation`, not a state flag inside one scene.
- AC-2 — Player position persists per-location (returning to a location restores the last position).
- AC-3 — Locked locations refuse entry with a visible message; do not crash, no silent failure.
- AC-4 — Save / load restores `currentLocation` and the player resumes where they left off.
- AC-5 — `ai-lab` is reachable only when `careerPath === 'ai'`. Loading a save with the AI Lab door open and `careerPath !== 'ai'` (e.g. user tampered storage) closes the door and returns the player to a safe spawn.
- AC-6 — Adding a new location requires updating the `LocationId` union in `src/types/Location.ts`, `src/data/locations.ts`, and registering doors with consistent IDs.

## Open questions

- Should there be a fast-travel mechanic between unlocked locations? Currently no.
- Should the kitchen multiplayer presence affect single-player runs (e.g. NPC stand-ins)? Currently no.
