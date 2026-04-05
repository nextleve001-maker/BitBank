import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";

// ======================================================
// COLLECTION CONFIG
// ======================================================
export const COLLECTIONS = [
  {
    id: "sport_cars_set",
    name: "Sport Cars Set",
    category: "cars",
    description: "Збери 5 різних спорткарів для постійного бонусу до престижу і кліку.",
    items: ["ferrari", "lamborghini", "mclaren", "porsche911", "nissan_gtr"],
    reward: {
      type: "passive_bonus",
      value: 0.03,
      label: "+3% passive income"
    }
  },

  {
    id: "luxury_cars_set",
    name: "Luxury Cars Set",
    category: "cars",
    description: "Збери люксовий автосет для бонусу до статусу й багатого вигляду профілю.",
    items: ["rolls_royce", "bentley", "mercedes_maybach", "range_rover", "bmw7"],
    reward: {
      type: "click_bonus",
      value: 8,
      label: "+8 click income"
    }
  },

  {
    id: "property_empire_set",
    name: "Property Empire",
    category: "realty",
    description: "Збери дорогі об'єкти нерухомості, щоб отримати бонус до фінансової стабільності.",
    items: ["city_apartment", "villa", "penthouse", "office_tower", "private_island"],
    reward: {
      type: "maintenance_discount",
      value: 0.12,
      label: "-12% maintenance"
    }
  },

  {
    id: "card_elite_set",
    name: "Elite Cards Set",
    category: "cards",
    description: "Збери преміальні дизайни карток, щоб отримати додатковий престиж.",
    items: ["black_elite", "gold_luxe", "neon_pulse", "metal_titan", "mono_bankish"],
    reward: {
      type: "prestige_bonus",
      value: 5,
      label: "+5 prestige"
    }
  },

  {
    id: "banking_collection",
    name: "Banking Collection",
    category: "mixed",
    description: "Фінансовий сет: банк, преміальна картка, банкір і великий баланс.",
    items: ["private_bank_project", "gold_luxe", "banker_role", "cash_10m"],
    reward: {
      type: "deposit_bonus",
      value: 0.01,
      label: "+1% deposit rate"
    }
  },

  {
    id: "sports_empire_set",
    name: "Sports Empire",
    category: "mixed",
    description: "Футбольний клуб + спортивні активи + спортивна роль.",
    items: ["football_club_project", "sports_manager_role", "gym_project"],
    reward: {
      type: "business_bonus",
      value: 0.05,
      label: "+5% sports/business income"
    }
  }
];

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
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
  bindCollectionsUI();
}

function ensureCollectionsData() {
  const p = getPlayer();

  if (!p.collection_rewards || typeof p.collection_rewards !== "object" || Array.isArray(p.collection_rewards)) {
    p.collection_rewards = {};
  }

  if (!p.collection_stats || typeof p.collection_stats !== "object" || Array.isArray(p.collection_stats)) {
    p.collection_stats = {
      completed_count: 0,
      total_prestige_from_collections: 0
    };
  }
}

function saveCollectionsData() {
  const p = getPlayer();

  updatePlayer({
    collection_rewards: p.collection_rewards,
    collection_stats: p.collection_stats
  });
}

function normalizeString(v) {
  return String(v || "").trim().toLowerCase();
}

function normalizeOwnedList(list) {
  return safeArray(list).map((item) => {
    if (typeof item === "string") {
      return normalizeString(item);
    }

    if (typeof item === "object" && item !== null) {
      return normalizeString(item.id || item.name || item.label);
    }

    return "";
  }).filter(Boolean);
}

function getOwnedCars() {
  return normalizeOwnedList(getPlayer().cars);
}

function getOwnedRealty() {
  return normalizeOwnedList(getPlayer().realty);
}

function getOwnedCardThemes() {
  return normalizeOwnedList(getPlayer().card_themes_owned);
}

function getBusinessProjects() {
  const map = safeObject(getPlayer().business_projects);
  return Object.keys(map).filter((id) => map[id]?.unlocked).map(normalizeString);
}

function getCurrentRoleId() {
  return normalizeString(getPlayer().role || "none");
}

function playerHasCash10m() {
  return numberValue(getPlayer().balance || 0) >= 10000000;
}

// ======================================================
// OWNERSHIP CHECK
// ======================================================
function hasCollectionItem(itemId) {
  const id = normalizeString(itemId);

  if (getOwnedCars().includes(id)) return true;
  if (getOwnedRealty().includes(id)) return true;
  if (getOwnedCardThemes().includes(id)) return true;
  if (getBusinessProjects().includes(id.replace("_project", ""))) return true;

  if (id === "banker_role" && getCurrentRoleId() === "banker") return true;
  if (id === "sports_manager_role" && getCurrentRoleId() === "sports_manager") return true;
  if (id === "cash_10m" && playerHasCash10m()) return true;

  if (id === "private_bank_project" && getBusinessProjects().includes("private_bank")) return true;
  if (id === "football_club_project" && getBusinessProjects().includes("football_club")) return true;
  if (id === "gym_project" && getBusinessProjects().includes("gym")) return true;

  return false;
}

