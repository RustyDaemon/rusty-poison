(function () {
  function findTarget(href) {
    if (!href || href[0] !== '#') return null;
    try {
      return document.querySelector(href);
    } catch (e) {
      return null;
    }
  }

  function showPopover(anchor, target) {
    hidePopover();
    var clone = target.cloneNode(true);
    clone.querySelectorAll('.footnote-backref').forEach(function (n) { n.remove(); });
    var pop = document.createElement('div');
    pop.className = 'footnote-popover';
    pop.appendChild(clone);
    document.body.appendChild(pop);

    var rect = anchor.getBoundingClientRect();
    var popRect = pop.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 6;
    var left = rect.left + window.scrollX;
    if (left + popRect.width > document.documentElement.clientWidth - 16) {
      left = document.documentElement.clientWidth - popRect.width - 16;
    }
    pop.style.top = top + 'px';
    pop.style.left = Math.max(8, left) + 'px';
    pop._anchor = anchor;
  }

  function hidePopover() {
    document.querySelectorAll('.footnote-popover').forEach(function (n) { n.remove(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var refs = document.querySelectorAll('.prose sup a[href^="#fn:"], .prose .footnote-ref a');
    refs.forEach(function (a) {
      a.parentElement.classList.add('footnote-ref');
      a.addEventListener('mouseenter', function () {
        var t = findTarget(a.getAttribute('href'));
        if (t) showPopover(a, t);
      });
      a.addEventListener('focus', function () {
        var t = findTarget(a.getAttribute('href'));
        if (t) showPopover(a, t);
      });
      a.addEventListener('mouseleave', hidePopover);
      a.addEventListener('blur', hidePopover);
    });
    document.addEventListener('scroll', hidePopover, { passive: true });
  });
})();
