# 10 — Assessments

Source: `docs/game-design.md` v2 § "Система ассесментов"; `docs/architecture.md` v2 § "Система ассесментов"; shipped `009-competency-matrix-types.md`, `010-assessment-manager.md`, `012-assessment-dialogues.md`; pending `016-competency-content-expansion.md`, `017-assessment-npc-roles.md`, `018-ai-architect-finale.md`.

## Goal

Replace quest counts with **NPC-driven assessments** as the canonical promotion signal. Assessments mix work-situation questions with feedback, build per-domain progress, and feed Skill Insights for cross-cutting analytics.

## AssessmentManager

Singleton, **career-path-agnostic**:

- `setCareerPath(pathId)` — loads the path's data (levels, domains, questions) from the registry (see [11-career-paths.md](11-career-paths.md)).
- `startSession(domainId)` — opens a session in the chosen domain.
- `submitAnswer(choiceIndex)` — records the answer's score, picks next question (adaptive — see below) or signals "session ready to summarise".
- `summarise()` — returns session summary (avg, deltas, level-up flag).
- `getDomainProgress(domainId)` — per-domain aggregate score and depth.
- `getOverallProgress()` — by path, used by the promotion gate.

## Session flow

1. Player opens dialogue with an assessor NPC.
2. NPC offers domain choice (only domains unlocked by current grade and the path's unlock graph).
3. If `stress > 80`, session aborts with "Ты выглядишь уставшим…" (see [02-stress-respect.md](02-stress-respect.md#assessment-interaction)).
4. Otherwise: 3-5 questions, each rendered as a dialogue line with 3-4 answer choices.
5. After each answer: NPC feedback (1-line sting + the educational explanation of the correct approach).
6. Player picks "Следующий вопрос" / "Итог".
7. On "Итог": session summary line(s) — average score, domain progress before/after, level-up message if thresholds met. (See [01-core-loop.md](01-core-loop.md#promotion-per-path).)
8. If domain runs out of questions: player can pick another domain, or restart this domain (resets domain progress).

## Question shape

```ts
interface AssessmentQuestion {
  id: string
  domainId: string
  difficulty: 1 | 2 | 3 | 4
  prompt: string                       // a work situation, not an exam question
  choices: Array<{
    text: string
    score: 0..100                      // continuous, not binary
    feedback: string                   // NPC's reaction line
    competencyTags: string[]           // for Skill Insights
    correctRationale?: string          // educational followup
  }>
}
```

Authoring rule: prompts describe **work situations**, never exam-style "what is X?" questions.

## Adaptive difficulty

After each answer, the next question's `difficulty` adapts:

- Score 0–25 → next difficulty 1
- Score 26–55 → maintain
- Score 56–84 → +1
- Score 85+ → +2 (capped at 4)

Difficulty modifier from game-difficulty (see [01-core-loop.md](01-core-loop.md#difficulty)) shifts the resolved difficulty up or down by 1. If no question of the required difficulty exists, the closest available is picked.

## Skill Insights

Each answer's `competencyTags` accumulate in `SkillInsightsManager` (per-tag aggregate). Skill Insights drive:

- The "tag cloud" in the Skill Tree UI (see [09-ui-menus.md](09-ui-menus.md)).
- Cross-path views ("you're strong in `system-design` regardless of path").
- Side-quest unlocks and dialogue branching (planned).

Q10 (`00-index.md`): the precise distinction between `SkillInsightsManager` and the Skill Tree UI surface needs an ADR — overlapping concerns today.

## Promotion check

Run by `AssessmentManager.summarise()`. Promotion succeeds iff:

- `avgScoreAcrossDomains >= currentLevel.minAvgScore`
- `domainScore >= currentLevel.minPerDomain` for every domain
- `stress < 70`

On success: emit `careerLevelUp` with `{ path, level }`, persist new grade to save, fire a Toast.

Q1 (`00-index.md`): exact thresholds per level / path are TBD.

## Acceptance criteria

- AC-1 — `setCareerPath` swaps the entire question pool / level table; existing session is aborted with a warning.
- AC-2 — `startSession` refuses if `careerPath` not set, if `domainId` is locked, or if `stress > 80`.
- AC-3 — A session always ends with a summary; users cannot "leak" a session into the next dialogue.
- AC-4 — Domain progress persists across sessions and saves (see [08-save-load.md](08-save-load.md)).
- AC-5 — `competencyTags` from every answer feed `SkillInsightsManager` exactly once per answer.
- AC-6 — Adaptive difficulty selection is deterministic given the same score sequence and pool.
- AC-7 — Promotion check runs on summary; `careerLevelUp` event fires before the summary line is drawn.
- AC-8 — A domain with no remaining questions tells the player and offers reset / switch domain — does not loop or crash.

## Open questions

- Q1 — level thresholds.
- Q2 — Skill Insights ↔ respect / relationship composition.
- Q5 — game difficulty composition with adaptive difficulty.
- Q10 — Skill Tree vs Skill Insights ADR.
