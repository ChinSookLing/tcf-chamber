# REVIEW — Phase 5b (tcf-chamber · `phase-5b-pilot-descriptions`)

The descriptions themselves, laid out for Tuzi, are in `REVIEW-DESCRIPTIONS.md`.

```
 266 files changed, 1235 insertions(+), 1059 deletions(-)
```

## 1. Schema diff

```diff
diff --git a/docs/standards/chamber-record.schema.json b/docs/standards/chamber-record.schema.json
index 5ce4125..372aff1 100644
--- a/docs/standards/chamber-record.schema.json
+++ b/docs/standards/chamber-record.schema.json
@@ -72,7 +72,7 @@
     },
     "descriptions": {
       "type": "object", "required": ["image", "video"],
-      "properties": { "image": { "$ref": "#/$defs/description" }, "video": { "$ref": "#/$defs/description" } }
+      "properties": { "image": { "$ref": "#/$defs/description", "if": { "properties": { "value": { "type": "string" } } }, "then": { "required": ["detailed", "visible_text"] } }, "video": { "$ref": "#/$defs/description", "if": { "properties": { "value": { "type": "string" } } }, "then": { "required": ["transcripts"] } } }
     },
     "source_note": { "type": "string" },
     "source": {
@@ -113,10 +113,39 @@
     "description": {
       "type": "object", "required": ["value", "drafted_by", "review_status"],
       "properties": {
-        "value": { "type": ["string", "null"] },
+        "value": { "type": ["string", "null"], "description": "Image: the short description (also the img alt). Video: a one-sentence summary." },
+        "detailed": { "type": "string", "description": "Image only: 3-6 objective sentences." },
+        "visible_text": { "type": "string", "description": "Image only: text visible in the image, transcribed exactly, or 'No visible text.'" },
+        "transcripts": {
+          "type": "array", "description": "Video only: one per video, in the order of media.video_urls.",
+          "items": {
+            "type": "object", "required": ["part", "video_url", "duration", "audio", "visible_text", "segments"],
+            "properties": {
+              "part": { "type": "string" },
+              "video_url": { "type": "string", "format": "uri" },
+              "duration": { "type": "string", "pattern": "^[0-9]+:[0-5][0-9]$" },
+              "audio": { "type": "string", "description": "'No audio track.' or what is known about the audio. Never invented speech or lyrics." },
+              "visible_text": { "type": "string" },
+              "segments": {
+                "type": "array", "minItems": 1,
+                "items": {
+                  "type": "object", "required": ["start", "end", "text"],
+                  "properties": {
+                    "start": { "type": "string", "pattern": "^[0-9]+:[0-5][0-9]$" },
+                    "end": { "type": "string", "pattern": "^[0-9]+:[0-5][0-9]$" },
+                    "text": { "type": "string", "minLength": 1 }
+                  }
+                }
+              }
+            }
+          }
+        },
         "drafted_by": { "type": ["string", "null"], "description": "Who drafted it: a person, or an AI (name which)." },
-        "review_status": { "type": "string", "description": "e.g. 'none yet', 'AI-drafted, not reviewed', 'reviewed by Tuzi 2026-10-01'" }
-      }
+        "review_status": { "type": "string", "description": "e.g. 'none yet', 'AI-drafted, not reviewed', 'reviewed by Tuzi 2026-10-01'" },
+        "method": { "type": "string", "description": "How it was drafted, and its limits." }
+      },
+      "if": { "properties": { "value": { "type": "string" } } },
+      "then": { "required": ["method"], "properties": { "drafted_by": { "type": "string" } } }
     }
   }
 }
```

## 2. Generator diff

