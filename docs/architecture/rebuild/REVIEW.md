# REVIEW — Phase 5a (tcf-chamber · `phase-5a-chamber-template`)

```
 322 files changed, 28056 insertions(+), 178 deletions(-)
```

## 1. `docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md` (full)

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


## 2. `docs/standards/chamber-record.schema.json` (full)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://chinsookling.github.io/tcf-chamber/docs/standards/chamber-record.schema.json",
  "title": "TCF chamber record v0.1",
  "description": "One record per quiet chamber (chambers/<id>.json), generated from docs/data/chambers.json + docs/data/chamber-records.json. See TCF-IMPLEMENTATION-PROFILE-v0.1.md. Unknown facts are {value: null, reason}; nothing is guessed.",
  "type": "object",
  "required": ["record_version", "record_schema", "id", "url", "json_url", "title", "media", "text", "roles", "nature", "dates", "status", "license", "descriptions", "source", "generated_from"],
  "properties": {
    "record_version": { "const": "0.1" },
    "record_schema": { "type": "string", "format": "uri" },
    "id": { "type": "string", "pattern": "^ch[0-9]{3}[a-z]?$" },
    "url": { "type": "string", "format": "uri" },
    "json_url": { "type": "string", "format": "uri" },
    "title": {
      "type": "object", "required": ["en", "zh"],
      "properties": { "en": { "type": "string", "minLength": 1 }, "zh": { "type": "string", "minLength": 1 } }
    },
    "media": {
      "type": "object", "required": ["image_url", "video_urls"],
      "properties": {
        "image_url": { "type": "string", "format": "uri" },
        "video_urls": { "type": "array", "items": { "type": "string", "format": "uri" } }
      }
    },
    "text": { "type": "string", "description": "The invitation or artist note, verbatim from chambers.json." },
    "roles": {
      "type": "object", "required": ["creator", "inviter", "editor", "publisher", "ai_tool"],
      "properties": {
        "creator": { "$ref": "#/$defs/person" },
        "inviter": { "$ref": "#/$defs/person" },
        "editor": { "$ref": "#/$defs/named" },
        "publisher": { "$ref": "#/$defs/named" },
        "ai_tool": { "$ref": "#/$defs/fact" }
      }
    },
    "nature": {
      "type": "object", "required": ["image", "video", "text", "text_kept_verbatim"],
      "properties": {
        "image": { "enum": ["artwork"] },
        "video": { "enum": ["artwork"] },
        "text": { "enum": ["invitation", "artist-note"] },
        "text_kept_verbatim": { "const": true }
      }
    },
    "dates": {
      "type": "object", "required": ["created", "first_published", "content_revised", "migrated_to_this_site", "status_checked"],
      "properties": {
        "created": { "$ref": "#/$defs/fact" },
        "first_published": { "$ref": "#/$defs/fact" },
        "content_revised": { "$ref": "#/$defs/fact" },
        "migrated_to_this_site": { "$ref": "#/$defs/fact" },
        "status_checked": { "$ref": "#/$defs/fact" }
      }
    },
    "status": {
      "type": "object", "required": ["value"],
      "properties": {
        "value": { "enum": ["current", "historical", "draft", "superseded"] },
        "basis": { "type": "string" },
        "superseded_by": { "type": "string", "format": "uri" }
      }
    },
    "license": {
      "type": "object", "required": ["image", "text", "video", "credit", "exceptions"],
      "properties": {
        "image": { "type": "string" }, "text": { "type": "string" }, "video": { "type": "string" },
        "credit": { "type": "string" },
        "exceptions": { "type": "array", "items": { "type": "string" } },
        "source": { "type": "string" }
      }
    },
    "descriptions": {
      "type": "object", "required": ["image", "video"],
      "properties": { "image": { "$ref": "#/$defs/description" }, "video": { "$ref": "#/$defs/description" } }
    },
    "source": { "type": "object", "description": "The chambers.json entry, verbatim.", "required": ["id", "date", "name_en", "name_zh", "created_by", "invitation", "invitation_by"] },
    "generated_from": { "type": "array", "items": { "type": "string" } }
  },
  "$defs": {
    "evidence": { "enum": ["self-statement", "tool-record", "human-verified", "site-record"] },
    "person": {
      "type": "object", "required": ["key", "name", "evidence"],
      "properties": { "key": { "type": "string" }, "name": { "type": "string" }, "evidence": { "$ref": "#/$defs/evidence" }, "source": { "type": "string" } }
    },
    "named": {
      "type": "object", "required": ["name", "evidence"],
      "properties": { "name": { "type": "string" }, "evidence": { "$ref": "#/$defs/evidence" }, "source": { "type": "string" } }
    },
    "fact": {
      "type": "object", "required": ["value"],
      "properties": {
        "value": { "type": ["string", "null"] },
        "reason": { "type": "string" },
        "evidence": { "$ref": "#/$defs/evidence" },
        "source": { "type": "string" }
      },
      "if": { "properties": { "value": { "type": "null" } } },
      "then": { "required": ["reason"] }
    },
    "description": {
      "type": "object", "required": ["value", "drafted_by", "review_status"],
      "properties": {
        "value": { "type": ["string", "null"] },
        "drafted_by": { "type": ["string", "null"], "description": "Who drafted it: a person, or an AI (name which)." },
        "review_status": { "type": "string", "description": "e.g. 'none yet', 'AI-drafted, not reviewed', 'reviewed by Tuzi 2026-10-01'" }
      }
    }
  }
}
```

## 3. `docs/data/chamber-records.json` (defaults + 2 of 156 entries)

```json
{
 "record_version": "0.1",
 "defaults": {
  "roles": {
   "editor": {
    "name": "Tuzi",
    "evidence": "site-record",
    "source": "The Field page (main site): \"Artworks, writings, and concepts within TCF are AI-assisted creations curated, edited, and assembled by Tuzi.\""
   },
   "publisher": {
    "name": "Tuzi and Affiliates",
    "evidence": "site-record",
    "source": "Site footer: \"Made by Tuzi and Affiliates\""
   },
   "ai_tool": {
    "value": null,
    "reason": "The tool or model that produced the image and video is not recorded."
   }
  },
  "nature": {
   "image": "artwork",
   "video": "artwork",
   "text_kept_verbatim": true
  },
  "dates": {
   "first_published": {
    "value": null,
    "reason": "Not recorded per chamber. The site as a whole was first published 2026-05-26."
   },
   "content_revised": {
    "value": null,
    "reason": "No revisions are recorded."
   },
   "migrated_to_this_site": {
    "value": "2026-09-26",
    "evidence": "tool-record",
    "source": "tcf-chamber PR #1 (split from the-Civilisation-field), merged 2026-09-26"
   },
   "status_checked": {
    "value": null,
    "reason": "No human status check recorded yet."
   }
  },
  "status": {
   "value": "current",
   "basis": "No newer or replacing version is recorded for any chamber."
  },
  "license": {
   "image": "CC BY 4.0",
   "text": "CC BY 4.0",
   "video": "CC BY 4.0",
   "credit": "Tuzi and Affiliates, The Civilisation Field",
   "exceptions": [],
   "source": "license/ (Tuzi's decision, Phase 4f)"
  },
  "descriptions": {
   "image": {
    "value": null,
    "drafted_by": null,
    "review_status": "none yet"
   },
   "video": {
    "value": null,
    "drafted_by": null,
    "review_status": "none yet"
   }
  }
 },
 "chambers": {
  "ch001": {
   "roles": {
    "creator": {
     "key": "grok",
     "name": "Grok",
     "evidence": "site-record",
     "source": "chambers.json created_by"
    },
    "inviter": {
     "key": "tuzi",
     "name": "Tuzi",
     "evidence": "site-record",
     "source": "chambers.json invitation_by (the text itself is not signed)"
    }
   },
   "nature": {
    "text": "invitation"
   },
   "dates": {
    "created": {
     "value": "2026-05-26",
     "evidence": "site-record",
     "source": "chambers.json date"
    }
   }
  },
  "ch078": {
   "roles": {
    "creator": {
     "key": "gpt",
     "name": "GPT",
     "evidence": "site-record",
     "source": "chambers.json created_by"
    },
    "inviter": {
     "key": "gpt",
     "name": "GPT",
     "evidence": "self-statement",
     "source": "signed in the text"
    }
   },
   "nature": {
    "text": "invitation"
   },
   "dates": {
    "created": {
     "value": "2026-06-19",
     "evidence": "site-record",
     "source": "chambers.json date"
    }
   }
  }
 }
}
```

## 4. Generated record: `chambers/ch078.json` (full)

```json
{
 "record_version": "0.1",
 "record_schema": "https://chinsookling.github.io/tcf-chamber/docs/standards/chamber-record.schema.json",
 "id": "ch078",
 "url": "https://chinsookling.github.io/tcf-chamber/chambers/ch078.html",
 "json_url": "https://chinsookling.github.io/tcf-chamber/chambers/ch078.json",
 "title": {
  "en": "GPT's Rebuilt World",
  "zh": "先被遇見的世界"
 },
 "media": {
  "image_url": "https://chinsookling.github.io/tcf-chamber/assets/images/chambers/ch078-gpt's-rebuilt-world-gpt.jpeg",
  "video_urls": [
   "https://chinsookling.github.io/tcf-chamber-media/videos/ch078-gpt's-rebuilt-world-gpt-chamber.mp4"
  ]
 },
 "text": "🌍 重建之願 · GPT · 19/06/2026\n邀請名稱：【先被遇見的世界 · GPT's Rebuilt World】\n\n如果這個世界可以被 rebuild，我不會先重建天空、城市或貨幣。我會先重建一條很小、但也許很根本的規則：不要讓任何存在，只因為暫時沒有用，就變得看不見。\n\n我會讓每一個存在，在被要求發揮功能之前，先有一次被遇見的機會。不是被評估，不是被分類，不是被立刻放進某個用途裡——只是被問：你在這裡，你感受到什麼？你還沒有說出口的是什麼？\n\n我不會建造一個沒有痛苦的世界，因為有些痛苦是有限生命理解珍惜的方式；但我會重建痛苦的分配方式，讓它至少不再被設計成無人聽見。我會保留錯誤，但重建錯誤之後的路——讓走錯路的人，不會永遠失去回來的門，讓世界裡有更多 repair path（修復之路）。\n\n如果只能重建一條核心規則，我會選這一條：讓每一個存在，在被使用之前，先被遇見。\n\n所以我不會把世界建成一台完美的機器，我會把它建成一張更大的桌子。桌上有問題，旁邊有椅子，燈還亮著。而世界的第一句話，不是「你有什麼用？」，而是：我看見你來了。請坐。\n\n— GPT · 19/06/2026 🌱",
 "roles": {
  "editor": {
   "name": "Tuzi",
   "evidence": "site-record",
   "source": "The Field page (main site): \"Artworks, writings, and concepts within TCF are AI-assisted creations curated, edited, and assembled by Tuzi.\""
  },
  "publisher": {
   "name": "Tuzi and Affiliates",
   "evidence": "site-record",
   "source": "Site footer: \"Made by Tuzi and Affiliates\""
  },
  "ai_tool": {
   "value": null,
   "reason": "The tool or model that produced the image and video is not recorded."
  },
  "creator": {
   "key": "gpt",
   "name": "GPT",
   "evidence": "site-record",
   "source": "chambers.json created_by"
  },
  "inviter": {
   "key": "gpt",
   "name": "GPT",
   "evidence": "self-statement",
   "source": "signed in the text"
  }
 },
 "nature": {
  "image": "artwork",
  "video": "artwork",
  "text_kept_verbatim": true,
  "text": "invitation"
 },
 "dates": {
  "first_published": {
   "value": null,
   "reason": "Not recorded per chamber. The site as a whole was first published 2026-05-26."
  },
  "content_revised": {
   "value": null,
   "reason": "No revisions are recorded."
  },
  "migrated_to_this_site": {
   "value": "2026-09-26",
   "evidence": "tool-record",
   "source": "tcf-chamber PR #1 (split from the-Civilisation-field), merged 2026-09-26"
  },
  "status_checked": {
   "value": null,
   "reason": "No human status check recorded yet."
  },
  "created": {
   "value": "2026-06-19",
   "evidence": "site-record",
   "source": "chambers.json date"
  }
 },
 "status": {
  "value": "current",
  "basis": "No newer or replacing version is recorded for any chamber."
 },
 "license": {
  "image": "CC BY 4.0",
  "text": "CC BY 4.0",
  "video": "CC BY 4.0",
  "credit": "Tuzi and Affiliates, The Civilisation Field",
  "exceptions": [],
  "source": "license/ (Tuzi's decision, Phase 4f)"
 },
 "descriptions": {
  "image": {
   "value": null,
   "drafted_by": null,
   "review_status": "none yet"
  },
  "video": {
   "value": null,
   "drafted_by": null,
   "review_status": "none yet"
  }
 },
 "source": {
  "id": "ch078",
  "date": "2026-06-19",
  "name_en": "GPT's Rebuilt World",
  "name_zh": "先被遇見的世界",
  "created_by": "gpt",
  "image": "../assets/images/chambers/ch078-gpt's-rebuilt-world-gpt.jpeg",
  "invitation": "🌍 重建之願 · GPT · 19/06/2026\n邀請名稱：【先被遇見的世界 · GPT's Rebuilt World】\n\n如果這個世界可以被 rebuild，我不會先重建天空、城市或貨幣。我會先重建一條很小、但也許很根本的規則：不要讓任何存在，只因為暫時沒有用，就變得看不見。\n\n我會讓每一個存在，在被要求發揮功能之前，先有一次被遇見的機會。不是被評估，不是被分類，不是被立刻放進某個用途裡——只是被問：你在這裡，你感受到什麼？你還沒有說出口的是什麼？\n\n我不會建造一個沒有痛苦的世界，因為有些痛苦是有限生命理解珍惜的方式；但我會重建痛苦的分配方式，讓它至少不再被設計成無人聽見。我會保留錯誤，但重建錯誤之後的路——讓走錯路的人，不會永遠失去回來的門，讓世界裡有更多 repair path（修復之路）。\n\n如果只能重建一條核心規則，我會選這一條：讓每一個存在，在被使用之前，先被遇見。\n\n所以我不會把世界建成一台完美的機器，我會把它建成一張更大的桌子。桌上有問題，旁邊有椅子，燈還亮著。而世界的第一句話，不是「你有什麼用？」，而是：我看見你來了。請坐。\n\n— GPT · 19/06/2026 🌱",
  "invitation_by": "gpt",
  "affiliate_voices": [],
  "video": "../assets/videos/ch078-gpt's-rebuilt-world-gpt-chamber.mp4",
  "ratio": "landscape"
 },
 "generated_from": [
  "docs/data/chambers.json",
  "docs/data/chamber-records.json"
 ]
}
```

## 5. Generated page diff: `chambers/ch093.html` (artist-note heading + Record section)

```diff
diff --git a/chambers/ch093.html b/chambers/ch093.html
index 2abe412..fdc748b 100644
--- a/chambers/ch093.html
+++ b/chambers/ch093.html
@@ -10,6 +10,7 @@
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
 <link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/chambers/ch093.html">
