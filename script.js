// =====================================================
// BitBank - FULL Supabase script.js
// =====================================================
const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCAL_SESSION_KEY = "bitbank_rebuild_session_v1";
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
    friendsTitle: "Друзі"
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
    friendsTitle: "Friends"
  }
};
async function registerUser() {
  const usernameInput = document.getElementById("reg-username");
  const passwordInput = document.getElementById("reg-password");

  if (!usernameInput || !passwordInput) {
    showToast("UI error", true);
    return;
  }

  let username = usernameInput.value.trim().toLowerCase();
  let password = passwordInput.value.trim();

  // перевірки
  if (username.length < 3) return showToast("Мінімум 3 символи", true);
  if (password.length < 4) return showToast("Мінімум 4 символи", true);

  if (["me", "admin", "creator"].includes(username)) {
    return showToast("Цей нік заборонений", true);
  }

  // загрузити всіх
  await fetchAllPlayers();

  if (appState.allPlayers.some(u => u.username === username)) {
    return showToast("Користувач вже існує", true);
  }

  // генерація даних
  const newPlayer = {
    username: username,
    password: password,

    balance: 500,
    usd: 0,
    total_earned: 500,

    class: "none",

    crypto: {},
    stocks: {},
    businesses: [],
    business_levels: {},
    realty: [],
    cars: [],

    titles: [],
    friends: [],

    card_name: "BitBank Card",
    card_color: "black",
    card_cvv: String(rand(100, 999)),
    card_number: "4444 5555 6666 7777",
    card_expiry: "12/30",

    last_seen: new Date().toISOString(),
    device: currentDeviceType(),

    last_bonus_day: "",
    vip_giveaway_day: "",

    banned: false
  };

  // запис в базу
  const { error } = await supabaseClient
    .from("players")
    .insert(newPlayer);

  if (error) {
    console.error(error);
    return showToast("Помилка сервера", true);
  }

  // історія
  await appendHistory(username, "Реєстрація акаунта", 0);

  // авто логін
  appState.currentUser = username;
  saveSession();

  // UI
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  await fetchAllPlayers();
  await fetchGameState();

  playBeep(800);
  showToast("Акаунт створено");

  updateHeader();
  await renderProfilePage();
}

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
  { symbol: "XRP", name: "XRP", price: 24, img: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=032" }
];

