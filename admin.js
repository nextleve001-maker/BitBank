import { AppState, updatePlayer } from "./app.js";
import {
  apiGetAllPlayers,
  apiGetPlayer,
  apiUpdatePlayer,
  apiAddHistory,
  apiDeletePlayer
} from "./api.js";

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function numberValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function formatMoney(n) {
  return Math.floor(numberValue(n)).toLocaleString("en-US");
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindAdminUI();
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function getNumberInputValue(id) {
  return numberValue(getInputValue(id));
}

export function isAdmin() {
  const p = getPlayer();
  return p?.username === "admin" || p?.role === "superadmin" || p?.is_admin === true;
}

function adminGuard() {
  if (!isAdmin()) {
    alert("Admin only");
    return false;
  }
  return true;
}

async function loadAdminPlayers() {
  AppState.allPlayers = await apiGetAllPlayers();
  return AppState.allPlayers || [];
}

async function getTargetPlayer(username) {
  const name = String(username || "").trim();
  if (!name) return null;
  return await apiGetPlayer(name);
}

function ensurePlayerShape(player) {
  if (!player) return;

  if (!Array.isArray(player.friends)) player.friends = [];
  if (!Array.isArray(player.inventory)) player.inventory = [];
  if (!Array.isArray(player.cars)) player.cars = [];
  if (!Array.isArray(player.realty)) player.realty = [];
  if (!Array.isArray(player.card_themes_owned)) player.card_themes_owned = ["classic_blue"];

  if (!player.crypto || typeof player.crypto !== "object" || Array.isArray(player.crypto)) player.crypto = {};
  if (!player.stocks || typeof player.stocks !== "object" || Array.isArray(player.stocks)) player.stocks = {};
  if (!player.business_projects || typeof player.business_projects !== "object" || Array.isArray(player.business_projects)) {
    player.business_projects = {};
  }
  if (!player.finances || typeof player.finances !== "object" || Array.isArray(player.finances)) {
    player.finances = {};
  }
}

async function saveTargetPlayer(username, patch) {
  await apiUpdatePlayer(username, patch);
}

async function logAdminAction(text) {
  const admin = getPlayer();
  await apiAddHistory(admin.username, `[ADMIN] ${text}`, 0);
}

// ======================================================
// 20+ ADMIN FUNCTIONS
// ======================================================

// 1
export async function adminGiveMoney(username, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  const value = numberValue(amount);
  player.balance = numberValue(player.balance) + value;

  await saveTargetPlayer(username, { balance: player.balance });
  await apiAddHistory(username, "Admin give money", value);
  await logAdminAction(`Give ₴ ${value} to ${username}`);
  return true;
}

// 2
export async function adminTakeMoney(username, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  const value = numberValue(amount);
  player.balance = Math.max(0, numberValue(player.balance) - value);

  await saveTargetPlayer(username, { balance: player.balance });
  await apiAddHistory(username, "Admin take money", -value);
  await logAdminAction(`Take ₴ ${value} from ${username}`);
  return true;
}

// 3
export async function adminSetMoney(username, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  const value = numberValue(amount);
  player.balance = value;

  await saveTargetPlayer(username, { balance: player.balance });
  await apiAddHistory(username, "Admin set balance", 0);
  await logAdminAction(`Set ₴ ${value} for ${username}`);
  return true;
}

// 4
export async function adminGiveUSD(username, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  const value = numberValue(amount);
  player.usd = numberValue(player.usd) + value;

  await saveTargetPlayer(username, { usd: player.usd });
  await apiAddHistory(username, "Admin give USD", 0);
  await logAdminAction(`Give $ ${value} to ${username}`);
  return true;
}

// 5
export async function adminTakeUSD(username, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  const value = numberValue(amount);
  player.usd = Math.max(0, numberValue(player.usd) - value);

  await saveTargetPlayer(username, { usd: player.usd });
  await apiAddHistory(username, "Admin take USD", 0);
  await logAdminAction(`Take $ ${value} from ${username}`);
  return true;
}

// 6
export async function adminGiveCrypto(username, asset, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  const symbol = String(asset || "").toUpperCase();
  const value = numberValue(amount);

  player.crypto[symbol] = numberValue(player.crypto[symbol] || 0) + value;

  await saveTargetPlayer(username, { crypto: player.crypto });
  await apiAddHistory(username, `Admin give crypto ${symbol}`, 0);
  await logAdminAction(`Give ${value} ${symbol} to ${username}`);
  return true;
}

// 7
export async function adminTakeCrypto(username, asset, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  const symbol = String(asset || "").toUpperCase();
  const value = numberValue(amount);

  player.crypto[symbol] = Math.max(0, numberValue(player.crypto[symbol] || 0) - value);

  await saveTargetPlayer(username, { crypto: player.crypto });
  await apiAddHistory(username, `Admin take crypto ${symbol}`, 0);
  await logAdminAction(`Take ${value} ${symbol} from ${username}`);
  return true;
}

// 8
export async function adminGiveStock(username, asset, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  const symbol = String(asset || "").toUpperCase();
  const value = numberValue(amount);

  player.stocks[symbol] = numberValue(player.stocks[symbol] || 0) + value;

  await saveTargetPlayer(username, { stocks: player.stocks });
  await apiAddHistory(username, `Admin give stock ${symbol}`, 0);
  await logAdminAction(`Give ${value} ${symbol} stock to ${username}`);
  return true;
}

// 9
export async function adminTakeStock(username, asset, amount) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  const symbol = String(asset || "").toUpperCase();
  const value = numberValue(amount);

  player.stocks[symbol] = Math.max(0, numberValue(player.stocks[symbol] || 0) - value);

  await saveTargetPlayer(username, { stocks: player.stocks });
  await apiAddHistory(username, `Admin take stock ${symbol}`, 0);
  await logAdminAction(`Take ${value} ${symbol} stock from ${username}`);
  return true;
}

