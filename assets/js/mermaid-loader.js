(function () {
  var bundlePromise = null; // cached import of the mermaid bundle
  var seq = 0; // unique id counter for mermaid.render

  // Non-static specifier: esbuild leaves this as a runtime import() so the
  // mermaid bundle stays out of the core chunk and loads only on demand.
  function loadBundle() {
    if (!bundlePromise) {
      bundlePromise = import(/* @vite-ignore */ window.__mermaidURL);
    }
    return bundlePromise;
  }

  function loadMermaid() {
    return loadBundle().then(function (m) { return m.mermaid; });
  }

  function loadPanzoom() {
    return loadBundle().then(function (m) { return m.svgPanZoom; });
  }

  // Read resolved site CSS custom properties so diagrams follow the rust
  // palette and stay correct in whichever theme is active right now.
  function palette() {
    var cs = getComputedStyle(document.documentElement);
    function v(name, fallback) {
      var got = cs.getPropertyValue(name).trim();
      return got || fallback;
    }
    var accent = v('--color-accent', '#e25822');
    var accentStrong = v('--color-accent-strong', '#c0481a');
    var bg = v('--bg', '#0e0f10');
    var bgSoft = v('--bg-soft', '#161719');
    var bgRaised = v('--bg-raised', '#1c1d20');
    var fg = v('--fg', '#ececec');
    var border = v('--border', '#2a2b2e');
    var danger = v('--color-danger', '#d65a5a');
    return {
      primaryColor: bgSoft,
      mainBkg: bgSoft,
      secondaryColor: bgRaised,
      tertiaryColor: bg,
      background: bg,
      primaryTextColor: fg,
      textColor: fg,
      secondaryTextColor: fg,
      tertiaryTextColor: fg,
      primaryBorderColor: accent,
      nodeBorder: accent,
      lineColor: accentStrong,
      titleColor: accent,
      clusterBkg: bg,
      clusterBorder: border,
      edgeLabelBackground: bgSoft,
      noteBkgColor: 'color-mix(in srgb, ' + accent + ' 12%, ' + bgSoft + ')',
      noteBorderColor: accent,
      noteTextColor: fg,
      errorBkgColor: danger,
      errorTextColor: fg
    };
  }

  function copyButton(getSource) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'codeblock-action';
    btn.textContent = 'copy';
    btn.title = 'Copy diagram source';
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(getSource()).then(function () {
        btn.textContent = 'copied ✓';
        btn.classList.add('success');
        setTimeout(function () {
          btn.textContent = 'copy';
          btn.classList.remove('success');
        }, 1200);
      });
    });
    return btn;
  }

  // Ensure the <pre> is wrapped once with a toolbar; returns the wrapper.
  function ensureWrap(pre) {
    if (pre.parentElement && pre.parentElement.classList.contains('mermaid-wrap')) {
      return pre.parentElement;
    }
    var wrap = document.createElement('div');
    wrap.className = 'mermaid-wrap';

    var toolbar = document.createElement('div');
    toolbar.className = 'mermaid-toolbar';

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'codeblock-action mermaid-reset';
    resetBtn.textContent = 'reset view';
    resetBtn.title = 'Reset zoom & pan';
    resetBtn.hidden = true;
    resetBtn.addEventListener('click', function () {
      var inst = pre._panzoom;
      if (inst) { inst.resetZoom(); inst.center(); inst.fit(); }
    });

    toolbar.appendChild(resetBtn);
    toolbar.appendChild(copyButton(function () { return pre.dataset.mmdSource || ''; }));

    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(toolbar);
    wrap.appendChild(pre);
    pre._resetBtn = resetBtn;
    return wrap;
  }

  function showError(pre, source, err) {
    teardownPanzoom(pre);
    pre.innerHTML = '';
    var box = document.createElement('div');
    box.className = 'mermaid-error';
    var msg = document.createElement('p');
    msg.className = 'mermaid-error-msg';
    msg.textContent = 'Diagram failed to render: ' + ((err && err.message) || err || 'unknown error');
    var details = document.createElement('details');
    var summary = document.createElement('summary');
    summary.textContent = 'Show diagram source';
    var code = document.createElement('pre');
    code.className = 'mermaid-error-src';
    code.textContent = source;
    details.appendChild(summary);
    details.appendChild(code);
    box.appendChild(msg);
    box.appendChild(details);
    pre.appendChild(box);
    if (pre._resetBtn) pre._resetBtn.hidden = true;
  }

  function teardownPanzoom(pre) {
    if (pre._panzoom) {
      try { pre._panzoom.destroy(); } catch (e) { /* noop */ }
      pre._panzoom = null;
    }
  }

  // Enable pan/zoom for diagrams that are larger than a comfortable size.
  function maybePanzoom(pre) {
    var svg = pre.querySelector('svg');
    if (!svg) return;
    var box;
    try { box = svg.getBBox(); } catch (e) { return; }
    var large = box.width > 800 || box.height > 600;
    if (!large) {
      if (pre._resetBtn) pre._resetBtn.hidden = true;
      return;
    }
    loadPanzoom().then(function (svgPanZoom) {
      teardownPanzoom(pre);
      svg.style.maxWidth = 'none';
      svg.style.width = '100%';
      svg.style.height = Math.min(box.height, 560) + 'px';
      pre.classList.add('has-panzoom');
      pre._panzoom = svgPanZoom(svg, {
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.5,
        maxZoom: 8,
        zoomScaleSensitivity: 0.3
      });
      if (pre._resetBtn) pre._resetBtn.hidden = false;
    }).catch(function (e) {
      console.warn('svg-pan-zoom load failed', e);
    });
  }

  function renderOne(mermaid, pre) {
    var source = pre.dataset.mmdSource;
    var id = 'mmd-' + (seq++);
    return mermaid.render(id, source).then(function (out) {
      teardownPanzoom(pre);
      pre.classList.remove('has-panzoom');
      pre.innerHTML = out.svg;
      if (typeof out.bindFunctions === 'function') out.bindFunctions(pre);
      maybePanzoom(pre);
    }).catch(function (err) {
      showError(pre, source, err);
    });
  }

  function renderAll() {
    var blocks = document.querySelectorAll('pre.mermaid');
    if (!blocks.length) return;
    loadMermaid().then(function (mermaid) {
      var isDark = document.documentElement.classList.contains('dark-theme');
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: palette(),
        securityLevel: 'strict',
        fontFamily: 'inherit',
        darkMode: isDark
      });
      blocks.forEach(function (pre) {
        // Capture the original source once; mermaid replaces innerHTML
        // with SVG on render, so subsequent re-renders read it from here.
        if (pre.dataset.mmdSource == null) {
          pre.dataset.mmdSource = pre.textContent.trim();
        }
        ensureWrap(pre);
        renderOne(mermaid, pre);
      });
    }).catch(function (err) {
      console.warn('mermaid load failed', err);
    });
  }

  // Exposed so the theme toggle can recolor diagrams live (see light_dark.js).
  window.__mermaidRerender = renderAll;

  document.addEventListener('DOMContentLoaded', renderAll);
})();
