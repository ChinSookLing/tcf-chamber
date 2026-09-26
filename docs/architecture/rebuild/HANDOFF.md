# HANDOFF — Phase 4d (tcf-chamber: finish The Chamber site)

- **Phase:** 4d — menu, page4 video loading, "Last updated", and a v0.4 check
- **Branch:** `phase-4d-chamber-finish` from `main` @ `055fc73` (media switch merged)
- **Current owner:** Claude Code → next: Opus review → Tuzi merges → Tuzi tests on her phone
- Previous handoff (media switch): `git show 841fecf:docs/architecture/rebuild/HANDOFF.md`. The Phase 4b plan is in `git show 1e8c5cc:docs/architecture/rebuild/HANDOFF.md`.

## What changed

### 1. The 3D page menu (`docs/scripts/nav.js`)

The top menu on page4, Sky Hall and Accio now matches the banner: **Door · 琴 The Conservatory · 棋 Play · 書 The Library · 畫 The Chamber · About Us**.

| Item | Link |
|---|---|
| Door | main `index.html` |
| 琴 The Conservatory | main `pages/conservatory.html` |
| 棋 Play | https://play.civilisationfield.com/ |
| 書 The Library | main `index.html` |
| 畫 The Chamber ▾ | `page4.html`. The sub-menu keeps **Chambers, Sky Hall, Accio** |
| About Us | main `about/` |

- **Removed:** Lantern, 棋 Board Room, The Field, and **Formula Room** from the 畫 sub-menu. Formula Room belongs to the main site, and the task listed only Chambers, Sky Hall and Accio.
- **書 changed shape:** it is now a **plain link, as in the banner**. Before, it was a drop-down with The Brain, Trails, Resonance and The Scroll, all main-site pages.
- **Unchanged:** the menu's look and code (only the item list changed). Checked at 1280 and 390 px: the items render, and there are 0 JS errors.

### 2. Video loading on page4

**What I found.** The vertical detail section has **no** video that loads on its own. Its video loads only when "▶ Enter the Living Record" is pressed, and then plays in an overlay. The videos that loaded on their own were the **horizontal gallery cards** at the top. Their lazy-loader started any card within 600 px of the screen, so several videos downloaded at once. The overlay video also had **no poster**, so it showed black until it had buffered.

**Changes** (layout and design unchanged):

- **Gallery cards load only when on screen:** the IntersectionObserver `rootMargin` changed from `'300px 600px'` / threshold 0.01 to `'0px'` / threshold 0.5. Each card still pauses and unloads when it leaves the screen, as before.
- **The overlay has a poster:** the "Living Record" button now carries `data-poster` (the chamber image), and the overlay `<video>` shows it straight away. It is still `preload="metadata"` and only starts when the button is pressed.
- **Gallery videos pause while the overlay is open:** opening the overlay pauses the card videos and releases their downloads (`tcfPauseCardVideos`). Closing it lets the cards on screen load again (`tcfResumeCardVideos`), so the Living Record video gets the connection to itself.
- **The overlay stops its download on close:** closing it now pauses the video and removes its `src` before clearing the panel. Before, it only emptied the panel.

**Measured** (headless Chromium, video requests served from local copies of the compressed files):

| | Phone 390 px, before | Phone 390 px, after | Desktop 1280 px, before | Desktop 1280 px, after |
|---|---|---|---|---|
| Video files requested on page load (5 s) | 2 | **1** | 3 | 3 |
| After scrolling down 3 screens | 2 | 1 | 3 | 3 |
| Requests when pressing "Enter the Living Record" | 1 | 1 | 1 | 1 |
| Overlay video has a poster | no | **yes** | no | **yes** |
| Overlay video left after closing | 0 | 0 | 0 | 0 |

- **Desktop stays at 3** because 3 gallery cards are fully on screen at 1280 px.
- **Not measurable here:** this test browser cannot decode H.264, so card videos fall back to still images on both versions. That means the "pause cards while the overlay is open" effect could not be measured. **Please check on your phone** that the Living Record video starts faster and that the gallery resumes after closing.
- **Screenshot check:** at 390 px, the overlay shows the chamber image as the poster even before the video arrives.

