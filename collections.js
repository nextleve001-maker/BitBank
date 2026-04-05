import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";

// ======================================================
// COLLECTION CONFIG
// ======================================================
export const COLLECTIONS = [
  {
    id: "cars_sport_set",
    name: "Sport Car Set",
    category: "cars",
    description: "Збери спортивний автопарк і отримай постійний бонус до престижу та доходу.",
    requiredItems: [
      "Ferrari",
      "Lamborghini",
      "Porsche",
      "McLaren",
      "Bugatti"
    ],
    reward: {
      type: "passive_boost",
      value: 0.04,
      label: "+4% passive income"
    }
  },

  {
    id: "cars_luxury_set",
    name: "Luxury Car Set",
    category: "cars",
    description: "Колекція преміальних авто для дорожчого профілю.",
    requiredItems: [
      "Rolls-Royce",
      "Bentley",
      "Maybach",
      "Mercedes S-Class",
      "BMW 7"
    ],
    reward: {
      type: "prestige",
      value: 3,
      label: "+3 prestige"
    }
  },

  {
    id: "realty_city_set",
    name: "City Property Set",
    category: "realty",
    description: "Збери повний набір міської нерухомості.",
    requiredItems: [
      "Apartment",
      "Penthouse",
      "Office",
      "Shopping Mall"
    ],
    reward: {
      type: "business_boost",
      value: 0.05,
      label: "+5% business income"
    }
  },

  {
    id: "realty_luxury_set",
    name: "Luxury Estate Set",
    category: "realty",
    description: "Елітна нерухомість для сильного бусту капіталу.",
    requiredItems: [
      "Villa",
      "Mansion",
      "Private Island",
      "Sky Palace"
    ],
    reward: {
      type: "tax_discount",
      value: 0.08,
      label: "-8% passive tax"
    }
  },

  {
    id: "cards_premium_set",
    name: "Premium Card Set",
    category: "cards",
    description: "Збери преміальні карткові дизайни.",
    requiredItems: [
      "black_elite",
      "gold_luxe",
      "neon_pulse",
      "metal_titan"
    ],
    reward: {
      type: "click_boost",
      value: 5,
      label: "+5 click bonus"
    }
  },

  {
    id: "cards_elite_set",
    name: "Elite Card Set",
    category: "cards",
    description: "Повний колекційний набір топових карткових стилів.",
    requiredItems: [
      "ruby_red",
      "ice_glass",
      "mono_bankish"
    ],
    reward: {
      type: "prestige",
      value: 4,
      label: "+4 prestige"
    }
  },

  {
    id: "roles_finance_set",
    name: "Finance Paths Set",
    category: "roles",
    description: "Відкрий основні фінансові ролі.",
    requiredItems: [
      "trader",
      "banker",
      "entrepreneur"
    ],
    reward: {
      type: "market_boost",
      value: 0.04,
      label: "+4% market power"
    }
  },

  {
    id: "roles_master_set",
    name: "Master Roles Set",
    category: "roles",
    description: "Збери набір спеціалізованих ролей.",
    requiredItems: [
      "sports_manager",
      "media_mogul",
      "high_roller"
    ],
    reward: {
      type: "lottery_luck",
      value: 0.03,
      label: "+3% lottery luck"
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

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindCollectionsUI();
}

function ensureCollectionsData() {
  const p = getPlayer();

  if (!p.collections_state || typeof p.collections_state !== "object" || Array.isArray(p.collections_state)) {
    p.collections_state = {
      claimed: {},
      completed_at: {}
    };
  }

  if (!safeObject(p.collections_state.claimed)) {
    p.collections_state.claimed = {};
  }

  if (!safeObject(p.collections_state.completed_at)) {
    p.collections_state.completed_at = {};
  }
}

function saveCollectionsData() {
  updatePlayer({
    collections_state: getPlayer().collections_state
  });
}

function getCollectionsState() {
  ensureCollectionsData();
  return getPlayer().collections_state;
}

function getCarsOwnedNames() {
  const cars = safeArray(getPlayer().cars);

  return cars.map((car) => {
    if (typeof car === "string") return car;
    if (car && typeof car === "object") return car.name || car.title || car.model || "";
    return "";
  }).filter(Boolean);
}

function getRealtyOwnedNames() {
  const realty = safeArray(getPlayer().realty);

  return realty.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") return item.name || item.title || item.type || "";
    return "";
  }).filter(Boolean);
}