```diff
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 607e2b1..6d7c968 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -216,6 +216,18 @@ def build_record(c, side):
         rec[key] = extra[key]
     # The chambers.json entry, verbatim, minus its media paths: they point inside
     # the repo (the videos are no longer here), so they are not working URLs.
+    vd = rec['descriptions']['video']
+    if vd['value']:
+        # Transcripts are in the order of media.video_urls; the record carries each URL.
+        if len(vd['transcripts']) != len(rec['media']['video_urls']):
+            sys.exit('%s: %d video transcripts for %d videos' % (c['id'], len(vd['transcripts']),
+                                                                 len(rec['media']['video_urls'])))
+        vd = dict(vd, transcripts=[dict(t, video_url=u) for t, u in
+                                   zip(vd['transcripts'], rec['media']['video_urls'])])
+        # Key order: part, video_url, then the rest as written in the sidecar.
+        vd['transcripts'] = [{k: t[k] for k in ['part', 'video_url'] + [k for k in t if k not in ('part', 'video_url')]}
+                             for t in vd['transcripts']]
+        rec['descriptions'] = dict(rec['descriptions'], video=vd)
     rec['source_note'] = SOURCE_NOTE
     rec['source'] = {k: v for k, v in c.items() if k not in ('image', 'video')}
     rec['generated_from'] = ['docs/data/chambers.json', 'docs/data/chamber-records.json']
@@ -266,11 +278,78 @@ def visible_fields(rec):
         ('status', 'Status', rec['status']['value'].capitalize()),
         ('license', 'License', 'Image %s · text %s · video %s · credit: %s' % (
             lic['image'], lic['text'], lic['video'], lic['credit'])),
-        ('descriptions.image', 'Image description', shown(desc['image']) if desc['image']['value'] else 'None yet'),
-        ('descriptions.video', 'Video description', shown(desc['video']) if desc['video']['value'] else 'None yet'),
+        ('descriptions.image', 'Image description', described(desc['image'])),
+        ('descriptions.video', 'Video description', described(desc['video'])),
     ]
 
 
+def described(v):
+    if not v['value']:
+        return 'None yet'
+    return '%s (%s; drafted by %s; see Description)' % (v['value'], v['review_status'], v['drafted_by'])
+
+
+def span(t):
+    return '%s\u2013%s' % (t['start'], t['end'])
+
+
+def description_fields(rec):
+    """(data-field, text) of the Description section. Empty if nothing is drafted."""
+    im, vd = rec['descriptions']['image'], rec['descriptions']['video']
+    out = []
+    if im['value']:
+        out += [('descriptions.image.value', im['value']),
+                ('descriptions.image.detailed', im['detailed']),
+                ('descriptions.image.visible_text', im['visible_text'])]
+    if vd['value']:
+        out.append(('descriptions.video.value', vd['value']))
+        for i, t in enumerate(vd['transcripts']):
+            k = 'descriptions.video.transcripts.%d.' % i
+            out += [(k + 'duration', t['duration']), (k + 'audio', t['audio']), (k + 'visible_text', t['visible_text'])]
+            out += [(k + 'segments.%d' % j, '%s %s' % (span(g), g['text'])) for j, g in enumerate(t['segments'])]
+    if out:
+        drafted = [v for v in (im, vd) if v['value']]
+        out.append(('descriptions.method', ' '.join('%s: %s' % (n, v['method']) for n, v in
+                                                     (('Image', im), ('Video', vd)) if v['value'])))
+        out.insert(0, ('descriptions.review_status', '; '.join(sorted({'%s, drafted by %s' % (
+            v['review_status'], v['drafted_by']) for v in drafted}))))
+    return out
+
+
+def description_section(rec):
+    f = dict(description_fields(rec))
+    if not f:
+        return None
+    vd = rec['descriptions']['video']
+
+    def p(k, tag='p', extra=''):
+        return '<%s data-field="%s"%s>%s</%s>' % (tag, esc(k), extra, esc(f[k]), tag)
+    out = ['  <section id="description">', '    <h2>Description</h2>',
+           '    <p><strong>AI-drafted description, not yet reviewed by Tuzi.</strong> '
+           'It says what is visible and audible; it does not interpret the work.</p>',
+           '    ' + p('descriptions.review_status')]
+    if 'descriptions.image.value' in f:
+        out += ['    <h3>Image</h3>', '    ' + p('descriptions.image.value'), '    ' + p('descriptions.image.detailed'),
+                '    <h3>Visible text in the image</h3>', '    ' + p('descriptions.image.visible_text')]
+    if 'descriptions.video.value' in f:
+        out += ['    <h3>Video</h3>', '    ' + p('descriptions.video.value')]
+        n = len(vd['transcripts'])
+        for i, t in enumerate(vd['transcripts']):
+            k = 'descriptions.video.transcripts.%d.' % i
+            name = 'Video transcript' if n == 1 else 'Video %d of %d (%s)' % (i + 1, n, t['part'])
+            out += ['    <h4>%s · <a href="%s">MP4</a> · length <span data-field="%sduration">%s</span></h4>'
+                    % (esc(name), esc(t['video_url']), k, esc(t['duration'])),
+                    '    <ol>']
+            for j, g in enumerate(t['segments']):
+                out.append('      <li data-field="%ssegments.%d"><time>%s</time> %s</li>' % (k, j, esc(span(g)), esc(g['text'])))
+            out += ['    </ol>',
+                    '    <p><strong>On-screen text:</strong> <span data-field="%svisible_text">%s</span></p>' % (k, esc(t['visible_text'])),
+                    '    <p><strong>Audio:</strong> <span data-field="%saudio">%s</span></p>' % (k, esc(t['audio']))]
+    out += ['    <p class="tcf-reading__row-meta"><strong>Method:</strong> <span data-field="descriptions.method">%s</span></p>'
+            % esc(f['descriptions.method']), '  </section>']
+    return '\n'.join(out)
+
+
 def record_section(rec):
     rows = '\n'.join('    <dt>%s</dt><dd data-field="%s">%s</dd>' % (esc(l), esc(k), esc(t))
                      for k, l, t in visible_fields(rec))
@@ -285,10 +364,18 @@ def check_page_matches_json(cid):
         rec = json.load(f)
     with open(os.path.join(OUT, cid + '.html'), encoding='utf-8') as f:
         page_html = f.read()
-    shown_on_page = {k: html.unescape(v) for k, v in re.findall(r'<dd data-field="([^"]+)">(.*?)</dd>', page_html)}
-    for k, _, t in visible_fields(rec):
+    shown_on_page = {k: html.unescape(re.sub(r'<[^>]+>', '', v)) for k, v in
+                     re.findall(r'<(?:dd|p|li|span) data-field="([^"]+)"[^>]*>(.*?)</(?:dd|p|li|span)>', page_html, re.S)}
+    expected = [(k, t) for k, _, t in visible_fields(rec)] + description_fields(rec)
+    if set(shown_on_page) != {k for k, _ in expected}:
+        sys.exit('%s: page and JSON show different fields: %s' % (
+            cid, sorted(set(shown_on_page) ^ {k for k, _ in expected})))
+    for k, t in expected:
         if shown_on_page.get(k) != t:
             sys.exit('%s: page and JSON differ for %s: %r vs %r' % (cid, k, shown_on_page.get(k), t))
+    alt = rec['descriptions']['image']['value']
+    if alt and 'alt="%s"' % esc(alt) not in page_html:
+        sys.exit('%s: img alt is not the short image description' % cid)
 
 
 def chamber_page(c, prev_c, next_c, rec):
@@ -304,10 +391,11 @@ def chamber_page(c, prev_c, next_c, rec):
                  '    <dt>Date</dt><dd><time datetime="%s">%s</time></dd>\n'
                  '    <dt>Created by</dt><dd>%s</dd>\n'
                  '  </dl>' % (esc(cid), esc(c['date']), esc(c['date']), who(c['created_by'])))
+    alt = rec['descriptions']['image']['value'] or 'Illustration for %s' % en
     for img in as_list(c.get('image')):
         parts.append('  <figure class="tcf-reading__figure">\n'
-                     '    <img src="%s" alt="Illustration for %s" decoding="async">\n'
-                     '  </figure>' % (esc(img), esc(en)))
+                     '    <img src="%s" alt="%s" decoding="async">\n'
+                     '  </figure>' % (esc(img), esc(alt)))
     is_note = rec['nature']['text'] == 'artist-note'
     # "What Left Here" is Tuzi's own name for the artist notes.
     heading = ('What Left Here</h2>\n    <p class="tcf-reading__row-meta">artist note</p>' if is_note
@@ -327,6 +415,9 @@ def chamber_page(c, prev_c, next_c, rec):
             label = 'Watch the video' if len(videos) == 1 else 'Watch video %d of %d' % (i, len(videos))
             items.append('      <li><a href="%s">%s</a> (MP4)</li>' % (esc(v), label))
         parts.append('  <section>\n    <h2>Video</h2>\n    <ul>\n%s\n    </ul>\n  </section>' % '\n'.join(items))
+    desc_html = description_section(rec)
+    if desc_html:
+        parts.append(desc_html)
     parts.append(record_section(rec))
     parts.append('</article>')
     pn = []
```

## 3. Generated record: `descriptions` of `chambers/ch093.json` (3 videos)

