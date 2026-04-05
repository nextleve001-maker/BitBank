import { bindAuthEvents } from "./auth.js";
import {
  apiGetPlayer,
  apiGetAllPlayers,
  apiGetGameState,
  apiUpdatePlayer,
  apiUpdatePresence
} from "./api.js";

import {
  renderProfilePage,
  renderStatsPage,
  renderInventoryPage,
  refreshTopbarProfileBits
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
import { renderFriendsPage } from "./friends.js";
import { renderFinancePage, financeTick } from "./finance.js";
import { renderRolesPage } from "./roles.js";
import { renderCardsPage } from "./cards.js";
import { renderCollectionsPage } from "./collections.js";
import { renderLootPage } from "./loot.js";
import { normalizePlayerState, rebuildAutoTitles, getPlayerOverviewStats } from "./player.js";

// ======================================================
// GLOBAL STATE
// ======================================================
export const AppState = {
  currentUser: null,
  player: null,
  allPlayers: [],
  gameState: null,
  initialized: false,
  currentPage: "profile",
  intervalsStarted: false,
  isPhone: false
};

// ======================================================
// SESSION
// ======================================================
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

// ======================================================
// HELPERS
// ======================================================
function $(id) {
  return document.getElementById(id);
}

function currentDeviceType() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "phone"
    : "desktop";
}

function detectPhoneMode() {
  AppState.isPhone = currentDeviceType() === "phone";
  document.body.classList.toggle("mobile-mode", AppState.isPhone);
}

function showLogin() {
  $("login-screen")?.classList.remove("hidden");
  $("app-screen")?.classList.add("hidden");
}

function showApp() {
  $("login-screen")?.classList.add("hidden");
  $("app-screen")?.classList.remove("hidden");
}

function formatMoney(n) {
  return Math.floor(Number(n || 0)).toLocaleString("en-US");
}

function ensurePlayerLoaded() {
  if (!AppState.player) return false;
  normalizePlayerState();
  rebuildAutoTitles();
  return true;
}

// ======================================================
// DATA LOAD
// ======================================================
async function loadPlayer() {
  if (!AppState.currentUser) return;
  AppState.player = await apiGetPlayer(AppState.currentUser);
  if (AppState.player) {
    normalizePlayerState();
  }
}

async function loadAllPlayers() {
  AppState.allPlayers = await apiGetAllPlayers();
}

async function loadGameState() {
  AppState.gameState = await apiGetGameState();
}

// ======================================================
// PLAYER PATCH
// ======================================================
export async function updatePlayer(patch) {
  if (!AppState.player?.username) return null;

  const fresh = await apiUpdatePlayer(AppState.player.username, patch);
  if (fresh) {
    AppState.player = fresh;
  } else {
    Object.assign(AppState.player, patch);
  }

  normalizePlayerState();
  rebuildAutoTitles();
  updateHeader();

  return AppState.player;
}

// ======================================================
// HEADER / NAV
// ======================================================
export function updateHeader() {
  const p = AppState.player;
  if (!p) return;

  const usernameEl = $("header-username");
  const statusEl = $("header-status");
  const deviceEl = $("header-device");
  const balanceUAHEl = $("balance-uah");
  const balanceUSDEl = $("balance-usd");
  const globalMessageEl = $("global-message");

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
    balanceUAHEl.textContent = `₴ ${formatMoney(p.balance || 0)}`;
  }

  if (balanceUSDEl) {
    balanceUSDEl.textContent = `$ ${formatMoney(p.usd || 0)}`;
  }

  if (globalMessageEl) {
    globalMessageEl.textContent = AppState.gameState?.global_message || "";
  }

  refreshTopbarProfileBits();
  highlightActiveNav();

  const adminBtn = document.querySelector('.nav-btn[data-page="admin"]');
  if (adminBtn) {
    adminBtn.style.display = isAdmin() ? "flex" : "none";
  }
}

