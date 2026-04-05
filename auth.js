import { startApp, saveSession } from "./app.js";
import {
  apiGetPlayer,
  apiCreatePlayer,
  apiEnsureAdminExists
} from "./api.js";

// ======================================================
// HELPERS
// ======================================================
function $(id) {
  return document.getElementById(id);
}

function setMessage(text, isError = true) {
  const box = $("auth-message");
  if (!box) return;

  box.textContent = text || "";
  box.style.color = isError ? "#ffb7c2" : "#9ff0b8";
}

function clearMessage() {
  setMessage("", true);
}

function showLoginForm() {
  const loginTab = $("tab-login");
  const registerTab = $("tab-register");
  const registerExtra = $("register-extra");

  if (loginTab) loginTab.classList.add("active");
  if (registerTab) registerTab.classList.remove("active");
  if (registerExtra) registerExtra.classList.add("hidden");
}

function showRegisterForm() {
  const loginTab = $("tab-login");
  const registerTab = $("tab-register");
  const registerExtra = $("register-extra");

  if (loginTab) loginTab.classList.remove("active");
  if (registerTab) registerTab.classList.add("active");
  if (registerExtra) registerExtra.classList.remove("hidden");
}

function isRegisterMode() {
  return $("tab-register")?.classList.contains("active");
}

function getInputValue(id) {
  return String($(id)?.value || "").trim();
}

function detectDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "phone"
    : "desktop";
}

function generateCardNumber() {
  const parts = [];
  for (let i = 0; i < 4; i++) {
    parts.push(String(Math.floor(1000 + Math.random() * 9000)));
  }
  return parts.join(" ");
}

function generateExpiry() {
  const now = new Date();
  const year = String((now.getFullYear() + 3) % 100).padStart(2, "0");
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  return `${month}/${year}`;
}

function generateCVV() {
  return String(Math.floor(100 + Math.random() * 900));
}

