---
description: Move a story from todo/ to in-progress/ and create its feature branch off dev.
argument-hint: "OQ-XXX"
---

The user wants to start work on story **$ARGUMENTS**.

Do the following:

1. Validate the argument matches `OQ-\d{3}`. If not, ask for a correct id.
2. Find the file: `backlog/todo/OQ-XXX-*.md`. Exactly one match expected.
   - If zero matches: report and stop. Maybe it is already in progress, already done, or does not exist.
   - If multiple matches: report all and ask the user which one.
3. Read the story file. Verify the DOR checklist is fully ticked.
   - If any DOR item is unticked: **do not proceed**. Report which items block start; ask the user to address them (or confirm an override, in which case note the override in the story's Changelog).
4. Verify the working tree is clean.
   - If dirty: refuse and ask the user to stash or commit first.
5. Switch to `dev` and pull: `git checkout dev && git pull`.
   - If the user is on a different branch with uncommitted work, refuse.
6. Create and check out a feature branch off `dev`. Branch prefix from the story's `type` frontmatter:
   - `feature` → `feature/`
   - `bug` → `bugfix/`
   - `refactor` → `refactor/`
   - `docs` → `docs/`
   - default → `feature/`
   Branch name: `<prefix>OQ-XXX-<slug>` (reuse the slug from the filename).
7. `git mv backlog/todo/OQ-XXX-<slug>.md backlog/in-progress/OQ-XXX-<slug>.md`.
8. Update the story file's frontmatter: `status: in-progress`.
9. Append a changelog line: `- YYYY-MM-DD — started on branch <branch-name> (off dev).`
10. Commit: `chore(OQ-XXX): start story`.
11. Report to the user: branch created, story moved, clear next step ("begin with a failing Vitest test for AC-1").

Do not push the branch automatically — the user pushes when they are ready. PRs target `dev`, not `main`.
