# ADR-0001 — AI proxy fallback policy

- **Status:** Accepted
- **Date:** 2026-04-29
- **Deciders:** Fox (maintainer)
- **Supersedes:** none

## Context

Office Quest uses an Express AI proxy (`server/`) to mediate LLM calls (OpenRouter) for two consumer surfaces:

1. **AI-driven dialogue** — flavour lines from NPCs whose personality is defined in `src/data/npcPrompts.ts`.
2. **Assessment sessions** — NPC-driven competency checks (the questions themselves are pre-authored, but follow-up feedback may use the proxy in the future).

The proxy can be unreachable for several reasons: network partition, OpenRouter outage, rate-limit (HTTP 429), the player did not configure `OPENROUTER_API_KEY`, the model is temporarily unavailable. Without a documented policy, every consumer would invent its own handling and the failure mode would diverge between dialogues and assessments. This is open question Q8 in `docs/requirements/00-index.md`.

The project is funded as an **educational platform for junior AI specialists**. The fallback behaviour is read by every contributor as the canonical "how do we handle external service flakiness in this codebase". The choice has teaching weight beyond its runtime impact.

## Decision

Adopt a **three-layer fallback** that every LLM consumer in the codebase follows:

1. **Transparent retry.** On transient errors (network timeout, 5xx, 429), the proxy retries up to **2 times** with exponential backoff (**250 ms → 1 s**). The consumer does not see retries.
2. **Scripted fallback line.** If retries are exhausted, the consumer surfaces a per-NPC short scripted line (e.g. "Что-то отвлёкся, давай позже") loaded from `src/data/npcPrompts.ts`. The line is structurally a normal `DialogueLine` so the dialogue UI does not branch on AI vs scripted.
3. **One-shot Toast.** The first time a fallback fires in a session, surface a single Toast: `variant: 'warning'`, text **"AI временно недоступен — продолжаем без него."** Subsequent fallbacks in the same session are silent (do not spam Toasts).

### Assessment-specific behaviour

- **Failure before session start:** the session refuses to start. The assessor NPC says the same scripted fallback line. **No Toast** — the player triggered the assessment with an explicit action and already sees the failure.
- **Failure mid-session:** today, mid-session questions render from a pre-loaded pool (`src/data/careerPaths/<path>.ts`) and do **not** require AI calls. If a future story adds mid-session AI calls, this ADR must be revised first.

### Logging

- **Server:** logs the failure at WARN level with HTTP status code and (truncated) error body. No PII (no prompt content, no player input).
- **Client:** logs at WARN level via the existing logger when the fallback fires. No prompt content in logs.

### Where this lives in code

- **Retry logic** in `server/routes/ai.ts` — single chokepoint, all consumers benefit automatically.
- **Scripted fallback line** as a `fallbackLine: string` field on each NPC personality in `src/data/npcPrompts.ts` (default: a generic "AI задумался…" if not specified).
- **Toast trigger** via `ToastManager.getInstance(this.game).show({ variant: 'warning', text: 'AI временно недоступен — продолжаем без него.' })`, gated by a per-session boolean flag on the consumer manager (`AIDialogue`, future `AssessmentManager` etc.).

## Consequences

### Positive

- **No crashes.** The dialogue UI never breaks because of an external service.
- **Visible recovery.** The player sees a clear, one-time signal that the AI is unavailable, so they know what's happening.
- **Single chokepoint.** Retry and backoff live in one file (`server/routes/ai.ts`). Adding a new LLM consumer doesn't require re-implementing retry.
- **Educational property.** Junior contributors reading the ai-proxy code see a clean retry-with-backoff pattern they can copy in their own features. The pattern is named, documented, and small.
- **Assessment integrity.** Sessions stay deterministic — pre-loaded questions don't need the network.

### Negative

- **A 2-retry chain at 250 ms + 1 s adds up to ~1.25 s** of perceived latency before fallback fires. Acceptable for dialogue (NPCs already feel "thinking"); not acceptable for any future synchronous combat-like loop. Revisit the numbers if such a feature lands.
- **Per-NPC scripted fallback lines** add a small authoring burden when adding a new NPC. Mitigated by a shared default ("AI задумался…").
- **The Toast copy is RU-only.** When localisation lands (Q6), this string moves to the i18n catalogue.

### Neutral / follow-ups

- The 250 ms / 1 s backoff numbers are heuristic defaults. Tune later if telemetry shows more aggressive or more lax values are better. Tracked in this ADR's "References".
- This ADR explicitly does not cover **malformed AI responses** (proxy reachable, returns 200, but body is not the expected shape). Open follow-up question: do we treat malformed responses the same as failures? Logged below.

## Alternatives considered

- **A. No retry, only scripted fallback.** Simplest, but a single network hiccup would always burn a fallback Toast. Rejected.
- **B. Aggressive retry (5+ times, longer backoff).** Bad for perceived latency. Rejected.
- **C. Silent skip (close dialogue without explanation).** Confusing for players, especially educational users who can't tell if the game is broken or the AI is offline. Rejected.
- **D. Block the player until AI is back ("AI required" modal).** Halts gameplay entirely. Unacceptable for educational use — students must not be locked out by external flakiness. Rejected.
- **E. Client-side retry (in `AIDialogue` instead of `server/routes/ai.ts`).** Pushes complexity into every consumer. Rejected; we centralise in the proxy.

## Open follow-ups

- **Malformed AI response handling.** Treat as failure (use scripted fallback)? Or surface a different Toast? Decide when the first consumer hits this in production. Track as a new gap in `00-index.md` if it becomes a real problem.
- **Per-domain backoff tuning** for assessment use cases — if adaptive difficulty grows AI calls into the hot path, the 250/1000 numbers might be wrong.

## References

- Resolves Q8 in `docs/requirements/00-index.md` "Gaps & contradictions".
- Consumed by `docs/requirements/04-dialogues.md` AC-5 and (when shipped) `docs/requirements/10-assessments.md`.
- Discussed in story `backlog/in-progress/OQ-033-adr-ai-proxy-fallback.md` (until merged → `done/`).
