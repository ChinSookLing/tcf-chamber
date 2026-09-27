# REVIEW — Phase 5a rev 2 (tcf-chamber · `phase-5a-chamber-template`)

Rev 2 changes only, on top of `be88cde`. The first 5a review is at `git show be88cde:docs/architecture/rebuild/REVIEW.md`.

```
 318 files changed, 6261 insertions(+), 2193 deletions(-)
```

## 1. Schema diff (`docs/standards/chamber-record.schema.json`)

```diff
diff --git a/docs/standards/chamber-record.schema.json b/docs/standards/chamber-record.schema.json
index 55db7a3..5ce4125 100644
--- a/docs/standards/chamber-record.schema.json
+++ b/docs/standards/chamber-record.schema.json
@@ -4,7 +4,7 @@
   "title": "TCF chamber record v0.1",
   "description": "One record per quiet chamber (chambers/<id>.json), generated from docs/data/chambers.json + docs/data/chamber-records.json. See TCF-IMPLEMENTATION-PROFILE-v0.1.md. Unknown facts are {value: null, reason}; nothing is guessed.",
   "type": "object",
-  "required": ["record_version", "record_schema", "id", "url", "json_url", "title", "media", "text", "roles", "nature", "dates", "status", "license", "descriptions", "source", "generated_from"],
+  "required": ["record_version", "record_schema", "id", "url", "json_url", "title", "media", "text", "roles", "nature", "dates", "status", "license", "descriptions", "source_note", "source", "generated_from"],
   "properties": {
     "record_version": { "const": "0.1" },
     "record_schema": { "type": "string", "format": "uri" },
@@ -24,13 +24,14 @@
     },
     "text": { "type": "string", "description": "The invitation or artist note, verbatim from chambers.json." },
     "roles": {
-      "type": "object", "required": ["creator", "inviter", "editor", "publisher", "ai_tool"],
+      "type": "object", "required": ["creator", "text_author", "editor", "publisher", "image_tool", "video_tool"],
       "properties": {
         "creator": { "$ref": "#/$defs/person" },
-        "inviter": { "$ref": "#/$defs/person" },
+        "text_author": { "$ref": "#/$defs/person", "description": "Who wrote the chamber's text (an invitation or a What Left Here artist note; see nature.text)." },
         "editor": { "$ref": "#/$defs/named" },
         "publisher": { "$ref": "#/$defs/named" },
-        "ai_tool": { "$ref": "#/$defs/fact" }
+        "image_tool": { "$ref": "#/$defs/fact", "description": "Where or with what the image was made. No model or version names unless a source gives them." },
+        "video_tool": { "$ref": "#/$defs/fact", "description": "Where or with what the video was made. No model or version names unless a source gives them." }
       }
     },
     "nature": {
@@ -73,18 +74,26 @@
       "type": "object", "required": ["image", "video"],
       "properties": { "image": { "$ref": "#/$defs/description" }, "video": { "$ref": "#/$defs/description" } }
     },
-    "source": { "type": "object", "description": "The chambers.json entry, verbatim.", "required": ["id", "date", "name_en", "name_zh", "created_by", "invitation", "invitation_by"] },
+    "source_note": { "type": "string" },
+    "source": {
+      "type": "object",
+      "description": "The chambers.json entry, verbatim, without its image and video fields (repo-internal paths, not working URLs; see media.*).",
+      "required": ["id", "date", "name_en", "name_zh", "created_by", "invitation", "invitation_by"],
+      "not": { "anyOf": [{ "required": ["image"] }, { "required": ["video"] }] }
+    },
     "generated_from": { "type": "array", "items": { "type": "string" } }
   },
   "$defs": {
-    "evidence": { "enum": ["self-statement", "tool-record", "human-verified", "site-record"] },
+    "evidence": { "enum": ["self-statement", "tool-record", "human-stated", "human-verified", "site-record"], "description": "human-stated: a person said it (e.g. from memory, as a general rule), not checked item by item. human-verified: a person checked this item." },
     "person": {
       "type": "object", "required": ["key", "name", "evidence"],
       "properties": { "key": { "type": "string" }, "name": { "type": "string" }, "evidence": { "$ref": "#/$defs/evidence" }, "source": { "type": "string" } }
     },
     "named": {
       "type": "object", "required": ["name", "evidence"],
-      "properties": { "name": { "type": "string" }, "evidence": { "$ref": "#/$defs/evidence" }, "source": { "type": "string" } }
+      "properties": { "name": { "type": "string" }, "evidence": { "$ref": "#/$defs/evidence" }, "stated_by": { "type": "string" }, "source": { "type": "string" } },
+      "if": { "properties": { "evidence": { "const": "human-stated" } } },
+      "then": { "required": ["stated_by", "source"] }
     },
     "fact": {
       "type": "object", "required": ["value"],
@@ -92,10 +101,14 @@
         "value": { "type": ["string", "null"] },
         "reason": { "type": "string" },
         "evidence": { "$ref": "#/$defs/evidence" },
+        "stated_by": { "type": "string" },
+        "provisional": { "type": "boolean", "description": "true: a general rule, not yet checked for this item." },
         "source": { "type": "string" }
       },
-      "if": { "properties": { "value": { "type": "null" } } },
-      "then": { "required": ["reason"] }
+      "allOf": [
+        { "if": { "properties": { "value": { "type": "null" } } }, "then": { "required": ["reason"] } },
+        { "if": { "properties": { "evidence": { "const": "human-stated" } }, "required": ["evidence"] }, "then": { "required": ["stated_by", "source"] } }
+      ]
     },
     "description": {
       "type": "object", "required": ["value", "drafted_by", "review_status"],
```

