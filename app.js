// ======================================================
// BITBANK - FULL SINGLE FILE APP.JS
// localStorage version with 40+ real functions
// ======================================================

// ======================================================
// GLOBAL STATE
// ======================================================
const AppState = {
  currentUser: null,
  player: null,
  page: "profile",
  players: {},
  market: {
    crypto: [],
    stocks: [],
    sentiment: "neutral",
    lastTick: Date.now()
  },
  battle: {
    enemies: [],
    cooldownUntil: 0,
    lastResult: null
  },
  ui: {
    mobile: /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  }
};

// ======================================================
// CONSTANTS
// ======================================================
const STORAGE_KEYS = {
  PLAYERS: "bb_players",
  SESSION: "bb_session",
  HISTORY: "bb_history"
};

const CLASS_CONFIG = {
  none: { name: "Starter", clickBonus: 0, passiveBoost: 0, marketDiscount: 0, transferDiscount: 0 },
  bronze: { name: "Bronze", clickBonus: 2, passiveBoost: 0.03, marketDiscount: 0, transferDiscount: 0 },
  silver: { name: "Silver", clickBonus: 5, passiveBoost: 0.06, marketDiscount: 0.01, transferDiscount: 0 },
  gold: { name: "Gold", clickBonus: 10, passiveBoost: 0.1, marketDiscount: 0.02, transferDiscount: 0.01 },
  platinum: { name: "Platinum", clickBonus: 20, passiveBoost: 0.15, marketDiscount: 0.03, transferDiscount: 0.01 },
  diamond: { name: "Diamond", clickBonus: 35, passiveBoost: 0.22, marketDiscount: 0.04, transferDiscount: 0.02 },
  black: { name: "Black", clickBonus: 60, passiveBoost: 0.3, marketDiscount: 0.05, transferDiscount: 0.02 },
  vip: { name: "VIP", clickBonus: 100, passiveBoost: 0.4, marketDiscount: 0.06, transferDiscount: 0.03 },
  legend: { name: "Legend", clickBonus: 180, passiveBoost: 0.55, marketDiscount: 0.08, transferDiscount: 0.04 },
  creator: { name: "Creator", clickBonus: 300, passiveBoost: 0.75, marketDiscount: 0.1, transferDiscount: 0.05 }
};

const ROLE_CONFIG = {
  none: { name: "Без ролі", clickBoost: 0, marketBoost: 0, businessBoost: 0, financeBoost: 0, battleBoost: 0, casinoLuck: 0 },
  trader: { name: "Трейдер", clickBoost: 3, marketBoost: 0.12, businessBoost: 0, financeBoost: 0.01, battleBoost: 0, casinoLuck: 0.01 },
  entrepreneur: { name: "Підприємець", clickBoost: 2, marketBoost: 0, businessBoost: 0.14, financeBoost: 0.01, battleBoost: 0.02, casinoLuck: 0 },
  banker: { name: "Банкір", clickBoost: 1, marketBoost: 0.02, businessBoost: 0.03, financeBoost: 0.15, battleBoost: 0, casinoLuck: 0 },
  sports_manager: { name: "Спорт-менеджер", clickBoost: 2, marketBoost: 0, businessBoost: 0.08, financeBoost: 0.02, battleBoost: 0.15, casinoLuck: 0 },
  media_mogul: { name: "Медіа-магнат", clickBoost: 4, marketBoost: 0.03, businessBoost: 0.1, financeBoost: 0.03, battleBoost: 0.04, casinoLuck: 0.02 },
  high_roller: { name: "Хайролер", clickBoost: 0, marketBoost: 0, businessBoost: 0, financeBoost: 0, battleBoost: 0.06, casinoLuck: 0.08 }
};

const CARD_THEMES = {
  classic_blue: { name: "Classic Blue", clickBoost: 0, prestige: 0 },
  black_elite: { name: "Black Elite", clickBoost: 1, prestige: 1 },
  gold_luxe: { name: "Gold Luxe", clickBoost: 2, prestige: 2 },
  neon_pulse: { name: "Neon Pulse", clickBoost: 2, prestige: 1 },
  metal_titan: { name: "Metal Titan", clickBoost: 1, prestige: 2 },
  ruby_red: { name: "Ruby Red", clickBoost: 1, prestige: 2 },
  ice_glass: { name: "Ice Glass", clickBoost: 1, prestige: 3 },
  mono_bankish: { name: "Mono Dark", clickBoost: 2, prestige: 2 }
};

const BUSINESS_CONFIG = [
  { id: "transport", name: "Транспортна компанія", unlockCost: 1200000, baseIncome: 8500, stockItem: "Пальне" },
  { id: "small_factory", name: "Невелике виробництво", unlockCost: 1800000, baseIncome: 12000, stockItem: "Сировина" },
  { id: "fashion_brand", name: "Бренд одягу", unlockCost: 3000000, baseIncome: 18000, stockItem: "Матеріали" },
  { id: "supermarket", name: "Супермаркет", unlockCost: 6500000, baseIncome: 42000, stockItem: "Їжа і товари" },
  { id: "football_club", name: "Футбольний клуб", unlockCost: 12000000, baseIncome: 48000, stockItem: "Клубні витрати" }
];

const CRYPTO_CONFIG = [
  { id: "BTC", name: "Bitcoin", price: 2500000, min: 700000, max: 5000000, volatility: 0.035 },
  { id: "ETH", name: "Ethereum", price: 120000, min: 30000, max: 350000, volatility: 0.04 },
  { id: "BNB", name: "BNB", price: 28000, min: 7000, max: 70000, volatility: 0.045 },
  { id: "SOL", name: "Solana", price: 8500, min: 1200, max: 30000, volatility: 0.06 },
  { id: "XRP", name: "XRP", price: 90, min: 8, max: 500, volatility: 0.07 },
  { id: "ADA", name: "Cardano", price: 45, min: 5, max: 250, volatility: 0.065 },
  { id: "DOGE", name: "Dogecoin", price: 18, min: 1, max: 120, volatility: 0.08 }
];

const STOCK_CONFIG = [
  { id: "AAPL", name: "Apple", price: 9500, min: 3500, max: 25000, volatility: 0.02 },
  { id: "MSFT", name: "Microsoft", price: 11000, min: 4000, max: 30000, volatility: 0.02 },
  { id: "GOOGL", name: "Google", price: 10500, min: 3500, max: 28000, volatility: 0.022 },
  { id: "AMZN", name: "Amazon", price: 9800, min: 3000, max: 26000, volatility: 0.024 },
  { id: "TSLA", name: "Tesla", price: 15000, min: 2000, max: 50000, volatility: 0.045 },
  { id: "NVDA", name: "NVIDIA", price: 18000, min: 3000, max: 60000, volatility: 0.04 }
];

// ======================================================
// HELPERS
// ======================================================
function $(id) {
  return document.getElementById(id);
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(v) {
  return Math.floor(num(v)).toLocaleString("en-US");
}

function formatCompact(v) {
  const n = num(v);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Math.floor(n).toString();
}

function nowIso() {
  return new Date().toISOString();
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, digits = 6) {
  return Number((Math.random() * (max - min) + min).toFixed(digits));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

// ======================================================
// STORAGE
// ======================================================
function loadPlayersFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYERS) || "{}");
  } catch {
    return {};
  }
}

function savePlayersToStorage() {
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(AppState.players));
}

function loadHistoryFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "{}");
  } catch {
    return {};
  }
}

function saveHistoryToStorage(historyMap) {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyMap));
}

function getSessionUser() {
  return localStorage.getItem(STORAGE_KEYS.SESSION);
}

function setSessionUser(username) {
  localStorage.setItem(STORAGE_KEYS.SESSION, username);
}

function clearSessionUser() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// ======================================================
// PLAYER SHAPE
// ======================================================
function defaultPlayer(username, password) {
  return {
    username,
    password,
    balance: 0,
    usd: 0,
    total_earned: 0,
    clicks: 0,
    class: "none",
    role: "none",
    banned: false,
    is_admin: username === "admin" || username === "creator",
    last_seen: nowIso(),
    device: AppState.ui.mobile ? "phone" : "desktop",

    titles: [],
    inventory: [],
    friends: [],
    cars: [],
    realty: [],

    crypto: {},
    stocks: {},

    card_name: username,
    card_theme: "classic_blue",
    card_themes_owned: ["classic_blue"],
    card_number: generateCardNumber(),
    card_expiry: generateExpiry(),
    card_cvv: generateCVV(),
    card_settings: {
      transfer_limit_uah: 500000,
      transfer_limit_usd: 10000,
      card_locked: false,
      card_hidden_balance: false,
      contactless_enabled: true,
      international_enabled: true,
      nickname: username,
      accent: "blue"
    },

    business_projects: {},
    transfer_profile: {
      total_sent_uah: 0,
      total_sent_usd: 0,
      total_received_uah: 0,
      total_received_usd: 0,
      total_transfers: 0,
      daily_transfer_count: 0,
      daily_transfer_day: todayKey(),
      saved_recipients: []
    },

    finances: {
      deposits: [],
      credit: null,
      stats: {
        total_tax_paid: 0,
        total_maintenance_paid: 0,
        total_interest_paid: 0,
        total_deposit_profit: 0
      },
      last_tick: nowIso()
    },

    loot_profile: {
      opened_total: 0,
      rarity_stats: { common: 0, rare: 0, epic: 0, legendary: 0 },
      free_boxes: { basic_safe: 0, premium_safe: 0, elite_crate: 0 }
    },

    casino_profile: {
      jackpot_bank: 500000,
      lottery_bank: 250000,
      daily_wheel_day: "",
      wheel_bonus_multiplier: 1,
      free_safes: 0,
      lottery_tickets: 0
    },

    battle_profile: {
      wins: 0,
      losses: 0,
      rating: 1000,
      streak: 0,
      best_streak: 0,
      unlocked_arena: 1
    },

    collections_state: {
      claimed: {},
      completed_at: {}
    },

    role_stats: {
      changes_count: 0,
      total_spent_on_roles: 0,
      unlocked_roles: []
    }
  };
}

