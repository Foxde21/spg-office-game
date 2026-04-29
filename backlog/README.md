# Backlog

Kanban board implemented as markdown files. Each story is one `.md` file. Columns are folders.

```
backlog/
  todo/           Ready to start (DOR met).
  in-progress/    Actively worked, one feature branch open.
  done/           Merged into dev (or main).
  _template.md    Story template (new flow).
  dor.md          Definition of Ready.
  dod.md          Definition of Done.
  roadmap.md      Milestones / waves.
```

## Why folders and not Jira / GitHub Projects

- Stories live next to the code they describe and follow the same review process.
- `git mv` between folders gives a first-class, auditable history of when a story moved and why.
- No external tool to keep in sync; grep and diff work.

## Story lifecycle

1. **Create** — `/new-story "<title>"` (Claude) or copy `_template.md` manually (Codex / no-tool). Lands in `todo/` with a fresh `OQ-XXX` id.
2. **Refine** — fill in user story, acceptance criteria, design notes, open questions, `requirements_ref`. Gate: [DOR](dor.md).
3. **Start** — `/start-story OQ-XXX` (Claude) or follow the manual checklist below (Codex). `git mv todo/OQ-XXX-*.md in-progress/`, create branch off `dev`, commit.
4. **Work** — SDD + TDD. Keep the story file in sync if scope changes.
5. **Finish** — `/finish-story OQ-XXX` (Claude) or follow the manual checklist (Codex). Verify [DOD](dod.md), `git mv in-progress/OQ-XXX-*.md done/`, open PR into `dev`.
6. **Merge** — PR review and merge into `dev`. Releases are a separate PR from `dev` to `main`.

## Branching (3 tiers)

- `main` — release. PRs only from `dev`.
- `dev` — integration. PRs from feature branches.
- `feature/OQ-XXX-<slug>`, `bugfix/OQ-XXX-<slug>`, `refactor/OQ-XXX-<slug>`, `docs/OQ-XXX-<slug>` — work branches **off `dev`**.

**Never commit directly to `main` or `dev`.**

## Id convention

`OQ-XXX` (Office Quest), zero-padded sequential. Legacy ids (`001…032`) stay as-is in `backlog/{todo,in-progress,done}/` — they predate this flow. New stories use `OQ-`. Next id = `max(existing OQ-XXX, existing legacy XXX) + 1`.

Filename: `OQ-042-quest-reward-popup.md` — id, kebab-case slug. Do not rename after creation; the id is stable.

## Manual checklists (for Codex CLI / no-tool users)

The Claude slash commands automate these steps. If you are not using Claude Code, run them manually.

### `new-story` — equivalent

1. Compute next id: scan `backlog/{todo,in-progress,done}/`, max of `OQ-\d{3}` and legacy `^\d{3}-` + 1.
2. `cp backlog/_template.md backlog/todo/OQ-XXX-<slug>.md`
3. Fill frontmatter: `id`, `title`, `status: todo`, `created: YYYY-MM-DD`.
4. Replace heading with `# OQ-XXX — <title>`.
5. Add changelog line: `- YYYY-MM-DD — created.`
6. Do not commit yet — let scope/ACs land first.

### `start-story` — equivalent

1. Confirm DOR ticked in the story file.
2. Confirm working tree clean.
3. `git checkout dev && git pull`
4. `git checkout -b feature/OQ-XXX-<slug>` (or `bugfix/`, `refactor/`, `docs/` per story type).
5. `git mv backlog/todo/OQ-XXX-*.md backlog/in-progress/`.
6. Update frontmatter: `status: in-progress`. Append changelog: `- YYYY-MM-DD — started on branch <name> (off dev).`
7. `git commit -m "chore(OQ-XXX): start story"`.

### `finish-story` — equivalent

1. Walk DOD. Run `npm run test`, `npm run test:e2e` (if relevant), `npm run build`.
2. Self-review the diff (`git diff dev...HEAD`).
3. `git mv backlog/in-progress/OQ-XXX-*.md backlog/done/`.
4. Update frontmatter: `status: done`. Append changelog: `- YYYY-MM-DD — completed; PR #<n>.`
5. `git commit -m "chore(OQ-XXX): complete story"`.
6. `git push -u origin <branch>`.
7. `gh pr create --base dev` using `.github/pull_request_template.md`. PR target is **dev**, not main.

## Legacy stories (001-032)

Stories `001…032` predate the new flow. They use the older Russian-language template, do not have `OQ-` prefix, and may not have `requirements_ref` or formal user-story sections. They are valid scope; finishing them follows the same lifecycle (move through folders, branch off `dev`, PR into `dev`). New stories use the new template only.

If you decide to migrate a legacy story to the new template (e.g. before significant rework), use `git mv` to rename `XXX-slug.md` → `OQ-XXX-slug.md`, rewrite content from `_template.md`, and add a "Migrated from legacy" note in the changelog.

## Priorities

- **P0 (Critical)** — blocks release / gameplay
- **P1 (High)** — important functionality
- **P2 (Medium)** — improvements
- **P3 (Low)** — nice to have

## Story points

1 / 2 / 3 / 5 / 8 / 13. A `13` is an epic and must be split before it leaves DOR.
