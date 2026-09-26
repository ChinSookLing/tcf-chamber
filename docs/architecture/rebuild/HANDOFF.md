# HANDOFF — Phase 4f (tcf-chamber: two text fixes from the outsider AI test)

- **Phase:** 4f — fixes for the 2 problems Astra found, both decided by Tuzi
- **Branch:** `phase-4f-chamber-text` from `main` @ `241c26e` (Phase 4e merged)
- **Current owner:** Claude Code → next: Opus review → Tuzi merges
- Phase 4e handoff: `git show bae7e6d:docs/architecture/rebuild/HANDOFF.md`

## What changed

1. **"Seven voices" vs eight credits (Start Here, Who).** One sentence was added after the credit list:
   "TCF (1) is **ch117, The Seven Geometries · 七種幾何**: one work made in the name of all seven voices together."
   - The ch117 link goes to `chambers/ch117.html`.
   - The name comes from `chambers.json` (`name_en` "The Seven Geometries", `name_zh` "七種幾何 · The Seven Geometries", `created_by` "tcf").
   - The credit list is hand-written in `start/index.html`, not generated, so it was edited there. The "What" sentence ("… created by seven voices.") is unchanged; the new sentence explains it.
2. **License.**
   - `license/index.html` now reads: "All content on this site — chamber images, invitation texts (by Tuzi or by an AI affiliate), and videos — is licensed under CC BY 4.0 (…). Please credit: Tuzi and Affiliates, The Civilisation Field, with a link to this site. Responses from guests are kept as records; their rights depend on each case."
   - The same meaning was updated in two other places:
     - **`llms.txt`:** changed at the source, the generator line, then regenerated.
     - **`README.md`.**
   - Two places were checked and needed no change: **`for-ai/`** (the trust-boundary text only, with no license wording) and **Start Here "For AI readers"** (it only says "License: CC BY 4.0").
3. **`LAST_UPDATED`:** already today's date (2026-09-26), so it is unchanged. The generator was re-run, and the 157 generated pages are identical, so they are not in this PR.

## Checks (grep of the public site, excluding `.git`, `docs/architecture/`, `docs/standards/`)

| Phrase | Where it appears now |
|---|---|
| "seven voices" | `start/index.html` (the What sentence, and the new ch117 sentence) · `llms.txt` (the What line, generated from Start Here) |
| "depend on each case" | `license/index.html`, `llms.txt`, `tools/build_chambers.py`, `README.md`. **All four now refer only to guest responses.** |
| "rights depend" | `license/index.html`, `README.md` (guest responses only) |

- **Links:** 2,100 local links, 0 broken.
- **JS:** no JS changed.
- **Start Here length:** the 9 sections are now **358 words** (they were ~340). The extra ~18 words are the required ch117 sentence. I did not trim other approved text.

## Follow-ups outside this repo (report only; not changed, since the task says tcf-chamber only)

- **`tcf-chamber-media`**, the site that serves the videos:
  - `README.md` still says "Original content … AI and guest responses … rights depend on each case".
  - `index.html` says "Original content is licensed under CC BY 4.0".
  - To match the new meaning (videos included, credit "Tuzi and Affiliates"), both need a one-line update.
- **Main site (`the-Civilisation-field`):** `license/`, `about/` and `llms.txt` use the older wording, "Original content … AI and guest responses …". Whether the main site adopts the same all-content CC BY 4.0 rule is Tuzi's decision for that site.

## Risks

- None. This is a text-only change.

## Questions for Tuzi

1. Should the media repo (videos) and the main site use the same new license wording? That would be a tiny follow-up in those repos.
