import { AppState, updatePlayer } from "./app.js";
import { removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// ======================================================
// LOOT CONFIG
// ======================================================
export const LOOT_BOXES = [
  {
    id: "basic_safe",
    name: "Basic Safe",
    priceUAH: 25000,
    rarityTable: [
      { rarity: "common", weight: 55 },
      { rarity: "rare", weight: 28 },
      { rarity: "epic", weight: 13 },
      { rarity: "legendary", weight: 4 }
    ]
  },
  {
    id: "premium_safe",
    name: "Premium Safe",
    priceUAH: 125000,
    rarityTable: [
      { rarity: "common", weight: 35 },
      { rarity: "rare", weight: 32 },
      { rarity: "epic", weight: 23 },
      { rarity: "legendary", weight: 10 }
    ]
  },
  {
    id: "elite_crate",
    name: "Elite Crate",
    priceUAH: 450000,
    rarityTable: [
      { rarity: "common", weight: 18 },
      { rarity: "rare", weight: 30 },
      { rarity: "epic", weight: 32 },
      { rarity: "legendary", weight: 20 }
    ]
  }
];

export const LOOT_REWARDS = {
  common: [
    { type: "uah", min: 5000, max: 35000, weight: 35, label: "UAH reward" },
    { type: "usd", min: 20, max: 120, weight: 18, label: "USD reward" },
    { type: "crypto", asset: "DOGE", min: 25, max: 250, weight: 12, label: "DOGE pack" },
    { type: "crypto", asset: "ADA", min: 5, max: 30, weight: 10, label: "ADA pack" },
    { type: "item", name: "Basic Prestige Frame", weight: 10, label: "Prestige item" },
    { type: "theme", themeId: "classic_blue", weight: 15, label: "Classic theme" }
  ],

  rare: [
    { type: "uah", min: 30000, max: 120000, weight: 24, label: "UAH reward" },
    { type: "usd", min: 100, max: 500, weight: 18, label: "USD reward" },
    { type: "crypto", asset: "SOL", min: 1, max: 8, weight: 16, label: "SOL pack" },
    { type: "crypto", asset: "ETH", min: 0.01, max: 0.05, weight: 12, label: "ETH pack" },
    { type: "theme", themeId: "black_elite", weight: 10, label: "Black Elite theme" },
    { type: "theme", themeId: "neon_pulse", weight: 8, label: "Neon Pulse theme" },
    { type: "car", name: "BMW 7", value: 1800000, weight: 7, label: "Luxury car" },
    { type: "item", name: "Silver Prestige Frame", weight: 5, label: "Prestige item" }
  ],

  epic: [
    { type: "uah", min: 120000, max: 500000, weight: 20, label: "UAH reward" },
    { type: "usd", min: 500, max: 2500, weight: 16, label: "USD reward" },
    { type: "crypto", asset: "BTC", min: 0.0003, max: 0.0015, weight: 10, label: "BTC pack" },
    { type: "crypto", asset: "ETH", min: 0.05, max: 0.2, weight: 12, label: "ETH pack" },
    { type: "crypto", asset: "SOL", min: 5, max: 25, weight: 10, label: "SOL pack" },
    { type: "theme", themeId: "gold_luxe", weight: 8, label: "Gold Luxe theme" },
    { type: "theme", themeId: "metal_titan", weight: 8, label: "Metal Titan theme" },
    { type: "car", name: "Porsche", value: 4200000, weight: 6, label: "Sport car" },
    { type: "realty", name: "Penthouse", value: 8500000, weight: 5, label: "Realty reward" },
    { type: "item", name: "Gold Prestige Frame", weight: 5, label: "Prestige item" }
  ],

  legendary: [
    { type: "uah", min: 500000, max: 2000000, weight: 16, label: "Huge UAH reward" },
    { type: "usd", min: 2500, max: 10000, weight: 14, label: "Huge USD reward" },
    { type: "crypto", asset: "BTC", min: 0.002, max: 0.01, weight: 12, label: "BTC jackpot" },
    { type: "crypto", asset: "ETH", min: 0.2, max: 1, weight: 12, label: "ETH jackpot" },
    { type: "theme", themeId: "ruby_red", weight: 7, label: "Ruby Red theme" },
    { type: "theme", themeId: "ice_glass", weight: 7, label: "Ice Glass theme" },
    { type: "theme", themeId: "mono_bankish", weight: 7, label: "Mono Dark theme" },
    { type: "car", name: "Ferrari", value: 12000000, weight: 6, label: "Supercar" },
    { type: "car", name: "Lamborghini", value: 14000000, weight: 5, label: "Supercar" },
    { type: "realty", name: "Villa", value: 25000000, weight: 5, label: "Luxury realty" },
    { type: "realty", name: "Private Island", value: 90000000, weight: 3, label: "Ultra reward" },
    { type: "item", name: "Diamond Prestige Crown", weight: 6, label: "Prestige item" }
  ]
};

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

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindLootUI();
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

function nowIso() {
  return new Date().toISOString();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, digits = 6) {
  return Number((Math.random() * (max - min) + min).toFixed(digits));
}

function weightedRandom(items, weightKey = "weight") {
  const total = items.reduce((sum, item) => sum + numberValue(item[weightKey]), 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= numberValue(item[weightKey]);
    if (roll <= 0) return item;
  }

  return items[items.length - 1];
}

function ensureLootData() {
  const p = getPlayer();

  if (!p.loot_profile || typeof p.loot_profile !== "object" || Array.isArray(p.loot_profile)) {
    p.loot_profile = {
      free_boxes: {
        basic_safe: 0,
        premium_safe: 0,
        elite_crate: 0
      },
      opened_total: 0,
      rarity_stats: {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      },
      inventory: []
    };
  }

  if (!safeObject(p.loot_profile.free_boxes)) {
    p.loot_profile.free_boxes = {
      basic_safe: 0,
      premium_safe: 0,
      elite_crate: 0
    };
  }

  if (!safeObject(p.loot_profile.rarity_stats)) {
    p.loot_profile.rarity_stats = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };
  }

  if (!Array.isArray(p.loot_profile.inventory)) {
    p.loot_profile.inventory = [];
  }

  if (!Array.isArray(p.inventory)) {
    p.inventory = [];
  }

  if (!Array.isArray(p.card_themes_owned)) {
    p.card_themes_owned = ["classic_blue"];
  }

  if (!Array.isArray(p.cars)) {
    p.cars = [];
  }

  if (!Array.isArray(p.realty)) {
    p.realty = [];
  }

  if (!p.crypto || typeof p.crypto !== "object" || Array.isArray(p.crypto)) {
    p.crypto = {};
  }
}

