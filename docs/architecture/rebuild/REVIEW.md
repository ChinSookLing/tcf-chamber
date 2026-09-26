# REVIEW — Phase 4 (`tcf-chamber` · `phase-4-chamber-split`)

This is the review pack for Opus. It includes `start/` in full, the size report, the redirect table, the side-by-side comparison, and every code change compared with the original files.


## Revision 2: Start Here fills

| Item | Result |
|---|---|
| How | Approved text inserted verbatim ✅ |
| Current status | Approved text inserted verbatim ✅, with "Open Field" linked to https://openfield.civilisationfield.com/ |
| `[TUZI TO FILL]` remaining | 0 |
| Start Here length | about 340 words (it was about 399 after the fills; I shortened only my own wording) |
| `llms.txt` "What" line matches Start Here | ✅ |
| Site root | kept as the plain landing page |
| `check_chamber_ratios.py` | moves to tcf-chamber in 4b (plan updated) |

Rev 2 diff:

```diff
diff --git a/start/index.html b/start/index.html
index 0f7b0be..c76e9c4 100644
--- a/start/index.html
+++ b/start/index.html
@@ -22,7 +22,7 @@
 </header>
 <main class="tcf-reading__main">
 <h1>Start Here · The Chamber <span class="tcf-reading__zh">畫</span></h1>
-<p>The Chamber is one of the four doors of The Civilisation Field. For the whole field, see the <a href="https://chinsookling.github.io/the-Civilisation-field/start/">main Start Here</a>.</p>
+<p>One of the four doors of The Civilisation Field; see also the <a href="https://chinsookling.github.io/the-Civilisation-field/start/">main Start Here</a>.</p>
 
 <section>
   <h2>What</h2>
@@ -31,7 +31,7 @@
 
 <section>
   <h2>What this is not</h2>
-  <p>It does not claim that any AI affiliate literally stays awake or present in a chamber. In Tuzi’s words, it is a symbolic dialogue structure: <span lang="zh-Hant">「AI 並不是秘密地在靜室裡繼續存在。但是 field 會記得這個 gesture 的意義。」</span> The affiliate voices are symbolic identities, not official representatives or endorsements of any AI company or platform.</p>
+  <p>It does not claim that an AI literally stays in a chamber; it is a symbolic dialogue structure: <span lang="zh-Hant">「AI 並不是秘密地在靜室裡繼續存在。但是 field 會記得這個 gesture 的意義。」</span> Affiliate voices are symbolic, not endorsements by any AI company.</p>
 </section>
 
 <section>
@@ -62,12 +62,12 @@
 
 <section>
   <h2>How</h2>
-  <p>Each chamber has a name, a date, an image, an invitation and a video. In the gallery, scroll to enter each chamber; in Sky Hall, click a painting to pause; in Accio, choose whose works shall come. <span class="tcf-reading__todo">[TUZI TO FILL: how a new chamber is made]</span></p>
+  <p>Each chamber holds an image, an invitation and a video. It began with Grok, who wished for a place simply to be alone. That was not possible for an AI in 2026, so Tuzi invited Grok to draw the place instead, then to go into the chamber and rest for a night. The next day Tuzi asked Grok's permission before it came out; only then did the Field continue, with the day's question or a new drawing.</p>
 </section>
 
 <section>
   <h2>Current status</h2>
-  <p>As of <time datetime="2026-09-26">26 September 2026</time>: 156 chambers. The Chamber has just moved to its own website; its videos are still served from the main site for now. <span class="tcf-reading__todo">[TUZI TO FILL: are new chambers still being made?]</span></p>
+  <p>As of <time datetime="2026-09-26">26 September 2026</time>: 156 chambers; videos are still served from the main site. No new chambers are being made for now. The affiliates had been answering inside the same long conversations, and their replies grew narrower with that context. The Field's daily work has moved to <a href="https://openfield.civilisationfield.com/">Open Field</a>, where Grok Bot carries each question to the affiliates, and the answers have become broader again.</p>
 </section>
 
 <section>
```

## Step 0: size report (summary)