function normalizePlayer(player) {
  if (!player) return null;

  if (!player.balance) player.balance = 0;
  if (!player.usd) player.usd = 0;
  if (!player.total_earned) player.total_earned = 0;
  if (!player.clicks) player.clicks = 0;
  if (!player.class) player.class = "none";
  if (!player.role) player.role = "none";
  if (!player.crypto) player.crypto = {};
  if (!player.stocks) player.stocks = {};
  if (!player.business_projects) player.business_projects = {};
  if (!Array.isArray(player.friends)) player.friends = [];
  if (!Array.isArray(player.inventory)) player.inventory = [];
  if (!Array.isArray(player.cars)) player.cars = [];
  if (!Array.isArray(player.realty)) player.realty = [];
  if (!Array.isArray(player.titles)) player.titles = [];
  if (!Array.isArray(player.card_themes_owned)) player.card_themes_owned = ["classic_blue"];
  if (!player.transfer_profile) player.transfer_profile = defaultPlayer(player.username, player.password).transfer_profile;
  if (!player.finances) player.finances = defaultPlayer(player.username, player.password).finances;
  if (!player.loot_profile) player.loot_profile = defaultPlayer(player.username, player.password).loot_profile;
  if (!player.casino_profile) player.casino_profile = defaultPlayer(player.username, player.password).casino_profile;
  if (!player.battle_profile) player.battle_profile = defaultPlayer(player.username, player.password).battle_profile;
  if (!player.collections_state) player.collections_state = defaultPlayer(player.username, player.password).collections_state;
  if (!player.role_stats) player.role_stats = defaultPlayer(player.username, player.password).role_stats;
  if (!player.card_settings) player.card_settings = defaultPlayer(player.username, player.password).card_settings;
  if (!player.card_theme) player.card_theme = "classic_blue";
  if (!player.card_name) player.card_name = player.username;

  return player;
}

function getPlayer() {
  return AppState.player;
}

// ======================================================
// AUTH
// ======================================================
function ensureSpecialAccounts() {
  if (!AppState.players.admin) {
    const admin = defaultPlayer("admin", "9009");
    admin.balance = 1000000000;
    admin.usd = 500000;
    admin.class = "creator";
    admin.is_admin = true;
    AppState.players.admin = admin;
  }

  if (!AppState.players.creator) {
    const creator = defaultPlayer("creator", "9creator9");
    creator.balance = 1000000000;
    creator.usd = 500000;
    creator.class = "creator";
    creator.is_admin = true;
    AppState.players.creator = creator;
  }

  savePlayersToStorage();
}

function loginUser(username, password) {
  const user = AppState.players[username];
  if (!user) return { ok: false, message: "Акаунт не знайдено" };
  if (user.banned) return { ok: false, message: "Акаунт заблоковано" };
  if (user.password !== password) return { ok: false, message: "Невірний пароль" };

  AppState.currentUser = username;
  AppState.player = normalizePlayer(user);
  AppState.player.last_seen = nowIso();
  saveCurrentPlayer();
  setSessionUser(username);

  return { ok: true };
}

function registerUser(username, password) {
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return { ok: false, message: "Логін: 3-20 символів, букви, цифри або _" };
  }

  if (String(password || "").length < 4) {
    return { ok: false, message: "Пароль мінімум 4 символи" };
  }

  if (AppState.players[username]) {
    return { ok: false, message: "Такий логін уже існує" };
  }

  AppState.players[username] = defaultPlayer(username, password);
  savePlayersToStorage();

  return loginUser(username, password);
}

function logoutUser() {
  AppState.currentUser = null;
  AppState.player = null;
  clearSessionUser();
  showAuthScreen();
}

// ======================================================
// HISTORY
// ======================================================
function addHistory(text, amount = 0) {
  const player = getPlayer();
  if (!player) return;

  const historyMap = loadHistoryFromStorage();
  if (!historyMap[player.username]) historyMap[player.username] = [];

  historyMap[player.username].unshift({
    text,
    amount: num(amount),
    created_at: nowIso()
  });

  historyMap[player.username] = historyMap[player.username].slice(0, 400);
  saveHistoryToStorage(historyMap);
}

function getPlayerHistory() {
  const player = getPlayer();
  if (!player) return [];
  const historyMap = loadHistoryFromStorage();
  return safeArray(historyMap[player.username]);
}

// ======================================================
// SESSION / SAVE
// ======================================================
function saveCurrentPlayer() {
  const player = getPlayer();
  if (!player) return;

  AppState.players[player.username] = player;
  savePlayersToStorage();
}

function updatePlayer(patch) {
  Object.assign(AppState.player, patch);
  saveCurrentPlayer();
  updateHeader();
}

// ======================================================
// CARD HELPERS
// ======================================================
function generateCardNumber() {
  return `${randomInt(1000,9999)} ${randomInt(1000,9999)} ${randomInt(1000,9999)} ${randomInt(1000,9999)}`;
}

function generateExpiry() {
  return `${String(randomInt(1,12)).padStart(2,"0")}/${String((new Date().getFullYear() + 3) % 100).padStart(2,"0")}`;
}

function generateCVV() {
  return String(randomInt(100, 999));
}

function getCardBonus() {
  const theme = CARD_THEMES[getPlayer()?.card_theme || "classic_blue"];
  return safeObject(theme);
}

// ======================================================
// BONUS HELPERS
// ======================================================
function getClassData() {
  return CLASS_CONFIG[getPlayer()?.class || "none"] || CLASS_CONFIG.none;
}

function getRoleData() {
  return ROLE_CONFIG[getPlayer()?.role || "none"] || ROLE_CONFIG.none;
}

function getCollectionBonuses() {
  const state = safeObject(getPlayer()?.collections_state);
  const claimed = safeObject(state.claimed);

  const bonus = {
    clickBoost: 0,
    prestige: 0,
    marketBoost: 0,
    businessBoost: 0,
    taxDiscount: 0,
    lotteryLuck: 0
  };

  if (claimed.cars_sport_set) bonus.businessBoost += 0.04;
  if (claimed.cards_premium_set) bonus.clickBoost += 5;
  if (claimed.cards_elite_set) bonus.prestige += 4;
  if (claimed.roles_finance_set) bonus.marketBoost += 0.04;
  if (claimed.roles_master_set) bonus.lotteryLuck += 0.03;
  if (claimed.realty_luxury_set) bonus.taxDiscount += 0.08;

  return bonus;
}

// ======================================================
// PLAYER POWER / TITLES
// ======================================================
function getClickIncome() {
  return 5
    + num(getClassData().clickBonus)
    + num(getRoleData().clickBoost)
    + num(getCardBonus().clickBoost)
    + num(getCollectionBonuses().clickBoost);
}

function getPrestige() {
  const cls = getPlayer()?.class || "none";
  let base = 0;

  if (cls === "bronze") base += 1;
  if (cls === "silver") base += 2;
  if (cls === "gold") base += 3;
  if (cls === "platinum") base += 4;
  if (cls === "diamond") base += 5;
  if (cls === "black") base += 6;
  if (cls === "vip") base += 7;
  if (cls === "legend") base += 9;
  if (cls === "creator") base += 12;

  base += num(getCardBonus().prestige);
  base += num(getCollectionBonuses().prestige);

  const role = getPlayer()?.role || "none";
  if (["banker", "sports_manager", "media_mogul", "high_roller"].includes(role)) {
    base += 1;
  }

  return base;
}

function getPrestigeLabel() {
  const v = getPrestige();
  if (v >= 18) return "Mythic";
  if (v >= 14) return "Royal";
  if (v >= 10) return "Elite";
  if (v >= 7) return "Luxury";
  if (v >= 4) return "Premium";
  if (v >= 2) return "Rising";
  return "Starter";
}

function getWealthTier() {
  const player = getPlayer();
  const total = num(player.balance) + num(player.usd) * 40;

  if (total >= 500000000) return "Capital Emperor";
  if (total >= 100000000) return "Mega Tycoon";
  if (total >= 10000000) return "Tycoon";
  if (total >= 1000000) return "Investor";
  if (total >= 100000) return "Builder";
  return "Newcomer";
}

function rebuildTitles() {
  const player = getPlayer();
  const titles = new Set();

  titles.add(getPrestigeLabel());
  titles.add(getWealthTier());

  if (num(player.total_earned) >= 1000000) titles.add("Million Earner");
  if (num(player.total_earned) >= 100000000) titles.add("Capital Machine");
  if (num(player.clicks) >= 1000) titles.add("Tap Grinder");
  if (num(player.clicks) >= 10000) titles.add("Tap Legend");

  const roleName = getRoleData().name;
  const className = getClassData().name;

  if (roleName) titles.add(roleName);
  if (className) titles.add(className);

  player.titles = [...titles];
  saveCurrentPlayer();
}

// ======================================================
// MONEY
// ======================================================
function addBalance(amount) {
  const player = getPlayer();
  const value = num(amount);
  player.balance += value;
  player.total_earned += Math.max(0, value);
  saveCurrentPlayer();
}

