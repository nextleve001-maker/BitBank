import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";
import { addBalance, removeBalance } from "./player.js";

// ======================================================
// CASINO STATE
// ======================================================
export const CasinoState = {
  currentView: "hub", // hub | crash | roulette | blackjack | slots | owner
  overlayActive: false,
  intervalId: null,
  animationFrameId: null,
  lastWinEffect: null,
  lastLoseEffect: null,

  live: {
    playersOnline: {
      crash: 128,
      roulette: 64,
      blackjack: 52,
      slots: 211
    },
    wonToday: {
      crash: 1200000,
      roulette: 845000,
      blackjack: 620000,
      slots: 1450000
    }
  },

  crash: {
    phase: "idle", // idle | betting | flying | crashed
    roundId: 0,
    currentMultiplier: 1.0,
    crashAt: 1.75,
    growthSpeed: 0.015,
    betAmount: 0,
    autoCashout: 0,
    hasActiveBet: false,
    hasCashedOut: false,
    cashoutValue: 0,
    lastResults: [1.24, 2.15, 1.08, 5.42, 2.77, 1.31, 14.85, 1.63, 3.28, 2.04],
    chat: [
      { user: "NeoFox", text: "Ого, x20!", type: "normal" },
      { user: "DarkBull", text: "Я все злив :(", type: "normal" },
      { user: "LunaBet", text: "Зараз буде гарний виліт", type: "normal" }
    ]
  },

  roulette: {
    selectedBet: null,
    selectedAmount: 0,
    spinning: false,
    result: null,
    recent: [12, 0, 23, 7, 31, 18, 2, 25]
  },

  slots: {
    reels: ["🍒", "🍋", "💎"],
    spinning: false,
    betAmount: 0,
    resultText: ""
  },

  blackjack: {
    playerHand: [],
    dealerHand: [],
    deck: [],
    betAmount: 0,
    inRound: false,
    status: "idle"
  }
};

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nowIso() {
  return new Date().toISOString();
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

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(percent) {
  return Math.random() * 100 < percent;
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindCasinoUI();
}

function stopCasinoLoops() {
  if (CasinoState.intervalId) {
    clearInterval(CasinoState.intervalId);
    CasinoState.intervalId = null;
  }

  if (CasinoState.animationFrameId) {
    cancelAnimationFrame(CasinoState.animationFrameId);
    CasinoState.animationFrameId = null;
  }
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
      lottery_tickets: 0
    };
  }

  if (!p.casino_owner || typeof p.casino_owner !== "object" || Array.isArray(p.casino_owner)) {
    p.casino_owner = {
      ownsCasino: false,
      houseBalance: 2500000,
      rtp: 0.94,
      mood: "balanced", // safe | balanced | hot | dangerous
      vipWinners: [],
      bannedUsers: []
    };
  }

  if (!Array.isArray(p.casino_owner.vipWinners)) {
    p.casino_owner.vipWinners = [];
  }

  if (!Array.isArray(p.casino_owner.bannedUsers)) {
    p.casino_owner.bannedUsers = [];
  }
}

async function saveCasinoState() {
  const p = getPlayer();

  await updatePlayer({
    casino_profile: p.casino_profile,
    casino_owner: p.casino_owner
  });
}

function isCasinoOwner() {
  ensureCasinoProfile();
  return !!getPlayer().casino_owner.ownsCasino || !!getPlayer().is_admin || getPlayer().class === "creator";
}

function ensureCasinoAccess() {
  ensureCasinoProfile();

  if (safeArray(getPlayer().casino_owner?.bannedUsers).includes(getPlayer().username)) {
    alert("Тебе заблоковано в казино");
    return false;
  }

  return true;
}

// ======================================================
// VISUAL EFFECTS DATA
// ======================================================
function casinoThemeClass() {
  return "casino-mode";
}

function buildOverlay() {
  return `
    <div class="casino-enter-overlay ${CasinoState.overlayActive ? "show" : ""}">
      <div class="casino-scan"></div>
      <div class="casino-enter-text">ENTERING CASINO</div>
    </div>
  `;
}

function gameCard({
  id,
  emoji,
  title,
  subtitle,
  playing,
  won,
  accentClass = ""
}) {
  return `
    <button class="casino-game-card ${accentClass}" data-casino-open="${id}" type="button">
      <div class="casino-card-head">
        <div class="casino-card-icon">${emoji}</div>
        <div>
          <div class="casino-card-title">${title}</div>
          <div class="casino-card-subtitle">${subtitle}</div>
        </div>
      </div>

      <div class="casino-card-live">
        <div class="casino-live-chip">Зараз грають: ${playing}</div>
        <div class="casino-live-chip">Сьогодні виграно: ₴ ${formatCompact(won)}</div>
      </div>
    </button>
  `;
}