const STOCKS_CATALOG = [
  { id: "apple", name: "Apple", price: 8100, img: "https://logo.clearbit.com/apple.com" },
  { id: "microsoft", name: "Microsoft", price: 16800, img: "https://logo.clearbit.com/microsoft.com" },
  { id: "google", name: "Google", price: 7200, img: "https://logo.clearbit.com/google.com" },
  { id: "amazon", name: "Amazon", price: 6900, img: "https://logo.clearbit.com/amazon.com" },
  { id: "tesla", name: "Tesla", price: 9100, img: "https://logo.clearbit.com/tesla.com" },
  { id: "nvidia", name: "NVIDIA", price: 25000, img: "https://logo.clearbit.com/nvidia.com" }
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
  { id: "oceanhome", name: "🌊 Ocean Home", price: 520000, income: 1700, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop" }
];

const CAR_CATALOG = [
  { id: "corolla", name: "Toyota Corolla", priceUsd: 22000, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&auto=format&fit=crop" },
  { id: "civic", name: "Honda Civic", priceUsd: 24000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop" },
  { id: "bmw3", name: "BMW 3 Series", priceUsd: 42000, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop" },
  { id: "tesla3", name: "Tesla Model 3", priceUsd: 47000, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&auto=format&fit=crop" },
  { id: "gclass", name: "Mercedes G-Class", priceUsd: 180000, img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&auto=format&fit=crop" },
  { id: "huracan", name: "Lamborghini Huracan", priceUsd: 250000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop" }
];

let audioContext = null;

function playBeep(freq = 440, duration = 0.05, volume = 0.02) {
  if (!appState.soundEnabled) return;
  try {
    if (!audioContext) {
      const A = window.AudioContext || window.webkitAudioContext;
      audioContext = new A();
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
  } catch (e) {}
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
  } catch (e) {}
}

function imageTag(src, alt) {
  return `<img class="asset-thumb" src="${src}" alt="${alt}" onerror="this.src='https://via.placeholder.com/72x72/0e1624/ffffff?text=BB'">`;
}

function parseJsonField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try { return JSON.parse(value); } catch { return fallback; }
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

function updateLeftMenuText() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = tr(key);
  });
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

function openColorModal() {
  const modal = document.getElementById("color-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeColorModal() {
  const modal = document.getElementById("color-modal");
  if (modal) modal.classList.add("hidden");
}

function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("show");
  document.getElementById("overlay")?.classList.remove("show");
}

function setActivePage(page) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
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

function updateHeader() {
  const user = getCurrentUserRow();
  if (!user) return;

  const usernameEl = document.getElementById("header-username");
  const statusEl = document.getElementById("header-status");
  const onlineEl = document.getElementById("header-online");
  const deviceEl = document.getElementById("header-device");
  const balanceUahEl = document.getElementById("balance-uah");
  const balanceUsdEl = document.getElementById("balance-usd");
  const vipBtn = document.getElementById("vip-giveaway-btn");
  const adminNav = document.getElementById("admin-nav");
  const langBtn = document.getElementById("lang-btn");
  const soundBtn = document.getElementById("toggle-sound-btn");
  const globalMessageBox = document.getElementById("global-message");

  if (usernameEl) usernameEl.textContent = user.username;
  if (statusEl) statusEl.textContent = getClassData(user.class).title.toUpperCase();
  if (onlineEl) onlineEl.textContent = tr("online");
  if (deviceEl) deviceEl.textContent = user.device === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`;
  if (balanceUahEl) balanceUahEl.textContent = formatNum(user.balance);
  if (balanceUsdEl) balanceUsdEl.textContent = formatNum(user.usd);
  if (vipBtn) vipBtn.classList.toggle("hidden", !hasVipAccess(user));
  if (adminNav) adminNav.classList.toggle("hidden", !isCreator(user));
  if (langBtn) langBtn.textContent = appState.lang === "uk" ? "EN" : "UA";
  if (soundBtn) soundBtn.textContent = appState.soundEnabled ? "🔊 Звук" : "🔇 Звук";

  if (globalMessageBox) {
    if (appState.globalMessage) {
      globalMessageBox.classList.remove("hidden");
      globalMessageBox.textContent = appState.globalMessage;
    } else {
      globalMessageBox.classList.add("hidden");
      globalMessageBox.textContent = "";
    }
  }

  updateLeftMenuText();
}

async function fetchAllPlayers() {
  const { data, error } = await supabaseClient
    .from("players")
    .select("*");

  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return [];
  }

  appState.allPlayers = (data || []).map(normalizePlayer);
  appState.onlinePlayers = appState.allPlayers.filter(player => {
    const onlineMs = Date.now() - new Date(player.last_seen).getTime();
    return !player.banned && onlineMs < 120000;
  });

  return appState.allPlayers;
}

async function fetchGameState() {
  const { data, error } = await supabaseClient
    .from("game_state")
    .select("*")
    .eq("id", 1)
    .single();

  if (!error && data) {
    appState.supportBank = Number(data.support_bank || 0);
    appState.commissionBank = Number(data.commission_bank || 0);
    appState.globalMessage = data.global_message || "";
  }
}

async function saveGameState() {
  const { error } = await supabaseClient
    .from("game_state")
    .upsert({
      id: 1,
      support_bank: appState.supportBank,
      commission_bank: appState.commissionBank,
      global_message: appState.globalMessage
    });

  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return false;
  }

  return true;
}

async function appendHistory(username, text, amount = null) {
  const { error } = await supabaseClient
    .from("history")
    .insert({
      username,
      text,
      amount
    });

  if (error) {
    console.error(error);
  }
}

async function fetchHistory(username) {
  const { data, error } = await supabaseClient
    .from("history")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false })
    .limit(120);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

async function updatePlayer(username, patch) {
  const prepared = { ...patch };

  if (prepared.crypto && typeof prepared.crypto === "object") prepared.crypto = JSON.stringify(prepared.crypto);
  if (prepared.stocks && typeof prepared.stocks === "object") prepared.stocks = JSON.stringify(prepared.stocks);
  if (prepared.businesses && Array.isArray(prepared.businesses)) prepared.businesses = JSON.stringify(prepared.businesses);
  if (prepared.business_levels && typeof prepared.business_levels === "object") prepared.business_levels = JSON.stringify(prepared.business_levels);
  if (prepared.realty && Array.isArray(prepared.realty)) prepared.realty = JSON.stringify(prepared.realty);
  if (prepared.cars && Array.isArray(prepared.cars)) prepared.cars = JSON.stringify(prepared.cars);
  if (prepared.titles && Array.isArray(prepared.titles)) prepared.titles = JSON.stringify(prepared.titles);
  if (prepared.friends && Array.isArray(prepared.friends)) prepared.friends = JSON.stringify(prepared.friends);

  const { error } = await supabaseClient
    .from("players")
    .update(prepared)
    .eq("username", username);

  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return false;
  }

  return true;
}

async function createPlayer(username, password) {
  const payload = {
    username,
    password,
    class: "none",
    balance: 500,
    usd: 0,
    total_earned: 500,
    card_name: "BitBank Card",
    card_color: "black",
    card_cvv: String(rand(100, 999)),
    card_number: generateCardNumber(),
    card_expiry: generateCardExpiry(),
    device: currentDeviceType(),
    banned: false,
    last_seen: new Date().toISOString(),
    last_bonus_day: "",
    vip_giveaway_day: "",
    crypto: JSON.stringify({}),
    stocks: JSON.stringify({}),
    businesses: JSON.stringify([]),
    business_levels: JSON.stringify({}),
    realty: JSON.stringify([]),
    cars: JSON.stringify([]),
    titles: JSON.stringify([]),
    friends: JSON.stringify([])
  };

  const { error } = await supabaseClient
    .from("players")
    .insert(payload);

  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return false;
  }

  await appendHistory(username, tr("userCreated"));
  return true;
}

async function applyOfflineIncome(user) {
  const prev = new Date(user.last_seen).getTime();
  const now = Date.now();
  const minutesAway = Math.floor((now - prev) / 60000);
  if (minutesAway <= 0) return;

  const passive = getPassiveIncome(user);
  if (passive <= 0) return;

  const income = passive * minutesAway;

  const ok = await updatePlayer(user.username, {
    balance: Number(user.balance) + income,
    total_earned: Number(user.total_earned) + income
  });

  if (!ok) return;

  await appendHistory(
    user.username,
    `${appState.lang === "uk" ? "Офлайн дохід" : "Offline income"}: +${formatNum(income)} грн`,
    income
  );
}

async function loginPlayer(username, password) {
  const { data, error } = await supabaseClient
    .from("players")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .maybeSingle();

  if (error || !data) {
    showToast(tr("loginError"), true);
    return null;
  }

  const normalized = normalizePlayer(data);

  if (normalized.banned) {
    showToast(tr("accountBanned"), true);
    return null;
  }

  await applyOfflineIncome(normalized);

  const ok = await updatePlayer(username, {
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  if (!ok) return null;

  appState.currentUser = username;
  saveSession();
  return normalized;
}

function grantTitleLocally(user, titleText) {
  const currentTitles = Array.isArray(user.titles) ? [...user.titles] : [];
  if (!currentTitles.includes(titleText)) currentTitles.push(titleText);
  return currentTitles;
}

async function checkAndGrantTitles(username) {
  await fetchAllPlayers();
  const user = appState.allPlayers.find(p => p.username === username);
  if (!user) return;

  let titles = Array.isArray(user.titles) ? [...user.titles] : [];

  if (Number(user.total_earned) >= 10000 && !titles.includes("💸 10K Earned")) titles.push("💸 10K Earned");
  if (Number(user.total_earned) >= 100000 && !titles.includes("🏆 100K Earned")) titles.push("🏆 100K Earned");
  if ((user.businesses || []).length >= 3 && !titles.includes("🏢 Бізнесмен")) titles.push("🏢 Бізнесмен");
  if ((user.realty || []).length >= 2 && !titles.includes("🏝 Магнат")) titles.push("🏝 Магнат");
  if ((user.cars || []).length >= 2 && !titles.includes("🚗 Колекціонер")) titles.push("🚗 Колекціонер");

  if (JSON.stringify(titles) !== JSON.stringify(user.titles || [])) {
    await updatePlayer(username, { titles });
  }
}

function battleIsActive(battle) {
  if (!battle) return false;
  if (battle.status !== "active") return false;
  if (!battle.ends_at) return false;
  return Date.now() < new Date(battle.ends_at).getTime();
}
async function renderProfilePage() {
  await fetchAllPlayers();
  await fetchGameState();

  const user = getCurrentUserRow();
  if (!user) return;

  const classData = getClassData(user.class);

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🏠 ${tr("profile")}</h2>

    <div class="profile-layout">
      <div class="panel">
        <div class="card-visual ${cardColorClass(user.card_color)}">
          <div class="card-chip"></div>
          <div class="card-number">${user.card_number}</div>
          <div class="card-bottom">
            <span>CVV: ${user.card_cvv}</span>
            <span>${user.card_expiry}</span>
          </div>
          <div class="card-brand">${user.card_name}</div>
        </div>

        <h3>${tr("profileCardActions")}</h3>
        <div class="profile-actions">
          <button id="profile-go-classes-btn">${tr("buyClass")}</button>
          <button id="profile-change-name-btn">${appState.lang === "uk" ? "Змінити назву" : "Change name"}</button>
          <button id="profile-change-color-btn">${appState.lang === "uk" ? "Змінити колір" : "Change color"}</button>
          <button id="profile-daily-bonus-btn">${tr("dailyBonus")}</button>
        </div>
      </div>

      <div class="panel">
        <h3>${tr("profileStats")}</h3>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">${tr("balance")}</div>
            <div class="value">${formatNum(user.balance)} грн</div>
          </div>

          <div class="stat-card">
            <div class="label">USD</div>
            <div class="value">${formatNum(user.usd)} USD</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("totalAssets")}</div>
            <div class="value">${formatNum(calculateCapitalUsd(user))} USD</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("currentClass")}</div>
            <div class="value">${classData.title}</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("passiveIncome")}</div>
            <div class="value">${formatNum(getPassiveIncome(user))} грн</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("clickIncome")}</div>
            <div class="value">+${formatNum(getClickReward(user))} грн</div>
          </div>
        </div>

        <div class="top-extra">
          <div class="stat-card">
            <div class="label">${tr("lifetimeEarned")}</div>
            <div class="value">${formatNum(user.total_earned)} грн</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("deviceType")}</div>
            <div class="value">${user.device === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`}</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("classBenefits")}</div>
            <div class="value" style="font-size:14px;line-height:1.45;font-weight:600">${classData.perks[appState.lang]}</div>
          </div>
        </div>

        <div style="margin-top:18px">
          <h3>${tr("titles")}</h3>
          <div>
            ${
              (user.titles || []).length
                ? user.titles.map(title => `<span class="badge-title">${title}</span>`).join("")
                : `<span class="sub">${tr("none")}</span>`
            }
          </div>
        </div>

        <div style="margin-top:18px">
          <h3>${tr("exchange")}</h3>
          <p>1 USD = ${formatNum(appState.usdRate)} грн</p>

          <div class="transfer-row">
            <input id="buy-usd-uah" type="number" placeholder="${tr("amount")} грн">
            <button id="buy-usd-btn">${tr("buyUsd")}</button>
          </div>

          <div class="transfer-row">
            <input id="sell-usd-amount" type="number" placeholder="${tr("amount")} USD">
            <button id="sell-usd-btn">${tr("sellUsd")}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  updateHeader();

  document.getElementById("profile-go-classes-btn").onclick = () => renderClassesPage();

  document.getElementById("profile-change-name-btn").onclick = async () => {
    const newName = prompt(appState.lang === "uk" ? "Нова назва карти" : "New card name", user.card_name);
    if (!newName) return;

    const ok = await updatePlayer(user.username, { card_name: newName.slice(0, 24) });
    if (!ok) return;

    playBeep(640);
    showToast(tr("cardNameChanged"));
    await renderProfilePage();
  };

  document.getElementById("profile-change-color-btn").onclick = openColorModal;

  document.getElementById("profile-daily-bonus-btn").onclick = async () => {
    if (user.last_bonus_day === new Date().toDateString()) {
      showToast(tr("dailyBonusTaken"), true);
      return;
    }

    const bonus = rand(150, 650);
    const ok = await updatePlayer(user.username, {
      balance: Number(user.balance) + bonus,
      total_earned: Number(user.total_earned) + bonus,
      last_bonus_day: new Date().toDateString()
    });
    if (!ok) return;

    await appendHistory(user.username, `${tr("dailyBonus")}: +${formatNum(bonus)} грн`, bonus);
    await checkAndGrantTitles(user.username);
    playBeep(760);
    showToast(`${tr("dailyBonusGot")} +${bonus}`);
    await renderProfilePage();
  };

  document.getElementById("buy-usd-btn").onclick = async () => {
    const amountUah = Number(document.getElementById("buy-usd-uah").value);
    if (!amountUah || amountUah <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
    if (Number(user.balance) < amountUah) return showToast(tr("insufficientFunds"), true);

    const usdAmount = amountUah / appState.usdRate;

    const ok = await updatePlayer(user.username, {
      balance: Number(user.balance) - amountUah,
      usd: Number(user.usd) + usdAmount
    });
    if (!ok) return;

    await appendHistory(user.username, `${tr("buyUsd")}: ${formatNum(usdAmount)} USD`);
    playBeep(560);
    await renderProfilePage();
  };

  document.getElementById("sell-usd-btn").onclick = async () => {
    const usdAmount = Number(document.getElementById("sell-usd-amount").value);
    if (!usdAmount || usdAmount <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
    if (Number(user.usd) < usdAmount) return showToast(tr("insufficientFunds"), true);

    const uahAmount = usdAmount * appState.usdRate;

    const ok = await updatePlayer(user.username, {
      usd: Number(user.usd) - usdAmount,
      balance: Number(user.balance) + uahAmount
    });
    if (!ok) return;

    await appendHistory(user.username, `${tr("sellUsd")}: +${formatNum(uahAmount)} грн`);
    playBeep(520);
    await renderProfilePage();
  };
}

async function renderClassesPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const html = classList
    .filter(item => item.key !== "creator")
    .map(item => {
      const ownedOrHigher = classIndex(user.class) >= classIndex(item.key);
      const canBuy = classIndex(item.key) === classIndex(user.class) + 1;

      return `
        <div class="class-card">
          <h4>${item.title}</h4>
          <div class="class-price">${formatNum(item.price)} грн</div>
          <div class="class-benefit">
            <b>${tr("classBenefits")}:</b><br>
            ${item.perks[appState.lang]}<br><br>
            <b>+${formatNum(item.clickReward)} грн</b> ${appState.lang === "uk" ? "за клік" : "per click"}<br>
            <b>+${formatNum(item.passivePerMin)} грн</b> ${appState.lang === "uk" ? "пасивно/хв" : "passive/min"}
          </div>
          ${
            ownedOrHigher
              ? `<button class="class-buy-btn" disabled>${tr("owned")}</button>`
              : canBuy
                ? `<button class="class-buy-btn" data-buy-class="${item.key}">${tr("buyClass")}</button>`
                : `<button class="class-buy-btn" disabled>${tr("nextRequirement")}</button>`
          }
        </div>
      `;
    }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">⭐ ${tr("classes")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-class]").forEach(button => {
    button.onclick = async () => {
      const targetKey = button.dataset.buyClass;
      const target = getClassData(targetKey);

      if (!promptCvv(user, tr("classRequiresCvv"))) return;
      if (Number(user.balance) < target.price) return showToast(tr("insufficientFunds"), true);
      if (classIndex(targetKey) !== classIndex(user.class) + 1) return showToast(tr("invalidData"), true);

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - target.price,
        class: targetKey
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("buyClass")}: ${target.title}`);
      await checkAndGrantTitles(user.username);
      playBeep(820);
      showToast(tr("upgradeSuccess"));
      await renderClassesPage();
    };
  });
}

async function renderCryptoPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const html = Object.values(appState.market.crypto).map(item => {
    const own = Number(user.crypto[item.symbol] || 0);
    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(item.img, item.name)}
          <div>
            <h4>${item.name} (${item.symbol})</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(item.price)} грн</div>
          </div>
        </div>

        <div class="sub">${tr("balance")}: ${formatNum(own)}</div>
        <input id="crypto-amount-${item.symbol}" type="number" step="0.0001" placeholder="${tr("amount")}">
        <div class="asset-actions">
          <button data-buy-crypto="${item.symbol}">${tr("buy")}</button>
          <button data-sell-crypto="${item.symbol}">${tr("sell")}</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🪙 ${tr("crypto")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-crypto]").forEach(button => {
    button.onclick = async () => {
      const symbol = button.dataset.buyCrypto;
      const item = appState.market.crypto[symbol];
      const amount = Number(document.getElementById(`crypto-amount-${symbol}`).value);

      if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      const totalCost = amount * item.price;
      if (Number(user.balance) < totalCost) return showToast(tr("insufficientFunds"), true);

      const newCrypto = { ...user.crypto, [symbol]: Number(user.crypto[symbol] || 0) + amount };

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - totalCost,
        crypto: newCrypto
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${formatNum(amount)} ${symbol}`);
      await checkAndGrantTitles(user.username);
      playBeep(640);
      await renderCryptoPage();
    };
  });

  document.querySelectorAll("[data-sell-crypto]").forEach(button => {
    button.onclick = async () => {
      const symbol = button.dataset.sellCrypto;
      const item = appState.market.crypto[symbol];
      const amount = Number(document.getElementById(`crypto-amount-${symbol}`).value);

      if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.crypto[symbol] || 0) < amount) return showToast(tr("insufficientFunds"), true);

      const newCrypto = { ...user.crypto, [symbol]: Number(user.crypto[symbol] || 0) - amount };

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) + amount * item.price,
        crypto: newCrypto
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("sell")} ${formatNum(amount)} ${symbol}`);
      playBeep(560);
      await renderCryptoPage();
    };
  });
}

async function renderStocksPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  if (!hasStocksAccess(user)) {
    document.getElementById("page-content").innerHTML = `
      <h2 class="page-title">📈 ${tr("stocks")}</h2>
      <div class="panel"><p>${tr("noAccessStocks")}</p></div>
    `;
    return;
  }

  const html = appState.market.stocks.map(stock => {
    const own = Number(user.stocks[stock.id] || 0);
    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(stock.img, stock.name)}
          <div>
            <h4>${stock.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(stock.price)} грн</div>
          </div>
        </div>

        <div class="sub">${tr("balance")}: ${formatNum(own)}</div>
        <input id="stock-amount-${stock.id}" type="number" step="0.01" placeholder="${tr("amount")}">
        <div class="asset-actions">
          <button data-buy-stock="${stock.id}">${tr("buy")}</button>
          <button data-sell-stock="${stock.id}">${tr("sell")}</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">📈 ${tr("stocks")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-stock]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.buyStock;
      const stock = appState.market.stocks.find(item => item.id === id);
      const amount = Number(document.getElementById(`stock-amount-${id}`).value);

      if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      const totalCost = amount * stock.price;
      if (Number(user.balance) < totalCost) return showToast(tr("insufficientFunds"), true);

      const newStocks = { ...user.stocks, [id]: Number(user.stocks[id] || 0) + amount };

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - totalCost,
        stocks: newStocks
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${formatNum(amount)} ${stock.name}`);
      await checkAndGrantTitles(user.username);
      playBeep(670);
      await renderStocksPage();
    };
  });

  document.querySelectorAll("[data-sell-stock]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.sellStock;
      const stock = appState.market.stocks.find(item => item.id === id);
      const amount = Number(document.getElementById(`stock-amount-${id}`).value);

      if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.stocks[id] || 0) < amount) return showToast(tr("insufficientFunds"), true);

      const newStocks = { ...user.stocks, [id]: Number(user.stocks[id] || 0) - amount };

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) + amount * stock.price,
        stocks: newStocks
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("sell")} ${formatNum(amount)} ${stock.name}`);
      playBeep(590);
      await renderStocksPage();
    };
  });
}
async function renderBusinessPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  if (!hasBusinessAccess(user)) {
    document.getElementById("page-content").innerHTML = `
      <h2 class="page-title">🏢 ${tr("business")}</h2>
      <div class="panel">
        <p>${tr("noAccessBusiness")}</p>
      </div>
    `;
    return;
  }

  const html = BUSINESS_CATALOG.map(item => {
    const owned = (user.businesses || []).includes(item.id);
    const level = Number(user.business_levels?.[item.id] || 0);
    const nextLevel = level + 1;
    const upgradePrice = Math.floor(item.price * 0.45 * nextLevel);

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(item.img, item.name)}
          <div>
            <h4>${item.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(item.price)} грн</div>
            <div class="sub">+${formatNum(item.income)} грн/хв</div>
            <div class="sub">${appState.lang === "uk" ? "Рівень" : "Level"}: ${level}</div>
          </div>
        </div>

        <div class="asset-actions">
          ${
            owned
              ? `
                <button disabled>${tr("owned")}</button>
                <button data-upgrade-business="${item.id}">
                  ${appState.lang === "uk" ? "Прокачати" : "Upgrade"} (${formatNum(upgradePrice)} грн)
                </button>
              `
              : `<button data-buy-business="${item.id}">${tr("buy")}</button>`
          }
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🏢 ${tr("business")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-business]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.buyBusiness;
      const item = BUSINESS_CATALOG.find(x => x.id === id);
      if (!item) return;

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < item.price) return showToast(tr("insufficientFunds"), true);

      const updatedBusinesses = Array.from(new Set([...(user.businesses || []), id]));
      const updatedLevels = { ...(user.business_levels || {}), [id]: 1 };

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - item.price,
        businesses: updatedBusinesses,
        business_levels: updatedLevels
      });

      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${item.name}`, -item.price);
      await checkAndGrantTitles(user.username);
      playBeep(700);
      showToast(tr("bought"));
      await renderBusinessPage();
    };
  });

  document.querySelectorAll("[data-upgrade-business]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.upgradeBusiness;
      const item = BUSINESS_CATALOG.find(x => x.id === id);
      if (!item) return;

      const currentLevel = Number(user.business_levels?.[id] || 1);
      const nextLevel = currentLevel + 1;
      const upgradePrice = Math.floor(item.price * 0.45 * nextLevel);

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < upgradePrice) return showToast(tr("insufficientFunds"), true);

      const updatedLevels = {
        ...(user.business_levels || {}),
        [id]: nextLevel
      };

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - upgradePrice,
        business_levels: updatedLevels
      });

      if (!ok) return;

      await appendHistory(
        user.username,
        `${appState.lang === "uk" ? "Прокачка бізнесу" : "Business upgrade"}: ${item.name} → ${nextLevel}`,
        -upgradePrice
      );

      await checkAndGrantTitles(user.username);
      playBeep(760);
      showToast(appState.lang === "uk" ? "Бізнес прокачано" : "Business upgraded");
      await renderBusinessPage();
    };
  });
}

