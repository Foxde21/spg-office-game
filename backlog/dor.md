# Definition of Ready

A story is **ready to start** when all of the following are true. If any item cannot be ticked, the story stays in `todo/` and the blocker is captured in the **Open questions** section of the story.

## Story content

- [ ] **User story** is in the canonical form (`As a <role>, I want <capability>, so that <outcome>`).
- [ ] **Acceptance criteria** are concrete, testable, and phrased as observable behaviour — not implementation steps.
- [ ] **Scope** is explicit: what is in, what is out.
- [ ] **Source linked** — relevant section of `docs/requirements/<NN>-*.md` referenced from the story (`requirements_ref` frontmatter). Add `source_ref` to the brief / mockup in `inputs/` when the story comes from raw stakeholder input.

## Design

- [ ] **UI / scene stories:** mockup or wireframe path referenced (under `docs/` or `inputs/`).
- [ ] **AI proxy stories:** endpoint, request/response schema, and prompt template drafted in `docs/api.md` (as a proposal, not yet merged).
- [ ] **Save / state stories:** new fields in `GameState` or save schema described; migration approach noted.
- [ ] **Asset stories:** required assets listed with target spec (size, format, tile dimensions).

## Dependencies

- [ ] Upstream stories blocking this one are merged, or a clear mock contract exists.
- [ ] No open critical question that would invalidate the approach.

## Sizing

- [ ] Estimated in story points (1, 2, 3, 5, 8, 13). If 13, the story is **split** before starting.
- [ ] Fits in one PR. If not, split.

## Test strategy

- [ ] Unit (Vitest) test approach named: which manager / module, which behaviour.
- [ ] E2E (Playwright) named only if the story crosses a major UX boundary (movement, dialogue, quest completion, save/load, scene transition). Not every story needs E2E.
- [ ] Non-happy paths listed in acceptance criteria.