// 10
export async function adminSetClass(username, classId) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  await saveTargetPlayer(username, { class: classId });
  await apiAddHistory(username, `Admin set class ${classId}`, 0);
  await logAdminAction(`Set class ${classId} for ${username}`);
  return true;
}

// 11
export async function adminSetRole(username, roleId) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  await saveTargetPlayer(username, { role: roleId });
  await apiAddHistory(username, `Admin set role ${roleId}`, 0);
  await logAdminAction(`Set role ${roleId} for ${username}`);
  return true;
}

// 12
export async function adminBanPlayer(username) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  await saveTargetPlayer(username, { banned: true });
  await apiAddHistory(username, "Admin ban", 0);
  await logAdminAction(`Ban ${username}`);
  return true;
}

// 13
export async function adminUnbanPlayer(username) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  await saveTargetPlayer(username, { banned: false });
  await apiAddHistory(username, "Admin unban", 0);
  await logAdminAction(`Unban ${username}`);
  return true;
}

// 14
export async function adminDeleteAccount(username) {
  if (!adminGuard()) return false;
  if (username === "admin") return alert("Cannot delete admin"), false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  await apiDeletePlayer(username);
  await logAdminAction(`Delete account ${username}`);
  return true;
}

// 15
export async function adminResetAccount(username) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  const patch = {
    balance: 0,
    usd: 0,
    total_earned: 0,
    clicks: 0,
    class: "none",
    role: "none",
    crypto: {},
    stocks: {},
    friends: [],
    inventory: [],
    cars: [],
    realty: [],
    business_projects: {},
    card_theme: "classic_blue",
    card_themes_owned: ["classic_blue"]
  };

  await saveTargetPlayer(username, patch);
  await apiAddHistory(username, "Admin reset account", 0);
  await logAdminAction(`Reset account ${username}`);
  return true;
}