// ======================================================
// CASINO OWNER MECHANICS
// ======================================================
function ownerMoodConfig() {
  const mood = getPlayer().casino_owner.mood;

  if (mood === "safe") {
    return { rtp: 0.90, crashBias: -0.15, rouletteBias: 1, slotsBias: -0.08, blackjackBias: -0.05 };
  }

  if (mood === "hot") {
    return { rtp: 0.98, crashBias: 0.18, rouletteBias: 0, slotsBias: 0.12, blackjackBias: 0.07 };
  }

  if (mood === "dangerous") {
    return { rtp: 0.87, crashBias: -0.28, rouletteBias: 2, slotsBias: -0.16, blackjackBias: -0.08 };
  }

  return { rtp: 0.94, crashBias: 0, rouletteBias: 0, slotsBias: 0, blackjackBias: 0 };
}

function syncOwnerRtp() {
  ensureCasinoProfile();
  getPlayer().casino_owner.rtp = ownerMoodConfig().rtp;
}

function casinoHouseWin(amount) {
  ensureCasinoProfile();
  getPlayer().casino_owner.houseBalance += num(amount);
}

function casinoHouseLose(amount) {
  ensureCasinoProfile();
  getPlayer().casino_owner.houseBalance = Math.max(0, num(getPlayer().casino_owner.houseBalance) - num(amount));
}

function registerVipWinner(game, amount) {
  ensureCasinoProfile();

  const list = getPlayer().casino_owner.vipWinners;
  list.unshift({
    user: getPlayer().username,
    game,
    amount: Math.floor(num(amount)),
    createdAt: nowIso()
  });

  getPlayer().casino_owner.vipWinners = list.slice(0, 12);
}

// ======================================================
// ENTER / EXIT
// ======================================================
function startCasinoEntrance(targetView = "hub") {
  stopCasinoLoops();
  CasinoState.overlayActive = true;
  CasinoState.currentView = "hub";
  renderCasinoPage();

  setTimeout(() => {
    CasinoState.overlayActive = false;
    CasinoState.currentView = targetView;
    renderCasinoPage();
  }, 520);
}

function backToCasinoHub() {
  stopCasinoLoops();
  CasinoState.currentView = "hub";
  renderCasinoPage();
}

// ======================================================
// HUB PAGE
// ======================================================
function renderCasinoHub() {
  const ownerBtn = isCasinoOwner()
    ? `
      <button class="casino-owner-btn" data-casino-open="owner" type="button">
        👑 Адмін-панель Казино
      </button>
    `
    : "";

  return `
    <div class="card casino-top-card" style="grid-column:1 / -1;">
      <div class="casino-header-row">
        <div>
          <div class="casino-kicker">BitBank Night Zone</div>
          <h2>Casino</h2>
          <p>Лайв-ігри, ризик, великі множники та режим власника закладу.</p>
        </div>

        <div class="casino-top-balance">
          <div class="casino-balance-box">
            <span>Баланс</span>
            <strong class="casino-pulse-amount">₴ ${formatMoney(getPlayer().balance || 0)}</strong>
          </div>
          <div class="casino-balance-box">
            <span>Фішки</span>
            <strong>🎲 ${formatMoney(Math.floor((getPlayer().balance || 0) / 1000))}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="casino-games-grid">
      ${gameCard({
        id: "crash",
        emoji: "🚀",
        title: "Crash",
        subtitle: "Графік росте в реальному часі",
        playing: CasinoState.live.playersOnline.crash,
        won: CasinoState.live.wonToday.crash,
        accentClass: "crash-card"
      })}

      ${gameCard({
        id: "roulette",
        emoji: "🎡",
        title: "Roulette",
        subtitle: "Неонове колесо удачі",
        playing: CasinoState.live.playersOnline.roulette,
        won: CasinoState.live.wonToday.roulette,
        accentClass: "roulette-card"
      })}

      ${gameCard({
        id: "blackjack",
        emoji: "🃏",
        title: "Blackjack",
        subtitle: "Карти, ризик і контроль",
        playing: CasinoState.live.playersOnline.blackjack,
        won: CasinoState.live.wonToday.blackjack,
        accentClass: "blackjack-card"
      })}

      ${gameCard({
        id: "slots",
        emoji: "🎰",
        title: "Slots",
        subtitle: "Неонова веселка і вибухи виплат",
        playing: CasinoState.live.playersOnline.slots,
        won: CasinoState.live.wonToday.slots,
        accentClass: "slots-card"
      })}
    </div>

    <div class="dashboard-grid" style="margin-top:16px;">
      <div class="card">
        <h3>Live Pulse</h3>
        <p><span class="muted">Тренд гравців:</span> High</p>
        <p><span class="muted">Найгарячіша гра:</span> Crash</p>
        <p><span class="muted">Biggest win today:</span> ₴ 2.4M</p>
      </div>

      <div class="card">
        <h3>Access</h3>
        <p><span class="muted">Casino status:</span> Open</p>
        <p><span class="muted">Luck atmosphere:</span> Neon Night</p>
        ${ownerBtn}
      </div>
    </div>
  `;
}

// ======================================================
// CRASH ENGINE
// ======================================================
function randomCrashPoint() {
  const mood = ownerMoodConfig().crashBias;

  const roll = Math.random();

  let value;
  if (roll < 0.45) value = rand(1.01, 1.85);
  else if (roll < 0.75) value = rand(1.85, 3.5);
  else if (roll < 0.92) value = rand(3.5, 8.5);
  else value = rand(8.5, 25.0);

  value += mood;
  return Math.max(1.01, Number(value.toFixed(2)));
}

