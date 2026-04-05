import { AppState, updatePlayer } from "./app.js";
import { removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// ======================================================
// CARD THEMES
// ======================================================
export const CARD_THEMES = [
  {
    id: "classic_blue",
    name: "Classic Blue",
    price: 0,
    tier: "basic",
    colors: {
      background: "linear-gradient(135deg, #1f5fff 0%, #1647d1 48%, #0d2f8a 100%)",
      glow: "0 26px 60px rgba(16,50,150,0.38)",
      text: "#ffffff",
      chip: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.42))"
    },
    perks: [
      "Базовий стиль",
      "Чистий банківський вигляд",
      "Без бонусу"
    ],
    bonus: {
      clickBoost: 0,
      prestige: 0
    }
  },

  {
    id: "black_elite",
    name: "Black Elite",
    price: 75000,
    tier: "premium",
    colors: {
      background: "linear-gradient(135deg, #0a0d12 0%, #11161d 48%, #1b2430 100%)",
      glow: "0 28px 70px rgba(0,0,0,0.48)",
      text: "#f8fbff",
      chip: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(200,200,200,0.35))"
    },
    perks: [
      "Black premium look",
      "Статусний вигляд профілю",
      "+1 prestige"
    ],
    bonus: {
      clickBoost: 1,
      prestige: 1
    }
  },

  {
    id: "gold_luxe",
    name: "Gold Luxe",
    price: 180000,
    tier: "premium",
    colors: {
      background: "linear-gradient(135deg, #9b6b00 0%, #c99711 35%, #f1cd54 70%, #8f5f00 100%)",
      glow: "0 28px 70px rgba(210,162,44,0.34)",
      text: "#17120a",
      chip: "linear-gradient(180deg, rgba(255,247,205,0.95), rgba(255,214,97,0.65))"
    },
    perks: [
      "Золотий стиль",
      "Дорожчий вигляд профілю",
      "+2 prestige"
    ],
    bonus: {
      clickBoost: 2,
      prestige: 2
    }
  },

  {
    id: "neon_pulse",
    name: "Neon Pulse",
    price: 220000,
    tier: "premium",
    colors: {
      background: "linear-gradient(135deg, #120a2b 0%, #1d0f47 25%, #0d183d 50%, #081724 100%)",
      glow: "0 30px 75px rgba(96,90,255,0.32)",
      text: "#f4fbff",
      chip: "linear-gradient(180deg, rgba(197,255,255,0.9), rgba(129,239,255,0.48))"
    },
    perks: [
      "Неоновий фінтех стиль",
      "Яскравий glow",
      "+2 click bonus"
    ],
    bonus: {
      clickBoost: 2,
      prestige: 1
    }
  },

  {
    id: "metal_titan",
    name: "Metal Titan",
    price: 260000,
    tier: "premium",
    colors: {
      background: "linear-gradient(135deg, #626a73 0%, #9ca6b2 35%, #626f7d 68%, #343b45 100%)",
      glow: "0 24px 62px rgba(130,145,161,0.26)",
      text: "#ffffff",
      chip: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(210,223,235,0.45))"
    },
    perks: [
      "Металевий стиль",
      "Солідний індустріальний вигляд",
      "+1 click bonus"
    ],
    bonus: {
      clickBoost: 1,
      prestige: 2
    }
  },

  {
    id: "ruby_red",
    name: "Ruby Red",
    price: 310000,
    tier: "premium",
    colors: {
      background: "linear-gradient(135deg, #4d0716 0%, #8d102d 35%, #d43b60 72%, #430512 100%)",
      glow: "0 28px 66px rgba(180,25,70,0.32)",
      text: "#fff7fa",
      chip: "linear-gradient(180deg, rgba(255,230,238,0.92), rgba(255,175,195,0.42))"
    },
    perks: [
      "Яскравий рубіновий стиль",
      "Преміальний акцент у профілі",
      "+2 prestige"
    ],
    bonus: {
      clickBoost: 1,
      prestige: 2
    }
  },

  {
    id: "ice_glass",
    name: "Ice Glass",
    price: 380000,
    tier: "elite",
    colors: {
      background: "linear-gradient(135deg, #88bdd0 0%, #d9f8ff 38%, #8fc8db 68%, #4f8ea5 100%)",
      glow: "0 28px 66px rgba(123,214,240,0.28)",
      text: "#082230",
      chip: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(198,248,255,0.5))"
    },
    perks: [
      "Скляний крижаний стиль",
      "Світлий fintech вигляд",
      "+3 prestige"
    ],
    bonus: {
      clickBoost: 1,
      prestige: 3
    }
  },

  {
    id: "mono_bankish",
    name: "Mono Dark",
    price: 450000,
    tier: "elite",
    colors: {
      background: "linear-gradient(135deg, #141414 0%, #1f1f1f 42%, #2b2b2b 78%, #121212 100%)",
      glow: "0 28px 70px rgba(0,0,0,0.44)",
      text: "#ffffff",
      chip: "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(210,210,210,0.42))"
    },
    perks: [
      "Темний банк-стиль",
      "Чистий premium look",
      "+2 click bonus",
      "+2 prestige"
    ],
    bonus: {
      clickBoost: 2,
      prestige: 2
    }
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
  bindCardsUI();
}

