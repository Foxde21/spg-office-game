# 90 — Glossary

Living document. Add a term when it appears in two or more requirement files.

| Term              | Meaning                                                                                |
| ----------------- | -------------------------------------------------------------------------------------- |
| **Career path**   | One of the eight specialisations (AI, Engineering, Product, Design, QA, Analytics, HR, Management). See [11-career-paths.md](11-career-paths.md). |
| **Grade**         | Player's progression level within a chosen career path (e.g. AI Junior → Architect).    |
| **Top grade**     | The fourth (max) grade of a path, e.g. AI Architect.                                    |
| **Domain**        | A competency area within a career path (e.g. ML Fundamentals, NLP/LLMs in AI).         |
| **Assessment**    | NPC-driven session of 3-5 work-situation questions; promotes by score across domains.  |
| **Adaptive difficulty** | Question difficulty adjusts to the player's recent score (1-4 levels).            |
| **Stress**        | Integer meter `[0, 100]` representing player burnout pressure.                          |
| **Respect**       | Integer meter `[0, 100]` representing the team's global view of the player.            |
| **Relationship**  | Per-NPC integer score `[-100, 100]`. Distinct from global respect (Q2).                |
| **Skill Insights**| Per-`competencyTag` aggregate built from assessment answers and (per Q14) mini-games.   |
| **Quest**         | A scoped objective with rewards / penalties. Types: `main`, `side`, `daily`, `assessment`, `final`. |
| **Dialogue**      | A scripted (or AI-augmented) NPC interaction with choices, conditions, effects, and actions. |
| **Choice**        | A single branch in a dialogue, optionally gated by a `condition` and producing `effects` or `action`. |
| **Action (DSL)**  | Verb on `DialogueChoice.action`, e.g. `setCareerPath:ai`, `startAssessment:ai:ml`. See [04-dialogues.md](04-dialogues.md#dialogue-actions-dsl). |
| **Flag**          | A boolean key on `GameState.flags` used for cross-system gating.                       |
| **Slot**          | A persistent save container. The unnamed slot is "continue"; named slots are 1..N.     |
| **Promotion**     | One-way transition between adjacent grades within a path.                              |
| **Layoff event**  | Act 3 event that ends the game in `Layoff` if the player's `respect` is below threshold. |
| **AI proxy**      | The Express server in `server/` that mediates LLM calls; never called from the browser directly. |
| **AI-Employee mode** | A planned second game mode where the player supplies an LLM key and the LLM plays the protagonist. See [15-ai-employee-mode.md](15-ai-employee-mode.md). |
| **Mini-game**     | A short arcade-style scene in Game Room (Code Review, Architecture Puzzle, Sprint Planning). |
| **Toast**         | A non-blocking UI notification (info / success / warning / danger), one-at-a-time per variant. |
| **DOR / DOD**     | Definition of Ready / Done. See `backlog/dor.md`, `backlog/dod.md`.                     |
| **OQ-XXX**        | Story id under `backlog/`. Old legacy stories use `^\d{3}-` without prefix (001-032).  |
| **Wave**          | A roadmap milestone bundling related stories. See `backlog/roadmap.md`.                 |
