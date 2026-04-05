import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";
import { getCurrentClassConfig } from "./economy.js";
import { getCurrentRoleConfig, getRoleClickBoost } from "./roles.js";
import { getCardThemeBonus } from "./cards.js";
import { getCollectionBonuses } from "./collections.js";

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function numberValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nowIso() {
  return new Date().toISOString();
}

function ensurePlayerArrays() {
  const p = getPlayer();

  if (!Array.isArray(p.titles)) p.titles = [];
  if (!Array.isArray(p.inventory)) p.inventory = [];
  if (!Array.isArray(p.friends)) p.friends = [];
  if (!Array.isArray(p.cars)) p.cars = [];
  if (!Array.isArray(p.realty)) p.realty = [];
  if (!Array.isArray(p.card_themes_owned)) p.card_themes_owned = ["classic_blue"];

  if (!p.crypto || typeof p.crypto !== "object" || Array.isArray(p.crypto)) p.crypto = {};
  if (!p.stocks || typeof p.stocks !== "object" || Array.isArray(p.stocks)) p.stocks = {};
  if (!p.business_projects || typeof p.business_projects !== "object" || Array.isArray(p.business_projects)) p.business_projects = {};
  if (!p.collections_state || typeof p.collections_state !== "object" || Array.isArray(p.collections_state)) {
    p.collections_state = { claimed: {}, completed_at: {} };
  }
}

function classClickBonus() {
  const cls = getCurrentClassConfig();
  return numberValue(cls.clickBonus || 0);
}

function roleClickBonus() {
  return numberValue(getRoleClickBoost() || 0);
}

function cardClickBonus() {
  const bonus = getCardThemeBonus();
  return numberValue(bonus.clickBoost || 0);
}

function collectionClickBonus() {
  const bonus = getCollectionBonuses();
  return numberValue(bonus.click_boost || 0);
}

function baseClickValue() {
  return 5;
}

export function getClickIncome() {
  return (
    baseClickValue() +
    classClickBonus() +
    roleClickBonus() +
    cardClickBonus() +
    collectionClickBonus()
  );
}

function prestigeFromClass() {
  const cls = getCurrentClassConfig();
  const id = String(cls.id || "none");

  if (id === "bronze") return 1;
  if (id === "silver") return 2;
  if (id === "gold") return 3;
  if (id === "platinum") return 4;
  if (id === "diamond") return 5;
  if (id === "black") return 6;
  if (id === "vip") return 7;
  if (id === "legend") return 9;
  if (id === "creator") return 12;

  return 0;
}

function prestigeFromRole() {
  const role = getCurrentRoleConfig();
  const id = String(role.id || "none");

  if (id === "media_mogul") return 2;
  if (id === "banker") return 1;
  if (id === "sports_manager") return 1;
  if (id === "high_roller") return 1;

  return 0;
}

function prestigeFromCard() {
  const bonus = getCardThemeBonus();
  return numberValue(bonus.prestige || 0);
}

function prestigeFromCollections() {
  const bonus = getCollectionBonuses();
  return numberValue(bonus.prestige || 0);
}

export function getTotalPrestige() {
  return (
    prestigeFromClass() +
    prestigeFromRole() +
    prestigeFromCard() +
    prestigeFromCollections()
  );
}

export function getPrestigeLabel() {
  const value = getTotalPrestige();

  if (value >= 18) return "Mythic";
  if (value >= 14) return "Royal";
  if (value >= 10) return "Elite";
  if (value >= 7) return "Luxury";
  if (value >= 4) return "Premium";
  if (value >= 2) return "Rising";

  return "Starter";
}

export function getWealthTier() {
  const p = getPlayer();
  const balance = numberValue(p.balance || 0);
  const usd = numberValue(p.usd || 0) * 40;
  const total = balance + usd;

  if (total >= 500000000) return "Capital Emperor";
  if (total >= 100000000) return "Mega Tycoon";
  if (total >= 10000000) return "Tycoon";
  if (total >= 1000000) return "Investor";
  if (total >= 100000) return "Builder";

  return "Newcomer";
}

// ======================================================
// MONEY
// ======================================================
export function canAfford(amount) {
  return numberValue(getPlayer().balance) >= numberValue(amount);
}

export function addBalance(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;

  p.balance = numberValue(p.balance) + value;
  p.total_earned = numberValue(p.total_earned) + value;

  updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });

  return true;
}

export function removeBalance(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;
  if (numberValue(p.balance) < value) return false;

  p.balance = numberValue(p.balance) - value;

  updatePlayer({
    balance: p.balance
  });

  return true;
}

export function addUSD(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;

  p.usd = numberValue(p.usd) + value;

  updatePlayer({
    usd: p.usd
  });

  return true;
}

export function removeUSD(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;
  if (numberValue(p.usd) < value) return false;

  p.usd = numberValue(p.usd) - value;

  updatePlayer({
    usd: p.usd
  });

  return true;
}

