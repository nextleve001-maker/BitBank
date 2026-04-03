const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let currentData = null;
let allPlayers = [];
let onlinePlayers = [];
let gameState = { id: 1, support_bank: 0, commission_bank: 0, global_message: "" };
let lang = 'ua';
let activeBattleId = null;
let soundEnabled = true;

const LANG = {
    ua: {
        loginTab: "Вхід", registerTab: "Реєстрація", loginBtn: "Увійти", registerBtn: "Створити акаунт",
        usernamePh: "Ім'я користувача", passwordPh: "Пароль", uah: "UAH", usd: "USD",
        navProfile: "Профіль", navClasses: "Класи", navTransfers: "Перекази", navCrypto: "Крипта",
        navStocks: "Акції", navBusinesses: "Бізнеси", navRealty: "Нерухомість", navCars: "Авто",
        navFriends: "Друзі", navBattle: "Дуель", navCasino: "Казино", navHistory: "Історія",
        navTop: "Топ 100", navSupport: "Підтримка", navAdmin: "Адмінка", logoutBtn: "Вийти",
        soundBtn: "Звук: Увімк", clickBtn: "TAP!", vipGiveawayBtn: "VIP Giveaway",
        changePinBtn: "Змінити CVV", changeCardNameBtn: "Змінити ім'я", changeCardColorBtn: "Змінити колір",
        closeBtn: "Закрити", selectColor: "Оберіть колір", buyBtn: "Купити", sellBtn: "Продати", upgradeBtn: "Покращити"
    },
    en: {
        loginTab: "Login", registerTab: "Register", loginBtn: "Sign In", registerBtn: "Create Account",
        usernamePh: "Username", passwordPh: "Password", uah: "UAH", usd: "USD",
        navProfile: "Profile", navClasses: "Classes", navTransfers: "Transfers", navCrypto: "Crypto",
        navStocks: "Stocks", navBusinesses: "Businesses", navRealty: "Realty", navCars: "Cars",
        navFriends: "Friends", navBattle: "Battle", navCasino: "Casino", navHistory: "History",
        navTop: "Top 100", navSupport: "Support", navAdmin: "Admin", logoutBtn: "Logout",
        soundBtn: "Sound: On", clickBtn: "TAP!", vipGiveawayBtn: "VIP Giveaway",
        changePinBtn: "Change CVV", changeCardNameBtn: "Change Name", changeCardColorBtn: "Change Color",
        closeBtn: "Close", selectColor: "Select Color", buyBtn: "Buy", sellBtn: "Sell", upgradeBtn: "Upgrade"
    }
};

const CLASSES = [
    { id: "none", title: "Новачок", price: 0, clickReward: 1, passivePerMin: 0, req: "" },
    { id: "basic", title: "Базовий", price: 5000, clickReward: 5, passivePerMin: 10, req: "" },
    { id: "medium", title: "Середній", price: 25000, clickReward: 15, passivePerMin: 50, req: "" },
    { id: "trader", title: "Трейдер", price: 100000, clickReward: 50, passivePerMin: 200, req: "Відкриває акції" },
    { id: "vip", title: "VIP", price: 500000, clickReward: 200, passivePerMin: 1000, req: "Відкриває VIP Giveaway" },
    { id: "businessman", title: "Бізнесмен", price: 2000000, clickReward: 500, passivePerMin: 5000, req: "Відкриває бізнеси" },
    { id: "manager", title: "Менеджер", price: 10000000, clickReward: 2000, passivePerMin: 25000, req: "Макс дохід" },
    { id: "creator", title: "Творець", price: 0, clickReward: 9999, passivePerMin: 99999, req: "God mode" }
];

const CRYPTO = [
    { id: "BTC", name: "Bitcoin", price: 65000, img: "https://placehold.co/400x300/f59e0b/fff?text=BTC" },
    { id: "ETH", name: "Ethereum", price: 3500, img: "https://placehold.co/400x300/3b82f6/fff?text=ETH" },
    { id: "BNB", name: "Binance Coin", price: 600, img: "https://placehold.co/400x300/fcd34d/000?text=BNB" },
    { id: "SOL", name: "Solana", price: 150, img: "https://placehold.co/400x300/10b981/fff?text=SOL" },
    { id: "XRP", name: "Ripple", price: 0.6, img: "https://placehold.co/400x300/000000/fff?text=XRP" },
    { id: "ADA", name: "Cardano", price: 0.5, img: "https://placehold.co/400x300/2563eb/fff?text=ADA" },
    { id: "DOGE", name: "Dogecoin", price: 0.15, img: "https://placehold.co/400x300/fbbf24/000?text=DOGE" },
    { id: "TON", name: "Toncoin", price: 7, img: "https://placehold.co/400x300/3b82f6/fff?text=TON" },
    { id: "DOT", name: "Polkadot", price: 8, img: "https://placehold.co/400x300/ec4899/fff?text=DOT" },
    { id: "AVAX", name: "Avalanche", price: 40, img: "https://placehold.co/400x300/ef4444/fff?text=AVAX" }
];

const STOCKS = [
    { id: "AAPL", name: "Apple", price: 170, img: "https://placehold.co/400x300/000/fff?text=AAPL" },
    { id: "MSFT", name: "Microsoft", price: 400, img: "https://placehold.co/400x300/10b981/fff?text=MSFT" },
    { id: "GOOGL", name: "Google", price: 140, img: "https://placehold.co/400x300/ef4444/fff?text=GOOGL" },
    { id: "AMZN", name: "Amazon", price: 180, img: "https://placehold.co/400x300/f59e0b/000?text=AMZN" },
    { id: "TSLA", name: "Tesla", price: 200, img: "https://placehold.co/400x300/dc2626/fff?text=TSLA" },
    { id: "NVDA", name: "NVIDIA", price: 900, img: "https://placehold.co/400x300/10b981/000?text=NVDA" },
    { id: "META", name: "Meta", price: 500, img: "https://placehold.co/400x300/3b82f6/fff?text=META" },
    { id: "INTC", name: "Intel", price: 40, img: "https://placehold.co/400x300/2563eb/fff?text=INTC" },
    { id: "AMD", name: "AMD", price: 160, img: "https://placehold.co/400x300/000/fff?text=AMD" },
    { id: "NFLX", name: "Netflix", price: 600, img: "https://placehold.co/400x300/ef4444/fff?text=NFLX" }
];

