# AGENTS.md — orientation for AI coding agents

Canonical guide for any AI coding agent working on this repo (Claude Code, Codex CLI, others). Keep short and current. Detailed style guide lives in `docs/contributing.md`; longer-lived facts go in the agent's memory system.

## Project in one paragraph

**Office Quest** — competency-development platform framed as a 2D point-and-click game. Theme: "Path from Junior to Lead in your chosen specialisation." Eight career paths (AI, Engineering, Product, Design, QA, Analytics, HR, Management) with an NPC-driven assessment system, mini-games, multiplayer (chat / duels / team assessments / leaderboard), and 30+ achievements. Stack: Phaser 3, TypeScript, Vite, Vitest (unit), Playwright (E2E), Express (AI proxy + WebSocket — partly implemented), Socket.IO (planned), OpenRouter for LLM calls. Repo: `Foxde21/spg-office-game`.

## Where things live

- `src/` — Phaser game code.
  - `scenes/` — `BootScene → PreloadScene → GameScene + UIScene`. Mini-game scenes under `scenes/minigames/` (planned).
  - `objects/` — `Player`, `NPC`, `Item`, `Door`. Planned: `RemotePlayer`, `ArcadeMachine`, `ChatBubble`.
  - `managers/` — singleton managers: `GameState`, `Quest`, `Inventory`, `LocationManager`, `Save`, `AIDialogue`, `Assessment`, `SkillInsights`, `Toast`. Planned: `Multiplayer`, `Achievement`.
  - `data/` — declarative content. `locations.ts`, `npcPrompts.ts`, `careerPaths/` (plugin-style; AI is shipped, others stubbed), `skillMatrices/`.
  - `types/` — `assessment.ts`, `ai.ts`, `Location.ts`, `index.ts`.
  - `config.ts` — constants (`GAME_WIDTH`, `COLORS`, `ASSESSMENT_SCORING`, …).
- `server/` — Express AI proxy (OpenRouter). Multiplayer WS planned.
- `tests/unit/` — Vitest. `e2e/` — Playwright.
- `docs/` — project documentation. Don't put ad-hoc notes in repo root.
  - `requirements/` — **source of truth for game behaviour.** One file per module + `00-index.md`, `90-glossary.md`, `91-personas.md`.
  - `architecture.md` — engine / data flow. `architecture/` — ADRs.
  - `api.md` — managers, events, types, AI proxy contract.
  - `spg-skill-matrix/` — skill matrix exports per role (BA, Design, Product, QA, Software Dev). Source for Skill Insights mapping.
  - `assets.md`, `contributing.md`, `testing.md`, `game-design.md` (legacy GDD; canonical content now in `requirements/`).
- `inputs/` — raw stakeholder material (briefs, mockups, references). **Never edited.** The BA parses these into `docs/requirements/`.
- `backlog/todo/`, `backlog/in-progress/`, `backlog/done/` — one markdown file per story.
- `backlog/_template.md` — story template. `backlog/dor.md`, `backlog/dod.md` — gates. `backlog/roadmap.md` — milestones / waves.
- `.claude/agents/`, `.claude/commands/`, `.claude/rules/` — Claude Code helpers.
- `.codex/prompts/` — Codex CLI prompt templates (install per `.codex/prompts/README.md`).

## Commands

```bash
npm install
npm run dev           # client (:3000) + AI server (:3001)
npm run dev:client
npm run dev:server
npm run build         # tsc + vite build
npm run test          # Vitest unit
npm run test:ui       # Vitest with browser UI
npm run test:e2e      # Playwright E2E
npm run test:all
```

Test files: unit `tests/unit/*.test.ts`, e2e `e2e/*.spec.ts`. `.env`: `OPENROUTER_API_KEY`, `CLIENT_URL=http://localhost:3000`, `SERVER_PORT=3001`.

## Workflow (SDD + TDD)

For every story:

1. **Spec** — DOR checklist green. The relevant module in `docs/requirements/` describes the *behaviour* the story must hit; if the story would change behaviour, update the requirement file first (or, if uncertain, log the contradiction in `docs/requirements/00-index.md` "Gaps & contradictions"). If the story touches the AI proxy contract, save format, or assessment data shape, draft the change in `docs/api.md` / `docs/architecture.md`.
2. **Test first** — failing Vitest unit test for managers / services; Playwright spec for new user-visible flows on critical paths.
3. **Implement** — minimum to make the test pass.
4. **Refactor** — keep tests green; `npm run build` clean.
5. **Review** — invoke the `code-reviewer` subagent (Claude) or do an equivalent self-review pass (Codex) before opening a PR.
6. **Merge** — DOD checklist green, story moves to `done/`.

## Branching (3 tiers — strict)

- `main` — release branch. PRs only from `dev`.
- `dev` — integration branch. PRs from feature branches.
- `feature/<id>-<slug>`, `bugfix/<id>-<slug>`, `refactor/<id>-<slug>`, `docs/<id>-<slug>` — work branches off `dev`.

**Never commit directly to `main` or `dev`.** Each story = its own branch + PR into `dev`. Releases are PRs from `dev` to `main`.

## Conventions (strict)

- **Story IDs:** `OQ-XXX`, zero-padded, monotonic. Legacy ids `001…032` stay as-is in `backlog/{todo,in-progress,done}/`. New stories use `OQ-`. Next id = `max(existing OQ-XXX, existing legacy XXX) + 1`.
- **Branches:** `feature/OQ-042-...`, `fix/OQ-055-...`, `docs/OQ-060-...`. Legacy stories may use `feature/<num>-...` if started before this flow.
- **Commits:** Conventional Commits with story id in scope: `feat(OQ-042): add quest reward popup`. Allowed prefixes: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, `ci`.
- **PR = one story.** Title mirrors the commit subject. Body links the story file and ticks DOD.
- **ADRs are append-only.** Never edit an accepted ADR — supersede it.
- **No `any`** in TypeScript outside tests. Prefer `unknown` + narrowing.
- **No `console.log`** in shipped code. Use `Toast` for user-visible notifications.
- Single quotes; no trailing commas in single-line literals; max 100 chars/line.

## Roles

Claude has these as subagents in `.claude/agents/`. Codex CLI users open the same files and play the role manually.

