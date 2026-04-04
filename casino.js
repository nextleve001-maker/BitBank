import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory, apiLogCasino } from "./api.js";

// =====================
// STATE
// =====================
export const CasinoState = {
  lastResult: null,
  currentGame: "coinflip"
};

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
  bindCasinoUI();
}

function normalizeBet(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.floor(n);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nowISO() {
  return new Date().toISOString();
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

function getBetInput() {
  const input = document.getElementById("casino-bet");
  return normalizeBet(input ? input.value : 0);
}

function canBet(amount) {
  return amount > 0 && Number(getPlayer().balance || 0) >= amount;
}

async function spendBet(amount) {
  if (!canBet(amount)) {
    alert("Not enough balance");
    return false;
  }

  const p = getPlayer();
  p.balance = Number(p.balance || 0) - amount;

  await updatePlayer({
    balance: p.balance
  });

  return true;
}

async function rewardWin(amount) {
  const p = getPlayer();

  p.balance = Number(p.balance || 0) + amount;
  p.total_earned = Number(p.total_earned || 0) + amount;

  await updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });
}

async function saveCasinoLog(game, bet, result) {
  const username = getPlayer().username;

  await apiLogCasino(username, game, bet, result);
  await apiAddHistory(username, `Casino: ${game}`, result >= 0 ? result : -bet);
}

function resultBlock() {
  const r = CasinoState.lastResult;

  if (!r) {
    return `
      <div class="card casino-result">
        <h3>Latest Result</h3>
        <p>No game played yet.</p>
      </div>
    `;
  }

  if (r.game === "coinflip") {
    return `
      <div class="card casino-result">
        <h3>Coinflip</h3>
        <p>Choice: ${r.choice}</p>
        <p>Result: ${r.side}</p>
        <p>Status: ${r.win ? "WIN" : "LOSE"}</p>
        <p>Profit: ₴ ${formatMoney(r.profit)}</p>
      </div>
    `;
  }

  if (r.game === "dice") {
    return `
      <div class="card casino-result">
        <h3>Dice</h3>
        <p>Target: ${r.target}</p>
        <p>Rolled: ${r.rolled}</p>
        <p>Status: ${r.win ? "WIN" : "LOSE"}</p>
        <p>Profit: ₴ ${formatMoney(r.profit)}</p>
      </div>
    `;
  }

  if (r.game === "slots") {
    return `
      <div class="card casino-result">
        <h3>Slots</h3>
        <p>${r.reels.join(" | ")}</p>
        <p>Multiplier: x${r.multiplier}</p>
        <p>Status: ${r.win ? "WIN" : "LOSE"}</p>
        <p>Profit: ₴ ${formatMoney(r.profit)}</p>
      </div>
    `;
  }

  if (r.game === "roulette") {
    return `
      <div class="card casino-result">
        <h3>Roulette</h3>
        <p>Rolled: ${r.rolled} (${r.color})</p>
        <p>Bet: ${r.betType} / ${r.betValue}</p>
        <p>Status: ${r.win ? "WIN" : "LOSE"}</p>
        <p>Profit: ₴ ${formatMoney(r.profit)}</p>
      </div>
    `;
  }

  if (r.game === "higher-lower") {
    return `
      <div class="card casino-result">
        <h3>Higher / Lower</h3>
        <p>Current: ${r.current}</p>
        <p>Next: ${r.next}</p>
        <p>Prediction: ${r.prediction}</p>
        <p>Status: ${r.win ? "WIN" : "LOSE"}</p>
        <p>Profit: ₴ ${formatMoney(r.profit)}</p>
      </div>
    `;
  }

  return `
    <div class="card casino-result">
      <h3>Latest Result</h3>
      <p>Game: ${r.game}</p>
    </div>
  `;
}

function sectionCard(title, subtitle, body) {
  return `
    <div class="card">
      <h3>${title}</h3>
      ${subtitle ? `<p class="muted" style="margin-bottom:12px;">${subtitle}</p>` : ""}
      ${body}
    </div>
  `;
}

// =====================
// GAMES
// =====================
export async function playCoinflip(choice, bet) {
  const amount = normalizeBet(bet);

  if (!(await spendBet(amount))) return null;

  const side = randChoice(["heads", "tails"]);
  const win = side === choice;

  let profit = -amount;

  if (win) {
    const reward = amount * 2;
    await rewardWin(reward);
    profit = amount;
  }

  CasinoState.lastResult = {
    game: "coinflip",
    choice,
    side,
    bet: amount,
    win,
    profit,
    time: nowISO()
  };

  await saveCasinoLog("coinflip", amount, profit);
  return CasinoState.lastResult;
}

