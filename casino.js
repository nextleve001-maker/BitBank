import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory, apiLogCasino } from "./api.js";

// ======================================================
// CONSTANTS
// ======================================================
const SLOT_SYMBOLS = ["🍒", "🍋", "💎", "7️⃣", "⭐", "🍀"];
const WHEEL_REWARDS = [
  { type: "uah", label: "₴ 5,000", value: 5000, chance: 24 },
  { type: "uah", label: "₴ 15,000", value: 15000, chance: 18 },
  { type: "uah", label: "₴ 50,000", value: 50000, chance: 12 },
  { type: "usd", label: "$ 100", value: 100, chance: 10 },
  { type: "usd", label: "$ 500", value: 500, chance: 6 },
  { type: "multiplier", label: "x2 next win", value: 2, chance: 8 },
  { type: "case", label: "Free Safe", value: 1, chance: 10 },
  { type: "nothing", label: "No reward", value: 0, chance: 12 }
];

const SAFE_TYPES = [
  {
    id: "basic",
    name: "Basic Safe",
    priceUAH: 25000,
    rewards: [
      { type: "uah", min: 5000, max: 40000, weight: 50 },
      { type: "usd", min: 20, max: 150, weight: 20 },
      { type: "crypto", asset: "BTC", min: 0.00005, max: 0.0003, weight: 8 },
      { type: "crypto", asset: "ETH", min: 0.001, max: 0.01, weight: 10 },
      { type: "item", label: "Basic Card Skin", weight: 12 }
    ]
  },
  {
    id: "premium",
    name: "Premium Safe",
    priceUAH: 125000,
    rewards: [
      { type: "uah", min: 25000, max: 250000, weight: 40 },
      { type: "usd", min: 100, max: 1000, weight: 20 },
      { type: "crypto", asset: "BTC", min: 0.0002, max: 0.001, weight: 10 },
      { type: "crypto", asset: "ETH", min: 0.01, max: 0.05, weight: 12 },
      { type: "crypto", asset: "SOL", min: 0.5, max: 3, weight: 8 },
      { type: "item", label: "Neon Card Skin", weight: 10 }
    ]
  }
];

// ======================================================
// STATE
// ======================================================
export const CasinoState = {
  currentMode: "slots",
  lastResult: null,
  currentWheelResult: null,
  currentSafeResult: null
};

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function ensureCasinoProfile() {
  const p = getPlayer();

  if (!p.casino_profile || typeof p.casino_profile !== "object" || Array.isArray(p.casino_profile)) {
    p.casino_profile = {
      jackpot_bank: 500000,
      lottery_bank: 250000,
      daily_wheel_day: "",
      wheel_bonus_multiplier: 1,
      free_safes: 0,
      lottery_tickets: 0,
      safe_inventory: []
    };
  }
}

function getCasinoProfile() {
  ensureCasinoProfile();
  return getPlayer().casino_profile;
}

function saveCasinoProfile() {
  updatePlayer({
    casino_profile: getPlayer().casino_profile
  });
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
  bindCasinoUI();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function nowIso() {
  return new Date().toISOString();
}

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeBet(value) {
  const n = Math.floor(numberValue(value));
  return Math.max(0, n);
}

function getBetInput() {
  const input = document.getElementById("casino-bet");
  return normalizeBet(input ? input.value : 0);
}

async function addUAH(amount) {
  const p = getPlayer();
  p.balance = numberValue(p.balance) + numberValue(amount);
  p.total_earned = numberValue(p.total_earned) + Math.max(0, numberValue(amount));

  await updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });
}

async function removeUAH(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (numberValue(p.balance) < value) {
    return false;
  }

  p.balance = numberValue(p.balance) - value;

  await updatePlayer({
    balance: p.balance
  });

  return true;
}

async function addUSD(amount) {
  const p = getPlayer();
  p.usd = numberValue(p.usd) + numberValue(amount);

  await updatePlayer({
    usd: p.usd
  });
}

function ensureCryptoWallet() {
  const p = getPlayer();
  if (!p.crypto || typeof p.crypto !== "object" || Array.isArray(p.crypto)) {
    p.crypto = {};
  }
}

