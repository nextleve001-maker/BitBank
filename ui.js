import { AppState } from "./app.js";
import { handleClick } from "./player.js";
import { BUSINESSES } from "./economy.js";
import { MarketState } from "./market.js";

const root = document.getElementById("page-content");

function setPage(html) {
  if (!root) return;
  root.innerHTML = html;
  bindDynamicUI();
  highlightActiveNav();
}

function bindDynamicUI() {
  const clickBtn = document.getElementById("premium-click-btn");
  if (clickBtn) {
    clickBtn.addEventListener("click", handleClick);
  }

  const quickTransferBtn = document.getElementById("quick-transfer-btn");
  if (quickTransferBtn) {
    quickTransferBtn.addEventListener("click", () => {
      document.querySelector('.nav-btn[data-page="transfers"]')?.click();
    });
  }

  const openCardBtn = document.getElementById("open-card-btn");
  if (openCardBtn) {
    openCardBtn.addEventListener("click", () => {
      document.querySelector('.nav-btn[data-page="card"]')?.click();
    });
  }

  const openBusinessBtn = document.getElementById("open-business-btn");
  if (openBusinessBtn) {
    openBusinessBtn.addEventListener("click", () => {
      document.querySelector('.nav-btn[data-page="business"]')?.click();
    });
  }

  const openCryptoBtn = document.getElementById("open-crypto-btn");
  if (openCryptoBtn) {
    openCryptoBtn.addEventListener("click", () => {
      document.querySelector('.nav-btn[data-page="crypto"]')?.click();
    });
  }

  const openStatsBtn = document.getElementById("open-stats-btn");
  if (openStatsBtn) {
    openStatsBtn.addEventListener("click", () => {
      document.querySelector('.nav-btn[data-page="stats"]')?.click();
    });
  }
}