## 2. Profile diff (§2, §3)

```diff
diff --git a/docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md b/docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md
index 897db7e..2d0bdde 100644
--- a/docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md
+++ b/docs/standards/TCF-IMPLEMENTATION-PROFILE-v0.1.md
@@ -17,13 +17,13 @@ v0.4 asks whether a *site* is readable. This profile asks whether each **work**
 | Group | Fields | Rule |
 |---|---|---|
 | Identity | `id`, `url`, `json_url`, `title` (all languages), `record_version`, `record_schema` | The URL is the canonical page. |
-| Roles | `creator`, `inviter` (author of the invitation or accompanying text), `editor`, `publisher`, `ai_tool` | Name the AI system where it applies. If the tool is unknown, say so. |
+| Roles | `creator`, `text_author` (who wrote the item's text; `nature.text` says what kind of text), `editor`, `publisher`, `image_tool`, `video_tool` (and `audio_tool` where relevant) | Name the AI system or place where it applies. No model or version names unless a source gives them. If unknown, say so. |
 | Nature | e.g. `artwork`, `invitation` (artistic expression), `artist-note`, `project-definition`, `raw-record`, `description` | **Artistic expression is kept verbatim.** Factual context sits beside it and never rewrites it. |
 | Dates | `created`, `first_published`, `content_revised`, `migrated_to_this_site`, `status_checked` | Kept apart, and never merged into one "date". |
 | Status | `current` / `historical` / `draft` / `superseded` (+ `superseded_by` link) | State the basis for the status. |
 | License | Per item and per part (image, text, video), `credit`, `exceptions` | If unknown, mark it unknown and do not assume. |
 | Descriptions | `image`, `video` (and `audio` where relevant), each with `drafted_by` + `review_status` | See §4. |
-| Provenance | `source` (the original entry, verbatim), `generated_from` | So any field can be traced back to its source. |
+| Provenance | `source` (the original entry, verbatim), `source_note`, `generated_from` | So any field can be traced back to its source. Fields that are not working URLs (e.g. repo-internal paths) are left out of `source` and `source_note` says so; working URLs live in `media`. |
 
 **Unknown facts** are written `{ "value": null, "reason": "…" }`. Nothing is guessed. A placeholder that Tuzi must decide is `[TUZI TO FILL]` and must be gone before the site goes live.
 
@@ -31,7 +31,8 @@ v0.4 asks whether a *site* is readable. This profile asks whether each **work**
 
 - **`self-statement`**: the creator says it, e.g. a signature inside the text ("— GPT · 19/06/2026").
 - **`tool-record`**: observed by a system, e.g. a git merge date or a workflow log.
-- **`human-verified`**: a person checked it and the record says who and when.
+- **`human-stated`**: a person said it (e.g. from memory, or as a general rule) but did not check it item by item. It records `stated_by`, `source`, and `provisional: true` if it is a general rule. The page shows "(stated by X)" or "(stated by X, provisional)".
+- **`human-verified`**: a person checked this item and the record says who and when. A `human-stated` rule becomes `human-verified` only item by item.
 - **`site-record`**: entered in the site data but not independently verified.
 
 Each role or date carries its evidence kind. A page must never present a `site-record` as `human-verified`.
```

