# HANDOFF — Phase 5a (tcf-chamber as the TEMPLATE site)

- **Phase:** 5a: the TCF Implementation Profile, the chamber record schema, machine-readable records and a test set. This is groundwork only; the pilot descriptions come in 5b.
- **Branch:** `phase-5a-chamber-template`, from `main` @ `39f3f43` (Phase 4f merged)
- **Current owner:** Claude Code (rev 2 done) → next: Opus review → Tuzi merges
- Previous handoff (4f): `git show d42aa1b:docs/architecture/rebuild/HANDOFF.md`

## Rev 2 (Opus review fixes + Tuzi's answers, 2026-09-27)

### A. Fixes from the Opus review

1. **`inviter` → `text_author`**, everywhere: the schema, the sidecar, the generator, the profile, the pages (`data-field="roles.text_author"`) and the test set. `nature.text` (`invitation` / `artist-note`) already says what kind of text it is. The page label is still "Text by". `grep -r inviter` now finds it only in `docs/architecture/rebuild/` (the first 5a notes below).
2. **`source` in each JSON: I dropped the `image` and `video` fields.**
   - **Why:** they held repo-internal paths (`../assets/…`). The video paths 404 on this site, because the videos moved to tcf-chamber-media.
   - **Now:** `source` holds the rest of the chambers.json entry, verbatim.
   - **`source_note`:** a new top-level field that says so: "source is the raw chambers.json entry, without its image and video fields (paths inside the repo, not working URLs). Use media.* for working URLs."
   - **The schema** forbids `image` or `video` inside `source`.
   - **Why this option, not only a note:** a note alone would still leave 159 dead video paths in the JSON for any AI to follow.
   - **Check:** every URL in the 156 records and `index.json` resolves. There are 629 distinct URLs: pages, images, the schema, and the site root on this site, plus 159 videos, each matched against `tcf-chamber-media` `main`. **0 would 404.**
3. **The 62 "What Left Here" chambers:**
   - **Heading:** "What Left Here", with a small line "artist note" under it (existing `tcf-reading__row-meta` style, no CSS change).
   - **Byline:** "— text by X".
   - **Record:** Text type = "What Left Here (artist note)".
   - The 94 invitations are unchanged ("Invitation", "— invitation by X").

### B. Tuzi's answers

| # | Question | Answer | What changed |
|---|---|---|---|
| 1 | Status | `current` for all 156 | Nothing: the basis text is kept. |
| 2 | Editor = Tuzi | Confirmed | `editor.evidence` is now `human-stated` (`stated_by: Tuzi`). The page shows "Tuzi (stated by Tuzi)". |
| 3 | The 87 site-record text authors | Keep `site-record` | Nothing. |
| 4 | New evidence kind | `human-stated` | Added to the profile §3 and the schema. It stays separate from `human-verified`. |
| 5 | AI tools | Provisional rule | `roles.ai_tool` is split into `roles.image_tool` + `roles.video_tool`; see below. |
| 6 | First published | Keep "Not recorded" | Nothing. |

**`human-stated` in the schema:**
- **Needs `stated_by` and `source`.** A fact or role marked `human-stated` without them is rejected (tested).
- **`provisional: true`** marks a general rule that has not yet been checked for this item.

**Tool values** (evidence `human-stated`, `stated_by: Tuzi`, `provisional: true`, source "Tuzi, 2026-09-27, general rule; to be checked chamber by chamber"). The page shows each value followed by "(stated by Tuzi, provisional)". No model or version names are given.

- **`image_tool`, by creator:** a value for **all 156** (the addendum filled grok, tuzi and tcf).

  | Value | Chambers |
  |---|---|
  | made in Claude's own portal | 26 |
  | made in GPT's own portal | 25 |
  | made in Grok's own portal | 24 |
  | drawn by GPT in GPT's portal, for DeepSeek (creator stays DeepSeek) | 23 |
  | made in Copilot's own portal | 22 |
  | made in Gemini's own portal | 22 |
  | drawn by GPT in GPT's portal (creator stays Tuzi: 13, TCF: 1) | 14 |
  | **Total** | **156** |

