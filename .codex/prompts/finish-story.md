Verify DOD, move the story to `done/`, and prepare the PR into `dev`.

Argument: the story id, e.g. `OQ-042`.

The goal is **one atomic commit** that contains: the file move, the frontmatter `status: done`, every met AC ticked, and the new changelog line. Do not split these across commits.

Steps:

1. Validate the argument matches `OQ-\d{3}`.
2. Find the file: `backlog/in-progress/OQ-XXX-*.md`. Exactly one match expected.
3. Read the story. Walk the DOD checklist (`backlog/dod.md`) and map each item to evidence:
   - Tests green: `npm run test`. Run `npm run test:e2e` if the story touches a critical-path flow.
   - Build clean: `npm run build`.
   - `docs/api.md` reflects reality if the PR touched the AI proxy or save format.
   - `docs/requirements/<NN>-*.md` updated if behaviour or interpretation changed.
   - ADR added/updated if a non-trivial design call was made.
   - Conventional commits with story id in scope.
   - No orphan TODO / FIXME without a follow-up id.
   - Self-review pass against `git diff dev...HEAD` done.
4. If any DOD item is unmet: **do not proceed**. Report what is missing and stop.
5. **Atomic move + frontmatter update + AC ticks + changelog.** Do all five sub-steps before staging:
   - 5a. `git mv backlog/in-progress/OQ-XXX-<slug>.md backlog/done/OQ-XXX-<slug>.md` (file is tracked).
   - 5b. Edit: frontmatter `status: in-progress` → `status: done`.
   - 5c. Edit: tick every AC checkbox (`- [ ]` → `- [x]`) for ACs actually met.
   - 5d. Edit: append `- YYYY-MM-DD — completed; PR #<number if known>.`
   - 5e. **Pre-commit sanity check.** Read the moved file and verify: (a) `status: done`; (b) every met AC is `[x]`; (c) new changelog line present. Fix and re-verify if anything is missing.
6. Stage and commit, single commit:
   - `git add backlog/done/OQ-XXX-<slug>.md`
   - `git commit -m "chore(OQ-XXX): complete story"`
7. Open the PR (only if asked):
   - `git push -u origin <branch>`
   - `gh pr create --base dev` using `.github/pull_request_template.md`, with `Closes: OQ-XXX` and a one-paragraph summary. PR target is **dev**, not main.
8. Report: PR URL (if opened), reminder to request human review before merging into `dev`.

Never merge automatically. Never force-push. Releases (PRs from `dev` to `main`) are a separate, explicit step.
