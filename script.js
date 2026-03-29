// ==================== STATE ====================
let currentUser = null;
let users = {};
let cryptoPrices = {};
let stocks = [];
let commissionBank = 0;
let supportBank = 0;
let boostMultiplier = 1;
let boostExpiry = 0;
let usdRate = 40;
let currentLang = "uk";
let globalMessage = null;

const STORAGE = {
    users: "bitbank_users",
    commission: "bitbank_commission",
    support: "bitbank_support",
    boost: "bitbank_boost",
    lang: "bitbank_lang",
    message: "bitbank_message"
};

// ==================== TRANSLATIONS ====================
const translations = {
    uk: {
        subtitle: "симулятор фінансової гри",
        loginTab: "Вхід",
        registerTab: "Реєстрація",
        loginBtn: "Увійти",
        registerBtn: "Створити",
        balanceLabel: "Баланс",
        clickButton: "КЛІК",
        buy: "Купити",
        sell: "Продати",
        navDashboard: "Головна",
        navCrypto: "Крипто",
        navStocks: "Акції",
        navBusiness: "Бізнес",
        navRealty: "Нерухомість",
        navCars: "Авто",
        navClasses: "Класи",
        navTransfer: "Перекази",
        navHistory: "Історія",
        navDonate: "Підтримка",
        navTop: "Топ 100",
        navAdmin: "Адмін",
        navLogout: "Вихід",
        changePin: "Змінити PIN",
        changeCardName: "Назва карти",
        changeCardColor: "Колір картки",
        vipGiveaway: "VIP-роздача",
        chooseCardColor: "Оберіть колір картки",
        owned: "Власність",
        buyBtn: "Купити",
        transferTitleUah: "Переказ гривень (комісія 5%)",
        transferTitleUsd: "Переказ USD (комісія 5%)",
        transferTitleCrypto: "Переказ крипти (комісія 1%)",
        recipient: "Отримувач",
        amount: "Сума",
        amountUsd: "Сума USD",
        cryptoRecipient: "Отримувач",
        cryptoAmount: "Кількість",
        symbolPlaceholder: "Символ (BTC, ETH..)",
        donateToSupport: "Підтримати",
        upgradeStatus: "Підвищити статус",
        statistics: "Статистика",
        passiveIncome: "Пасивний дохід/хв",
        clickReward: "Клік",
        buyUsd: "Купити USD",
        sellUsd: "Продати USD",
        supportBank: "Банка підтримки",
        donateAmount: "Сума донату",
        thankYou: "Дякуємо!",
        pinChanged: "PIN-код змінено",
        invalidPin: "Невірний CVV-код!",
        insufficientFunds: "Недостатньо коштів",
        vipDailyLimit: "Ви вже використали ліміт роздачі на сьогодні (100000 грн)",
        vipGiveawaySuccess: "Видано {amount} грн користувачу {user}",
        status: "Статус",
        titles: "Титули",
        none: "немає",
        history: "Історія операцій",
        profileTitle: "Профіль та картка",
        profileStats: "Статистика профілю",
        profileCapital: "Капітал",
        profileCard: "Ваша картка",
        profileActions: "Дії з карткою",
        exchangeSection: "Конвертація валют",
        passiveIncomePerMin: "Пасивний дохід/хв",
        currentClass: "Поточний статус",
        stockPrice: "Ціна",
        yourBalance: "Ваш баланс",
        adminMassTitle: "Масові дії",
        adminGiveAllOnlineMoney: "Видати всім онлайн гроші",
        adminGiveAllOnlineCrypto: "Видати всім онлайн крипту",
        adminTakeCommission: "Забрати комісії",
        adminTakeSupport: "Забрати підтримку",
        adminBroadcast: "Надіслати всім онлайн",
        adminMessage: "Повідомлення",
        adminAnalytics: "Аналітика",
        enterAmountForAllOnline: "Введіть суму для всіх онлайн користувачів",
        enterCryptoSymbol: "Введіть символ крипти",
        enterCryptoAmount: "Введіть кількість крипти",
        massRewardSuccess: "Успішно видано всім онлайн",
        cryptoMassRewardSuccess: "Успішно видано крипту всім онлайн",
        transferSuccess: "Переказ успішний",
        invalidUser: "Невірний користувач",
        notEnoughCrypto: "Недостатньо крипти",
        onlineUsers: "Онлайн користувачі",
        totalUsers: "Всього користувачів",
        totalCapital: "Сумарний капітал",
        adminPanel: "Адмін панель",
        send: "Надіслати",
        refresh: "Оновити",
        dailyBonus: "Щоденний бонус",
        claimBonus: "Забрати бонус",
        bonusTaken: "Бонус вже отримано сьогодні",
        cardNamePrompt: "Введіть нову назву картки",
        changeCvvPrompt: "Введіть новий CVV (3 цифри)",
        invalidCredentials: "Невірний логін або пароль",
        userExists: "Користувач уже існує",
        userCreated: "Акаунт створено",
        usernameTooShort: "Логін має містити мінімум 3 символи",
        passwordTooShort: "Пароль має містити мінімум 4 символи",
        bannedUser: "Ваш акаунт заблоковано",
        invalidData: "Невірні дані",
        languageSwitched: "Мову змінено",
        adminsOnly: "Тільки для адміністратора",
        topTitle: "Топ 100 гравців (капітал у USD)"
    },
    en: {
        subtitle: "financial game simulator",
        loginTab: "Login",
        registerTab: "Register",
        loginBtn: "Login",
        registerBtn: "Create",
        balanceLabel: "Balance",
        clickButton: "CLICK",
        buy: "Buy",
        sell: "Sell",
        navDashboard: "Dashboard",
        navCrypto: "Crypto",
        navStocks: "Stocks",
        navBusiness: "Business",
        navRealty: "Real Estate",
        navCars: "Cars",
        navClasses: "Classes",
        navTransfer: "Transfers",
        navHistory: "History",
        navDonate: "Support",
        navTop: "Top 100",
        navAdmin: "Admin",
        navLogout: "Logout",
        changePin: "Change PIN",
        changeCardName: "Card name",
        changeCardColor: "Card color",
        vipGiveaway: "VIP giveaway",
        chooseCardColor: "Choose card color",
        owned: "Owned",
        buyBtn: "Buy",
        transferTitleUah: "UAH transfer (5% fee)",
        transferTitleUsd: "USD transfer (5% fee)",
        transferTitleCrypto: "Crypto transfer (1% fee)",
        recipient: "Recipient",
        amount: "Amount",
        amountUsd: "Amount USD",
        cryptoRecipient: "Recipient",
        cryptoAmount: "Amount",
        symbolPlaceholder: "Symbol (BTC, ETH..)",
        donateToSupport: "Donate",
        upgradeStatus: "Upgrade status",
        statistics: "Statistics",
        passiveIncome: "Passive income/min",
        clickReward: "Click",
        buyUsd: "Buy USD",
        sellUsd: "Sell USD",
        supportBank: "Support fund",
        donateAmount: "Donation amount",
        thankYou: "Thank you!",
        pinChanged: "PIN changed",
        invalidPin: "Invalid CVV!",
        insufficientFunds: "Insufficient funds",
        vipDailyLimit: "You have already used today's limit (100000 UAH)",
        vipGiveawaySuccess: "Given {amount} UAH to user {user}",
        status: "Status",
        titles: "Titles",
        none: "none",
        history: "Transaction history",
        profileTitle: "Profile & Card",
        profileStats: "Profile statistics",
        profileCapital: "Capital",
        profileCard: "Your card",
        profileActions: "Card actions",
        exchangeSection: "Currency conversion",
        passiveIncomePerMin: "Passive income/min",
        currentClass: "Current status",
        stockPrice: "Price",
        yourBalance: "Your balance",
        adminMassTitle: "Mass actions",
        adminGiveAllOnlineMoney: "Give all online users money",
        adminGiveAllOnlineCrypto: "Give all online users crypto",
        adminTakeCommission: "Collect commissions",
        adminTakeSupport: "Collect support",
        adminBroadcast: "Send to all online",
        adminMessage: "Message",
        adminAnalytics: "Analytics",
        enterAmountForAllOnline: "Enter amount for all online users",
        enterCryptoSymbol: "Enter crypto symbol",
        enterCryptoAmount: "Enter crypto amount",
        massRewardSuccess: "Successfully granted to all online users",
        cryptoMassRewardSuccess: "Successfully granted crypto to all online users",
        transferSuccess: "Transfer successful",
        invalidUser: "Invalid user",
        notEnoughCrypto: "Not enough crypto",
        onlineUsers: "Online users",
        totalUsers: "Total users",
        totalCapital: "Total capital",
        adminPanel: "Admin panel",
        send: "Send",
        refresh: "Refresh",
        dailyBonus: "Daily bonus",
        claimBonus: "Claim bonus",
        bonusTaken: "Bonus already claimed today",
        cardNamePrompt: "Enter new card name",
        changeCvvPrompt: "Enter new CVV (3 digits)",
        invalidCredentials: "Invalid username or password",
        userExists: "User already exists",
        userCreated: "Account created",
        usernameTooShort: "Username must be at least 3 characters",
        passwordTooShort: "Password must be at least 4 characters",
        bannedUser: "Your account is banned",
        invalidData: "Invalid data",
        languageSwitched: "Language changed",
        adminsOnly: "Admins only",
        topTitle: "Top 100 players (capital in USD)"
    }
};