### 3. "Last updated" (v0.4 item 5)

- **Hand-made pages:** `start/`, `for-ai/`, `license/` and `index.html` have a small footer line: `Last updated: 2026-09-26`.
- **Generated pages:** the generator writes the same line on all 157 chamber pages, using a new constant `LAST_UPDATED = '2026-09-26'` at the top of `tools/build_chambers.py`. **Change it and re-run whenever chamber content changes.**
- **Style:** `.tcf-reading__updated`, a small grey line added to `tcf-reading.css`.

## 4. v0.4 "Must" check for tcf-chamber (report only)

| # | Must item | Status | Gap, if any |
|---|---|---|---|
| 1 | Readable body in raw HTML | ✅ reading pages · ◐ 3D pages | page4, Sky Hall and Accio show chamber content only through JS. Each has a plain-HTML readable block (h1, description, links); page4's links to the text index, but **Sky Hall's and Accio's do not link to `chambers/`**. |
| 2 | Public content without login | ✅ | — |
| 3 | Page identity (what, who, when) on the home page | ◐ | The root `index.html` says **what** it is, but not **who** made it or **when** it started. Those are only on `start/`. |
| 4 | Core definitions, consistent terms | ✅ | "The Chamber", "quiet chambers" and "靜室" are used consistently. There is no glossary; one is optional here. |
| 5 | Author, first published, last updated | ◐ | "Last updated" is now on every reading page. The chamber pages show the creator and date. **`index.html`, `for-ai/` and `license/` have no author line**, and **no page has a site-level "first published" date**. The 3D pages have neither. |
| 6 | Images have text alternatives | ✅ | Generated pages use "Illustration for …". page4's JS images have alt text (Phase 1). Sky Hall and Accio draw images on a canvas; their text version is `chambers/`. |
| 7 | Clear semantic structure | ✅ | One h1 per page, h2 sections, lists. |
| 11 | License statement | ◐ | `license/` exists and every reading page links to it. **The 3D pages' readable blocks do not link to the license.** |
| 15 | Start Here (Must for main sites) | ◐ | `start/` has the 9 sections, a date and the For AI part. §15.6 (single source) is **partly met**: llms.txt is generated from it, but the meta descriptions are not, and there is **no "update these places too" checklist** at the bottom of Start Here, which §15.6 names as the minimum. |

"Should" items seen along the way (not required for v1):

- **No `<link rel="canonical">`** on any page (#13).
- **No meta description** on page4, Sky Hall or Accio (#13).
- **No `robots.txt`.** The crawl policy (§6) is still to be decided with the domain in Phase 6.
- **Trust boundary (#12):** `for-ai/` exists. The 3D pages do not link to it.

**Summary.** The reading layer meets most Must items. The main gaps:
- (a) who/when on the root page;
- (b) author lines;
- (c) license, text index and for-ai links from the 3D pages' readable blocks;
- (d) the §15.6 sync checklist on Start Here.

Each of these is a small fix and could form a short follow-up phase.

## How tested

- **Menu:** the item list and links were read from the rendered page at 1280 and 390 px. JS errors: 0.
- **page4 video:** before/after measured (table above) against a copy of `main` from before the change. The overlay poster was confirmed with a screenshot at 390 px.
- **Generator:** re-run; the "Last updated" line is on all 157 generated pages and the 4 hand-made pages.
- **Not tested:** real playback on a phone, and the live site.

## Risks

- **Card videos start a little later:** they now start when a card is at least half on screen, not 600 px before. On a slow phone this is the intended trade-off.
- **The Library link is flatter:** the 書 drop-down (The Brain / Trails / Resonance / The Scroll) no longer shows on chamber pages. The link goes to the main site's Door, where the Library lives.

## Questions for Tuzi

1. Formula Room was removed from the 畫 sub-menu on the chamber site, because it stays in the main site. Is that OK?
2. Should the v0.4 gaps above (a–d) be fixed in a small Phase 4e?

## Next suggested phase

Phase 4e (the small v0.4 gaps) → Phase 4b (redirects in the main repo, and removals once the originals are backed up).