// 16
export async function adminGiveItem(username, itemName) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  player.inventory.push({
    name: itemName,
    rarity: "admin",
    source: "admin",
    receivedAt: new Date().toISOString()
  });

  await saveTargetPlayer(username, { inventory: player.inventory });
  await apiAddHistory(username, `Admin give item ${itemName}`, 0);
  await logAdminAction(`Give item ${itemName} to ${username}`);
  return true;
}

// 17
export async function adminGiveCar(username, carName, value = 1000000) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  player.cars.push({
    name: carName,
    value: numberValue(value),
    source: "admin",
    receivedAt: new Date().toISOString()
  });

  await saveTargetPlayer(username, { cars: player.cars });
  await apiAddHistory(username, `Admin give car ${carName}`, 0);
  await logAdminAction(`Give car ${carName} to ${username}`);
  return true;
}

// 18
export async function adminGiveRealty(username, realtyName, value = 5000000) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);
  player.realty.push({
    name: realtyName,
    value: numberValue(value),
    source: "admin",
    receivedAt: new Date().toISOString()
  });

  await saveTargetPlayer(username, { realty: player.realty });
  await apiAddHistory(username, `Admin give realty ${realtyName}`, 0);
  await logAdminAction(`Give realty ${realtyName} to ${username}`);
  return true;
}

// 19
export async function adminSetMessage(message) {
  if (!adminGuard()) return false;

  AppState.gameState = AppState.gameState || {};
  AppState.gameState.global_message = message;

  await logAdminAction(`Set global message: ${message}`);
  return true;
}

// 20
export async function adminSetCardTheme(username, themeId) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);

  if (!player.card_themes_owned.includes(themeId)) {
    player.card_themes_owned.push(themeId);
  }
  player.card_theme = themeId;

  await saveTargetPlayer(username, {
    card_theme: player.card_theme,
    card_themes_owned: player.card_themes_owned
  });

  await apiAddHistory(username, `Admin set card theme ${themeId}`, 0);
  await logAdminAction(`Set card theme ${themeId} for ${username}`);
  return true;
}

// 21
export async function adminUnlockBusiness(username, projectId) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  ensurePlayerShape(player);

  if (!player.business_projects[projectId]) {
    player.business_projects[projectId] = {
      unlocked: true,
      level: 1,
      employees: 1,
      stock: 25,
      quality: 0,
      marketing: 0,
      players: 0,
      trainers: 0
    };
  } else {
    player.business_projects[projectId].unlocked = true;
  }

  await saveTargetPlayer(username, { business_projects: player.business_projects });
  await apiAddHistory(username, `Admin unlock business ${projectId}`, 0);
  await logAdminAction(`Unlock business ${projectId} for ${username}`);
  return true;
}

// 22
export async function adminSetClicks(username, clicks) {
  if (!adminGuard()) return false;

  const player = await getTargetPlayer(username);
  if (!player) return alert("User not found"), false;

  await saveTargetPlayer(username, { clicks: numberValue(clicks) });
  await apiAddHistory(username, `Admin set clicks ${clicks}`, 0);
  await logAdminAction(`Set clicks ${clicks} for ${username}`);
  return true;
}

// ======================================================
// RENDER
// ======================================================
function adminSummary(players) {
  const banned = players.filter((p) => p.banned).length;
  const online = players.filter((p) => {
    const t = new Date(p.last_seen || 0).getTime();
    return Date.now() - t < 15000;
  }).length;

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Players</div>
        <div class="stat-value">${players.length}</div>
        <div class="stat-sub">All accounts</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Online</div>
        <div class="stat-value green">${online}</div>
        <div class="stat-sub">Current online</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Banned</div>
        <div class="stat-value red">${banned}</div>
        <div class="stat-sub">Blocked users</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Admin</div>
        <div class="stat-value blue">${getPlayer().username || "admin"}</div>
        <div class="stat-sub">Current operator</div>
      </div>
    </div>
  `;
}

function playerRowCard(player) {
  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${player.username}</div>
          <div class="asset-price">${player.banned ? "BANNED" : "ACTIVE"}</div>
        </div>

        <div class="asset-meta">
          <span>₴ ${formatMoney(player.balance || 0)}</span>
          <span>$ ${formatMoney(player.usd || 0)}</span>
          <span>${player.class || "none"}</span>
          <span>${player.role || "none"}</span>
        </div>
      </div>
    </div>
  `;
}