async function addCrypto(asset, amount) {
  ensureCryptoWallet();
  const p = getPlayer();

  p.crypto[asset] = numberValue(p.crypto[asset] || 0) + numberValue(amount);

  await updatePlayer({
    crypto: p.crypto
  });
}

async function contributeToJackpot(amount) {
  const profile = getCasinoProfile();
  profile.jackpot_bank = numberValue(profile.jackpot_bank) + numberValue(amount);
  saveCasinoProfile();
}

async function contributeToLottery(amount) {
  const profile = getCasinoProfile();
  profile.lottery_bank = numberValue(profile.lottery_bank) + numberValue(amount);
  saveCasinoProfile();
}

async function spendBetWithContribution(amount) {
  const value = numberValue(amount);
  if (value <= 0) {
    alert("Введи ставку");
    return false;
  }

  const ok = await removeUAH(value);
  if (!ok) {
    alert("Недостатньо грошей");
    return false;
  }

  await contributeToJackpot(Math.floor(value * 0.12));
  await contributeToLottery(Math.floor(value * 0.04));
  return true;
}

async function logCasino(game, bet, resultText, amountDelta) {
  await apiLogCasino(getPlayer().username, game, bet, amountDelta);
  await apiAddHistory(getPlayer().username, `${game}: ${resultText}`, amountDelta);
}

function weightedRandom(items, weightKey = "weight") {
  const total = items.reduce((sum, item) => sum + numberValue(item[weightKey]), 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= numberValue(item[weightKey]);
    if (roll <= 0) return item;
  }

  return items[items.length - 1];
}

// ======================================================
// SLOTS
// ======================================================
function spinSlots() {
  return [
    SLOT_SYMBOLS[randomInt(0, SLOT_SYMBOLS.length - 1)],
    SLOT_SYMBOLS[randomInt(0, SLOT_SYMBOLS.length - 1)],
    SLOT_SYMBOLS[randomInt(0, SLOT_SYMBOLS.length - 1)]
  ];
}

function getSlotsMultiplier(reels) {
  const [a, b, c] = reels;

  if (a === b && b === c) {
    if (a === "7️⃣") return 12;
    if (a === "💎") return 8;
    if (a === "⭐") return 6;
    return 5;
  }

  if (a === b || b === c || a === c) {
    return 2;
  }

  return 0;
}

export async function playSlots() {
  const bet = getBetInput();
  const ok = await spendBetWithContribution(bet);
  if (!ok) return null;

  const reels = spinSlots();
  const multiplier = getSlotsMultiplier(reels);
  const win = multiplier > 0;

  let profit = -bet;

  if (win) {
    const profile = getCasinoProfile();
    const bonusMultiplier = numberValue(profile.wheel_bonus_multiplier || 1);
    const reward = Math.floor(bet * multiplier * bonusMultiplier);

    await addUAH(reward);
    profit = reward - bet;

    profile.wheel_bonus_multiplier = 1;
    saveCasinoProfile();
  }

  CasinoState.lastResult = {
    game: "slots",
    bet,
    reels,
    multiplier,
    win,
    profit,
    time: nowIso()
  };

  await logCasino("Slots", bet, `Result ${reels.join(" | ")}`, profit);
  return CasinoState.lastResult;
}

// ======================================================
// ROULETTE
// ======================================================
const ROULETTE_COLORS = {
  0: "green",
  1: "red", 2: "black", 3: "red", 4: "black", 5: "red", 6: "black",
  7: "red", 8: "black", 9: "red", 10: "black", 11: "black", 12: "red",
  13: "black", 14: "red", 15: "black", 16: "red", 17: "black", 18: "red",
  19: "red", 20: "black", 21: "red", 22: "black", 23: "red", 24: "black",
  25: "red", 26: "black", 27: "red", 28: "black", 29: "black", 30: "red",
  31: "black", 32: "red", 33: "black", 34: "red", 35: "black", 36: "red"
};

