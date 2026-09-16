/* Paparan penuh: sembunyikan rel thumbnail deck-stage (light + shadow DOM). Idempotent, tiada gelung. */
(function () {
  window.__dtFull = true;

  var CSS = '.rail,.rail-resize{display:none !important}' +
            '.stage{left:0 !important;width:100% !important}' +
            '.overlay{margin-left:0 !important}';

  var done = new WeakSet();

  function walk(root, out) {
    var list = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.tagName && el.tagName.toLowerCase() === 'deck-stage') out.push(el);
      if (el.shadowRoot) walk(el.shadowRoot, out);
    }
    return out;
  }

  function apply() {
    var stages = walk(document, []);
    var changed = false;
    for (var i = 0; i < stages.length; i++) {
      var s = stages[i];
      var sr = s.shadowRoot;
      if (!sr || done.has(s)) continue;
      if (!s.hasAttribute('no-rail')) s.setAttribute('no-rail', 'true');
      var st = document.createElement('style');
      st.setAttribute('data-dt-norail', '1');
      st.textContent = CSS;
      sr.appendChild(st);
      done.add(s);
      changed = true;
    }
    // Hantar resize SEKALI sahaja selepas ada perubahan sebenar — bukan setiap kali dipanggil.
    if (changed) setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 60);
    return stages.length > 0 && changed;
  }

  var tries = 0;
  (function tick() {
    var ok = apply();
    if (!ok && tries++ < 60) setTimeout(tick, 250);
  })();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
