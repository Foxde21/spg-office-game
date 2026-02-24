# AGENTS.md

Instructions for AI coding agents working on Office Quest game.

## Project Overview

**Office Quest** — 2D point-and-click quest game built with Phaser 3 + TypeScript.
Theme: "Path from Junior to Team Lead without burning out."

## Commands

```bash
npm install           # Install dependencies
npm run dev           # Start both client + AI server (client: :3000, server: :3001)
npm run dev:client    # Start Vite dev server only (http://localhost:3000)
npm run dev:server    # Start Express AI proxy server only (http://localhost:3001)
npm run build         # TypeScript check + production build
npm run preview       # Preview production build

# Testing
npm run test          # Run unit tests (Vitest)
npm run test:ui       # Run unit tests with UI
npm run test:coverage # Run unit tests with coverage report
npm run test:e2e      # Run E2E tests (Playwright)
npm run test:e2e:ui   # Run E2E tests with UI
npm run test:all      # Run all tests (unit + e2e)
```

## Environment Setup

Create `.env` file in project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
CLIENT_URL=http://localhost:3000
SERVER_PORT=3001
```

Get OpenRouter API key at https://openrouter.ai/keys

## Testing Strategy

### Unit Tests (Vitest)
- Test managers in isolation: GameState, Inventory, Quest
- Mock Phaser Game object
- Fast execution, no browser needed
- Located in `tests/unit/`

### E2E Tests (Playwright)
- Test gameplay flows: movement, dialogue, quests
- Real browser testing
- Located in `e2e/`
- Run against dev server

### Test File Naming
- Unit: `*.test.ts` in `tests/unit/`
- E2E: `*.spec.ts` in `e2e/`

See `docs/testing.md` for detailed testing guide.

## Project Structure

```
src/
├── main.ts        # Entry point, Phaser game config
├── config.ts      # Constants (GAME_WIDTH, COLORS, etc.)
├── types/         # TypeScript interfaces
├── scenes/        # Phaser scenes (Boot, Preload, Game, UI)
├── objects/       # Game objects (Player, NPC, Items)
├── managers/      # Singleton managers (GameState, Inventory, Quest, Save, AIDialogue)
└── data/          # Game data (NPC prompts, items, quests)

server/
├── index.ts       # Express server entry point
└── routes/        # API routes (ai.ts)
```

## Code Style

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `PlayerManager`, `GameScene` |
| Interfaces | PascalCase | `Dialogue`, `PlayerData` |
| Methods | camelCase | `updatePlayer()`, `createNPCs()` |
| Properties | camelCase | `private speed = 200` |
| Constants | UPPER_SNAKE | `GAME_WIDTH`, `COLORS` |
| Files | PascalCase | `Player.ts`, `UIScene.ts` |

### Imports Order

```typescript
// 1. External libraries
import Phaser from 'phaser'

// 2. Internal modules (relative)
import { Player } from '../objects/Player'
import { GAME_WIDTH } from '../config'
import type { Dialogue } from '../types'
```

### Formatting Rules

- **No comments** in code unless explicitly requested
- Single quotes for strings: `'player'` not `"player"`
- No trailing commas in object/array literals (unless multiline)
- Blank line before return statements
- Max line length: 100 characters

## Architecture Principles

1. **Single Responsibility** — Each class does one thing
2. **Event-Driven** — Scenes communicate via events, not direct calls
3. **Singleton Managers** — Global state through manager classes
4. **Strict Types** — No `any`, use proper interfaces

---

## Templates and Patterns

This section contains ready-to-use templates. Follow them exactly when creating new files.

### Creating a New Scene

Every scene extends `Phaser.Scene`. Scene key MUST match class name.

```typescript
import Phaser from 'phaser'
import { GameStateManager } from '../managers/GameState'

export class ExampleScene extends Phaser.Scene {
  private gameState!: GameStateManager

  constructor() {
    super({ key: 'ExampleScene' })
  }

  create() {
    this.gameState = GameStateManager.getInstance(this.game)
    this.game.events.on('someEvent', this.onSomeEvent, this)
  }

