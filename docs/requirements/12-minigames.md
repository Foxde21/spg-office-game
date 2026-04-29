# 12 — Mini-games (Game Room)

Source: `docs/game-design.md` v2 § "Мини-игры (Game Room)"; `docs/architecture.md` v2 § "MiniGameScene"; pending stories `022-game-room-minigame-framework.md`, `023-minigame-code-review.md`, `024-minigame-arch-puzzle.md`, `025-minigame-sprint-planning.md`.

## Goal

Aracade-machine mini-games inside the **Game Room** location (see [07-locations.md](07-locations.md)). Each mini-game lives in `src/scenes/minigames/<Name>.ts` and inherits a common `MiniGameScene` base.

## Common framework (`MiniGameScene`)

Lifecycle hooks every mini-game must implement:

```ts
abstract class MiniGameScene extends Phaser.Scene {
  abstract showInstructions(): Promise<void>
  abstract play(): Promise<MiniGameResult>
  abstract showResult(result: MiniGameResult): Promise<void>
}

interface MiniGameResult {
  score: number                  // 0..100
  durationMs: number
  correctCount: number
  totalCount: number
  competencyTags: string[]       // feeds Skill Insights (Q14)
  rewards: { stress: number; respect: number; items?: string[] }
}
```

Common UI elements (timer, score readout, "back to Game Room" exit) are provided by the base class.

Q14 (`00-index.md`): does mini-game scoring feed Skill Insights, only stress/respect, or both?

## Catalogue

| Id           | Name                  | Mechanic                                                        | Trains              |
| ------------ | --------------------- | --------------------------------------------------------------- | ------------------- |
| `code-review`| Code Review Challenge | Find bugs in a code snippet against a timer.                    | Engineering attention to detail |
| `arch-puzzle`| Architecture Puzzle   | Drag-and-drop components into an architecture diagram correctly. | System Design       |
| `sprint-plan`| Sprint Planning Sim   | Pick the optimal subset of tickets that fit the sprint budget.  | Product / Management |

Each mini-game runs in 2-5 minutes. Reward range: `stress -5..-12`, `respect +1..+3`.

## Trigger

Player walks up to an arcade machine in `game-room`, presses `E`. Each `ArcadeMachine` is a `Phaser.GameObjects.Container` with a `mini-game-id`. Interaction switches scene to the mini-game; on completion, scene returns to `GameScene` with the result applied.

## Acceptance criteria

- AC-1 — Every mini-game extends `MiniGameScene` and implements all three abstract methods.
- AC-2 — A mini-game must return a `MiniGameResult` even on player abort (with `score: 0`, `durationMs`, etc.) — never leaves the player stuck.
- AC-3 — Rewards apply via `GameStateManager` only after the player dismisses the result screen — not during play.
- AC-4 — `competencyTags` feed `SkillInsightsManager` exactly once per game session (per Q14 outcome).
- AC-5 — Adding a new mini-game requires creating `src/scenes/minigames/<Name>.ts`, registering it in the scene config, and adding an `ArcadeMachine` instance with the matching id in `game-room` location data.
- AC-6 — A mini-game does not freeze the game on slow devices; if the framework detects a frame budget overrun, it pauses gracefully (not crashes).

## Open questions

- Q14 — Skill Insights integration with mini-game scoring.
- Difficulty scaling — does game-difficulty modify mini-game pace / pool?
- Multiplayer mode for mini-games (deferred; potential overlap with [13-multiplayer.md](13-multiplayer.md) duels).