const BUSINESSES = [
    { id: "biz1", name: "Кав'ярня", price: 50000, income: 100, img: "https://placehold.co/400x300/78350f/fff?text=Coffee" },
    { id: "biz2", name: "Магазин", price: 150000, income: 350, img: "https://placehold.co/400x300/1e40af/fff?text=Shop" },
    { id: "biz3", name: "Фітнес-клуб", price: 500000, income: 1200, img: "https://placehold.co/400x300/065f46/fff?text=Fitness" },
    { id: "biz4", name: "Готель", price: 2000000, income: 5000, img: "https://placehold.co/400x300/6b21a8/fff?text=Hotel" },
    { id: "biz5", name: "IT Студія", price: 5000000, income: 15000, img: "https://placehold.co/400x300/374151/fff?text=IT" },
    { id: "biz6", name: "Ресторан", price: 10000000, income: 35000, img: "https://placehold.co/400x300/991b1b/fff?text=Restaurant" },
    { id: "biz7", name: "Торговий центр", price: 50000000, income: 200000, img: "https://placehold.co/400x300/0f766e/fff?text=Mall" },
    { id: "biz8", name: "Фабрика", price: 100000000, income: 450000, img: "https://placehold.co/400x300/475569/fff?text=Factory" },
    { id: "biz9", name: "Авіакомпанія", price: 500000000, income: 2500000, img: "https://placehold.co/400x300/0284c7/fff?text=Airlines" },
    { id: "biz10", name: "Банк", price: 1000000000, income: 6000000, img: "https://placehold.co/400x300/166534/fff?text=Bank" }
];

const REALTY = [
    { id: "r1", name: "Пальмовий острів", price: 10000000, img: "https://placehold.co/400x300/059669/fff?text=Palm+Island" },
    { id: "r2", name: "Вулканічний острів", price: 15000000, img: "https://placehold.co/400x300/b91c1c/fff?text=Volcano" },
    { id: "r3", name: "Райський острів", price: 25000000, img: "https://placehold.co/400x300/0284c7/fff?text=Paradise" },
    { id: "r4", name: "Острів скарбів", price: 50000000, img: "https://placehold.co/400x300/d97706/fff?text=Treasure" },
    { id: "r5", name: "Sky Villa", price: 75000000, img: "https://placehold.co/400x300/6366f1/fff?text=Sky+Villa" },
    { id: "r6", name: "Ocean Home", price: 100000000, img: "https://placehold.co/400x300/0891b2/fff?text=Ocean" },
    { id: "r7", name: "Luxury Penthouse", price: 250000000, img: "https://placehold.co/400x300/4f46e5/fff?text=Penthouse" },
    { id: "r8", name: "Lake House", price: 400000000, img: "https://placehold.co/400x300/0d9488/fff?text=Lake" },
    { id: "r9", name: "Castle", price: 750000000, img: "https://placehold.co/400x300/475569/fff?text=Castle" },
    { id: "r10", name: "Private Resort", price: 1000000000, img: "https://placehold.co/400x300/be185d/fff?text=Resort" }
];

const CARS = [
    { id: "c1", name: "Toyota Corolla", priceUsd: 20000, img: "https://placehold.co/400x300/94a3b8/000?text=Corolla" },
    { id: "c2", name: "Honda Civic", priceUsd: 25000, img: "https://placehold.co/400x300/dc2626/fff?text=Civic" },
    { id: "c3", name: "BMW 3 Series", priceUsd: 45000, img: "https://placehold.co/400x300/1e3a8a/fff?text=BMW" },
    { id: "c4", name: "Tesla Model 3", priceUsd: 50000, img: "https://placehold.co/400x300/f1f5f9/000?text=Tesla" },
    { id: "c5", name: "Mercedes G-Class", priceUsd: 150000, img: "https://placehold.co/400x300/000000/fff?text=G-Class" },
    { id: "c6", name: "Lamborghini Huracan", priceUsd: 300000, img: "https://placehold.co/400x300/facc15/000?text=Lambo" },
    { id: "c7", name: "Porsche 911", priceUsd: 200000, img: "https://placehold.co/400x300/991b1b/fff?text=Porsche" },
    { id: "c8", name: "Audi RS7", priceUsd: 120000, img: "https://placehold.co/400x300/475569/fff?text=Audi" },
    { id: "c9", name: "Ferrari F8", priceUsd: 350000, img: "https://placehold.co/400x300/dc2626/fff?text=Ferrari" },
    { id: "c10", name: "Rolls-Royce Cullinan", priceUsd: 450000, img: "https://placehold.co/400x300/1e293b/fff?text=Rolls-Royce" }
];

const COLORS = ["linear-gradient(135deg, #1e3a8a, #3b82f6)", "linear-gradient(135deg, #7f1d1d, #ef4444)", "linear-gradient(135deg, #14532d, #10b981)", "linear-gradient(135deg, #4c1d95, #8b5cf6)", "linear-gradient(135deg, #000000, #333333)", "linear-gradient(135deg, #78350f, #f59e0b)"];

function ce(tag, className, text, props) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    if (props) {
        for (let k in props) {
            if (k === 'onclick') el.onclick = props[k];
            else if (k === 'onerror') el.onerror = props[k];
            else el.setAttribute(k, props[k]);
        }
    }
    return el;
}

function t(key) { return LANG[lang][key] || key; }
function formatMoney(num) { return Number(num).toLocaleString('en-US'); }
function currentDeviceType() { return /Mobi|Android/i.test(navigator.userAgent) ? 'phone' : 'desktop'; }
function classIndex(clsId) { return CLASSES.findIndex(c => c.id === clsId); }
function getClassInfo(id) { return CLASSES.find(c => c.id === id) || CLASSES[0]; }

async function fetchAllPlayers() {
    const { data } = await supabaseClient.from("players").select("*");
    if (data) {
        allPlayers = data;
        onlinePlayers = data.filter(p => (new Date() - new Date(p.last_seen)) < 60000);
        if(currentUser) {
            const me = data.find(p => p.username === currentUser);
            if(me) currentData = me;
        }
    }
}