function collectionProgress(collection) {
  const ownedCount = collection.items.filter(hasCollectionItem).length;
  const total = collection.items.length;
  const completed = ownedCount >= total;

  return {
    ownedCount,
    total,
    completed,
    percent: Math.floor((ownedCount / total) * 100)
  };
}

// ======================================================
// REWARD SYSTEM
// ======================================================
function rewardAlreadyClaimed(collectionId) {
  ensureCollectionsData();
  return !!getPlayer().collection_rewards[collectionId];
}

function claimableCollections() {
  return COLLECTIONS.filter((collection) => {
    const progress = collectionProgress(collection);
    return progress.completed && !rewardAlreadyClaimed(collection.id);
  });
}

export async function claimCollectionReward(collectionId) {
  ensureCollectionsData();

  const p = getPlayer();
  const collection = COLLECTIONS.find((x) => x.id === collectionId);

  if (!collection) {
    alert("Колекцію не знайдено");
    return false;
  }

  const progress = collectionProgress(collection);

  if (!progress.completed) {
    alert("Колекція ще не зібрана");
    return false;
  }

  if (rewardAlreadyClaimed(collectionId)) {
    alert("Нагорода вже отримана");
    return false;
  }

  p.collection_rewards[collectionId] = {
    claimedAt: new Date().toISOString(),
    reward: collection.reward
  };

  p.collection_stats.completed_count = numberValue(p.collection_stats.completed_count) + 1;

  if (collection.reward.type === "prestige_bonus") {
    p.collection_stats.total_prestige_from_collections =
      numberValue(p.collection_stats.total_prestige_from_collections) + numberValue(collection.reward.value);
  }

  saveCollectionsData();

  await apiAddHistory(p.username, `Claim collection reward: ${collection.name}`, 0);
  return true;
}

// ======================================================
// GLOBAL BONUS EXPORTS
// ======================================================
function claimedRewardValueByType(type) {
  ensureCollectionsData();

  let total = 0;

  Object.values(getPlayer().collection_rewards).forEach((entry) => {
    if (!entry?.reward) return;
    if (entry.reward.type === type) {
      total += numberValue(entry.reward.value || 0);
    }
  });

  return total;
}

export function getCollectionPassiveBonus() {
  return claimedRewardValueByType("passive_bonus");
}

export function getCollectionClickBonus() {
  return claimedRewardValueByType("click_bonus");
}

export function getCollectionMaintenanceDiscount() {
  return claimedRewardValueByType("maintenance_discount");
}

export function getCollectionPrestigeBonus() {
  return claimedRewardValueByType("prestige_bonus");
}

export function getCollectionDepositBonus() {
  return claimedRewardValueByType("deposit_bonus");
}

export function getCollectionBusinessBonus() {
  return claimedRewardValueByType("business_bonus");
}

// ======================================================
// RENDER HELPERS
// ======================================================
function progressBar(percent) {
  const safePercent = Math.max(0, Math.min(100, numberValue(percent)));

  return `
    <div style="margin-top:8px;">
      <div style="height:8px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;">
        <div style="width:${safePercent}%;height:100%;background:linear-gradient(90deg,#8ec5ff,#8ff5db);border-radius:999px;"></div>
      </div>
    </div>
  `;
}

function rewardLabel(reward) {
  if (!reward) return "No reward";

  switch (reward.type) {
    case "passive_bonus":
      return `+${Math.floor(numberValue(reward.value) * 100)}% passive income`;
    case "click_bonus":
      return `+${numberValue(reward.value)} click income`;
    case "maintenance_discount":
      return `-${Math.floor(numberValue(reward.value) * 100)}% maintenance`;
    case "prestige_bonus":
      return `+${numberValue(reward.value)} prestige`;
    case "deposit_bonus":
      return `+${(numberValue(reward.value) * 100).toFixed(2)}% deposit rate`;
    case "business_bonus":
      return `+${Math.floor(numberValue(reward.value) * 100)}% business income`;
    default:
      return reward.label || "Reward";
  }
}

function itemPill(itemId) {
  const owned = hasCollectionItem(itemId);

  return `
    <div class="title-pill" style="border-color:${owned ? "rgba(52,210,123,.35)" : "rgba(255,255,255,.08)"};background:${owned ? "rgba(52,210,123,.12)" : "rgba(255,255,255,.04)"};">
      ${owned ? "✅" : "⬜"} ${itemId}
    </div>
  `;
}

function collectionCard
