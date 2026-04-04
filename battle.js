import { AppState, updatePlayer } from "./app.js";
import { apiCreateBattle, apiGetBattles, apiUpdateBattle, apiAddHistory } from "./api.js";

// =====================
// STATE
// =====================
export const BattleState = {
  battles: [],
  currentBattle: null,
  checking: false
};

// =====================
// HELPERS
// =====================
function getPlayer() {
  return AppState.player || {};
}

function getUsername() {
  return getPlayer().username || "";
}

function nowISO() {
  return new Date().toISOString();
}

function nowMs() {
  return Date.now();
}

function toMs(v) {
  return new Date(v).getTime();
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
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

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindBattleUI();
}

function isParticipant(battle, username = getUsername()) {
  if (!battle || !username) return false;
  return battle.creator_username === username || battle.opponent_username === username;
}

function getMySide(battle) {
  const username = getUsername();

  if (battle.creator_username === username) return "creator";
  if (battle.opponent_username === username) return "opponent";

  return null;
}

function getBattleBank(battle) {
  return Number(battle.stake || 0) * 2;
}

function getStatusLabel(status) {
  switch (status) {
    case "waiting":
      return "Waiting";
    case "active":
      return "Active";
    case "finished":
      return "Finished";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
}

function formatTimer(endsAt) {
  if (!endsAt) return "00:00";

  const diff = Math.max(0, Math.floor((toMs(endsAt) - nowMs()) / 1000));
  const min = String(Math.floor(diff / 60)).padStart(2, "0");
  const sec = String(diff % 60).padStart(2, "0");

  return `${min}:${sec}`;
}

function getWinnerByScore(battle) {
  const creator = Number(battle.creator_taps || 0);
  const opponent = Number(battle.opponent_taps || 0);

  if (creator > opponent) return battle.creator_username;
  if (opponent > creator) return battle.opponent_username;

  return null;
}

function getStakeInput() {
  const el = document.getElementById("battle-stake");
  return el ? Number(el.value) : 0;
}

function battleCard(battle) {
  const mine = isParticipant(battle);
  const canJoin =
    battle.status === "waiting" &&
    battle.creator_username !== getUsername();

  return `
    <div class="card asset-card battle-card ${mine ? "battle-mine" : ""}">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">Battle #${battle.id}</div>
          <div class="asset-price">₴ ${formatCompact(battle.stake)}</div>
        </div>

        <div class="asset-meta">
          <span>Status: ${getStatusLabel(battle.status)}</span>
          <span>Bank: ₴ ${formatCompact(getBattleBank(battle))}</span>
          <span>Timer: ${formatTimer(battle.ends_at)}</span>
        </div>

        <p><span class="muted">Creator:</span> ${battle.creator_username || "—"}</p>
        <p><span class="muted">Opponent:</span> ${battle.opponent_username || "—"}</p>
        <p><span class="muted">Score:</span> ${Number(battle.creator_taps || 0)} : ${Number(battle.opponent_taps || 0)}</p>

        <div class="asset-actions full">
          ${canJoin ? `<button data-join-battle="${battle.id}">Join Battle</button>` : ""}
          ${
            mine && battle.status === "active"
              ? `<button data-tap-battle="${battle.id}">Tap Now</button>`
              : ""
          }
          ${
            mine &&
            battle.status === "waiting" &&
            battle.creator_username === getUsername()
              ? `<button class="secondary" data-cancel-battle="${battle.id}">Cancel</button>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

function currentBattlePanel(battle) {
  if (!battle) {
    return `
      <div class="card">
        <h3>Current Battle</h3>
        <p>You do not have an active battle right now.</p>
      </div>
    `;
  }

  return `
    <div class="card battle-current">
      <h3>Current Battle</h3>
      <p><span class="muted">Status:</span> ${getStatusLabel(battle.status)}</p>
      <p><span class="muted">Creator:</span> ${battle.creator_username || "—"}</p>
      <p><span class="muted">Opponent:</span> ${battle.opponent_username || "—"}</p>
      <p><span class="muted">Your Side:</span> ${getMySide(battle) || "viewer"}</p>
      <p><span class="muted">Score:</span> ${Number(battle.creator_taps || 0)} : ${Number(battle.opponent_taps || 0)}</p>
      <p><span class="muted">Bank:</span> ₴ ${formatMoney(getBattleBank(battle))}</p>
      <p><span class="muted">Timer:</span> ${formatTimer(battle.ends_at)}</p>

      <div class="battle-actions">
        ${
          battle.status === "active"
            ? `<button data-tap-battle="${battle.id}">Tap</button>`
            : ""
        }
        ${
          battle.status === "waiting" && battle.creator_username === getUsername()
            ? `<button class="secondary" data-cancel-battle="${battle.id}">Cancel</button>`
            : ""
        }
        <button class="secondary" id="battle-refresh-btn">Refresh</button>
      </div>
    </div>
  `;
}

function summaryStats() {
  const all = safeArray(BattleState.battles);
  const active = all.filter((b) => b.status === "active").length;
  const waiting = all.filter((b) => b.status === "waiting").length;
  const mine = all.filter((b) => isParticipant(b)).length;

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Open Battles</div>
        <div class="stat-value">${waiting}</div>
        <div class="stat-sub">Available to join</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Live Battles</div>
        <div class="stat-value blue">${active}</div>
        <div class="stat-sub">Currently running</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">My Battles</div>
        <div class="stat-value green">${mine}</div>
        <div class="stat-sub">Created or joined</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Tap Arena</div>
        <div class="stat-value">PVP</div>
        <div class="stat-sub">Premium competition mode</div>
      </div>
    </div>
  `;
}

// =====================
// DATA
// =====================
export async function loadBattles() {
  const data = await apiGetBattles();
  BattleState.battles = Array.isArray(data) ? data : [];

  const mine = BattleState.battles.find(
    (b) => isParticipant(b) && b.status !== "finished" && b.status !== "cancelled"
  );

  BattleState.currentBattle = mine || null;

  return BattleState.battles;
}

// =====================
// CREATE / JOIN / CANCEL
// =====================
export async function createBattle(stake) {
  const p = getPlayer();
  const amount = Number(stake);

  if (!amount || amount <= 0) {
    alert("Invalid stake");
    return null;
  }

  if (Number(p.balance || 0) < amount) {
    alert("Not enough balance");
    return null;
  }

  if (BattleState.currentBattle && ["waiting", "active"].includes(BattleState.currentBattle.status)) {
    alert("You already have an active battle");
    return null;
  }

  p.balance = Number(p.balance || 0) - amount;

  await updatePlayer({
    balance: p.balance
  });

  const payload = {
    creator_username: p.username,
    opponent_username: null,
    stake: amount,
    creator_taps: 0,
    opponent_taps: 0,
    status: "waiting",
    winner_username: null,
    created_at: nowISO(),
    started_at: null,
    ends_at: new Date(Date.now() + 60000).toISOString()
  };

  const created = await apiCreateBattle(payload);

  if (!created) {
    p.balance += amount;
    await updatePlayer({ balance: p.balance });
    alert("Battle create error");
    return null;
  }

  await apiAddHistory(p.username, "Create battle", -amount);

  BattleState.currentBattle = created;
  await loadBattles();

  return created;
}

export async function joinBattle(id) {
  const p = getPlayer();
  const battle = BattleState.battles.find((b) => String(b.id) === String(id));

  if (!battle) {
    alert("Battle not found");
    return false;
  }

  if (battle.status !== "waiting") {
    alert("Battle is not available");
    return false;
  }

  if (battle.creator_username === p.username) {
    alert("You cannot join your own battle");
    return false;
  }

  if (Number(p.balance || 0) < Number(battle.stake || 0)) {
    alert("Not enough balance");
    return false;
  }

  p.balance = Number(p.balance || 0) - Number(battle.stake || 0);

  await updatePlayer({
    balance: p.balance
  });

  await apiUpdateBattle(battle.id, {
    opponent_username: p.username,
    status: "active",
    started_at: nowISO(),
    ends_at: new Date(Date.now() + 60000).toISOString()
  });

  await apiAddHistory(p.username, "Join battle", -Number(battle.stake || 0));

  await loadBattles();
  return true;
}

export async function cancelMyBattle(id) {
  const battle = BattleState.battles.find((b) => String(b.id) === String(id));

  if (!battle) return false;
  if (battle.creator_username !== getUsername()) return false;
  if (battle.status !== "waiting") return false;

  await apiUpdateBattle(battle.id, {
    status: "cancelled"
  });

  const p = getPlayer();
  p.balance = Number(p.balance || 0) + Number(battle.stake || 0);

  await updatePlayer({
    balance: p.balance
  });

  await apiAddHistory(p.username, "Cancel battle refund", Number(battle.stake || 0));

  await loadBattles();
  return true;
}

// =====================
// TAPPING
// =====================
export async function battleTap(id) {
  const battle = BattleState.battles.find((b) => String(b.id) === String(id));
  if (!battle) return false;
  if (battle.status !== "active") return false;

  const side = getMySide(battle);
  if (!side) return false;

  if (side === "creator") {
    battle.creator_taps = Number(battle.creator_taps || 0) + 1;
    await apiUpdateBattle(battle.id, {
      creator_taps: battle.creator_taps
    });
  } else {
    battle.opponent_taps = Number(battle.opponent_taps || 0) + 1;
    await apiUpdateBattle(battle.id, {
      opponent_taps: battle.opponent_taps
    });
  }

  await loadBattles();
  return true;
}

// =====================
// FINISH CHECK
// =====================
export async function finishBattleIfNeeded(battle) {
  if (!battle) return false;
  if (!battle.ends_at) return false;
  if (!["waiting", "active"].includes(battle.status)) return false;
  if (toMs(battle.ends_at) > nowMs()) return false;

  if (battle.status === "waiting") {
    await apiUpdateBattle(battle.id, {
      status: "cancelled"
    });

    if (battle.creator_username === getUsername()) {
      const p = getPlayer();
      p.balance = Number(p.balance || 0) + Number(battle.stake || 0);

      await updatePlayer({
        balance: p.balance
      });

      await apiAddHistory(p.username, "Battle expired refund", Number(battle.stake || 0));
    }

    return true;
  }

  const winner = getWinnerByScore(battle);

  await apiUpdateBattle(battle.id, {
    status: "finished",
    winner_username: winner
  });

  if (winner && winner === getUsername()) {
    const bank = getBattleBank(battle);
    const p = getPlayer();

    p.balance = Number(p.balance || 0) + bank;
    p.total_earned = Number(p.total_earned || 0) + bank;

    await updatePlayer({
      balance: p.balance,
      total_earned: p.total_earned
    });

    await apiAddHistory(p.username, "Battle win", bank);
  }

  if (!winner && isParticipant(battle)) {
    const p = getPlayer();
    p.balance = Number(p.balance || 0) + Number(battle.stake || 0);

    await updatePlayer({
      balance: p.balance
    });

    await apiAddHistory(p.username, "Battle draw refund", Number(battle.stake || 0));
  }

  return true;
}

export async function battleFinishChecker() {
  if (BattleState.checking) return;

  try {
    BattleState.checking = true;

    await loadBattles();

    if (BattleState.currentBattle) {
      await finishBattleIfNeeded(BattleState.currentBattle);
      await loadBattles();
    }
  } finally {
    BattleState.checking = false;
  }
}

// =====================
// RENDER
// =====================
export async function renderBattlePage() {
  document.body.dataset.currentPage = "battle";

  await loadBattles();

  const cards = safeArray(BattleState.battles)
    .map(battleCard)
    .join("");

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Battle Arena</h2>
      <p>Premium head-to-head tap competition with live stakes and fast rounds.</p>
    </div>

    ${summaryStats()}

    <div class="dashboard-grid">
      <div class="card">
        <h3>Create Battle</h3>
        <p class="muted" style="margin-bottom:12px;">Open a new tap duel with your own stake.</p>
        <div class="profile-actions">
          <input id="battle-stake" type="number" min="1" step="1" placeholder="Stake amount">
          <button id="battle-create-btn">Create Battle</button>
        </div>
      </div>

      ${currentBattlePanel(BattleState.currentBattle)}
    </div>

    <div class="section-title">Open Arena</div>
    <div class="asset-grid">
      ${
        cards ||
        `<div class="card" style="grid-column:1 / -1;"><h3>No Battles Yet</h3><p>Start the first premium duel.</p></div>`
      }
    </div>
  `);
}

// =====================
// WIDGET
// =====================
export function renderBattleWidget() {
  const root = document.getElementById("battle-widget");
  if (!root) return;

  const battle = BattleState.currentBattle;

  if (!battle) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = `
    <div class="card battle-current">
      <h3>Live Battle</h3>
      <p>${battle.creator_username || "—"} vs ${battle.opponent_username || "—"}</p>
      <p>Score: ${Number(battle.creator_taps || 0)} : ${Number(battle.opponent_taps || 0)}</p>
      <p>Time: ${formatTimer(battle.ends_at)}</p>
    </div>
  `;
}

// =====================
// BIND
// =====================
function bindBattleUI() {
  const createBtn = document.getElementById("battle-create-btn");
  if (createBtn) {
    createBtn.addEventListener("click", async () => {
      const created = await createBattle(getStakeInput());
      if (created) renderBattlePage();
    });
  }

  const refreshBtn = document.getElementById("battle-refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      await renderBattlePage();
    });
  }

  document.querySelectorAll("[data-join-battle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-join-battle");
      const ok = await joinBattle(id);
      if (ok) renderBattlePage();
    });
  });

  document.querySelectorAll("[data-tap-battle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-tap-battle");
      const ok = await battleTap(id);
      if (ok) renderBattlePage();
    });
  });

  document.querySelectorAll("[data-cancel-battle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-cancel-battle");
      const ok = await cancelMyBattle(id);
      if (ok) renderBattlePage();
    });
  });

  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener(
      "touchend",
      () => {},
      { passive: true }
    );
  });
}

// =====================
// LOOP
// =====================
export function startBattleLoop() {
  setInterval(async () => {
    await battleFinishChecker();

    if ((document.body.dataset.currentPage || "") === "battle") {
      renderBattlePage();
    }

    renderBattleWidget();
  }, 2500);
}
