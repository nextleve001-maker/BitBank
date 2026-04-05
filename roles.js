import { AppState, updatePlayer } from "./app.js";
import { removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// ======================================================
// ROLE CONFIG
// ======================================================
export const ROLE_CONFIGS = [
  {
    id: "none",
    name: "Без ролі",
    price: 0,
    description: "Стандартний шлях без спеціалізації. Підходить, якщо ти хочеш грати універсально.",
    label: "Neutral path",
    bonuses: {
      clickBoost: 0,
      businessIncomeBoost: 0,
      businessStockDiscount: 0,
      employeeCostDiscount: 0,
      marketProfitBoost: 0,
      cryptoDiscount: 0,
      stockDiscount: 0,
      depositRateBonus: 0,
      creditRateDiscount: 0,
      casinoLuck: 0,
      lotteryLuck: 0
    },
    perks: [
      "Без спеціальних бонусів",
      "Універсальний старт",
      "Підходить для будь-якого стилю гри"
    ]
  },

  {
    id: "trader",
    name: "Трейдер",
    price: 25000,
    description: "Фокус на крипті, акціях і коливаннях ринку. Найкраще підходить для тих, хто хоче заробляти через активний трейдинг.",
    label: "Market specialist",
    bonuses: {
      clickBoost: 3,
      businessIncomeBoost: 0,
      businessStockDiscount: 0,
      employeeCostDiscount: 0,
      marketProfitBoost: 0.12,
      cryptoDiscount: 0.04,
      stockDiscount: 0.04,
      depositRateBonus: 0.002,
      creditRateDiscount: 0,
      casinoLuck: 0.01,
      lotteryLuck: 0
    },
    perks: [
      "+12% ефективність ринку",
      "-4% на купівлю crypto",
      "-4% на купівлю stocks",
      "+3 до кліку"
    ]
  },

  {
    id: "entrepreneur",
    name: "Підприємець",
    price: 30000,
    description: "Фокус на бізнес-імперії. Дає бусти на доходи компаній, працівників і складські витрати.",
    label: "Business builder",
    bonuses: {
      clickBoost: 2,
      businessIncomeBoost: 0.14,
      businessStockDiscount: 0.06,
      employeeCostDiscount: 0.05,
      marketProfitBoost: 0,
      cryptoDiscount: 0,
      stockDiscount: 0,
      depositRateBonus: 0.001,
      creditRateDiscount: 0.01,
      casinoLuck: 0,
      lotteryLuck: 0
    },
    perks: [
      "+14% до доходу бізнесів",
      "-6% на закупку товару",
      "-5% на найм працівників",
      "Кращий старт для супермаркету і клубу"
    ]
  },

  {
    id: "banker",
    name: "Банкір",
    price: 50000,
    description: "Фокус на депозитах, кредитах і фінансовому менеджменті. Найкраще підходить для гравців, які хочуть будувати капітал через банківську систему.",
    label: "Finance master",
    bonuses: {
      clickBoost: 1,
      businessIncomeBoost: 0.03,
      businessStockDiscount: 0.02,
      employeeCostDiscount: 0.02,
      marketProfitBoost: 0.02,
      cryptoDiscount: 0.01,
      stockDiscount: 0.01,
      depositRateBonus: 0.015,
      creditRateDiscount: 0.12,
      casinoLuck: 0,
      lotteryLuck: 0
    },
    perks: [
      "+1.5% до ставки депозиту",
      "-12% до ставки кредиту",
      "Сильний контроль фінансів",
      "Добре працює з великим балансом"
    ]
  },

  {
    id: "sports_manager",
    name: "Спортивний менеджер",
    price: 80000,
    description: "Роль для футбольного клубу та спортивних активів. Дає бонуси до клубу, тренерів і медійного впливу.",
    label: "Football path",
    bonuses: {
      clickBoost: 2,
      businessIncomeBoost: 0.08,
      businessStockDiscount: 0.02,
      employeeCostDiscount: 0.03,
      marketProfitBoost: 0,
      cryptoDiscount: 0,
      stockDiscount: 0,
      depositRateBonus: 0,
      creditRateDiscount: 0.02,
      casinoLuck: 0,
      lotteryLuck: 0.01
    },
    perks: [
      "+8% до спортивних бізнесів",
      "-3% на персонал",
      "Краще масштабує футбольний клуб",
      "+1% удача в лотереї"
    ]
  },

  {
    id: "media_mogul",
    name: "Медіа магнат",
    price: 150000,
    description: "Сильна роль під медіа, бренд, маркетинг і репутацію. Дає бонуси до маркетингових механік і брендових бізнесів.",
    label: "Brand growth",
    bonuses: {
      clickBoost: 4,
      businessIncomeBoost: 0.1,
      businessStockDiscount: 0.03,
      employeeCostDiscount: 0.02,
      marketProfitBoost: 0.03,
      cryptoDiscount: 0,
      stockDiscount: 0,
      depositRateBonus: 0.003,
      creditRateDiscount: 0.03,
      casinoLuck: 0,
      lotteryLuck: 0.02
    },
    perks: [
      "+10% до бізнесового доходу",
      "+сильніший маркетинговий шлях",
      "+4 до кліку",
      "+2% удача в лотереї"
    ]
  },

  {
    id: "high_roller",
    name: "Хайролер",
    price: 250000,
    description: "Роль для агресивної гри в казино. Дає бонус до удачі, кращі шанси на колесі та сильніший ризиковий стиль.",
    label: "Casino risk",
    bonuses: {
      clickBoost: 0,
      businessIncomeBoost: 0,
      businessStockDiscount: 0,
      employeeCostDiscount: 0,
      marketProfitBoost: 0,
      cryptoDiscount: 0,
      stockDiscount: 0,
      depositRateBonus: 0,
      creditRateDiscount: 0,
      casinoLuck: 0.08,
      lotteryLuck: 0.04
    },
    perks: [
      "+8% luck у казино",
      "+4% luck у лотереї",
      "Сильний ризиковий стиль",
      "Підходить під сейфи і wheel"
    ]
  }
];

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
  bindRolesUI();
}

