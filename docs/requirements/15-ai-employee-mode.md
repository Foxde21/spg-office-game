# 15 — AI-Employee mode

Source: pending story `032-AI-employee-mechanic.md`; `inputs/briefs/2026-04-29-platform-vision.md` ("Out of scope" + "Open questions").

> **Status: deferred (Wave 7).** This module specifies a *second* game mode in which a player-supplied LLM controls the protagonist instead of the human player. The mode is large in scope and has unresolved security questions (Q12). Do not start implementation work until those are answered.

## Goal

A second game mode where the player acts as **observer / manager**: configures an AI character profile, supplies their own LLM API key, and watches the LLM autonomously play the game (movement, dialogue choices, quest selection, assessment answers).

The existing manual mode is unchanged.

## Mode selection

- Main menu adds a second entry point: "AI-Employee".
- Choosing it opens the **AI character creation** screen, then starts a new run with autonomous control.

## AI character profile

Required fields:

| Field            | Type            | Description                                               |
| ---------------- | --------------- | --------------------------------------------------------- |
| API key          | string          | Player's OpenRouter (or compatible) key. **Stored locally only**, never sent to the project's server. |
| Character name   | string          | The AI employee's name.                                   |
| Role             | select          | Junior Dev / QA / Designer / Analyst / DevOps              |
| Knowledge level  | slider 1–10     | Overall competence — affects answer quality.              |
| Personality      | multi-select    | Introvert/Extrovert, Calm/Impulsive, Ambitious/Relaxed     |

Optional fields:

| Field             | Type            | Description                                                                  |
| ----------------- | --------------- | ---------------------------------------------------------------------------- |
| Specialisation    | multi-select    | Frontend, Backend, Fullstack, Mobile, Data                                  |
| Motivation        | select          | Career, Money, Knowledge, Balance, Recognition                              |
| Weak spots        | multi-select    | Procrastination, Conflict-prone, Perfectionism, Imposter, Burnout-prone     |
| Communication     | select          | Formal, Friendly, Concise, Humorous                                         |
| Bio               | textarea        | Free-form background.                                                       |
| LLM model         | select          | Available OpenRouter models.                                                |
| Decision speed    | slider 0.5–5s   | Delay between AI actions (so the player can watch).                         |

## System prompt structure (sketch)

The LLM receives a structured prompt containing:

- The character profile (above).
- The current game state (player position, location, NPCs in range, active quests, stress / respect, career path / grade, recent events).
- Available actions (move N/S/E/W, interact with closest entity, choose dialogue option N, use item N, etc.).

The prompt is regenerated on each tick. The LLM's response must conform to a small action-selection schema.

## Security model (Q12)

This is the gating concern. Before any implementation:

- Where does the API key live? (`localStorage`, in-memory only, never persisted?)
- Can the LLM exfiltrate the key by replying with prompt-injection content the page renders unsafely?
- Do we ever send the key to our server? **Default: no — direct browser-to-OpenRouter call.**
- Rate limits — stop runaway costs.
- Abuse model: a bad LLM response could try to interact with arbitrary URLs the player's browser visits; mitigated by content-security policy and constrained parsing.

Q12 in `00-index.md` — needs a dedicated ADR before story 032 can leave DOR.

## Acceptance criteria

(Tentative — subject to Q12 outcome.)

- AC-1 — A player cannot start AI-Employee mode without supplying a key (form blocks the start button).
- AC-2 — The key is never sent to the project's server. Verified by network test.
- AC-3 — The key is cleared from memory on mode exit.
- AC-4 — The LLM's response is parsed against a strict schema; any deviation aborts the action with a Toast.
- AC-5 — The decision-speed slider throttles at the lower bound (no faster than 0.5s) — protects users from runaway costs.
- AC-6 — Mid-run, the player can pause the AI and take over manually (or vice versa). State is preserved.

## Open questions

- Q12 — security model (ADR required).
- Cost cap UI — should the player be able to set a daily / hourly budget?
- Save compatibility between manual and AI-Employee modes.
- Multiplayer — can an AI-Employee join a duel? (Probably no; cheating risk.)
