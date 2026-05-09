(function () {
  var modal = null;
  var input = null;
  var results = null;
  var pf = null;
  var debounceTimer = null;
  var lastQuery = '';
  var activeIndex = -1;

  function loadPagefind() {
    if (pf) return Promise.resolve(pf);
    return import('/pagefind/pagefind.js').then(function (m) {
      pf = m;
      if (m.options) m.options({ excerptLength: 28 });
      return m;
    }).catch(function (err) {
      console.warn('pagefind not available', err);
      return null;
    });
  }

  function open() {
    if (!modal) return;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.documentElement.style.overflow = 'hidden';
    input && input.focus();
    loadPagefind();
  }
  function close() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 160);
  }

  function render(items) {
    if (!results) return;
    if (!items || !items.length) {
      results.innerHTML = '<div class="search-empty">' + (lastQuery ? 'no results for "' + escapeHtml(lastQuery) + '"' : 'type to search') + '</div>';
      activeIndex = -1;
      return;
    }
    results.innerHTML = items.map(function (it, i) {
      return '<a class="search-result" href="' + it.url + '" data-i="' + i + '">' +
        '<div class="title">' + (it.meta && it.meta.title ? escapeHtml(it.meta.title) : it.url) + '</div>' +
        '<div class="excerpt">' + it.excerpt + '</div>' +
        '</a>';
    }).join('');
    activeIndex = -1;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c];
    });
  }

  function setActive(i) {
    var nodes = results.querySelectorAll('.search-result');
    if (!nodes.length) return;
    if (i < 0) i = nodes.length - 1;
    if (i >= nodes.length) i = 0;
    nodes.forEach(function (n) { n.classList.remove('is-active'); });
    nodes[i].classList.add('is-active');
    nodes[i].scrollIntoView({ block: 'nearest' });
    activeIndex = i;
  }

  function search(q) {
    lastQuery = q;
    if (!q || q.length < 2) {
      render([]);
      return;
    }
    loadPagefind().then(function (m) {
      if (!m) {
        results.innerHTML = '<div class="search-empty">search index not built - run <code>npm run search</code></div>';
        return;
      }
      m.search(q).then(function (s) {
        if (!s) { render([]); return; }
        Promise.all(s.results.slice(0, 8).map(function (r) { return r.data(); })).then(render);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    modal = document.querySelector('[data-search-modal]');
    input = document.querySelector('[data-search-input]');
    results = document.querySelector('[data-search-results]');
    if (!modal) return;

    document.querySelectorAll('[data-search-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) close();
    });

    if (input) {
      input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        var q = input.value;
        debounceTimer = setTimeout(function () { search(q); }, 120);
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
        else if (e.key === 'Enter') {
          var nodes = results.querySelectorAll('.search-result');
          if (activeIndex >= 0 && nodes[activeIndex]) {
            window.location.href = nodes[activeIndex].href;
          } else if (nodes[0]) {
            window.location.href = nodes[0].href;
          }
        }
      });
    }
  });
})();