function resetCrashRound() {
  CasinoState.crash.phase = "betting";
  CasinoState.crash.roundId += 1;
  CasinoState.crash.currentMultiplier = 1.0;
  CasinoState.crash.crashAt = randomCrashPoint();
  CasinoState.crash.hasCashedOut = false;
  CasinoState.crash.cashoutValue = 0;
}

function pushCrashChatMessage(text, user = "LiveChat", type = "normal") {
  CasinoState.crash.chat.unshift({ user, text, type });
  CasinoState.crash.chat = CasinoState.crash.chat.slice(0, 18);
}

function pushCrashResult(multiplier) {
  CasinoState.crash.lastResults.unshift(Number(multiplier.toFixed(2)));
  CasinoState.crash.lastResults = CasinoState.crash.lastResults.slice(0, 12);
}

function startCrashLoop() {
  stopCasinoLoops();
  resetCrashRound();

  let bettingTimer = 38;

  CasinoState.intervalId = setInterval(async () => {
    if (AppState.page !== "casino" || CasinoState.currentView !== "crash") {
      stopCasinoLoops();
      return;
    }

    if (CasinoState.crash.phase === "betting") {
      bettingTimer -= 1;

      if (bettingTimer % 7 === 0) {
        const fakeUsers = ["RocketBoy", "XCash", "LuxBet", "Frost", "LuckyUA"];
        const fakeTexts = [
          "Йду на x2",
          "Сьогодні буде високий виліт",
          "Я заберу на x1.6",
          "All in",
          "Не жаднічаю цього разу"
        ];
        pushCrashChatMessage(
          fakeTexts[randInt(0, fakeTexts.length - 1)],
          fakeUsers[randInt(0, fakeUsers.length - 1)]
        );
      }

      if (bettingTimer <= 0) {
        CasinoState.crash.phase = "flying";
      }

      renderCasinoPage();
      return;
    }

    if (CasinoState.crash.phase === "flying") {
      CasinoState.crash.currentMultiplier = Number(
        (CasinoState.crash.currentMultiplier + CasinoState.crash.growthSpeed + CasinoState.crash.currentMultiplier * 0.012).toFixed(2)
      );

      if (
        CasinoState.crash.hasActiveBet &&
        !CasinoState.crash.hasCashedOut &&
        CasinoState.crash.autoCashout > 1 &&
        CasinoState.crash.currentMultiplier >= CasinoState.crash.autoCashout
      ) {
        await cashoutCrash();
      }

      if (CasinoState.crash.currentMultiplier >= CasinoState.crash.crashAt) {
        CasinoState.crash.phase = "crashed";
        pushCrashResult(CasinoState.crash.crashAt);

        if (CasinoState.crash.hasActiveBet && !CasinoState.crash.hasCashedOut) {
          casinoHouseWin(CasinoState.crash.betAmount);
          addHistory(`Crash lose at x${CasinoState.crash.crashAt}`, -CasinoState.crash.betAmount);
          CasinoState.lastLoseEffect = `-${formatMoney(CasinoState.crash.betAmount)} UAH`;
        }

        CasinoState.crash.hasActiveBet = false;
        CasinoState.crash.betAmount = 0;
        pushCrashChatMessage(`Ракета згоріла на x${CasinoState.crash.crashAt}`, "System", "event");
        await saveCasinoState();

        renderCasinoPage();

        setTimeout(() => {
          if (CasinoState.currentView === "crash") {
            startCrashLoop();
          }
        }, 2600);

        stopCasinoLoops();
        return;
      }

      renderCasinoPage();
    }
  }, 120);
}

async function placeCrashBet(amount, autoCashout = 0) {
  ensureCasinoProfile();

  const value = num(amount);
  if (value <= 0) {
    alert("Невірна ставка");
    return false;
  }

  if (CasinoState.crash.phase !== "betting") {
    alert("Ставки зараз закриті");
    return false;
  }

  if (CasinoState.crash.hasActiveBet) {
    alert("Ставка вже зроблена");
    return false;
  }

  const ok = removeBalance(value);
  if (!ok) {
    alert("Недостатньо грошей");
    return false;
  }

  CasinoState.crash.betAmount = value;
  CasinoState.crash.autoCashout = num(autoCashout);
  CasinoState.crash.hasActiveBet = true;
  CasinoState.crash.hasCashedOut = false;
  CasinoState.crash.cashoutValue = 0;

  pushCrashChatMessage(`Поставив ₴ ${formatMoney(value)}`, getPlayer().username, "bet");
  casinoHouseWin(value);

  await apiAddHistory(getPlayer().username, `Crash bet`, -value);
  renderCasinoPage();
  return true;
}

