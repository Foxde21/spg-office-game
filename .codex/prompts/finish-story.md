Verify DOD, move the story to `done/`, and prepare the PR into `dev`.

Argument: the story id, e.g. `OQ-042`.

Steps:

1. Validate the argument matches `OQ-\d{3}`.
2. Find the file: `backlog/in-progress/OQ-XXX-*.md`. Exactly one match expected.
3. Read the story. Walk the DOD checklist (`backlog/dod.md`) and map each item to evidence:
   - Tests green: `npm run test`. Run `npm run test:e2e` if the story touches a critical-path flow.
   - Build clean: `npm run build`.
   - `docs/api.md` reflects reality if the PR touched the AI proxy or save format.
   - ADR added/updated if a non-trivial design call was made.
   - Conventional commits with story id in scope.
   - No orphan TODO / FIXME without a follow-up id.
   - Self-review pass against `git diff dev...HEAD` done.
4. If any DOD item is unmet: **do not proceed**. Report what is missing and stop.
5. If all DOD items are met:
   - `git mv backlog/in-progress/OQ-XXX-<slug>.md backlog/done/OQ-XXX-<slug>.md`.
   - Update frontmatter: `status: done`.
   - Append changelog: `- YYYY-MM-DD — completed; PR #<number if known>.`
   - Commit: `chore(OQ-XXX): complete story`.
6. Open the PR (only if asked):
   - Push the branch.
   - `gh pr create --base dev` using `.github/pull_request_template.md`, with `Closes: OQ-XXX` and a one-paragraph summary. PR target is **dev**, not main.
7. Report: PR URL (if opened), reminder to request human review before merging into `dev`.

Never merge automatically. Never force-push. Releases (PRs from `dev` to `main`) are a separate, explicit step.
