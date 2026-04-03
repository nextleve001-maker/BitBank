// =====================================================
// BitBank FULL SCRIPT - PART 1
// =====================================================

const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCAL_SESSION_KEY = "bitbank_rebuild_session_v2";

let appState = {
  currentUser: null,
  lang: "uk",
  soundEnabled: true,
  usdRate: 40,
  supportBank: 0,
  commissionBank: 0,
  globalMessage: "",
  allPlayers: [],
  onlinePlayers: [],
  market: {
    crypto: {},
    stocks: []
  }
};

const I18N = {
  uk: {
    menu_profile: "Профіль",
    menu_crypto: "Крипто",
    menu_stocks: "Акції",
    menu_business: "Бізнес",
    menu_realty: "Нерухомість",
    menu_cars: "Авто",
    menu_classes: "Класи",
    menu_friends: "Друзі",
    menu_battle: "Дуель",
    menu_casino: "Казино",
    menu_transfer: "Перекази",
    menu_history: "Історія",
    menu_top: "Топ 100",
    menu_support: "Підтримка",
    menu_admin: "Адмін",
    profile: "Профіль",
    crypto: "Крипто",
    stocks: "Акції",
    business: "Бізнес",
    realty: "Нерухомість",
    cars: "Авто",
    classes: "Класи",
    friends: "Друзі",
    battle: "Дуель",
    casino: "Казино",
    transfer: "Перекази",
    history: "Історія",
    top: "Топ 100",
    support: "Підтримка",
    admin: "Адмін",
    logout: "Вийти",
    balance: "Баланс",
    lifetimeEarned: "Зароблено за весь час",
    passiveIncome: "Пасивний дохід/хв",
    clickIncome: "Дохід за клік",
    currentClass: "Поточний клас",
    buy: "Купити",
    sell: "Продати",
    owned: "Вже куплено",
    invalidData: "Невірні дані",
    insufficientFunds: "Недостатньо коштів",
    invalidUser: "Невірний користувач",
    userExists: "Користувач уже існує",
    bannedName: "Такий логін заборонений",
    userCreated: "Акаунт створено",
    loginError: "Невірний логін або пароль",
    accountBanned: "Акаунт заблоковано",
    noAccessStocks: "Акції доступні з класу Trader і вище",
    noAccessBusiness: "Бізнес доступний тільки з класу Businessman і вище",
    upgradeSuccess: "Клас успішно придбано",
    wrongCode: "Невірний CVV",
    cvvChanged: "CVV змінено",
    cardNameChanged: "Назву карти змінено",
    colorChanged: "Колір карти змінено",
    donated: "Дякуємо за підтримку",
    sent: "Переказ успішний",
    historyEmpty: "Історія порожня",
    rankTitle: "Топ 100 за весь час",
    vipSent: "VIP-роздача виконана",
    massDone: "Масова дія виконана",
    soundOn: "Звук увімкнено",
    soundOff: "Звук вимкнено",
    dailyBonusTaken: "Щоденний бонус уже забрано",
    dailyBonusGot: "Щоденний бонус отримано",
    classBenefits: "Плюшки класу",
    buyClass: "Купити клас",
    nextRequirement: "Потрібен попередній клас",
    profileCardActions: "Дії з карткою",
    profileStats: "Статистика",
    exchange: "Конвертація",
    supportBank: "Банк підтримки",
    commissionBank: "Банк комісій",
    adminAnalytics: "Аналітика",
    meOrNick: "Можна писати me або свій нік",
    onlinePlayersList: "Гравці в грі",
    dailyBonus: "Щоденний бонус",
    titles: "Титули",
    none: "немає",
    buyUsd: "Купити USD",
    sellUsd: "Продати USD",
    playerManagement: "Керування гравцем",
    giveMoney: "Видати гроші",
    takeMoney: "Забрати гроші",
    setBalance: "Встановити баланс",
    setClass: "Встановити клас",
    banUser: "Забанити",
    unbanUser: "Розбанити",
    resetUser: "Скинути акаунт",
    deleteUser: "Видалити акаунт",
    giveBusiness: "Видати бізнес",
    giveRealty: "Видати нерухомість",
    giveCar: "Видати авто",
    sendGlobalMessage: "Надіслати повідомлення всім",
    collectCommission: "Забрати банк комісій",
    collectSupport: "Забрати банк підтримки",
    creatorPanel: "Creator панель",
    purchaseRequiresCvv: "Для покупки потрібен CVV",
    transferRequiresCvv: "Для переказу потрібен CVV",
    classRequiresCvv: "Для купівлі класу потрібен CVV",
    vipRequiresClass: "VIP-роздача доступна з VIP і вище",
    playerNotFound: "Гравця не знайдено",
    valueUpdated: "Значення оновлено",
    accountReset: "Акаунт скинуто",
    accountDeleted: "Акаунт видалено",
    classSet: "Клас встановлено",
    deviceType: "Пристрій",
    totalAssets: "Усього активів",
    buyFor: "Купити за",
    serverError: "Помилка сервера",
    tapBattleTitle: "Тап-дуель",
    casinoTitle: "Казино",
    friendsTitle: "Друзі",
    bought: "Куплено"
  },
  en: {
    menu_profile: "Profile",
    menu_crypto: "Crypto",
    menu_stocks: "Stocks",
    menu_business: "Business",
    menu_realty: "Realty",
    menu_cars: "Cars",
    menu_classes: "Classes",
    menu_friends: "Friends",
    menu_battle: "Battle",
    menu_casino: "Casino",
    menu_transfer: "Transfers",
    menu_history: "History",
    menu_top: "Top 100",
    menu_support: "Support",
    menu_admin: "Admin",
    profile: "Profile",
    crypto: "Crypto",
    stocks: "Stocks",
    business: "Business",
    realty: "Realty",
    cars: "Cars",
    classes: "Classes",
    friends: "Friends",
    battle: "Battle",
    casino: "Casino",
    transfer: "Transfers",
    history: "History",
    top: "Top 100",
    support: "Support",
    admin: "Admin",
    logout: "Logout",
    balance: "Balance",
    lifetimeEarned: "Earned all time",
    passiveIncome: "Passive income/min",
    clickIncome: "Income per click",
    currentClass: "Current class",
    buy: "Buy",
    sell: "Sell",
    owned: "Owned",
    invalidData: "Invalid data",
    insufficientFunds: "Insufficient funds",
    invalidUser: "Invalid user",
    userExists: "User already exists",
    bannedName: "This username is forbidden",
    userCreated: "Account created",
    loginError: "Invalid username or password",
    accountBanned: "Account is banned",
    noAccessStocks: "Stocks are available from Trader and above",
    noAccessBusiness: "Business is available only from Businessman and above",
    upgradeSuccess: "Class purchased",
    wrongCode: "Wrong CVV",
    cvvChanged: "CVV changed",
    cardNameChanged: "Card name changed",
    colorChanged: "Card color changed",
    donated: "Thanks for support",
    sent: "Transfer completed",
    historyEmpty: "History is empty",
    rankTitle: "Top 100 all time",
    vipSent: "VIP giveaway complete",
    massDone: "Mass action done",
    soundOn: "Sound on",
    soundOff: "Sound off",
    dailyBonusTaken: "Daily bonus already claimed",
    dailyBonusGot: "Daily bonus claimed",
    classBenefits: "Class perks",
    buyClass: "Buy class",
    nextRequirement: "Previous class required",
    profileCardActions: "Card actions",
    profileStats: "Statistics",
    exchange: "Exchange",
    supportBank: "Support bank",
    commissionBank: "Commission bank",
    adminAnalytics: "Analytics",
    meOrNick: "You can type me or your nickname",
    onlinePlayersList: "Players in game",
    dailyBonus: "Daily bonus",
    titles: "Titles",
    none: "none",
    buyUsd: "Buy USD",
    sellUsd: "Sell USD",
    playerManagement: "Player management",
    giveMoney: "Give money",
    takeMoney: "Take money",
    setBalance: "Set balance",
    setClass: "Set class",
    banUser: "Ban",
    unbanUser: "Unban",
    resetUser: "Reset account",
    deleteUser: "Delete account",
    giveBusiness: "Give business",
    giveRealty: "Give realty",
    giveCar: "Give car",
    sendGlobalMessage: "Broadcast message",
    collectCommission: "Collect commission bank",
    collectSupport: "Collect support bank",
    creatorPanel: "Creator panel",
    purchaseRequiresCvv: "CVV required for purchase",
    transferRequiresCvv: "CVV required for transfer",
    classRequiresCvv: "CVV required for class purchase",
    vipRequiresClass: "VIP giveaway requires VIP or higher",
    playerNotFound: "Player not found",
    valueUpdated: "Value updated",
    accountReset: "Account reset",
    accountDeleted: "Account deleted",
    classSet: "Class set",
    deviceType: "Device",
    totalAssets: "Total assets",
    buyFor: "Buy for",
    serverError: "Server error",
    tapBattleTitle: "Tap battle",
    casinoTitle: "Casino",
    friendsTitle: "Friends",
    bought: "Purchased"
  }
};