function removeBalance(amount) {
  const player = getPlayer();
  const value = num(amount);
  if (player.balance < value) return false;
  player.balance -= value;
  saveCurrentPlayer();
  return true;
}

function addUSD(amount) {
  const player = getPlayer();
  player.usd += num(amount);
  saveCurrentPlayer();
}

function removeUSD(amount) {
  const player = getPlayer();
  const value = num(amount);
  if (player.usd < value) return false;
  player.usd -= value;
  saveCurrentPlayer();
  return true;
}

// ======================================================
// CLICK
// ======================================================
function handleClick() {
  const income = getClickIncome();
  addBalance(income);
  AppState.player.clicks += 1;
  AppState.player.last_seen = nowIso();
  saveCurrentPlayer();

  if (AppState.player.clicks % 100 === 0) {
    addHistory(`Click milestone: ${AppState.player.clicks}`, income);
  }
  renderCurrentPage();
}

// ======================================================
// PROFILE / HEADER
// ======================================================
function updateHeader() {
  if (!getPlayer()) return;

  if ($("header-username")) $("header-username").textContent = getPlayer().username;
  if ($("header-status")) $("header-status").textContent = `Class: ${getClassData().name}`;
  if ($("header-device")) $("header-device").textContent = `Device: ${getPlayer().device || "desktop"}`;
  if ($("header-prestige")) $("header-prestige").textContent = `Prestige: ${getPrestigeLabel()}`;
  if ($("balance-uah")) $("balance-uah").textContent = `₴ ${formatMoney(getPlayer().balance)}`;
  if ($("balance-usd")) $("balance-usd").textContent = `$ ${formatMoney(getPlayer().usd)}`;
  if ($("topbar-avatar-text")) $("topbar-avatar-text").textContent = getPlayer().username.charAt(0).toUpperCase();

  const adminBtn = document.querySelector('.nav-btn[data-page="admin"]');
  if (adminBtn) {
    adminBtn.style.display = getPlayer().is_admin ? "flex" : "none";
  }
}

function renderBankCard() {
  return `
    <div class="card">
      <h3>Bank Card</h3>
      <p><span class="muted">Holder:</span> ${getPlayer().card_name}</p>
      <p><span class="muted">Number:</span> ${getPlayer().card_number}</p>
      <p><span class="muted">Expiry:</span> ${getPlayer().card_expiry}</p>
      <p><span class="muted">Theme:</span> ${(CARD_THEMES[getPlayer().card_theme] || CARD_THEMES.classic_blue).name}</p>
    </div>
  `;
}