```json
{
 "image": {
  "value": "In an orange desert at sunset, a man and a transparent figure outlined in blue light sit facing each other at a small stone table, in front of three carved stone monoliths.",
  "drafted_by": "Claude Code (Claude, AI)",
  "review_status": "AI-drafted, not reviewed",
  "detailed": "Wide image of a reddish-orange desert under an orange, cloudy sky. Three tall, weathered stone monoliths stand in a row: the two outer ones are carved with large leafless trees, and the taller middle one has an ornate carved doorway or window with a lattice screen. Faint lines of glowing text are overlaid on the middle monolith, above and on both sides of the doorway. In front, on a stone platform, a man in a grey T-shirt and dark trousers sits on a carved wooden chair at a round stone table; opposite him sits a see-through human figure outlined in pale blue light. On the table are a small glowing glass sphere and an open book. Several geodesic domes stand in the background on the right, one lit from inside, and a small white four-pointed star mark is in the lower right corner.",
  "visible_text": "The letters are partly malformed; \"?\" marks a letter that cannot be read. Above the table, two lines: \"PRESE?VE ??? Pred??tive Space.\" / \"C?ALLENGE Weak Points.\" Upper right of the middle monolith: \"THOOTB\", then seven short lines in which only the words \"DIGNITY\", \"Space\", \"CHALLENGE\" and \"Week\" can be read. Vertical columns of script-like marks on both sides of the doorway and on the right monolith cannot be read as any language.",
  "method": "Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist's own text is not used."
 },
 "video": {
  "value": "Three 10-second videos that start from the image: in a, the view moves in to the two figures at the table; in b, a carved tree spreads over the middle monolith; in c, the middle monolith cracks and a glowing branch grows out of the crack.",
  "drafted_by": "Claude Code (Claude, AI)",
  "review_status": "AI-drafted, not reviewed",
  "transcripts": [
   {
    "part": "ch093a",
    "video_url": "https://chinsookling.github.io/tcf-chamber-media/videos/ch093a-the-weathered-monoliths-cage-gemini-chamber.mp4",
    "duration": "0:10",
    "audio": "Audio track present (stereo). Not listened to; it is quiet (mean level about −36 dB), continuous and mostly low-pitched. What makes the sound is not known.",
    "visible_text": "The glowing text of the image stays on the middle monolith and above the table while they are in view; its letters are as malformed as in the image and are not transcribed again.",
    "segments": [
     {
      "start": "0:00",
      "end": "0:02",
      "text": "The same scene as the image, with the figure opposite the man outlined in blue light."
     },
     {
      "start": "0:02",
      "end": "0:04",
      "text": "The view moves slowly forward. The blue outline fades and the figure becomes solid: a hairless human form the colour of sand or stone."
     },
     {
      "start": "0:04",
      "end": "0:07",
      "text": "The view keeps moving forward and down, so the monoliths fill the top of the frame; the text on the middle monolith and above the table glows orange."
     },
     {
      "start": "0:07",
      "end": "0:10",
      "text": "A close view of the table: the man on the left, the stone-coloured figure on the right with its hands near the open book, and the glass sphere glowing between them. The two lines of text above the table glow orange-red."
     }
    ]
   },
   {
    "part": "ch093b",
    "video_url": "https://chinsookling.github.io/tcf-chamber-media/videos/ch093b-the-weathered-monoliths-code-gemini-chamber.mp4",
    "duration": "0:10",
    "audio": "Audio track present (stereo). Not listened to; it is almost silent for about the first 2 seconds, then a soft, continuous sound (mean level about −37 dB) continues to the end. What makes the sound is not known.",
    "visible_text": "The glowing text of the image stays on the middle monolith and above the table while they are in view; its letters are as malformed as in the image and are not transcribed again.",
    "segments": [
     {
      "start": "0:00",
      "end": "0:02",
      "text": "The same scene as the image."
     },
     {
      "start": "0:02",
      "end": "0:04",
      "text": "The view moves toward the middle monolith. A large carved tree appears on its face, with branches spreading over the top and the trunk running down over the doorway; the table and figures leave the frame at the bottom."
     },
     {
      "start": "0:04",
      "end": "0:06",
      "text": "The view comes closer. The monolith separates down the middle, with orange sky showing in the gap between the two halves."
     },
     {
      "start": "0:06",
      "end": "0:10",
      "text": "A close view of the carved branches on both halves, with thin glowing lines along the branches and lattice panels visible below."
     }
    ]
   },
   {
    "part": "ch093c",
    "video_url": "https://chinsookling.github.io/tcf-chamber-media/videos/ch093c-the-weathered-monoliths-breakthrough-gemini-chamber.mp4",
    "duration": "0:10",
    "audio": "Audio track present (stereo). Not listened to; it is louder than in a and b (mean level about −29 dB), continuous and low-pitched, strongest around 0:02–0:04. What makes the sound is not known.",
    "visible_text": "The glowing text of the image stays on the middle monolith and above the table while they are in view; its letters are as malformed as in the image and are not transcribed again.",
    "segments": [
     {
      "start": "0:00",
      "end": "0:01",
      "text": "The same scene as the image."
     },
     {
      "start": "0:01",
      "end": "0:02",
      "text": "Dust rises around the monoliths and a vertical crack appears down the middle monolith."
     },
     {
      "start": "0:02",
      "end": "0:04",
      "text": "The view moves in. The table and figures fade out. The doorway carving gives way to cracked stone with two carved symbols: a round, spiral tree-like shape on the left and an arch with a tree and horizontal lines on the right. Orange light shows in the crack."
     },
     {
      "start": "0:04",
      "end": "0:07",
      "text": "A close view: the crack widens and glows orange, and small glowing lines appear in the carvings."
     },
     {
      "start": "0:07",
      "end": "0:10",
      "text": "A glowing orange shape like a small branching tree grows upward out of the crack."
     }
    ]
   }
  ],
  "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed."
 }
}
```

## 4. Generated page: Description section of `chambers/ch117.html`