function ensureRoleData() {
  const p = getPlayer();

  if (!p.role || typeof p.role !== "string") {
    p.role = "none";
  }

  if (!p.role_stats || typeof p.role_stats !== "object" || Array.isArray(p.role_stats)) {
    p.role_stats = {
      changes_count: 0,
      total_spent_on_roles: 0,
      selected_at: null
    };
  }
}

function saveRoleData() {
  const p = getPlayer();

  updatePlayer({
    role: p.role,
    role_stats: p.role_stats
  });
}

export function getCurrentRoleConfig() {
  ensureRoleData();

  const currentRole = getPlayer().role || "none";
  return ROLE_CONFIGS.find((x) => x.id === currentRole) || ROLE_CONFIGS[0];
}

function getRoleConfig(roleId) {
  return ROLE_CONFIGS.find((x) => x.id === roleId) || null;
}

function roleChangeCost(roleId) {
  const target = getRoleConfig(roleId);
  if (!target) return 0;

  const current = getCurrentRoleConfig();
  if (current.id === "none") {
    return numberValue(target.price);
  }

  if (current.id === target.id) {
    return 0;
  }

  return Math.floor(numberValue(target.price) * 0.55);
}

// ======================================================
// BONUS EXPORTS
// ======================================================
export function getRoleBonuses() {
  return getCurrentRoleConfig().bonuses;
}

export function getRoleClickBoost() {
  return numberValue(getRoleBonuses().clickBoost || 0);
}

export function getRoleBusinessIncomeBoost() {
  return numberValue(getRoleBonuses().businessIncomeBoost || 0);
}

export function getRoleBusinessStockDiscount() {
  return numberValue(getRoleBonuses().businessStockDiscount || 0);
}

export function getRoleEmployeeDiscount() {
  return numberValue(getRoleBonuses().employeeCostDiscount || 0);
}

export function getRoleMarketProfitBoost() {
  return numberValue(getRoleBonuses().marketProfitBoost || 0);
}

export function getRoleCryptoDiscount() {
  return numberValue(getRoleBonuses().cryptoDiscount || 0);
}

export function getRoleStockDiscount() {
  return numberValue(getRoleBonuses().stockDiscount || 0);
}

export function getRoleDepositBonus() {
  return numberValue(getRoleBonuses().depositRateBonus || 0);
}

export function getRoleCreditDiscount() {
  return numberValue(getRoleBonuses().creditRateDiscount || 0);
}

export function getRoleCasinoLuck() {
  return numberValue(getRoleBonuses().casinoLuck || 0);
}

export function getRoleLotteryLuck() {
  return numberValue(getRoleBonuses().lotteryLuck || 0);
}

// ======================================================
// ACTIONS
// ======================================================
export async function chooseRole(roleId) {
  ensureRoleData();

  const p = getPlayer();
  const target = getRoleConfig(roleId);

  if (!target) {
    alert("Роль не знайдена");
    return false;
  }

  if (p.role === roleId) {
    alert("У тебе вже ця роль");
    return false;
  }

  const cost = roleChangeCost(roleId);

  if (cost > 0) {
    const ok = removeBalance(cost);
    if (!ok) {
      alert("Недостатньо грошей");
      return false;
    }
  }

  p.role = roleId;
  p.role_stats.changes_count = numberValue(p.role_stats.changes_count) + 1;
  p.role_stats.total_spent_on_roles = numberValue(p.role_stats.total_spent_on_roles) + cost;
  p.role_stats.selected_at = new Date().toISOString();

  saveRoleData();

  await apiAddHistory(p.username, `Choose role: ${target.name}`, -cost);
  return true;
}

