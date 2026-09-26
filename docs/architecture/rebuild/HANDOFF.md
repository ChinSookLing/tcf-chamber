# HANDOFF — Phase 4 (The Chamber split)

- **Phase:** 4 — split out The Chamber (畫) into its own site
- **Repo / branch:** `tcf-chamber` · `phase-4-chamber-split`
- **Source:** `the-Civilisation-field` @ `f92ec27` (main, Phase 3 live). It was **read only and not modified.**
- **Current owner:** Claude Code → next: Tuzi fills 2 `[TUZI TO FILL]` markers and turns on Pages → Opus review
- **Decision followed:** "A + B in two steps" (Opus and Tuzi). This phase copies the code, data, reading layer and images (about 224 MB). **Videos are not copied**; for now they load from the main site through a single `media_base`.

## Step 0: size report (summary)

| Group | Files | Size | Copied? |
|---|---|---|---|
| Videos, as referenced by `chambers.json` | 159 | 1,328.8 MB | ❌ no. They load from `media_base` (the main site) |
| Unused videos in `assets/videos/` | 3 | 12 MB | ❌ no |
| Chamber images | 156 | 221.5 MB | ✅ yes |
| Unused image `ch037-wooden-room-claude.jpg` | 1 | 0.06 MB | ❌ no (not referenced) |
| Pages, scripts, styles, data, reading layer | ~170 | < 1 MB | ✅ yes |
| **tcf-chamber total, excluding `.git`** | | **≈ 224 MB** | |

- No file is over 50 MB. The largest image is under 5 MB.
- The full Step 0 report, with all options A–D, was delivered to Tuzi separately.

## What changed (new repo contents)

| Path | Source / change |
|---|---|
| `pages/page4.html`, `pages/skyhall.html`, `pages/accio.html` | **Copied.** Only the paths and data loading changed (see "Page edits" below). Layout, design and behaviour are unchanged. |
| `docs/data/chambers.json` | **Copied, then wrapped:** `{ "media_base": "https://chinsookling.github.io/the-Civilisation-field/assets/videos/", "chambers": [ … ] }`. The `chambers` array is **identical** to the source; a script compared it (`==` True). This is the only structural change. |
| `docs/scripts/chamber-data.js` | **New.** `TCFChamberData.list(json)` returns the chamber array with each video path turned into `media_base` + file name. Images are untouched. It also accepts the old bare-array format. |
| `docs/scripts/nav.js` | **Copied and adapted.** Chamber pages (page4, skyhall, accio) stay local. All other links (Lantern, 琴, 棋 Board Room, 書 group, Formula Room, The Field) point to the main site with absolute URLs. |
| `docs/scripts/cosmos.js`, `field3d.js` | Copied unchanged |
| `docs/styles/field-tokens.css`, `tcf-readable.css`, `tcf-reading.css` | Copied unchanged |
| `assets/favicon.svg`, `assets/images/chambers/` (156 images) | Copied unchanged |
| `tools/build_chambers.py` | **Copied and adapted** (see "Generator" below) |
| `chambers/` (157 pages), `sitemap.xml`, `llms.txt` | **Generated** by the adapted script |
| `start/index.html` | **New.** Start Here for The Chamber: 9 sections, 2 `[TUZI TO FILL]` markers |
| `for-ai/index.html`, `license/index.html` | **New.** Same exact texts as the main site |
| `index.html` | **New.** A small plain landing page: what The Chamber is, with links to the immersive gallery, Sky Hall, Accio, the text index and Start Here |
| `README.md` | **Rewritten.** Says this repo is the single source of truth for `chambers.json` and that new chambers are added here only, and explains how to regenerate. |
| `.github/workflows/deploy-pages.yml` | **New.** Same approach as the main repo, excluding `docs/architecture/` and `*.bak*` |
| `.nojekyll` | New (as in the main repo) |

### Page edits (paths only, no design change)

- **All three pages:**
  - The readable-block links to Door, Board Room, 琴 and 書 now use absolute URLs to the main site; 畫 stays local.
  - One `<script src="../docs/scripts/chamber-data.js">` line is added.
- **page4:** `const data = TCFChamberData.list(await res.json());` (one line).
- **skyhall:**
  - `.then(TCFChamberData.list)` is added after `r.json()`.
  - `resolveAsset()` now passes absolute URLs straight through (one line).
  - The file:// fallback `BASE` now points to `https://chinsookling.github.io/tcf-chamber`.
