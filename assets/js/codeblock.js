(function () {
  function detectLang(pre) {
    var classes = (pre.className || '') + ' ' + ((pre.firstElementChild && pre.firstElementChild.className) || '');
    var m = classes.match(/language-([a-z0-9+#-]+)/i);
    if (m) return m[1];
    if (pre.classList.contains('mermaid')) return 'mermaid';
    return '';
  }

  function enhance(pre) {
    if (pre.parentElement && pre.parentElement.classList.contains('codeblock')) return;
    if (pre.classList.contains('mermaid')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'codeblock';

    var header = document.createElement('div');
    header.className = 'codeblock-header';
    var lang = detectLang(pre);
    var label = document.createElement('span');
    label.className = 'lang';
    label.textContent = lang || 'code';
    header.appendChild(label);

    var actions = document.createElement('div');
    actions.className = 'actions';
    var wrapBtn = document.createElement('button');
    wrapBtn.type = 'button';
    wrapBtn.className = 'codeblock-action';
    wrapBtn.textContent = 'wrap';
    wrapBtn.title = 'Toggle line wrap';
    wrapBtn.addEventListener('click', function () {
      wrapper.classList.toggle('wrap');
    });
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'codeblock-action';
    copyBtn.textContent = 'copy';
    copyBtn.title = 'Copy code';
    copyBtn.addEventListener('click', function () {
      var code = pre.querySelector('code') || pre;
      var text = code.innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = 'copied ✓';
          copyBtn.classList.add('success');
          setTimeout(function () {
            copyBtn.textContent = 'copy';
            copyBtn.classList.remove('success');
          }, 1200);
        });
      }
    });
    actions.appendChild(wrapBtn);
    actions.appendChild(copyBtn);
    header.appendChild(actions);

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var pres = document.querySelectorAll('.prose pre');
    pres.forEach(enhance);
    var highlights = document.querySelectorAll('.prose .highlight pre');
    highlights.forEach(enhance);
  });
})();
