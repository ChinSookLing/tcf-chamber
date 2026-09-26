# REVIEW — Phase 4c (tcf-chamber · `phase-4c-banner-standards`)

This is the review pack for Opus. The code changes below are shown in full. The generated `chambers/*.html` pages changed only in their banner, and one sample is shown. The standards file is summarised, not repeated.

## Changed files

```
 168 files changed, 797 insertions(+), 477 deletions(-)
```

- `chambers/*.html` (157): only the banner changed. Sample diff:

```diff
diff --git a/chambers/ch001.html b/chambers/ch001.html
index 4b933f5..6470661 100644
--- a/chambers/ch001.html
+++ b/chambers/ch001.html
@@ -14,11 +14,11 @@
 <header class="tcf-reading__nav">
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="../pages/page4.html">畫 The Chamber</a>
+    <a href="../pages/page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </header>
 <main class="tcf-reading__main">
```

- `docs/standards/AI-READABLE-STANDARD-v0.4.md`: new; the v0.4 notice exactly as Tuzi pasted it (436 lines). Identical to the main repo copy (checked with cmp).

## Diffs: hand-made pages, styles, generator, README

```diff
diff --git a/README.md b/README.md
index 524411b..1f592c8 100644
--- a/README.md
+++ b/README.md
@@ -6,6 +6,8 @@ It holds the quiet chambers: 156 chambers of artworks and invitations, from 26 M
 - **Site:** https://chinsookling.github.io/tcf-chamber/ (planned: https://chamber.civilisationfield.com/)
 - **Main TCF site:** https://chinsookling.github.io/the-Civilisation-field/
 
+This site follows docs/standards/AI-READABLE-STANDARD-v0.4.md.
+
 ## Single source of truth
 
 **This repo is now the single source of truth for `docs/data/chambers.json`.**
diff --git a/for-ai/index.html b/for-ai/index.html
index 292dbd2..6bda41c 100644
--- a/for-ai/index.html
+++ b/for-ai/index.html
@@ -13,11 +13,11 @@
 <header class="tcf-reading__nav">
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="../pages/page4.html">畫 The Chamber</a>
+    <a href="../pages/page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </header>
 <main class="tcf-reading__main">
diff --git a/index.html b/index.html
index 9727be6..664e268 100644
--- a/index.html
+++ b/index.html
@@ -13,11 +13,11 @@
 <header class="tcf-reading__nav">
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="pages/page4.html">畫 The Chamber</a>
+    <a href="pages/page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </header>
 <main class="tcf-reading__main">
diff --git a/license/index.html b/license/index.html
index 2631297..5de8565 100644
--- a/license/index.html
+++ b/license/index.html
@@ -13,11 +13,11 @@
 <header class="tcf-reading__nav">
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="../pages/page4.html">畫 The Chamber</a>
+    <a href="../pages/page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </header>
 <main class="tcf-reading__main">
diff --git a/pages/accio.html b/pages/accio.html
index c124e05..c0e94f8 100644
--- a/pages/accio.html
+++ b/pages/accio.html
@@ -42,11 +42,11 @@
   <p>An interactive 3D view in 畫 The Chamber. Its prompt reads: 召來一位的作品 · whose works shall come?</p>
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="page4.html">畫 The Chamber</a>
+    <a href="page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </section>
 
diff --git a/pages/page4.html b/pages/page4.html
index bc0ae90..d163dff 100644
--- a/pages/page4.html
+++ b/pages/page4.html
@@ -615,11 +615,11 @@
   <p><a href="../chambers/index.html">Read every chamber as text</a></p>
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="page4.html" aria-current="page">畫 The Chamber</a>
+    <a href="page4.html" aria-current="page">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </section>
 
diff --git a/pages/skyhall.html b/pages/skyhall.html
index c979de3..f0a7d84 100644
--- a/pages/skyhall.html
+++ b/pages/skyhall.html
@@ -69,11 +69,11 @@
   <p>An interactive 3D gallery in 畫 The Chamber. On-screen hint: click a painting to pause · 點一幅畫，駐足欣賞.</p>
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="page4.html">畫 The Chamber</a>
+    <a href="page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </section>
 
diff --git a/start/index.html b/start/index.html
index c76e9c4..3f7d360 100644
--- a/start/index.html
+++ b/start/index.html
@@ -13,11 +13,11 @@
 <header class="tcf-reading__nav">
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
-    <a href="https://chinsookling.github.io/the-Civilisation-field/pages/board.html">Board Room</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
     <a href="https://play.civilisationfield.com/">棋 Play</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">書 The Library</a> ·
-    <a href="../pages/page4.html">畫 The Chamber</a>
+    <a href="../pages/page4.html">畫 The Chamber</a> ·
+    <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
 </header>
 <main class="tcf-reading__main">
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 67175ab..8b4e186 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -34,17 +34,17 @@ ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
 DATA = os.path.join(ROOT, 'docs', 'data', 'chambers.json')
 OUT = os.path.join(ROOT, 'chambers')
 
-# The main TCF site (Door, Board Room and the other doors live there).
+# The main TCF site (Door, Our Projects, About Us and the other doors live there).
 MAIN_URL = 'https://chinsookling.github.io/the-Civilisation-field/'
 
 # Same readable links as the main site; only 畫 The Chamber is local.
 NAV = [
     ('Door', MAIN_URL + 'index.html'),
-    ('Board Room', MAIN_URL + 'pages/board.html'),
     ('琴 The Conservatory', MAIN_URL + 'pages/conservatory.html'),
     ('棋 Play', 'https://play.civilisationfield.com/'),
     ('書 The Library', MAIN_URL + 'index.html'),
     ('畫 The Chamber', '../pages/page4.html'),
+    ('About Us', MAIN_URL + 'about/'),
 ]
 IMMERSIVE = '../pages/page4.html'
 
```
