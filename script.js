const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCAL_SESSION_KEY = "bitbank_supabase_session_v2";

let appState = {
  currentUser: null,
  lang: "uk",
  soundEnabled: true,
  usdRate: 40,
  commissionBank: 0,
  supportBank: 0,
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
    profile: "Профіль",
    crypto: "Крипто",
    stocks: "Акції",
    business: "Бізнес",
    realty: "Нерухомість",
    cars: "Авто",
    classes: "Класи",
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
    onlineOnlyMoney: "Видати всім онлайн гроші",
    onlineOnlyCrypto: "Видати всім онлайн крипту",
    onlineUsers: "Онлайн користувачі",
    totalPlayers: "Всього гравців",
    donate: "Підтримати",
    transferUah: "Переказ гривень",
    transferUsd: "Переказ USD",
    transferCrypto: "Переказ крипти",
    recipient: "Отримувач",
    amount: "Сума",
    symbol: "Символ",
    online: "ONLINE",
    phone: "З телефона",
    desktop: "ПК",
    click: "КЛІК",
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
    serverError: "Помилка сервера"
  },
  en: {
    profile: "Profile",
    crypto: "Crypto",
    stocks: "Stocks",
    business: "Business",
    realty: "Realty",
    cars: "Cars",
    classes: "Classes",
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
    onlineOnlyMoney: "Give all online money",
    onlineOnlyCrypto: "Give all online crypto",
    onlineUsers: "Online users",
    totalPlayers: "Total players",
    donate: "Donate",
    transferUah: "UAH transfer",
    transferUsd: "USD transfer",
    transferCrypto: "Crypto transfer",
    recipient: "Recipient",
    amount: "Amount",
    symbol: "Symbol",
    online: "ONLINE",
    phone: "On phone",
    desktop: "Desktop",
    click: "CLICK",
    invalidData: "Invalid data",
    insufficientFunds: "Insufficient funds",
    invalidUser: "Invalid user",
    userExists: "User already exists",
    bannedName: "This username is forbidden",
    userCreated: "Account created",
    loginError: "Invalid username or password",
    accountBanned: "Account is banned",
    noAccessStocks: "Stocks are available from Trader and above",
    noAccessBusiness: "Business is available from Businessman and above",
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
    serverError: "Server error"
  }
};

function tr(key) {
  return I18N[appState.lang][key] || key;
}

