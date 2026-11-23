/* Cup of Joy — меню. Один источник данных: карточки, корзина, конструктор и сеты берут всё отсюда. */

/* Числовые id — фото с Pexels (локально в assets/img/pexels-<id>.jpg),
   длинные id — прежние фото Unsplash (assets/img/photo-<id>.jpg). */
const IMG = (id) => /^\d+$/.test(id)
  ? '../assets/img/pexels-' + id + '.jpg'
  : '../assets/img/photo-' + id + '.jpg';

const MENU = [
  /* ── КОФЕ ─────────────────────────────────────────────── */
  {
    id: 'espresso', cat: 'coffee', name: 'Эспрессо', badge: 'классика',
    desc: 'Плотный шот на бленде «Северный»: тёмный шоколад, чернослив, почти без кислотности.',
    img: IMG('12975714'), kcal: 3, tags: ['hot'],
    vols: [{ ml: 40, price: 180 }]
  },
  {
    id: 'doppio', cat: 'coffee', name: 'Доппио', badge: null,
    desc: 'Двойной эспрессо для тех, кому одного мало. Подаём с ложкой газированной воды.',
    img: IMG('15898642'), kcal: 5, tags: ['hot'],
    vols: [{ ml: 60, price: 230 }]
  },
  {
    id: 'americano', cat: 'coffee', name: 'Американо', badge: null,
    desc: 'Эспрессо и горячая вода 92 °C. Пьётся долго, не горчит на дне.',
    img: IMG('40141912'), kcal: 8, tags: ['hot', 'vegan'],
    vols: [{ ml: 200, price: 220 }, { ml: 300, price: 260 }]
  },
  {
    id: 'flatwhite', cat: 'coffee', name: 'Флэт уайт', badge: 'хит',
    desc: 'Двойной ристретто и тонкий слой молока. Тот самый бархат, если поймать свежую обжарку.',
    img: IMG('36851643'), kcal: 110, tags: ['hot'],
    vols: [{ ml: 200, price: 290 }, { ml: 300, price: 340 }]
  },
  {
    id: 'cappuccino', cat: 'coffee', name: 'Капучино', badge: 'хит',
    desc: 'Плотная пена, рисунок на пенке и ложка, которой удобно есть облако.',
    img: IMG('6747870'), kcal: 120, tags: ['hot'],
    vols: [{ ml: 250, price: 290 }, { ml: 350, price: 340 }, { ml: 450, price: 390 }]
  },
  {
    id: 'latte', cat: 'coffee', name: 'Латте', badge: null,
    desc: 'Много молока, мягкий вкус. С овсяным — чуть слаще, с миндальным — ореховее.',
    img: IMG('6393542'), kcal: 160, tags: ['hot'],
    vols: [{ ml: 300, price: 320 }, { ml: 400, price: 380 }]
  },
  {
    id: 'raf', cat: 'coffee', name: 'Раф', badge: null,
    desc: 'Сливки, ваниль и щепотка соли. Взбиваем, пока не станет как шёлк.',
    img: IMG('15747033'), kcal: 210, tags: ['hot'],
    vols: [{ ml: 300, price: 340 }, { ml: 400, price: 390 }]
  },
  {
    id: 'mocha', cat: 'coffee', name: 'Мокко', badge: null,
    desc: 'Эспрессо, какао и тёмный шоколад. Сладко, но не приторно — проверено гостями.',
    img: IMG('982612'), kcal: 240, tags: ['hot'],
    vols: [{ ml: 300, price: 350 }, { ml: 400, price: 400 }]
  },
  {
    id: 'v60', cat: 'coffee', name: 'Фильтр V60', badge: 'новинка',
    desc: 'Эфиопия Иргачеффе: жасмин, персик, чайное послевкусие. Варим по 4 минуты, не торопимся.',
    img: IMG('1661879'), kcal: 2, tags: ['hot', 'vegan'],
    vols: [{ ml: 250, price: 320 }, { ml: 350, price: 370 }]
  },
  {
    id: 'coldbrew', cat: 'coffee', name: 'Колд брю', badge: null,
    desc: '12 часов настаиваем в холоде. Мягкий, шоколадный, без горечи.',
    img: IMG('16284351'), kcal: 5, tags: ['cold', 'vegan'],
    vols: [{ ml: 300, price: 330 }, { ml: 400, price: 380 }]
  },
  {
    id: 'icelatte', cat: 'coffee', name: 'Айс-латте', badge: null,
    desc: 'Холодное молоко, лёд и эспрессо, который красиво протекает сквозь кубики.',
    img: IMG('38594569'), kcal: 150, tags: ['cold'],
    vols: [{ ml: 300, price: 340 }, { ml: 400, price: 390 }]
  },
  {
    id: 'esptonic', cat: 'coffee', name: 'Эспрессо-тоник', badge: 'хит',
    desc: 'Тоник, лайм и шот сверху. Освежает лучше, чем кондиционер летом.',
    img: IMG('12540646'), kcal: 90, tags: ['cold', 'vegan'],
    vols: [{ ml: 350, price: 360 }]
  },
  {
    id: 'cocoa', cat: 'coffee', name: 'Какао', badge: null,
    desc: 'Бельгийский шоколад и молоко. Без кофеина — для тех, кто уже выпил своё.',
    img: IMG('35658541'), kcal: 260, tags: ['hot'],
    vols: [{ ml: 300, price: 280 }]
  },
  {
    id: 'matcha', cat: 'coffee', name: 'Матча-латте', badge: null,
    desc: 'Церемониальная матча, взбитая венчиком. Травянисто, свежо, с молоком.',
    img: IMG('17366787'), kcal: 130, tags: ['hot'],
    vols: [{ ml: 300, price: 340 }, { ml: 400, price: 390 }]
  },
  {
    id: 'tea', cat: 'coffee', name: 'Чай листовой', badge: null,
    desc: 'Сенча, пуэр или чабрец. Завариваем в чайнике на двоих — хватит на разговор.',
    img: IMG('18785044'), kcal: 2, tags: ['hot', 'vegan'],
    vols: [{ ml: 400, price: 190 }]
  },
  {
    id: 'seabuckthorn', cat: 'coffee', name: 'Облепиховый чай', badge: 'новинка',
    desc: 'Облепиха, апельсин, мёд и имбирь. Кисло-сладкий, согревает руки через чашку.',
    img: IMG('5662240'), kcal: 120, tags: ['hot'],
    vols: [{ ml: 350, price: 260 }]
  },

  /* ── АВТОРСКИЕ ─────────────────────────────────────────── */
  {
    id: 'iney', cat: 'author', name: '«Лавандовый»', badge: 'авторский',
    desc: 'Латте с лавандой и белым шоколадом. Сверху — пыльца цветов, как изморозь.',
    img: IMG('15023063'), kcal: 230, tags: ['hot'],
    vols: [{ ml: 350, price: 390 }]
  },
  {
    id: 'polar', cat: 'author', name: '«Полярный»', badge: 'авторский',
    desc: 'Эспрессо-тоник с розмарином и лаймом. Розмарин поджигаем — пахнет хвоей.',
    img: IMG('7474152'), kcal: 100, tags: ['cold', 'vegan'],
    vols: [{ ml: 350, price: 380 }]
  },
  {
    id: 'northwind', cat: 'author', name: '«Северный ветер»', badge: 'новинка',
    desc: 'Колд брю, мята и тоник. Ледяной, звонкий, с длинным мятным финишем.',
    img: IMG('39985286'), kcal: 80, tags: ['cold', 'vegan'],
    vols: [{ ml: 400, price: 390 }]
  },
  {
    id: 'quiet', cat: 'author', name: '«Тихий час»', badge: null,
    desc: 'Раф с кокосом и кардамоном. Тёплый, пряный, для дождливых вечеров.',
    img: IMG('4765852'), kcal: 250, tags: ['hot'],
    vols: [{ ml: 350, price: 390 }]
  },
  {
    id: 'blizzard', cat: 'author', name: '«Метель»', badge: 'авторский',
    desc: 'Мокко с вишней и щепоткой чили. Сладко, потом тепло, потом ещё глоток.',
    img: IMG('5314623'), kcal: 280, tags: ['hot'],
    vols: [{ ml: 350, price: 410 }]
  },
  {
    id: 'blueice', cat: 'author', name: '«Синий лёд»', badge: 'веган',
    desc: 'Матча на кокосовом молоке с бузиной. Цвет — как у северного неба.',
    img: IMG('33991076'), kcal: 140, tags: ['cold', 'vegan'],
    vols: [{ ml: 400, price: 420 }]
  },

  /* ── ЗАВТРАКИ ──────────────────────────────────────────── */
  {
    id: 'syrniki', cat: 'breakfast', name: 'Сырники с грушей', badge: 'хит',
    desc: 'Творожные, почти без муки. Груша в сиропе и сметана 20% сбоку.',
    img: IMG('10254478'), kcal: 420, tags: ['veg'], weight: '180 г',
    price: 390
  },
  {
    id: 'pancakes', cat: 'breakfast', name: 'Панкейки с черникой', badge: null,
    desc: 'Три толстых панкейка, черничный соус и шапка из взбитых сливок.',
    img: IMG('7144716'), kcal: 480, tags: ['veg'], weight: '210 г',
    price: 370
  },
  {
    id: 'avotoast', cat: 'breakfast', name: 'Авокадо-тост с пашотом', badge: null,
    desc: 'Ржаной хлеб, гуакамоле, яйцо пашот и семена льна. Завтрак, после которого живёшь.',
    img: IMG('4397292'), kcal: 390, tags: ['veg'], weight: '230 г',
    price: 420
  },
  {
    id: 'benedict', cat: 'breakfast', name: 'Яйца бенедикт', badge: null,
    desc: 'Бриошь, ветчина, два яйца и голландский соус. Подаём с листьями салата.',
    img: IMG('32520095'), kcal: 510, tags: [], weight: '260 г',
    price: 460
  },
  {
    id: 'croissant', cat: 'breakfast', name: 'Круассан-сэндвич', badge: null,
    desc: 'Слоёный круассан, индейка, сыр и горчичный соус. Утром разбирают первым.',
    img: IMG('15249750'), kcal: 450, tags: [], weight: '220 г',
    price: 350
  },
  {
    id: 'ricotta', cat: 'breakfast', name: 'Тост с рикоттой', badge: null,
    desc: 'Тостовый хлеб, рикотта, груша и мёд. Минимум сахара, максимум вкуса.',
    img: IMG('16144004'), kcal: 340, tags: ['veg'], weight: '190 г',
    price: 320
  },
  {
    id: 'granola', cat: 'breakfast', name: 'Гранола с йогуртом', badge: null,
    desc: 'Домашняя гранола, греческий йогурт и сезонные ягоды в стакане.',
    img: IMG('38485734'), kcal: 290, tags: ['veg'], weight: '200 г',
    price: 290
  },

  /* ── ЕДА ───────────────────────────────────────────────── */
  {
    id: 'panini', cat: 'food', name: 'Панини с индейкой', badge: null,
    desc: 'Хрустящий багет, индейка, песто и моцарелла. Подаём с картофелем по-деревенски.',
    img: IMG('29614913'), kcal: 620, tags: [], weight: '320 г',
    price: 480
  },
  {
    id: 'quinoa', cat: 'food', name: 'Салат с киноа', badge: 'веган',
    desc: 'Киноа, авокадо, фета, гранат и лимонная заправка. Сытно, но легко.',
    img: IMG('5639353'), kcal: 380, tags: ['veg'], weight: '280 г',
    price: 440
  },
  {
    id: 'poke', cat: 'food', name: 'Поке с тунцом', badge: 'хит',
    desc: 'Рис, тунец, манго, эдамаме и соус спайси. Собираем слоями, перемешиваете сами.',
    img: IMG('15913456'), kcal: 520, tags: [], weight: '330 г',
    price: 520
  },
  {
    id: 'bowl', cat: 'food', name: 'Зелёный боул', badge: 'веган',
    desc: 'Брокколи, шпинат, огурец, хумус и тахини. Весь огород в одной миске.',
    img: IMG('15780331'), kcal: 410, tags: ['veg'], weight: '300 г',
    price: 450
  },
  {
    id: 'bakedveg', cat: 'food', name: 'Салат с печёными овощами', badge: null,
    desc: 'Тыква, свёкла, брюссельская капуста и козий сыр. Тёплый, зимний.',
    img: IMG('18330983'), kcal: 360, tags: ['veg'], weight: '290 г',
    price: 430
  },
  {
    id: 'caesar', cat: 'food', name: 'Цезарь с курицей', badge: null,
    desc: 'Романо, курица гриль, пармезан и соус на анчоусах. Без сюрпризов — и это хорошо.',
    img: IMG('19938473'), kcal: 470, tags: [], weight: '310 г',
    price: 460
  },
  {
    id: 'bruschetta', cat: 'food', name: 'Брускетта с томатами', badge: 'веган',
    desc: 'Поджаренный хлеб, томаты, базилик и чеснок. Простая еда, которая всегда уместна.',
    img: IMG('7432991'), kcal: 280, tags: ['veg'], weight: '180 г',
    price: 340
  },

  /* ── ДЕСЕРТЫ ───────────────────────────────────────────── */
  {
    id: 'cheesecake', cat: 'dessert', name: 'Чизкейк с земляникой', badge: 'хит',
    desc: 'Нежный, на песочной основе, с земляникой и мятой. Уходит к вечеру.',
    img: IMG('16958583'), kcal: 380, tags: ['veg'], weight: '140 г',
    price: 390
  },
  {
    id: 'chococake', cat: 'dessert', name: 'Шоколадный торт', badge: null,
    desc: 'Три слоя бисквита и ганаш 70%. Для тех, кто считает, что шоколада много не бывает.',
    img: IMG('4110008'), kcal: 450, tags: ['veg'], weight: '150 г',
    price: 420
  },
  {
    id: 'praga', cat: 'dessert', name: 'Торт «Прага»', badge: null,
    desc: 'Классика: какао, сметанный крем и шоколадная глазурь. Как в детстве, только лучше.',
    img: IMG('30699756'), kcal: 470, tags: ['veg'], weight: '150 г',
    price: 400
  },
  {
    id: 'pannacotta', cat: 'dessert', name: 'Панна котта с карамелью', badge: null,
    desc: 'Сливки, ваниль и солёная карамель. Ложка стоит вертикально — так и должно быть.',
    img: IMG('15359109'), kcal: 320, tags: ['veg'], weight: '160 г',
    price: 360
  },
  {
    id: 'milkshake', cat: 'dessert', name: 'Милкшейк «Снег»', badge: 'новинка',
    desc: 'Ванильное мороженое, молоко и сливки. Высокий стакан, две трубочки.',
    img: IMG('5553780'), kcal: 520, tags: ['veg'], weight: '350 мл',
    price: 380
  },
  {
    id: 'chiapudding', cat: 'dessert', name: 'Чиа-пудинг с манго', badge: 'веган',
    desc: 'Кокосовое молоко, семена чиа и манго. Лёгкий десерт без сахара.',
    img: IMG('5150207'), kcal: 210, tags: ['veg', 'vegan'], weight: '220 г',
    price: 310
  },
  {
    id: 'cookies', cat: 'dessert', name: 'Печенье с шоколадом', badge: null,
    desc: 'Хрустящий край, тягучая середина. Печём каждые два часа — поэтому тёплое.',
    img: IMG('8081573'), kcal: 260, tags: ['veg'], weight: '70 г',
    price: 190
  },
  {
    id: 'almondcroissant', cat: 'dessert', name: 'Миндальный круассан', badge: null,
    desc: 'Слоёное тесто, миндальный крем и лепестки миндаля. К фильтру — идеально.',
    img: IMG('13439695'), kcal: 390, tags: ['veg'], weight: '110 г',
    price: 290
  }
];

