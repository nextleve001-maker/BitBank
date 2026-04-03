// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import { removeBalance, addBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// =====================
// CRYPTO DATA
// =====================
export const CRYPTO_ASSETS = [
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    price: 2500000,
    min: 500000,
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

// =====================
// STOCK DATA
// =====================
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
  lastUpdate: Date.now(),
  crypto: structuredClone(CRYPTO_ASSETS),
  stocks: structuredClone(STOCK_ASSETS)
};

// =====================
// HELPERS
// =====================
function getPlayer(){
  return AppState.player;
}

function clamp(value, min, max){
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max){
  return Math.random() * (max - min) + min;
}

function roundPrice(value){
  return Math.max(1, Math.round(value));
}

function ensureWallets(){
  const p = getPlayer();

  if(!p.crypto) p.crypto = {};
  if(!p.stocks) p.stocks = {};
}

function getAssetList(type){
  return type === "crypto" ? MarketState.crypto : MarketState.stocks;
}

function getAsset(type, id){
  return getAssetList(type).find(asset => asset.id === id);
}

function getHolding(type, id){
  const p = getPlayer();
  ensureWallets();

  if(type === "crypto"){
    return Number(p.crypto[id] || 0);
  }

  return Number(p.stocks[id] || 0);
}

function setHolding(type, id, amount){
  const p = getPlayer();
  ensureWallets();

  if(type === "crypto"){
    p.crypto[id] = amount;
    return;
  }

  p.stocks[id] = amount;
}

function getPortfolioValue(type){
  const assets = getAssetList(type);

  return assets.reduce((sum, asset) => {
    return sum + getHolding(type, asset.id) * asset.price;
  }, 0);
}

// =====================
// CLASSES ACCESS
// =====================
export function canUseStocks(){
  const p = getPlayer();
  const rank = p.class || "none";
  return ["trader", "vip", "businessman", "manager", "creator"].includes(rank);
}

export function canUseCrypto(){
  return true;
}

// =====================
// MARKET SENTIMENT
// =====================
export function updateMarketSentiment(){
  const roll = Math.random();

  if(roll < 0.2){
    MarketState.sentiment = "panic";
    MarketState.trend = 0.94;
    return;
  }

  if(roll < 0.4){
    MarketState.sentiment = "bearish";
    MarketState.trend = 0.98;
    return;
  }

  if(roll < 0.6){
    MarketState.sentiment = "neutral";
    MarketState.trend = 1;
    return;
  }

  if(roll < 0.82){
    MarketState.sentiment = "bullish";
    MarketState.trend = 1.03;
    return;
  }

  MarketState.sentiment = "euphoria";
  MarketState.trend = 1.07;
}

// =====================
// PRICE TICK
// =====================
function tickAsset(asset){
  const microNoise = randomBetween(-asset.volatility, asset.volatility);
  const wave = Math.sin(Date.now() / 20000) * (asset.volatility / 3);
  const delta = 1 + microNoise + wave;

  let nextPrice = asset.price * delta;
  nextPrice *= MarketState.trend;
  nextPrice = clamp(nextPrice, asset.min, asset.max);

  asset.price = roundPrice(nextPrice);
}

export function marketTick(){
  updateMarketSentiment();

  MarketState.crypto.forEach(tickAsset);
  MarketState.stocks.forEach(tickAsset);

  MarketState.lastUpdate = Date.now();
}

// =====================
// BUY / SELL CRYPTO
// =====================
export async function buyCrypto(id, amount){
  const p = getPlayer();
  ensureWallets();

  if(!canUseCrypto()){
    alert("Crypto unavailable");
    return false;
  }

  const asset = getAsset("crypto", id);
  if(!asset) return false;

  const qty = Number(amount);
  if(!qty || qty <= 0){
    alert("Invalid amount");
    return false;
  }

  const cost = asset.price * qty;

  if(!removeBalance(cost)){
    alert("Not enough UAH");
    return false;
  }

  const current = getHolding("crypto", id);
  setHolding("crypto", id, current + qty);

  await updatePlayer({
    crypto: p.crypto
  });

  await apiAddHistory(p.username, `Buy crypto ${id}`, -cost);
  return true;
}

export async function sellCrypto(id, amount){
  const p = getPlayer();
  ensureWallets();

  const asset = getAsset("crypto", id);
  if(!asset) return false;

  const qty = Number(amount);
  if(!qty || qty <= 0){
    alert("Invalid amount");
    return false;
  }

  const current = getHolding("crypto", id);

  if(current < qty){
    alert("Not enough crypto");
    return false;
  }

  const income = asset.price * qty;

  setHolding("crypto", id, current - qty);
  addBalance(income);

  await updatePlayer({
    crypto: p.crypto
  });

  await apiAddHistory(p.username, `Sell crypto ${id}`, income);
  return true;
}