async function fetchGameState() {
    const { data } = await supabaseClient.from("game_state").select("*").eq("id", 1).single();
    if (data) gameState = data;
}

async function saveGameState() {
    await supabaseClient.from("game_state").upsert({
        id: 1, support_bank: gameState.support_bank, commission_bank: gameState.commission_bank, global_message: gameState.global_message
    });
}

async function appendHistory(username, text, amount) {
    await supabaseClient.from("history").insert({ username, text, amount });
}

async function fetchHistory(username) {
    const { data } = await supabaseClient.from("history").select("*").eq("username", username).order("created_at", { ascending: false }).limit(100);
    return data || [];
}

async function updatePlayer(username, patch) {
    await supabaseClient.from("players").update(patch).eq("username", username);
}

function applyOfflineIncome(user) {
    if(!user.last_seen || user.class === 'none') return;
    const mins = Math.floor((new Date() - new Date(user.last_seen)) / 60000);
    if(mins > 0) {
        let cls = getClassInfo(user.class);
        let earned = mins * cls.passivePerMin;
        if(earned > 0) {
            updatePlayer(user.username, { balance: user.balance + earned, total_earned: user.total_earned + earned });
            appendHistory(user.username, "Offline income", earned);
        }
    }
}

function checkAndGrantTitles(user) {
    let newTitles = [...user.titles];
    if(user.total_earned >= 10000 && !newTitles.includes("💸 10K Earned")) newTitles.push("💸 10K Earned");
    if(user.total_earned >= 100000 && !newTitles.includes("🏆 100K Earned")) newTitles.push("🏆 100K Earned");
    if(user.businesses && user.businesses.length >= 3 && !newTitles.includes("🏢 Бізнесмен")) newTitles.push("🏢 Бізнесмен");
    if(user.realty && user.realty.length >= 2 && !newTitles.includes("🏝 Магнат")) newTitles.push("🏝 Магнат");
    if(user.cars && user.cars.length >= 2 && !newTitles.includes("🚗 Колекціонер")) newTitles.push("🚗 Колекціонер");
    if(user.username === 'creator' && !newTitles.includes("👑 Засновник")) newTitles.push("👑 Засновник");
    
    if(newTitles.length > user.titles.length) {
        updatePlayer(user.username, { titles: newTitles });
    }
}

async function createPlayer(username, password) {
    const isCreator = username === 'creator' && password === '9creator9';
    const initClass = isCreator ? 'creator' : 'none';
    const newP = {
        username, password, class: initClass, balance: 1000, usd: 0, total_earned: 1000,
        crypto: {}, stocks: {}, businesses: [], business_levels: {}, realty: [], cars: [], titles: [], friends: [],
        card_name: username.toUpperCase(), card_color: COLORS[0], card_cvv: Math.floor(100+Math.random()*900).toString(),
        card_number: Array.from({length:4}, ()=>Math.floor(1000+Math.random()*9000)).join(' '), card_expiry: "12/28",
        device: currentDeviceType(), banned: false, last_seen: new Date().toISOString(), last_bonus_day: "", vip_giveaway_day: ""
    };
    await supabaseClient.from("players").insert(newP);
    if(isCreator) await supabaseClient.from("players").update({ titles: ["👑 Засновник"] }).eq("username", username);
}

async function registerUser() {
    const u = document.getElementById("register-username").value.trim();
    const p = document.getElementById("register-password").value.trim();
    if(u.length<3 || p.length<3) return alert("Min 3 chars");
    const { data } = await supabaseClient.from("players").select("*").eq("username", u).maybeSingle();
    if(data) return alert("User exists");
    await createPlayer(u, p);
    alert("Registered! Now login.");
    document.getElementById("tab-login").click();
}

async function loginUser() {
    const u = document.getElementById("login-username").value.trim();
    const p = document.getElementById("login-password").value.trim();
    const { data } = await supabaseClient.from("players").select("*").eq("username", u).eq("password", p).maybeSingle();
    if(!data) return alert("Wrong credentials");
    if(data.banned) return alert("You are banned");
    localStorage.setItem("bb_session", u);
    currentUser = u;
    currentData = data;
    applyOfflineIncome(data);
    initAppSession();
}

function logoutUser() {
    localStorage.removeItem("bb_session");
    location.reload();
}

function updateHeader() {
    if(!currentData) return;
    document.getElementById("header-username").textContent = currentData.username;
    document.getElementById("header-status").textContent = getClassInfo(currentData.class).title;
    document.getElementById("balance-uah").textContent = formatMoney(currentData.balance);
    document.getElementById("balance-usd").textContent = formatMoney(currentData.usd);
    document.getElementById("header-online").textContent = `Online: ${onlinePlayers.length}`;
    document.getElementById("header-device").textContent = currentData.device;
    document.getElementById("global-message").textContent = gameState.global_message || "Welcome to BitBank!";
    document.getElementById("admin-nav").classList.toggle("hidden", currentData.class !== 'creator');
    document.getElementById("vip-giveaway-btn").classList.toggle("hidden", classIndex(currentData.class) < classIndex('vip'));
    
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if(LANG[lang][key]) el.textContent = LANG[lang][key];
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if(LANG[lang][key]) el.placeholder = LANG[lang][key];
    });
}

function renderPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("page-" + pageId).classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelector(`.nav-btn[data-page="${pageId}"]`)?.classList.add("active");
    if(window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.add("hidden");

    if(pageId === 'profile') renderProfilePage();
    if(pageId === 'classes') renderClassesPage();
    if(pageId === 'transfers') renderTransfersPage();
    if(pageId === 'crypto') renderCryptoPage();
    if(pageId === 'stocks') renderStocksPage();
    if(pageId === 'businesses') renderBusinessPage();
    if(pageId === 'realty') renderRealtyPage();
    if(pageId === 'cars') renderCarsPage();
    if(pageId === 'friends') renderFriendsPage();
    if(pageId === 'battle') renderBattlePage();
    if(pageId === 'casino') renderCasinoPage();
    if(pageId === 'history') renderHistoryPage();
    if(pageId === 'top') renderTopPage();
    if(pageId === 'support') renderSupportPage();
    if(pageId === 'admin') renderAdminPage();
}

