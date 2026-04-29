# 11 — Career paths

Source: `docs/game-design.md` v2 § "Карьерные пути"; `docs/architecture.md` v2 § "Career Path Registry (plugin-система)"; shipped `011-ai-career-branch.md`; pending `019-career-path-registry.md`, `026-027-028-*` (Engineering / Product+Design / Analytics+HR+QA).

## Plugin architecture

Each career path is a **data module** in `src/data/careerPaths/`. Adding a path = creating one file + registering it. No core type changes.

```
src/data/careerPaths/
  index.ts          # CAREER_PATHS array; getCareerPath(id); getAllCareerPaths()
  ai.ts             # AI_CAREER_PATH (shipped: 4 levels, 8 domains, ML Fundamentals 12 questions)
  engineering.ts    # (story 026)
  product.ts        # (story 027)
  design.ts         # (story 027)
  qa.ts             # (story 028)
  analytics.ts      # (story 028)
  hr.ts             # (story 028)
  management.ts     # (future)
```

### Adding a new path

1. Create `src/data/careerPaths/<name>.ts`.
2. Export `const <NAME>_CAREER_PATH: CareerPath` with: `id`, `levels`, `domains`, `mentorNpcId`, `questions`.
3. Register in `src/data/careerPaths/index.ts` (`CAREER_PATHS` array).
4. Update `docs/requirements/11-career-paths.md` (this file) — add the path's row, mentor, grades, domains.
5. The path appears in the choice picker, assessments, and Skill Tree automatically.

## Paths and grades

| Path        | Grade 1            | Grade 2          | Grade 3          | Top grade           | Mentor NPC                         |
| ----------- | ------------------ | ---------------- | ---------------- | ------------------- | ---------------------------------- |
| AI / ML     | AI Junior          | AI Middle        | AI Senior        | AI Architect        | `petya-senior` + `professor-neuro` |
| Engineering | Junior Dev         | Middle Dev       | Senior Dev       | Solution Architect  | `tim-lead`                         |
| Product     | Junior PM          | PM               | Senior PM        | CPO                 | `olga-product`                     |
| Design      | Junior Designer    | Designer         | Senior Designer  | Design Lead         | `lesha-designer`                   |
| QA          | Junior QA          | QA               | Senior QA        | QA Architect        | `masha-qa`                         |
| Analytics   | Junior Analyst     | Analyst          | Senior Analyst   | Head of Analytics   | `igor-analyst`                     |
| HR / People | HR Junior          | HR BP            | Senior HR BP     | CHRO                | `anna-hr`                          |
| Management  | Team Lead          | Eng Manager      | Director         | VP / CTO            | `director`                         |

## Domains (per path)

A path has 4–8 competency domains. Each domain holds a question pool (see [10-assessments.md](10-assessments.md#question-shape)).

### AI / ML (shipped)

ML Fundamentals · Data Engineering · Deep Learning · NLP/LLMs · Computer Vision · MLOps · System Design · AI Ethics

### Other paths

Domains for Engineering, Product, Design, QA, Analytics, HR, Management are deliberately **not enumerated here yet** — they will be specified by the BA when the corresponding story (026-028) reaches DOR. Source material: `docs/spg-skill-matrix/<role>_skills_export.md`.

## Choice flow

(Mirrors [01-core-loop.md](01-core-loop.md#choice-flow-current-behaviour); summarised here.)

- Trigger: `respect ≥ 20` AND `flags.careerPathChosen === false`.
- Each mentor NPC has a `career-choice-*` dialogue that "sells" their path in their personality's tone.
- Player accepts via `setCareerPath:<pathId>` action.
- After the choice, NPCs may have a `career-react-<pathId>` dialogue.
- Q11 (`00-index.md`): is the choice terminal, or can a player switch? Currently treated as terminal.

## Acceptance criteria

- AC-1 — Adding a new path requires only creating `src/data/careerPaths/<name>.ts`, registering in `index.ts`, and updating this requirement file. No changes to `AssessmentManager`, `GameState`, types, or scenes.
- AC-2 — `getCareerPath(id)` returns `undefined` for unknown ids — never throws.
- AC-3 — Every path's `mentorNpcId` references a real NPC in [06-npcs.md](06-npcs.md).
- AC-4 — Every path's domains have at least one question of difficulty 1, otherwise the assessment session cannot start.
- AC-5 — `setCareerPath` is idempotent against `flags.careerPathChosen === true` (no-op) unless Q11 changes the policy.
- AC-6 — Top grade is reachable iff the player completes the path's finale quest AND meets level thresholds — both gates required.

## Open questions

- Q1 — exact thresholds per level / path.
- Q11 — switching career paths mid-game.
