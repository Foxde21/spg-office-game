@AGENTS.md

# Notes for Claude Code sessions

`AGENTS.md` (imported above) is the canonical guide for any AI coding agent on this repo (Claude Code, Codex CLI). Anything tool-specific lives below.

## Subagents (Claude-only)

- `game-dev` — Phaser 3 + TypeScript work, TDD-first.
- `ba-analyst` — turns design ideas / spec fragments into DOR-compliant stories; owns `docs/requirements/`.
- `code-reviewer` — pre-PR review against `dev` / `main`. (Generic-purpose reviewer; this project also has the inventory-tool-flow specific story-hygiene checks documented in the agent file.)
- `typescript-reviewer`, `build-error-resolver`, `planner`, `tdd-guide` — generic helpers from earlier setup, kept.
- `team-lead`, `team-implementor`, `team-reviewer`, `team-tester`, `team-content-writer` — alternative orchestrated team mode (`/team`).

Codex users do not have subagents; they read the role definitions in `.claude/agents/` and embody them manually.

## Slash commands

Inventory-tool flow (Claude):
- `/new-story`, `/start-story`, `/finish-story`, `/adr` — see `.claude/commands/`.

Pre-existing helpers (Claude):
- `/plan`, `/build-fix`, `/code-review`, `/test-coverage`, `/team`.

For Codex users: equivalents of the inventory-tool flow live in `.codex/prompts/` (install via `cp` / `ln -s` to `~/.codex/prompts/`) and as a manual checklist in `backlog/README.md`.

## Critical Phaser / TS patterns (quick reference)

For full templates and bad-pattern examples, see the `## Templates and Patterns` section in `AGENTS.md`. Highlights:

1. Physics objects: `scene.physics.add.existing(this)` in constructor → `this.add.existing(obj)` in scene.
2. Phaser `body` access: always `!` — `this.body!.setSize(...)`.
3. Event handlers: named methods, not arrow functions, so `.off()` works in `shutdown()`.
4. Singleton reset in tests: `vi.resetModules()` + re-import + `getInstance(mockGame as any)`.
5. Constants in `src/config.ts`; never inline magic numbers / strings.
6. `import type` for interfaces; no `any` outside tests.
7. New `LocationId` must be added to the union type in `src/types/Location.ts`.