function tr(key) {
  return I18N[appState.lang][key] || key;
}

const classList = [
  { key: "none", title: "Starter", price: 0, clickReward: 5, passivePerMin: 0, perks: { uk: "Базовий старт. Доступ до профілю, крипти, переказів та історії.", en: "Basic start. Access to profile, crypto, transfers and history." } },
  { key: "basic", title: "Basic", price: 1000, clickReward: 15, passivePerMin: 10, perks: { uk: "Більше грошей за клік і маленький пасивний дохід.", en: "More money per click and small passive income." } },
  { key: "medium", title: "Medium", price: 6000, clickReward: 45, passivePerMin: 45, perks: { uk: "Сильніший пасивний дохід і швидший ріст.", en: "Stronger passive income and faster growth." } },
  { key: "trader", title: "Trader", price: 18000, clickReward: 110, passivePerMin: 110, perks: { uk: "Відкриває доступ до акцій. Усі класи вище теж бачать акції.", en: "Unlocks stocks. All higher classes also unlock stocks." } },
  { key: "vip", title: "VIP", price: 50000, clickReward: 250, passivePerMin: 260, perks: { uk: "VIP-роздача, золотий колір картки, кращий дохід.", en: "VIP giveaway, gold card, better income." } },
  { key: "businessman", title: "Businessman", price: 150000, clickReward: 600, passivePerMin: 700, perks: { uk: "Відкриває бізнеси та сильний пасивний дохід.", en: "Unlocks businesses and strong passive income." } },
  { key: "manager", title: "Manager", price: 500000, clickReward: 1700, passivePerMin: 2200, perks: { uk: "Максимально сильний дохід і всі плюшки нижчих класів.", en: "Very strong income and all lower class perks." } },
  { key: "creator", title: "Creator", price: 0, clickReward: 50000, passivePerMin: 25000, perks: { uk: "Повний контроль, адмінка, бачить усіх гравців.", en: "Full control, admin panel, sees all players." } }
];