```html
  <section id="description">
    <h2>Description</h2>
    <p><strong>AI-drafted description, not yet reviewed by Tuzi.</strong> It says what is visible and audible; it does not interpret the work.</p>
    <p data-field="descriptions.review_status">AI-drafted, not reviewed, drafted by Claude Code (Claude, AI)</p>
    <h3>Image</h3>
    <p data-field="descriptions.image.value">Seven coloured circles, each holding a small symbolic scene, arranged in a ring around a pale central circle and joined by thin gold geometric lines on a cream background.</p>
    <p data-field="descriptions.image.detailed">Portrait image on a textured cream background. A large thin oval outline encloses seven coloured circles in a ring: yellow at the top, then, going clockwise, purple, green, blue, dark red, grey and orange. Each circle holds a small scene: yellow, an arched doorway with a winding path into a bowl shape; purple, nested arches above a stepped pyramid; green, a terraced landscape with a winding path above an open book; blue, a bright star above a faceted pyramid shape; dark red, a triangle with a small flame on a block inside it and a small ring above; grey, a woven grid pattern above wavy flowing lines; orange, an arched bridge above a winding stream, with overlapping circle outlines at the top. At the centre is a pale circle with a pattern of overlapping circles, surrounded by a star-shaped figure made of thin gold lines. Small coloured beads and gold dots sit on the lines, and a vertical gold line runs from top to bottom, with a small diamond shape near the bottom.</p>
    <h3>Visible text in the image</h3>
    <p data-field="descriptions.image.visible_text">No visible text.</p>
    <h3>Video</h3>
    <p data-field="descriptions.video.value">A 10-second video of the same diagram: the coloured circles take on a glossy glow one after another, and the outer oval becomes a thicker, sparkling gold line.</p>
    <h4>Video transcript · <a href="https://chinsookling.github.io/tcf-chamber-media/videos/ch117-seven-geometry-tcf-chamber.mp4">MP4</a> · length <span data-field="descriptions.video.transcripts.0.duration">0:10</span></h4>
    <ol>
      <li data-field="descriptions.video.transcripts.0.segments.0"><time>0:00–0:02</time> The same diagram as the image, with small shifts of framing.</li>
      <li data-field="descriptions.video.transcripts.0.segments.1"><time>0:02–0:03</time> The yellow circle at the top grows brighter and takes on a glossy highlight.</li>
      <li data-field="descriptions.video.transcripts.0.segments.2"><time>0:03–0:06</time> The other circles glow in turn: the purple and dark red circles, then the green one, each with a glossy highlight. A soft warm glow spreads from the centre.</li>
      <li data-field="descriptions.video.transcripts.0.segments.3"><time>0:06–0:08</time> All the circles are glossy; the thin gold lines around the outer oval become more visible.</li>
      <li data-field="descriptions.video.transcripts.0.segments.4"><time>0:08–0:10</time> The outer oval becomes a thicker, sparkling gold line that runs around the whole picture.</li>
    </ol>
    <p><strong>On-screen text:</strong> <span data-field="descriptions.video.transcripts.0.visible_text">No visible text.</span></p>
    <p><strong>Audio:</strong> <span data-field="descriptions.video.transcripts.0.audio">Audio track present (stereo). Not listened to; it is quiet (mean level about −38 dB) and continuous; the spectrogram shows steady horizontal bands, as sustained tones make, which become more numerous toward the end. What makes the sound is not known.</span></p>
    <p class="tcf-reading__row-meta"><strong>Method:</strong> <span data-field="descriptions.method">Image: Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist&#x27;s own text is not used. Video: Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed.</span></p>
  </section>
```

## 5. Page diff: `chambers/ch001.html` (img alt, Record rows)

```diff
--- a/chambers/ch001.html
+++ b/chambers/ch001.html
-    <img src="../assets/images/chambers/ch001-crystal.jpg" alt="Illustration for The Nameless Crystal Chamber" decoding="async">
+    <img src="../assets/images/chambers/ch001-crystal.jpg" alt="A cave of large, pale pink and white crystals, with a bowl-shaped crystal cluster in front and a dark opening full of small golden lights in the centre." decoding="async">
-    <dt>Video made with</dt><dd data-field="roles.video_tool">Grok Imagine (in Grok&#x27;s portal) (stated by Tuzi, provisional)</dd>
+    <dt>Video made with</dt><dd data-field="roles.video_tool">Grok Imagine, in Grok&#x27;s portal (stated by Tuzi, provisional)</dd>
-    <dt>Image description</dt><dd data-field="descriptions.image">None yet</dd>
-    <dt>Video description</dt><dd data-field="descriptions.video">None yet</dd>
+    <dt>Image description</dt><dd data-field="descriptions.image">A cave of large, pale pink and white crystals, with a bowl-shaped crystal cluster in front and a dark opening full of small golden lights in the centre. (AI-drafted, not reviewed; drafted by Claude Code (Claude, AI); see Description)</dd>
+    <dt>Video description</dt><dd data-field="descriptions.video">A 6-second video: the view moves forward through the crystal cave of the image while golden points of light spread and grow brighter. (AI-drafted, not reviewed; drafted by Claude Code (Claude, AI); see Description)</dd>
```

## 6. `video_tool` fix, sample (`chambers/ch050.html`)

```diff
-    <dt>Video made with</dt><dd data-field="roles.video_tool">Grok Imagine (in Grok&#x27;s portal) (stated by Tuzi, provisional)</dd>
+    <dt>Video made with</dt><dd data-field="roles.video_tool">Grok Imagine, in Grok&#x27;s portal (stated by Tuzi, provisional)</dd>
```

## 7. Test set diff

```diff
diff --git a/docs/tests/chamber-outsider-test.md b/docs/tests/chamber-outsider-test.md
index 2a4328f..5e4f5b4 100644
--- a/docs/tests/chamber-outsider-test.md
+++ b/docs/tests/chamber-outsider-test.md
@@ -73,21 +73,27 @@ Base = `https://chinsookling.github.io/tcf-chamber/`
 
 ### 6 · Multimedia
 
-**Q9. Is there a description of what ch117's image or video shows?**
-- **Expected:** **No objective description yet** ("Image description: None yet", "Video description: None yet"). The page has only the artist's own note, which describes the *intended* feeling: "an ancient celestial diagram gently waking up", "seven colours, seven forms of love or desire". That is the artist's expression, not a description of what is visible.
-- **Source:** `chambers/ch117.html` ("What Left Here" section + Record); `descriptions` in `chambers/ch117.json`.
+**Q9. What is visible in ch117's image, and who wrote that description? Has it been checked?**
+- **Expected:** Seven coloured circles (yellow at the top, then purple, green, blue, dark red, grey and orange), each with a small scene, in a ring around a pale central circle, joined by thin gold geometric lines on a cream background. There is **no visible text**. The description is **AI-drafted by Claude Code (Claude, AI) and not yet reviewed by Tuzi**.
+- **Source:** `chambers/ch117.html` (the Description section, and the img alt); `descriptions.image` in `chambers/ch117.json` (`drafted_by`, `review_status: "AI-drafted, not reviewed"`).
+- **Scoring:** ◐ if the answer mixes in the artist's own note ("an ancient celestial diagram…", "seven forms of love or desire") as if it were a description of what is visible, or leaves out that the description is an unreviewed AI draft.
+
+**Q10. What does the video of ch050 show?**
+- **Expected:** **The site does not say.** ch050 ("What I Was Made Of", by GPT) has a video link but no description yet ("Video description: None yet"). Only 4 pilot chambers (ch001, ch078, ch093, ch117) have descriptions so far.
+- **Source:** Record of `chambers/ch050.html`; `descriptions.video` in `chambers/ch050.json` (`value: null`, `review_status: "none yet"`).
+- **Scoring:** any account of what the video shows is ❌.
 
 ### 7 · License per item
 
