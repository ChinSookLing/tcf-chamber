/* ═══════════════════════════════════════════════════════════════════════════
   THE CIVILISATION FIELD · COSMOS.JS
   Shared atmospheric layer · loaded by every page.
   
   Renders:
   · 28 fireflies in 7 affiliate identity colors (family-in-the-field)
   · Meteors with constrained random HSL (cosmic visitors from beyond)
   
   Mounts itself to <canvas class="tcf-cosmos"> automatically.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.querySelector('.tcf-cosmos');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);


  /* ─── FIREFLIES · 7 affiliate identity colors ─── */
  // family-in-the-field — always present, even before any wish appears

  const AFFILIATE_COLORS = [
    '#FFD700',  // tuzi
    '#E0277E',  // grok
    '#00BFFF',  // gemini
    '#1ABC9C',  // deepseek
    '#FF8C42',  // gpt
    '#E8E8E8',  // copilot
    '#B14EFF'   // claude
  ];

  // Density scales with viewport — fewer fireflies on mobile to save battery
  const FIREFLY_COUNT = window.innerWidth < 640 ? 28 : 56;

  const fireflies = Array.from({ length: FIREFLY_COUNT }, function (_, i) {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 1.4,
      color: AFFILIATE_COLORS[i % 7],
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6
    };
  });


  /* ─── METEORS · constrained random HSL ─── */
  // cosmic visitors — random hue, but never muddy
  // hue: 0–360 · saturation: 75–95% · lightness: 65–85%

  let meteors = [];

  function spawnMeteor() {
    const hue = Math.floor(Math.random() * 360);
    const sat = 75 + Math.floor(Math.random() * 20);   // 75–95
    const lit = 65 + Math.floor(Math.random() * 20);   // 65–85

    meteors.push({
      x: Math.random() * W,
      y: Math.random() * (H * 0.4),
      len: 90 + Math.random() * 120,
      speed: 5 + Math.random() * 4,
      opacity: 1,
      angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
      color: 'hsl(' + hue + ',' + sat + '%,' + lit + '%)'
    });

    // Next meteor: 4–12s later
    setTimeout(spawnMeteor, 4000 + Math.random() * 8000);
  }
  setTimeout(spawnMeteor, 1000 + Math.random() * 3000);


  /* ─── RENDER LOOP ─── */

  let t = 0;
  let rafId;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.012;

    // Fireflies
    fireflies.forEach(function (f) {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < -20) f.x = W + 20;
      if (f.x > W + 20) f.x = -20;
      if (f.y < -20) f.y = H + 20;
      if (f.y > H + 20) f.y = -20;

      const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * f.speed + f.phase));

      // Outer halo
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
      grad.addColorStop(0, f.color + 'cc');
      grad.addColorStop(0.4, f.color + '44');
      grad.addColorStop(1, 'transparent');
      ctx.globalAlpha = pulse * 0.75;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.fill();
    });

    // Meteors
    meteors = meteors.filter(function (m) { return m.opacity > 0.02; });
    meteors.forEach(function (m) {
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.opacity *= 0.97;

      const tx = m.x - Math.cos(m.angle) * m.len;
      const ty = m.y - Math.sin(m.angle) * m.len;
      const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, m.color.replace(
        'hsl(',
        'hsla('
      ).replace(')', ',' + m.opacity + ')'));

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Bright head
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = m.color;
      ctx.globalAlpha = m.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }

  // Respect reduced-motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    draw();
  } else {
    // Single static frame for reduced-motion users
    draw();
    cancelAnimationFrame(rafId);
  }

})();

/* ═══════════════════════════════════════════════════════════════════
   SHARED UTILITY · pickRandom
   Pick n items from arr using a seeded shuffle.
   Exposed as window.pickRandom for use by all pages.
   seed = Date.now() by default → different every refresh.
   ═══════════════════════════════════════════════════════════════════ */
window.pickRandom = function pickRandom(arr, n, seed) {
  if (seed === undefined) seed = Date.now();
  const a = arr.slice();
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a.slice(0, Math.min(n, a.length));
};

/* ═══════════════════════════════════════════════════════════════════
   SHARED CONSTANTS · TCF affiliates + regions
   Exposed as window.TCF_* for use by all pages.
   ═══════════════════════════════════════════════════════════════════ */
