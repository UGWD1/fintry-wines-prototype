
/* Fintry Wines prototype — interactions */
(function () {
  'use strict';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Mega menus ---------- */
  var menuButtons = $$('[data-menu]');
  function closeMenus(except) {
    menuButtons.forEach(function (btn) {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = true;
    });
  }
  menuButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeMenus(btn);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = open;
    });
  });
  $$('.fw-menu').forEach(function (panel) {
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
  });
  document.addEventListener('click', function () { closeMenus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openBtn = menuButtons.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
      closeMenus();
      if (openBtn) openBtn.focus();
    }
  });

  /* ---------- Basket count (kept between pages) ---------- */
  var badge = $('#basket-count');
  function getCount() {
    try { var v = parseInt(localStorage.getItem('fintry-basket'), 10); return isNaN(v) ? 3 : v; } catch (e) { return 3; }
  }
  function setCount(n) {
    try { localStorage.setItem('fintry-basket', String(n)); } catch (e) {}
    if (badge) {
      badge.textContent = n;
      badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
    }
  }
  if (badge) badge.textContent = getCount();

  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  $$('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setCount(getCount() + 1);
      var name = (btn.getAttribute('aria-label') || '').replace(/^Add /, '').replace(/ to basket$/, '');
      showToast('Added to basket: ' + name);
    });
  });

  /* ---------- Save (heart) ---------- */
  $$('[data-save]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', on ? 'false' : 'true');
      showToast(on ? 'Removed from saved wines' : 'Saved to your wishlist');
    });
  });

  /* ---------- Homepage: bestseller tabs ---------- */
  var tabs = $$('[data-tab]');
  var grid = $('#bestsellers');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var t = tab.getAttribute('data-tab');
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === tab ? 'true' : 'false'); });
      var shown = 0;
      $$('.fw-product', grid).forEach(function (card) {
        var match = t === 'All' || card.getAttribute('data-type') === t;
        var show = match && shown < 4;
        card.hidden = !show;
        if (show) shown++;
      });
    });
  });

  /* ---------- Newsletter ---------- */
  $$('[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.innerHTML = '<p style="margin:0;font-size:17px;font-weight:600;color:#2F4A3A">Thank you. You are on the Fintry list.</p>';
    });
  });

  /* ---------- Shop: location filters ---------- */
  var countryBoxes = $$('input[data-country]');
  var chips = $('#country-chips');
  var results = $('#results');
  function applyFilters() {
    var active = countryBoxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute('data-country'); });
    var count = 0;
    $$('.fw-product', results).forEach(function (card) {
      var show = active.length === 0 || active.indexOf(card.getAttribute('data-country')) !== -1;
      card.hidden = !show;
      if (show) count++;
    });
    var rc = $('#result-count'); if (rc) rc.textContent = count;
    var empty = $('#no-results'); if (empty) empty.hidden = count !== 0;
    if (chips) {
      chips.innerHTML = '';
      active.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'fw-chip';
        b.setAttribute('aria-label', 'Remove ' + c + ' filter');
        b.innerHTML = c + ' <span aria-hidden="true" style="font-size:16px">×</span>';
        b.addEventListener('click', function () {
          countryBoxes.forEach(function (box) { if (box.getAttribute('data-country') === c) box.checked = false; });
          applyFilters();
        });
        chips.appendChild(b);
      });
    }
  }
  if (results) {
    countryBoxes.forEach(function (b) { b.addEventListener('change', applyFilters); });
    var clear = $('#clear-filters');
    if (clear) clear.addEventListener('click', function () {
      countryBoxes.forEach(function (b) { b.checked = false; });
      applyFilters();
    });
    var ft = $('#filters-toggle'), aside = $('#filters');
    if (ft && aside) ft.addEventListener('click', function () {
      var open = aside.classList.toggle('open');
      ft.setAttribute('aria-expanded', open ? 'true' : 'false');
      ft.textContent = open ? 'Hide filters' : 'Show filters';
    });
    var q = new URLSearchParams(location.search).get('q');
    if (q) showToast('Search for “' + q + '” — results are sample data in this prototype');
  }

  /* ---------- Product: purchase options ---------- */
  var opts = $$('.fw-opt');
  if (opts.length) {
    var qty = 1;
    var qtyEl = $('#qty'), totalEl = $('#total');
    function current() { return opts.filter(function (o) { return o.getAttribute('aria-pressed') === 'true'; })[0] || opts[0]; }
    function update() {
      var each = parseFloat(current().getAttribute('data-each'));
      if (qtyEl) qtyEl.textContent = qty;
      if (totalEl) totalEl.textContent = '£' + (each * qty).toFixed(2);
    }
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        opts.forEach(function (x) { x.setAttribute('aria-pressed', x === o ? 'true' : 'false'); });
        update();
      });
    });
    var inc = $('#qty-inc'), dec = $('#qty-dec');
    if (inc) inc.addEventListener('click', function () { qty++; update(); });
    if (dec) dec.addEventListener('click', function () { qty = Math.max(1, qty - 1); update(); });
    var add = $('#add-to-basket');
    if (add) add.addEventListener('click', function () {
      var units = current().getAttribute('data-opt') === 'case' ? 12 * qty : qty;
      setCount(getCount() + units);
      showToast('Added ' + units + (units === 1 ? ' bottle' : ' bottles') + ' of Les Terrasses du Sud');
    });
    update();
  }
})();