function ensureCardData() {
  const p = getPlayer();

  if (!p.card_theme || typeof p.card_theme !== "string") {
    p.card_theme = "classic_blue";
  }

  if (!Array.isArray(p.card_themes_owned)) {
    p.card_themes_owned = ["classic_blue"];
  }

  if (!p.card_cosmetics || typeof p.card_cosmetics !== "object" || Array.isArray(p.card_cosmetics)) {
    p.card_cosmetics = {
      total_spent: 0,
      custom_name: p.card_name || p.username || "Player",
      custom_tag: "BITBANK",
      metallic_level: 0
    };
  }
}

function saveCardData() {
  const p = getPlayer();

  updatePlayer({
    card_theme: p.card_theme,
    card_themes_owned: p.card_themes_owned,
    card_cosmetics: p.card_cosmetics,
    card_name: p.card_name
  });
}

function getCurrentTheme() {
  ensureCardData();

  const current = getPlayer().card_theme || "classic_blue";
  return CARD_THEMES.find((x) => x.id === current) || CARD_THEMES[0];
}

export function getCurrentCardTheme() {
  return getCurrentTheme();
}

export function getCardThemeBonus() {
  return getCurrentTheme().bonus || { clickBoost: 0, prestige: 0 };
}

function getTheme(themeId) {
  return CARD_THEMES.find((x) => x.id === themeId) || null;
}

function themeOwned(themeId) {
  ensureCardData();
  return getPlayer().card_themes_owned.includes(themeId);
}

// ======================================================
// ACTIONS
// ======================================================
export async function buyCardTheme(themeId) {
  ensureCardData();

  const p = getPlayer();
  const theme = getTheme(themeId);

  if (!theme) {
    alert("Тема не знайдена");
    return false;
  }

  if (themeOwned(themeId)) {
    alert("Тема вже куплена");
    return false;
  }

  const ok = removeBalance(theme.price);
  if (!ok) {
    alert("Недостатньо грошей");
    return false;
  }

  p.card_themes_owned.push(themeId);
  p.card_cosmetics.total_spent = numberValue(p.card_cosmetics.total_spent) + numberValue(theme.price);

  saveCardData();

  await apiAddHistory(p.username, `Buy card theme: ${theme.name}`, -theme.price);
  return true;
}

export async function applyCardTheme(themeId) {
  ensureCardData();

  const p = getPlayer();
  const theme = getTheme(themeId);

  if (!theme) {
    alert("Тема не знайдена");
    return false;
  }

  if (!themeOwned(themeId)) {
    alert("Спочатку купи тему");
    return false;
  }

  p.card_theme = themeId;
  saveCardData();

  await apiAddHistory(p.username, `Apply card theme: ${theme.name}`, 0);
  return true;
}

