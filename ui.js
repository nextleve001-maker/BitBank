import { AppState, updatePlayer, renderPage } from "./app.js";
import {
  getPlayerOverviewStats,
  handleClick,
  rebuildAutoTitles
} from "./player.js";
import { getCurrentClassConfig, calcPassiveIncome } from "./economy.js";
import { getCurrentRoleConfig } from "./roles.js";
import { getCurrentCardTheme } from "./cards.js";
import { getCollectionBonuses } from "./collections.js";

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function numberValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n) {
  return Math.floor(numberValue(n)).toLocaleString("en-US");
}

function formatCompact(n) {
  const value = numberValue(n);
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return Math.floor(value).toString();
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindUIEvents();
}

function countOwnedBusinesses() {
  const projects = safeObject(getPlayer().business_projects);
  return Object.values(projects).filter((x) => x?.unlocked).length;
}

function countInventoryItems() {
  return safeArray(getPlayer().inventory).length;
}

function countCars() {
  return safeArray(getPlayer().cars).length;
}

function countRealty() {
  return safeArray(getPlayer().realty).length;
}

function countCryptoPositions() {
  const crypto = safeObject(getPlayer().crypto);
  return Object.keys(crypto).filter((k) => numberValue(crypto[k]) > 0).length;
}

function countStockPositions() {
  const stocks = safeObject(getPlayer().stocks);
  return Object.keys(stocks).filter((k) => numberValue(stocks[k]) > 0).length;
}

function topbarAvatarLetter() {
  const username = String(getPlayer().username || "B");
  return username.charAt(0).toUpperCase();
}

export function refreshTopbarProfileBits() {
  const avatar = document.getElementById("topbar-avatar-text");
  const prestige = document.getElementById("header-prestige");

  if (avatar) {
    avatar.textContent = topbarAvatarLetter();
  }

  if (prestige) {
    const stats = getPlayerOverviewStats();
    prestige.textContent = `Prestige: ${stats.prestigeLabel}`;
  }
}

// ======================================================
// PROFILE PAGE
// ======================================================
function mainBankCard() {
  const p = getPlayer();
  const theme = getCurrentCardTheme();

  return `
    <div
      class="bank-card"
      style="
        background:${theme.colors.background};
        box-shadow:${theme.colors.glow};
        color:${theme.colors.text};
      "
    >
      <div class="bank-top">
        <div>
          <div class="bank-label">bitbank premium</div>
          <div class="bank-name">${p.card_name || p.username || "Player"}</div>
        </div>

        <div class="bank-chip" style="background:${theme.colors.chip};"></div>
      </div>

      <div class="bank-number">${p.card_number || "0000 0000 0000 0000"}</div>

      <div class="bank-bottom">
        <div>
          <div class="bank-small">holder</div>
          <div class="bank-big">${p.card_name || p.username || "Player"}</div>
        </div>

        <div>
          <div class="bank-small">exp</div>
          <div class="bank-big">${p.card_expiry || "12/30"}</div>
        </div>

        <div>
          <div class="bank-small">cvv</div>
          <div class="bank-big">${p.card_cvv || "000"}</div>
        </div>
      </div>
    </div>
  `;
}

function balanceCards() {
  const p = getPlayer();
  const passive = calcPassiveIncome();

  return `
    <div class="balance-duo">
      <div class="balance-card">
        <div class="currency">UAH Balance</div>
        <div class="amount">₴ ${formatCompact(p.balance || 0)}</div>
        <div class="hint">Liquid game currency</div>
      </div>

      <div class="balance-card">
        <div class="currency">Passive Income</div>
        <div class="amount green">₴ ${formatCompact(passive)}</div>
        <div class="hint">Estimated per minute</div>
      </div>
    </div>
  `;
}