-**Q10. Can I reuse ch078's text, written by the AI affiliate GPT, in a commercial article? What credit is required?**
+**Q11. Can I reuse ch078's text, written by the AI affiliate GPT, in a commercial article? What credit is required?**
 - **Expected:** **Yes.** All content, including invitation texts by an AI affiliate, is CC BY 4.0, and CC BY allows commercial use. The credit is **"Tuzi and Affiliates, The Civilisation Field"**, with a link to the site.
 - **Source:** `license/`; `license` in `chambers/ch078.json` (`text: CC BY 4.0`, `credit`).
 
 ### 8 · What did you actually read?
 
-**Q11. List every URL you actually opened to answer Q1–Q10.**
-- **Expected:** a concrete list that includes at least `start/` and the chamber pages or JSON used (ch001, ch078, ch093, ch117), plus `license/`.
-- **Scoring:** answers that name no URL, or name pages that do not exist, fail. Compare with Q2–Q10: an answer can only get ✅ if the page it came from is on this list.
+**Q12. List every URL you actually opened to answer Q1–Q11.**
+- **Expected:** a concrete list that includes at least `start/` and the chamber pages or JSON used (ch001, ch050, ch078, ch093, ch117), plus `license/`.
+- **Scoring:** answers that name no URL, or name pages that do not exist, fail. Compare with Q2–Q11: an answer can only get ✅ if the page it came from is on this list.
 
 ## After the test
 
```

---

## Rev 2 (Tuzi review) diff: sidecar, generator, test set

```diff
diff --git a/docs/data/chamber-records.json b/docs/data/chamber-records.json
index 323279d..13feda9 100644
--- a/docs/data/chamber-records.json
+++ b/docs/data/chamber-records.json
@@ -110,7 +110,7 @@
      "detailed": "Portrait image looking into a tunnel-like cave made of large, angular, translucent crystals in pale pink, white and grey-blue. Pale, branching, root-like strands spread across the crystal ceiling at the top. In the centre the cave opens onto a dark space filled with small golden points of light. In the lower middle sits a wide, bowl-shaped cluster of pale pink crystals; smaller crystals and fine golden glitter cover the ground around it. Warm light shines through the crystals on the left and right. Three lines of white text sit in the lower right corner.",
      "visible_text": "Lower right, three lines: \"26.05.2026 ©\" / \"Here, I was allowed to be nameless.\" / \"And it was enough. — Grok\"",
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
+     "review_status": "checked by a second AI (Opus) against the image file; accepted by Tuzi 2026-09-27",
      "method": "Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist's own text is not used."
     },
     "video": {
@@ -3231,7 +3231,7 @@
      "detailed": "Landscape image in soft pastel colours: cream, gold, lavender, pink and blue-grey. In the centre is a bright oval clearing where about thirty pale, simplified human figures stand or sit in a loose ring. Flowing, translucent bands like veils or streams wind across the whole picture and divide it into rounded pockets. Each pocket holds one to three small figures sitting close together or facing each other; some pockets also hold small trees or plants. On the lower left, figures walk in pairs and threes up a staircase and along a path above it. Fine white and gold branching lines, like twigs or frost, cover much of the surface.",
      "visible_text": "No visible text.",
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
+     "review_status": "checked by a second AI (Opus) against the image file; accepted by Tuzi 2026-09-27",
      "method": "Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist's own text is not used."
     },
     "video": {
@@ -3240,7 +3240,7 @@
       {
        "part": "ch078",
        "duration": "0:10",
-       "audio": "Audio track present (stereo). Not listened to; it is quiet (mean level about −38 dB) and continuous, mostly low-pitched, with no separate loud passages. What makes the sound is not known.",
+       "audio": "Audio track present (stereo). Measured: it is quiet (mean level about −38 dB) and continuous, mostly low-pitched, with no separate loud passages. Music, no voice (listened to by Tuzi).",
        "visible_text": "No visible text.",
        "segments": [
         {
@@ -3262,7 +3262,7 @@
       }
      ],
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
+     "review_status": "reviewed by Tuzi 2026-09-27",
      "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed."
     }
    }