export async function updateCardCustomName() {
  ensureCardData();

  const p = getPlayer();
  const input = document.getElementById("card-custom-name-input");
  const value = String(input?.value || "").trim();

  if (!value) {
    alert("Введи ім’я картки");
    return false;
  }

  p.card_name = value;
  p.card_cosmetics.custom_name = value;

  saveCardData();
  await apiAddHistory(p.username, "Update card custom name", 0);
  return true;
}

export async function updateCardCustomTag() {
  ensureCardData();

  const p = getPlayer();
  const input = document.getElementById("card-custom-tag-input");
  const value = String(input?.value || "").trim();

  if (!value) {
    alert("Введи тег");
    return false;
  }

  p.card_cosmetics.custom_tag = value;

  saveCardData();
  await apiAddHistory(p.username, "Update card custom tag", 0);
  return true;
}

// ======================================================
// RENDER HELPERS
// ======================================================
function previewCard(theme, active = false, owned = false) {
  const p = getPlayer();
  const cardName = p.card_cosmetics?.custom_name || p.card_name || p.username || "Player";
  const cardTag = p.card_cosmetics?.custom_tag || "BITBANK";

  return `
    <div
      style="
        min-height:220px;
        border-radius:28px;
        padding:22px;
        box-shadow:${theme.colors.glow};
        background:${theme.colors.background};
        color:${theme.colors.text};
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        border:${active ? "2px solid rgba(255,255,255,.35)" : "1px solid rgba(255,255,255,.08)"};
      "
    >
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <div>
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.8;margin-bottom:8px;">
            ${cardTag}
          </div>
          <div style="font-size:26px;font-weight:800;line-height:1.1;">
            ${theme.name}
          </div>
        </div>

        <div
          style="
            width:56px;
            height:40px;
            border-radius:12px;
            background:${theme.colors.chip};
            flex-shrink:0;
          "
        ></div>
      </div>

      <div style="font-size:22px;font-weight:900;letter-spacing:.18em;">
        ${p.card_number || "0000 0000 0000 0000"}
      </div>

      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <div>
          <div style="font-size:11px;opacity:.78;margin-bottom:4px;">holder</div>
          <div style="font-size:15px;font-weight:700;">${cardName}</div>
        </div>

        <div>
          <div style="font-size:11px;opacity:.78;margin-bottom:4px;">cvv</div>
          <div style="font-size:15px;font-weight:700;">${p.card_cvv || "000"}</div>
        </div>

        <div>
          <div style="font-size:11px;opacity:.78;margin-bottom:4px;">exp</div>
          <div style="font-size:15px;font-weight:700;">${p.card_expiry || "12/30"}</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px;">
        <span style="padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.13);font-size:12px;font-weight:700;">
          ${theme.tier}
        </span>
        <span style="padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.13);font-size:12px;font-weight:700;">
          ${active ? "ACTIVE" : owned ? "OWNED" : "LOCKED"}
        </span>
      </div>
    </div>
  `;
}

