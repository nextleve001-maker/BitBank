// ======================================================
// BitBank - FULL script.js
// Працює з останнім index.html + style.css
// ======================================================

// -----------------------------
// GLOBAL STATE
// -----------------------------
const STORAGE_KEY = "bitbank_full_game_v2";

let appState = {
  currentUser: null,
  lang: "uk",
  soundEnabled: true,
  usdRate: 40,
  commissionBank: 0,
  supportBank: 0,
  globalMessage: "",
  users: {},
  market: {
    crypto: {},
    stocks: []
  }
};

// -----------------------------
// TRANSLATIONS
// -----------------------------
const I18N = {
  uk: {
    subtitle: "Симулятор фінансової гри",
    login: "Вхід",
    register: "Реєстрація",
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
    unavailable: "Недоступно",
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
    allTimeCapital: "Капітал",
    click: "КЛІК",
    creatorOnly: "Тільки для creator",
    invalidData: "Невірні дані",
    insufficientFunds: "Недостатньо коштів",
    invalidUser: "Невірний користувач",
    userExists: "Користувач уже існує",
    bannedName: "Такий логін заборонений",
    userCreated: "Акаунт створено",
    loginError: "Невірний логін або пароль",
    accountBanned: "Акаунт заблоковано",
    bought: "Успішно куплено",
    sold: "Успішно продано",
    noAccessStocks: "Акції доступні з класу Trader і вище",
    noAccessBusiness: "Бізнес доступний тільки з класу Businessman і вище",
    upgradeSuccess: "Клас успішно придбано",
    codeNeeded: "Введіть CVV код",
    wrongCode: "Невірний CVV",
    cvvChanged: "CVV змінено",
    cardNameChanged: "Назву карти змінено",
    colorChanged: "Колір карти змінено",
    donated: "Дякуємо за підтримку",
    sent: "Переказ успішний",
    historyEmpty: "Історія порожня",
    rankTitle: "Топ 100 гравців",
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
    classAccess: "Доступ",
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
    adminTools: "Інструменти адміна",
    choosePlayer: "Оберіть гравця",
    enterAmountForAllOnline: "Введіть суму для всіх онлайн",
    enterCryptoSymbol: "Введіть символ крипти",
    enterCryptoAmount: "Введіть кількість крипти",
    enterMessage: "Введіть повідомлення",
    businessLocked: "Бізнес відкривається з класу Businessman",
    stocksLocked: "Акції відкриваються з класу Trader",
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
    lastSeen: "Остання активність",
    totalAssets: "Усього активів",
    sellFor: "Продати за",
    buyFor: "Купити за"
  },
  en: {
    subtitle: "Financial game simulator",
    login: "Login",
    register: "Register",
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
    owned: "Already owned",
    unavailable: "Unavailable",
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
    allTimeCapital: "Capital",
    click: "CLICK",
    creatorOnly: "Creator only",
    invalidData: "Invalid data",
    insufficientFunds: "Insufficient funds",
    invalidUser: "Invalid user",
    userExists: "User already exists",
    bannedName: "This username is forbidden",
    userCreated: "Account created",
    loginError: "Invalid username or password",
    accountBanned: "Account is banned",
    bought: "Successfully bought",
    sold: "Successfully sold",
    noAccessStocks: "Stocks are available from Trader class and above",
    noAccessBusiness: "Business is available only from Businessman class and above",
    upgradeSuccess: "Class purchased successfully",
    codeNeeded: "Enter CVV code",
    wrongCode: "Wrong CVV",
    cvvChanged: "CVV changed",
    cardNameChanged: "Card name changed",
    colorChanged: "Card color changed",
    donated: "Thanks for support",
    sent: "Transfer successful",
    historyEmpty: "History is empty",
    rankTitle: "Top 100 players",
    vipSent: "VIP giveaway completed",
    massDone: "Mass action completed",
    soundOn: "Sound enabled",
    soundOff: "Sound disabled",
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
    classAccess: "Access",
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
    sendGlobalMessage: "Send message to all",
    collectCommission: "Collect commission bank",
    collectSupport: "Collect support bank",
    adminTools: "Admin tools",
    choosePlayer: "Choose player",
    enterAmountForAllOnline: "Enter amount for all online users",
    enterCryptoSymbol: "Enter crypto symbol",
    enterCryptoAmount: "Enter crypto amount",
    enterMessage: "Enter message",
    businessLocked: "Business unlocks from Businessman class",
    stocksLocked: "Stocks unlock from Trader class",
    creatorPanel: "Creator panel",
    purchaseRequiresCvv: "Purchase requires CVV",
    transferRequiresCvv: "Transfer requires CVV",
    classRequiresCvv: "Class purchase requires CVV",
    vipRequiresClass: "VIP giveaway requires VIP or higher",
    playerNotFound: "Player not found",
    valueUpdated: "Value updated",
    accountReset: "Account reset",
    accountDeleted: "Account deleted",
    classSet: "Class set",
    deviceType: "Device",
    lastSeen: "Last seen",
    totalAssets: "Total assets",
    sellFor: "Sell for",
    buyFor: "Buy for"
  }
};

function tr(key) {
  return I18N[appState.lang][key] || key;
}

// -----------------------------
// CLASSES
// -----------------------------
const classList = [
  {
    key: "none",
    title: "Starter",
    price: 0,
    clickReward: 5,
    passivePerMin: 0,
    perks: {
      uk: "Базовий старт. Є доступ до профілю, крипти, переказів та історії.",
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
      uk: "Трохи більше грошей за клік і невеликий пасивний дохід.",
      en: "More money per click and a small passive income."
    }
  },
  {
    key: "medium",
    title: "Medium",
    price: 6000,
    clickReward: 45,
    passivePerMin: 45,
    perks: {
      uk: "Сильніший пасивний дохід і швидший ріст балансу.",
      en: "Stronger passive income and faster balance growth."
    }
  },
  {
    key: "trader",
    title: "Trader",
    price: 18000,
    clickReward: 110,
    passivePerMin: 110,
    perks: {
      uk: "Дає доступ до розділу акцій. Усі класи вище теж мають доступ до акцій.",
      en: "Unlocks stocks. All higher classes also have access to stocks."
    }
  },
  {
    key: "vip",
    title: "VIP",
    price: 50000,
    clickReward: 250,
    passivePerMin: 260,
    perks: {
      uk: "Відкриває VIP-роздачу, золотий колір картки і більший дохід.",
      en: "Unlocks VIP giveaway, gold card color and better income."
    }
  },
  {
    key: "businessman",
    title: "Businessman",
    price: 150000,
    clickReward: 600,
    passivePerMin: 700,
    perks: {
      uk: "Відкриває бізнеси та великий пасивний дохід.",
      en: "Unlocks businesses and large passive income."
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
      en: "Very strong income and all perks from lower classes."
    }
  },
  {
    key: "creator",
    title: "Creator",
    price: 0,
    clickReward: 50000,
    passivePerMin: 25000,
    perks: {
      uk: "Повний контроль, адмінка, бачить усіх гравців і їхню активність.",
      en: "Full control, admin panel, sees all players and activity."
    }
  }
];

