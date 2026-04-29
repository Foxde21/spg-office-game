# Definition of Done

A story is **done** only when every item below is true and the PR is merged into `dev`. (Release to `main` is a separate, explicit PR.) The story file then lives in `backlog/done/` and stays there — it is the project's trace.

## Code

- [ ] Every acceptance criterion from the story is demonstrably met.
- [ ] No `TODO` / `FIXME` left without a linked follow-up story id.
- [ ] No dead code, commented-out blocks, or `console.log`.
- [ ] No `any` in new TypeScript.
- [ ] Constants pulled from `src/config.ts`; no inline magic numbers / strings.
- [ ] Phaser event listeners cleaned up in scene `shutdown`.
- [ ] Dependency additions justified in the PR description (one line per dep).

## Tests

- [ ] Unit tests added or updated; `npm run test` green.
- [ ] E2E test added for any new user-visible flow on a critical path; `npm run test:e2e` green.
- [ ] Coverage does not regress (target maintained; see `docs/testing.md`).

## Contracts and docs

- [ ] `docs/api.md` reflects the shipped contract if the AI proxy or save format changed.
- [ ] `docs/requirements/<NN>-*.md` updated if interpretation of the design changed during implementation. Add a row to `docs/requirements/00-index.md` "Gaps & contradictions" if a new question surfaced.
- [ ] ADR added or updated under `docs/architecture/` if a non-trivial design decision was made. No design decisions hiding only in the PR description.

## Quality gates

- [ ] `npm run build` clean (TypeScript + Vite production build).
- [ ] `code-reviewer` subagent (Claude) or equivalent self-review (Codex) run; comments addressed or explicitly deferred.
- [ ] CI is green on the PR.

## Process

- [ ] Commits follow Conventional Commits with the story id in scope: `feat(OQ-042): ...`.
- [ ] PR title mirrors the commit subject; description references the story file and this checklist.
- [ ] PR target is `dev` (not `main`).
- [ ] Story file `git mv`d from `in-progress/` to `done/` in the same PR.
- [ ] Human reviewer approved.
