import { AppState, updatePlayer } from "./app.js";
import { removeBalance, addBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// =====================
// MARKET DATA
// =====================
export const CRYPTO_ASSETS = [
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    price: 2500000,
    min: 600000,
    max: 5000000,
    volatility: 0.035,
    img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
  },
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    price: 120000,
    min: 30000,
    max: 400000,
    volatility: 0.04,
    img: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
  },
  {
    id: "BNB",
    name: "BNB",
    symbol: "BNB",
    price: 28000,
    min: 5000,
    max: 70000,
    volatility: 0.045,
    img: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
  },
  {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    price: 8500,
    min: 1000,
    max: 30000,
    volatility: 0.06,
    img: "https://cryptologos.cc/logos/solana-sol-logo.png"
  },
  {
    id: "XRP",
    name: "XRP",
    symbol: "XRP",
    price: 90,
    min: 10,
    max: 500,
    volatility: 0.07,
    img: "https://cryptologos.cc/logos/xrp-xrp-logo.png"
  },
  {
    id: "ADA",
    name: "Cardano",
    symbol: "ADA",
    price: 45,
    min: 5,
    max: 250,
    volatility: 0.065,
    img: "https://cryptologos.cc/logos/cardano-ada-logo.png"
  },
  {
    id: "DOGE",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 18,
    min: 1,
    max: 120,
    volatility: 0.08,
    img: "https://cryptologos.cc/logos/dogecoin-doge-logo.png"
  },
  {
    id: "TON",
    name: "Toncoin",
    symbol: "TON",
    price: 320,
    min: 50,
    max: 1200,
    volatility: 0.05,
    img: "https://cryptologos.cc/logos/toncoin-ton-logo.png"
  },
  {
    id: "DOT",
    name: "Polkadot",
    symbol: "DOT",
    price: 260,
    min: 50,
    max: 1500,
    volatility: 0.055,
    img: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png"
  },
  {
    id: "AVAX",
    name: "Avalanche",
    symbol: "AVAX",
    price: 1400,
    min: 150,
    max: 5000,
    volatility: 0.06,
    img: "https://cryptologos.cc/logos/avalanche-avax-logo.png"
  }
];

export const STOCK_ASSETS = [
  {
    id: "AAPL",
    name: "Apple",
    symbol: "AAPL",
    price: 9500,
    min: 3000,
    max: 25000,
    volatility: 0.02,
    img: "https://logo.clearbit.com/apple.com"
  },
  {
    id: "MSFT",
    name: "Microsoft",
    symbol: "MSFT",
    price: 11000,
    min: 4000,
    max: 30000,
    volatility: 0.02,
    img: "https://logo.clearbit.com/microsoft.com"
  },
  {
    id: "GOOGL",
    name: "Google",
    symbol: "GOOGL",
    price: 10500,
    min: 3500,
    max: 28000,
    volatility: 0.022,
    img: "https://logo.clearbit.com/google.com"
  },
  {
    id: "AMZN",
    name: "Amazon",
    symbol: "AMZN",
    price: 9800,
    min: 3000,
    max: 26000,
    volatility: 0.024,
    img: "https://logo.clearbit.com/amazon.com"
  },
  {
    id: "TSLA",
    name: "Tesla",
    symbol: "TSLA",
    price: 15000,
    min: 2000,
    max: 50000,
    volatility: 0.045,
    img: "https://logo.clearbit.com/tesla.com"
  },
  {
    id: "NVDA",
    name: "NVIDIA",
    symbol: "NVDA",
    price: 18000,
    min: 3000,
    max: 60000,
    volatility: 0.04,
    img: "https://logo.clearbit.com/nvidia.com"
  },
  {
    id: "META",
    name: "Meta",
    symbol: "META",
    price: 8000,
    min: 2500,
    max: 25000,
    volatility: 0.03,
    img: "https://logo.clearbit.com/meta.com"
  },
  {
    id: "INTC",
    name: "Intel",
    symbol: "INTC",
    price: 3500,
    min: 1000,
    max: 12000,
    volatility: 0.025,
    img: "https://logo.clearbit.com/intel.com"
  },
  {
    id: "AMD",
    name: "AMD",
    symbol: "AMD",
    price: 5200,
    min: 1500,
    max: 18000,
    volatility: 0.03,
    img: "https://logo.clearbit.com/amd.com"
  },
  {
    id: "NFLX",
    name: "Netflix",
    symbol: "NFLX",
    price: 7000,
    min: 2000,
    max: 22000,
    volatility: 0.03,
    img: "https://logo.clearbit.com/netflix.com"
  }
];

