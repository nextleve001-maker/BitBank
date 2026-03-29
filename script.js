// ==================== Ініціалізація ====================
let currentUser = null;
let users = {};
let cryptoPrices = {};
let stocks = [];
let commissionBank = 0;
let supportBank = 0;
let boostMultiplier = 1;
let boostExpiry = 0;
let usdRate = 38;
let soundEnabled = true;
let currentLang = 'uk';
let globalMessage = null;

// Переклад
const translations = {
    uk: {
        balanceLabel: "Баланс",
        clickButton: "КЛІК",
        buy: "Купити",
        sell: "Продати",
        confirm: "Підтвердити",
        cancel: "Скасувати",
        subtitle: "симулятор фінансової гри",
        loginTab: "Вхід",
        registerTab: "Реєстрація",
        loginBtn: "Увійти",
        registerBtn: "Створити",
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
        sellBtn: "Продати",
        transferGrn: "Переказ гривень (комісія 5%)",
        transferUsd: "Переказ USD (комісія 5%)",
        transferCrypto: "Переказ крипти (комісія 1%)",
        recipient: "Отримувач",
        amount: "Сума",
        amountUsd: "Сума USD",
        cryptoRecipient: "Отримувач",
        cryptoAmount: "Кількість",
        donateToSupport: "Підтримати",
        upgradeStatus: "Підвищити статус",
        topTitle: "Топ 100 гравців (капітал у USD)",
        statistics: "Статистика",
        passiveIncome: "Пасивний дохід/хв",
        clickReward: "Клік",
        convertUsd: "Конвертація USD",
        buyUsd: "Купити USD",
        sellUsd: "Продати USD",
        achievements: "Досягнення",
        noHistory: "Поки що немає операцій.",
        supportBank: "Банка підтримки",
        donateAmount: "Сума донату",
        thankYou: "Дякуємо!",
        pinChanged: "PIN-код змінено",
        invalidPin: "Невірний CVV-код!",
        insufficientFunds: "Недостатньо коштів",
        vipDailyLimit: "Ви вже використали ліміт роздачі на сьогодні (100,000 грн)",
        vipGiveawaySuccess: "Видано {amount} грн користувачу {user}",
        status: "Статус",
        titles: "Титули",
        none: "немає",
        history: "Історія операцій"
    },
    en: {
        balanceLabel: "Balance",
        clickButton: "CLICK",
        buy: "Buy",
        sell: "Sell",
        confirm: "Confirm",
        cancel: "Cancel",
        subtitle: "financial game simulator",
        loginTab: "Login",
        registerTab: "Register",
        loginBtn: "Login",
        registerBtn: "Register",
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
        changePin: "Change CVV",
        changeCardName: "Card Name",
        changeCardColor: "Card Color",
        vipGiveaway: "VIP Giveaway",
        chooseCardColor: "Choose card color",
        owned: "Owned",
        buyBtn: "Buy",
        sellBtn: "Sell",
        transferGrn: "Transfer UAH (5% fee)",
        transferUsd: "Transfer USD (5% fee)",
        transferCrypto: "Transfer Crypto (1% fee)",
        recipient: "Recipient",
        amount: "Amount",
        amountUsd: "Amount USD",
        cryptoRecipient: "Recipient",
        cryptoAmount: "Amount",
        donateToSupport: "Donate",
        upgradeStatus: "Upgrade Status",
        topTitle: "Top 100 players (capital in USD)",
        statistics: "Statistics",
        passiveIncome: "Passive income/min",
        clickReward: "Click",
        convertUsd: "USD Conversion",
        buyUsd: "Buy USD",
        sellUsd: "Sell USD",
        achievements: "Achievements",
        noHistory: "No transactions yet.",
        supportBank: "Support Fund",
        donateAmount: "Donation amount",
        thankYou: "Thank you!",
        pinChanged: "CVV changed",
        invalidPin: "Invalid CVV!",
        insufficientFunds: "Insufficient funds",
        vipDailyLimit: "You have already used today's giveaway limit (100,000 UAH)",
        vipGiveawaySuccess: "Given {amount} UAH to user {user}",
        status: "Status",
        titles: "Titles",
        none: "none",
        history: "Transaction History"
    }
};

function t(key, params = {}) {
    let text = translations[currentLang][key] || key;
    for (let p in params) {
        text = text.replace(`{${p}}`, params[p]);
    }
    return text;
}

function updateStaticTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

// Статуси
const statuses = {
    none: { price: 0, clickReward: 5, onlineIncome: 0, offlineIncome: 0, icon: '👤', desc: { uk: 'Початківець. Без особливих переваг.', en: 'Beginner. No special benefits.' } },
    basic: { price: 500, clickReward: 15, onlineIncome: 10, offlineIncome: 5, icon: '⭐', desc: { uk: 'Базовий статус. Невеликий бонус до кліків і пасивний дохід.', en: 'Basic status. Small bonus to clicks and passive income.' } },
    medium: { price: 2500, clickReward: 50, onlineIncome: 40, offlineIncome: 20, icon: '💎', desc: { uk: 'Середній клас. Помітне зростання доходу.', en: 'Middle class. Significant income growth.' } },
    vip: { price: 10000, clickReward: 200, onlineIncome: 150, offlineIncome: 80, icon: '👑', desc: { uk: 'VIP-клієнт. Золота картка, високий дохід.', en: 'VIP client. Gold card, high income.' } },
    businessman: { price: 50000, clickReward: 1000, onlineIncome: 600, offlineIncome: 300, icon: '🏢', desc: { uk: 'Бізнесмен. Можливість купувати великі активи.', en: 'Businessman. Ability to buy large assets.' } },
    manager: { price: 200000, clickReward: 10000, onlineIncome: 4000, offlineIncome: 2000, icon: '📊', desc: { uk: 'Топ-менеджер. Максимальні привілеї.', en: 'Top manager. Maximum privileges.' } },
    admin: { price: 0, clickReward: 50000, onlineIncome: 20000, offlineIncome: 10000, icon: '🛡️', desc: { uk: 'Адміністратор системи. Усі можливості.', en: 'System administrator. All features.' } }
};

// Бізнеси (38)
const businessesList = [
    { id: 'kiosk', name: 'Кіоск', cost: 1000, incomePerMin: 5, icon: 'fas fa-store' },
    { id: 'cafe', name: 'Кав’ярня', cost: 5000, incomePerMin: 30, icon: 'fas fa-mug-hot' },
    { id: 'shop', name: 'Магазин', cost: 20000, incomePerMin: 150, icon: 'fas fa-shopping-cart' },
    { id: 'itstudio', name: 'IT студія', cost: 100000, incomePerMin: 800, icon: 'fas fa-laptop-code' },
    { id: 'cryptofarm', name: 'Криптоферма', cost: 500000, incomePerMin: 4000, icon: 'fas fa-microchip' },
    { id: 'restaurant', name: 'Ресторан', cost: 150000, incomePerMin: 1200, icon: 'fas fa-utensils' },
    { id: 'gym', name: 'Фітнес-клуб', cost: 80000, incomePerMin: 500, icon: 'fas fa-dumbbell' },
    { id: 'hotel', name: 'Готель', cost: 300000, incomePerMin: 2500, icon: 'fas fa-hotel' },
    { id: 'factory', name: 'Фабрика', cost: 1000000, incomePerMin: 8000, icon: 'fas fa-industry' },
    { id: 'airline', name: 'Авіакомпанія', cost: 5000000, incomePerMin: 40000, icon: 'fas fa-plane' },
    { id: 'football', name: 'Футбольний клуб', cost: 2000000, incomePerMin: 15000, icon: 'fas fa-futbol' },
    { id: 'movie', name: 'Кіностудія', cost: 3000000, incomePerMin: 20000, icon: 'fas fa-film' },
    { id: 'mining', name: 'Майнінг ферма', cost: 8000000, incomePerMin: 60000, icon: 'fas fa-bolt' },
    { id: 'tesla', name: 'Tesla', costUsd: 500000000, incomePerMin: 1000000, icon: 'fab fa-tesla' },
    { id: 'spacex', name: 'SpaceX', costUsd: 1000000000, incomePerMin: 2000000, icon: 'fas fa-rocket' },
    { id: 'neuralink', name: 'Neuralink', costUsd: 50000000, incomePerMin: 100000, icon: 'fas fa-brain' },
    { id: 'boring', name: 'The Boring Company', costUsd: 30000000, incomePerMin: 80000, icon: 'fas fa-tunnel' },
    { id: 'x', name: 'X (Twitter)', costUsd: 44000000000, incomePerMin: 5000000, icon: 'fab fa-twitter' },
    { id: 'microsoft', name: 'Microsoft', costUsd: 100000000, incomePerMin: 500000, icon: 'fab fa-microsoft' },
    { id: 'brewery', name: 'Пивоварня', cost: 500000, incomePerMin: 2000, icon: 'fas fa-beer' },
    { id: 'winery', name: 'Виноградник', cost: 800000, incomePerMin: 3500, icon: 'fas fa-wine-bottle' },
    { id: 'bakery', name: 'Пекарня', cost: 30000, incomePerMin: 200, icon: 'fas fa-bread-slice' },
    { id: 'flower', name: 'Квітковий магазин', cost: 20000, incomePerMin: 120, icon: 'fas fa-seedling' },
    { id: 'bookstore', name: 'Книгарня', cost: 15000, incomePerMin: 80, icon: 'fas fa-book' },
    { id: 'pharmacy', name: 'Аптека', cost: 100000, incomePerMin: 600, icon: 'fas fa-capsules' },
    { id: 'dentist', name: 'Стоматологія', cost: 200000, incomePerMin: 1200, icon: 'fas fa-tooth' },
    { id: 'veterinary', name: 'Ветеринарна клініка', cost: 80000, incomePerMin: 450, icon: 'fas fa-paw' },
    { id: 'carwash', name: 'Автомийка', cost: 50000, incomePerMin: 300, icon: 'fas fa-car' },
    { id: 'autoservice', name: 'Автосервіс', cost: 150000, incomePerMin: 900, icon: 'fas fa-wrench' },
    { id: 'gasstation', name: 'АЗС', cost: 300000, incomePerMin: 1800, icon: 'fas fa-gas-pump' },
    { id: 'hotel2', name: 'Бутик-готель', cost: 500000, incomePerMin: 3000, icon: 'fas fa-hotel' },
    { id: 'spa', name: 'SPA-салон', cost: 200000, incomePerMin: 1300, icon: 'fas fa-spa' },
    { id: 'fitness', name: 'Фітнес-студія', cost: 100000, incomePerMin: 700, icon: 'fas fa-running' },
    { id: 'dance', name: 'Школа танців', cost: 40000, incomePerMin: 250, icon: 'fas fa-music' },
    { id: 'music', name: 'Музична школа', cost: 30000, incomePerMin: 180, icon: 'fas fa-guitar' },
    { id: 'art', name: 'Художня студія', cost: 25000, incomePerMin: 150, icon: 'fas fa-palette' },
    { id: 'photo', name: 'Фотостудія', cost: 60000, incomePerMin: 350, icon: 'fas fa-camera' }
];