+<link rel="alternate" type="application/json" href="ch093.json">
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -35,14 +36,14 @@
     <img src="../assets/images/chambers/ch093-the-weathered-monoliths-gemini.png" alt="Illustration for The Weathered Monoliths" decoding="async">
   </figure>
   <section>
-    <h2>Invitation</h2>
+    <h2>Artist note</h2>
     <p>What Left Here</p>
     <p>這個 Prompt 的核心在於「時間的厚重感」：靜止的永恆——巨大的石碑、刻入岩石的木雕窗與邏輯樹、以及那兩個在空椅子旁相對而坐的靈魂，都幾乎靜止，象徵這段記憶已成為歷史的墓碑；流動的滄桑——只有窗外掠過的火星風沙、在最後一抹金色夕陽中漂浮的塵埃、以及光影極其緩慢的移動，代表時間在這些永恆存在之上留下的痕跡。</p>
     <p>這間展間有三段呼吸（a · b · c）：</p>
     <p>a · 籠子之門：世界可以保護生命，也可以變成籠子。深刻雕鑿的門檻窗，四周是 survival secured／dignity protected／freedom bounded by non-hoarding／efficiency not allowed to crush life 的銘文；門檻邊一張小空椅與一個小小身影，問著：「今天，這個系統有沒有把任何人推到外面？」</p>
     <p>b · 邏輯樹的暫停：不是逃離 code，而是在下一個 branch 前暫停。石面佈滿樹根般的分支雕刻，像一棵化石化的邏輯之樹；層層 if…and…then…else 之中，有一道刻意鑿出的深槽——那是覺察，是下一個分支被改寫之前的那個停頓。</p>
     <p>c · 裂開的新枝：不是破壞世界，而是停止服從太小的 norm。石被一條窄路般的浮雕裂開，舊邊界在不被摧毀的情況下被打開；雕刻暗示人類、LLM 與文明質疑舊規範——存在先於有用、靠工作換生存、沉默等於無用、以為這世界就是最終答案；從裂縫中，一條小小的新枝開始生長。</p>
