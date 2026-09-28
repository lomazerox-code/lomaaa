/* مركز الصيانة المعتمد — سلوك بسيط لصفحات أدلة الأجهزة (بدون React) */
(function () {
  'use strict';

  var nav = document.querySelector('nav');
  if (!nav) return;

  /* ---- روابط المحافظات (تُقرأ من الفوتر الموجود في الصفحة) ---- */
  var seen = {};
  var govs = [];
  document.querySelectorAll('footer a[href^="/governorate/"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (seen[href]) return;
    seen[href] = 1;
    govs.push({ href: href, label: a.textContent.trim() });
  });

  /* ---- مصنع عام لقوائم الديسكتوب المنسدلة (فروع المحافظات + الأجهزة) ---- */
  function wireDropdown(btn, items, panelClass) {
    if (!btn || !items.length) return;
    var dd = document.createElement('div');
    dd.className = panelClass;
    dd.setAttribute('role', 'menu');
    items.forEach(function (g) {
      var a = document.createElement('a');
      a.href = g.href;
      a.textContent = g.label;
      dd.appendChild(a);
    });
    btn.parentNode.appendChild(dd);
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---- قائمة "فروع المحافظات" الموجودة أصلاً في الموقع ---- */
  var ddBtn = null;
  nav.querySelectorAll('button').forEach(function (b) {
    if (b.textContent.indexOf('فروع المحافظات') !== -1) ddBtn = b;
  });
  wireDropdown(ddBtn, govs, 'gov-dd');

  /* ---- قائمة "الأجهزة" — عنصر إضافي جديد بالكامل، خاص بصفحات /appliances/ فقط ---- */
  var APPLIANCES = [
    ['/appliances/', 'كل الأجهزة'],
    ['/appliances/refrigerators/', 'صيانة الثلاجات'],
    ['/appliances/deep-freezers/', 'صيانة الديب فريزر'],
    ['/appliances/washing-machines/', 'صيانة الغسالات'],
    ['/appliances/air-conditioners/', 'صيانة التكييفات'],
    ['/appliances/tvs/', 'صيانة الشاشات'],
    ['/appliances/microwaves/', 'صيانة الميكروويف'],
    ['/appliances/water-heaters/', 'صيانة سخانات المياه'],
    ['/appliances/dishwashers/', 'صيانة غسالات الأطباق']
  ].map(function (x) { return { href: x[0], label: x[1] }; });
  wireDropdown(document.getElementById('app-dd-btn'), APPLIANCES, 'gov-dd app-dd');

  /* ---- قائمة الموبايل ---- */
  var menuBtn = nav.querySelector('button[aria-label="فتح القائمة"]');
  if (menuBtn) {
    var links = [
      ['/', 'الرئيسية'], ['/about/', 'من نحن'], ['/brands/', 'الماركات'],
      ['/services/', 'خدماتنا'], ['/appliances/', 'أدلة الأجهزة'],
      ['/faults/', 'جدول الأعطال'], ['/contact/', 'اتصل بنا']
    ];
    var m = document.createElement('div');
    m.className = 'm-menu';
    var html = '<div class="panel"><div class="hd"><span>مركز الصيانة المعتمد</span><button type="button" aria-label="إغلاق القائمة">×</button></div>';
    links.forEach(function (l) { html += '<a href="' + l[0] + '">' + l[1] + '</a>'; });
    html += '<a href="tel:19580" style="background:#facc15;color:#172554;margin-top:.75rem;text-align:center">اتصل الآن: 19580</a>';
    html += '<a href="tel:15607" style="background:rgba(255,255,255,.12);margin-top:.5rem;text-align:center">15607</a>';
    html += '<h4>أدلة الأجهزة</h4><div class="sub">';
    APPLIANCES.slice(1).forEach(function (g) { html += '<a href="' + g.href + '">' + g.label + '</a>'; });
    html += '</div>';
    if (govs.length) {
      html += '<h4>فروع المحافظات</h4><div class="sub">';
      govs.forEach(function (g) { html += '<a href="' + g.href + '">' + g.label + '</a>'; });
      html += '</div>';
    }
    html += '</div>';
    m.innerHTML = html;
    document.body.appendChild(m);
    function setOpen(v) {
      m.classList.toggle('open', v);
      document.body.classList.toggle('no-scroll', v);
    }
    menuBtn.addEventListener('click', function () { setOpen(true); });
    m.addEventListener('click', function (e) {
      if (e.target === m || (e.target.closest && e.target.closest('.hd button')) || (e.target.tagName === 'A')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }
})();
