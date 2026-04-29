---
description: Move a story from todo/ to in-progress/ and create its feature branch off dev.
argument-hint: "OQ-XXX"
---

The user wants to start work on story **$ARGUMENTS**.

The goal is **one atomic commit** that contains: the file move, the frontmatter `status: in-progress`, and the new changelog line. Do not split these across commits.

Do the following:

1. Validate the argument matches `OQ-\d{3}`. If not, ask for a correct id.
2. Find the file: `backlog/todo/OQ-XXX-*.md`. Exactly one match expected.
   - If zero matches: report and stop. Maybe it is already in progress, already done, or does not exist.
   - If multiple matches: report all and ask the user which one.
3. Read the story file. Verify the DOR checklist is fully ticked.
   - If any DOR item is unticked: **do not proceed**. Report which items block start; ask the user to address them (or confirm an override, in which case note the override in the story's Changelog).
4. Verify the working tree is clean **except for the OQ-XXX file itself**.
   - The story file is expected to be **untracked** at this point: `/new-story` created it and intentionally did not commit, because we never commit directly to `dev`.
   - If anything *else* is dirty (other modified or untracked files): refuse and ask the user to stash or commit first.
5. Switch to `dev` and pull: `git checkout dev && git pull`.
   - If the user is on a different branch with uncommitted work: refuse.
6. Create and check out a feature branch off `dev`. Branch prefix from the story's `type` frontmatter:
   - `feature` → `feature/`
   - `bug` → `bugfix/`
   - `refactor` → `refactor/`
   - `docs` → `docs/`
   - default → `feature/`
   Branch name: `<prefix>OQ-XXX-<slug>` (reuse the slug from the filename).
7. **Atomic move + frontmatter update + changelog.** Do all four sub-steps before staging:
   - 7a. `mv backlog/todo/OQ-XXX-<slug>.md backlog/in-progress/OQ-XXX-<slug>.md`. Use plain `mv`, not `git mv` — the file is untracked and `git mv` would error.
   - 7b. Edit the moved file: change frontmatter `status: todo` → `status: in-progress`.
   - 7c. Edit the moved file: append a changelog line `- YYYY-MM-DD — started on branch <branch-name> (off dev).`
   - 7d. **Pre-commit sanity check.** Read the moved file and verify: (a) the frontmatter line reads `status: in-progress`; (b) the new changelog line is present. If either is missing, fix it now and re-verify. **Do not skip this check.**
8. Stage and commit, single commit:
   - `git add backlog/in-progress/OQ-XXX-<slug>.md`
   - `git commit -m "chore(OQ-XXX): start story"`
9. Report to the user: branch created, story moved, **one commit** (verify with `git log -1`), next step is "begin with a failing Vitest test for AC-1".

Do not push the branch automatically — the user pushes when they are ready. PRs target `dev`, not `main`.