function t(key, params = {}) {
    let text = translations[currentLang][key] || key;
    for (const k in params) {
        text = text.replace(`{${k}}`, params[k]);
    }
    return text;
}

// ==================== CONFIGS ====================
const statuses = {
    none: { price: 0, clickReward: 5, onlineIncome: 0, offlineIncome: 0, icon: "👤", desc: { uk: "Початківець", en: "Beginner" } },
    basic: { price: 500, clickReward: 15, onlineIncome: 10, offlineIncome: 5, icon: "⭐", desc: { uk: "Базовий статус", en: "Basic status" } },
    medium: { price: 2500, clickReward: 50, onlineIncome: 40, offlineIncome: 20, icon: "💎", desc: { uk: "Середній клас", en: "Middle class" } },
    vip: { price: 10000, clickReward: 200, onlineIncome: 150, offlineIncome: 80, icon: "👑", desc: { uk: "VIP-клієнт", en: "VIP client" } },
    businessman: { price: 50000, clickReward: 1000, onlineIncome: 600, offlineIncome: 300, icon: "🏢", desc: { uk: "Бізнесмен", en: "Businessman" } },
    manager: { price: 200000, clickReward: 10000, onlineIncome: 4000, offlineIncome: 2000, icon: "📊", desc: { uk: "Топ-менеджер", en: "Top manager" } },
    admin: { price: 0, clickReward: 50000, onlineIncome: 20000, offlineIncome: 10000, icon: "🛡️", desc: { uk: "Адміністратор", en: "Administrator" } }
};

const businessesList = [
    { id: "kiosk", name: "Кіоск", cost: 1000, incomePerMin: 5, icon: "fas fa-store" },
    { id: "cafe", name: "Кав’ярня", cost: 5000, incomePerMin: 30, icon: "fas fa-mug-hot" },
    { id: "shop", name: "Магазин", cost: 20000, incomePerMin: 150, icon: "fas fa-cart-shopping" },
    { id: "itstudio", name: "IT студія", cost: 100000, incomePerMin: 800, icon: "fas fa-laptop-code" },
    { id: "cryptofarm", name: "Криптоферма", cost: 500000, incomePerMin: 4000, icon: "fas fa-microchip" },
    { id: "restaurant", name: "Ресторан", cost: 150000, incomePerMin: 1200, icon: "fas fa-utensils" },
    { id: "tesla", name: "Tesla", costUsd: 500000000, incomePerMin: 1000000, icon: "fab fa-tesla" },
    { id: "spacex", name: "SpaceX", costUsd: 1000000000, incomePerMin: 2000000, icon: "fas fa-rocket" },
    { id: "neuralink", name: "Neuralink", costUsd: 50000000, incomePerMin: 100000, icon: "fas fa-brain" },
    { id: "microsoft", name: "Microsoft", costUsd: 100000000, incomePerMin: 500000, icon: "fab fa-microsoft" }
];

const realtiesList = [
    { id: "palm", name: "🌴 Пальмовий острів", cost: 25000, incomePerMin: 60 },
    { id: "volcano", name: "🌋 Вулканічний острів", cost: 45000, incomePerMin: 120 },
    { id: "paradise", name: "🏝️ Райський острів", cost: 80000, incomePerMin: 200 },
    { id: "treasure", name: "💰 Острів скарбів", cost: 120000, incomePerMin: 320 },
    { id: "house1", name: "🏠 Затишний будинок", cost: 30000, incomePerMin: 80 },
    { id: "house2", name: "🏡 Сімейний будинок", cost: 60000, incomePerMin: 150 },
    { id: "house3", name: "🏘️ Котедж", cost: 100000, incomePerMin: 250 },
    { id: "house4", name: "🏰 Садиба", cost: 200000, incomePerMin: 500 }
];

const carsList = [
    { name: "Toyota Corolla", priceUsd: 22000 },
    { name: "Honda Civic", priceUsd: 24000 },
    { name: "Ford Mustang", priceUsd: 33000 },
    { name: "BMW 3 Series", priceUsd: 42000 },
    { name: "Mercedes C-Class", priceUsd: 45000 },
    { name: "Audi A4", priceUsd: 41000 },
    { name: "Tesla Model 3", priceUsd: 47000 },
    { name: "Porsche 911", priceUsd: 110000 }
];

const stockImages = {
    Apple: "https://logo.clearbit.com/apple.com",
    Microsoft: "https://logo.clearbit.com/microsoft.com",
    Google: "https://logo.clearbit.com/google.com",
    Amazon: "https://logo.clearbit.com/amazon.com",
    Tesla: "https://logo.clearbit.com/tesla.com",
    Meta: "https://logo.clearbit.com/meta.com",
    NVIDIA: "https://logo.clearbit.com/nvidia.com",
    Netflix: "https://logo.clearbit.com/netflix.com",
    Adobe: "https://logo.clearbit.com/adobe.com"
};

const realtyImages = {
    palm: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop",
    volcano: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300&auto=format&fit=crop",
    paradise: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&auto=format&fit=crop",
    treasure: "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=300&auto=format&fit=crop",
    house1: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&auto=format&fit=crop",
    house2: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&auto=format&fit=crop",
    house3: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=300&auto=format&fit=crop",
    house4: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&auto=format&fit=crop"
};

const carImages = {
    "Toyota Corolla": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&auto=format&fit=crop",
    "Honda Civic": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop",
    "Tesla Model 3": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&auto=format&fit=crop",
    "BMW 3 Series": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&auto=format&fit=crop",
    "Mercedes C-Class": "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=300&auto=format&fit=crop"
};

function fallbackAssetImage(label) {
    return `https://via.placeholder.com/72x72/0e1624/ffffff?text=${encodeURIComponent((label || "??").slice(0, 2).toUpperCase())}`;
}

// ==================== HELPERS ====================
function formatMoney(value) {
    return Number(value || 0).toLocaleString(currentLang === "uk" ? "uk-UA" : "en-US", { maximumFractionDigits: 2 });
}