function playSound() { if(soundEnabled) { let a = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); a.volume = 0.2; a.play().catch(()=>{}); } }

async function handleClickIncome() {
    if(!currentData) return;
    playSound();
    let r = getClassInfo(currentData.class).clickReward;
    let nb = currentData.balance + r;
    let te = currentData.total_earned + r;
    currentData.balance = nb; currentData.total_earned = te;
    document.getElementById("balance-uah").textContent = formatMoney(nb);
    await updatePlayer(currentUser, { balance: nb, total_earned: te });
    checkAndGrantTitles(currentData);
}

function renderProfilePage() {
    const cc = document.querySelector(".card-container");
    cc.innerHTML = "";
    const bc = ce("div", "bank-card");
    bc.style.background = currentData.card_color || COLORS[0];
    bc.appendChild(ce("div", "card-chip"));
    bc.appendChild(ce("div", "card-number", currentData.card_number));
    const foot = ce("div", "card-footer");
    foot.appendChild(ce("div", "card-name", currentData.card_name));
    const dates = ce("div", "card-dates");
    dates.appendChild(ce("span", "", `EXP: ${currentData.card_expiry}`));
    dates.appendChild(ce("span", "", `CVV: ***`));
    foot.appendChild(dates);
    bc.appendChild(foot);
    cc.appendChild(bc);

    const sg = document.getElementById("profile-stats");
    sg.innerHTML = "";
    const cls = getClassInfo(currentData.class);
    const stats = [
        ["ID", currentData.id],
        ["Class", cls.title],
        ["Click Income", formatMoney(cls.clickReward)],
        ["Passive / min", formatMoney(cls.passivePerMin)],
        ["Total Earned", formatMoney(currentData.total_earned)],
        ["Titles", currentData.titles.join(", ") || "None"]
    ];
    stats.forEach(s => {
        let b = ce("div", "stat-box");
        b.appendChild(ce("div", "stat-title", s[0]));
        b.appendChild(ce("div", "stat-val", s[1]));
        sg.appendChild(b);
    });
}

function renderClassesPage() {
    const g = document.getElementById("classes-grid");
    g.innerHTML = "";
    CLASSES.forEach((c, idx) => {
        let card = ce("div", "item-card", "", {style: "padding:15px;"});
        card.appendChild(ce("div", "item-title", c.title));
        card.appendChild(ce("div", "item-row", `Price: ${formatMoney(c.price)} UAH`));
        card.appendChild(ce("div", "item-row", `Click: ${c.clickReward}`));
        card.appendChild(ce("div", "item-row", `Passive: ${c.passivePerMin}/min`));
        if(c.req) card.appendChild(ce("div", "item-row", c.req, {style: "color:var(--warning)"}));
        let currIdx = classIndex(currentData.class);
        if(idx === currIdx) {
            let btn = ce("button", "secondary-btn", "Current", {disabled: true});
            card.appendChild(btn);
        } else if(idx === currIdx + 1) {
            let btn = ce("button", "primary-btn", t("buyBtn"), { onclick: async () => {
                if(currentData.balance >= c.price) {
                    await updatePlayer(currentUser, { balance: currentData.balance - c.price, class: c.id });
                    await appendHistory(currentUser, `Bought class ${c.title}`, c.price);
                    alert("Class upgraded!");
                } else alert("Not enough money");
            }});
            card.appendChild(btn);
        }
        g.appendChild(card);
    });
}

function renderAssetPage(gridId, array, type) {
    const g = document.getElementById(gridId);
    g.innerHTML = "";
    array.forEach(item => {
        let card = ce("div", "item-card");
        card.appendChild(ce("img", "item-img", "", { src: item.img, onerror: "this.src='https://placehold.co/400x300/dc2626/fff?text=Error'" }));
        let info = ce("div", "item-info");
        info.appendChild(ce("div", "item-title", item.name || item.id));
        
        let pText = item.price ? `${formatMoney(item.price)} UAH` : `${formatMoney(item.priceUsd)} USD`;
        info.appendChild(ce("div", "item-row", `Price: ${pText}`));

        let owns = 0;
        if(type === 'crypto') owns = currentData.crypto[item.id] || 0;
        if(type === 'stock') owns = currentData.stocks[item.id] || 0;
        if(type === 'biz') owns = currentData.businesses.includes(item.id) ? 1 : 0;
        if(type === 'realty') owns = currentData.realty.includes(item.id) ? 1 : 0;
        if(type === 'car') owns = currentData.cars.includes(item.id) ? 1 : 0;

        info.appendChild(ce("div", "item-row", `You own: ${owns}`));

        if(type === 'biz' && owns) {
            let lvl = currentData.business_levels[item.id] || 1;
            let inc = item.income * lvl;
            info.appendChild(ce("div", "item-row", `Level: ${lvl} | Income: ${formatMoney(inc)}/min`));
            let upPrice = item.price * lvl;
            let upBtn = ce("button", "primary-btn", `${t("upgradeBtn")} (${formatMoney(upPrice)})`, { onclick: async () => {
                if(currentData.balance >= upPrice) {
                    currentData.business_levels[item.id] = lvl + 1;
                    await updatePlayer(currentUser, { balance: currentData.balance - upPrice, business_levels: currentData.business_levels });
                    renderBusinessPage();
                } else alert("Not enough money");
            }});
            info.appendChild(upBtn);
        } else if ((type === 'biz' || type === 'realty' || type === 'car') && !owns) {
            let btn = ce("button", "primary-btn", t("buyBtn"), { onclick: async () => {
                let cost = item.price || item.priceUsd;
                let bal = item.price ? currentData.balance : currentData.usd;
                if(bal >= cost) {
                    let patch = {};
                    if(item.price) patch.balance = currentData.balance - cost;
                    else patch.usd = currentData.usd - cost;
                    
                    if(type === 'biz') { patch.businesses = [...currentData.businesses, item.id]; patch.business_levels = {...currentData.business_levels, [item.id]: 1}; }
                    if(type === 'realty') patch.realty = [...currentData.realty, item.id];
                    if(type === 'car') patch.cars = [...currentData.cars, item.id];
                    
                    await updatePlayer(currentUser, patch);
                    await appendHistory(currentUser, `Bought ${item.name}`, cost);
                    checkAndGrantTitles(currentData);
                } else alert("Not enough funds");
            }});
            info.appendChild(btn);
        } else if (type === 'crypto' || type === 'stock') {
            let row = ce("div", "", "", {style:"display:flex;gap:5px;margin-top:10px"});
            let inp = ce("input", "", "", {type:"number", placeholder:"Amount", id:`amt-${item.id}`});
            let bBtn = ce("button", "primary-btn", t("buyBtn"), { onclick: async () => {
                let amt = parseFloat(document.getElementById(`amt-${item.id}`).value);
                if(!amt || amt <= 0) return;
                let cost = amt * item.price;
                if(currentData.balance >= cost) {
                    let patch = { balance: currentData.balance - cost };
                    let obj = type === 'crypto' ? {...currentData.crypto} : {...currentData.stocks};
                    obj[item.id] = (obj[item.id] || 0) + amt;
                    if(type==='crypto') patch.crypto = obj; else patch.stocks = obj;
                    await updatePlayer(currentUser, patch);
                    await appendHistory(currentUser, `Bought ${amt} ${item.id}`, cost);
                } else alert("Not enough money");
            }});
            let sBtn = ce("button", "danger-btn", t("sellBtn"), { onclick: async () => {
                let amt = parseFloat(document.getElementById(`amt-${item.id}`).value);
                if(!amt || amt <= 0) return;
                let obj = type === 'crypto' ? {...currentData.crypto} : {...currentData.stocks};
                if((obj[item.id] || 0) >= amt) {
                    let gain = amt * item.price;
                    let patch = { balance: currentData.balance + gain };
                    obj[item.id] -= amt;
                    if(type==='crypto') patch.crypto = obj; else patch.stocks = obj;
                    await updatePlayer(currentUser, patch);
                    await appendHistory(currentUser, `Sold ${amt} ${item.id}`, gain);
                } else alert("Not enough assets");
            }});
            row.appendChild(inp); row.appendChild(bBtn); row.appendChild(sBtn);
            info.appendChild(row);
        }
        card.appendChild(info);
        g.appendChild(card);
    });
}

