# Architecture Decision Records (ADRs)

Design decisions for Office Quest live here. One file per decision. Append-only — never edit an accepted ADR; supersede it with a new one.

## How to add one

```
/adr "Use signals over BehaviorSubjects"   # Claude users
# or, manually:
cp docs/architecture/ADR-template.md docs/architecture/ADR-NNNN-<slug>.md
```

Status flow: `Proposed → Accepted` (or `Rejected`). Mark `Accepted` only when the decision is actually made — not speculatively. If a later ADR replaces this one, set `Status: Superseded by ADR-XXXX` in the old file and `Supersedes: ADR-YYYY` in the new one.

## Index

| #    | Title                                                                       | Status   | Date       |
| ---- | --------------------------------------------------------------------------- | -------- | ---------- |
| 0001 | [AI proxy fallback policy](ADR-0001-ai-proxy-fallback.md)                   | Accepted | 2026-04-29 |