export async function playRoulette(betType, betValue) {
  const bet = getBetInput();
  const ok = await spendBetWithContribution(bet);
  if (!ok) return null;

  const rolled = randomInt(0, 36);
  const color = ROULETTE_COLORS[rolled];

  let multiplier = 0;
  let win = false;

  if (betType === "number" && numberValue(betValue) === rolled) {
    multiplier = 35;
    win = true;
  }

  if (betType === "color" && String(betValue).toLowerCase() === color) {
    multiplier = color === "green" ? 14 : 2;
    win = true;
  }

  if (betType === "parity" && rolled !== 0) {
    if (betValue === "even" && rolled % 2 === 0) {
      multiplier = 2;
      win = true;
    }
    if (betValue === "odd" && rolled % 2 !== 0) {
      multiplier = 2;
      win = true;
    }
  }

  let profit = -bet;

  if (win) {
    const reward = Math.floor(bet * multiplier);
    await addUAH(reward);
    profit = reward - bet;
  }

  CasinoState.lastResult = {
    game: "roulette",
    bet,
    rolled,
    color,
    betType,
    betValue,
    multiplier,
    win,
    profit,
    time: nowIso()
  };

  await logCasino("Roulette", bet, `Rolled ${rolled} ${color}`, profit);
  return CasinoState.lastResult;
}

// ======================================================
// WHEEL
// ======================================================
export async function spinDailyWheel() {
  const profile = getCasinoProfile();

  if (profile.daily_wheel_day === todayKey()) {
    alert("Безкоштовна прокрутка вже використана сьогодні");
    return null;
  }

  const reward = weightedRandom(WHEEL_REWARDS, "chance");
  profile.daily_wheel_day = todayKey();

  let resultText = reward.label;

  if (reward.type === "uah") {
    await addUAH(reward.value);
  }

  if (reward.type === "usd") {
    await addUSD(reward.value);
  }

  if (reward.type === "multiplier") {
    profile.wheel_bonus_multiplier = reward.value;
  }

  if (reward.type === "case") {
    profile.free_safes = numberValue(profile.free_safes || 0) + 1;
  }

  saveCasinoProfile();

  CasinoState.currentWheelResult = {
    ...reward,
    time: nowIso()
  };

  await apiAddHistory(getPlayer().username, `Daily wheel: ${resultText}`, reward.type === "uah" ? reward.value : 0);
  return CasinoState.currentWheelResult;
}

// ======================================================
// SAFES / LOOTBOXES
// ======================================================
function getSafeConfig(id) {
  return SAFE_TYPES.find((x) => x.id === id) || null;
}

function rollSafeReward(safe) {
  return weightedRandom(safe.rewards, "weight");
}

export async function openSafe(safeId, isFree = false) {
  const p = getPlayer();
  const profile = getCasinoProfile();
  const safe = getSafeConfig(safeId);

  if (!safe) return null;

  if (isFree) {
    if (numberValue(profile.free_safes || 0) <= 0) {
      alert("Немає безкоштовних сейфів");
      return null;
    }
    profile.free_safes -= 1;
  } else {
    const ok = await removeUAH(safe.priceUAH);
    if (!ok) {
      alert("Недостатньо грошей");
      return null;
    }
  }

  const reward = rollSafeReward(safe);

  let rewardText = "";

  if (reward.type === "uah") {
    const amount = Math.floor(randomInt(reward.min, reward.max));
    await addUAH(amount);
    rewardText = `₴ ${formatMoney(amount)}`;
    CasinoState.currentSafeResult = { type: "uah", label: rewardText, amount };
    await apiAddHistory(p.username, `${safe.name}: reward`, amount);
  }

  if (reward.type === "usd") {
    const amount = Math.floor(randomInt(reward.min, reward.max));
    await addUSD(amount);
    rewardText = `$ ${formatMoney(amount)}`;
    CasinoState.currentSafeResult = { type: "usd", label: rewardText, amount };
    await apiAddHistory(p.username, `${safe.name}: reward`, amount * 40);
  }

  if (reward.type === "crypto") {
    const amount = Number(randomFloat(reward.min, reward.max).toFixed(6));
    await addCrypto(reward.asset, amount);
    rewardText = `${amount} ${reward.asset}`;
    CasinoState.currentSafeResult = { type: "crypto", label: rewardText, amount, asset: reward.asset };
    await apiAddHistory(p.username, `${safe.name}: crypto ${reward.asset}`, 0);
  }

  if (reward.type === "item") {
    if (!Array.isArray(profile.safe_inventory)) {
      profile.safe_inventory = [];
    }

    profile.safe_inventory.push({
      label: reward.label,
      opened_at: nowIso()
    });

    rewardText = reward.label;
    CasinoState.currentSafeResult = { type: "item", label: rewardText };
    await apiAddHistory(p.username, `${safe.name}: item ${reward.label}`, 0);
  }

  saveCasinoProfile();
  return CasinoState.currentSafeResult;
}