async function cashoutCrash() {
  if (!CasinoState.crash.hasActiveBet || CasinoState.crash.hasCashedOut) {
    return false;
  }

  if (CasinoState.crash.phase !== "flying") {
    return false;
  }

  const payout = Math.floor(CasinoState.crash.betAmount * CasinoState.crash.currentMultiplier);
  CasinoState.crash.hasCashedOut = true;
  CasinoState.crash.hasActiveBet = false;
  CasinoState.crash.cashoutValue = payout;

  addBalance(payout);
  casinoHouseLose(payout);
  registerVipWinner("Crash", payout);
  CasinoState.lastWinEffect = `+${formatMoney(payout)} UAH`;

  pushCrashChatMessage(`Забрав на x${CasinoState.crash.currentMultiplier}`, getPlayer().username, "cashout");

  await apiAddHistory(
    getPlayer().username,
    `Crash cashout x${CasinoState.crash.currentMultiplier}`,
    payout
  );

  await saveCasinoState();
  renderCasinoPage();
  return true;
}

function crashLeftPanel() {
  const btnText =
    CasinoState.crash.phase === "flying" && CasinoState.crash.hasActiveBet && !CasinoState.crash.hasCashedOut
      ? `ЗАБРАТИ ₴ ${formatMoney(CasinoState.crash.betAmount * CasinoState.crash.currentMultiplier)}`
      : "ЗРОБИТИ СТАВКУ";

  const btnClass =
    CasinoState.crash.phase === "flying" && CasinoState.crash.hasActiveBet && !CasinoState.crash.hasCashedOut
      ? "casino-cashout-btn"
      : "casino-bet-btn";

  return `
    <div class="card casino-side-panel">
      <h3>Ставка</h3>

      <div class="profile-actions">
        <input id="crash-bet-amount" type="number" placeholder="Сума ставки" value="${CasinoState.crash.betAmount || ""}">
        <input id="crash-auto-cashout" type="number" step="0.01" placeholder="Auto cashout, наприклад 2.00">

        <div class="casino-quick-bets">
          <button data-crash-fill="min" type="button">Мін</button>
          <button data-crash-fill="half" type="button">1/2</button>
          <button data-crash-fill="max" type="button">Max</button>
        </div>

        <button id="crash-main-action" class="${btnClass}" type="button">
          ${btnText}
        </button>
      </div>
    </div>
  `;
}

function crashCenterPanel() {
  const phaseLabel =
    CasinoState.crash.phase === "betting"
      ? "BETTING OPEN"
      : CasinoState.crash.phase === "flying"
      ? "FLYING"
      : "CRASHED";

  return `
    <div class="card casino-crash-center">
      <div class="casino-crash-phase">${phaseLabel}</div>

      <div class="casino-crash-graph">
        <div class="casino-crash-line"></div>
        <div class="casino-crash-rocket ${CasinoState.crash.phase === "flying" ? "fly" : ""}">🚀</div>
      </div>

      <div class="casino-crash-multiplier ${CasinoState.crash.phase === "crashed" ? "crashed" : ""}">
        x${CasinoState.crash.phase === "crashed" ? CasinoState.crash.crashAt.toFixed(2) : CasinoState.crash.currentMultiplier.toFixed(2)}
      </div>

      <div class="casino-crash-sub">
        ${
          CasinoState.crash.phase === "betting"
            ? "Раунд готується. Ставки відкриті."
            : CasinoState.crash.phase === "flying"
            ? "Ракета летить. Встигни забрати."
            : "Політ завершено."
        }
      </div>

      ${
        CasinoState.lastWinEffect
          ? `<div class="casino-win-fx">${CasinoState.lastWinEffect}</div>`
          : ""
      }

      ${
        CasinoState.lastLoseEffect
          ? `<div class="casino-lose-fx">${CasinoState.lastLoseEffect}</div>`
          : ""
      }
    </div>
  `;
}

