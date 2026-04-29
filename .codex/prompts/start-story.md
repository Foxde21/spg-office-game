Move a story from `todo/` to `in-progress/` and create its feature branch off `dev`.

Argument: the story id, e.g. `OQ-042`.

The goal is **one atomic commit** that contains: the file move, the frontmatter `status: in-progress`, and the new changelog line. Do not split these across commits.

Steps:

1. Validate the argument matches `OQ-\d{3}`. If not, ask for a correct id.
2. Find the file: `backlog/todo/OQ-XXX-*.md`. Exactly one match expected.
   - If zero matches: report and stop.
   - If multiple matches: report all and ask the user which one.
3. Read the story file. Verify the DOR checklist is fully ticked.
   - If any DOR item is unticked: **do not proceed**. Report which items block start; ask the user to fix or override (override = note in Changelog).
4. Verify the working tree is clean **except for the OQ-XXX file itself**.
   - The story file is expected to be **untracked** at this point: `/new-story` created it and intentionally did not commit, because we never commit directly to `dev`.
   - If anything *else* is dirty: refuse and ask the user to stash or commit first.
5. Switch to `dev` and pull: `git checkout dev && git pull`.
6. Create and check out a feature branch off `dev`. Branch prefix from the story's `type` frontmatter:
   - `feature` → `feature/`
   - `bug` → `bugfix/`
   - `refactor` → `refactor/`
   - `docs` → `docs/`
   - default → `feature/`
   Branch name: `<prefix>OQ-XXX-<slug>` (reuse the slug from the filename).
7. **Atomic move + frontmatter update + changelog.** Do all four sub-steps before staging:
   - 7a. `mv backlog/todo/OQ-XXX-<slug>.md backlog/in-progress/OQ-XXX-<slug>.md`. Plain `mv`, not `git mv` — file is untracked.
   - 7b. Edit the moved file: change frontmatter `status: todo` → `status: in-progress`.
   - 7c. Edit the moved file: append a changelog line `- YYYY-MM-DD — started on branch <branch-name> (off dev).`
   - 7d. **Pre-commit sanity check.** Read the moved file and verify: (a) frontmatter reads `status: in-progress`; (b) the new changelog line is present. If either is missing, fix it now.
8. Stage and commit, single commit:
   - `git add backlog/in-progress/OQ-XXX-<slug>.md`
   - `git commit -m "chore(OQ-XXX): start story"`
9. Report: branch created, story moved, **one commit**, next step ("begin with a failing Vitest test for AC-1").

Do not push the branch automatically. PRs target `dev`, not `main`.