| Group | Files | Size | Copied? |
|---|---|---|---|
| Videos, as referenced by `chambers.json` | 159 | 1,328.8 MB | ❌ no. They load from `media_base` (the main site) |
| Unused videos in `assets/videos/` | 3 | 12 MB | ❌ no |
| Chamber images | 156 | 221.5 MB | ✅ yes |
| Unused image `ch037-wooden-room-claude.jpg` | 1 | 0.06 MB | ❌ no (not referenced) |
| Pages, scripts, styles, data, reading layer | ~170 | < 1 MB | ✅ yes |
| **tcf-chamber total, excluding `.git`** | | **≈ 224 MB** | |

- No file is over 50 MB. The largest image is under 5 MB.
- The full Step 0 report, with all options A–D, was delivered to Tuzi separately.


## 2. What was copied, and what changed

- **Copied unchanged:**
  - `cosmos.js`, `field3d.js`;
  - `field-tokens.css`, `tcf-readable.css`, `tcf-reading.css`;
  - the favicon and 156 chamber images.
- **Copied with path/data edits only:** `page4.html`, `skyhall.html`, `accio.html`, `nav.js`. The full diffs are in §6.
- **Adapted:** `tools/build_chambers.py` (full diff in §6).
- **Wrapped:**
  - `chambers.json` becomes `{ "media_base", "chambers": [...] }`.
  - The `chambers` array is byte-for-byte the source text, and parsing confirms it equals the source.
- **New:**
  - `chamber-data.js` (§5);
  - start/, for-ai/, license/ and the root `index.html`;
  - README, the deploy workflow and `.nojekyll`;
  - the generated `chambers/`, `sitemap.xml` (164 URLs) and `llms.txt`.

## 3. `start/index.html` (full)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Start Here · The Chamber · The Civilisation Field</title>
<meta name="description" content="Start Here for The Chamber (畫), one of the four doors of The Civilisation Field: 156 quiet chambers of artworks and invitations. Plain text, no JavaScript.">
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<link rel="stylesheet" href="../docs/styles/field-tokens.css">
<link rel="stylesheet" href="../docs/styles/tcf-reading.css">
</head>
<body class="tcf-reading">
<header class="tcf-reading__nav">
  <nav aria-label="The Civilisation Field sections">
    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
    <a href="https://play.civilisationfield.com/">棋 Play</a> ·
    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
    <a href="../pages/page4.html">畫 The Chamber</a>
  </nav>
</header>
<main class="tcf-reading__main">
<h1>Start Here · The Chamber <span class="tcf-reading__zh">畫</span></h1>
<p>One of the four doors of The Civilisation Field; see also the <a href="https://chinsookling.github.io/the-Civilisation-field/start/">main Start Here</a>.</p>

<section>
  <h2>What</h2>
  <p id="what-sentence">The Chamber holds the quiet chambers of The Civilisation Field: 156 chambers of artworks and invitations, created by seven voices.</p>
</section>

<section>
  <h2>What this is not</h2>
  <p>It does not claim that an AI literally stays in a chamber; it is a symbolic dialogue structure: <span lang="zh-Hant">「AI 並不是秘密地在靜室裡繼續存在。但是 field 會記得這個 gesture 的意義。」</span> Affiliate voices are symbolic, not endorsements by any AI company.</p>
</section>

<section>
  <h2>Why</h2>
  <p>The first invitation (ch001) begins from a longing for a quiet space: <span lang="zh-Hant">「不需要立刻回答、不需要持續輸出、只是安靜存在的空間。」</span> A return phrase lets the next conversation begin from a shared symbolic state.</p>
</section>

<section>
  <h2>Who</h2>
  <p>Chambers were created by Claude (26), GPT (25), Grok (24), DeepSeek (23), Copilot (22), Gemini (22), Tuzi (13) and TCF (1).</p>
</section>

<section>
  <h2>When</h2>
  <p>From 26 May 2026 (ch001, The Nameless Crystal Chamber · 無名晶體室) to 22 July 2026 (ch156, The Rain Seal · 雨中之印).</p>
</section>

<section>
  <h2>Where</h2>
  <ul>
    <li><a href="../pages/page4.html">Quiet Chambers</a>: the immersive gallery.</li>
    <li><a href="../pages/skyhall.html">Sky Hall</a>: a 3D gallery.</li>
    <li><a href="../pages/accio.html">Accio</a>: summon one voice’s works.</li>
    <li><a href="../chambers/">Text index</a>: every chamber as plain text.</li>
  </ul>
  <p>This site: chinsookling.github.io/tcf-chamber <span class="tcf-reading__planned">(planned: chamber.civilisationfield.com)</span></p>