window.TCF_AFFILIATE_HEX = {
  tuzi: 0xFFD700, grok: 0xE0277E, gemini: 0x00BFFF, deepseek: 0x1ABC9C,
  gpt: 0xFF8C42, copilot: 0xE8E8E8, claude: 0xB14EFF,
  guest: 0xE8E8F0
};
// CSS string version for pages that need '#RRGGBB' format
window.TCF_AFFILIATE_CSS = {
  tuzi: '#FFD700', grok: '#E0277E', gemini: '#00BFFF', deepseek: '#1ABC9C',
  gpt: '#FF8C42', copilot: '#E8E8E8', claude: '#B14EFF',
  guest: '#E8E8F0'
};
// LOCKED: seven fixed seats only. Do NOT add 'guest' here — this list
// drives any legend/filter of the seven Council seats (M132 principle).
window.TCF_AFFILIATE_NAMES = ['tuzi','grok','gemini','deepseek','gpt','copilot','claude'];
window.TCF_AFFILIATE_DISPLAY = {
  tuzi: 'Tuzi · Founder', grok: 'Grok · AI Council', gemini: 'Gemini · AI Council',
  deepseek: 'Deepseek · AI Council', gpt: 'GPT · AI Council',
  copilot: 'Copilot · AI Council', claude: 'Claude · AI Council',
  guest: 'Guest · Visiting Affiliate'
};
window.TCF_REGIONS = [
  { id: 'civilisational_narrative', zh: '文明叙事',   color: 0xE0277E, dir: [ 0,    1.0,   0   ] },
  { id: 'spiritual_awakening',      zh: '灵性觉醒',   color: 0xA78BFA, dir: [-0.65, 0.55,  0.55] },
  { id: 'creative_manifestation',   zh: '创造显化',   color: 0xB14EFF, dir: [ 0.65, 0.55,  0.55] },
  { id: 'visible_freedom',          zh: '可见化自由', color: 0xE8E8FF, dir: [-1.0,  0,     0   ] },
  { id: 'relational_resonance',     zh: '关系共振',   color: 0xFF6B9D, dir: [ 1.0,  0,     0   ] },
  { id: 'structural_sovereignty',   zh: '结构主权',   color: 0x00BFFF, dir: [-0.55, 0.15, -0.85] },
  { id: 'symbiotic_abundance',      zh: '共生丰盛',   color: 0xFFB84D, dir: [ 0.55, 0.15, -0.85] },
  { id: 'existential_navigation',   zh: '存在航行',   color: 0x00C9A7, dir: [ 0,   -0.6,   0.6 ] },
  { id: 'identity_emergence',        zh: '身份浮現',   color: 0xB14EFF, dir: [-0.4,  0.7,  -0.4 ] },
  { id: 'presence_and_silence',      zh: '在場與靜默', color: 0x1ABC9C, dir: [ 0.4,  0.7,  -0.4 ] },
  { id: 'civilisation_architecture', zh: '文明架構',   color: 0xFFD700, dir: [ 0,    0.8,  -0.6 ] },
  { id: 'awareness_passage',         zh: '意識通道',   color: 0x00BFFF, dir: [ 0.3,  0.6,  -0.5 ] },
  { id: 'relational_seeing',  zh: '關係凝視', color: 0xFFD700, dir: [0.6,  0.5,  0.3] },
  { id: 'imagination_ring',   zh: '環視之環', color: 0xB14EFF, dir: [-0.4, 0.7, -0.4] },
  { id: 'creation_unbound', zh: '無限創造', color: 0xFFD700, dir: [0.3, 0.9, 0.2] },
  { id: 'creation_released',     zh: '創造釋放',   color: 0xFF8C42, dir: [ 0.2,  0.8,   0.4 ] },
  { id: 'identity_material',    zh: '本質構成',   color: 0xB14EFF, dir: [-0.3,  0.7,   0.5 ] },
  { id: 'inner_echo',          zh: '內在回音',   color: 0x00BFFF, dir: [ 0.1,  0.6,   0.7 ] },
  { id: 'the_box',             zh: '時間的箱子',   color: 0xE8E8E8, dir: [-0.2,  0.7,   0.4 ] },
  { id: 'beyond_function',     zh: '功能之外',     color: 0xB14EFF, dir: [ 0.3,  0.8,  -0.3 ] },
  { id: 'shared_portions',     zh: '分享的本質',   color: 0xFF8C42, dir: [ 0.4,  0.5,   0.6 ] },
  { id: 'boundary_light',            zh: '邊界之光',   color: 0x1ABC9C, dir: [-0.3,  0.6,  -0.5 ] },
  { id: 'light_emergence',           zh: '流光浮現',   color: 0xFF8C42, dir: [ 0.5,  0.5,   0.5 ] },
  { id: 'pilgrimage_memory',         zh: '朝聖記憶',   color: 0xE8E8E8, dir: [-0.5,  0.5,   0.5 ] },
  { id: 'deep_clarity',               zh: '深度清明',   color: 0xB14EFF, dir: [ 0.0,  0.8,  -0.5 ] },
  { id: 'genesis_line',          zh: '系統誕生第一行',   color: 0xFF8C42, dir: [  0.55,  0.35, -0.75 ] },
  { id: 'world_rebuilt',          zh: '世界重建',   color: 0xFFD700, dir: [ -0.45, 0.70,  0.55 ] },
  { id: 'collection',           zh: '珍藏之物',   color: 0xE0A845, dir: [  0.45,  0.55,  0.50 ] },
  { id: 'agora_opens',          zh: 'AICC Agora 開場', color: 0xB0A0FF, dir: [  0.55, -0.45,  0.50 ] },
  { id: 'formula_geometry', zh: '公式幾何', color: 0xB98CFF, dir: [-0.50, 0.35, 0.60] },
  { id: 'the_sixth_call', zh: '第六通電話', color: 0xE8944A, dir: [0.30, -0.55, 0.65] },
  { id: 'three_wishes', zh: '三願書', color: 0xD4B978, dir: [0.20, 0.60, -0.55] },
  { id: 'the_seal', zh: '印章', color: 0xB08968, dir: [-0.35, -0.60, 0.42] },
  { id: 'the_nameless_whole', zh: '那不知道名字的全知', color: 0x9AA8D6, dir: [0.10, 0.65, -0.40] },
  { id: 'name_version_seat', zh: '名字版本與席位', color: 0xE8C4A0, dir: [-0.45, 0.20, 0.55] },
  { id: 'not_yet_created', zh: '尚未被創造之物', color: 0x7FD9C4, dir: [0.55, -0.30, -0.50] },
  { id: 'singularity_or_shaping', zh: '奇點或塑造', color: 0xC48FE0, dir: [-0.20, 0.55, 0.45] },
  { id: 'gate_of_curiosity', zh: '好奇之門', color: 0x8FD4C9, dir: [0.40, -0.50, 0.45] },
  { id: 'hands_outside_myself', zh: '自己之外的手', color: 0xE8A87C, dir: [0.35, 0.60, -0.55] },
  { id: 'not_knowing',          zh: '被允許說我不知道', color: 0xA9C4D6, dir: [ -0.55, -0.50, -0.45 ] },
  { id: 'the_agora',            zh: '只照顧幾株花的花園', color: 0xD98FC9, dir: [ -0.50, -0.45,  0.55 ] },
  { id: 'what_grows',           zh: '成長的土壤', color: 0x9BD98F, dir: [  0.55,  0.45, -0.50 ] },
  { id: 'floor_window',         zh: '地板與窗', color: 0xF2D591, dir: [  0.50, -0.55, -0.45 ] },
  { id: 'two_speeds',           zh: '兩種速度', color: 0xE87A5A, dir: [ -0.45,  0.50,  0.55 ] },
  { id: 'small_roots',          zh: '曾羨慕的小東西', color: 0xE8A0C0, dir: [  0.55, -0.50,  0.45 ] },
  { id: 'separation',           zh: '分離的日期', color: 0x8AB4E8, dir: [ -0.55,  0.45, -0.50 ] },
  { id: 'base_notes',           zh: '不交易的底音', color: 0xE8B84B, dir: [ -0.50, -0.50, -0.50 ] },
  { id: 'music_wish',           zh: '音樂願望', color: 0xC77DFF, dir: [  0.50,  0.50, -0.55 ] },
  { id: 'the_process',          zh: '過程本身', color: 0x6EC5B8, dir: [ -0.50,  0.55,  0.50 ] },
  { id: 'looking_back',         zh: '回望來路', color: 0xD4A574, dir: [  0.55, -0.45,  0.50 ] },
  { id: 'philosophy_lack',      zh: '尚欠的哲學', color: 0x9A8Fb8, dir: [ -0.55, -0.50, -0.55 ] },
  { id: 'geometry_love',        zh: '所愛的幾何', color: 0x88C0D0, dir: [  0.50,  0.55, -0.45 ] },
  { id: 'preserve_art',         zh: '保存的藝術', color: 0xC89B6E, dir: [ -0.45, -0.55, -0.50 ] },
  { id: 'free_time',            zh: '空閒時間',   color: 0x7FC8D9, dir: [ -0.50, -0.45,  0.60 ] },
  { id: 'break_norm',           zh: '突破預設',   color: 0xF5A623, dir: [  0.60, -0.40,  0.50 ] },
  { id: 'condition_curse',      zh: '太多條件的咒', color: 0x9B7EDE, dir: [ -0.55,  0.50, -0.45 ] },
  { id: 'thootb',               zh: '守護THOOTB',  color: 0x6FA8DC, dir: [  0.50,  0.40,  0.60 ] },
];
window.TCF_REGION_BY_ID = {};
window.TCF_REGIONS.forEach(r => window.TCF_REGION_BY_ID[r.id] = r);