// Нерухомість (острови + 10 будинків)
const realtiesList = [
    { id: 'palm', name: '🌴 Пальмовий острів', cost: 25000, incomePerMin: 60, icon: 'fas fa-palm-tree' },
    { id: 'volcano', name: '🌋 Вулканічний острів', cost: 45000, incomePerMin: 120, icon: 'fas fa-volcano' },
    { id: 'paradise', name: '🏝️ Райський острів', cost: 80000, incomePerMin: 200, icon: 'fas fa-umbrella-beach' },
    { id: 'treasure', name: '💰 Острів скарбів', cost: 120000, incomePerMin: 320, icon: 'fas fa-gem' },
    { id: 'exotic', name: '🐒 Екзотичний острів', cost: 180000, incomePerMin: 500, icon: 'fas fa-monkey' },
    { id: 'dinosaur', name: '🦖 Острів динозаврів', cost: 250000, incomePerMin: 700, icon: 'fas fa-dragon' },
    { id: 'whitebeach', name: '🏖️ Білий пляж', cost: 35000, incomePerMin: 90, icon: 'fas fa-water' },
    { id: 'lagoon', name: '💙 Блакитна лагуна', cost: 60000, incomePerMin: 150, icon: 'fas fa-swimmer' },
    { id: 'wind', name: '🌬️ Острів вітрів', cost: 90000, incomePerMin: 240, icon: 'fas fa-wind' },
    { id: 'coral', name: '🐠 Кораловий риф', cost: 150000, incomePerMin: 400, icon: 'fas fa-fish' },
    { id: 'pirates', name: '🏴‍☠️ Острів піратів', cost: 200000, incomePerMin: 550, icon: 'fas fa-skull-crossbones' },
    { id: 'dragons', name: '🐉 Острів драконів', cost: 300000, incomePerMin: 900, icon: 'fas fa-dragon' },
    { id: 'mystery', name: '🔮 Таємничий острів', cost: 400000, incomePerMin: 1200, icon: 'fas fa-magic' },
    { id: 'bliss', name: '😌 Острів блаженства', cost: 500000, incomePerMin: 1600, icon: 'fas fa-smile' },
    { id: 'gold', name: '✨ Острів золота', cost: 750000, incomePerMin: 2400, icon: 'fas fa-coins' },
    { id: 'monkey', name: '🐵 Острів мавп', cost: 85000, incomePerMin: 220, icon: 'fas fa-monkey' },
    { id: 'orchid', name: '🌸 Острів орхідей', cost: 110000, incomePerMin: 300, icon: 'fas fa-seedling' },
    { id: 'sun', name: '☀️ Острів сонця', cost: 140000, incomePerMin: 380, icon: 'fas fa-sun' },
    { id: 'moon', name: '🌙 Острів місяця', cost: 170000, incomePerMin: 470, icon: 'fas fa-moon' },
    { id: 'stars', name: '⭐ Острів зірок', cost: 220000, incomePerMin: 620, icon: 'fas fa-star' },
    { id: 'whale', name: '🐋 Китова бухта', cost: 280000, incomePerMin: 800, icon: 'fas fa-water' },
    { id: 'turtle', name: '🐢 Черепаший острів', cost: 320000, incomePerMin: 950, icon: 'fas fa-turtle' },
    { id: 'rainbow', name: '🌈 Веселковий острів', cost: 380000, incomePerMin: 1100, icon: 'fas fa-rainbow' },
    { id: 'crystal', name: '🔮 Кришталевий острів', cost: 450000, incomePerMin: 1350, icon: 'fas fa-gem' },
    { id: 'emerald', name: '💚 Смарагдовий острів', cost: 550000, incomePerMin: 1700, icon: 'fas fa-leaf' },
    { id: 'sapphire', name: '💙 Сапфіровий острів', cost: 650000, incomePerMin: 2000, icon: 'fas fa-water' },
    { id: 'ruby', name: '❤️ Рубіновий острів', cost: 800000, incomePerMin: 2500, icon: 'fas fa-heart' },
    { id: 'diamond', name: '💎 Діамантовий острів', cost: 1000000, incomePerMin: 3200, icon: 'fas fa-gem' },
    // 10 будинків
    { id: 'house1', name: '🏠 Затишний будинок', cost: 30000, incomePerMin: 80, icon: 'fas fa-home' },
    { id: 'house2', name: '🏡 Сімейний будинок', cost: 60000, incomePerMin: 150, icon: 'fas fa-home' },
    { id: 'house3', name: '🏘️ Котедж', cost: 100000, incomePerMin: 250, icon: 'fas fa-home' },
    { id: 'house4', name: '🏰 Садиба', cost: 200000, incomePerMin: 500, icon: 'fas fa-castle' },
    { id: 'house5', name: '🌳 Еко-будинок', cost: 150000, incomePerMin: 400, icon: 'fas fa-leaf' },
    { id: 'house6', name: '🏢 Міський будинок', cost: 250000, incomePerMin: 600, icon: 'fas fa-city' },
    { id: 'house7', name: '🏠 Розкішний особняк', cost: 500000, incomePerMin: 1200, icon: 'fas fa-crown' },
    { id: 'house8', name: '🏝️ Пляжний будинок', cost: 400000, incomePerMin: 1000, icon: 'fas fa-umbrella-beach' },
    { id: 'house9', name: '🏔️ Гірський шале', cost: 350000, incomePerMin: 900, icon: 'fas fa-mountain' },
    { id: 'house10', name: '🏡 Смарт-будинок', cost: 800000, incomePerMin: 2000, icon: 'fas fa-microchip' }
];

// Автомобілі (тільки реальні моделі, без цифр)
const carsList = [
    { name: 'Toyota Corolla', priceUsd: 22000, icon: 'fas fa-car' },
    { name: 'Honda Civic', priceUsd: 24000, icon: 'fas fa-car' },
    { name: 'Ford Mustang', priceUsd: 33000, icon: 'fas fa-car' },
    { name: 'Chevrolet Camaro', priceUsd: 35000, icon: 'fas fa-car' },
    { name: 'BMW 3 Series', priceUsd: 42000, icon: 'fas fa-car' },
    { name: 'Mercedes C-Class', priceUsd: 45000, icon: 'fas fa-car' },
    { name: 'Audi A4', priceUsd: 41000, icon: 'fas fa-car' },
    { name: 'Tesla Model 3', priceUsd: 47000, icon: 'fab fa-tesla' },
    { name: 'Porsche 911', priceUsd: 110000, icon: 'fas fa-car' },
    { name: 'Lamborghini Huracan', priceUsd: 250000, icon: 'fas fa-car' },
    { name: 'Ferrari F8', priceUsd: 280000, icon: 'fas fa-car' },
    { name: 'Bugatti Chiron', priceUsd: 3000000, icon: 'fas fa-car' },
    { name: 'Volkswagen Golf', priceUsd: 26000, icon: 'fas fa-car' },
    { name: 'Nissan Leaf', priceUsd: 28000, icon: 'fas fa-car' },
    { name: 'Hyundai Elantra', priceUsd: 20000, icon: 'fas fa-car' },
    { name: 'Kia Sportage', priceUsd: 27000, icon: 'fas fa-car' },
    { name: 'Mazda CX-5', priceUsd: 30000, icon: 'fas fa-car' },
    { name: 'Subaru Outback', priceUsd: 33000, icon: 'fas fa-car' },
    { name: 'Jeep Wrangler', priceUsd: 38000, icon: 'fas fa-car' },
    { name: 'Land Rover Defender', priceUsd: 55000, icon: 'fas fa-car' },
    { name: 'Volvo XC60', priceUsd: 47000, icon: 'fas fa-car' },
    { name: 'Lexus RX', priceUsd: 48000, icon: 'fas fa-car' },
    { name: 'Acura MDX', priceUsd: 50000, icon: 'fas fa-car' },
    { name: 'Cadillac Escalade', priceUsd: 80000, icon: 'fas fa-car' },
    { name: 'Rolls Royce Phantom', priceUsd: 450000, icon: 'fas fa-car' }
];