export async function playDice(target, bet) {
  const amount = normalizeBet(bet);

  if (!(await spendBet(amount))) return null;

  const rolled = randInt(1, 6);
  const targetNumber = normalizeBet(target);

  let multiplier = 0;
  let win = false;

  if (targetNumber >= 1 && targetNumber <= 6 && rolled === targetNumber) {
    multiplier = 5;
    win = true;
  } else if (rolled >= 4) {
    multiplier = 2;
    win = true;
  }

  let profit = -amount;

  if (win) {
    const reward = amount * multiplier;
    await rewardWin(reward);
    profit = reward - amount;
  }

  CasinoState.lastResult = {
    game: "dice",
    target: targetNumber,
    rolled,
    bet: amount,
    win,
    profit,
    time: nowISO()
  };

  await saveCasinoLog("dice", amount, profit);
  return CasinoState.lastResult;
}

const SLOT_SYMBOLS = ["🍒", "🍋", "💎", "7️⃣", "⭐", "🍀"];

function spinSlots() {
  return [
    randChoice(SLOT_SYMBOLS),
    randChoice(SLOT_SYMBOLS),
    randChoice(SLOT_SYMBOLS)
  ];
}

function getSlotsMultiplier(reels) {
  const [a, b, c] = reels;

  if (a === b && b === c) {
    if (a === "7️⃣") return 10;
    if (a === "💎") return 8;
    if (a === "⭐") return 6;
    return 5;
  }

  if (a === b || b === c || a === c) {
    return 2;
  }

  return 0;
}

export async function playSlots(bet) {
  const amount = normalizeBet(bet);

  if (!(await spendBet(amount))) return null;

  const reels = spinSlots();
  const multiplier = getSlotsMultiplier(reels);
  const win = multiplier > 0;

  let profit = -amount;

  if (win) {
    const reward = amount * multiplier;
    await rewardWin(reward);
    profit = reward - amount;
  }

  CasinoState.lastResult = {
    game: "slots",
    reels,
    multiplier,
    bet: amount,
    win,
    profit,
    time: nowISO()
  };

  await saveCasinoLog("slots", amount, profit);
  return CasinoState.lastResult;
}

const ROULETTE_COLORS = {
  0: "green",
  1: "red",
  2: "black",
  3: "red",
  4: "black",
  5: "red",
  6: "black",
  7: "red",
  8: "black",
  9: "red",
  10: "black",
  11: "black",
  12: "red",
  13: "black",
  14: "red",
  15: "black",
  16: "red",
  17: "black",
  18: "red",
  19: "red",
  20: "black",
  21: "red",
  22: "black",
  23: "red",
  24: "black",
  25: "red",
  26: "black",
  27: "red",
  28: "black",
  29: "black",
  30: "red",
  31: "black",
  32: "red",
  33: "black",
  34: "red",
  35: "black",
  36: "red"
};

export async function playRoulette(betType, betValue, bet) {
  const amount = normalizeBet(bet);

  if (!(await spendBet(amount))) return null;

  const rolled = randInt(0, 36);
  const color = ROULETTE_COLORS[rolled];

  let multiplier = 0;
  let win = false;

  if (betType === "number" && Number(betValue) === rolled) {
    multiplier = 35;
    win = true;
  }

  if (betType === "color" && String(betValue).toLowerCase() === String(color).toLowerCase()) {
    multiplier = color === "green" ? 15 : 2;
    win = true;
  }

  if (betType === "parity" && rolled !== 0) {
    if (String(betValue) === "even" && rolled % 2 === 0) {
      multiplier = 2;
      win = true;
    }
    if (String(betValue) === "odd" && rolled % 2 !== 0) {
      multiplier = 2;
      win = true;
    }
  }

  let profit = -amount;

  if (win) {
    const reward = amount * multiplier;
    await rewardWin(reward);
    profit = reward - amount;
  }

  CasinoState.lastResult = {
    game: "roulette",
    betType,
    betValue,
    rolled,
    color,
    bet: amount,
    win,
    profit,
    time: nowISO()
  };

  await saveCasinoLog("roulette", amount, profit);
  return CasinoState.lastResult;
}

