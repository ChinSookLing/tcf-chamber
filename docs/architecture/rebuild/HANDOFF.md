# HANDOFF — Phase 5c (two reading fixes from the second outsider test)

- **Phase:** 5c. Fixes for the site problems found by the Kimi run and confirmed by Opus.
- **Branch:** `phase-5c-reading-fixes`, from `main` @ `201dc4e` (PR #8 merged)
- **Current owner:** Claude Code → next: Opus review → Tuzi merges
- Previous handoff (5b): `git show f475a11:docs/architecture/rebuild/HANDOFF.md`

## What changed

| # | File | Before | After |
|---|---|---|---|
| 1 | `chambers/index.html` (generated) | `<ol>`, newest first: the automatic numbers 1–156 ran opposite to ch156–ch001, and no id was shown | a **`<ul>`** (no automatic numbers), still newest first |
| 2 | Record and header `<dl>` on all 156 chamber pages (generated) | `<dt>Image made with</dt><dd>drawn by…` read as "Image made withdrawn by…" in plain text | every `<dt>` ends with a **colon**, and there is a **newline** between `</dt>` and `<dd>` |
| 3 | `start/index.html`, When section | the chamber dates, with no note | adds: "Dates on each chamber are creation dates; the date each chamber was first published online is not recorded." |
| 4 | `docs/tests/results/2026-09-27-astra.md`, `…-kimi.md` | — | **new**, saved exactly as provided |

**1. Index rows.** Each row starts with the chamber id, and the id and title are one link:
- Row: `ch156 · 雨中之印 The Rain Seal · 2026-07-22 · Claude`.
- New line above the list: "Newest first. Each chamber's id (chNNN) is its permanent address: chambers/chNNN.html."
- The old "…as plain text, newest first." is shortened to "…as plain text." so "newest first" is not said twice.

**2. Labels.**
- **Where:** both the Record rows (15, plus the description rows on the 4 pilot pages) and the Chamber / Date / Created by header, 18 `<dt>` per page.
- **What:** "Image made with:" then a newline then "drawn by GPT…".
- **Check:** page = JSON reads only the `<dd>` values, so it still passes.

**Other notes:**
- **CSS:** unchanged. The `<ul>` shows bullets. On a phone the English title wraps to its own line (existing style), so " · date · creator" starts a new line with a "·". It reads fine, but it can be tidied later.
- **JSON records and `chambers.json`:** unchanged. The 156 `.json` files are byte-identical.
- **`PR #9`** (Astra's result alone) adds the same file with the same content. Merging either first causes no conflict, and #9 can be closed.

## Checks

- **Plain-text extraction:** two methods, tag-stripping regex and Python `html.parser`, give the same results:
  - `chambers/index.html` → "**ch078 · 先被遇見的世界 GPT's Rebuilt World · 2026-06-19 · GPT**" (the id sits next to its title).
  - `chambers/ch117.html` → "Image made with:" / "drawn by GPT in GPT's portal (stated by Tuzi, provisional)" on separate lines. **"withdrawn" appears 0 times**, on any of the 156 pages.
  - **All `<dt>`/`<dd>` pairs:** 2,808 (156 × 18). **0** lack the colon or the newline, and **0** labels run into their value.
  - **Browser:** `innerText` of the ch117 Record (Chromium): "Creator: | TCF | Text by: | TCF (site record) | … | Image made with: | drawn by GPT…".
- **Schema:** 156/156 valid.
- **Page = JSON:** still enforced. A tampered status ("Historical") stops the check.
- **Two runs, identical output.**
- **Links:** 2,415 local links, **0 broken**.
- **Phone (390 px):** no horizontal scroll on `chambers/index.html` or `ch117.html`.

## For Opus / Tuzi

**"Last updated":** `LAST_UPDATED` (the site footer and `index.json`) is still **2026-09-26**. Phases 5a–5c changed content on 2026-09-27 and did not bump it. I left it alone to keep this PR small. Should it become 2026-09-27?

## Next

- Qwen (optional run 3) on the fixed site.
- Hand the record format to Bill for Play.