function highlightActiveNav() {
  const current = document.body.dataset.currentPage || "profile";
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === current);
  });
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function getPlayer() {
  return AppState.player || {};
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

function getTitles() {
  return safeArray(getPlayer().titles);
}

function getBusinesses() {
  return safeArray(getPlayer().businesses);
}

function getBusinessLevels() {
  return safeObject(getPlayer().business_levels);
}

function getFriends() {
  return safeArray(getPlayer().friends);
}

function getCars() {
  return safeArray(getPlayer().cars);
}

function getRealty() {
  return safeArray(getPlayer().realty);
}

function getInventory() {
  return safeArray(getPlayer().inventory);
}

function getCryptoWallet() {
  return safeObject(getPlayer().crypto);
}

function getStockWallet() {
  return safeObject(getPlayer().stocks);
}

function calcPassiveIncome() {
  const businesses = getBusinesses();
  const levels = getBusinessLevels();

  let total = 0;

  businesses.forEach((id) => {
    const b = BUSINESSES.find((x) => x.id === id);
    if (!b) return;

    const level = Number(levels[id] || 1);
    total += Number(b.income || 0) * level;
  });

  return total;
}

function calcCryptoValue() {
  const wallet = getCryptoWallet();
  const assets = safeArray(MarketState.crypto);

  let total = 0;

  Object.entries(wallet).forEach(([symbol, amount]) => {
    const asset = assets.find((x) => x.id === symbol || x.symbol === symbol);
    if (!asset) return;
    total += Number(amount || 0) * Number(asset.price || 0);
  });

  return total;
}

function calcStocksValue() {
  const wallet = getStockWallet();
  const assets = safeArray(MarketState.stocks);

  let total = 0;

  Object.entries(wallet).forEach(([symbol, amount]) => {
    const asset = assets.find((x) => x.id === symbol || x.symbol === symbol);
    if (!asset) return;
    total += Number(amount || 0) * Number(asset.price || 0);
  });

  return total;
}

function calcBusinessValue() {
  let total = 0;

  getBusinesses().forEach((id) => {
    const business = BUSINESSES.find((x) => x.id === id);
    if (!business) return;
    total += Number(business.price || 0);
  });

  return total;
}

function calcTotalAssets() {
  return (
    Number(getPlayer().balance || 0) +
    calcCryptoValue() +
    calcStocksValue() +
    calcBusinessValue()
  );
}

function getNetWorthLabel() {
  const value = calcTotalAssets();

  if (value >= 1_000_000_000) return "Empire";
  if (value >= 100_000_000) return "Whale";
  if (value >= 10_000_000) return "Tycoon";
  if (value >= 1_000_000) return "Investor";
  if (value >= 100_000) return "Builder";

  return "Starter";
}

function getAccountMood() {
  const value = Number(getPlayer().balance || 0);

  if (value >= 10_000_000) return "Premium liquidity";
  if (value >= 1_000_000) return "Strong capital";
  if (value >= 100_000) return "Growing reserve";

  return "Early stage balance";
}

function renderProfileCard() {
  const p = getPlayer();

  return `
    <div class="bank-card">
      <div class="bank-top">
        <div>
          <div class="bank-label">BitBank Black</div>
          <div class="bank-name">${p.card_name || p.username || "Player"}</div>
        </div>
        <div class="bank-chip"></div>
      </div>

      <div class="bank-number">${p.card_number || "0000 0000 0000 0000"}</div>

      <div class="bank-bottom">
        <div>
          <div class="bank-small">holder</div>
          <div class="bank-big">${p.username || "Unknown"}</div>
        </div>

        <div>
          <div class="bank-small">cvv</div>
          <div class="bank-big">${p.card_cvv || "000"}</div>
        </div>

        <div>
          <div class="bank-small">exp</div>
          <div class="bank-big">${p.card_expiry || "12/30"}</div>
        </div>
      </div>
    </div>
  `;
}

function renderQuickPanel() {
  return `
    <div class="profile-side-stack">
      <div class="card">
        <h3>Fast Actions</h3>
        <div class="profile-actions">
          <button id="quick-transfer-btn">Transfer</button>
          <button id="open-card-btn" class="secondary">Card Settings</button>
          <button id="open-stats-btn" class="secondary">Statistics</button>
        </div>
      </div>

      <div class="card">
        <h3>Wealth Status</h3>
        <p><span class="muted">Tier:</span> ${getNetWorthLabel()}</p>
        <p><span class="muted">Cash State:</span> ${getAccountMood()}</p>
        <p><span class="muted">Current Class:</span> ${getPlayer().class || "none"}</p>
      </div>

      <div class="card">
        <h3>Portfolio Actions</h3>
        <div class="profile-actions">
          <button id="open-business-btn" class="secondary">Businesses</button>
          <button id="open-crypto-btn" class="secondary">Crypto</button>
        </div>
      </div>
    </div>
  `;
}

function renderBalanceSection() {
  const p = getPlayer();

  return `
    <div class="balance-duo">
      <div class="balance-card">
        <div class="currency">UAH Balance</div>
        <div class="amount green">₴ ${formatMoney(p.balance)}</div>
        <div class="hint">Main operating wallet</div>
      </div>

      <div class="balance-card">
        <div class="currency">USD Balance</div>
        <div class="amount orange">$ ${formatMoney(p.usd)}</div>
        <div class="hint">Reserve currency wallet</div>
      </div>
    </div>
  `;
}

function renderStatsSection() {
  const p = getPlayer();

  return `
    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Total Earned</div>
        <div class="stat-value">₴ ${formatCompact(p.total_earned)}</div>
        <div class="stat-sub">All-time generated revenue</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Passive / Min</div>
        <div class="stat-value green">₴ ${formatCompact(calcPassiveIncome())}</div>
        <div class="stat-sub">Current passive flow</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Portfolio</div>
        <div class="stat-value blue">₴ ${formatCompact(calcTotalAssets())}</div>
        <div class="stat-sub">Cash + business + market</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Network</div>
        <div class="stat-value">${getFriends().length}</div>
        <div class="stat-sub">Friends in your circle</div>
      </div>
    </div>
  `;
}

function renderTitlesSection() {
  const titles = getTitles();

  return `
    <div class="card">
      <h3>Titles & Status</h3>
      <div class="titles-list">
        ${
          titles.length
            ? titles.map((title) => `<div class="title-pill">${title}</div>`).join("")
            : `<div class="title-pill">No titles yet</div>`
        }
      </div>
    </div>
  `;
}

function renderFinanceBlocks() {
  return `
    <div class="dashboard-grid" style="grid-template-columns:1fr 1fr;">
      <div class="card">
        <h3>Exchange</h3>
        <p>Convert between UAH and USD from a single banking hub.</p>
        <div class="profile-actions">
          <button onclick="document.querySelector('.nav-btn[data-page=transfers]')?.click()">Open Exchange</button>
        </div>
      </div>

      <div class="card">
        <h3>Card Controls</h3>
        <p>Change card name, color and security settings.</p>
        <div class="profile-actions">
          <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=card]')?.click()">Manage Card</button>
        </div>
      </div>
    </div>
  `;
}

function renderManualIncomeBlock() {
  return `
    <div class="click-panel">
      <div>
        <h3>Quick Cash</h3>
        <p>Tap for instant balance growth. Built as a premium action, not a random giant game button.</p>
      </div>
      <button id="premium-click-btn" class="click-button">Tap to Earn</button>
    </div>
  `;
}

function renderOverviewBlock() {
  const p = getPlayer();

  return `
    <div class="card">
      <h3>Account Overview</h3>
      <p><span class="muted">Username:</span> ${p.username || "—"}</p>
      <p><span class="muted">Device:</span> ${p.device || "desktop"}</p>
      <p><span class="muted">Businesses:</span> ${getBusinesses().length}</p>
      <p><span class="muted">Cars:</span> ${getCars().length}</p>
      <p><span class="muted">Realty:</span> ${getRealty().length}</p>
      <p><span class="muted">Inventory:</span> ${getInventory().length}</p>
    </div>
  `;
}

export function renderProfilePage() {
  document.body.dataset.currentPage = "profile";

  setPage(`
    <div class="dashboard-grid">
      <div class="profile-main">
        ${renderProfileCard()}
        ${renderQuickPanel()}
      </div>

      ${renderOverviewBlock()}

      <div class="section-title">Wallet</div>
      ${renderBalanceSection()}

      <div class="section-title">Performance</div>
      ${renderStatsSection()}

      <div class="section-title">Banking</div>
      ${renderFinanceBlocks()}

      <div class="section-title">Titles</div>
      ${renderTitlesSection()}

      <div class="section-title">Manual Revenue</div>
      ${renderManualIncomeBlock()}
    </div>
  `);
}

function businessImageById(id) {
  const images = {
    1: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    2: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?auto=format&fit=crop&w=1200&q=80",
    3: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    4: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    5: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    6: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    7: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    8: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80",
    9: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    10: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
  };

  return images[id] || "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80";
}

export function renderBusinessPage() {
  document.body.dataset.currentPage = "business";

  const ownedBusinesses = getBusinesses();
  const levels = getBusinessLevels();

  const cards = BUSINESSES.map((item) => {
    const owned = ownedBusinesses.includes(item.id);
    const level = Number(levels[item.id] || 1);

    return `
      <div class="card asset-card">
        <div class="asset-cover">
          <img src="${businessImageById(item.id)}" alt="${item.name}">
          <div class="asset-badge">${owned ? "Owned" : "Available"}</div>
        </div>

        <div class="asset-info">
          <div class="asset-head">
            <div class="asset-name">${item.name}</div>
            <div class="asset-price">₴ ${formatCompact(item.price)}</div>
          </div>

          <div class="asset-meta">
            <span>Income: ₴ ${formatCompact(item.income)}/min</span>
            <span>Level: ${level}</span>
          </div>

          <div class="asset-actions">
            <button>${owned ? "Manage" : "Buy"}</button>
            <button class="secondary">Upgrade</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  setPage(`
    <div class="section-title">Business Portfolio</div>
    <div class="asset-grid">${cards}</div>
  `);
}

export function renderInventoryPage() {
  document.body.dataset.currentPage = "inventory";

  const inventory = getInventory();

  if (!inventory.length) {
    setPage(`
      <div class="card" style="grid-column:1 / -1;">
        <h2>Inventory</h2>
        <p>Your collected items and rewards will appear here.</p>
      </div>
    `);
    return;
  }

  const cards = inventory.map((item, index) => {
    return `
      <div class="card asset-card">
        <div class="asset-info">
          <div class="asset-head">
            <div class="asset-name">${item.name || `Item ${index + 1}`}</div>
            <div class="asset-price">₴ ${formatCompact(item.value || 0)}</div>
          </div>

          <div class="asset-meta">
            <span>Collectible</span>
            <span>Stored Asset</span>
          </div>

          <div class="asset-actions full">
            <button class="secondary">Inspect</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  setPage(`
    <div class="section-title">Inventory</div>
    <div class="asset-grid">${cards}</div>
  `);
}

export function renderStatsPage() {
  document.body.dataset.currentPage = "stats";

  const p = getPlayer();

  setPage(`
    <div class="dashboard-grid" style="grid-template-columns:repeat(2,1fr);">
      <div class="card">
        <h3>Total Earned</h3>
        <div class="stat-value">₴ ${formatMoney(p.total_earned)}</div>
        <p class="muted">All-time generated money</p>
      </div>

      <div class="card">
        <h3>Total Assets</h3>
        <div class="stat-value blue">₴ ${formatMoney(calcTotalAssets())}</div>
        <p class="muted">Full portfolio value</p>
      </div>

      <div class="card">
        <h3>Passive Income</h3>
        <div class="stat-value green">₴ ${formatMoney(calcPassiveIncome())}</div>
        <p class="muted">Per minute</p>
      </div>

      <div class="card">
        <h3>Portfolio Structure</h3>
        <p>Crypto: ₴ ${formatMoney(calcCryptoValue())}</p>
        <p>Stocks: ₴ ${formatMoney(calcStocksValue())}</p>
        <p>Businesses: ₴ ${formatMoney(calcBusinessValue())}</p>
      </div>
    </div>
  `);
}

export function renderFriendsPage() {
  document.body.dataset.currentPage = "friends";

  const friends = getFriends();
  const players = safeArray(AppState.allPlayers);

  if (!friends.length) {
    setPage(`
      <div class="card" style="grid-column:1 / -1;">
        <h2>Friends</h2>
        <p>You have no friends added yet.</p>
      </div>
    `);
    return;
  }

  const cards = friends.map((id) => {
    const friend = players.find((p) => p.id === id);

    return `
      <div class="card asset-card">
        <div class="asset-info">
          <div class="asset-head">
            <div class="asset-name">${friend?.username || "Unknown Friend"}</div>
            <div class="asset-price">${friend?.device || "offline"}</div>
          </div>

          <div class="asset-meta">
            <span>ID: ${id}</span>
            <span>Status: ${friend ? "Synced" : "Missing"}</span>
          </div>

          <div class="asset-actions full">
            <button class="secondary">Open</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  setPage(`
    <div class="section-title">Friends Network</div>
    <div class="asset-grid">${cards}</div>
  `);
}

export function renderPageUI(page) {
  switch (page) {
    case "profile":
      renderProfilePage();
      break;
    case "business":
      renderBusinessPage();
      break;
    case "inventory":
      renderInventoryPage();
      break;
    case "stats":
      renderStatsPage();
      break;
    case "friends":
      renderFriendsPage();
      break;
    default:
      renderProfilePage();
      break;
  }
}