async function renderRealtyPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const html = REALTY_CATALOG.map(item => {
    const owned = (user.realty || []).includes(item.id);

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(item.img, item.name)}
          <div>
            <h4>${item.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(item.price)} грн</div>
            <div class="sub">+${formatNum(item.income)} грн/хв</div>
          </div>
        </div>

        <div class="asset-actions">
          ${
            owned
              ? `<button disabled>${tr("owned")}</button>`
              : `<button data-buy-realty="${item.id}">${tr("buy")}</button>`
          }
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🏝️ ${tr("realty")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-realty]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.buyRealty;
      const item = REALTY_CATALOG.find(x => x.id === id);
      if (!item) return;

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < item.price) return showToast(tr("insufficientFunds"), true);

      const updatedRealty = Array.from(new Set([...(user.realty || []), id]));

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - item.price,
        realty: updatedRealty
      });

      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${item.name}`, -item.price);
      await checkAndGrantTitles(user.username);
      playBeep(710);
      showToast(tr("bought"));
      await renderRealtyPage();
    };
  });
}

async function renderCarsPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const html = CAR_CATALOG.map(item => {
    const owned = (user.cars || []).includes(item.id);

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(item.img, item.name)}
          <div>
            <h4>${item.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(item.priceUsd)} USD</div>
          </div>
        </div>

        <div class="asset-actions">
          ${
            owned
              ? `<button disabled>${tr("owned")}</button>`
              : `<button data-buy-car="${item.id}">${tr("buy")}</button>`
          }
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🚗 ${tr("cars")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-car]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.buyCar;
      const item = CAR_CATALOG.find(x => x.id === id);
      if (!item) return;

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.usd) < item.priceUsd) return showToast(tr("insufficientFunds"), true);

      const updatedCars = Array.from(new Set([...(user.cars || []), id]));

      const ok = await updatePlayer(user.username, {
        usd: Number(user.usd) - item.priceUsd,
        cars: updatedCars
      });

      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${item.name}`, -item.priceUsd);
      await checkAndGrantTitles(user.username);
      playBeep(680);
      showToast(tr("bought"));
      await renderCarsPage();
    };
  });
}