/* Сеты: цена и состав. Экономия считается сама. */
const SETS = [
  {
    id: 'set-polar', name: 'Завтрак полярника', note: 'до 12:00',
    items: ['Капучино 250 мл', 'Круассан-сэндвич 220 г'],
    price: 590, old: 680, img: IMG('15249750')
  },
  {
    id: 'set-quiet', name: 'Тихий час', note: 'после 18:00',
    items: ['Флэт уайт 200 мл', 'Чизкейк с земляникой 140 г'],
    price: 640, old: 680, img: IMG('16958583')
  },
  {
    id: 'set-two', name: 'Два берега', note: 'на двоих',
    items: ['2 × Капучино 250 мл', 'Панна котта 160 г'],
    price: 890, old: 970, img: IMG('15359109')
  },
  {
    id: 'set-syrniki', name: 'Утро без спешки', note: 'завтрак',
    items: ['Сырники с грушей 180 г', 'Американо 200 мл', 'Печенье 70 г'],
    price: 690, old: 780, img: IMG('10254478')
  },
  {
    id: 'set-green', name: 'Овощной день', note: 'веган',
    items: ['Зелёный боул 300 г', 'Фильтр V60 250 мл'],
    price: 720, old: 810, img: IMG('15780331')
  },
  {
    id: 'set-sweet', name: 'Сладкая пара', note: 'к кофе',
    items: ['Латте 300 мл', 'Шоколадный торт 150 г'],
    price: 750, old: 830, img: IMG('4110008')
  },
  {
    id: 'set-work', name: 'Рабочий перерыв', note: 'быстро',
    items: ['Панини с индейкой 320 г', 'Американо 300 мл'],
    price: 790, old: 880, img: IMG('29614913')
  },
  {
    id: 'set-light', name: 'Лёгкий обед', note: 'до 300 ккал',
    items: ['Салат с киноа 280 г', 'Колд брю 300 мл'],
    price: 760, old: 840, img: IMG('5639353')
  },
  {
    id: 'set-cookies', name: 'Кофе и круассан', note: 'на один',
    items: ['Эспрессо 40 мл', 'Миндальный круассан 110 г'],
    price: 430, old: 480, img: IMG('13439695')
  },
  {
    id: 'set-evening', name: 'Вечерний раф', note: 'после 18:00',
    items: ['Раф 300 мл', 'Панна котта 160 г'],
    price: 730, old: 810, img: IMG('15747033')
  },
  {
    id: 'set-toast', name: 'Завтрак на двоих', note: 'на двоих',
    items: ['2 × Авокадо-тост 230 г', '2 × Капучино 250 мл'],
    price: 1180, old: 1320, img: IMG('4397292')
  },
  {
    id: 'set-tea', name: 'Чай и десерт', note: 'без кофеина',
    items: ['Чай листовой 400 мл', 'Печенье 70 г', 'Чиа-пудинг 220 г'],
    price: 620, old: 690, img: IMG('18785044')
  }
];

