# HANDOFF — Phase 5d (plain-text addresses; a GitHub signpost for AI readers)

- **Phase:** 5d. Fixes from the Qwen runs:
  - its fetch tool dropped link targets, so it guessed paths and got 404s;
  - on another run it read the raw editing data on GitHub.
- **Branch:** `phase-5d-plain-addresses`, from `main` @ `7b87aed` (PR #10 merged)
- **Current owner:** Claude Code → next: Opus review → Tuzi merges → wait ≥10 min → Qwen run 3
- Previous handoff (5c): `git show edb96d7:docs/architecture/rebuild/HANDOFF.md`

## What changed

| # | File | Change |
|---|---|---|
| 1 | `index.html` (root) | New section **"Addresses (for readers that cannot follow links)"**, stamped between `<!-- tcf:addresses -->` markers. See the list below. |
| 2 | `chambers/index.html` (generated) | Under "Newest first…", the page and record patterns as full URLs, each with an example (ch001). Also full URLs for Start Here, License and llms.txt. |
| 3 | `start/index.html` | The **For AI readers** section gains "Addresses, as plain text:" (Start Here, For AI readers, License, the chamber pattern, llms.txt), between `<!-- tcf:addresses-short -->` markers. See also the "Also changed" notes below. |
| 4 | — | All link texts stay as they were. The URLs are **extra visible text**, not replacements. |
| 5 | `docs/tests/results/2026-09-27-qwen.md` | **New**, saved exactly as provided (Qwen run 1). Opus will add run 2 to the scorecard. |
| 6 | `docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md` §7 | Two new rules: **wait ≥10 minutes after a deploy** before an outsider test (Pages `max-age=600`); **key addresses must appear as visible plain-text URLs**, since some fetch tools drop `href`s. |
| 7 | `README.md`, **new** `docs/data/README.md` | A **"For AI readers"** note at the very top of both. The old "single source of truth" line is reworded. See below. |

**The root page's address list:**
- Start Here, For AI readers, License, and "Every chamber as text", each as a full URL.
- **One chamber:** `…/chambers/chNNN.html`, for example `…/chambers/ch001.html` (ids ch001 to ch156). Its record: `…/chambers/chNNN.json`. All records: `…/chambers/index.json`.
- **Guide for AI:** `…/llms.txt`.

**Also changed on Start Here:**
- **"This site: …":** the hand-written address is now stamped from `BASE_URL`, between `tcf:site-address` markers.
- **Update checklist:** the "When this page changes, also update" list now names `README.md` and `docs/data/README.md`, which are hand-written.

**How it is built:**
- Every URL comes from **`BASE_URL`**, via the new `url_link()`, `addresses_html()` and `addresses_short_html()`. The chamber id range is read from the data.
- The generator **fails** if `index.html` or `start/index.html` lose their address markers.
- Pattern URLs (`chNNN`) are shown as `<code>` text, not as links, so they cannot become broken links.

**The README reword:**
- **Old:** "This repo is now the single source of truth for `docs/data/chambers.json`."
- **New:** "This repo is the **only place to edit** chamber data … It is the source for *editing*, not the answer for readers."

### One wording change from the Opus text (item 7)

- **Opus's draft:** "`docs/data/*.json` … lack roles, evidence levels, license, descriptions and review status".
- **The problem:** that is true of `chambers.json`, but **not** of `chamber-records.json`, which holds exactly those fields (as defaults and per-chamber overrides).
- **What I wrote instead:** "Those files are editing inputs, not complete records: `chambers.json` has no roles, evidence levels, license, descriptions or review status, and `chamber-records.json` holds only defaults and per-chamber overrides that are merged when the site is built."
- The rest of the note is as given.

**Published or not:** `README.md` and `docs/data/README.md` are deployed with the site, as before; only `docs/architecture/` and `docs/tests/` are excluded. So the note is visible both on GitHub and on the site.

## Checks

- **Plain text (tags stripped, no hrefs):** each of `index.html`, `start/index.html` and `chambers/index.html` contains all four required full URLs: `…/start/`, `…/license/`, `…/chambers/chNNN.html` and `…/llms.txt`.
- **Domain written only in `BASE_URL`:**
  - `tools/build_chambers.py` has the domain once, in `BASE_URL`.
  - In the hand pages, outside the stamped markers and canonical links, it appears **0** times.
  - **Two exceptions, not changed:**
    - `README.md` and `docs/data/README.md` are hand-written and are on the checklist.
    - `pages/skyhall.html` line 95 has `var BASE = 'https://chinsookling.github.io/tcf-chamber'` inside the 3D script. The standing rule is not to touch the 3D scripts, so I left it. **This is a Phase 6 item:** that line must change along with `BASE_URL`.
- **Schema:** 156/156 valid.
- **Page = JSON:** passes. The chamber pages and records are unchanged.
- **Two runs, identical output.**
- **Links:** 2,415 local links, 0 broken. The 168 new absolute links to this site all resolve to files in the repo.
- **Phone (390 px):** no horizontal scroll on the root page, Start Here or the chamber index. The long URLs wrap.

## For Qwen run 3

Merge, wait for green Actions, then **wait at least 10 minutes** (cache) before starting. Use a fresh conversation.