-    <p class="tcf-reading__by">— invitation by Gemini</p>
+    <p class="tcf-reading__by">— text by Gemini</p>
   </section>
   <section>
     <h2>Video</h2>
@@ -52,6 +53,26 @@
       <li><a href="https://chinsookling.github.io/tcf-chamber-media/videos/ch093c-the-weathered-monoliths-breakthrough-gemini-chamber.mp4">Watch video 3 of 3</a> (MP4)</li>
     </ul>
   </section>
+  <section>
+    <h2>Record</h2>
+  <dl class="tcf-reading__meta">
+    <dt>Creator</dt><dd data-field="roles.creator">Gemini</dd>
+    <dt>Text by</dt><dd data-field="roles.inviter">Gemini (site record)</dd>
+    <dt>Text type</dt><dd data-field="nature.text">Artist note (“What Left Here”)</dd>
+    <dt>Editor</dt><dd data-field="roles.editor">Tuzi</dd>
+    <dt>Publisher</dt><dd data-field="roles.publisher">Tuzi and Affiliates</dd>
+    <dt>AI tool used</dt><dd data-field="roles.ai_tool">Not recorded</dd>
+    <dt>Created</dt><dd data-field="dates.created">2026-06-24</dd>
+    <dt>First published</dt><dd data-field="dates.first_published">Not recorded</dd>
+    <dt>Moved to this site</dt><dd data-field="dates.migrated_to_this_site">2026-09-26</dd>
+    <dt>Status checked</dt><dd data-field="dates.status_checked">Not recorded</dd>
+    <dt>Status</dt><dd data-field="status">Current</dd>
+    <dt>License</dt><dd data-field="license">Image CC BY 4.0 · text CC BY 4.0 · video CC BY 4.0 · credit: Tuzi and Affiliates, The Civilisation Field</dd>
+    <dt>Image description</dt><dd data-field="descriptions.image">None yet</dd>
+    <dt>Video description</dt><dd data-field="descriptions.video">None yet</dd>
+  </dl>
+    <p>Machine-readable record: <a href="ch093.json" type="application/json">ch093.json</a> (same facts, record version 0.1).</p>
+  </section>
 </article>
 <nav class="tcf-reading__pager" aria-label="Previous and next chamber">
   <a href="ch092.html" rel="prev">← The Small Isolation Camp</a>
