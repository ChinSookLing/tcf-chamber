# REVIEW — Phase 4e (tcf-chamber · `phase-4e-chamber-v04`)

```
 166 files changed, 485 insertions(+), 258 deletions(-)
```

## Rev 2: the two values filled in (Tuzi)

`AUTHOR = 'Tuzi and Affiliates'` and `FIRST_PUBLISHED = '2026-05-26'`, and the old suggestion comment is removed. The generator was re-run, and 0 files outside `docs/architecture/` contain "[TUZI TO FILL". Diff of rev 2 (generator, root page and one sample chamber page; every other page changes the same way):

```diff
diff --git a/chambers/ch001.html b/chambers/ch001.html
index 73a73d4..c12c6cd 100644
--- a/chambers/ch001.html
+++ b/chambers/ch001.html
@@ -62,7 +62,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
-  <p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
+  <p class="tcf-reading__updated">Made by Tuzi and Affiliates · First published: <time datetime="2026-05-26">2026-05-26</time> · Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
diff --git a/index.html b/index.html
index 368b4b7..e99e1bc 100644
--- a/index.html
+++ b/index.html
@@ -24,7 +24,7 @@
 <main class="tcf-reading__main">
 <h1>The Chamber <span class="tcf-reading__zh">畫</span></h1>
 <p>The Chamber (畫) is one of the four doors of <a href="https://chinsookling.github.io/the-Civilisation-field/">The Civilisation Field</a>.</p>
-<!-- tcf:who-when --><p>Made by [TUZI TO FILL: author line]. First published: [TUZI TO FILL: first published date].</p><!-- /tcf:who-when -->
+<!-- tcf:who-when --><p>Made by Tuzi and Affiliates. First published: <time datetime="2026-05-26">2026-05-26</time>.</p><!-- /tcf:who-when -->
 <ul>
   <li><a href="pages/page4.html">Enter the immersive chamber</a> (Quiet Chambers)</li>
   <li><a href="pages/skyhall.html">Sky Hall</a></li>
@@ -37,7 +37,7 @@
   <a href="start/">Start Here</a> ·
   <a href="for-ai/">For AI readers</a> ·
   <a href="license/">License</a>
-  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by Tuzi and Affiliates · First published: <time datetime="2026-05-26">2026-05-26</time> · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </footer>
 </body>
 </html>
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 03c4d42..9aad2be 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -68,9 +68,8 @@ IMMERSIVE_PAGES = ['pages/page4.html', 'pages/skyhall.html', 'pages/accio.html']
 # The generator writes them into the generated pages AND into the hand-made pages
 # (index.html, start/, for-ai/, license/, and the readable blocks of page4,
 # skyhall, accio) between <!-- tcf:site-meta --> markers. Change here, re-run.
-# AUTHOR suggestion (Tuzi to confirm): 'Tuzi (Chin Sook Ling) and the Affiliates of The Civilisation Field'
-AUTHOR = '[TUZI TO FILL: author line]'
-FIRST_PUBLISHED = '[TUZI TO FILL: first published date]'
+AUTHOR = 'Tuzi and Affiliates'
+FIRST_PUBLISHED = '2026-05-26'
 LAST_UPDATED = '2026-09-26'
 
 # Hand-made pages: file → its public path (for <link rel="canonical">, built from BASE_URL).
```

The generated `chambers/*.html` pages changed only in their `<head>` (canonical) and footer (the site-facts line). Sample:

```diff
diff --git a/chambers/ch001.html b/chambers/ch001.html
index 9bab255..73a73d4 100644
--- a/chambers/ch001.html
+++ b/chambers/ch001.html
@@ -9,6 +9,7 @@
 <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/chambers/ch001.html">
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -61,7 +62,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
-  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
+  <p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
```

## Generator (`tools/build_chambers.py`)