function crashRightPanel() {
  return `
    <div class="card casino-side-panel">
      <h3>Історія</h3>
      <div class="casino-history-strip">
        ${CasinoState.crash.lastResults.map(v => `
          <div class="casino-history-pill ${v >= 10 ? "legend" : v >= 3 ? "epic" : v >= 2 ? "rare" : "common"}">
            x${v}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function crashChatPanel() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>Live Chat</h3>
      <div class="casino-chat-list">
        ${CasinoState.crash.chat.map(msg => `
          <div class="casino-chat-msg ${msg.type}">
            <strong>${msg.user}:</strong> ${msg.text}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderCrashPage() {
  return `
    <div class="card casino-top-card" style="grid-column:1 / -1;">
      <div class="casino-header-row">
        <div>
          <button class="casino-back-btn" data-casino-back type="button">← Повернутися до сейфу</button>
          <h2>Crash</h2>
          <p>Став, дивись на multiplier і забирай вчасно.</p>
        </div>

        <div class="casino-top-balance">
          <div class="casino-balance-box">
            <span>Баланс</span>
            <strong class="casino-pulse-amount">₴ ${formatMoney(getPlayer().balance || 0)}</strong>
          </div>
          <div class="casino-balance-box">
            <span>House RTP</span>
            <strong>${Math.floor((getPlayer().casino_owner?.rtp || 0.94) * 100)}%</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="casino-crash-layout">
      ${crashLeftPanel()}
      ${crashCenterPanel()}
      ${crashRightPanel()}
    </div>

    ${crashChatPanel()}
  `;
}

// ======================================================
// ROULETTE
// ======================================================
function roulettePayoutNumber(n) {
  if (n === 0) return "green";
  return n % 2 === 0 ? "black" : "red";
}

function spinRoulette(numberChoice, amount) {
  const value = num(amount);
  if (value <= 0) {
    alert("Невірна ставка");
    return false;
  }

  if (!removeBalance(value)) {
    alert("Недостатньо грошей");
    return false;
  }

  const bias = ownerMoodConfig().rouletteBias;
  let result = randInt(0, 36);

  if (bias > 0 && chance(35)) {
    result = randInt(0, 36);
    if (result === numberChoice) result = (result + bias) % 37;
  }

  CasinoState.roulette.spinning = true;
  CasinoState.roulette.selectedBet = numberChoice;
  CasinoState.roulette.selectedAmount = value;

  setTimeout(async () => {
    CasinoState.roulette.spinning = false;
    CasinoState.roulette.result = result;
    CasinoState.roulette.recent.unshift(result);
    CasinoState.roulette.recent = CasinoState.roulette.recent.slice(0, 10);

    if (result === numberChoice) {
      const reward = value * 14;
      addBalance(reward);
      casinoHouseLose(reward);
      CasinoState.lastWinEffect = `+${formatMoney(reward)} UAH`;
      registerVipWinner("Roulette", reward);
      await apiAddHistory(getPlayer().username, `Roulette win on ${numberChoice}`, reward);
    } else {
      casinoHouseWin(value);
      CasinoState.lastLoseEffect = `-${formatMoney(value)} UAH`;
      await apiAddHistory(getPlayer().username, `Roulette lose on ${numberChoice}`, -value);
    }

    await saveCasinoState();
    renderCasinoPage();
  }, 1650);

  renderCasinoPage();
  return true;
}

function renderRoulettePage() {
  return `
    <div class="card casino-top-card" style="grid-column:1 / -1;">
      <div class="casino-header-row">
        <div>
          <button class="casino-back-btn" data-casino-back type="button">← Повернутися до сейфу</button>
          <h2>Roulette</h2>
          <p>Обери число від 0 до 36. Влучив — зірвав множник.</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>3D Wheel</h3>
        <div class="casino-wheel ${CasinoState.roulette.spinning ? "spin" : ""}">
          ${CasinoState.roulette.result !== null ? CasinoState.roulette.result : "🎡"}
        </div>
        ${
          CasinoState.lastWinEffect
            ? `<div class="casino-win-fx">${CasinoState.lastWinEffect}</div>`
            : CasinoState.lastLoseEffect
            ? `<div class="casino-lose-fx">${CasinoState.lastLoseEffect}</div>`
            : ""
        }
      </div>

      <div class="card">
        <h3>Ставка</h3>
        <div class="profile-actions">
          <input id="roulette-number" type="number" min="0" max="36" placeholder="Number 0-36">
          <input id="roulette-amount" type="number" placeholder="Bet amount">
          <button id="roulette-spin-btn" ${CasinoState.roulette.spinning ? "disabled" : ""}>Spin</button>
        </div>

        <div class="titles-list" style="margin-top:14px;">
          ${CasinoState.roulette.recent.map(n => `
            <div class="title-pill">${n} (${roulettePayoutNumber(n)})</div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// ======================================================
// SLOTS
// ======================================================
function spinSlots(bet) {
  const value = num(bet);
  if (value <= 0) {
    alert("Невірна ставка");
    return false;
  }

  if (!removeBalance(value)) {
    alert("Недостатньо грошей");
    return false;
  }

  const bias = ownerMoodConfig().slotsBias;
  const symbols = ["🍒", "🍋", "💎", "7️⃣", "⭐", "🍀", "🔔"];
  CasinoState.slots.spinning = true;
  CasinoState.slots.betAmount = value;

  setTimeout(async () => {
    const a = symbols[randInt(0, symbols.length - 1)];
    const b = symbols[randInt(0, symbols.length - 1)];
    let c = symbols[randInt(0, symbols.length - 1)];

    if (bias < 0 && chance(28) && a === b) {
      c = symbols[randInt(0, symbols.length - 1)];
      if (c === a) {
        c = "🍋";
      }
    }

    CasinoState.slots.reels = [a, b, c];
    CasinoState.slots.spinning = false;

    let reward = 0;
    if (a === b && b === c) reward = value * 8;
    else if (a === b || b === c || a === c) reward = value * 2;

    if (reward > 0) {
      addBalance(reward);
      casinoHouseLose(reward);
      registerVipWinner("Slots", reward);
      CasinoState.lastWinEffect = `+${formatMoney(reward)} UAH`;
      CasinoState.slots.resultText = "JACKPOT / WIN";
      await apiAddHistory(getPlayer().username, `Slots win`, reward);
    } else {
      casinoHouseWin(value);
      CasinoState.lastLoseEffect = `-${formatMoney(value)} UAH`;
      CasinoState.slots.resultText = "LOSE";
      await apiAddHistory(getPlayer().username, `Slots lose`, -value);
    }

    await saveCasinoState();
    renderCasinoPage();
  }, 1200);

  renderCasinoPage();
  return true;
}

function renderSlotsPage() {
  return `
    <div class="card casino-top-card" style="grid-column:1 / -1;">
      <div class="casino-header-row">
        <div>
          <button class="casino-back-btn" data-casino-back type="button">← Повернутися до сейфу</button>
          <h2>Slots</h2>
          <p>Неонові слоти з яскравими виплатами.</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Slot Machine</h3>
        <div class="casino-slots-machine ${CasinoState.slots.spinning ? "spin" : ""}">
          ${CasinoState.slots.reels.map(r => `<div class="casino-slot-reel">${r}</div>`).join("")}
        </div>
        <div class="casino-slot-result">${CasinoState.slots.resultText || "READY"}</div>

        ${
          CasinoState.lastWinEffect
            ? `<div class="casino-win-fx">${CasinoState.lastWinEffect}</div>`
            : CasinoState.lastLoseEffect
            ? `<div class="casino-lose-fx">${CasinoState.lastLoseEffect}</div>`
            : ""
        }
      </div>

      <div class="card">
        <h3>Ставка</h3>
        <div class="profile-actions">
          <input id="slots-bet-input" type="number" placeholder="Bet amount">
          <button id="slots-spin-btn" ${CasinoState.slots.spinning ? "disabled" : ""}>SPIN</button>
        </div>
      </div>
    </div>
  `;
}

// ======================================================
// BLACKJACK
// ======================================================
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ suit, rank });
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function blackjackCardValue(card) {
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return Number(card.rank);
}

function blackjackHandValue(hand) {
  let total = hand.reduce((sum, c) => sum + blackjackCardValue(c), 0);
  let aces = hand.filter(c => c.rank === "A").length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function startBlackjack(bet) {
  const value = num(bet);
  if (value <= 0) {
    alert("Невірна ставка");
    return false;
  }

  if (!removeBalance(value)) {
    alert("Недостатньо грошей");
    return false;
  }

  CasinoState.blackjack.deck = createDeck();
  CasinoState.blackjack.playerHand = [
    CasinoState.blackjack.deck.pop(),
    CasinoState.blackjack.deck.pop()
  ];
  CasinoState.blackjack.dealerHand = [
    CasinoState.blackjack.deck.pop(),
    CasinoState.blackjack.deck.pop()
  ];
  CasinoState.blackjack.betAmount = value;
  CasinoState.blackjack.inRound = true;
  CasinoState.blackjack.status = "Player turn";

  renderCasinoPage();
  return true;
}

async function blackjackHit() {
  if (!CasinoState.blackjack.inRound) return false;

  CasinoState.blackjack.playerHand.push(CasinoState.blackjack.deck.pop());

  const total = blackjackHandValue(CasinoState.blackjack.playerHand);
  if (total > 21) {
    CasinoState.blackjack.status = "Bust";
    CasinoState.blackjack.inRound = false;
    casinoHouseWin(CasinoState.blackjack.betAmount);
    CasinoState.lastLoseEffect = `-${formatMoney(CasinoState.blackjack.betAmount)} UAH`;
    await apiAddHistory(getPlayer().username, "Blackjack bust", -CasinoState.blackjack.betAmount);
    await saveCasinoState();
  }

  renderCasinoPage();
  return true;
}

async function blackjackStand() {
  if (!CasinoState.blackjack.inRound) return false;

  while (blackjackHandValue(CasinoState.blackjack.dealerHand) < 17) {
    CasinoState.blackjack.dealerHand.push(CasinoState.blackjack.deck.pop());
  }

  const playerTotal = blackjackHandValue(CasinoState.blackjack.playerHand);
  const dealerTotal = blackjackHandValue(CasinoState.blackjack.dealerHand);

  CasinoState.blackjack.inRound = false;

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    const reward = CasinoState.blackjack.betAmount * 2;
    addBalance(reward);
    casinoHouseLose(reward);
    CasinoState.blackjack.status = "Win";
    CasinoState.lastWinEffect = `+${formatMoney(reward)} UAH`;
    registerVipWinner("Blackjack", reward);
    await apiAddHistory(getPlayer().username, "Blackjack win", reward);
  } else if (playerTotal === dealerTotal) {
    addBalance(CasinoState.blackjack.betAmount);
    CasinoState.blackjack.status = "Push";
    await apiAddHistory(getPlayer().username, "Blackjack push", 0);
  } else {
    casinoHouseWin(CasinoState.blackjack.betAmount);
    CasinoState.blackjack.status = "Lose";
    CasinoState.lastLoseEffect = `-${formatMoney(CasinoState.blackjack.betAmount)} UAH`;
    await apiAddHistory(getPlayer().username, "Blackjack lose", -CasinoState.blackjack.betAmount);
  }

  await saveCasinoState();
  renderCasinoPage();
  return true;
}

function cardHtml(card) {
  return `<div class="casino-playing-card">${card.rank}${card.suit}</div>`;
}

function renderBlackjackPage() {
  return `
    <div class="card casino-top-card" style="grid-column:1 / -1;">
      <div class="casino-header-row">
        <div>
          <button class="casino-back-btn" data-casino-back type="button">← Повернутися до сейфу</button>
          <h2>Blackjack</h2>
          <p>Неонові карти та контроль ризику.</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Dealer</h3>
        <div class="casino-card-row">
          ${CasinoState.blackjack.dealerHand.map(cardHtml).join("")}
        </div>
        <p><span class="muted">Value:</span> ${blackjackHandValue(CasinoState.blackjack.dealerHand)}</p>
      </div>

      <div class="card">
        <h3>Player</h3>
        <div class="casino-card-row">
          ${CasinoState.blackjack.playerHand.map(cardHtml).join("")}
        </div>
        <p><span class="muted">Value:</span> ${blackjackHandValue(CasinoState.blackjack.playerHand)}</p>
        <p><span class="muted">Status:</span> ${CasinoState.blackjack.status}</p>

        <div class="profile-actions">
          <input id="blackjack-bet" type="number" placeholder="Bet amount">
          <button id="blackjack-start-btn" ${CasinoState.blackjack.inRound ? "disabled" : ""}>Start</button>
          <div class="asset-actions">
            <button id="blackjack-hit-btn" ${!CasinoState.blackjack.inRound ? "disabled" : ""}>Hit</button>
            <button class="secondary" id="blackjack-stand-btn" ${!CasinoState.blackjack.inRound ? "disabled" : ""}>Stand</button>
          </div>
        </div>

        ${
          CasinoState.lastWinEffect
            ? `<div class="casino-win-fx">${CasinoState.lastWinEffect}</div>`
            : CasinoState.lastLoseEffect
            ? `<div class="casino-lose-fx">${CasinoState.lastLoseEffect}</div>`
            : ""
        }
      </div>
    </div>
  `;
}

// ======================================================
// OWNER PAGE
// ======================================================
async function setCasinoMood(mood) {
  ensureCasinoProfile();
  getPlayer().casino_owner.mood = mood;
  syncOwnerRtp();
  await saveCasinoState();
  renderCasinoPage();
}

async function banCasinoUser(username) {
  ensureCasinoProfile();

  const name = String(username || "").trim();
  if (!name) return false;

  if (!getPlayer().casino_owner.bannedUsers.includes(name)) {
    getPlayer().casino_owner.bannedUsers.push(name);
  }

  await saveCasinoState();
  renderCasinoPage();
  return true;
}

async function unbanCasinoUser(username) {
  ensureCasinoProfile();

  const name = String(username || "").trim();
  getPlayer().casino_owner.bannedUsers = getPlayer().casino_owner.bannedUsers.filter(x => x !== name);

  await saveCasinoState();
  renderCasinoPage();
  return true;
}

function renderOwnerPage() {
  ensureCasinoProfile();
  syncOwnerRtp();

  const owner = getPlayer().casino_owner;

  return `
    <div class="card casino-top-card" style="grid-column:1 / -1;">
      <div class="casino-header-row">
        <div>
          <button class="casino-back-btn" data-casino-back type="button">← Повернутися до сейфу</button>
          <h2>Адмін-панель Казино</h2>
          <p>Контроль RTP, балансу закладу, атмосфери удачі та VIP-виграшів.</p>
        </div>
      </div>
    </div>

    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">House Balance</div>
        <div class="stat-value orange">₴ ${formatCompact(owner.houseBalance || 0)}</div>
        <div class="stat-sub">Баланс закладу</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">RTP</div>
        <div class="stat-value">${Math.floor((owner.rtp || 0.94) * 100)}%</div>
        <div class="stat-sub">Повернення гравцям</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Luck Mood</div>
        <div class="stat-value blue">${owner.mood}</div>
        <div class="stat-sub">Поточний настрій удачі</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">VIP Winners</div>
        <div class="stat-value green">${safeArray(owner.vipWinners).length}</div>
        <div class="stat-sub">Останні великі виграші</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Настрій удачі</h3>
        <div class="asset-actions">
          <button data-casino-mood="safe">Safe</button>
          <button data-casino-mood="balanced">Balanced</button>
        </div>
        <div class="asset-actions" style="margin-top:10px;">
          <button data-casino-mood="hot">Hot</button>
          <button data-casino-mood="dangerous">Dangerous</button>
        </div>
      </div>

      <div class="card">
        <h3>Banned Users</h3>
        <div class="profile-actions">
          <input id="casino-ban-user" placeholder="username">
          <div class="asset-actions">
            <button id="casino-ban-btn">Ban</button>
            <button class="secondary" id="casino-unban-btn">Unban</button>
          </div>
        </div>

        <div class="titles-list" style="margin-top:14px;">
          ${safeArray(owner.bannedUsers).map(u => `<div class="title-pill">${u}</div>`).join("") || `<div class="title-pill">No bans</div>`}
        </div>
      </div>
    </div>

    <div class="section-title">Найбагатші щасливчики</div>
    <div class="asset-grid">
      ${
        safeArray(owner.vipWinners).length
          ? owner.vipWinners.map(w => `
            <div class="card asset-card">
              <div class="asset-info">
                <div class="asset-head">
                  <div class="asset-name">${w.user}</div>
                  <div class="asset-price">₴ ${formatCompact(w.amount)}</div>
                </div>
                <div class="asset-meta">
                  <span>${w.game}</span>
                  <span>${new Date(w.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          `).join("")
          : `<div class="card"><h3>No VIP winners yet</h3></div>`
      }
    </div>
  `;
}

// ======================================================
// MAIN RENDER
// ======================================================
export function renderCasinoPage() {
  if (!ensureCasinoAccess()) return;
  ensureCasinoProfile();
  document.body.dataset.currentPage = "casino";

  const casinoClass = casinoThemeClass();
  document.body.classList.add(casinoClass);

  let content = "";

  if (CasinoState.currentView === "crash") {
    content = renderCrashPage();
  } else if (CasinoState.currentView === "roulette") {
    content = renderRoulettePage();
  } else if (CasinoState.currentView === "blackjack") {
    content = renderBlackjackPage();
  } else if (CasinoState.currentView === "slots") {
    content = renderSlotsPage();
  } else if (CasinoState.currentView === "owner") {
    content = renderOwnerPage();
  } else {
    content = renderCasinoHub();
  }

  setPage(`
    ${buildOverlay()}
    <div class="casino-shell">
      ${content}
    </div>
  `);

  if (CasinoState.currentView === "crash" && !CasinoState.overlayActive) {
    if (!CasinoState.intervalId) {
      startCrashLoop();
    }
  } else {
    stopCasinoLoops();
  }
}

// ======================================================
// BIND
// ======================================================
function bindCasinoUI() {
  document.querySelectorAll("[data-casino-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-casino-open");

      CasinoState.lastWinEffect = null;
      CasinoState.lastLoseEffect = null;

      if (view === "owner") {
        CasinoState.currentView = "owner";
        renderCasinoPage();
        return;
      }

      CasinoState.currentView = view;
      renderCasinoPage();
    });
  });

  document.querySelectorAll("[data-casino-back]").forEach(btn => {
    btn.addEventListener("click", backToCasinoHub);
  });

  document.querySelectorAll("[data-crash-fill]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-crash-fill");
      const input = document.getElementById("crash-bet-amount");
      if (!input) return;

      const balance = num(getPlayer().balance || 0);

      if (type === "min") input.value = "1000";
      if (type === "half") input.value = Math.floor(balance / 2);
      if (type === "max") input.value = Math.floor(balance);
    });
  });

  const crashMain = document.getElementById("crash-main-action");
  if (crashMain) {
    crashMain.addEventListener("click", async () => {
      if (
        CasinoState.crash.phase === "flying" &&
        CasinoState.crash.hasActiveBet &&
        !CasinoState.crash.hasCashedOut
      ) {
        await cashoutCrash();
        return;
      }

      const amount = num(document.getElementById("crash-bet-amount")?.value);
      const auto = num(document.getElementById("crash-auto-cashout")?.value);
      await placeCrashBet(amount, auto);
    });
  }

  const rouletteSpinBtn = document.getElementById("roulette-spin-btn");
  if (rouletteSpinBtn) {
    rouletteSpinBtn.addEventListener("click", () => {
      const n = num(document.getElementById("roulette-number")?.value);
      const amount = num(document.getElementById("roulette-amount")?.value);
      spinRoulette(n, amount);
    });
  }

  const slotsSpinBtn = document.getElementById("slots-spin-btn");
  if (slotsSpinBtn) {
    slotsSpinBtn.addEventListener("click", () => {
      const amount = num(document.getElementById("slots-bet-input")?.value);
      spinSlots(amount);
    });
  }

  const blackjackStartBtn = document.getElementById("blackjack-start-btn");
  if (blackjackStartBtn) {
    blackjackStartBtn.addEventListener("click", () => {
      const amount = num(document.getElementById("blackjack-bet")?.value);
      startBlackjack(amount);
    });
  }

  const blackjackHitBtn = document.getElementById("blackjack-hit-btn");
  if (blackjackHitBtn) {
    blackjackHitBtn.addEventListener("click", async () => {
      await blackjackHit();
    });
  }

  const blackjackStandBtn = document.getElementById("blackjack-stand-btn");
  if (blackjackStandBtn) {
    blackjackStandBtn.addEventListener("click", async () => {
      await blackjackStand();
    });
  }

  document.querySelectorAll("[data-casino-mood]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const mood = btn.getAttribute("data-casino-mood");
      await setCasinoMood(mood);
    });
  });

  const banBtn = document.getElementById("casino-ban-btn");
  if (banBtn) {
    banBtn.addEventListener("click", async () => {
      const username = document.getElementById("casino-ban-user")?.value.trim();
      await banCasinoUser(username);
    });
  }

  const unbanBtn = document.getElementById("casino-unban-btn");
  if (unbanBtn) {
    unbanBtn.addEventListener("click", async () => {
      const username = document.getElementById("casino-ban-user")?.value.trim();
      await unbanCasinoUser(username);
    });
  }
}
