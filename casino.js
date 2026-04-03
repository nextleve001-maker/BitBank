// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory, apiLogCasino } from "./api.js";

// =====================
// LOCAL STATE
// =====================
export const CasinoState = {
  lastResult: null,
  currentGame: "coinflip",
  spinning: false,
  logs: []
};

// =====================
// HELPERS
// =====================
function getPlayer(){
  return AppState.player;
}

function setPage(html){
  const root = document.getElementById("page-content");
  if(root) root.innerHTML = html;
}

function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function nowISO(){
  return new Date().toISOString();
}

function normalizeBet(bet){
  const value = Number(bet);
  if(!Number.isFinite(value)) return 0;
  return Math.floor(value);
}

function canBet(amount){
  const p = getPlayer();
  return amount > 0 && Number(p.balance) >= amount;
}

async function spendBet(amount){
  const p = getPlayer();

  if(!canBet(amount)){
    alert("Not enough money");
    return false;
  }

  p.balance -= amount;

  await updatePlayer({
    balance: p.balance
  });

  return true;
}

async function rewardWin(amount){
  const p = getPlayer();

  p.balance += amount;
  p.total_earned += amount;

  await updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });
}

async function saveCasinoLog(game, bet, result){
  const username = getPlayer().username;

  await apiLogCasino(username, game, bet, result);
  await apiAddHistory(username, `Casino: ${game}`, result >= 0 ? result : -bet);
}

function resultCardHTML(title, text, extra = ""){
  return `
    <div class="card casino-result">
      <h3>${title}</h3>
      <p>${text}</p>
      ${extra}
    </div>
  `;
}

function getBetFromInput(){
  const input = document.getElementById("casino-bet");
  return normalizeBet(input ? input.value : 0);
}

function setCurrentGame(game){
  CasinoState.currentGame = game;
}

function getCurrentGame(){
  return CasinoState.currentGame;
}

