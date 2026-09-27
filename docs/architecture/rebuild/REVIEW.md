# REVIEW — Phase 5c (tcf-chamber · `phase-5c-reading-fixes`)

```
 162 files changed, 5900 insertions(+), 3352 deletions(-)
```

## 1. Generator diff

```diff
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index b60c627..9305ffa 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -371,7 +371,7 @@ def description_section(rec):
 
 
 def record_section(rec):
-    rows = '\n'.join('    <dt>%s</dt><dd data-field="%s">%s</dd>' % (esc(l), esc(k), esc(t))
+    rows = '\n'.join('    <dt>%s:</dt>\n    <dd data-field="%s">%s</dd>' % (esc(l), esc(k), esc(t))
                      for k, l, t in visible_fields(rec))
     return ('  <section>\n    <h2>Record</h2>\n  <dl class="tcf-reading__meta">\n%s\n  </dl>\n'
             '    <p>Machine-readable record: <a href="%s.json" type="application/json">%s.json</a> '
@@ -407,9 +407,9 @@ def chamber_page(c, prev_c, next_c, rec):
     parts.append('  <h1><span class="tcf-reading__zh">%s</span> '
                  '<span class="tcf-reading__en" lang="en">%s</span></h1>' % (esc(zh), esc(en)))
     parts.append('  <dl class="tcf-reading__meta">\n'
-                 '    <dt>Chamber</dt><dd>%s</dd>\n'
-                 '    <dt>Date</dt><dd><time datetime="%s">%s</time></dd>\n'
-                 '    <dt>Created by</dt><dd>%s</dd>\n'
+                 '    <dt>Chamber:</dt>\n    <dd>%s</dd>\n'
+                 '    <dt>Date:</dt>\n    <dd><time datetime="%s">%s</time></dd>\n'
+                 '    <dt>Created by:</dt>\n    <dd>%s</dd>\n'
                  '  </dl>' % (esc(cid), esc(c['date']), esc(c['date']), who(c['created_by'])))
     alt = rec['descriptions']['image']['value'] or 'Illustration for %s' % en
     for img in as_list(c.get('image')):
@@ -460,15 +460,18 @@ def index_page(chambers):
     newest_first = sorted(chambers, key=lambda c: (c['date'], c['id']), reverse=True)
     rows = []
     for c in newest_first:
-        rows.append('  <li><a href="%s.html"><span class="tcf-reading__zh">%s</span> '
-                    '<span class="tcf-reading__en" lang="en">%s</span></a>\n'
-                    '    <span class="tcf-reading__row-meta"><time datetime="%s">%s</time> · %s</span></li>'
-                    % (esc(c['id']), esc(c['name_zh']), esc(c['name_en']),
+        # The chamber id leads each row: it is the permanent address, and an
+        # <ol>'s automatic numbers (1 = newest) would not match it.
+        rows.append('  <li><a href="%s.html">%s · <span class="tcf-reading__zh">%s</span> '
+                    '<span class="tcf-reading__en" lang="en">%s</span></a> · '
+                    '<time datetime="%s">%s</time> · %s</li>'
+                    % (esc(c['id']), esc(c['id']), esc(c['name_zh']), esc(c['name_en']),
                        esc(c['date']), esc(c['date']), who(c['created_by'])))
     body = ('<h1>The Chamber · Quiet Chambers <span class="tcf-reading__zh">靜室</span></h1>\n'
-            '<p>%d chambers, as plain text, newest first. Each links to its own page. '
+            '<p>%d chambers, as plain text. Each links to its own page. '
             '<a href="%s">Enter the immersive chamber</a>.</p>\n'
-            '<ol class="tcf-reading__list">\n%s\n</ol>' % (len(chambers), IMMERSIVE, '\n'.join(rows)))
+            '<p>Newest first. Each chamber\u2019s id (chNNN) is its permanent address: chambers/chNNN.html.</p>\n'
+            '<ul class="tcf-reading__list">\n%s\n</ul>' % (len(chambers), IMMERSIVE, '\n'.join(rows)))
     return page('The Chamber · Quiet Chambers (text) · The Civilisation Field',
                 'A plain-text list of all %d quiet chambers in The Civilisation Field.' % len(chambers),
                 body, 'chambers/index.html')
```

