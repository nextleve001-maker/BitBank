import { AppState, updatePlayer } from "./app.js";
import { addBalance, removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// =====================
// BUSINESS DATA
// =====================
export const BUSINESSES = [
  {
    id: 1,
    name: "Coffee Corner",
    category: "Food",
    price: 500,
    income: 6,
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    name: "Street Burger",
    category: "Food",
    price: 2500,
    income: 22,
    img: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    name: "Fitness Club",
    category: "Sport",
    price: 12000,
    income: 85,
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    name: "Auto Service",
    category: "Auto",
    price: 35000,
    income: 210,
    img: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    name: "Restaurant Lounge",
    category: "Food",
    price: 90000,
    income: 520,
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    name: "Boutique Hotel",
    category: "Travel",
    price: 300000,
    income: 1500,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    name: "Media Studio",
    category: "Media",
    price: 750000,
    income: 4200,
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    name: "IT Agency",
    category: "Tech",
    price: 1800000,
    income: 11000,
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 9,
    name: "Logistics Hub",
    category: "Logistics",
    price: 5000000,
    income: 28000,
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 10,
    name: "Private Bank",
    category: "Finance",
    price: 15000000,
    income: 90000,
    img: "https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 11,
    name: "Luxury Mall",
    category: "Retail",
    price: 42000000,
    income: 220000,
    img: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 12,
    name: "Biotech Lab",
    category: "Science",
    price: 90000000,
    income: 480000,
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 13,
    name: "Aviation Group",
    category: "Travel",
    price: 250000000,
    income: 1200000,
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 14,
    name: "Energy Company",
    category: "Energy",
    price: 700000000,
    income: 3200000,
    img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 15,
    name: "Cloud Empire",
    category: "Tech",
    price: 1800000000,
    income: 7800000,
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 16,
    name: "Quantum Systems",
    category: "Science",
    price: 4500000000,
    income: 18000000,
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 17,
    name: "Space Port",
    category: "Space",
    price: 12000000000,
    income: 45000000,
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 18,
    name: "Interstellar Mining",
    category: "Space",
    price: 35000000000,
    income: 120000000,
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 19,
    name: "Neural Network Holdings",
    category: "AI",
    price: 90000000000,
    income: 300000000,
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 20,
    name: "Cosmic Financial Union",
    category: "Finance",
    price: 250000000000,
    income: 800000000,
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
  }
];

// =====================
// CLASS SYSTEM (10)
// =====================
export const PLAYER_CLASSES = [
  {
    id: "none",
    name: "Starter",
    price: 0,
    clickBonus: 0,
    passiveBoost: 0,
    marketDiscount: 0,
    transferDiscount: 0,
    vipLabel: "Base account",
    perks: [
      "Basic profile",
      "Standard market access",
      "No extra boosts"
    ]
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 5000,
    clickBonus: 2,
    passiveBoost: 0.03,
    marketDiscount: 0.00,
    transferDiscount: 0.00,
    vipLabel: "Early investor",
    perks: [
      "+2 click income",
      "+3% passive income",
      "Bronze account style"
    ]
  },
  {
    id: "silver",
    name: "Silver",
    price: 25000,
    clickBonus: 5,
    passiveBoost: 0.06,
    marketDiscount: 0.01,
    transferDiscount: 0.00,
    vipLabel: "Growing capital",
    perks: [
      "+5 click income",
      "+6% passive income",
      "1% market discount"
    ]
  },
  {
    id: "gold",
    name: "Gold",
    price: 100000,
    clickBonus: 10,
    passiveBoost: 0.10,
    marketDiscount: 0.02,
    transferDiscount: 0.01,
    vipLabel: "Premium client",
    perks: [
      "+10 click income",
      "+10% passive income",
      "2% market discount",
      "1% transfer discount"
    ]
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 350000,
    clickBonus: 20,
    passiveBoost: 0.15,
    marketDiscount: 0.03,
    transferDiscount: 0.01,
    vipLabel: "Elite client",
    perks: [
      "+20 click income",
      "+15% passive income",
      "3% market discount",
      "Premium bank look"
    ]
  },
  {
    id: "diamond",
    name: "Diamond",
    price: 1200000,
    clickBonus: 35,
    passiveBoost: 0.22,
    marketDiscount: 0.04,
    transferDiscount: 0.02,
    vipLabel: "Wealth tier",
    perks: [
      "+35 click income",
      "+22% passive income",
      "4% market discount",
      "2% transfer discount"
    ]
  },
  {
    id: "black",
    name: "Black",
    price: 5000000,
    clickBonus: 60,
    passiveBoost: 0.30,
    marketDiscount: 0.05,
    transferDiscount: 0.02,
    vipLabel: "Black banking",
    perks: [
      "+60 click income",
      "+30% passive income",
      "5% market discount",
      "Black card prestige"
    ]
  },
  {
    id: "vip",
    name: "VIP",
    price: 15000000,
    clickBonus: 100,
    passiveBoost: 0.40,
    marketDiscount: 0.06,
    transferDiscount: 0.03,
    vipLabel: "VIP wealth",
    perks: [
      "+100 click income",
      "+40% passive income",
      "6% market discount",
      "3% transfer discount",
      "VIP account aura"
    ]
  },
  {
    id: "legend",
    name: "Legend",
    price: 75000000,
    clickBonus: 180,
    passiveBoost: 0.55,
    marketDiscount: 0.08,
    transferDiscount: 0.04,
    vipLabel: "Legend investor",
    perks: [
      "+180 click income",
      "+55% passive income",
      "8% market discount",
      "4% transfer discount"
    ]
  },
  {
    id: "creator",
    name: "Creator",
    price: 250000000,
    clickBonus: 300,
    passiveBoost: 0.75,
    marketDiscount: 0.10,
    transferDiscount: 0.05,
    vipLabel: "Absolute tier",
    perks: [
      "+300 click income",
      "+75% passive income",
      "10% market discount",
      "5% transfer discount",
      "Top prestige class"
    ]
  }
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

function getOwnedBusinesses() {
  return safeArray(getPlayer().businesses);
}

function getBusinessLevels() {
  return safeObject(getPlayer().business_levels);
}

export function getCurrentClassConfig() {
  const cls = getPlayer().class || "none";
  return PLAYER_CLASSES.find((x) => x.id === cls) || PLAYER_CLASSES[0];
}

export function getClassById(id) {
  return PLAYER_CLASSES.find((x) => x.id === id) || null;
}

// =====================
// BUSINESS BUY / UPGRADE
// =====================
export function buyBusiness(id) {
  const p = getPlayer();
  const b = BUSINESSES.find((x) => x.id === id);

  if (!b) return false;

  if (!Array.isArray(p.businesses)) {
    p.businesses = [];
  }

  if (!removeBalance(b.price)) {
    alert("Not enough money");
    return false;
  }

  p.businesses.push(id);

  updatePlayer({
    businesses: p.businesses
  });

  apiAddHistory(p.username, `Buy business: ${b.name}`, -b.price);
  return true;
}

export function upgradeBusiness(id) {
  const p = getPlayer();

  if (!p.business_levels || typeof p.business_levels !== "object" || Array.isArray(p.business_levels)) {
    p.business_levels = {};
  }

  const currentLevel = numberValue(p.business_levels[id] || 1);
  const upgradeCost = Math.floor(currentLevel * 1500);

  if (!removeBalance(upgradeCost)) {
    alert("Not enough money");
    return false;
  }

  p.business_levels[id] = currentLevel + 1;

  updatePlayer({
    business_levels: p.business_levels
  });

  apiAddHistory(p.username, `Upgrade business ${id}`, -upgradeCost);
  return true;
}

export function sellBusiness(index) {
  const p = getPlayer();
  const businesses = getOwnedBusinesses();
  const id = businesses[index];
  const b = BUSINESSES.find((x) => x.id === id);

  if (!b) return false;

  const refund = Math.floor(numberValue(b.price) * 0.5);

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
// CLASS BUY
// =====================
export function buyPlayerClass(classId) {
  const p = getPlayer();
  const target = getClassById(classId);

  if (!target) return false;

  if ((p.class || "none") === classId) {
    alert("You already have this class");
    return false;
  }

  if (numberValue(target.price) <= 0) {
    p.class = classId;

    updatePlayer({
      class: p.class
    });

    apiAddHistory(p.username, `Set class: ${target.name}`, 0);
    return true;
  }

  if (!removeBalance(target.price)) {
    alert("Not enough money");
    return false;
  }

  p.class = classId;

  updatePlayer({
    class: p.class
  });

  apiAddHistory(p.username, `Buy class: ${target.name}`, -target.price);
  return true;
}

// =====================
// INCOME
// =====================
export function calcBusinessIncome() {
  const businesses = getOwnedBusinesses();
  const levels = getBusinessLevels();

  let total = 0;

  businesses.forEach((id) => {
    const b = BUSINESSES.find((x) => x.id === id);
    if (!b) return;

    const level = numberValue(levels[id] || 1);
    const scaledIncome = numberValue(b.income) * level;

    total += scaledIncome;
  });

  return total;
}

export function calcClassPassiveBoost() {
  const current = getCurrentClassConfig();
  return numberValue(current.passiveBoost || 0);
}

export function calcPassiveIncome() {
  const businessIncome = calcBusinessIncome();
  const boost = calcClassPassiveBoost();

  return businessIncome + businessIncome * boost;
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
// VALUE
// =====================
export function getBusinessValue() {
  const businesses = getOwnedBusinesses();
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

// =====================
// RENDER HELPERS
// =====================
function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindEconomyUI();
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

function renderClassCard(item) {
  const owned = (getPlayer().class || "none") === item.id;

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${item.name}</div>
          <div class="asset-price">₴ ${formatCompact(item.price)}</div>
        </div>

        <div class="asset-meta">
          <span>Click +${item.clickBonus}</span>
          <span>Passive +${Math.floor(item.passiveBoost * 100)}%</span>
          <span>Market -${Math.floor(item.marketDiscount * 100)}%</span>
        </div>

        <p class="muted" style="margin-top:4px;">${item.vipLabel}</p>

        <div class="titles-list" style="margin-top:10px;">
          ${item.perks.map((perk) => `<div class="title-pill">${perk}</div>`).join("")}
        </div>

        <div class="asset-actions full" style="margin-top:12px;">
          <button ${owned ? "disabled" : ""} data-buy-class="${item.id}">
            ${owned ? "Current Class" : "Buy Class"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderBusinessCard(item) {
  const p = getPlayer();
  const owned = getOwnedBusinesses();
  const levels = getBusinessLevels();

  const count = owned.filter((id) => id === item.id).length;
  const level = numberValue(levels[item.id] || 1);
  const upgradeCost = Math.floor(level * 1500);

  return `
    <div class="card asset-card">
      <div class="asset-cover">
        <img src="${item.img}" alt="${item.name}">
        <div class="asset-badge">${item.category}</div>
      </div>

      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${item.name}</div>
          <div class="asset-price">₴ ${formatCompact(item.price)}</div>
        </div>

        <div class="asset-meta">
          <span>Income: ₴ ${formatCompact(item.income)}/min</span>
          <span>Owned: ${count}</span>
          <span>Level: ${level}</span>
        </div>

        <div class="asset-actions">
          <button data-buy-business="${item.id}">Buy</button>
          <button class="secondary" data-upgrade-business="${item.id}">
            Upgrade ₴ ${formatCompact(upgradeCost)}
          </button>
        </div>
      </div>
    </div>
  `;
}

// =====================
// PAGE RENDER
// =====================
export function renderBusinessPremiumPage() {
  document.body.dataset.currentPage = "business";

  const currentClass = getCurrentClassConfig();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Business Empire</h2>
      <p>Build your premium economy, upgrade income chains and unlock stronger account classes.</p>
    </div>

    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Current Class</div>
        <div class="stat-value blue">${currentClass.name}</div>
        <div class="stat-sub">${currentClass.vipLabel}</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Passive Income</div>
        <div class="stat-value green">₴ ${formatCompact(calcPassiveIncome())}</div>
        <div class="stat-sub">Per minute</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Business Value</div>
        <div class="stat-value">₴ ${formatCompact(getBusinessValue())}</div>
        <div class="stat-sub">Total empire worth</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Owned</div>
        <div class="stat-value">${getOwnedBusinesses().length}</div>
        <div class="stat-sub">Total business units</div>
      </div>
    </div>

    <div class="section-title">Classes</div>
    <div class="asset-grid">
      ${PLAYER_CLASSES.map(renderClassCard).join("")}
    </div>

    <div class="section-title">Businesses</div>
    <div class="asset-grid">
      ${BUSINESSES.map(renderBusinessCard).join("")}
    </div>
  `);
}

// =====================
// BIND UI
// =====================
function bindEconomyUI() {
  document.querySelectorAll("[data-buy-class]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-buy-class");
      const ok = buyPlayerClass(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-buy-business]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-buy-business"));
      const ok = buyBusiness(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-upgrade-business]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-upgrade-business"));
      const ok = upgradeBusiness(id);
      if (ok) renderBusinessPremiumPage();
    });
  });
}