// ======================================================
// RENDER HELPERS
// ======================================================
function roleCard(item) {
  const current = getPlayer().role === item.id;
  const cost = roleChangeCost(item.id);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${item.name}</div>
          <div class="asset-price">₴ ${formatCompact(item.price)}</div>
        </div>

        <div class="asset-meta">
          <span>${item.label}</span>
          <span>Click +${numberValue(item.bonuses.clickBoost || 0)}</span>
          <span>Business +${Math.floor(numberValue(item.bonuses.businessIncomeBoost || 0) * 100)}%</span>
          <span>Market +${Math.floor(numberValue(item.bonuses.marketProfitBoost || 0) * 100)}%</span>
        </div>

        <p>${item.description}</p>

        <div class="titles-list" style="margin-top:12px;">
          ${item.perks.map((perk) => `<div class="title-pill">${perk}</div>`).join("")}
        </div>

        <div class="profile-actions" style="margin-top:14px;">
          <button ${current ? "disabled" : ""} data-choose-role="${item.id}">
            ${
              current
                ? "Поточна роль"
                : cost <= 0
                  ? "Обрати роль"
                  : `Обрати за ₴ ${formatCompact(cost)}`
            }
          </button>
        </div>
      </div>
    </div>
  `;
}

function currentRolePanel() {
  const role = getCurrentRoleConfig();
  const stats = getPlayer().role_stats || {};

  return `
    <div class="dashboard-grid">
      <div class="card">
        <h3>Поточна роль</h3>
        <p><span class="muted">Назва:</span> ${role.name}</p>
        <p><span class="muted">Тип:</span> ${role.label}</p>
        <p><span class="muted">Опис:</span> ${role.description}</p>

        <div class="titles-list" style="margin-top:12px;">
          ${role.perks.map((perk) => `<div class="title-pill">${perk}</div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>Статистика ролей</h3>
        <p><span class="muted">Змін ролі:</span> ${numberValue(stats.changes_count || 0)}</p>
        <p><span class="muted">Витрачено:</span> ₴ ${formatMoney(stats.total_spent_on_roles || 0)}</p>
        <p><span class="muted">Обрано:</span> ${stats.selected_at ? new Date(stats.selected_at).toLocaleString() : "—"}</p>
      </div>
    </div>
  `;
}

function roleBonusPanel() {
  const role = getCurrentRoleConfig();
  const bonuses = role.bonuses;

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Click Boost</div>
        <div class="stat-value blue">+${numberValue(bonuses.clickBoost || 0)}</div>
        <div class="stat-sub">Додатковий клік</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Business</div>
        <div class="stat-value green">+${Math.floor(numberValue(bonuses.businessIncomeBoost || 0) * 100)}%</div>
        <div class="stat-sub">Доходи бізнесів</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Market</div>
        <div class="stat-value orange">+${Math.floor(numberValue(bonuses.marketProfitBoost || 0) * 100)}%</div>
        <div class="stat-sub">Перевага на ринку</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Finance</div>
        <div class="stat-value">${Math.floor(numberValue(bonuses.creditRateDiscount || 0) * 100)}%</div>
        <div class="stat-sub">Знижка на кредит</div>
      </div>
    </div>

    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);margin-top:16px;">
      <div class="card stat-card">
        <div class="stat-label">Deposit Bonus</div>
        <div class="stat-value green">+${(numberValue(bonuses.depositRateBonus || 0) * 100).toFixed(2)}%</div>
        <div class="stat-sub">До депозитів</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Employee Discount</div>
        <div class="stat-value blue">-${Math.floor(numberValue(bonuses.employeeCostDiscount || 0) * 100)}%</div>
        <div class="stat-sub">На працівників</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Business Stock</div>
        <div class="stat-value">-${Math.floor(numberValue(bonuses.businessStockDiscount || 0) * 100)}%</div>
        <div class="stat-sub">На товар для бізнесів</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Casino Luck</div>
        <div class="stat-value orange">+${Math.floor(numberValue(bonuses.casinoLuck || 0) * 100)}%</div>
        <div class="stat-sub">Удача в казино</div>
      </div>
    </div>
  `;
}

// ======================================================
// MAIN PAGE
// ======================================================
export function renderRolesPage() {
  ensureRoleData();
  document.body.dataset.currentPage = "roles";

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Roles / Professions</h2>
      <p>Обери спеціалізацію під свій стиль гри: ринок, бізнес, банкінг, спорт, медіа або ризикове казино.</p>
    </div>

    ${currentRolePanel()}

    <div class="section-title">Role Bonuses</div>
    ${roleBonusPanel()}

    <div class="section-title">Available Roles</div>
    <div class="asset-grid">
      ${ROLE_CONFIGS.map(roleCard).join("")}
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindRolesUI() {
  document.querySelectorAll("[data-choose-role]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-choose-role");
      const ok = await chooseRole(id);
      if (ok) {
        renderRolesPage();
      }
    });
  });
}