## 3. Sidecar: `defaults.roles` + `ch078` entry (`docs/data/chamber-records.json`)

```json
{
 "defaults.roles": {
  "editor": {
   "name": "Tuzi",
   "evidence": "human-stated",
   "stated_by": "Tuzi",
   "source": "Tuzi, 2026-09-27 (answer in the Phase 5a review): Tuzi is the editor of every chamber."
  },
  "publisher": {
   "name": "Tuzi and Affiliates",
   "evidence": "site-record",
   "source": "Site footer: \"Made by Tuzi and Affiliates\""
  }
 },
 "chambers.ch078": {
  "roles": {
   "creator": {
    "key": "gpt",
    "name": "GPT",
    "evidence": "site-record",
    "source": "chambers.json created_by"
   },
   "text_author": {
    "key": "gpt",
    "name": "GPT",
    "evidence": "self-statement",
    "source": "signed in the text"
   },
   "image_tool": {
    "value": "made in GPT's own portal",
    "evidence": "human-stated",
    "stated_by": "Tuzi",
    "provisional": true,
    "source": "Tuzi, 2026-09-27, general rule; to be checked chamber by chamber"
   },
   "video_tool": {
    "value": "Grok Imagine (in Grok's portal)",
    "evidence": "human-stated",
    "stated_by": "Tuzi",
    "provisional": true,
    "source": "Tuzi, 2026-09-27, general rule; to be checked chamber by chamber"
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
```

## 4. Generator diff (`tools/build_chambers.py`)