/* Карта вкуса: клик по ноте подбирает напиток. */
const FLAVORS = [
  { id: 'choco', label: 'шоколад', drink: 'mocha', x: 50, y: 22, note: 'какао и тёмный шоколад' },
  { id: 'nut', label: 'орех', drink: 'flatwhite', x: 74, y: 38, note: 'миндаль, лесной орех' },
  { id: 'caramel', label: 'карамель', drink: 'raf', x: 76, y: 68, note: 'солёная карамель, ваниль' },
  { id: 'berry', label: 'ягоды', drink: 'blizzard', x: 50, y: 84, note: 'вишня, смородина' },
  { id: 'citrus', label: 'цитрус', drink: 'esptonic', x: 23, y: 68, note: 'лайм, грейпфрут' },
  { id: 'flower', label: 'цветы', drink: 'iney', x: 24, y: 38, note: 'лаванда, жасмин' }
];

const CATS = [
  { id: 'all', label: 'Всё меню' },
  { id: 'coffee', label: 'Кофе' },
  { id: 'author', label: 'Авторские' },
  { id: 'breakfast', label: 'Завтраки' },
  { id: 'food', label: 'Еда' },
  { id: 'dessert', label: 'Десерты' }
];

const FILTERS = [
  { id: 'vegan', label: 'vegan' },
  { id: 'veg', label: 'без мяса' },
  { id: 'cold', label: 'холодное' },
  { id: 'light', label: 'до 300 ккал' }
];