export async function playHigherLower(prediction, bet) {
  const amount = normalizeBet(bet);

  if (!(await spendBet(amount))) return null;

  const current = randInt(1, 13);
  const next = randInt(1, 13);

  let win = false;

  if (prediction === "higher" && next > current) win = true;
  if (prediction === "lower" && next < current) win = true;
  if (prediction === "same" && next === current) win = true;

  const multiplier = prediction === "same" ? 5 : 2;

  let profit = -amount;

  if (win) {
    const reward = amount * multiplier;
    await rewardWin(reward);
    profit = reward - amount;
  }

  CasinoState.lastResult = {
    game: "higher-lower",
    prediction,
    current,
    next,
    bet: amount,
    win,
    profit,
    time: nowISO()
  };

  await saveCasinoLog("higher-lower", amount, profit);
  return CasinoState.lastResult;
}

// =====================
// RENDER
// =====================
export function renderCasinoPage() {
  document.body.dataset.currentPage = "casino";

  const p = getPlayer();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Casino Lounge</h2>
      <p>Premium gaming floor with fast finance-style betting flows and live balance risk.</p>
    </div>

    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Balance</div>
        <div class="stat-value green">₴ ${formatCompact(p.balance)}</div>
        <div class="stat-sub">Available to wager</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Bet Control</div>
        <div class="stat-value">LIVE</div>
        <div class="stat-sub">Unified amount input</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Risk Level</div>
        <div class="stat-value orange">HIGH</div>
        <div class="stat-sub">Chance-based outcomes</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Mode</div>
        <div class="stat-value blue">VIP</div>
        <div class="stat-sub">Premium casino room</div>
      </div>
    </div>

    <div class="card" style="grid-column:1 / -1;">
      <h3>Universal Bet</h3>
      <div class="profile-actions" style="max-width:360px;">
        <input id="casino-bet" type="number" min="1" step="1" placeholder="Bet amount">
      </div>
    </div>

    <div class="asset-grid">
      ${sectionCard(
        "Coinflip",
        "Classic 50/50 direction play",
        `
          <div class="asset-actions">
            <button id="coinflip-heads-btn">Heads</button>
            <button class="secondary" id="coinflip-tails-btn">Tails</button>
          </div>
        `
      )}

      ${sectionCard(
        "Dice",
        "Predict one number or win on high roll",
        `
          <div class="profile-actions">
            <input id="dice-target" type="number" min="1" max="6" placeholder="Target 1-6">
            <button id="dice-play-btn">Roll Dice</button>
          </div>
        `
      )}

      ${sectionCard(
        "Slots",
        "Premium reel machine with multiplier payouts",
        `
          <div class="profile-actions">
            <button id="slots-play-btn">Spin Slots</button>
          </div>
        `
      )}

      ${sectionCard(
        "Roulette",
        "Color / parity / number betting",
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
            <input id="roulette-number" type="number" min="0" max="36" placeholder="Specific number">
            <button id="roulette-number-btn">Bet Number</button>
          </div>
        `
      )}

      ${sectionCard(
        "Higher / Lower",
        "Predict next card direction",
        `
          <div class="asset-actions">
            <button id="hl-higher-btn">Higher</button>
            <button class="secondary" id="hl-lower-btn">Lower</button>
          </div>
          <div class="profile-actions" style="margin-top:10px;">
            <button class="secondary" id="hl-same-btn">Same</button>
          </div>
        `
      )}

      ${resultBlock()}
    </div>
  `);
}

// =====================
// BIND
// =====================
function bindCasinoUI() {
  const bind = (id, handler) => {
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
  };

  bind("coinflip-heads-btn", async () => {
    const result = await playCoinflip("heads", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("coinflip-tails-btn", async () => {
    const result = await playCoinflip("tails", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("dice-play-btn", async () => {
    const target = document.getElementById("dice-target")?.value || 0;
    const result = await playDice(target, getBetInput());
    if (result) renderCasinoPage();
  });

  bind("slots-play-btn", async () => {
    const result = await playSlots(getBetInput());
    if (result) renderCasinoPage();
  });

  bind("roulette-red-btn", async () => {
    const result = await playRoulette("color", "red", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("roulette-black-btn", async () => {
    const result = await playRoulette("color", "black", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("roulette-even-btn", async () => {
    const result = await playRoulette("parity", "even", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("roulette-odd-btn", async () => {
    const result = await playRoulette("parity", "odd", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("roulette-number-btn", async () => {
    const number = document.getElementById("roulette-number")?.value || 0;
    const result = await playRoulette("number", number, getBetInput());
    if (result) renderCasinoPage();
  });

  bind("hl-higher-btn", async () => {
    const result = await playHigherLower("higher", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("hl-lower-btn", async () => {
    const result = await playHigherLower("lower", getBetInput());
    if (result) renderCasinoPage();
  });

  bind("hl-same-btn", async () => {
    const result = await playHigherLower("same", getBetInput());
    if (result) renderCasinoPage();
  });
}