function sanitize(str) {
    return String(str || "").replace(/[<>]/g, "").trim();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function showToast(msg, isError = false) {
    const toast = document.createElement("div");
    toast.innerText = msg;
    toast.style.position = "fixed";
    toast.style.bottom = "128px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = isError ? "#c0392b" : "#21364e";
    toast.style.color = "white";
    toast.style.padding = "10px 18px";
    toast.style.borderRadius = "999px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

function tReplace(el) {
    const key = el.getAttribute("data-i18n");
    if (key && translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
    }
}

function updateStaticTexts() {
    document.querySelectorAll("[data-i18n]").forEach(tReplace);

    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
        langBtn.innerHTML = `<i class="fas fa-language"></i> ${currentLang === "uk" ? "EN" : "UA"}`;
    }
}

function getCurrentUser() {
    return currentUser ? users[currentUser.username] : null;
}

function getTotalPassiveIncome(user) {
    let income = statuses[user.status].onlineIncome;
    (user.businesses || []).forEach(id => {
        const biz = businessesList.find(x => x.id === id);
        if (biz) income += biz.incomePerMin;
    });
    (user.realties || []).forEach(id => {
        const realty = realtiesList.find(x => x.id === id);
        if (realty) income += realty.incomePerMin;
    });
    return income;
}

function getUserCapitalUsd(user) {
    let totalUah = Number(user.balance || 0);
    totalUah += Number(user.usdBalance || 0) * usdRate;

    Object.entries(user.crypto || {}).forEach(([sym, qty]) => {
        const coin = cryptoPrices[sym];
        if (coin) totalUah += qty * coin.price;
    });

    Object.entries(user.stocks || {}).forEach(([stockId, qty]) => {
        const stock = stocks.find(s => String(s.id) === String(stockId));
        if (stock) totalUah += qty * stock.price;
    });

    (user.businesses || []).forEach(id => {
        const biz = businessesList.find(x => x.id === id);
        if (biz) totalUah += biz.cost || ((biz.costUsd || 0) * usdRate);
    });

    (user.realties || []).forEach(id => {
        const realty = realtiesList.find(x => x.id === id);
        if (realty) totalUah += realty.cost;
    });

    (user.cars || []).forEach(index => {
        const car = carsList[index];
        if (car) totalUah += car.priceUsd * usdRate;
    });

    return totalUah / usdRate;
}

function addTransaction(username, type, amount, currency, details) {
    if (!users[username]) return;
    if (!users[username].transactions) users[username].transactions = [];
    users[username].transactions.unshift({
        timestamp: Date.now(),
        type,
        amount,
        currency,
        details
    });
    users[username].transactions = users[username].transactions.slice(0, 100);
    saveData();
}

function generateCardData() {
    const number = "4" + Math.floor(Math.random() * 1e15).toString().padStart(15, "0");
    const mm = String(randomInt(1, 12)).padStart(2, "0");
    const yy = String((new Date().getFullYear() + randomInt(1, 5))).slice(-2);
    return { number, expiry: `${mm}/${yy}` };
}

function createDefaultUser(password, isAdmin = false) {
    return {
        password,
        balance: isAdmin ? 1000000 : 500,
        usdBalance: 0,
        status: isAdmin ? "admin" : "none",
        isAdmin,
        isBanned: false,
        crypto: {},
        stocks: {},
        businesses: [],
        realties: [],
        cars: [],
        card: generateCardData(),
        cardColor: isAdmin ? "gold" : "black",
        cardName: isAdmin ? "Admin Card" : "Virtual Card",
        cardCvv: String(randomInt(100, 999)),
        cvvChanged: false,
        lastSeen: Date.now(),
        clickMultiplier: 1,
        multiplierExpiry: 0,
        transactions: [],
        specialTitles: [],
        vipGiveawayDate: null,
        lastDailyBonusDate: null
    };
}

function saveData() {
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
    localStorage.setItem(STORAGE.commission, String(commissionBank));
    localStorage.setItem(STORAGE.support, String(supportBank));
    localStorage.setItem(STORAGE.boost, JSON.stringify({ boostMultiplier, boostExpiry }));
    localStorage.setItem(STORAGE.lang, currentLang);
    localStorage.setItem(STORAGE.message, JSON.stringify(globalMessage));
}

function loadData() {
    try {
        users = JSON.parse(localStorage.getItem(STORAGE.users) || "{}");
        commissionBank = Number(localStorage.getItem(STORAGE.commission) || 0);
        supportBank = Number(localStorage.getItem(STORAGE.support) || 0);
        const boost = JSON.parse(localStorage.getItem(STORAGE.boost) || '{"boostMultiplier":1,"boostExpiry":0}');
        boostMultiplier = Number(boost.boostMultiplier || 1);
        boostExpiry = Number(boost.boostExpiry || 0);
        currentLang = localStorage.getItem(STORAGE.lang) || "uk";
        globalMessage = JSON.parse(localStorage.getItem(STORAGE.message) || "null");
    } catch {
        users = {};
    }

    if (!users.creator) {
        users.creator = createDefaultUser("9creator9", true);
    }

    Object.keys(users).forEach(username => {
        const u = users[username];
        if (!u.crypto) u.crypto = {};
        if (!u.stocks) u.stocks = {};
        if (!u.businesses) u.businesses = [];
        if (!u.realties) u.realties = [];
        if (!u.cars) u.cars = [];
        if (!u.card) u.card = generateCardData();
        if (!u.cardName) u.cardName = "Virtual Card";
        if (!u.cardColor) u.cardColor = "black";
        if (!u.cardCvv) u.cardCvv = String(randomInt(100, 999));
        if (!u.transactions) u.transactions = [];
        if (!u.specialTitles) u.specialTitles = [];
        if (typeof u.usdBalance !== "number") u.usdBalance = 0;
        if (typeof u.isAdmin !== "boolean") u.isAdmin = username === "creator" || u.status === "admin";
        if (typeof u.isBanned !== "boolean") u.isBanned = false;
        if (!u.lastSeen) u.lastSeen = Date.now();
        if (!u.lastDailyBonusDate) u.lastDailyBonusDate = null;
    });

    saveData();
}

// ==================== ONLINE / PRICES ====================
function isOnline(username) {
    const user = users[username];
    if (!user) return false;
    return Date.now() - Number(user.lastSeen || 0) < 2 * 60 * 1000;
}

function updateLastSeen() {
    if (!currentUser) return;
    users[currentUser.username].lastSeen = Date.now();
    saveData();
}

function initStocks() {
    const companies = [
        "Apple", "Microsoft", "Google", "Amazon", "Tesla", "Meta",
        "NVIDIA", "Netflix", "Adobe", "AMD", "Intel", "PayPal",
        "Spotify", "Sony", "Visa", "Mastercard", "Pfizer", "Samsung"
    ];

    stocks = companies.map((name, index) => ({
        id: index,
        name,
        price: 20 + Math.random() * 450
    }));

    stocks.push({ id: stocks.length, name: "Berkshire Hathaway A", price: 600000 });
}

async function fetchUsdRate() {
    try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=UAH");
        const data = await res.json();
        if (data?.rates?.UAH) usdRate = Number(data.rates.UAH);
    } catch {}
    updateUI();
}

async function fetchCryptoPrices() {
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false");
        const data = await res.json();
        cryptoPrices = {};
        data.forEach(coin => {
            cryptoPrices[coin.symbol.toUpperCase()] = {
                name: coin.name,
                price: coin.current_price * usdRate,
                img: coin.image
            };
        });
    } catch {}

    const active = document.querySelector(".sidebar-nav button.active-page")?.getAttribute("data-page");
    if (currentUser && active === "crypto") renderCrypto();
}

function fluctuateStocks() {
    stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 0.03;
        stock.price = Math.max(0.5, stock.price * (1 + change));
    });

    const active = document.querySelector(".sidebar-nav button.active-page")?.getAttribute("data-page");
    if (currentUser && active === "stocks") renderStocks();
}

// ==================== AUTH ====================
function registerUser() {
    const username = sanitize(document.getElementById("reg-username").value);
    const password = sanitize(document.getElementById("reg-password").value);

    if (username.length < 3) return showToast(t("usernameTooShort"), true);
    if (password.length < 4) return showToast(t("passwordTooShort"), true);
    if (users[username]) return showToast(t("userExists"), true);

    users[username] = createDefaultUser(password, false);
    saveData();
    showToast(t("userCreated"));

    document.querySelector('[data-tab="login"]').click();
    document.getElementById("login-username").value = username;
    document.getElementById("login-password").value = password;
}

function loginUser() {
    const username = sanitize(document.getElementById("login-username").value);
    const password = sanitize(document.getElementById("login-password").value);
    const user = users[username];

    if (!user || user.password !== password) return showToast(t("invalidCredentials"), true);
    if (user.isBanned) return showToast(t("bannedUser"), true);

    currentUser = { username };
    users[username].lastSeen = Date.now();
    saveData();

    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "flex";

    updateStaticTexts();
    updateUI();
    setAdminVisibility();
    showGlobalMessage();
    navigate("dashboard");
}

function logoutUser() {
    currentUser = null;
    document.getElementById("app-container").style.display = "none";
    document.getElementById("login-container").style.display = "flex";
}

function setAdminVisibility() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("admin-panel-btn").style.display = user.isAdmin ? "inline-flex" : "none";
    document.getElementById("vip-giveaway-btn").style.display = ["vip", "businessman", "manager", "admin"].includes(user.status) ? "inline-flex" : "none";
}

function showGlobalMessage() {
    const box = document.getElementById("global-message-box");
    if (!box) return;

    if (globalMessage && globalMessage.text) {
        box.style.display = "block";
        box.textContent = `${globalMessage.from}: ${globalMessage.text}`;
    } else {
        box.style.display = "none";
    }
}

// ==================== UI ====================
function updateUI() {
    if (!currentUser) return;
    const user = getCurrentUser();

    document.getElementById("username-display").textContent = currentUser.username;
    document.getElementById("status-text").textContent = `${statuses[user.status].icon} ${user.status.toUpperCase()}`;
    document.getElementById("main-balance").textContent = formatMoney(Math.floor(user.balance));
    document.getElementById("usd-balance").textContent = formatMoney(user.usdBalance || 0);
}

function setActiveNav(page) {
    document.querySelectorAll(".sidebar-nav button[data-page]").forEach(btn => {
        btn.classList.toggle("active-page", btn.getAttribute("data-page") === page);
    });
}

