import { AppState, updatePlayer } from "./app.js";
import { addBalance, removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// =====================================================
// CLASSES
// =====================================================
export const PLAYER_CLASSES = [
  {
    id: "none",
    name: "Starter",
    price: 0,
    clickBonus: 0,
    passiveBoost: 0,
    marketDiscount: 0,
    transferDiscount: 0,
    businessDiscount: 0,
    businessBoost: 0,
    label: "Базовий акаунт",
    perks: [
      "Стандартний профіль",
      "Без бонусів до пасиву",
      "Базовий доступ до економіки"
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
    businessDiscount: 0.01,
    businessBoost: 0.03,
    label: "Початковий інвестор",
    perks: [
      "+2 до кліку",
      "+3% до пасивного доходу",
      "-1% на відкриття бізнесів"
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
    businessDiscount: 0.02,
    businessBoost: 0.05,
    label: "Зростаючий капітал",
    perks: [
      "+5 до кліку",
      "+6% до пасивного доходу",
      "-2% на відкриття бізнесів",
      "-1% на ринок"
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
    businessDiscount: 0.03,
    businessBoost: 0.08,
    label: "Преміальний клієнт",
    perks: [
      "+10 до кліку",
      "+10% до пасиву",
      "-3% на бізнеси",
      "-2% на ринок"
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
    businessDiscount: 0.04,
    businessBoost: 0.12,
    label: "Елітний клієнт",
    perks: [
      "+20 до кліку",
      "+15% до пасиву",
      "-4% на бізнеси",
      "Сильніший профіль"
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
    businessDiscount: 0.05,
    businessBoost: 0.18,
    label: "Diamond wealth",
    perks: [
      "+35 до кліку",
      "+22% до пасиву",
      "-5% на бізнеси",
      "-2% на перекази"
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
    businessDiscount: 0.06,
    businessBoost: 0.25,
    label: "Black banking",
    perks: [
      "+60 до кліку",
      "+30% до пасиву",
      "-6% на бізнеси",
      "Black prestige"
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
    businessDiscount: 0.07,
    businessBoost: 0.35,
    label: "VIP wealth",
    perks: [
      "+100 до кліку",
      "+40% до пасиву",
      "-7% на бізнеси",
      "-3% на перекази"
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
    businessDiscount: 0.08,
    businessBoost: 0.50,
    label: "Legend investor",
    perks: [
      "+180 до кліку",
      "+55% до пасиву",
      "-8% на бізнеси",
      "-4% на перекази"
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
    businessDiscount: 0.10,
    businessBoost: 0.70,
    label: "Absolute tier",
    perks: [
      "+300 до кліку",
      "+75% до пасиву",
      "-10% на бізнеси",
      "-5% на перекази",
      "Максимальний рівень престижу"
    ]
  }
];

// =====================================================
// BUSINESS PROJECTS
// =====================================================
export const BUSINESS_PROJECTS = [
  {
    id: "fashion_brand",
    name: "Бренд одягу",
    icon: "👔",
    theme: "fashion",
    unlockCost: 3000000,
    baseIncome: 18000,
    employeeUnit: "Дизайнер",
    employeeSalary: 280,
    employeeHireCost: 50000,
    employeeSoftCap: 20,
    stockItem: "Тканина та матеріали",
    stockStep: 60,
    stockCost: 120000,
    stockUsagePerMinute: 3,
    potentialEffect: [
      "Пасивний дохід від продажу колекцій",
      "Бонус до престижу профілю",
      "Сильний ріст через маркетинг і якість"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 3000000 },
      { id: "retail_count", label: "Крупна мережа магазинів", type: "opened_count", need: 2 },
      { id: "transport_count", label: "Перевозки", type: "opened_specific", projectId: "transport_company", need: 1 },
      { id: "factory_count", label: "Невелике виробництво", type: "opened_specific", projectId: "small_factory", need: 1 }
    ]
  },
  {
    id: "transport_company",
    name: "Перевозки",
    icon: "🚚",
    theme: "transport",
    unlockCost: 1200000,
    baseIncome: 9500,
    employeeUnit: "Водій",
    employeeSalary: 190,
    employeeHireCost: 22000,
    employeeSoftCap: 24,
    stockItem: "Пальне",
    stockStep: 80,
    stockCost: 65000,
    stockUsagePerMinute: 4,
    potentialEffect: [
      "Стабільний дохід від рейсів",
      "Підсилює логістику інших бізнесів",
      "Добре масштабується через працівників"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 1200000 },
      { id: "owned_business_units", label: "Базові бізнеси", type: "owned_units", need: 3 }
    ]
  },
  {
    id: "small_factory",
    name: "Невелике виробництво",
    icon: "🏭",
    theme: "factory",
    unlockCost: 1800000,
    baseIncome: 12500,
    employeeUnit: "Робітник",
    employeeSalary: 220,
    employeeHireCost: 30000,
    employeeSoftCap: 26,
    stockItem: "Сировина",
    stockStep: 70,
    stockCost: 80000,
    stockUsagePerMinute: 4,
    potentialEffect: [
      "Виробничий дохід",
      "Відкриває шлях до великих проектів",
      "Сильний приріст від рівня і якості"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 1800000 },
      { id: "business_value", label: "Цінність бізнесів", type: "business_value", need: 1000000 }
    ]
  },
  {
    id: "supermarket_chain",
    name: "Крупна сеть магазинов / Супермаркет",
    icon: "🛒",
    theme: "supermarket",
    unlockCost: 6500000,
    baseIncome: 38000,
    employeeUnit: "Касир",
    employeeSalary: 350,
    employeeHireCost: 45000,
    employeeSoftCap: 60,
    stockItem: "Їжа та товари",
    stockStep: 220,
    stockCost: 300000,
    stockUsagePerMinute: 10,
    potentialEffect: [
      "Сильний щоденний обіг",
      "Доходи ростуть від касирів, товару, якості і реклами",
      "Один із найкращих бізнесів середнього етапу"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 6500000 },
      { id: "transport_company", label: "Перевозки", type: "opened_specific", projectId: "transport_company", need: 1 },
      { id: "small_factory", label: "Невелике виробництво", type: "opened_specific", projectId: "small_factory", need: 1 }
    ]
  },
  {
    id: "football_club",
    name: "Футбольний клуб",
    icon: "⚽",
    theme: "football",
    unlockCost: 9000000,
    baseIncome: 42000,
    employeeUnit: "Персонал",
    employeeSalary: 420,
    employeeHireCost: 70000,
    employeeSoftCap: 28,
    stockItem: "Клубні витрати",
    stockStep: 40,
    stockCost: 240000,
    stockUsagePerMinute: 2,
    potentialEffect: [
      "Дохід від матчів і бренду клубу",
      "Можна купувати футболістів",
      "Можна купувати тренерів",
      "Маркетинг сильно впливає на ріст"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 9000000 },
      { id: "supermarket_chain", label: "Крупна мережа магазинів", type: "opened_specific", projectId: "supermarket_chain", need: 1 },
      { id: "class", label: "Клас не нижче Gold", type: "class_at_least", needClass: "gold" }
    ]
  },
  {
    id: "space_agency",
    name: "Космічне агентство",
    icon: "🚀",
    theme: "space",
    unlockCost: 60000000,
    baseIncome: 260000,
    employeeUnit: "Інженер",
    employeeSalary: 1800,
    employeeHireCost: 420000,
    employeeSoftCap: 45,
    stockItem: "Космічні модулі",
    stockStep: 80,
    stockCost: 1600000,
    stockUsagePerMinute: 3,
    potentialEffect: [
      "Дуже високий ендгейм-дохід",
      "Сильний буст від працівників і рівня",
      "Один із найпотужніших бізнесів у грі"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 60000000 },
      { id: "factory_count", label: "Крупне виробництво", type: "opened_specific", projectId: "small_factory", need: 1 },
      { id: "transport_count", label: "Перевозки", type: "opened_specific", projectId: "transport_company", need: 1 },
      { id: "construction_income", label: "Загальний заробіток", type: "total_earned", need: 60000000 }
    ]
  },
  {
    id: "private_bank",
    name: "Приватний банк",
    icon: "🏦",
    theme: "bank",
    unlockCost: 35000000,
    baseIncome: 160000,
    employeeUnit: "Менеджер",
    employeeSalary: 1200,
    employeeHireCost: 260000,
    employeeSoftCap: 30,
    stockItem: "Системи та безпека",
    stockStep: 35,
    stockCost: 900000,
    stockUsagePerMinute: 1,
    potentialEffect: [
      "Великий фінансовий дохід",
      "Добре поєднується з високим класом",
      "Підсилює банківський стиль профілю"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 35000000 },
      { id: "class", label: "Клас не нижче Platinum", type: "class_at_least", needClass: "platinum" },
      { id: "business_value", label: "Вартість бізнесів", type: "business_value", need: 20000000 }
    ]
  },
  {
    id: "media_empire",
    name: "Медіа імперія",
    icon: "🎬",
    theme: "media",
    unlockCost: 22000000,
    baseIncome: 98000,
    employeeUnit: "Продюсер",
    employeeSalary: 850,
    employeeHireCost: 180000,
    employeeSoftCap: 24,
    stockItem: "Продакшн ресурси",
    stockStep: 50,
    stockCost: 550000,
    stockUsagePerMinute: 2,
    potentialEffect: [
      "Дохід від контенту і бренду",
      "Маркетинг має підвищений вплив",
      "Сильний середньо-пізній бізнес"
    ],
    requirements: [
      { id: "balance", label: "Баланс", type: "balance", need: 22000000 },
      { id: "opened_projects", label: "Відкрито бізнесів", type: "opened_count", need: 4 }
    ]
  }
];

// =====================================================
// HELPERS
// =====================================================
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
  bindEconomyUI();
}

function ensureEconomyData() {
  const p = getPlayer();

  if (!p.business_projects || typeof p.business_projects !== "object" || Array.isArray(p.business_projects)) {
    p.business_projects = {};
  }
}

function getProjectsMap() {
  ensureEconomyData();
  return safeObject(getPlayer().business_projects);
}

function getProjectConfig(id) {
  return BUSINESS_PROJECTS.find((x) => x.id === id) || null;
}

function getProjectState(id) {
  const map = getProjectsMap();

  if (!map[id]) {
    map[id] = {
      unlocked: false,
      level: 1,
      employees: 0,
      stock: 0,
      quality: 0,
      marketing: 0,
      players: 0,
      trainers: 0
    };
  }

  return map[id];
}

function saveProjectState() {
  const p = getPlayer();
  updatePlayer({
    business_projects: p.business_projects
  });
}

function getCurrentClassConfig() {
  const current = getPlayer().class || "none";
  return PLAYER_CLASSES.find((x) => x.id === current) || PLAYER_CLASSES[0];
}

export { getCurrentClassConfig };

function getClassOrder() {
  return PLAYER_CLASSES.map((x) => x.id);
}

function classAtLeast(currentClass, neededClass) {
  const order = getClassOrder();
  return order.indexOf(currentClass) >= order.indexOf(neededClass);
}

function openedProjectsCount() {
  const map = getProjectsMap();

  return Object.values(map).filter((x) => x?.unlocked).length;
}

function projectOpened(projectId) {
  return !!getProjectState(projectId).unlocked;
}

function totalBusinessValue() {
  const map = getProjectsMap();
  let total = 0;

  Object.keys(map).forEach((id) => {
    const cfg = getProjectConfig(id);
    const st = getProjectState(id);
    if (!cfg || !st.unlocked) return;

    total += numberValue(cfg.unlockCost);
    total += numberValue(st.level || 1) * 5000;
    total += numberValue(st.employees || 0) * numberValue(cfg.employeeHireCost || 0) * 0.5;
    total += numberValue(st.stock || 0) * (numberValue(cfg.stockCost || 0) / Math.max(1, numberValue(cfg.stockStep || 1))) * 0.45;
    total += numberValue(st.quality || 0) * 2500;
    total += numberValue(st.marketing || 0) * 3200;

    if (cfg.id === "football_club") {
      total += numberValue(st.players || 0) * 500000;
      total += numberValue(st.trainers || 0) * 850000;
    }
  });

  return total;
}

// =====================================================
// REQUIREMENT SYSTEM
// =====================================================
function requirementProgress(req) {
  const p = getPlayer();

  switch (req.type) {
    case "balance":
      return {
        current: numberValue(p.balance),
        need: numberValue(req.need),
        done: numberValue(p.balance) >= numberValue(req.need)
      };

    case "opened_count":
      return {
        current: openedProjectsCount(),
        need: numberValue(req.need),
        done: openedProjectsCount() >= numberValue(req.need)
      };

    case "opened_specific":
      return {
        current: projectOpened(req.projectId) ? 1 : 0,
        need: numberValue(req.need),
        done: projectOpened(req.projectId)
      };

    case "business_value":
      return {
        current: totalBusinessValue(),
        need: numberValue(req.need),
        done: totalBusinessValue() >= numberValue(req.need)
      };

    case "total_earned":
      return {
        current: numberValue(p.total_earned),
        need: numberValue(req.need),
        done: numberValue(p.total_earned) >= numberValue(req.need)
      };

    case "class_at_least":
      return {
        current: classAtLeast(p.class || "none", req.needClass) ? 1 : 0,
        need: 1,
        done: classAtLeast(p.class || "none", req.needClass)
      };

    case "owned_units":
      return {
        current: openedProjectsCount(),
        need: numberValue(req.need),
        done: openedProjectsCount() >= numberValue(req.need)
      };

    default:
      return {
        current: 0,
        need: 1,
        done: false
      };
  }
}

function canUnlockProject(id) {
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  return cfg.requirements.every((req) => requirementProgress(req).done);
}

// =====================================================
// COST HELPERS
// =====================================================
function projectUnlockCost(cfg) {
  const cls = getCurrentClassConfig();
  const discount = numberValue(cls.businessDiscount || 0);
  return Math.max(1, Math.floor(numberValue(cfg.unlockCost) * (1 - discount)));
}

function levelUpgradeCost(st) {
  return Math.floor(numberValue(st.level || 1) * 6000 + 3000);
}

function employeeHireCost(cfg, st) {
  return Math.floor(numberValue(cfg.employeeHireCost) * (1 + numberValue(st.employees || 0) * 0.08));
}

function stockBuyCost(cfg) {
  return numberValue(cfg.stockCost);
}

function qualityUpgradeCost(st) {
  return Math.floor((numberValue(st.quality || 0) + 1) * 12000);
}

function marketingUpgradeCost(st) {
  return Math.floor((numberValue(st.marketing || 0) + 1) * 18000);
}

function footballPlayerCost(st) {
  return Math.floor(950000 + numberValue(st.players || 0) * 320000);
}

function footballTrainerCost(st) {
  return Math.floor(1600000 + numberValue(st.trainers || 0) * 450000);
}

// =====================================================
// INCOME
// =====================================================
function stockPenaltyFactor(cfg, st) {
  if (numberValue(cfg.stockUsagePerMinute || 0) <= 0) return 1;
  if (numberValue(st.stock || 0) <= 0) return 0.25;
  if (numberValue(st.stock || 0) < numberValue(cfg.stockUsagePerMinute || 1) * 3) return 0.65;
  return 1;
}

function employeeFactor(cfg, st) {
  const employees = numberValue(st.employees || 0);
  const softCap = Math.max(1, numberValue(cfg.employeeSoftCap || 1));

  if (employees <= 0) return 0.45;

  return Math.min(1.35, 0.55 + (employees / softCap));
}

function qualityFactor(st) {
  return 1 + numberValue(st.quality || 0) * 0.08;
}

function marketingFactor(st, cfg) {
  let boost = 0.06;
  if (cfg.id === "media_empire") boost = 0.10;
  return 1 + numberValue(st.marketing || 0) * boost;
}

function footballFactor(st) {
  return 1 + numberValue(st.players || 0) * 0.05 + numberValue(st.trainers || 0) * 0.12;
}

function salaryPerMinute(cfg, st) {
  const base = numberValue(cfg.employeeSalary || 0) * numberValue(st.employees || 0);

  if (cfg.id !== "football_club") {
    return base;
  }

  const playerSalary = numberValue(st.players || 0) * 4200;
  const trainerSalary = numberValue(st.trainers || 0) * 6500;

  return base + playerSalary + trainerSalary;
}

function classBusinessBoost() {
  return numberValue(getCurrentClassConfig().businessBoost || 0);
}

function projectIncomePerMinute(cfg, st) {
  if (!st.unlocked) return 0;

  let income =
    numberValue(cfg.baseIncome) *
    (1 + (numberValue(st.level || 1) - 1) * 0.18) *
    employeeFactor(cfg, st) *
    stockPenaltyFactor(cfg, st) *
    qualityFactor(st) *
    marketingFactor(st, cfg);

  if (cfg.id === "football_club") {
    income *= footballFactor(st);
  }

  income *= (1 + classBusinessBoost());

  const finalIncome = Math.max(0, income - salaryPerMinute(cfg, st));
  return finalIncome;
}

function totalIncomePerMinute() {
  let total = 0;
  BUSINESS_PROJECTS.forEach((cfg) => {
    const st = getProjectState(cfg.id);
    total += projectIncomePerMinute(cfg, st);
  });

  const passiveBoost = numberValue(getCurrentClassConfig().passiveBoost || 0);
  return total * (1 + passiveBoost);
}

export function calcPassiveIncome() {
  return totalIncomePerMinute();
}

// =====================================================
// CLASS BUY
// =====================================================
export function buyPlayerClass(classId) {
  const p = getPlayer();
  const target = PLAYER_CLASSES.find((x) => x.id === classId);

  if (!target) return false;
  if ((p.class || "none") === classId) {
    alert("У тебе вже цей клас");
    return false;
  }

  if (numberValue(target.price) > 0) {
    if (!removeBalance(target.price)) {
      alert("Недостатньо грошей");
      return false;
    }
  }

  p.class = classId;

  updatePlayer({
    class: p.class
  });

  apiAddHistory(p.username, `Buy class: ${target.name}`, -numberValue(target.price));
  return true;
}

// =====================================================
// BUSINESS ACTIONS
// =====================================================
export function unlockProject(id) {
  const p = getPlayer();
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  const st = getProjectState(id);
  if (st.unlocked) {
    alert("Бізнес уже відкритий");
    return false;
  }

  if (!canUnlockProject(id)) {
    alert("Не всі умови виконані");
    return false;
  }

  const cost = projectUnlockCost(cfg);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.unlocked = true;
  st.level = 1;
  st.employees = 1;
  st.stock = numberValue(cfg.stockStep) * 2;
  st.quality = 0;
  st.marketing = 0;
  st.players = 0;
  st.trainers = 0;

  saveProjectState();
  apiAddHistory(p.username, `Unlock project: ${cfg.name}`, -cost);
  return true;
}

export function upgradeProjectLevel(id) {
  const p = getPlayer();
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  const st = getProjectState(id);
  if (!st.unlocked) {
    alert("Спочатку відкрий проект");
    return false;
  }

  const cost = levelUpgradeCost(st);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.level += 1;
  saveProjectState();
  apiAddHistory(p.username, `Upgrade level: ${cfg.name}`, -cost);
  return true;
}

export function hireEmployee(id) {
  const p = getPlayer();
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  const st = getProjectState(id);
  if (!st.unlocked) {
    alert("Спочатку відкрий проект");
    return false;
  }

  const cost = employeeHireCost(cfg, st);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.employees += 1;
  saveProjectState();
  apiAddHistory(p.username, `Hire employee: ${cfg.name}`, -cost);
  return true;
}

export function buyBusinessStock(id) {
  const p = getPlayer();
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  const st = getProjectState(id);
  if (!st.unlocked) {
    alert("Спочатку відкрий проект");
    return false;
  }

  const cost = stockBuyCost(cfg);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.stock += numberValue(cfg.stockStep);
  saveProjectState();
  apiAddHistory(p.username, `Buy stock: ${cfg.name}`, -cost);
  return true;
}

export function upgradeQuality(id) {
  const p = getPlayer();
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  const st = getProjectState(id);
  if (!st.unlocked) {
    alert("Спочатку відкрий проект");
    return false;
  }

  const cost = qualityUpgradeCost(st);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.quality += 1;
  saveProjectState();
  apiAddHistory(p.username, `Upgrade quality: ${cfg.name}`, -cost);
  return true;
}

export function upgradeMarketing(id) {
  const p = getPlayer();
  const cfg = getProjectConfig(id);
  if (!cfg) return false;

  const st = getProjectState(id);
  if (!st.unlocked) {
    alert("Спочатку відкрий проект");
    return false;
  }

  const cost = marketingUpgradeCost(st);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.marketing += 1;
  saveProjectState();
  apiAddHistory(p.username, `Upgrade marketing: ${cfg.name}`, -cost);
  return true;
}

export function buyFootballPlayer() {
  const p = getPlayer();
  const st = getProjectState("football_club");

  if (!st.unlocked) {
    alert("Спочатку відкрий футбольний клуб");
    return false;
  }

  const cost = footballPlayerCost(st);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.players += 1;
  saveProjectState();
  apiAddHistory(p.username, "Buy football player", -cost);
  return true;
}

export function buyFootballTrainer() {
  const p = getPlayer();
  const st = getProjectState("football_club");

  if (!st.unlocked) {
    alert("Спочатку відкрий футбольний клуб");
    return false;
  }

  const cost = footballTrainerCost(st);
  if (!removeBalance(cost)) {
    alert("Недостатньо грошей");
    return false;
  }

  st.trainers += 1;
  saveProjectState();
  apiAddHistory(p.username, "Buy football trainer", -cost);
  return true;
}

// =====================================================
// PASSIVE TICK
// =====================================================
export function passiveIncomeTick() {
  const p = getPlayer();
  ensureEconomyData();

  const incomePerMinute = calcPassiveIncome();
  const incomePerSecond = incomePerMinute / 60;

  p.balance = numberValue(p.balance) + incomePerSecond;
  p.total_earned = numberValue(p.total_earned) + incomePerSecond;

  BUSINESS_PROJECTS.forEach((cfg) => {
    const st = getProjectState(cfg.id);
    if (!st.unlocked) return;

    const stockUsage = numberValue(cfg.stockUsagePerMinute || 0) / 60;
    st.stock = Math.max(0, numberValue(st.stock || 0) - stockUsage);
  });

  updatePlayer({
    balance: p.balance,
    total_earned: p.total_earned,
    business_projects: p.business_projects
  });
}

// =====================================================
// UI
// =====================================================
function progressBar(current, need) {
  const percent = Math.max(0, Math.min(100, (numberValue(current) / Math.max(1, numberValue(need))) * 100));

  return `
    <div style="margin-top:6px;">
      <div style="height:8px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;">
        <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#8ec5ff,#8ff5db);border-radius:999px;"></div>
      </div>
    </div>
  `;
}

function classCard(item) {
  const current = (getPlayer().class || "none") === item.id;

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
          <span>Business +${Math.floor(item.businessBoost * 100)}%</span>
          <span>Market -${Math.floor(item.marketDiscount * 100)}%</span>
        </div>

        <p class="muted" style="margin-top:4px;">${item.label}</p>

        <div class="titles-list" style="margin-top:10px;">
          ${item.perks.map((perk) => `<div class="title-pill">${perk}</div>`).join("")}
        </div>

        <div class="asset-actions full" style="margin-top:12px;">
          <button ${current ? "disabled" : ""} data-buy-class="${item.id}">
            ${current ? "Поточний клас" : "Купити клас"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function requirementRow(req) {
  const pg = requirementProgress(req);

  return `
    <div style="display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:start;margin-bottom:14px;">
      <div style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${pg.done ? "rgba(52,210,123,.18)" : "rgba(255,255,255,.06)"};border:1px solid ${pg.done ? "rgba(52,210,123,.35)" : "rgba(255,255,255,.08)"};">
        ${pg.done ? "✅" : "⬜"}
      </div>

      <div>
        <div style="font-weight:700;color:#fff;">${req.label}</div>
        <div class="muted" style="font-size:13px;margin-top:4px;">
          ${formatMoney(pg.current)} / ${formatMoney(pg.need)}
        </div>
        ${progressBar(pg.current, pg.need)}
      </div>

      <div class="muted" style="font-size:13px;padding-top:6px;">
        ${pg.done ? "Готово" : "В процесі"}
      </div>
    </div>
  `;
}

function projectManagementBlock(cfg, st) {
  if (!st.unlocked) return "";

  const income = projectIncomePerMinute(cfg, st);

  return `
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);">
      <div class="asset-meta" style="margin-bottom:12px;">
        <span>Рівень: ${numberValue(st.level || 1)}</span>
        <span>Працівники: ${numberValue(st.employees || 0)}</span>
        <span>Склад: ${Math.floor(numberValue(st.stock || 0))}</span>
        <span>Якість: ${numberValue(st.quality || 0)}</span>
        <span>Маркетинг: ${numberValue(st.marketing || 0)}</span>
        <span>Дохід: ₴ ${formatCompact(income)}/хв</span>
      </div>

      <div class="asset-actions">
        <button data-upgrade-project="${cfg.id}">Рівень ₴ ${formatCompact(levelUpgradeCost(st))}</button>
        <button class="secondary" data-hire-employee="${cfg.id}">
          Найняти ${cfg.employeeUnit} ₴ ${formatCompact(employeeHireCost(cfg, st))}
        </button>
      </div>

      <div class="asset-actions" style="margin-top:10px;">
        <button class="secondary" data-buy-business-stock="${cfg.id}">
          Купити ${cfg.stockItem} ₴ ${formatCompact(stockBuyCost(cfg))}
        </button>
        <button class="secondary" data-upgrade-quality="${cfg.id}">
          Якість ₴ ${formatCompact(qualityUpgradeCost(st))}
        </button>
      </div>

      <div class="asset-actions" style="margin-top:10px;">
        <button class="secondary" data-upgrade-marketing="${cfg.id}">
          Маркетинг ₴ ${formatCompact(marketingUpgradeCost(st))}
        </button>
        <button disabled>Зарплати ₴ ${formatCompact(salaryPerMinute(cfg, st))}/хв</button>
      </div>

      ${
        cfg.id === "football_club"
          ? `
            <div class="asset-actions" style="margin-top:10px;">
              <button data-buy-football-player>Купити футболіста ₴ ${formatCompact(footballPlayerCost(st))}</button>
              <button class="secondary" data-buy-football-trainer>Купити тренера ₴ ${formatCompact(footballTrainerCost(st))}</button>
            </div>

            <div class="asset-meta" style="margin-top:12px;">
              <span>Футболісти: ${numberValue(st.players || 0)}</span>
              <span>Тренери: ${numberValue(st.trainers || 0)}</span>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function projectCard(cfg) {
  const st = getProjectState(cfg.id);
  const canUnlock = canUnlockProject(cfg.id);

  return `
    <div class="card" style="grid-column:1 / -1;padding:0;overflow:hidden;">
      <div style="display:flex;gap:14px;align-items:center;padding:18px 18px 12px 18px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,0));">
        <div style="width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;background:rgba(91,140,255,.18);border:1px solid rgba(91,140,255,.22);flex-shrink:0;">
          ${cfg.icon}
        </div>

        <div style="min-width:0;">
          <div style="font-size:28px;font-weight:800;color:#fff;line-height:1.1;">${cfg.name}</div>
          <div class="muted" style="margin-top:4px;">
            ${st.unlocked ? "Бізнес відкритий" : "Проєкт ще не відкритий"}
          </div>
        </div>
      </div>

      <div style="padding:0 18px 18px 18px;">
        ${cfg.requirements.map(requirementRow).join("")}

        <div style="height:1px;background:rgba(255,255,255,.08);margin:10px 0 16px 0;"></div>

        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
          <div>
            <div class="muted" style="font-size:13px;">Вложения для открытия</div>
            <div style="font-size:30px;font-weight:900;color:#fff;">₴ ${formatMoney(projectUnlockCost(cfg))}</div>
          </div>

          <div style="display:flex;gap:10px;align-items:center;">
            <button ${st.unlocked ? "disabled" : ""} data-unlock-project="${cfg.id}">
              ${st.unlocked ? "Відкрито" : canUnlock ? "Відкрити бізнес" : "Не готово"}
            </button>
          </div>
        </div>

        <div style="margin-top:16px;padding:14px 16px;border-radius:18px;background:rgba(91,140,255,.08);border:1px solid rgba(91,140,255,.12);">
          <div style="font-weight:800;color:#dfeaff;margin-bottom:10px;">Потенційний ефект</div>
          <div class="titles-list">
            ${cfg.potentialEffect.map((item) => `<div class="title-pill">${item}</div>`).join("")}
          </div>
        </div>

        ${projectManagementBlock(cfg, st)}
      </div>
    </div>
  `;
}

// =====================================================
// PUBLIC RENDER
// =====================================================
export function renderBusinessPremiumPage() {
  document.body.dataset.currentPage = "business";

  const currentClass = getCurrentClassConfig();

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Бізнес-імперія</h2>
      <p>Бізнеси у форматі великих проєктів: виконуй умови, відкривай напрямки, качай персонал, склад, маркетинг, якість і рости далі.</p>
    </div>

    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Поточний клас</div>
        <div class="stat-value blue">${currentClass.name}</div>
        <div class="stat-sub">${currentClass.label}</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Пасивний дохід</div>
        <div class="stat-value green">₴ ${formatCompact(calcPassiveIncome())}</div>
        <div class="stat-sub">За хвилину</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Вартість бізнесів</div>
        <div class="stat-value">₴ ${formatCompact(totalBusinessValue())}</div>
        <div class="stat-sub">Сумарна цінність проектів</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Відкрито проектів</div>
        <div class="stat-value">${openedProjectsCount()}</div>
        <div class="stat-sub">Активні напрямки</div>
      </div>
    </div>

    <div class="section-title">Класи</div>
    <div class="asset-grid">
      ${PLAYER_CLASSES.map(classCard).join("")}
    </div>

    <div class="section-title">Бізнес-проєкти</div>
    <div class="asset-grid">
      ${BUSINESS_PROJECTS.map(projectCard).join("")}
    </div>
  `);
}

// =====================================================
// BIND
// =====================================================
function bindEconomyUI() {
  document.querySelectorAll("[data-buy-class]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-buy-class");
      const ok = buyPlayerClass(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-unlock-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-unlock-project");
      const ok = unlockProject(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-upgrade-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-upgrade-project");
      const ok = upgradeProjectLevel(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-hire-employee]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-hire-employee");
      const ok = hireEmployee(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-buy-business-stock]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-buy-business-stock");
      const ok = buyBusinessStock(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-upgrade-quality]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-upgrade-quality");
      const ok = upgradeQuality(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-upgrade-marketing]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-upgrade-marketing");
      const ok = upgradeMarketing(id);
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-buy-football-player]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ok = buyFootballPlayer();
      if (ok) renderBusinessPremiumPage();
    });
  });

  document.querySelectorAll("[data-buy-football-trainer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ok = buyFootballTrainer();
      if (ok) renderBusinessPremiumPage();
    });
  });
}
