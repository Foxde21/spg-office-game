---
description: Verify DOD, move the story to done/, and prepare the PR into dev.
argument-hint: "OQ-XXX"
---

The user wants to finish story **$ARGUMENTS**.

Do the following:

1. Validate the argument matches `OQ-\d{3}`.
2. Find the file: `backlog/in-progress/OQ-XXX-*.md`. Exactly one match expected.
3. Read the story. Walk the DOD checklist (`backlog/dod.md`) and map each item to evidence:
   - Tests green: run `npm run test`. Run `npm run test:e2e` if the story touches a critical-path flow.
   - Build clean: run `npm run build`.
   - `docs/api.md` reflects reality if the PR touched the AI proxy or save format.
   - ADR added/updated if a non-trivial design call was made.
   - Conventional commits with story id in scope.
   - No orphan TODO / FIXME without a follow-up story id.
   - `code-reviewer` subagent has been run.
4. If any DOD item is unmet: **do not proceed**. Report what is missing and stop. Ask the user to fix or explicitly defer (deferred items become new stories, not silent punts).
5. If all DOD items are met:
   - `git mv backlog/in-progress/OQ-XXX-<slug>.md backlog/done/OQ-XXX-<slug>.md`.
   - Update frontmatter: `status: done`.
   - Append changelog: `- YYYY-MM-DD — completed; PR #<number if known>.`
   - Commit: `chore(OQ-XXX): complete story`.
6. Open the PR (only if the user asks; otherwise instruct them to):
   - Push the branch.
   - `gh pr create --base dev` using `.github/pull_request_template.md`, with `Closes: OQ-XXX` and a one-paragraph summary. PRs target **dev**, not main.
7. Report to the user: PR URL (if opened), and the reminder to request human review before merging into `dev`.

Never merge the PR automatically. Never force-push. Releases (PRs from `dev` to `main`) are a separate, explicit step.