function navigate(page) {
    if (!currentUser) return;
    setActiveNav(page);

    switch (page) {
        case "dashboard": renderDashboard(); break;
        case "crypto": renderCrypto(); break;
        case "stocks": renderStocks(); break;
        case "business": renderBusiness(); break;
        case "realty": renderRealty(); break;
        case "cars": renderCars(); break;
        case "classes": renderClasses(); break;
        case "transfer": renderTransfer(); break;
        case "history": renderHistory(); break;
        case "donate": renderDonate(); break;
        case "top": renderTop(); break;
        case "admin":
            if (getCurrentUser().isAdmin) renderAdminPanel();
            else showToast(t("adminsOnly"), true);
            break;
        default: renderDashboard();
    }

    document.getElementById("sidebar").classList.remove("open");
}

window.navigate = navigate;

// ==================== CVV / CARD ====================
function verifyCvv(callback) {
    if (!currentUser) return callback(false);
    const cvv = prompt("CVV (3):");
    if (cvv === getCurrentUser().cardCvv) callback(true);
    else {
        showToast(t("invalidPin"), true);
        callback(false);
    }
}

function changeCardName() {
    const user = getCurrentUser();
    const newName = prompt(t("cardNamePrompt"), user.cardName);
    if (!newName) return;
    user.cardName = sanitize(newName).slice(0, 28) || user.cardName;
    saveData();
    renderDashboard();
}

function changePin() {
    const user = getCurrentUser();
    const newCvv = prompt(t("changeCvvPrompt"), user.cardCvv);
    if (!newCvv) return;
    if (!/^\d{3}$/.test(newCvv)) return showToast(t("invalidPin"), true);
    user.cardCvv = newCvv;
    saveData();
    showToast(t("pinChanged"));
    renderDashboard();
}

function openColorModal() {
    const user = getCurrentUser();
    const goldOption = document.getElementById("gold-option");
    goldOption.style.display = ["vip", "businessman", "manager", "admin"].includes(user.status) ? "block" : "none";
    document.getElementById("color-modal").style.display = "flex";
}

function closeColorModal() {
    document.getElementById("color-modal").style.display = "none";
}

function setCardColor(color) {
    const user = getCurrentUser();
    if (color === "gold" && !["vip", "businessman", "manager", "admin"].includes(user.status)) {
        return showToast("Gold only for VIP+", true);
    }
    user.cardColor = color;
    saveData();
    closeColorModal();
    renderDashboard();
}

// ==================== DASHBOARD ====================
function renderDashboard() {
    const user = getCurrentUser();
    const card = user.card;

    let cardClass = "real-card ";
    switch (user.cardColor) {
        case "yellow": cardClass += "card-yellow"; break;
        case "white": cardClass += "card-white"; break;
        case "gold": cardClass += "gold-card"; break;
        default: cardClass += "card-black";
    }

    let titlesHtml = "";
    if (user.specialTitles.includes("elon")) titlesHtml += `<span class="special-title">🚀 Elon</span>`;
    if (user.specialTitles.includes("bezos")) titlesHtml += `<span class="special-title">💻 Bezos</span>`;
    if (!titlesHtml) titlesHtml = t("none");

    document.getElementById("page-content").innerHTML = `
        <div class="page-title"><i class="fas fa-user-circle"></i> ${t("profileTitle")}</div>

        <div class="profile-hero">
            <div class="profile-panel">
                <h3>${t("profileCard")}</h3>
                <div class="${cardClass}" style="cursor:pointer;" onclick="openColorModal()">
                    <div class="card-chip"></div>
                    <div class="card-number">${card.number.match(/.{1,4}/g).join(" ")}</div>
                    <div class="card-details">
                        <span>CVV: ${user.cardCvv}</span>
                        <span>${card.expiry}</span>
                    </div>
                    <div class="card-brand">BITBANK</div>
                </div>

                <h3>${t("profileActions")}</h3>
                <div class="button-group">
                    <button id="upgrade-status" class="btn-primary">${t("upgradeStatus")}</button>
                    <button id="dashboard-change-name">${t("changeCardName")}</button>
                    <button id="dashboard-change-color">${t("changeCardColor")}</button>
                    <button id="daily-bonus-btn">${t("claimBonus")}</button>
                </div>
            </div>

            <div class="profile-panel">
                <h3>${t("profileStats")}</h3>
                <div class="profile-stats">
                    <div class="stat-box">
                        <div class="label">${t("balanceLabel")}</div>
                        <div class="value">${formatMoney(user.balance)} грн</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">USD</div>
                        <div class="value">${formatMoney(user.usdBalance || 0)} USD</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">${t("profileCapital")}</div>
                        <div class="value">${formatMoney(getUserCapitalUsd(user))} USD</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">${t("currentClass")}</div>
                        <div class="value">${statuses[user.status].icon} ${user.status.toUpperCase()}</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">${t("passiveIncomePerMin")}</div>
                        <div class="value">${formatMoney(getTotalPassiveIncome(user))} грн</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">${t("clickReward")}</div>
                        <div class="value">+${formatMoney(Math.floor(statuses[user.status].clickReward * (boostExpiry > Date.now() ? boostMultiplier : 1)))} грн</div>
                    </div>
                </div>

                <div style="margin-top:18px;">
                    <h3>${t("exchangeSection")}</h3>
                    <p>1 USD = ${usdRate.toFixed(2)} грн</p>

                    <div class="transfer-grid">
                        <input type="number" id="uah-amount" placeholder="${t("amount")} грн">
                        <button id="buy-usd" class="btn-primary">${t("buyUsd")}</button>
                    </div>

                    <div class="transfer-grid" style="margin-top:10px;">
                        <input type="number" id="usd-amount" placeholder="${t("amountUsd")}">
                        <button id="sell-usd" class="btn-primary">${t("sellUsd")}</button>
                    </div>
                </div>

                <div style="margin-top:18px;">
                    <h3>${t("titles")}</h3>
                    <div>${titlesHtml}</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("upgrade-status").addEventListener("click", () => {
        verifyCvv(success => success && upgradeStatus());
    });

    document.getElementById("buy-usd").addEventListener("click", () => {
        verifyCvv(success => success && buyUsd());
    });

    document.getElementById("sell-usd").addEventListener("click", () => {
        verifyCvv(success => success && sellUsd());
    });

    document.getElementById("dashboard-change-name").addEventListener("click", changeCardName);
    document.getElementById("dashboard-change-color").addEventListener("click", openColorModal);
    document.getElementById("daily-bonus-btn").addEventListener("click", claimDailyBonus);
}

function claimDailyBonus() {
    const user = getCurrentUser();
    if (user.lastDailyBonusDate === todayKey()) {
        return showToast(t("bonusTaken"), true);
    }
    const bonus = randomInt(100, 500);
    user.balance += bonus;
    user.lastDailyBonusDate = todayKey();
    addTransaction(currentUser.username, "daily_bonus", bonus, "UAH", "Щоденний бонус");
    saveData();
    updateUI();
    renderDashboard();
    showToast(`+${bonus} грн`);
}

function upgradeStatus() {
    const user = getCurrentUser();
    const order = ["none", "basic", "medium", "vip", "businessman", "manager"];
    const index = order.indexOf(user.status);
    if (index >= order.length - 1) return showToast("Максимальний статус", true);

    const next = order[index + 1];
    const cost = statuses[next].price;
    if (user.balance < cost) return showToast(`${t("insufficientFunds")} (${cost} грн)`, true);

    user.balance -= cost;
    user.status = next;
    saveData();
    updateUI();
    setAdminVisibility();
    renderDashboard();
    showToast(`Статус підвищено до ${next}`);
}

function buyUsd() {
    const user = getCurrentUser();
    const amount = parseFloat(document.getElementById("uah-amount").value);
    if (isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);
    if (user.balance < amount) return showToast(t("insufficientFunds"), true);

    const usd = amount / usdRate;
    user.balance -= amount;
    user.usdBalance += usd;
    addTransaction(currentUser.username, "buy_usd", amount, "UAH", `Купівля ${usd.toFixed(2)} USD`);
    saveData();
    updateUI();
    renderDashboard();
    showToast(`+${usd.toFixed(2)} USD`);
}

function sellUsd() {
    const user = getCurrentUser();
    const usd = parseFloat(document.getElementById("usd-amount").value);
    if (isNaN(usd) || usd <= 0) return showToast(t("invalidData"), true);
    if (user.usdBalance < usd) return showToast(t("insufficientFunds"), true);

    const amount = usd * usdRate;
    user.usdBalance -= usd;
    user.balance += amount;
    addTransaction(currentUser.username, "sell_usd", usd, "USD", `Продаж USD за ${amount.toFixed(2)} грн`);
    saveData();
    updateUI();
    renderDashboard();
    showToast(`+${amount.toFixed(2)} грн`);
}

// ==================== CRYPTO ====================
function renderCrypto() {
    let html = `<div class="page-title"><i class="fab fa-bitcoin"></i> ${t("navCrypto")}</div><div class="card-grid">`;

    Object.keys(cryptoPrices).forEach(sym => {
        const coin = cryptoPrices[sym];
        const amountOwned = getCurrentUser().crypto[sym] || 0;
        html += `
            <div class="asset-card">
                <div class="card-header">
                    <img src="${coin.img || fallbackAssetImage(sym)}" class="asset-thumb" alt="${coin.name}">
                    <div>
                        <h4>${coin.name} (${sym})</h4>
                        <div class="asset-sub">${coin.price.toFixed(2)} грн</div>
                    </div>
                </div>

                <div>${t("yourBalance")}: ${formatMoney(amountOwned)}</div>
                <input type="number" id="crypto-amount-${sym}" step="0.0001" placeholder="${t("cryptoAmount")}">

                <div class="button-group">
                    <button onclick="buyCryptoWithCvv('${sym}')">${t("buy")}</button>
                    <button onclick="sellCryptoWithCvv('${sym}')">${t("sell")}</button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById("page-content").innerHTML = html;
}

