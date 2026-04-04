import { AppState } from "./app.js";
import { apiGetHistory } from "./api.js";
import { t, renderLanguageSwitcher, bindLanguageSwitcher } from "./i18n.js";

// =====================
// HELPERS
// =====================
function getPlayer() {
  return AppState.player || {};
}

function formatMoney(n) {
  const value = Number(n || 0);
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.floor(value).toLocaleString("en-US")}`;
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function amountClass(amount) {
  if (Number(amount || 0) > 0) return "green";
  if (Number(amount || 0) < 0) return "red";
  return "muted";
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindHistoryUI();
}

function summaryCards(history) {
  const totalOps = history.length;
  const income = history
    .filter((x) => Number(x.amount || 0) > 0)
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const expense = history
    .filter((x) => Number(x.amount || 0) < 0)
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">${t("history")}</div>
        <div class="stat-value">${totalOps}</div>
        <div class="stat-sub">Total operations</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Income</div>
        <div class="stat-value green">${Math.floor(income).toLocaleString("en-US")}</div>
        <div class="stat-sub">Positive flow</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Expense</div>
        <div class="stat-value red">${Math.floor(expense).toLocaleString("en-US")}</div>
        <div class="stat-sub">Negative flow</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">${t("balance")}</div>
        <div class="stat-value blue">₴ ${Math.floor(getPlayer().balance || 0).toLocaleString("en-US")}</div>
        <div class="stat-sub">Current account balance</div>
      </div>
    </div>
  `;
}

function historyRow(item) {
  return `
    <div class="card" style="padding:14px 16px;">
      <div class="asset-head">
        <div class="asset-name" style="font-size:17px;">${item.text || t("noData")}</div>
        <div class="asset-price ${amountClass(item.amount)}">${formatMoney(item.amount)}</div>
      </div>

      <div class="asset-meta" style="margin-top:10px;">
        <span>${t("date")}: ${formatDate(item.created_at)}</span>
        <span>${t("amount")}: ${formatMoney(item.amount)}</span>
      </div>
    </div>
  `;
}

// =====================
// RENDER
// =====================
export async function renderHistoryPage() {
  document.body.dataset.currentPage = "history";

  const username = getPlayer().username;
  const history = await apiGetHistory(username);

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>${t("historyTitle")}</h2>
      <p>Full transaction feed for your premium account.</p>
    </div>

    ${renderLanguageSwitcher()}
    ${summaryCards(history)}

    <div class="section-title">${t("history")}</div>

    <div class="asset-grid">
      ${
        history.length
          ? history.map(historyRow).join("")
          : `
            <div class="card" style="grid-column:1 / -1;">
              <h3>${t("noHistory")}</h3>
              <p>${t("noData")}</p>
            </div>
          `
      }
    </div>
  `);
}

// =====================
// BIND
// =====================
function bindHistoryUI() {
  bindLanguageSwitcher(() => {
    renderHistoryPage();
  });
}