function renderCryptoPage() { renderAssetPage("crypto-grid", CRYPTO, "crypto"); }
function renderStocksPage() { 
    if(classIndex(currentData.class) < classIndex('trader')) {
        document.getElementById("stocks-grid").innerHTML = "<h3>Requires Trader class</h3>";
        return;
    }
    renderAssetPage("stocks-grid", STOCKS, "stock"); 
}
function renderBusinessPage() {
    if(classIndex(currentData.class) < classIndex('businessman')) {
        document.getElementById("businesses-grid").innerHTML = "<h3>Requires Businessman class</h3>";
        return;
    }
    renderAssetPage("businesses-grid", BUSINESSES, "biz");
}
function renderRealtyPage() { renderAssetPage("realty-grid", REALTY, "realty"); }
function renderCarsPage() { renderAssetPage("cars-grid", CARS, "car"); }

function renderTransfersPage() {
    const c = document.getElementById("transfers-container");
    c.innerHTML = `<h3>Transfer Funds (5% fee UAH/USD, 1% Crypto)</h3>`;
    c.appendChild(ce("input", "", "", {id:"tr-rec", placeholder:"Recipient Username"}));
    c.appendChild(ce("input", "", "", {id:"tr-cvv", placeholder:"Your CVV", type:"password"}));
    
    let sel = ce("select", "", "", {id:"tr-curr", style:"padding:10px;background:var(--bg-color);color:white;"});
    sel.appendChild(ce("option", "", "UAH", {value:"UAH"}));
    sel.appendChild(ce("option", "", "USD", {value:"USD"}));
    CRYPTO.forEach(cr => sel.appendChild(ce("option", "", cr.id, {value:cr.id})));
    c.appendChild(sel);
    
    c.appendChild(ce("input", "", "", {id:"tr-amt", placeholder:"Amount", type:"number"}));
    
    c.appendChild(ce("button", "primary-btn", "Send", { onclick: async () => {
        let rec = document.getElementById("tr-rec").value.trim();
        let cvv = document.getElementById("tr-cvv").value.trim();
        let curr = document.getElementById("tr-curr").value;
        let amt = parseFloat(document.getElementById("tr-amt").value);
        if(!rec || !cvv || !amt || amt<=0) return alert("Invalid inputs");
        if(cvv !== currentData.card_cvv) return alert("Wrong CVV");
        if(rec === currentUser) return alert("Cannot send to yourself");
        let target = allPlayers.find(p => p.username === rec);
        if(!target) return alert("User not found");
        
        let fee = curr === "UAH" || curr === "USD" ? amt * 0.05 : amt * 0.01;
        let total = amt + fee;

        if(curr === "UAH") {
            if(currentData.balance < total) return alert("Not enough UAH");
            await updatePlayer(currentUser, { balance: currentData.balance - total });
            await updatePlayer(target.username, { balance: target.balance + amt });
            gameState.commission_bank += fee;
        } else if(curr === "USD") {
            if(currentData.usd < total) return alert("Not enough USD");
            await updatePlayer(currentUser, { usd: currentData.usd - total });
            await updatePlayer(target.username, { usd: target.usd + amt });
            gameState.commission_bank += fee * 40; // Approx UAH value
        } else {
            let myCr = currentData.crypto[curr] || 0;
            if(myCr < total) return alert(`Not enough ${curr}`);
            let crPrice = CRYPTO.find(c=>c.id===curr).price;
            let myNew = {...currentData.crypto}; myNew[curr] -= total;
            let tNew = {...target.crypto}; tNew[curr] = (tNew[curr]||0) + amt;
            await updatePlayer(currentUser, { crypto: myNew });
            await updatePlayer(target.username, { crypto: tNew });
            gameState.commission_bank += fee * crPrice;
        }
        await saveGameState();
        await appendHistory(currentUser, `Sent ${amt} ${curr} to ${rec}`, total);
        alert("Transfer success");
        renderTransfersPage();
    }}));
}

