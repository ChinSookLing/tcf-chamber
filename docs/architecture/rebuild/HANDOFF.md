# HANDOFF — Phase 4c (tcf-chamber)

- **Phase:** 4c — banner and standards (the video test runs in the main repo only)
- **Branch:** `phase-4c-banner-standards` from `main` @ `e3dc910` (Phase 4 merged). The main repo has a matching branch with its own HANDOFF.
- **Current owner:** Claude Code → next: Opus review
- **Phase 4 handoff** (size report, Pages steps, Phase 4b redirect/removal plan) is in git history: `git show 1e8c5cc:docs/architecture/rebuild/HANDOFF.md`. **The Phase 4b plan there is still valid.**

## What changed

### A. Banner

**Door · 琴 The Conservatory · 棋 Play · 書 The Library · 畫 The Chamber · About Us**

- **Hand-made pages:** the readable blocks of `pages/page4.html`, `skyhall.html` and `accio.html`, plus `index.html`, `start/`, `for-ai/` and `license/`.
- **Generated pages:** the 157 chamber pages, after changing `tools/build_chambers.py` `NAV` and regenerating.
- **Link targets:**
  - "Board Room" is removed.
  - "About Us" goes to the main site's `about/`, as an absolute URL.
  - 畫 stays local.
  - All other links point to the main site with absolute URLs.
- **Not changed:** `docs/scripts/nav.js`. It still has the old menu; the follow-up is listed in the main repo HANDOFF.

### B. Standards

- `docs/standards/AI-READABLE-STANDARD-v0.4.md` is added. It is identical to the main repo copy (checked with `cmp`).
- A line is added to `README.md`: "This site follows docs/standards/AI-READABLE-STANDARD-v0.4.md."

## How tested

- **Links:** 2,088 local links checked, 0 broken. No banner still contains "Board Room".
- **Generator:** re-run. `sitemap.xml` still has 164 URLs, and `llms.txt` is unchanged apart from being regenerated.

## Not done yet

- **Menu:** the `nav.js` menu (listed in the main repo HANDOFF).
- **Phase 4b:** redirects and removals in the main repo.
- **Videos:** the video move or compression waits for Tuzi's decision after the test.

## Risks

- None new.

## Questions for Tuzi

- None for this repo.

## Next suggested phase

See the main repo HANDOFF.
