# 05 — Inventory

Source: `docs/game-design.md` v2 § "Инвентарь", `InventoryManager` in `docs/api.md`, shipped story `backlog/done/002-inventory-system.md`.

## Item types

| Type         | Use                                                   | Examples                                  |
| ------------ | ----------------------------------------------------- | ----------------------------------------- |
| `quest`      | Required by a specific quest. Cannot be used directly. | Documents, keys, signed forms.            |
| `consumable` | Single-use, applies effects on use.                   | Coffee (`stress -5`), energy drink (`stress -10`, `respect -2`). |
| `document`   | Reference / lore, optional reading; sometimes condition for dialogue. | Dev handbook, internal wiki page. |

## Capacity

Default 16 slots (`InventoryManager.maxSlots = 16`). Items do not stack in v1 — each instance occupies one slot. `addItem` returns `false` when full.

## Behaviour

- `addItem(item)` — adds if free slot, emits `itemAdded`. Returns `false` if full.
- `useItem(id)` — only valid for `usable: true` items. Applies `effects` (if any), removes the item, emits `itemUsed`.
- `removeItem(id)` — silent removal (e.g. quest taking the item back), emits `itemRemoved`.
- `hasItem(id)` — used by quest preconditions and dialogue conditions.

## Acceptance criteria

- AC-1 — Adding an item to a full inventory does **not** silently drop it; the call returns `false` and emits no event.
- AC-2 — Using a non-usable or absent item is a no-op and returns `false`.
- AC-3 — `effects` of a consumable apply via `GameStateManager` (not by mutating player fields directly).
- AC-4 — Inventory is fully serialisable for save (see [08-save-load.md](08-save-load.md)) and round-trips through save/load identically.
- AC-5 — Quest preconditions test inventory via `hasItem`, never by scanning `getItems()`.

## Open questions

- Stacking behaviour (post-v1).
- Per-item weight or category caps (deferred).