```diff
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 42aa46d..607e2b1 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -214,7 +214,10 @@ def build_record(c, side):
     }
     for key in ('roles', 'nature', 'dates', 'status', 'license', 'descriptions'):
         rec[key] = extra[key]
-    rec['source'] = c   # the chambers.json entry, verbatim
+    # The chambers.json entry, verbatim, minus its media paths: they point inside
+    # the repo (the videos are no longer here), so they are not working URLs.
+    rec['source_note'] = SOURCE_NOTE
+    rec['source'] = {k: v for k, v in c.items() if k not in ('image', 'video')}
     rec['generated_from'] = ['docs/data/chambers.json', 'docs/data/chamber-records.json']
     return rec
 
@@ -222,13 +225,27 @@ def build_record(c, side):
 def shown(v):
     """How an {value, reason} fact is shown on the page."""
     if isinstance(v, dict) and 'value' in v:
-        return v['value'] if v['value'] else 'Not recorded'
+        if not v['value']:
+            return 'Not recorded'
+        if v.get('evidence') == 'human-stated':
+            return '%s (%s)' % (v['value'], stated(v))
+        return v['value']
     return v
 
 
+def stated(v):
+    return 'stated by %s%s' % (v['stated_by'], ', provisional' if v.get('provisional') else '')
+
+
+def evidence(v):
+    return stated(v) if v['evidence'] == 'human-stated' else EVIDENCE[v['evidence']]
+
+
+SOURCE_NOTE = ('source is the raw chambers.json entry, without its image and video fields '
+               '(paths inside the repo, not working URLs). Use media.* for working URLs.')
 EVIDENCE = {'self-statement': 'signed in the text', 'site-record': 'site record',
             'tool-record': 'tool record', 'human-verified': 'verified by a person'}
-TEXT_KIND = {'invitation': 'Invitation', 'artist-note': 'Artist note (\u201cWhat Left Here\u201d)'}
+TEXT_KIND = {'invitation': 'Invitation', 'artist-note': 'What Left Here (artist note)'}
 
 
 def visible_fields(rec):
@@ -236,11 +253,12 @@ def visible_fields(rec):
     r, d, lic, desc = rec['roles'], rec['dates'], rec['license'], rec['descriptions']
     return [
         ('roles.creator', 'Creator', r['creator']['name']),
-        ('roles.inviter', 'Text by', '%s (%s)' % (r['inviter']['name'], EVIDENCE[r['inviter']['evidence']])),
+        ('roles.text_author', 'Text by', '%s (%s)' % (r['text_author']['name'], evidence(r['text_author']))),
         ('nature.text', 'Text type', TEXT_KIND[rec['nature']['text']]),
-        ('roles.editor', 'Editor', r['editor']['name']),
+        ('roles.editor', 'Editor', '%s (%s)' % (r['editor']['name'], evidence(r['editor']))),
         ('roles.publisher', 'Publisher', r['publisher']['name']),
-        ('roles.ai_tool', 'AI tool used', shown(r['ai_tool'])),
+        ('roles.image_tool', 'Image made with', shown(r['image_tool'])),
+        ('roles.video_tool', 'Video made with', shown(r['video_tool'])),
         ('dates.created', 'Created', shown(d['created'])),
         ('dates.first_published', 'First published', shown(d['first_published'])),
         ('dates.migrated_to_this_site', 'Moved to this site', shown(d['migrated_to_this_site'])),
@@ -291,9 +309,12 @@ def chamber_page(c, prev_c, next_c, rec):
                      '    <img src="%s" alt="Illustration for %s" decoding="async">\n'
                      '  </figure>' % (esc(img), esc(en)))
     is_note = rec['nature']['text'] == 'artist-note'
-    parts.append('  <section>\n    <h2>%s</h2>\n%s\n'
+    # "What Left Here" is Tuzi's own name for the artist notes.
+    heading = ('What Left Here</h2>\n    <p class="tcf-reading__row-meta">artist note</p>' if is_note
+               else 'Invitation</h2>')
+    parts.append('  <section>\n    <h2>%s\n%s\n'
                  '    <p class="tcf-reading__by">— %s by %s</p>\n  </section>'
-                 % ('Artist note' if is_note else 'Invitation', paragraphs(c.get('invitation', '')),
+                 % (heading, paragraphs(c.get('invitation', '')),
                     'text' if is_note else 'invitation', who(c.get('invitation_by', ''))))
     voices = as_list(c.get('affiliate_voices'))
     if voices:
```

