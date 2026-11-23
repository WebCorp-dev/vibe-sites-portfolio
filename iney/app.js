/* ИНЕЙ — вся интерактивность. Без зависимостей и сборки. */
(function () {
  'use strict';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const money = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  const store = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* приватный режим */ }
    }
  };
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  /* ═══════════════ 1. Статус работы ═══════════════ */
  function initStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 — вс
    const late = day === 0 || day === 5 || day === 6; // пт–вс
    const openH = late ? 9 : 10;
    const closeH = late ? 24 : 23;
    const h = now.getHours() + now.getMinutes() / 60;
    const open = h >= openH && h < closeH;
    const el = $('#openStatus');
    const text = $('#statusText');
    if (!el || !text) return;
    if (open) {
      text.textContent = closeH === 24 ? 'открыто до 00:00' : 'открыто до 23:00';
    } else {
      el.classList.add('closed');
      text.textContent = h < openH ? 'закрыто · откроемся в ' + openH + ':00' : 'закрыто · до завтра';
    }
  }

  /* ═══════════════ 2. Меню ═══════════════ */
  const volState = {}; // id -> индекс выбранного объёма
  let activeCat = 'all';
  let query = '';
  let activeFilters = new Set();

  function itemPrice(item, volIndex) {
    if (item.vols) return item.vols[volIndex || 0].price;
    return item.price;
  }

  function cardHTML(item, index) {
    const vols = item.vols || [];
    const vi = Math.min(volState[item.id] || 0, Math.max(vols.length - 1, 0));
    const price = itemPrice(item, vi);
    const volLabel = vols.length ? vols[vi].ml + ' мл' : (item.cat === 'dessert' || item.cat === 'food' || item.cat === 'breakfast' ? 'порция' : '');
    const tags = [];
    if (item.tags && item.tags.includes('vegan')) tags.push('vegan');
    else if (item.tags && item.tags.includes('veg')) tags.push('без мяса');
    const badge = item.badge ? '<span class="badge">' + item.badge + '</span>' : '';
    const volBtns = vols.length > 1
      ? '<div class="vols" role="group" aria-label="Объём">' + vols.map((v, i) =>
          '<button data-vol="' + i + '" class="' + (i === vi ? 'on' : '') + '" aria-pressed="' + (i === vi) + '">' + v.ml + ' мл</button>'
        ).join('') + '</div>'
      : '';

    return '' +
      '<article class="card" data-id="' + item.id + '" style="animation-delay:' + Math.min(index * 24, 300) + 'ms">' +
        '<div class="card-media">' +
          '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" width="640" height="480" />' +
          badge +
          '<span class="card-idx">' + String(MENU.indexOf(item) + 1).padStart(2, '0') + ' / 44</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-title"><h3>' + item.name + '</h3><span class="dots"></span><b class="price">' + money(price) + '</b></div>' +
          '<p class="card-desc">' + item.desc + '</p>' +
          '<div class="card-meta">' +
            (volLabel ? '<span>' + volLabel + '</span>' : '') +
            (item.weight ? '<span class="card-weight">' + item.weight + '</span>' : '') +
            '<span>' + item.kcal + ' ккал</span>' +
            (tags.length ? '<span class="tag">' + tags[0] + '</span>' : '') +
          '</div>' +
          volBtns +
          '<div class="card-foot">' +
            '<span class="card-price-mono">' + (vols.length ? 'объём: ' + vols[vi].ml + ' мл' : 'в наличии') + '</span>' +
            '<button class="add" data-add="' + item.id + '"><svg class="ico"><use href="#i-plus"/></svg> В заказ</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderTabs() {
    const box = $('#tabs');
    box.innerHTML = CATS.map(c =>
      '<button role="tab" aria-selected="' + (c.id === activeCat) + '" class="' + (c.id === activeCat ? 'on' : '') + '" data-cat="' + c.id + '">' + c.label + '</button>'
    ).join('');
  }

  function renderFilters() {
    const box = $('#filters');
    box.innerHTML = FILTERS.map(f =>
      '<button data-filter="' + f.id + '" class="' + (activeFilters.has(f.id) ? 'on' : '') + '" aria-pressed="' + activeFilters.has(f.id) + '">' + f.label + '</button>'
    ).join('');
  }

  function matches(item) {
    if (activeCat !== 'all' && item.cat !== activeCat) return false;
    if (query) {
      const hay = (item.name + ' ' + item.desc + ' ' + (item.tags || []).join(' ')).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    for (const f of activeFilters) {
      if (f === 'vegan' && !(item.tags || []).includes('vegan')) return false;
      if (f === 'veg' && !(item.tags || []).includes('veg') && !(item.tags || []).includes('vegan')) return false;
      if (f === 'cold' && !(item.tags || []).includes('cold')) return false;
      if (f === 'light' && item.kcal > 300) return false;
    }
    return true;
  }

  function renderMenu() {
    const grid = $('#menuGrid');
    const list = MENU.filter(matches);
    grid.innerHTML = list.map(cardHTML).join('');
    const count = $('#menuCount');
    const word = list.length % 10 === 1 && list.length % 100 !== 11 ? 'позиция'
      : ([2, 3, 4].includes(list.length % 10) && ![12, 13, 14].includes(list.length % 100) ? 'позиции' : 'позиций');
    count.textContent = list.length + ' ' + word;
    $('#menuEmpty').hidden = list.length > 0;
    $('#menuGrid').hidden = list.length === 0;
  }

  function bindMenu() {
    $('#tabs').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      activeCat = btn.dataset.cat;
      $$('#tabs button').forEach(b => {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', String(on));
      });
      renderMenu();
    });

    $('#filters').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const f = btn.dataset.filter;
      if (activeFilters.has(f)) activeFilters.delete(f); else activeFilters.add(f);
      btn.classList.toggle('on');
      btn.setAttribute('aria-pressed', String(activeFilters.has(f)));
      renderMenu();
    });

    let t;
    const input = $('#search');
    input.addEventListener('input', () => {
      clearTimeout(t);
      $('#searchClear').hidden = !input.value;
      t = setTimeout(() => { query = input.value.trim().toLowerCase(); renderMenu(); }, 140);
    });
    $('#searchClear').addEventListener('click', () => {
      input.value = ''; query = ''; $('#searchClear').hidden = true; renderMenu(); input.focus();
    });
    $('#resetMenu').addEventListener('click', () => {
      activeCat = 'all'; query = ''; activeFilters.clear();
      input.value = ''; $('#searchClear').hidden = true;
      renderTabs(); renderFilters(); renderMenu();
    });

    const grid = $('#menuGrid');

    grid.addEventListener('click', (e) => {
      const volBtn = e.target.closest('[data-vol]');
      if (volBtn) {
        const card = volBtn.closest('.card');
        const item = MENU.find(m => m.id === card.dataset.id);
        const vi = Number(volBtn.dataset.vol);
        volState[item.id] = vi;
        $$('[data-vol]', card).forEach(b => {
          const on = b === volBtn;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        $('.price', card).textContent = money(item.vols[vi].price);
        $('.card-price-mono', card).textContent = 'объём: ' + item.vols[vi].ml + ' мл';
        return;
      }

      const addBtn = e.target.closest('[data-add]');
      if (!addBtn) return;
      const item = MENU.find(m => m.id === addBtn.dataset.add);
      if (!item) return;
      const vi = Math.min(volState[item.id] || 0, Math.max((item.vols || []).length - 1, 0));
      const vol = item.vols ? item.vols[vi] : null;
      addToCart({
        key: item.id + ':' + vi,
        name: item.name,
        detail: vol ? vol.ml + ' мл' : (item.weight || (item.cat === 'dessert' ? 'десерт' : 'порция')),
        price: vol ? vol.price : item.price,
        img: item.img
      });
      addBtn.classList.add('added');
      addBtn.innerHTML = '<svg class="ico"><use href="#i-check"/></svg> Добавлено';
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = '<svg class="ico"><use href="#i-plus"/></svg> В заказ';
      }, 1200);
    });

    if (finePointer) {
      grid.addEventListener('pointermove', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
      });
      grid.addEventListener('pointerout', (e) => {
        const card = e.target.closest('.card');
        if (card && !card.contains(e.relatedTarget)) {
          card.style.removeProperty('--rx');
          card.style.removeProperty('--ry');
        }
      });
    }
  }

  /* ═══════════════ 3. Корзина ═══════════════ */
  let cart = store.get('iney-cart-v1', []);
  if (!Array.isArray(cart)) cart = [];
  let promo = null;
  let mode = 'pickup';

  function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
  function cartSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
  function discount() { return promo ? Math.round(cartSubtotal() * 0.1) : 0; }
  function delivery() { return mode === 'delivery' && cartSubtotal() < 1500 ? 149 : 0; }
  function grandTotal() { return Math.max(0, cartSubtotal() - discount()) + delivery(); }

  function saveCart() { store.set('iney-cart-v1', cart); }

  function updateBadge() {
    const count = cartCount();
    $('#cartCount').textContent = count;
    $('#cartSum').textContent = money(cartSubtotal());
    document.title = count ? '(' + count + ') ИНЕЙ — кофейня и десерт-бар' : 'ИНЕЙ — кофейня и десерт-бар в Чебоксарах';
  }

  function addToCart(entry, silent) {
    const found = cart.find(i => i.key === entry.key);
    if (found) found.qty += 1;
    else cart.push(Object.assign({ qty: 1 }, entry));
    saveCart();
    updateBadge();
    renderCart();
    if (!silent) toast(entry.name + ' — в корзине');
  }

  function changeQty(key, delta) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
    saveCart(); updateBadge(); renderCart();
  }

  function removeItem(key) {
    cart = cart.filter(i => i.key !== key);
    saveCart(); updateBadge(); renderCart();
  }

  function renderCart() {
    const list = $('#cartList');
    const empty = $('#cartEmpty');
    const content = $('#cartContent');
    const success = $('#orderSuccess');

    if (!cart.length) {
      empty.hidden = false;
      content.hidden = true;
      if (success) success.hidden = true;
      return;
    }
    empty.hidden = true;
    content.hidden = false;
    success.hidden = true;

    list.innerHTML = cart.map(i =>
      '<li class="cart-item">' +
        '<img src="' + i.img + '" alt="" width="54" height="54" />' +
        '<div class="ci-body">' +
          '<b>' + i.name + '</b>' +
          '<span>' + i.detail + '</span>' +
          '<div class="ci-qty">' +
            '<button data-qty="-1" data-key="' + i.key + '" aria-label="Убрать одну">−</button>' +
            '<b>' + i.qty + '</b>' +
            '<button data-qty="1" data-key="' + i.key + '" aria-label="Добавить одну">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="ci-right"><b>' + money(i.price * i.qty) + '</b>' +
          '<button class="ci-remove" data-remove="' + i.key + '">удалить</button>' +
        '</div>' +
      '</li>'
    ).join('');

    $('#tItems').textContent = money(cartSubtotal());
    const dRow = $('#tDiscountRow');
    if (promo) {
      dRow.hidden = false;
      $('#tDiscount').textContent = '−' + money(discount());
    } else dRow.hidden = true;

    const delRow = $('#tDeliveryRow');
    if (mode === 'delivery') {
      delRow.hidden = false;
      $('#tDelivery').textContent = delivery() ? money(delivery()) : 'бесплатно';
    } else delRow.hidden = true;

    $('#tGrand').textContent = money(grandTotal());
  }

  function openDrawer() {
    $('#drawer').classList.add('open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#overlay').hidden = false;
    document.body.classList.add('locked');
    renderCart();
    setTimeout(() => $('#cartClose').focus(), 80);
  }

  function closeDrawer() {
    $('#drawer').classList.remove('open');
    $('#drawer').setAttribute('aria-hidden', 'true');
    $('#overlay').hidden = true;
    document.body.classList.remove('locked');
    setTimeout(() => {
      $('#orderSuccess').hidden = true;
      if (cart.length) $('#cartContent').hidden = false;
      else { $('#cartContent').hidden = true; $('#cartEmpty').hidden = false; }
    }, 400);
  }

  function bindCart() {
    $('#cartOpen').addEventListener('click', openDrawer);
    $('#cartClose').addEventListener('click', closeDrawer);
    $('#overlay').addEventListener('click', closeDrawer);
    $('#emptyToMenu').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('#drawer').classList.contains('open')) closeDrawer();
    });

    $('#cartList').addEventListener('click', (e) => {
      const q = e.target.closest('[data-qty]');
      if (q) { changeQty(q.dataset.key, Number(q.dataset.qty)); return; }
      const r = e.target.closest('[data-remove]');
      if (r) removeItem(r.dataset.remove);
    });

    $('#promoApply').addEventListener('click', applyPromo);
    $('#promoInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(); } });

    $$('.fulfil button').forEach(btn => {
      btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        $$('.fulfil button').forEach(b => b.classList.toggle('on', b === btn));
        renderCart();
      });
    });

    $('#fPhone').addEventListener('input', (e) => {
      const d = e.target.value.replace(/\D/g, '').replace(/^8/, '7').replace(/^([^7])/, '7$1').slice(0, 11);
      let out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 5) out += ') ' + d.slice(4, 7);
      if (d.length >= 8) out += '-' + d.slice(7, 9);
      if (d.length >= 10) out += '-' + d.slice(9, 11);
      e.target.value = out;
    });

    $('#orderForm').addEventListener('submit', submitOrder);
    $('#successClose').addEventListener('click', () => {
      closeDrawer();
      setTimeout(() => $('#menu').scrollIntoView({ behavior: 'smooth' }), 250);
    });
  }

  function applyPromo() {
    const input = $('#promoInput');
    const hint = $('#promoHint');
    const val = input.value.trim().toUpperCase().replace(/\s+/g, '');
    if (val === 'ИНЕЙ10' || val === 'INEY10') {
      promo = 'ИНЕЙ10';
      hint.textContent = 'Промокод применён: −10% на позиции';
      hint.className = 'promo-hint ok';
    } else if (!val) {
      hint.textContent = 'Введите промокод или оставьте пустым';
      hint.className = 'promo-hint';
    } else {
      promo = null;
      hint.textContent = 'Такого промокода нет. Попробуйте ИНЕЙ10';
      hint.className = 'promo-hint err';
    }
    renderCart();
  }

  async function submitOrder(e) {
    e.preventDefault();
    if (!cart.length) return;
    const name = $('#fName').value.trim();
    const phone = $('#fPhone').value.trim();
    const err = $('#formError');
    if (name.length < 2) {
      err.hidden = false; err.textContent = 'Напишите, как к вам обращаться.'; $('#fName').focus(); return;
    }
    if (phone.replace(/\D/g, '').length < 11) {
      err.hidden = false; err.textContent = 'Проверьте телефон — нужно 11 цифр.'; $('#fPhone').focus(); return;
    }
    err.hidden = true;

    const btn = $('#submitOrder');
    btn.disabled = true;
    const old = btn.innerHTML;
    btn.innerHTML = 'Отправляем…';

    const lines = [
      'Имя: ' + name,
      'Телефон: ' + phone,
      'Когда: ' + $('#fTime').value,
      'Приборов: ' + $('#fPeople').value,
      'Способ: ' + (mode === 'delivery' ? 'доставка' : 'самовывоз'),
      ''
    ];
    cart.forEach(i => lines.push('• ' + i.qty + ' × ' + i.name + ' (' + i.detail + ') — ' + money(i.price * i.qty)));
    lines.push('');
    if (promo) lines.push('Промокод: ' + promo + ' (−10%)');
    lines.push('Позиции: ' + money(cartSubtotal()));
    if (discount()) lines.push('Скидка: −' + money(discount()));
    if (mode === 'delivery') lines.push('Доставка: ' + (delivery() ? money(delivery()) : 'бесплатно'));
    lines.push('ИТОГО: ' + money(grandTotal()));
    const comment = $('#fComment').value.trim();
    if (comment) lines.push('Комментарий: ' + comment);

    let ok = false;
    try {
      if (typeof window.sendLead === 'function') {
        ok = await window.sendLead('ИНЕЙ · сайт', lines, null);
      }
    } catch (e2) { ok = false; }

    btn.disabled = false;
    btn.innerHTML = old;

    if (!ok) {
      err.hidden = false;
      err.textContent = 'Не удалось отправить заказ. Проверьте связь или позвоните: +7 (8352) 00-00-00.';
      return;
    }

    const num = 'ИН-' + String(Math.floor(1000 + Math.random() * 9000));
    $('#successText').textContent = 'Номер заказа — ' + num + '. Позвоним на ' + phone + ', чтобы подтвердить время.';
    $('#cartContent').hidden = true;
    $('#cartEmpty').hidden = true;
    $('#orderSuccess').hidden = false;
    cart = []; promo = null; mode = 'pickup';
    saveCart(); updateBadge();
    $('#orderForm').reset();
    $('#promoHint').textContent = 'Подсказка: ИНЕЙ10 даёт −10%';
    $('#promoHint').className = 'promo-hint';
    $$('.fulfil button').forEach(b => b.classList.toggle('on', b.dataset.mode === 'pickup'));
    $('#drawer').scrollTop = 0;
    toast('Заказ отправлен — ждите звонка');
  }

  /* ═══════════════ 4. Конструктор ═══════════════ */
  const builder = { drink: 'latte', volume: 300, milk: 'regular', shots: 2, syrup: 'none', sugar: 50, temp: 'hot' };
  const B = {
    drinks: {
      espresso: 180, americano: 220, cappuccino: 290, latte: 320, flatwhite: 290,
      raf: 340, mocha: 350, coldbrew: 330, matcha: 340, cocoa: 280, tea: 190
    },
    drinkName: {
      espresso: 'Эспрессо', americano: 'Американо', cappuccino: 'Капучино', latte: 'Латте',
      flatwhite: 'Флэт уайт', raf: 'Раф', mocha: 'Мокко', coldbrew: 'Колд брю',
      matcha: 'Матча-латте', cocoa: 'Какао', tea: 'Чай листовой'
    },
    volume: { 200: 0, 300: 40, 400: 80 },
    milk: { regular: 0, oat: 40, almond: 50, none: -30 },
    syrup: { none: 0, caramel: 30, lavender: 30, coconut: 40 },
    sugarName: { 0: 'без сахара', 30: '30%', 50: '50%', 100: '100%' },
    milkName: { regular: 'обычное молоко', oat: 'овсяное молоко', almond: 'миндальное молоко', none: 'без молока' },
    syrupName: { none: 'без сиропа', caramel: 'карамель', lavender: 'лаванда', coconut: 'кокос' },
    syrupColor: { none: null, caramel: ['#c99a5b', '#8a5f2c'], lavender: ['#a99ac2', '#6c5b86'], coconut: ['#d9c7a8', '#a58a63'] },
    milkColor: { regular: ['#c8a17b', '#7c5638'], oat: ['#cdb492', '#8d6b47'], almond: ['#cdbb9f', '#8f7452'], none: ['#a9743f', '#4d2d18'] }
  };

  function builderTotal() {
    return B.drinks[builder.drink] + B.volume[builder.volume] + B.milk[builder.milk] + (builder.shots - 1) * 40 + B.syrup[builder.syrup];
  }

  function updateBuilder() {
    const total = builderTotal();
    const base = B.drinks[builder.drink];
    const drinkName = B.drinkName[builder.drink];
    $('#lblDrink').textContent = drinkName;
    $('#tagDrink').textContent = drinkName;
    $('#lblVolume').textContent = builder.volume + ' мл';
    $('#lblMilk').textContent = B.milkName[builder.milk].replace(' молоко', '');
    $('#lblShots').textContent = builder.shots + (builder.shots === 1 ? ' шот' : ' шота');
    $('#lblSyrup').textContent = B.syrupName[builder.syrup];
    $('#lblSugar').textContent = B.sugarName[builder.sugar];
    $('#tagVolume').textContent = builder.volume + ' мл';
    $('#tagMilk').textContent = B.milkName[builder.milk];
    $('#tagShots').textContent = builder.shots + (builder.shots === 1 ? ' шот' : ' шота');
    const ts = $('#tagSyrup');
    ts.hidden = builder.syrup === 'none';
    ts.textContent = B.syrupName[builder.syrup];
    $('#tagSugar').textContent = builder.sugar ? 'сахар ' + builder.sugar + '%' : 'без сахара';
    $('#builderPrice').textContent = money(total);

    const lines = [['Основа · ' + drinkName, money(base)]];
    if (B.volume[builder.volume]) lines.push(['Объём ' + builder.volume + ' мл', '+' + money(B.volume[builder.volume])]);
    if (B.milk[builder.milk]) lines.push([B.milkName[builder.milk], (B.milk[builder.milk] > 0 ? '+' : '−') + money(Math.abs(B.milk[builder.milk]))]);
    if ((builder.shots - 1) * 40) lines.push(['Доп. шоты × ' + (builder.shots - 1), '+' + money((builder.shots - 1) * 40)]);
    if (B.syrup[builder.syrup]) lines.push([B.syrupName[builder.syrup], '+' + money(B.syrup[builder.syrup])]);
    $('#priceLines').innerHTML = lines.map(l => '<div><span>' + l[0] + '</span><span>' + l[1] + '</span></div>').join('');

    // стакан
    const innerTop = 92, innerBottom = 280, innerH = innerBottom - innerTop;
    const fill = Math.min(0.94, Math.max(0.35, builder.volume / 450));
    const liquidH = innerH * fill;
    const liquidY = innerBottom - liquidH;
    const liquid = $('#cupLiquid');
    liquid.setAttribute('y', liquidY.toFixed(1));
    liquid.setAttribute('height', liquidH.toFixed(1));
    const foam = $('#cupFoam');
    foam.setAttribute('y', (liquidY - 12).toFixed(1));
    foam.setAttribute('height', '14');
    foam.style.opacity = builder.temp === 'ice' ? '.35' : '.85';

    const pal = B.milkColor[builder.milk];
    const syr = B.syrupColor[builder.syrup];
    const top = syr ? syr[0] : pal[0];
    const bottom = syr ? syr[1] : pal[1];
    const stops = $$('#liquidGrad stop');
    if (stops.length === 2) {
      stops[0].style.stopColor = top;
      stops[1].style.stopColor = bottom;
    }
    $('#cupIce').style.opacity = builder.temp === 'ice' ? '1' : '0';
    $('#cupName').textContent = $('#cupNameInput').value.trim() || 'ваше имя';
  }

  function bindBuilder() {
    $$('.seg').forEach(seg => {
      seg.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-val]');
        if (!btn) return;
        const group = seg.dataset.group;
        $$('button', seg).forEach(b => b.classList.toggle('on', b === btn));
        if (group === 'volume') builder.volume = Number(btn.dataset.val);
        if (group === 'shots') builder.shots = Number(btn.dataset.val);
        if (group === 'milk') builder.milk = btn.dataset.val;
        if (group === 'syrup') builder.syrup = btn.dataset.val;
        if (group === 'sugar') builder.sugar = Number(btn.dataset.val);
        if (group === 'temp') builder.temp = btn.dataset.val;
        updateBuilder();
      });
    });
    $('#builderDrink').addEventListener('change', (e) => {
      builder.drink = e.target.value;
      updateBuilder();
    });
    $('#cupNameInput').addEventListener('input', updateBuilder);

    $('#builderAdd').addEventListener('click', () => {
      const custom = $('#cupNameInput').value.trim();
      const name = B.drinkName[builder.drink] + (custom ? ' «' + custom + '»' : ' · свой');
      const sugarText = builder.sugar ? 'сахар ' + builder.sugar + '%' : 'без сахара';
      const detail = builder.volume + ' мл · ' + B.milkName[builder.milk] + ' · ' + builder.shots + ' шот' + (builder.shots === 1 ? '' : 'а') + ' · ' + B.syrupName[builder.syrup] + ' · ' + sugarText + (builder.temp === 'ice' ? ' · айс' : '');
      addToCart({
        key: 'custom:' + name + ':' + detail,
        name: name,
        detail: detail,
        price: builderTotal(),
        img: '../assets/img/photo-1495474472287-4d71bcdd2085.jpg'
      });
      const btn = $('#builderAdd');
      const old = btn.innerHTML;
      btn.innerHTML = '<svg class="ico"><use href="#i-check"/></svg> Добавлено в заказ';
      setTimeout(() => { btn.innerHTML = old; }, 1400);
    });
    updateBuilder();
  }

  /* ═══════════════ 5. Карта вкуса ═══════════════ */
  function bindWheel() {
    const nodes = $('#wheelNodes');
    const links = $('#wheelLinks');
    nodes.innerHTML = FLAVORS.map(f =>
      '<button class="flavor" data-flavor="' + f.id + '" style="left:' + f.x + '%;top:' + f.y + '%"><i></i>' + f.label + '</button>'
    ).join('');
    links.innerHTML = FLAVORS.map(f => {
      const cx = 160, cy = 160, x = f.x / 100 * 320, y = f.y / 100 * 320;
      return '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '"/>';
    }).join('');

    nodes.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-flavor]');
      if (!btn) return;
      const flavor = FLAVORS.find(f => f.id === btn.dataset.flavor);
      $$('.flavor', nodes).forEach(b => b.classList.toggle('on', b === btn));
      const drink = MENU.find(m => m.id === flavor.drink);
      if (!drink) return;
      const price = itemPrice(drink, 0);
      $('#tasteResult').innerHTML =
        '<div class="taste-card">' +
          '<img src="' + drink.img + '" alt="" width="58" height="58" />' +
          '<div class="tc-body"><b>' + drink.name + '</b><span>' + flavor.note + '</span>' +
            '<span class="tc-price">' + money(price) + (drink.vols ? ' · ' + drink.vols[0].ml + ' мл' : '') + '</span>' +
          '</div>' +
          '<button class="add" data-taste-add="' + drink.id + '"><svg class="ico"><use href="#i-plus"/></svg> В заказ</button>' +
        '</div>' +
        '<p class="taste-note">эта нота звучит здесь громче всего</p>';
    });

    $('#tasteResult').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-taste-add]');
      if (!btn) return;
      const item = MENU.find(m => m.id === btn.dataset.tasteAdd);
      if (!item) return;
      const vol = item.vols ? item.vols[0] : null;
      addToCart({
        key: item.id + ':0', name: item.name,
        detail: vol ? vol.ml + ' мл' : 'порция',
        price: vol ? vol.price : item.price, img: item.img
      });
      btn.classList.add('added');
      btn.innerHTML = '<svg class="ico"><use href="#i-check"/></svg> ок';
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<svg class="ico"><use href="#i-plus"/></svg> В заказ'; }, 1200);
    });
  }

  /* ═══════════════ 6. Сеты ═══════════════ */
  function renderSets() {
    $('#setsGrid').innerHTML = SETS.map(s =>
      '<article class="set">' +
        '<div class="set-media">' +
          '<img src="' + s.img + '" alt="' + s.name + '" loading="lazy" width="640" height="360" />' +
          '<span class="set-save">−' + (s.old - s.price) + ' ₽</span>' +
          '<span class="set-note">' + s.note + '</span>' +
        '</div>' +
        '<div class="set-body">' +
          '<h3>' + s.name + '</h3>' +
          '<ul class="set-list">' + s.items.map(i => '<li>' + i + '</li>').join('') + '</ul>' +
          '<div class="set-foot">' +
            '<div class="set-price"><b>' + money(s.price) + '</b><s>' + money(s.old) + '</s></div>' +
            '<button class="add" data-set="' + s.id + '"><svg class="ico"><use href="#i-plus"/></svg> В заказ</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    ).join('');

    $('#setsGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-set]');
      if (!btn) return;
      const s = SETS.find(x => x.id === btn.dataset.set);
      addToCart({
        key: 'set:' + s.id, name: s.name,
        detail: s.items.join(' + '), price: s.price, img: s.img
      });
      btn.classList.add('added');
      btn.innerHTML = '<svg class="ico"><use href="#i-check"/></svg> Добавлено';
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<svg class="ico"><use href="#i-plus"/></svg> В заказ'; }, 1200);
    });
  }

  /* ═══════════════ 7. Чек-лист ═══════════════ */
  function bindChecklist() {
    const saved = store.get('iney-checklist', {});
    const boxes = $$('#checklist input');
    boxes.forEach(b => {
      if (saved[b.dataset.key]) b.checked = true;
      b.addEventListener('change', () => {
        const state = {};
        boxes.forEach(x => { state[x.dataset.key] = x.checked; });
        store.set('iney-checklist', state);
        updateCheck();
      });
    });
    function updateCheck() {
      const done = boxes.filter(b => b.checked).length;
      $('#checkBar').style.width = (done / boxes.length * 100) + '%';
      $('#checkText').textContent = done + ' из ' + boxes.length;
    }
    updateCheck();
  }

  /* ═══════════════ 8. Анимации и мелочи ═══════════════ */
  function bindReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  function bindHeader() {
    const head = $('#siteHead');
    const onScroll = () => head.classList.toggle('is-stuck', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = $('#burger');
    const nav = $('#mobileNav');
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      nav.hidden = !open;
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        nav.hidden = true;
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120 && !nav.hidden) {
        nav.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function bindParallax() {
    if (!finePointer) return;
    const scene = $('#scene');
    if (!scene) return;
    let raf = 0;
    scene.addEventListener('pointermove', (e) => {
      const r = scene.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        $$('[data-depth]', scene).forEach(el => {
          const d = Number(el.dataset.depth) || 10;
          el.style.translate = (nx * d * 0.55).toFixed(1) + 'px ' + (ny * d * 0.55).toFixed(1) + 'px';
        });
      });
    });
    scene.addEventListener('pointerleave', () => {
      $$('[data-depth]', scene).forEach(el => { el.style.translate = ''; });
    });
  }

  let toastTimer;
  function toast(text) {
    const el = $('#toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ═══════════════ Запуск ═══════════════ */
  function init() {
    initStatus();
    renderTabs();
    renderFilters();
    renderMenu();
    bindMenu();
    renderCart();
    updateBadge();
    bindCart();
    bindBuilder();
    bindWheel();
    renderSets();
    bindChecklist();
    bindReveal();
    bindHeader();
    bindParallax();
    // сброс фильтров по кнопке из пустого состояния
    document.addEventListener('click', (e) => {
      if (e.target.closest('.to-top')) return;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

