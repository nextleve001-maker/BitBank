import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";

// ======================================================
// CONFIG
// ======================================================
export const FINANCE_CONFIG = {
  deposit: {
    uah: {
      minAmount: 1000,
      annualRate: 0.18,
      termsDays: [7, 14, 30, 60, 90],
      earlyClosePenaltyRate: 0.08
    },
    usd: {
      minAmount: 50,
      annualRate: 0.08,
      termsDays: [7, 14, 30, 60, 90],
      earlyClosePenaltyRate: 0.04
    }
  },

  credit: {
    minAmount: 5000,
    maxAmount: 5000000,
    baseDailyRate: 0.0025,
    latePenaltyDailyRate: 0.01,
    termsDays: [7, 14, 30, 60]
  },

  maintenance: {
    carBaseDailyRate: 0.002,
    realtyBaseDailyRate: 0.0015
  },

  tax: {
    passiveTaxRate: 0.03,
    businessTaxRate: 0.04
  }
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

function nowMs() {
  return Date.now();
}

function nowIso() {
  return new Date().toISOString();
}

function dayMs() {
  return 24 * 60 * 60 * 1000;
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
  bindFinanceUI();
}

function classDiscountFactor() {
  const cls = String(getPlayer().class || "none");

  if (cls === "silver") return 0.98;
  if (cls === "gold") return 0.96;
  if (cls === "platinum") return 0.94;
  if (cls === "diamond") return 0.92;
  if (cls === "black") return 0.9;
  if (cls === "vip") return 0.88;
  if (cls === "legend") return 0.85;
  if (cls === "creator") return 0.8;

  return 1;
}

function classDepositBonus() {
  const cls = String(getPlayer().class || "none");

  if (cls === "silver") return 0.005;
  if (cls === "gold") return 0.01;
  if (cls === "platinum") return 0.015;
  if (cls === "diamond") return 0.02;
  if (cls === "black") return 0.025;
  if (cls === "vip") return 0.03;
  if (cls === "legend") return 0.04;
  if (cls === "creator") return 0.05;

  return 0;
}

function ensureFinanceData() {
  const p = getPlayer();

  if (!p.finances || typeof p.finances !== "object" || Array.isArray(p.finances)) {
    p.finances = {};
  }

  if (!Array.isArray(p.finances.deposits)) {
    p.finances.deposits = [];
  }

  if (!safeObject(p.finances.credit).principal) {
    p.finances.credit = {
      principal: 0,
      dueAmount: 0,
      dailyRate: 0,
      latePenaltyDailyRate: 0,
      takenAt: null,
      dueAt: null,
      lastInterestTickAt: nowIso(),
      isActive: false
    };
  }

  if (!safeObject(p.finances.stats).total_tax_paid) {
    p.finances.stats = {
      total_tax_paid: 0,
      total_maintenance_paid: 0,
      total_interest_paid: 0,
      total_deposit_profit: 0
    };
  }

  if (!p.finances.lastFinanceTickAt) {
    p.finances.lastFinanceTickAt = nowIso();
  }
}

function getFinances() {
  ensureFinanceData();
  return getPlayer().finances;
}

function saveFinances() {
  updatePlayer({
    finances: getPlayer().finances
  });
}

function getDeposits() {
  return safeArray(getFinances().deposits);
}

function getCredit() {
  return safeObject(getFinances().credit);
}

function getFinanceStats() {
  return safeObject(getFinances().stats);
}

function addStat(field, amount) {
  const stats = getFinanceStats();
  stats[field] = numberValue(stats[field]) + numberValue(amount);
  getFinances().stats = stats;
}

function getCarsArray() {
  return safeArray(getPlayer().cars);
}

function getRealtyArray() {
  return safeArray(getPlayer().realty);
}

function carMaintenancePerDay() {
  const cars = getCarsArray();

  let total = 0;

  cars.forEach((car) => {
    if (typeof car === "object" && car !== null) {
      total += Math.max(200, numberValue(car.price || car.value || 0) * FINANCE_CONFIG.maintenance.carBaseDailyRate);
    } else {
      total += 500;
    }
  });

  return total;
}

function realtyMaintenancePerDay() {
  const realty = getRealtyArray();

  let total = 0;

  realty.forEach((item) => {
    if (typeof item === "object" && item !== null) {
      total += Math.max(350, numberValue(item.price || item.value || 0) * FINANCE_CONFIG.maintenance.realtyBaseDailyRate);
    } else {
      total += 800;
    }
  });

  return total;
}

function totalMaintenancePerDay() {
  return carMaintenancePerDay() + realtyMaintenancePerDay();
}

function businessTaxPerDay() {
  const projects = safeObject(getPlayer().business_projects);

  let dailyIncome = 0;

  Object.values(projects).forEach((state) => {
    if (!state || !state.unlocked) return;

    const level = numberValue(state.level || 1);
    dailyIncome += 500 * level;
  });

  return dailyIncome * FINANCE_CONFIG.tax.businessTaxRate;
}

function passiveTaxPerDay() {
  const totalAssets = numberValue(getPlayer().balance || 0) + numberValue(getPlayer().usd || 0) * 40;
  if (totalAssets <= 100000) return 0;
  return totalAssets * FINANCE_CONFIG.tax.passiveTaxRate / 30;
}

function daysBetweenMs(fromMs, toMs) {
  return Math.max(0, (toMs - fromMs) / dayMs());
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

// ======================================================
// DEPOSITS
// ======================================================
function depositAnnualRate(currency) {
  const base = currency === "USD"
    ? FINANCE_CONFIG.deposit.usd.annualRate
    : FINANCE_CONFIG.deposit.uah.annualRate;

  return base + classDepositBonus();
}

function depositMin(currency) {
  return currency === "USD"
    ? FINANCE_CONFIG.deposit.usd.minAmount
    : FINANCE_CONFIG.deposit.uah.minAmount;
}

function depositTerms(currency) {
  return currency === "USD"
    ? FINANCE_CONFIG.deposit.usd.termsDays
    : FINANCE_CONFIG.deposit.uah.termsDays;
}

function depositPenaltyRate(currency) {
  return currency === "USD"
    ? FINANCE_CONFIG.deposit.usd.earlyClosePenaltyRate
    : FINANCE_CONFIG.deposit.uah.earlyClosePenaltyRate;
}

export async function createDeposit(currency, amountRaw, termDaysRaw) {
  ensureFinanceData();

  const p = getPlayer();
  const amount = numberValue(amountRaw);
  const termDays = numberValue(termDaysRaw);
  const curr = String(currency || "").toUpperCase();

  if (!["UAH", "USD"].includes(curr)) {
    alert("Невірна валюта");
    return false;
  }

  if (!depositTerms(curr).includes(termDays)) {
    alert("Невірний строк депозиту");
    return false;
  }

  if (amount < depositMin(curr)) {
    alert("Сума замала");
    return false;
  }

  if (curr === "UAH") {
    if (numberValue(p.balance) < amount) {
      alert("Недостатньо UAH");
      return false;
    }
    p.balance = numberValue(p.balance) - amount;
  } else {
    if (numberValue(p.usd) < amount) {
      alert("Недостатньо USD");
      return false;
    }
    p.usd = numberValue(p.usd) - amount;
  }

  const annualRate = depositAnnualRate(curr);
  const expectedProfit = amount * annualRate * (termDays / 365);

  getDeposits().push({
    id: `dep_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    currency: curr,
    amount,
    annualRate,
    termDays,
    createdAt: nowIso(),
    matureAt: new Date(nowMs() + termDays * dayMs()).toISOString(),
    expectedProfit,
    isClosed: false
  });

  await updatePlayer({
    balance: p.balance,
    usd: p.usd,
    finances: p.finances
  });

  await apiAddHistory(p.username, `Create ${curr} deposit`, -amount);
  return true;
}

export async function claimDeposit(depositId) {
  ensureFinanceData();

  const p = getPlayer();
  const deposits = getDeposits();
  const dep = deposits.find((x) => x.id === depositId);

  if (!dep || dep.isClosed) {
    alert("Депозит не знайдено");
    return false;
  }

  if (new Date(dep.matureAt).getTime() > nowMs()) {
    alert("Депозит ще не дозрів");
    return false;
  }

  const reward = numberValue(dep.amount) + numberValue(dep.expectedProfit);

  if (dep.currency === "UAH") {
    p.balance = numberValue(p.balance) + reward;
  } else {
    p.usd = numberValue(p.usd) + reward;
  }

  dep.isClosed = true;
  addStat("total_deposit_profit", dep.expectedProfit);

  await updatePlayer({
    balance: p.balance,
    usd: p.usd,
    finances: p.finances
  });

  await apiAddHistory(p.username, `Claim ${dep.currency} deposit`, reward);
  return true;
}

export async function closeDepositEarly(depositId) {
  ensureFinanceData();

  const p = getPlayer();
  const deposits = getDeposits();
  const dep = deposits.find((x) => x.id === depositId);

  if (!dep || dep.isClosed) {
    alert("Депозит не знайдено");
    return false;
  }

  const penalty = numberValue(dep.amount) * depositPenaltyRate(dep.currency);
  const refund = Math.max(0, numberValue(dep.amount) - penalty);

  if (dep.currency === "UAH") {
    p.balance = numberValue(p.balance) + refund;
  } else {
    p.usd = numberValue(p.usd) + refund;
  }

  dep.isClosed = true;

  await updatePlayer({
    balance: p.balance,
    usd: p.usd,
    finances: p.finances
  });

  await apiAddHistory(p.username, `Early close ${dep.currency} deposit`, refund);
  return true;
}

// ======================================================
// CREDIT
// ======================================================
function maxCreditAvailable() {
  const p = getPlayer();
  const assets = numberValue(p.balance || 0) + numberValue(totalMaintenancePerDay()) * 30;
  return Math.max(FINANCE_CONFIG.credit.minAmount, Math.min(FINANCE_CONFIG.credit.maxAmount, assets + 250000));
}

export async function takeCredit(amountRaw, termDaysRaw) {
  ensureFinanceData();

  const p = getPlayer();
  const credit = getCredit();
  const amount = numberValue(amountRaw);
  const termDays = numberValue(termDaysRaw);

  if (credit.isActive) {
    alert("У тебе вже є активний кредит");
    return false;
  }

  if (!FINANCE_CONFIG.credit.termsDays.includes(termDays)) {
    alert("Невірний строк кредиту");
    return false;
  }

  if (amount < FINANCE_CONFIG.credit.minAmount) {
    alert("Сума замала");
    return false;
  }

  if (amount > maxCreditAvailable()) {
    alert("Перевищено доступний ліміт");
    return false;
  }

  const dailyRate = FINANCE_CONFIG.credit.baseDailyRate * classDiscountFactor();
  const dueAmount = amount * (1 + dailyRate * termDays);

  credit.principal = amount;
  credit.dueAmount = dueAmount;
  credit.dailyRate = dailyRate;
  credit.latePenaltyDailyRate = FINANCE_CONFIG.credit.latePenaltyDailyRate;
  credit.takenAt = nowIso();
  credit.dueAt = new Date(nowMs() + termDays * dayMs()).toISOString();
  credit.lastInterestTickAt = nowIso();
  credit.isActive = true;

  p.balance = numberValue(p.balance) + amount;

  await updatePlayer({
    balance: p.balance,
    finances: p.finances
  });

  await apiAddHistory(p.username, "Take credit", amount);
  return true;
}

export async function repayCredit(amountRaw) {
  ensureFinanceData();

  const p = getPlayer();
  const credit = getCredit();
  const amount = numberValue(amountRaw);

  if (!credit.isActive) {
    alert("Немає активного кредиту");
    return false;
  }

  if (amount <= 0) {
    alert("Невірна сума");
    return false;
  }

  if (numberValue(p.balance) < amount) {
    alert("Недостатньо UAH");
    return false;
  }

  const pay = Math.min(amount, numberValue(credit.dueAmount));

  p.balance = numberValue(p.balance) - pay;
  credit.dueAmount = Math.max(0, numberValue(credit.dueAmount) - pay);

  if (credit.dueAmount <= 0.01) {
    credit.principal = 0;
    credit.dueAmount = 0;
    credit.dailyRate = 0;
    credit.latePenaltyDailyRate = 0;
    credit.takenAt = null;
    credit.dueAt = null;
    credit.lastInterestTickAt = nowIso();
    credit.isActive = false;
  }

  await updatePlayer({
    balance: p.balance,
    finances: p.finances
  });

  await apiAddHistory(p.username, "Repay credit", -pay);
  return true;
}

// ======================================================
// PERIODIC FINANCE TICK
// ======================================================
export async function financeTick() {
  ensureFinanceData();

  const p = getPlayer();
  const finances = getFinances();
  const credit = getCredit();

  const lastTickAt = new Date(finances.lastFinanceTickAt).getTime();
  const current = nowMs();

  if (Number.isNaN(lastTickAt)) {
    finances.lastFinanceTickAt = nowIso();
    saveFinances();
    return;
  }

  const elapsedDays = daysBetweenMs(lastTickAt, current);
  if (elapsedDays < 0.25) {
    return;
  }

  let totalTax = 0;
  let totalMaintenance = 0;
  let totalInterest = 0;

  const maintenanceCost = totalMaintenancePerDay() * elapsedDays;
  const passiveTaxCost = passiveTaxPerDay() * elapsedDays;
  const businessTaxCost = businessTaxPerDay() * elapsedDays;

  totalMaintenance += maintenanceCost;
  totalTax += passiveTaxCost + businessTaxCost;

  p.balance = Math.max(0, numberValue(p.balance) - maintenanceCost - passiveTaxCost - businessTaxCost);

  if (credit.isActive) {
    const dueAtMs = new Date(credit.dueAt).getTime();

    if (current <= dueAtMs) {
      const interestGrow = numberValue(credit.dueAmount) * numberValue(credit.dailyRate) * elapsedDays;
      credit.dueAmount += interestGrow;
      totalInterest += interestGrow;
    } else {
      const lateInterest = numberValue(credit.dueAmount) * numberValue(credit.latePenaltyDailyRate) * elapsedDays;
      credit.dueAmount += lateInterest;
      totalInterest += lateInterest;
    }
  }

  addStat("total_tax_paid", totalTax);
  addStat("total_maintenance_paid", totalMaintenance);
  addStat("total_interest_paid", totalInterest);

  finances.lastFinanceTickAt = nowIso();

  await updatePlayer({
    balance: p.balance,
    finances: p.finances
  });
}

// ======================================================
// RENDER HELPERS
// ======================================================
function depositCard(dep) {
  const matured = new Date(dep.matureAt).getTime() <= nowMs();
  const closed = !!dep.isClosed;

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${dep.currency} Deposit</div>
          <div class="asset-price">${dep.currency === "UAH" ? "₴" : "$"} ${formatCompact(dep.amount)}</div>
        </div>

        <div class="asset-meta">
          <span>Rate: ${(numberValue(dep.annualRate) * 100).toFixed(2)}%</span>
          <span>Term: ${dep.termDays}d</span>
          <span>Profit: ${dep.currency === "UAH" ? "₴" : "$"} ${formatCompact(dep.expectedProfit)}</span>
          <span>${closed ? "Closed" : matured ? "Matured" : "Active"}</span>
        </div>

        <p><span class="muted">Created:</span> ${new Date(dep.createdAt).toLocaleString()}</p>
        <p><span class="muted">Mature at:</span> ${new Date(dep.matureAt).toLocaleString()}</p>

        <div class="asset-actions">
          <button ${!matured || closed ? "disabled" : ""} data-claim-deposit="${dep.id}">Claim</button>
          <button class="secondary" ${closed ? "disabled" : ""} data-close-deposit="${dep.id}">Close Early</button>
        </div>
      </div>
    </div>
  `;
}

function financeSummary() {
  const p = getPlayer();
  const profile = getFinances();
  const credit = getCredit();
  const stats = getFinanceStats();

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">UAH</div>
        <div class="stat-value green">₴ ${formatCompact(p.balance)}</div>
        <div class="stat-sub">Liquid balance</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">USD</div>
        <div class="stat-value blue">$ ${formatCompact(p.usd)}</div>
        <div class="stat-sub">Reserve balance</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Deposits</div>
        <div class="stat-value">${getDeposits().filter((x) => !x.isClosed).length}</div>
        <div class="stat-sub">Open deposits</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Credit Due</div>
        <div class="stat-value orange">₴ ${formatCompact(credit.dueAmount || 0)}</div>
        <div class="stat-sub">${credit.isActive ? "Active credit" : "No active credit"}</div>
      </div>
    </div>

    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);margin-top:16px;">
      <div class="card stat-card">
        <div class="stat-label">Taxes Paid</div>
        <div class="stat-value">₴ ${formatCompact(stats.total_tax_paid || 0)}</div>
        <div class="stat-sub">All-time tax outflow</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Maintenance</div>
        <div class="stat-value">₴ ${formatCompact(stats.total_maintenance_paid || 0)}</div>
        <div class="stat-sub">Cars + realty upkeep</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Interest Paid</div>
        <div class="stat-value red">₴ ${formatCompact(stats.total_interest_paid || 0)}</div>
        <div class="stat-sub">Credit interest + penalties</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Deposit Profit</div>
        <div class="stat-value green">₴ ${formatCompact(stats.total_deposit_profit || 0)}</div>
        <div class="stat-sub">Earned from deposits</div>
      </div>
    </div>
  `;
}

// ======================================================
// MAIN RENDER
// ======================================================
export function renderFinancePage() {
  ensureFinanceData();

  const credit = getCredit();
  const deposits = getDeposits();

  document.body.dataset.currentPage = "finance";

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Finance Center</h2>
      <p>Депозити, кредити, відсотки, прострочки, податки та витрати на активи в одному модулі.</p>
    </div>

    ${financeSummary()}

    <div class="section-title">Create Deposit</div>

    <div class="asset-grid">
      <div class="card">
        <h3>UAH Deposit</h3>
        <p class="muted" style="margin-bottom:12px;">Annual rate: ${(depositAnnualRate("UAH") * 100).toFixed(2)}%</p>
        <div class="profile-actions">
          <input id="dep-uah-amount" type="number" placeholder="Amount UAH">
          <select id="dep-uah-term">
            ${depositTerms("UAH").map((d) => `<option value="${d}">${d} days</option>`).join("")}
          </select>
          <button id="create-uah-deposit-btn">Open UAH Deposit</button>
        </div>
      </div>

      <div class="card">
        <h3>USD Deposit</h3>
        <p class="muted" style="margin-bottom:12px;">Annual rate: ${(depositAnnualRate("USD") * 100).toFixed(2)}%</p>
        <div class="profile-actions">
          <input id="dep-usd-amount" type="number" placeholder="Amount USD">
          <select id="dep-usd-term">
            ${depositTerms("USD").map((d) => `<option value="${d}">${d} days</option>`).join("")}
          </select>
          <button id="create-usd-deposit-btn">Open USD Deposit</button>
        </div>
      </div>
    </div>

    <div class="section-title">Credit</div>

    <div class="asset-grid">
      <div class="card">
        <h3>Take Credit</h3>
        <p class="muted" style="margin-bottom:12px;">
          Max available: ₴ ${formatMoney(maxCreditAvailable())}
        </p>
        <div class="profile-actions">
          <input id="credit-amount" type="number" placeholder="Credit amount">
          <select id="credit-term">
            ${FINANCE_CONFIG.credit.termsDays.map((d) => `<option value="${d}">${d} days</option>`).join("")}
          </select>
          <button id="take-credit-btn" ${credit.isActive ? "disabled" : ""}>Take Credit</button>
        </div>
      </div>

      <div class="card">
        <h3>Repay Credit</h3>
        <p><span class="muted">Principal:</span> ₴ ${formatMoney(credit.principal || 0)}</p>
        <p><span class="muted">Due amount:</span> ₴ ${formatMoney(credit.dueAmount || 0)}</p>
        <p><span class="muted">Due at:</span> ${credit.dueAt ? new Date(credit.dueAt).toLocaleString() : "—"}</p>
        <div class="profile-actions" style="margin-top:12px;">
          <input id="repay-credit-amount" type="number" placeholder="Repay amount">
          <button id="repay-credit-btn" ${!credit.isActive ? "disabled" : ""}>Repay</button>
        </div>
      </div>
    </div>

    <div class="section-title">Taxes & Maintenance</div>

    <div class="asset-grid">
      <div class="card">
        <h3>Daily Taxes</h3>
        <p><span class="muted">Passive tax / day:</span> ₴ ${formatMoney(passiveTaxPerDay())}</p>
        <p><span class="muted">Business tax / day:</span> ₴ ${formatMoney(businessTaxPerDay())}</p>
      </div>

      <div class="card">
        <h3>Daily Maintenance</h3>
        <p><span class="muted">Cars / day:</span> ₴ ${formatMoney(carMaintenancePerDay())}</p>
        <p><span class="muted">Realty / day:</span> ₴ ${formatMoney(realtyMaintenancePerDay())}</p>
        <p><span class="muted">Total / day:</span> ₴ ${formatMoney(totalMaintenancePerDay())}</p>
      </div>

      <div class="card">
        <h3>Manual Finance Tick</h3>
        <p>Запускає обробку податків, утримання і відсотків прямо зараз.</p>
        <div class="profile-actions" style="margin-top:12px;">
          <button id="manual-finance-tick-btn">Run Finance Tick</button>
        </div>
      </div>
    </div>

    <div class="section-title">Deposits</div>
    <div class="asset-grid">
      ${
        deposits.length
          ? deposits.map(depositCard).join("")
          : `
            <div class="card" style="grid-column:1 / -1;">
              <h3>No Deposits Yet</h3>
              <p>Open your first deposit above.</p>
            </div>
          `
      }
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindFinanceUI() {
  const bind = (id, handler) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", handler);
  };

  bind("create-uah-deposit-btn", async () => {
    const ok = await createDeposit(
      "UAH",
      getInputValue("dep-uah-amount"),
      getInputValue("dep-uah-term")
    );
    if (ok) renderFinancePage();
  });

  bind("create-usd-deposit-btn", async () => {
    const ok = await createDeposit(
      "USD",
      getInputValue("dep-usd-amount"),
      getInputValue("dep-usd-term")
    );
    if (ok) renderFinancePage();
  });

  bind("take-credit-btn", async () => {
    const ok = await takeCredit(
      getInputValue("credit-amount"),
      getInputValue("credit-term")
    );
    if (ok) renderFinancePage();
  });

  bind("repay-credit-btn", async () => {
    const ok = await repayCredit(getInputValue("repay-credit-amount"));
    if (ok) renderFinancePage();
  });

  bind("manual-finance-tick-btn", async () => {
    await financeTick();
    renderFinancePage();
  });

  document.querySelectorAll("[data-claim-deposit]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-claim-deposit");
      const ok = await claimDeposit(id);
      if (ok) renderFinancePage();
    });
  });

  document.querySelectorAll("[data-close-deposit]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-close-deposit");
      const ok = await closeDepositEarly(id);
      if (ok) renderFinancePage();
    });
  });
}
