# HANDOFF — Phase 4e (tcf-chamber: close the v0.4 Must gaps)

- **Phase:** 4e — who/when, author and dates, 3D readable-block links, Start Here sync list, meta descriptions, canonical
- **Branch:** `phase-4e-chamber-v04`, built on `phase-4d-chamber-finish`. PR #4 is now merged into `main` (`4c75f81`, deploy green), so this PR shows only the Phase 4e changes.
- **Current owner:** Claude Code → **ready to merge** → outsider AI test (Astra)
- Phase 4d handoff: `git show da7e25b:docs/architecture/rebuild/HANDOFF.md`

## Filled values (rev 2, Tuzi's answers)

```python
AUTHOR = 'Tuzi and Affiliates'
FIRST_PUBLISHED = '2026-05-26'
```

- **Short author form on purpose:** Tuzi chose "Tuzi and Affiliates" because the same author line will be used on all her sites (THOOTB, AiLUHC, TCF and others). No "of The Civilisation Field" was added.
- **Old comment removed:** the earlier AUTHOR suggestion comment was deleted from the generator, so there is only one wording.
- **Regenerated:** the generator was re-run, and every page now shows "Made by Tuzi and Affiliates · First published: 2026-05-26 · Last updated: 2026-09-26".
- **No placeholders left:** a search of the whole repo, excluding `.git` and `docs/architecture/`, finds **0 files** containing "[TUZI TO FILL". That includes the 3D readable blocks, `llms.txt` and `sitemap.xml`.

## What changed

| # | Task | Change |
|---|---|---|
| a | Root who/when | `index.html` gets a line under the intro: "Made by AUTHOR. First published: FIRST_PUBLISHED." The generator writes it between `<!-- tcf:who-when -->` markers. |
| b | Author + first published | Every reading page's footer line reads "Made by AUTHOR · First published: … · Last updated: 2026-09-26". This covers the 157 generated pages and `index.html`, `start/`, `for-ai/` and `license/`. **One source:** the constants `AUTHOR`, `FIRST_PUBLISHED` and `LAST_UPDATED` in the generator. The hand-made pages are filled in between `<!-- tcf:site-meta -->` markers. |
| c | 3D readable blocks | page4, Sky Hall and Accio (in the plain-HTML readable block only) now link to **Every chamber as text · Start Here · For AI readers · License**, plus the same author, first-published and last-updated line. On page4, the older one-line "Read every chamber as text" link was folded into this line, so the text index is not linked twice. **The 3D layer is untouched.** |
| d | Start Here sync list (§15.6) | A new last section, **"When this page changes, also update"**. It lists `llms.txt` (via the generator), the meta descriptions (Start Here, index, page4, Sky Hall, Accio), the root intro, `for-ai/`, the generator constants, and the 3D readable blocks. This section is a maintenance note and sits outside the 9-section summary. |
| 5 | Meta descriptions | Added to page4, Sky Hall and Accio, reusing each page's existing readable-block text word for word. Nothing new was written. |
| 5 | Canonical | `<link rel="canonical">` is on **every** page, built from `BASE_URL`, so **BASE_URL is the single place to change in Phase 6**. The generator adds it to the generated pages and keeps it updated on the 7 hand-made pages. The chambers index canonical is `chambers/index.html`, to match `sitemap.xml`. |
| 5 | robots.txt | **Not added**, as instructed (Phase 6). |
| 6 | Note | **`nav.js` 書 The Library points to the main site's Door (`index.html`).** When the Library becomes its own site, this link must change to the library subdomain. The same applies to the banner links in the readable blocks and the generator `NAV`. |

## v0.4 check, after 4e

**Per-page scan** (by script; generated chamber pages combined into one row):

| Page | canonical | description | author | first published | last updated | license link | text-index link | for-ai link | start link | one h1 | img alt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| index.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| start/ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| for-ai/ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| license/ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| chambers/index.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pages/page4.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pages/skyhall.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pages/accio.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| chambers/chNNN.html (156) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

— = not required on that page.

**Must items:**

| # | Must item | Status |
|---|---|---|
| 1 | Readable body in raw HTML | ✅ The reading layer carries all chamber content. The 3D pages have readable blocks that link to it. |
| 2 | Public, no login | ✅ |
| 3 | Page identity on the home page (what, who, when) | ✅ What (intro), who ("Made by Tuzi and Affiliates"), when ("First published: 2026-05-26"). |
| 4 | Core definitions, consistent terms | ✅ |
| 5 | Author, first published, last updated | ✅ On every page, from one source (the generator constants). |
| 6 | Image text alternatives | ✅ |
| 7 | Semantic structure | ✅ One h1 per page, h2 sections, lists. |
| 11 | License statement | ✅ `license/` is linked from every reading page and every 3D readable block. |
| 15 | Start Here | ✅ It has the 9 sections, a date and the For AI part. The §15.6 minimum (the sync checklist) has been added. |

**All v0.4 Must items are ✅.**

## How tested

- **Generator:**
  - Two runs in a row gave identical output.
  - A dummy fill of the constants updated every page; restoring the placeholders brought the files back to exactly the same state.
  - `sitemap.xml` still has 164 URLs.
- **Scan:** the table above covers all 164 pages.
- **Browser:** page4, Sky Hall and Accio in headless Chromium at 390 and 1280 px show **0 JS errors**. The canvas renders, the readable block stays hidden (1×1 px), and page4's menu renders (9 links).
- **Local links:** 2,099 checked, 0 broken.
- **Not tested:** the live site.

## Risks

- **Hand-made pages:** if someone deletes the `<!-- tcf:site-meta -->` markers, the generator stops with an error instead of silently skipping the page. This is intended.

## Questions for Tuzi

- None. Both values are filled in, and the PR is ready to merge.
