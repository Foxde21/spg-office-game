# Codex CLI prompts

Mirrors of the `.claude/commands/` slash commands, written so they can be used by Codex CLI users.

## How to use

Codex CLI loads custom prompts from `~/.codex/prompts/` (global, per-user). To make these available as `/new-story`, `/start-story`, etc.:

```bash
mkdir -p ~/.codex/prompts
cp .codex/prompts/{new-story,start-story,finish-story,adr}.md ~/.codex/prompts/
```

Re-copy after pulling repo changes. Or symlink if you only work on this project:

```bash
ln -s "$(pwd)/.codex/prompts/new-story.md"    ~/.codex/prompts/new-story.md
ln -s "$(pwd)/.codex/prompts/start-story.md"  ~/.codex/prompts/start-story.md
ln -s "$(pwd)/.codex/prompts/finish-story.md" ~/.codex/prompts/finish-story.md
ln -s "$(pwd)/.codex/prompts/adr.md"          ~/.codex/prompts/adr.md
```

## Prefer not to install?

Just open the prompt file you need and follow the steps manually — they are also summarised as plain checklists in `backlog/README.md`.

## Why these duplicate `.claude/commands/`

Claude Code reads `.claude/commands/` automatically; Codex CLI does not. Keeping the two in sync by hand is acceptable because the prompts change rarely. If you change one, change the other.