// Акції (тільки реальні назви, без цифр)
function initStocks() {
    const realCompanies = [
        "Apple", "Microsoft", "Google", "Amazon", "Tesla", "Meta", "NVIDIA", "Netflix", "Adobe", "Salesforce",
        "Intel", "AMD", "PayPal", "Uber", "Airbnb", "Spotify", "Sony", "Disney", "CocaCola", "McDonald's",
        "Visa", "Mastercard", "JPMorgan", "GoldmanSachs", "Boeing", "Caterpillar", "Exxon", "Chevron",
        "Pfizer", "Moderna", "Alibaba", "Tencent", "Samsung", "Toyota", "Nike", "Adidas", "LouisVuitton",
        "Hermès", "IBM", "Oracle", "Cisco", "Qualcomm", "TexasInstruments", "Broadcom", "Micron", "AppliedMaterials",
        "LamResearch", "ASML", "TSMC", "BlackRock", "Berkshire", "ProcterGamble", "Johnson&Johnson", "Verizon", "AT&T",
        "T-Mobile", "Starbucks", "Chipotle", "LVMH", "Bayer", "Siemens", "HSBC", "Barclays", "DeutscheBank"
    ];
    for (let i = 0; i < realCompanies.length; i++) {
        stocks.push({
            id: i,
            name: realCompanies[i],
            price: 20 + Math.random() * 500,
            icon: 'fas fa-chart-line'
        });
    }
    // Додаємо Berkshire Hathaway A
    stocks.push({ id: stocks.length, name: "Berkshire Hathaway A", price: 600000, icon: 'fas fa-crown' });
}
initStocks();

// Оновлення цін акцій
setInterval(() => {
    for (let s of stocks) {
        let change = (Math.random() - 0.5) * 0.03;
        s.price = Math.max(0.5, s.price * (1 + change));
    }
    if (currentUser && document.querySelector('[data-page="stocks"]')?.classList?.contains('active-page')) renderStocks();
}, 30000);

// Отримання курсу USD/UAH
async function fetchUsdRate() {
    try {
        const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=UAH');
        const data = await res.json();
        if (data.rates && data.rates.UAH) usdRate = data.rates.UAH;
    } catch (e) { console.warn("USD API error", e); }
    if (currentUser && document.getElementById('usd-balance')) {
        document.getElementById('usd-balance').innerText = (users[currentUser.username].usdBalance || 0).toFixed(2);
    }
}
setInterval(fetchUsdRate, 60000);
fetchUsdRate();

// Збереження та завантаження даних
function saveData() {
    localStorage.setItem('virtualbank_users', JSON.stringify(users));
    localStorage.setItem('virtualbank_commission', commissionBank);
    localStorage.setItem('virtualbank_support', supportBank);
    localStorage.setItem('virtualbank_boost', JSON.stringify({ boostMultiplier, boostExpiry }));
    localStorage.setItem('virtualbank_globalMessage', JSON.stringify(globalMessage));
}
function loadData() {
    const stored = localStorage.getItem('virtualbank_users');
    if (stored) users = JSON.parse(stored);
    commissionBank = Number(localStorage.getItem('virtualbank_commission') || 0);
    supportBank = Number(localStorage.getItem('virtualbank_support') || 0);
    const boost = JSON.parse(localStorage.getItem('virtualbank_boost') || '{"boostMultiplier":1,"boostExpiry":0}');
    boostMultiplier = boost.boostMultiplier;
    boostExpiry = boost.boostExpiry;
    const msg = localStorage.getItem('virtualbank_globalMessage');
    if (msg) globalMessage = JSON.parse(msg);
    
    if (!users['creator']) {
        users['creator'] = {
            password: '9creator9',
            balance: 1000000,
            usdBalance: 0,
            status: 'admin',
            isAdmin: true,
            isBanned: false,
            crypto: {},
            stocks: {},
            businesses: [],
            realties: [],
            cars: [],
            card: generateCardData(),
            cardColor: 'black',
            cardName: 'Virtual Card',
            cardCvv: Math.floor(100 + Math.random()*900).toString(),
            cvvChanged: false,
            lastSeen: Date.now(),
            clickMultiplier: 1,
            multiplierExpiry: 0,
            transactions: [],
            specialTitles: [],
            vipGiveawayDate: null
        };
        saveData();
    }
    for (let u in users) {
        if (!users[u].crypto) users[u].crypto = {};
        if (!users[u].stocks) users[u].stocks = {};
        if (!users[u].businesses) users[u].businesses = [];
        if (!users[u].realties) users[u].realties = [];
        if (!users[u].cars) users[u].cars = [];
        if (users[u].isAdmin === undefined) users[u].isAdmin = (u === 'creator');
        if (!users[u].card) users[u].card = generateCardData();
        if (!users[u].cardCvv) users[u].cardCvv = Math.floor(100 + Math.random()*900).toString();
        if (!users[u].cardColor) users[u].cardColor = 'black';
        if (!users[u].cardName) users[u].cardName = 'Virtual Card';
        if (users[u].usdBalance === undefined) users[u].usdBalance = 0;
        if (!users[u].transactions) users[u].transactions = [];
        if (!users[u].specialTitles) users[u].specialTitles = [];
        if (users[u].cvvChanged === undefined) users[u].cvvChanged = false;
        if (users[u].vipGiveawayDate === undefined) users[u].vipGiveawayDate = null;
    }
}
function generateCardData() {
    const number = '4' + Math.floor(Math.random() * 1e15).toString().padStart(15,'0');
    const expiry = `${Math.floor(Math.random()*12)+1}/${new Date().getFullYear()+Math.floor(Math.random()*4)+1}`;
    return { number, expiry };
}
function updateLastSeen() { if(currentUser) { users[currentUser.username].lastSeen = Date.now(); saveData(); } }
setInterval(updateLastSeen, 30000);
function isOnline(username) {
    if (!users[username]) return false;
    return (Date.now() - users[username].lastSeen) < 2*60*1000;
}
function addTransaction(username, type, amount, currency, details) {
    if (!users[username].transactions) users[username].transactions = [];
    users[username].transactions.unshift({
        timestamp: Date.now(),
        type: type,
        amount: amount,
        currency: currency,
        details: details
    });
    if (users[username].transactions.length > 50) users[username].transactions.pop();
    saveData();
}

// CVV перевірка (замість PIN)
function verifyCvv(callback) {
    const cvv = prompt("Введіть CVV-код вашої картки (3 цифри):");
    if (cvv === users[currentUser.username].cardCvv) {
        callback(true);
    } else {
        showToast(t('invalidPin'), true);
        callback(false);
    }
}

// Звуковий ефект
function playClickSound() {
    if (!soundEnabled) return;
    try {
        let audio = new Audio('https://www.soundjay.com/misc/sounds/button-click-01.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Sound error", e));
    } catch(e) {}
}

// VIP-роздача
function vipGiveaway() {
    let user = users[currentUser.username];
    if (user.status !== 'vip' && user.status !== 'businessman' && user.status !== 'manager' && user.status !== 'admin') {
        showToast("Тільки VIP та вищі можуть використовувати роздачу", true);
        return;
    }
    let lastDate = user.vipGiveawayDate ? new Date(user.vipGiveawayDate).toDateString() : null;
    let today = new Date().toDateString();
    if (lastDate === today) {
        showToast(t('vipDailyLimit'), true);
        return;
    }
    let amount = prompt("Скільки грн ви хочете видати? (максимум 100,000)");
    if (!amount) return;
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0 || amount > 100000) {
        showToast("Сума має бути від 1 до 100,000 грн", true);
        return;
    }
    if (user.balance < amount) {
        showToast(t('insufficientFunds'), true);
        return;
    }
    let target = prompt("Кому видати? (логін)");
    if (!target || !users[target] || users[target].isBanned) {
        showToast("Невірний користувач", true);
        return;
    }
    user.balance -= amount;
    users[target].balance += amount;
    user.vipGiveawayDate = Date.now();
    saveData();
    updateUI();
    showToast(t('vipGiveawaySuccess', { amount: amount, user: target }));
    addTransaction(currentUser.username, 'vip_giveaway', amount, 'UAH', `VIP-роздача ${amount} грн користувачу ${target}`);
    addTransaction(target, 'vip_receive', amount, 'UAH', `Отримано ${amount} грн від ${currentUser.username} (VIP-роздача)`);
}

// Оновлення спеціальних титулів
function updateSpecialTitles() {
    const user = users[currentUser.username];
    const elonCompanies = ['tesla', 'spacex', 'neuralink', 'boring', 'x'];
    const hasAllElon = elonCompanies.every(id => user.businesses.includes(id));
    if (hasAllElon && !user.specialTitles.includes('elon')) {
        user.specialTitles.push('elon');
        showToast("🎉 Ви отримали титул «Ілон Маск»! 🚀");
        addTransaction(currentUser.username, 'title', 0, 'title', 'Отримано титул Ілон Маск');
    }
    if (user.businesses.includes('microsoft') && !user.specialTitles.includes('bezos')) {
        user.specialTitles.push('bezos');
        showToast("🎉 Ви отримали титул «Джеф Безос»! 💻");
        addTransaction(currentUser.username, 'title', 0, 'title', 'Отримано титул Джеф Безос');
    }
    saveData();
}

