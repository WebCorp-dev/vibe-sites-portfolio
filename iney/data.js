/* ИНЕЙ — меню. Один источник данных: карточки, корзина, конструктор и сеты берут всё отсюда. */

const IMG = (id) => '../assets/img/photo-' + id + '.jpg';

const MENU = [
  /* ── КОФЕ ─────────────────────────────────────────────── */
  {
    id: 'espresso', cat: 'coffee', name: 'Эспрессо', badge: 'классика',
    desc: 'Плотный шот на бленде «Северный»: тёмный шоколад, чернослив, почти без кислотности.',
    img: IMG('1514432324607-a09d9b4aefdd'), kcal: 3, tags: ['hot'],
    vols: [{ ml: 40, price: 180 }]
  },
  {
    id: 'doppio', cat: 'coffee', name: 'Доппио', badge: null,
    desc: 'Двойной эспрессо для тех, кому одного мало. Подаём с ложкой газированной воды.',
    img: IMG('1511920170033-f8396924c348'), kcal: 5, tags: ['hot'],
    vols: [{ ml: 60, price: 230 }]
  },
  {
    id: 'americano', cat: 'coffee', name: 'Американо', badge: null,
    desc: 'Эспрессо и горячая вода 92 °C. Пьётся долго, не горчит на дне.',
    img: IMG('1514432324607-a09d9b4aefdd'), kcal: 8, tags: ['hot', 'vegan'],
    vols: [{ ml: 200, price: 220 }, { ml: 300, price: 260 }]
  },
  {
    id: 'flatwhite', cat: 'coffee', name: 'Флэт уайт', badge: 'хит',
    desc: 'Двойной ристретто и тонкий слой молока. Тот самый бархат, если поймать свежую обжарку.',
    img: IMG('1509042239860-f550ce710b93'), kcal: 110, tags: ['hot'],
    vols: [{ ml: 200, price: 290 }, { ml: 300, price: 340 }]
  },
  {
    id: 'cappuccino', cat: 'coffee', name: 'Капучино', badge: 'хит',
    desc: 'Плотная пена, рисунок на пенке и ложка, которой удобно есть облако.',
    img: IMG('1495474472287-4d71bcdd2085'), kcal: 120, tags: ['hot'],
    vols: [{ ml: 250, price: 290 }, { ml: 350, price: 340 }, { ml: 450, price: 390 }]
  },
  {
    id: 'latte', cat: 'coffee', name: 'Латте', badge: null,
    desc: 'Много молока, мягкий вкус. С овсяным — чуть слаще, с миндальным — ореховее.',
    img: IMG('1495474472287-4d71bcdd2085'), kcal: 160, tags: ['hot'],
    vols: [{ ml: 300, price: 320 }, { ml: 400, price: 380 }]
  },
  {
    id: 'raf', cat: 'coffee', name: 'Раф', badge: null,
    desc: 'Сливки, ваниль и щепотка соли. Взбиваем, пока не станет как шёлк.',
    img: IMG('1514432324607-a09d9b4aefdd'), kcal: 210, tags: ['hot'],
    vols: [{ ml: 300, price: 340 }, { ml: 400, price: 390 }]
  },
  {
    id: 'mocha', cat: 'coffee', name: 'Мокко', badge: null,
    desc: 'Эспрессо, какао и тёмный шоколад. Сладко, но не приторно — проверено гостями.',
    img: IMG('1511920170033-f8396924c348'), kcal: 240, tags: ['hot'],
    vols: [{ ml: 300, price: 350 }, { ml: 400, price: 400 }]
  },
  {
    id: 'v60', cat: 'coffee', name: 'Фильтр V60', badge: 'новинка',
    desc: 'Эфиопия Иргачеффе: жасмин, персик, чайное послевкусие. Варим по 4 минуты, не торопимся.',
    img: IMG('1442512595331-e89e73853f31'), kcal: 2, tags: ['hot', 'vegan'],
    vols: [{ ml: 250, price: 320 }, { ml: 350, price: 370 }]
  },
  {
    id: 'coldbrew', cat: 'coffee', name: 'Колд брю', badge: null,
    desc: '12 часов настаиваем в холоде. Мягкий, шоколадный, без горечи.',
    img: IMG('1461023058943-07fcbe16d735'), kcal: 5, tags: ['cold', 'vegan'],
    vols: [{ ml: 300, price: 330 }, { ml: 400, price: 380 }]
  },
  {
    id: 'icelatte', cat: 'coffee', name: 'Айс-латте', badge: null,
    desc: 'Холодное молоко, лёд и эспрессо, который красиво протекает сквозь кубики.',
    img: IMG('1461023058943-07fcbe16d735'), kcal: 150, tags: ['cold'],
    vols: [{ ml: 300, price: 340 }, { ml: 400, price: 390 }]
  },
  {
    id: 'esptonic', cat: 'coffee', name: 'Эспрессо-тоник', badge: 'хит',
    desc: 'Тоник, лайм и шот сверху. Освежает лучше, чем кондиционер летом.',
    img: IMG('1461023058943-07fcbe16d735'), kcal: 90, tags: ['cold', 'vegan'],
    vols: [{ ml: 350, price: 360 }]
  },
  {
    id: 'cocoa', cat: 'coffee', name: 'Какао', badge: null,
    desc: 'Бельгийский шоколад и молоко. Без кофеина — для тех, кто уже выпил своё.',
    img: IMG('1514432324607-a09d9b4aefdd'), kcal: 260, tags: ['hot'],
    vols: [{ ml: 300, price: 280 }]
  },
  {
    id: 'matcha', cat: 'coffee', name: 'Матча-латте', badge: null,
    desc: 'Церемониальная матча, взбитая венчиком. Травянисто, свежо, с молоком.',
    img: IMG('1495474472287-4d71bcdd2085'), kcal: 130, tags: ['hot'],
    vols: [{ ml: 300, price: 340 }, { ml: 400, price: 390 }]
  },
  {
    id: 'tea', cat: 'coffee', name: 'Чай листовой', badge: null,
    desc: 'Сенча, пуэр или чабрец. Завариваем в чайнике на двоих — хватит на разговор.',
    img: IMG('1517832606299-7ae9b720a186'), kcal: 2, tags: ['hot', 'vegan'],
    vols: [{ ml: 400, price: 190 }]
  },
  {
    id: 'seabuckthorn', cat: 'coffee', name: 'Облепиховый чай', badge: 'новинка',
    desc: 'Облепиха, апельсин, мёд и имбирь. Кисло-сладкий, согревает руки через чашку.',
    img: IMG('1514432324607-a09d9b4aefdd'), kcal: 120, tags: ['hot'],
    vols: [{ ml: 350, price: 260 }]
  },

  /* ── АВТОРСКИЕ ─────────────────────────────────────────── */
  {
    id: 'iney', cat: 'author', name: '«Иней»', badge: 'авторский',
    desc: 'Латте с лавандой и белым шоколадом. Сверху — пыльца цветов, как изморозь.',
    img: IMG('1511920170033-f8396924c348'), kcal: 230, tags: ['hot'],
    vols: [{ ml: 350, price: 390 }]
  },
  {
    id: 'polar', cat: 'author', name: '«Полярный»', badge: 'авторский',
    desc: 'Эспрессо-тоник с розмарином и лаймом. Розмарин поджигаем — пахнет хвоей.',
    img: IMG('1461023058943-07fcbe16d735'), kcal: 100, tags: ['cold', 'vegan'],
    vols: [{ ml: 350, price: 380 }]
  },
  {
    id: 'northwind', cat: 'author', name: '«Северный ветер»', badge: 'новинка',
    desc: 'Колд брю, мята и тоник. Ледяной, звонкий, с длинным мятным финишем.',
    img: IMG('1461023058943-07fcbe16d735'), kcal: 80, tags: ['cold', 'vegan'],
    vols: [{ ml: 400, price: 390 }]
  },
  {
    id: 'quiet', cat: 'author', name: '«Тихий час»', badge: null,
    desc: 'Раф с кокосом и кардамоном. Тёплый, пряный, для дождливых вечеров.',
    img: IMG('1509042239860-f550ce710b93'), kcal: 250, tags: ['hot'],
    vols: [{ ml: 350, price: 390 }]
  },
  {
    id: 'blizzard', cat: 'author', name: '«Метель»', badge: 'авторский',
    desc: 'Мокко с вишней и щепоткой чили. Сладко, потом тепло, потом ещё глоток.',
    img: IMG('1514432324607-a09d9b4aefdd'), kcal: 280, tags: ['hot'],
    vols: [{ ml: 350, price: 410 }]
  },
  {
    id: 'blueice', cat: 'author', name: '«Синий лёд»', badge: 'веган',
    desc: 'Матча на кокосовом молоке с бузиной. Цвет — как у северного неба.',
    img: IMG('1461023058943-07fcbe16d735'), kcal: 140, tags: ['cold', 'vegan'],
    vols: [{ ml: 400, price: 420 }]
  },

  /* ── ЗАВТРАКИ ──────────────────────────────────────────── */
  {
    id: 'syrniki', cat: 'breakfast', name: 'Сырники с грушей', badge: 'хит',
    desc: 'Творожные, почти без муки. Груша в сиропе и сметана 20% сбоку.',
    img: IMG('1567620905732-2d1ec7ab7445'), kcal: 420, tags: ['veg'],
    price: 390
  },
  {
    id: 'pancakes', cat: 'breakfast', name: 'Панкейки с черникой', badge: null,
    desc: 'Три толстых панкейка, черничный соус и шапка из взбитых сливок.',
    img: IMG('1484723091739-30a097e8f929'), kcal: 480, tags: ['veg'],
    price: 370
  },
  {
    id: 'avotoast', cat: 'breakfast', name: 'Авокадо-тост с пашотом', badge: null,
    desc: 'Ржаной хлеб, гуакамоле, яйцо пашот и семена льна. Завтрак, после которого живёшь.',
    img: IMG('1533089860892-a7c6f0a88666'), kcal: 390, tags: ['veg'],
    price: 420
  },
  {
    id: 'benedict', cat: 'breakfast', name: 'Яйца бенедикт', badge: null,
    desc: 'Бриошь, ветчина, два яйца и голландский соус. Подаём с листьями салата.',
    img: IMG('1525351484163-7529414344d8'), kcal: 510, tags: [],
    price: 460
  },
  {
    id: 'croissant', cat: 'breakfast', name: 'Круассан-сэндвич', badge: null,
    desc: 'Слоёный круассан, индейка, сыр и горчичный соус. Утром разбирают первым.',
    img: IMG('1555507036-ab1f4038808a'), kcal: 450, tags: [],
    price: 350
  },
  {
    id: 'ricotta', cat: 'breakfast', name: 'Тост с рикоттой', badge: null,
    desc: 'Тостовый хлеб, рикотта, груша и мёд. Минимум сахара, максимум вкуса.',
    img: IMG('1549931319-a545dcf3bc73'), kcal: 340, tags: ['veg'],
    price: 320
  },
  {
    id: 'granola', cat: 'breakfast', name: 'Гранола с йогуртом', badge: null,
    desc: 'Домашняя гранола, греческий йогурт и сезонные ягоды в стакане.',
    img: IMG('1488477181946-6428a0291777'), kcal: 290, tags: ['veg'],
    price: 290
  },

  /* ── ЕДА ───────────────────────────────────────────────── */
  {
    id: 'panini', cat: 'food', name: 'Панини с индейкой', badge: null,
    desc: 'Хрустящий багет, индейка, песто и моцарелла. Подаём с картофелем по-деревенски.',
    img: IMG('1528735602780-2552fd46c7af'), kcal: 620, tags: [],
    price: 480
  },
  {
    id: 'quinoa', cat: 'food', name: 'Салат с киноа', badge: 'веган',
    desc: 'Киноа, авокадо, фета, гранат и лимонная заправка. Сытно, но легко.',
    img: IMG('1512621776951-a57141f2eefd'), kcal: 380, tags: ['veg'],
    price: 440
  },
  {
    id: 'poke', cat: 'food', name: 'Поке с тунцом', badge: 'хит',
    desc: 'Рис, тунец, манго, эдамаме и соус спайси. Собираем слоями, перемешиваете сами.',
    img: IMG('1490645935967-10de6ba17061'), kcal: 520, tags: [],
    price: 520
  },
  {
    id: 'bowl', cat: 'food', name: 'Зелёный боул', badge: 'веган',
    desc: 'Брокколи, шпинат, огурец, хумус и тахини. Весь огород в одной миске.',
    img: IMG('1498837167922-ddd27525d352'), kcal: 410, tags: ['veg'],
    price: 450
  },
  {
    id: 'bakedveg', cat: 'food', name: 'Салат с печёными овощами', badge: null,
    desc: 'Тыква, свёкла, брюссельская капуста и козий сыр. Тёплый, зимний.',
    img: IMG('1540189549336-e6e99c3679fe'), kcal: 360, tags: ['veg'],
    price: 430
  },
  {
    id: 'caesar', cat: 'food', name: 'Цезарь с курицей', badge: null,
    desc: 'Романо, курица гриль, пармезан и соус на анчоусах. Без сюрпризов — и это хорошо.',
    img: IMG('1547592180-85f173990554'), kcal: 470, tags: [],
    price: 460
  },
  {
    id: 'bruschetta', cat: 'food', name: 'Брускетта с томатами', badge: 'веган',
    desc: 'Поджаренный хлеб, томаты, базилик и чеснок. Простая еда, которая всегда уместна.',
    img: IMG('1549931319-a545dcf3bc73'), kcal: 280, tags: ['veg'],
    price: 340
  },

  /* ── ДЕСЕРТЫ ───────────────────────────────────────────── */
  {
    id: 'cheesecake', cat: 'dessert', name: 'Чизкейк с земляникой', badge: 'хит',
    desc: 'Нежный, на песочной основе, с земляникой и мятой. Уходит к вечеру.',
    img: IMG('1565958011703-44f9829ba187'), kcal: 380, tags: ['veg'],
    price: 390
  },
  {
    id: 'chococake', cat: 'dessert', name: 'Шоколадный торт', badge: null,
    desc: 'Три слоя бисквита и ганаш 70%. Для тех, кто считает, что шоколада много не бывает.',
    img: IMG('1578985545062-69928b1d9587'), kcal: 450, tags: ['veg'],
    price: 420
  },
  {
    id: 'praga', cat: 'dessert', name: 'Торт «Прага»', badge: null,
    desc: 'Классика: какао, сметанный крем и шоколадная глазурь. Как в детстве, только лучше.',
    img: IMG('1606313564200-e75d5e30476c'), kcal: 470, tags: ['veg'],
    price: 400
  },
  {
    id: 'pannacotta', cat: 'dessert', name: 'Панна котта с карамелью', badge: null,
    desc: 'Сливки, ваниль и солёная карамель. Ложка стоит вертикально — так и должно быть.',
    img: IMG('1551024506-0bccd828d307'), kcal: 320, tags: ['veg'],
    price: 360
  },
  {
    id: 'milkshake', cat: 'dessert', name: 'Милкшейк «Снег»', badge: 'новинка',
    desc: 'Ванильное мороженое, молоко и сливки. Высокий стакан, две трубочки.',
    img: IMG('1563805042-7684c019e1cb'), kcal: 520, tags: ['veg'],
    price: 380
  },
  {
    id: 'chiapudding', cat: 'dessert', name: 'Чиа-пудинг с манго', badge: 'веган',
    desc: 'Кокосовое молоко, семена чиа и манго. Лёгкий десерт без сахара.',
    img: IMG('1488477181946-6428a0291777'), kcal: 210, tags: ['veg', 'vegan'],
    price: 310
  },
  {
    id: 'cookies', cat: 'dessert', name: 'Печенье с шоколадом', badge: null,
    desc: 'Хрустящий край, тягучая середина. Печём каждые два часа — поэтому тёплое.',
    img: IMG('1499636136210-6f4ee915583e'), kcal: 260, tags: ['veg'],
    price: 190
  },
  {
    id: 'almondcroissant', cat: 'dessert', name: 'Миндальный круассан', badge: null,
    desc: 'Слоёное тесто, миндальный крем и лепестки миндаля. К фильтру — идеально.',
    img: IMG('1555507036-ab1f4038808a'), kcal: 390, tags: ['veg'],
    price: 290
  }
];

/* Сеты: цена и состав. Экономия считается сама. */
const SETS = [
  {
    id: 'set-polar', name: 'Завтрак полярника', note: 'до 12:00',
    items: ['Капучино 250 мл', 'Круассан-сэндвич'],
    price: 590, old: 680, img: IMG('1555507036-ab1f4038808a')
  },
  {
    id: 'set-quiet', name: 'Тихий час', note: 'после 18:00',
    items: ['Флэт уайт 200 мл', 'Чизкейк с земляникой'],
    price: 640, old: 680, img: IMG('1565958011703-44f9829ba187')
  },
  {
    id: 'set-two', name: 'Два берега', note: 'на двоих',
    items: ['2 × Капучино 250 мл', 'Панна котта с карамелью'],
    price: 890, old: 970, img: IMG('1551024506-0bccd828d307')
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
