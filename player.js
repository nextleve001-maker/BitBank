import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";

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

// =====================
// BALANCE
// =====================
export function addBalance(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  p.balance = numberValue(p.balance) + value;
  p.total_earned = numberValue(p.total_earned) + value;

  updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned
  });

  apiAddHistory(p.username, "Earn", value);
}

export function removeBalance(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (numberValue(p.balance) < value) {
    return false;
  }

  p.balance = numberValue(p.balance) - value;

  updatePlayer({
    balance: p.balance
  });

  apiAddHistory(p.username, "Spend", -value);
  return true;
}

// =====================
// USD
// =====================
export function addUSD(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  p.usd = numberValue(p.usd) + value;

  updatePlayer({
    usd: p.usd
  });

  apiAddHistory(p.username, "USD earn", value);
}

export function removeUSD(amount) {
  const p = getPlayer();
  const value = numberValue(amount);

  if (numberValue(p.usd) < value) {
    return false;
  }

  p.usd = numberValue(p.usd) - value;

  updatePlayer({
    usd: p.usd
  });

  apiAddHistory(p.username, "USD spend", -value);
  return true;
}

// =====================
// CLICK INCOME
// =====================
export function getClickValue() {
  const p = getPlayer();
  const cls = p.class || p.status || "none";

  if (cls === "basic") return 15;
  if (cls === "medium") return 50;
  if (cls === "vip") return 200;
  if (cls === "creator") return 500;

  return 5;
}

export function handleClick() {
  const reward = getClickValue();
  addBalance(reward);
}

// =====================
// INVENTORY
// =====================
export function getInventory() {
  const p = getPlayer();
  return safeArray(p.inventory);
}

export function addItem(item) {
  const p = getPlayer();
  const inventory = safeArray(p.inventory);

  inventory.push(item);
  p.inventory = inventory;

  updatePlayer({
    inventory: p.inventory
  });
}

export function removeItem(index) {
  const p = getPlayer();
  const inventory = safeArray(p.inventory);

  if (!inventory[index]) return false;

  inventory.splice(index, 1);
  p.inventory = inventory;

  updatePlayer({
    inventory: p.inventory
  });

  return true;
}

// =====================
// FRIENDS
// =====================
export function getFriendsList() {
  const p = getPlayer();
  return safeArray(p.friends);
}

export function addFriend(id) {
  const p = getPlayer();
  const friends = safeArray(p.friends);

  if (!friends.includes(id)) {
    friends.push(id);
    p.friends = friends;

    updatePlayer({
      friends: p.friends
    });
  }
}

export function removeFriend(id) {
  const p = getPlayer();
  const friends = safeArray(p.friends).filter((x) => x !== id);

  p.friends = friends;

  updatePlayer({
    friends: p.friends
  });
}

// =====================
// CLASS / STATUS
// =====================
export function setClass(nextClass) {
  const p = getPlayer();

  p.class = nextClass;

  updatePlayer({
    class: nextClass
  });

  apiAddHistory(p.username, `Class set: ${nextClass}`, 0);
}

// =====================
// CRYPTO / STOCK HELPERS
// =====================
export function getCryptoWallet() {
  const p = getPlayer();
  return safeObject(p.crypto);
}

export function getStocksWallet() {
  const p = getPlayer();
  return safeObject(p.stocks);
}

export function setCryptoWallet(wallet) {
  const p = getPlayer();

  p.crypto = safeObject(wallet);

  updatePlayer({
    crypto: p.crypto
  });
}

export function setStocksWallet(wallet) {
  const p = getPlayer();

  p.stocks = safeObject(wallet);

  updatePlayer({
    stocks: p.stocks
  });
}

// =====================
// CARD HELPERS
// =====================
export function setCardName(cardName) {
  const p = getPlayer();

  p.card_name = cardName;

  updatePlayer({
    card_name: cardName
  });
}

export function setCardColor(cardColor) {
  const p = getPlayer();

  p.card_color = cardColor;

  updatePlayer({
    card_color: cardColor
  });
}

export function setCardCVV(cardCVV) {
  const p = getPlayer();

  p.card_cvv = cardCVV;

  updatePlayer({
    card_cvv: cardCVV
  });
}

// =====================
// SAVE FULL PLAYER
// =====================
export function saveFullPlayer() {
  const p = getPlayer();

  updatePlayer({
    username: p.username,
    password: p.password,
    class: p.class,
    balance: p.balance,
    usd: p.usd,
    total_earned: p.total_earned,
    card_name: p.card_name,
    card_color: p.card_color,
    card_cvv: p.card_cvv,
    card_number: p.card_number,
    card_expiry: p.card_expiry,
    device: p.device,
    banned: p.banned,
    last_seen: p.last_seen,
    crypto: p.crypto,
    stocks: p.stocks,
    businesses: p.businesses,
    business_levels: p.business_levels,
    realty: p.realty,
    cars: p.cars,
    inventory: p.inventory,
    titles: p.titles,
    friends: p.friends,
    achievements: p.achievements,
    completed_quests: p.completed_quests,
    bank: p.bank,
    loan: p.loan,
    insurance: p.insurance
  });
}