  shutdown() {
    this.game.events.off('someEvent', this.onSomeEvent, this)
  }

  private onSomeEvent() {}
}
```

BAD — scene key does not match class name:
```typescript
class ExampleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'example' })  // WRONG: must be 'ExampleScene'
  }
}
```

BAD — managers initialized in constructor:
```typescript
constructor() {
  super({ key: 'ExampleScene' })
  this.gameState = GameStateManager.getInstance(this.game)  // WRONG: this.game is undefined here
}
```

BAD — event listeners not cleaned up:
```typescript
create() {
  this.game.events.on('someEvent', this.onSomeEvent, this)
}
// WRONG: missing shutdown() with .off()
```

### Creating a Physics Game Object (Player, NPC, Item)

Physics objects extend `Phaser.Physics.Arcade.Sprite`. They must call `scene.physics.add.existing(this)` in the constructor.

```typescript
import Phaser from 'phaser'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private speed = 100

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-texture')
    scene.physics.add.existing(this)
    this.setImmovable(true)
    this.setScale(2)
    this.setOrigin(0.5, 0.5)
    this.body!.setSize(16, 20)
    this.body!.setOffset(8, 22)
  }

  getId(): string {
    return this.id
  }
}
```

Then in scene `create()`:
```typescript
const enemy = new Enemy(this, 100, 200)
this.add.existing(enemy)
enemy.setDepth(10)
```

BAD — forgetting `scene.physics.add.existing(this)`:
```typescript
constructor(scene: Phaser.Scene, x: number, y: number) {
  super(scene, x, y, 'enemy-texture')
  // WRONG: missing scene.physics.add.existing(this)
  this.body!.setSize(16, 20)  // will crash: body is null
}
```

BAD — forgetting `this.add.existing()` in scene:
```typescript
const enemy = new Enemy(this, 100, 200)
// WRONG: missing this.add.existing(enemy) — object won't render
enemy.setDepth(10)
```

BAD — accessing `this.body` without `!`:
```typescript
this.body.setSize(16, 20)  // WRONG: body can be null
this.body!.setSize(16, 20) // CORRECT
```

### Creating a Non-Physics Game Object (Door, UI element)

Non-physics objects extend `Phaser.GameObjects.Container`:

```typescript
import Phaser from 'phaser'

export class Panel extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics
  private label: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y)
    this.background = scene.add.graphics()
    this.background.fillStyle(0x000000, 0.8)
    this.background.fillRoundedRect(-100, -50, 200, 100, 10)
    this.label = scene.add.text(0, 0, text, { fontSize: '16px', color: '#ffffff' })
    this.label.setOrigin(0.5)
    this.add([this.background, this.label])
    this.setSize(200, 100)
    this.setInteractive({ useHandCursor: true })
  }
}
```

### Creating a Singleton Manager

All managers use this exact singleton pattern. Constructor is `private`. First call to `getInstance` must pass `game`.

```typescript
import Phaser from 'phaser'