// Пасивний дохід
setInterval(() => {
    if (currentUser && !users[currentUser.username].isBanned) {
        const user = users[currentUser.username];
        if (isOnline(currentUser.username)) {
            let income = statuses[user.status].onlineIncome;
            user.businesses.forEach(b => {
                const biz = businessesList.find(x=>x.id===b);
                if(biz) income += biz.incomePerMin;
            });
            user.realties.forEach(r => {
                const re = realtiesList.find(x=>x.id===r);
                if(re) income += re.incomePerMin;
            });
            if (income > 0) {
                user.balance += income;
                saveData();
                updateUI();
                showToast(`+${income} грн (пасивний дохід)`);
                addTransaction(currentUser.username, 'income', income, 'UAH', 'Пасивний дохід');
            }
        }
    }
}, 60000);

// Крипто ціни (з фото)
async function fetchCryptoPrices() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        const data = await res.json();
        cryptoPrices = {};
        data.forEach(coin => {
            cryptoPrices[coin.symbol.toUpperCase()] = { 
                name: coin.name, 
                price: coin.current_price * usdRate,
                img: coin.image 
            };
        });
        if(currentUser && document.querySelector('[data-page="crypto"]')?.classList?.contains('active-page')) renderCrypto();
    } catch(e) { console.warn("Crypto API error", e); }
}
setInterval(fetchCryptoPrices, 60000);
fetchCryptoPrices();

function updateUI() {
    if(!currentUser) return;
    document.getElementById('username-display').innerText = currentUser.username;
    const st = users[currentUser.username].status;
    document.getElementById('status-text').innerHTML = `${statuses[st].icon} ${st.toUpperCase()}`;
    document.getElementById('main-balance').innerHTML = Math.floor(users[currentUser.username].balance);
    document.getElementById('usd-balance').innerHTML = (users[currentUser.username].usdBalance || 0).toFixed(2);
}
function showToast(msg, isError=false) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '120px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = isError ? '#c0392b' : '#2c3e50';
    toast.style.color = 'white';
    toast.style.padding = '8px 20px';
    toast.style.borderRadius = '40px';
    toast.style.zIndex = 9999;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 3000);
}

// Головна сторінка
function renderDashboard() {
    const user = users[currentUser.username];
    const card = user.card;
    const cvv = user.cardCvv;
    let cardClass = 'real-card ';
    switch(user.cardColor) {
        case 'black': cardClass += 'card-black'; break;
        case 'yellow': cardClass += 'card-yellow'; break;
        case 'white': cardClass += 'card-white'; break;
        case 'gold': cardClass += 'gold-card'; break;
        default: cardClass += 'card-black';
    }
    let titlesHtml = '';
    if (user.specialTitles.includes('elon')) titlesHtml += '<span class="special-title">🚀 Ілон Маск</span> ';
    if (user.specialTitles.includes('bezos')) titlesHtml += '<span class="special-title">💻 Джеф Безос</span> ';
    document.getElementById('page-content').innerHTML = `
        <h2><i class="fas fa-id-card"></i> ${user.cardName}</h2>
        <div class="${cardClass}" style="cursor: pointer;" onclick="openColorModal()">
            <div class="card-chip"></div>
            <div class="card-number">${card.number.match(/.{1,4}/g).join(' ')}</div>
            <div class="card-details">
                <span>CVV: ${cvv}</span>
                <span>До: ${card.expiry}</span>
            </div>
            <div class="card-brand">VIRTUAL</div>
        </div>
        <h3>📊 ${t('statistics')}</h3>
        <p>${t('status')}: ${user.status.toUpperCase()} ${statuses[user.status].icon}</p>
        <p>${t('titles')}: ${titlesHtml || t('none')}</p>
        <p>${t('clickReward')}: +${Math.floor(statuses[user.status].clickReward * (user.clickMultiplier||1) * (boostExpiry>Date.now()?boostMultiplier:1))} грн</p>
        <p>${t('passiveIncome')}: ${getTotalPassiveIncome(user)} грн</p>
        <h3>💱 ${t('convertUsd')}</h3>
        <p>1 USD = ${usdRate.toFixed(2)} грн</p>
        <input type="number" id="uah-amount" placeholder="${t('amount')} грн">
        <button id="buy-usd">${t('buyUsd')}</button>
        <input type="number" id="usd-amount" placeholder="${t('amountUsd')}">
        <button id="sell-usd">${t('sellUsd')}</button>
        <h3>🏆 ${t('achievements')}</h3>
        <button id="upgrade-status" class="btn-primary">${t('upgradeStatus')}</button>
    `;
    document.getElementById('upgrade-status')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) upgradeStatus();
        });
    });
    document.getElementById('buy-usd')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) buyUsd();
        });
    });
    document.getElementById('sell-usd')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) sellUsd();
        });
    });
}
function upgradeStatus() {
    const user = users[currentUser.username];
    const statusesOrder = ['none','basic','medium','vip','businessman','manager'];
    let currentIdx = statusesOrder.indexOf(user.status);
    if(currentIdx<statusesOrder.length-1){
        let next = statusesOrder[currentIdx+1];
        let cost = statuses[next].price;
        if(user.balance >= cost){
            user.balance -= cost;
            user.status = next;
            saveData();
            renderDashboard();
            updateUI();
            showToast(`Статус підвищено до ${next}`);
            addTransaction(currentUser.username, 'status', cost, 'UAH', `Підвищення до ${next}`);
            if (next === 'vip') document.getElementById('vip-giveaway-btn').style.display = 'inline-block';
        } else showToast(`${t('insufficientFunds')} (${cost} грн)`, true);
    } else showToast('Максимальний статус',true);
}
function buyUsd() {
    let uah = parseFloat(document.getElementById('uah-amount').value);
    if(uah>0 && users[currentUser.username].balance >= uah){
        let usd = uah / usdRate;
        users[currentUser.username].balance -= uah;
        users[currentUser.username].usdBalance = (users[currentUser.username].usdBalance||0) + usd;
        saveData();
        updateUI();
        renderDashboard();
        showToast(`Куплено ${usd.toFixed(4)} USD`);
        addTransaction(currentUser.username, 'exchange', uah, 'UAH', `Купівля USD: ${usd.toFixed(4)} USD`);
    } else showToast(t('insufficientFunds'),true);
}
function sellUsd() {
    let usd = parseFloat(document.getElementById('usd-amount').value);
    if(usd>0 && users[currentUser.username].usdBalance >= usd){
        let uah = usd * usdRate;
        users[currentUser.username].usdBalance -= usd;
        users[currentUser.username].balance += uah;
        saveData();
        updateUI();
        renderDashboard();
        showToast(`Продано ${usd.toFixed(4)} USD за ${uah.toFixed(2)} грн`);
        addTransaction(currentUser.username, 'exchange', uah, 'UAH', `Продаж USD: ${usd.toFixed(4)} USD`);
    } else showToast(t('insufficientFunds'),true);
}
function getTotalPassiveIncome(user) {
    let inc = statuses[user.status].onlineIncome;
    user.businesses.forEach(b=>{ let biz=businessesList.find(x=>x.id===b); if(biz) inc+=biz.incomePerMin; });
    user.realties.forEach(r=>{ let re=realtiesList.find(x=>x.id===r); if(re) inc+=re.incomePerMin; });
    return inc;
}

// Крипто (з фото)
function renderCrypto() {
    let html = `<h2><i class="fab fa-bitcoin"></i> Криптовалюти</h2><div class="card-grid">`;
    for(let sym in cryptoPrices){
        const coin = cryptoPrices[sym];
        const userCoin = users[currentUser.username].crypto[sym] || 0;
        const imgUrl = coin.img ? coin.img : 'https://via.placeholder.com/50?text=Crypto';
        html += `<div class="virtual-card">
            <div class="card-header">
                <img src="${imgUrl}" class="crypto-img" alt="${coin.name}">
                <b>${coin.name} (${sym})</b>
            </div>
            💲${coin.price.toFixed(2)} грн<br>
            Ваш баланс: ${userCoin} <br>
            <input type="number" id="crypto-amount-${sym}" placeholder="кількість" step="0.001">
            <button onclick="buyCryptoWithCvv('${sym}')">${t('buy')}</button>
            <button onclick="sellCryptoWithCvv('${sym}')">${t('sell')}</button>
        </div>`;
    }
    html+=`</div>`;
    document.getElementById('page-content').innerHTML = html;
}
window.buyCryptoWithCvv = function(sym) {
    verifyCvv(success => {
        if(success) buyCrypto(sym);
    });
};
window.sellCryptoWithCvv = function(sym) {
    verifyCvv(success => {
        if(success) sellCrypto(sym);
    });
};
function buyCrypto(sym){
    let amount = parseFloat(document.getElementById(`crypto-amount-${sym}`).value);
    if(isNaN(amount)||amount<=0) return;
    const price = cryptoPrices[sym]?.price;
    if(!price) return;
    let totalCost = amount * price;
    if(users[currentUser.username].balance >= totalCost){
        users[currentUser.username].balance -= totalCost;
        users[currentUser.username].crypto[sym] = (users[currentUser.username].crypto[sym]||0) + amount;
        saveData();
        renderCrypto();
        updateUI();
        showToast(`Куплено ${amount} ${sym}`);
        addTransaction(currentUser.username, 'crypto_buy', totalCost, 'UAH', `Купівля ${amount} ${sym}`);
    } else showToast(t('insufficientFunds'),true);
}
function sellCrypto(sym){
    let amount = parseFloat(document.getElementById(`crypto-amount-${sym}`).value);
    if(isNaN(amount)||amount<=0) return;
    let current = users[currentUser.username].crypto[sym]||0;
    if(current >= amount){
        const price = cryptoPrices[sym]?.price;
        if(!price) return;
        let total = amount * price;
        users[currentUser.username].balance += total;
        users[currentUser.username].crypto[sym] = current - amount;
        saveData();
        renderCrypto();
        updateUI();
        showToast(`Продано ${amount} ${sym} за ${total.toFixed(2)} грн`);
        addTransaction(currentUser.username, 'crypto_sell', total, 'UAH', `Продаж ${amount} ${sym}`);
    } else showToast('Недостатньо монет',true);
}