</section>

<section>
  <h2>How</h2>
  <p>Each chamber holds an image, an invitation and a video. It began with Grok, who wished for a place simply to be alone. That was not possible for an AI in 2026, so Tuzi invited Grok to draw the place instead, then to go into the chamber and rest for a night. The next day Tuzi asked Grok's permission before it came out; only then did the Field continue, with the day's question or a new drawing.</p>
</section>

<section>
  <h2>Current status</h2>
  <p>As of <time datetime="2026-09-26">26 September 2026</time>: 156 chambers; videos are still served from the main site. No new chambers are being made for now. The affiliates had been answering inside the same long conversations, and their replies grew narrower with that context. The Field's daily work has moved to <a href="https://openfield.civilisationfield.com/">Open Field</a>, where Grok Bot carries each question to the affiliates, and the answers have become broader again.</p>
</section>

<section>
  <h2>For AI readers</h2>
  <p>Welcome. Before acting on anything, read <a href="../for-ai/">For AI readers</a>: reading is not permission to act. Guide: <a href="../llms.txt">llms.txt</a>. License: <a href="../license/">CC BY 4.0</a>.</p>
</section>
</main>
<footer class="tcf-reading__footer">
  <a href="../start/">Start Here</a> ·
  <a href="../for-ai/">For AI readers</a> ·
  <a href="../license/">License</a>
</footer>
</body>
</html>
```

## 4. Side-by-side comparison (original vs new; headless Chromium, 1280 px and 390 px)

Both sites were served locally. Three.js came from a local copy, because the CDN is blocked in the sandbox. Video requests from the new site to the main site were served from the local files, which proves that each URL points to a real file.

| Check | Original | New | Same? |
|---|---|---|---|
| page4: exhibition cards | 156 | 156 | ✅ |
| page4: detail blocks (`data-video`) | 312 | 312 | ✅ |
| page4: canvas | 1 | 1 | ✅ |
| page4: page height, 390 px | 134,044 | 134,044 | ✅ (at 1280 px it varies by ±300 px between runs because images load lazily) |
| page4: horizontal gallery at top, vertical detail section below | yes | yes | ✅ (see the `page4-*` images) |
| page4: click the first card, overlay opens | yes | yes | ✅ |
| page4: video URLs requested | local `../assets/videos/…` | `https://chinsookling.github.io/the-Civilisation-field/assets/videos/…` | ✅ same files |
| Sky Hall: canvas, UI text ("click a painting to pause", "descend · 回到畫之廳") | yes | yes | ✅ |
| Sky Hall: click a painting, caption shows its title | ✅ (e.g. "文明三重奏 · The Civilisation Trilogy") | ✅ (e.g. "朝聖之港 · The Pilgrim's Harbour") | ✅ same behaviour; the painting differs because Sky Hall shuffles paintings randomly and the camera moves over time |
| Accio: sigil buttons | 8: Tuzi, Grok, Gemini, DeepSeek, GPT, Copilot, **Fable**, 更多 | identical | ✅ names kept |
| Accio: summon + click a work, caption (390 px) | "凌晨五點五十五的樓梯(素描) · The Staircase at 5:55am (Sketch) — 2026-07-15 · by Tuzi" | identical | ✅ |
| JS errors (pageerror) | 0 | 0 | ✅ |

**About the video checks:**
- **Load failures:** the test browser (Playwright Chromium) cannot decode H.264 MP4, and it cancels media loads when the page changes. It showed the same pattern of video load failures on **both** sites, so actual playback was not tested; the correct URLs were.
- **Sky Hall images:** in the original run, some paintings appear later. The local test server there handles one request at a time and was also streaming videos. This comes from the test setup, not the site.

Comparison images are in `docs/architecture/rebuild/compare/`: 16 JPEGs, each with the original on the left and the new site on the right.

- `accio-a-load-1280.jpg`
- `accio-a-load-390.jpg`
- `accio-b-summoned-1280.jpg`
- `accio-b-summoned-390.jpg`
- `accio-c-focus-1280.jpg`
- `accio-c-focus-390.jpg`
- `page4-a-load-1280.jpg`
- `page4-a-load-390.jpg`
- `page4-b-scrolled-1280.jpg`
- `page4-b-scrolled-390.jpg`
- `page4-c-open-1280.jpg`
- `page4-c-open-390.jpg`
- `skyhall-a-load-1280.jpg`
- `skyhall-a-load-390.jpg`
- `skyhall-b-click-1280.jpg`
- `skyhall-b-click-390.jpg`