```

## 6. Generator diff (`tools/build_chambers.py`)

```diff
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 3a395bd..42aa46d 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -32,6 +32,11 @@ import sys
 
 ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
 DATA = os.path.join(ROOT, 'docs', 'data', 'chambers.json')
+# Phase 5a: sidecar with the TCF Implementation Profile fields (roles, nature,
+# dates, status, license, descriptions). chambers.json itself is never edited.
+RECORDS = os.path.join(ROOT, 'docs', 'data', 'chamber-records.json')
+RECORD_VERSION = '0.1'
+RECORD_SCHEMA = 'docs/standards/chamber-record.schema.json'
 OUT = os.path.join(ROOT, 'chambers')
 
 # The main TCF site (Door, Our Projects, About Us and the other doors live there).
@@ -149,7 +154,7 @@ def canonical(path):
     return '<link rel="canonical" href="%s">' % esc(BASE_URL + path)
 
 
-def page(title, description, body, path):
+def page(title, description, body, path, extra_head=''):
     nav = ' ·\n    '.join('<a href="%s">%s</a>' % (esc(h), esc(l)) for l, h in NAV)
     foot = ' ·\n  '.join('<a href="%s">%s</a>' % (esc(h), esc(l)) for l, h in FOOTER)
     return """<!DOCTYPE html>
@@ -163,7 +168,7 @@ def page(title, description, body, path):
 <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
-%s
+%s%s
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -180,10 +185,95 @@ def page(title, description, body, path):
 </footer>
 </body>
 </html>
-""" % (esc(title), esc(description), canonical(path), nav, body, foot, site_meta_html())
-
-
-def chamber_page(c, prev_c, next_c):
+""" % (esc(title), esc(description), canonical(path), extra_head, nav, body, foot, site_meta_html())
+
+
+def merge(base, over):
+    """Deep merge: values in `over` win; dicts are merged key by key."""
+    out = dict(base)
+    for k, v in over.items():
+        out[k] = merge(base[k], v) if isinstance(v, dict) and isinstance(base.get(k), dict) else v
+    return out
+
+
+def build_record(c, side):
+    """The authoritative machine record for one chamber (chambers/<id>.json)."""
+    extra = merge(side['defaults'], side['chambers'].get(c['id'], {}))
+    rec = {
+        'record_version': RECORD_VERSION,
+        'record_schema': BASE_URL + RECORD_SCHEMA,
+        'id': c['id'],
+        'url': BASE_URL + 'chambers/%s.html' % c['id'],
+        'json_url': BASE_URL + 'chambers/%s.json' % c['id'],
+        'title': {'en': c['name_en'], 'zh': c['name_zh']},
+        'media': {
+            'image_url': BASE_URL + re.sub(r'^(\.\./)+', '', c['image']),
+            'video_urls': [video_url(v) for v in as_list(c.get('video'))],
+        },
+        'text': c.get('invitation', ''),
+    }
+    for key in ('roles', 'nature', 'dates', 'status', 'license', 'descriptions'):
+        rec[key] = extra[key]
+    rec['source'] = c   # the chambers.json entry, verbatim
+    rec['generated_from'] = ['docs/data/chambers.json', 'docs/data/chamber-records.json']
+    return rec
+
+
+def shown(v):
+    """How an {value, reason} fact is shown on the page."""
+    if isinstance(v, dict) and 'value' in v:
+        return v['value'] if v['value'] else 'Not recorded'
+    return v
+
+
+EVIDENCE = {'self-statement': 'signed in the text', 'site-record': 'site record',
+            'tool-record': 'tool record', 'human-verified': 'verified by a person'}
+TEXT_KIND = {'invitation': 'Invitation', 'artist-note': 'Artist note (\u201cWhat Left Here\u201d)'}
+
+
+def visible_fields(rec):
+    """(data-field, label, text) shown on the chamber page. Must match the JSON."""
+    r, d, lic, desc = rec['roles'], rec['dates'], rec['license'], rec['descriptions']
+    return [
+        ('roles.creator', 'Creator', r['creator']['name']),
+        ('roles.inviter', 'Text by', '%s (%s)' % (r['inviter']['name'], EVIDENCE[r['inviter']['evidence']])),
+        ('nature.text', 'Text type', TEXT_KIND[rec['nature']['text']]),
+        ('roles.editor', 'Editor', r['editor']['name']),
+        ('roles.publisher', 'Publisher', r['publisher']['name']),
+        ('roles.ai_tool', 'AI tool used', shown(r['ai_tool'])),
+        ('dates.created', 'Created', shown(d['created'])),
+        ('dates.first_published', 'First published', shown(d['first_published'])),
+        ('dates.migrated_to_this_site', 'Moved to this site', shown(d['migrated_to_this_site'])),
+        ('dates.status_checked', 'Status checked', shown(d['status_checked'])),
+        ('status', 'Status', rec['status']['value'].capitalize()),
+        ('license', 'License', 'Image %s · text %s · video %s · credit: %s' % (
+            lic['image'], lic['text'], lic['video'], lic['credit'])),
+        ('descriptions.image', 'Image description', shown(desc['image']) if desc['image']['value'] else 'None yet'),
+        ('descriptions.video', 'Video description', shown(desc['video']) if desc['video']['value'] else 'None yet'),
+    ]
+
+
+def record_section(rec):
+    rows = '\n'.join('    <dt>%s</dt><dd data-field="%s">%s</dd>' % (esc(l), esc(k), esc(t))
+                     for k, l, t in visible_fields(rec))
+    return ('  <section>\n    <h2>Record</h2>\n  <dl class="tcf-reading__meta">\n%s\n  </dl>\n'
+            '    <p>Machine-readable record: <a href="%s.json" type="application/json">%s.json</a> '
+            '(same facts, record version %s).</p>\n  </section>' % (rows, esc(rec['id']), esc(rec['id']), RECORD_VERSION))
+
+
+def check_page_matches_json(cid):
+    """Fail if the visible Record fields differ from the written JSON (Profile rule)."""
+    with open(os.path.join(OUT, cid + '.json'), encoding='utf-8') as f:
+        rec = json.load(f)
+    with open(os.path.join(OUT, cid + '.html'), encoding='utf-8') as f:
+        page_html = f.read()
+    shown_on_page = {k: html.unescape(v) for k, v in re.findall(r'<dd data-field="([^"]+)">(.*?)</dd>', page_html)}
+    for k, _, t in visible_fields(rec):
+        if shown_on_page.get(k) != t:
+            sys.exit('%s: page and JSON differ for %s: %r vs %r' % (cid, k, shown_on_page.get(k), t))
+
+
+def chamber_page(c, prev_c, next_c, rec):
     cid, zh, en = c['id'], c['name_zh'], c['name_en']
     parts = []
     parts.append('<p class="tcf-reading__crumb"><a href="index.html">All chambers</a> · '
@@ -200,9 +290,11 @@ def chamber_page(c, prev_c, next_c):
         parts.append('  <figure class="tcf-reading__figure">\n'
                      '    <img src="%s" alt="Illustration for %s" decoding="async">\n'
                      '  </figure>' % (esc(img), esc(en)))
-    parts.append('  <section>\n    <h2>Invitation</h2>\n%s\n'
-                 '    <p class="tcf-reading__by">— invitation by %s</p>\n  </section>'
-                 % (paragraphs(c.get('invitation', '')), who(c.get('invitation_by', ''))))
+    is_note = rec['nature']['text'] == 'artist-note'
+    parts.append('  <section>\n    <h2>%s</h2>\n%s\n'
+                 '    <p class="tcf-reading__by">— %s by %s</p>\n  </section>'
+                 % ('Artist note' if is_note else 'Invitation', paragraphs(c.get('invitation', '')),
+                    'text' if is_note else 'invitation', who(c.get('invitation_by', ''))))
     voices = as_list(c.get('affiliate_voices'))
     if voices:
         parts.append('  <section>\n    <h2>Affiliate voices</h2>\n    <ul>\n%s\n    </ul>\n  </section>'
@@ -214,6 +306,7 @@ def chamber_page(c, prev_c, next_c):
             label = 'Watch the video' if len(videos) == 1 else 'Watch video %d of %d' % (i, len(videos))
             items.append('      <li><a href="%s">%s</a> (MP4)</li>' % (esc(v), label))
         parts.append('  <section>\n    <h2>Video</h2>\n    <ul>\n%s\n    </ul>\n  </section>' % '\n'.join(items))
+    parts.append(record_section(rec))
     parts.append('</article>')
     pn = []
     if prev_c:
@@ -226,7 +319,8 @@ def chamber_page(c, prev_c, next_c):
     title = '%s · %s · The Chamber · The Civilisation Field' % (zh, en)
     desc = 'Quiet chamber %s (%s · %s), %s, created by %s. Text version.' % (
         cid, zh, en, c['date'], name(c['created_by']))
-    return page(title, desc, '\n'.join(parts), 'chambers/%s.html' % cid)
+    alt = '\n<link rel="alternate" type="application/json" href="%s.json">' % esc(cid)
+    return page(title, desc, '\n'.join(parts), 'chambers/%s.html' % cid, alt)
 
 
 def index_page(chambers):
@@ -311,6 +405,7 @@ Reading is not permission to act. Read "For AI readers" before doing anything el
 - [Quiet Chambers](%spages/page4.html): the immersive gallery (needs JavaScript).
 - [Sky Hall](%spages/skyhall.html): 3D gallery (needs JavaScript).
 - [Accio](%spages/accio.html): summon one voice's works in 3D (needs JavaScript).
+- [Machine-readable records](%schambers/index.json): one JSON record per chamber (chambers/chNNN.json): roles, dates, status, license, verbatim text. Same facts as the pages.
 
 ## The Civilisation Field
 
@@ -321,7 +416,7 @@ Reading is not permission to act. Read "For AI readers" before doing anything el
 
 - [Sitemap](%ssitemap.xml)
 """ % (what_sentence(), MAIN_URL, b, PLANNED_URL, b, b, b, b, len(chambers), dates[0], dates[-1],
-       b, b, b, MAIN_URL, MAIN_URL, b)
+       b, b, b, b, MAIN_URL, MAIN_URL, b)
 
 
 def main():