const classMap = {};
classList.forEach((item, index) => {
  classMap[item.key] = { ...item, index };
});

// -----------------------------
// CATALOGS
// -----------------------------
const cryptoCatalog = [
  { symbol: "BTC", name: "Bitcoin", price: 2800000, img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032" },
  { symbol: "ETH", name: "Ethereum", price: 145000, img: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032" },
  { symbol: "BNB", name: "BNB", price: 24500, img: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=032" },
  { symbol: "SOL", name: "Solana", price: 7200, img: "https://cryptologos.cc/logos/solana-sol-logo.png?v=032" },
  { symbol: "XRP", name: "XRP", price: 24, img: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=032" }
];

const stocksCatalog = [
  { id: "apple", name: "Apple", price: 8100, img: "https://logo.clearbit.com/apple.com" },
  { id: "microsoft", name: "Microsoft", price: 16800, img: "https://logo.clearbit.com/microsoft.com" },
  { id: "google", name: "Google", price: 7200, img: "https://logo.clearbit.com/google.com" },
  { id: "amazon", name: "Amazon", price: 6900, img: "https://logo.clearbit.com/amazon.com" },
  { id: "tesla", name: "Tesla", price: 9100, img: "https://logo.clearbit.com/tesla.com" },
  { id: "nvidia", name: "NVIDIA", price: 25000, img: "https://logo.clearbit.com/nvidia.com" }
];

const businessCatalog = [
  { id: "coffee", name: "Кав'ярня", price: 40000, income: 90, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop" },
  { id: "shop", name: "Магазин", price: 95000, income: 220, img: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&auto=format&fit=crop" },
  { id: "gym", name: "Фітнес-клуб", price: 180000, income: 430, img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop" },
  { id: "hotel", name: "Готель", price: 550000, income: 1500, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop" },
  { id: "it", name: "IT Студія", price: 800000, income: 2600, img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&auto=format&fit=crop" }
];

const realtyCatalog = [
  { id: "palm", name: "🌴 Пальмовий острів", price: 25000, income: 60, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop" },
  { id: "volcano", name: "🌋 Вулканічний острів", price: 45000, income: 120, img: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&auto=format&fit=crop" },
  { id: "paradise", name: "🏝 Райський острів", price: 80000, income: 200, img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&auto=format&fit=crop" },
  { id: "treasure", name: "💰 Острів скарбів", price: 120000, income: 320, img: "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&auto=format&fit=crop" },
  { id: "skyvilla", name: "🏙 Sky Villa", price: 420000, income: 1300, img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&auto=format&fit=crop" },
  { id: "oceanhome", name: "🌊 Ocean Home", price: 520000, income: 1700, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop" }
];

const carCatalog = [
  { id: "corolla", name: "Toyota Corolla", priceUsd: 22000, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&auto=format&fit=crop" },
  { id: "civic", name: "Honda Civic", priceUsd: 24000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop" },
  { id: "bmw3", name: "BMW 3 Series", priceUsd: 42000, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop" },
  { id: "tesla3", name: "Tesla Model 3", priceUsd: 47000, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&auto=format&fit=crop" },
  { id: "gclass", name: "Mercedes G-Class", priceUsd: 180000, img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&auto=format&fit=crop" },
  { id: "huracan", name: "Lamborghini Huracan", priceUsd: 250000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop" }
];

// -----------------------------
// AUDIO
// -----------------------------
let audioContext = null;

function playBeep(freq = 440, duration = 0.05, volume = 0.02) {
  if (!appState.soundEnabled) return;
  try {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioContext = new Ctx();
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
  } catch (error) {
    // ignore
  }
}

// -----------------------------
// HELPERS
// -----------------------------
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNum(value) {
  return Number(value || 0).toLocaleString(appState.lang === "uk" ? "uk-UA" : "en-US", {
    maximumFractionDigits: 2
  });
}

function sanitize(value) {
  return String(value || "").trim().replace(/[<>]/g, "");
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

function saveAppState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function makeUser(password, isCreator = false) {
  const deviceType = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? "phone" : "desktop";

  return {
    password,
    balance: isCreator ? 1000000 : 500,
    usd: isCreator ? 5000 : 0,
    crypto: {},
    stocks: {},
    businesses: [],
    realty: [],
    cars: [],
    history: [],
    classKey: isCreator ? "creator" : "none",
    cardName: isCreator ? "Creator Card" : "BitBank Card",
    cardColor: isCreator ? "gold" : "black",
    cardCvv: String(rand(100, 999)),
    cardNumber: generateCardNumber(),
    cardExpiry: generateCardExpiry(),
    totalEarned: isCreator ? 1000000 : 500,
    lastSeen: Date.now(),
    deviceType,
    banned: false,
    lastBonusDay: "",
    vipGiveawayDay: ""
  };
}

function loadAppState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    try {
      appState = JSON.parse(raw);
    } catch (error) {
      console.error(error);
    }
  }

  if (!appState.users || typeof appState.users !== "object") {
    appState.users = {};
  }

  if (!appState.market) {
    appState.market = { crypto: {}, stocks: [] };
  }

  if (!appState.market.crypto || Object.keys(appState.market.crypto).length === 0) {
    appState.market.crypto = {};
    cryptoCatalog.forEach(item => {
      appState.market.crypto[item.symbol] = { ...item };
    });
  }

  if (!appState.market.stocks || appState.market.stocks.length === 0) {
    appState.market.stocks = stocksCatalog.map(item => ({ ...item }));
  }

  if (!appState.users.creator) {
    appState.users.creator = makeUser("9creator9", true);
  }

  Object.entries(appState.users).forEach(([username, user]) => {
    if (!user.crypto) user.crypto = {};
    if (!user.stocks) user.stocks = {};
    if (!user.businesses) user.businesses = [];
    if (!user.realty) user.realty = [];
    if (!user.cars) user.cars = [];
    if (!user.history) user.history = [];
    if (!user.cardName) user.cardName = "BitBank Card";
    if (!user.cardColor) user.cardColor = "black";
    if (!user.cardCvv) user.cardCvv = String(rand(100, 999));
    if (!user.cardNumber) user.cardNumber = generateCardNumber();
    if (!user.cardExpiry) user.cardExpiry = generateCardExpiry();
    if (!user.classKey) user.classKey = username === "creator" ? "creator" : "none";
    if (!user.totalEarned) user.totalEarned = user.balance || 0;
    if (!user.lastSeen) user.lastSeen = Date.now();
    if (!user.deviceType) user.deviceType = "desktop";
    if (!user.lastBonusDay) user.lastBonusDay = "";
    if (!user.vipGiveawayDay) user.vipGiveawayDay = "";
    if (typeof user.banned !== "boolean") user.banned = false;
  });

  saveAppState();
}

function getCurrentUser() {
  if (!appState.currentUser) return null;
  return appState.users[appState.currentUser] || null;
}

function getClassData(classKey) {
  return classMap[classKey];
}

function classIndex(classKey) {
  return getClassData(classKey).index;
}

function hasStocksAccess(user) {
  return classIndex(user.classKey) >= classIndex("trader");
}

function hasBusinessAccess(user) {
  return classIndex(user.classKey) >= classIndex("businessman");
}

function hasVipAccess(user) {
  return classIndex(user.classKey) >= classIndex("vip");
}

function isCreator(user) {
  return user && user.classKey === "creator";
}

function getClickReward(user) {
  return getClassData(user.classKey).clickReward;
}

function getPassiveIncome(user) {
  let total = getClassData(user.classKey).passivePerMin;

  user.businesses.forEach(id => {
    const business = businessCatalog.find(item => item.id === id);
    if (business) total += business.income;
  });

  user.realty.forEach(id => {
    const realty = realtyCatalog.find(item => item.id === id);
    if (realty) total += realty.income;
  });

  return total;
}

function calculateCapitalUsd(user) {
  let totalUah = user.balance + user.usd * appState.usdRate;

  Object.entries(user.crypto).forEach(([symbol, amount]) => {
    const crypto = appState.market.crypto[symbol];
    if (crypto) totalUah += amount * crypto.price;
  });

  Object.entries(user.stocks).forEach(([stockId, amount]) => {
    const stock = appState.market.stocks.find(item => item.id === stockId);
    if (stock) totalUah += amount * stock.price;
  });

  user.businesses.forEach(id => {
    const business = businessCatalog.find(item => item.id === id);
    if (business) totalUah += business.price;
  });

  user.realty.forEach(id => {
    const realty = realtyCatalog.find(item => item.id === id);
    if (realty) totalUah += realty.price;
  });

  user.cars.forEach(id => {
    const car = carCatalog.find(item => item.id === id);
    if (car) totalUah += car.priceUsd * appState.usdRate;
  });

  return totalUah / appState.usdRate;
}

function addHistory(user, text, amount = null) {
  user.history.unshift({
    text,
    amount,
    time: Date.now()
  });
  user.history = user.history.slice(0, 140);
}

function addMoney(user, amount, historyText = "") {
  user.balance += amount;
  if (amount > 0) {
    user.totalEarned += amount;
  }
  if (historyText) {
    addHistory(user, historyText, amount);
  }
}

function normalizeRecipient(input, currentNickname) {
  const value = sanitize(input).toLowerCase();
  if (!value) return "";
  if (value === "me" || value === currentNickname.toLowerCase()) {
    return currentNickname;
  }
  return value;
}

function getOnlinePlayersDetailed() {
  const now = Date.now();

  return Object.entries(appState.users)
    .filter(([, user]) => !user.banned && now - user.lastSeen < 120000)
    .map(([name, user]) => ({
      name,
      ...user
    }));
}

function promptCvv(user, reasonText = "") {
  const promptText = reasonText || tr("codeNeeded");
  const entered = prompt(`${promptText} (CVV)`);
  if (entered === null) return false;
  if (String(entered) !== String(user.cardCvv)) {
    showToast(tr("wrongCode"), true);
    return false;
  }
  return true;
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
  setTimeout(() => toast.remove(), 2500);
}

// -----------------------------
// UI UPDATE
// -----------------------------
function updateHeader() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("header-username").textContent = appState.currentUser;
  document.getElementById("header-status").textContent = getClassData(user.classKey).title.toUpperCase();
  document.getElementById("header-online").textContent = tr("online");
  document.getElementById("header-device").textContent = user.deviceType === "phone"
    ? `📱 ${tr("phone")}`
    : `🖥 ${tr("desktop")}`;
  document.getElementById("balance-uah").textContent = formatNum(user.balance);
  document.getElementById("balance-usd").textContent = formatNum(user.usd);

  document.getElementById("vip-giveaway-btn").classList.toggle("hidden", !hasVipAccess(user));
  document.getElementById("admin-nav").classList.toggle("hidden", !isCreator(user));

  const globalMessageBox = document.getElementById("global-message");
  if (appState.globalMessage) {
    globalMessageBox.classList.remove("hidden");
    globalMessageBox.textContent = appState.globalMessage;
  } else {
    globalMessageBox.classList.add("hidden");
    globalMessageBox.textContent = "";
  }

  document.getElementById("lang-btn").textContent = appState.lang === "uk" ? "EN" : "UA";
  document.getElementById("toggle-sound-btn").textContent = appState.soundEnabled ? "🔊 Звук" : "🔇 Звук";
}

function setActivePage(page) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

// -----------------------------
// PROFILE
// -----------------------------
function renderProfilePage() {
  const user = getCurrentUser();
  const classData = getClassData(user.classKey);

  const titles = [];
  if (user.classKey === "creator") titles.push("👑 Creator");
  if (user.realty.includes("paradise")) titles.push("🏝 Island Lord");
  if (user.businesses.includes("it")) titles.push("💻 Tech Boss");
  if (user.cars.includes("huracan")) titles.push("🔥 Supercar Owner");

  const profileHtml = `
    <h2 class="page-title">🏠 ${tr("profile")}</h2>

    <div class="profile-layout">
      <div class="panel">
        <div class="card-visual ${cardColorClass(user.cardColor)}">
          <div class="card-chip"></div>
          <div class="card-number">${user.cardNumber}</div>
          <div class="card-bottom">
            <span>CVV: ${user.cardCvv}</span>
            <span>${user.cardExpiry}</span>
          </div>
          <div class="card-brand">${user.cardName}</div>
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
            <div class="label">${tr("allTimeCapital")}</div>
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
            <div class="value">${formatNum(user.totalEarned)} грн</div>
          </div>

          <div class="stat-card">
            <div class="label">${tr("deviceType")}</div>
            <div class="value">${user.deviceType === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`}</div>
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

  document.getElementById("page-content").innerHTML = profileHtml;

  document.getElementById("profile-go-classes-btn").onclick = () => renderClassesPage();

  document.getElementById("profile-change-name-btn").onclick = () => {
    const newName = prompt(appState.lang === "uk" ? "Нова назва карти" : "New card name", user.cardName);
    if (!newName) return;
    user.cardName = newName.slice(0, 24);
    saveAppState();
    playBeep(640);
    showToast(tr("cardNameChanged"));
    renderProfilePage();
  };

  document.getElementById("profile-change-color-btn").onclick = () => {
    document.getElementById("color-modal").classList.remove("hidden");
  };

  document.getElementById("profile-daily-bonus-btn").onclick = () => {
    const today = todayString();
    if (user.lastBonusDay === today) {
      showToast(tr("dailyBonusTaken"), true);
      return;
    }
    const bonus = rand(150, 650);
    user.lastBonusDay = today;
    addMoney(user, bonus, `${tr("dailyBonus")}: +${formatNum(bonus)} грн`);
    saveAppState();
    playBeep(760);
    showToast(`${tr("dailyBonusGot")} +${bonus}`);
    updateHeader();
    renderProfilePage();
  };

  document.getElementById("buy-usd-btn").onclick = () => {
    const amountUah = Number(document.getElementById("buy-usd-uah").value);
    if (!amountUah || amountUah <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }
    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
    if (user.balance < amountUah) {
      showToast(tr("insufficientFunds"), true);
      return;
    }

    const usdAmount = amountUah / appState.usdRate;
    user.balance -= amountUah;
    user.usd += usdAmount;
    addHistory(user, `${tr("buyUsd")}: ${formatNum(usdAmount)} USD`);
    saveAppState();
    playBeep(560);
    updateHeader();
    renderProfilePage();
  };

  document.getElementById("sell-usd-btn").onclick = () => {
    const usdAmount = Number(document.getElementById("sell-usd-amount").value);
    if (!usdAmount || usdAmount <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }
    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;
    if (user.usd < usdAmount) {
      showToast(tr("insufficientFunds"), true);
      return;
    }

    const uahAmount = usdAmount * appState.usdRate;
    user.usd -= usdAmount;
    user.balance += uahAmount;
    addHistory(user, `${tr("sellUsd")}: +${formatNum(uahAmount)} грн`);
    saveAppState();
    playBeep(520);
    updateHeader();
    renderProfilePage();
  };
}

// -----------------------------
// CLASSES
// -----------------------------
function renderClassesPage() {
  const user = getCurrentUser();

  const classesHtml = classList
    .filter(item => item.key !== "creator")
    .map(item => {
      const currentIndex = classIndex(user.classKey);
      const targetIndex = classIndex(item.key);

      const alreadyOwnedOrHigher = currentIndex >= targetIndex;
      const canBuy = targetIndex === currentIndex + 1;

      return `
        <div class="class-card">
          <h4>${item.title}</h4>
          <div class="sub">${tr("classAccess")}</div>
          <div class="class-price">${formatNum(item.price)} грн</div>
          <div class="class-benefit">
            <b>${tr("classBenefits")}:</b><br>
            ${item.perks[appState.lang]}<br><br>
            <b>+${formatNum(item.clickReward)} грн</b> ${appState.lang === "uk" ? "за клік" : "per click"}<br>
            <b>+${formatNum(item.passivePerMin)} грн</b> ${appState.lang === "uk" ? "пасивно/хв" : "passive/min"}
          </div>

          ${
            alreadyOwnedOrHigher
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
    <div class="grid cards">${classesHtml}</div>
  `;

  document.querySelectorAll("[data-buy-class]").forEach(button => {
    button.onclick = () => {
      const targetKey = button.dataset.buyClass;
      const targetClass = getClassData(targetKey);

      if (!promptCvv(user, tr("classRequiresCvv"))) return;
      if (user.balance < targetClass.price) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      if (classIndex(targetKey) !== classIndex(user.classKey) + 1) {
        showToast(tr("invalidData"), true);
        return;
      }

      user.balance -= targetClass.price;
      user.classKey = targetKey;
      addHistory(user, `${tr("buyClass")}: ${targetClass.title}`);
      saveAppState();
      playBeep(820);
      showToast(tr("upgradeSuccess"));
      updateHeader();
      renderClassesPage();
    };
  });
}

// -----------------------------
// CRYPTO
// -----------------------------
function renderCryptoPage() {
  const user = getCurrentUser();

  const html = Object.values(appState.market.crypto).map(crypto => {
    const own = user.crypto[crypto.symbol] || 0;

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(crypto.img, crypto.name)}
          <div>
            <h4>${crypto.name} (${crypto.symbol})</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(crypto.price)} грн</div>
          </div>
        </div>

        <div class="sub">${tr("balance")}: ${formatNum(own)}</div>
        <input id="crypto-amount-${crypto.symbol}" type="number" step="0.0001" placeholder="${tr("amount")}">

        <div class="asset-actions">
          <button data-buy-crypto="${crypto.symbol}">${tr("buy")}</button>
          <button data-sell-crypto="${crypto.symbol}">${tr("sell")}</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🪙 ${tr("crypto")}</h2>
    <div class="grid cards">${html}</div>
  `;

  document.querySelectorAll("[data-buy-crypto]").forEach(button => {
    button.onclick = () => {
      const symbol = button.dataset.buyCrypto;
      const crypto = appState.market.crypto[symbol];
      const amount = Number(document.getElementById(`crypto-amount-${symbol}`).value);

      if (!amount || amount <= 0) {
        showToast(tr("invalidData"), true);
        return;
      }

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      const totalCost = amount * crypto.price;
      if (user.balance < totalCost) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      user.balance -= totalCost;
      user.crypto[symbol] = (user.crypto[symbol] || 0) + amount;
      addHistory(user, `${tr("buy")} ${formatNum(amount)} ${symbol}`);
      saveAppState();
      playBeep(640);
      updateHeader();
      renderCryptoPage();
    };
  });

  document.querySelectorAll("[data-sell-crypto]").forEach(button => {
    button.onclick = () => {
      const symbol = button.dataset.sellCrypto;
      const crypto = appState.market.crypto[symbol];
      const amount = Number(document.getElementById(`crypto-amount-${symbol}`).value);

      if (!amount || amount <= 0) {
        showToast(tr("invalidData"), true);
        return;
      }

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      if ((user.crypto[symbol] || 0) < amount) {
        showToast(tr("notEnoughCrypto"), true);
        return;
      }

      user.crypto[symbol] -= amount;
      user.balance += amount * crypto.price;
      addHistory(user, `${tr("sell")} ${formatNum(amount)} ${symbol}`);
      saveAppState();
      playBeep(560);
      updateHeader();
      renderCryptoPage();
    };
  });
}

// -----------------------------
// STOCKS
// -----------------------------
function renderStocksPage() {
  const user = getCurrentUser();

  if (!hasStocksAccess(user)) {
    document.getElementById("page-content").innerHTML = `
      <h2 class="page-title">📈 ${tr("stocks")}</h2>
      <div class="panel">
        <p>${tr("stocksLocked")}</p>
      </div>
    `;
    return;
  }

  const html = appState.market.stocks.map(stock => {
    const own = user.stocks[stock.id] || 0;

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
    button.onclick = () => {
      const id = button.dataset.buyStock;
      const stock = appState.market.stocks.find(item => item.id === id);
      const amount = Number(document.getElementById(`stock-amount-${id}`).value);

      if (!amount || amount <= 0) {
        showToast(tr("invalidData"), true);
        return;
      }

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      const totalCost = amount * stock.price;
      if (user.balance < totalCost) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      user.balance -= totalCost;
      user.stocks[id] = (user.stocks[id] || 0) + amount;
      addHistory(user, `${tr("buy")} ${formatNum(amount)} ${stock.name}`);
      saveAppState();
      playBeep(670);
      updateHeader();
      renderStocksPage();
    };
  });

  document.querySelectorAll("[data-sell-stock]").forEach(button => {
    button.onclick = () => {
      const id = button.dataset.sellStock;
      const stock = appState.market.stocks.find(item => item.id === id);
      const amount = Number(document.getElementById(`stock-amount-${id}`).value);

      if (!amount || amount <= 0) {
        showToast(tr("invalidData"), true);
        return;
      }

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      if ((user.stocks[id] || 0) < amount) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      user.stocks[id] -= amount;
      user.balance += amount * stock.price;
      addHistory(user, `${tr("sell")} ${formatNum(amount)} ${stock.name}`);
      saveAppState();
      playBeep(590);
      updateHeader();
      renderStocksPage();
    };
  });
}

// -----------------------------
// BUSINESS
// -----------------------------
function renderBusinessPage() {
  const user = getCurrentUser();

  if (!hasBusinessAccess(user)) {
    document.getElementById("page-content").innerHTML = `
      <h2 class="page-title">🏢 ${tr("business")}</h2>
      <div class="panel">
        <p>${tr("businessLocked")}</p>
      </div>
    `;
    return;
  }

  const html = businessCatalog.map(business => {
    const owned = user.businesses.includes(business.id);

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(business.img, business.name)}
          <div>
            <h4>${business.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(business.price)} грн • ${business.income}/хв</div>
          </div>
        </div>

        <div class="asset-actions">
          ${
            owned
              ? `<button disabled>${tr("owned")}</button>`
              : `<button data-buy-business="${business.id}">${tr("buy")}</button>`
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
    button.onclick = () => {
      const id = button.dataset.buyBusiness;
      const business = businessCatalog.find(item => item.id === id);

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      if (user.balance < business.price) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      user.balance -= business.price;
      user.businesses.push(id);
      addHistory(user, `${tr("buy")} ${business.name}`);
      saveAppState();
      playBeep(700);
      updateHeader();
      renderBusinessPage();
    };
  });
}

// -----------------------------
// REALTY
// -----------------------------
function renderRealtyPage() {
  const user = getCurrentUser();

  const html = realtyCatalog.map(realty => {
    const owned = user.realty.includes(realty.id);

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(realty.img, realty.name)}
          <div>
            <h4>${realty.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(realty.price)} грн • ${realty.income}/хв</div>
          </div>
        </div>

        <div class="asset-actions">
          ${
            owned
              ? `<button disabled>${tr("owned")}</button>`
              : `<button data-buy-realty="${realty.id}">${tr("buy")}</button>`
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
    button.onclick = () => {
      const id = button.dataset.buyRealty;
      const realty = realtyCatalog.find(item => item.id === id);

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      if (user.balance < realty.price) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      user.balance -= realty.price;
      user.realty.push(id);
      addHistory(user, `${tr("buy")} ${realty.name}`);
      saveAppState();
      playBeep(710);
      updateHeader();
      renderRealtyPage();
    };
  });
}

// -----------------------------
// CARS
// -----------------------------
function renderCarsPage() {
  const user = getCurrentUser();

  const html = carCatalog.map(car => {
    const owned = user.cars.includes(car.id);

    return `
      <div class="asset-card">
        <div class="asset-head">
          ${imageTag(car.img, car.name)}
          <div>
            <h4>${car.name}</h4>
            <div class="sub">${tr("buyFor")}: ${formatNum(car.priceUsd)} USD</div>
          </div>
        </div>

        <div class="asset-actions">
          ${
            owned
              ? `<button disabled>${tr("owned")}</button>`
              : `<button data-buy-car="${car.id}">${tr("buy")}</button>`
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
    button.onclick = () => {
      const id = button.dataset.buyCar;
      const car = carCatalog.find(item => item.id === id);

      if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

      if (user.usd < car.priceUsd) {
        showToast(tr("insufficientFunds"), true);
        return;
      }

      user.usd -= car.priceUsd;
      user.cars.push(id);
      addHistory(user, `${tr("buy")} ${car.name}`);
      saveAppState();
      playBeep(680);
      updateHeader();
      renderCarsPage();
    };
  });
}

// -----------------------------
// TRANSFERS
// -----------------------------
function renderTransfersPage() {
  const user = getCurrentUser();

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

  document.getElementById("transfer-uah-btn").onclick = () => {
    const recipient = normalizeRecipient(document.getElementById("transfer-uah-to").value, appState.currentUser);
    const amount = Number(document.getElementById("transfer-uah-amount").value);

    if (!recipient || !appState.users[recipient]) {
      showToast(tr("invalidUser"), true);
      return;
    }

    if (!amount || amount <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }

    if (!promptCvv(user, tr("transferRequiresCvv"))) return;

    const fee = amount * 0.05;
    const total = amount + fee;

    if (user.balance < total) {
      showToast(tr("insufficientFunds"), true);
      return;
    }

    user.balance -= total;
    appState.users[recipient].balance += amount;
    appState.commissionBank += fee;

    addHistory(user, `${tr("transferUah")} → ${recipient}: ${formatNum(amount)} грн`);
    addHistory(appState.users[recipient], `${tr("transferUah")} ← ${appState.currentUser}: ${formatNum(amount)} грн`);

    saveAppState();
    playBeep(620);
    showToast(tr("sent"));
    updateHeader();
  };

  document.getElementById("transfer-usd-btn").onclick = () => {
    const recipient = normalizeRecipient(document.getElementById("transfer-usd-to").value, appState.currentUser);
    const amount = Number(document.getElementById("transfer-usd-amount").value);

    if (!recipient || !appState.users[recipient]) {
      showToast(tr("invalidUser"), true);
      return;
    }

    if (!amount || amount <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }

    if (!promptCvv(user, tr("transferRequiresCvv"))) return;

    const fee = amount * 0.05;
    const total = amount + fee;

    if (user.usd < total) {
      showToast(tr("insufficientFunds"), true);
      return;
    }

    user.usd -= total;
    appState.users[recipient].usd += amount;
    appState.commissionBank += fee * appState.usdRate;

    addHistory(user, `${tr("transferUsd")} → ${recipient}: ${formatNum(amount)} USD`);
    addHistory(appState.users[recipient], `${tr("transferUsd")} ← ${appState.currentUser}: ${formatNum(amount)} USD`);

    saveAppState();
    playBeep(630);
    showToast(tr("sent"));
    updateHeader();
  };

  document.getElementById("transfer-crypto-btn").onclick = () => {
    const recipient = normalizeRecipient(document.getElementById("transfer-crypto-to").value, appState.currentUser);
    const symbol = sanitize(document.getElementById("transfer-crypto-symbol").value).toUpperCase();
    const amount = Number(document.getElementById("transfer-crypto-amount").value);

    if (!recipient || !appState.users[recipient]) {
      showToast(tr("invalidUser"), true);
      return;
    }

    if (!symbol || !appState.market.crypto[symbol]) {
      showToast(tr("invalidData"), true);
      return;
    }

    if (!amount || amount <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }

    if (!promptCvv(user, tr("transferRequiresCvv"))) return;

    const fee = amount * 0.01;
    const total = amount + fee;

    if ((user.crypto[symbol] || 0) < total) {
      showToast(tr("notEnoughCrypto"), true);
      return;
    }

    user.crypto[symbol] -= total;
    appState.users[recipient].crypto[symbol] = (appState.users[recipient].crypto[symbol] || 0) + amount;
    appState.commissionBank += fee * appState.market.crypto[symbol].price;

    addHistory(user, `${tr("transferCrypto")} → ${recipient}: ${formatNum(amount)} ${symbol}`);
    addHistory(appState.users[recipient], `${tr("transferCrypto")} ← ${appState.currentUser}: ${formatNum(amount)} ${symbol}`);

    saveAppState();
    playBeep(640);
    showToast(tr("sent"));
    updateHeader();
  };
}

// -----------------------------
// HISTORY
// -----------------------------
function renderHistoryPage() {
  const user = getCurrentUser();

  const html = user.history.map(item => {
    return `
      <div class="history-item">
        <div class="history-top">
          <b>${item.text}</b>
          <span class="sub">${new Date(item.time).toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🕓 ${tr("history")}</h2>
    <div class="history-list">
      ${html || `<div class="panel">${tr("historyEmpty")}</div>`}
    </div>
  `;
}

// -----------------------------
// TOP 100
// -----------------------------
function renderTopPage() {
  const ranking = Object.entries(appState.users)
    .filter(([, user]) => !user.banned)
    .map(([name, user]) => {
      const online = Date.now() - user.lastSeen < 120000;
      return {
        name,
        classKey: user.classKey,
        online,
        deviceType: user.deviceType,
        capitalUsd: calculateCapitalUsd(user),
        totalEarned: user.totalEarned
      };
    })
    .sort((a, b) => b.capitalUsd - a.capitalUsd)
    .slice(0, 100);

  const html = ranking.map((item, index) => {
    return `
      <div class="rank-item">
        <div class="rank-badge">#${index + 1}</div>
        <div>
          <div><b>${item.name}</b></div>
          <div class="sub">${getClassData(item.classKey).title}</div>
          <div class="sub">
            ${item.online ? `🟢 ${tr("online")}` : ""}
            ${item.deviceType === "phone" ? ` • 📱 ${tr("phone")}` : ` • 🖥 ${tr("desktop")}`}
          </div>
        </div>
        <div style="text-align:right">
          <div><b>${formatNum(item.capitalUsd)} USD</b></div>
          <div class="sub">${tr("lifetimeEarned")}: ${formatNum(item.totalEarned)} грн</div>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">🏆 ${tr("rankTitle")}</h2>
    <div class="rank-list">${html}</div>
  `;
}

// -----------------------------
// SUPPORT / DONATE
// -----------------------------
function renderSupportPage() {
  const user = getCurrentUser();

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

  document.getElementById("support-send-btn").onclick = () => {
    const amount = Number(document.getElementById("support-amount").value);

    if (!amount || amount <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }

    if (!promptCvv(user, tr("purchaseRequiresCvv"))) return;

    if (user.balance < amount) {
      showToast(tr("insufficientFunds"), true);
      return;
    }

    user.balance -= amount;
    appState.supportBank += amount;
    addHistory(user, `${tr("donate")}: ${formatNum(amount)} грн`);
    saveAppState();
    playBeep(600);
    showToast(tr("donated"));
    updateHeader();
    renderSupportPage();
  };
}

// -----------------------------
// VIP GIVEAWAY
// -----------------------------
function handleVipGiveaway() {
  const user = getCurrentUser();

  if (!hasVipAccess(user)) {
    showToast(tr("vipRequiresClass"), true);
    return;
  }

  const today = todayString();
  if (user.vipGiveawayDay === today) {
    showToast(tr("vipDailyLimit"), true);
    return;
  }

  const amount = Number(prompt("Сума (max 100000)"));
  if (!amount || amount <= 0 || amount > 100000) return;

  const rawTarget = prompt(`${tr("recipient")} (${tr("meOrNick")})`);
  const target = normalizeRecipient(rawTarget, appState.currentUser);

  if (!target || !appState.users[target]) {
    showToast(tr("invalidUser"), true);
    return;
  }

  if (user.balance < amount) {
    showToast(tr("insufficientFunds"), true);
    return;
  }

  user.balance -= amount;
  appState.users[target].balance += amount;
  appState.users[target].totalEarned += amount;
  user.vipGiveawayDay = today;

  addHistory(user, `VIP → ${target}: ${formatNum(amount)} грн`);
  addHistory(appState.users[target], `VIP ← ${appState.currentUser}: ${formatNum(amount)} грн`);

  saveAppState();
  playBeep(880);
  updateHeader();
  showToast(tr("vipSent"));
}

// -----------------------------
// ADMIN PANEL
// 5+ functions added:
// 1 give money
// 2 take money
// 3 set balance
// 4 set class
// 5 ban/unban
// 6 reset account
// 7 delete account
// 8 give business
// 9 give realty
// 10 give car
// 11 mass money online
// 12 mass crypto online
// 13 broadcast message
// 14 collect commission bank
// 15 collect support bank
// -----------------------------
function renderAdminPage() {
  const user = getCurrentUser();

  if (!isCreator(user)) {
    document.getElementById("page-content").innerHTML = `<div class="panel">${tr("creatorOnly")}</div>`;
    return;
  }

  const players = Object.keys(appState.users)
    .filter(name => !appState.users[name].banned)
    .sort();

  const onlinePlayers = getOnlinePlayersDetailed();

  const playerOptions = players.map(name => `<option value="${name}">${name}</option>`).join("");
  const classOptions = classList.filter(item => item.key !== "creator").map(item => `<option value="${item.key}">${item.title}</option>`).join("");
  const businessOptions = businessCatalog.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
  const realtyOptions = realtyCatalog.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
  const carOptions = carCatalog.map(item => `<option value="${item.id}">${item.name}</option>`).join("");

  const onlineHtml = onlinePlayers.map(item => {
    return `
      <div class="rank-item">
        <div class="rank-badge">●</div>
        <div>
          <div><b>${item.name}</b></div>
          <div class="sub">${getClassData(item.classKey).title}</div>
        </div>
        <div class="sub">
          ${item.deviceType === "phone" ? `📱 ${tr("phone")}` : `🖥 ${tr("desktop")}`}
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("page-content").innerHTML = `
    <h2 class="page-title">👑 ${tr("creatorPanel")}</h2>

    <div class="grid" style="gap:16px">

      <div class="admin-card">
        <h3>${tr("adminAnalytics")}</h3>
        <p>${tr("totalPlayers")}: <b>${players.length}</b></p>
        <p>${tr("onlineUsers")}: <b>${onlinePlayers.length}</b></p>
        <p>${tr("supportBank")}: <b>${formatNum(appState.supportBank)} грн</b></p>
        <p>${tr("commissionBank")}: <b>${formatNum(appState.commissionBank)} грн</b></p>
      </div>

      <div class="admin-card">
        <h3>${tr("onlinePlayersList")}</h3>
        <div class="rank-list">
          ${onlineHtml || `<div class="sub">0</div>`}
        </div>
      </div>

      <div class="admin-card">
        <h3>${tr("adminMassTitle")}</h3>
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
          <input id="admin-global-message-input" placeholder="${tr("enterMessage")}">
          <button id="admin-send-message-btn">${tr("send")}</button>
        </div>
      </div>

      <div class="admin-card">
        <h3>${tr("playerManagement")}</h3>
        <div class="grid" style="gap:12px">
          <select id="admin-player-select">${playerOptions}</select>
          <input id="admin-amount-input" type="number" placeholder="${tr("amount")}">
          <select id="admin-class-select">${classOptions}</select>
          <select id="admin-business-select">${businessOptions}</select>
          <select id="admin-realty-select">${realtyOptions}</select>
          <select id="admin-car-select">${carOptions}</select>
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

  // Mass money
  document.getElementById("admin-mass-money-btn").onclick = () => {
    const amount = Number(prompt(tr("enterAmountForAllOnline")));
    if (!amount || amount <= 0) return;

    getOnlinePlayersDetailed().forEach(item => {
      appState.users[item.name].balance += amount;
      appState.users[item.name].totalEarned += amount;
      addHistory(appState.users[item.name], `${tr("onlineOnlyMoney")}: +${formatNum(amount)} грн`);
    });

    saveAppState();
    playBeep(840);
    showToast(tr("massDone"));
    renderAdminPage();
  };

  // Mass crypto
  document.getElementById("admin-mass-crypto-btn").onclick = () => {
    const symbol = sanitize(prompt(tr("enterCryptoSymbol"))).toUpperCase();
    const amount = Number(prompt(tr("enterCryptoAmount")));

    if (!symbol || !appState.market.crypto[symbol]) {
      showToast(tr("invalidData"), true);
      return;
    }
    if (!amount || amount <= 0) {
      showToast(tr("invalidData"), true);
      return;
    }

    getOnlinePlayersDetailed().forEach(item => {
      appState.users[item.name].crypto[symbol] = (appState.users[item.name].crypto[symbol] || 0) + amount;
      addHistory(appState.users[item.name], `${tr("onlineOnlyCrypto")}: +${formatNum(amount)} ${symbol}`);
    });

    saveAppState();
    playBeep(850);
    showToast(tr("massDone"));
    renderAdminPage();
  };

  document.getElementById("admin-collect-commission-btn").onclick = () => {
    const creator = getCurrentUser();
    creator.balance += appState.commissionBank;
    creator.totalEarned += appState.commissionBank;
    addHistory(creator, `${tr("collectCommission")}: +${formatNum(appState.commissionBank)} грн`);
    appState.commissionBank = 0;
    saveAppState();
    showToast(tr("valueUpdated"));
    updateHeader();
    renderAdminPage();
  };

  document.getElementById("admin-collect-support-btn").onclick = () => {
    const creator = getCurrentUser();
    creator.balance += appState.supportBank;
    creator.totalEarned += appState.supportBank;
    addHistory(creator, `${tr("collectSupport")}: +${formatNum(appState.supportBank)} грн`);
    appState.supportBank = 0;
    saveAppState();
    showToast(tr("valueUpdated"));
    updateHeader();
    renderAdminPage();
  };

  document.getElementById("admin-send-message-btn").onclick = () => {
    const message = sanitize(document.getElementById("admin-global-message-input").value);
    appState.globalMessage = message;
    saveAppState();
    showToast(tr("sent"));
    updateHeader();
  };

  const getSelectedPlayer = () => {
    const nickname = document.getElementById("admin-player-select").value;
    const player = appState.users[nickname];
    if (!player) {
      showToast(tr("playerNotFound"), true);
      return null;
    }
    return { nickname, player };
  };

  document.getElementById("admin-give-money-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const amount = Number(document.getElementById("admin-amount-input").value);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);

    target.player.balance += amount;
    target.player.totalEarned += amount;
    addHistory(target.player, `${tr("giveMoney")}: +${formatNum(amount)} грн`);
    saveAppState();
    showToast(tr("valueUpdated"));
    renderAdminPage();
  };

  document.getElementById("admin-take-money-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const amount = Number(document.getElementById("admin-amount-input").value);
    if (!amount || amount <= 0) return showToast(tr("invalidData"), true);

    target.player.balance = Math.max(0, target.player.balance - amount);
    addHistory(target.player, `${tr("takeMoney")}: -${formatNum(amount)} грн`);
    saveAppState();
    showToast(tr("valueUpdated"));
    renderAdminPage();
  };

  document.getElementById("admin-set-balance-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const amount = Number(document.getElementById("admin-amount-input").value);
    if (amount < 0 || Number.isNaN(amount)) return showToast(tr("invalidData"), true);

    target.player.balance = amount;
    addHistory(target.player, `${tr("setBalance")}: ${formatNum(amount)} грн`);
    saveAppState();
    showToast(tr("valueUpdated"));
    renderAdminPage();
  };

  document.getElementById("admin-set-class-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const classKey = document.getElementById("admin-class-select").value;

    target.player.classKey = classKey;
    addHistory(target.player, `${tr("setClass")}: ${getClassData(classKey).title}`);
    saveAppState();
    showToast(tr("classSet"));
    renderAdminPage();
  };

  document.getElementById("admin-ban-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    if (target.nickname === "creator") return;
    target.player.banned = true;
    saveAppState();
    showToast(tr("valueUpdated"));
    renderAdminPage();
  };

  document.getElementById("admin-unban-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    target.player.banned = false;
    saveAppState();
    showToast(tr("valueUpdated"));
    renderAdminPage();
  };

  document.getElementById("admin-reset-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    if (target.nickname === "creator") return;
    const oldPassword = target.player.password;
    appState.users[target.nickname] = makeUser(oldPassword, false);
    appState.users[target.nickname].deviceType = target.player.deviceType || "desktop";
    saveAppState();
    showToast(tr("accountReset"));
    renderAdminPage();
  };

  document.getElementById("admin-delete-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    if (target.nickname === "creator") return;
    delete appState.users[target.nickname];
    saveAppState();
    showToast(tr("accountDeleted"));
    renderAdminPage();
  };

  document.getElementById("admin-give-business-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const businessId = document.getElementById("admin-business-select").value;
    if (!target.player.businesses.includes(businessId)) {
      target.player.businesses.push(businessId);
      addHistory(target.player, `${tr("giveBusiness")}: ${businessCatalog.find(item => item.id === businessId)?.name || businessId}`);
      saveAppState();
      showToast(tr("valueUpdated"));
      renderAdminPage();
    }
  };

  document.getElementById("admin-give-realty-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const realtyId = document.getElementById("admin-realty-select").value;
    if (!target.player.realty.includes(realtyId)) {
      target.player.realty.push(realtyId);
      addHistory(target.player, `${tr("giveRealty")}: ${realtyCatalog.find(item => item.id === realtyId)?.name || realtyId}`);
      saveAppState();
      showToast(tr("valueUpdated"));
      renderAdminPage();
    }
  };

  document.getElementById("admin-give-car-btn").onclick = () => {
    const target = getSelectedPlayer();
    if (!target) return;
    const carId = document.getElementById("admin-car-select").value;
    if (!target.player.cars.includes(carId)) {
      target.player.cars.push(carId);
      addHistory(target.player, `${tr("giveCar")}: ${carCatalog.find(item => item.id === carId)?.name || carId}`);
      saveAppState();
      showToast(tr("valueUpdated"));
      renderAdminPage();
    }
  };
}

// -----------------------------
// NAVIGATION
// -----------------------------
function renderPage(page) {
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

// -----------------------------
// AUTH
// -----------------------------
function registerUser() {
  const username = sanitize(document.getElementById("reg-username").value).toLowerCase();
  const password = sanitize(document.getElementById("reg-password").value);

  if (username.length < 3) {
    showToast(tr("usernameTooShort"), true);
    return;
  }

  if (password.length < 4) {
    showToast(tr("passwordTooShort"), true);
    return;
  }

  if (["me", "admin"].includes(username)) {
    showToast(tr("bannedName"), true);
    return;
  }

  if (appState.users[username]) {
    showToast(tr("userExists"), true);
    return;
  }

  appState.users[username] = makeUser(password, false);
  saveAppState();
  playBeep(760);
  showToast(tr("userCreated"));

  document.querySelector('[data-tab="login"]').click();
  document.getElementById("login-username").value = username;
  document.getElementById("login-password").value = password;
}

function applyOfflineIncome(user) {
  const now = Date.now();
  const diffMs = now - (user.lastSeen || now);
  const minutesAway = Math.floor(diffMs / 60000);

  if (minutesAway <= 0) return;

  const classPassive = getClassData(user.classKey).passivePerMin;
  const businessPassive = user.businesses.reduce((sum, id) => {
    const item = businessCatalog.find(x => x.id === id);
    return sum + (item ? item.income : 0);
  }, 0);
  const realtyPassive = user.realty.reduce((sum, id) => {
    const item = realtyCatalog.find(x => x.id === id);
    return sum + (item ? item.income : 0);
  }, 0);

  const totalPassive = classPassive + businessPassive + realtyPassive;
  if (totalPassive <= 0) return;

  const offlineIncome = totalPassive * minutesAway;
  if (offlineIncome > 0) {
    user.balance += offlineIncome;
    user.totalEarned += offlineIncome;
    addHistory(user, `${appState.lang === "uk" ? "Офлайн дохід" : "Offline income"}: +${formatNum(offlineIncome)} грн`);
  }
}

function loginUser() {
  const username = sanitize(document.getElementById("login-username").value).toLowerCase();
  const password = sanitize(document.getElementById("login-password").value);

  const user = appState.users[username];

  if (!user || user.password !== password) {
    showToast(tr("loginError"), true);
    return;
  }

  if (user.banned) {
    showToast(tr("accountBanned"), true);
    return;
  }

  applyOfflineIncome(user);

  appState.currentUser = username;
  user.lastSeen = Date.now();

  saveAppState();
  playBeep(740);

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  updateHeader();
  renderProfilePage();
}

function logoutUser() {
  appState.currentUser = null;
  saveAppState();

  document.getElementById("app-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

// -----------------------------
// CARD ACTIONS
// -----------------------------
function changePin() {
  const user = getCurrentUser();
  const newCvv = prompt(appState.lang === "uk" ? "Новий CVV (3 цифри)" : "New CVV (3 digits)", user.cardCvv);

  if (newCvv === null) return;
  if (!/^\d{3}$/.test(newCvv)) {
    showToast(tr("wrongCode"), true);
    return;
  }

  user.cardCvv = newCvv;
  saveAppState();
  playBeep(720);
  showToast(tr("cvvChanged"));
  renderProfilePage();
}

function openColorModal() {
  document.getElementById("color-modal").classList.remove("hidden");
}

function closeColorModal() {
  document.getElementById("color-modal").classList.add("hidden");
}

// -----------------------------
// CLICK / PASSIVE / PRESENCE / MARKET
// -----------------------------
function handleClickIncome() {
  const user = getCurrentUser();
  if (!user) return;

  const reward = getClickReward(user);
  addMoney(user, reward, `${tr("click")}: +${formatNum(reward)} грн`);
  saveAppState();
  playBeep(540);
  updateHeader();
}

function passiveIncomeTick() {
  const user = getCurrentUser();
  if (!user) return;

  const amount = getPassiveIncome(user);
  if (amount <= 0) return;

  addMoney(user, amount, `${tr("passiveIncome")}: +${formatNum(amount)} грн`);
  saveAppState();
  updateHeader();
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

  saveAppState();
}

function presenceTick() {
  const user = getCurrentUser();
  if (!user) return;
  user.lastSeen = Date.now();
  saveAppState();
}

// -----------------------------
// TAB / NAV / MODALS
// -----------------------------
function bindBaseEvents() {
  document.getElementById("login-btn").onclick = loginUser;
  document.getElementById("register-btn").onclick = registerUser;
  document.getElementById("logout-btn").onclick = logoutUser;

  document.querySelectorAll(".tab-btn").forEach(button => {
    button.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach(item => item.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(item => item.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(`${button.dataset.tab}-form`).classList.add("active");
    };
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.onclick = () => {
      renderPage(button.dataset.page);
      closeSidebar();
    };
  });

  document.getElementById("click-btn").onclick = handleClickIncome;
  document.getElementById("change-pin-btn").onclick = changePin;
  document.getElementById("change-card-name-btn").onclick = () => {
    const user = getCurrentUser();
    const newName = prompt(appState.lang === "uk" ? "Нова назва карти" : "New card name", user.cardName);
    if (!newName) return;
    user.cardName = newName.slice(0, 24);
    saveAppState();
    showToast(tr("cardNameChanged"));
    renderProfilePage();
  };
  document.getElementById("change-card-color-btn").onclick = openColorModal;
  document.getElementById("vip-giveaway-btn").onclick = handleVipGiveaway;

  document.getElementById("toggle-sound-btn").onclick = () => {
    appState.soundEnabled = !appState.soundEnabled;
    saveAppState();
    showToast(appState.soundEnabled ? tr("soundOn") : tr("soundOff"));
    updateHeader();
  };

  document.getElementById("lang-btn").onclick = () => {
    appState.lang = appState.lang === "uk" ? "en" : "uk";
    saveAppState();
    updateHeader();
    const active = document.querySelector(".nav-btn.active")?.dataset.page || "dashboard";
    renderPage(active);
  };

  document.getElementById("sidebar-open").onclick = () => {
    document.getElementById("sidebar").classList.add("show");
    document.getElementById("overlay").classList.add("show");
  };

  document.getElementById("sidebar-close").onclick = closeSidebar;
  document.getElementById("overlay").onclick = closeSidebar;

  document.getElementById("close-color-modal").onclick = closeColorModal;

  document.querySelectorAll(".color-option").forEach(button => {
    button.onclick = () => {
      const user = getCurrentUser();
      user.cardColor = button.dataset.color;
      saveAppState();
      closeColorModal();
      showToast(tr("colorChanged"));
      renderProfilePage();
    };
  });
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}

// -----------------------------
// INIT
// -----------------------------
function initApp() {
  loadAppState();
  bindBaseEvents();

  if (appState.currentUser && appState.users[appState.currentUser] && !appState.users[appState.currentUser].banned) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app-screen").classList.remove("hidden");
    updateHeader();
    renderProfilePage();
  }

  setInterval(marketTick, 30000);
  setInterval(passiveIncomeTick, 60000);
  setInterval(presenceTick, 15000);
}

initApp();
