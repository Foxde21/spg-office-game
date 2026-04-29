# 04 — Dialogues

Source: `docs/game-design.md` v2 § "Диалоги"; `docs/architecture.md` v2 § "Выбор карьерного пути (dialogue-driven)" and "Действия в DialogueChoice"; existing `Dialogue` / `DialogueChoice` types in `docs/api.md`; shipped stories `005-more-npcs-dialogues.md` (in-progress), `011-ai-career-branch.md` and `012-assessment-dialogues.md` (done).

## Dialogue tree

A `Dialogue` is a sequence of `DialogueLine`s. A line has a `speaker`, `text`, and optional `choices`. A choice optionally:

- Branches to a `nextDialogue`.
- Mutates state (`stress`, `respect`, item give / take, quest start / complete).
- Has a `condition` (item, respect, stress, flag) gating its visibility.
- Has an `action` string with a DSL of dialogue-actions (semicolon-separated).

## Choice effects

```ts
effects?: {
  stress?: number
  respect?: number
  giveItem?: string
  takeItem?: string
  startQuest?: string
  completeQuest?: string
}
```

Effects are atomic: all apply or none — if one operation cannot be satisfied (e.g. `takeItem` of a non-owned item), the whole choice fails and the player is told.

## Choice conditions

```ts
condition?: {
  hasItem?: string
  hasRespect?: number   // minimum
  hasStress?: number    // maximum
  flag?: string
}
```

A choice with a failing `condition` is **hidden**, not greyed-out (unless the design for that NPC explicitly wants tension — must be called out in the dialogue file).

## Dialogue actions DSL

Strings on `DialogueChoice.action`, semicolon-separated. UIScene parses and executes. Known verbs:

| Action                                   | Effect                                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `setFlag:<flagId>`                       | Sets `GameState.flags[flagId] = true`.                                                  |
| `setCareerPath:<pathId>`                 | Sets `PlayerData.careerPath` and `flags.careerPathChosen = true`.                       |
| `describeCareerPaths`                    | Show info screen listing available paths.                                               |
| `openCareerPathsSelect`                  | Open the career-path picker.                                                            |
| `showCareerPathsSelect`                  | Placeholder for the picker overlay (used inside resume flow).                           |
| `showCareerPathsSelectResume`            | Same as above, but resumes the parent dialogue afterwards.                              |
| `startAssessment:<pathId>:<domainId>`    | Hand off to `AssessmentManager` (see [10-assessments.md](10-assessments.md)). Domain may be omitted to invoke the domain picker. |
| `finishAssessment`                       | Force-end the current session (used by "Итог" choice).                                  |

Additions to this list are documented here, not in scattered story files.

## Start-dialogue resolution

When the player triggers a dialogue with an NPC, `NPC.getDialogue()` resolves to the start dialogue id by checking, in order:

1. **Career-path reaction:** if `flags.careerPathChosen` and an NPC dialogue with id `career-react-<pathId>` exists, use it.
2. **Career-path choice:** if `respect ≥ 20` and `!flags.careerPathChosen` and an NPC dialogue with id starting with `career-choice-` exists, use it.
3. **AI dialogue:** if the NPC is AI-flagged, return a special "AI" payload (see [AI-driven dialogue](#ai-driven-dialogue)).
4. **Default:** the first dialogue in the NPC's `dialogues` array (typically `intro`).

## NPC memory

NPCs persist `seenDialogues: string[]`. Dialogue lines may branch on whether a particular dialogue id was previously seen. Implementation: see `NPCState` in [06-npcs.md](06-npcs.md).

## AI-driven dialogue

Some dialogues use the AI proxy server for dynamic responses. Contract lives in `docs/api.md`.

- AI calls go through `server/`. Browser never holds the OpenRouter key.
- AI dialogue lines are structurally identical to scripted ones (same `DialogueLine` shape).
- Q8 (`00-index.md`): fallback behaviour when the AI proxy is unreachable — scripted fallback line, retry, or silent skip.

## Assessment dialogues

A separate dialogue mode triggered by `startAssessment:*`. The assessor NPC presents a work situation, the player picks an answer (3-4 options), the NPC gives feedback, and the session continues for 3-5 questions. See [10-assessments.md](10-assessments.md) for full mechanics; the *dialogue-side* contract:

- Each session question renders as a single dialogue line with choices.
- Each choice's `score: 0..100` is shown via NPC feedback after selection.
- After feedback, two follow-up choices: "Следующий вопрос" or "Итог".
- After "Итог", session summary line(s) render: average score, domain progress (before / after), level-up message if thresholds met.

## Acceptance criteria

- AC-1 — `startDialogue(dialogue)` displays the first line; the dialogue UI blocks player movement until `endDialogue`.
- AC-2 — Choices with failing `condition` are not rendered (hidden by default).
- AC-3 — Choosing an option emits `dialogueChoice` with `{ choice, npc }`; effects apply atomically before the next line is shown.
- AC-4 — `seenDialogues` updates exactly once when a dialogue is completed (reaching a line with no `choices` and no `nextDialogue`, or via explicit `endDialogue`).
- AC-5 — AI proxy failure is handled per Q8 outcome — never crashes the dialogue UI.
- AC-6 — Career-choice and career-react resolution rules are deterministic and follow the order above.
- AC-7 — `setCareerPath:<id>` is idempotent against `flags.careerPathChosen === true` (does nothing if already set, unless Q11 changes the policy).
- AC-8 — Unknown action verbs are logged once and skipped, not crashing.

## Open questions

- Q8 — AI proxy fallback policy.
- Q11 — career path switching mid-game (changes idempotency of `setCareerPath`).