function renderFriendsPage() {
    const c = document.getElementById("friends-container");
    c.innerHTML = `<h3>Your ID: <span class="highlight">${currentData.id}</span></h3>`;
    let row = ce("div", "", "", {style:"display:flex;gap:10px;margin-bottom:20px"});
    row.appendChild(ce("input", "", "", {id:"add-friend-id", placeholder:"Friend ID", type:"number"}));
    row.appendChild(ce("button", "primary-btn", "Add Friend", { onclick: async () => {
        let fid = parseInt(document.getElementById("add-friend-id").value);
        if(!fid || fid === currentData.id) return;
        let target = allPlayers.find(p => p.id === fid);
        if(!target) return alert("Not found");
        if(currentData.friends.includes(fid)) return alert("Already friends");
        await updatePlayer(currentUser, { friends: [...currentData.friends, fid] });
        await updatePlayer(target.username, { friends: [...target.friends, currentData.id] });
        alert("Added!");
    }}));
    c.appendChild(row);

    currentData.friends.forEach(fid => {
        let f = allPlayers.find(p => p.id === fid);
        if(!f) return;
        let isOnline = onlinePlayers.some(p => p.id === fid);
        let item = ce("div", "list-item");
        let left = ce("div", "list-item-left");
        left.appendChild(ce("span", "highlight", f.username));
        left.appendChild(ce("span", "badge " + (isOnline ? "green" : "gray"), isOnline ? "Online" : "Offline"));
        item.appendChild(left);
        item.appendChild(ce("span", "", f.device));
        c.appendChild(item);
    });
}

function renderBattlePage() {
    const c = document.getElementById("battle-container");
    c.innerHTML = "";
    if(!activeBattleId) {
        let b = ce("div", "battle-side", "", {style:"grid-column:1/-1"});
        b.appendChild(ce("h3", "", "Create Battle"));
        b.appendChild(ce("input", "", "", {id:"battle-stake", type:"number", placeholder:"Stake UAH", style:"margin:10px 0"}));
        b.appendChild(ce("button", "huge-btn", "Create", {onclick: async () => {
            let s = parseFloat(document.getElementById("battle-stake").value);
            if(!s || s<=0 || currentData.balance < s) return alert("Invalid stake");
            await updatePlayer(currentUser, { balance: currentData.balance - s });
            const { data } = await supabaseClient.from("tap_battles").insert({
                creator_username: currentUser, stake: s, status: "waiting", creator_taps: 0, opponent_taps: 0
            }).select().single();
            activeBattleId = data.id;
            renderBattlePage();
        }}));
        c.appendChild(b);

        let list = ce("div", "list-container", "", {style:"grid-column:1/-1;margin-top:20px"});
        list.innerHTML = "<h3>Active Battles</h3>";
        supabaseClient.from("tap_battles").select("*").eq("status", "waiting").then(({data}) => {
            if(data) data.forEach(bat => {
                if(bat.creator_username === currentUser) return;
                let item = ce("div", "list-item");
                item.appendChild(ce("span", "", `${bat.creator_username} - ${bat.stake} UAH`));
                item.appendChild(ce("button", "primary-btn", "Join", {onclick: async () => {
                    if(currentData.balance < bat.stake) return alert("Not enough money");
                    await updatePlayer(currentUser, { balance: currentData.balance - bat.stake });
                    let ends = new Date(Date.now() + 60000).toISOString();
                    await supabaseClient.from("tap_battles").update({ opponent_username: currentUser, status: "active", started_at: new Date().toISOString(), ends_at: ends }).eq("id", bat.id);
                    activeBattleId = bat.id;
                }}));
                list.appendChild(item);
            });
        });
        c.appendChild(list);
    } else {
        supabaseClient.from("tap_battles").select("*").eq("id", activeBattleId).single().then(({data}) => {
            if(!data || data.status === 'finished') { activeBattleId = null; return renderBattlePage(); }
            
            let isCreator = data.creator_username === currentUser;
            let myTaps = isCreator ? data.creator_taps : data.opponent_taps;
            let opTaps = isCreator ? data.opponent_taps : data.creator_taps;
            let opName = isCreator ? (data.opponent_username || "Waiting...") : data.creator_username;

            let mySide = ce("div", "battle-side");
            mySide.appendChild(ce("h3", "", "You"));
            mySide.appendChild(ce("div", "battle-score", myTaps));
            if(data.status === 'active') mySide.appendChild(ce("button", "huge-btn", "TAP!", {onclick: async () => {
                let update = isCreator ? { creator_taps: data.creator_taps + 1 } : { opponent_taps: data.opponent_taps + 1 };
                await supabaseClient.from("tap_battles").update(update).eq("id", activeBattleId);
            }}));
            c.appendChild(mySide);

            let opSide = ce("div", "battle-side");
            opSide.appendChild(ce("h3", "", opName));
            opSide.appendChild(ce("div", "battle-score", opTaps));
            c.appendChild(opSide);
        });
    }
}

function renderCasinoPage() {
    const c = document.getElementById("casino-container");
    c.innerHTML = `<h3>Casino</h3>`;
    let games = ["Coin Flip (2x)", "Slots (10x)", "Dice (3x)"];
    games.forEach((g, idx) => {
        let b = ce("div", "admin-section");
        b.appendChild(ce("h4", "", g));
        b.appendChild(ce("input", "", "", {id:`cas-bet-${idx}`, type:"number", placeholder:"Bet UAH"}));
        b.appendChild(ce("button", "primary-btn", "Play", {onclick: async () => {
            let bet = parseFloat(document.getElementById(`cas-bet-${idx}`).value);
            if(!bet || bet<=0 || currentData.balance < bet) return alert("Invalid bet");
            let win = false; let mult = 0; let res = "";
            if(idx === 0) { win = Math.random() > 0.5; mult = 2; res = win ? "Heads" : "Tails"; }
            if(idx === 1) { win = Math.random() > 0.9; mult = 10; res = win ? "777" : "123"; }
            if(idx === 2) { win = Math.random() > 0.66; mult = 3; res = win ? "6" : "2"; }
            
            let finalBal = currentData.balance - bet;
            if(win) finalBal += bet * mult;
            await updatePlayer(currentUser, { balance: finalBal });
            await supabaseClient.from("casino_logs").insert({ username: currentUser, game: g, bet, result: win ? 'win' : 'lose' });
            alert(win ? `You won ${bet * mult}!` : "You lost.");
        }}));
        c.appendChild(b);
    });
}

