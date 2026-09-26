# REVIEW — Phase 4d (tcf-chamber · `phase-4d-chamber-finish`)

```
 166 files changed, 286 insertions(+), 48 deletions(-)
```

The generated `chambers/*.html` pages changed only by the "Last updated" footer line. Sample:

```diff
diff --git a/chambers/ch001.html b/chambers/ch001.html
index 26f31d9..9bab255 100644
--- a/chambers/ch001.html
+++ b/chambers/ch001.html
@@ -61,6 +61,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
+  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
```

## 1. `docs/scripts/nav.js` (menu items)

```diff
diff --git a/docs/scripts/nav.js b/docs/scripts/nav.js
index cb14d1c..2a8b955 100644
--- a/docs/scripts/nav.js
+++ b/docs/scripts/nav.js
@@ -21,29 +21,21 @@
   var current = location.pathname.split('/').pop() || 'index.html';
   if (current === '') current = 'index.html';
 
+  // Phase 4d: same items as the readable banner
+  // Door · 琴 The Conservatory · 棋 Play · 書 The Library · 畫 The Chamber · About Us
   var MODEL = [
-    { kind: 'link',  label: 'Lantern', href: p('lantern.html') },
-    { kind: 'link',  zh: '琴', label: 'The Conservatory', href: p('conservatory.html'),
-      pages: ['conservatory.html'] },
-    { kind: 'link',  zh: '棋', label: 'Board Room', href: p('board.html'),
-      pages: ['board.html'] },
-    { kind: 'group', zh: '書', label: 'The Library', href: HOME,
-      pages: ['index.html', 'page2.html', 'page3.html', 'the-scroll.html'],
-      items: [
-        { label: 'The Brain',  href: HOME },
-        { label: 'Trails',     href: p('page2.html') },
-        { label: 'Resonance',  href: p('page3.html') },
-        { label: 'The Scroll', href: p('the-scroll.html') }
-      ] },
+    { kind: 'link',  label: 'Door', href: HOME },
+    { kind: 'link',  zh: '琴', label: 'The Conservatory', href: p('conservatory.html') },
+    { kind: 'link',  zh: '棋', label: 'Play', href: 'https://play.civilisationfield.com/' },
+    { kind: 'link',  zh: '書', label: 'The Library', href: HOME },
     { kind: 'group', zh: '畫', label: 'The Chamber', href: p('page4.html'),
-      pages: ['page4.html', 'skyhall.html', 'formula-room.html', 'accio.html'],
+      pages: ['page4.html', 'skyhall.html', 'accio.html'],
       items: [
         { label: 'Chambers',   href: p('page4.html') },
         { label: 'Sky Hall',   href: p('skyhall.html') },
-        { label: 'Formula Room', href: p('formula-room.html') },
         { label: 'Accio',      href: p('accio.html') }
       ] },
-    { kind: 'link',  label: 'The Field', href: p('about.html'), pages: ['about.html'] }
+    { kind: 'link',  label: 'About Us', href: MAIN + 'about/' }
   ];
 
   function isCurrent(node) {
```

## 2. `pages/page4.html` (video loading)

```diff
diff --git a/pages/page4.html b/pages/page4.html
index d163dff..9a86ab3 100644
--- a/pages/page4.html
+++ b/pages/page4.html
@@ -719,8 +719,14 @@ AI 並不是秘密地在靜室裡繼續存在。
     const panel = document.getElementById('overlay-panel');
     if (ov) ov.classList.remove('is-open');
     if (cb) cb.hidden = true;
-    if (panel) panel.innerHTML = '';
+    if (panel) {
+      // Phase 4d: stop the video download before removing it
+      panel.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
+      panel.innerHTML = '';
+    }
     document.body.style.overflow = '';
+    // Phase 4d: let the gallery cards on screen load again
+    if (window.tcfResumeCardVideos) window.tcfResumeCardVideos();
   }
   document.addEventListener('DOMContentLoaded', () => {
     const cb = document.getElementById('close-btn');
@@ -755,7 +761,12 @@ AI 並不是秘密地在靜室裡繼續存在。
           if (v.getAttribute('src')) { v.removeAttribute('src'); v.load(); }
         }
       });
-    }, { rootMargin: '300px 600px', threshold: 0.01 }) : null;
+    }, { rootMargin: '0px', threshold: 0.5 }) : null; // Phase 4d: only cards on screen (was 300px 600px)
+    // Phase 4d: pause and release card videos while a Living Record video is open
+    window.tcfPauseCardVideos = () => document.querySelectorAll('video.exhibition__card-video').forEach(v => {
+      v.pause(); if (v.getAttribute('src')) { v.removeAttribute('src'); v.load(); }
+    });
+    window.tcfResumeCardVideos = () => { if (tcfVidObserver) document.querySelectorAll('video.exhibition__card-video').forEach(v => { tcfVidObserver.unobserve(v); tcfVidObserver.observe(v); }); };
 
     chambers.forEach(ch => {
       const color = AFFILIATE_HEX[ch.created_by] || '#FFD700';
@@ -852,7 +863,7 @@ AI 並不是秘密地在靜室裡繼續存在。
         <div class="chamber__living-glimpse">
           <div class="chamber__section-rule"></div>
           <div class="chamber__section-label">Living Glimpse · Silent Breathing Loop</div>
-          <button class="chamber__invite-btn" data-video="${glimpseVids.join('|')}" data-label="${ch.name_zh} · ${ch.name_en}">▶ Enter the Living Record</button>
+          <button class="chamber__invite-btn" data-video="${glimpseVids.join('|')}" data-poster="${(ch.images && ch.images.length) ? ch.images[0] : ch.image}" data-label="${ch.name_zh} · ${ch.name_en}">▶ Enter the Living Record</button>
         </div>` : '';
       const sharedText = `
         <div class="chamber__meta">${ch.date} · Created by <span style="color:${color}">${createdLabel}</span></div>
@@ -982,7 +993,8 @@ AI 並不是秘密地在靜室裡繼續存在。
           const tabsHtml = vsrcs.length > 1
             ? '<div class="chamber__video-tabs">' + vsrcs.map((s2,i) => '<button class="chamber__vtab' + (i===0?' is-active':'') + '" data-vsrc="' + s2 + '">' + String.fromCharCode(97+i) + '</button>').join('') + '</div>'
             : '';
-          ovPanel.innerHTML = '<div style="font-family:var(--font-primary);font-size:var(--fs-xs);letter-spacing:var(--tracking-wide);color:var(--gold-warm-55);text-align:center;margin-bottom:var(--space-md);line-height:1.7">' + label + '</div>' + tabsHtml + '<video controls playsinline preload="metadata" style="width:100%;display:block;max-height:76vh;object-fit:contain" src="' + vsrcs[0] + '"></video>';
+          ovPanel.innerHTML = '<div style="font-family:var(--font-primary);font-size:var(--fs-xs);letter-spacing:var(--tracking-wide);color:var(--gold-warm-55);text-align:center;margin-bottom:var(--space-md);line-height:1.7">' + label + '</div>' + tabsHtml + '<video controls playsinline preload="metadata"' + (btn.dataset.poster ? ' poster="' + btn.dataset.poster + '"' : '') + ' style="width:100%;display:block;max-height:76vh;object-fit:contain" src="' + vsrcs[0] + '"></video>';
+          if (window.tcfPauseCardVideos) window.tcfPauseCardVideos(); // Phase 4d
           ov.classList.add('is-open'); cb.hidden = false;
           document.body.style.overflow = 'hidden';
           const v = ovPanel.querySelector('video'); if (v) v.play().catch(()=>{});
```