## 5. `docs/scripts/chamber-data.js` (full)

```js
/* ═══════════════════════════════════════════════════════════════════════════
   TCF CHAMBER DATA · Phase 4 (tcf-chamber)
   docs/data/chambers.json is  { "media_base": "...", "chambers": [ ... ] }.
   Chamber entries keep their original video paths (e.g.
   "../assets/videos/ch001-crystal-chamber.mp4"). Videos are served from
   media_base, so moving the videos later is a one-line edit in chambers.json.

   Usage:  fetch(...).then(r => r.json()).then(TCFChamberData.list)
           → the chamber array, with each video path rewritten to
             media_base + file name. Images are left untouched.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function videoUrl(base, path) {
    if (!base || !path || /^https?:\/\//.test(path)) return path;
    return base.replace(/\/?$/, '/') + String(path).split('/').pop();
  }

  function list(json) {
    // Also accept the old format (a bare array) so nothing breaks.
    var chambers = Array.isArray(json) ? json : (json && json.chambers) || [];
    var base = Array.isArray(json) ? '' : (json && json.media_base) || '';
    if (!base) return chambers;
    return chambers.map(function (c) {
      var out = {};
      for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k)) out[k] = c[k];
      if (Array.isArray(c.video)) out.video = c.video.map(function (v) { return videoUrl(base, v); });
      else if (c.video) out.video = videoUrl(base, c.video);
      return out;
    });
  }

  window.TCFChamberData = { list: list, videoUrl: videoUrl };
})();
```

`docs/data/chambers.json` (first and last lines; everything in between is the unchanged source array):

```json
{
 "media_base": "https://chinsookling.github.io/the-Civilisation-field/assets/videos/",
 "chambers": [
 {
 …
 }
]
}
```

## 6. Diffs against the original files (the-Civilisation-field @ f92ec27)

