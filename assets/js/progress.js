(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.querySelector('[data-progress-bar]');
    var article = document.querySelector('article.post');
    if (!bar || !article) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bar.style.transition = 'none';
    }

    var ticking = false;
    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = -rect.top;
      var pct = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      bar.style.width = (pct * 100).toFixed(1) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
