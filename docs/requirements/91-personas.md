# 91 — Player personas

Target-audience snapshots used to validate design choices. v2 audience is broader than v1 — not only IT-developers but also analysts, HR, product, design, QA — any office worker whose role maps to one of the eight career paths.

When a story or design call would clearly disappoint a primary persona, surface it as an open question rather than silently choose.

## Primary

### P1 — Mid-career office professional

- 28–40, currently working in their domain (dev / analyst / PM / designer / QA / HR).
- Has lived through code reviews / sprint chaos / stakeholder politics / hiring rounds.
- Plays in 30–60 min sessions on a laptop after work or on weekend.
- **Wants:** humour and recognition ("it really is like that"), accurate domain content, the option to play *their own role*'s path (not just dev), multiple endings to discuss with colleagues.
- **Doesn't want:** dev-only bias, grindy daily quests, save-system frustration, English-only UI in v1.

### P2 — Junior / student in any office track

- 20–28, studying or in their first job in any of the eight tracks.
- Looking for a low-pressure way to "see" what office life looks like in their chosen track and to learn vocabulary.
- Plays in shorter sessions; sensitive to confusing UI.
- **Wants:** clear progression markers, hints when stuck, tolerant difficulty (Easy mode resonates), assessments that teach (the educational rationale after each answer).
- **Doesn't want:** hidden gating without explanation ("why can't I enter the AI Lab?"), opaque death conditions.

### P3 — Career switcher

- 25–45, considering changing track (e.g. dev → product, QA → analyst).
- Plays *both* a familiar track and the target track to compare day-to-day.
- **Wants:** a "what does a day in this role look like" sense, realistic NPC interactions, clear competency growth.
- **Doesn't want:** the game pretending all tracks are equally easy, or wildly inaccurate domain content.

## Secondary

### P4 — Non-IT spouse / friend trying it out

- Plays once because someone shared a link.
- Will not invest in learning a complex control scheme.
- **Wants:** intelligible humour even without the in-jokes, short first session, ability to see one ending and stop.
- **Doesn't want:** death-loops, jargon walls.

### P5 — Manager / EM / People manager observer

- Plays *not as themselves* but to assess whether the platform could fit a team-onboarding or training context.
- May try the AI-Employee mode (when shipped) to "compare" character profiles.
- **Wants:** export of skill insights, transparency about content depth per track, confidence the tool isn't reductive about other roles.
- **Doesn't want:** lock-in, opaque scoring, flippant content.

## How to use

When writing a story:

- If a UX choice clearly hurts P1, P2, or P3, list it in the story's Open questions and consider an alternative.
- P4 and P5 are secondary; if a feature is justified by the primary trio but P4 finds it confusing, it's still acceptable, but UI text should aim for plain language where possible.
- For **assessment content**, validate against P3: "would a real career-switcher recognise this situation?" If not, the content is too theoretical.

## Sources

Personas are inferred from team discussion, the v2 platform vision brief, and the skill matrix exports under `docs/spg-skill-matrix/`. They have not been validated with real users yet — when they are, update this file with sample size and method.