## 3. "Last updated": generator, CSS, hand-made footers

```diff
diff --git a/docs/styles/tcf-reading.css b/docs/styles/tcf-reading.css
index 8a6813a..bb9ec8e 100644
--- a/docs/styles/tcf-reading.css
+++ b/docs/styles/tcf-reading.css
@@ -160,3 +160,10 @@ body.tcf-reading {
   color: var(--gold-pure);
   font-weight: 600;
 }
+
+/* Phase 4d · "Last updated" line in the footer (v0.4 item 5) */
+.tcf-reading__updated {
+  margin: var(--space-2xs) 0 0;
+  font-size: var(--fs-xs);
+  color: var(--text-tertiary);
+}
diff --git a/for-ai/index.html b/for-ai/index.html
index 6bda41c..c960a41 100644
--- a/for-ai/index.html
+++ b/for-ai/index.html
@@ -28,6 +28,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
+  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
diff --git a/index.html b/index.html
index 664e268..4c7663f 100644
--- a/index.html
+++ b/index.html
@@ -35,6 +35,7 @@
   <a href="start/">Start Here</a> ·
   <a href="for-ai/">For AI readers</a> ·
   <a href="license/">License</a>
+  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
diff --git a/license/index.html b/license/index.html
index 5de8565..eb59d87 100644
--- a/license/index.html
+++ b/license/index.html
@@ -28,6 +28,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
+  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
diff --git a/start/index.html b/start/index.html
index ebc7b89..36ae82b 100644
--- a/start/index.html
+++ b/start/index.html
@@ -79,6 +79,7 @@
   <a href="../start/">Start Here</a> ·
   <a href="../for-ai/">For AI readers</a> ·
   <a href="../license/">License</a>
+  <p class="tcf-reading__updated">Last updated: <time datetime="2026-09-26">2026-09-26</time></p>
 </footer>
 </body>
 </html>
diff --git a/tools/build_chambers.py b/tools/build_chambers.py
index 8b4e186..b4be2a5 100644
--- a/tools/build_chambers.py
+++ b/tools/build_chambers.py
@@ -64,6 +64,10 @@ PLANNED_URL = 'https://chamber.civilisationfield.com/'
 READING_PAGES = ['start/', 'for-ai/', 'license/']
 IMMERSIVE_PAGES = ['pages/page4.html', 'pages/skyhall.html', 'pages/accio.html']
 
+# "Last updated" date shown in the footer of every generated page (v0.4 item 5).
+# Change it when the chamber content or these pages change, then re-run.
+LAST_UPDATED = '2026-09-26'
+
 
 def esc(s):
     return html.escape(str(s), quote=True)
@@ -136,10 +140,11 @@ def page(title, description, body):
 </main>
 <footer class="tcf-reading__footer">
   %s
+  <p class="tcf-reading__updated">Last updated: <time datetime="%s">%s</time></p>
 </footer>
 </body>
 </html>
-""" % (esc(title), esc(description), nav, body, foot)
+""" % (esc(title), esc(description), nav, body, foot, LAST_UPDATED, LAST_UPDATED)
 
 
 def chamber_page(c, prev_c, next_c):
```

## Measurements and the v0.4 check

See HANDOFF.md, §2 (before/after table) and §4 (Must-item table).