function renderHistoryPage() {
    const c = document.getElementById("history-container");
    c.innerHTML = "<h3>History</h3>";
    fetchHistory(currentUser).then(hist => {
        hist.forEach(h => {
            let item = ce("div", "list-item");
            item.appendChild(ce("span", "", h.text));
            item.appendChild(ce("span", "highlight", formatMoney(h.amount)));
            c.appendChild(item);
        });
    });
}

function renderTopPage() {
    const c = document.getElementById("top-container");
    c.innerHTML = "<h3>Top 100 Players</h3>";
    let sorted = [...allPlayers].sort((a,b) => b.total_earned - a.total_earned).slice(0, 100);
    sorted.forEach((p, i) => {
        let item = ce("div", "list-item");
        let left = ce("div", "list-item-left");
        left.appendChild(ce("span", "highlight", `${i+1}. ${p.username}`));
        left.appendChild(ce("span", "badge", p.titles[0] || "No Title"));
        item.appendChild(left);
        item.appendChild(ce("span", "", `${formatMoney(p.total_earned)} UAH`));
        c.appendChild(item);
    });
}

function renderSupportPage() {
    const c = document.getElementById("support-container");
    c.innerHTML = `<h3>Support Bank: <span class="highlight">${formatMoney(gameState.support_bank)}</span></h3>`;
    c.appendChild(ce("input", "", "", {id:"sup-don", type:"number", placeholder:"Donation UAH", style:"margin:10px 0"}));
    c.appendChild(ce("button", "primary-btn", "Donate", {onclick: async () => {
        let amt = parseFloat(document.getElementById("sup-don").value);
        if(!amt || amt<=0 || currentData.balance < amt) return alert("Invalid");
        await updatePlayer(currentUser, { balance: currentData.balance - amt });
        gameState.support_bank += amt;
        await saveGameState();
        alert("Thanks!");
        renderSupportPage();
    }}));
}

function renderAdminPage() {
    if(currentData.class !== 'creator') return;
    const c = document.getElementById("admin-container");
    c.innerHTML = "<h3>Admin Panel</h3>";
    
    let stats = ce("div", "admin-section");
    stats.innerHTML = `<h4>Global Banks</h4>
    <p>Commission: ${formatMoney(gameState.commission_bank)} UAH</p>
    <p>Support: ${formatMoney(gameState.support_bank)} UAH</p>`;
    stats.appendChild(ce("button", "secondary-btn", "Collect Banks", {onclick: async () => {
        let total = gameState.commission_bank + gameState.support_bank;
        await updatePlayer(currentUser, { balance: currentData.balance + total });
        gameState.commission_bank = 0; gameState.support_bank = 0;
        await saveGameState(); alert("Collected");
    }}));
    c.appendChild(stats);

    let msg = ce("div", "admin-section");
    msg.appendChild(ce("input", "", "", {id:"adm-msg", placeholder:"Global Message"}));
    msg.appendChild(ce("button", "primary-btn", "Set Message", {onclick: async () => {
        gameState.global_message = document.getElementById("adm-msg").value;
        await saveGameState(); alert("Set");
    }}));
    c.appendChild(msg);

    let mass = ce("div", "admin-section");
    mass.appendChild(ce("h4", "", "Mass Actions (Online)"));
    mass.appendChild(ce("input", "", "", {id:"adm-mass", type:"number", placeholder:"Amount"}));
    mass.appendChild(ce("button", "primary-btn", "Give UAH to Online", {onclick: async () => {
        let amt = parseFloat(document.getElementById("adm-mass").value);
        if(!amt) return;
        for(let p of onlinePlayers) {
            await updatePlayer(p.username, { balance: p.balance + amt });
        }
        alert("Given");
    }}));
    c.appendChild(mass);

    let users = ce("div", "admin-section");
    users.appendChild(ce("h4", "", "Player Actions"));
    users.appendChild(ce("input", "", "", {id:"adm-u", placeholder:"Username"}));
    users.appendChild(ce("input", "", "", {id:"adm-amt", type:"number", placeholder:"Amount"}));
    
    let btnGrid = ce("div", "admin-grid");
    btnGrid.appendChild(ce("button", "primary-btn", "Give UAH", {onclick: () => admAct('give')}));
    btnGrid.appendChild(ce("button", "danger-btn", "Take UAH", {onclick: () => admAct('take')}));
    btnGrid.appendChild(ce("button", "danger-btn", "Ban", {onclick: () => admAct('ban')}));
    btnGrid.appendChild(ce("button", "secondary-btn", "Unban", {onclick: () => admAct('unban')}));
    users.appendChild(btnGrid);
    c.appendChild(users);
}

async function admAct(action) {
    let u = document.getElementById("adm-u").value.trim();
    let amt = parseFloat(document.getElementById("adm-amt").value);
    let target = allPlayers.find(p => p.username === u);
    if(!target) return alert("User not found");
    if(action === 'give' && amt) await updatePlayer(u, { balance: target.balance + amt });
    if(action === 'take' && amt) await updatePlayer(u, { balance: target.balance - amt });
    if(action === 'ban') await updatePlayer(u, { banned: true });
    if(action === 'unban') await updatePlayer(u, { banned: false });
    alert("Action done");
}

function passiveIncomeTick() {
    if(!currentData) return;
    let cls = getClassInfo(currentData.class);
    let passive = cls.passivePerMin;
    currentData.businesses.forEach(bid => {
        let b = BUSINESSES.find(x=>x.id===bid);
        if(b) passive += b.income * (currentData.business_levels[bid] || 1);
    });
    if(passive > 0) {
        let nb = currentData.balance + passive;
        let te = currentData.total_earned + passive;
        updatePlayer(currentUser, { balance: nb, total_earned: te });
    }
}

function presenceTick() {
    if(currentUser) {
        updatePlayer(currentUser, { last_seen: new Date().toISOString(), device: currentDeviceType() });
    }
}

