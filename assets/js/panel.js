(function () {
  function setOpen(panel, open) {
    var btn = panel.querySelector('[data-panel-toggle]');
    if (open) {
      panel.classList.add('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
      panel.classList.remove('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    var openIcon = panel.querySelector('.panel-icon-open');
    var closeIcon = panel.querySelector('.panel-icon-close');
    if (openIcon) openIcon.style.display = open ? 'none' : '';
    if (closeIcon) closeIcon.style.display = open ? '' : 'none';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.querySelector('[data-panel]');
    if (!panel) return;
    var btn = panel.querySelector('[data-panel-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      setOpen(panel, !panel.classList.contains('is-open'));
    });

    panel.querySelectorAll('.panel-drawer a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 55.99em)').matches) {
          setOpen(panel, false);
        }
      });
    });
  });
})();
