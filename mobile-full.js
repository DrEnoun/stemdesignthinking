/* Paparan penuh: matikan rel thumbnail deck-stage (light DOM + shadow DOM) dan minta ia mengira semula skala. */
(function () {
  window.__dtFull = true;

  var CSS = '.rail,.rail-resize{display:none !important}' +
            '.stage{left:0 !important;width:100% !important}' +
            '.overlay{margin-left:0 !important}';

  function findStages() {
    var out = [];
    function walk(root) {
      var list = root.querySelectorAll ? root.querySelectorAll('*') : [];
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (el.tagName && el.tagName.toLowerCase() === 'deck-stage') out.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    }
    walk(document);
    return out;
  }

  function apply() {
    var stages = findStages();
    for (var i = 0; i < stages.length; i++) {
      var s = stages[i];
      if (!s.hasAttribute('no-rail')) s.setAttribute('no-rail', 'true');
      if (s.style) s.style.removeProperty('--deck-rail-w');
      var sr = s.shadowRoot;
      if (sr && !sr.querySelector('style[data-dt-norail]')) {
        var st = document.createElement('style');
        st.setAttribute('data-dt-norail', '1');
        st.textContent = CSS;
        sr.appendChild(st);
      }
      if (sr) {
        var r = sr.querySelector('.rail');
        if (r) r.style.setProperty('display', 'none', 'important');
        var rr = sr.querySelector('.rail-resize');
        if (rr) rr.style.setProperty('display', 'none', 'important');
      }
    }
    if (stages.length) window.dispatchEvent(new Event('resize'));
  }

  var tries = 0;
  function tick() {
    apply();
    if (tries++ < 200) window.setTimeout(tick, 150);
  }
  tick();
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply);
  window.addEventListener('resize', apply);
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
