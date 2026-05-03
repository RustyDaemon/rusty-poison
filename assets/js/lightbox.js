(function () {
  var box = null;
  function ensureBox() {
    if (box) return box;
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<img alt="">';
    box.addEventListener('click', close);
    document.body.appendChild(box);
    return box;
  }
  function open(src, alt) {
    var b = ensureBox();
    var img = b.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    b.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    if (!box) return;
    box.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
  document.addEventListener('DOMContentLoaded', function () {
    var imgs = document.querySelectorAll('.post-image img');
    imgs.forEach(function (img) {
      img.addEventListener('click', function () {
        var src = img.currentSrc || img.src;
        open(src, img.alt);
      });
    });
  });
})();