// =====================
// BUY / SELL STOCKS
// =====================
export async function buyStock(id, amount){
  const p = getPlayer();
  ensureWallets();

  if(!canUseStocks()){
    alert("Stocks available from trader class");
    return false;
  }

  const asset = getAsset("stocks", id);
  if(!asset) return false;

  const qty = Number(amount);
  if(!qty || qty <= 0){
    alert("Invalid amount");
    return false;
  }

  const cost = asset.price * qty;

  if(!removeBalance(cost)){
    alert("Not enough UAH");
    return false;
  }

  const current = getHolding("stocks", id);
  setHolding("stocks", id, current + qty);

  await updatePlayer({
    stocks: p.stocks
  });

  await apiAddHistory(p.username, `Buy stock ${id}`, -cost);
  return true;
}

export async function sellStock(id, amount){
  const p = getPlayer();
  ensureWallets();

  const asset = getAsset("stocks", id);
  if(!asset) return false;

  const qty = Number(amount);
  if(!qty || qty <= 0){
    alert("Invalid amount");
    return false;
  }

  const current = getHolding("stocks", id);

  if(current < qty){
    alert("Not enough stocks");
    return false;
  }

  const income = asset.price * qty;

  setHolding("stocks", id, current - qty);
  addBalance(income);

  await updatePlayer({
    stocks: p.stocks
  });

  await apiAddHistory(p.username, `Sell stock ${id}`, income);
  return true;
}

// =====================
// SUMMARY HELPERS
// =====================
export function getCryptoSummary(){
  return MarketState.crypto.map(asset => ({
    ...asset,
    owned: getHolding("crypto", asset.id),
    value: getHolding("crypto", asset.id) * asset.price
  }));
}

export function getStockSummary(){
  return MarketState.stocks.map(asset => ({
    ...asset,
    owned: getHolding("stocks", asset.id),
    value: getHolding("stocks", asset.id) * asset.price
  }));
}

export function getMarketOverview(){
  return {
    sentiment: MarketState.sentiment,
    trend: MarketState.trend,
    cryptoValue: getPortfolioValue("crypto"),
    stockValue: getPortfolioValue("stocks")
  };
}

// =====================
// RENDER HELPERS
// =====================
function renderAssetCard(type, asset){
  const owned = getHolding(type, asset.id);

  return `
    <div class="card market-card">
      <div class="market-top">
        <img
          src="${asset.img}"
          alt="${asset.name}"
          width="42"
          height="42"
          onerror="this.src='https://via.placeholder.com/42?text=${asset.symbol}'"
        >
        <div>
          <h3>${asset.name}</h3>
          <p>${asset.symbol}</p>
        </div>
      </div>

      <p>Price: ₴ ${Math.floor(asset.price)}</p>
      <p>Owned: ${owned}</p>
      <p>Value: ₴ ${Math.floor(owned * asset.price)}</p>

      <div class="market-actions">
        <input id="${type}-amount-${asset.id}" type="number" min="1" step="1" placeholder="Amount">
        <button onclick="window.marketBuy('${type}','${asset.id}')">Buy</button>
        <button onclick="window.marketSell('${type}','${asset.id}')">Sell</button>
      </div>
    </div>
  `;
}

function getAmountFromInput(type, id){
  const el = document.getElementById(`${type}-amount-${id}`);
  if(!el) return 0;
  return Number(el.value);
}

// =====================
// PAGE RENDER
// =====================
export function renderCryptoPage(){
  const overview = getMarketOverview();

  let html = `
    <h2>Crypto Market</h2>
    <div class="card">
      <p>Sentiment: ${overview.sentiment}</p>
      <p>Portfolio Value: ₴ ${Math.floor(overview.cryptoValue)}</p>
    </div>
  `;

  MarketState.crypto.forEach(asset => {
    html += renderAssetCard("crypto", asset);
  });

  document.getElementById("page-content").innerHTML = html;
}

export function renderStocksPage(){
  const overview = getMarketOverview();

  let html = `
    <h2>Stock Market</h2>
    <div class="card">
      <p>Sentiment: ${overview.sentiment}</p>
      <p>Portfolio Value: ₴ ${Math.floor(overview.stockValue)}</p>
      <p>Access: ${canUseStocks() ? "Unlocked" : "Locked until trader class"}</p>
    </div>
  `;

  MarketState.stocks.forEach(asset => {
    html += renderAssetCard("stocks", asset);
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// WINDOW BRIDGE
// =====================
window.marketBuy = async function(type, id){
  const amount = getAmountFromInput(type, id);

  if(type === "crypto"){
    const ok = await buyCrypto(id, amount);
    if(ok) renderCryptoPage();
    return;
  }

  const ok = await buyStock(id, amount);
  if(ok) renderStocksPage();
};

window.marketSell = async function(type, id){
  const amount = getAmountFromInput(type, id);

  if(type === "crypto"){
    const ok = await sellCrypto(id, amount);
    if(ok) renderCryptoPage();
    return;
  }

  const ok = await sellStock(id, amount);
  if(ok) renderStocksPage();
};

// =====================
// AUTO MARKET LOOP
// =====================
export function startMarketLoop(){
  setInterval(() => {
    marketTick();
  }, 4000);
}