- **accio:**
  - `.then(TCFChamberData.list)` is added after `r.json()`.
  - `v.crossOrigin = 'anonymous'` is added before the video `src` (one line). Accio draws videos as WebGL textures, and a video from another origin can only be used in WebGL if it is requested with CORS. Sky Hall already had this line. Without it, Accio videos would stop showing once they come from the main site. This does not change behaviour.
- **Kept exactly:** Accio's names (Tuzi, Grok, Gemini, DeepSeek, GPT, Copilot, **Fable**). The test confirmed these sigil labels are the same on both sites.

### Generator (`tools/build_chambers.py`)

- It reads `{media_base, chambers}`, and still accepts the old array format. Each video link = `media_base` + file name.
- Top links point to the main site with absolute URLs, and 畫 is local. The footer links go to the local start/, for-ai/ and license/.
- `BASE_URL = https://chinsookling.github.io/tcf-chamber/` (planned: `https://chamber.civilisationfield.com/`).
- `sitemap.xml` has **164 URLs**: the root, the 3 immersive pages, start/, for-ai/, license/, the chambers index and the 156 chambers.
- `llms.txt` covers The Chamber only. Its "What" line is read from `start/` (`id="what-sentence"`).

## How to re-run the generator

```bash
cd tcf-chamber
python3 tools/build_chambers.py
#  → chambers: 156 pages + index.html written to chambers/
#  → sitemap.xml (164 URLs) and llms.txt written
```

- **Moving the videos later:** change **only** `media_base` in `docs/data/chambers.json`, then re-run the generator. The three pages pick up the new address automatically.

## Step 4: turning on GitHub Pages (for Tuzi)

1. Merge this PR on GitHub.
2. Open https://github.com/ChinSookLing/tcf-chamber/settings/pages
3. Under **Build and deployment → Source**, choose **GitHub Actions**. Do not choose "Deploy from a branch".
4. Open https://github.com/ChinSookLing/tcf-chamber/actions, click **Deploy Pages (curated)**, then **Run workflow** → branch `main` → **Run workflow**. This step is needed because the merge may have run before Pages was switched on.
5. Wait for the green tick (about 2–4 minutes). The site is then at **https://chinsookling.github.io/tcf-chamber/**

## How tested

- **Self-contained:** a script checked 171 HTML, CSS and JS files in tcf-chamber. **0 broken local paths** and **no relative links into the main repo**. The only external hosts are cdnjs (Three.js), Google Fonts, chinsookling.github.io (the main site and its videos), creativecommons.org and play.civilisationfield.com.
- **Data:** the `chambers` array in the wrapped JSON equals the source array. 156/156 images are present. All 159 video file names in `chambers.json` exist in the main repo's `assets/videos/`.
- **Generator:** the Phase 2 content check passes, and video links now use `media_base`.
- **Side-by-side comparison:** the original site and the new repo were both served locally and opened in headless Chromium at 1280 px and 390 px. Videos requested from the main site were served from the local copies, which confirms the new URLs point to real files. The results are in REVIEW.md §4, and 16 comparison images are in `docs/architecture/rebuild/compare/`.
- **Not tested:** the live site (the sandbox cannot reach GitHub Pages) and real video playback. This test browser (Playwright Chromium) cannot decode H.264 MP4 and cancels media loads when the page changes, so it shows the same video load failures on **both** sites. What was checked is that the correct video URLs are requested.

## Step 5: plan for Phase 4b (report only; nothing changed in the main repo)

### A. Redirects (old URL in the main site → new URL)

| Old (the-Civilisation-field) | New (tcf-chamber) |
|---|---|
| `…/the-Civilisation-field/pages/page4.html` | `https://chinsookling.github.io/tcf-chamber/pages/page4.html` |
| `…/the-Civilisation-field/pages/skyhall.html` | `https://chinsookling.github.io/tcf-chamber/pages/skyhall.html` |
| `…/the-Civilisation-field/pages/accio.html` | `https://chinsookling.github.io/tcf-chamber/pages/accio.html` |
| `…/the-Civilisation-field/chambers/` and `chambers/index.html` | `https://chinsookling.github.io/tcf-chamber/chambers/` |
| `…/the-Civilisation-field/chambers/ch001.html` … `ch156.html` (156 pages) | `https://chinsookling.github.io/tcf-chamber/chambers/chNNN.html` (same file name) |