// Акції (з іконками)
function renderStocks() {
    let html = `<h2><i class="fas fa-chart-line"></i> Акції (оновлення кожні 30 сек)</h2><div class="card-grid">`;
    stocks.forEach(s=>{
        const userAmount = users[currentUser.username].stocks[s.id] || 0;
        html+=`<div class="virtual-card">
            <div class="card-header">
                <i class="${s.icon}" style="font-size: 2rem;"></i>
                <b>${s.name}</b>
            </div>
            💵 ${s.price.toFixed(2)} грн<br>
            Ваші: ${userAmount}<br>
            <input type="number" id="stock-amount-${s.id}" placeholder="шт">
            <button onclick="buyStockWithCvv(${s.id})">${t('buy')}</button>
            <button onclick="sellStockWithCvv(${s.id})">${t('sell')}</button>
        </div>`;
    });
    html+=`</div>`;
    document.getElementById('page-content').innerHTML = html;
}
window.buyStockWithCvv = function(id) {
    verifyCvv(success => {
        if(success) buyStock(id);
    });
};
window.sellStockWithCvv = function(id) {
    verifyCvv(success => {
        if(success) sellStock(id);
    });
};
function buyStock(id){
    let stock = stocks.find(s=>s.id===id);
    let amount = parseFloat(document.getElementById(`stock-amount-${id}`).value);
    if(isNaN(amount)||amount<=0) return;
    let cost = amount * stock.price;
    if(users[currentUser.username].balance >= cost){
        users[currentUser.username].balance -= cost;
        users[currentUser.username].stocks[id] = (users[currentUser.username].stocks[id]||0) + amount;
        saveData();
        renderStocks();
        updateUI();
        addTransaction(currentUser.username, 'stock_buy', cost, 'UAH', `Купівля ${amount} акцій ${stock.name}`);
    } else showToast(t('insufficientFunds'),true);
}
function sellStock(id){
    let stock = stocks.find(s=>s.id===id);
    let amount = parseFloat(document.getElementById(`stock-amount-${id}`).value);
    if(isNaN(amount)||amount<=0) return;
    let current = users[currentUser.username].stocks[id]||0;
    if(current>=amount){
        users[currentUser.username].balance += amount * stock.price;
        users[currentUser.username].stocks[id] = current - amount;
        saveData();
        renderStocks();
        updateUI();
        addTransaction(currentUser.username, 'stock_sell', amount*stock.price, 'UAH', `Продаж ${amount} акцій ${stock.name}`);
    } else showToast('Недостатньо',true);
}

// Бізнес
function renderBusiness() {
    let user = users[currentUser.username];
    let html = `<h2><i class="fas fa-store"></i> Бізнеси (пасивний дохід)</h2><div class="card-grid">`;
    businessesList.forEach(b=>{
        let owned = user.businesses.includes(b.id);
        let costDisplay = b.cost ? `${b.cost} грн` : `${b.costUsd} USD`;
        let buyFn = b.costUsd ? `buyBusinessUsd('${b.id}')` : `buyBusiness('${b.id}')`;
        html+=`<div class="virtual-card">
            <div class="card-header">
                <i class="${b.icon}" style="font-size: 2rem;"></i>
                <b>${b.name}</b>
            </div>
            💰${costDisplay} | дохід/хв: ${b.incomePerMin}<br>
            ${owned ? '✅ '+t('owned') : `<button onclick="${buyFn}">${t('buyBtn')}</button>`}
        </div>`;
    });
    html+=`</div>`;
    document.getElementById('page-content').innerHTML = html;
}
window.buyBusiness = function(id){
    let biz = businessesList.find(b=>b.id===id);
    if(biz.cost && users[currentUser.username].balance >= biz.cost && !users[currentUser.username].businesses.includes(id)){
        users[currentUser.username].balance -= biz.cost;
        users[currentUser.username].businesses.push(id);
        saveData();
        renderBusiness();
        updateUI();
        showToast(`Придбано ${biz.name}`);
        addTransaction(currentUser.username, 'business_buy', biz.cost, 'UAH', `Купівля бізнесу ${biz.name}`);
        updateSpecialTitles();
    } else showToast('Помилка',true);
};
window.buyBusinessUsd = function(id){
    let biz = businessesList.find(b=>b.id===id);
    let costUsd = biz.costUsd;
    if(users[currentUser.username].usdBalance >= costUsd && !users[currentUser.username].businesses.includes(id)){
        users[currentUser.username].usdBalance -= costUsd;
        users[currentUser.username].businesses.push(id);
        saveData();
        renderBusiness();
        updateUI();
        showToast(`Придбано ${biz.name} за ${costUsd} USD`);
        addTransaction(currentUser.username, 'business_buy', costUsd, 'USD', `Купівля бізнесу ${biz.name}`);
        updateSpecialTitles();
    } else showToast('Недостатньо USD',true);
};

// Нерухомість (острови + будинки)
function renderRealty() {
    let user = users[currentUser.username];
    let html = `<h2><i class="fas fa-building"></i> Нерухомість</h2><div class="card-grid">`;
    realtiesList.forEach(r=>{
        let owned = user.realties.includes(r.id);
        html+=`<div class="virtual-card">
            <div class="card-header">
                <i class="${r.icon}" style="font-size: 2rem;"></i>
                <b>${r.name}</b>
            </div>
            🏷️${r.cost} грн | дохід/хв: ${r.incomePerMin}<br>
            ${owned ? '✅ '+t('owned') : `<button onclick="buyRealtyWithCvv('${r.id}')">${t('buyBtn')}</button>`}
        </div>`;
    });
    html+=`</div>`;
    document.getElementById('page-content').innerHTML = html;
}
window.buyRealtyWithCvv = function(id) {
    verifyCvv(success => {
        if(success) buyRealty(id);
    });
};
function buyRealty(id){
    let r = realtiesList.find(r=>r.id===id);
    if(users[currentUser.username].balance >= r.cost && !users[currentUser.username].realties.includes(id)){
        users[currentUser.username].balance -= r.cost;
        users[currentUser.username].realties.push(id);
        saveData();
        renderRealty();
        updateUI();
        addTransaction(currentUser.username, 'realty_buy', r.cost, 'UAH', `Купівля нерухомості ${r.name}`);
    } else showToast('Недостатньо',true);
}

// Автомобілі
function renderCars() {
    let user = users[currentUser.username];
    let html = `<h2><i class="fas fa-car"></i> Автомобілі (ціни в USD)</h2><div class="card-grid">`;
    carsList.forEach((car, idx) => {
        let owned = user.cars.includes(idx);
        html += `<div class="virtual-card">
            <div class="card-header">
                <i class="${car.icon}" style="font-size: 2rem;"></i>
                <b>${car.name}</b>
            </div>
            💵 ${car.priceUsd} USD<br>
            ${owned ? '✅ '+t('owned') : `<button onclick="buyCar(${idx})">${t('buyBtn')}</button>`}
        </div>`;
    });
    html += `</div>`;
    document.getElementById('page-content').innerHTML = html;
}
window.buyCar = function(idx) {
    verifyCvv(success => {
        if (success) {
            let car = carsList[idx];
            let user = users[currentUser.username];
            if (user.usdBalance >= car.priceUsd && !user.cars.includes(idx)) {
                user.usdBalance -= car.priceUsd;
                user.cars.push(idx);
                saveData();
                renderCars();
                updateUI();
                showToast(`Придбано ${car.name}`);
                addTransaction(currentUser.username, 'car_buy', car.priceUsd, 'USD', `Купівля авто ${car.name}`);
            } else {
                showToast('Недостатньо USD або авто вже є', true);
            }
        }
    });
};

// Класи
function renderClasses() {
    let html = `<h2><i class="fas fa-star-of-life"></i> Класи та статуси</h2>`;
    for (let [key, val] of Object.entries(statuses)) {
        if (key === 'admin') continue;
        html += `<div class="class-card">
            <div class="class-title">${val.icon} ${key.toUpperCase()}</div>
            <div class="class-price">Ціна: ${val.price} грн</div>
            <div class="class-benefits">
                🔥 Клік: +${val.clickReward} грн<br>
                💰 Онлайн-дохід/хв: ${val.onlineIncome} грн<br>
                💤 Офлайн-дохід/хв: ${val.offlineIncome} грн<br>
                ${val.desc[currentLang]}
            </div>
        </div>`;
    }
    html += `<button id="goto-upgrade" class="btn-primary">${t('upgradeStatus')}</button>`;
    document.getElementById('page-content').innerHTML = html;
    document.getElementById('goto-upgrade')?.addEventListener('click', () => {
        navigate('dashboard');
        setTimeout(() => document.getElementById('upgrade-status')?.click(), 100);
    });
}