function themeCard(theme) {
  const active = getPlayer().card_theme === theme.id;
  const owned = themeOwned(theme.id);

  return `
    <div class="card asset-card">
      ${previewCard(theme, active, owned)}

      <div class="asset-info" style="margin-top:14px;">
        <div class="asset-head">
          <div class="asset-name">${theme.name}</div>
          <div class="asset-price">₴ ${formatCompact(theme.price)}</div>
        </div>

        <div class="asset-meta">
          <span>${theme.tier}</span>
          <span>Click +${numberValue(theme.bonus.clickBoost || 0)}</span>
          <span>Prestige +${numberValue(theme.bonus.prestige || 0)}</span>
        </div>

        <div class="titles-list" style="margin-top:10px;">
          ${theme.perks.map((perk) => `<div class="title-pill">${perk}</div>`).join("")}
        </div>

        <div class="asset-actions" style="margin-top:14px;">
          <button
            ${owned ? "disabled" : ""}
            data-buy-card-theme="${theme.id}"
          >
            ${owned ? "Owned" : `Buy for ₴ ${formatCompact(theme.price)}`}
          </button>

          <button
            class="secondary"
            ${!owned || active ? "disabled" : ""}
            data-apply-card-theme="${theme.id}"
          >
            ${active ? "Active Theme" : "Apply Theme"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function cardSummaryPanel() {
  ensureCardData();

  const theme = getCurrentTheme();
  const bonus = getCardThemeBonus();
  const cosmetics = getPlayer().card_cosmetics || {};

  return `
    <div class="dashboard-grid">
      <div class="card">
        <h3>Current Card</h3>
        ${previewCard(theme, true, true)}
      </div>

      <div class="card">
        <h3>Card Stats</h3>
        <p><span class="muted">Theme:</span> ${theme.name}</p>
        <p><span class="muted">Owned themes:</span> ${getPlayer().card_themes_owned.length}</p>
        <p><span class="muted">Spent on cosmetics:</span> ₴ ${formatMoney(cosmetics.total_spent || 0)}</p>
        <p><span class="muted">Click bonus:</span> +${numberValue(bonus.clickBoost || 0)}</p>
        <p><span class="muted">Prestige:</span> +${numberValue(bonus.prestige || 0)}</p>
      </div>
    </div>
  `;
}

function customCardControls() {
  const cosmetics = getPlayer().card_cosmetics || {};

  return `
    <div class="asset-grid">
      <div class="card">
        <h3>Custom Name</h3>
        <div class="profile-actions">
          <input id="card-custom-name-input" value="${cosmetics.custom_name || getPlayer().card_name || ""}" placeholder="Card holder name">
          <button id="save-card-name-btn">Save Name</button>
        </div>
      </div>

      <div class="card">
        <h3>Custom Tag</h3>
        <div class="profile-actions">
          <input id="card-custom-tag-input" value="${cosmetics.custom_tag || "BITBANK"}" placeholder="Card tag">
          <button id="save-card-tag-btn">Save Tag</button>
        </div>
      </div>
    </div>
  `;
}

// ======================================================
// MAIN PAGE
// ======================================================
export function renderCardsPage() {
  ensureCardData();
  document.body.dataset.currentPage = "cards";

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Card Designs</h2>
      <p>Купуй стилі карток, застосовуй преміальні теми, кастомізуй ім’я і тег картки для свого профілю.</p>
    </div>

    ${cardSummaryPanel()}

    <div class="section-title">Card Customization</div>
    ${customCardControls()}

    <div class="section-title">Available Card Themes</div>
    <div class="asset-grid">
      ${CARD_THEMES.map(themeCard).join("")}
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindCardsUI() {
  document.querySelectorAll("[data-buy-card-theme]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-buy-card-theme");
      const ok = await buyCardTheme(id);
      if (ok) {
        renderCardsPage();
      }
    });
  });

  document.querySelectorAll("[data-apply-card-theme]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-apply-card-theme");
      const ok = await applyCardTheme(id);
      if (ok) {
        renderCardsPage();
      }
    });
  });

  const saveNameBtn = document.getElementById("save-card-name-btn");
  if (saveNameBtn) {
    saveNameBtn.addEventListener("click", async () => {
      const ok = await updateCardCustomName();
      if (ok) {
        renderCardsPage();
      }
    });
  }

  const saveTagBtn = document.getElementById("save-card-tag-btn");
  if (saveTagBtn) {
    saveTagBtn.addEventListener("click", async () => {
      const ok = await updateCardCustomTag();
      if (ok) {
        renderCardsPage();
      }
    });
  }
}
