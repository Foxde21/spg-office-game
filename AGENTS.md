# AGENTS.md

Instructions for AI coding agents working on Office Quest game.

## Project Overview

**Office Quest** — 2D point-and-click quest game built with Phaser 3 + TypeScript.
Theme: "Path from Junior to Team Lead without burning out."

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # TypeScript check + production build
npm run preview    # Preview production build
```

**Note:** No test framework configured yet. Manual testing via `npm run dev`.

## Project Structure

```
src/
├── main.ts        # Entry point, Phaser game config
├── config.ts      # Constants (GAME_WIDTH, COLORS, etc.)
├── types/         # TypeScript interfaces
├── scenes/        # Phaser scenes (Boot, Preload, Game, UI)
├── objects/       # Game objects (Player, NPC, Items)
└── managers/      # Singleton managers (future)
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

### TypeScript Patterns

```typescript
// Use definite assignment for Phaser-managed properties
private player!: Player
private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

// Early return for guards
if (!this.body) return

// Optional chaining for nullable values
npc.dialogues?.forEach(...)

// Type imports for interfaces only
import type { Dialogue } from '../types'
```

### Class Structure

```typescript
export class Example extends Phaser.Scene {
  // 1. Private properties with definite assignment
  private player!: Player
  private items: Item[] = []
  
  // 2. Constructor
  constructor() {
    super({ key: 'Example' })
  }
  
  // 3. Lifecycle methods (create, update)
  create() {}
  update() {}
  
  // 4. Private methods
  private helper() {}
}
```

### Formatting Rules

- **No comments** in code unless explicitly requested
- Single quotes for strings: `'player'` not `"player"`
- No trailing commas in object/array literals (unless multiline)
- Blank line before return statements
- Max line length: 100 characters

### Error Handling

```typescript
// Use non-null assertions only for Phaser-managed objects
this.body!.setSize(40, 60)

// Guard clauses for optional values
if (!condition) return

// Throw for truly exceptional cases
throw new Error(`Unknown NPC: ${id}`)
```

## Phaser-Specific Rules

### Scene Keys

Scene key must match class name:
```typescript
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }
}
```

### Game Objects

Always add to scene after creation:
```typescript
const player = new Player(this, x, y, 'player')
this.add.existing(player)  // Required!
```

### Event Communication

Use `game.events` for cross-scene communication:
```typescript
// Emit
this.game.events.emit('questCompleted', quest)

// Listen
this.game.events.on('questCompleted', this.handleQuest, this)

// Clean up in shutdown
this.game.events.off('questCompleted', this.handleQuest, this)
```

## Architecture Principles

1. **Single Responsibility** — Each class does one thing
2. **Event-Driven** — Scenes communicate via events, not direct calls
3. **Singleton Managers** — Global state through manager classes
4. **Strict Types** — No `any`, use proper interfaces

## Git Workflow

### Branch Naming

Each task must be done in a separate branch:

```
<type>/<ticket-id>-<short-description>
```

**Types:**
- `feature/` — new functionality
- `bugfix/` — bug fixes
- `refactor/` — code refactoring

**Examples:**
```
feature/001-quest-system
feature/002-inventory-system
bugfix/003-dialogue-fix
refactor/004-player-movement
```

### Workflow

1. Pick a task from `backlog/todo/`
2. Create branch: `git checkout -b feature/001-quest-system`
3. Move task to `backlog/in-progress/`
4. Implement, test, verify DOD
5. Commit: `git commit -m "feat(quests): add quest system"`
6. Push: `git push -u origin feature/001-quest-system`
7. Create PR or merge to main
8. Move task to `backlog/done/`

### Commit Messages

Format: `<type>(<scope>): <message>`

```
feat(quests): add quest completion rewards
fix(dialogues): fix choice effects not applying
refactor(player): optimize movement logic
docs(readme): update installation instructions
```

**NEVER commit directly to main branch.**

## Definition of Done

- [ ] Code runs without console errors
- [ ] Tested manually in browser
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] No unused variables/imports
- [ ] Changes committed to feature branch (not main)

## Common Mistakes to Avoid

- Forgetting `scene.add.existing(this)` in game objects
- Not cleaning up event listeners on scene shutdown
- Using `any` type instead of proper interfaces
- Direct scene-to-scene calls (use events instead)
- Hardcoding magic numbers (use constants from `config.ts`)

## Resources

- [Phaser 3 Docs](https://newdocs.phaser.io/)
- [Phaser 3 Examples](https://phaser.io/examples)
- Project docs: `docs/architecture.md`, `docs/api.md`