function getOwnedCardThemes() {
  return safeArray(getPlayer().card_themes_owned);
}

function getOwnedRoles() {
  const currentRole = String(getPlayer().role || "none");
  const roleStats = safeObject(getPlayer().role_stats);
  const unlocked = safeArray(roleStats.unlocked_roles);

  const all = new Set(unlocked);
  if (currentRole && currentRole !== "none") {
    all.add(currentRole);
  }

  return [...all];
}

function getOwnedItemsByCategory(category) {
  if (category === "cars") return getCarsOwnedNames();
  if (category === "realty") return getRealtyOwnedNames();
  if (category === "cards") return getOwnedCardThemes();
  if (category === "roles") return getOwnedRoles();

  return [];
}

function collectionProgress(collection) {
  const owned = getOwnedItemsByCategory(collection.category);
  const current = collection.requiredItems.filter((item) => owned.includes(item));

  return {
    currentCount: current.length,
    totalCount: collection.requiredItems.length,
    ownedItems: current,
    missingItems: collection.requiredItems.filter((item) => !owned.includes(item)),
    completed: current.length === collection.requiredItems.length
  };
}

function progressPercent(collection) {
  const pg = collectionProgress(collection);
  return Math.max(0, Math.min(100, (pg.currentCount / Math.max(1, pg.totalCount)) * 100));
}

function isRewardClaimed(collectionId) {
  ensureCollectionsData();
  return !!getCollectionsState().claimed[collectionId];
}

// ======================================================
// REWARD SYSTEM
// ======================================================
export function getCollectionBonuses() {
  ensureCollectionsData();

  const state = getCollectionsState();

  const total = {
    passive_boost: 0,
    business_boost: 0,
    market_boost: 0,
    tax_discount: 0,
    click_boost: 0,
    prestige: 0,
    lottery_luck: 0
  };

  COLLECTIONS.forEach((collection) => {
    if (!state.claimed[collection.id]) return;

    const reward = collection.reward;
    if (!reward) return;

    if (reward.type === "passive_boost") total.passive_boost += numberValue(reward.value);
    if (reward.type === "business_boost") total.business_boost += numberValue(reward.value);
    if (reward.type === "market_boost") total.market_boost += numberValue(reward.value);
    if (reward.type === "tax_discount") total.tax_discount += numberValue(reward.value);
    if (reward.type === "click_boost") total.click_boost += numberValue(reward.value);
    if (reward.type === "prestige") total.prestige += numberValue(reward.value);
    if (reward.type === "lottery_luck") total.lottery_luck += numberValue(reward.value);
  });

  return total;
}

export async function claimCollectionReward(collectionId) {
  ensureCollectionsData();

  const p = getPlayer();
  const state = getCollectionsState();
  const collection = COLLECTIONS.find((x) => x.id === collectionId);

  if (!collection) {
    alert("Колекцію не знайдено");
    return false;
  }

  const progress = collectionProgress(collection);

  if (!progress.completed) {
    alert("Колекція ще не завершена");
    return false;
  }

  if (state.claimed[collectionId]) {
    alert("Нагороду вже отримано");
    return false;
  }

  state.claimed[collectionId] = true;
  state.completed_at[collectionId] = new Date().toISOString();

  saveCollectionsData();

  await apiAddHistory(p.username, `Claim collection reward: ${collection.name}`, 0);
  return true;
}

// ======================================================
// UI HELPERS
// ======================================================
function rewardBadge(reward) {
  return `
    <div class="title-pill">${reward.label}</div>
  `;
}

function requiredItemTag(item, owned) {
  return `
    <div class="title-pill" style="${owned ? "border-color:rgba(52,210,123,.35);background:rgba(52,210,123,.12);" : ""}">
      ${owned ? "✅" : "⬜"} ${item}
    </div>
  `;
}