function saveLootData() {
  const p = getPlayer();

  updatePlayer({
    loot_profile: p.loot_profile,
    inventory: p.inventory,
    card_themes_owned: p.card_themes_owned,
    cars: p.cars,
    realty: p.realty,
    crypto: p.crypto,
    balance: p.balance,
    usd: p.usd,
    total_earned: p.total_earned
  });
}

function getLootProfile() {
  ensureLootData();
  return getPlayer().loot_profile;
}

function getBoxConfig(boxId) {
  return LOOT_BOXES.find((x) => x.id === boxId) || null;
}

function rollRarity(box) {
  return weightedRandom(box.rarityTable, "weight").rarity;
}

function rollRewardByRarity(rarity) {
  return weightedRandom(LOOT_REWARDS[rarity] || [], "weight");
}

// ======================================================
// REWARD APPLY
// ======================================================
async function applyReward(reward, rarity) {
  ensureLootData();

  const p = getPlayer();
  const loot = getLootProfile();

  let result = {
    rarity,
    type: reward.type,
    label: reward.label || reward.type,
    display: "",
    value: 0
  };

  if (reward.type === "uah") {
    const amount = randomInt(reward.min, reward.max);
    p.balance = numberValue(p.balance) + amount;
    p.total_earned = numberValue(p.total_earned) + amount;

    result.display = `₴ ${formatMoney(amount)}`;
    result.value = amount;
  }

  if (reward.type === "usd") {
    const amount = randomInt(reward.min, reward.max);
    p.usd = numberValue(p.usd) + amount;

    result.display = `$ ${formatMoney(amount)}`;
    result.value = amount;
  }

  if (reward.type === "crypto") {
    const amount = randomFloat(reward.min, reward.max, 6);
    p.crypto[reward.asset] = numberValue(p.crypto[reward.asset] || 0) + amount;

    result.display = `${amount} ${reward.asset}`;
    result.value = amount;
  }

  if (reward.type === "theme") {
    if (!p.card_themes_owned.includes(reward.themeId)) {
      p.card_themes_owned.push(reward.themeId);
    }

    result.display = reward.themeId;
    result.value = 0;
  }

  if (reward.type === "car") {
    p.cars.push({
      name: reward.name,
      value: numberValue(reward.value || 0),
      source: "loot",
      receivedAt: nowIso()
    });

    result.display = reward.name;
    result.value = numberValue(reward.value || 0);
  }

  if (reward.type === "realty") {
    p.realty.push({
      name: reward.name,
      value: numberValue(reward.value || 0),
      source: "loot",
      receivedAt: nowIso()
    });

    result.display = reward.name;
    result.value = numberValue(reward.value || 0);
  }

  if (reward.type === "item") {
    p.inventory.push({
      name: reward.name,
      rarity,
      source: "loot",
      receivedAt: nowIso()
    });

    loot.inventory.push({
      name: reward.name,
      rarity,
      source: "loot",
      receivedAt: nowIso()
    });

    result.display = reward.name;
    result.value = 0;
  }

  loot.opened_total = numberValue(loot.opened_total) + 1;
  loot.rarity_stats[rarity] = numberValue(loot.rarity_stats[rarity] || 0) + 1;

  await saveLootData();
  await apiAddHistory(p.username, `Loot reward: ${result.display || result.label}`, result.type === "uah" ? result.value : 0);

  return result;
}