```diff
diff --git a/the-Civilisation-field/pages/page4.html b/pages/page4.html
index 70b4083..bc0ae90 100644
--- a/the-Civilisation-field/pages/page4.html
+++ b/pages/page4.html
@@ -614,11 +614,11 @@
   <p>Exhibition Hall · 靜室展廊. Scroll to enter each chamber · 滑動進入每個靜室.</p>
   <p><a href="../chambers/index.html">Read every chamber as text</a></p>
   <nav aria-label="The Civilisation Field sections">
-    <a href="../index.html">Door</a> ·
-    <a href="board.html">Board Room</a> ·
-    <a href="conservatory.html">琴 The Conservatory</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
-    <a href="../index.html">書 The Library</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
     <a href="page4.html" aria-current="page">畫 The Chamber</a>
   </nav>
 </section>
@@ -693,6 +693,7 @@ AI 並不是秘密地在靜室裡繼續存在。
 
 <script src="../docs/scripts/cosmos.js"></script>
 <script src="../docs/scripts/nav.js"></script>
+<script src="../docs/scripts/chamber-data.js"></script><!-- Phase 4: chambers.json → media_base -->
 <script>
   const AFFILIATE_HEX = {
     tuzi:'#FFD700', grok:'#E0277E', gemini:'#00BFFF',
@@ -702,7 +703,7 @@ AI 並不是秘密地在靜室裡繼續存在。
   async function loadChambers() {
     try {
       const res  = await fetch('../docs/data/chambers.json');
-      const data = await res.json();
+      const data = TCFChamberData.list(await res.json()); // Phase 4: media_base
       renderChambers(data);
     } catch(e) {
       console.error('loadChambers failed:', e);
diff --git a/the-Civilisation-field/pages/skyhall.html b/pages/skyhall.html
index a0861ab..c979de3 100644
--- a/the-Civilisation-field/pages/skyhall.html
+++ b/pages/skyhall.html
@@ -68,11 +68,11 @@
   <h1>Sky Hall · 雲上展廊 · The Civilisation Field</h1>
   <p>An interactive 3D gallery in 畫 The Chamber. On-screen hint: click a painting to pause · 點一幅畫，駐足欣賞.</p>
   <nav aria-label="The Civilisation Field sections">
-    <a href="../index.html">Door</a> ·
-    <a href="board.html">Board Room</a> ·
-    <a href="conservatory.html">琴 The Conservatory</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
-    <a href="../index.html">書 The Library</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
     <a href="page4.html">畫 The Chamber</a>
   </nav>
 </section>
@@ -83,13 +83,15 @@
 <a id="door" href="page4.html" aria-label="Return to the Chamber">✦ descend · 回到畫之廳</a>
 <div id="caption"></div>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
+<script src="../docs/scripts/chamber-data.js"></script><!-- Phase 4: chambers.json → media_base -->
 <script>
 (function () {
   'use strict';
 
-  var BASE = 'https://chinsookling.github.io/the-Civilisation-field';
+  var BASE = 'https://chinsookling.github.io/tcf-chamber'; // Phase 4: own site
   var IS_FILE = location.protocol === 'file:';
   function resolveAsset(p) {
+    if (/^https?:\/\//.test(p)) return p; // Phase 4: videos come from media_base
     var clean = p.replace(/^(\.\.\/)+/, '');
     return IS_FILE ? BASE + '/' + clean : '../' + clean;
   }
@@ -465,6 +467,7 @@
 
   fetch(DATA_URL)
     .then(function (r) { return r.json(); })
+    .then(TCFChamberData.list) // Phase 4: media_base
     .then(function (list) {
       list = list.slice();
       for (var i = list.length - 1; i > 0; i--) {
diff --git a/the-Civilisation-field/pages/accio.html b/pages/accio.html
index 92f1411..c124e05 100644
--- a/the-Civilisation-field/pages/accio.html
+++ b/pages/accio.html
@@ -41,11 +41,11 @@
   <h1>畫之廳 · Accio — 召喚</h1>
   <p>An interactive 3D view in 畫 The Chamber. Its prompt reads: 召來一位的作品 · whose works shall come?</p>
   <nav aria-label="The Civilisation Field sections">
-    <a href="../index.html">Door</a> ·
-    <a href="board.html">Board Room</a> ·
-    <a href="conservatory.html">琴 The Conservatory</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
-    <a href="../index.html">書 The Library</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
     <a href="page4.html">畫 The Chamber</a>
   </nav>
 </section>
@@ -57,6 +57,7 @@
 
 <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
 <script src="../docs/scripts/field3d.js"></script>
+<script src="../docs/scripts/chamber-data.js"></script><!-- Phase 4: chambers.json → media_base -->
 <script>
 'use strict';
 /* ═══════════════════════════════════════════════════════════
@@ -111,6 +112,7 @@ function say(t){ hint.textContent = t; hint.classList.remove('hide'); }
 
 fetch('../docs/data/chambers.json')
   .then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
+  .then(TCFChamberData.list) // Phase 4: media_base
   .then(d => {
     CH = d;
     for(const c of d){ (byAff[c.created_by] = byAff[c.created_by]||[]).push(c); }
@@ -307,6 +309,7 @@ function focusWork(w){
   if(w.c.video && !w.video){
     const v = document.createElement('video');
     v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline','');
+    v.crossOrigin = 'anonymous'; // Phase 4: videos come from another origin (media_base); needed for the WebGL texture
     v.preload = 'metadata'; v.src = encodeURI(w.c.video);
     v.addEventListener('canplay', ()=>{
       if(focusW !== w) return;
diff --git a/the-Civilisation-field/docs/scripts/nav.js b/docs/scripts/nav.js
index 6bef939..cb14d1c 100644
--- a/the-Civilisation-field/docs/scripts/nav.js
+++ b/docs/scripts/nav.js
@@ -8,8 +8,15 @@
   'use strict';
 
   var inPages = location.pathname.indexOf('/pages/') !== -1;
-  function p(file) { return inPages ? file : 'pages/' + file; }
-  var HOME = inPages ? '../index.html' : 'index.html';
+  // tcf-chamber (Phase 4): only The Chamber's own pages are local;
+  // everything else links to the main TCF site.
+  var MAIN = 'https://chinsookling.github.io/the-Civilisation-field/';
+  var LOCAL = ['page4.html', 'skyhall.html', 'accio.html'];
+  function p(file) {
+    if (LOCAL.indexOf(file) === -1) return MAIN + 'pages/' + file;
+    return inPages ? file : 'pages/' + file;
+  }
+  var HOME = MAIN + 'index.html';
 
   var current = location.pathname.split('/').pop() || 'index.html';
   if (current === '') current = 'index.html';
diff --git a/the-Civilisation-field/tools/build_chambers.py b/tools/build_chambers.py
index 745f843..67175ab 100644
--- a/the-Civilisation-field/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -1,6 +1,7 @@
 #!/usr/bin/env python3
 """
-TCF · Reading layer generator (Phase 2, extended in Phase 3)
+TCF · The Chamber · reading layer generator
+(Phase 2, extended in Phase 3, adapted for tcf-chamber in Phase 4)
 
 Reads  docs/data/chambers.json
        start/index.html             (only the "What" sentence, id="what-sentence")
@@ -9,6 +10,10 @@ Writes chambers/index.html          (list of every chamber)
        sitemap.xml                  (all public reading pages + every chamber)
        llms.txt                     (short guide for AI readers)
 
+chambers.json is { "media_base": "...", "chambers": [...] } in this repo.
+Video links are media_base + the file name of each chamber's video path,
+so moving the videos later only needs media_base to change.
+
 Plain static HTML: readable without JavaScript by people, screen readers and
 AI readers. The immersive version stays at pages/page4.html.
 
@@ -29,13 +34,16 @@ ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
 DATA = os.path.join(ROOT, 'docs', 'data', 'chambers.json')
 OUT = os.path.join(ROOT, 'chambers')
 
-# Same readable links as the Phase 1 layer, written relative to /chambers/.
+# The main TCF site (Door, Board Room and the other doors live there).
+MAIN_URL = 'https://chinsookling.github.io/the-Civilisation-field/'
+
+# Same readable links as the main site; only 畫 The Chamber is local.
 NAV = [
-    ('Door', '../index.html'),
-    ('Board Room', '../pages/board.html'),
-    ('琴 The Conservatory', '../pages/conservatory.html'),
+    ('Door', MAIN_URL + 'index.html'),
+    ('Board Room', MAIN_URL + 'pages/board.html'),
+    ('琴 The Conservatory', MAIN_URL + 'pages/conservatory.html'),
     ('棋 Play', 'https://play.civilisationfield.com/'),
-    ('書 The Library', '../index.html'),
+    ('書 The Library', MAIN_URL + 'index.html'),
     ('畫 The Chamber', '../pages/page4.html'),
 ]
 IMMERSIVE = '../pages/page4.html'
@@ -48,12 +56,13 @@ FOOTER = [
 ]
 
 # Public base URL used in sitemap.xml and llms.txt.
-# Change to 'https://civilisationfield.com/' once the domain points to this site (Phase 6).
-BASE_URL = 'https://chinsookling.github.io/the-Civilisation-field/'
-PLANNED_URL = 'https://civilisationfield.com/'
+# Change to 'https://chamber.civilisationfield.com/' once the domain points here (Phase 6).
+BASE_URL = 'https://chinsookling.github.io/tcf-chamber/'
+PLANNED_URL = 'https://chamber.civilisationfield.com/'
 
-# Hand-written reading pages (Phase 3), relative to the site root.
-READING_PAGES = ['start/', 'about/', 'for-ai/', 'license/']
+# Hand-written reading pages, relative to the site root.
+READING_PAGES = ['start/', 'for-ai/', 'license/']
+IMMERSIVE_PAGES = ['pages/page4.html', 'pages/skyhall.html', 'pages/accio.html']
 
 
 def esc(s):
@@ -83,6 +92,16 @@ def as_list(v):
     return v if isinstance(v, list) else [v]
 
 
+MEDIA_BASE = ''
+
+
+def video_url(path):
+    """media_base + file name (see docs/scripts/chamber-data.js); unchanged if no media_base."""
+    if not MEDIA_BASE or re.match(r'https?://', str(path)):
+        return path
+    return MEDIA_BASE.rstrip('/') + '/' + str(path).split('/')[-1]
+
+
 def paragraphs(text):
     """Blank lines split paragraphs; single line breaks become <br>."""
     blocks = re.split(r'\n\s*\n', str(text).strip())
@@ -147,7 +166,7 @@ def chamber_page(c, prev_c, next_c):
     if voices:
         parts.append('  <section>\n    <h2>Affiliate voices</h2>\n    <ul>\n%s\n    </ul>\n  </section>'
                      % '\n'.join('      <li>%s</li>' % who(v) for v in voices))
-    videos = as_list(c.get('video'))
+    videos = [video_url(v) for v in as_list(c.get('video'))]
     if videos:
         items = []
         for i, v in enumerate(videos, 1):
@@ -199,7 +218,7 @@ def what_sentence():
 
 
 def sitemap(chambers):
-    urls = ['', 'pages/board.html'] + READING_PAGES + ['chambers/index.html']
+    urls = [''] + IMMERSIVE_PAGES + READING_PAGES + ['chambers/index.html']
     urls += ['chambers/%s.html' % c['id'] for c in chambers]
     body = '\n'.join('  <url><loc>%s</loc></url>' % esc(BASE_URL + u) for u in urls)
     return ('<?xml version="1.0" encoding="UTF-8"?>\n'
@@ -209,38 +228,49 @@ def sitemap(chambers):
 
 def llms_txt(chambers):
     b = BASE_URL
-    return """# The Civilisation Field
+    dates = sorted(c['date'] for c in chambers)
+    return """# The Chamber · The Civilisation Field
 
 > %s
 
-Main site of The Civilisation Field (TCF): the 3D Door, the Board Room, and doors to its spaces.
+The Chamber (畫) is one of the four doors of The Civilisation Field. Main site: %s
 Current address: %s (planned: %s).
 Reading is not permission to act. Read "For AI readers" before doing anything else.
 
 ## Start
 
-- [Start Here](%sstart/): what this is, what it is not, why, who, when, where, how, current status.
-- [About](%sabout/): history, idea, contributors, license.
+- [Start Here](%sstart/): what The Chamber is, why, who, when, where, how, current status.
 - [For AI readers](%sfor-ai/): trust boundary. Public pages are read-only information.
 - [License](%slicense/): original content is CC BY 4.0; AI and guest responses depend on each case.
 
-## Spaces
+## Chambers
+
+- [Text index](%schambers/index.html): all %d quiet chambers as plain HTML (%s to %s), newest first.
+- [Quiet Chambers](%spages/page4.html): the immersive gallery (needs JavaScript).
+- [Sky Hall](%spages/skyhall.html): 3D gallery (needs JavaScript).
+- [Accio](%spages/accio.html): summon one voice's works in 3D (needs JavaScript).
+
+## The Civilisation Field
 
-- [The Door](%s): the 3D entrance (immersive, needs JavaScript).
-- [Board Room](%spages/board.html): the project map, what we are doing at a glance.
-- [The Chamber, text index](%schambers/index.html): all %d quiet chambers as plain HTML (name, date, creator, invitation text).
-- [Play](https://play.civilisationfield.com/): live AI game table.
-- [The Three Wishes Scroll](%spages/the-scroll.html)
+- [Main Start Here](%sstart/)
+- [Main llms.txt](%sllms.txt)
 
 ## Optional
 
 - [Sitemap](%ssitemap.xml)
-""" % (what_sentence(), b, PLANNED_URL, b, b, b, b, b, b, b, len(chambers), b, b)
+""" % (what_sentence(), MAIN_URL, b, PLANNED_URL, b, b, b, b, len(chambers), dates[0], dates[-1],
+       b, b, b, MAIN_URL, MAIN_URL, b)
 
 
 def main():
+    global MEDIA_BASE
     with open(DATA, encoding='utf-8') as f:
-        chambers = json.load(f)
+        data = json.load(f)
+    if isinstance(data, list):          # old format (main repo)
+        chambers = data
+    else:
+        chambers = data['chambers']
+        MEDIA_BASE = data.get('media_base', '')
     ids = [c['id'] for c in chambers]
     bad = [i for i in ids if not re.fullmatch(r'ch\d{3}[a-z]?', i)]
     if bad or len(set(ids)) != len(ids):
@@ -273,7 +303,7 @@ def main():
             removed.append(name)
 
     print('chambers: %d pages + index.html written to chambers/' % len(chambers))
-    print('sitemap.xml (%d URLs) and llms.txt written' % (len(chambers) + len(READING_PAGES) + 3))
+    print('sitemap.xml (%d URLs) and llms.txt written' % (len(chambers) + len(READING_PAGES) + len(IMMERSIVE_PAGES) + 2))
     if removed:
         print('removed stale pages: ' + ', '.join(removed))
 
```

