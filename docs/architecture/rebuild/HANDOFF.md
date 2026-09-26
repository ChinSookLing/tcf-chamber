# HANDOFF — Media switch (tcf-chamber)

- **Phase:** Video phase, step 2: switch The Chamber to the compressed media site
- **Branch:** `media-switch` from `main` @ `97bc60f`
- **Current owner:** Claude Code → next: Opus review → Tuzi merges → Tuzi tests Sky Hall and Accio videos on her phone
- Phase 4c handoff: `git show 7991c91:docs/architecture/rebuild/HANDOFF.md`
- Phase 4 handoff, including the Phase 4b plan: `git show 1e8c5cc:docs/architecture/rebuild/HANDOFF.md`

## Before switching: checks

- **Media workflow:** `tcf-chamber-media` run #1 of **Compress chamber videos** finished with `success` (compress → deploy → check). Opus reports 1,393 MB → 255 MB, all 159 URLs returning 200, and CORS allowed.
- **File list:** I compared the `videos/` list on `tcf-chamber-media` `main` with the chamber list. All **159 are present, 0 missing, 0 extra**.

## What changed

| File | Change |
|---|---|
| `docs/data/chambers.json` | **Only `media_base`** changed: `…/the-Civilisation-field/assets/videos/` → `https://chinsookling.github.io/tcf-chamber-media/videos/`. The `chambers` array is unchanged; a script compared it before and after. |
| `chambers/*.html` (156 + index), `sitemap.xml`, `llms.txt` | Regenerated. Video links now point at the media site. Nothing else changed. |
| `start/index.html` | Current status: "videos are still served from the main site" → "videos are served from a separate media site", with "media site" linked to https://chinsookling.github.io/tcf-chamber-media/. The approved text is unchanged, and the page is still about 340 words. |
| `README.md` | Updated the "Videos" and "Adding a chamber" notes: add the original to the main site's `assets/videos/`, then run **Compress chamber videos** in `tcf-chamber-media`. |

- **The three 3D pages need no change.** page4, skyhall and accio build video URLs from `media_base` through `docs/scripts/chamber-data.js`, so they follow the switch automatically. Accio's `crossOrigin='anonymous'` from Phase 4 works with the media site's CORS header.

## How tested

- **Video links:** the generated pages contain 159 distinct video links, and **all 159 file names exist** in `tcf-chamber-media/videos/`.
- **Old links:** no file (excluding `docs/architecture/`) still links to `the-Civilisation-field/assets/videos`.
- **Content:** the `chambers` array is identical before and after, and the approved Start Here text is intact.
- **Not tested:** real playback, because the sandbox cannot reach GitHub Pages. **Tuzi, please test Sky Hall and Accio on your phone after merging.**

## What this unlocks: Phase 4b

The Chamber no longer needs the main repo's `assets/videos/`. Before Phase 4b removes it:

1. Tuzi backs up the original high-quality videos (a computer or Google Drive).
2. The Phase 4b plan (redirects, then removals) is in `git show 1e8c5cc:docs/architecture/rebuild/HANDOFF.md`, Step 5. The line "assets/videos must STAY" can then be lifted, once the backup is done and the Conservatory and other pages are confirmed not to use it (to be re-checked in 4b).

## Risks

- **Media site dependency:** if `tcf-chamber-media` Pages ever goes down, chamber videos stop. Images and text still work.

## Questions for Tuzi

- None.