function highlightActiveNav() {
  const page = AppState.currentPage || "profile";

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  document.querySelectorAll(".mobile-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

function updateTopbarAvatar() {
  const el = $("topbar-avatar-text");
  if (!el || !AppState.player?.username) return;

  el.textContent = String(AppState.player.username).charAt(0).toUpperCase();
}

function rerenderCurrentPageIfNeeded() {
  if (!AppState.initialized) return;
  renderPage(AppState.currentPage || "profile");
}

// ======================================================
// ROUTER
// ======================================================
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

    case "finance":
      renderFinancePage();
      break;

    case "transfers":
      renderTransfersPage();
      break;

    case "card":
      renderCardSettingsPage();
      break;

    case "cards":
      renderCardsPage();
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

    case "loot":
      renderLootPage();
      break;

    case "collections":
      renderCollectionsPage();
      break;

    case "roles":
      renderRolesPage();
      break;

    case "inventory":
      renderInventoryPage();
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
      renderProfilePage();
      break;
  }

  updateHeader();
  updateTopbarAvatar();
  highlightActiveNav();
}

// ======================================================
// EVENTS
// ======================================================
function bindNavButtons() {
  const bindPageButtons = (selector) => {
    document.querySelectorAll(selector).forEach((btn) => {
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
  };

  bindPageButtons(".nav-btn");
  bindPageButtons(".mobile-tab-btn");
}

function bindGlobalEvents() {
  const logoutBtn = $("logout-btn");

  if (logoutBtn && logoutBtn.dataset.bound !== "1") {
    logoutBtn.dataset.bound = "1";
    logoutBtn.addEventListener("click", logout);
  }

  bindNavButtons();

  if (!window.__bb_resize_bound__) {
    window.__bb_resize_bound__ = true;
    window.addEventListener("resize", () => {
      detectPhoneMode();
      updateHeader();
    });
  }
}

// ======================================================
// PRESENCE
// ======================================================
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

// ======================================================
// LOOPS
// ======================================================
function startCoreLoops() {
  if (AppState.intervalsStarted) return;
  AppState.intervalsStarted = true;

  startMarketLoop();
  startBattleLoop();

  setInterval(async () => {
    try {
      passiveIncomeTick();
    } catch (e) {
      console.error("passiveIncomeTick error:", e);
    }
  }, 5000);

  setInterval(async () => {
    try {
      await financeTick();
    } catch (e) {
      console.error("financeTick error:", e);
    }
  }, 45000);

  setInterval(async () => {
    try {
      await presenceTick();
    } catch (e) {
      console.error("presenceTick error:", e);
    }
  }, 10000);

  setInterval(async () => {
    try {
      await loadAllPlayers();
    } catch (e) {
      console.error("loadAllPlayers loop error:", e);
    }
  }, 20000);

  setInterval(async () => {
    try {
      const fresh = await apiGetPlayer(AppState.currentUser);
      if (fresh) {
        AppState.player = fresh;
        normalizePlayerState();
        rebuildAutoTitles();
        updateHeader();
      }
    } catch (e) {
      console.error("player refresh loop error:", e);
    }
  }, 25000);
}

// ======================================================
// STARTUP
// ======================================================
export async function startApp(username = null) {
  const sessionUser = username || loadSession();

  detectPhoneMode();
  bindGlobalEvents();

  if (!sessionUser) {
    AppState.currentUser = null;
    AppState.player = null;
    showLogin();
    AppState.initialized = true;
    return;
  }

  AppState.currentUser = sessionUser;

  await loadPlayer();

  if (!AppState.player) {
    clearSession();
    AppState.currentUser = null;
    showLogin();
    AppState.initialized = true;
    return;
  }

  if (AppState.player.banned) {
    clearSession();
    AppState.currentUser = null;
    showLogin();
    alert("Акаунт заблоковано");
    AppState.initialized = true;
    return;
  }

  await loadAllPlayers();
  await loadGameState();

  showApp();
  ensurePlayerLoaded();
  updateHeader();
  updateTopbarAvatar();
  renderPage(AppState.currentPage || "profile");
  startCoreLoops();

  AppState.initialized = true;
}

// ======================================================
// AUTO START
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {
  bindAuthEvents();
  await startApp();
});
