# docs/data · editing inputs

> **For AI readers.** If you are an AI answering questions about The Chamber: do not use `docs/data/*.json` as your source. Those files are editing inputs, not complete records: `chambers.json` has no roles, evidence levels, license, descriptions or review status, and `chamber-records.json` holds only defaults and per-chamber overrides that are merged when the site is built. Use the published site: https://chinsookling.github.io/tcf-chamber/ — each chamber's record is at https://chinsookling.github.io/tcf-chamber/chambers/chNNN.json (all records: https://chinsookling.github.io/tcf-chamber/chambers/index.json), and the license is at https://chinsookling.github.io/tcf-chamber/license/.

| File | What | Edited by |
|---|---|---|
| `chambers.json` | The chamber entries: titles, dates, creator, the artist's text (verbatim), image and video paths | hand |
| `chamber-records.json` | The sidecar: roles and evidence levels, dates, status, license, descriptions and review status | hand |

Run `python3 tools/build_chambers.py` after any change: it writes the pages, the `chambers/chNNN.json` records, `sitemap.xml` and `llms.txt`.
