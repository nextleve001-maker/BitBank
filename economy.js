import { AppState, updatePlayer } from "./app.js";
import { addBalance, removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// =====================
// BUSINESS DATA
// =====================
export const BUSINESSES = [
  { id: 1, name: "Lemonade Stand", price: 100, income: 1 },
  { id: 2, name: "Coffee Shop", price: 500, income: 5 },
  { id: 3, name: "Car Wash", price: 1500, income: 15 },
  { id: 4, name: "Restaurant", price: 5000, income: 50 },
  { id: 5, name: "Hotel", price: 20000, income: 200 },
  { id: 6, name: "Factory", price: 50000, income: 500 },
  { id: 7, name: "Tech Startup", price: 100000, income: 1000 },
  { id: 8, name: "Bank", price: 300000, income: 3000 },
  { id: 9, name: "Airline", price: 1000000, income: 10000 },
  { id: 10, name: "Oil Company", price: 5000000, income: 50000 },
  { id: 11, name: "AI Lab", price: 10000000, income: 100000 },
  { id: 12, name: "Space Company", price: 30000000, income: 300000 },
  { id: 13, name: "Mars Mining", price: 50000000, income: 500000 },
  { id: 14, name: "Quantum Corp", price: 100000000, income: 1000000 },
  { id: 15, name: "Time Tech", price: 200000000, income: 2000000 },
  { id: 16, name: "Galaxy Trade", price: 500000000, income: 5000000 },
  { id: 17, name: "Universe Bank", price: 1000000000, income: 10000000 },
  { id: 18, name: "Multiverse Corp", price: 2000000000, income: 20000000 },
  { id: 19, name: "God Industry", price: 5000000000, income: 50000000 },
  { id: 20, name: "Infinity Group", price: 10000000000, income: 100000000 },
  { id: 21, name: "Hyper Corp", price: 20000000000, income: 200000000 },
  { id: 22, name: "Nano Systems", price: 50000000000, income: 500000000 },
  { id: 23, name: "Omega Labs", price: 100000000000, income: 1000000000 },
  { id: 24, name: "Eternal Corp", price: 200000000000, income: 2000000000 },
  { id: 25, name: "Final Entity", price: 500000000000, income: 5000000000 }
];

// =====================
// HELPERS
// =====================
function getPlayer() {
  return AppState.player;
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function numberValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function getBusinessesArray() {
  const p = getPlayer();
  return safeArray(p.businesses);
}

function getBusinessLevels() {
  const p = getPlayer();
  return safeObject(p.business_levels);
}

// =====================
// BUY
// =====================
export function buyBusiness(id) {
  const p = getPlayer();
  const b = BUSINESSES.find((x) => x.id === id);

  if (!b) return false;

  if (!removeBalance(b.price)) {
    alert("Not enough money");
    return false;
  }

  const businesses = getBusinessesArray();
  businesses.push(id);
  p.businesses = businesses;

  updatePlayer({
    businesses: p.businesses
  });

  apiAddHistory(p.username, `Buy business: ${b.name}`, -b.price);
  return true;
}

// =====================
// INCOME
// =====================
export function calcBusinessIncome() {
  const businesses = getBusinessesArray();
  const levels = getBusinessLevels();

  let total = 0;

  businesses.forEach((id) => {
    const b = BUSINESSES.find((x) => x.id === id);
    if (!b) return;

    const level = numberValue(levels[id] || 1);
    total += numberValue(b.income) * level;
  });

  return total;
}

export function calcPassiveIncome() {
  return calcBusinessIncome();
}

export function passiveIncomeTick() {
  const p = getPlayer();
  const income = calcPassiveIncome() / 60;

  p.balance = numberValue(p.balance) + income;
  p.total_earned = numberValue(p.total_earned) + income;

  updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });
}

// =====================
// UPGRADE
// =====================
export function upgradeBusiness(id) {
  const p = getPlayer();
  const levels = getBusinessLevels();
  const currentLevel = numberValue(levels[id] || 1);
  const cost = currentLevel * 1000;

  if (!removeBalance(cost)) {
    alert("Not enough money");
    return false;
  }

  levels[id] = currentLevel + 1;
  p.business_levels = levels;

  updatePlayer({
    business_levels: p.business_levels
  });

  apiAddHistory(p.username, `Upgrade business ${id}`, -cost);
  return true;
}

// =====================
// SELL
// =====================
export function sellBusiness(index) {
  const p = getPlayer();
  const businesses = getBusinessesArray();
  const id = businesses[index];
  const b = BUSINESSES.find((x) => x.id === id);

  if (!b) return false;

  const refund = numberValue(b.price) * 0.5;

  businesses.splice(index, 1);
  p.businesses = businesses;

  addBalance(refund);

  updatePlayer({
    businesses: p.businesses
  });

  apiAddHistory(p.username, `Sell business: ${b.name}`, refund);
  return true;
}

// =====================
// VALUE
// =====================
export function getBusinessValue() {
  const businesses = getBusinessesArray();

  let total = 0;

  businesses.forEach((id) => {
    const b = BUSINESSES.find((x) => x.id === id);
    if (!b) return;
    total += numberValue(b.price);
  });

  return total;
}

// =====================
// RESET
// =====================
export function resetBusinesses() {
  const p = getPlayer();

  p.businesses = [];
  p.business_levels = {};

  updatePlayer({
    businesses: [],
    business_levels: {}
  });

  apiAddHistory(p.username, "Reset businesses", 0);
}