// ======================================================
// LOTTERY
// ======================================================
export async function buyLotteryTicket() {
  const p = getPlayer();
  const profile = getCasinoProfile();
  const ticketPrice = 5000;

  const ok = await removeUAH(ticketPrice);
  if (!ok) {
    alert("Недостатньо грошей");
    return false;
  }

  profile.lottery_tickets = numberValue(profile.lottery_tickets || 0) + 1;
  profile.lottery_bank = numberValue(profile.lottery_bank || 0) + Math.floor(ticketPrice * 0.7);

  saveCasinoProfile();
  await apiAddHistory(p.username, "Lottery ticket", -ticketPrice);
  return true;
}

export async function drawLottery() {
  const profile = getCasinoProfile();

  if (numberValue(profile.lottery_tickets || 0) <= 0) {
    alert("У тебе немає квитків");
    return null;
  }

  const winChance = Math.min(35, numberValue(profile.lottery_tickets || 0) * 2);
  const rolled = randomInt(1, 100);

  let won = false;
  let reward = 0;

  if (rolled <= winChance) {
    won = true;
    reward = Math.floor(numberValue(profile.lottery_bank || 0));

    await addUAH(reward);

    profile.lottery_bank = 250000;
    profile.lottery_tickets = 0;
    saveCasinoProfile();

    CasinoState.lastResult = {
      game: "lottery",
      won,
      reward,
      rolled,
      chance: winChance
    };

    await apiAddHistory(getPlayer().username, "Lottery win", reward);
    return CasinoState.lastResult;
  }

  profile.lottery_tickets = 0;
  saveCasinoProfile();

  CasinoState.lastResult = {
    game: "lottery",
    won,
    reward,
    rolled,
    chance: winChance
  };

  await apiAddHistory(getPlayer().username, "Lottery lose", 0);
  return CasinoState.lastResult;
}

// ======================================================
// JACKPOT
// ======================================================
export async function tryJackpotShot() {
  const profile = getCasinoProfile();
  const cost = 50000;

  const ok = await removeUAH(cost);
  if (!ok) {
    alert("Недостатньо грошей");
    return null;
  }

  profile.jackpot_bank = numberValue(profile.jackpot_bank || 0) + Math.floor(cost * 0.75);

  const win = randomInt(1, 1000) === 1;
  let reward = 0;

  if (win) {
    reward = Math.floor(numberValue(profile.jackpot_bank || 0));
    await addUAH(reward);
    profile.jackpot_bank = 500000;
  }

  saveCasinoProfile();

  CasinoState.lastResult = {
    game: "jackpot",
    win,
    reward,
    cost
  };

  await apiAddHistory(getPlayer().username, win ? "Jackpot win" : "Jackpot try", win ? reward : -cost);
  return CasinoState.lastResult;
}

// ======================================================
// RENDER HELPERS
// ======================================================
function sectionCard(title, subtitle, body) {
  return `
    <div class="card">
      <h3>${title}</h3>
      ${subtitle ? `<p class="muted" style="margin-bottom:12px;">${subtitle}</p>` : ""}
      ${body}
    </div>
  `;
}