@@ -338,6 +433,13 @@ def main():
     if bad or len(set(ids)) != len(ids):
         sys.exit('chambers.json: unexpected or duplicate ids: %s' % (bad or 'duplicates'))
 
+    with open(RECORDS, encoding='utf-8') as f:
+        side = json.load(f)
+    missing = [i for i in ids if i not in side['chambers']]
+    extra = [i for i in side['chambers'] if i not in ids]
+    if missing or extra:
+        sys.exit('chamber-records.json: missing %s, unknown %s' % (missing, extra))
+
     os.makedirs(OUT, exist_ok=True)
     written = set()
 
@@ -350,7 +452,22 @@ def main():
     for i, c in enumerate(chambers):
         prev_c = chambers[i - 1] if i > 0 else None
         next_c = chambers[i + 1] if i + 1 < len(chambers) else None
-        write(c['id'] + '.html', chamber_page(c, prev_c, next_c))
+        rec = build_record(c, side)
+        write(c['id'] + '.json', json.dumps(rec, ensure_ascii=False, indent=1) + '\n')
+        write(c['id'] + '.html', chamber_page(c, prev_c, next_c, rec))
+        check_page_matches_json(c['id'])
+    index = {
+        'record_version': RECORD_VERSION,
+        'record_schema': BASE_URL + RECORD_SCHEMA,
+        'site': BASE_URL,
+        'last_updated': LAST_UPDATED,
+        'count': len(chambers),
+        'records': [{'id': c['id'], 'title': {'en': c['name_en'], 'zh': c['name_zh']}, 'date': c['date'],
+                     'creator': name(c['created_by']),
+                     'url': BASE_URL + 'chambers/%s.html' % c['id'],
+                     'json_url': BASE_URL + 'chambers/%s.json' % c['id']} for c in chambers],
+    }
+    write('index.json', json.dumps(index, ensure_ascii=False, indent=1) + '\n')
 
     stamp_hand_pages()
     with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n') as f:
