// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import { apiCreateBattle, apiGetBattles, apiUpdateBattle, apiAddHistory } from "./api.js";

// =====================
// LOCAL STATE
// =====================
export const BattleState = {
  currentBattle: null,
  battles: [],
  lastLoadedAt: 0,
  checking: false
};

// =====================
// HELPERS
// =====================
function getPlayer(){
  return AppState.player;
}

function getUsername(){
  return getPlayer()?.username || "";
}

function nowISO(){
  return new Date().toISOString();
}

function nowMs(){
  return Date.now();
}

function toMs(dateLike){
  return new Date(dateLike).getTime();
}

function isBattleParticipant(battle, username){
  if(!battle || !username) return false;
  return battle.creator_username === username || battle.opponent_username === username;
}

function getMySide(battle){
  const username = getUsername();
  if(battle.creator_username === username) return "creator";
  if(battle.opponent_username === username) return "opponent";
  return null;
}

function getBattleBank(battle){
  return Number(battle.stake || 0) * 2;
}

function formatBattleTimer(endsAt){
  if(!endsAt) return "00:00";
  const diff = Math.max(0, Math.floor((toMs(endsAt) - nowMs()) / 1000));
  const min = String(Math.floor(diff / 60)).padStart(2, "0");
  const sec = String(diff % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function setPage(html){
  const root = document.getElementById("page-content");
  if(root) root.innerHTML = html;
}

function ensureBattleLoaded(){
  if(!BattleState.currentBattle) return false;
  return true;
}

function getWinnerUsernameByScore(battle){
  const creator = Number(battle.creator_taps || 0);
  const opponent = Number(battle.opponent_taps || 0);

  if(creator > opponent) return battle.creator_username;
  if(opponent > creator) return battle.opponent_username;
  return null;
}

function getBattleStatusLabel(status){
  switch(status){
    case "waiting": return "Waiting";
    case "active": return "Active";
    case "finished": return "Finished";
    case "cancelled": return "Cancelled";
    default: return "Unknown";
  }
}

// =====================
// LOAD BATTLES
// =====================
export async function loadBattles(){
  const data = await apiGetBattles();
  BattleState.battles = Array.isArray(data) ? data : [];
  BattleState.lastLoadedAt = nowMs();

  const myBattle = BattleState.battles.find(b=> isBattleParticipant(b, getUsername()) && b.status !== "finished" && b.status !== "cancelled");
  if(myBattle){
    BattleState.currentBattle = myBattle;
  }

  return BattleState.battles;
}

// =====================
// CREATE BATTLE
// =====================
export async function createBattle(stake){

  const p = getPlayer();
  const amount = Number(stake);

  if(!amount || amount <= 0){
    alert("Invalid stake");
    return null;
  }

  if(Number(p.balance) < amount){
    alert("Not enough money");
    return null;
  }

  if(BattleState.currentBattle && ["waiting","active"].includes(BattleState.currentBattle.status)){
    alert("You already have an active battle");
    return null;
  }

  p.balance -= amount;

  await updatePlayer({
    balance: p.balance
  });

  const createdAt = nowISO();
  const endsAt = new Date(Date.now() + 60000).toISOString();

  const payload = {
    creator_username: p.username,
    opponent_username: null,
    stake: amount,
    creator_taps: 0,
    opponent_taps: 0,
    status: "waiting",
    winner_username: null,
    created_at: createdAt,
    started_at: null,
    ends_at: endsAt
  };

  const created = await apiCreateBattle(payload);

  if(!created){
    p.balance += amount;
    await updatePlayer({ balance: p.balance });
    alert("Battle create error");
    return null;
  }

  BattleState.currentBattle = created;
  BattleState.battles.unshift(created);

  await apiAddHistory(p.username, "Create battle", -amount);

  return created;
}

// =====================
// JOIN BATTLE
// =====================
export async function joinBattle(battleId){

  const p = getPlayer();
  const battle = BattleState.battles.find(b=> String(b.id) === String(battleId));

  if(!battle){
    alert("Battle not found");
    return false;
  }

  if(battle.status !== "waiting"){
    alert("Battle is not available");
    return false;
  }

  if(battle.creator_username === p.username){
    alert("You cannot join your own battle");
    return false;
  }

  if(Number(p.balance) < Number(battle.stake)){
    alert("Not enough money");
    return false;
  }

  p.balance -= Number(battle.stake);

  await updatePlayer({
    balance: p.balance
  });

  const startedAt = nowISO();
  const endsAt = new Date(Date.now() + 60000).toISOString();

  await apiUpdateBattle(battle.id, {
    opponent_username: p.username,
    status: "active",
    started_at: startedAt,
    ends_at: endsAt
  });

  await loadBattles();

  const current = BattleState.battles.find(b=> String(b.id) === String(battle.id));
  BattleState.currentBattle = current || null;

  await apiAddHistory(p.username, "Join battle", -Number(battle.stake));

  return true;
}

// =====================
// CANCEL WAITING BATTLE
// =====================
export async function cancelMyWaitingBattle(){

  const battle = BattleState.currentBattle;
  const p = getPlayer();

  if(!battle){
    alert("No battle");
    return false;
  }

  if(battle.creator_username !== p.username){
    alert("Only creator can cancel");
    return false;
  }

  if(battle.status !== "waiting"){
    alert("Battle is already active");
    return false;
  }

  await apiUpdateBattle(battle.id, {
    status: "cancelled"
  });

  p.balance += Number(battle.stake || 0);

  await updatePlayer({
    balance: p.balance
  });

  await apiAddHistory(p.username, "Cancel battle refund", Number(battle.stake || 0));

  BattleState.currentBattle = null;
  await loadBattles();

  return true;
}

// =====================
// TAP ACTION
// =====================
export async function battleTap(){

  const battle = BattleState.currentBattle;
  const p = getPlayer();

  if(!battle){
    alert("No active battle");
    return false;
  }

  if(battle.status !== "active"){
    alert("Battle is not active");
    return false;
  }

  const side = getMySide(battle);

  if(!side){
    alert("You are not a participant");
    return false;
  }

  if(side === "creator"){
    battle.creator_taps = Number(battle.creator_taps || 0) + 1;

    await apiUpdateBattle(battle.id, {
      creator_taps: battle.creator_taps
    });

    return true;
  }

  battle.opponent_taps = Number(battle.opponent_taps || 0) + 1;

  await apiUpdateBattle(battle.id, {
    opponent_taps: battle.opponent_taps
  });

  return true;
}

// =====================
// FINISH BATTLE
// =====================
export async function finishBattleIfNeeded(battle){

  if(!battle) return false;
  if(battle.status !== "active" && battle.status !== "waiting") return false;

  const ended = battle.ends_at ? toMs(battle.ends_at) <= nowMs() : false;
  if(!ended) return false;

  if(battle.status === "waiting"){
    await apiUpdateBattle(battle.id, {
      status: "cancelled"
    });

    if(battle.creator_username){
      const creator = AppState.allPlayers.find(x=>x.username === battle.creator_username);
      if(creator){
        creator.balance = Number(creator.balance || 0) + Number(battle.stake || 0);
      }
    }

    if(getUsername() === battle.creator_username){
      const p = getPlayer();
      p.balance += Number(battle.stake || 0);
      await updatePlayer({ balance: p.balance });
      await apiAddHistory(p.username, "Battle expired refund", Number(battle.stake || 0));
    }

    return true;
  }

  const winner = getWinnerUsernameByScore(battle);
  const bank = getBattleBank(battle);

  await apiUpdateBattle(battle.id, {
    status: "finished",
    winner_username: winner
  });

  if(winner){
    const current = AppState.allPlayers.find(x=>x.username === winner);

    if(current){
      current.balance = Number(current.balance || 0) + bank;
      current.total_earned = Number(current.total_earned || 0) + bank;
    }

    if(getUsername() === winner){
      const p = getPlayer();
      p.balance += bank;
      p.total_earned += bank;

      await updatePlayer({
        balance: p.balance,
        total_earned: p.total_earned
      });

      await apiAddHistory(p.username, "Battle win", bank);
    }
  } else {
    if(getUsername() === battle.creator_username || getUsername() === battle.opponent_username){
      const p = getPlayer();
      p.balance += Number(battle.stake || 0);

      await updatePlayer({
        balance: p.balance
      });

      await apiAddHistory(p.username, "Battle draw refund", Number(battle.stake || 0));
    }
  }

  return true;
}

// =====================
// CHECK CURRENT BATTLE
// =====================
export async function battleFinishChecker(){

  if(BattleState.checking) return;

  try{
    BattleState.checking = true;

    await loadBattles();

    if(BattleState.currentBattle){
      await finishBattleIfNeeded(BattleState.currentBattle);
      await loadBattles();
    }
  } finally {
    BattleState.checking = false;
  }
}

// =====================
// MY BATTLE INFO
// =====================
export function getMyBattleStats(){
  const battle = BattleState.currentBattle;

  if(!battle){
    return {
      exists: false
    };
  }

  return {
    exists: true,
    id: battle.id,
    status: battle.status,
    mySide: getMySide(battle),
    creator: battle.creator_username,
    opponent: battle.opponent_username,
    creatorTaps: Number(battle.creator_taps || 0),
    opponentTaps: Number(battle.opponent_taps || 0),
    timer: formatBattleTimer(battle.ends_at),
    bank: getBattleBank(battle),
    winner: battle.winner_username || null
  };
}

// =====================
// BATTLE CARD HTML
// =====================
function battleCardHTML(battle){

  const mine = isBattleParticipant(battle, getUsername());
  const canJoin = battle.status === "waiting" && battle.creator_username !== getUsername();

  return `
    <div class="card battle-card ${mine ? "battle-mine" : ""}">
      <h3>Battle #${battle.id}</h3>
      <p>Status: ${getBattleStatusLabel(battle.status)}</p>
      <p>Creator: ${battle.creator_username || "-"}</p>
      <p>Opponent: ${battle.opponent_username || "-"}</p>
      <p>Stake: ₴ ${Math.floor(Number(battle.stake || 0))}</p>
      <p>Bank: ₴ ${Math.floor(getBattleBank(battle))}</p>
      <p>Score: ${Number(battle.creator_taps || 0)} : ${Number(battle.opponent_taps || 0)}</p>
      <p>Timer: ${formatBattleTimer(battle.ends_at)}</p>
      ${battle.winner_username ? `<p>Winner: ${battle.winner_username}</p>` : ""}

      <div class="battle-actions">
        ${canJoin ? `<button onclick="window.joinBattleUI('${battle.id}')">Join</button>` : ""}
        ${mine && battle.status === "active" ? `<button onclick="window.battleTapUI()">Tap</button>` : ""}
        ${mine && battle.status === "waiting" && battle.creator_username === getUsername() ? `<button onclick="window.cancelBattleUI()">Cancel</button>` : ""}
      </div>
    </div>
  `;
}

// =====================
// RENDER MAIN PAGE
// =====================
export async function renderBattlePage(){

  await loadBattles();

  const myStats = getMyBattleStats();

  let html = `
    <h2>Battle Arena</h2>

    <div class="card">
      <h3>Create Battle</h3>
      <input id="battle-stake" type="number" min="1" step="1" placeholder="Stake">
      <button onclick="window.createBattleUI()">Create</button>
    </div>
  `;

  if(myStats.exists){
    html += `
      <div class="card battle-current">
        <h3>My Battle</h3>
        <p>Status: ${getBattleStatusLabel(myStats.status)}</p>
        <p>Creator: ${myStats.creator || "-"}</p>
        <p>Opponent: ${myStats.opponent || "-"}</p>
        <p>My Side: ${myStats.mySide || "-"}</p>
        <p>Score: ${myStats.creatorTaps} : ${myStats.opponentTaps}</p>
        <p>Timer: ${myStats.timer}</p>
        <p>Bank: ₴ ${Math.floor(myStats.bank)}</p>
        ${myStats.winner ? `<p>Winner: ${myStats.winner}</p>` : ""}
        <div class="battle-actions">
          ${myStats.status === "active" ? `<button onclick="window.battleTapUI()">Tap</button>` : ""}
          ${myStats.status === "waiting" && myStats.creator === getUsername() ? `<button onclick="window.cancelBattleUI()">Cancel</button>` : ""}
          <button onclick="window.refreshBattleUI()">Refresh</button>
        </div>
      </div>
    `;
  }

  html += `<h3>Open Battles</h3>`;

  const sortedBattles = [...BattleState.battles].sort((a,b)=> {
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  if(!sortedBattles.length){
    html += `<div class="card"><p>No battles yet</p></div>`;
  } else {
    sortedBattles.forEach(battle=>{
      html += battleCardHTML(battle);
    });
  }

  setPage(html);
}

// =====================
// RENDER MINI WIDGET
// =====================
export function renderBattleWidget(){

  const root = document.getElementById("battle-widget");
  if(!root) return;

  const stats = getMyBattleStats();

  if(!stats.exists){
    root.innerHTML = `<div class="card"><p>No active battle</p></div>`;
    return;
  }

  root.innerHTML = `
    <div class="card">
      <h3>Battle Live</h3>
      <p>${stats.creator} vs ${stats.opponent || "..."}</p>
      <p>${stats.creatorTaps} : ${stats.opponentTaps}</p>
      <p>${stats.timer}</p>
      ${stats.status === "active" ? `<button onclick="window.battleTapUI()">Tap</button>` : ""}
    </div>
  `;
}

// =====================
// AUTO REFRESH
// =====================
export function startBattleLoop(){

  setInterval(async ()=>{
    await loadBattles();

    if(BattleState.currentBattle){
      await battleFinishChecker();
    }

    const currentRoot = document.getElementById("page-content");
    if(currentRoot && currentRoot.innerHTML.includes("Battle Arena")){
      renderBattlePage();
    }

    renderBattleWidget();
  }, 2000);
}

// =====================
// UI BRIDGE
// =====================
window.createBattleUI = async function(){
  const input = document.getElementById("battle-stake");
  const stake = input ? Number(input.value) : 0;
  const created = await createBattle(stake);

  if(created){
    await renderBattlePage();
  }
};

window.joinBattleUI = async function(id){
  const ok = await joinBattle(id);
  if(ok){
    await renderBattlePage();
  }
};

window.battleTapUI = async function(){
  const ok = await battleTap();
  if(ok){
    await loadBattles();
    await renderBattlePage();
  }
};

window.cancelBattleUI = async function(){
  const ok = await cancelMyWaitingBattle();
  if(ok){
    await renderBattlePage();
  }
};

window.refreshBattleUI = async function(){
  await renderBattlePage();
};