- **`game-dev`** — Phaser/TS work, TDD. Touches `src/`, `server/`, `tests/`, `e2e/`.
- **`ba-analyst`** — owns `docs/requirements/` and `inputs/`. Turns design notes / briefs / mockups / skill-matrix exports into normalised requirement files and DOR-compliant stories. Surfaces gaps and contradictions in `docs/requirements/00-index.md`. No code.
- **`code-reviewer`** — pre-PR diff review (this repo's reviewer is generic-purpose and well-tuned; see `.claude/agents/code-reviewer.md`). Returns ordered findings with severity. Does not edit code.
- Other agents (`typescript-reviewer`, `build-error-resolver`, `planner`, `tdd-guide`, `team-*`) — kept from earlier setup, useful for specific situations (build breaks, planning, paired-team mode).

## Slash commands

Inventory-tool flow (Claude — see `.claude/commands/`):
- `/new-story "<title>"` — scaffold a new story in `backlog/todo/` with the next `OQ-XXX` id.
- `/start-story OQ-XXX` — DOR check, branch off `dev`, move file to `in-progress/`, commit.
- `/finish-story OQ-XXX` — DOD check, move file to `done/`, prepare PR into `dev`.
- `/adr "<title>"` — scaffold a new ADR in `docs/architecture/`.

Earlier helpers (Claude): `/plan`, `/build-fix`, `/code-review`, `/test-coverage`, `/team`.

Codex users: equivalents of the inventory-tool flow in `.codex/prompts/` (manual install per `.codex/prompts/README.md`) or follow the manual checklist in `backlog/README.md`.

## Code style (essentials)

Full guide: `docs/contributing.md` and the `## Templates and Patterns` section below. Operational essentials:

```typescript
// Phaser-managed properties
private player!: Player

// Type imports for interfaces only
import type { Dialogue } from '../types'

// Always add objects to the scene after construction
const player = new Player(this, x, y, 'player')
this.add.existing(player)

// Cross-scene communication via events; clean up in shutdown()
this.game.events.on('questCompleted', this.onQuestCompleted, this)
// ...
shutdown() {
  this.game.events.off('questCompleted', this.onQuestCompleted, this)
}

// Toast for user notifications; never console.log
ToastManager.getInstance(this.game).show({ text: 'Сохранено', variant: 'success' })
```

- Scene key must match class name.
- Singleton managers for global state. Constructor `private`. First `getInstance` call passes `game`.
- New career paths: drop a file in `src/data/careerPaths/<name>.ts`, register in `careerPaths/index.ts`.
- New skill matrices: `src/data/skillMatrices/<role>.ts`, register in `skillMatrices/index.ts`.

## What not to do

- Don't commit to `main` or `dev` directly. Always feature branch + PR.
- Don't skip DOR/DOD "just this once".
- Don't bypass the test layer. Managers get unit tests; new user-visible flows on critical paths get Playwright coverage.
- Don't introduce a new dependency without a one-line justification in the PR.
- Don't put ad-hoc notes in the repo root — they belong in `docs/`.
- Don't put `console.log`, `any`, or hardcoded magic numbers into shipped code.
- Don't edit an accepted ADR or a merged migration — supersede it.
- Don't expose the OpenRouter API key in client code. All LLM calls go through `server/`.
- Don't hand-edit the contents of `inputs/`. If a brief evolves, add a new dated brief.

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

BAD — scene key does not match class name; managers initialised in constructor; missing `shutdown`. (`this.game` is undefined in constructor.)

### Creating a Physics Game Object (Player, NPC, Item)

Physics objects extend `Phaser.Physics.Arcade.Sprite`. They must call `scene.physics.add.existing(this)` in the constructor.

```typescript
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-texture')
    scene.physics.add.existing(this)
    this.setImmovable(true)
    this.setScale(2)
    this.setOrigin(0.5, 0.5)
    this.body!.setSize(16, 20)
    this.body!.setOffset(8, 22)
  }
}
```

In scene:

```typescript
const enemy = new Enemy(this, 100, 200)
this.add.existing(enemy)
enemy.setDepth(10)
```

BAD — forgetting `scene.physics.add.existing(this)`; forgetting `this.add.existing(...)` in scene; accessing `this.body` without `!`.

### Creating a Singleton Manager

```typescript
export class ExampleManager {
  private static instance: ExampleManager
  private game: Phaser.Game

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): ExampleManager {
    if (!ExampleManager.instance) {
      if (!game) throw new Error('ExampleManager.getInstance: pass `game` on first call')
      ExampleManager.instance = new ExampleManager(game)
    }
    return ExampleManager.instance
  }
}
```

In tests, reset between cases:

```typescript
beforeEach(() => {
  vi.resetModules()
})

it('does the thing', async () => {
  const { ExampleManager } = await import('../managers/Example')
  const mgr = ExampleManager.getInstance(mockGame as any)
  // ...
})
```

### Adding a Career Path

1. `src/data/careerPaths/<name>.ts` — export `<NAME>_CAREER_PATH: CareerPath`.
2. Add to `CAREER_PATHS` in `src/data/careerPaths/index.ts`.
3. Update the `requirements_ref` story (`docs/requirements/11-career-paths.md`) — add the path, NPC mentor, grades, domains.
4. The path appears in choice dialogues and the assessment / Skill Tree UI automatically.

### Adding a Toast notification

```typescript
import { ToastManager } from '../managers/Toast'

ToastManager.getInstance(this.game).show({
  text: 'Грейд повышен!',
  variant: 'success',
  durationMs: 4000,
})
```

Toasts of the same `variant` queue (don't stack); different `variant`s render side-by-side.