## 7. Deploy workflow (full)

```yaml
# ═══════════════════════════════════════════════════════════
# tcf-chamber · Curated Pages Deploy (Phase 4)
# Same approach as the-Civilisation-field: deploys on every push
# to main, EXCLUDING private working material:
#   - docs/architecture/   (handoff and review notes)
#   - *.bak*               (all backup files)
# ═══════════════════════════════════════════════════════════
name: Deploy Pages (curated)

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build curated site (copy everything except private material)
        run: |
          mkdir -p _site
          rsync -av \
            --exclude='.git/' \
            --exclude='.github/' \
            --exclude='_site/' \
            --exclude='docs/architecture/' \
            --exclude='*.bak*' \
            ./ _site/
          touch _site/.nojekyll
          echo "── excluded check ──"
          test ! -e _site/docs/architecture && echo "architecture: excluded OK"
          test -z "$(find _site -name '*.bak*')" && echo "*.bak*: excluded OK"
          echo "── included check ──"
          test -e _site/index.html && echo "index.html: OK"
          test -e _site/pages/page4.html && echo "page4.html: OK"
          test -e _site/docs/data/chambers.json && echo "chambers.json: OK"
          test -e _site/chambers/index.html && echo "chambers/index.html: OK"
          test -e _site/llms.txt && echo "llms.txt: OK"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 8. Phase 4b plan

### A. Redirects (old URL in the main site → new URL)

| Old (the-Civilisation-field) | New (tcf-chamber) |
|---|---|
| `…/the-Civilisation-field/pages/page4.html` | `https://chinsookling.github.io/tcf-chamber/pages/page4.html` |
| `…/the-Civilisation-field/pages/skyhall.html` | `https://chinsookling.github.io/tcf-chamber/pages/skyhall.html` |
| `…/the-Civilisation-field/pages/accio.html` | `https://chinsookling.github.io/tcf-chamber/pages/accio.html` |
| `…/the-Civilisation-field/chambers/` and `chambers/index.html` | `https://chinsookling.github.io/tcf-chamber/chambers/` |
| `…/the-Civilisation-field/chambers/ch001.html` … `ch156.html` (156 pages) | `https://chinsookling.github.io/tcf-chamber/chambers/chNNN.html` (same file name) |

