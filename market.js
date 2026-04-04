import { AppState, updatePlayer } from "./app.js";
import { removeBalance, addBalance } from "./player.js";
import { apiAddHistory } from "./api.js";
import { getCurrentClassConfig } from "./economy.js";
import { t, renderLanguageSwitcher, bindLanguageSwitcher } from "./i18n.js";

// =====================
// CRYPTO DATA
// =====================
export const CRYPTO_ASSETS = [
  { id: "BTC", name: "Bitcoin", symbol: "BTC", price: 2500000, min: 600000, max: 5000000, volatility: 0.035, img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" },
  { id: "ETH", name: "Ethereum", symbol: "ETH", price: 120000, min: 30000, max: 400000, volatility: 0.04, img: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040" },
  { id: "BNB", name: "BNB", symbol: "BNB", price: 28000, min: 5000, max: 70000, volatility: 0.045, img: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=040" },
  { id: "SOL", name: "Solana", symbol: "SOL", price: 8500, min: 1000, max: 30000, volatility: 0.06, img: "https://cryptologos.cc/logos/solana-sol-logo.png?v=040" },
  { id: "XRP", name: "XRP", symbol: "XRP", price: 90, min: 10, max: 500, volatility: 0.07, img: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=040" },
  { id: "ADA", name: "Cardano", symbol: "ADA", price: 45, min: 5, max: 250, volatility: 0.065, img: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=040" },
  { id: "DOGE", name: "Dogecoin", symbol: "DOGE", price: 18, min: 1, max: 120, volatility: 0.08, img: "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=040" },
  { id: "TON", name: "Toncoin", symbol: "TON", price: 320, min: 50, max: 1200, volatility: 0.05, img: "https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040" },
  { id: "DOT", name: "Polkadot", symbol: "DOT", price: 260, min: 50, max: 1500, volatility: 0.055, img: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=040" },
  { id: "AVAX", name: "Avalanche", symbol: "AVAX", price: 1400, min: 150, max: 5000, volatility: 0.06, img: "https://cryptologos.cc/logos/avalanche-avax-logo.png?v=040" },
  { id: "MATIC", name: "Polygon", symbol: "MATIC", price: 75, min: 10, max: 400, volatility: 0.06, img: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=040" },
  { id: "LINK", name: "Chainlink", symbol: "LINK", price: 900, min: 80, max: 3500, volatility: 0.05, img: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=040" },
  { id: "TRX", name: "TRON", symbol: "TRX", price: 14, min: 2, max: 60, volatility: 0.045, img: "https://cryptologos.cc/logos/tron-trx-logo.png?v=040" },
  { id: "LTC", name: "Litecoin", symbol: "LTC", price: 4500, min: 300, max: 15000, volatility: 0.05, img: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=040" },
  { id: "BCH", name: "Bitcoin Cash", symbol: "BCH", price: 11000, min: 1000, max: 30000, volatility: 0.055, img: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png?v=040" },
  { id: "UNI", name: "Uniswap", symbol: "UNI", price: 520, min: 50, max: 2000, volatility: 0.06, img: "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=040" },
  { id: "ATOM", name: "Cosmos", symbol: "ATOM", price: 680, min: 60, max: 2400, volatility: 0.055, img: "https://cryptologos.cc/logos/cosmos-atom-logo.png?v=040" },
  { id: "ETC", name: "Ethereum Classic", symbol: "ETC", price: 1300, min: 100, max: 4000, volatility: 0.06, img: "https://cryptologos.cc/logos/ethereum-classic-etc-logo.png?v=040" },
  { id: "NEAR", name: "NEAR Protocol", symbol: "NEAR", price: 270, min: 20, max: 1200, volatility: 0.065, img: "https://cryptologos.cc/logos/near-protocol-near-logo.png?v=040" },
  { id: "ICP", name: "Internet Computer", symbol: "ICP", price: 500, min: 40, max: 2500, volatility: 0.07, img: "https://cryptologos.cc/logos/internet-computer-icp-logo.png?v=040" }
];

// =====================
// STOCKS DATA
// =====================
export const STOCK_ASSETS = [
  { id: "AAPL", name: "Apple", symbol: "AAPL", price: 9500, min: 3000, max: 25000, volatility: 0.02, img: "https://logo.clearbit.com/apple.com" },
  { id: "MSFT", name: "Microsoft", symbol: "MSFT", price: 11000, min: 4000, max: 30000, volatility: 0.02, img: "https://logo.clearbit.com/microsoft.com" },
  { id: "GOOGL", name: "Google", symbol: "GOOGL", price: 10500, min: 3500, max: 28000, volatility: 0.022, img: "https://logo.clearbit.com/google.com" },
  { id: "AMZN", name: "Amazon", symbol: "AMZN", price: 9800, min: 3000, max: 26000, volatility: 0.024, img: "https://logo.clearbit.com/amazon.com" },
  { id: "TSLA", name: "Tesla", symbol: "TSLA", price: 15000, min: 2000, max: 50000, volatility: 0.045, img: "https://logo.clearbit.com/tesla.com" },
  { id: "NVDA", name: "NVIDIA", symbol: "NVDA", price: 18000, min: 3000, max: 60000, volatility: 0.04, img: "https://logo.clearbit.com/nvidia.com" },
  { id: "META", name: "Meta", symbol: "META", price: 8000, min: 2500, max: 25000, volatility: 0.03, img: "https://logo.clearbit.com/meta.com" },
  { id: "AMD", name: "AMD", symbol: "AMD", price: 5200, min: 1500, max: 18000, volatility: 0.03, img: "https://logo.clearbit.com/amd.com" },
  { id: "NFLX", name: "Netflix", symbol: "NFLX", price: 7000, min: 2000, max: 22000, volatility: 0.03, img: "https://logo.clearbit.com/netflix.com" },
  { id: "INTC", name: "Intel", symbol: "INTC", price: 3500, min: 1000, max: 12000, volatility: 0.025, img: "https://logo.clearbit.com/intel.com" },
  { id: "UBER", name: "Uber", symbol: "UBER", price: 4200, min: 1200, max: 15000, volatility: 0.03, img: "https://logo.clearbit.com/uber.com" },
  { id: "SHOP", name: "Shopify", symbol: "SHOP", price: 6100, min: 1500, max: 20000, volatility: 0.035, img: "https://logo.clearbit.com/shopify.com" },
  { id: "ORCL", name: "Oracle", symbol: "ORCL", price: 5600, min: 1800, max: 17000, volatility: 0.022, img: "https://logo.clearbit.com/oracle.com" },
  { id: "ADBE", name: "Adobe", symbol: "ADBE", price: 7600, min: 2200, max: 24000, volatility: 0.028, img: "https://logo.clearbit.com/adobe.com" },
  { id: "PYPL", name: "PayPal", symbol: "PYPL", price: 4300, min: 900, max: 14000, volatility: 0.03, img: "https://logo.clearbit.com/paypal.com" }
];

// =====================
// STATE
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

function ensureWallets() {
  const p = getPlayer();
  if (!p.crypto || typeof p.crypto !== "object" || Array.isArray(p.crypto)) p.crypto = {};
  if (!p.stocks || typeof p.stocks !== "object" || Array.isArray(p.stocks)) p.stocks = {};
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

  if (type === "crypto") return Number(p.crypto[id] || 0);
  return Number(p.stocks[id] || 0);
}

function setHolding(type, id, amount) {
  const p = getPlayer();
  ensureWallets();

  if (type === "crypto") {
    p.crypto[id] = amount;
  } else {
    p.stocks[id] = amount;
  }
}

function getPortfolioValue(type) {
  const assets = getAssetList(type);

  return assets.reduce((sum, asset) => {
    return sum + getHolding(type, asset.id) * Number(asset.price || 0);
  }, 0);
}

function getPositionCount(type) {
  const source = type === "crypto" ? safeObject(getPlayer().crypto) : safeObject(getPlayer().stocks);
  return Object.keys(source).filter((key) => Number(source[key] || 0) > 0).length;
}

function getCurrentPage() {
  return document.body.dataset.currentPage || "profile";
}

function discountPrice(basePrice) {
  const cls = getCurrentClassConfig();
  const discount = Number(cls.marketDiscount || 0);
  return Math.max(1, basePrice * (1 - discount));
}

function setPage(html, rerenderFn = null) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindMarketUI();

  if (rerenderFn) {
    bindLanguageSwitcher(() => {
      rerenderFn();
    });
  }
}

// =====================
// ACCESS
// =====================
export function canUseCrypto() {
  return true;
}

export function canUseStocks() {
  const cls = getPlayer().class || "none";
  return [
    "silver",
    "gold",
    "platinum",
    "diamond",
    "black",
    "vip",
    "legend",
    "creator"
  ].includes(cls);
}

// =====================
// ENGINE
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
  if (page === "crypto") renderCryptoPage();
  if (page === "stocks") renderStocksPage();
}

// =====================
// BUY / SELL
// =====================
async function persistWallet(type) {
  const p = getPlayer();

  if (type === "crypto") {
    await updatePlayer({ crypto: p.crypto });
  } else {
    await updatePlayer({ stocks: p.stocks });
  }
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

  const cost = qty * discountPrice(Number(asset.price || 0));

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
    alert("Stocks unlock from Silver class and higher");
    return false;
  }

  const asset = getAsset("stocks", id);
  if (!asset) return false;

  const qty = Number(amount);
  if (!qty || qty <= 0) {
    alert("Invalid amount");
    return false;
  }

  const cost = qty * discountPrice(Number(asset.price || 0));

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
// RENDER
// =====================
function pageHeader(title, text) {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
  `;
}

function renderMarketSummary(type) {
  const totalValue = getPortfolioValue(type);
  const positions = getPositionCount(type);
  const cls = getCurrentClassConfig();

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">${type === "crypto" ? `${t("crypto")} ${t("portfolio")}` : `${t("stocks")} ${t("portfolio")}`}</div>
        <div class="stat-value blue">₴ ${formatCompact(totalValue)}</div>
        <div class="stat-sub">Live market value</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Positions</div>
        <div class="stat-value">${positions}</div>
        <div class="stat-sub">Active holdings</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Sentiment</div>
        <div class="stat-value">${MarketState.sentiment}</div>
        <div class="stat-sub">${t("market")} mood</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Discount</div>
        <div class="stat-value green">-${Math.floor((cls.marketDiscount || 0) * 100)}%</div>
        <div class="stat-sub">${cls.name} class bonus</div>
      </div>
    </div>
  `;
}

function renderAssetCard(type, asset) {
  const owned = getHolding(type, asset.id);
  const value = owned * Number(asset.price || 0);
  const buyPrice = discountPrice(Number(asset.price || 0));

  return `
    <div class="card asset-card">
      <div class="asset-cover" style="height:160px;">
        <img
          src="${asset.img}"
          alt="${asset.name}"
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="this.onerror=null;this.src='https://placehold.co/600x400/0b1220/ffffff?text=${asset.symbol}'"
        >
        <div class="asset-badge">${asset.symbol}</div>
      </div>

      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${asset.name}</div>
          <div class="asset-price">₴ ${formatCompact(asset.price)}</div>
        </div>

        <div class="asset-meta">
          <span>${t("owned")}: ${owned}</span>
          <span>Value: ₴ ${formatCompact(value)}</span>
          <span>${t("buy")}: ₴ ${formatCompact(buyPrice)}</span>
        </div>

        <div class="profile-actions">
          <input id="${type}-amount-${asset.id}" type="number" min="0.0001" step="0.0001" placeholder="Amount">
          <div class="asset-actions">
            <button data-market-buy="${type}:${asset.id}">${t("buy")}</button>
            <button class="secondary" data-market-sell="${type}:${asset.id}">${t("sell")}</button>
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

export function renderCryptoPage() {
  document.body.dataset.currentPage = "crypto";

  const cards = MarketState.crypto.map((asset) => renderAssetCard("crypto", asset)).join("");

  setPage(`
    ${pageHeader(`${t("crypto")} ${t("portfolio")}`, "Premium digital asset dashboard with live prices and full wallet overview.")}
    ${renderLanguageSwitcher()}
    ${renderMarketSummary("crypto")}
    <div class="section-title">${t("crypto")}</div>
    <div class="asset-grid">${cards}</div>
  `, renderCryptoPage);
}

export function renderStocksPage() {
  document.body.dataset.currentPage = "stocks";

  if (!canUseStocks()) {
    setPage(`
      ${pageHeader(`${t("stocks")} ${t("portfolio")}`, "Unlock stocks with Silver class or higher.")}
      ${renderLanguageSwitcher()}
      <div class="card" style="grid-column:1 / -1;">
        <h3>${t("stocks")} Locked</h3>
        <p>You need a stronger account class to access stock trading.</p>
      </div>
    `, renderStocksPage);
    return;
  }

  const cards = MarketState.stocks.map((asset) => renderAssetCard("stocks", asset)).join("");

  setPage(`
    ${pageHeader(`${t("stocks")} ${t("portfolio")}`, "Modern premium equity dashboard with clean company cards and market access.")}
    ${renderLanguageSwitcher()}
    ${renderMarketSummary("stocks")}
    <div class="section-title">${t("stocks")}</div>
    <div class="asset-grid">${cards}</div>
  `, renderStocksPage);
}

// =====================
// BIND
// =====================
function bindMarketUI() {
  document.querySelectorAll("[data-market-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const raw = btn.getAttribute("data-market-buy");
      const [type, id] = raw.split(":");
      const amount = getAmountInput(type, id);

      if (type === "crypto") {
        const ok = await buyCrypto(id, amount);
        if (ok) renderCryptoPage();
      } else {
        const ok = await buyStock(id, amount);
        if (ok) renderStocksPage();
      }
    });
  });

  document.querySelectorAll("[data-market-sell]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const raw = btn.getAttribute("data-market-sell");
      const [type, id] = raw.split(":");
      const amount = getAmountInput(type, id);

      if (type === "crypto") {
        const ok = await sellCrypto(id, amount);
        if (ok) renderCryptoPage();
      } else {
        const ok = await sellStock(id, amount);
        if (ok) renderStocksPage();
      }
    });
  });
}

// =====================
// LOOP
// =====================
export function startMarketLoop() {
  setInterval(() => {
    marketTick();
  }, 4500);
}
