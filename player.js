import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";
import { getCurrentClassConfig } from "./economy.js";
import { getCurrentRoleConfig, getRoleClickBoost } from "./roles.js";
import { getCardThemeBonus } from "./cards.js";
import { getCollectionBonuses } from "./collections.js";

// ======================================================
// CORE PLAYER ACCESS
// ======================================================
export function getPlayer() {
  return AppState.player || {};
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function now() {
  return new Date().toISOString();
}

// ======================================================
// INIT / FIX STATE
// ======================================================
export function ensurePlayerState() {
  const p = getPlayer();

  if (!p.balance) p.balance = 0;
  if (!p.usd) p.usd = 0;
  if (!p.total_earned) p.total_earned = 0;
  if (!p.clicks) p.clicks = 0;

  if (!p.crypto) p.crypto = {};
  if (!p.stocks) p.stocks = {};
  if (!p.business_projects) p.business_projects = {};

  if (!Array.isArray(p.friends)) p.friends = [];
  if (!Array.isArray(p.inventory)) p.inventory = [];
  if (!Array.isArray(p.titles)) p.titles = [];

  if (!p.class) p.class = "none";
  if (!p.role) p.role = "none";

  if (!p.card_theme) p.card_theme = "classic_blue";
  if (!Array.isArray(p.card_themes_owned)) {
    p.card_themes_owned = ["classic_blue"];
  }

  if (!p.collections_state) {
    p.collections_state = { claimed: {}, completed_at: {} };
  }

  return p;
}

// ======================================================
// CLICK SYSTEM
// ======================================================
function baseClick() {
  return 5;
}

function classBonus() {
  return num(getCurrentClassConfig()?.clickBonus || 0);
}

function roleBonus() {
  return num(getRoleClickBoost() || 0);
}

function cardBonus() {
  return num(getCardThemeBonus()?.clickBoost || 0);
}

function collectionBonus() {
  return num(getCollectionBonuses()?.click_boost || 0);
}

export function getClickIncome() {
  return (
    baseClick() +
    classBonus() +
    roleBonus() +
    cardBonus() +
    collectionBonus()
  );
}

// ======================================================
// MONEY
// ======================================================
export function addBalance(amount) {
  const p = getPlayer();
  const v = num(amount);

  if (v <= 0) return;

  p.balance += v;
  p.total_earned += v;

  updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });
}

export function removeBalance(amount) {
  const p = getPlayer();
  const v = num(amount);

  if (p.balance < v) return false;

  p.balance -= v;

  updatePlayer({ balance: p.balance });

  return true;
}

export function addUSD(amount) {
  const p = getPlayer();
  const v = num(amount);

  p.usd += v;

  updatePlayer({ usd: p.usd });
}

export function removeUSD(amount) {
  const p = getPlayer();
  const v = num(amount);

  if (p.usd < v) return false;

  p.usd -= v;

  updatePlayer({ usd: p.usd });

  return true;
}

// ======================================================
// CLICK ACTION
// ======================================================
export async function handleClick() {
  const p = ensurePlayerState();

  const income = getClickIncome();

  p.balance += income;
  p.total_earned += income;
  p.clicks += 1;
  p.last_seen = now();

  await updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned,
    clicks: p.clicks,
    last_seen: p.last_seen
  });

  if (p.clicks % 100 === 0) {
    await apiAddHistory(p.username, "Click milestone", income);
  }
}

// ======================================================
// PRESTIGE
// ======================================================
export function getPrestige() {
  const cls = getCurrentClassConfig();
  const role = getCurrentRoleConfig();

  let value = 0;

  if (cls?.id === "vip") value += 5;
  if (cls?.id === "legend") value += 8;
  if (cls?.id === "creator") value += 12;

  if (role?.id === "trader") value += 1;
  if (role?.id === "entrepreneur") value += 2;

  value += num(getCardThemeBonus()?.prestige || 0);
  value += num(getCollectionBonuses()?.prestige || 0);

  return value;
}

// ======================================================
// WEALTH
// ======================================================
export function getWealth() {
  const p = getPlayer();

  const total = p.balance + p.usd * 40;

  if (total > 100000000) return "Tycoon";
  if (total > 10000000) return "Investor";
  if (total > 1000000) return "Builder";

  return "Starter";
}

// ======================================================
// STATS
// ======================================================
export function getStats() {
  const p = getPlayer();

  return {
    balance: p.balance,
    usd: p.usd,
    clicks: p.clicks,
    total: p.total_earned,
    income: getClickIncome(),
    prestige: getPrestige(),
    wealth: getWealth()
  };
}

// ======================================================
// TITLES
// ======================================================
export function rebuildTitles() {
  const p = getPlayer();

  const titles = [];

  if (p.total_earned > 1000000) titles.push("Millionaire");
  if (p.total_earned > 100000000) titles.push("Capital King");
  if (p.clicks > 1000) titles.push("Clicker");
  if (p.clicks > 10000) titles.push("Click God");

  const role = getCurrentRoleConfig();
  if (role?.name) titles.push(role.name);

  const cls = getCurrentClassConfig();
  if (cls?.name) titles.push(cls.name);

  p.titles = titles;

  updatePlayer({ titles });

  return titles;
}
