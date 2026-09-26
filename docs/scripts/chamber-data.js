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