// Перекази
function renderTransfer() {
    document.getElementById('page-content').innerHTML = `
        <h2>🔁 ${t('transferGrn')}</h2>
        <input id="transfer-to" placeholder="${t('recipient')}">
        <input id="transfer-amount" type="number" placeholder="${t('amount')}">
        <button id="transfer-grn-btn" class="btn-primary">${t('transferGrn')}</button>
        <hr>
        <h2>💵 ${t('transferUsd')}</h2>
        <input id="transfer-usd-to" placeholder="${t('recipient')}">
        <input id="transfer-usd-amount" type="number" placeholder="${t('amountUsd')}">
        <button id="transfer-usd-btn" class="btn-primary">${t('transferUsd')}</button>
        <hr>
        <h2>🪙 ${t('transferCrypto')}</h2>
        <input id="crypto-to" placeholder="${t('cryptoRecipient')}">
        <input id="crypto-symbol" placeholder="Символ (BTC, ETH..)">
        <input id="crypto-amount" type="number" placeholder="${t('cryptoAmount')}">
        <button id="transfer-crypto-btn">${t('transferCrypto')}</button>
    `;
    document.getElementById('transfer-grn-btn')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) transferGrn();
        });
    });
    document.getElementById('transfer-usd-btn')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) transferUsd();
        });
    });
    document.getElementById('transfer-crypto-btn')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) transferCrypto();
        });
    });
}
function transferGrn() {
    let to = document.getElementById('transfer-to').value;
    let amount = parseFloat(document.getElementById('transfer-amount').value);
    if(!users[to] || to===currentUser.username) return showToast('Невірний користувач',true);
    if(users[currentUser.username].balance >= amount+amount*0.05){
        let fee = amount*0.05;
        users[currentUser.username].balance -= (amount+fee);
        users[to].balance += amount;
        commissionBank += fee;
        saveData();
        updateUI();
        showToast(`Переказано ${amount} грн`);
        addTransaction(currentUser.username, 'transfer_out', amount+fee, 'UAH', `Переказ ${amount} грн користувачу ${to}`);
        addTransaction(to, 'transfer_in', amount, 'UAH', `Отримано ${amount} грн від ${currentUser.username}`);
    } else showToast(t('insufficientFunds'),true);
}
function transferUsd() {
    let to = document.getElementById('transfer-usd-to').value;
    let amount = parseFloat(document.getElementById('transfer-usd-amount').value);
    if(!users[to] || to===currentUser.username) return showToast('Невірний користувач',true);
    let userUsd = users[currentUser.username].usdBalance || 0;
    if(userUsd >= amount+amount*0.05){
        let fee = amount*0.05;
        users[currentUser.username].usdBalance -= (amount+fee);
        users[to].usdBalance = (users[to].usdBalance||0) + amount;
        commissionBank += fee * usdRate;
        saveData();
        updateUI();
        showToast(`Переказано ${amount} USD`);
        addTransaction(currentUser.username, 'transfer_out', amount+fee, 'USD', `Переказ ${amount} USD користувачу ${to}`);
        addTransaction(to, 'transfer_in', amount, 'USD', `Отримано ${amount} USD від ${currentUser.username}`);
    } else showToast(t('insufficientFunds'),true);
}
function transferCrypto() {
    let to = document.getElementById('crypto-to').value;
    let sym = document.getElementById('crypto-symbol').value.toUpperCase();
    let amount = parseFloat(document.getElementById('crypto-amount').value);
    if(!users[to] || !cryptoPrices[sym]) return showToast('Помилка',true);
    let userCrypto = users[currentUser.username].crypto[sym]||0;
    if(userCrypto >= amount){
        let fee = amount*0.01;
        users[currentUser.username].crypto[sym] = userCrypto - amount;
        users[to].crypto[sym] = (users[to].crypto[sym]||0) + amount - fee;
        commissionBank += fee * (cryptoPrices[sym]?.price||0);
        saveData();
        showToast(`Переказано ${amount} ${sym}`);
        addTransaction(currentUser.username, 'crypto_transfer_out', amount, sym, `Переказ ${amount} ${sym} користувачу ${to}`);
        addTransaction(to, 'crypto_transfer_in', amount-fee, sym, `Отримано ${amount-fee} ${sym} від ${currentUser.username}`);
    } else showToast('Недостатньо крипти',true);
}
// Історія
function renderHistory() {
    let user = users[currentUser.username];
    let html = `<h2><i class="fas fa-history"></i> ${t('history')}</h2>`;
    if (!user.transactions || user.transactions.length === 0) {
        html += `<p>${t('noHistory')}</p>`;
    } else {
        html += `<div class="transaction-list">`;
        user.transactions.forEach(tx => {
            let date = new Date(tx.timestamp).toLocaleString();
            html += `<div class="transaction-item">
                <small>${date}</small><br>
                <strong>${tx.type.toUpperCase()}</strong> — ${tx.amount} ${tx.currency}<br>
                <span style="font-size:0.8rem;">${tx.details}</span>
            </div>`;
        });
        html += `</div>`;
    }
    document.getElementById('page-content').innerHTML = html;
}

// Донати
function renderDonate() {
    document.getElementById('page-content').innerHTML = `
        <h2>🫙 ${t('supportBank')}</h2>
        <p>${t('supportBank')}: ${supportBank.toFixed(2)} грн</p>
        <input id="donate-amount" placeholder="${t('donateAmount')}">
        <button id="donate-btn">${t('donateToSupport')}</button>
    `;
    document.getElementById('donate-btn')?.addEventListener('click',()=>{
        verifyCvv(success => {
            if(success) donate();
        });
    });
}
function donate() {
    let amount = parseFloat(document.getElementById('donate-amount').value);
    if(users[currentUser.username].balance >= amount && amount>0){
        users[currentUser.username].balance -= amount;
        supportBank += amount;
        saveData();
        updateUI();
        showToast(`${t('thankYou')} +${amount} грн в банку підтримки`);
        addTransaction(currentUser.username, 'donate', amount, 'UAH', `Донат у банку підтримки`);
        renderDonate();
    } else showToast(t('insufficientFunds'),true);
}

// Топ 100
function renderTop() {
    let sorted = Object.keys(users).filter(u=>!users[u].isBanned).sort((a,b) => {
        let totalA = users[a].balance / usdRate + users[a].usdBalance;
        let totalB = users[b].balance / usdRate + users[b].usdBalance;
        for (let sym in users[a].crypto) if (cryptoPrices[sym]) totalA += users[a].crypto[sym] * cryptoPrices[sym].price / usdRate;
        for (let sym in users[b].crypto) if (cryptoPrices[sym]) totalB += users[b].crypto[sym] * cryptoPrices[sym].price / usdRate;
        for (let sid in users[a].stocks) {
            let stock = stocks.find(s => s.id == sid);
            if (stock) totalA += users[a].stocks[sid] * stock.price / usdRate;
        }
        for (let sid in users[b].stocks) {
            let stock = stocks.find(s => s.id == sid);
            if (stock) totalB += users[b].stocks[sid] * stock.price / usdRate;
        }
        return totalB - totalA;
    }).slice(0,100);
    let html = `<h2>🏆 ${t('topTitle')}</h2><ul>`;
    sorted.forEach((u,idx)=>{
        let total = users[u].balance / usdRate + users[u].usdBalance;
        for (let sym in users[u].crypto) if (cryptoPrices[sym]) total += users[u].crypto[sym] * cryptoPrices[sym].price / usdRate;
        for (let sid in users[u].stocks) {
            let stock = stocks.find(s => s.id == sid);
            if (stock) total += users[u].stocks[sid] * stock.price / usdRate;
        }
        html+=`<li>${idx+1}. ${u} — $${total.toFixed(2)} (${users[u].status})</li>`;
    });
    html+=`</ul>`;
    document.getElementById('page-content').innerHTML = html;
}