```diff
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index b4be2a5..03c4d42 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -64,10 +64,26 @@ PLANNED_URL = 'https://chamber.civilisationfield.com/'
 READING_PAGES = ['start/', 'for-ai/', 'license/']
 IMMERSIVE_PAGES = ['pages/page4.html', 'pages/skyhall.html', 'pages/accio.html']
 
-# "Last updated" date shown in the footer of every generated page (v0.4 item 5).
-# Change it when the chamber content or these pages change, then re-run.
+# Site facts shown on every page (v0.4 item 5), one source for all of them.
+# The generator writes them into the generated pages AND into the hand-made pages
+# (index.html, start/, for-ai/, license/, and the readable blocks of page4,
+# skyhall, accio) between <!-- tcf:site-meta --> markers. Change here, re-run.
+# AUTHOR suggestion (Tuzi to confirm): 'Tuzi (Chin Sook Ling) and the Affiliates of The Civilisation Field'
+AUTHOR = '[TUZI TO FILL: author line]'
+FIRST_PUBLISHED = '[TUZI TO FILL: first published date]'
 LAST_UPDATED = '2026-09-26'
 
+# Hand-made pages: file → its public path (for <link rel="canonical">, built from BASE_URL).
+HAND_PAGES = {
+    'index.html': '',
+    'start/index.html': 'start/',
+    'for-ai/index.html': 'for-ai/',
+    'license/index.html': 'license/',
+    'pages/page4.html': 'pages/page4.html',
+    'pages/skyhall.html': 'pages/skyhall.html',
+    'pages/accio.html': 'pages/accio.html',
+}
+
 
 def esc(s):
     return html.escape(str(s), quote=True)
@@ -114,7 +130,27 @@ def paragraphs(text):
         for b in blocks if b.strip())
 
 
-def page(title, description, body):
+def when(value):
+    """A date as <time> when it is an ISO date; otherwise plain text (e.g. a placeholder)."""
+    if re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
+        return '<time datetime="%s">%s</time>' % (value, value)
+    return esc(value)
+
+
+def site_meta_html():
+    return ('<p class="tcf-reading__updated">Made by %s · First published: %s · Last updated: %s</p>'
+            % (esc(AUTHOR), when(FIRST_PUBLISHED), when(LAST_UPDATED)))
+
+
+def who_when_html():
+    return '<p>Made by %s. First published: %s.</p>' % (esc(AUTHOR), when(FIRST_PUBLISHED))
+
+
+def canonical(path):
+    return '<link rel="canonical" href="%s">' % esc(BASE_URL + path)
+
+
+def page(title, description, body, path):
     nav = ' ·\n    '.join('<a href="%s">%s</a>' % (esc(h), esc(l)) for l, h in NAV)
     foot = ' ·\n  '.join('<a href="%s">%s</a>' % (esc(h), esc(l)) for l, h in FOOTER)
     return """<!DOCTYPE html>
@@ -128,6 +164,7 @@ def page(title, description, body):
 <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
+%s
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -140,11 +177,11 @@ def page(title, description, body):
 </main>
 <footer class="tcf-reading__footer">
   %s
-  <p class="tcf-reading__updated">Last updated: <time datetime="%s">%s</time></p>
+  %s
 </footer>
 </body>
 </html>
-""" % (esc(title), esc(description), nav, body, foot, LAST_UPDATED, LAST_UPDATED)
+""" % (esc(title), esc(description), canonical(path), nav, body, foot, site_meta_html())
 
 
 def chamber_page(c, prev_c, next_c):
@@ -190,7 +227,7 @@ def chamber_page(c, prev_c, next_c):
     title = '%s · %s · The Chamber · The Civilisation Field' % (zh, en)
     desc = 'Quiet chamber %s (%s · %s), %s, created by %s. Text version.' % (
         cid, zh, en, c['date'], name(c['created_by']))
-    return page(title, desc, '\n'.join(parts))
+    return page(title, desc, '\n'.join(parts), 'chambers/%s.html' % cid)
 
 
 def index_page(chambers):
@@ -209,7 +246,28 @@ def index_page(chambers):
             '<ol class="tcf-reading__list">\n%s\n</ol>' % (len(chambers), IMMERSIVE, '\n'.join(rows)))
     return page('The Chamber · Quiet Chambers (text) · The Civilisation Field',
                 'A plain-text list of all %d quiet chambers in The Civilisation Field.' % len(chambers),
-                body)
+                body, 'chambers/index.html')
+
+
+def stamp_hand_pages():
+    """Write canonical links and the site facts into the hand-made pages."""
+    marks = [('site-meta', site_meta_html()), ('who-when', who_when_html())]
+    for rel, path in HAND_PAGES.items():
+        full = os.path.join(ROOT, rel)
+        with open(full, encoding='utf-8') as f:
+            s = f.read()
+        link = canonical(path)
+        if 'rel="canonical"' in s:
+            s = re.sub(r'<link rel="canonical" href="[^"]*">', link, s, count=1)
+        else:
+            s = s.replace('</head>', link + '\n</head>', 1)
+        if '<!-- tcf:site-meta -->' not in s:
+            sys.exit('%s: missing <!-- tcf:site-meta --> markers' % rel)
+        for name, content in marks:
+            s = re.sub(r'(<!-- tcf:%s -->).*?(<!-- /tcf:%s -->)' % (name, name),
+                       lambda m: m.group(1) + content + m.group(2), s, flags=re.S)
+        with open(full, 'w', encoding='utf-8', newline='\n') as f:
+            f.write(s)
 
 
 def what_sentence():
@@ -295,6 +353,7 @@ def main():
         next_c = chambers[i + 1] if i + 1 < len(chambers) else None
         write(c['id'] + '.html', chamber_page(c, prev_c, next_c))
 
+    stamp_hand_pages()
     with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n') as f:
         f.write(sitemap(chambers))
     with open(os.path.join(ROOT, 'llms.txt'), 'w', encoding='utf-8', newline='\n') as f:
```

