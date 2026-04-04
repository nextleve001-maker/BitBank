import { bindAuthEvents } from "./auth.js";
import {
  supabaseClient,
  apiGetPlayer,
  apiGetAllPlayers,
  apiGetGameState,
  apiUpdatePlayer,
  apiUpdatePresence
} from "./api.js";

import {
  renderProfilePage,
  renderStatsPage,
  renderFriendsPage,
  renderInventoryPage,
  renderBusinessPage
} from "./ui.js";

import {
  renderCryptoPage,
  renderStocksPage,
  startMarketLoop
} from "./market.js";

import {
  renderBattlePage,
  startBattleLoop
} from "./battle.js";

import { renderCasinoPage } from "./casino.js";
import { renderTransfersPage, renderCardSettingsPage } from "./transfers.js";
import { renderAdminPage, isAdmin } from "./admin.js";
import { passiveIncomeTick, renderBusinessPremiumPage } from "./economy.js";
import { renderHistoryPage } from "./history.js";

export const AppState = {
  currentUser: null,
  player: null,
  allPlayers: [],
  gameState: null,
  lang: "ua",
  initialized: false,
  currentPage: "profile",
  intervalsStarted: false,
  isPhone: false
};

// =====================
// SESSION
// =====================
export function saveSession(username) {
  localStorage.setItem("bb_user", username);
}

export function loadSession() {
  return localStorage.getItem("bb_user");
}

export function clearSession() {
  localStorage.removeItem("bb_user");
}

export function logout() {
  clearSession();
  location.reload();
}

// =====================
// DEVICE / UI MODE
// =====================
function currentDeviceType() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "phone"
    : "desktop";
}

function detectPhoneMode() {
  AppState.isPhone = currentDeviceType() === "phone";
  document.body.classList.toggle("mobile-mode", AppState.isPhone);
}

function applyTouchFeedback() {
  document.querySelectorAll("button, .nav-btn").forEach((btn) => {
    if (btn.dataset.touchBound === "1") return;
    btn.dataset.touchBound = "1";

    btn.addEventListener(
      "touchstart",
      () => {
        btn.classList.add("tap-active");
      },
      { passive: true }
    );

    btn.addEventListener(
      "touchend",
      () => {
        btn.classList.remove("tap-active");
      },
      { passive: true }
    );

    btn.addEventListener(
      "touchcancel",
      () => {
        btn.classList.remove("tap-active");
      },
      { passive: true }
    );
  });
}

function setupPhoneUX() {
  detectPhoneMode();
  applyTouchFeedback();
}

// =====================
// SCREEN STATE
// =====================
function showLogin() {
  const loginScreen = document.getElementById("login-screen");
  const appScreen = document.getElementById("app-screen");

  if (loginScreen) loginScreen.classList.remove("hidden");
  if (appScreen) appScreen.classList.add("hidden");
}

function showApp() {
  const loginScreen = document.getElementById("login-screen");
  const appScreen = document.getElementById("app-screen");

  if (loginScreen) loginScreen.classList.add("hidden");
  if (appScreen) appScreen.classList.remove("hidden");
}

// =====================
// DATA LOAD
// =====================
async function loadPlayer() {
  if (!AppState.currentUser) return;
  AppState.player = await apiGetPlayer(AppState.currentUser);
}

async function loadAllPlayers() {
  AppState.allPlayers = await apiGetAllPlayers();
}

async function loadGameState() {
  AppState.gameState = await apiGetGameState();
}

// =====================
// PLAYER PATCH
// =====================
export async function updatePlayer(patch) {
  if (!AppState.player?.username) return;

  await apiUpdatePlayer(AppState.player.username, patch);
  Object.assign(AppState.player, patch);

  updateHeader();
  rerenderCurrentPageIfNeeded();
}

// =====================
// HEADER / NAV
// =====================
export function updateHeader() {
  const p = AppState.player;
  if (!p) return;

  const usernameEl = document.getElementById("header-username");
  const statusEl = document.getElementById("header-status");
  const deviceEl = document.getElementById("header-device");
  const balanceUAHEl = document.getElementById("balance-uah");
  const balanceUSDEl = document.getElementById("balance-usd");
  const globalMessageEl = document.getElementById("global-message");

  if (usernameEl) {
    usernameEl.textContent = p.username || "Player";
  }

  if (statusEl) {
    statusEl.textContent = `Class: ${p.class || "none"}`;
  }

  if (deviceEl) {
    deviceEl.textContent = `Device: ${p.device || currentDeviceType()}`;
  }

  if (balanceUAHEl) {
    balanceUAHEl.textContent = `₴ ${Math.floor(Number(p.balance || 0)).toLocaleString("en-US")}`;
  }

  if (balanceUSDEl) {
    balanceUSDEl.textContent = `$ ${Math.floor(Number(p.usd || 0)).toLocaleString("en-US")}`;
  }

  if (globalMessageEl) {
    globalMessageEl.textContent = AppState.gameState?.global_message || "";
  }

  const adminBtn = document.querySelector('.nav-btn[data-page="admin"]');
  if (adminBtn) {
    adminBtn.style.display = isAdmin() ? "flex" : "none";
  }

  document.body.dataset.currentPage = AppState.currentPage || "profile";
  highlightActiveNav();
}

