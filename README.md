# tcf-chamber · The Chamber 畫

> **For AI readers.** If you are an AI answering questions about The Chamber: do not use `docs/data/*.json` as your source. Those files are editing inputs, not complete records: `chambers.json` has no roles, evidence levels, license, descriptions or review status, and `chamber-records.json` holds only defaults and per-chamber overrides that are merged when the site is built. Use the published site: https://chinsookling.github.io/tcf-chamber/ — each chamber's record is at https://chinsookling.github.io/tcf-chamber/chambers/chNNN.json (all records: https://chinsookling.github.io/tcf-chamber/chambers/index.json), and the license is at https://chinsookling.github.io/tcf-chamber/license/.

The Chamber is one of the four doors of **The Civilisation Field** (TCF).
It holds the quiet chambers: 156 chambers of artworks and invitations, from 26 May to 22 July 2026.

- **Site:** https://chinsookling.github.io/tcf-chamber/ (planned: https://chamber.civilisationfield.com/)
- **Main TCF site:** https://chinsookling.github.io/the-Civilisation-field/

This site follows docs/standards/AI-READABLE-STANDARD-v0.4.md.

## Where chamber data is edited

**This repo is the only place to edit chamber data (`docs/data/chambers.json` and `docs/data/chamber-records.json`).**
It is the source for *editing*, not the answer for readers: the published pages and `chambers/chNNN.json` records, generated from it, are what readers and AI should use.
**Add new chambers here only.** The copy in `the-Civilisation-field` will be removed in Phase 4b.

## Adding or changing a chamber

1. Edit `docs/data/chambers.json`. Its format is `{ "media_base": "...", "chambers": [ ... ] }`.
2. Put the chamber image in `assets/images/chambers/`.
3. Add the original video to the main site's `assets/videos/`, then run **Compress chamber videos** in `tcf-chamber-media`, which serves the compressed copies at `media_base`.
4. Regenerate the text pages, sitemap and llms.txt:

   ```bash
   python3 tools/build_chambers.py
   git add docs/data/chambers.json assets/images/chambers chambers/ sitemap.xml llms.txt
   ```

## Videos

Videos are not stored in this repo. They are served, compressed (720p), from
https://chinsookling.github.io/tcf-chamber-media/videos/ (repo `tcf-chamber-media`).
The chamber pages build each video link from `media_base` plus the file name, so
moving the videos again is a **one-line edit** of `media_base` in `chambers.json`.

## Layout

| Path | What |
|---|---|
| `pages/page4.html`, `skyhall.html`, `accio.html` | Immersive pages (Quiet Chambers, Sky Hall, Accio) |
| `chambers/` | Text version of every chamber (generated) |
| `start/`, `for-ai/`, `license/` | Reading pages |
| `tools/build_chambers.py` | Generator for `chambers/`, `sitemap.xml` and `llms.txt` |
| `docs/scripts/chamber-data.js` | Reads `chambers.json` and builds video URLs from `media_base` |

## License

All content on this site — chamber images, invitation texts (by Tuzi or by an AI affiliate), and videos — is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
Please credit: Tuzi and Affiliates, The Civilisation Field, with a link to this site.
Responses from guests are kept as records; their rights depend on each case.