// =====================
// COINFLIP
// =====================
export async function playCoinflip(choice, bet){

  const amount = normalizeBet(bet);

  if(!(await spendBet(amount))){
    return null;
  }

  const side = randChoice(["heads", "tails"]);
  const win = side === choice;

  let profit = -amount;

  if(win){
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

// =====================
// DICE
// =====================
export async function playDice(target, bet){

  const amount = normalizeBet(bet);

  if(!(await spendBet(amount))){
    return null;
  }

  const rolled = randInt(1, 6);
  const targetNumber = normalizeBet(target);

  let multiplier = 0;
  let win = false;

  if(targetNumber >= 1 && targetNumber <= 6 && rolled === targetNumber){
    multiplier = 5;
    win = true;
  } else if(rolled >= 4){
    multiplier = 2;
    win = true;
  }

  let profit = -amount;

  if(win){
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

// =====================
// SLOTS
// =====================
const SLOT_SYMBOLS = ["🍒", "🍋", "💎", "7️⃣", "⭐", "🍀"];

function spinSlots(){
  return [
    randChoice(SLOT_SYMBOLS),
    randChoice(SLOT_SYMBOLS),
    randChoice(SLOT_SYMBOLS)
  ];
}

function getSlotsMultiplier(reels){
  const [a, b, c] = reels;

  if(a === b && b === c){
    if(a === "7️⃣") return 10;
    if(a === "💎") return 8;
    if(a === "⭐") return 6;
    return 5;
  }

  if(a === b || b === c || a === c){
    return 2;
  }

  return 0;
}

export async function playSlots(bet){

  const amount = normalizeBet(bet);

  if(!(await spendBet(amount))){
    return null;
  }

  const reels = spinSlots();
  const multiplier = getSlotsMultiplier(reels);
  const win = multiplier > 0;

  let profit = -amount;

  if(win){
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

// =====================
// ROULETTE
// =====================
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

export async function playRoulette(betType, betValue, bet){

  const amount = normalizeBet(bet);

  if(!(await spendBet(amount))){
    return null;
  }

  const rolled = randInt(0, 36);
  const color = ROULETTE_COLORS[rolled];

  let multiplier = 0;
  let win = false;

  if(betType === "number"){
    if(Number(betValue) === rolled){
      multiplier = 35;
      win = true;
    }
  }

  if(betType === "color"){
    if(String(betValue).toLowerCase() === String(color).toLowerCase()){
      multiplier = color === "green" ? 15 : 2;
      win = true;
    }
  }

  if(betType === "parity" && rolled !== 0){
    if(String(betValue) === "even" && rolled % 2 === 0){
      multiplier = 2;
      win = true;
    }
    if(String(betValue) === "odd" && rolled % 2 !== 0){
      multiplier = 2;
      win = true;
    }
  }

  let profit = -amount;

  if(win){
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

// =====================
// HIGHER / LOWER
// =====================
export async function playHigherLower(prediction, bet){

  const amount = normalizeBet(bet);

  if(!(await spendBet(amount))){
    return null;
  }

  const current = randInt(1, 13);
  const next = randInt(1, 13);

  let win = false;

  if(prediction === "higher" && next > current) win = true;
  if(prediction === "lower" && next < current) win = true;
  if(prediction === "same" && next === current) win = true;

  let multiplier = 0;

  if(prediction === "same"){
    multiplier = 5;
  } else {
    multiplier = 2;
  }

  let profit = -amount;

  if(win){
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
// RENDER RESULT
// =====================
export function renderCasinoResult(){

  const r = CasinoState.lastResult;

  if(!r){
    return resultCardHTML("Casino", "No games played yet");
  }

  if(r.game === "coinflip"){
    return resultCardHTML(
      "Coinflip",
      `Choice: ${r.choice} | Result: ${r.side} | ${r.win ? "WIN" : "LOSE"}`,
      `<p>Bet: ₴ ${r.bet}</p><p>Profit: ₴ ${r.profit}</p>`
    );
  }

  if(r.game === "dice"){
    return resultCardHTML(
      "Dice",
      `Target: ${r.target} | Rolled: ${r.rolled} | ${r.win ? "WIN" : "LOSE"}`,
      `<p>Bet: ₴ ${r.bet}</p><p>Profit: ₴ ${r.profit}</p>`
    );
  }

  if(r.game === "slots"){
    return resultCardHTML(
      "Slots",
      `${r.reels.join(" | ")} | ${r.win ? "WIN" : "LOSE"}`,
      `<p>Multiplier: x${r.multiplier}</p><p>Profit: ₴ ${r.profit}</p>`
    );
  }

  if(r.game === "roulette"){
    return resultCardHTML(
      "Roulette",
      `Rolled: ${r.rolled} (${r.color}) | ${r.win ? "WIN" : "LOSE"}`,
      `<p>Bet Type: ${r.betType}</p><p>Bet Value: ${r.betValue}</p><p>Profit: ₴ ${r.profit}</p>`
    );
  }

  if(r.game === "higher-lower"){
    return resultCardHTML(
      "Higher / Lower",
      `Current: ${r.current} | Next: ${r.next} | ${r.win ? "WIN" : "LOSE"}`,
      `<p>Prediction: ${r.prediction}</p><p>Profit: ₴ ${r.profit}</p>`
    );
  }

  return resultCardHTML("Casino", "Unknown result");
}

// =====================
// RENDER PAGE
// =====================
export function renderCasinoPage(){

  let html = `
    <h2>Casino</h2>

    <div class="card">
      <h3>Universal Bet</h3>
      <input id="casino-bet" type="number" min="1" step="1" placeholder="Bet amount">
    </div>

    <div class="card">
      <h3>Coinflip</h3>
      <button onclick="window.playCoinflipUI('heads')">Heads</button>
      <button onclick="window.playCoinflipUI('tails')">Tails</button>
    </div>

    <div class="card">
      <h3>Dice</h3>
      <input id="dice-target" type="number" min="1" max="6" step="1" placeholder="Target 1-6">
      <button onclick="window.playDiceUI()">Roll Dice</button>
    </div>

    <div class="card">
      <h3>Slots</h3>
      <button onclick="window.playSlotsUI()">Spin</button>
    </div>

    <div class="card">
      <h3>Roulette</h3>
      <div class="casino-roulette-row">
        <button onclick="window.playRouletteColorUI('red')">Red</button>
        <button onclick="window.playRouletteColorUI('black')">Black</button>
        <button onclick="window.playRouletteColorUI('green')">Green</button>
      </div>
      <div class="casino-roulette-row">
        <button onclick="window.playRouletteParityUI('even')">Even</button>
        <button onclick="window.playRouletteParityUI('odd')">Odd</button>
      </div>
      <input id="roulette-number" type="number" min="0" max="36" step="1" placeholder="Number 0-36">
      <button onclick="window.playRouletteNumberUI()">Bet Number</button>
    </div>

    <div class="card">
      <h3>Higher / Lower</h3>
      <button onclick="window.playHigherLowerUI('higher')">Higher</button>
      <button onclick="window.playHigherLowerUI('lower')">Lower</button>
      <button onclick="window.playHigherLowerUI('same')">Same</button>
    </div>

    ${renderCasinoResult()}
  `;

  setPage(html);
}

// =====================
// WINDOW UI BRIDGE
// =====================
window.playCoinflipUI = async function(choice){
  const bet = getBetFromInput();
  const result = await playCoinflip(choice, bet);
  if(result) renderCasinoPage();
};

window.playDiceUI = async function(){
  const bet = getBetFromInput();
  const targetInput = document.getElementById("dice-target");
  const target = targetInput ? targetInput.value : 0;
  const result = await playDice(target, bet);
  if(result) renderCasinoPage();
};

window.playSlotsUI = async function(){
  const bet = getBetFromInput();
  const result = await playSlots(bet);
  if(result) renderCasinoPage();
};

window.playRouletteColorUI = async function(color){
  const bet = getBetFromInput();
  const result = await playRoulette("color", color, bet);
  if(result) renderCasinoPage();
};

window.playRouletteParityUI = async function(parity){
  const bet = getBetFromInput();
  const result = await playRoulette("parity", parity, bet);
  if(result) renderCasinoPage();
};

window.playRouletteNumberUI = async function(){
  const bet = getBetFromInput();
  const input = document.getElementById("roulette-number");
  const number = input ? input.value : 0;
  const result = await playRoulette("number", number, bet);
  if(result) renderCasinoPage();
};

window.playHigherLowerUI = async function(prediction){
  const bet = getBetFromInput();
  const result = await playHigherLower(prediction, bet);
  if(result) renderCasinoPage();
};
