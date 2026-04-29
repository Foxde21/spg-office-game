---
description: Create a new Architectural Decision Record.
argument-hint: "<short title>"
---

The user wants to record a new architectural decision titled: **$ARGUMENTS**

Do the following:

1. If `$ARGUMENTS` is empty, ask for a title before proceeding.
2. Ensure `docs/architecture/` exists (it should — bootstrap step). If `docs/architecture/ADR-template.md` is missing, report and stop.
3. Determine the next ADR number.
   - List `docs/architecture/ADR-*.md`.
   - Parse the 4-digit number from every filename. Take `max + 1`, zero-padded to 4 digits.
   - If none, start at `0001`.
4. Produce a kebab-case slug from the title.
5. Copy `docs/architecture/ADR-template.md` to `docs/architecture/ADR-NNNN-<slug>.md`.
6. Fill in:
   - Title heading: `# ADR-NNNN — <title>`.
   - `Status: Proposed`.
   - `Date: <today YYYY-MM-DD>`.
   - `Deciders:` leave as a stub for the user.
7. Add the ADR to the index table in `docs/architecture/README.md`.
8. Do **not** commit. The ADR is a draft until the user fills it in and changes status to `Accepted`.
9. Report: path of the new file and the reminder to flip status to `Accepted` only after the decision is made (not speculatively).

If an ADR supersedes an existing one, ask the user for the superseded id and wire both sides (`Supersedes:` in the new ADR, `Superseded by:` in the old one) before returning.