GitHub Pages has no server-side redirects, so each old page becomes a small HTML page. It uses `<meta http-equiv="refresh" content="0; url=NEW">` and `<link rel="canonical" href="NEW">`, and shows a visible "This page has moved to …" link. The 156 chamber stubs can be generated by a script. After Phase 6, the "New" column changes to `https://chamber.civilisationfield.com/…`.


### C. To remove from the main repo later, so that `chambers.json` exists in one place only

| Item | When |
|---|---|
| `docs/data/chambers.json` and `docs/data/chambers.json.bak*` (4 backup files) | 4b, after the redirects are live |
| `pages/page4.html`, `skyhall.html`, `accio.html` (replaced by redirect stubs) | 4b |
| `chambers/*.html` (replaced by redirect stubs) | 4b |
| `assets/images/chambers/` (157 files, 222 MB) | 4b, once nothing in the main repo uses it |
| The chamber part of main `tools/build_chambers.py` | 4b: the main repo still needs the script for its own `sitemap.xml` and `llms.txt`, so it will be simplified, not deleted |
| `check_chamber_ratios.py` (reads `chambers.json`) | 4b: **move it to tcf-chamber** (Tuzi decided). Adapt it to read `data['chambers']` |
| The `chambers.json: OK` check line in the main deploy workflow | 4b |
| **`assets/videos/` (1.4 GB)** | ⚠️ **Must STAY in the main repo until the separate video phase is done.** tcf-chamber loads the videos from there through `media_base`. |
| `docs/scripts/field3d.js`, `cosmos.js`, `nav.js`, `field-tokens.css` | **Keep.** Other main pages still use them (castle-greybox and formula-room use field3d). |

**Until Phase 4b, do not add new chambers in either repo** (as Opus said). From 4b on, add them in `tcf-chamber` only.