export class ExampleManager {
  private static instance: ExampleManager
  private game: Phaser.Game
  private items: Map<string, ItemData> = new Map()

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): ExampleManager {
    if (!ExampleManager.instance && game) {
      ExampleManager.instance = new ExampleManager(game)
    }

    return ExampleManager.instance
  }

  addItem(item: ItemData): void {
    this.items.set(item.id, item)
    this.game.events.emit('itemAdded', item)
  }

  clear(): void {
    this.items.clear()
  }
}
```

BAD — public constructor:
```typescript
constructor(game: Phaser.Game) {  // WRONG: must be private
  this.game = game
}
```

BAD — creating instance without checking `game`:
```typescript
static getInstance(game?: Phaser.Game): ExampleManager {
  if (!ExampleManager.instance) {
    ExampleManager.instance = new ExampleManager(game!)  // WRONG: game can be undefined
  }
  return ExampleManager.instance
}
```

BAD — emitting event before state change:
```typescript
addItem(item: ItemData): void {
  this.game.events.emit('itemAdded', item)  // WRONG: emit AFTER state change
  this.items.set(item.id, item)
}
```

### Event Communication Between Scenes and Managers

Scenes and managers communicate via `this.game.events`. Always pass context (`this`) as third argument to `.on()`.

Registering:
```typescript
this.game.events.on('questCompleted', this.onQuestCompleted, this)
```

Emitting:
```typescript
this.game.events.emit('questCompleted', quest)
```

Cleanup (in `shutdown()`):
```typescript
this.game.events.off('questCompleted', this.onQuestCompleted, this)
```

BAD — missing context in `.on()`:
```typescript
this.game.events.on('questCompleted', this.onQuestCompleted)  // WRONG: missing `this`
```

BAD — using arrow functions in event listeners (can't clean up):
```typescript
this.game.events.on('questCompleted', (q) => this.handle(q))  // WRONG: can't .off() this
```

Existing event names in the project:
- `questStarted`, `questCompleted`, `questFailed`, `questProgress`
- `itemAdded`, `itemRemoved`, `itemUsed`
- `stressChanged`, `respectChanged`, `careerLevelUp`
- `locationChanged`
- `gameSaved`, `gameLoaded`, `saveDeleted`
- `startDialogue`, `gameOver`

### Adding a New Dialogue to an NPC

Dialogues are defined in `src/data/locations.ts` inside NPC spawn data:

```typescript
dialogues: [
  {
    id: 'greeting',
    lines: [
      {
        speaker: 'NPC Name',
        text: 'Hello!'
      },
      {
        speaker: 'NPC Name',
        text: 'Choose wisely.',
        choices: [
          {
            text: 'Option A',
            nextDialogue: 'option-a-result',
            respectChange: 5
          },
          {
            text: 'Option B',
            nextDialogue: 'option-b-result',
            startQuest: 'quest-id',
            stressChange: 10
          }
        ]
      }
    ]
  }
]
```

Choice fields: `text` (required), `nextDialogue`, `startQuest`, `completeQuest`, `giveItem`, `respectChange`, `stressChange`, `condition`.

### Adding a New Location

Locations are defined in `src/data/locations.ts` as entries in `LOCATIONS: Record<LocationId, LocationData>`.

Step 1 — Add the location ID to the `LocationId` type in `src/types/`:
```typescript
export type LocationId = 'open-space' | 'kitchen' | 'meeting-room' | 'director-office' | 'new-room'
```

Step 2 — Add the location data:
```typescript
'new-room': {
  id: 'new-room',
  name: 'New Room',
  width: 1280,
  height: 720,
  backgroundColor: 0x2d2d44,
  doors: [
    { x: 100, y: 360, targetLocation: 'open-space', spawnX: 1100, spawnY: 360, label: 'Open Space' }
  ],
  npcs: [],
  items: []
}
```

Step 3 — Add a door from an existing location to the new room.

### Adding a New Item

Items are defined in `src/data/locations.ts` inside location item spawns:

```typescript
items: [
  {
    x: 300,
    y: 500,
    data: {
      id: 'coffee-mug',
      name: 'Кружка кофе',
      description: 'Согревает и бодрит.',
      sprite: 'item',
      type: 'consumable',
      usable: true,
      effects: { stress: -10 }
    }
  }
]
```

`type` can be: `'consumable'`, `'quest'`, `'key'`.

### Writing Unit Tests

Tests use Vitest. Mock the Phaser Game object. Reset singletons in `beforeEach`.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGame = {
  events: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}

let manager: ExampleManager

beforeEach(async () => {
  vi.resetModules()
  const mod = await import('../../src/managers/ExampleManager')
  const ExampleManager = mod.ExampleManager
  const existing = (ExampleManager as any).instance
  if (existing) {
    existing.game = mockGame
    existing.clear()
  }
  manager = ExampleManager.getInstance(mockGame as any)
})

describe('ExampleManager', () => {
  it('should add item and emit event', () => {
    manager.addItem({ id: 'test', name: 'Test' })
    expect(mockGame.events.emit).toHaveBeenCalledWith('itemAdded', expect.any(Object))
  })
})
```