// =====================
// MARKET STATE
// =====================
export const MarketState = {
  trend: 1,
  sentiment: "neutral",
  crypto: structuredClone(CRYPTO_ASSETS),
  stocks: structuredClone(STOCK_ASSETS),
  lastUpdate: Date.now()
};

// =====================
// HELPERS
// =====================
function getPlayer() {
  return AppState.player || {};
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function ensureWallets() {
  const p = getPlayer();
  if (!p.crypto) p.crypto = {};
  if (!p.stocks) p.stocks = {};
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

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundPrice(value) {
  return Math.max(1, Math.round(value));
}

function getAssetList(type) {
  return type === "crypto" ? MarketState.crypto : MarketState.stocks;
}

function getAsset(type, id) {
  return getAssetList(type).find((asset) => asset.id === id);
}

function getHolding(type, id) {
  const p = getPlayer();
  ensureWallets();

  if (type === "crypto") {
    return Number(p.crypto[id] || 0);
  }

  return Number(p.stocks[id] || 0);
}

function setHolding(type, id, amount) {
  const p = getPlayer();
  ensureWallets();

  if (type === "crypto") {
    p.crypto[id] = amount;
    return;
  }

  p.stocks[id] = amount;
}

function getPortfolioValue(type) {
  const assets = getAssetList(type);

  return assets.reduce((sum, asset) => {
    return sum + getHolding(type, asset.id) * Number(asset.price || 0);
  }, 0);
}

function getPositionCount(type) {
  if (type === "crypto") {
    return Object.keys(safeObject(getPlayer().crypto)).filter((key) => Number(getPlayer().crypto[key] || 0) > 0).length;
  }

  return Object.keys(safeObject(getPlayer().stocks)).filter((key) => Number(getPlayer().stocks[key] || 0) > 0).length;
}

function getCurrentPage() {
  return document.body.dataset.currentPage || "profile";
}

function isPhone() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// =====================
// ACCESS
// =====================
export function canUseCrypto() {
  return true;
}

export function canUseStocks() {
  const accountClass = getPlayer().class || "none";
  return ["trader", "vip", "businessman", "manager", "creator"].includes(accountClass);
}

// =====================
// MARKET ENGINE
// =====================
function updateMarketSentiment() {
  const roll = Math.random();

  if (roll < 0.18) {
    MarketState.sentiment = "panic";
    MarketState.trend = 0.94;
    return;
  }

  if (roll < 0.38) {
    MarketState.sentiment = "bearish";
    MarketState.trend = 0.98;
    return;
  }

  if (roll < 0.62) {
    MarketState.sentiment = "neutral";
    MarketState.trend = 1;
    return;
  }

  if (roll < 0.84) {
    MarketState.sentiment = "bullish";
    MarketState.trend = 1.03;
    return;
  }

  MarketState.sentiment = "euphoria";
  MarketState.trend = 1.07;
}

function tickAsset(asset) {
  const noise = randomBetween(-asset.volatility, asset.volatility);
  const wave = Math.sin(Date.now() / 20000) * (asset.volatility / 3);
  let nextPrice = Number(asset.price || 0) * (1 + noise + wave);

  nextPrice *= MarketState.trend;
  nextPrice = clamp(nextPrice, asset.min, asset.max);

  asset.price = roundPrice(nextPrice);
}

export function marketTick() {
  updateMarketSentiment();

  MarketState.crypto.forEach(tickAsset);
  MarketState.stocks.forEach(tickAsset);

  MarketState.lastUpdate = Date.now();

  const page = getCurrentPage();
  if (page === "crypto") {
    renderCryptoPage();
  }
  if (page === "stocks") {
    renderStocksPage();
  }
}

// =====================
// BUY / SELL
// =====================
async function persistWallet(type) {
  const p = getPlayer();

  if (type === "crypto") {
    await updatePlayer({ crypto: p.crypto });
    return;
  }

  await updatePlayer({ stocks: p.stocks });
}

export async function buyCrypto(id, amount) {
  if (!canUseCrypto()) {
    alert("Crypto is unavailable");
    return false;
  }

  const asset = getAsset("crypto", id);
  if (!asset) return false;

  const qty = Number(amount);
  if (!qty || qty <= 0) {
    alert("Invalid amount");
    return false;
  }

  const cost = qty * Number(asset.price || 0);

  if (!removeBalance(cost)) {
    alert("Not enough balance");
    return false;
  }

  const current = getHolding("crypto", id);
  setHolding("crypto", id, current + qty);

  await persistWallet("crypto");
  await apiAddHistory(getPlayer().username, `Buy crypto ${id}`, -cost);

  return true;
}

export async function sellCrypto(id, amount) {
  const asset = getAsset("crypto", id);
  if (!asset) return false;

  const qty = Number(amount);
  if (!qty || qty <= 0) {
    alert("Invalid amount");
    return false;
  }

  const current = getHolding("crypto", id);
  if (current < qty) {
    alert("Not enough crypto");
    return false;
  }

  const income = qty * Number(asset.price || 0);

  setHolding("crypto", id, current - qty);
  addBalance(income);

  await persistWallet("crypto");
  await apiAddHistory(getPlayer().username, `Sell crypto ${id}`, income);

  return true;
}

export async function buyStock(id, amount) {
  if (!canUseStocks()) {
    alert("Stocks unlock from trader class");
    return false;
  }

  const asset = getAsset("stocks", id);
  if (!asset) return false;

  const qty = Number(amount);
  if (!qty || qty <= 0) {
    alert("Invalid amount");
    return false;
  }

  const cost = qty * Number(asset.price || 0);

  if (!removeBalance(cost)) {
    alert("Not enough balance");
    return false;
  }

  const current = getHolding("stocks", id);
  setHolding("stocks", id, current + qty);

  await persistWallet("stocks");
  await apiAddHistory(getPlayer().username, `Buy stock ${id}`, -cost);

  return true;
}

export async function sellStock(id, amount) {
  const asset = getAsset("stocks", id);
  if (!asset) return false;

  const qty = Number(amount);
  if (!qty || qty <= 0) {
    alert("Invalid amount");
    return false;
  }

  const current = getHolding("stocks", id);
  if (current < qty) {
    alert("Not enough stocks");
    return false;
  }

  const income = qty * Number(asset.price || 0);

  setHolding("stocks", id, current - qty);
  addBalance(income);

  await persistWallet("stocks");
  await apiAddHistory(getPlayer().username, `Sell stock ${id}`, income);

  return true;
}

// =====================
// RENDER HELPERS
// =====================
function renderMarketSummary(type) {
  const isCrypto = type === "crypto";
  const totalValue = getPortfolioValue(type);
  const positions = getPositionCount(type);
  const sentiment = MarketState.sentiment;
  const accountClass = getPlayer().class || "none";

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card">
        <h3>${isCrypto ? "Crypto Wallet" : "Stocks Wallet"}</h3>
        <div class="stat-value ${isCrypto ? "blue" : "green"}">₴ ${formatCompact(totalValue)}</div>
        <p class="muted">Current market value</p>
      </div>

      <div class="card">
        <h3>Positions</h3>
        <div class="stat-value">${positions}</div>
        <p class="muted">Active holdings</p>
      </div>

      <div class="card">
        <h3>Sentiment</h3>
        <div class="stat-value">${sentiment}</div>
        <p class="muted">Live market mood</p>
      </div>

      <div class="card">
        <h3>Account Access</h3>
        <div class="stat-value">${isCrypto ? "Open" : accountClass}</div>
        <p class="muted">${isCrypto ? "Crypto is available" : "Stocks require trader+"}</p>
      </div>
    </div>
  `;
}

function renderAssetCard(type, asset) {
  const owned = getHolding(type, asset.id);
  const value = owned * Number(asset.price || 0);

  return `
    <div class="card asset-card">
      <div class="asset-cover" style="height:160px;">
        <img
          src="${asset.img}"
          alt="${asset.name}"
          onerror="this.src='https://via.placeholder.com/600x400?text=${asset.symbol}'"
        >
        <div class="asset-badge">${asset.symbol}</div>
      </div>

      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${asset.name}</div>
          <div class="asset-price">₴ ${formatCompact(asset.price)}</div>
        </div>

        <div class="asset-meta">
          <span>Owned: ${owned}</span>
          <span>Value: ₴ ${formatCompact(value)}</span>
          <span>Trend: ${MarketState.sentiment}</span>
        </div>

        <div class="profile-actions">
          <input id="${type}-amount-${asset.id}" type="number" min="0.0001" step="0.0001" placeholder="Amount">
          <div class="asset-actions">
            <button onclick="window.marketBuy('${type}','${asset.id}')">Buy</button>
            <button class="secondary" onclick="window.marketSell('${type}','${asset.id}')">Sell</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getAmountInput(type, id) {
  const el = document.getElementById(`${type}-amount-${id}`);
  return el ? Number(el.value) : 0;
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
}

function pageHeader(title, text) {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `;
}

// =====================
// RENDER PAGES
// =====================
export function renderCryptoPage() {
  document.body.dataset.currentPage = "crypto";

  const cards = MarketState.crypto.map((asset) => renderAssetCard("crypto", asset)).join("");

  setPage(`
    ${pageHeader("Crypto Portfolio", "Track your digital assets in a premium banking-style investment dashboard.")}
    ${renderMarketSummary("crypto")}
    <div class="section-title">Assets</div>
    <div class="asset-grid">${cards}</div>
  `);
}

export function renderStocksPage() {
  document.body.dataset.currentPage = "stocks";

  const access = canUseStocks();

  if (!access) {
    setPage(`
      ${pageHeader("Stock Portfolio", "Unlock stock trading with trader class or higher.")}
      <div class="card" style="grid-column:1 / -1;">
        <h3>Stocks Locked</h3>
        <p>This section opens from <strong>trader</strong> class and above.</p>
      </div>
    `);
    return;
  }

  const cards = MarketState.stocks.map((asset) => renderAssetCard("stocks", asset)).join("");

  setPage(`
    ${pageHeader("Stock Portfolio", "A clean premium view for equity positions and market movements.")}
    ${renderMarketSummary("stocks")}
    <div class="section-title">Assets</div>
    <div class="asset-grid">${cards}</div>
  `);
}

// =====================
// UI BRIDGE
// =====================
window.marketBuy = async function (type, id) {
  const amount = getAmountInput(type, id);

  if (type === "crypto") {
    const ok = await buyCrypto(id, amount);
    if (ok) renderCryptoPage();
    return;
  }

  const ok = await buyStock(id, amount);
  if (ok) renderStocksPage();
};

window.marketSell = async function (type, id) {
  const amount = getAmountInput(type, id);

  if (type === "crypto") {
    const ok = await sellCrypto(id, amount);
    if (ok) renderCryptoPage();
    return;
  }

  const ok = await sellStock(id, amount);
  if (ok) renderStocksPage();
};

// =====================
// LOOP
// =====================
export function startMarketLoop() {
  setInterval(() => {
    marketTick();
  }, isPhone() ? 5000 : 4000);
}