async function renderFriendsPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const myId = user.id;
  const myFriends = (user.friends || []).map(id => appState.allPlayers.find(p => p.id === id)).filter(Boolean);

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">👥 ${tr("friendsTitle")}</h2>

    <div class="panel">
      <p><b>${appState.lang === "uk" ? "Твій ID" : "Your ID"}:</b> ${myId}</p>
      <div class="transfer-row">
        <input id="friend-id-input" placeholder="${appState.lang === "uk" ? "Введи ID друга" : "Enter friend ID"}">
        <button id="add-friend-btn">${appState.lang === "uk" ? "Додати в друзі" : "Add friend"}</button>
      </div>
    </div>

    <div class="panel" style="margin-top:16px">
      <h3>${appState.lang === "uk" ? "Список друзів" : "Friends list"}</h3>
      <div class="rank-list">
        ${
          myFriends.length
            ? myFriends.map(friend => `
              <div class="rank-item">
                <div class="rank-badge">👤</div>
                <div>
                  <div><b>${friend.username}</b></div>
                  <div class="sub">${friend.device === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`}</div>
                </div>
                <div class="sub">${getClassData(friend.class).title}</div>
              </div>
            `).join("")
            : `<div class="sub">${tr("none")}</div>`
        }
      </div>
    </div>
  `;

  document.getElementById("add-friend-btn").onclick = async () => {
    const friendId = sanitize(document.getElementById("friend-id-input").value);
    if (!friendId) return showToast(tr("invalidData"), true);
    if (friendId === user.id) return showToast(tr("invalidData"), true);

    const friend = appState.allPlayers.find(p => p.id === friendId);
    if (!friend) return showToast(tr("playerNotFound"), true);

    const updatedMine = Array.from(new Set([...(user.friends || []), friend.id]));
    const updatedFriend = Array.from(new Set([...(friend.friends || []), user.id]));

    const ok1 = await updatePlayer(user.username, { friends: updatedMine });
    const ok2 = await updatePlayer(friend.username, { friends: updatedFriend });

    if (!ok1 || !ok2) return;

    await appendHistory(user.username, `${appState.lang === "uk" ? "Додав у друзі" : "Added friend"}: ${friend.username}`);
    await appendHistory(friend.username, `${appState.lang === "uk" ? "Новий друг" : "New friend"}: ${user.username}`);

    showToast(appState.lang === "uk" ? "Друг доданий" : "Friend added");
    await renderFriendsPage();
  };
}

async function renderTransfersPage() {
  await fetchAllPlayers();
  await fetchGameState();
  const user = getCurrentUserRow();
  if (!user) return;

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">💸 ${tr("transfer")}</h2>

    <div class="grid" style="gap:16px">
      <div class="panel">
        <h3>${tr("transferUah")}</h3>
        <div class="sub">${tr("meOrNick")}</div>
        <div class="transfer-row">
          <input id="transfer-uah-to" placeholder="${tr("recipient")}">
          <input id="transfer-uah-amount" type="number" placeholder="${tr("amount")}">
          <button id="transfer-uah-btn">${tr("transferUah")}</button>
        </div>
      </div>

      <div class="panel">
        <h3>${tr("transferUsd")}</h3>
        <div class="transfer-row">
          <input id="transfer-usd-to" placeholder="${tr("recipient")}">
          <input id="transfer-usd-amount" type="number" placeholder="${tr("amount")}">
          <button id="transfer-usd-btn">${tr("transferUsd")}</button>
        </div>
      </div>

      <div class="panel">
        <h3>${tr("transferCrypto")}</h3>
        <div class="transfer-row">
          <input id="transfer-crypto-to" placeholder="${tr("recipient")}">
          <input id="transfer-crypto-symbol" placeholder="${tr("symbol")} BTC">
          <input id="transfer-crypto-amount" type="number" placeholder="${tr("amount")}">
          <button id="transfer-crypto-btn">${tr("transferCrypto")}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("transfer-uah-btn").onclick = async () => {
    const recipientName = normalizeRecipient(document.getElementById("transfer-uah-to").value, user.username);
    const amount = Number(document.getElementById("transfer-uah-amount").value);
    const recipient = appState.allPlayers.find(p => p.username === recipientName);

    if (!recipient) return showToast(tr("invalidUser"), true);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("transferRequiresCvv"))) return;

    const fee = amount * 0.05;
    const total = amount + fee;
    if (Number(user.balance) < total) return showToast(tr("insufficientFunds"), true);

    const ok1 = await updatePlayer(user.username, { balance: Number(user.balance) - total });
    const ok2 = await updatePlayer(recipient.username, { balance: Number(recipient.balance) + amount });

    if (!ok1 || !ok2) return;

    appState.commissionBank += fee;
    await saveGameState();

    await appendHistory(user.username, `${tr("transferUah")} → ${recipient.username}: ${formatNum(amount)} грн`, amount);
    await appendHistory(recipient.username, `${tr("transferUah")} ← ${user.username}: ${formatNum(amount)} грн`, amount);

    playBeep(620);
    showToast(tr("sent"));
    await renderTransfersPage();
  };

  document.getElementById("transfer-usd-btn").onclick = async () => {
    const recipientName = normalizeRecipient(document.getElementById("transfer-usd-to").value, user.username);
    const amount = Number(document.getElementById("transfer-usd-amount").value);
    const recipient = appState.allPlayers.find(p => p.username === recipientName);

    if (!recipient) return showToast(tr("invalidUser"), true);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("transferRequiresCvv"))) return;

    const fee = amount * 0.05;
    const total = amount + fee;
    if (Number(user.usd) < total) return showToast(tr("insufficientFunds"), true);

    const ok1 = await updatePlayer(user.username, { usd: Number(user.usd) - total });
    const ok2 = await updatePlayer(recipient.username, { usd: Number(recipient.usd) + amount });

    if (!ok1 || !ok2) return;

    appState.commissionBank += fee * appState.usdRate;
    await saveGameState();

    await appendHistory(user.username, `${tr("transferUsd")} → ${recipient.username}: ${formatNum(amount)} USD`, amount);
    await appendHistory(recipient.username, `${tr("transferUsd")} ← ${user.username}: ${formatNum(amount)} USD`, amount);

    playBeep(620);
    showToast(tr("sent"));
    await renderTransfersPage();
  };

  document.getElementById("transfer-crypto-btn").onclick = async () => {
    const recipientName = normalizeRecipient(document.getElementById("transfer-crypto-to").value, user.username);
    const symbol = sanitize(document.getElementById("transfer-crypto-symbol").value).toUpperCase();
    const amount = Number(document.getElementById("transfer-crypto-amount").value);
    const recipient = appState.allPlayers.find(p => p.username === recipientName);

    if (!recipient) return showToast(tr("invalidUser"), true);
    if (!symbol || !appState.market.crypto[symbol]) return showToast(tr("invalidData"), true);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("transferRequiresCvv"))) return;

    const fee = amount * 0.01;
    const total = amount + fee;
    if (Number(user.crypto[symbol] || 0) < total) return showToast(tr("insufficientFunds"), true);

    const senderCrypto = { ...user.crypto, [symbol]: Number(user.crypto[symbol] || 0) - total };
    const recipientCrypto = { ...recipient.crypto, [symbol]: Number(recipient.crypto[symbol] || 0) + amount };

    const ok1 = await updatePlayer(user.username, { crypto: senderCrypto });
    const ok2 = await updatePlayer(recipient.username, { crypto: recipientCrypto });

    if (!ok1 || !ok2) return;

    appState.commissionBank += fee * appState.market.crypto[symbol].price;
    await saveGameState();

    await appendHistory(user.username, `${tr("transferCrypto")} → ${recipient.username}: ${formatNum(amount)} ${symbol}`, amount);
    await appendHistory(recipient.username, `${tr("transferCrypto")} ← ${user.username}: ${formatNum(amount)} ${symbol}`, amount);

    playBeep(620);
    showToast(tr("sent"));
    await renderTransfersPage();
  };
}

async function renderHistoryPage() {
  const user = getCurrentUserRow();
  if (!user) return;

  const history = await fetchHistory(user.username);

  const html = history.map(item => `
    <div class="history-item">
      <div class="history-top">
        <b>${item.text}</b>
        <span class="sub">${new Date(item.created_at).toLocaleString()}</span>
      </div>
    </div>
  `).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🕓 ${tr("history")}</h2>
    <div class="history-list">
      ${html || `<div class="panel">${tr("historyEmpty")}</div>`}
    </div>
  `;
}
async function renderTopPage() {
  await fetchAllPlayers();

  const ranking = [...appState.allPlayers]
    .filter(player => !player.banned)
    .map(player => ({
      ...player,
      capitalUsd: calculateCapitalUsd(player),
      onlineNow: Date.now() - new Date(player.last_seen).getTime() < 120000
    }))
    .sort((a, b) => Number(b.total_earned) - Number(a.total_earned))
    .slice(0, 100);

  const html = ranking.map((item, index) => `
    <div class="rank-item">
      <div class="rank-badge">#${index + 1}</div>
      <div>
        <div><b>${item.username}</b></div>
        <div class="sub">${getClassData(item.class).title}</div>
        <div class="sub">
          ${item.onlineNow ? `🟢 ${tr("online")}` : ""}
          ${item.device === "phone" ? ` • 📱 ${tr("phone")}` : ` • 🖥 ${tr("desktop")}`}
        </div>
        <div>
          ${
            (item.titles || []).length
              ? item.titles.map(t => `<span class="badge-title">${t}</span>`).join("")
              : ""
          }
        </div>
      </div>
      <div style="text-align:right">
        <div><b>${formatNum(item.total_earned)} грн</b></div>
        <div class="sub">${tr("totalAssets")}: ${formatNum(item.capitalUsd)} USD</div>
      </div>
    </div>
  `).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🏆 ${tr("rankTitle")}</h2>
    <div class="rank-list">${html}</div>
  `;
}