window.buyCryptoWithCvv = function(sym) {
    verifyCvv(success => success && buyCrypto(sym));
};

window.sellCryptoWithCvv = function(sym) {
    verifyCvv(success => success && sellCrypto(sym));
};

function buyCrypto(sym) {
    const user = getCurrentUser();
    const amount = parseFloat(document.getElementById(`crypto-amount-${sym}`).value);
    const price = cryptoPrices[sym]?.price;

    if (!price || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);

    const total = amount * price;
    if (user.balance < total) return showToast(t("insufficientFunds"), true);

    user.balance -= total;
    user.crypto[sym] = (user.crypto[sym] || 0) + amount;
    addTransaction(currentUser.username, "buy_crypto", total, "UAH", `Купівля ${amount} ${sym}`);
    saveData();
    updateUI();
    renderCrypto();
}

function sellCrypto(sym) {
    const user = getCurrentUser();
    const amount = parseFloat(document.getElementById(`crypto-amount-${sym}`).value);
    const price = cryptoPrices[sym]?.price;

    if (!price || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);
    if ((user.crypto[sym] || 0) < amount) return showToast(t("notEnoughCrypto"), true);

    const total = amount * price;
    user.crypto[sym] -= amount;
    user.balance += total;
    addTransaction(currentUser.username, "sell_crypto", total, "UAH", `Продаж ${amount} ${sym}`);
    saveData();
    updateUI();
    renderCrypto();
}