export async function renderAdminPage() {
  if (!adminGuard()) return;

  document.body.dataset.currentPage = "admin";
  const players = await loadAdminPlayers();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Admin Panel</h2>
      <p>Повна панель керування гравцями, балансами, активами, банами та бізнесами.</p>
    </div>

    ${adminSummary(players)}

    <div class="dashboard-grid">
      <div class="card">
        <h3>Target User</h3>
        <div class="profile-actions">
          <input id="admin-target-user" placeholder="username">
        </div>
      </div>

      <div class="card">
        <h3>Global Message</h3>
        <div class="profile-actions">
          <input id="admin-global-message" placeholder="global message">
          <button id="admin-set-message-btn">Set Message</button>
        </div>
      </div>
    </div>

    <div class="section-title">Money</div>
    <div class="asset-grid">
      <div class="card">
        <h3>UAH</h3>
        <div class="profile-actions">
          <input id="admin-money-amount" type="number" placeholder="amount">
          <div class="asset-actions">
            <button id="admin-give-money-btn">Give</button>
            <button class="secondary" id="admin-take-money-btn">Take</button>
          </div>
          <button id="admin-set-money-btn">Set Balance</button>
        </div>
      </div>

      <div class="card">
        <h3>USD</h3>
        <div class="profile-actions">
          <input id="admin-usd-amount" type="number" placeholder="amount">
          <div class="asset-actions">
            <button id="admin-give-usd-btn">Give USD</button>
            <button class="secondary" id="admin-take-usd-btn">Take USD</button>
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">Assets</div>
    <div class="asset-grid">
      <div class="card">
        <h3>Crypto / Stocks</h3>
        <div class="profile-actions">
          <input id="admin-asset-symbol" placeholder="BTC / AAPL">
          <input id="admin-asset-amount" type="number" placeholder="amount">
          <div class="asset-actions">
            <button id="admin-give-crypto-btn">Give Crypto</button>
            <button class="secondary" id="admin-take-crypto-btn">Take Crypto</button>
          </div>
          <div class="asset-actions">
            <button id="admin-give-stock-btn">Give Stock</button>
            <button class="secondary" id="admin-take-stock-btn">Take Stock</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Items / Car / Realty</h3>
        <div class="profile-actions">
          <input id="admin-item-name" placeholder="item / car / realty name">
          <input id="admin-item-value" type="number" placeholder="value for car/realty">
          <div class="asset-actions">
            <button id="admin-give-item-btn">Give Item</button>
            <button class="secondary" id="admin-give-car-btn">Give Car</button>
          </div>
          <button id="admin-give-realty-btn">Give Realty</button>
        </div>
      </div>
    </div>

    <div class="section-title">Status</div>
    <div class="asset-grid">
      <div class="card">
        <h3>Class / Role / Theme</h3>
        <div class="profile-actions">
          <input id="admin-class-id" placeholder="class id">
          <button id="admin-set-class-btn">Set Class</button>

          <input id="admin-role-id" placeholder="role id">
          <button id="admin-set-role-btn">Set Role</button>

          <input id="admin-theme-id" placeholder="card theme id">
          <button id="admin-set-theme-btn">Set Card Theme</button>
        </div>
      </div>

      <div class="card">
        <h3>Moderation</h3>
        <div class="profile-actions">
          <button id="admin-ban-btn">Ban</button>
          <button class="secondary" id="admin-unban-btn">Unban</button>
          <button id="admin-reset-btn">Reset Account</button>
          <button class="secondary" id="admin-delete-btn">Delete Account</button>
        </div>
      </div>
    </div>

    <div class="section-title">Advanced</div>
    <div class="asset-grid">
      <div class="card">
        <h3>Business / Clicks</h3>
        <div class="profile-actions">
          <input id="admin-business-id" placeholder="business project id">
          <button id="admin-unlock-business-btn">Unlock Business</button>
          <input id="admin-clicks-value" type="number" placeholder="clicks">
          <button id="admin-set-clicks-btn">Set Clicks</button>
        </div>
      </div>
    </div>

    <div class="section-title">Players</div>
    <div class="asset-grid">
      ${players.map(playerRowCard).join("")}
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindAdminUI() {
  const target = () => getInputValue("admin-target-user");

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", async () => {
      const ok = await fn();
      if (ok) renderAdminPage();
    });
  };

  bind("admin-set-message-btn", async () => {
    return await adminSetMessage(getInputValue("admin-global-message"));
  });

  bind("admin-give-money-btn", async () => {
    return await adminGiveMoney(target(), getNumberInputValue("admin-money-amount"));
  });

  bind("admin-take-money-btn", async () => {
    return await adminTakeMoney(target(), getNumberInputValue("admin-money-amount"));
  });

  bind("admin-set-money-btn", async () => {
    return await adminSetMoney(target(), getNumberInputValue("admin-money-amount"));
  });

  bind("admin-give-usd-btn", async () => {
    return await adminGiveUSD(target(), getNumberInputValue("admin-usd-amount"));
  });

  bind("admin-take-usd-btn", async () => {
    return await adminTakeUSD(target(), getNumberInputValue("admin-usd-amount"));
  });

  bind("admin-give-crypto-btn", async () => {
    return await adminGiveCrypto(target(), getInputValue("admin-asset-symbol"), getNumberInputValue("admin-asset-amount"));
  });

  bind("admin-take-crypto-btn", async () => {
    return await adminTakeCrypto(target(), getInputValue("admin-asset-symbol"), getNumberInputValue("admin-asset-amount"));
  });

  bind("admin-give-stock-btn", async () => {
    return await adminGiveStock(target(), getInputValue("admin-asset-symbol"), getNumberInputValue("admin-asset-amount"));
  });

  bind("admin-take-stock-btn", async () => {
    return await adminTakeStock(target(), getInputValue("admin-asset-symbol"), getNumberInputValue("admin-asset-amount"));
  });

  bind("admin-set-class-btn", async () => {
    return await adminSetClass(target(), getInputValue("admin-class-id"));
  });

  bind("admin-set-role-btn", async () => {
    return await adminSetRole(target(), getInputValue("admin-role-id"));
  });

  bind("admin-ban-btn", async () => {
    return await adminBanPlayer(target());
  });

  bind("admin-unban-btn", async () => {
    return await adminUnbanPlayer(target());
  });

  bind("admin-delete-btn", async () => {
    return await adminDeleteAccount(target());
  });

  bind("admin-reset-btn", async () => {
    return await adminResetAccount(target());
  });

  bind("admin-give-item-btn", async () => {
    return await adminGiveItem(target(), getInputValue("admin-item-name"));
  });

  bind("admin-give-car-btn", async () => {
    return await adminGiveCar(target(), getInputValue("admin-item-name"), getNumberInputValue("admin-item-value"));
  });

  bind("admin-give-realty-btn", async () => {
    return await adminGiveRealty(target(), getInputValue("admin-item-name"), getNumberInputValue("admin-item-value"));
  });

  bind("admin-set-theme-btn", async () => {
    return await adminSetCardTheme(target(), getInputValue("admin-theme-id"));
  });

  bind("admin-unlock-business-btn", async () => {
    return await adminUnlockBusiness(target(), getInputValue("admin-business-id"));
  });

  bind("admin-set-clicks-btn", async () => {
    return await adminSetClicks(target(), getNumberInputValue("admin-clicks-value"));
  });
}
