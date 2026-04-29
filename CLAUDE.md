@AGENTS.md

# Notes for Claude Code sessions

`AGENTS.md` (imported above) is the canonical guide for any AI coding agent on this repo (Claude Code, Codex CLI). Anything tool-specific lives below.

## Subagents

Three roles, one per concern. Codex users open the same files and play the role manually.

- `ba-analyst` — owns `docs/requirements/` and `inputs/`. Turns briefs / mockups / skill-matrix exports into DOR-compliant stories. No code.
- `game-dev` — Phaser 3 + TypeScript work, TDD-first. Touches `src/`, `server/`, `tests/`, `e2e/`.
- `code-reviewer` — pre-PR diff review. Returns ordered findings with severity. Does not edit code.

For complex planning or refactoring: use the **built-in `Plan` agent** (Claude Code provides it) — there is no project-level planner subagent, intentionally.

## Slash commands

Story flow (Claude — see `.claude/commands/`):
- `/new-story "<title>"` — scaffold a new story in `backlog/todo/` with the next `OQ-XXX` id.
- `/start-story OQ-XXX` — DOR check, branch off `dev`, move to `in-progress/`, commit.
- `/finish-story OQ-XXX` — DOD check, move to `done/`, prepare PR into `dev`.
- `/adr "<title>"` — scaffold a new ADR in `docs/architecture/`.

Codex users: equivalents in `.codex/prompts/` (install via `cp` to `~/.codex/prompts/`) or follow the manual checklist in `backlog/README.md`.

## Critical Phaser / TS patterns (quick reference)

Full templates and bad-pattern examples in the `## Templates and Patterns` section of `AGENTS.md`. Highlights:

1. Physics objects: `scene.physics.add.existing(this)` in constructor → `this.add.existing(obj)` in scene.
2. Phaser `body` access: always `!` — `this.body!.setSize(...)`.
3. Event handlers: named methods, not arrow functions, so `.off()` works in `shutdown()`.
4. Singleton reset in tests: `vi.resetModules()` + re-import + `getInstance(mockGame as any)`.
5. Constants in `src/config.ts`; never inline magic numbers / strings.
6. `import type` for interfaces; no `any` outside tests.
7. New `LocationId` must be added to the union type in `src/types/Location.ts`.

## New here?

Read [`docs/guides/onboarding.md`](docs/guides/onboarding.md) — your first 30 minutes on the project.
