(function () {
  var STORAGE_KEY = 'tocCollapsed';

  function setCollapsed(toc, collapsed) {
    var btn = toc.querySelector('[data-toc-toggle]');
    if (collapsed) {
      toc.classList.add('is-collapsed');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Expand table of contents');
        btn.title = 'Expand table of contents';
      }
    } else {
      toc.classList.remove('is-collapsed');
      if (btn) {
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Collapse table of contents');
        btn.title = 'Collapse table of contents';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toc = document.querySelector('[data-toc]');
    if (toc) {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '1') setCollapsed(toc, true);
      var btn = toc.querySelector('[data-toc-toggle]');
      if (btn) {
        btn.addEventListener('click', function () {
          var collapsed = !toc.classList.contains('is-collapsed');
          setCollapsed(toc, collapsed);
          localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
        });
      }
    }

    var tocNavs = document.querySelectorAll('[data-toc] nav#TableOfContents, .toc-inline nav#TableOfContents');
    if (!tocNavs.length) return;
    var links = [];
    tocNavs.forEach(function (nav) {
      nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links.push(a); });
    });
    if (!links.length) return;

    var byId = {};
    links.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      (byId[id] = byId[id] || []).push(a.parentElement);
    });

    var headings = Array.prototype.slice.call(
      document.querySelectorAll('.prose :is(h2,h3,h4)[id]')
    );
    if (!headings.length) return;

    function clearActive() {
      links.forEach(function (a) { a.parentElement.classList.remove('active'); });
    }

    var activeId = null;
    function update() {
      var threshold = 120;
      var current = headings[0];
      for (var i = 0; i < headings.length; i++) {
        var rect = headings[i].getBoundingClientRect();
        if (rect.top - threshold <= 0) {
          current = headings[i];
        } else {
          break;
        }
      }
      if (window.scrollY < threshold) {
        current = headings[0];
      }
      var lis = current && byId[current.id];
      if (!lis || !lis.length) return;
      if (current.id === activeId) return;
      activeId = current.id;
      clearActive();
      lis.forEach(function (li) { li.classList.add('active'); });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
