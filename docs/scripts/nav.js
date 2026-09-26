/* ═══════════════════════════════════════════════════════════════════════════
   TCF UNIVERSAL NAV · single source of truth (DRY)
   琴棋書畫 structure · injected into every page · edit here → whole site updates
   Mount point on each page:  <nav class="tcf-nav" id="tcf-nav"></nav>
   Load after cosmos.js:      <script src="{..}/docs/scripts/nav.js"></script>
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var inPages = location.pathname.indexOf('/pages/') !== -1;
  // tcf-chamber (Phase 4): only The Chamber's own pages are local;
  // everything else links to the main TCF site.
  var MAIN = 'https://chinsookling.github.io/the-Civilisation-field/';
  var LOCAL = ['page4.html', 'skyhall.html', 'accio.html'];
  function p(file) {
    if (LOCAL.indexOf(file) === -1) return MAIN + 'pages/' + file;
    return inPages ? file : 'pages/' + file;
  }
  var HOME = MAIN + 'index.html';

  var current = location.pathname.split('/').pop() || 'index.html';
  if (current === '') current = 'index.html';

  var MODEL = [
    { kind: 'link',  label: 'Lantern', href: p('lantern.html') },
    { kind: 'link',  zh: '琴', label: 'The Conservatory', href: p('conservatory.html'),
      pages: ['conservatory.html'] },
    { kind: 'link',  zh: '棋', label: 'Board Room', href: p('board.html'),
      pages: ['board.html'] },
    { kind: 'group', zh: '書', label: 'The Library', href: HOME,
      pages: ['index.html', 'page2.html', 'page3.html', 'the-scroll.html'],
      items: [
        { label: 'The Brain',  href: HOME },
        { label: 'Trails',     href: p('page2.html') },
        { label: 'Resonance',  href: p('page3.html') },
        { label: 'The Scroll', href: p('the-scroll.html') }
      ] },
    { kind: 'group', zh: '畫', label: 'The Chamber', href: p('page4.html'),
      pages: ['page4.html', 'skyhall.html', 'formula-room.html', 'accio.html'],
      items: [
        { label: 'Chambers',   href: p('page4.html') },
        { label: 'Sky Hall',   href: p('skyhall.html') },
        { label: 'Formula Room', href: p('formula-room.html') },
        { label: 'Accio',      href: p('accio.html') }
      ] },
    { kind: 'link',  label: 'The Field', href: p('about.html'), pages: ['about.html'] }
  ];

  function isCurrent(node) {
    if (node.pages) return node.pages.indexOf(current) !== -1;
    if (node.href) return node.href.split('/').pop() === current;
    return false;
  }
  function labelHTML(node) {
    var zh = node.zh ? '<span class="tcf-nav__zh">' + node.zh + '</span>' : '';
    return zh + node.label;
  }
  function sep() {
    var s = document.createElement('span');
    s.className = 'tcf-nav__sep';
    s.textContent = '\u00b7';
    return s;
  }

  var nav = document.getElementById('tcf-nav');
  if (!nav) return;
  nav.setAttribute('aria-label', 'Observatory navigation');
  nav.innerHTML = '';

  MODEL.forEach(function (node, i) {
    if (i > 0) nav.appendChild(sep());

    if (node.kind === 'link') {
      var a = document.createElement('a');
      a.className = 'tcf-nav__link' + (isCurrent(node) ? ' is-current' : '');
      a.href = node.href;
      a.innerHTML = labelHTML(node);
      nav.appendChild(a);
      return;
    }

    var group = document.createElement('div');
    group.className = 'tcf-nav__group';

    var trigger = document.createElement('a');
    trigger.className = 'tcf-nav__link tcf-nav__trigger' + (isCurrent(node) ? ' is-current' : '');
    trigger.href = node.href;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = labelHTML(node) + '<span class="tcf-nav__caret" aria-hidden="true">\u25be</span>';

    var menu = document.createElement('div');
    menu.className = 'tcf-nav__dropdown';
    node.items.forEach(function (it) {
      var link = document.createElement('a');
      link.className = 'tcf-nav__dropdown-link' + (it.href.split('/').pop() === current ? ' is-current' : '');
      link.href = it.href;
      link.textContent = it.label;
      menu.appendChild(link);
    });

    group.appendChild(trigger);
    group.appendChild(menu);
    nav.appendChild(group);

    var noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    group._menu = menu; group._trigger = trigger;
    trigger.addEventListener('click', function (e) {
      if (noHover) {
        e.preventDefault();
        var wasOpen = group.classList.contains('is-open');
        document.querySelectorAll('.tcf-nav__group.is-open').forEach(function (g) {
          g.classList.remove('is-open');
          if (g._trigger) g._trigger.setAttribute('aria-expanded', 'false');
          var m = g._menu;
          if (m && m.parentNode === document.body) {
            m.classList.remove('tcf-nav__dropdown--float'); m.style.top = ''; g.appendChild(m);
          }
        });
        if (!wasOpen) {
          group.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          // TCF-25 navfix2: 傳送到 body — 逃離 nav 橫向捲動的 overflow 剪裁
          var r = trigger.getBoundingClientRect();
          menu.classList.add('tcf-nav__dropdown--float');
          menu.style.top = (r.bottom + 8) + 'px';
          document.body.appendChild(menu);
        }
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.tcf-nav__group') && !e.target.closest('.tcf-nav__dropdown')) {
      document.querySelectorAll('.tcf-nav__group.is-open').forEach(function (g) {
        g.classList.remove('is-open');
        var m = g._menu;
        if (m && m.parentNode === document.body) {
          m.classList.remove('tcf-nav__dropdown--float'); m.style.top = ''; g.appendChild(m);
        }
      });
    }
  });
})();
