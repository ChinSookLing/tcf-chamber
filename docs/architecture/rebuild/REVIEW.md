# REVIEW — Media switch (tcf-chamber · `media-switch`)

```
 160 files changed, 194 insertions(+), 197 deletions(-)
```

## Hand edits (full diff)

```diff
diff --git a/README.md b/README.md
index 1f592c8..88f0214 100644
--- a/README.md
+++ b/README.md
@@ -17,7 +17,7 @@ This site follows docs/standards/AI-READABLE-STANDARD-v0.4.md.
 
 1. Edit `docs/data/chambers.json`. Its format is `{ "media_base": "...", "chambers": [ ... ] }`.
 2. Put the chamber image in `assets/images/chambers/`.
-3. Put the video wherever `media_base` points. For now that is the main site's `assets/videos/`.
+3. Add the original video to the main site's `assets/videos/`, then run **Compress chamber videos** in `tcf-chamber-media`, which serves the compressed copies at `media_base`.
 4. Regenerate the text pages, sitemap and llms.txt:
 
    ```bash
@@ -27,9 +27,10 @@ This site follows docs/standards/AI-READABLE-STANDARD-v0.4.md.
 
 ## Videos
 
-Videos are not stored in this repo. The chamber pages build each video link from
-`media_base` plus the file name, so moving the videos later is a **one-line edit**
-of `media_base` in `chambers.json`.
+Videos are not stored in this repo. They are served, compressed (720p), from
+https://chinsookling.github.io/tcf-chamber-media/videos/ (repo `tcf-chamber-media`).
+The chamber pages build each video link from `media_base` plus the file name, so
+moving the videos again is a **one-line edit** of `media_base` in `chambers.json`.
 
 ## Layout
 
diff --git a/docs/data/chambers.json b/docs/data/chambers.json
index b4cd642..7564bf4 100644
--- a/docs/data/chambers.json
+++ b/docs/data/chambers.json
@@ -1,5 +1,5 @@
 {
- "media_base": "https://chinsookling.github.io/the-Civilisation-field/assets/videos/",
+ "media_base": "https://chinsookling.github.io/tcf-chamber-media/videos/",
  "chambers": [
  {
   "id": "ch001",
diff --git a/start/index.html b/start/index.html
index 3f7d360..ebc7b89 100644
--- a/start/index.html
+++ b/start/index.html
@@ -67,7 +67,7 @@
 
 <section>
   <h2>Current status</h2>
-  <p>As of <time datetime="2026-09-26">26 September 2026</time>: 156 chambers; videos are still served from the main site. No new chambers are being made for now. The affiliates had been answering inside the same long conversations, and their replies grew narrower with that context. The Field's daily work has moved to <a href="https://openfield.civilisationfield.com/">Open Field</a>, where Grok Bot carries each question to the affiliates, and the answers have become broader again.</p>
+  <p>As of <time datetime="2026-09-26">26 September 2026</time>: 156 chambers; videos are served from a separate <a href="https://chinsookling.github.io/tcf-chamber-media/">media site</a>. No new chambers are being made for now. The affiliates had been answering inside the same long conversations, and their replies grew narrower with that context. The Field's daily work has moved to <a href="https://openfield.civilisationfield.com/">Open Field</a>, where Grok Bot carries each question to the affiliates, and the answers have become broader again.</p>
 </section>
 
 <section>
```

## Generated chamber pages

Only the video link changes. Sample (`ch045`, a file name with an apostrophe):

```diff
diff --git a/chambers/ch045.html b/chambers/ch045.html
index 67cc2ce..d31436c 100644
--- a/chambers/ch045.html
+++ b/chambers/ch045.html
@@ -49,7 +49,7 @@
   <section>
     <h2>Video</h2>
     <ul>
-      <li><a href="https://chinsookling.github.io/the-Civilisation-field/assets/videos/ch045-tuzi&#x27;s-dream-chamber.mp4">Watch the video</a> (MP4)</li>
+      <li><a href="https://chinsookling.github.io/tcf-chamber-media/videos/ch045-tuzi&#x27;s-dream-chamber.mp4">Watch the video</a> (MP4)</li>
     </ul>
   </section>
 </article>
```

## Checks

| Check | Result |
|---|---|
| `chambers` array before = after | ✅ |
| Distinct video links in generated pages | 159 |
| Video files present on `tcf-chamber-media` main | 159 / 159 (0 missing, 0 extra) |
| Old `the-Civilisation-field/assets/videos` links left | 0 |
| Approved Start Here text intact; length | ✅; ~340 words |