BAD — not resetting singleton between tests:
```typescript
beforeEach(() => {
  manager = ExampleManager.getInstance(mockGame as any)
  // WRONG: singleton keeps state from previous test
})
```

### Server Route Pattern

Server routes use Express Router. Always validate input and handle errors.

```typescript
import { Router } from 'express'

export const exampleRouter = Router()

interface RequestBody {
  name: string
  value: number
}

exampleRouter.post('/endpoint', async (req, res) => {
  try {
    const { name, value } = req.body as RequestBody
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const result = await processData(name, value)

    return res.json({ result })
  } catch (error) {
    console.error('Endpoint error:', error)

    return res.status(500).json({ error: 'Internal server error' })
  }
})
```

---

## TypeScript Rules

### Use `!` (definite assignment) for Phaser-managed properties

Properties initialized in `create()` need `!`:

```typescript
private player!: Player
private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
private dialogueBox!: Phaser.GameObjects.Container
```

### Use `type` imports for interfaces

```typescript
import type { Dialogue, NPCData } from '../types'
```

### Use guard clauses with early returns

```typescript
if (!this.body) return
if (!quest || quest.completed) return false
```

### Clamp numeric values

```typescript
this.state.player.stress = Math.min(100, Math.max(0, oldStress + amount))
```

### No `any` type

Use proper interfaces. In tests only, use `as any` for mocks:
```typescript
manager = ExampleManager.getInstance(mockGame as any)  // OK in tests only
```

---

## Git Workflow

### Branches

- **main** — release branch (protected, only PRs from dev)
- **dev** — development branch (protected, PRs from features)
- **feature/\*** — feature branches

**NEVER commit directly to main or dev!**

### Branch Naming

```
<type>/<ticket-id>-<short-description>
```

Types: `feature/`, `bugfix/`, `refactor/`

Examples:
```
feature/001-quest-system
bugfix/003-dialogue-fix
refactor/004-player-movement
```

### Workflow

1. Pick a task from `backlog/todo/`
2. Create branch from dev: `git checkout dev && git pull && git checkout -b feature/001-quest-system`
3. Move task to `backlog/in-progress/`
4. Implement, test, verify DOD
5. Commit: `git commit -m "feat(quests): add quest system"`
6. Push: `git push -u origin feature/001-quest-system`
7. Create PR to dev branch
8. After review, merge to dev
9. When ready for release: PR from dev to main
10. Move task to `backlog/done/`

### Commit Messages

Format: `<type>(<scope>): <message>`

```
feat(quests): add quest completion rewards
fix(dialogues): fix choice effects not applying
refactor(player): optimize movement logic
docs(readme): update installation instructions
```

---

## Definition of Done

- [ ] Code runs without console errors
- [ ] Tested manually in browser
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] No unused variables/imports
- [ ] Changes committed to feature branch (not main)
- [ ] Unit tests written for managers (if applicable)
- [ ] All tests pass (`npm run test`)

## Common Mistakes to Avoid

1. Forgetting `scene.add.existing(this)` — object won't render
2. Forgetting `scene.physics.add.existing(this)` — physics body is null
3. Not cleaning up event listeners in `shutdown()`
4. Using `any` type instead of proper interfaces
5. Direct scene-to-scene calls (use `this.game.events` instead)
6. Hardcoding numbers (use constants from `config.ts`)
7. Initializing managers in constructor (use `create()`)
8. Emitting events before state change
9. Missing `!` on Phaser-managed properties
10. Missing context (`this`) in `game.events.on()`
11. Using arrow functions for event handlers (can't remove with `.off()`)
12. Forgetting to add new LocationId to the union type
13. Public constructor on singleton manager

## Resources

- [Phaser 3 Docs](https://newdocs.phaser.io/)
- [Phaser 3 Examples](https://phaser.io/examples)
- Project docs: `docs/architecture.md`, `docs/api.md`