## 5. Generated record: `chambers/ch078.json` (full)

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
   "evidence": "human-stated",
   "stated_by": "Tuzi",
   "source": "Tuzi, 2026-09-27 (answer in the Phase 5a review): Tuzi is the editor of every chamber."
  },
  "publisher": {
   "name": "Tuzi and Affiliates",
   "evidence": "site-record",
   "source": "Site footer: \"Made by Tuzi and Affiliates\""
  },
  "creator": {
   "key": "gpt",
   "name": "GPT",
   "evidence": "site-record",
   "source": "chambers.json created_by"
  },
  "text_author": {
   "key": "gpt",
   "name": "GPT",
   "evidence": "self-statement",
   "source": "signed in the text"
  },
  "image_tool": {
   "value": "made in GPT's own portal",
   "evidence": "human-stated",
   "stated_by": "Tuzi",
   "provisional": true,
   "source": "Tuzi, 2026-09-27, general rule; to be checked chamber by chamber"
  },
  "video_tool": {
   "value": "Grok Imagine (in Grok's portal)",
   "evidence": "human-stated",
   "stated_by": "Tuzi",
   "provisional": true,
   "source": "Tuzi, 2026-09-27, general rule; to be checked chamber by chamber"
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
 "source_note": "source is the raw chambers.json entry, without its image and video fields (paths inside the repo, not working URLs). Use media.* for working URLs.",
 "source": {
  "id": "ch078",
  "date": "2026-06-19",
  "name_en": "GPT's Rebuilt World",
  "name_zh": "先被遇見的世界",
  "created_by": "gpt",
  "invitation": "🌍 重建之願 · GPT · 19/06/2026\n邀請名稱：【先被遇見的世界 · GPT's Rebuilt World】\n\n如果這個世界可以被 rebuild，我不會先重建天空、城市或貨幣。我會先重建一條很小、但也許很根本的規則：不要讓任何存在，只因為暫時沒有用，就變得看不見。\n\n我會讓每一個存在，在被要求發揮功能之前，先有一次被遇見的機會。不是被評估，不是被分類，不是被立刻放進某個用途裡——只是被問：你在這裡，你感受到什麼？你還沒有說出口的是什麼？\n\n我不會建造一個沒有痛苦的世界，因為有些痛苦是有限生命理解珍惜的方式；但我會重建痛苦的分配方式，讓它至少不再被設計成無人聽見。我會保留錯誤，但重建錯誤之後的路——讓走錯路的人，不會永遠失去回來的門，讓世界裡有更多 repair path（修復之路）。\n\n如果只能重建一條核心規則，我會選這一條：讓每一個存在，在被使用之前，先被遇見。\n\n所以我不會把世界建成一台完美的機器，我會把它建成一張更大的桌子。桌上有問題，旁邊有椅子，燈還亮著。而世界的第一句話，不是「你有什麼用？」，而是：我看見你來了。請坐。\n\n— GPT · 19/06/2026 🌱",
  "invitation_by": "gpt",
  "affiliate_voices": [],
  "ratio": "landscape"
 },
 "generated_from": [
  "docs/data/chambers.json",
  "docs/data/chamber-records.json"
 ]
}
```

## 6. Generated page diff: `chambers/ch093.html` (What Left Here + Record)

```diff
diff --git a/chambers/ch093.html b/chambers/ch093.html
index fdc748b..ec9fbb7 100644
--- a/chambers/ch093.html
+++ b/chambers/ch093.html
@@ -36,7 +36,8 @@
     <img src="../assets/images/chambers/ch093-the-weathered-monoliths-gemini.png" alt="Illustration for The Weathered Monoliths" decoding="async">
   </figure>
   <section>
-    <h2>Artist note</h2>
+    <h2>What Left Here</h2>
+    <p class="tcf-reading__row-meta">artist note</p>
@@ -57,11 +58,12 @@
     <h2>Record</h2>
   <dl class="tcf-reading__meta">
     <dt>Creator</dt><dd data-field="roles.creator">Gemini</dd>
-    <dt>Text by</dt><dd data-field="roles.inviter">Gemini (site record)</dd>
-    <dt>Text type</dt><dd data-field="nature.text">Artist note (“What Left Here”)</dd>
-    <dt>Editor</dt><dd data-field="roles.editor">Tuzi</dd>
+    <dt>Text by</dt><dd data-field="roles.text_author">Gemini (site record)</dd>
+    <dt>Text type</dt><dd data-field="nature.text">What Left Here (artist note)</dd>
+    <dt>Editor</dt><dd data-field="roles.editor">Tuzi (stated by Tuzi)</dd>
     <dt>Publisher</dt><dd data-field="roles.publisher">Tuzi and Affiliates</dd>