GitHub Pages has no server-side redirects, so each old page becomes a small HTML page. It uses `<meta http-equiv="refresh" content="0; url=NEW">` and `<link rel="canonical" href="NEW">`, and shows a visible "This page has moved to …" link. The 156 chamber stubs can be generated by a script. After Phase 6, the "New" column changes to `https://chamber.civilisationfield.com/…`.

### B. Links in the main repo to update to the new site (in 4b)

- **畫 links:**
  - `docs/scripts/nav.js`: the 畫 group (Chambers, Sky Hall, Accio). Formula Room stays in the main site.
  - The Phase 1 readable blocks in `index.html` and every `pages/*.html` (畫 The Chamber → page4).
  - `pages/castle-greybox.html` `DOOR_URL['畫']`.
  - `pages/formula-room.html` "back" link → page4.
- **Reading pages:** `start/index.html` (Where → 畫), `tools/build_chambers.py` (NAV 畫, `llms.txt` and `sitemap.xml`), `llms.txt`, `sitemap.xml`.

### C. To remove from the main repo later, so that `chambers.json` exists in one place only

| Item | When |
|---|---|
| `docs/data/chambers.json` and `docs/data/chambers.json.bak*` (4 backup files) | 4b, after the redirects are live |
| `pages/page4.html`, `skyhall.html`, `accio.html` (replaced by redirect stubs) | 4b |
| `chambers/*.html` (replaced by redirect stubs) | 4b |
| `assets/images/chambers/` (157 files, 222 MB) | 4b, once nothing in the main repo uses it |
| The chamber part of main `tools/build_chambers.py` | 4b: the main repo still needs the script for its own `sitemap.xml` and `llms.txt`, so it will be simplified, not deleted |
| `check_chamber_ratios.py` (reads `chambers.json`) | 4b: move it to tcf-chamber or delete it (Tuzi decides) |
| The `chambers.json: OK` check line in the main deploy workflow | 4b |
| **`assets/videos/` (1.4 GB)** | ⚠️ **Must STAY in the main repo until the separate video phase is done.** tcf-chamber loads the videos from there through `media_base`. |
| `docs/scripts/field3d.js`, `cosmos.js`, `nav.js`, `field-tokens.css` | **Keep.** Other main pages still use them (castle-greybox and formula-room use field3d). |

**Until Phase 4b, do not add new chambers in either repo** (as Opus said). From 4b on, add them in `tcf-chamber` only.

## Not done yet

- There are 2 `[TUZI TO FILL]` markers in `start/`. See Questions.
- GitHub Pages is not switched on yet (Step 4, Tuzi).
- Phase 4b (redirects and removals in the main repo) and the video phase are separate.

## Risks

- **Reliance on the main site for videos:** until the video phase is done, tcf-chamber depends on `chinsookling.github.io/the-Civilisation-field/assets/videos/`. If the main repo's videos move or are deleted before then, chamber videos stop working. This is mitigated by the one-line `media_base` change.
- **Two copies of the data:** until 4b, `chambers.json` exists in both repos. Please add no new chambers anywhere until 4b.
- **Push size:** this PR carries about 222 MB of images. If GitHub or the proxy rejects the push, I will split it into several pushes. See the PR notes.
- **Loading from the main site:** page4 plays videos in plain `<video>` elements, which work across origins without CORS. Sky Hall and Accio draw videos as WebGL textures, which **need a CORS request**. Sky Hall already sets `crossOrigin='anonymous'`, and I added the same one line to Accio. GitHub Pages sends `Access-Control-Allow-Origin: *`, so this should work, but it **could not be confirmed from the sandbox**. **Please check on the live site that Sky Hall and Accio videos play.**

## Questions for Tuzi

1. Please fill the `start/` markers: (a) how a new chamber is made; (b) are new chambers still being made?
2. Is the site root (`index.html`) a small plain landing page with links, or should it open the immersive gallery (page4) directly?
3. `check_chamber_ratios.py` in the main repo: move it to tcf-chamber, or delete it in 4b?

## Next suggested phase

Phase 4b, in the main repo, once tcf-chamber is live and checked: redirects and link updates (A + B above). The removals (C) come after that, apart from `assets/videos/`.