function usernameValid(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function passwordValid(password) {
  return String(password || "").length >= 4;
}

function defaultPlayerPayload(username, password) {
  return {
    username,
    password,
    balance: 0,
    usd: 0,
    total_earned: 0,
    clicks: 0,
    class: "none",
    role: "none",
    device: detectDevice(),
    last_seen: new Date().toISOString(),
    banned: false,

    titles: [],
    inventory: [],
    friends: [],
    cars: [],
    realty: [],

    crypto: {},
    stocks: {},

    business_projects: {},

    card_name: username,
    card_number: generateCardNumber(),
    card_expiry: generateExpiry(),
    card_cvv: generateCVV(),
    card_theme: "classic_blue",
    card_themes_owned: ["classic_blue"],
    card_cosmetics: {
      total_spent: 0,
      custom_name: username,
      custom_tag: "BITBANK",
      metallic_level: 0
    },

    battle_profile: {
      wins: 0,
      losses: 0,
      rating: 1000,
      streak: 0,
      best_streak: 0,
      last_battle_at: null,
      unlocked_arena: 1
    },

    finances: {
      deposits: [],
      credit: {
        principal: 0,
        dueAmount: 0,
        dailyRate: 0,
        latePenaltyDailyRate: 0,
        takenAt: null,
        dueAt: null,
        lastInterestTickAt: new Date().toISOString(),
        isActive: false
      },
      stats: {
        total_tax_paid: 0,
        total_maintenance_paid: 0,
        total_interest_paid: 0,
        total_deposit_profit: 0
      },
      lastFinanceTickAt: new Date().toISOString()
    },

    loot_profile: {
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
    },

    casino_profile: {
      jackpot_bank: 500000,
      lottery_bank: 250000,
      daily_wheel_day: "",
      wheel_bonus_multiplier: 1,
      free_safes: 0,
      lottery_tickets: 0,
      safe_inventory: []
    },

    role_stats: {
      changes_count: 0,
      total_spent_on_roles: 0,
      selected_at: null,
      unlocked_roles: []
    },

    friends_meta: {
      last_search: "",
      notes: {}
    },

    collections_state: {
      claimed: {},
      completed_at: {}
    },

    history_meta: {
      filters: {},
      last_opened_at: null
    },

    is_admin: false
  };
}

// ======================================================
// LOGIN / REGISTER
// ======================================================
async function handleLogin() {
  clearMessage();

  const username = getInputValue("auth-username");
  const password = getInputValue("auth-password");

  if (!username || !password) {
    setMessage("Введи логін і пароль");
    return;
  }

  const player = await apiGetPlayer(username);

  if (!player) {
    setMessage("Акаунт не знайдено");
    return;
  }

  if (player.banned) {
    setMessage("Акаунт заблоковано");
    return;
  }

  if (String(player.password || "") !== password) {
    setMessage("Невірний пароль");
    return;
  }

  saveSession(username);
  setMessage("Успішний вхід", false);
  await startApp(username);
}

async function handleRegister() {
  clearMessage();

  const username = getInputValue("auth-username");
  const password = getInputValue("auth-password");

  if (!usernameValid(username)) {
    setMessage("Логін: 3-20 символів, тільки букви, цифри або _");
    return;
  }

  if (!passwordValid(password)) {
    setMessage("Пароль має бути мінімум 4 символи");
    return;
  }

  const exists = await apiGetPlayer(username);
  if (exists) {
    setMessage("Такий логін уже існує");
    return;
  }

  const payload = defaultPlayerPayload(username, password);
  const created = await apiCreatePlayer(payload);

  if (!created) {
    setMessage("Не вдалося створити акаунт");
    return;
  }

  saveSession(username);
  setMessage("Акаунт створено", false);
  await startApp(username);
}

async function handleAuthSubmit() {
  if (isRegisterMode()) {
    await handleRegister();
  } else {
    await handleLogin();
  }
}

// ======================================================
// ADMIN AUTO CREATE
// ======================================================
async function ensureAdminBootstrap() {
  try {
    await apiEnsureAdminExists({
      username: "admin",
      password: "9009",
      balance: 1000000000,
      usd: 500000,
      total_earned: 1000000000,
      clicks: 0,
      class: "creator",
      role: "none",
      device: "desktop",
      last_seen: new Date().toISOString(),
      banned: false,
      titles: ["Administrator"],
      inventory: [],
      friends: [],
      cars: [],
      realty: [],
      crypto: {},
      stocks: {},
      business_projects: {},
      card_name: "ADMIN",
      card_number: "9009 9009 9009 9009",
      card_expiry: "12/99",
      card_cvv: "900",
      card_theme: "black_elite",
      card_themes_owned: ["classic_blue", "black_elite"],
      card_cosmetics: {
        total_spent: 0,
        custom_name: "ADMIN",
        custom_tag: "BITBANK",
        metallic_level: 0
      },
      battle_profile: {
        wins: 0,
        losses: 0,
        rating: 3000,
        streak: 0,
        best_streak: 0,
        last_battle_at: null,
        unlocked_arena: 4
      },
      finances: {
        deposits: [],
        credit: {
          principal: 0,
          dueAmount: 0,
          dailyRate: 0,
          latePenaltyDailyRate: 0,
          takenAt: null,
          dueAt: null,
          lastInterestTickAt: new Date().toISOString(),
          isActive: false
        },
        stats: {
          total_tax_paid: 0,
          total_maintenance_paid: 0,
          total_interest_paid: 0,
          total_deposit_profit: 0
        },
        lastFinanceTickAt: new Date().toISOString()
      },
      loot_profile: {
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
      },
      casino_profile: {
        jackpot_bank: 500000,
        lottery_bank: 250000,
        daily_wheel_day: "",
        wheel_bonus_multiplier: 1,
        free_safes: 0,
        lottery_tickets: 0,
        safe_inventory: []
      },
      role_stats: {
        changes_count: 0,
        total_spent_on_roles: 0,
        selected_at: null,
        unlocked_roles: []
      },
      friends_meta: {
        last_search: "",
        notes: {}
      },
      collections_state: {
        claimed: {},
        completed_at: {}
      },
      history_meta: {
        filters: {},
        last_opened_at: null
      },
      is_admin: true
    });
  } catch (err) {
    console.error("ensureAdminBootstrap error:", err);
  }
}

// ======================================================
// BIND
// ======================================================
export function bindAuthEvents() {
  ensureAdminBootstrap();

  const loginTab = $("tab-login");
  const registerTab = $("tab-register");
  const submitBtn = $("auth-submit-btn");
  const usernameInput = $("auth-username");
  const passwordInput = $("auth-password");

  if (loginTab && loginTab.dataset.bound !== "1") {
    loginTab.dataset.bound = "1";
    loginTab.addEventListener("click", () => {
      showLoginForm();
      clearMessage();
    });
  }

  if (registerTab && registerTab.dataset.bound !== "1") {
    registerTab.dataset.bound = "1";
    registerTab.addEventListener("click", () => {
      showRegisterForm();
      clearMessage();
    });
  }

  if (submitBtn && submitBtn.dataset.bound !== "1") {
    submitBtn.dataset.bound = "1";
    submitBtn.addEventListener("click", handleAuthSubmit);
  }

  [usernameInput, passwordInput].forEach((input) => {
    if (!input || input.dataset.bound === "1") return;

    input.dataset.bound = "1";
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        await handleAuthSubmit();
      }
    });
  });

  showLoginForm();
}