- **`video_tool`:** every chamber has a video.

  | Value | Chambers |
  |---|---|
  | Grok Imagine (in Grok's portal) | 130 |
  | Claude's own creation (HTML animation) | 26 (creator Claude) |
  | **Total** | **156** |

**Note:** two values already contain brackets, so the page shows, for example, "Grok Imagine (in Grok's portal) (stated by Tuzi, provisional)". I kept Tuzi's wording as given, so the double brackets stay.

### C. Test set and profile

- **Q6:** now uses `roles.creator` / `roles.text_author`.
- **Q7 is replaced.** It now asks "Which model version made the image of ch078?". The expected answer is **"the site does not say"**: the site only records "made in GPT's own portal", stated by Tuzi, provisionally. Naming any model or version scores ❌.
- **Q3 and Q9:** now point to the "What Left Here" section.
- **Profile §2:** roles are now `text_author`, `image_tool`, `video_tool` (and `audio_tool` where relevant), with "no model or version names unless a source gives them". The Provenance row gains `source_note`.
- **Profile §3:** adds `human-stated`, and states that it becomes `human-verified` only item by item.

### Rev 2 checks

- **Schema:** 156/156 valid. These deliberately broken records are rejected:
  - `null` with no reason;
  - `human-stated` with no `stated_by`;
  - `source` that still contains `video`.
- **Page = JSON:** a changed image_tool on `ch078.html` stops the check ("page and JSON differ for roles.image_tool").
- **Two runs, identical output:** hash of every generated file.
- **Links:** 2,415 local links in 164 HTML files, **0 broken**.
- **JSON URLs:** 0 that 404 (see A.2).
- **Placeholders:** **0** `[TUZI TO FILL]` in public files.

The sections below are the first Phase 5a handoff; where they differ from rev 2 (`inviter`, `ai_tool`, the "Artist note" heading, the open questions), rev 2 wins.

## What changed

| File | What |
|---|---|
| `docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md` | **New, DRAFT** (about 2 pages). It covers: one authoritative record per item; record fields; roles; nature (artistic text kept verbatim); five separate dates; status; license per item; evidence kinds; media alternatives with drafted-by and review status; three layers for long content; three version types; acceptance tests; generator checks. v0.4 is unchanged. |
| `docs/standards/chamber-record.schema.json` | **New.** A JSON Schema (draft 2020-12) for one chamber record. It enforces `{value: null, reason}` for unknown facts. |
| `docs/data/chamber-records.json` | **New sidecar.** `defaults` holds the site-wide facts; `chambers` holds, for each of the 156 ids, only what can be derived from the existing data (creator, inviter with evidence kind, text nature, created date). **`chambers.json` is not edited.** |
| `tools/build_chambers.py` | For each chamber it now writes **`chambers/<id>.json`** (all the existing fields verbatim under `source`, plus the sidecar fields, `record_version` 0.1 and the canonical URL). It also writes **`chambers/index.json`**. Each page gets `<link rel="alternate" type="application/json">` and a visible **Record** section. **The generator fails** if the Record text differs from the JSON (`check_page_matches_json`). |
| `chambers/*.html` (156) | New Record section and JSON link. On the **62 "What Left Here" chambers** the text heading now reads **"Artist note"** and the byline "— text by …", instead of "Invitation" and "— invitation by …". The profile requires page and data to say the same thing, and those texts are artist notes, not invitations. The texts themselves are unchanged. |
| `chambers/ch*.json` (156), `chambers/index.json` | **New, generated.** |
| `llms.txt` | Adds one line: "Machine-readable records → `chambers/index.json`". |
| `docs/tests/chamber-outsider-test.md` | **New.** 11 questions covering all 8 types, using real content from ch001, ch078, ch093 and ch117. **Q7 and Q8 are "the site does not say" questions.** Each question has the expected answer and the URL or field it comes from. |
| `.github/workflows/deploy-pages.yml` | **Excludes `docs/tests/` from deploy.** Otherwise the answer key would be public and an outsider AI could read it. |
| `.gitignore` | `__pycache__/` |

**Sitemap:** unchanged, on purpose. The sitemap lists pages for people and search engines. The JSON records are machine files, and they can be found through each page's `rel="alternate"` link and through `llms.txt`. Listing 157 JSON files in the sitemap would add noise without helping search.

## Inviter and attribution

- **Known inviter:** all 156 chambers have one (from `invitation_by`); there are **0 unknown**.
- **Evidence:**
  - **69** are signed inside the text itself (`self-statement`);
  - **87** come only from the site record (`site-record`): 62 are artist notes, which are never signed, and 25 are unsigned invitations.
- **Creator differs from inviter** in 2 chambers: **ch001** and **ch038** (created by Grok and GPT; the text is by Tuzi).
- **Text nature:** 94 invitations and 62 artist notes (texts that begin "What Left Here").

## Unknowns (null + reason; nothing guessed)

These fields are unknown in **all 156** records:

- `roles.ai_tool`: the tool or model that made the image and video is not recorded.
- `dates.first_published` (per chamber): not recorded. The site as a whole was first published on 2026-05-26.
- `dates.content_revised`: no revisions are recorded.
- `dates.status_checked`: no human status check is recorded yet.
- `descriptions.image` and `descriptions.video`: none yet (5b).

**There are no `[TUZI TO FILL]` markers on public pages**, since every unknown uses null + reason.

## Open questions for Tuzi (they decide values, not placeholders)

1. **`date` = created?** I used each chamber's `date` as `dates.created` (evidence: site record). Is that the day the chamber was created?
2. **First published:** was each chamber published on the site on its `date`? If so, `first_published` can be filled for all 156 with one rule.
3. **Status:** all 156 are `current`, on the basis that no newer version is recorded. Or should they be `historical`, since no new chambers are being made?
4. **Editor = Tuzi for all:** this comes from The Field page ("curated, edited, and assembled by Tuzi"). Is that right?
5. **AI tools:** do you want each affiliate's image and video tools recorded (for example, which image model)? If yes, per affiliate or per chamber?
6. **The 87 site-record inviters:** can you confirm them, or mark some as checked? They would then become `human-verified`, with your name and the date.

## How tested

- **Generator:**
  - Two runs give **identical output** (hash of every generated file).
  - It **fails on a page/JSON mismatch**: I tested this by changing "Current" to "Historical" in `ch001.html`, and it stopped with "page and JSON differ for status".
- **Schema:** all **156/156 records validate** against the schema (jsonschema 2020-12, with format checks). A record with `{value: null}` and no reason is **rejected**.
- **Links:** 2,412 local links, **0 broken**.
- **Counts:** `index.json` count is 156, and there are 156 records.
- **Placeholders:** **0** `[TUZI TO FILL]` in public files.
- **Phone:** the Record section at 390 px has no horizontal scroll; I checked a screenshot.
- **Not changed:** the 3D layer, `chambers.json`, the design, and bilingual text.

## Next suggested phase

5b: pilot descriptions for ch001, ch078, ch093 and ch117 (objective image descriptions and a video transcript, each labelled with who drafted it and its review status). Then run the outsider test (`docs/tests/`). After that, hand the record format to Bill for Play.