// ======================================================
// ACTIONS
// ======================================================
export async function openLootBox(boxId, useFree = false) {
  ensureLootData();

  const p = getPlayer();
  const loot = getLootProfile();
  const box = getBoxConfig(boxId);

  if (!box) {
    alert("Кейс не знайдено");
    return null;
  }

  if (useFree) {
    if (numberValue(loot.free_boxes[boxId] || 0) <= 0) {
      alert("Немає безкоштовних кейсів цього типу");
      return null;
    }

    loot.free_boxes[boxId] = numberValue(loot.free_boxes[boxId] || 0) - 1;
  } else {
    const ok = removeBalance(box.priceUAH);
    if (!ok) {
      alert("Недостатньо грошей");
      return null;
    }
  }

  const rarity = rollRarity(box);
  const reward = rollRewardByRarity(rarity);
  const result = await applyReward(reward, rarity);

  await apiAddHistory(
    p.username,
    `Open loot box: ${box.name} (${rarity})`,
    useFree ? 0 : -numberValue(box.priceUAH)
  );

  return {
    boxId,
    boxName: box.name,
    rarity,
    reward: result
  };
}

export async function grantFreeBox(boxId, amount = 1) {
  ensureLootData();

  const loot = getLootProfile();
  loot.free_boxes[boxId] = numberValue(loot.free_boxes[boxId] || 0) + numberValue(amount);

  await saveLootData();
  return true;
}

// ======================================================
// RENDER HELPERS
// ======================================================
function rarityColor(rarity) {
  if (rarity === "common") return "#9fb1c9";
  if (rarity === "rare") return "#5aa0ff";
  if (rarity === "epic") return "#b06cff";
  if (rarity === "legendary") return "#ffb84d";
  return "#ffffff";
}