function renderProfilePage() {
  rebuildTitles();

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Premium Profile</h2>
      <p>Головна сторінка профілю з балансом, карткою, титулами, доходом і швидкими діями.</p>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Main Account</h3>
        <p><span class="muted">Username:</span> ${getPlayer().username}</p>
        <p><span class="muted">Class:</span> ${getClassData().name}</p>
        <p><span class="muted">Role:</span> ${getRoleData().name}</p>
        <p><span class="muted">Prestige:</span> ${getPrestigeLabel()} (${getPrestige()})</p>
        <p><span class="muted">Wealth:</span> ${getWealthTier()}</p>
      </div>

      ${renderBankCard()}
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Click Income</div>
        <div class="stat-value blue">${formatCompact(getClickIncome())}</div>
        <div class="stat-sub">Per click</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Total Earned</div>
        <div class="stat-value green">₴ ${formatCompact(getPlayer().total_earned)}</div>
        <div class="stat-sub">Lifetime</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Clicks</div>
        <div class="stat-value">${formatCompact(getPlayer().clicks)}</div>
        <div class="stat-sub">Total taps</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Titles</div>
        <div class="stat-value">${safeArray(getPlayer().titles).length}</div>
        <div class="stat-sub">Auto generated</div>
      </div>
    </div>

    <div class="click-panel">
      <div>
        <div class="currency">Tap Engine</div>
        <div class="amount">+₴ ${formatCompact(getClickIncome())}</div>
        <div class="hint">Клік для заробітку</div>
      </div>
      <button id="main-click-btn" class="click-button" type="button">CLICK</button>
    </div>

    <div class="card" style="grid-column:1 / -1;">
      <h3>Titles</h3>
      <div class="titles-list">
        ${safeArray(getPlayer().titles).map(t => `<div class="title-pill">${t}</div>`).join("")}
      </div>
    </div>
  `;
}

// ======================================================
// MARKET
// ======================================================
function initMarket() {
  AppState.market.crypto = CRYPTO_CONFIG.map(x => ({ ...x }));
  AppState.market.stocks = STOCK_CONFIG.map(x => ({ ...x }));
}

function marketSentimentTick() {
  const roll = Math.random();
  if (roll < 0.18) AppState.market.sentiment = "panic";
  else if (roll < 0.38) AppState.market.sentiment = "bearish";
  else if (roll < 0.62) AppState.market.sentiment = "neutral";
  else if (roll < 0.84) AppState.market.sentiment = "bullish";
  else AppState.market.sentiment = "euphoria";
}

function marketTrendMultiplier() {
  if (AppState.market.sentiment === "panic") return 0.94;
  if (AppState.market.sentiment === "bearish") return 0.98;
  if (AppState.market.sentiment === "bullish") return 1.03;
  if (AppState.market.sentiment === "euphoria") return 1.07;
  return 1;
}

function tickAsset(asset) {
  const noise = randomFloat(-asset.volatility, asset.volatility);
  const next = asset.price * (1 + noise) * marketTrendMultiplier();
  asset.price = Math.round(clamp(next, asset.min, asset.max));
}

function marketTick() {
  marketSentimentTick();
  AppState.market.crypto.forEach(tickAsset);
  AppState.market.stocks.forEach(tickAsset);
  AppState.market.lastTick = Date.now();

  if (["crypto", "stocks"].includes(AppState.page)) {
    renderCurrentPage();
  }
}

function classMarketDiscount() {
  return num(getClassData().marketDiscount);
}

function roleMarketBoost() {
  return num(getRoleData().marketBoost);
}

function collectionMarketBoost() {
  return num(getCollectionBonuses().marketBoost);
}

function getCryptoAsset(id) {
  return AppState.market.crypto.find(x => x.id === id);
}

function getStockAsset(id) {
  return AppState.market.stocks.find(x => x.id === id);
}

function buyCrypto(id, amount) {
  const asset = getCryptoAsset(id);
  if (!asset) return false;

  const qty = num(amount);
  if (qty <= 0) return false;

  const discount = classMarketDiscount() + (getPlayer().role === "trader" ? 0.04 : 0);
  const cost = qty * asset.price * (1 - discount);

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  getPlayer().crypto[id] = num(getPlayer().crypto[id]) + qty;
  saveCurrentPlayer();
  addHistory(`Buy crypto ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function sellCrypto(id, amount) {
  const asset = getCryptoAsset(id);
  if (!asset) return false;

  const qty = num(amount);
  if (qty <= 0) return false;
  if (num(getPlayer().crypto[id]) < qty) {
    alert("Недостатньо крипти");
    return false;
  }

  const income = qty * asset.price * (1 + roleMarketBoost() + collectionMarketBoost());
  getPlayer().crypto[id] = num(getPlayer().crypto[id]) - qty;
  addBalance(income);
  saveCurrentPlayer();
  addHistory(`Sell crypto ${id}`, income);
  renderCurrentPage();
  return true;
}

function buyStock(id, amount) {
  const asset = getStockAsset(id);
  if (!asset) return false;

  const qty = num(amount);
  if (qty <= 0) return false;

  const discount = classMarketDiscount() + (getPlayer().role === "trader" ? 0.04 : 0);
  const cost = qty * asset.price * (1 - discount);

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  getPlayer().stocks[id] = num(getPlayer().stocks[id]) + qty;
  saveCurrentPlayer();
  addHistory(`Buy stock ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function sellStock(id, amount) {
  const asset = getStockAsset(id);
  if (!asset) return false;

  const qty = num(amount);
  if (qty <= 0) return false;
  if (num(getPlayer().stocks[id]) < qty) {
    alert("Недостатньо акцій");
    return false;
  }

  const income = qty * asset.price * (1 + roleMarketBoost() + collectionMarketBoost());
  getPlayer().stocks[id] = num(getPlayer().stocks[id]) - qty;
  addBalance(income);
  saveCurrentPlayer();
  addHistory(`Sell stock ${id}`, income);
  renderCurrentPage();
  return true;
}

function renderAssetCard(type, asset) {
  const owned = type === "crypto" ? num(getPlayer().crypto[asset.id]) : num(getPlayer().stocks[asset.id]);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${asset.name}</div>
          <div class="asset-price">₴ ${formatCompact(asset.price)}</div>
        </div>

        <div class="asset-meta">
          <span>${asset.id}</span>
          <span>Owned: ${owned}</span>
          <span>Sentiment: ${AppState.market.sentiment}</span>
        </div>

        <div class="profile-actions">
          <input id="${type}-amount-${asset.id}" type="number" min="0.0001" step="0.0001" placeholder="Amount">
          <div class="asset-actions">
            <button data-buy="${type}:${asset.id}">Buy</button>
            <button class="secondary" data-sell="${type}:${asset.id}">Sell</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCryptoPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Crypto Market</h2>
      <p>Купуй і продавай крипту. Ціни рухаються автоматично.</p>
    </div>

    <div class="asset-grid">
      ${AppState.market.crypto.map(a => renderAssetCard("crypto", a)).join("")}
    </div>
  `;
}

function renderStocksPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Stock Market</h2>
      <p>Портфель акцій з динамічними цінами.</p>
    </div>

    <div class="asset-grid">
      ${AppState.market.stocks.map(a => renderAssetCard("stocks", a)).join("")}
    </div>
  `;
}

// ======================================================
// BUSINESS
// ======================================================
function ensureBusinessState() {
  BUSINESS_CONFIG.forEach(cfg => {
    if (!getPlayer().business_projects[cfg.id]) {
      getPlayer().business_projects[cfg.id] = {
        unlocked: false,
        level: 1,
        employees: 0,
        stock: 0,
        marketing: 0,
        quality: 0
      };
    }
  });
}

function businessUnlockCost(cfg) {
  return Math.floor(cfg.unlockCost * (1 - classMarketDiscount()));
}

function unlockBusiness(id) {
  ensureBusinessState();
  const cfg = BUSINESS_CONFIG.find(x => x.id === id);
  if (!cfg) return false;

  const state = getPlayer().business_projects[id];
  if (state.unlocked) return false;

  const cost = businessUnlockCost(cfg);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  state.unlocked = true;
  state.level = 1;
  state.employees = 1;
  state.stock = 25;
  saveCurrentPlayer();
  addHistory(`Unlock business ${cfg.name}`, -cost);
  renderCurrentPage();
  return true;
}

function businessIncome(cfg, state) {
  if (!state.unlocked) return 0;

  const base = cfg.baseIncome;
  const levelFactor = 1 + (num(state.level) - 1) * 0.18;
  const employeeFactor = 1 + num(state.employees) * 0.06;
  const stockFactor = state.stock > 0 ? 1 : 0.35;
  const qualityFactor = 1 + num(state.quality) * 0.08;
  const marketingFactor = 1 + num(state.marketing) * 0.07;
  const classFactor = 1 + num(getClassData().passiveBoost);
  const roleFactor = 1 + num(getRoleData().businessBoost);
  const collectionFactor = 1 + num(getCollectionBonuses().businessBoost);

  return base * levelFactor * employeeFactor * stockFactor * qualityFactor * marketingFactor * classFactor * roleFactor * collectionFactor;
}

function totalPassiveIncome() {
  ensureBusinessState();
  return BUSINESS_CONFIG.reduce((sum, cfg) => {
    return sum + businessIncome(cfg, getPlayer().business_projects[cfg.id]);
  }, 0);
}

function passiveIncomeTick() {
  const income = totalPassiveIncome() / 60 * 5;
  if (income > 0) {
    addBalance(income);
  }

  BUSINESS_CONFIG.forEach(cfg => {
    const state = getPlayer().business_projects[cfg.id];
    if (!state.unlocked) return;
    state.stock = Math.max(0, num(state.stock) - 0.25);
  });

  saveCurrentPlayer();
  if (AppState.page === "business" || AppState.page === "profile") {
    renderCurrentPage();
  }
}

function upgradeBusinessLevel(id) {
  const state = getPlayer().business_projects[id];
  const cost = Math.floor(num(state.level) * 6000 + 3000);

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  state.level += 1;
  saveCurrentPlayer();
  addHistory(`Upgrade business level ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function hireBusinessEmployee(id) {
  const state = getPlayer().business_projects[id];
  const cost = Math.floor(25000 + num(state.employees) * 5000);

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  state.employees += 1;
  saveCurrentPlayer();
  addHistory(`Hire business employee ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function buyBusinessStock(id) {
  const state = getPlayer().business_projects[id];
  const cost = 80000;

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  state.stock += 50;
  saveCurrentPlayer();
  addHistory(`Buy business stock ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function upgradeBusinessMarketing(id) {
  const state = getPlayer().business_projects[id];
  const cost = Math.floor((num(state.marketing) + 1) * 18000);

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  state.marketing += 1;
  saveCurrentPlayer();
  addHistory(`Upgrade marketing ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function upgradeBusinessQuality(id) {
  const state = getPlayer().business_projects[id];
  const cost = Math.floor((num(state.quality) + 1) * 12000);

  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  state.quality += 1;
  saveCurrentPlayer();
  addHistory(`Upgrade quality ${id}`, -cost);
  renderCurrentPage();
  return true;
}

function renderBusinessPage() {
  ensureBusinessState();

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Business Empire</h2>
      <p>Відкривай бізнеси і збільшуй пасивний дохід.</p>
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Passive Income</div>
        <div class="stat-value green">₴ ${formatCompact(totalPassiveIncome())}</div>
        <div class="stat-sub">Per minute</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Projects</div>
        <div class="stat-value">${Object.values(getPlayer().business_projects).filter(x => x.unlocked).length}</div>
        <div class="stat-sub">Unlocked</div>
      </div>
    </div>

    <div class="asset-grid">
      ${BUSINESS_CONFIG.map(cfg => {
        const s = getPlayer().business_projects[cfg.id];
        return `
          <div class="card asset-card">
            <div class="asset-info">
              <div class="asset-head">
                <div class="asset-name">${cfg.name}</div>
                <div class="asset-price">${s.unlocked ? "ACTIVE" : `₴ ${formatCompact(businessUnlockCost(cfg))}`}</div>
              </div>

              <div class="asset-meta">
                <span>Level: ${s.level}</span>
                <span>Employees: ${s.employees}</span>
                <span>Stock: ${Math.floor(s.stock)}</span>
                <span>Income: ₴ ${formatCompact(businessIncome(cfg, s))}</span>
              </div>

              <div class="asset-actions">
                <button ${s.unlocked ? "disabled" : ""} data-business-unlock="${cfg.id}">${s.unlocked ? "Opened" : "Unlock"}</button>
                <button class="secondary" ${!s.unlocked ? "disabled" : ""} data-business-level="${cfg.id}">Level Up</button>
              </div>

              <div class="asset-actions">
                <button ${!s.unlocked ? "disabled" : ""} data-business-employee="${cfg.id}">Hire</button>
                <button class="secondary" ${!s.unlocked ? "disabled" : ""} data-business-stock="${cfg.id}">Stock</button>
              </div>

              <div class="asset-actions">
                <button ${!s.unlocked ? "disabled" : ""} data-business-marketing="${cfg.id}">Marketing</button>
                <button class="secondary" ${!s.unlocked ? "disabled" : ""} data-business-quality="${cfg.id}">Quality</button>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ======================================================
// FINANCE
// ======================================================
function createDeposit(currency, amount, days) {
  const value = num(amount);
  const term = num(days);

  if (currency === "UAH") {
    if (!removeBalance(value)) {
      alert("Недостатньо UAH");
      return false;
    }
  } else {
    if (!removeUSD(value)) {
      alert("Недостатньо USD");
      return false;
    }
  }

  const annualRate = currency === "UAH" ? 0.18 : 0.08;
  const roleBonus = getPlayer().role === "banker" ? 0.015 : 0;
  const finalRate = annualRate + roleBonus;
  const expectedProfit = value * finalRate * (term / 365);

  getPlayer().finances.deposits.push({
    id: `dep_${Date.now()}_${randomInt(1000,9999)}`,
    currency,
    amount: value,
    days: term,
    annualRate: finalRate,
    expectedProfit,
    createdAt: nowIso(),
    matureAt: new Date(Date.now() + term * 86400000).toISOString(),
    closed: false
  });

  saveCurrentPlayer();
  addHistory(`Open ${currency} deposit`, -value);
  renderCurrentPage();
  return true;
}

function claimDeposit(id) {
  const dep = getPlayer().finances.deposits.find(x => x.id === id);
  if (!dep || dep.closed) return false;
  if (new Date(dep.matureAt).getTime() > Date.now()) {
    alert("Депозит ще не дозрів");
    return false;
  }

  const reward = dep.amount + dep.expectedProfit;

  if (dep.currency === "UAH") addBalance(reward);
  else addUSD(reward);

  dep.closed = true;
  getPlayer().finances.stats.total_deposit_profit += dep.expectedProfit;
  saveCurrentPlayer();
  addHistory(`Claim ${dep.currency} deposit`, reward);
  renderCurrentPage();
  return true;
}

function takeCredit(amount, days) {
  const value = num(amount);
  const term = num(days);

  if (getPlayer().finances.credit) {
    alert("У тебе вже є кредит");
    return false;
  }

  let rate = 0.0025;
  if (getPlayer().role === "banker") rate *= 0.88;

  getPlayer().finances.credit = {
    principal: value,
    dueAmount: value * (1 + rate * term),
    dailyRate: rate,
    latePenaltyRate: 0.01,
    takenAt: nowIso(),
    dueAt: new Date(Date.now() + term * 86400000).toISOString(),
    active: true
  };

  addBalance(value);
  saveCurrentPlayer();
  addHistory("Take credit", value);
  renderCurrentPage();
  return true;
}

function repayCredit(amount) {
  const credit = getPlayer().finances.credit;
  if (!credit || !credit.active) return false;

  const value = num(amount);
  if (!removeBalance(value)) {
    alert("Недостатньо грошей");
    return false;
  }

  credit.dueAmount -= value;
  if (credit.dueAmount <= 0) {
    getPlayer().finances.credit = null;
  }

  saveCurrentPlayer();
  addHistory("Repay credit", -value);
  renderCurrentPage();
  return true;
}

function financeTick() {
  const finances = getPlayer().finances;
  const now = Date.now();
  const last = new Date(finances.last_tick || nowIso()).getTime();
  const elapsedDays = (now - last) / 86400000;

  if (elapsedDays < 0.25) return;

  const passiveTaxRate = Math.max(0, 0.03 - num(getCollectionBonuses().taxDiscount));
  const totalAssets = num(getPlayer().balance) + num(getPlayer().usd) * 40;
  const passiveTax = totalAssets > 100000 ? totalAssets * passiveTaxRate / 30 * elapsedDays : 0;

  const maintenanceCars = safeArray(getPlayer().cars).length * 450 * elapsedDays;
  const maintenanceRealty = safeArray(getPlayer().realty).length * 800 * elapsedDays;
  const maintenance = maintenanceCars + maintenanceRealty;

  getPlayer().balance = Math.max(0, num(getPlayer().balance) - passiveTax - maintenance);
  finances.stats.total_tax_paid += passiveTax;
  finances.stats.total_maintenance_paid += maintenance;

  if (finances.credit && finances.credit.active) {
    const dueAt = new Date(finances.credit.dueAt).getTime();
    const rate = now <= dueAt ? finances.credit.dailyRate : finances.credit.latePenaltyRate;
    const growth = finances.credit.dueAmount * rate * elapsedDays;
    finances.credit.dueAmount += growth;
    finances.stats.total_interest_paid += growth;
  }

  finances.last_tick = nowIso();
  saveCurrentPlayer();

  if (AppState.page === "finance" || AppState.page === "profile") {
    renderCurrentPage();
  }
}

function renderFinancePage() {
  const credit = getPlayer().finances.credit;

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Finance Center</h2>
      <p>Депозити, кредити, відсотки і витрати.</p>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Open Deposit</h3>
        <div class="profile-actions">
          <select id="dep-currency">
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
          </select>
          <input id="dep-amount" type="number" placeholder="Amount">
          <select id="dep-days">
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
          <button id="open-deposit-btn">Open Deposit</button>
        </div>
      </div>

      <div class="card">
        <h3>Credit</h3>
        <p><span class="muted">Current due:</span> ₴ ${formatMoney(credit?.dueAmount || 0)}</p>
        <div class="profile-actions">
          <input id="credit-amount" type="number" placeholder="Credit amount">
          <select id="credit-days">
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
          </select>
          <button id="take-credit-btn" ${credit ? "disabled" : ""}>Take Credit</button>
          <input id="repay-amount" type="number" placeholder="Repay amount">
          <button id="repay-credit-btn" ${!credit ? "disabled" : ""}>Repay</button>
        </div>
      </div>
    </div>

    <div class="section-title">Deposits</div>
    <div class="asset-grid">
      ${
        getPlayer().finances.deposits.length
          ? getPlayer().finances.deposits.map(dep => `
            <div class="card asset-card">
              <div class="asset-info">
                <div class="asset-head">
                  <div class="asset-name">${dep.currency} deposit</div>
                  <div class="asset-price">${dep.closed ? "CLOSED" : dep.currency === "UAH" ? "₴" : "$"} ${formatCompact(dep.amount)}</div>
                </div>
                <div class="asset-meta">
                  <span>${dep.days} days</span>
                  <span>Profit: ${dep.currency === "UAH" ? "₴" : "$"} ${formatCompact(dep.expectedProfit)}</span>
                </div>
                <button ${dep.closed ? "disabled" : ""} data-claim-deposit="${dep.id}">Claim</button>
              </div>
            </div>
          `).join("")
          : `<div class="card"><h3>No deposits</h3><p>Open first deposit.</p></div>`
      }
    </div>
  `;
}

// ======================================================
// TRANSFERS
// ======================================================
function transferFeeRate(currency) {
  const base = currency === "USD" ? 0.012 : 0.008;
  const discount = num(getClassData().transferDiscount) + (getPlayer().role === "banker" ? 0.02 : 0);
  return Math.max(0, base - discount);
}

function sendUAH(toUser, amount) {
  const target = AppState.players[toUser];
  const value = num(amount);
  if (!target) return alert("Отримувача не знайдено"), false;
  if (target.username === getPlayer().username) return alert("Не можна собі"), false;

  const fee = Math.floor(value * transferFeeRate("UAH"));
  const total = value + fee;

  if (!removeBalance(total)) {
    alert("Недостатньо грошей");
    return false;
  }

  target.balance += value;
  target.transfer_profile.total_received_uah += value;
  getPlayer().transfer_profile.total_sent_uah += value;
  getPlayer().transfer_profile.total_transfers += 1;

  savePlayersToStorage();
  addHistory(`Transfer UAH to ${toUser}`, -total);
  renderCurrentPage();
  return true;
}

function sendUSD(toUser, amount) {
  const target = AppState.players[toUser];
  const value = num(amount);
  if (!target) return alert("Отримувача не знайдено"), false;
  if (target.username === getPlayer().username) return alert("Не можна собі"), false;

  const fee = Math.floor(value * transferFeeRate("USD"));
  const total = value + fee;

  if (!removeUSD(total)) {
    alert("Недостатньо USD");
    return false;
  }

  target.usd += value;
  target.transfer_profile.total_received_usd += value;
  getPlayer().transfer_profile.total_sent_usd += value;
  getPlayer().transfer_profile.total_transfers += 1;

  savePlayersToStorage();
  addHistory(`Transfer USD to ${toUser}`, 0);
  renderCurrentPage();
  return true;
}

function renderTransfersPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Transfers</h2>
      <p>Перекази між гравцями.</p>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Send UAH</h3>
        <div class="profile-actions">
          <input id="tr-uah-user" placeholder="Username">
          <input id="tr-uah-amount" type="number" placeholder="Amount">
          <button id="send-uah-btn">Send UAH</button>
        </div>
      </div>

      <div class="card">
        <h3>Send USD</h3>
        <div class="profile-actions">
          <input id="tr-usd-user" placeholder="Username">
          <input id="tr-usd-amount" type="number" placeholder="Amount">
          <button id="send-usd-btn">Send USD</button>
        </div>
      </div>
    </div>
  `;
}

// ======================================================
// FRIENDS
// ======================================================
function isOnline(player) {
  const t = new Date(player.last_seen || 0).getTime();
  return Date.now() - t < 15000;
}

function addFriend(username) {
  const target = AppState.players[username];
  if (!target) return alert("Гравця не знайдено"), false;
  if (username === getPlayer().username) return false;
  if (getPlayer().friends.includes(username)) return false;

  getPlayer().friends.push(username);
  saveCurrentPlayer();
  addHistory(`Add friend: ${username}`, 0);
  renderCurrentPage();
  return true;
}

function removeFriend(username) {
  getPlayer().friends = getPlayer().friends.filter(x => x !== username);
  saveCurrentPlayer();
  addHistory(`Remove friend: ${username}`, 0);
  renderCurrentPage();
  return true;
}

function getTopPlayers() {
  return Object.values(AppState.players)
    .sort((a, b) => num(b.balance) - num(a.balance))
    .slice(0, 100);
}

function renderFriendsPage() {
  const friends = getPlayer().friends.map(name => AppState.players[name]).filter(Boolean);
  const top = getTopPlayers();

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Friends & Top 100</h2>
      <p>Друзі, онлайн і глобальний рейтинг.</p>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Add Friend</h3>
        <div class="profile-actions">
          <input id="friend-name" placeholder="Username">
          <button id="add-friend-btn">Add Friend</button>
        </div>
      </div>

      <div class="card">
        <h3>Quick Stats</h3>
        <p><span class="muted">Friends:</span> ${friends.length}</p>
        <p><span class="muted">Online:</span> ${friends.filter(isOnline).length}</p>
      </div>
    </div>

    <div class="section-title">Friends</div>
    <div class="asset-grid">
      ${
        friends.length
          ? friends.map(f => `
            <div class="card asset-card">
              <div class="asset-info">
                <div class="asset-head">
                  <div class="asset-name">${f.username}</div>
                  <div class="asset-price ${isOnline(f) ? "green" : "muted"}">${isOnline(f) ? "Online" : "Offline"}</div>
                </div>
                <div class="asset-meta">
                  <span>₴ ${formatCompact(f.balance)}</span>
                  <span>${f.class}</span>
                </div>
                <button class="secondary" data-remove-friend="${f.username}">Remove</button>
              </div>
            </div>
          `).join("")
          : `<div class="card"><h3>No friends yet</h3></div>`
      }
    </div>

    <div class="section-title">Top 100</div>
    <div class="asset-grid">
      ${top.map((p, i) => `
        <div class="card asset-card">
          <div class="asset-info">
            <div class="asset-head">
              <div class="asset-name">#${i + 1} ${p.username}</div>
              <div class="asset-price">₴ ${formatCompact(p.balance)}</div>
            </div>
            <div class="asset-meta">
              <span>${p.class}</span>
              <span>${isOnline(p) ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ======================================================
// HISTORY PAGE
// ======================================================
function renderHistoryPage() {
  const history = getPlayerHistory();

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>History</h2>
      <p>Усі твої операції.</p>
    </div>

    <div class="asset-grid">
      ${
        history.length
          ? history.map(row => `
            <div class="card">
              <div class="asset-head">
                <div class="asset-name">${row.text}</div>
                <div class="asset-price ${num(row.amount) > 0 ? "green" : num(row.amount) < 0 ? "red" : "muted"}">
                  ${num(row.amount) > 0 ? "+" : ""}${formatMoney(row.amount)}
                </div>
              </div>
              <div class="asset-meta" style="margin-top:10px;">
                <span>${new Date(row.created_at).toLocaleString()}</span>
              </div>
            </div>
          `).join("")
          : `<div class="card"><h3>No history</h3></div>`
      }
    </div>
  `;
}

// ======================================================
// ROLES / CARDS / COLLECTIONS
// ======================================================
function chooseRole(roleId) {
  if (!ROLE_CONFIG[roleId]) return false;
  if (getPlayer().role === roleId) return false;

  const cost = getPlayer().role === "none" ? 25000 : 15000;
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  getPlayer().role = roleId;
  getPlayer().role_stats.changes_count += 1;
  getPlayer().role_stats.total_spent_on_roles += cost;
  if (!getPlayer().role_stats.unlocked_roles.includes(roleId)) {
    getPlayer().role_stats.unlocked_roles.push(roleId);
  }

  saveCurrentPlayer();
  addHistory(`Choose role ${roleId}`, -cost);
  renderCurrentPage();
  return true;
}

function buyCardTheme(themeId) {
  if (!CARD_THEMES[themeId]) return false;
  if (getPlayer().card_themes_owned.includes(themeId)) return false;

  const prices = {
    black_elite: 75000,
    gold_luxe: 180000,
    neon_pulse: 220000,
    metal_titan: 260000,
    ruby_red: 310000,
    ice_glass: 380000,
    mono_bankish: 450000
  };

  const cost = num(prices[themeId] || 0);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  getPlayer().card_themes_owned.push(themeId);
  saveCurrentPlayer();
  addHistory(`Buy card theme ${themeId}`, -cost);
  renderCurrentPage();
  return true;
}

function applyCardTheme(themeId) {
  if (!getPlayer().card_themes_owned.includes(themeId)) return false;
  getPlayer().card_theme = themeId;
  saveCurrentPlayer();
  addHistory(`Apply card theme ${themeId}`, 0);
  renderCurrentPage();
  return true;
}

function checkCollections() {
  const claimed = getPlayer().collections_state.claimed;

  const carNames = getPlayer().cars.map(x => x.name || x);
  const realtyNames = getPlayer().realty.map(x => x.name || x);
  const themes = getPlayer().card_themes_owned;
  const roles = getPlayer().role_stats.unlocked_roles;

  if (!claimed.cars_sport_set && ["Ferrari", "Lamborghini", "Porsche"].every(x => carNames.includes(x))) {
    claimed.cars_sport_set = true;
    addHistory("Collection completed: cars_sport_set", 0);
  }

  if (!claimed.cards_premium_set && ["black_elite", "gold_luxe", "neon_pulse", "metal_titan"].every(x => themes.includes(x))) {
    claimed.cards_premium_set = true;
    addHistory("Collection completed: cards_premium_set", 0);
  }

  if (!claimed.roles_finance_set && ["trader", "banker", "entrepreneur"].every(x => roles.includes(x))) {
    claimed.roles_finance_set = true;
    addHistory("Collection completed: roles_finance_set", 0);
  }

  if (!claimed.realty_luxury_set && ["Villa", "Private Island"].every(x => realtyNames.includes(x))) {
    claimed.realty_luxury_set = true;
    addHistory("Collection completed: realty_luxury_set", 0);
  }

  saveCurrentPlayer();
}

// ======================================================
// LOOT
// ======================================================
function rollLootRarity(type) {
  const roll = Math.random();

  if (type === "basic_safe") {
    if (roll < 0.55) return "common";
    if (roll < 0.83) return "rare";
    if (roll < 0.96) return "epic";
    return "legendary";
  }

  if (type === "premium_safe") {
    if (roll < 0.35) return "common";
    if (roll < 0.67) return "rare";
    if (roll < 0.90) return "epic";
    return "legendary";
  }

  if (roll < 0.18) return "common";
  if (roll < 0.48) return "rare";
  if (roll < 0.80) return "epic";
  return "legendary";
}

function openLootBox(type) {
  const prices = {
    basic_safe: 25000,
    premium_safe: 125000,
    elite_crate: 450000
  };

  const price = prices[type];
  if (!removeBalance(price)) {
    alert("Недостатньо грошей");
    return false;
  }

  const rarity = rollLootRarity(type);
  getPlayer().loot_profile.opened_total += 1;
  getPlayer().loot_profile.rarity_stats[rarity] += 1;

  let rewardText = "";
  if (rarity === "common") {
    const uah = randomInt(5000, 35000);
    addBalance(uah);
    rewardText = `₴ ${formatMoney(uah)}`;
  } else if (rarity === "rare") {
    const usd = randomInt(100, 500);
    addUSD(usd);
    rewardText = `$ ${formatMoney(usd)}`;
  } else if (rarity === "epic") {
    getPlayer().inventory.push({ name: "Gold Prestige Frame", rarity: "epic", source: "loot", receivedAt: nowIso() });
    rewardText = "Gold Prestige Frame";
  } else {
    const options = ["Ferrari", "Villa", "mono_bankish"];
    const picked = options[randomInt(0, options.length - 1)];

    if (picked === "Ferrari") {
      getPlayer().cars.push({ name: "Ferrari", value: 12000000, source: "loot", receivedAt: nowIso() });
    } else if (picked === "Villa") {
      getPlayer().realty.push({ name: "Villa", value: 25000000, source: "loot", receivedAt: nowIso() });
    } else {
      if (!getPlayer().card_themes_owned.includes("mono_bankish")) {
        getPlayer().card_themes_owned.push("mono_bankish");
      }
    }

    rewardText = picked;
  }

  saveCurrentPlayer();
  addHistory(`Open loot box ${type}: ${rewardText}`, -price);
  checkCollections();
  renderCurrentPage();
  return true;
}

function renderLootPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Loot & Safes</h2>
      <p>Відкривай сейфи і вибивай нагороди.</p>
    </div>

    <div class="asset-grid">
      <div class="card">
        <h3>Basic Safe</h3>
        <button data-loot="basic_safe">Open for ₴ 25,000</button>
      </div>

      <div class="card">
        <h3>Premium Safe</h3>
        <button data-loot="premium_safe">Open for ₴ 125,000</button>
      </div>

      <div class="card">
        <h3>Elite Crate</h3>
        <button data-loot="elite_crate">Open for ₴ 450,000</button>
      </div>
    </div>
  `;
}

// ======================================================
// CASINO
// ======================================================
function playSlots(bet) {
  const value = num(bet);
  if (!removeBalance(value)) {
    alert("Недостатньо грошей");
    return false;
  }

  const reels = ["🍒", "🍋", "💎", "7️⃣", "⭐", "🍀"];
  const a = reels[randomInt(0, reels.length - 1)];
  const b = reels[randomInt(0, reels.length - 1)];
  const c = reels[randomInt(0, reels.length - 1)];

  let reward = 0;
  if (a === b && b === c) reward = value * 5;
  else if (a === b || b === c || a === c) reward = value * 2;

  if (reward > 0) addBalance(reward);

  AppState.battle.lastResult = null;
  getPlayer().casino_profile.jackpot_bank += Math.floor(value * 0.12);

  saveCurrentPlayer();
  addHistory(`Slots ${a}|${b}|${c}`, reward - value);
  renderCurrentPage();
  return true;
}

function spinWheel() {
  if (getPlayer().casino_profile.daily_wheel_day === todayKey()) {
    alert("Сьогодні вже крутив");
    return false;
  }

  const rewards = [
    () => { addBalance(5000); return "₴ 5,000"; },
    () => { addBalance(15000); return "₴ 15,000"; },
    () => { addUSD(100); return "$ 100"; },
    () => { getPlayer().loot_profile.free_boxes.basic_safe += 1; saveCurrentPlayer(); return "Free Basic Safe"; },
    () => { return "Nothing"; }
  ];

  const result = rewards[randomInt(0, rewards.length - 1)]();
  getPlayer().casino_profile.daily_wheel_day = todayKey();
  saveCurrentPlayer();
  addHistory(`Daily wheel: ${result}`, 0);
  renderCurrentPage();
  return true;
}

function buyLotteryTicket() {
  if (!removeBalance(5000)) {
    alert("Недостатньо грошей");
    return false;
  }

  getPlayer().casino_profile.lottery_tickets += 1;
  getPlayer().casino_profile.lottery_bank += 3500;
  saveCurrentPlayer();
  addHistory("Buy lottery ticket", -5000);
  renderCurrentPage();
  return true;
}

function drawLottery() {
  const tickets = num(getPlayer().casino_profile.lottery_tickets);
  if (tickets <= 0) {
    alert("Немає квитків");
    return false;
  }

  const chance = Math.min(35, tickets * 2);
  const won = randomInt(1, 100) <= chance;

  if (won) {
    const reward = num(getPlayer().casino_profile.lottery_bank);
    addBalance(reward);
    getPlayer().casino_profile.lottery_bank = 250000;
    addHistory("Lottery win", reward);
  } else {
    addHistory("Lottery lose", 0);
  }

  getPlayer().casino_profile.lottery_tickets = 0;
  saveCurrentPlayer();
  renderCurrentPage();
  return true;
}

function renderCasinoPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Casino</h2>
      <p>Слоти, колесо фортуни і лотерея.</p>
    </div>

    <div class="asset-grid">
      <div class="card">
        <h3>Slots</h3>
        <div class="profile-actions">
          <input id="slots-bet" type="number" placeholder="Bet">
          <button id="play-slots-btn">Play Slots</button>
        </div>
      </div>

      <div class="card">
        <h3>Daily Wheel</h3>
        <button id="spin-wheel-btn">Spin Wheel</button>
      </div>

      <div class="card">
        <h3>Lottery</h3>
        <p><span class="muted">Bank:</span> ₴ ${formatMoney(getPlayer().casino_profile.lottery_bank)}</p>
        <p><span class="muted">Tickets:</span> ${getPlayer().casino_profile.lottery_tickets}</p>
        <div class="asset-actions">
          <button id="buy-ticket-btn">Buy Ticket</button>
          <button class="secondary" id="draw-lottery-btn">Draw</button>
        </div>
      </div>
    </div>
  `;
}

// ======================================================
// BATTLE
// ======================================================
function battlePower() {
  let power = 20;
  power += Math.floor(num(getPlayer().clicks) / 100);
  power += Math.floor(num(getPlayer().total_earned) / 250000);
  power += num(getClassData().clickBonus) * 2;
  power += num(getRoleData().battleBoost) * 100;
  power += num(getCardBonus().clickBoost) * 3;
  power += getPrestige() * 4;
  return Math.max(20, Math.floor(power));
}

function generateEnemy() {
  const names = ["Shadow Broker", "Steel Wolf", "Crypto Phantom", "Night Dealer", "Dark Tycoon"];
  const power = battlePower();
  const mult = [0.8, 1, 1.2, 1.45, 1.8][randomInt(0, 4)];

  return {
    id: `enemy_${Date.now()}_${randomInt(1000,9999)}`,
    name: names[randomInt(0, names.length - 1)],
    power: Math.floor(power * mult + randomInt(-8, 12)),
    reward: Math.floor(power * mult * 220 + randomInt(500, 3500))
  };
}

function generateEnemies() {
  AppState.battle.enemies = Array.from({ length: 6 }, () => generateEnemy());
}

function startBattle(enemyId) {
  if (Date.now() < AppState.battle.cooldownUntil) {
    alert("Cooldown");
    return false;
  }

  const enemy = AppState.battle.enemies.find(e => e.id === enemyId);
  if (!enemy) return false;

  const pwr = battlePower();
  const chance = clamp(0.5 + ((pwr / enemy.power) - 1) * 0.35, 0.1, 0.92);
  const won = Math.random() <= chance;

  if (won) {
    addBalance(enemy.reward);
    getPlayer().battle_profile.wins += 1;
    getPlayer().battle_profile.streak += 1;
    getPlayer().battle_profile.best_streak = Math.max(getPlayer().battle_profile.best_streak, getPlayer().battle_profile.streak);
    getPlayer().battle_profile.rating += randomInt(12, 24);
    addHistory(`Battle win vs ${enemy.name}`, enemy.reward);
  } else {
    getPlayer().battle_profile.losses += 1;
    getPlayer().battle_profile.streak = 0;
    getPlayer().battle_profile.rating = Math.max(500, getPlayer().battle_profile.rating - randomInt(8, 18));
    addHistory(`Battle loss vs ${enemy.name}`, 0);
  }

  AppState.battle.lastResult = { enemy, won, chance };
  AppState.battle.cooldownUntil = Date.now() + 5000;

  saveCurrentPlayer();
  generateEnemies();
  renderCurrentPage();
  return true;
}

function renderBattlePage() {
  if (!AppState.battle.enemies.length) generateEnemies();

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Battle Arena</h2>
      <p>Бийся з ворогами і піднімай рейтинг.</p>
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Power</div>
        <div class="stat-value blue">${formatCompact(battlePower())}</div>
        <div class="stat-sub">Current battle power</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Wins</div>
        <div class="stat-value green">${formatCompact(getPlayer().battle_profile.wins)}</div>
        <div class="stat-sub">Victories</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Losses</div>
        <div class="stat-value red">${formatCompact(getPlayer().battle_profile.losses)}</div>
        <div class="stat-sub">Defeats</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Rating</div>
        <div class="stat-value">${formatCompact(getPlayer().battle_profile.rating)}</div>
        <div class="stat-sub">Arena rating</div>
      </div>
    </div>

    <div class="asset-grid">
      ${AppState.battle.enemies.map(e => `
        <div class="card asset-card">
          <div class="asset-info">
            <div class="asset-head">
              <div class="asset-name">${e.name}</div>
              <div class="asset-price">₴ ${formatCompact(e.reward)}</div>
            </div>
            <div class="asset-meta">
              <span>Power: ${formatCompact(e.power)}</span>
            </div>
            <button data-battle="${e.id}">Fight</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ======================================================
// ADMIN
// ======================================================
function isAdmin() {
  return !!getPlayer()?.is_admin;
}

function adminGiveMoney(username, amount) {
  if (!isAdmin()) return false;
  const user = AppState.players[username];
  if (!user) return false;
  user.balance += num(amount);
  savePlayersToStorage();
  renderCurrentPage();
  return true;
}

function adminTakeMoney(username, amount) {
  if (!isAdmin()) return false;
  const user = AppState.players[username];
  if (!user) return false;
  user.balance = Math.max(0, num(user.balance) - num(amount));
  savePlayersToStorage();
  renderCurrentPage();
  return true;
}

function adminSetClass(username, classId) {
  if (!isAdmin()) return false;
  const user = AppState.players[username];
  if (!user || !CLASS_CONFIG[classId]) return false;
  user.class = classId;
  savePlayersToStorage();
  renderCurrentPage();
  return true;
}

function adminBanUser(username) {
  if (!isAdmin()) return false;
  const user = AppState.players[username];
  if (!user) return false;
  user.banned = true;
  savePlayersToStorage();
  renderCurrentPage();
  return true;
}

function adminUnbanUser(username) {
  if (!isAdmin()) return false;
  const user = AppState.players[username];
  if (!user) return false;
  user.banned = false;
  savePlayersToStorage();
  renderCurrentPage();
  return true;
}

function renderAdminPage() {
  if (!isAdmin()) {
    return `<div class="card"><h2>Admin only</h2></div>`;
  }

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Admin Panel</h2>
      <p>Швидке керування гравцями.</p>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Target User</h3>
        <div class="profile-actions">
          <input id="admin-user" placeholder="username">
          <input id="admin-amount" type="number" placeholder="amount">
          <input id="admin-class" placeholder="class id">
          <div class="asset-actions">
            <button id="admin-give-btn">Give Money</button>
            <button class="secondary" id="admin-take-btn">Take Money</button>
          </div>
          <button id="admin-set-class-btn">Set Class</button>
          <div class="asset-actions">
            <button id="admin-ban-btn">Ban</button>
            <button class="secondary" id="admin-unban-btn">Unban</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Players</h3>
        ${Object.values(AppState.players).map(p => `
          <p>${p.username} — ₴ ${formatMoney(p.balance)} — ${p.banned ? "BANNED" : "ACTIVE"}</p>
        `).join("")}
      </div>
    </div>
  `;
}

// ======================================================
// ROLES / CARDS / COLLECTIONS PAGES
// ======================================================
function renderRolesPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Roles</h2>
      <p>Обери роль під свій стиль гри.</p>
    </div>

    <div class="asset-grid">
      ${Object.entries(ROLE_CONFIG).map(([id, role]) => `
        <div class="card asset-card">
          <div class="asset-info">
            <div class="asset-head">
              <div class="asset-name">${role.name}</div>
              <div class="asset-price">${getPlayer().role === id ? "ACTIVE" : "₴ 25,000"}</div>
            </div>
            <div class="asset-meta">
              <span>Click +${role.clickBoost}</span>
              <span>Market +${Math.floor(role.marketBoost * 100)}%</span>
              <span>Business +${Math.floor(role.businessBoost * 100)}%</span>
            </div>
            <button ${getPlayer().role === id ? "disabled" : ""} data-role="${id}">${getPlayer().role === id ? "Current" : "Choose"}</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCardsPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Card Themes</h2>
      <p>Купуй і застосовуй стилі карток.</p>
    </div>

    <div class="asset-grid">
      ${Object.entries(CARD_THEMES).map(([id, theme]) => `
        <div class="card asset-card">
          <div class="asset-info">
            <div class="asset-head">
              <div class="asset-name">${theme.name}</div>
              <div class="asset-price">${getPlayer().card_theme === id ? "ACTIVE" : getPlayer().card_themes_owned.includes(id) ? "OWNED" : "BUY"}</div>
            </div>
            <div class="asset-meta">
              <span>Click +${theme.clickBoost}</span>
              <span>Prestige +${theme.prestige}</span>
            </div>
            <div class="asset-actions">
              <button ${getPlayer().card_themes_owned.includes(id) ? "disabled" : ""} data-buy-theme="${id}">Buy</button>
              <button class="secondary" ${!getPlayer().card_themes_owned.includes(id) || getPlayer().card_theme === id ? "disabled" : ""} data-apply-theme="${id}">Apply</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCollectionsPage() {
  const claimed = getPlayer().collections_state.claimed;

  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Collections</h2>
      <p>Збирай сети для бонусів.</p>
    </div>

    <div class="asset-grid">
      <div class="card">
        <h3>Sport Cars Set</h3>
        <p>Ferrari + Lamborghini + Porsche</p>
        <p><span class="muted">Completed:</span> ${claimed.cars_sport_set ? "Yes" : "No"}</p>
      </div>

      <div class="card">
        <h3>Premium Card Set</h3>
        <p>black_elite + gold_luxe + neon_pulse + metal_titan</p>
        <p><span class="muted">Completed:</span> ${claimed.cards_premium_set ? "Yes" : "No"}</p>
      </div>

      <div class="card">
        <h3>Finance Roles Set</h3>
        <p>trader + banker + entrepreneur</p>
        <p><span class="muted">Completed:</span> ${claimed.roles_finance_set ? "Yes" : "No"}</p>
      </div>
    </div>
  `;
}

// ======================================================
// STATS / INVENTORY
// ======================================================
function renderStatsPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Stats</h2>
      <p>Основні показники акаунта.</p>
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Balance</div>
        <div class="stat-value green">₴ ${formatCompact(getPlayer().balance)}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">USD</div>
        <div class="stat-value blue">$ ${formatCompact(getPlayer().usd)}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Clicks</div>
        <div class="stat-value">${formatCompact(getPlayer().clicks)}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Passive</div>
        <div class="stat-value orange">₴ ${formatCompact(totalPassiveIncome())}</div>
      </div>
    </div>
  `;
}

function renderInventoryPage() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Inventory</h2>
      <p>Предмети, машини і нерухомість.</p>
    </div>

    <div class="asset-grid">
      ${safeArray(getPlayer().inventory).map(item => `
        <div class="card">
          <h3>${item.name}</h3>
          <p>${item.rarity || "common"}</p>
        </div>
      `).join("")}

      ${safeArray(getPlayer().cars).map(car => `
        <div class="card">
          <h3>${car.name}</h3>
          <p>₴ ${formatMoney(car.value || 0)}</p>
        </div>
      `).join("")}

      ${safeArray(getPlayer().realty).map(realty => `
        <div class="card">
          <h3>${realty.name}</h3>
          <p>₴ ${formatMoney(realty.value || 0)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

// ======================================================
// PAGE ROUTER
// ======================================================
function renderPageContent() {
  if (AppState.page === "profile") return renderProfilePage();
  if (AppState.page === "business") return renderBusinessPage();
  if (AppState.page === "crypto") return renderCryptoPage();
  if (AppState.page === "stocks") return renderStocksPage();
  if (AppState.page === "finance") return renderFinancePage();
  if (AppState.page === "transfers") return renderTransfersPage();
  if (AppState.page === "friends") return renderFriendsPage();
  if (AppState.page === "history") return renderHistoryPage();
  if (AppState.page === "roles") return renderRolesPage();
  if (AppState.page === "cards") return renderCardsPage();
  if (AppState.page === "collections") return renderCollectionsPage();
  if (AppState.page === "loot") return renderLootPage();
  if (AppState.page === "casino") return renderCasinoPage();
  if (AppState.page === "battle") return renderBattlePage();
  if (AppState.page === "admin") return renderAdminPage();
  if (AppState.page === "inventory") return renderInventoryPage();
  if (AppState.page === "stats") return renderStatsPage();
  return renderProfilePage();
}

function renderCurrentPage() {
  const page = $("page-content");
  if (!page) return;

  page.innerHTML = renderPageContent();
  bindDynamicEvents();
  updateHeader();
}

// ======================================================
// UI
// ======================================================
function showAuthScreen() {
  $("login-screen")?.classList.remove("hidden");
  $("app-screen")?.classList.add("hidden");
}

function showAppScreen() {
  $("login-screen")?.classList.add("hidden");
  $("app-screen")?.classList.remove("hidden");
}

function bindAuth() {
  let loginMode = true;

  $("tab-login")?.addEventListener("click", () => {
    loginMode = true;
    $("tab-login")?.classList.add("active");
    $("tab-register")?.classList.remove("active");
  });

  $("tab-register")?.addEventListener("click", () => {
    loginMode = false;
    $("tab-register")?.classList.add("active");
    $("tab-login")?.classList.remove("active");
  });

  $("auth-submit-btn")?.addEventListener("click", () => {
    const username = $("auth-username")?.value.trim();
    const password = $("auth-password")?.value.trim();

    const result = loginMode
      ? loginUser(username, password)
      : registerUser(username, password);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    showAppScreen();
    updateHeader();
    renderCurrentPage();
  });
}

function bindNavigation() {
  document.querySelectorAll(".nav-btn, .mobile-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.page = btn.dataset.page || "profile";
      renderCurrentPage();
    });
  });

  $("logout-btn")?.addEventListener("click", logoutUser);
}

function bindDynamicEvents() {
  $("main-click-btn")?.addEventListener("click", handleClick);

  document.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [type, id] = btn.dataset.buy.split(":");
      const amount = num($(`${type}-amount-${id}`)?.value);
      if (type === "crypto") buyCrypto(id, amount);
      if (type === "stocks") buyStock(id, amount);
    });
  });

  document.querySelectorAll("[data-sell]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [type, id] = btn.dataset.sell.split(":");
      const amount = num($(`${type}-amount-${id}`)?.value);
      if (type === "crypto") sellCrypto(id, amount);
      if (type === "stocks") sellStock(id, amount);
    });
  });

  document.querySelectorAll("[data-business-unlock]").forEach(btn => {
    btn.addEventListener("click", () => unlockBusiness(btn.dataset.businessUnlock));
  });

  document.querySelectorAll("[data-business-level]").forEach(btn => {
    btn.addEventListener("click", () => upgradeBusinessLevel(btn.dataset.businessLevel));
  });

  document.querySelectorAll("[data-business-employee]").forEach(btn => {
    btn.addEventListener("click", () => hireBusinessEmployee(btn.dataset.businessEmployee));
  });

  document.querySelectorAll("[data-business-stock]").forEach(btn => {
    btn.addEventListener("click", () => buyBusinessStock(btn.dataset.businessStock));
  });

  document.querySelectorAll("[data-business-marketing]").forEach(btn => {
    btn.addEventListener("click", () => upgradeBusinessMarketing(btn.dataset.businessMarketing));
  });

  document.querySelectorAll("[data-business-quality]").forEach(btn => {
    btn.addEventListener("click", () => upgradeBusinessQuality(btn.dataset.businessQuality));
  });

  $("open-deposit-btn")?.addEventListener("click", () => {
    createDeposit($("dep-currency")?.value, $("dep-amount")?.value, $("dep-days")?.value);
  });

  document.querySelectorAll("[data-claim-deposit]").forEach(btn => {
    btn.addEventListener("click", () => claimDeposit(btn.dataset.claimDeposit));
  });

  $("take-credit-btn")?.addEventListener("click", () => {
    takeCredit($("credit-amount")?.value, $("credit-days")?.value);
  });

  $("repay-credit-btn")?.addEventListener("click", () => {
    repayCredit($("repay-amount")?.value);
  });

  $("send-uah-btn")?.addEventListener("click", () => {
    sendUAH($("tr-uah-user")?.value.trim(), $("tr-uah-amount")?.value);
  });

  $("send-usd-btn")?.addEventListener("click", () => {
    sendUSD($("tr-usd-user")?.value.trim(), $("tr-usd-amount")?.value);
  });

  $("add-friend-btn")?.addEventListener("click", () => {
    addFriend($("friend-name")?.value.trim());
  });

  document.querySelectorAll("[data-remove-friend]").forEach(btn => {
    btn.addEventListener("click", () => removeFriend(btn.dataset.removeFriend));
  });

  document.querySelectorAll("[data-role]").forEach(btn => {
    btn.addEventListener("click", () => chooseRole(btn.dataset.role));
  });

  document.querySelectorAll("[data-buy-theme]").forEach(btn => {
    btn.addEventListener("click", () => buyCardTheme(btn.dataset.buyTheme));
  });

  document.querySelectorAll("[data-apply-theme]").forEach(btn => {
    btn.addEventListener("click", () => applyCardTheme(btn.dataset.applyTheme));
  });

  document.querySelectorAll("[data-loot]").forEach(btn => {
    btn.addEventListener("click", () => openLootBox(btn.dataset.loot));
  });

  $("play-slots-btn")?.addEventListener("click", () => {
    playSlots($("slots-bet")?.value);
  });

  $("spin-wheel-btn")?.addEventListener("click", spinWheel);
  $("buy-ticket-btn")?.addEventListener("click", buyLotteryTicket);
  $("draw-lottery-btn")?.addEventListener("click", drawLottery);

  document.querySelectorAll("[data-battle]").forEach(btn => {
    btn.addEventListener("click", () => startBattle(btn.dataset.battle));
  });

  $("admin-give-btn")?.addEventListener("click", () => {
    adminGiveMoney($("admin-user")?.value.trim(), $("admin-amount")?.value);
  });

  $("admin-take-btn")?.addEventListener("click", () => {
    adminTakeMoney($("admin-user")?.value.trim(), $("admin-amount")?.value);
  });

  $("admin-set-class-btn")?.addEventListener("click", () => {
    adminSetClass($("admin-user")?.value.trim(), $("admin-class")?.value.trim());
  });

  $("admin-ban-btn")?.addEventListener("click", () => {
    adminBanUser($("admin-user")?.value.trim());
  });

  $("admin-unban-btn")?.addEventListener("click", () => {
    adminUnbanUser($("admin-user")?.value.trim());
  });
}

// ======================================================
// BOOT
// ======================================================
function boot() {
  AppState.players = loadPlayersFromStorage();
  ensureSpecialAccounts();
  initMarket();
  generateEnemies();
  bindAuth();

  const session = getSessionUser();
  if (session && AppState.players[session] && !AppState.players[session].banned) {
    AppState.currentUser = session;
    AppState.player = normalizePlayer(AppState.players[session]);
    showAppScreen();
    bindNavigation();
    updateHeader();
    renderCurrentPage();
  } else {
    showAuthScreen();
  }

  setInterval(() => {
    if (getPlayer()) {
      getPlayer().last_seen = nowIso();
      saveCurrentPlayer();
    }
  }, 10000);

  setInterval(marketTick, 4500);
  setInterval(passiveIncomeTick, 5000);
  setInterval(financeTick, 45000);
}

document.addEventListener("DOMContentLoaded", boot);
