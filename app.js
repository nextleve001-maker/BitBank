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
import { passiveIncomeTick } from "./economy.js";

export const AppState = {
  currentUser: null,
  player: null,
  allPlayers: [],
  gameState: null,
  lang: "ua",
  initialized: false
};

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

function showLogin() {
  document.getElementById("login-screen")?.classList.remove("hidden");
  document.getElementById("app-screen")?.classList.add("hidden");
}

function showApp() {
  document.getElementById("login-screen")?.classList.add("hidden");
  document.getElementById("app-screen")?.classList.remove("hidden");
}

function currentDeviceType() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "phone"
    : "desktop";
}

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

export async function updatePlayer(patch) {
  if (!AppState.player?.username) return;

  await apiUpdatePlayer(AppState.player.username, patch);
  Object.assign(AppState.player, patch);
  updateHeader();
}

export function updateHeader() {
  const p = AppState.player;
  if (!p) return;

  const usernameEl = document.getElementById("header-username");
  const statusEl = document.getElementById("header-status");
  const deviceEl = document.getElementById("header-device");
  const balanceUAHEl = document.getElementById("balance-uah");
  const balanceUSDEl = document.getElementById("balance-usd");
  const globalMessageEl = document.getElementById("global-message");

  if (usernameEl) usernameEl.textContent = p.username || "Player";
  if (statusEl) statusEl.textContent = `Class: ${p.class || "none"}`;
  if (deviceEl) deviceEl.textContent = `Device: ${p.device || currentDeviceType()}`;
  if (balanceUAHEl) balanceUAHEl.textContent = `₴ ${Math.floor(Number(p.balance || 0))}`;
  if (balanceUSDEl) balanceUSDEl.textContent = `$ ${Math.floor(Number(p.usd || 0))}`;

  if (globalMessageEl) {
    globalMessageEl.textContent = AppState.gameState?.global_message || "";
  }

  const adminBtn = document.querySelector('.nav-btn[data-page="admin"]');
  if (adminBtn) {
    adminBtn.style.display = isAdmin() ? "block" : "none";
  }
}

function renderHistoryPage() {
  const root = document.getElementById("page-content");
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <h2>History</h2>
      <p>History page connected.</p>
    </div>
  `;
}

function renderDefaultPage() {
  renderProfilePage();
}

export function renderPage(page) {
  switch (page) {
    case "profile":
      renderProfilePage();
      break;
    case "business":
      renderBusinessPage();
      break;
    case "crypto":
      renderCryptoPage();
      break;
    case "stocks":
      renderStocksPage();
      break;
    case "realty":
      renderStatsPage();
      break;
    case "cars":
      renderStatsPage();
      break;
    case "inventory":
      renderInventoryPage();
      break;
    case "market":
      renderCryptoPage();
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
}

function bindGlobalEvents() {
  document.getElementById("logout-btn")?.addEventListener("click", logout);

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      renderPage(page);
    });
  });
}

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

function setupMobileMode() {
  const isPhone = currentDeviceType() === "phone";
  document.body.classList.toggle("mobile-mode", isPhone);

  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  if (isPhone) {
    sidebar.classList.add("mobile-sidebar");
  } else {
    sidebar.classList.remove("mobile-sidebar");
  }
}

function setupTouchButtons() {
  const buttons = document.querySelectorAll("button, .nav-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("touchstart", () => {
      btn.classList.add("tap-active");
    }, { passive: true });

    btn.addEventListener("touchend", () => {
      btn.classList.remove("tap-active");
    }, { passive: true });
  });
}

function startLoops() {
  setInterval(async () => {
    if (!AppState.player) return;
    passiveIncomeTick();
  }, 1000);

  setInterval(async () => {
    if (!AppState.player) return;
    await presenceTick();
  }, 5000);

  setInterval(async () => {
    if (!AppState.player) return;
    await loadAllPlayers();
  }, 7000);

  startMarketLoop();
  startBattleLoop();
}

export async function startApp(username) {
  AppState.currentUser = username;

  showApp();

  await loadPlayer();
  await loadAllPlayers();
  await loadGameState();

  if (!AppState.player) {
    clearSession();
    showLogin();
    return;
  }

  setupMobileMode();
  setupTouchButtons();
  updateHeader();
  renderDefaultPage();

  AppState.initialized = true;
}

export async function initApp() {
  bindAuthEvents();
  bindGlobalEvents();

  const session = loadSession();

  if (session) {
    await startApp(session);
  } else {
    showLogin();
  }

  startLoops();

  console.log("BitBank app started", {
    supabase: !!supabaseClient
  });
}

initApp();
