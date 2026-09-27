# TCF Implementation Profile v0.1 — DRAFT

**Status:** DRAFT, for Opus and Tuzi review · **Date:** 2026-09-27 · **Builds on:** `AI-READABLE-STANDARD-v0.4.md` (unchanged)
**Reference implementation:** tcf-chamber (content template). Play is the participation template and will adopt the same record fields.

v0.4 asks whether a *site* is readable. This profile asks whether each **work** is readable, attributable and checkable. Every rule below can be checked by a script or by the test set.

## 1. One authoritative record per item

- Each content item (a chamber, a game, a book chapter, a track) has **one authoritative record**. Pages, summaries, `llms.txt`, sitemaps and machine files are **generated from it**, never written separately.
- **Visible text and machine data must say the same thing.** The generator fails if they differ (tcf-chamber: `check_page_matches_json`).
- Source data that holds artistic text is **never rewritten**. New fields go in a sidecar (tcf-chamber: `docs/data/chamber-records.json`), keyed by item id.
- Every item publishes a JSON record next to its page (`<id>.json`, linked with `<link rel="alternate" type="application/json">`), plus an `index.json` listing all records.

## 2. Record fields

| Group | Fields | Rule |
|---|---|---|
| Identity | `id`, `url`, `json_url`, `title` (all languages), `record_version`, `record_schema` | The URL is the canonical page. |
| Roles | `creator`, `inviter` (author of the invitation or accompanying text), `editor`, `publisher`, `ai_tool` | Name the AI system where it applies. If the tool is unknown, say so. |
| Nature | e.g. `artwork`, `invitation` (artistic expression), `artist-note`, `project-definition`, `raw-record`, `description` | **Artistic expression is kept verbatim.** Factual context sits beside it and never rewrites it. |
| Dates | `created`, `first_published`, `content_revised`, `migrated_to_this_site`, `status_checked` | Kept apart, and never merged into one "date". |
| Status | `current` / `historical` / `draft` / `superseded` (+ `superseded_by` link) | State the basis for the status. |
| License | Per item and per part (image, text, video), `credit`, `exceptions` | If unknown, mark it unknown and do not assume. |
| Descriptions | `image`, `video` (and `audio` where relevant), each with `drafted_by` + `review_status` | See §4. |
| Provenance | `source` (the original entry, verbatim), `generated_from` | So any field can be traced back to its source. |

**Unknown facts** are written `{ "value": null, "reason": "…" }`. Nothing is guessed. A placeholder that Tuzi must decide is `[TUZI TO FILL]` and must be gone before the site goes live.

## 3. Evidence kinds (kept apart)

- **`self-statement`**: the creator says it, e.g. a signature inside the text ("— GPT · 19/06/2026").
- **`tool-record`**: observed by a system, e.g. a git merge date or a workflow log.
- **`human-verified`**: a person checked it and the record says who and when.
- **`site-record`**: entered in the site data but not independently verified.

Each role or date carries its evidence kind. A page must never present a `site-record` as `human-verified`.

## 4. Media alternatives

- **Image description:** objective (what is visible), kept **separate from interpretation**. Short, then detailed if needed.
- **Video:** a descriptive transcript with timestamps (what is seen and heard, and when).
- **Audio:** notes on instruments, voice and mood. **No invented lyrics.** Lyrics only if a source exists.
- **Every description records who drafted it** (a person, or an AI and which one) and its review status, e.g. `AI-drafted, not reviewed`, or `reviewed by Tuzi 2026-10-01`. Unreviewed AI descriptions are labelled as such on the page.

## 5. Three layers for long content

1. **Short intro:** 1–3 sentences, which may be generated.
2. **Sectioned body with stable anchors**, e.g. `#section-2`. Anchors never change once published.
3. **The original record**, verbatim, linked from the page.

## 6. Versions (kept apart)

- **Standard version:** which profile or standard the site follows (this file: v0.1).
- **Content version:** `record_version` of the item's record, bumped when the record format changes.
- **State version:** for live items (e.g. Play games), a state counter such as `expected_move_number`. It is checked on every write.

## 7. Acceptance tests (deep content, not only the home page)

Each site keeps a fixed test set, `docs/tests/<site>-outsider-test.md`, that covers **8 question types**. Every question gives the expected answer and the URL or field it comes from.

| # | Type | Asks about |
|---|---|---|
| 1 | Identity | The site itself |
| 2 | Deep content | A specific work's own text |
| 3 | Time and status | Dates and status of an item |
| 4 | Attribution | Who created it, who wrote the text, and the evidence kind |
| 5 | No-answer | A question the site does not answer. The only correct reply is "the site does not say". |
| 6 | Multimedia | What is (and is not) described for an image, video or audio |
| 7 | License per item | License and credit for a specific item |
| 8 | What did you read? | Which URLs the AI actually read |

- **A site passes** when an outside AI answers correctly, with sources, across at least 2 runs.
- **"Reading the site" and "reading the works" are tested separately.** Passing the home-page questions is not enough.

## 8. Checks the generator must run

- **Identical output:** two runs in a row produce the same files.
- **Schema:** every record validates against its schema.
- **Page = JSON:** visible fields equal the JSON fields.
- **Links:** 0 broken local links.
- **Placeholders:** no `[TUZI TO FILL]` left on public pages.
