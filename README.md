# tcf-chamber · The Chamber 畫

The Chamber is one of the four doors of **The Civilisation Field** (TCF).
It holds the quiet chambers: 156 chambers of artworks and invitations, from 26 May to 22 July 2026.

- **Site:** https://chinsookling.github.io/tcf-chamber/ (planned: https://chamber.civilisationfield.com/)
- **Main TCF site:** https://chinsookling.github.io/the-Civilisation-field/

## Single source of truth

**This repo is now the single source of truth for `docs/data/chambers.json`.**
**Add new chambers here only.** The copy in `the-Civilisation-field` will be removed in Phase 4b.

## Adding or changing a chamber

1. Edit `docs/data/chambers.json`. Its format is `{ "media_base": "...", "chambers": [ ... ] }`.
2. Put the chamber image in `assets/images/chambers/`.
3. Put the video wherever `media_base` points. For now that is the main site's `assets/videos/`.
4. Regenerate the text pages, sitemap and llms.txt:

   ```bash
   python3 tools/build_chambers.py
   git add docs/data/chambers.json assets/images/chambers chambers/ sitemap.xml llms.txt
   ```

## Videos

Videos are not stored in this repo. The chamber pages build each video link from
`media_base` plus the file name, so moving the videos later is a **one-line edit**
of `media_base` in `chambers.json`.

## Layout

| Path | What |
|---|---|
| `pages/page4.html`, `skyhall.html`, `accio.html` | Immersive pages (Quiet Chambers, Sky Hall, Accio) |
| `chambers/` | Text version of every chamber (generated) |
| `start/`, `for-ai/`, `license/` | Reading pages |
| `tools/build_chambers.py` | Generator for `chambers/`, `sitemap.xml` and `llms.txt` |
| `docs/scripts/chamber-data.js` | Reads `chambers.json` and builds video URLs from `media_base` |

## License

Original content is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
AI and guest responses are preserved as records; their rights depend on each case.