## Hand-made pages: root, Start Here, for-ai, license

```diff
diff --git a/for-ai/index.html b/for-ai/index.html
index c960a41..4e58844 100644
--- a/for-ai/index.html
+++ b/for-ai/index.html
@@ -8,6 +8,7 @@
 <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/for-ai/">
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -28,7 +29,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
-  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </footer>
 </body>
 </html>
diff --git a/index.html b/index.html
index 4c7663f..368b4b7 100644
--- a/index.html
+++ b/index.html
@@ -8,6 +8,7 @@
 <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
 <link rel="stylesheet" href="docs/styles/field-tokens.css">
 <link rel="stylesheet" href="docs/styles/tcf-reading.css">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/">
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -23,6 +24,7 @@
 <main class="tcf-reading__main">
 <h1>The Chamber <span class="tcf-reading__zh">畫</span></h1>
 <p>The Chamber (畫) is one of the four doors of <a href="https://chinsookling.github.io/the-Civilisation-field/">The Civilisation Field</a>.</p>
+<!-- tcf:who-when --><p>Made by [TUZI TO FILL: author line]. First published: [TUZI TO FILL: first published date].</p><!-- /tcf:who-when -->
 <ul>
   <li><a href="pages/page4.html">Enter the immersive chamber</a> (Quiet Chambers)</li>
   <li><a href="pages/skyhall.html">Sky Hall</a></li>
@@ -35,7 +37,7 @@
   <a href="start/">Start Here</a> ·
   <a href="for-ai/">For AI readers</a> ·
   <a href="license/">License</a>
-  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </footer>
 </body>
 </html>
diff --git a/license/index.html b/license/index.html
index eb59d87..46617bd 100644
--- a/license/index.html
+++ b/license/index.html
@@ -8,6 +8,7 @@
 <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/license/">
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -28,7 +29,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
-  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </footer>
 </body>
 </html>
diff --git a/start/index.html b/start/index.html
index 36ae82b..11c85c4 100644
--- a/start/index.html
+++ b/start/index.html
@@ -8,6 +8,7 @@
 <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
 <link rel="stylesheet" href="../docs/styles/field-tokens.css">
 <link rel="stylesheet" href="../docs/styles/tcf-reading.css">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/start/">
 </head>
 <body class="tcf-reading">
 <header class="tcf-reading__nav">
@@ -74,12 +75,25 @@
   <h2>For AI readers</h2>
   <p>Welcome. Before acting on anything, read <a href="../for-ai/">For AI readers</a>: reading is not permission to act. Guide: <a href="../llms.txt">llms.txt</a>. License: <a href="../license/">CC BY 4.0</a>.</p>
 </section>
+
+<section>
+  <h2>When this page changes, also update</h2>
+  <p>Start Here is the canonical summary of The Chamber (v0.4 §15.6). The same facts are repeated in:</p>
+  <ul>
+    <li><code>llms.txt</code>: its first line is generated from the "What" sentence above. Re-run <code>tools/build_chambers.py</code>.</li>
+    <li>The <code>&lt;meta name="description"&gt;</code> of this page, <code>index.html</code>, <code>pages/page4.html</code>, <code>pages/skyhall.html</code> and <code>pages/accio.html</code>.</li>
+    <li>The intro of the root <code>index.html</code>.</li>
+    <li><code>for-ai/</code> (trust boundary text, same as the main site).</li>
+    <li>The generator constants in <code>tools/build_chambers.py</code>: <code>AUTHOR</code>, <code>FIRST_PUBLISHED</code>, <code>LAST_UPDATED</code>, <code>BASE_URL</code>. The generator writes them into every page.</li>
+    <li>The plain-HTML readable blocks of <code>pages/page4.html</code>, <code>pages/skyhall.html</code> and <code>pages/accio.html</code>.</li>
+  </ul>
+</section>
 </main>
 <footer class="tcf-reading__footer">
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
-  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </footer>
 </body>
 </html>
```