function battleTick() {
    if(!activeBattleId) return;
    supabaseClient.from("tap_battles").select("*").eq("id", activeBattleId).single().then(({data}) => {
        if(data && data.status === 'active' && new Date() > new Date(data.ends_at)) {
            let win = null;
            if(data.creator_taps > data.opponent_taps) win = data.creator_username;
            else if (data.opponent_taps > data.creator_taps) win = data.opponent_username;
            
            supabaseClient.from("tap_battles").update({ status: "finished", winner_username: win }).eq("id", activeBattleId).then(async () => {
                if(win) {
                    let wPlayer = allPlayers.find(p => p.username === win);
                    if(wPlayer) await updatePlayer(win, { balance: wPlayer.balance + (data.stake * 2) });
                } else {
                    let cP = allPlayers.find(p => p.username === data.creator_username);
                    let oP = allPlayers.find(p => p.username === data.opponent_username);
                    if(cP) await updatePlayer(cP.username, { balance: cP.balance + data.stake });
                    if(oP) await updatePlayer(oP.username, { balance: oP.balance + data.stake });
                }
            });
        }
    });
}

function setupRealtime() {
    supabaseClient.channel("bb-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "players" }, payload => {
        let idx = allPlayers.findIndex(p => p.id === payload.new.id);
        if(idx !== -1) allPlayers[idx] = payload.new; else allPlayers.push(payload.new);
        if(payload.new.username === currentUser) { currentData = payload.new; updateHeader(); }
        onlinePlayers = allPlayers.filter(p => (new Date() - new Date(p.last_seen)) < 60000);
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "game_state" }, payload => {
        if(payload.new.id === 1) { gameState = payload.new; updateHeader(); }
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "tap_battles" }, payload => {
        if(activeBattleId === payload.new.id || payload.new.status === 'waiting') {
            if(document.getElementById("page-battle").classList.contains("hidden") === false) renderBattlePage();
        }
    })
    .subscribe();
}

function bindEvents() {
    document.getElementById("tab-login").onclick = (e) => {
        document.getElementById("login-form").classList.remove("hidden");
        document.getElementById("register-form").classList.add("hidden");
        document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
        e.target.classList.add("active");
    };
    document.getElementById("tab-register").onclick = (e) => {
        document.getElementById("register-form").classList.remove("hidden");
        document.getElementById("login-form").classList.add("hidden");
        document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
        e.target.classList.add("active");
    };

    document.getElementById("login-btn").onclick = loginUser;
    document.getElementById("register-btn").onclick = registerUser;
    document.getElementById("logout-btn").onclick = logoutUser;
    
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.onclick = () => renderPage(btn.getAttribute("data-page"));
    });

    document.getElementById("click-btn").onclick = handleClickIncome;
    document.getElementById("sidebar-open").onclick = () => {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("overlay").classList.remove("hidden");
    };
    document.getElementById("sidebar-close").onclick = () => {
        document.getElementById("sidebar").classList.remove("open");
        document.getElementById("overlay").classList.add("hidden");
    };
    document.getElementById("overlay").onclick = () => document.getElementById("sidebar-close").click();

    document.getElementById("lang-btn").onclick = () => {
        lang = lang === 'ua' ? 'en' : 'ua';
        document.getElementById("lang-btn").textContent = lang.toUpperCase();
        updateHeader(); renderPage(document.querySelector(".nav-btn.active")?.getAttribute("data-page") || 'profile');
    };
    document.getElementById("toggle-sound-btn").onclick = () => {
        soundEnabled = !soundEnabled;
        document.getElementById("toggle-sound-btn").textContent = soundEnabled ? t("soundBtn") : (lang==='ua'?"Звук: Вимк":"Sound: Off");
    };

    document.getElementById("change-pin-btn").onclick = async () => {
        let np = prompt("New CVV (3 digits):");
        if(np && np.length===3) { await updatePlayer(currentUser, {card_cvv: np}); alert("Changed!"); }
    };
    document.getElementById("change-card-name-btn").onclick = async () => {
        let nn = prompt("New Name:");
        if(nn) { await updatePlayer(currentUser, {card_name: nn.toUpperCase()}); renderProfilePage(); }
    };
    document.getElementById("change-card-color-btn").onclick = () => {
        const cgrid = document.getElementById("color-options");
        cgrid.innerHTML = "";
        COLORS.forEach(c => {
            let op = ce("div", "color-option");
            op.style.background = c;
            op.onclick = async () => { await updatePlayer(currentUser, {card_color: c}); document.getElementById("color-modal").classList.add("hidden"); renderProfilePage(); };
            cgrid.appendChild(op);
        });
        document.getElementById("color-modal").classList.remove("hidden");
    };
    document.getElementById("close-color-modal").onclick = () => document.getElementById("color-modal").classList.add("hidden");

    document.getElementById("vip-giveaway-btn").onclick = async () => {
        let today = new Date().toISOString().split('T')[0];
        if(currentData.vip_giveaway_day === today) return alert("Already used today");
        let u = prompt("Username to give 50,000 UAH:");
        if(!u || u===currentUser) return;
        let tPlayer = allPlayers.find(p=>p.username===u);
        if(!tPlayer) return alert("Not found");
        if(currentData.balance < 50000) return alert("Not enough money");
        await updatePlayer(currentUser, { balance: currentData.balance - 50000, vip_giveaway_day: today });
        await updatePlayer(u, { balance: tPlayer.balance + 50000, total_earned: tPlayer.total_earned + 50000 });
        alert("Sent!");
    };
}

async function initAppSession() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app-screen").classList.remove("hidden");
    
    let today = new Date().toISOString().split('T')[0];
    if(currentData.last_bonus_day !== today) {
        let bonus = 5000;
        await updatePlayer(currentUser, { balance: currentData.balance + bonus, total_earned: currentData.total_earned + bonus, last_bonus_day: today });
        alert(`Daily Bonus: ${bonus} UAH!`);
    }

    updateHeader();
    renderPage('profile');
    
    setInterval(passiveIncomeTick, 60000);
    setInterval(presenceTick, 30000);
    setInterval(battleTick, 5000);
}

async function initApp() {
    bindEvents();
    await fetchAllPlayers();
    await fetchGameState();
    setupRealtime();
    
    const sess = localStorage.getItem("bb_session");
    if(sess) {
        let p = allPlayers.find(x => x.username === sess);
        if(p && !p.banned) {
            currentUser = sess;
            currentData = p;
            applyOfflineIncome(p);
            initAppSession();
        } else {
            localStorage.removeItem("bb_session");
        }
    }
}

initApp();