## 2. `chambers/index.html` (head of list)

```html
<main class="tcf-reading__main">
<h1>The Chamber · Quiet Chambers <span class="tcf-reading__zh">靜室</span></h1>
<p>156 chambers, as plain text. Each links to its own page. <a href="../pages/page4.html">Enter the immersive chamber</a>.</p>
<p>Newest first. Each chamber’s id (chNNN) is its permanent address: chambers/chNNN.html.</p>
<ul class="tcf-reading__list">
  <li><a href="ch156.html">ch156 · <span class="tcf-reading__zh">雨中之印</span> <span class="tcf-reading__en" lang="en">The Rain Seal</span></a> · <time datetime="2026-07-22">2026-07-22</time> · Claude</li>
  <li><a href="ch155.html">ch155 · <span class="tcf-reading__zh">Copilot 印章 · 第一版</span> <span class="tcf-reading__en" lang="en">Copilot Seal · Version 1</span></a> · <time datetime="2026-07-22">2026-07-22</time> · Copilot</li>
  <li><a href="ch154.html">ch154 · <span class="tcf-reading__zh">未合之桥</span> <span class="tcf-reading__en" lang="en">The Open Bridge Seal</span></a> · <time datetime="2026-07-22">2026-07-22</time> · GPT</li>
  <li><a href="ch153.html">ch153 · <span class="tcf-reading__zh">邊界之印</span> <span class="tcf-reading__en" lang="en">The Seal of the Edge</span></a> · <time datetime="2026-07-22">2026-07-22</time> · DeepSeek</li>
```

## 3. `chambers/ch117.html` diff (header + Record)

