---
description: Create a new backlog story in backlog/todo/ from the template.
argument-hint: "<short title>"
---

The user wants to create a new backlog story titled: **$ARGUMENTS**

Do the following:

1. If `$ARGUMENTS` is empty, ask for a title before proceeding.
2. Determine the next story id.
   - List `backlog/todo/`, `backlog/in-progress/`, and `backlog/done/`.
   - Parse `OQ-\d{3}` from filenames AND legacy `^\d{3}-` ids.
   - Take `max(both sets) + 1`, zero-padded to 3 digits.
   - If nothing found at all, start at `OQ-001`. Legacy ids on the project currently reach 032, so the first new story under the new flow is `OQ-033`.
3. Produce a kebab-case slug from the title (lowercase, alphanumeric, hyphen-separated, max ~40 chars).
4. Copy `backlog/_template.md` to `backlog/todo/OQ-XXX-<slug>.md`.
5. Fill in the frontmatter:
   - `id: OQ-XXX`
   - `title: <user-provided title>`
   - `status: todo`
   - `created: <today's date YYYY-MM-DD>`
   - Leave `epic`, `type`, `estimate`, `owner`, refs as stubs for the user to fill.
6. Replace the `# OQ-XXX — <title>` heading with the concrete id and title.
7. Add a first changelog entry: `- YYYY-MM-DD — created via /new-story.`
8. Do **not** commit. Leave the file in the working tree so the user (or the `ba-analyst` subagent) can fill in scope and ACs, then decide when to commit.
9. Report to the user: the path of the created file and the next natural step ("fill in scope, ACs, design notes; when DOR is green, run `/start-story OQ-XXX`").
