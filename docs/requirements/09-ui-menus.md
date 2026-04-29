# 09 — UI surfaces

Source: shipped `007-main-menu-ui.md` (done); pending `013-skill-tree-ui.md`, `021-chat-system.md`, `029-achievements-system.md`, `030-leaderboard-profiles.md`; `docs/architecture.md` v2 § "UIScene" + "Toast notifications".

## Surfaces

| Surface             | Status      | Notes                                                                       |
| ------------------- | ----------- | --------------------------------------------------------------------------- |
| Main menu           | shipped     | New game, Continue (visible if save), Settings (placeholder), About.        |
| Pause menu          | shipped     | `Esc` overlay; resume / restart / main menu.                                 |
| Game Over screen    | shipped     | Reason rendered (`burnout`, `layoff`, `top-grade-failed`).                  |
| Victory screen      | shipped     | Top-grade ending; summary stats.                                            |
| HUD                 | shipped     | Stress meter, respect meter, current location, **career grade** (post-choice). |
| Inventory UI        | shipped     | Grid of slots; click to use / inspect. Open with `I`.                       |
| Dialogue UI         | shipped     | Bottom panel; choice list; advance with `E`. Renders scripted, AI, and assessment dialogues identically. |
| Quest log           | TBD         | List of active and completed quests; toggle with `Q`.                       |
| Save / load slots   | TBD         | Slot list with timestamps. Tied to [08-save-load.md](08-save-load.md).      |
| Settings            | TBD         | Volume, difficulty (Q5), localisation (Q6).                                 |
| **Skill Tree panel**| pending (013) | Per-path domain progress; current grade highlighted. Q10 about Skill Insights vs Skill Tree distinction. |
| **Toast notifications** | shipped | `ToastManager` + UIScene queue. Variants: `info | success | warning | danger`. Same-variant queue, different-variant stack vertically. |
| **Achievement popup** | pending (029) | Toast-style on unlock; details panel from main menu / pause.              |
| **Leaderboard panel** | pending (030) | Per-path top players, global, friends.                                     |
| **Chat input + kitchen panel** | pending (021) | Text-bubble overlay above remote players; chat history in kitchen.    |
| **Mini-map**        | planned     | Small overview of current location (in `UIScene`).                           |

## Controls (current)

- Arrows — movement
- `E` — interact / advance dialogue
- `I` — inventory toggle
- `Esc` — pause

(Quest log key, settings key, chat key — TBD when those surfaces land.)

## Toast usage

```ts
import { ToastManager } from '../managers/Toast'
ToastManager.getInstance(this.game).show({ text: 'Сохранено', variant: 'success', durationMs: 3000 })
```

- Same-`variant` toasts queue (one at a time per variant).
- Different `variant`s render side-by-side.
- Always clean up subscriptions in `Scene.shutdown` (or `SHUTDOWN`/`DESTROY`) when emitting from non-UIScene contexts.

## Localisation

v1 ships in Russian. Q6 (`00-index.md`): is EN in scope for v1 or v2?

## Acceptance criteria (cross-cutting)

- AC-1 — Every interactive UI element is reachable by keyboard (no mouse-only widgets).
- AC-2 — A modal surface (inventory, dialogue, menu) blocks player movement while open.
- AC-3 — Closing a modal restores prior input state (player can move again, no stuck listeners).
- AC-4 — Stress / respect bands ([02-stress-respect.md](02-stress-respect.md)) render with distinct visual states; band changes animate, do not flicker.
- AC-5 — HUD shows the current career grade once `flags.careerPathChosen === true`; before that, shows "Newcomer".
- AC-6 — `Toast` notifications must not stack same-variant (queue) and must not block input.
- AC-7 — Skill Tree panel reads from `SkillInsightsManager` and `AssessmentManager` only — never directly from save data.

## Open questions

- Q5 — difficulty surface (per save vs global setting).
- Q6 — localisation scope.
- Q10 — Skill Tree vs Skill Insights — overlap, naming, ADR needed.
- Quest log / chat key bindings.