// ======================================================
// CLICK / PROGRESSION
// ======================================================
export async function handleClick() {
  ensurePlayerArrays();

  const p = getPlayer();
  const income = getClickIncome();

  p.balance = numberValue(p.balance) + income;
  p.total_earned = numberValue(p.total_earned) + income;
  p.clicks = numberValue(p.clicks || 0) + 1;
  p.last_seen = nowIso();

  await updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned,
    clicks: p.clicks,
    last_seen: p.last_seen
  });

  if (p.clicks % 100 === 0) {
    await apiAddHistory(p.username, `Click milestone: ${p.clicks}`, income);
  }
}

export function getPlayerOverviewStats() {
  const p = getPlayer();

  return {
    clickIncome: getClickIncome(),
    prestige: getTotalPrestige(),
    prestigeLabel: getPrestigeLabel(),
    wealthTier: getWealthTier(),
    totalEarned: numberValue(p.total_earned || 0),
    totalClicks: numberValue(p.clicks || 0),
    balance: numberValue(p.balance || 0),
    usd: numberValue(p.usd || 0)
  };
}

// ======================================================
// TITLES
// ======================================================
export function rebuildAutoTitles() {
  ensurePlayerArrays();

  const p = getPlayer();
  const titles = new Set();

  const prestige = getTotalPrestige();
  const wealthTier = getWealthTier();
  const role = getCurrentRoleConfig();
  const cls = getCurrentClassConfig();

  titles.add(wealthTier);
  titles.add(getPrestigeLabel());

  if (prestige >= 10) titles.add("Prestige Elite");
  if (numberValue(p.total_earned) >= 1000000) titles.add("Million Earner");
  if (numberValue(p.total_earned) >= 100000000) titles.add("Capital Machine");
  if (numberValue(p.clicks) >= 1000) titles.add("Tap Grinder");
  if (numberValue(p.clicks) >= 10000) titles.add("Tap Legend");

  if (String(role.id || "none") !== "none") {
    titles.add(role.name);
  }

  if (String(cls.id || "none") !== "none") {
    titles.add(cls.name);
  }

  p.titles = [...titles];

  updatePlayer({
    titles: p.titles
  });

  return p.titles;
}

// ======================================================
// START / PATCH
// ======================================================
export function normalizePlayerState() {
  ensurePlayerArrays();

  const p = getPlayer();

  p.balance = numberValue(p.balance || 0);
  p.usd = numberValue(p.usd || 0);
  p.total_earned = numberValue(p.total_earned || 0);
  p.clicks = numberValue(p.clicks || 0);

  if (!p.class) p.class = "none";
  if (!p.role) p.role = "none";

  return p;
}import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";
import { getCurrentClassConfig } from "./economy.js";
import { getCurrentRoleConfig, getRoleClickBoost } from "./roles.js";
import { getCardThemeBonus } from "./cards.js";
import { getCollectionBonuses } from "./collections.js";

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function numberValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nowIso() {
  return new Date().toISOString();
}

function ensurePlayerArrays() {
  const p = getPlayer();

  if (!Array.isArray(p.titles)) p.titles = [];
  if (!Array.isArray(p.inventory)) p.inventory = [];
  if (!Array.isArray(p.friends)) p.friends = [];
  if (!Array.isArray(p.cars)) p.cars = [];
  if (!Array.isArray(p.realty)) p.realty = [];
  if (!Array.isArray(p.card_themes_owned)) p.card_themes_owned = ["classic_blue"];

  if (!p.crypto || typeof p.crypto !== "object" || Array.isArray(p.crypto)) p.crypto = {};
  if (!p.stocks || typeof p.stocks !== "object" || Array.isArray(p.stocks)) p.stocks = {};
  if (!p.business_projects || typeof p.business_projects !== "object" || Array.isArray(p.business_projects)) p.business_projects = {};
  if (!p.collections_state || typeof p.collections_state !== "object" || Array.isArray(p.collections_state)) {
    p.collections_state = { claimed: {}, completed_at: {} };
  }
}

function classClickBonus() {
  const cls = getCurrentClassConfig();
  return numberValue(cls.clickBonus || 0);
}

function roleClickBonus() {
  return numberValue(getRoleClickBoost() || 0);
}

function cardClickBonus() {
  const bonus = getCardThemeBonus();
  return numberValue(bonus.clickBoost || 0);
}

function collectionClickBonus() {
  const bonus = getCollectionBonuses();
  return numberValue(bonus.click_boost || 0);
}

function baseClickValue() {
  return 5;
}

export function getClickIncome() {
  return (
    baseClickValue() +
    classClickBonus() +
    roleClickBonus() +
    cardClickBonus() +
    collectionClickBonus()
  );
}

function prestigeFromClass() {
  const cls = getCurrentClassConfig();
  const id = String(cls.id || "none");

  if (id === "bronze") return 1;
  if (id === "silver") return 2;
  if (id === "gold") return 3;
  if (id === "platinum") return 4;
  if (id === "diamond") return 5;
  if (id === "black") return 6;
  if (id === "vip") return 7;
  if (id === "legend") return 9;
  if (id === "creator") return 12;

  return 0;
}