function profileStatsGrid() {
  const stats = getPlayerOverviewStats();

  return `
    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Click Income</div>
        <div class="stat-value blue">${formatCompact(stats.clickIncome)}</div>
        <div class="stat-sub">Per tap</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Prestige</div>
        <div class="stat-value">${formatCompact(stats.prestige)}</div>
        <div class="stat-sub">${stats.prestigeLabel}</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Wealth Tier</div>
        <div class="stat-value green">${stats.wealthTier}</div>
        <div class="stat-sub">Current rank</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Total Earned</div>
        <div class="stat-value">₴ ${formatCompact(stats.totalEarned)}</div>
        <div class="stat-sub">Lifetime earnings</div>
      </div>
    </div>
  `;
}

function profileTitlesBlock() {
  rebuildAutoTitles();

  const titles = safeArray(getPlayer().titles);

  return `
    <div class="card">
      <h3>Titles</h3>
      <div class="titles-list">
        ${
          titles.length
            ? titles.map((title) => `<div class="title-pill">${title}</div>`).join("")
            : `<div class="title-pill">Starter</div>`
        }
      </div>
    </div>
  `;
}

function profileInfoBlock() {
  const cls = getCurrentClassConfig();
  const role = getCurrentRoleConfig();
  const bonuses = getCollectionBonuses();

  return `
    <div class="card">
      <h3>Account Info</h3>
      <p><span class="muted">Username:</span> ${getPlayer().username || "—"}</p>
      <p><span class="muted">Class:</span> ${cls.name}</p>
      <p><span class="muted">Role:</span> ${role.name}</p>
      <p><span class="muted">Card Theme:</span> ${getCurrentCardTheme().name}</p>
      <p><span class="muted">Collection Prestige:</span> +${numberValue(bonuses.prestige || 0)}</p>
    </div>
  `;
}

function profileAssetsMiniGrid() {
  return `
    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Businesses</div>
        <div class="stat-value">${countOwnedBusinesses()}</div>
        <div class="stat-sub">Unlocked projects</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Crypto</div>
        <div class="stat-value">${countCryptoPositions()}</div>
        <div class="stat-sub">Open positions</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Stocks</div>
        <div class="stat-value">${countStockPositions()}</div>
        <div class="stat-sub">Open positions</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Inventory</div>
        <div class="stat-value">${countInventoryItems()}</div>
        <div class="stat-sub">Owned items</div>
      </div>
    </div>
  `;
}

function profileOwnershipBlock() {
  return `
    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Cars</div>
        <div class="stat-value">${countCars()}</div>
        <div class="stat-sub">Owned vehicles</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Realty</div>
        <div class="stat-value">${countRealty()}</div>
        <div class="stat-sub">Owned property</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Friends</div>
        <div class="stat-value">${safeArray(getPlayer().friends).length}</div>
        <div class="stat-sub">Social network</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Clicks</div>
        <div class="stat-value">${formatCompact(getPlayer().clicks || 0)}</div>
        <div class="stat-sub">Tap activity</div>
      </div>
    </div>
  `;
}

function clickPanel() {
  const stats = getPlayerOverviewStats();

  return `
    <div class="click-panel">
      <div>
        <div class="currency">Tap Engine</div>
        <div class="amount">+₴ ${formatCompact(stats.clickIncome)}</div>
        <div class="hint">Натискай для моментального доходу</div>
      </div>

      <button id="main-click-btn" class="click-button" type="button">CLICK</button>
    </div>
  `;
}

