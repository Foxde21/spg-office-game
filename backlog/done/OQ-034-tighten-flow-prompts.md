---
id: OQ-034
title: Tighten /start-story and /finish-story prompts to keep status / changelog / move atomic
epic: docs
type: docs
estimate: 2
status: done
created: 2026-04-29
owner: unassigned
depends_on: []
blocks: []
requirements_ref:
  - backlog/README.md#manual-checklists-for-codex-cli--no-tool-users
source_ref:
  - backlog/done/OQ-033-adr-ai-proxy-fallback.md (changelog notes — surfaced rough edges)
api_ref: []
---

# OQ-034 — Tighten `/start-story` and `/finish-story` prompts to keep status / changelog / move atomic

## User story

As a **contributor walking the flow** (especially a junior on first contribution),
I want **the slash-command prompts to make it impossible to forget the frontmatter status flip and changelog line that go together with the file move**,
so that **I don't end up with a "complete story" commit that didn't actually mark the story complete, and our git log doesn't drift from reality**.

## Scope

**In:**
- `.claude/commands/start-story.md`, `.codex/prompts/start-story.md` — handle the untracked-from-`/new-story` case explicitly; merge steps 7-10 into one atomic block with a pre-commit verification check.
- `.claude/commands/finish-story.md`, `.codex/prompts/finish-story.md` — same atomic block + verification for the move + status `done` + AC ticks + changelog.
- `.claude/commands/new-story.md`, `.codex/prompts/new-story.md` — note that the file is left **untracked**; `/start-story` will pick it up. (Removes the implicit assumption that the BA commits the draft on `dev` — they can't.)
- `backlog/README.md` — manual checklists ("for Codex CLI / no-tool users") mirror all of the above.

**Out:**
- Hooks (e.g. a pre-commit hook that auto-flips status). Worth considering separately; not in this PR. The educational target audience benefits more from a *visible explicit step* than from invisible automation.
- Changes to the story template itself (`backlog/_template.md`) — its content is fine.

## Acceptance criteria

- [x] AC-1 — `.claude/commands/start-story.md` and `.codex/prompts/start-story.md` describe (a) the case where the story file is untracked (default after `/new-story`) — branch first, then move via `mv` and `git add`; (b) a single atomic block where the move + frontmatter `status: in-progress` + changelog line are staged and committed together; (c) an explicit "before `git commit`, verify the staged content" sanity step.
- [x] AC-2 — `.claude/commands/finish-story.md` and `.codex/prompts/finish-story.md` describe a single atomic block where the move + `status: done` + AC ticks + changelog are staged and committed together; with the same pre-commit verification step.
- [x] AC-3 — `.claude/commands/new-story.md` and `.codex/prompts/new-story.md` explicitly state the file is left **untracked** and that `/start-story` (or its manual equivalent) handles staging on the feature branch — no `git add` or commit on `dev`.
- [x] AC-4 — `backlog/README.md` "Manual checklists" mirrors all three — same atomicity, same untracked-handling, same verification step.
- [x] AC-5 — Walking the new prompts on this story produced **three commits** (`chore: start story` + `docs: implementation` + `chore: complete story`), with **zero fix-up commits** of the kind OQ-033 had (`chore: mark in-progress`, `chore: mark done — AC ticked`). Original AC wording said "two", which was imprecise — corrected to reflect the start + impl + complete pattern.

### Non-happy paths

- [ ] If a contributor has uncommitted unrelated changes when running `/start-story`, the prompts still refuse (existing behaviour); the only relaxation is for the OQ-XXX file from `/new-story` being untracked.

## Design notes

The fix is wording-only — no automation. Reasons:

- **Educational legibility.** Junior contributors should *see* the flip happen. A pre-commit hook hides it.
- **Cross-tool parity.** Codex users follow the same prompts; hooks would diverge tool-to-tool.

The atomic block looks like this in pseudo-shell (start-story version):

```bash
# branch off dev (after dev is up to date, working tree clean modulo the OQ-XXX draft)
git checkout dev && git pull
git checkout -b <branch>

# stage the move + edits together
mv backlog/todo/OQ-XXX-<slug>.md backlog/in-progress/        # plain mv; file was untracked
# edit frontmatter: status: in-progress
# append changelog line: - YYYY-MM-DD — started on branch <name> (off dev)
git add backlog/in-progress/OQ-XXX-<slug>.md

# pre-commit sanity (NEW step)
grep -E '^status: in-progress$' backlog/in-progress/OQ-XXX-<slug>.md && \
  grep -F "started on branch" backlog/in-progress/OQ-XXX-<slug>.md \
  || echo "ABORT: status / changelog not updated"

# commit
git commit -m "chore(OQ-XXX): start story"
```

The Claude prompt doesn't need shell — it just needs to spell out the same logic in numbered steps so the agent doesn't split them.

## API impact

None.

## Data / save model impact

None.

## Test strategy

- **Unit / E2E:** none — doc-only.
- **Manual verification (AC-5):** count the commits on the OQ-034 feature branch — should be two `chore` commits framing the implementation commits.

## Open questions

- [ ] Should we also add a follow-up story for a pre-commit hook (out-of-scope per the design notes)? Logged here, not auto-converted to a story.

## DOR

Gate: [backlog/dor.md](../dor.md). Tick here when met — the story cannot move to `in-progress/` otherwise.

- [x] User story in canonical form
- [x] Acceptance criteria testable
- [x] Scope explicit
- [x] `requirements_ref` points at `backlog/README.md#manual-checklists` (the canonical manual flow)
- [x] `source_ref` linked (the OQ-033 changelog where the rough edges were surfaced)
- [x] Dependencies resolved or mocked
- [x] Estimate set (2 SP — small doc story across 7 files)
- [x] Test strategy drafted (manual verification via commit count)

## DOD

Gate: [backlog/dod.md](../dod.md). Tick in the PR, not here.

## Changelog

- 2026-04-29 — created. DOR green; surfacing the OQ-033 rough edges into a one-shot fix.
- 2026-04-29 — started on branch `docs/OQ-034-tighten-flow-prompts` (off dev).
- 2026-04-29 — implementation: 7 files updated (3 Claude commands, 3 Codex prompts, backlog/README.md). Atomic blocks + pre-commit sanity in start/finish; untracked-file handling in new/start; manual checklists mirror.
- 2026-04-29 — completed; PR pending. AC-1..5 ticked; AC-5 wording corrected (3-commit pattern, zero fix-ups).