function collectionCard(collection) {
  const progress = collectionProgress(collection);
  const claimed = isRewardClaimed(collection.id);
  const percent = progressPercent(collection);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${collection.name}</div>
          <div class="asset-price">${progress.currentCount}/${progress.totalCount}</div>
        </div>

        <div class="asset-meta">
          <span>${collection.category}</span>
          <span>${progress.completed ? "Complete" : "In progress"}</span>
          <span>${claimed ? "Reward claimed" : "Reward not claimed"}</span>
        </div>

        <p>${collection.description}</p>

        <div style="margin-top:10px;">
          <div class="muted" style="font-size:13px;margin-bottom:6px;">Progress: ${Math.floor(percent)}%</div>
          <div style="height:9px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;">
            <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#8ec5ff,#8ff5db);border-radius:999px;"></div>
          </div>
        </div>

        <div style="margin-top:14px;">
          <div class="muted" style="margin-bottom:8px;">Required items</div>
          <div class="titles-list">
            ${collection.requiredItems.map((item) => requiredItemTag(item, progress.ownedItems.includes(item))).join("")}
          </div>
        </div>

        <div style="margin-top:14px;">
          <div class="muted" style="margin-bottom:8px;">Reward</div>
          <div class="titles-list">
            ${rewardBadge(collection.reward)}
          </div>
        </div>

        <div class="profile-actions" style="margin-top:14px;">
          <button
            data-claim-collection="${collection.id}"
            ${!progress.completed || claimed ? "disabled" : ""}
          >
            ${claimed ? "Reward Claimed" : progress.completed ? "Claim Reward" : "Complete Collection"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function collectionSummary() {
  const completed = COLLECTIONS.filter((c) => collectionProgress(c).completed).length;
  const claimed = COLLECTIONS.filter((c) => isRewardClaimed(c.id)).length;
  const bonuses = getCollectionBonuses();

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Completed</div>
        <div class="stat-value green">${completed}</div>
        <div class="stat-sub">Finished sets</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Claimed</div>
        <div class="stat-value blue">${claimed}</div>
        <div class="stat-sub">Rewards taken</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Prestige Bonus</div>
        <div class="stat-value">${numberValue(bonuses.prestige)}</div>
        <div class="stat-sub">From collections</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Click Bonus</div>
        <div class="stat-value orange">+${numberValue(bonuses.click_boost)}</div>
        <div class="stat-sub">Collection boost</div>
      </div>
    </div>
  `;
}

function bonusesPanel() {
  const bonuses = getCollectionBonuses();

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Passive Boost</div>
        <div class="stat-value green">+${Math.floor(numberValue(bonuses.passive_boost) * 100)}%</div>
        <div class="stat-sub">From sets</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Business Boost</div>
        <div class="stat-value blue">+${Math.floor(numberValue(bonuses.business_boost) * 100)}%</div>
        <div class="stat-sub">Business collections</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Market Boost</div>
        <div class="stat-value">+${Math.floor(numberValue(bonuses.market_boost) * 100)}%</div>
        <div class="stat-sub">Role collections</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Tax Discount</div>
        <div class="stat-value orange">-${Math.floor(numberValue(bonuses.tax_discount) * 100)}%</div>
        <div class="stat-sub">Luxury realty reward</div>
      </div>
    </div>

    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);margin-top:16px;">
      <div class="card stat-card">
        <div class="stat-label">Lottery Luck</div>
        <div class="stat-value">${Math.floor(numberValue(bonuses.lottery_luck) * 100)}%</div>
        <div class="stat-sub">Master roles set</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Click Boost</div>
        <div class="stat-value blue">+${numberValue(bonuses.click_boost)}</div>
        <div class="stat-sub">Card sets</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Prestige</div>
        <div class="stat-value green">+${numberValue(bonuses.prestige)}</div>
        <div class="stat-sub">Luxury rewards</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Collections</div>
        <div class="stat-value">${COLLECTIONS.length}</div>
        <div class="stat-sub">Total available sets</div>
      </div>
    </div>
  `;
}

// ======================================================
// MAIN PAGE
// ======================================================
export function renderCollectionsPage() {
  ensureCollectionsData();
  document.body.dataset.currentPage = "collections";

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Collections</h2>
      <p>Збирай машини, нерухомість, карткові дизайни та ролі, щоб відкривати постійні бонуси для профілю і економіки.</p>
    </div>

    ${collectionSummary()}

    <div class="section-title">Collection Bonuses</div>
    ${bonusesPanel()}

    <div class="section-title">Available Collections</div>
    <div class="asset-grid">
      ${COLLECTIONS.map(collectionCard).join("")}
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindCollectionsUI() {
  document.querySelectorAll("[data-claim-collection]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-claim-collection");
      const ok = await claimCollectionReward(id);
      if (ok) {
        renderCollectionsPage();
      }
    });
  });
}
