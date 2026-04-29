# 06 — NPCs

Source: `docs/game-design.md` v2 § "Персонажи"; `src/data/npcPrompts.ts` for personalities; in-flight story `005-more-npcs-dialogues.md`.

## Roster

8 core NPCs (mentor / assessor for one career path each) + 1 path-specific NPC.

| Id              | Name               | Role          | Personality   | Career path mentor | Function in game                                      |
| --------------- | ------------------ | ------------- | ------------- | ------------------ | ----------------------------------------------------- |
| `tim-lead`      | Тим Лид            | Team Lead     | Mentor        | Engineering        | Main-arc quests; promotion gate; Engineering choice.  |
| `anna-hr`       | Анна HR            | HR Manager    | Friendly      | HR / People        | Vacations, layoff news; HR choice.                    |
| `petya-senior`  | Петя Сеньор        | Senior Dev    | Sarcastic     | AI / ML            | AI-path choice; technical side quests.                |
| `olga-product`  | Ольга Продакт      | Product Mgr   | Demanding     | Product            | Priorities, deadline conflicts; Product choice.       |
| `lesha-designer`| Лёша Дизайнер      | Designer      | Creative      | Design             | UI/UX rework requests; Design choice.                 |
| `masha-qa`      | Маша QA            | QA Engineer   | Detail-driven | QA                 | Bug reports, reproduction quests; QA choice.          |
| `igor-analyst`  | Игорь Аналитик     | BA            | Detailed      | Analytics          | Requirement clarification; Analytics choice.          |
| `director`      | Директор           | CEO           | Serious       | Management         | Final-act quests, layoff events; Management choice.   |
| `professor-neuro` | Профессор Нейронов | AI Specialist | Eccentric / scholarly | (AI track only) | AI Lab gatekeeper; deep AI assessments + AI-Architect finale. |

`professor-neuro` is unlocked when the player picks the AI path and the AI Lab location becomes accessible (see [07-locations.md](07-locations.md)).

## Per-NPC state

```ts
interface NPCState {
  id: string
  relationship: number       // -100..100
  seenDialogues: string[]
  completedQuests: string[]
}
```

`relationship` is per-NPC; the global `respect` (see [02-stress-respect.md](02-stress-respect.md)) is separate. Q2 (`00-index.md`) is open about composition with Skill Insights.

## Assessor role

Each path mentor doubles as the **primary assessor** for that path's domains. Some domains may delegate to other NPCs (e.g. `software_dev` skills assessed by `tim-lead` *and* `petya-senior` for AI-overlap content). Assessor mapping for each path lives in `src/data/careerPaths/<path>.ts` and is mirrored in [11-career-paths.md](11-career-paths.md).

## Personality conventions

Personality drives **dialogue tone** (text style) and **default reactions**. It does not change game-state effects directly — those are encoded on the choice. Authoring guidance for tone tokens lives in `src/data/npcPrompts.ts` (which also drives the AI dialogue system prompt). A future ADR may formalise tone tokens; for now, content authors mirror the personality cell above.

## Acceptance criteria

- AC-1 — Every core NPC has a unique `id` matching the table above.
- AC-2 — `relationship` is mutated only via dialogue choice effects or quest outcomes; no direct setter.
- AC-3 — `seenDialogues` is append-only and deduplicated.
- AC-4 — Dialogue branching that depends on a previously-seen dialogue checks `seenDialogues.includes(dialogueId)` — no parallel "flags" mechanism for the same purpose.
- AC-5 — `professor-neuro` is hidden from the world unless `careerPath === 'ai'` AND the AI Lab door condition is satisfied (see [07-locations.md](07-locations.md)).
- AC-6 — A path's assessor mapping covers every domain in that path (no domain without an assessor).

## Open questions

- Q2 — relationship vs respect vs Skill Insights.
- Whether any NPC should be hidden until a career grade is reached (e.g. CEO unlocked at Senior in Management path).
