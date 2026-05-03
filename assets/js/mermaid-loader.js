(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var blocks = document.querySelectorAll('pre.mermaid');
    if (!blocks.length) return;

    import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs').then(function (m) {
      var mermaid = m.default;
      var isDark = document.documentElement.classList.contains('dark-theme');
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'strict',
        fontFamily: 'inherit',
      });
      mermaid.run({ nodes: blocks });
    }).catch(function (err) {
      console.warn('mermaid load failed', err);
    });
  });
})();