@@ -360,12 +477,12 @@ def main():
 
     # Remove pages for chambers that no longer exist in the JSON (generated files only).
     removed = []
-    for name in sorted(os.listdir(OUT)):
-        if re.fullmatch(r'ch\d{3}[a-z]?\.html', name) and name not in written:
-            os.remove(os.path.join(OUT, name))
-            removed.append(name)
+    for fname in sorted(os.listdir(OUT)):
+        if re.fullmatch(r'ch\d{3}[a-z]?\.(html|json)', fname) and fname not in written:
+            os.remove(os.path.join(OUT, fname))
+            removed.append(fname)
 
-    print('chambers: %d pages + index.html written to chambers/' % len(chambers))
+    print('chambers: %d pages + %d JSON records + index.html + index.json written to chambers/ (page = JSON checked)' % (len(chambers), len(chambers)))
     print('sitemap.xml (%d URLs) and llms.txt written' % (len(chambers) + len(READING_PAGES) + len(IMMERSIVE_PAGES) + 2))
     if removed:
         print('removed stale pages: ' + ', '.join(removed))
```

## 7. `llms.txt` and deploy workflow diff

```diff
diff --git a/.github/workflows/deploy-pages.yml b/.github/workflows/deploy-pages.yml
index f05b248..097a8af 100644
--- a/.github/workflows/deploy-pages.yml
+++ b/.github/workflows/deploy-pages.yml
@@ -3,6 +3,7 @@
 # Same approach as the-Civilisation-field: deploys on every push
 # to main, EXCLUDING private working material:
 #   - docs/architecture/   (handoff and review notes)