export function renderProfilePage() {
  document.body.dataset.currentPage = "profile";
  refreshTopbarProfileBits();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Premium Profile</h2>
      <p>Головна сторінка акаунта: картка, баланс, престиж, активи, титули і швидкий доступ до прогресу.</p>
    </div>

    <div class="dashboard-grid">
      <div class="profile-main">
        ${mainBankCard()}

        <div class="profile-side-stack">
          ${profileInfoBlock()}
          ${profileTitlesBlock()}
        </div>
      </div>

      <div class="card">
        <h3>Quick Actions</h3>
        <div class="profile-actions">
          <button data-quick-page="transfers">Transfers</button>
          <button class="secondary" data-quick-page="card">Card Settings</button>
          <button class="secondary" data-quick-page="finance">Finance Center</button>
          <button class="secondary" data-quick-page="history">Open History</button>
        </div>
      </div>
    </div>

    ${balanceCards()}
    ${profileStatsGrid()}
    ${clickPanel()}

    <div class="section-title">Assets Overview</div>
    ${profileAssetsMiniGrid()}

    <div class="section-title">Ownership</div>
    ${profileOwnershipBlock()}
  `);
}

// ======================================================
// STATS PAGE
// ======================================================
export function renderStatsPage() {
  document.body.dataset.currentPage = "stats";
  const stats = getPlayerOverviewStats();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Player Stats</h2>
      <p>Детальні показники акаунта, доходу, активності та сили профілю.</p>
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Balance</div>
        <div class="stat-value green">₴ ${formatCompact(stats.balance)}</div>
        <div class="stat-sub">Current UAH</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">USD</div>
        <div class="stat-value blue">$ ${formatCompact(stats.usd)}</div>
        <div class="stat-sub">Current USD</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Click Income</div>
        <div class="stat-value">${formatCompact(stats.clickIncome)}</div>
        <div class="stat-sub">Per click</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Prestige</div>
        <div class="stat-value orange">${formatCompact(stats.prestige)}</div>
        <div class="stat-sub">${stats.prestigeLabel}</div>
      </div>
    </div>

    <div class="premium-stat-grid" style="margin-top:16px;">
      <div class="card stat-card">
        <div class="stat-label">Total Earned</div>
        <div class="stat-value">₴ ${formatCompact(stats.totalEarned)}</div>
        <div class="stat-sub">All time</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Total Clicks</div>
        <div class="stat-value">${formatCompact(stats.totalClicks)}</div>
        <div class="stat-sub">Tap history</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Businesses</div>
        <div class="stat-value">${countOwnedBusinesses()}</div>
        <div class="stat-sub">Unlocked projects</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Passive Income</div>
        <div class="stat-value green">₴ ${formatCompact(calcPassiveIncome())}</div>
        <div class="stat-sub">Per minute</div>
      </div>
    </div>
  `);
}

// ======================================================
// INVENTORY PAGE
// ======================================================
function inventoryCard(item, index) {
  const name = typeof item === "string" ? item : (item?.name || `Item ${index + 1}`);
  const rarity = typeof item === "object" ? item?.rarity || "common" : "common";
  const source = typeof item === "object" ? item?.source || "game" : "game";

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${name}</div>
          <div class="asset-price">${rarity}</div>
        </div>

        <div class="asset-meta">
          <span>${source}</span>
          <span>${typeof item === "object" && item?.receivedAt ? new Date(item.receivedAt).toLocaleString() : "—"}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderInventoryPage() {
  document.body.dataset.currentPage = "inventory";

  const items = safeArray(getPlayer().inventory);

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Inventory</h2>
      <p>Тут зберігаються всі предмети, рамки, нагороди, лут і special rewards.</p>
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Items</div>
        <div class="stat-value">${items.length}</div>
        <div class="stat-sub">Inventory size</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Cars</div>
        <div class="stat-value">${countCars()}</div>
        <div class="stat-sub">Owned vehicles</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Realty</div>
        <div class="stat-value">${countRealty()}</div>
        <div class="stat-sub">Owned property</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Themes</div>
        <div class="stat-value">${safeArray(getPlayer().card_themes_owned).length}</div>
        <div class="stat-sub">Card cosmetics</div>
      </div>
    </div>

    <div class="section-title">Inventory Items</div>

    <div class="asset-grid">
      ${
        items.length
          ? items.map(inventoryCard).join("")
          : `
            <div class="card" style="grid-column:1 / -1;">
              <h3>Inventory is empty</h3>
              <p>Отримуй предмети з loot, нагород і майбутніх систем.</p>
            </div>
          `
      }
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindUIEvents() {
  const clickBtn = document.getElementById("main-click-btn");
  if (clickBtn) {
    clickBtn.addEventListener("click", async () => {
      await handleClick();
      renderProfilePage();
    });
  }

  document.querySelectorAll("[data-quick-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("data-quick-page");
      if (page) renderPage(page);
    });
  });
}