function highlightActiveNav() {
  const page = AppState.currentPage || "profile";

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

// =====================
// PAGE HELPERS
// =====================
function renderRealtyPlaceholder() {
  const root = document.getElementById("page-content");
  if (!root) return;

  root.innerHTML = `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Realty</h2>
      <p>Premium realty page can be connected here next.</p>
    </div>
  `;
}

function renderCarsPlaceholder() {
  const root = document.getElementById("page-content");
  if (!root) return;

  root.innerHTML = `
    <div class="card" style="grid-column:1 / -1;">
      <h2>Cars</h2>
      <p>Premium cars page can be connected here next.</p>
    </div>
  `;
}

function renderMarketFallback() {
  renderCryptoPage();
}

function renderDefaultPage() {
  renderProfilePage();
}

// =====================
// PAGE ROUTER
// =====================
export function renderPage(page) {
  AppState.currentPage = page || "profile";
  document.body.dataset.currentPage = AppState.currentPage;

  switch (AppState.currentPage) {
    case "profile":
      renderProfilePage();
      break;

    case "business":
      renderBusinessPremiumPage();
      break;

    case "crypto":
      renderCryptoPage();
      break;

    case "stocks":
      renderStocksPage();
      break;

    case "realty":
      renderRealtyPlaceholder();
      break;

    case "cars":
      renderCarsPlaceholder();
      break;

    case "inventory":
      renderInventoryPage();
      break;

    case "market":
      renderMarketFallback();
      break;

    case "friends":
      renderFriendsPage();
      break;

    case "battle":
      renderBattlePage();
      break;

    case "casino":
      renderCasinoPage();
      break;

    case "transfers":
      renderTransfersPage();
      break;

    case "card":
      renderCardSettingsPage();
      break;

    case "history":
      renderHistoryPage();
      break;

    case "stats":
      renderStatsPage();
      break;

    case "admin":
      renderAdminPage();
      break;

    default:
      renderDefaultPage();
      break;
  }

  highlightActiveNav();
  applyTouchFeedback();
}

// =====================
// SAFE RERENDER
// =====================
function rerenderCurrentPageIfNeeded() {
  if (!AppState.initialized) return;
  renderPage(AppState.currentPage || "profile");
}

// =====================
// EVENTS
// =====================
function bindGlobalEvents() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn && logoutBtn.dataset.bound !== "1") {
    logoutBtn.dataset.bound = "1";
    logoutBtn.addEventListener("click", logout);
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const page = btn.dataset.page;
      if (!page) return;

      renderPage(page);
    });

    btn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const page = btn.dataset.page;
        if (!page) return;

        renderPage(page);
      },
      { passive: false }
    );
  });

  window.addEventListener("resize", () => {
    detectPhoneMode();
    updateHeader();
  });
}

// =====================
// PRESENCE
// =====================
async function presenceTick() {
  if (!AppState.player?.username) return;

  const device = currentDeviceType();

  AppState.player.device = device;
  AppState.player.last_seen = new Date().toISOString();

  try {
    await apiUpdatePresence(AppState.player.username, device);
  } catch (error) {
    console.error("presenceTick error:", error);
  }

  updateHeader();
}

// =====================
// REFRESH RUNTIME DATA
// =====================
async function softRefreshRuntimeData() {
  if (!AppState.player?.username) return;

  try {
    await loadAllPlayers();
    const freshGameState = await apiGetGameState();

    if (freshGameState) {
      AppState.gameState = freshGameState;
    }

    updateHeader();
  } catch (error) {
    console.error("softRefreshRuntimeData error:", error);
  }
}

// =====================
// LOOPS
// =====================
function startLoops() {
  if (AppState.intervalsStarted) return;
  AppState.intervalsStarted = true;

  setInterval(async () => {
    if (!AppState.player) return;

    try {
      passiveIncomeTick();
    } catch (error) {
      console.error("passiveIncomeTick error:", error);
    }
  }, 1000);

  setInterval(async () => {
    if (!AppState.player) return;

    try {
      await presenceTick();
    } catch (error) {
      console.error("presence loop error:", error);
    }
  }, 5000);

  setInterval(async () => {
    if (!AppState.player) return;

    try {
      await softRefreshRuntimeData();
    } catch (error) {
      console.error("refresh loop error:", error);
    }
  }, 8000);

  try {
    startMarketLoop();
  } catch (error) {
    console.error("startMarketLoop error:", error);
  }

  try {
    startBattleLoop();
  } catch (error) {
    console.error("startBattleLoop error:", error);
  }
}

// =====================
// START APP
// =====================
export async function startApp(username) {
  AppState.currentUser = username;

  showApp();
  setupPhoneUX();

  await loadPlayer();
  await loadAllPlayers();
  await loadGameState();

  if (!AppState.player) {
    clearSession();
    showLogin();
    return;
  }

  AppState.player.device = currentDeviceType();
  AppState.currentPage = "profile";

  updateHeader();
  renderDefaultPage();

  AppState.initialized = true;
}

// =====================
// INIT
// =====================
export async function initApp() {
  bindAuthEvents();
  bindGlobalEvents();
  setupPhoneUX();

  const session = loadSession();

  if (session) {
    await startApp(session);
  } else {
    showLogin();
  }

  startLoops();

  console.log("BitBank app started", {
    supabase: !!supabaseClient,
    device: currentDeviceType()
  });
}

initApp();