// Адмін-панель
function renderAdminPanel() {
    if(!currentUser.isAdmin) return;
    let userOptions = Object.keys(users).map(u => {
        let onlineClass = isOnline(u) ? '🟢' : '⚫';
        return `<option value="${u}">${onlineClass} ${u} (${users[u].status})</option>`;
    }).join('');
    let cryptoOpts = Object.keys(cryptoPrices).map(s=>`<option value="${s}">${s}</option>`).join('');
    document.getElementById('page-content').innerHTML = `
        <div class="admin-section">
            <h2>👑 Адмін панель</h2>
            <div class="admin-grid">
                <div class="admin-card">
                    <h3>Вибрати користувача</h3>
                    <select id="admin-user-select">${userOptions}</select>
                    <button id="admin-select-all-online">Вибрати всіх онлайн</button>
                </div>
                <div class="admin-card">
                    <h3>Гроші</h3>
                    <div class="button-group">
                        <button id="admin-add-money">Видати</button>
                        <button id="admin-remove-money">Забрати</button>
                        <button id="admin-set-balance">Встановити</button>
                    </div>
                </div>
                <div class="admin-card">
                    <h3>Крипта</h3>
                    <select id="admin-crypto-symbol">${cryptoOpts}</select>
                    <div class="button-group">
                        <button id="admin-add-crypto">Видати</button>
                        <button id="admin-remove-crypto">Забрати</button>
                    </div>
                </div>
                <div class="admin-card">
                    <h3>Статус</h3>
                    <select id="admin-status-select">${Object.keys(statuses).map(s=>`<option>${s}</option>`)}</select>
                    <button id="admin-set-status">Встановити</button>
                </div>
                <div class="admin-card">
                    <h3>Бізнес/Нерухомість</h3>
                    <select id="admin-business-select">${businessesList.map(b=>`<option value="${b.id}">${b.name}</option>`)}</select>
                    <div class="button-group"><button id="admin-add-business">+</button><button id="admin-remove-business">-</button></div>
                    <select id="admin-realty-select">${realtiesList.map(r=>`<option value="${r.id}">${r.name}</option>`)}</select>
                    <div class="button-group"><button id="admin-add-realty">+</button><button id="admin-remove-realty">-</button></div>
                </div>
                <div class="admin-card">
                    <h3>Бан/Розбан</h3>
                    <div class="button-group">
                        <button id="admin-ban">Забанити</button>
                        <button id="admin-unban">Розбанити</button>
                        <button id="admin-delete">Видалити акаунт</button>
                        <button id="admin-reset">Reset</button>
                    </div>
                </div>
                <div class="admin-card">
                    <h3>Масові дії</h3>
                    <div class="button-group">
                        <button id="admin-all-money">Всім гроші</button>
                        <button id="admin-online-money">Всім онлайн гроші</button>
                        <button id="admin-all-crypto">Всім крипту</button>
                        <button id="admin-online-crypto">Всім онлайн крипту</button>
                    </div>
                    <div class="button-group">
                        <input id="boost-mult" placeholder="множник" style="width:80px">
                        <input id="boost-min" placeholder="хвилин" style="width:80px">
                        <button id="apply-boost">Boost</button>
                    </div>
                </div>
                <div class="admin-card">
                    <h3>Банки</h3>
                    <div class="button-group">
                        <button id="admin-take-commission">Забрати комісії (${commissionBank.toFixed(2)} грн)</button>
                        <button id="admin-take-support">Забрати підтримку (${supportBank.toFixed(2)} грн)</button>
                    </div>
                </div>
                <div class="admin-card">
                    <h3>Повідомлення</h3>
                    <textarea id="admin-message" rows="2" placeholder="Текст..."></textarea>
                    <button id="admin-send-msg">Надіслати всім онлайн</button>
                </div>
                <div class="admin-card">
                    <h3>Аналітика</h3>
                    <button id="admin-analytics">Оновити</button>
                    <div id="analytics-data"></div>
                </div>
            </div>
        </div>
    `;
    attachAdminEvents();
}
function attachAdminEvents() {
    const selectedUser = () => document.getElementById('admin-user-select').value;
    const cryptoSym = () => document.getElementById('admin-crypto-symbol').value;

    // Гроші – видати, забрати, встановити з prompt
    document.getElementById('admin-add-money')?.addEventListener('click',()=>{
        let amt = parseFloat(prompt("Сума для видачі (грн):"));
        if(amt>0){ users[selectedUser()].balance += amt; saveData(); showToast(`+${amt} грн`); }
        else if(amt!==null) showToast("Сума має бути додатньою", true);
    });
    document.getElementById('admin-remove-money')?.addEventListener('click',()=>{
        let amt = parseFloat(prompt("Сума для зняття (грн):"));
        if(amt>0){ users[selectedUser()].balance = Math.max(0, users[selectedUser()].balance - amt); saveData(); }
        else if(amt!==null) showToast("Сума має бути додатньою", true);
    });
    document.getElementById('admin-set-balance')?.addEventListener('click',()=>{
        let amt = parseFloat(prompt("Новий баланс (грн):"));
        if(amt>=0){ users[selectedUser()].balance = amt; saveData(); }
        else if(amt!==null) showToast("Баланс не може бути від'ємним", true);
    });
    // Крипта
    document.getElementById('admin-add-crypto')?.addEventListener('click',()=>{
        let sym = cryptoSym();
        let amt = parseFloat(prompt(`Кількість ${sym} для видачі:`));
        if(amt>0 && cryptoPrices[sym]){ users[selectedUser()].crypto[sym] = (users[selectedUser()].crypto[sym]||0)+amt; saveData(); }
        else if(amt!==null) showToast("Невірна кількість або символ", true);
    });
    document.getElementById('admin-remove-crypto')?.addEventListener('click',()=>{
        let sym = cryptoSym();
        let amt = parseFloat(prompt(`Кількість ${sym} для зняття:`));
        if(amt>0){
            let curr = users[selectedUser()].crypto[sym]||0;
            users[selectedUser()].crypto[sym] = Math.max(0, curr-amt);
            saveData();
        } else if(amt!==null) showToast("Невірна кількість", true);
    });
    // Статус
    document.getElementById('admin-set-status')?.addEventListener('click',()=>{
        let st = document.getElementById('admin-status-select').value;
        if(statuses[st]) users[selectedUser()].status = st; saveData();
        if (st === 'vip') document.getElementById('vip-giveaway-btn').style.display = 'inline-block';
    });
    // Бізнес
    document.getElementById('admin-add-business')?.addEventListener('click',()=>{
        let biz = document.getElementById('admin-business-select').value;
        if(!users[selectedUser()].businesses.includes(biz)) users[selectedUser()].businesses.push(biz); saveData();
        updateSpecialTitles();
    });
    document.getElementById('admin-remove-business')?.addEventListener('click',()=>{
        let biz = document.getElementById('admin-business-select').value;
        users[selectedUser()].businesses = users[selectedUser()].businesses.filter(b=>b!==biz); saveData();
        updateSpecialTitles();
    });
    // Нерухомість
    document.getElementById('admin-add-realty')?.addEventListener('click',()=>{
        let r = document.getElementById('admin-realty-select').value;
        if(!users[selectedUser()].realties.includes(r)) users[selectedUser()].realties.push(r); saveData();
    });
    document.getElementById('admin-remove-realty')?.addEventListener('click',()=>{
        let r = document.getElementById('admin-realty-select').value;
        users[selectedUser()].realties = users[selectedUser()].realties.filter(x=>x!==r); saveData();
    });
    // Бан/Розбан
    document.getElementById('admin-ban')?.addEventListener('click',()=>{ users[selectedUser()].isBanned = true; saveData(); showToast(`Забанено ${selectedUser()}`); });
    document.getElementById('admin-unban')?.addEventListener('click',()=>{ users[selectedUser()].isBanned = false; saveData(); showToast(`Розбанено ${selectedUser()}`); });
    document.getElementById('admin-delete')?.addEventListener('click',()=>{ if(confirm(`Видалити ${selectedUser()}?`)) delete users[selectedUser()]; saveData(); renderAdminPanel(); });
    document.getElementById('admin-reset')?.addEventListener('click',()=>{ if(confirm(`Скинути ${selectedUser()}?`)) { users[selectedUser()].balance=500; users[selectedUser()].usdBalance=0; users[selectedUser()].crypto={}; users[selectedUser()].stocks={}; users[selectedUser()].businesses=[]; users[selectedUser()].realties=[]; users[selectedUser()].cars=[]; users[selectedUser()].status='none'; users[selectedUser()].specialTitles=[]; saveData(); showToast(`Скинуто ${selectedUser()}`); }});
    
    // Масові дії – тепер через prompt
    document.getElementById('admin-all-money')?.addEventListener('click',()=>{
        let amt = parseFloat(prompt("Сума для ВСІХ користувачів (грн):"));
        if(amt>0){ for(let u in users) users[u].balance+=amt; saveData(); showToast(`Всім +${amt} грн`); }
        else if(amt!==null) showToast("Сума має бути додатньою", true);
    });
    document.getElementById('admin-online-money')?.addEventListener('click',()=>{
        let amt = parseFloat(prompt("Сума для ОНЛАЙН користувачів (грн):"));
        if(amt>0){ for(let u in users) if(isOnline(u)) users[u].balance+=amt; saveData(); showToast(`Всім онлайн +${amt} грн`); }
        else if(amt!==null) showToast("Сума має бути додатньою", true);
    });
    document.getElementById('admin-all-crypto')?.addEventListener('click',()=>{
        let sym = cryptoSym();
        let amt = parseFloat(prompt(`Кількість ${sym} для ВСІХ користувачів:`));
        if(amt>0){ for(let u in users) users[u].crypto[sym] = (users[u].crypto[sym]||0)+amt; saveData(); showToast(`Всім +${amt} ${sym}`); }
        else if(amt!==null) showToast("Кількість має бути додатньою", true);
    });
    document.getElementById('admin-online-crypto')?.addEventListener('click',()=>{
        let sym = cryptoSym();
        let amt = parseFloat(prompt(`Кількість ${sym} для ОНЛАЙН користувачів:`));
        if(amt>0){ for(let u in users) if(isOnline(u)) users[u].crypto[sym] = (users[u].crypto[sym]||0)+amt; saveData(); showToast(`Всім онлайн +${amt} ${sym}`); }
        else if(amt!==null) showToast("Кількість має бути додатньою", true);
    });
    // Boost
    document.getElementById('apply-boost')?.addEventListener('click',()=>{
        let mult = parseFloat(prompt("Множник boost:"));
        let minutes = parseFloat(prompt("Тривалість (хвилин):"));
        if(mult>0 && minutes>0){
            boostMultiplier = mult;
            boostExpiry = Date.now() + minutes*60000;
            saveData();
            showToast(`Boost ${mult}x на ${minutes} хв для всіх онлайн`);
        } else showToast("Введіть коректні числа", true);
    });
    // Банки
    document.getElementById('admin-take-commission')?.addEventListener('click',()=>{
        if(confirm('Забрати комісійний банк?')){ users[currentUser.username].balance += commissionBank; commissionBank=0; saveData(); updateUI(); renderAdminPanel();}
    });
    document.getElementById('admin-take-support')?.addEventListener('click',()=>{
        if(confirm('Забрати банк підтримки?')){ users[currentUser.username].balance += supportBank; supportBank=0; saveData(); updateUI(); renderAdminPanel();}
    });
    // Повідомлення
    document.getElementById('admin-send-msg')?.addEventListener('click',()=>{
        let msg = document.getElementById('admin-message').value;
        if(msg){
            globalMessage = { text: msg, timestamp: Date.now() };
            saveData();
            let onlineCount = 0;
            for(let u in users){
                if(isOnline(u)){
                    onlineCount++;
                    if(u === currentUser.username) alert(`[Адмін] ${msg}`);
                    else console.log(`Повідомлення для ${u}: ${msg}`);
                }
            }
            showToast(`Повідомлення надіслано ${onlineCount} онлайн-користувачам`);
        }
    });
    // Аналітика
    document.getElementById('admin-analytics')?.addEventListener('click',()=>{
        let totalBal = Object.values(users).reduce((s,u)=>s+u.balance,0);
        let totalCryptoVal = 0;
        for(let u in users) for(let sym in users[u].crypto) if(cryptoPrices[sym]) totalCryptoVal += users[u].crypto[sym] * cryptoPrices[sym].price;
        document.getElementById('analytics-data').innerHTML = `👥 Гравців: ${Object.keys(users).length}<br>💰 Заг. баланс: ${totalBal.toFixed(2)} грн<br>🪙 Заг. крипта: ${totalCryptoVal.toFixed(2)} грн`;
    });
    // Вибрати всіх онлайн
    document.getElementById('admin-select-all-online')?.addEventListener('click',()=>{
        let select = document.getElementById('admin-user-select');
        for(let i=0; i<select.options.length; i++) {
            let opt = select.options[i];
            if(opt.text.includes('🟢')) opt.selected = true;
        }
    });
}