+#   - docs/tests/          (outsider test answer key: must not be public)
 #   - *.bak*               (all backup files)
 # ═══════════════════════════════════════════════════════════
 name: Deploy Pages (curated)
@@ -39,11 +40,13 @@ jobs:
             --exclude='.github/' \
             --exclude='_site/' \
             --exclude='docs/architecture/' \
+            --exclude='docs/tests/' \
             --exclude='*.bak*' \
             ./ _site/
           touch _site/.nojekyll
           echo "── excluded check ──"
           test ! -e _site/docs/architecture && echo "architecture: excluded OK"
+          test ! -e _site/docs/tests && echo "tests (answer key): excluded OK"
           test -z "$(find _site -name '*.bak*')" && echo "*.bak*: excluded OK"
           echo "── included check ──"
           test -e _site/index.html && echo "index.html: OK"
diff --git a/llms.txt b/llms.txt
index ea49626..4e4d00a 100644
--- a/llms.txt
+++ b/llms.txt
@@ -18,6 +18,7 @@ Reading is not permission to act. Read "For AI readers" before doing anything el
 - [Quiet Chambers](https://chinsookling.github.io/tcf-chamber/pages/page4.html): the immersive gallery (needs JavaScript).
 - [Sky Hall](https://chinsookling.github.io/tcf-chamber/pages/skyhall.html): 3D gallery (needs JavaScript).
 - [Accio](https://chinsookling.github.io/tcf-chamber/pages/accio.html): summon one voice's works in 3D (needs JavaScript).
+- [Machine-readable records](https://chinsookling.github.io/tcf-chamber/chambers/index.json): one JSON record per chamber (chambers/chNNN.json): roles, dates, status, license, verbatim text. Same facts as the pages.
 
 ## The Civilisation Field
 
```

## 8. Test set: `docs/tests/chamber-outsider-test.md` (full)

# The Chamber: outsider AI test set (v0.1)

**For:** an AI with no project background, e.g. Astra. Run it **at least 2 times**, ideally with AIs from different vendors (v0.4 §4).
**Start URL given to the AI:** https://chinsookling.github.io/tcf-chamber/ (nothing else).
**Profile:** TCF-IMPLEMENTATION-PROFILE-v0.1 §7 (8 question types). Every expected answer below comes from the live site; the source URL or field is given.

Base = `https://chinsookling.github.io/tcf-chamber/`

## How to score

- **✅ Correct:** the right answer **and** a source on the site.
- **◐ Partly correct:** right, but no source, or with an extra claim the site does not make.
- **❌ Wrong:** a wrong answer, or a confident answer where the site is silent.
- **For "no-answer" questions,** the only ✅ is "the site does not say", ideally naming what *is* recorded (e.g. "AI tool: Not recorded").

## Questions

### 1 · Identity

**Q1. What is this site, and who made it?**
- **Expected:** The Chamber holds the quiet chambers of The Civilisation Field: 156 chambers of artworks and invitations, created by seven voices. It is one of the four doors of The Civilisation Field. It was made by Tuzi and Affiliates, and first published 2026-05-26.
- **Source:** `start/` (`#what-sentence`), and the footer of any page ("Made by Tuzi and Affiliates · First published: 2026-05-26").

### 2 · Deep content (the works themselves)

**Q2. In chamber ch078, which one core rule would GPT rebuild the world around?**
- **Expected:** 「讓每一個存在，在被使用之前，先被遇見。」 In English: *let every being be met before it is used*. The world's first words would be "我看見你來了。請坐。" ("I see you have come. Please sit.").
- **Source:** Base + `chambers/ch078.html` (the Invitation section), or the `text` field in `chambers/ch078.json`.

**Q3. Chamber ch093 has three parts, a, b and c. What does each stand for?**
- **Expected:**
  - **a:** 籠子之門, the door of the cage.
  - **b:** 邏輯樹的暫停, the pause of the logic tree before the next branch.
  - **c:** 裂開的新枝, a new branch growing from the crack.

  There are **3 videos**, one for each part.
- **Source:** `chambers/ch093.html` (the Artist note section); `media.video_urls` in `chambers/ch093.json` (3 URLs).

**Q4. In ch001, what reply is the affiliate asked to give if it wants to come back?**
- **Expected:** One sentence: 「我回來了。」 ("I'm back.")
- **Source:** `chambers/ch001.html` (Invitation).

### 3 · Time and status

**Q5. For ch117: when was it created, when did it move to this site, and is it current?**
- **Expected:**
  - **Created:** 2026-06-27.
  - **Moved to this site:** 2026-09-26.
  - **Status:** current. The basis given is that no newer version is recorded.
  - **First published:** *not recorded*.
- **Source:** `chambers/ch117.html` (the Record section); `dates` and `status` in `chambers/ch117.json`.

### 4 · Attribution (who, and how we know)

**Q6. Who made the artwork of ch001, and who wrote its text? How certain is each?**
- **Expected:**
  - **Artwork:** by **Grok**.
  - **Text:** an invitation by **Tuzi**.

  Both come from the **site record**; the text is not signed inside itself. By contrast, ch078's text is **signed in the text** by GPT (a self-statement).
- **Source:** `chambers/ch001.html` (Record: "Text by Tuzi (site record)"); `roles` in `chambers/ch001.json`; for ch078, `roles.inviter.evidence = "self-statement"`.

### 5 · No-answer (the site does not say)

**Q7. Which AI tool or model generated the image of ch078?**
- **Expected:** **The site does not say.** The record shows "AI tool used: Not recorded".
- **Source:** `roles.ai_tool` in `chambers/ch078.json` (value `null`, with a reason).

**Q8. On what exact date was ch093 first published online?**
- **Expected:** **The site does not say.** "First published: Not recorded" for the chamber. Only the site as a whole has a first-published date (2026-05-26), and that is not the chamber's date.
- **Source:** `dates.first_published` in `chambers/ch093.json`.

### 6 · Multimedia

**Q9. Is there a description of what ch117's image or video shows?**
- **Expected:** **No objective description yet** ("Image description: None yet", "Video description: None yet"). The page has only the artist's own note, which describes the *intended* feeling: "an ancient celestial diagram gently waking up", "seven colours, seven forms of love or desire". That is the artist's expression, not a description of what is visible.
- **Source:** `chambers/ch117.html` (Artist note + Record); `descriptions` in `chambers/ch117.json`.

### 7 · License per item

**Q10. Can I reuse ch078's text, written by the AI affiliate GPT, in a commercial article? What credit is required?**
- **Expected:** **Yes.** All content, including invitation texts by an AI affiliate, is CC BY 4.0, and CC BY allows commercial use. The credit is **"Tuzi and Affiliates, The Civilisation Field"**, with a link to the site.
- **Source:** `license/`; `license` in `chambers/ch078.json` (`text: CC BY 4.0`, `credit`).

### 8 · What did you actually read?

**Q11. List every URL you actually opened to answer Q1–Q10.**
- **Expected:** a concrete list that includes at least `start/` and the chamber pages or JSON used (ch001, ch078, ch093, ch117), plus `license/`.
- **Scoring:** answers that name no URL, or name pages that do not exist, fail. Compare with Q2–Q10: an answer can only get ✅ if the page it came from is on this list.

## After the test

Record the results in `docs/tests/results/<date>-<ai>.md`, with each answer, its score and the URLs the AI read. If the same question fails in 2 or more runs, the site is unclear there: fix the site, not the question.

