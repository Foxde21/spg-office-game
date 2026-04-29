---
description: Verify DOD, move the story to done/, and prepare the PR into dev.
argument-hint: "OQ-XXX"
---

The user wants to finish story **$ARGUMENTS**.

The goal is **one atomic commit** that contains: the file move (`in-progress/` → `done/`), the frontmatter `status: done`, every met AC ticked, and the new changelog line. Do not split these across commits.

Do the following:

1. Validate the argument matches `OQ-\d{3}`.
2. Find the file: `backlog/in-progress/OQ-XXX-*.md`. Exactly one match expected.
3. Read the story. Walk the DOD checklist (`backlog/dod.md`) and map each item to evidence:
   - Tests green: run `npm run test`. Run `npm run test:e2e` if the story touches a critical-path flow.
   - Build clean: run `npm run build`.
   - `docs/api.md` reflects reality if the PR touched the AI proxy or save format.
   - `docs/requirements/<NN>-*.md` updated if behaviour or interpretation changed.
   - ADR added/updated if a non-trivial design call was made.
   - Conventional commits with story id in scope.
   - No orphan TODO / FIXME without a follow-up story id.
   - `code-reviewer` subagent has been run (or, for doc-only stories, an explicit self-review pass).
4. If any DOD item is unmet: **do not proceed**. Report what is missing and stop. Ask the user to fix or explicitly defer (deferred items become new stories, not silent punts).
5. **Atomic move + frontmatter update + AC ticks + changelog.** Do all five sub-steps before staging:
   - 5a. `git mv backlog/in-progress/OQ-XXX-<slug>.md backlog/done/OQ-XXX-<slug>.md`. The file is tracked at this point (committed during `/start-story`), so `git mv` is correct here.
   - 5b. Edit the moved file: change frontmatter `status: in-progress` → `status: done`.
   - 5c. Edit the moved file: tick every AC checkbox (`- [ ]` → `- [x]`) for ACs that are actually met. Cite the evidence (file:line, test name) in the changelog if non-obvious.
   - 5d. Edit the moved file: append a changelog line `- YYYY-MM-DD — completed; PR #<number if known>.` (PR number can be added in a follow-up edit if the PR is opened later.)
   - 5e. **Pre-commit sanity check.** Read the moved file and verify: (a) frontmatter reads `status: done`; (b) every AC the story claims is met is `[x]`; (c) the new changelog line is present. If anything is missing, fix it now and re-verify. **Do not skip this check.**
6. Stage and commit, single commit:
   - `git add backlog/done/OQ-XXX-<slug>.md`
   - `git commit -m "chore(OQ-XXX): complete story"`
7. Open the PR (only if the user asks; otherwise instruct them to):
   - Push the branch: `git push -u origin <branch>`.
   - `gh pr create --base dev` using `.github/pull_request_template.md`, with `Closes: OQ-XXX` and a one-paragraph summary. PRs target **dev**, not main.
8. Report: PR URL (if opened), and the reminder to request human review before merging into `dev`.

Never merge the PR automatically. Never force-push. Releases (PRs from `dev` to `main`) are a separate, explicit step.
