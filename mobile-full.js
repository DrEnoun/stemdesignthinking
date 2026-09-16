/* Paparan penuh: matikan rel thumbnail deck-stage dan minta ia mengira semula skala. */
(function () {
  window.__dtFull = true;
  var tries = 0;
  function apply() {
    var s = document.querySelector('deck-stage');
    if (s) {
      if (!s.hasAttribute('no-rail')) s.setAttribute('no-rail', 'true');
      if (s.style) s.style.removeProperty('--deck-rail-w');
      window.dispatchEvent(new Event('resize'));
    }
    if (tries++ < 80) window.setTimeout(apply, 150);
  }
  apply();
  window.addEventListener('load', apply);
  document.addEventListener('DOMContentLoaded', apply);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
