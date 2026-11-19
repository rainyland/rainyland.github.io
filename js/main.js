/* 秦润林 · 大学生活作品集
   交互只做三件事：回到顶部、SOP 折叠、侧栏跟随
   无依赖，原生 JS */

(function () {
  'use strict';

  /* ---------- 1. 回到顶部 ---------- */

  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', '回到顶部');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);

  function toggleToTop() {
    toTop.classList.toggle('show', window.scrollY > 400);
  }

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();

  /* ---------- 2. SOP 折叠（“抄改三步法”案例） ----------
     第一步·抄：单开折叠的思路来自常见的原生 JS 手风琴写法——点击标题 → 收起其他条目 → 切换当前条目展开态。
     第二步·改：在通用写法上补了 aria-expanded 无障碍属性；用 forEach 遍历兄弟条目统一收起；
               展开状态与标题属性同步更新。
     第三步·用：理解每一行后自己重写，事件绑定在标题 .acc-h 上，展开状态挂在 .open 类。 */

  var items = Array.prototype.slice.call(document.querySelectorAll('.acc-item'));

  items.forEach(function (item) {
    var head = item.querySelector('.acc-h');
    if (!head) return;

    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      items.forEach(function (other) {
        if (other === item) return;
        other.classList.remove('open');
        var otherHead = other.querySelector('.acc-h');
        if (otherHead) otherHead.setAttribute('aria-expanded', 'false');
      });

      item.classList.toggle('open', !isOpen);
      head.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- 3. 侧栏跟随当前小节 ---------- */

  var sideLinks = Array.prototype.slice.call(document.querySelectorAll('.sidenav a'));
  var blocks = sideLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (blocks.length) {
    var ticking = false;

    function markCurrent() {
      var current = null;
      blocks.forEach(function (block) {
        if (block.getBoundingClientRect().top <= 130) current = block;
      });

      sideLinks.forEach(function (link) {
        var on = current && link.getAttribute('href') === '#' + current.id;
        link.style.color = on ? '#12324C' : '';
        link.style.borderBottomColor = on ? '#12324C' : '';
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(markCurrent);
    }, { passive: true });

    markCurrent();
  }
})();