// ==================== STOCKS ====================
function renderStocks() {
    let html = `<div class="page-title"><i class="fas fa-chart-line"></i> ${t("navStocks")}</div><div class="card-grid">`;

    stocks.forEach(stock => {
        const img = stockImages[stock.name] || fallbackAssetImage(stock.name);
        const owned = getCurrentUser().stocks[stock.id] || 0;

        html += `
            <div class="asset-card">
                <div class="card-header">
                    <img src="${img}" class="asset-thumb" alt="${stock.name}" onerror="this.src='${fallbackAssetImage("ST")}'">
                    <div>
                        <h4>${stock.name}</h4>
                        <div class="asset-sub">${t("stockPrice")}: ${stock.price.toFixed(2)} грн</div>
                    </div>
                </div>

                <div>${t("yourBalance")}: ${formatMoney(owned)}</div>
                <input type="number" id="stock-amount-${stock.id}" step="0.01" placeholder="шт">

                <div class="button-group">
                    <button onclick="buyStockWithCvv(${stock.id})">${t("buy")}</button>
                    <button onclick="sellStockWithCvv(${stock.id})">${t("sell")}</button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById("page-content").innerHTML = html;
}

window.buyStockWithCvv = function(id) {
    verifyCvv(success => success && buyStock(id));
};

window.sellStockWithCvv = function(id) {
    verifyCvv(success => success && sellStock(id));
};

function buyStock(id) {
    const user = getCurrentUser();
    const stock = stocks.find(s => s.id === id);
    const amount = parseFloat(document.getElementById(`stock-amount-${id}`).value);

    if (!stock || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);

    const total = amount * stock.price;
    if (user.balance < total) return showToast(t("insufficientFunds"), true);

    user.balance -= total;
    user.stocks[id] = (user.stocks[id] || 0) + amount;
    addTransaction(currentUser.username, "buy_stock", total, "UAH", `Купівля ${amount} акцій ${stock.name}`);
    saveData();
    updateUI();
    renderStocks();
}

function sellStock(id) {
    const user = getCurrentUser();
    const stock = stocks.find(s => s.id === id);
    const amount = parseFloat(document.getElementById(`stock-amount-${id}`).value);

    if (!stock || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);
    if ((user.stocks[id] || 0) < amount) return showToast(t("insufficientFunds"), true);

    const total = amount * stock.price;
    user.stocks[id] -= amount;
    user.balance += total;
    addTransaction(currentUser.username, "sell_stock", total, "UAH", `Продаж ${amount} акцій ${stock.name}`);
    saveData();
    updateUI();
    renderStocks();
}

// ==================== BUSINESS ====================
function updateSpecialTitles() {
    const user = getCurrentUser();
    if (!user) return;

    const elonSet = ["tesla", "spacex", "neuralink"];
    if (elonSet.every(id => user.businesses.includes(id)) && !user.specialTitles.includes("elon")) {
        user.specialTitles.push("elon");
    }
    if (user.businesses.includes("microsoft") && !user.specialTitles.includes("bezos")) {
        user.specialTitles.push("bezos");
    }

    saveData();
}

function renderBusiness() {
    let html = `<div class="page-title"><i class="fas fa-store"></i> ${t("navBusiness")}</div><div class="card-grid">`;

    businessesList.forEach(biz => {
        const owned = getCurrentUser().businesses.includes(biz.id);
        const costText = biz.cost ? `${formatMoney(biz.cost)} грн` : `${formatMoney(biz.costUsd)} USD`;

        html += `
            <div class="asset-card">
                <div class="card-header">
                    <div class="asset-thumb" style="display:flex;align-items:center;justify-content:center;font-size:24px;">
                        <i class="${biz.icon}"></i>
                    </div>
                    <div>
                        <h4>${biz.name}</h4>
                        <div class="asset-sub">${costText} | ${biz.incomePerMin} грн/хв</div>
                    </div>
                </div>

                ${
                    owned
                        ? `✅ ${t("owned")}`
                        : `<button onclick="${biz.cost ? `buyBusiness('${biz.id}')` : `buyBusinessUsd('${biz.id}')`}">${t("buyBtn")}</button>`
                }
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById("page-content").innerHTML = html;
}

window.buyBusiness = function(id) {
    const user = getCurrentUser();
    const biz = businessesList.find(x => x.id === id);
    if (!biz || user.businesses.includes(id)) return;
    if (user.balance < biz.cost) return showToast(t("insufficientFunds"), true);

    user.balance -= biz.cost;
    user.businesses.push(id);
    addTransaction(currentUser.username, "buy_business", biz.cost, "UAH", `Купівля бізнесу ${biz.name}`);
    saveData();
    updateSpecialTitles();
    updateUI();
    renderBusiness();
};

window.buyBusinessUsd = function(id) {
    const user = getCurrentUser();
    const biz = businessesList.find(x => x.id === id);
    if (!biz || user.businesses.includes(id)) return;
    if (user.usdBalance < biz.costUsd) return showToast(t("insufficientFunds"), true);

    user.usdBalance -= biz.costUsd;
    user.businesses.push(id);
    addTransaction(currentUser.username, "buy_business_usd", biz.costUsd, "USD", `Купівля бізнесу ${biz.name}`);
    saveData();
    updateSpecialTitles();
    updateUI();
    renderBusiness();
};

// ==================== REALTY ====================
function renderRealty() {
    let html = `<div class="page-title"><i class="fas fa-city"></i> ${t("navRealty")}</div><div class="card-grid">`;

    realtiesList.forEach(item => {
        const owned = getCurrentUser().realties.includes(item.id);
        const img = realtyImages[item.id] || fallbackAssetImage(item.name);

        html += `
            <div class="asset-card">
                <div class="card-header">
                    <img src="${img}" class="asset-thumb" alt="${item.name}" onerror="this.src='${fallbackAssetImage("RE")}'">
                    <div>
                        <h4>${item.name}</h4>
                        <div class="asset-sub">${formatMoney(item.cost)} грн | ${item.incomePerMin} грн/хв</div>
                    </div>
                </div>

                ${
                    owned
                        ? `✅ ${t("owned")}`
                        : `<button onclick="buyRealtyWithCvv('${item.id}')">${t("buyBtn")}</button>`
                }
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById("page-content").innerHTML = html;
}

window.buyRealtyWithCvv = function(id) {
    verifyCvv(success => success && buyRealty(id));
};

function buyRealty(id) {
    const user = getCurrentUser();
    const item = realtiesList.find(x => x.id === id);
    if (!item || user.realties.includes(id)) return;
    if (user.balance < item.cost) return showToast(t("insufficientFunds"), true);

    user.balance -= item.cost;
    user.realties.push(id);
    addTransaction(currentUser.username, "buy_realty", item.cost, "UAH", `Купівля нерухомості ${item.name}`);
    saveData();
    updateUI();
    renderRealty();
}

// ==================== CARS ====================
function renderCars() {
    let html = `<div class="page-title"><i class="fas fa-car"></i> ${t("navCars")}</div><div class="card-grid">`;

    carsList.forEach((car, index) => {
        const owned = getCurrentUser().cars.includes(index);
        const img = carImages[car.name] || fallbackAssetImage(car.name);

        html += `
            <div class="asset-card">
                <div class="card-header">
                    <img src="${img}" class="asset-thumb" alt="${car.name}" onerror="this.src='${fallbackAssetImage("CA")}'">
                    <div>
                        <h4>${car.name}</h4>
                        <div class="asset-sub">${formatMoney(car.priceUsd)} USD</div>
                    </div>
                </div>

                ${
                    owned
                        ? `✅ ${t("owned")}`
                        : `<button onclick="buyCar(${index})">${t("buyBtn")}</button>`
                }
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById("page-content").innerHTML = html;
}

window.buyCar = function(index) {
    verifyCvv(success => {
        if (!success) return;

        const user = getCurrentUser();
        const car = carsList[index];
        if (!car || user.cars.includes(index)) return;
        if (user.usdBalance < car.priceUsd) return showToast(t("insufficientFunds"), true);

        user.usdBalance -= car.priceUsd;
        user.cars.push(index);
        addTransaction(currentUser.username, "buy_car", car.priceUsd, "USD", `Купівля авто ${car.name}`);
        saveData();
        updateUI();
        renderCars();
    });
};

// ==================== CLASSES ====================
function renderClasses() {
    let html = `<div class="page-title"><i class="fas fa-star"></i> ${t("navClasses")}</div>`;

    Object.entries(statuses).forEach(([key, value]) => {
        if (key === "admin") return;
        html += `
            <div class="class-card">
                <h4>${value.icon} ${key.toUpperCase()}</h4>
                <div class="asset-sub">${formatMoney(value.price)} грн</div>
                <p>${value.desc[currentLang]}</p>
                <p>+${value.clickReward} грн / click</p>
                <p>${value.onlineIncome} грн / min</p>
            </div>
        `;
    });

    document.getElementById("page-content").innerHTML = html;
}

// ==================== TRANSFERS ====================
function renderTransfer() {
    document.getElementById("page-content").innerHTML = `
        <div class="page-title"><i class="fas fa-exchange-alt"></i> ${t("navTransfer")}</div>

        <div class="transfer-section">
            <h3>💴 ${t("transferTitleUah")}</h3>
            <div class="transfer-grid">
                <input id="transfer-to" placeholder="${t("recipient")}">
                <input id="transfer-amount" type="number" placeholder="${t("amount")}">
                <button id="transfer-grn-btn" class="btn-primary">${t("transferTitleUah")}</button>
            </div>
        </div>

        <div class="transfer-section">
            <h3>💵 ${t("transferTitleUsd")}</h3>
            <div class="transfer-grid">
                <input id="transfer-usd-to" placeholder="${t("recipient")}">
                <input id="transfer-usd-amount" type="number" placeholder="${t("amountUsd")}">
                <button id="transfer-usd-btn" class="btn-primary">${t("transferTitleUsd")}</button>
            </div>
        </div>

        <div class="transfer-section">
            <h3>🪙 ${t("transferTitleCrypto")}</h3>
            <div class="transfer-grid">
                <input id="crypto-to" placeholder="${t("cryptoRecipient")}">
                <input id="crypto-symbol" placeholder="${t("symbolPlaceholder")}">
                <input id="crypto-amount" type="number" placeholder="${t("cryptoAmount")}">
                <button id="transfer-crypto-btn" class="btn-primary">${t("transferTitleCrypto")}</button>
            </div>
        </div>
    `;

    document.getElementById("transfer-grn-btn").addEventListener("click", () => {
        verifyCvv(success => success && transferGrn());
    });

    document.getElementById("transfer-usd-btn").addEventListener("click", () => {
        verifyCvv(success => success && transferUsd());
    });

    document.getElementById("transfer-crypto-btn").addEventListener("click", () => {
        verifyCvv(success => success && transferCrypto());
    });
}

function transferGrn() {
    const from = getCurrentUser();
    const toName = sanitize(document.getElementById("transfer-to").value);
    const amount = parseFloat(document.getElementById("transfer-amount").value);

    if (!users[toName] || toName === currentUser.username || users[toName].isBanned) {
        return showToast(t("invalidUser"), true);
    }
    if (isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);

    const fee = amount * 0.05;
    const total = amount + fee;
    if (from.balance < total) return showToast(t("insufficientFunds"), true);

    from.balance -= total;
    users[toName].balance += amount;
    commissionBank += fee;

    addTransaction(currentUser.username, "transfer_uah_out", amount, "UAH", `Переказ ${amount} грн користувачу ${toName}`);
    addTransaction(toName, "transfer_uah_in", amount, "UAH", `Отримано ${amount} грн від ${currentUser.username}`);
    saveData();
    updateUI();
    showToast(t("transferSuccess"));
}

function transferUsd() {
    const from = getCurrentUser();
    const toName = sanitize(document.getElementById("transfer-usd-to").value);
    const amount = parseFloat(document.getElementById("transfer-usd-amount").value);

    if (!users[toName] || toName === currentUser.username || users[toName].isBanned) {
        return showToast(t("invalidUser"), true);
    }
    if (isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);

    const fee = amount * 0.05;
    const total = amount + fee;
    if (from.usdBalance < total) return showToast(t("insufficientFunds"), true);

    from.usdBalance -= total;
    users[toName].usdBalance += amount;
    commissionBank += fee * usdRate;

    addTransaction(currentUser.username, "transfer_usd_out", amount, "USD", `Переказ ${amount} USD користувачу ${toName}`);
    addTransaction(toName, "transfer_usd_in", amount, "USD", `Отримано ${amount} USD від ${currentUser.username}`);
    saveData();
    updateUI();
    showToast(t("transferSuccess"));
}

function transferCrypto() {
    const from = getCurrentUser();
    const toName = sanitize(document.getElementById("crypto-to").value);
    const sym = sanitize(document.getElementById("crypto-symbol").value).toUpperCase();
    const amount = parseFloat(document.getElementById("crypto-amount").value);

    if (!users[toName] || toName === currentUser.username || users[toName].isBanned) {
        return showToast(t("invalidUser"), true);
    }
    if (!sym || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);

    const fee = amount * 0.01;
    const total = amount + fee;
    if ((from.crypto[sym] || 0) < total) return showToast(t("notEnoughCrypto"), true);

    from.crypto[sym] -= total;
    users[toName].crypto[sym] = (users[toName].crypto[sym] || 0) + amount;
    commissionBank += fee * (cryptoPrices[sym]?.price || 0);

    addTransaction(currentUser.username, "transfer_crypto_out", amount, sym, `Переказ ${amount} ${sym} користувачу ${toName}`);
    addTransaction(toName, "transfer_crypto_in", amount, sym, `Отримано ${amount} ${sym} від ${currentUser.username}`);
    saveData();
    updateUI();
    showToast(t("transferSuccess"));
}

// ==================== HISTORY ====================
function renderHistory() {
    const history = getCurrentUser().transactions || [];

    if (!history.length) {
        document.getElementById("page-content").innerHTML = `
            <div class="page-title"><i class="fas fa-clock-rotate-left"></i> ${t("navHistory")}</div>
            <div class="history-card">${t("history")}: 0</div>
        `;
        return;
    }

    const html = history.map(item => `
        <div class="history-item">
            <div class="history-top">
                <strong>${item.type}</strong>
                <span>${new Date(item.timestamp).toLocaleString()}</span>
            </div>
            <div>${formatMoney(item.amount)} ${item.currency}</div>
            <div class="section-note">${item.details}</div>
        </div>
    `).join("");

    document.getElementById("page-content").innerHTML = `
        <div class="page-title"><i class="fas fa-clock-rotate-left"></i> ${t("navHistory")}</div>
        <div class="history-list">${html}</div>
    `;
}

// ==================== DONATE ====================
function renderDonate() {
    document.getElementById("page-content").innerHTML = `
        <div class="page-title"><i class="fas fa-hand-holding-heart"></i> ${t("navDonate")}</div>
        <div class="panel-card">
            <p>${t("supportBank")}: <strong>${formatMoney(supportBank)} грн</strong></p>
            <input type="number" id="donate-amount" placeholder="${t("donateAmount")}">
            <div class="button-group">
                <button id="donate-btn" class="btn-primary">${t("donateToSupport")}</button>
            </div>
        </div>
    `;

    document.getElementById("donate-btn").addEventListener("click", () => {
        verifyCvv(success => {
            if (!success) return;

            const amount = parseFloat(document.getElementById("donate-amount").value);
            const user = getCurrentUser();

            if (isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);
            if (user.balance < amount) return showToast(t("insufficientFunds"), true);

            user.balance -= amount;
            supportBank += amount;
            addTransaction(currentUser.username, "donate", amount, "UAH", "Донат у банку підтримки");
            saveData();
            updateUI();
            renderDonate();
            showToast(t("thankYou"));
        });
    });
}

// ==================== TOP ====================
function renderTop() {
    const ranking = Object.entries(users)
        .map(([username, user]) => ({
            username,
            capital: getUserCapitalUsd(user),
            status: user.status
        }))
        .sort((a, b) => b.capital - a.capital)
        .slice(0, 100);

    const html = ranking.map((item, idx) => `
        <div class="top-item">
            <div class="rank-badge">#${idx + 1}</div>
            <div>
                <strong>${item.username}</strong>
                <div class="section-note">${statuses[item.status].icon} ${item.status.toUpperCase()}</div>
            </div>
            <div><strong>${formatMoney(item.capital)} USD</strong></div>
        </div>
    `).join("");

    document.getElementById("page-content").innerHTML = `
        <div class="page-title"><i class="fas fa-trophy"></i> ${t("topTitle")}</div>
        <div class="top-list">${html}</div>
    `;
}

// ==================== VIP ====================
function vipGiveaway() {
    const user = getCurrentUser();
    if (!["vip", "businessman", "manager", "admin"].includes(user.status)) {
        return showToast("VIP only", true);
    }

    const today = todayKey();
    if (user.vipGiveawayDate === today) {
        return showToast(t("vipDailyLimit"), true);
    }

    const amount = parseFloat(prompt("Сума (max 100000):") || "");
    if (isNaN(amount) || amount <= 0 || amount > 100000) return;

    const target = sanitize(prompt("Кому видати? (логін)") || "");
    if (!users[target] || users[target].isBanned) return showToast(t("invalidUser"), true);
    if (user.balance < amount) return showToast(t("insufficientFunds"), true);

    user.balance -= amount;
    users[target].balance += amount;
    user.vipGiveawayDate = today;

    addTransaction(currentUser.username, "vip_giveaway_out", amount, "UAH", `VIP-роздача користувачу ${target}`);
    addTransaction(target, "vip_giveaway_in", amount, "UAH", `Отримано VIP-роздачу від ${currentUser.username}`);
    saveData();
    updateUI();
    showToast(t("vipGiveawaySuccess", { amount, user: target }));
}

// ==================== ADMIN ====================
function renderAdminPanel() {
    const user = getCurrentUser();
    if (!user.isAdmin) return showToast(t("adminsOnly"), true);

    const userOptions = Object.keys(users).map(name => `<option value="${name}">${name}</option>`).join("");
    const businessOptions = businessesList.map(b => `<option value="${b.id}">${b.name}</option>`).join("");
    const realtyOptions = realtiesList.map(r => `<option value="${r.id}">${r.name}</option>`).join("");
    const carOptions = carsList.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
    const statusOptions = Object.keys(statuses).map(s => `<option value="${s}">${s}</option>`).join("");

    const onlineCount = Object.keys(users).filter(name => !users[name].isBanned && isOnline(name)).length;
    const totalCapital = Object.values(users).reduce((sum, u) => sum + getUserCapitalUsd(u), 0);

    document.getElementById("page-content").innerHTML = `
        <div class="page-title"><i class="fas fa-crown"></i> ${t("adminPanel")}</div>

        <div class="admin-grid">
            <div class="admin-card">
                <h4>${t("adminMassTitle")}</h4>
                <div class="button-group">
                    <button id="mass-online-money-btn">${t("adminGiveAllOnlineMoney")}</button>
                    <button id="mass-online-crypto-btn">${t("adminGiveAllOnlineCrypto")}</button>
                </div>
                <div class="button-group" style="margin-top:12px;">
                    <button id="take-commission-btn">${t("adminTakeCommission")} (${formatMoney(commissionBank)} грн)</button>
                    <button id="take-support-btn">${t("adminTakeSupport")} (${formatMoney(supportBank)} грн)</button>
                </div>
            </div>

            <div class="admin-card">
                <h4>${t("adminMessage")}</h4>
                <textarea id="global-message-input" placeholder="..."></textarea>
                <div class="button-group">
                    <button id="send-message-online-btn">${t("adminBroadcast")}</button>
                    <button id="clear-message-btn">Clear</button>
                </div>
            </div>

            <div class="admin-card">
                <h4>User actions</h4>
                <select id="admin-user">${userOptions}</select>
                <input type="number" id="admin-amount" placeholder="${t("amount")}">
                <select id="admin-status">${statusOptions}</select>
                <select id="admin-business">${businessOptions}</select>
                <select id="admin-realty">${realtyOptions}</select>
                <select id="admin-car">${carOptions}</select>

                <div class="button-group">
                    <button id="admin-give-money">+ Money</button>
                    <button id="admin-take-money">- Money</button>
                    <button id="admin-set-balance">Set balance</button>
                    <button id="admin-give-status">Set status</button>
                    <button id="admin-give-business">Give business</button>
                    <button id="admin-give-realty">Give realty</button>
                    <button id="admin-give-car">Give car</button>
                    <button id="admin-ban">Ban</button>
                    <button id="admin-unban">Unban</button>
                    <button id="admin-reset">Reset</button>
                    <button id="admin-delete">Delete</button>
                </div>
            </div>

            <div class="admin-card">
                <h4>${t("adminAnalytics")}</h4>
                <p>${t("totalUsers")}: <strong>${Object.keys(users).length}</strong></p>
                <p>${t("onlineUsers")}: <strong>${onlineCount}</strong></p>
                <p>${t("totalCapital")}: <strong>${formatMoney(totalCapital)} USD</strong></p>
                <div class="button-group">
                    <button id="refresh-admin-btn">${t("refresh")}</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("mass-online-money-btn").addEventListener("click", giveMoneyToAllOnlinePrompt);
    document.getElementById("mass-online-crypto-btn").addEventListener("click", giveCryptoToAllOnlinePrompt);
    document.getElementById("take-commission-btn").addEventListener("click", collectCommissionBank);
    document.getElementById("take-support-btn").addEventListener("click", collectSupportBank);
    document.getElementById("send-message-online-btn").addEventListener("click", sendGlobalMessage);
    document.getElementById("clear-message-btn").addEventListener("click", clearGlobalMessage);
    document.getElementById("refresh-admin-btn").addEventListener("click", renderAdminPanel);

    document.getElementById("admin-give-money").addEventListener("click", adminGiveMoney);
    document.getElementById("admin-take-money").addEventListener("click", adminTakeMoney);
    document.getElementById("admin-set-balance").addEventListener("click", adminSetBalance);
    document.getElementById("admin-give-status").addEventListener("click", adminSetStatus);
    document.getElementById("admin-give-business").addEventListener("click", adminGiveBusiness);
    document.getElementById("admin-give-realty").addEventListener("click", adminGiveRealty);
    document.getElementById("admin-give-car").addEventListener("click", adminGiveCar);
    document.getElementById("admin-ban").addEventListener("click", adminBanUser);
    document.getElementById("admin-unban").addEventListener("click", adminUnbanUser);
    document.getElementById("admin-reset").addEventListener("click", adminResetUser);
    document.getElementById("admin-delete").addEventListener("click", adminDeleteUser);
}

function getAdminUser() {
    return sanitize(document.getElementById("admin-user").value);
}

function getAdminAmount() {
    return parseFloat(document.getElementById("admin-amount").value);
}

function adminGiveMoney() {
    const username = getAdminUser();
    const amount = getAdminAmount();
    if (!users[username] || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);
    users[username].balance += amount;
    addTransaction(username, "admin_give_money", amount, "UAH", `Адмін видав гроші`);
    saveData();
    updateUI();
    renderAdminPanel();
}

function adminTakeMoney() {
    const username = getAdminUser();
    const amount = getAdminAmount();
    if (!users[username] || isNaN(amount) || amount <= 0) return showToast(t("invalidData"), true);
    users[username].balance = Math.max(0, users[username].balance - amount);
    addTransaction(username, "admin_take_money", amount, "UAH", `Адмін забрав гроші`);
    saveData();
    updateUI();
    renderAdminPanel();
}

function adminSetBalance() {
    const username = getAdminUser();
    const amount = getAdminAmount();
    if (!users[username] || isNaN(amount) || amount < 0) return showToast(t("invalidData"), true);
    users[username].balance = amount;
    addTransaction(username, "admin_set_balance", amount, "UAH", `Адмін встановив баланс`);
    saveData();
    updateUI();
    renderAdminPanel();
}

function adminSetStatus() {
    const username = getAdminUser();
    const status = document.getElementById("admin-status").value;
    if (!users[username] || !statuses[status]) return showToast(t("invalidData"), true);
    users[username].status = status;
    if (status === "admin") users[username].isAdmin = true;
    saveData();
    renderAdminPanel();
}

function adminGiveBusiness() {
    const username = getAdminUser();
    const businessId = document.getElementById("admin-business").value;
    if (!users[username]) return;
    if (!users[username].businesses.includes(businessId)) users[username].businesses.push(businessId);
    saveData();
    renderAdminPanel();
}

function adminGiveRealty() {
    const username = getAdminUser();
    const realtyId = document.getElementById("admin-realty").value;
    if (!users[username]) return;
    if (!users[username].realties.includes(realtyId)) users[username].realties.push(realtyId);
    saveData();
    renderAdminPanel();
}

function adminGiveCar() {
    const username = getAdminUser();
    const carIndex = Number(document.getElementById("admin-car").value);
    if (!users[username]) return;
    if (!users[username].cars.includes(carIndex)) users[username].cars.push(carIndex);
    saveData();
    renderAdminPanel();
}

function adminBanUser() {
    const username = getAdminUser();
    if (!users[username] || username === "creator") return;
    users[username].isBanned = true;
    saveData();
    renderAdminPanel();
}

function adminUnbanUser() {
    const username = getAdminUser();
    if (!users[username]) return;
    users[username].isBanned = false;
    saveData();
    renderAdminPanel();
}

function adminResetUser() {
    const username = getAdminUser();
    if (!users[username] || username === "creator") return;
    const password = users[username].password;
    users[username] = createDefaultUser(password, false);
    saveData();
    renderAdminPanel();
}

function adminDeleteUser() {
    const username = getAdminUser();
    if (!users[username] || username === "creator") return;
    delete users[username];
    saveData();
    renderAdminPanel();
}

function collectCommissionBank() {
    const user = getCurrentUser();
    user.balance += commissionBank;
    commissionBank = 0;
    saveData();
    updateUI();
    renderAdminPanel();
}

function collectSupportBank() {
    const user = getCurrentUser();
    user.balance += supportBank;
    supportBank = 0;
    saveData();
    updateUI();
    renderAdminPanel();
}

function sendGlobalMessage() {
    const text = sanitize(document.getElementById("global-message-input").value);
    if (!text) return showToast(t("invalidData"), true);
    globalMessage = {
        text,
        from: currentUser.username,
        time: Date.now()
    };
    saveData();
    showGlobalMessage();
    showToast("Sent");
}

function clearGlobalMessage() {
    globalMessage = null;
    saveData();
    showGlobalMessage();
    showToast("Cleared");
}

function giveMoneyToAllOnlinePrompt() {
    const amount = parseFloat(prompt(t("enterAmountForAllOnline")) || "");
    if (isNaN(amount) || amount <= 0) return;

    let count = 0;
    Object.keys(users).forEach(username => {
        if (!users[username].isBanned && isOnline(username)) {
            users[username].balance += amount;
            addTransaction(username, "admin_mass_money", amount, "UAH", `Масова видача від ${currentUser.username}`);
            count++;
        }
    });

    saveData();
    updateUI();
    renderAdminPanel();
    showToast(`${t("massRewardSuccess")}: ${count}`);
}

function giveCryptoToAllOnlinePrompt() {
    const sym = sanitize(prompt(t("enterCryptoSymbol")) || "").toUpperCase();
    const amount = parseFloat(prompt(t("enterCryptoAmount")) || "");

    if (!sym || isNaN(amount) || amount <= 0) return;

    let count = 0;
    Object.keys(users).forEach(username => {
        if (!users[username].isBanned && isOnline(username)) {
            users[username].crypto[sym] = (users[username].crypto[sym] || 0) + amount;
            addTransaction(username, "admin_mass_crypto", amount, sym, `Масова видача крипти від ${currentUser.username}`);
            count++;
        }
    });

    saveData();
    renderAdminPanel();
    showToast(`${t("cryptoMassRewardSuccess")}: ${count}`);
}

// ==================== PASSIVE / CLICKER ====================
function handleClickReward() {
    const user = getCurrentUser();
    if (!user) return;

    const reward = Math.floor(statuses[user.status].clickReward * (boostExpiry > Date.now() ? boostMultiplier : 1));
    user.balance += reward;
    saveData();
    updateUI();
    showToast(`+${reward} грн`);
}

function passiveIncomeTick() {
    if (!currentUser) return;
    const user = getCurrentUser();
    if (user.isBanned) return;

    const income = getTotalPassiveIncome(user);
    if (income <= 0) return;

    user.balance += income;
    addTransaction(currentUser.username, "passive_income", income, "UAH", "Пасивний дохід");
    saveData();
    updateUI();

    const active = document.querySelector(".sidebar-nav button.active-page")?.getAttribute("data-page");
    if (active === "dashboard") renderDashboard();
}

// ==================== EVENTS ====================
function bindBaseEvents() {
    document.getElementById("login-btn").addEventListener("click", loginUser);
    document.getElementById("register-btn").addEventListener("click", registerUser);
    document.getElementById("logout-btn").addEventListener("click", logoutUser);

    document.getElementById("change-pin-btn").addEventListener("click", changePin);
    document.getElementById("change-card-name-btn").addEventListener("click", changeCardName);
    document.getElementById("change-card-color-btn").addEventListener("click", openColorModal);
    document.getElementById("vip-giveaway-btn").addEventListener("click", vipGiveaway);

    document.getElementById("lang-toggle-btn").addEventListener("click", () => {
        currentLang = currentLang === "uk" ? "en" : "uk";
        saveData();
        updateStaticTexts();
        updateUI();
        const active = document.querySelector(".sidebar-nav button.active-page")?.getAttribute("data-page") || "dashboard";
        navigate(active);
        showToast(t("languageSwitched"));
    });

    document.getElementById("click-button").addEventListener("click", handleClickReward);

    document.querySelectorAll(".sidebar-nav button[data-page]").forEach(btn => {
        btn.addEventListener("click", () => navigate(btn.getAttribute("data-page")));
    });

    document.getElementById("admin-panel-btn").addEventListener("click", () => navigate("admin"));

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tab = btn.getAttribute("data-tab");
            document.getElementById("login-form").classList.toggle("active", tab === "login");
            document.getElementById("register-form").classList.toggle("active", tab === "register");
        });
    });

    document.querySelectorAll(".color-option").forEach(option => {
        option.addEventListener("click", () => setCardColor(option.getAttribute("data-color")));
    });

    document.getElementById("color-modal-close").addEventListener("click", closeColorModal);

    document.getElementById("color-modal").addEventListener("click", (e) => {
        if (e.target.id === "color-modal") closeColorModal();
    });

    document.getElementById("menu-toggle").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
    });
}

// ==================== INIT ====================
function init() {
    loadData();
    initStocks();
    updateStaticTexts();
    bindBaseEvents();
    fetchUsdRate();
    fetchCryptoPrices();

    setInterval(updateLastSeen, 30000);
    setInterval(fetchUsdRate, 60000);
    setInterval(fetchCryptoPrices, 60000);
    setInterval(fluctuateStocks, 30000);
    setInterval(passiveIncomeTick, 60000);
}

document.addEventListener("DOMContentLoaded", init);