const classList = [
  {
    key: "none",
    title: "Starter",
    price: 0,
    clickReward: 5,
    passivePerMin: 0,
    perks: {
      uk: "Базовий старт. Доступ до профілю, крипти, переказів та історії.",
      en: "Basic start. Access to profile, crypto, transfers and history."
    }
  },
  {
    key: "basic",
    title: "Basic",
    price: 1000,
    clickReward: 15,
    passivePerMin: 10,
    perks: {
      uk: "Більше грошей за клік і маленький пасивний дохід.",
      en: "More money per click and small passive income."
    }
  },
  {
    key: "medium",
    title: "Medium",
    price: 6000,
    clickReward: 45,
    passivePerMin: 45,
    perks: {
      uk: "Сильніший пасивний дохід і швидший ріст.",
      en: "Stronger passive income and faster growth."
    }
  },
  {
    key: "trader",
    title: "Trader",
    price: 18000,
    clickReward: 110,
    passivePerMin: 110,
    perks: {
      uk: "Відкриває доступ до акцій. Усі класи вище теж бачать акції.",
      en: "Unlocks stocks. All higher classes also unlock stocks."
    }
  },
  {
    key: "vip",
    title: "VIP",
    price: 50000,
    clickReward: 250,
    passivePerMin: 260,
    perks: {
      uk: "VIP-роздача, золотий колір картки, кращий дохід.",
      en: "VIP giveaway, gold card, better income."
    }
  },
  {
    key: "businessman",
    title: "Businessman",
    price: 150000,
    clickReward: 600,
    passivePerMin: 700,
    perks: {
      uk: "Відкриває бізнеси та сильний пасивний дохід.",
      en: "Unlocks businesses and strong passive income."
    }
  },
  {
    key: "manager",
    title: "Manager",
    price: 500000,
    clickReward: 1700,
    passivePerMin: 2200,
    perks: {
      uk: "Максимально сильний дохід і всі плюшки нижчих класів.",
      en: "Very strong income and all lower class perks."
    }
  },
  {
    key: "creator",
    title: "Creator",
    price: 0,
    clickReward: 50000,
    passivePerMin: 25000,
    perks: {
      uk: "Повний контроль, адмінка, бачить усіх гравців.",
      en: "Full control, admin panel, sees all players."
    }
  }
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

function todayString() {
  return new Date().toDateString();
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

function imageTag(src, alt) {
  return `<img class="asset-thumb" src="${src}" alt="${alt}" onerror="this.src='https://via.placeholder.com/72x72/0e1624/ffffff?text=BB'">`;
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
    realty: parseJsonField(row.realty, []),
    cars: parseJsonField(row.cars, []),
    history_cache: parseJsonField(row.history_cache, [])
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

function getPassiveIncome(user) {
  let total = getClassData(user.class).passivePerMin;

  user.businesses.forEach(id => {
    const business = BUSINESS_CATALOG.find(item => item.id === id);
    if (business) total += business.income;
  });

  user.realty.forEach(id => {
    const realty = REALTY_CATALOG.find(item => item.id === id);
    if (realty) total += realty.income;
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
    if (item) totalUah += item.price;
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

async function fetchAllPlayers() {
  const { data, error } = await supabaseClient.from("players").select("*");
  if (error) {
    console.error(error);
    showToast(tr("serverError"), true);
    return [];
  }
  appState.allPlayers = (data || []).map(normalizePlayer);
  appState.onlinePlayers = appState.allPlayers.filter(player => Date.now() - new Date(player.last_seen).getTime() < 120000 && !player.banned);
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
  await supabaseClient.from("game_state").upsert({
    id: 1,
    support_bank: appState.supportBank,
    commission_bank: appState.commissionBank,
    global_message: appState.globalMessage
  });
}

async function appendHistory(username, text, amount = null) {
  await supabaseClient.from("history").insert({
    username,
    text,
    amount
  });
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
  if (prepared.realty && Array.isArray(prepared.realty)) prepared.realty = JSON.stringify(prepared.realty);
  if (prepared.cars && Array.isArray(prepared.cars)) prepared.cars = JSON.stringify(prepared.cars);
  if (prepared.history_cache && Array.isArray(prepared.history_cache)) prepared.history_cache = JSON.stringify(prepared.history_cache);

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
  const player = {
    username,
    password,
    balance: 500,
    usd: 0,
    total_earned: 500,
    class: "none",
    device: currentDeviceType(),
    crypto: JSON.stringify({}),
    stocks: JSON.stringify({}),
    businesses: JSON.stringify([]),
    realty: JSON.stringify([]),
    cars: JSON.stringify([]),
    history_cache: JSON.stringify([]),
    card_name: "BitBank Card",
    card_color: "black",
    card_cvv: String(rand(100, 999)),
    card_number: generateCardNumber(),
    card_expiry: generateCardExpiry(),
    banned: false,
    last_bonus_day: "",
    vip_giveaway_day: "",
    last_seen: new Date().toISOString()
  };

  const { error } = await supabaseClient.from("players").insert(player);

  if (error) {
    console.error(error);
    showToast(tr("userExists"), true);
    return false;
  }

  await appendHistory(username, tr("userCreated"));
  return true;
}

async function applyOfflineIncome(user) {
  const previous = new Date(user.last_seen).getTime();
  const now = Date.now();
  const minutesAway = Math.floor((now - previous) / 60000);

  if (minutesAway <= 0) return;

  const passive = getPassiveIncome(user);
  if (passive <= 0) return;

  const income = passive * minutesAway;

  await updatePlayer(user.username, {
    balance: Number(user.balance) + income,
    total_earned: Number(user.total_earned) + income
  });

  await appendHistory(user.username, `${appState.lang === "uk" ? "Офлайн дохід" : "Offline income"}: +${formatNum(income)} грн`, income);
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

  const user = normalizePlayer(data);

  if (user.banned) {
    showToast(tr("accountBanned"), true);
    return null;
  }

  await applyOfflineIncome(user);

  await updatePlayer(username, {
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  appState.currentUser = username;
  saveSession();

  return user;
}

function updateHeader() {
  const user = getCurrentUserRow();
  if (!user) return;

  document.getElementById("header-username").textContent = user.username;
  document.getElementById("header-status").textContent = getClassData(user.class).title.toUpperCase();
  document.getElementById("header-online").textContent = tr("online");
  document.getElementById("header-device").textContent = user.device === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`;
  document.getElementById("balance-uah").textContent = formatNum(user.balance);
  document.getElementById("balance-usd").textContent = formatNum(user.usd);
  document.getElementById("vip-giveaway-btn").classList.toggle("hidden", !hasVipAccess(user));
  document.getElementById("admin-nav").classList.toggle("hidden", !isCreator(user));
  document.getElementById("lang-btn").textContent = appState.lang === "uk" ? "EN" : "UA";
  document.getElementById("toggle-sound-btn").textContent = appState.soundEnabled ? "🔊 Звук" : "🔇 Звук";

  const globalMessageBox = document.getElementById("global-message");
  if (appState.globalMessage) {
    globalMessageBox.classList.remove("hidden");
    globalMessageBox.textContent = appState.globalMessage;
  } else {
    globalMessageBox.classList.add("hidden");
    globalMessageBox.textContent = "";
  }
}

function setActivePage(page) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

function openColorModal() {
  document.getElementById("color-modal").classList.remove("hidden");
}

function closeColorModal() {
  document.getElementById("color-modal").classList.add("hidden");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}

async function renderProfilePage() {
  await fetchAllPlayers();
  await fetchGameState();

  const user = getCurrentUserRow();
  if (!user) return;

  const classData = getClassData(user.class);

  const titles = [];
  if (user.class === "creator") titles.push("👑 Creator");
  if ((user.realty || []).includes("paradise")) titles.push("🏝 Island Lord");
  if ((user.businesses || []).includes("it")) titles.push("💻 Tech Boss");
  if ((user.cars || []).includes("huracan")) titles.push("🔥 Supercar Owner");

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

        <div style="margin-top:18px">
          <h3>${tr("titles")}</h3>
          <div>
            ${titles.length ? titles.map(item => `<span class="badge-title">${item}</span>`).join("") : `<span class="sub">${tr("none")}</span>`}
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
    if (user.last_bonus_day === todayString()) {
      showToast(tr("dailyBonusTaken"), true);
      return;
    }

    const bonus = rand(150, 650);
    const ok = await updatePlayer(user.username, {
      balance: Number(user.balance) + bonus,
      total_earned: Number(user.total_earned) + bonus,
      last_bonus_day: todayString()
    });

    if (!ok) return;

    await appendHistory(user.username, `${tr("dailyBonus")}: +${formatNum(bonus)} грн`, bonus);
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
      <div class="panel"><p>${tr("noAccessBusiness")}</p></div>
    `;
    return;
  }

  const html = BUSINESS_CATALOG.map(item => {
    const owned = user.businesses.includes(item.id);
    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(item.img, item.name)}
          <div>
            <h4>${item.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(item.price)} грн • ${item.income}/хв</div>
          </div>
        </div>
        <div class="asset-actions">
          ${owned ? `<button disabled>${tr("owned")}</button>` : `<button data-buy-business="${item.id}">${tr("buy")}</button>`}
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

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < item.price) return showToast(tr("insufficientFunds"), true);

      const updated = [...user.businesses, id];
      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - item.price,
        businesses: updated
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${item.name}`);
      playBeep(700);
      await renderBusinessPage();
    };
  });
}

async function renderRealtyPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const html = REALTY_CATALOG.map(item => {
    const owned = user.realty.includes(item.id);
    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(item.img, item.name)}
          <div>
            <h4>${item.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(item.price)} грн • ${item.income}/хв</div>
          </div>
        </div>
        <div class="asset-actions">
          ${owned ? `<button disabled>${tr("owned")}</button>` : `<button data-buy-realty="${item.id}">${tr("buy")}</button>`}
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

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.balance) < item.price) return showToast(tr("insufficientFunds"), true);

      const updated = [...user.realty, id];
      const ok = await updatePlayer(user.username, {
        balance: Number(user.balance) - item.price,
        realty: updated
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${item.name}`);
      playBeep(710);
      await renderRealtyPage();
    };
  });
}

async function renderCarsPage() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const html = CAR_CATALOG.map(item => {
    const owned = user.cars.includes(item.id);
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
          ${owned ? `<button disabled>${tr("owned")}</button>` : `<button data-buy-car="${item.id}">${tr("buy")}</button>`}
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

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
      if (Number(user.usd) < item.priceUsd) return showToast(tr("insufficientFunds"), true);

      const updated = [...user.cars, id];
      const ok = await updatePlayer(user.username, {
        usd: Number(user.usd) - item.priceUsd,
        cars: updated
      });
      if (!ok) return;

      await appendHistory(user.username, `${tr("buy")} ${item.name}`);
      playBeep(680);
      await renderCarsPage();
    };
  });
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

async function renderSupportPage() {
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

    const ok = await updatePlayer(user.username, { balance: Number(user.balance) - amount });
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
  if (user.vip_giveaway_day === todayString()) return showToast(tr("dailyBonusTaken"), true);

  const amount = Number(prompt("Сума (max 100000)"));
  if (!amount || amount <= 0 || amount > 100000) return;

  const rawTarget = prompt(`${tr("recipient")} (${tr("meOrNick")})`);
  const targetName = normalizeRecipient(rawTarget, user.username);
  const target = appState.allPlayers.find(p => p.username === targetName);

  if (!target) return showToast(tr("invalidUser"), true);
  if (Number(user.balance) < amount) return showToast(tr("insufficientFunds"), true);

  const ok1 = await updatePlayer(user.username, {
    balance: Number(user.balance) - amount,
    vip_giveaway_day: todayString()
  });
  const ok2 = await updatePlayer(target.username, {
    balance: Number(target.balance) + amount,
    total_earned: Number(target.total_earned) + amount
  });

  if (!ok1 || !ok2) return;

  await appendHistory(user.username, `VIP → ${target.username}: ${formatNum(amount)} грн`, amount);
  await appendHistory(target.username, `VIP ← ${user.username}: ${formatNum(amount)} грн`, amount);
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

  const players = appState.allPlayers.filter(player => !player.banned).map(player => player.username).sort();
  const onlineHtml = appState.onlinePlayers.map(player => `
    <div class="rank-item">
      <div class="rank-badge">●</div>
      <div>
        <div><b>${player.username}</b></div>
        <div class="sub">${getClassData(player.class).title}</div>
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
        <h3>${tr("onlineOnlyMoney")}</h3>
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
            ${classList.filter(c => c.key !== "creator").map(c => `<option value="${c.key}">${c.title}</option>`).join("")}
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
      realty: [],
      cars: [],
      card_name: "BitBank Card",
      card_color: "black",
      card_cvv: String(rand(100, 999)),
      card_number: generateCardNumber(),
      card_expiry: generateCardExpiry(),
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
    await supabaseClient.from("players").delete().eq("username", player.username);
    showToast(tr("accountDeleted"));
    await renderAdminPage();
  };

  document.getElementById("admin-give-business-btn").onclick = async () => {
    const player = getSelectedPlayer();
    if (!player) return;
    const businessId = document.getElementById("admin-business-select").value;
    const updated = Array.from(new Set([...(player.businesses || []), businessId]));
    await updatePlayer(player.username, { businesses: updated });
    await appendHistory(player.username, `${tr("giveBusiness")}: ${BUSINESS_CATALOG.find(x => x.id === businessId)?.name || businessId}`);
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
  if (page === "transfer") return renderTransfersPage();
  if (page === "history") return renderHistoryPage();
  if (page === "top") return renderTopPage();
  if (page === "donate") return renderSupportPage();
  if (page === "admin") return renderAdminPage();
}

async function registerUser() {
  const username = sanitize(document.getElementById("reg-username").value).toLowerCase();
  const password = sanitize(document.getElementById("reg-password").value);

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
  document.querySelector('[data-tab="login"]').click();
  document.getElementById("login-username").value = username;
  document.getElementById("login-password").value = password;
}

async function loginUser() {
  const username = sanitize(document.getElementById("login-username").value).toLowerCase();
  const password = sanitize(document.getElementById("login-password").value);

  const result = await loginPlayer(username, password);
  if (!result) return;

  playBeep(740);
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");
  await fetchAllPlayers();
  await fetchGameState();
  updateHeader();
  await renderProfilePage();
}

function logoutUser() {
  appState.currentUser = null;
  saveSession();
  document.getElementById("app-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

async function changePin() {
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

  const reward = getClickReward(user);
  const ok = await updatePlayer(user.username, {
    balance: Number(user.balance) + reward,
    total_earned: Number(user.total_earned) + reward,
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });
  if (!ok) return;

  await appendHistory(user.username, `${tr("click")}: +${formatNum(reward)} грн`, reward);
  playBeep(540);

  const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
  await renderPage(active);
}

async function passiveIncomeTick() {
  const user = getCurrentUserRow();
  if (!user) return;
  const amount = getPassiveIncome(user);
  if (amount <= 0) return;

  await updatePlayer(user.username, {
    balance: Number(user.balance) + amount,
    total_earned: Number(user.total_earned) + amount
  });

  await appendHistory(user.username, `${tr("passiveIncome")}: +${formatNum(amount)} грн`, amount);

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

function bindEvents() {
  document.getElementById("login-btn").onclick = loginUser;
  document.getElementById("register-btn").onclick = registerUser;
  document.getElementById("logout-btn").onclick = logoutUser;

  document.querySelectorAll(".tab-btn").
    document.getElementById("login-btn").onclick = loginUser;
  document.getElementById("register-btn").onclick = registerUser;
  document.getElementById("logout-btn").onclick = logoutUser;

  document.querySelectorAll(".tab-btn").
  document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;

    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    document.getElementById(`${tab}-form`).classList.add("active");
  };
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = async () => {
    const page = btn.dataset.page;
    await renderPage(page);
    closeSidebar();
  };
});

document.getElementById("click-btn").onclick = async () => {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const reward = getClickReward(user);

  const ok = await updatePlayer(user.username, {
    balance: Number(user.balance) + reward,
    total_earned: Number(user.total_earned) + reward,
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  if (!ok) return;

  await appendHistory(user.username, `${tr("click")}: +${formatNum(reward)} грн`, reward);
  playBeep(540);
  await renderProfilePage();
};

document.getElementById("change-pin-btn").onclick = changePin;

document.getElementById("change-card-name-btn").onclick = async () => {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const newName = prompt(appState.lang === "uk" ? "Нова назва карти" : "New card name", user.card_name);
  if (!newName) return;

  const ok = await updatePlayer(user.username, {
    card_name: newName.slice(0, 24)
  });

  if (!ok) return;

  showToast(tr("cardNameChanged"));
  await renderProfilePage();
};

document.getElementById("change-card-color-btn").onclick = openColorModal;
document.getElementById("vip-giveaway-btn").onclick = handleVipGiveaway;

document.getElementById("toggle-sound-btn").onclick = () => {
  appState.soundEnabled = !appState.soundEnabled;
  saveSession();
  updateHeader();
  showToast(appState.soundEnabled ? tr("soundOn") : tr("soundOff"));
};

document.getElementById("lang-btn").onclick = async () => {
  appState.lang = appState.lang === "uk" ? "en" : "uk";
  saveSession();
  updateHeader();
  const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
  await renderPage(active);
};

document.getElementById("sidebar-open").onclick = () => {
  document.getElementById("sidebar").classList.add("show");
  document.getElementById("overlay").classList.add("show");
};

document.getElementById("sidebar-close").onclick = closeSidebar;
document.getElementById("overlay").onclick = closeSidebar;
document.getElementById("close-color-modal").onclick = closeColorModal;

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

// -----------------------------------------------------
// REALTIME
// -----------------------------------------------------
function setupRealtime() {
  supabaseClient
    .channel("bitbank-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players" },
      async () => {
        await fetchAllPlayers();
        updateHeader();

        const active = document.querySelector(".nav-btn.active")?.dataset.page;
        if (active === "admin" || active === "top") {
          await renderPage(active);
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_state" },
      async () => {
        await fetchGameState();
        updateHeader();
      }
    )
    .subscribe();
}

// -----------------------------------------------------
// ONLINE / PASSIVE / MARKET
// -----------------------------------------------------
async function handleClickIncome() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const reward = getClickReward(user);

  const ok = await updatePlayer(user.username, {
    balance: Number(user.balance) + reward,
    total_earned: Number(user.total_earned) + reward,
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  if (!ok) return;

  await appendHistory(user.username, `${tr("click")}: +${formatNum(reward)} грн`, reward);
  playBeep(540);
  const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
  await renderPage(active);
}

async function passiveIncomeTick() {
  await fetchAllPlayers();
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
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  await updatePlayer(user.username, {
    last_seen: new Date().toISOString(),
    device: currentDeviceType()
  });

  await fetchAllPlayers();
  updateHeader();
}

// -----------------------------------------------------
// AUTH
// -----------------------------------------------------
async function registerUser() {
  const username = sanitize(document.getElementById("reg-username").value).toLowerCase();
  const password = sanitize(document.getElementById("reg-password").value);

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

  document.querySelector('[data-tab="login"]').click();
  document.getElementById("login-username").value = username;
  document.getElementById("login-password").value = password;
}

async function loginUser() {
  const username = sanitize(document.getElementById("login-username").value).toLowerCase();
  const password = sanitize(document.getElementById("login-password").value);

  const result = await loginPlayer(username, password);
  if (!result) return;

  playBeep(740);

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  await fetchAllPlayers();
  await fetchGameState();
  updateHeader();
  await renderProfilePage();
}

function logoutUser() {
  appState.currentUser = null;
  saveSession();
  document.getElementById("app-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

// -----------------------------------------------------
// CARD ACTIONS
// -----------------------------------------------------
async function changePin() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  const newCvv = prompt(appState.lang === "uk" ? "Новий CVV (3 цифри)" : "New CVV (3 digits)", user.card_cvv);
  if (newCvv === null) return;
  if (!/^\d{3}$/.test(newCvv)) return showToast(tr("wrongCode"), true);

  const ok = await updatePlayer(user.username, {
    card_cvv: newCvv
  });

  if (!ok) return;

  playBeep(720);
  showToast(tr("cvvChanged"));
  await renderProfilePage();
}

// -----------------------------------------------------
// VIP
// -----------------------------------------------------
async function handleVipGiveaway() {
  await fetchAllPlayers();
  const user = getCurrentUserRow();
  if (!user) return;

  if (!hasVipAccess(user)) return showToast(tr("vipRequiresClass"), true);
  if (user.vip_giveaway_day === todayString()) return showToast(tr("dailyBonusTaken"), true);

  const amount = Number(prompt("Сума (max 100000)"));
  if (!amount || amount <= 0 || amount > 100000) return;

  const rawTarget = prompt(`${tr("recipient")} (${tr("meOrNick")})`);
  const targetName = normalizeRecipient(rawTarget, user.username);
  const target = appState.allPlayers.find(p => p.username === targetName);

  if (!target) return showToast(tr("invalidUser"), true);
  if (Number(user.balance) < amount) return showToast(tr("insufficientFunds"), true);

  const ok1 = await updatePlayer(user.username, {
    balance: Number(user.balance) - amount,
    vip_giveaway_day: todayString()
  });

  const ok2 = await updatePlayer(target.username, {
    balance: Number(target.balance) + amount,
    total_earned: Number(target.total_earned) + amount
  });

  if (!ok1 || !ok2) return;

  await appendHistory(user.username, `VIP → ${target.username}: ${formatNum(amount)} грн`, amount);
  await appendHistory(target.username, `VIP ← ${user.username}: ${formatNum(amount)} грн`, amount);

  playBeep(880);
  showToast(tr("vipSent"));
  await renderProfilePage();
}

// -----------------------------------------------------
// INIT
// -----------------------------------------------------
async function initApp() {
  loadSession();

  appState.market.crypto = Object.fromEntries(
    CRYPTO_CATALOG.map(item => [item.symbol, { ...item }])
  );
  appState.market.stocks = STOCKS_CATALOG.map(item => ({ ...item }));

  bindEvents();
  setupRealtime();

  if (appState.currentUser) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app-screen").classList.remove("hidden");

    await fetchAllPlayers();
    await fetchGameState();

    const current = getCurrentUserRow();
    if (!current || current.banned) {
      appState.currentUser = null;
      saveSession();
      document.getElementById("app-screen").classList.add("hidden");
      document.getElementById("login-screen").classList.remove("hidden");
      return;
    }

    updateHeader();
    await renderProfilePage();
  }

  setInterval(marketTick, 30000);
  setInterval(presenceTick, 15000);
  setInterval(passiveIncomeTick, 60000);
}

initApp();