// Клікер
let clickTimestamps = [];
document.addEventListener('click', (e) => {
    if(e.target.closest('#click-button') && currentUser && !users[currentUser.username].isBanned){
        let now = Date.now();
        clickTimestamps = clickTimestamps.filter(t=> now-t < 1000);
        clickTimestamps.push(now);
        if(clickTimestamps.length > 15) {
            users[currentUser.username].isBanned = true;
            saveData();
            showToast('Бан за читерство!', true);
            logout();
            return;
        }
        let mult = (boostExpiry > Date.now() ? boostMultiplier : 1) * (users[currentUser.username].clickMultiplier||1);
        let reward = statuses[users[currentUser.username].status].clickReward * mult;
        users[currentUser.username].balance += reward;
        saveData();
        updateUI();
        playClickSound();
    }
});

// Навігація
function navigate(page) {
    if(page === 'dashboard') renderDashboard();
    else if(page === 'crypto') renderCrypto();
    else if(page === 'stocks') renderStocks();
    else if(page === 'business') renderBusiness();
    else if(page === 'realty') renderRealty();
    else if(page === 'cars') renderCars();
    else if(page === 'classes') renderClasses();
    else if(page === 'transfer') renderTransfer();
    else if(page === 'history') renderHistory();
    else if(page === 'donate') renderDonate();
    else if(page === 'top') renderTop();
    else if(page === 'admin' && currentUser.isAdmin) renderAdminPanel();
}

// Зміна CVV (замість PIN)
function changeCvv() {
    let user = users[currentUser.username];
    if (!currentUser.isAdmin && user.cvvChanged) {
        showToast("Ви вже змінювали CVV-код! Змінити можна лише один раз.", true);
        return;
    }
    let newCvv = prompt("Введіть новий 3-значний CVV-код:");
    if(newCvv && /^\d{3}$/.test(newCvv)) {
        user.cardCvv = newCvv;
        if (!currentUser.isAdmin) user.cvvChanged = true;
        saveData();
        showToast(t('pinChanged'));
        renderDashboard();
    } else if(newCvv) showToast("CVV має бути 3 цифри", true);
}

// Зміна назви карти
function changeCardName() {
    let user = users[currentUser.username];
    let newName = prompt("Введіть нову назву картки:", user.cardName);
    if (newName) {
        if (currentUser.isAdmin) {
            user.cardName = newName;
            saveData();
            renderDashboard();
            showToast("Назву картки змінено");
        } else {
            if (user.usdBalance >= 1000000) {
                user.usdBalance -= 1000000;
                user.cardName = newName;
                saveData();
                renderDashboard();
                showToast("Назву картки змінено за 1,000,000 USD");
                addTransaction(currentUser.username, 'card_name_change', 1000000, 'USD', 'Зміна назви картки');
            } else {
                showToast("Недостатньо USD (потрібно 1,000,000)", true);
            }
        }
    }
}

// Вибір кольору картки
function openColorModal() {
    let modal = document.getElementById('color-modal');
    let goldOption = document.getElementById('gold-option');
    if (users[currentUser.username].status === 'vip' || users[currentUser.username].status === 'manager' || users[currentUser.username].status === 'businessman' || users[currentUser.username].status === 'admin') {
        goldOption.style.display = 'block';
    } else {
        goldOption.style.display = 'none';
    }
    modal.style.display = 'flex';
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.onclick = () => {
            let color = opt.getAttribute('data-color');
            users[currentUser.username].cardColor = color;
            saveData();
            renderDashboard();
            modal.style.display = 'none';
            showToast(`Колір картки змінено на ${color}`);
        };
    });
    document.querySelector('.close').onclick = () => { modal.style.display = 'none'; };
}
window.openColorModal = openColorModal;

// Логін
document.getElementById('login-btn')?.addEventListener('click',()=>{
    let u = document.getElementById('login-username').value;
    let p = document.getElementById('login-password').value;
    if(users[u] && users[u].password === p && !users[u].isBanned){
        currentUser = { username: u, isAdmin: users[u].isAdmin || false };
        users[u].lastSeen = Date.now();
        let diff = (Date.now() - users[u].lastSeen)/60000;
        if(diff>0 && diff<10080){
            let inc = statuses[users[u].status].offlineIncome * diff;
            users[u].balance += inc;
            if(inc>0) addTransaction(u, 'offline_income', inc, 'UAH', `Офлайн дохід за ${diff.toFixed(2)} хв`);
        }
        saveData();
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        if(currentUser.isAdmin) document.getElementById('admin-panel-btn').style.display = 'flex';
        updateUI();
        navigate('dashboard');
        setInterval(()=>{ if(currentUser) updateUI(); }, 1000);
        checkGlobalMessage();
        updateSpecialTitles();
        document.getElementById('change-pin-btn')?.addEventListener('click', changeCvv);
        document.getElementById('change-card-name-btn')?.addEventListener('click', changeCardName);
        document.getElementById('change-card-color-btn')?.addEventListener('click', openColorModal);
        document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
            currentLang = currentLang === 'uk' ? 'en' : 'uk';
            document.getElementById('lang-toggle-btn').innerHTML = currentLang === 'uk' ? '<i class="fas fa-language"></i> EN' : '<i class="fas fa-language"></i> UA';
            updateStaticTexts();
            let currentPage = document.querySelector('.sidebar-nav button.active')?.getAttribute('data-page') || 'dashboard';
            navigate(currentPage);
        });
        document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            document.getElementById('sound-toggle-btn').innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        });
        let vipBtn = document.getElementById('vip-giveaway-btn');
        if (users[u].status === 'vip' || users[u].status === 'businessman' || users[u].status === 'manager' || users[u].status === 'admin') {
            vipBtn.style.display = 'inline-block';
            vipBtn.onclick = vipGiveaway;
        } else {
            vipBtn.style.display = 'none';
        }
    } else alert('Невірний логін/пароль або бан');
});
document.getElementById('register-btn')?.addEventListener('click',()=>{
    let u = document.getElementById('reg-username').value;
    let p = document.getElementById('reg-password').value;
    if(!u || users[u]) alert('Користувач існує');
    else {
        users[u] = {
            password: p, balance: 500, usdBalance: 0, status: 'none', isAdmin: false, isBanned: false,
            crypto: {}, stocks: {}, businesses: [], realties: [], cars: [],
            card: generateCardData(), cardColor: 'black', cardName: 'Virtual Card',
            cardCvv: Math.floor(100 + Math.random()*900).toString(), cvvChanged: false,
            lastSeen: Date.now(), clickMultiplier: 1, multiplierExpiry: 0,
            transactions: [], specialTitles: [], vipGiveawayDate: null
        };
        saveData();
        alert('Реєстрація успішна! Увійдіть');
    }
});
function logout() {
    if(currentUser) users[currentUser.username].lastSeen = Date.now();
    saveData();
    currentUser = null;
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
}
document.getElementById('logout-btn')?.addEventListener('click',logout);
document.querySelectorAll('.sidebar-nav button').forEach(btn=>{
    btn.addEventListener('click',()=>{
        if(btn.id==='logout-btn') return;
        let page = btn.getAttribute('data-page');
        if(page) navigate(page);
        else if(btn.id==='admin-panel-btn') navigate('admin');
    });
});
loadData();
document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
        document.getElementById(`${btn.dataset.tab}-form`).classList.add('active');
    });
});

// Функція перевірки нових повідомлень (глобальне)
function checkGlobalMessage() {
    if (globalMessage && currentUser && globalMessage.timestamp > (users[currentUser.username].lastSeen || 0)) {
        showToast(`📢 ${globalMessage.text}`, false);
    }
}
setInterval(checkGlobalMessage, 30000);