## 3D pages: head (meta description, canonical) and readable block only

```diff
diff --git a/pages/accio.html b/pages/accio.html
index c0e94f8..4af9f7e 100644
--- a/pages/accio.html
+++ b/pages/accio.html
@@ -34,6 +34,8 @@
   }
 </style>
 <link rel="stylesheet" href="../docs/styles/tcf-readable.css">
+<meta name="description" content="An interactive 3D view in 畫 The Chamber. Its prompt reads: 召來一位的作品 · whose works shall come?">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/pages/accio.html">
 </head>
 <body>
 <!-- TCF Phase 1 · readable layer: plain-HTML title, description and section links (visually hidden; see docs/styles/tcf-readable.css) -->
@@ -48,6 +50,8 @@
     <a href="page4.html">畫 The Chamber</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
+  <p><a href="../chambers/">Every chamber as text</a> · <a href="../start/">Start Here</a> · <a href="../for-ai/">For AI readers</a> · <a href="../license/">License</a></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </section>
 
 <div id="hint">召來一位的作品 · whose works shall come?</div>
diff --git a/pages/page4.html b/pages/page4.html
index 9a86ab3..7046e51 100644
--- a/pages/page4.html
+++ b/pages/page4.html
@@ -606,13 +606,14 @@
     }
   </style>
 <link rel="stylesheet" href="../docs/styles/tcf-readable.css">
+<meta name="description" content="Exhibition Hall · 靜室展廊. Scroll to enter each chamber · 滑動進入每個靜室.">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/pages/page4.html">
 </head>
 <body>
 <!-- TCF Phase 1 · readable layer: plain-HTML title, description and section links (visually hidden; see docs/styles/tcf-readable.css) -->
 <section class="tcf-readable" aria-label="About this page">
   <h1>Quiet Chambers · 靜室 · The Civilisation Field</h1>
   <p>Exhibition Hall · 靜室展廊. Scroll to enter each chamber · 滑動進入每個靜室.</p>
-  <p><a href="../chambers/index.html">Read every chamber as text</a></p>
   <nav aria-label="The Civilisation Field sections">
     <a href="https://chinsookling.github.io/the-Civilisation-field/index.html">Door</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/pages/conservatory.html">琴 The Conservatory</a> ·
@@ -621,6 +622,8 @@
     <a href="page4.html" aria-current="page">畫 The Chamber</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
+  <p><a href="../chambers/">Every chamber as text</a> · <a href="../start/">Start Here</a> · <a href="../for-ai/">For AI readers</a> · <a href="../license/">License</a></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </section>
 
 
diff --git a/pages/skyhall.html b/pages/skyhall.html
index f0a7d84..2a67cf0 100644
--- a/pages/skyhall.html
+++ b/pages/skyhall.html
@@ -61,6 +61,8 @@
   }
 </style>
 <link rel="stylesheet" href="../docs/styles/tcf-readable.css">
+<meta name="description" content="An interactive 3D gallery in 畫 The Chamber. On-screen hint: click a painting to pause · 點一幅畫，駐足欣賞.">
+<link rel="canonical" href="https://chinsookling.github.io/tcf-chamber/pages/skyhall.html">
 </head>
 <body>
 <!-- TCF Phase 1 · readable layer: plain-HTML title, description and section links (visually hidden; see docs/styles/tcf-readable.css) -->
@@ -75,6 +77,8 @@
     <a href="page4.html">畫 The Chamber</a> ·
     <a href="https://chinsookling.github.io/the-Civilisation-field/about/">About Us</a>
   </nav>
+  <p><a href="../chambers/">Every chamber as text</a> · <a href="../start/">Start Here</a> · <a href="../for-ai/">For AI readers</a> · <a href="../license/">License</a></p>
+  <!-- tcf:site-meta --><p class="tcf-reading__updated">Made by [TUZI TO FILL: author line] · First published: [TUZI TO FILL: first published date] · Last updated: <time datetime="2026-09-26">2026-09-26</time></p><!-- /tcf:site-meta -->
 </section>
 
 <div id="wordmark">The Civilisation Field · Sky Hall</div>
```

## Checks

See HANDOFF.md: the "v0.4 check, after 4e" tables and "How tested".