const CLASS_MAP = Object.fromEntries(classList.map((c, i) => [c.key, { ...c, index: i }]));

const CRYPTO_CATALOG = [
  { symbol: "BTC", name: "Bitcoin", price: 2800000, img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032" },
  { symbol: "ETH", name: "Ethereum", price: 145000, img: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032" },
  { symbol: "BNB", name: "BNB", price: 24500, img: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=032" },
  { symbol: "SOL", name: "Solana", price: 7200, img: "https://cryptologos.cc/logos/solana-sol-logo.png?v=032" },
  { symbol: "XRP", name: "XRP", price: 24, img: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=032" },
  { symbol: "ADA", name: "Cardano", price: 19, img: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=032" },
  { symbol: "DOGE", name: "Dogecoin", price: 8, img: "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=032" },
  { symbol: "TON", name: "Toncoin", price: 220, img: "https://cryptologos.cc/logos/toncoin-ton-logo.png?v=032" },
  { symbol: "DOT", name: "Polkadot", price: 300, img: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=032" },
  { symbol: "AVAX", name: "Avalanche", price: 1400, img: "https://cryptologos.cc/logos/avalanche-avax-logo.png?v=032" }
];

const STOCKS_CATALOG = [
  { id: "apple", name: "Apple", price: 8100, img: "https://logo.clearbit.com/apple.com" },
  { id: "microsoft", name: "Microsoft", price: 16800, img: "https://logo.clearbit.com/microsoft.com" },
  { id: "google", name: "Google", price: 7200, img: "https://logo.clearbit.com/google.com" },
  { id: "amazon", name: "Amazon", price: 6900, img: "https://logo.clearbit.com/amazon.com" },
  { id: "tesla", name: "Tesla", price: 9100, img: "https://logo.clearbit.com/tesla.com" },
  { id: "nvidia", name: "NVIDIA", price: 25000, img: "https://logo.clearbit.com/nvidia.com" },
  { id: "meta", name: "Meta", price: 11200, img: "https://logo.clearbit.com/meta.com" },
  { id: "intel", name: "Intel", price: 4300, img: "https://logo.clearbit.com/intel.com" },
  { id: "amd", name: "AMD", price: 6600, img: "https://logo.clearbit.com/amd.com" },
  { id: "netflix", name: "Netflix", price: 9200, img: "https://logo.clearbit.com/netflix.com" }
];

const BUSINESS_CATALOG = [
  { id: "coffee", name: "Кав'ярня", price: 40000, income: 90, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop" },
  { id: "shop", name: "Магазин", price: 95000, income: 220, img: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&auto=format&fit=crop" },
  { id: "gym", name: "Фітнес-клуб", price: 180000, income: 430, img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop" },
  { id: "hotel", name: "Готель", price: 550000, income: 1500, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop" },
  { id: "it", name: "IT Студія", price: 800000, income: 2600, img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&auto=format&fit=crop" },
  { id: "restaurant", name: "Ресторан", price: 1200000, income: 3800, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop" },
  { id: "mall", name: "Торговий центр", price: 2200000, income: 7200, img: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=400&auto=format&fit=crop" },
  { id: "factory", name: "Фабрика", price: 3500000, income: 12000, img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&auto=format&fit=crop" },
  { id: "airline", name: "Авіакомпанія", price: 7000000, income: 22000, img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&auto=format&fit=crop" },
  { id: "bank", name: "Банк", price: 12000000, income: 38000, img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop" }
];

const REALTY_CATALOG = [
  { id: "palm", name: "🌴 Пальмовий острів", price: 25000, income: 60, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop" },
  { id: "volcano", name: "🌋 Вулканічний острів", price: 45000, income: 120, img: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&auto=format&fit=crop" },
  { id: "paradise", name: "🏝 Райський острів", price: 80000, income: 200, img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&auto=format&fit=crop" },
  { id: "treasure", name: "💰 Острів скарбів", price: 120000, income: 320, img: "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&auto=format&fit=crop" },
  { id: "skyvilla", name: "🏙 Sky Villa", price: 420000, income: 1300, img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&auto=format&fit=crop" },
  { id: "oceanhome", name: "🌊 Ocean Home", price: 520000, income: 1700, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop" },
  { id: "penthouse", name: "Luxury Penthouse", price: 850000, income: 2600, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop" },
  { id: "lakehouse", name: "Lake House", price: 600000, income: 1850, img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&auto=format&fit=crop" },
  { id: "castle", name: "Castle", price: 2500000, income: 9000, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop" },
  { id: "resort", name: "Private Resort", price: 5000000, income: 18000, img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&auto=format&fit=crop" }
];

const CAR_CATALOG = [
  { id: "corolla", name: "Toyota Corolla", priceUsd: 22000, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&auto=format&fit=crop" },
  { id: "civic", name: "Honda Civic", priceUsd: 24000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop" },
  { id: "bmw3", name: "BMW 3 Series", priceUsd: 42000, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop" },
  { id: "tesla3", name: "Tesla Model 3", priceUsd: 47000, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&auto=format&fit=crop" },
  { id: "gclass", name: "Mercedes G-Class", priceUsd: 180000, img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&auto=format&fit=crop" },
  { id: "huracan", name: "Lamborghini Huracan", priceUsd: 250000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop" },
  { id: "porsche911", name: "Porsche 911", priceUsd: 170000, img: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=400&auto=format&fit=crop" },
  { id: "audi_rs7", name: "Audi RS7", priceUsd: 145000, img: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&auto=format&fit=crop" },
  { id: "ferrari_f8", name: "Ferrari F8", priceUsd: 320000, img: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&auto=format&fit=crop" },
  { id: "cullinan", name: "Rolls-Royce Cullinan", priceUsd: 390000, img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop" }
];

let audioContext = null;

function playBeep(freq = 440, duration = 0.05, volume = 0.02) {
  if (!appState.soundEnabled) return;
  try {
    if (!audioContext) {
      const ACtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new ACtx();
    }
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = freq;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {}
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNum(value) {
  return Number(value || 0).toLocaleString(appState.lang === "uk" ? "uk-UA" : "en-US", {
    maximumFractionDigits: 2
  });
}

function sanitize(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function currentDeviceType() {
  return /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? "phone" : "desktop";
}

function saveSession() {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
    username: appState.currentUser,
    lang: appState.lang,
    soundEnabled: appState.soundEnabled
  }));
}

function loadSession() {
  const raw = localStorage.getItem(LOCAL_SESSION_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    appState.currentUser = parsed.username || null;
    appState.lang = parsed.lang || "uk";
    appState.soundEnabled = parsed.soundEnabled !== false;
  } catch (error) {}
}

function todayString() {
  return new Date().toDateString();
}

function generateCardNumber() {
  let raw = "4";
  while (raw.length < 16) raw += String(rand(0, 9));
  return raw.replace(/(.{4})/g, "$1 ").trim();
}

function generateCardExpiry() {
  const mm = String(rand(1, 12)).padStart(2, "0");
  const yy = String((new Date().getFullYear() + rand(2, 6))).slice(-2);
  return `${mm}/${yy}`;
}

function imageTag(src, alt) {
  return `<img class="asset-thumb" src="${src}" alt="${alt}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop'">`;
}

function parseJsonField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizePlayer(row) {
  return {
    ...row,
    crypto: parseJsonField(row.crypto, {}),
    stocks: parseJsonField(row.stocks, {}),
    businesses: parseJsonField(row.businesses, []),
    business_levels: parseJsonField(row.business_levels, {}),
    realty: parseJsonField(row.realty, []),
    cars: parseJsonField(row.cars, []),
    titles: parseJsonField(row.titles, []),
    friends: parseJsonField(row.friends, [])
  };
}

function getCurrentUserRow() {
  return appState.allPlayers.find(p => p.username === appState.currentUser) || null;
}

function getClassData(key) {
  return CLASS_MAP[key];
}

function classIndex(key) {
  return getClassData(key).index;
}

function hasStocksAccess(user) {
  return classIndex(user.class) >= classIndex("trader");
}

function hasBusinessAccess(user) {
  return classIndex(user.class) >= classIndex("businessman");
}

function hasVipAccess(user) {
  return classIndex(user.class) >= classIndex("vip");
}

function isCreator(user) {
  return user && user.class === "creator";
}

function getClickReward(user) {
  return getClassData(user.class).clickReward;
}

function getBusinessIncome(user) {
  let total = 0;
  (user.businesses || []).forEach(id => {
    const item = BUSINESS_CATALOG.find(x => x.id === id);
    const level = Number(user.business_levels?.[id] || 1);
    if (item) total += item.income * level;
  });
  return total;
}

function getPassiveIncome(user) {
  let total = getClassData(user.class).passivePerMin;
  total += getBusinessIncome(user);
  (user.realty || []).forEach(id => {
    const item = REALTY_CATALOG.find(x => x.id === id);
    if (item) total += item.income;
  });
  return total;
}

function calculateCapitalUsd(user) {
  let totalUah = Number(user.balance || 0) + Number(user.usd || 0) * appState.usdRate;

  Object.entries(user.crypto || {}).forEach(([symbol, amount]) => {
    const item = appState.market.crypto[symbol];
    if (item) totalUah += Number(amount) * Number(item.price);
  });

  Object.entries(user.stocks || {}).forEach(([stockId, amount]) => {
    const item = appState.market.stocks.find(stock => stock.id === stockId);
    if (item) totalUah += Number(amount) * Number(item.price);
  });

  (user.businesses || []).forEach(id => {
    const item = BUSINESS_CATALOG.find(x => x.id === id);
    const level = Number(user.business_levels?.[id] || 1);
    if (item) totalUah += item.price * level;
  });

  (user.realty || []).forEach(id => {
    const item = REALTY_CATALOG.find(x => x.id === id);
    if (item) totalUah += item.price;
  });

  (user.cars || []).forEach(id => {
    const item = CAR_CATALOG.find(x => x.id === id);
    if (item) totalUah += item.priceUsd * appState.usdRate;
  });

  return totalUah / appState.usdRate;
}

function promptCvv(user, label) {
  const entered = prompt(`${label || tr("purchaseRequiresCvv")} (CVV)`);
  if (entered === null) return false;
  if (String(entered) !== String(user.card_cvv)) {
    showToast(tr("wrongCode"), true);
    return false;
  }
  return true;
}

function normalizeRecipient(value, currentNickname) {
  const clean = sanitize(value).toLowerCase();
  if (!clean) return "";
  if (clean === "me" || clean === currentNickname.toLowerCase()) return currentNickname;
  return clean;
}

function cardColorClass(color) {
  if (color === "white") return "card-white";
  if (color === "yellow") return "card-yellow";
  if (color === "gold") return "card-gold";
  return "card-black";
}

function showToast(text, isError = false) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.position = "fixed";
  toast.style.left = "50%";
  toast.style.bottom = "130px";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = isError ? "#b33939" : "#20344d";
  toast.style.color = "#fff";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "999px";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function updateLeftMenuText() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = tr(key);
  });
}