function summaryCards() {
  const p = getPlayer();
  const profile = getCasinoProfile();

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Баланс</div>
        <div class="stat-value green">₴ ${formatCompact(p.balance)}</div>
        <div class="stat-sub">Доступно для ставок</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Jackpot</div>
        <div class="stat-value orange">₴ ${formatCompact(profile.jackpot_bank)}</div>
        <div class="stat-sub">Поточний джекпот</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Lottery Bank</div>
        <div class="stat-value blue">₴ ${formatCompact(profile.lottery_bank)}</div>
        <div class="stat-sub">Тижневий лотобанк</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Free Safes</div>
        <div class="stat-value">${formatCompact(profile.free_safes)}</div>
        <div class="stat-sub">Безкоштовні сейфи</div>
      </div>
    </div>
  `;
}

function renderResultPanel() {
  const last = CasinoState.lastResult;
  const wheel = CasinoState.currentWheelResult;
  const safe = CasinoState.currentSafeResult;

  return `
    <div class="card">
      <h3>Останні результати</h3>

      ${
        last
          ? `<p><span class="muted">Гра:</span> ${last.game}</p>`
          : `<p class="muted">Ще не було результатів.</p>`
      }

      ${
        last?.game === "slots"
          ? `
            <p><span class="muted">Слоти:</span> ${last.reels.join(" | ")}</p>
            <p><span class="muted">Множник:</span> x${last.multiplier}</p>
            <p><span class="muted">Профіт:</span> ${last.profit >= 0 ? "+" : ""}${formatMoney(last.profit)}</p>
          `
          : ""
      }

      ${
        last?.game === "roulette"
          ? `
            <p><span class="muted">Рулетка:</span> ${last.rolled} (${last.color})</p>
            <p><span class="muted">Ставка:</span> ${last.betType} / ${last.betValue}</p>
            <p><span class="muted">Профіт:</span> ${last.profit >= 0 ? "+" : ""}${formatMoney(last.profit)}</p>
          `
          : ""
      }

      ${
        last?.game === "lottery"
          ? `
            <p><span class="muted">Лотерея:</span> ${last.won ? "Виграш" : "Програш"}</p>
            <p><span class="muted">Шанс:</span> ${last.chance}%</p>
            <p><span class="muted">Нагорода:</span> ₴ ${formatMoney(last.reward)}</p>
          `
          : ""
      }

      ${
        last?.game === "jackpot"
          ? `
            <p><span class="muted">Джекпот:</span> ${last.win ? "Виграш" : "Спроба"}</p>
            <p><span class="muted">Нагорода:</span> ₴ ${formatMoney(last.reward || 0)}</p>
          `
          : ""
      }

      ${
        wheel
          ? `<hr><p><span class="muted">Колесо:</span> ${wheel.label}</p>`
          : ""
      }

      ${
        safe
          ? `<p><span class="muted">Сейф:</span> ${safe.label}</p>`
          : ""
      }
    </div>
  `;
}

// ======================================================
// MAIN PAGE
// ======================================================
export function renderCasinoPage() {
  document.body.dataset.currentPage = "casino";
  ensureCasinoProfile();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Casino Ultra</h2>
      <p>Три режими гри, щоденне колесо, сейфи, лотерея і джекпот в одному казино-модулі.</p>
    </div>

    ${summaryCards()}

    <div class="dashboard-grid">
      <div class="card">
        <h3>Universal Bet</h3>
        <p class="muted" style="margin-bottom:12px;">Одна ставка для слотів і рулетки</p>
        <div class="profile-actions">
          <input id="casino-bet" type="number" min="1" step="1" placeholder="Введи ставку">
        </div>
      </div>

      ${renderResultPanel()}
    </div>

    <div class="section-title">3 режими казино</div>

    <div class="asset-grid">
      ${sectionCard(
        "Slots",
        "Класичні слоти з множниками",
        `
          <div class="profile-actions">
            <button id="play-slots-btn">Крутити слоти</button>
          </div>
        `
      )}

      ${sectionCard(
        "Roulette",
        "Ставки на колір, парність або число",
        `
          <div class="profile-actions">
            <div class="asset-actions">
              <button id="roulette-red-btn">Red</button>
              <button class="secondary" id="roulette-black-btn">Black</button>
            </div>
            <div class="asset-actions">
              <button id="roulette-even-btn">Even</button>
              <button class="secondary" id="roulette-odd-btn">Odd</button>
            </div>
            <input id="roulette-number-input" type="number" min="0" max="36" placeholder="Число 0-36">
            <button id="roulette-number-btn">Ставка на число</button>
          </div>
        `
      )}

      ${sectionCard(
        "Wheel",
        "Щоденна безкоштовна прокрутка",
        `
          <div class="profile-actions">
            <button id="spin-wheel-btn">Безкоштовна прокрутка</button>
          </div>
        `
      )}
    </div>

    <div class="section-title">Сейфи / Лутбокси</div>

    <div class="asset-grid">
      ${sectionCard(
        "Basic Safe",
        "Базовий сейф з UAH / USD / crypto / item",
        `
          <div class="profile-actions">
            <button id="open-basic-safe-btn">Відкрити за ₴ ${formatMoney(SAFE_TYPES[0].priceUAH)}</button>
          </div>
        `
      )}

      ${sectionCard(
        "Premium Safe",
        "Преміальний сейф з кращими нагородами",
        `
          <div class="profile-actions">
            <button id="open-premium-safe-btn">Відкрити за ₴ ${formatMoney(SAFE_TYPES[1].priceUAH)}</button>
          </div>
        `
      )}

      ${sectionCard(
        "Free Safe",
        "Використати безкоштовний сейф з колеса",
        `
          <div class="profile-actions">
            <button id="open-free-safe-btn">Відкрити free safe</button>
          </div>
        `
      )}
    </div>

    <div class="section-title">Лотерея та джекпот</div>

    <div class="asset-grid">
      ${sectionCard(
        "Weekly Lottery",
        "Купуй квитки і пробуй зірвати великий банк",
        `
          <div class="profile-actions">
            <button id="buy-lottery-ticket-btn">Купити квиток ₴ 5,000</button>
            <button class="secondary" id="draw-lottery-btn">Розіграти лотерею</button>
          </div>
        `
      )}

      ${sectionCard(
        "Jackpot Shot",
        "Дорогий постріл у великий джекпот",
        `
          <div class="profile-actions">
            <button id="jackpot-shot-btn">Спробувати за ₴ 50,000</button>
          </div>
        `
      )}
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindCasinoUI() {
  const bind = (id, handler) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", handler);
  };

  bind("play-slots-btn", async () => {
    const result = await playSlots();
    if (result) renderCasinoPage();
  });

  bind("roulette-red-btn", async () => {
    const result = await playRoulette("color", "red");
    if (result) renderCasinoPage();
  });

  bind("roulette-black-btn", async () => {
    const result = await playRoulette("color", "black");
    if (result) renderCasinoPage();
  });

  bind("roulette-even-btn", async () => {
    const result = await playRoulette("parity", "even");
    if (result) renderCasinoPage();
  });

  bind("roulette-odd-btn", async () => {
    const result = await playRoulette("parity", "odd");
    if (result) renderCasinoPage();
  });

  bind("roulette-number-btn", async () => {
    const value = document.getElementById("roulette-number-input")?.value || 0;
    const result = await playRoulette("number", value);
    if (result) renderCasinoPage();
  });

  bind("spin-wheel-btn", async () => {
    const result = await spinDailyWheel();
    if (result) renderCasinoPage();
  });

  bind("open-basic-safe-btn", async () => {
    const result = await openSafe("basic", false);
    if (result) renderCasinoPage();
  });

  bind("open-premium-safe-btn", async () => {
    const result = await openSafe("premium", false);
    if (result) renderCasinoPage();
  });

  bind("open-free-safe-btn", async () => {
    const result = await openSafe("basic", true);
    if (result) renderCasinoPage();
  });

  bind("buy-lottery-ticket-btn", async () => {
    const ok = await buyLotteryTicket();
    if (ok) renderCasinoPage();
  });

  bind("draw-lottery-btn", async () => {
    const result = await drawLottery();
    if (result) renderCasinoPage();
  });

  bind("jackpot-shot-btn", async () => {
    const result = await tryJackpotShot();
    if (result) renderCasinoPage();
  });
}
