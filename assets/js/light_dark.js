(function () {
  function setTheme(theme, persist) {
    var html = document.documentElement;
    var body = document.body;
    if (theme === 'dark') {
      html.classList.add('dark-theme');
      if (body) body.classList.add('dark-theme');
    } else {
      html.classList.remove('dark-theme');
      if (body) body.classList.remove('dark-theme');
    }
    if (persist) localStorage.setItem('theme', theme);
    document.querySelectorAll('.theme-icon-moon').forEach(function (n) {
      n.style.display = theme === 'dark' ? 'none' : '';
    });
    document.querySelectorAll('.theme-icon-sun').forEach(function (n) {
      n.style.display = theme === 'dark' ? '' : 'none';
    });
    if (window.REMARK42 && typeof window.REMARK42.changeTheme === 'function') {
      window.REMARK42.changeTheme(theme);
    }
  }

  function currentTheme() {
    return document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTheme(currentTheme(), false);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next, true);
      });
    });

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  });
})();
