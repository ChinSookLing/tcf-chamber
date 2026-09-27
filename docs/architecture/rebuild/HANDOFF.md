# HANDOFF — Phase 5a (tcf-chamber as the TEMPLATE site)

- **Phase:** 5a: the TCF Implementation Profile, the chamber record schema, machine-readable records and a test set. This is groundwork only; the pilot descriptions come in 5b.
- **Branch:** `phase-5a-chamber-template`, from `main` @ `39f3f43` (Phase 4f merged)
- **Current owner:** Claude Code → next: Opus review → Tuzi answers the open questions below → merge
- Previous handoff (4f): `git show d42aa1b:docs/architecture/rebuild/HANDOFF.md`

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