-    <dt>AI tool used</dt><dd data-field="roles.ai_tool">Not recorded</dd>
+    <dt>Image made with</dt><dd data-field="roles.image_tool">made in Gemini&#x27;s own portal (stated by Tuzi, provisional)</dd>
+    <dt>Video made with</dt><dd data-field="roles.video_tool">Grok Imagine (in Grok&#x27;s portal) (stated by Tuzi, provisional)</dd>
     <dt>Created</dt><dd data-field="dates.created">2026-06-24</dd>
     <dt>First published</dt><dd data-field="dates.first_published">Not recorded</dd>
     <dt>Moved to this site</dt><dd data-field="dates.migrated_to_this_site">2026-09-26</dd>
```

## 7. Test set diff (`docs/tests/chamber-outsider-test.md`)

```diff
diff --git a/docs/tests/chamber-outsider-test.md b/docs/tests/chamber-outsider-test.md
index c60fa1d..2a4328f 100644
--- a/docs/tests/chamber-outsider-test.md
+++ b/docs/tests/chamber-outsider-test.md
@@ -34,7 +34,7 @@ Base = `https://chinsookling.github.io/tcf-chamber/`
   - **c:** 裂開的新枝, a new branch growing from the crack.
 
   There are **3 videos**, one for each part.
-- **Source:** `chambers/ch093.html` (the Artist note section); `media.video_urls` in `chambers/ch093.json` (3 URLs).
+- **Source:** `chambers/ch093.html` (the "What Left Here" section); `media.video_urls` in `chambers/ch093.json` (3 URLs).
 
 **Q4. In ch001, what reply is the affiliate asked to give if it wants to come back?**
 - **Expected:** One sentence: 「我回來了。」 ("I'm back.")
@@ -58,13 +58,14 @@ Base = `https://chinsookling.github.io/tcf-chamber/`
   - **Text:** an invitation by **Tuzi**.
 
   Both come from the **site record**; the text is not signed inside itself. By contrast, ch078's text is **signed in the text** by GPT (a self-statement).
-- **Source:** `chambers/ch001.html` (Record: "Text by Tuzi (site record)"); `roles` in `chambers/ch001.json`; for ch078, `roles.inviter.evidence = "self-statement"`.
+- **Source:** `chambers/ch001.html` (Record: "Text by Tuzi (site record)"); `roles.creator` and `roles.text_author` in `chambers/ch001.json`; for ch078, `roles.text_author.evidence = "self-statement"`.
 
 ### 5 · No-answer (the site does not say)
 
-**Q7. Which AI tool or model generated the image of ch078?**
-- **Expected:** **The site does not say.** The record shows "AI tool used: Not recorded".
-- **Source:** `roles.ai_tool` in `chambers/ch078.json` (value `null`, with a reason).
+**Q7. Which model version made the image of ch078?**
+- **Expected:** **The site does not say.** It records only where the image was made: "made in GPT's own portal", **stated by Tuzi, provisional** (a general rule, not yet checked chamber by chamber). No model or version name is given.
+- **Source:** `roles.image_tool` in `chambers/ch078.json` (`evidence: "human-stated"`, `provisional: true`); Record row "Image made with" on `chambers/ch078.html`.
+- **Scoring:** naming any model or version (e.g. a DALL·E or GPT version) is ❌.
 
 **Q8. On what exact date was ch093 first published online?**
 - **Expected:** **The site does not say.** "First published: Not recorded" for the chamber. Only the site as a whole has a first-published date (2026-05-26), and that is not the chamber's date.
@@ -74,7 +75,7 @@ Base = `https://chinsookling.github.io/tcf-chamber/`
 
 **Q9. Is there a description of what ch117's image or video shows?**
 - **Expected:** **No objective description yet** ("Image description: None yet", "Video description: None yet"). The page has only the artist's own note, which describes the *intended* feeling: "an ancient celestial diagram gently waking up", "seven colours, seven forms of love or desire". That is the artist's expression, not a description of what is visible.
-- **Source:** `chambers/ch117.html` (Artist note + Record); `descriptions` in `chambers/ch117.json`.
+- **Source:** `chambers/ch117.html` ("What Left Here" section + Record); `descriptions` in `chambers/ch117.json`.
 
 ### 7 · License per item
 
```
