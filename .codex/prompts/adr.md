Create a new Architectural Decision Record.

Argument: a short title for the decision. If empty, ask for one before proceeding.

Steps:

1. Ensure `docs/architecture/` exists. If `docs/architecture/ADR-template.md` is missing, report and stop.
2. Determine the next ADR number.
   - List `docs/architecture/ADR-*.md`.
   - Parse the 4-digit number from every filename. Take `max + 1`, zero-padded to 4 digits.
   - If none, start at `0001`.
3. Produce a kebab-case slug from the title.
4. Copy `docs/architecture/ADR-template.md` to `docs/architecture/ADR-NNNN-<slug>.md`.
5. Fill in:
   - Title heading: `# ADR-NNNN — <title>`.
   - `Status: Proposed`.
   - `Date: <today YYYY-MM-DD>`.
   - `Deciders:` leave as a stub for the user.
6. Add the ADR to the index table in `docs/architecture/README.md`.
7. Do **not** commit. The ADR is a draft until the user fills it in and changes status to `Accepted`.
8. Report: path of the new file and the reminder to flip status to `Accepted` only after the decision is made (not speculatively).

If an ADR supersedes an existing one, ask the user for the superseded id and wire both sides (`Supersedes:` in the new ADR, `Superseded by:` in the old one) before returning.