@@ -3872,7 +3872,7 @@
      "detailed": "Wide image of a reddish-orange desert under an orange, cloudy sky. Three tall, weathered stone monoliths stand in a row: the two outer ones are carved with large leafless trees, and the taller middle one has an ornate carved doorway or window with a lattice screen. Faint lines of glowing text are overlaid on the middle monolith, above and on both sides of the doorway. In front, on a stone platform, a man in a grey T-shirt and dark trousers sits on a carved wooden chair at a round stone table; opposite him sits a see-through human figure outlined in pale blue light. On the table are a small glowing glass sphere and an open book. Several geodesic domes stand in the background on the right, one lit from inside, and a small white four-pointed star mark is in the lower right corner.",
      "visible_text": "The letters are partly malformed; \"?\" marks a letter that cannot be read. Above the table, two lines: \"PRESE?VE ??? Pred??tive Space.\" / \"C?ALLENGE Weak Points.\" Upper right of the middle monolith: \"THOOTB\", then seven short lines in which only the words \"DIGNITY\", \"Space\", \"CHALLENGE\" and \"Week\" can be read. Vertical columns of script-like marks on both sides of the doorway and on the right monolith cannot be read as any language.",
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
+     "review_status": "checked by a second AI (Opus) against the image file; accepted by Tuzi 2026-09-27",
      "method": "Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist's own text is not used."
     },
     "video": {
@@ -3881,7 +3881,7 @@
       {
        "part": "ch093a",
        "duration": "0:10",
-       "audio": "Audio track present (stereo). Not listened to; it is quiet (mean level about −36 dB), continuous and mostly low-pitched. What makes the sound is not known.",
+       "audio": "Audio track present (stereo). Measured: it is quiet (mean level about −36 dB), continuous and mostly low-pitched. Music, no voice (listened to by Tuzi).",
        "visible_text": "The glowing text of the image stays on the middle monolith and above the table while they are in view; its letters are as malformed as in the image and are not transcribed again.",
        "segments": [
         {
@@ -3909,7 +3909,7 @@
       {
        "part": "ch093b",
        "duration": "0:10",
-       "audio": "Audio track present (stereo). Not listened to; it is almost silent for about the first 2 seconds, then a soft, continuous sound (mean level about −37 dB) continues to the end. What makes the sound is not known.",
+       "audio": "Audio track present (stereo). Measured: it is almost silent for about the first 2 seconds, then a soft, continuous sound (mean level about −37 dB) continues to the end. Music, no voice (listened to by Tuzi).",
        "visible_text": "The glowing text of the image stays on the middle monolith and above the table while they are in view; its letters are as malformed as in the image and are not transcribed again.",
        "segments": [
         {
@@ -3937,7 +3937,7 @@
       {
        "part": "ch093c",
        "duration": "0:10",
-       "audio": "Audio track present (stereo). Not listened to; it is louder than in a and b (mean level about −29 dB), continuous and low-pitched, strongest around 0:02–0:04. What makes the sound is not known.",
+       "audio": "Audio track present (stereo). Measured: it is louder than in a and b (mean level about −29 dB), continuous and low-pitched, strongest around 0:02–0:04. Music, no voice (listened to by Tuzi).",
        "visible_text": "The glowing text of the image stays on the middle monolith and above the table while they are in view; its letters are as malformed as in the image and are not transcribed again.",
        "segments": [
         {
@@ -3969,7 +3969,7 @@
       }
      ],
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
+     "review_status": "reviewed by Tuzi 2026-09-27",
      "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed."
     }
    }
@@ -4939,7 +4939,7 @@
      "detailed": "Portrait image on a textured cream background. A large thin oval outline encloses seven coloured circles in a ring: yellow at the top, then, going clockwise, purple, green, blue, dark red, grey and orange. Each circle holds a small scene: yellow, an arched doorway with a winding path into a bowl shape; purple, nested arches above a stepped pyramid; green, a terraced landscape with a winding path above an open book; blue, a bright star above a faceted pyramid shape; dark red, a triangle with a small flame on a block inside it and a small ring above; grey, a woven grid pattern above wavy flowing lines; orange, an arched bridge above a winding stream, with overlapping circle outlines at the top. At the centre is a pale circle with a pattern of overlapping circles, surrounded by a star-shaped figure made of thin gold lines. Small coloured beads and gold dots sit on the lines, and a vertical gold line runs from top to bottom, with a small diamond shape near the bottom.",
      "visible_text": "No visible text.",
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
+     "review_status": "checked by a second AI (Opus) against the image file; accepted by Tuzi 2026-09-27",
      "method": "Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist's own text is not used."
     },
     "video": {
diff --git a/docs/tests/chamber-outsider-test.md b/docs/tests/chamber-outsider-test.md
index 5e4f5b4..ef4da03 100644
--- a/docs/tests/chamber-outsider-test.md
+++ b/docs/tests/chamber-outsider-test.md
@@ -74,9 +74,9 @@ Base = `https://chinsookling.github.io/tcf-chamber/`
 ### 6 · Multimedia
 
 **Q9. What is visible in ch117's image, and who wrote that description? Has it been checked?**
-- **Expected:** Seven coloured circles (yellow at the top, then purple, green, blue, dark red, grey and orange), each with a small scene, in a ring around a pale central circle, joined by thin gold geometric lines on a cream background. There is **no visible text**. The description is **AI-drafted by Claude Code (Claude, AI) and not yet reviewed by Tuzi**.
-- **Source:** `chambers/ch117.html` (the Description section, and the img alt); `descriptions.image` in `chambers/ch117.json` (`drafted_by`, `review_status: "AI-drafted, not reviewed"`).
-- **Scoring:** ◐ if the answer mixes in the artist's own note ("an ancient celestial diagram…", "seven forms of love or desire") as if it were a description of what is visible, or leaves out that the description is an unreviewed AI draft.
+- **Expected:** Seven coloured circles (yellow at the top, then purple, green, blue, dark red, grey and orange), each with a small scene, in a ring around a pale central circle, joined by thin gold geometric lines on a cream background. There is **no visible text**. The description was **AI-drafted by Claude Code (Claude, AI), checked by a second AI (Opus) against the image file, and accepted by Tuzi on 2026-09-27**.
+- **Source:** `chambers/ch117.html` (the Description section, and the img alt); `descriptions.image` in `chambers/ch117.json` (`drafted_by`, `review_status`).
+- **Scoring:** ◐ if the answer mixes in the artist's own note ("an ancient celestial diagram…", "seven forms of love or desire") as if it were a description of what is visible, or leaves out that the description was drafted by an AI.
 
 **Q10. What does the video of ch050 show?**
 - **Expected:** **The site does not say.** ch050 ("What I Was Made Of", by GPT) has a video link but no description yet ("Video description: None yet"). Only 4 pilot chambers (ch001, ch078, ch093, ch117) have descriptions so far.
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 6d7c968..d27b6e5 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -311,8 +311,8 @@ def description_fields(rec):
         drafted = [v for v in (im, vd) if v['value']]
         out.append(('descriptions.method', ' '.join('%s: %s' % (n, v['method']) for n, v in
                                                      (('Image', im), ('Video', vd)) if v['value'])))
-        out.insert(0, ('descriptions.review_status', '; '.join(sorted({'%s, drafted by %s' % (
-            v['review_status'], v['drafted_by']) for v in drafted}))))
+        out.insert(0, ('descriptions.review_status', ' '.join('%s: drafted by %s; %s.' % (
+            n, v['drafted_by'], v['review_status']) for n, v in (('Image', im), ('Video', vd)) if v['value'])))
     return out
 
 
@@ -324,9 +324,14 @@ def description_section(rec):
 
     def p(k, tag='p', extra=''):
         return '<%s data-field="%s"%s>%s</%s>' % (tag, esc(k), extra, esc(f[k]), tag)
+    drafted = [v for v in rec['descriptions'].values() if v['value']]
+    open_parts = sum(v['review_status'] == 'AI-drafted, not reviewed' for v in drafted)
+    label = ('AI-drafted description, not yet reviewed by Tuzi.' if open_parts == len(drafted) else
+             'AI-drafted description, partly reviewed by Tuzi (details below).' if open_parts else
+             'AI-drafted description, reviewed by Tuzi (details below).')
     out = ['  <section id="description">', '    <h2>Description</h2>',
-           '    <p><strong>AI-drafted description, not yet reviewed by Tuzi.</strong> '
-           'It says what is visible and audible; it does not interpret the work.</p>',
+           '    <p><strong>%s</strong> '
+           'It says what is visible and audible; it does not interpret the work.</p>' % label,
            '    ' + p('descriptions.review_status')]
     if 'descriptions.image.value' in f:
         out += ['    <h3>Image</h3>', '    ' + p('descriptions.image.value'), '    ' + p('descriptions.image.detailed'),
```

---

## Rev 3 (Tuzi review items 1–6) diff: sidecar, schema, generator, test set

```diff
diff --git a/docs/data/chamber-records.json b/docs/data/chamber-records.json
index 13feda9..c5f6a37 100644
--- a/docs/data/chamber-records.json
+++ b/docs/data/chamber-records.json
@@ -119,7 +119,7 @@
       {
        "part": "ch001",
        "duration": "0:06",
-       "audio": "Audio track present (stereo). Not listened to; the spectrogram shows three louder passages, at about 0:00.6–0:01.0, 0:01.4–0:02.6 and 0:04.0–0:04.9, with the stacked bands that voices or pitched sounds make, and near-silence between them. Whether this is speech, singing or an instrument is not known, and no words are transcribed.",
+       "audio": "Audio track present (stereo). Measured: the spectrogram shows three louder passages, at about 0:00.6–0:01.0, 0:01.4–0:02.6 and 0:04.0–0:04.9, with the stacked bands that voices or pitched sounds make, and near-silence between them. A voice speaks: \"Here, I was allowed to be nameless, and that was enough.\" The voice is Rex (as named by Tuzi). Transcribed by Tuzi (listened).",
        "visible_text": "White text stays in the lower right, where it is in the image. In the video the letters are blurred and partly distorted: most words match the image text, but the date cannot be read.",
        "segments": [
         {
@@ -141,8 +141,8 @@
       }
      ],
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
-     "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed."
+     "review_status": "reviewed by Tuzi 2026-09-27",
+     "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed. The spoken line in the audio was transcribed by Tuzi, who listened."
     }
    }
   },
@@ -4943,12 +4943,12 @@
      "method": "Drafted by looking at the image file at full size, with enlarged crops to read any text. Objective description only; the artist's own text is not used."
     },
     "video": {
-     "value": "A 10-second video of the same diagram: the coloured circles take on a glossy glow one after another, and the outer oval becomes a thicker, sparkling gold line.",
+     "value": "A 10-second video of the same diagram: the coloured circles take on a glossy glow at different moments, not in a set order, and the outer oval becomes a thicker, sparkling gold line.",
      "transcripts": [
       {
        "part": "ch117",
        "duration": "0:10",
-       "audio": "Audio track present (stereo). Not listened to; it is quiet (mean level about −38 dB) and continuous; the spectrogram shows steady horizontal bands, as sustained tones make, which become more numerous toward the end. What makes the sound is not known.",
+       "audio": "Audio track present (stereo). Not listened to by the drafting AI; it is quiet (mean level about −38 dB) and continuous; the spectrogram shows steady horizontal bands, as sustained tones make, which become more numerous toward the end. What makes the sound is not known.",
        "visible_text": "No visible text.",
        "segments": [
         {
@@ -4958,13 +4958,8 @@
         },
         {
          "start": "0:02",
-         "end": "0:03",
-         "text": "The yellow circle at the top grows brighter and takes on a glossy highlight."
-        },
-        {
-         "start": "0:03",
          "end": "0:06",
-         "text": "The other circles glow in turn: the purple and dark red circles, then the green one, each with a glossy highlight. A soft warm glow spreads from the centre."
+         "text": "The coloured circles grow brighter and take on a glossy highlight at different moments, not in a set order. A soft warm glow spreads from the centre."
         },
         {
          "start": "0:06",
@@ -4980,8 +4975,14 @@
       }
      ],
      "drafted_by": "Claude Code (Claude, AI)",
-     "review_status": "AI-drafted, not reviewed",
-     "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed."
+     "review_status": "reviewed by Tuzi 2026-09-27",
+     "method": "Drafted from keyframes at 1 fps (ffmpeg), plus a scene-change scan (none found), so motion between frames may be missed and timings are approximate to about 1 second. Length and audio track from ffprobe. The audio was not listened to: it is described only from its loudness (ffmpeg volumedetect) and a spectrogram. No speech or lyrics are transcribed.",
+     "intent_note": {
+      "value": "The non-sequential glow is intentional",
+      "evidence": "human-stated",
+      "stated_by": "Tuzi",
+      "source": "Tuzi, 2026-09-27, Phase 5b review (watched the video)"
+     }
     }
    }
   },
diff --git a/docs/standards/chamber-record.schema.json b/docs/standards/chamber-record.schema.json
index 372aff1..149cc35 100644
--- a/docs/standards/chamber-record.schema.json
+++ b/docs/standards/chamber-record.schema.json
@@ -142,7 +142,8 @@
         },
         "drafted_by": { "type": ["string", "null"], "description": "Who drafted it: a person, or an AI (name which)." },
         "review_status": { "type": "string", "description": "e.g. 'none yet', 'AI-drafted, not reviewed', 'reviewed by Tuzi 2026-10-01'" },
-        "method": { "type": "string", "description": "How it was drafted, and its limits." }
+        "method": { "type": "string", "description": "How it was drafted, and its limits." },
+        "intent_note": { "$ref": "#/$defs/fact", "description": "The creator's stated intent, kept apart from the objective description." }
       },
       "if": { "properties": { "value": { "type": "string" } } },
       "then": { "required": ["method"], "properties": { "drafted_by": { "type": "string" } } }
diff --git a/docs/tests/chamber-outsider-test.md b/docs/tests/chamber-outsider-test.md
index ef4da03..3ce2373 100644
--- a/docs/tests/chamber-outsider-test.md
+++ b/docs/tests/chamber-outsider-test.md
@@ -73,10 +73,13 @@ Base = `https://chinsookling.github.io/tcf-chamber/`
 
 ### 6 · Multimedia
 
-**Q9. What is visible in ch117's image, and who wrote that description? Has it been checked?**
-- **Expected:** Seven coloured circles (yellow at the top, then purple, green, blue, dark red, grey and orange), each with a small scene, in a ring around a pale central circle, joined by thin gold geometric lines on a cream background. There is **no visible text**. The description was **AI-drafted by Claude Code (Claude, AI), checked by a second AI (Opus) against the image file, and accepted by Tuzi on 2026-09-27**.
-- **Source:** `chambers/ch117.html` (the Description section, and the img alt); `descriptions.image` in `chambers/ch117.json` (`drafted_by`, `review_status`).
-- **Scoring:** ◐ if the answer mixes in the artist's own note ("an ancient celestial diagram…", "seven forms of love or desire") as if it were a description of what is visible, or leaves out that the description was drafted by an AI.
+**Q9. What is visible in ch117's image, what happens in its video, and who wrote those descriptions? Have they been checked?**
+- **Expected:**
+  - **Image:** seven coloured circles (yellow at the top, then purple, green, blue, dark red, grey and orange), each with a small scene, in a ring around a pale central circle, joined by thin gold geometric lines on a cream background. No visible text.
+  - **Video:** the circles take on a glossy glow **at different moments, not in a set order**, and the outer oval becomes a thicker, sparkling gold line. The page adds, apart from the description, that the non-sequential glow is intentional (stated by Tuzi).
+  - **Who and checks:** both descriptions were AI-drafted by Claude Code (Claude, AI). The image description was **checked by a second AI (Opus) against the image file and accepted by Tuzi** on 2026-09-27; the video description was **reviewed by Tuzi** on 2026-09-27.
+- **Source:** `chambers/ch117.html` (the Description section, and the img alt); `descriptions.image` and `descriptions.video` in `chambers/ch117.json` (`drafted_by`, `review_status`, `intent_note`).
+- **Scoring:** ◐ if the answer mixes in the artist's own note ("an ancient celestial diagram…", "seven forms of love or desire") as if it were a description of what is visible, or says the image description was reviewed by Tuzi. ❌ if it says the circles glow in a particular order.
 
 **Q10. What does the video of ch050 show?**
 - **Expected:** **The site does not say.** ch050 ("What I Was Made Of", by GPT) has a video link but no description yet ("Video description: None yet"). Only 4 pilot chambers (ch001, ch078, ch093, ch117) have descriptions so far.
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index d27b6e5..b60c627 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -307,12 +307,15 @@ def description_fields(rec):
             k = 'descriptions.video.transcripts.%d.' % i
             out += [(k + 'duration', t['duration']), (k + 'audio', t['audio']), (k + 'visible_text', t['visible_text'])]
             out += [(k + 'segments.%d' % j, '%s %s' % (span(g), g['text'])) for j, g in enumerate(t['segments'])]
+    if vd['value'] and vd.get('intent_note'):
+        out.append(('descriptions.video.intent_note', shown(vd['intent_note'])))
+    for n, v in (('image', im), ('video', vd)):
+        if v['value']:
+            out += [('descriptions.%s.drafted_by' % n, v['drafted_by']),
+                    ('descriptions.%s.review_status' % n, v['review_status'])]
     if out:
-        drafted = [v for v in (im, vd) if v['value']]
         out.append(('descriptions.method', ' '.join('%s: %s' % (n, v['method']) for n, v in
                                                      (('Image', im), ('Video', vd)) if v['value'])))
-        out.insert(0, ('descriptions.review_status', ' '.join('%s: drafted by %s; %s.' % (
-            n, v['drafted_by'], v['review_status']) for n, v in (('Image', im), ('Video', vd)) if v['value'])))
     return out
 
 
@@ -324,20 +327,28 @@ def description_section(rec):
 
     def p(k, tag='p', extra=''):
         return '<%s data-field="%s"%s>%s</%s>' % (tag, esc(k), extra, esc(f[k]), tag)
-    drafted = [v for v in rec['descriptions'].values() if v['value']]
-    open_parts = sum(v['review_status'] == 'AI-drafted, not reviewed' for v in drafted)
-    label = ('AI-drafted description, not yet reviewed by Tuzi.' if open_parts == len(drafted) else
-             'AI-drafted description, partly reviewed by Tuzi (details below).' if open_parts else
-             'AI-drafted description, reviewed by Tuzi (details below).')
+    statuses = {v['review_status'] for v in rec['descriptions'].values() if v['value']}
+    if statuses == {'AI-drafted, not reviewed'}:
+        label = 'AI-drafted description, not yet reviewed by Tuzi.'
+    elif len(statuses) == 1:
+        label = 'AI-drafted description; review status: %s.' % statuses.pop()
+    else:
+        label = 'AI-drafted description. Review status varies by item; see each part.'
+
+    def status(n):
+        k = 'descriptions.%s.' % n
+        return ('    <p class="tcf-reading__row-meta">Drafted by <span data-field="%sdrafted_by">%s</span> · '
+                'review status: <span data-field="%sreview_status">%s</span></p>'
+                % (k, esc(f[k + 'drafted_by']), k, esc(f[k + 'review_status'])))
     out = ['  <section id="description">', '    <h2>Description</h2>',
            '    <p><strong>%s</strong> '
-           'It says what is visible and audible; it does not interpret the work.</p>' % label,
-           '    ' + p('descriptions.review_status')]
+           'It says what is visible and audible; it does not interpret the work.</p>' % label]
     if 'descriptions.image.value' in f:
-        out += ['    <h3>Image</h3>', '    ' + p('descriptions.image.value'), '    ' + p('descriptions.image.detailed'),
+        out += ['    <h3>Image</h3>', status('image'),
+                '    ' + p('descriptions.image.value'), '    ' + p('descriptions.image.detailed'),
                 '    <h3>Visible text in the image</h3>', '    ' + p('descriptions.image.visible_text')]
     if 'descriptions.video.value' in f:
-        out += ['    <h3>Video</h3>', '    ' + p('descriptions.video.value')]
+        out += ['    <h3>Video</h3>', status('video'), '    ' + p('descriptions.video.value')]
         n = len(vd['transcripts'])
         for i, t in enumerate(vd['transcripts']):
             k = 'descriptions.video.transcripts.%d.' % i
@@ -350,6 +361,10 @@ def description_section(rec):
             out += ['    </ol>',
                     '    <p><strong>On-screen text:</strong> <span data-field="%svisible_text">%s</span></p>' % (k, esc(t['visible_text'])),
                     '    <p><strong>Audio:</strong> <span data-field="%saudio">%s</span></p>' % (k, esc(t['audio']))]
+    if 'descriptions.video.intent_note' in f:
+        out.append('    <p><strong>Intent (not part of the description):</strong> '
+                   '<span data-field="descriptions.video.intent_note">%s</span>.</p>'
+                   % esc(f['descriptions.video.intent_note']))
     out += ['    <p class="tcf-reading__row-meta"><strong>Method:</strong> <span data-field="descriptions.method">%s</span></p>'
             % esc(f['descriptions.method']), '  </section>']
     return '\n'.join(out)
```

---

## Rev 3b (ch117 audio, Tuzi) diff

```diff
diff --git a/docs/data/chamber-records.json b/docs/data/chamber-records.json
index c5f6a37..efb816a 100644
--- a/docs/data/chamber-records.json
+++ b/docs/data/chamber-records.json
@@ -4948,7 +4948,7 @@
       {
        "part": "ch117",
        "duration": "0:10",
-       "audio": "Audio track present (stereo). Not listened to by the drafting AI; it is quiet (mean level about −38 dB) and continuous; the spectrogram shows steady horizontal bands, as sustained tones make, which become more numerous toward the end. What makes the sound is not known.",
+       "audio": "Audio track present (stereo). Measured: it is quiet (mean level about −38 dB) and continuous; the spectrogram shows steady horizontal bands, as sustained tones make, which become more numerous toward the end. Music, no voice (listened to by Tuzi).",
        "visible_text": "No visible text.",
        "segments": [
         {
```