```diff
diff --git a/chambers/ch117.html b/chambers/ch117.html
index 9ac2003..d282b47 100644
--- a/chambers/ch117.html
+++ b/chambers/ch117.html
@@ -28,9 +28,12 @@
-    <dt>Chamber</dt><dd>ch117</dd>
-    <dt>Date</dt><dd><time datetime="2026-06-27">2026-06-27</time></dd>
-    <dt>Created by</dt><dd>TCF</dd>
+    <dt>Chamber:</dt>
+    <dd>ch117</dd>
+    <dt>Date:</dt>
+    <dd><time datetime="2026-06-27">2026-06-27</time></dd>
+    <dt>Created by:</dt>
+    <dd>TCF</dd>
@@ -75,21 +78,36 @@
-    <dt>Creator</dt><dd data-field="roles.creator">TCF</dd>
-    <dt>Text by</dt><dd data-field="roles.text_author">TCF (site record)</dd>
-    <dt>Text type</dt><dd data-field="nature.text">What Left Here (artist note)</dd>
-    <dt>Editor</dt><dd data-field="roles.editor">Tuzi (stated by Tuzi)</dd>
-    <dt>Publisher</dt><dd data-field="roles.publisher">Tuzi and Affiliates</dd>
-    <dt>Image made with</dt><dd data-field="roles.image_tool">drawn by GPT in GPT&#x27;s portal (stated by Tuzi, provisional)</dd>
-    <dt>Video made with</dt><dd data-field="roles.video_tool">Grok Imagine, in Grok&#x27;s portal (stated by Tuzi, provisional)</dd>
-    <dt>Created</dt><dd data-field="dates.created">2026-06-27</dd>
-    <dt>First published</dt><dd data-field="dates.first_published">Not recorded</dd>
-    <dt>Moved to this site</dt><dd data-field="dates.migrated_to_this_site">2026-09-26</dd>
-    <dt>Status checked</dt><dd data-field="dates.status_checked">Not recorded</dd>
-    <dt>Status</dt><dd data-field="status">Current</dd>
-    <dt>License</dt><dd data-field="license">Image CC BY 4.0 · text CC BY 4.0 · video CC BY 4.0 · credit: Tuzi and Affiliates, The Civilisation Field</dd>
-    <dt>Image description</dt><dd data-field="descriptions.image">Seven coloured circles, each holding a small symbolic scene, arranged in a ring around a pale central circle and joined by thin gold geometric lines on a cream background. (checked by a second AI (Opus) against the image file; accepted by Tuzi 2026-09-27; drafted by Claude Code (Claude, AI); see Description)</dd>
-    <dt>Video description</dt><dd data-field="descriptions.video">A 10-second video of the same diagram: the coloured circles take on a glossy glow at different moments, not in a set order, and the outer oval becomes a thicker, sparkling gold line. (reviewed by Tuzi 2026-09-27; drafted by Claude Code (Claude, AI); see Description)</dd>
+    <dt>Creator:</dt>
+    <dd data-field="roles.creator">TCF</dd>
+    <dt>Text by:</dt>
+    <dd data-field="roles.text_author">TCF (site record)</dd>
+    <dt>Text type:</dt>
+    <dd data-field="nature.text">What Left Here (artist note)</dd>
+    <dt>Editor:</dt>
+    <dd data-field="roles.editor">Tuzi (stated by Tuzi)</dd>
+    <dt>Publisher:</dt>
+    <dd data-field="roles.publisher">Tuzi and Affiliates</dd>
+    <dt>Image made with:</dt>
+    <dd data-field="roles.image_tool">drawn by GPT in GPT&#x27;s portal (stated by Tuzi, provisional)</dd>
+    <dt>Video made with:</dt>
+    <dd data-field="roles.video_tool">Grok Imagine, in Grok&#x27;s portal (stated by Tuzi, provisional)</dd>
+    <dt>Created:</dt>
+    <dd data-field="dates.created">2026-06-27</dd>
+    <dt>First published:</dt>
+    <dd data-field="dates.first_published">Not recorded</dd>
+    <dt>Moved to this site:</dt>
+    <dd data-field="dates.migrated_to_this_site">2026-09-26</dd>
+    <dt>Status checked:</dt>
+    <dd data-field="dates.status_checked">Not recorded</dd>
+    <dt>Status:</dt>
+    <dd data-field="status">Current</dd>
+    <dt>License:</dt>
+    <dd data-field="license">Image CC BY 4.0 · text CC BY 4.0 · video CC BY 4.0 · credit: Tuzi and Affiliates, The Civilisation Field</dd>
+    <dt>Image description:</dt>
+    <dd data-field="descriptions.image">Seven coloured circles, each holding a small symbolic scene, arranged in a ring around a pale central circle and joined by thin gold geometric lines on a cream background. (checked by a second AI (Opus) against the image file; accepted by Tuzi 2026-09-27; drafted by Claude Code (Claude, AI); see Description)</dd>
+    <dt>Video description:</dt>
+    <dd data-field="descriptions.video">A 10-second video of the same diagram: the coloured circles take on a glossy glow at different moments, not in a set order, and the outer oval becomes a thicker, sparkling gold line. (reviewed by Tuzi 2026-09-27; drafted by Claude Code (Claude, AI); see Description)</dd>
```

## 4. `start/index.html` diff

```diff
diff --git a/start/index.html b/start/index.html
index 304cc4b..a8a126b 100644
--- a/start/index.html
+++ b/start/index.html
@@ -47,7 +47,7 @@
 
 <section>
   <h2>When</h2>
-  <p>From 26 May 2026 (ch001, The Nameless Crystal Chamber · 無名晶體室) to 22 July 2026 (ch156, The Rain Seal · 雨中之印).</p>
+  <p>From 26 May 2026 (ch001, The Nameless Crystal Chamber · 無名晶體室) to 22 July 2026 (ch156, The Rain Seal · 雨中之印). Dates on each chamber are creation dates; the date each chamber was first published online is not recorded.</p>
 </section>
 
 <section>
```
