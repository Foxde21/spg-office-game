# 13 — Multiplayer

Source: `docs/game-design.md` v2 § "Мультиплеер"; `docs/architecture.md` v2 (mentions `Multiplayer` manager, `RemotePlayer`, `ChatBubble`, `multiplayer.ts`, leaderboard route, planned Socket.IO); pending stories `020-multiplayer-infrastructure.md`, `021-chat-system.md`, `030-leaderboard-profiles.md`, `031-team-assessments.md`.

## Goal

Add real-time presence, social chat, and competitive / cooperative modes (duels, team assessments, leaderboard) without breaking the single-player experience.

## Surfaces

### Presence

- Other players visible as `RemotePlayer` avatars (sprite + nickname label).
- Position synced from server tick.
- Hidden when in private surfaces (mini-game inside arcade, assessment session).

### Chat

- Kitchen is the **chat zone**. Other locations can send messages but only the kitchen displays the history panel.
- Player presses `T` (planned key) to open chat input.
- Messages render as transient `ChatBubble`s above the speaker's avatar (3-5s).
- History persisted per-room on the server for late-joiners.

### Duels (1v1)

- Two players each send and receive **the same assessment question** simultaneously.
- Win condition: faster correct answer.
- Reward / penalty applied locally (no global ranking yet).

### Team assessments

- 2-4 players. Each receives a different domain's question. Combined score.
- Used for path's top-grade unlocks (planned).

### Leaderboard

- Global top players per path.
- Friends-only filter.
- Surfaced on the Open Space notice board and in the dedicated panel (see [09-ui-menus.md](09-ui-menus.md)).

## Identity (Q13)

How players identify themselves on the server is open.

- Anonymous nickname only (low friction)?
- Account with persistent profile (ties into achievements per-device — Q7)?
- OAuth (corporate)?

Q13 in `00-index.md` — must be answered before story 020 leaves DOR.

## Server contract (sketch — to be solidified by story 020)

- Socket.IO namespaces per room (`open-space`, `kitchen`, `meeting-room`, `director-office`, `ai-lab`, `game-room`).
- Events: `player:join`, `player:leave`, `player:move`, `chat:send`, `chat:history`, `duel:invite`, `duel:answer`, `team:invite`, `team:start`, `team:answer`, `leaderboard:fetch`.
- Authoritative server tick at 10 Hz for movement; client interpolates.

## Stress / respect interactions

- Kitchen with at least one other player: `stress -2` per 30 seconds (see [02-stress-respect.md](02-stress-respect.md)).
- Winning a duel: `respect +5..+10` depending on opponent grade.
- Winning a team assessment: `respect +10..+15`.

## Acceptance criteria

- AC-1 — Single-player play continues to work with multiplayer disabled (server unreachable, no socket).
- AC-2 — Joining a room never freezes the client; if server is slow, fall back to single-player and tell the user via Toast.
- AC-3 — Chat messages cannot exceed 200 characters; rate-limited on the server (Q-TBD).
- AC-4 — Duels and team assessments share the question pool with single-player ([10-assessments.md](10-assessments.md)) — no duplicate authoring.
- AC-5 — Player identity model (Q13) determines whether profile data persists across sessions; the requirement is locked in once the question is answered.
- AC-6 — Leaderboard panel shows graceful "—" when offline.

## Open questions

- Q13 — identity model.
- Mute / report tools — needed for chat at any scale; deferred but flagged.
- Cheat resistance — duels could be gamed; deferred design call.
