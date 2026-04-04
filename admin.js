import { AppState } from "./app.js";
import {
  apiGetPlayer,
  apiUpdatePlayer,
  apiDeletePlayer,
  apiBanUser,
  apiUnbanUser,
  apiGetAllPlayers,
  apiUpdateGameState,
  apiGetGameState,
  apiAddHistory
} from "./api.js";

// =====================
// HELPERS
// =====================
function getPlayer() {
  return AppState.player || {};
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindAdminUI();
}

function formatMoney(n) {
  return Math.floor(Number(n || 0)).toLocaleString("en-US");
}

function formatCompact(n) {
  const value = Number(n || 0);

  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";

  return Math.floor(value).toString();
}

function normalizeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeText(v) {
  return String(v || "").trim();
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function isAdmin() {
  const p = getPlayer();
  return p && (p.class === "creator" || p.username === "admin");
}

function getPlayers() {
  return safeArray(AppState.allPlayers);
}

function getOnlinePlayers() {
  return getPlayers().filter((p) => {
    if (!p.last_seen) return false;
    return Date.now() - new Date(p.last_seen).getTime() < 15000;
  });
}

function adminCard(title, subtitle, body) {
  return `
    <div class="card">
      <h3>${title}</h3>
      ${subtitle ? `<p class="muted" style="margin-bottom:12px;">${subtitle}</p>` : ""}
      ${body}
    </div>
  `;
}

function statCard(title, value, sub, valueClass = "") {
  return `
    <div class="card stat-card">
      <div class="stat-label">${title}</div>
      <div class="stat-value ${valueClass}">${value}</div>
      <div class="stat-sub">${sub}</div>
    </div>
  `;
}

function playerCard(player) {
  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${player.username}</div>
          <div class="asset-price">${player.class || "none"}</div>
        </div>

        <div class="asset-meta">
          <span>₴ ${formatCompact(player.balance)}</span>
          <span>$ ${formatCompact(player.usd)}</span>
          <span>${player.device || "desktop"}</span>
          <span>${player.banned ? "BANNED" : "ACTIVE"}</span>
        </div>

        <div class="profile-actions">
          <button class="secondary" data-fill-user="${player.username}">Select User</button>
        </div>
      </div>
    </div>
  `;
}

function selectedPreviewCard(target) {
  if (!target) {
    return `
      <div class="card">
        <h3>User Preview</h3>
        <p>Select a player to see account details here.</p>
      </div>
    `;
  }

  return `
    <div class="card">
      <h3>User Preview</h3>
      <p><span class="muted">Username:</span> ${target.username}</p>
      <p><span class="muted">Class:</span> ${target.class || "none"}</p>
      <p><span class="muted">Balance:</span> ₴ ${formatMoney(target.balance)}</p>
      <p><span class="muted">USD:</span> $ ${formatMoney(target.usd)}</p>
      <p><span class="muted">Device:</span> ${target.device || "desktop"}</p>
      <p><span class="muted">Banned:</span> ${target.banned ? "Yes" : "No"}</p>
      <p><span class="muted">Businesses:</span> ${safeArray(target.businesses).length}</p>
      <p><span class="muted">Cars:</span> ${safeArray(target.cars).length}</p>
      <p><span class="muted">Realty:</span> ${safeArray(target.realty).length}</p>
    </div>
  `;
}

// =====================
// ADMIN ACTIONS
// =====================
async function loadUserFromInput() {
  const username = normalizeText(getInputValue("admin-user"));
  if (!username) {
    alert("Enter username");
    return null;
  }

  const user = await apiGetPlayer(username);
  if (!user) {
    alert("User not found");
    return null;
  }

  return user;
}

async function adminGiveMoney() {
  const user = await loadUserFromInput();
  if (!user) return;

  const amount = normalizeNumber(getInputValue("admin-amount"));
  if (amount <= 0) {
    alert("Invalid amount");
    return;
  }

  const newBalance = Number(user.balance || 0) + amount;
  const newTotal = Number(user.total_earned || 0) + amount;

  await apiUpdatePlayer(user.username, {
    balance: newBalance,
    total_earned: newTotal
  });

  await apiAddHistory(user.username, "Admin give money", amount);
  await refreshAdminPage(user.username);
}

async function adminTakeMoney() {
  const user = await loadUserFromInput();
  if (!user) return;

  const amount = normalizeNumber(getInputValue("admin-amount"));
  if (amount <= 0) {
    alert("Invalid amount");
    return;
  }

  const newBalance = Number(user.balance || 0) - amount;

  await apiUpdatePlayer(user.username, {
    balance: newBalance
  });

  await apiAddHistory(user.username, "Admin take money", -amount);
  await refreshAdminPage(user.username);
}

async function adminSetBalance() {
  const user = await loadUserFromInput();
  if (!user) return;

  const amount = normalizeNumber(getInputValue("admin-amount"));

  await apiUpdatePlayer(user.username, {
    balance: amount
  });

  await apiAddHistory(user.username, "Admin set balance", amount);
  await refreshAdminPage(user.username);
}

async function adminBanUserAction() {
  const user = await loadUserFromInput();
  if (!user) return;

  await apiBanUser(user.username);
  await apiAddHistory(user.username, "Admin ban", 0);
  await refreshAdminPage(user.username);
}

async function adminUnbanUserAction() {
  const user = await loadUserFromInput();
  if (!user) return;

  await apiUnbanUser(user.username);
  await apiAddHistory(user.username, "Admin unban", 0);
  await refreshAdminPage(user.username);
}

async function adminDeleteUserAction() {
  const user = await loadUserFromInput();
  if (!user) return;

  const confirmed = confirm(`Delete ${user.username}?`);
  if (!confirmed) return;

  await apiDeletePlayer(user.username);
  await refreshAdminPage();
}

async function adminSetClass() {
  const user = await loadUserFromInput();
  if (!user) return;

  const nextClass = normalizeText(getInputValue("admin-class"));
  if (!nextClass) {
    alert("Enter class");
    return;
  }

  await apiUpdatePlayer(user.username, {
    class: nextClass
  });

  await apiAddHistory(user.username, `Admin set class ${nextClass}`, 0);
  await refreshAdminPage(user.username);
}

async function adminSetGlobalMessage() {
  const message = normalizeText(getInputValue("admin-global-message"));

  await apiUpdateGameState({
    global_message: message
  });

  if (AppState.gameState) {
    AppState.gameState.global_message = message;
  }

  await refreshAdminPage(getInputValue("admin-user"));
}

async function adminSetSupportBank() {
  const amount = normalizeNumber(getInputValue("admin-support-bank"));
  const current = await apiGetGameState();

  await apiUpdateGameState({
    id: 1,
    support_bank: amount,
    commission_bank: Number(current?.commission_bank || 0),
    global_message: current?.global_message || ""
  });

  await refreshAdminPage(getInputValue("admin-user"));
}

async function adminSetCommissionBank() {
  const amount = normalizeNumber(getInputValue("admin-commission-bank"));
  const current = await apiGetGameState();

  await apiUpdateGameState({
    id: 1,
    support_bank: Number(current?.support_bank || 0),
    commission_bank: amount,
    global_message: current?.global_message || ""
  });

  await refreshAdminPage(getInputValue("admin-user"));
}

async function adminResetEconomyUser() {
  const user = await loadUserFromInput();
  if (!user) return;

  const confirmed = confirm(`Reset economy for ${user.username}?`);
  if (!confirmed) return;

  await apiUpdatePlayer(user.username, {
    balance: 1000,
    usd: 0,
    crypto: {},
    stocks: {},
    businesses: [],
    business_levels: {},
    realty: [],
    cars: [],
    inventory: [],
    total_earned: 0
  });

  await apiAddHistory(user.username, "Admin economy reset", 0);
  await refreshAdminPage(user.username);
}

// =====================
// RENDER
// =====================
export async function renderAdminPage(selectedUsername = "") {
  document.body.dataset.currentPage = "admin";

  if (!isAdmin()) {
    setPage(`
      <div class="card" style="grid-column:1 / -1;">
        <h2>No Access</h2>
        <p>This panel is available only for admin / creator accounts.</p>
      </div>
    `);
    return;
  }

  AppState.allPlayers = await apiGetAllPlayers();
  const gameState = await apiGetGameState();
  if (gameState) {
    AppState.gameState = gameState;
  }

  const players = getPlayers();
  const online = getOnlinePlayers();
  const selectedUser = selectedUsername ? await apiGetPlayer(selectedUsername) : null;

  const cards = players.map(playerCard).join("");

  setPage(`
    <div class="dashboard-grid">
      <div class="profile-main">
        <div class="card">
          <h2>Admin Control Center</h2>
          <p>Luxury economy panel for balances, moderation and global state.</p>

          <div class="balance-duo" style="margin-top:16px;">
            <div class="balance-card">
              <div class="currency">Support Bank</div>
              <div class="amount green">₴ ${formatMoney(AppState.gameState?.support_bank)}</div>
              <div class="hint">Community reserve</div>
            </div>

            <div class="balance-card">
              <div class="currency">Commission Bank</div>
              <div class="amount orange">₴ ${formatMoney(AppState.gameState?.commission_bank)}</div>
              <div class="hint">Fee accumulator</div>
            </div>
          </div>
        </div>

        ${selectedPreviewCard(selectedUser)}
      </div>

      <div class="card">
        <h3>Global Message</h3>
        <p><span class="muted">Current:</span> ${AppState.gameState?.global_message || "—"}</p>
        <div class="profile-actions" style="margin-top:12px;">
          <input id="admin-global-message" placeholder="Global message">
          <button id="admin-global-message-btn">Save Message</button>
        </div>
      </div>

      <div class="section-title">Dashboard</div>

      <div class="premium-stat-grid">
        ${statCard("Players", players.length, "Total accounts")}
        ${statCard("Online", online.length, "Recently active", "green")}
        ${statCard("Support", `₴ ${formatCompact(AppState.gameState?.support_bank)}`, "Support bank", "blue")}
        ${statCard("Commission", `₴ ${formatCompact(AppState.gameState?.commission_bank)}`, "Commission bank", "orange")}
      </div>

      <div class="section-title">User Management</div>

      <div class="asset-grid">
        ${adminCard(
          "Target User",
          "Select a user and perform actions",
          `
            <div class="profile-actions">
              <input id="admin-user" value="${selectedUsername || ""}" placeholder="Username">
              <input id="admin-amount" type="number" placeholder="Amount">
              <input id="admin-class" placeholder="Class (vip / trader / creator)">
            </div>
          `
        )}

        ${adminCard(
          "Finance",
          "Money operations",
          `
            <div class="profile-actions">
              <button id="admin-give-btn">Give Money</button>
              <button id="admin-take-btn" class="secondary">Take Money</button>
              <button id="admin-set-balance-btn" class="secondary">Set Balance</button>
            </div>
          `
        )}

        ${adminCard(
          "Moderation",
          "Ban / unban / class",
          `
            <div class="profile-actions">
              <button id="admin-ban-btn">Ban User</button>
              <button id="admin-unban-btn" class="secondary">Unban User</button>
              <button id="admin-set-class-btn" class="secondary">Set Class</button>
            </div>
          `
        )}

        ${adminCard(
          "Danger Zone",
          "Hard account actions",
          `
            <div class="profile-actions">
              <button id="admin-reset-user-btn" class="secondary">Reset Economy</button>
              <button id="admin-delete-btn" class="secondary">Delete User</button>
            </div>
          `
        )}
      </div>

      <div class="section-title">Bank Controls</div>

      <div class="asset-grid">
        ${adminCard(
          "Support Bank",
          "Manual reserve editing",
          `
            <div class="profile-actions">
              <input id="admin-support-bank" type="number" placeholder="Support bank value">
              <button id="admin-support-bank-btn">Save Support Bank</button>
            </div>
          `
        )}

        ${adminCard(
          "Commission Bank",
          "Manual fee bank editing",
          `
            <div class="profile-actions">
              <input id="admin-commission-bank" type="number" placeholder="Commission bank value">
              <button id="admin-commission-bank-btn">Save Commission Bank</button>
            </div>
          `
        )}
      </div>

      <div class="section-title">Players</div>
      <div class="asset-grid">${cards}</div>
    </div>
  `);
}

// =====================
// REFRESH
// =====================
async function refreshAdminPage(selectedUsername = "") {
  await renderAdminPage(selectedUsername);
}

// =====================
// BIND
// =====================
function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("click", handler);
  el.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      handler();
    },
    { passive: false }
  );
}

function bindAdminUI() {
  bindClick("admin-give-btn", adminGiveMoney);
  bindClick("admin-take-btn", adminTakeMoney);
  bindClick("admin-set-balance-btn", adminSetBalance);
  bindClick("admin-ban-btn", adminBanUserAction);
  bindClick("admin-unban-btn", adminUnbanUserAction);
  bindClick("admin-delete-btn", adminDeleteUserAction);
  bindClick("admin-set-class-btn", adminSetClass);
  bindClick("admin-global-message-btn", adminSetGlobalMessage);
  bindClick("admin-support-bank-btn", adminSetSupportBank);
  bindClick("admin-commission-bank-btn", adminSetCommissionBank);
  bindClick("admin-reset-user-btn", adminResetEconomyUser);

  document.querySelectorAll("[data-fill-user]").forEach((btn) => {
    const username = btn.getAttribute("data-fill-user");
    if (!username) return;

    btn.addEventListener("click", () => {
      renderAdminPage(username);
    });

    btn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        renderAdminPage(username);
      },
      { passive: false }
    );
  });
}

export { isAdmin };