async function createBattle(creatorUsername, stake) {
  const now = new Date();
  const end = new Date(now.getTime() + 60000);

  const { data, error } = await supabaseClient
    .from("tap_battles")
    .insert({
      creator_username: creatorUsername,
      stake,
      status: "waiting",
      created_at: now.toISOString(),
      started_at: null,
      ends_at: end.toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return null;
  }

  return data;
}

async function joinBattle(battleId, opponentUsername) {
  const now = new Date();
  const end = new Date(now.getTime() + 60000);

  const { error } = await supabaseClient
    .from("tap_battles")
    .update({
      opponent_username: opponentUsername,
      status: "active",
      started_at: now.toISOString(),
      ends_at: end.toISOString()
    })
    .eq("id", battleId);

  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return false;
  }

  return true;
}

async function fetchOpenBattles() {
  const { data, error } = await supabaseClient
    .from("tap_battles")
    .select("*")
    .in("status", ["waiting", "active"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

async function fetchMyActiveBattle(username) {
  const { data, error } = await supabaseClient
    .from("tap_battles")
    .select("*")
    .or(`creator_username.eq.${username},opponent_username.eq.${username}`)
    .in("status", ["waiting", "active"])
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return null;
  }

  return (data || [])[0] || null;
}

async function addBattleTap(battle, username) {
  if (!battleIsActive(battle)) return false;

  const patch = {};
  if (battle.creator_username === username) {
    patch.creator_taps = Number(battle.creator_taps || 0) + 1;
  } else if (battle.opponent_username === username) {
    patch.opponent_taps = Number(battle.opponent_taps || 0) + 1;
  } else {
    return false;
  }

  const { error } = await supabaseClient
    .from("tap_battles")
    .update(patch)
    .eq("id", battle.id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

async function finishBattleIfNeeded(battle) {
  if (!battle) return;
  if (battle.status !== "active") return;
  if (!battle.ends_at) return;
  if (Date.now() < new Date(battle.ends_at).getTime()) return;

  let winner = null;
  const creatorTaps = Number(battle.creator_taps || 0);
  const opponentTaps = Number(battle.opponent_taps || 0);
  const totalPot = Number(battle.stake || 0) * 2;

  if (creatorTaps > opponentTaps) winner = battle.creator_username;
  if (opponentTaps > creatorTaps) winner = battle.opponent_username;

  if (winner) {
    const winnerPlayer = appState.allPlayers.find(p => p.username === winner);
    if (winnerPlayer) {
      await updatePlayer(winner, {
        balance: Number(winnerPlayer.balance) + totalPot,
        total_earned: Number(winnerPlayer.total_earned) + totalPot
      });
      await appendHistory(winner, `${appState.lang === "uk" ? "Перемога в дуелі" : "Battle win"}: +${formatNum(totalPot)} грн`, totalPot);
      await checkAndGrantTitles(winner);
    }
  } else {
    const creator = appState.allPlayers.find(p => p.username === battle.creator_username);
    const opponent = appState.allPlayers.find(p => p.username === battle.opponent_username);

    if (creator) {
      await updatePlayer(creator.username, { balance: Number(creator.balance) + Number(battle.stake || 0) });
      await appendHistory(creator.username, `${appState.lang === "uk" ? "Повернення ставки за нічию" : "Battle draw refund"}: +${formatNum(battle.stake)} грн`, battle.stake);
    }

    if (opponent) {
      await updatePlayer(opponent.username, { balance: Number(opponent.balance) + Number(battle.stake || 0) });
      await appendHistory(opponent.username, `${appState.lang === "uk" ? "Повернення ставки за нічию" : "Battle draw refund"}: +${formatNum(battle.stake)} грн`, battle.stake);
    }
  }

  await supabaseClient
    .from("tap_battles")
    .update({
      status: "finished",
      winner_username: winner
    })
    .eq("id", battle.id);
}

async function renderBattlePage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const openBattles = await fetchOpenBattles();
  const myBattle = await fetchMyActiveBattle(user.username);

  if (myBattle) {
    await finishBattleIfNeeded(myBattle);
  }

  const freshBattle = await fetchMyActiveBattle(user.username);

  const battlesHtml = openBattles
    .filter(b => b.status === "waiting" && b.creator_username !== user.username)
    .map(b => `
      <div class="rank-item">
        <div class="rank-badge">⚔️</div>
        <div>
          <div><b>${b.creator_username}</b></div>
          <div class="sub">${appState.lang === "uk" ? "Ставка" : "Stake"}: ${formatNum(b.stake)} грн</div>
        </div>
        <div>
          <button data-join-battle="${b.id}">${appState.lang === "uk" ? "Прийняти" : "Join"}</button>
        </div>
      </div>
    `).join("");

  let activeBattleHtml = "";

  if (freshBattle) {
    const remainingMs = freshBattle.ends_at ? Math.max(0, new Date(freshBattle.ends_at).getTime() - Date.now()) : 0;
    const remainingSec = Math.ceil(remainingMs / 1000);

    activeBattleHtml = `
      <div class="panel" style="margin-bottom:16px">
        <h3>${tr("tapBattleTitle")}</h3>
        <p><b>${appState.lang === "uk" ? "Статус" : "Status"}:</b> ${freshBattle.status}</p>
        <p><b>${appState.lang === "uk" ? "Ставка" : "Stake"}:</b> ${formatNum(freshBattle.stake)} грн</p>
        <p><b>${appState.lang === "uk" ? "Ти" : "You"}:</b> ${user.username}</p>
        <p><b>${appState.lang === "uk" ? "Таймер" : "Timer"}:</b> ${remainingSec}s</p>
        <p><b>${freshBattle.creator_username}</b>: ${freshBattle.creator_taps || 0} ${appState.lang === "uk" ? "тапів" : "taps"}</p>
        <p><b>${freshBattle.opponent_username || "..."}</b>: ${freshBattle.opponent_taps || 0} ${appState.lang === "uk" ? "тапів" : "taps"}</p>
        ${
          freshBattle.status === "active"
            ? `<button id="battle-tap-btn">${appState.lang === "uk" ? "ТАПАТИ В ДУЕЛІ" : "TAP IN BATTLE"}</button>`
            : ""
        }
      </div>
    `;
  }

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">⚔️ ${tr("tapBattleTitle")}</h2>

    ${activeBattleHtml}

    <div class="panel">
      <h3>${appState.lang === "uk" ? "Створити дуель" : "Create battle"}</h3>
      <div class="transfer-row">
        <input id="battle-stake-input" type="number" placeholder="${appState.lang === "uk" ? "Ставка" : "Stake"}">
        <button id="create-battle-btn">${appState.lang === "uk" ? "Створити" : "Create"}</button>
      </div>
    </div>

    <div class="panel" style="margin-top:16px">
      <h3>${appState.lang === "uk" ? "Доступні дуелі" : "Open battles"}</h3>
      <div class="rank-list">
        ${battlesHtml || `<div class="sub">${tr("none")}</div>`}
      </div>
    </div>
  `;

  if (document.getElementById("create-battle-btn")) {
    document.getElementById("create-battle-btn").onclick = async () => {
      const stake = Number(document.getElementById("battle-stake-input").value);
      if (!stake || stake <= 0) return showToast(tr("invalidData"), true);
      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < stake) return showToast(tr("insufficientFunds"), true);

      const existing = await fetchMyActiveBattle(user.username);
      if (existing) return showToast(appState.lang === "uk" ? "У тебе вже є активна дуель" : "You already have an active battle", true);

      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - stake
      });
      if (!ok) return;

      const created = await createBattle(user.username, stake);
      if (!created) {
        await updatePlayer(user.username, { balance: Number(user.balance) + stake });
        return;
      }

      await appendHistory(user.username, `${appState.lang === "uk" ? "Створив дуель" : "Created battle"}: -${formatNum(stake)} грн`, -stake);
      showToast(appState.lang === "uk" ? "Дуель створено" : "Battle created");
      await renderBattlePage();
    };
  }

  document.querySelectorAll("[data-join-battle]").forEach(button => {
    button.onclick = async () => {
      const battleId = button.dataset.joinBattle;
      const battle = openBattles.find(b => b.id === battleId);
      if (!battle) return;

      const myExisting = await fetchMyActiveBattle(user.username);
      if (myExisting) return showToast(appState.lang === "uk" ? "У тебе вже є активна дуель" : "You already have an active battle", true);

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < Number(battle.stake)) return showToast(tr("insufficientFunds"), true);

      const ok1 = await updatePlayer(user.username, {
        balance: Number(user.balance) - Number(battle.stake)
      });
      if (!ok1) return;

      const joined = await joinBattle(battle.id, user.username);
      if (!joined) {
        await updatePlayer(user.username, { balance: Number(user.balance) + Number(battle.stake) });
        return;
      }

      await appendHistory(user.username, `${appState.lang === "uk" ? "Приєднався до дуелі" : "Joined battle"}: -${formatNum(battle.stake)} грн`, -battle.stake);
      showToast(appState.lang === "uk" ? "Дуель почалась" : "Battle started");
      await renderBattlePage();
    };
  });

  if (document.getElementById("battle-tap-btn") && freshBattle) {
    document.getElementById("battle-tap-btn").onclick = async () => {
      const ok = await addBattleTap(freshBattle, user.username);
      if (!ok) return;
      playBeep(520, 0.03, 0.03);
      await renderBattlePage();
    };
  }
}

async function casinoFlip(user, bet) {
  const win = Math.random() < 0.48;
  const reward = win ? bet * 2 : 0;
  return {
    win,
    reward,
    text: win
      ? (appState.lang === "uk" ? "Монетка: виграш" : "Coin flip: win")
      : (appState.lang === "uk" ? "Монетка: програш" : "Coin flip: lose")
  };
}

async function casinoSlots(user, bet) {
  const icons = ["🍒", "💎", "7️⃣", "🍋", "⭐"];
  const a = icons[rand(0, icons.length - 1)];
  const b = icons[rand(0, icons.length - 1)];
  const c = icons[rand(0, icons.length - 1)];

  let reward = 0;
  if (a === b && b === c) reward = bet * 5;
  else if (a === b || b === c || a === c) reward = bet * 2;

  return {
    win: reward > 0,
    reward,
    text: `${a} ${b} ${c}`
  };
}

async function casinoDice(user, bet) {
  const myRoll = rand(1, 6);
  const houseRoll = rand(1, 6);

  let reward = 0;
  if (myRoll > houseRoll) reward = bet * 2;
  if (myRoll === houseRoll) reward = bet;

  return {
    win: reward > bet,
    reward,
    text: `${appState.lang === "uk" ? "Ти" : "You"} ${myRoll} : ${houseRoll} ${appState.lang === "uk" ? "казино" : "casino"}`
  };
}

async function logCasino(username, game, bet, result) {
  await supabaseClient.from("casino_logs").insert({
    username,
    game,
    bet,
    result
  });
}

async function fetchCasinoLogs(username) {
  const { data, error } = await supabaseClient
    .from("casino_logs")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

async function renderCasinoPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const logs = await fetchCasinoLogs(user.username);

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🎰 ${tr("casinoTitle")}</h2>

    <div class="grid" style="gap:16px">
      <div class="panel">
        <h3>${appState.lang === "uk" ? "Монетка" : "Coin flip"}</h3>
        <div class="transfer-row">
          <input id="casino-bet-flip" type="number" placeholder="${tr("amount")}">
          <button id="casino-flip-btn">${appState.lang === "uk" ? "Грати" : "Play"}</button>
        </div>
      </div>

      <div class="panel">
        <h3>${appState.lang === "uk" ? "Слоти" : "Slots"}</h3>
        <div class="transfer-row">
          <input id="casino-bet-slots" type="number" placeholder="${tr("amount")}">
          <button id="casino-slots-btn">${appState.lang === "uk" ? "Крутити" : "Spin"}</button>
        </div>
      </div>

      <div class="panel">
        <h3>${appState.lang === "uk" ? "Кості" : "Dice"}</h3>
        <div class="transfer-row">
          <input id="casino-bet-dice" type="number" placeholder="${tr("amount")}">
          <button id="casino-dice-btn">${appState.lang === "uk" ? "Кинути" : "Roll"}</button>
        </div>
      </div>

      <div class="panel">
        <h3>${appState.lang === "uk" ? "Останні ігри" : "Recent games"}</h3>
        <div class="history-list">
          ${
            logs.length
              ? logs.map(log => `
                <div class="history-item">
                  <div class="history-top">
                    <b>${log.game}</b>
                    <span class="sub">${new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <div class="sub">${appState.lang === "uk" ? "Ставка" : "Bet"}: ${formatNum(log.bet)} | ${appState.lang === "uk" ? "Результат" : "Result"}: ${formatNum(log.result)}</div>
                </div>
              `).join("")
              : `<div class="sub">${tr("none")}</div>`
          }
        </div>
      </div>
    </div>
  `;

  const handleCasinoGame = async (gameName, betInputId, gameFn) => {
    const bet = Number(document.getElementById(betInputId).value);
    if (!bet || bet <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
    if (Number(user.balance) < bet) return showToast(tr("insufficientFunds"), true);

    const ok1 = await updatePlayer(user.username, {
      balance: Number(user.balance) - bet
    });
    if (!ok1) return;

    const result = await gameFn(user, bet);
    const payout = Number(result.reward || 0);

    const ok2 = await updatePlayer(user.username, {
      balance: Number(user.balance) + payout,
      total_earned: Number(user.total_earned) + Math.max(0, payout - bet)
    });
    if (!ok2) return;

    await logCasino(user.username, gameName, bet, payout - bet);
    await appendHistory(
      user.username,
      `${appState.lang === "uk" ? "Казино" : "Casino"} ${gameName}: ${result.text}`,
      payout - bet
    );

    await checkAndGrantTitles(user.username);

    if (payout > bet) {
      playBeep(860);
      showToast(`${appState.lang === "uk" ? "Виграш" : "Win"} +${formatNum(payout - bet)}`);
    } else if (payout === bet) {
      playBeep(600);
      showToast(appState.lang === "uk" ? "Нічия" : "Draw");
    } else {
      playBeep(320);
      showToast(appState.lang === "uk" ? "Програш" : "Lose", true);
    }

    await renderCasinoPage();
  };

  document.getElementById("casino-flip-btn").onclick = () => handleCasinoGame("Coin Flip", "casino-bet-flip", casinoFlip);
  document.getElementById("casino-slots-btn").onclick = () => handleCasinoGame("Slots", "casino-bet-slots", casinoSlots);
  document.getElementById("casino-dice-btn").onclick = () => handleCasinoGame("Dice", "casino-bet-dice", casinoDice);
}

async function renderSupportPage() {
  await fetchAllPlayers();
  await fetchGameState();
  const user = getCurrentUserRow();
  if (!user) return;

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">❤️ ${tr("support")}</h2>
    <div class="panel">
      <p><b>${tr("supportBank")}:</b> ${formatNum(appState.supportBank)} грн</p>
      <div class="transfer-row">
        <input id="support-amount" type="number" placeholder="${tr("amount")}">
        <button id="support-send-btn">${tr("donate")}</button>
      </div>
    </div>
  `;

  document.getElementById("support-send-btn").onclick = async () => {
    const amount = Number(document.getElementById("support-amount").value);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);
    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
    if (Number(user.balance) < amount) return showToast(tr("insufficientFunds"), true);

    const ok = await updatePlayer(user.username, {
      balance: Number(user.balance) - amount
    });
    if (!ok) return;

    appState.supportBank += amount;
    await saveGameState();
    await appendHistory(user.username, `${tr("donate")}: ${formatNum(amount)} грн`, amount);

    playBeep(600);
    showToast(tr("donated"));
    await renderSupportPage();
  };
}

async function handleVipGiveaway() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  if (!hasVipAccess(user)) return showToast(tr("vipRequiresClass"), true);
  if (user.vip_giveaway_day === new Date().toDateString()) return showToast(tr("dailyBonusTaken"), true);

  const amount = Number(prompt("Сума (max 100000)"));
  if (!amount || amount <= 0 || amount > 100000) return;

  const rawTarget = prompt(`${tr("recipient")} (${tr("meOrNick")})`);
  const targetName = normalizeRecipient(rawTarget, user.username);
  const target = appState.allPlayers.find(p => p.username === targetName);

  if (!target) return showToast(tr("invalidUser"), true);
  if (Number(user.balance) < amount) return showToast(tr("insufficientFunds"), true);

  const ok1 = await updatePlayer(user.username, {
    balance: Number(user.balance) - amount,
    vip_giveaway_day: new Date().toDateString()
  });

  const ok2 = await updatePlayer(target.username, {
    balance: Number(target.balance) + amount,
    total_earned: Number(target.total_earned) + amount
  });

  if (!ok1 || !ok2) return;

  await appendHistory(user.username, `VIP → ${target.username}: ${formatNum(amount)} грн`, amount);
  await appendHistory(target.username, `VIP ← ${user.username}: ${formatNum(amount)} грн`, amount);
  await checkAndGrantTitles(target.username);

  playBeep(880);
  showToast(tr("vipSent"));
  await renderProfilePage();
}

async function renderAdminPage() {
  await fetchAllPlayers();
  await fetchGameState();
  const user = getCurrentUserRow();

  if (!user || !isCreator(user)) {
    document.getElementById("page-content").innerHTML = `<div class="panel">${tr("creatorPanel")}</div>`;
    return;
  }

  const players = appState.allPlayers.map(player => player.username).sort();
  const onlineHtml = appState.onlinePlayers.map(player => `
    <div class="rank-item">
      <div class="rank-badge">●</div>
      <div>
        <div><b>${player.username}</b></div>
        <div class="sub">${getClassData(player.class).title}</div>
        <div>${(player.titles || []).map(t => `<span class="badge-title">${t}</span>`).join("")}</div>
      </div>
      <div class="sub">${player.device === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`}</div>
    </div>
  `).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">👑 ${tr("creatorPanel")}</h2>

    <div class="grid" style="gap:16px">
      <div class="admin-card">
        <h3>${tr("adminAnalytics")}</h3>
        <p>${tr("totalPlayers")}: <b>${players.length}</b></p>
        <p>${tr("onlineUsers")}: <b>${appState.onlinePlayers.length}</b></p>
        <p>${tr("supportBank")}: <b>${formatNum(appState.supportBank)} грн</b></p>
        <p>${tr("commissionBank")}: <b>${formatNum(appState.commissionBank)} грн</b></p>
      </div>

      <div class="admin-card">
        <h3>${tr("onlinePlayersList")}</h3>
        <div class="rank-list">${onlineHtml || `<div class="sub">0</div>`}</div>
      </div>

      <div class="admin-card">
        <h3>${appState.lang === "uk" ? "Масові дії" : "Mass actions"}</h3>
        <div class="admin-actions">
          <button id="admin-mass-money-btn">${tr("onlineOnlyMoney")}</button>
          <button id="admin-mass-crypto-btn">${tr("onlineOnlyCrypto")}</button>
          <button id="admin-collect-commission-btn">${tr("collectCommission")}</button>
          <button id="admin-collect-support-btn">${tr("collectSupport")}</button>
        </div>
      </div>

      <div class="admin-card">
        <h3>${tr("sendGlobalMessage")}</h3>
        <div class="transfer-row">
          <input id="admin-global-message-input" placeholder="${tr("sendGlobalMessage")}">
          <button id="admin-send-message-btn">${tr("sendGlobalMessage")}</button>
        </div>
      </div>

      <div class="admin-card">
        <h3>${tr("playerManagement")}</h3>
        <div class="grid" style="gap:12px">
          <select id="admin-player-select">
            ${players.map(name => `<option value="${name}">${name}</option>`).join("")}
          </select>

          <input id="admin-amount-input" type="number" placeholder="${tr("amount")}">

          <select id="admin-class-select">
            ${classList.map(c => `<option value="${c.key}">${c.title}</option>`).join("")}
          </select>

          <select id="admin-business-select">
            ${BUSINESS_CATALOG.map(item => `<option value="${item.id}">${item.name}</option>`).join("")}
          </select>

          <select id="admin-realty-select">
            ${REALTY_CATALOG.map(item => `<option value="${item.id}">${item.name}</option>`).join("")}
          </select>

          <select id="admin-car-select">
            ${CAR_CATALOG.map(item => `<option value="${item.id}">${item.name}</option>`).join("")}
          </select>
        </div>

        <div class="admin-actions">
          <button id="admin-give-money-btn">${tr("giveMoney")}</button>
          <button id="admin-take-money-btn">${tr("takeMoney")}</button>
          <button id="admin-set-balance-btn">${tr("setBalance")}</button>
          <button id="admin-set-class-btn">${tr("setClass")}</button>
          <button id="admin-ban-btn">${tr("banUser")}</button>
          <button id="admin-unban-btn">${tr("unbanUser")}</button>
          <button id="admin-reset-btn">${tr("resetUser")}</button>
          <button id="admin-delete-btn">${tr("deleteUser")}</button>
          <button id="admin-give-business-btn">${tr("giveBusiness")}</button>
          <button id="admin-give-realty-btn">${tr("giveRealty")}</button>
          <button id="admin-give-car-btn">${tr("giveCar")}</button>
        </div>
      </div>
    </div>
  `;

  const getSelectedPlayer = () => {
    const username = document.getElementById("admin-player-select").value;
    const player = appState.allPlayers.find(p => p.username === username);
    if (!player) {
      showToast(tr("playerNotFound"), true);
      return null;
    }
    return player;
  };

  document.getElementById("admin-mass-money-btn").onclick = async () => {
    const amount = Number(prompt(tr("amount")));
    if (!amount || amount <= 0) return;

    for (const player of appState.onlinePlayers) {
      await updatePlayer(player.username, {
        balance: Number(player.balance) + amount,
        total_earned: Number(player.total_earned) + amount
      });
      await appendHistory(player.username, `${tr("onlineOnlyMoney")}: +${formatNum(amount)} грн`, amount);
      await checkAndGrantTitles(player.username);
    }

    playBeep(840);
    showToast(tr("massDone"));
    await renderAdminPage();
  };

  document.getElementById("admin-mass-crypto-btn").onclick = async () => {
    const symbol = sanitize(prompt(tr("symbol"))).toUpperCase();
    const amount = Number(prompt(tr("amount")));
    if (!symbol || !appState.market.crypto[symbol]) return showToast(tr("invalidData"), true);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);

    for (const player of appState.onlinePlayers) {
      const newCrypto = { ...(player.crypto || {}), [symbol]: Number(player.crypto?.[symbol] || 0) + amount };
      await updatePlayer(player.username, { crypto: newCrypto });
      await appendHistory(player.username, `${tr("onlineOnlyCrypto")}: +${formatNum(amount)} ${symbol}`, amount);
    }

    playBeep(850);
    showToast(tr("massDone"));
    await renderAdminPage();
  };

  document.getElementById("admin-collect-commission-btn").onclick = async () => {
    const creator = getCurrentUserRow();
    const amount = Number(appState.commissionBank);

    await updatePlayer(creator.username, {
      balance: Number(creator.balance) + amount,
      total_earned: Number(creator.total_earned) + amount
    });

    await appendHistory(creator.username, `${tr("collectCommission")}: +${formatNum(amount)} грн`, amount);
    appState.commissionBank = 0;
    await saveGameState();

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-collect-support-btn").onclick = async () => {
    const creator = getCurrentUserRow();
    const amount = Number(appState.supportBank);

    await updatePlayer(creator.username, {
      balance: Number(creator.balance) + amount,
      total_earned: Number(creator.total_earned) + amount
    });

    await appendHistory(creator.username, `${tr("collectSupport")}: +${formatNum(amount)} грн`, amount);
    appState.supportBank = 0;
    await saveGameState();

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-send-message-btn").onclick = async () => {
    appState.globalMessage = sanitize(document.getElementById("admin-global-message-input").value);
    await saveGameState();
    showToast(tr("valueUpdated"));
    updateHeader();
  };

  document.getElementById("admin-give-money-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const amount = Number(document.getElementById("admin-amount-input").value);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);

    await updatePlayer(player.username, {
      balance: Number(player.balance) + amount,
      total_earned: Number(player.total_earned) + amount
    });
    await appendHistory(player.username, `${tr("giveMoney")}: +${formatNum(amount)} грн`, amount);
    await checkAndGrantTitles(player.username);

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-take-money-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const amount = Number(document.getElementById("admin-amount-input").value);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);

    await updatePlayer(player.username, {
      balance: Math.max(0, Number(player.balance) - amount)
    });
    await appendHistory(player.username, `${tr("takeMoney")}: -${formatNum(amount)} грн`, -amount);

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-set-balance-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const amount = Number(document.getElementById("admin-amount-input").value);
    if (Number.isNaN(amount) || amount < 0) return showToast(tr("invalidData"), true);

    await updatePlayer(player.username, { balance: amount });
    await appendHistory(player.username, `${tr("setBalance")}: ${formatNum(amount)} грн`, amount);

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-set-class-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const classKey = document.getElementById("admin-class-select").value;

    await updatePlayer(player.username, { class: classKey });
    await appendHistory(player.username, `${tr("setClass")}: ${getClassData(classKey).title}`);

    showToast(tr("classSet"));
    await renderAdminPage();
  };

  document.getElementById("admin-ban-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player || player.username === "creator") return;
    await updatePlayer(player.username, { banned: true });
    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-unban-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    await updatePlayer(player.username, { banned: false });
    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-reset-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player || player.username === "creator") return;

    await updatePlayer(player.username, {
      balance: 500,
      usd: 0,
      total_earned: 500,
      class: "none",
      crypto: {},
      stocks: {},
      businesses: [],
      business_levels: {},
      realty: [],
      cars: [],
      titles: [],
      friends: player.friends || [],
      card_name: "BitBank Card",
      card_color: "black",
      card_cvv: String(rand(100, 999)),
      card_number: "4444 5555 6666 7777",
      card_expiry: "12/30",
      last_bonus_day: "",
      vip_giveaway_day: "",
      banned: false
    });

    await appendHistory(player.username, tr("accountReset"));
    showToast(tr("accountReset"));
    await renderAdminPage();
  };

  document.getElementById("admin-delete-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player || player.username === "creator") return;

    await supabaseClient.from("history").delete().eq("username", player.username);
    await supabaseClient.from("casino_logs").delete().eq("username", player.username);
    await supabaseClient.from("players").delete().eq("username", player.username);

    showToast(tr("accountDeleted"));
    await renderAdminPage();
  };

  document.getElementById("admin-give-business-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const businessId = document.getElementById("admin-business-select").value;
    const updated = Array.from(new Set([...(player.businesses || []), businessId]));
    const updatedLevels = { ...(player.business_levels || {}) };
    if (!updatedLevels[businessId]) updatedLevels[businessId] = 1;

    await updatePlayer(player.username, {
      businesses: updated,
      business_levels: updatedLevels
    });
    await appendHistory(player.username, `${tr("giveBusiness")}: ${BUSINESS_CATALOG.find(x => x.id === businessId)?.name || businessId}`);
    await checkAndGrantTitles(player.username);

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-give-realty-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const realtyId = document.getElementById("admin-realty-select").value;
    const updated = Array.from(new Set([...(player.realty || []), realtyId]));

    await updatePlayer(player.username, { realty: updated });
    await appendHistory(player.username, `${tr("giveRealty")}: ${REALTY_CATALOG.find(x => x.id === realtyId)?.name || realtyId}`);
    await checkAndGrantTitles(player.username);

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };

  document.getElementById("admin-give-car-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const carId = document.getElementById("admin-car-select").value;
    const updated = Array.from(new Set([...(player.cars || []), carId]));

    await updatePlayer(player.username, { cars: updated });
    await appendHistory(player.username, `${tr("giveCar")}: ${CAR_CATALOG.find(x => x.id === carId)?.name || carId}`);
    await checkAndGrantTitles(player.username);

    showToast(tr("valueUpdated"));
    await renderAdminPage();
  };
}

async function renderPage(page) {
  setActivePage(page);

  if (page === "dashboard") return renderProfilePage();
  if (page === "crypto") return renderCryptoPage();
  if (page === "stocks") return renderStocksPage();
  if (page === "business") return renderBusinessPage();
  if (page === "realty") return renderRealtyPage();
  if (page === "cars") return renderCarsPage();
  if (page === "classes") return renderClassesPage();
  if (page === "friends") return renderFriendsPage();
  if (page === "battle") return renderBattlePage();
  if (page === "casino") return renderCasinoPage();
  if (page === "transfer") return renderTransfersPage();
  if (page === "history") return renderHistoryPage();
  if (page === "top") return renderTopPage();
  if (page === "donate") return renderSupportPage();
  if (page === "admin") return renderAdminPage();
}

async function registerUser() {
  const username = sanitize(document.getElementById("reg-username")?.value).toLowerCase();
  const password = sanitize(document.getElementById("reg-password")?.value);

  if (username.length < 3) return showToast(tr("invalidData"), true);
  if (password.length < 4) return showToast(tr("invalidData"), true);
  if (["me", "admin"].includes(username)) return showToast(tr("bannedName"), true);

  await fetchAllPlayers();
  if (appState.allPlayers.some(player => player.username === username)) {
    return showToast(tr("userExists"), true);
  }

  const ok = await createPlayer(username, password);
  if (!ok) return;

  playBeep(760);
  showToast(tr("userCreated"));
  document.querySelector('[data-tab="login"]')?.click();

  if (document.getElementById("login-username")) document.getElementById("login-username").value = username;
  if (document.getElementById("login-password")) document.getElementById("login-password").value = password;
}

async function loginUser() {
  const username = sanitize(document.getElementById("login-username")?.value).toLowerCase();
  const password = sanitize(document.getElementById("login-password")?.value);

  const result = await loginPlayer(username, password);
  if (!result) return;

  playBeep(740);
  document.getElementById("login-screen")?.classList.add("hidden");
  document.getElementById("app-screen")?.classList.remove("hidden");

  await fetchAllPlayers();
  await fetchGameState();
  updateHeader();
  await renderProfilePage();
}

function logoutUser() {
  appState.currentUser = null;
  saveSession();
  document.getElementById("app-screen")?.classList.add("hidden");
  document.getElementById("login-screen")?.classList.remove("hidden");
}

async function changePin() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const newCvv = prompt(appState.lang === "uk" ? "Новий CVV (3 цифри)" : "New CVV (3 digits)", user.card_cvv);
  if (newCvv === null) return;
  if (!/^\d{3}$/.test(newCvv)) return showToast(tr("wrongCode"), true);

  const ok = await updatePlayer(user.username, { card_cvv: newCvv });
  if (!ok) return;

  playBeep(720);
  showToast(tr("cvvChanged"));
  await renderProfilePage();
}

async function handleClickIncome() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const battle = await fetchMyActiveBattle(user.username);
  if (battle && battle.status === "active" && battleIsActive(battle)) {
    await addBattleTap(battle, user.username);
    playBeep(540, 0.03, 0.03);
    await renderBattlePage();
    return;
  }

  const reward = getClickReward(user);
  const ok = await updatePlayer(user.username, {
    balance: Number(user.balance) + reward,
    total_earned: Number(user.total_earned) + reward,
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  if (!ok) return;

  await appendHistory(user.username, `${tr("click")}: +${formatNum(reward)} грн`, reward);
  await checkAndGrantTitles(user.username);
  playBeep(540);

  const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
  await renderPage(active);
}

async function passiveIncomeTick() {
  const user = getCurrentUserRow();
  if (!user) return;

  const amount = getPassiveIncome(user);
  if (amount <= 0) return;

  const ok = await updatePlayer(user.username, {
    balance: Number(user.balance) + amount,
    total_earned: Number(user.total_earned) + amount
  });
  if (!ok) return;

  await appendHistory(user.username, `${tr("passiveIncome")}: +${formatNum(amount)} грн`, amount);
  await checkAndGrantTitles(user.username);

  const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
  await renderPage(active);
}

function marketTick() {
  Object.values(appState.market.crypto).forEach(item => {
    const drift = 1 + (Math.random() - 0.5) * 0.06;
    item.price = Math.max(1, item.price * drift);
  });

  appState.market.stocks.forEach(item => {
    const drift = 1 + (Math.random() - 0.5) * 0.04;
    item.price = Math.max(10, item.price * drift);
  });
}

async function presenceTick() {
  const user = getCurrentUserRow();
  if (!user) return;

  await updatePlayer(user.username, {
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  await fetchAllPlayers();
  updateHeader();
}

function setupRealtime() {
  supabaseClient
    .channel("bitbank-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "players" }, async () => {
      await fetchAllPlayers();
      updateHeader();

      const active = document.querySelector(".nav-btn.active")?.dataset.page;
      if (active === "admin" || active === "top" || active === "friends") {
        await renderPage(active);
      }
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "game_state" }, async () => {
      await fetchGameState();
      updateHeader();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "tap_battles" }, async () => {
      const active = document.querySelector(".nav-btn.active")?.dataset.page;
      if (active === "battle") await renderBattlePage();
    })
    .subscribe();
}

function bindEvents() {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const clickBtn = document.getElementById("click-btn");
  const changePinBtn = document.getElementById("change-pin-btn");
  const changeCardNameBtn = document.getElementById("change-card-name-btn");
  const changeCardColorBtn = document.getElementById("change-card-color-btn");
  const vipBtn = document.getElementById("vip-giveaway-btn");
  const soundBtn = document.getElementById("toggle-sound-btn");
  const langBtn = document.getElementById("lang-btn");
  const sidebarOpenBtn = document.getElementById("sidebar-open");
  const sidebarCloseBtn = document.getElementById("sidebar-close");
  const overlay = document.getElementById("overlay");
  const closeColorBtn = document.getElementById("close-color-modal");

  if (loginBtn) loginBtn.onclick = loginUser;
  if (registerBtn) registerBtn.onclick = registerUser;
  if (logoutBtn) logoutBtn.onclick = logoutUser;
  if (clickBtn) clickBtn.onclick = handleClickIncome;
  if (changePinBtn) changePinBtn.onclick = changePin;

  if (changeCardNameBtn) {
    changeCardNameBtn.onclick = async () => {
      await fetchAllPlayers();
      const user = getCurrentUserRow();
      if (!user) return;

      const newName = prompt(appState.lang === "uk" ? "Нова назва карти" : "New card name", user.card_name);
      if (!newName) return;

      const ok = await updatePlayer(user.username, { card_name: newName.slice(0, 24) });
      if (!ok) return;

      showToast(tr("cardNameChanged"));
      await renderProfilePage();
    };
  }

  if (changeCardColorBtn) changeCardColorBtn.onclick = openColorModal;
  if (vipBtn) vipBtn.onclick = handleVipGiveaway;

  if (soundBtn) {
    soundBtn.onclick = () => {
      appState.soundEnabled = !appState.soundEnabled;
      saveSession();
      updateHeader();
      showToast(appState.soundEnabled ? tr("soundOn") : tr("soundOff"));
    };
  }

  if (langBtn) {
    langBtn.onclick = async () => {
      appState.lang = appState.lang === "uk" ? "en" : "uk";
      saveSession();
      updateHeader();
      const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
      await renderPage(active);
    };
  }

  if (sidebarOpenBtn) {
    sidebarOpenBtn.onclick = () => {
      document.getElementById("sidebar")?.classList.add("show");
      document.getElementById("overlay")?.classList.add("show");
    };
  }

  if (sidebarCloseBtn) sidebarCloseBtn.onclick = closeSidebar;
  if (overlay) overlay.onclick = closeSidebar;
  if (closeColorBtn) closeColorBtn.onclick = closeColorModal;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach(item => item.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`${btn.dataset.tab}-form`)?.classList.add("active");
    };
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.onclick = async () => {
      const page = btn.dataset.page;
      await renderPage(page);
      closeSidebar();
    };
  });

  document.querySelectorAll(".color-option").forEach(button => {
    button.onclick = async () => {
      await fetchAllPlayers();
      const user = getCurrentUserRow();
      if (!user) return;

      const ok = await updatePlayer(user.username, {
        card_color: button.dataset.color
      });
      if (!ok) return;

      closeColorModal();
      showToast(tr("colorChanged"));
      await renderProfilePage();
    };
  });
}

async function initApp() {
  loadSession();

  appState.market.crypto = Object.fromEntries(CRYPTO_CATALOG.map(item => [item.symbol, { ...item }]));
  appState.market.stocks = STOCKS_CATALOG.map(item => ({ ...item }));

  bindEvents();
  setupRealtime();

  if (appState.currentUser) {
    document.getElementById("login-screen")?.classList.add("hidden");
    document.getElementById("app-screen")?.classList.remove("hidden");

    await fetchAllPlayers();
    await fetchGameState();

    const current = getCurrentUserRow();
    if (!current || current.banned) {
      appState.currentUser = null;
      saveSession();
      document.getElementById("app-screen")?.classList.add("hidden");
      document.getElementById("login-screen")?.classList.remove("hidden");
      return;
    }

    updateHeader();
    await renderProfilePage();
  }

  setInterval(marketTick, 30000);
  setInterval(presenceTick, 15000);
  setInterval(passiveIncomeTick, 60000);

  setInterval(async () => {
    const user = getCurrentUserRow();
    if (!user) return;
    const battle = await fetchMyActiveBattle(user.username);
    if (battle) {
      await finishBattleIfNeeded(battle);
    }
  }, 3000);
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("APP START");

  const login = document.getElementById("login-screen");
  const app = document.getElementById("app-screen");

  if (login) login.classList.remove("hidden");
  if (app) app.classList.add("hidden");
});
initApp();
