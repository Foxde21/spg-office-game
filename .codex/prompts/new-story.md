Create a new backlog story in `backlog/todo/` from the template.

Argument: a short title (the story title). If no argument is given, ask the user for a title before proceeding.

Steps:

1. Determine the next story id.
   - List `backlog/todo/`, `backlog/in-progress/`, and `backlog/done/`.
   - Parse `OQ-\d{3}` from filenames AND legacy `^\d{3}-` ids.
   - Take `max(both sets) + 1`, zero-padded to 3 digits.
   - If nothing found at all, start at `OQ-001`. Legacy ids on the project currently reach 032, so the first new story under the new flow is `OQ-033`.
2. Produce a kebab-case slug from the title (lowercase, alphanumeric, hyphen-separated, max ~40 chars).
3. Copy `backlog/_template.md` to `backlog/todo/OQ-XXX-<slug>.md`.
4. Fill in the frontmatter:
   - `id: OQ-XXX`
   - `title: <user-provided title>`
   - `status: todo`
   - `created: <today's date YYYY-MM-DD>`
   - Leave `epic`, `type`, `estimate`, `owner`, refs as stubs for the user to fill.
5. Replace the `# OQ-XXX — <title>` heading with the concrete id and title.
6. Add a first changelog entry: `- YYYY-MM-DD — created via codex /new-story.`
7. **Do not commit, and do not `git add`.** Leave the file **untracked** in the working tree. We never commit directly to `dev`; the file will be staged on the feature branch when `/start-story` runs (it expects an untracked OQ-XXX file by design).
8. Report to the user: the path of the created file, that it is intentionally untracked, and the next natural step ("fill in scope, ACs, design notes; when DOR is green, run `/start-story OQ-XXX`").
