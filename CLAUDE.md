# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Office Quest** — 2D point-and-click quest game built with Phaser 3 + TypeScript + Vite. Theme: career path from Junior Developer to Team Lead. Game language is Russian.

## Commands

```bash
npm run dev             # Start client (:3000) + Express AI proxy server (:3001)
npm run dev:client      # Vite dev server only
npm run dev:server      # Express server only
npm run build           # tsc check + vite build
npm run test            # Unit tests (Vitest, jsdom)
npm run test:ui         # Unit tests with browser UI
npm run test:e2e        # E2E tests (Playwright)
npm run test:all        # All tests
```

Test files: unit `tests/unit/*.test.ts`, e2e `e2e/*.spec.ts`.

## Architecture

- **Entry point**: `src/main.ts` — creates Phaser game instance (1280x720, arcade physics)
- **Singleton managers** in `src/managers/` — GameState, Quest, Inventory, LocationManager, Save, AIDialogue. All use `getInstance(game)` pattern with private constructors.
- **Scenes** in `src/scenes/` — BootScene → PreloadScene → GameScene + UIScene. Scene keys MUST match class names. Managers initialized in `create()`, not constructor.
- **Game objects** in `src/objects/` — Player, NPC, Item (extend `Phaser.Physics.Arcade.Sprite`), Door (extends `Phaser.GameObjects.Container`).
- **Game data** in `src/data/locations.ts` — locations, NPC spawns, items, dialogues defined declaratively.
- **Server** in `server/` — Express proxy for AI dialogue (OpenRouter API).
- **Event system** — scenes and managers communicate via `this.game.events`. Always pass `this` context. Clean up in `shutdown()`.

## Critical Patterns (see AGENTS.md for full templates)

1. Physics objects: call `scene.physics.add.existing(this)` in constructor, then `this.add.existing(obj)` in scene
2. Phaser `body` access: always use `!` — `this.body!.setSize(...)`
3. Event handlers: use named methods (not arrow functions) so they can be removed with `.off()`
4. Singleton reset in tests: `vi.resetModules()` + re-import + `getInstance(mockGame as any)`
5. Constants: use `src/config.ts`, never hardcode magic numbers
6. Types: use `type` imports for interfaces, no `any` outside tests
7. New `LocationId` must be added to the union type in `src/types/`

## Code Style

- PascalCase for classes/interfaces, camelCase for methods/properties, UPPER_SNAKE for constants
- Single quotes, no trailing commas (unless multiline), no comments unless requested
- Max line length: 100 characters
- Guard clauses with early returns, clamp numeric values

## Git Workflow

- Branches: `main` ← `dev` ← `feature/*` / `bugfix/*` / `refactor/*`
- Never commit directly to main or dev
- Commit format: `<type>(<scope>): <message>` (e.g., `feat(quests): add completion rewards`)
- Task management in `backlog/` (todo → in-progress → done)

## Environment

Create `.env` with `OPENROUTER_API_KEY`, `CLIENT_URL=http://localhost:3000`, `SERVER_PORT=3001`.
