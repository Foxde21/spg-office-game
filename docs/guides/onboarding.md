# Onboarding — your first 30 minutes on Office Quest

Welcome. This is your guided walkthrough from "fresh clone" to "first PR opened". The flow is deliberately small and explicit so you spend mental energy on the *content* of your work, not on figuring out process.

> If you get stuck at any step, that's information — the doc is wrong or the project is. Open an issue or message the maintainer; don't push through silently.

---

## 0. Prereqs (5 min)

- Node.js 18+ and npm 9+.
- Git with a working `gh` CLI logged in (`gh auth status` succeeds).
- A code editor — anything works; the project uses TypeScript so a TS-aware editor (VS Code, JetBrains) is recommended.
- Optional: an LLM CLI (Claude Code or Codex CLI). Both are supported; pick whichever your team uses.

## 1. Clone and run (5 min)

```bash
git clone https://github.com/Foxde21/spg-office-game.git
cd spg-office-game
npm install
cp .env.example .env       # then fill OPENROUTER_API_KEY (see below)
npm run dev
```

Open http://localhost:3000. You should see the main menu, then be able to start a new game and walk around the office.

**About the `.env`:** for AI dialogue / assessments you need an OpenRouter API key (https://openrouter.ai/keys). If you skip this, the game still runs but AI dialogue lines will fail (graceful — see Q8 in `docs/requirements/00-index.md`).

## 2. The 5-file map (10 min)

You don't need to read everything before contributing. Read these five, in order:

| # | File | What you'll learn |
| - | ---- | ------------------ |
| 1 | [`README.md`](../../README.md) | Run / build / test commands. |
| 2 | [`AGENTS.md`](../../AGENTS.md) | Project orientation: where things live, workflow, conventions. **Skim** — don't memorise. |
| 3 | [`docs/requirements/00-index.md`](../requirements/00-index.md) | Module map and the open questions list. **This is what we're building.** |
| 4 | [`backlog/dor.md`](../../backlog/dor.md) and [`backlog/dod.md`](../../backlog/dod.md) | The two gates a story passes through. |
| 5 | [`backlog/roadmap.md`](../../backlog/roadmap.md) | What we're building when. |

## 3. Pick a story and own it (10 min)

The backlog lives in `backlog/{todo,in-progress,done}/`. Browse `backlog/todo/`. Stories use one of two formats:

- **Legacy** — files named `XXX-slug.md` (e.g. `013-skill-tree-ui.md`). Russian, predate the new flow.
- **New** — files named `OQ-XXX-slug.md` with frontmatter (`id`, `requirements_ref`, etc.). Use this for any new work.

For your first contribution, pick something **small and well-scoped**. If you're not sure which, ask the maintainer; or scan for stories with low `estimate` (1–3 SP) and clear AC.

If you have a *new* idea instead, run `/new-story "Your title"` (Claude Code) — or copy `backlog/_template.md` to `backlog/todo/OQ-XXX-<slug>.md` manually (Codex / no-tool). Fill in user story, acceptance criteria, scope, test strategy, `requirements_ref`. Stop when DOR is green.

## 4. The story lifecycle

```
backlog/todo/        ← DOR green
       │ /start-story
       ▼
backlog/in-progress/ ← branch off dev, TDD: red → green → refactor
       │ /finish-story
       ▼
backlog/done/        ← DOD green → PR into dev
```

- One story = one branch off `dev` = one PR into `dev`.
- Never commit to `main` or `dev` directly. Releases are a separate PR from `dev` to `main`.
- Each commit follows Conventional Commits with the story id in scope: `feat(OQ-042): wire skill-tree panel`.

## 5. TDD discipline

For every behaviour change:

1. **Red:** write a failing Vitest unit test (`tests/unit/...test.ts`) or Playwright spec (`e2e/...spec.ts`) named after the behaviour.
2. **Green:** smallest implementation that makes the test pass.
3. **Refactor:** keep the test green; `npm run build` clean.

If you find yourself implementing without a failing test, stop — write the test first. The discipline is the lesson.

## 6. Pre-PR

Before you open the PR:

```bash
npm run test          # all unit tests green
npm run test:e2e      # if you touched a critical-path flow
npm run build         # tsc + vite build clean
```

Then have the `code-reviewer` subagent walk the diff (Claude Code), or do an equivalent self-review pass (Codex): map each AC to a test or line of code, walk the DOD checklist honestly.

## 7. Open the PR

Use `/finish-story OQ-XXX` (Claude) or follow the manual checklist in [`backlog/README.md`](../../backlog/README.md). The PR template asks you to declare the target (`dev` or `main`) — pick `dev` unless you're cutting a release.

That's it. Wait for human review.

---

## Things to know

- **`docs/requirements/`** is the source of truth for *behaviour*. If the story changes behaviour, update the requirement file first (or log the question in `00-index.md` "Gaps & contradictions").
- **`docs/architecture/`** holds ADRs (Architectural Decision Records). Use `/adr "<title>"` when you make a non-trivial design call. Don't edit accepted ADRs — supersede them.
- **`docs/spg-skill-matrix/`** holds skill matrix exports for BA / Design / Product / QA / Software Dev. They drive `src/data/skillMatrices/` and the Skill Insights manager. The BA owns these.
- **`inputs/briefs/`** is frozen stakeholder material. Never edit; if vision evolves, add a new dated brief.

## Common confusions

- **"Where do I add a new dialogue?"** → `src/data/locations.ts` for that location's NPC. See `docs/requirements/04-dialogues.md` for the action DSL.
- **"Where do I add a new career path?"** → `src/data/careerPaths/<name>.ts` + register in `index.ts`. See `docs/requirements/11-career-paths.md`.
- **"My event listener leaks!"** → You forgot `.off()` in `Scene.shutdown`. The reviewer will catch it.
- **"My singleton manager is shared across tests!"** → `vi.resetModules()` in `beforeEach`, then re-import.
- **"I broke my save schema mid-development."** → Bump `version`, add a migration, write a fixture test. See `docs/requirements/08-save-load.md` and Q4 in `00-index.md`.

## When to ask vs when to ship

| Situation | Do |
| --- | --- |
| You're not sure how a feature should behave | Read the relevant `docs/requirements/<NN>-*.md`. If the answer isn't there, log a question in `00-index.md` "Gaps & contradictions" and ask the maintainer. **Don't guess and ship.** |
| You see a bug unrelated to your story | Open a tiny new story for it; don't drive-by-fix in your PR. |
| You hit a build error you don't understand | Read the error fully. If still stuck after 15 min, ask. Don't ask sooner — debugging *is* the work. |
| You disagree with a convention | Open an ADR (`/adr`) proposing the change. Don't quietly violate it. |

## Welcome aboard

The flow exists to keep your work reviewable and your future-self sane. If a step feels redundant, raise it — the flow itself is in scope for change, just like the code.