function prestigeFromRole() {
  const role = getCurrentRoleConfig();
  const id = String(role.id || "none");

  if (id === "media_mogul") return 2;
  if (id === "banker") return 1;
  if (id === "sports_manager") return 1;
  if (id === "high_roller") return 1;

  return 0;
}

function prestigeFromCard() {
  const bonus = getCardThemeBonus();
  return numberValue(bonus.prestige || 0);
}

function prestigeFromCollections() {
  const bonus = getCollectionBonuses();
  return numberValue(bonus.prestige || 0);
}

export function getTotalPrestige() {
  return (
    prestigeFromClass() +
    prestigeFromRole() +
    prestigeFromCard() +
    prestigeFromCollections()
  );
}

export function getPrestigeLabel() {
  const value = getTotalPrestige();

  if (value >= 18) return "Mythic";
  if (value >= 14) return "Royal";
  if (value >= 10) return "Elite";
  if (value >= 7) return "Luxury";
  if (value >= 4) return "Premium";
  if (value >= 2) return "Rising";

  return "Starter";
}

export function getWealthTier() {
  const p = getPlayer();
  const balance = numberValue(p.balance || 0);
  const usd = numberValue(p.usd || 0) * 40;
  const total = balance + usd;

  if (total >= 500000000) return "Capital Emperor";
  if (total >= 100000000) return "Mega Tycoon";
  if (total >= 10000000) return "Tycoon";
  if (total >= 1000000) return "Investor";
  if (total >= 100000) return "Builder";

  return "Newcomer";
}

// ======================================================
// MONEY
// ======================================================
export function canAfford(amount) {
  return numberValue(getPlayer().balance) >= numberValue(amount);
}

export function addBalance(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;

  p.balance = numberValue(p.balance) + value;
  p.total_earned = numberValue(p.total_earned) + value;

  updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });

  return true;
}

export function removeBalance(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;
  if (numberValue(p.balance) < value) return false;

  p.balance = numberValue(p.balance) - value;

  updatePlayer({
    balance: p.balance
  });

  return true;
}

export function addUSD(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;

  p.usd = numberValue(p.usd) + value;

  updatePlayer({
    usd: p.usd
  });

  return true;
}

export function removeUSD(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (value <= 0) return true;
  if (numberValue(p.usd) < value) return false;

  p.usd = numberValue(p.usd) - value;

  updatePlayer({
    usd: p.usd
  });

  return true;
}

// ======================================================
// CLICK / PROGRESSION
// ======================================================
export async function handleClick() {
  ensurePlayerArrays();

  const p = getPlayer();
  const income = getClickIncome();

  p.balance = numberValue(p.balance) + income;
  p.total_earned = numberValue(p.total_earned) + income;
  p.clicks = numberValue(p.clicks || 0) + 1;
  p.last_seen = nowIso();

  await updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned,
    clicks: p.clicks,
    last_seen: p.last_seen
  });

  if (p.clicks % 100 === 0) {
    await apiAddHistory(p.username, `Click milestone: ${p.clicks}`, income);
  }
}

export function getPlayerOverviewStats() {
  const p = getPlayer();

  return {
    clickIncome: getClickIncome(),
    prestige: getTotalPrestige(),
    prestigeLabel: getPrestigeLabel(),
    wealthTier: getWealthTier(),
    totalEarned: numberValue(p.total_earned || 0),
    totalClicks: numberValue(p.clicks || 0),
    balance: numberValue(p.balance || 0),
    usd: numberValue(p.usd || 0)
  };
}

// ======================================================
// TITLES
// ======================================================
export function rebuildAutoTitles() {
  ensurePlayerArrays();

  const p = getPlayer();
  const titles = new Set();

  const prestige = getTotalPrestige();
  const wealthTier = getWealthTier();
  const role = getCurrentRoleConfig();
  const cls = getCurrentClassConfig();

  titles.add(wealthTier);
  titles.add(getPrestigeLabel());

  if (prestige >= 10) titles.add("Prestige Elite");
  if (numberValue(p.total_earned) >= 1000000) titles.add("Million Earner");
  if (numberValue(p.total_earned) >= 100000000) titles.add("Capital Machine");
  if (numberValue(p.clicks) >= 1000) titles.add("Tap Grinder");
  if (numberValue(p.clicks) >= 10000) titles.add("Tap Legend");

  if (String(role.id || "none") !== "none") {
    titles.add(role.name);
  }

  if (String(cls.id || "none") !== "none") {
    titles.add(cls.name);
  }

  p.titles = [...titles];

  updatePlayer({
    titles: p.titles
  });

  return p.titles;
}

// ======================================================
// START / PATCH
// ======================================================
export function normalizePlayerState() {
  ensurePlayerArrays();

  const p = getPlayer();

  p.balance = numberValue(p.balance || 0);
  p.usd = numberValue(p.usd || 0);
  p.total_earned = numberValue(p.total_earned || 0);
  p.clicks = numberValue(p.clicks || 0);

  if (!p.class) p.class = "none";
  if (!p.role) p.role = "none";

  return p;
}
