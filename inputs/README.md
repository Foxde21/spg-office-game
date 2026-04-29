# inputs/

Raw stakeholder material. **Never edit** — this is the historical input the BA parses into `docs/requirements/`. If a brief evolves, add a new dated file rather than rewriting the old one.

## Layout

```
inputs/
  briefs/        Original concept docs, vision statements, pitches.
  mockups/       UI mockups, wireframes, sketches.
  references/    Screenshots / clips of other games for inspiration or comparison.
```

## Naming

- `briefs/<YYYY-MM-DD>-<slug>.md` — keep them dated; freezes "what we knew when".
- `mockups/<area>-<screen>-vN.png` — `area` = location / surface; `v1`, `v2` for revisions.
- `references/<source>-<note>.png` — `source` = the game or product, `note` = what it illustrates.

## How this folder relates to `docs/requirements/`

Inputs are the *source*; requirements are the *parsed and committed-to* shape. The BA (or the `ba-analyst` subagent) reads inputs, surfaces gaps and contradictions, and writes them up into per-module requirement files with `source_ref` pointers back here.