function summaryCards() {
  const loot = getLootProfile();

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Opened</div>
        <div class="stat-value">${formatCompact(loot.opened_total || 0)}</div>
        <div class="stat-sub">All loot opened</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Common</div>
        <div class="stat-value">${formatCompact(loot.rarity_stats.common || 0)}</div>
        <div class="stat-sub">Common drops</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Epic</div>
        <div class="stat-value blue">${formatCompact(loot.rarity_stats.epic || 0)}</div>
        <div class="stat-sub">Epic drops</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Legendary</div>
        <div class="stat-value orange">${formatCompact(loot.rarity_stats.legendary || 0)}</div>
        <div class="stat-sub">Legendary drops</div>
      </div>
    </div>
  `;
}

function lootBoxCard(box) {
  const loot = getLootProfile();
  const freeCount = numberValue(loot.free_boxes[box.id] || 0);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${box.name}</div>
          <div class="asset-price">₴ ${formatCompact(box.priceUAH)}</div>
        </div>

        <div class="asset-meta">
          <span>Free: ${freeCount}</span>
          <span>Common ${box.rarityTable.find(x => x.rarity === "common")?.weight || 0}%</span>
          <span>Rare ${box.rarityTable.find(x => x.rarity === "rare")?.weight || 0}%</span>
          <span>Epic ${box.rarityTable.find(x => x.rarity === "epic")?.weight || 0}%</span>
          <span>Legendary ${box.rarityTable.find(x => x.rarity === "legendary")?.weight || 0}%</span>
        </div>

        <div class="asset-actions" style="margin-top:14px;">
          <button data-open-loot="${box.id}">Open for ₴ ${formatCompact(box.priceUAH)}</button>
          <button class="secondary" data-open-free-loot="${box.id}" ${freeCount <= 0 ? "disabled" : ""}>
            Open Free
          </button>
        </div>
      </div>
    </div>
  `;
}

function lootInventoryCard(item) {
  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${item.name || "Unknown item"}</div>
          <div class="asset-price" style="color:${rarityColor(item.rarity)};">${item.rarity || "common"}</div>
        </div>

        <div class="asset-meta">
          <span>${item.source || "loot"}</span>
          <span>${item.receivedAt ? new Date(item.receivedAt).toLocaleString() : "—"}</span>
        </div>
      </div>
    </div>
  `;
}

function rewardPreviewPanel() {
  return `
    <div class="card">
      <h3>Possible Rewards</h3>
      <div class="titles-list">
        <div class="title-pill">UAH</div>
        <div class="title-pill">USD</div>
        <div class="title-pill">Crypto</div>
        <div class="title-pill">Card themes</div>
        <div class="title-pill">Cars</div>
        <div class="title-pill">Realty</div>
        <div class="title-pill">Prestige items</div>
      </div>
    </div>
  `;
}

// ======================================================
// MAIN PAGE
// ======================================================
export function renderLootPage() {
  ensureLootData();
  document.body.dataset.currentPage = "loot";

  const loot = getLootProfile();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Loot & Safes</h2>
      <p>Відкривай сейфи, вибивай валюту, крипту, машини, нерухомість, карткові теми та престижні предмети.</p>
    </div>

    ${summaryCards()}

    <div class="section-title">Available Loot Boxes</div>
    <div class="asset-grid">
      ${LOOT_BOXES.map(lootBoxCard).join("")}
    </div>

    <div class="section-title">Reward Types</div>
    <div class="asset-grid">
      ${rewardPreviewPanel()}
    </div>

    <div class="section-title">Loot Inventory</div>
    <div class="asset-grid">
      ${
        loot.inventory.length
          ? loot.inventory.map(lootInventoryCard).join("")
          : `
            <div class="card" style="grid-column:1 / -1;">
              <h3>Empty Inventory</h3>
              <p>Відкрий перший сейф, щоб отримати предмети.</p>
            </div>
          `
      }
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindLootUI() {
  document.querySelectorAll("[data-open-loot]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const boxId = btn.getAttribute("data-open-loot");
      const result = await openLootBox(boxId, false);

      if (result) {
        alert(`Drop: ${result.reward.display || result.reward.label} [${result.rarity}]`);
        renderLootPage();
      }
    });
  });

  document.querySelectorAll("[data-open-free-loot]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const boxId = btn.getAttribute("data-open-free-loot");
      const result = await openLootBox(boxId, true);

      if (result) {
        alert(`Free Drop: ${result.reward.display || result.reward.label} [${result.rarity}]`);
        renderLootPage();
      }
    });
  });
}
