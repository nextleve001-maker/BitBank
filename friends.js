import { AppState, updatePlayer } from "./app.js";
import { apiGetAllPlayers, apiGetPlayer, apiAddHistory } from "./api.js";

// ======================================================
// HELPERS
// ======================================================
function getPlayer() {
  return AppState.player || {};
}

function getPlayers() {
  return Array.isArray(AppState.allPlayers) ? AppState.allPlayers : [];
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeText(v) {
  return String(v || "").trim();
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
  bindFriendsUI();
}

function ensureFriendsData() {
  const p = getPlayer();

  if (!Array.isArray(p.friends)) {
    p.friends = [];
  }

  if (!p.friends_meta || typeof p.friends_meta !== "object" || Array.isArray(p.friends_meta)) {
    p.friends_meta = {
      last_search: "",
      notes: {}
    };
  }
}

function saveFriendsData() {
  const p = getPlayer();

  updatePlayer({
    friends: p.friends,
    friends_meta: p.friends_meta
  });
}

function nowMs() {
  return Date.now();
}

function isOnline(player) {
  if (!player?.last_seen) return false;

  const lastSeen = new Date(player.last_seen).getTime();
  if (Number.isNaN(lastSeen)) return false;

  return nowMs() - lastSeen < 15000;
}

function onlineStatusText(player) {
  return isOnline(player) ? "Online" : "Offline";
}

function onlineStatusClass(player) {
  return isOnline(player) ? "green" : "muted";
}

function getFriendNames() {
  ensureFriendsData();
  return safeArray(getPlayer().friends);
}

function getFriendPlayers() {
  const all = getPlayers();
  const names = getFriendNames();

  return names
    .map((name) => all.find((p) => p.username === name))
    .filter(Boolean);
}

function totalPortfolioValue(player) {
  const balance = numberValue(player.balance);
  const usd = numberValue(player.usd) * 40;

  let cryptoValue = 0;
  if (player.crypto && typeof player.crypto === "object") {
    Object.values(player.crypto).forEach((v) => {
      cryptoValue += numberValue(v) * 1000;
    });
  }

  let stockValue = 0;
  if (player.stocks && typeof player.stocks === "object") {
    Object.values(player.stocks).forEach((v) => {
      stockValue += numberValue(v) * 5000;
    });
  }

  return balance + usd + cryptoValue + stockValue;
}

function getRankedPlayers() {
  return [...getPlayers()].sort((a, b) => {
    const balanceDiff = numberValue(b.balance) - numberValue(a.balance);
    if (balanceDiff !== 0) return balanceDiff;

    const earnedDiff = numberValue(b.total_earned) - numberValue(a.total_earned);
    if (earnedDiff !== 0) return earnedDiff;

    return String(a.username || "").localeCompare(String(b.username || ""));
  });
}

function getTopPlayers(limit = 100) {
  return getRankedPlayers().slice(0, limit);
}

function getMyRank() {
  const ranked = getRankedPlayers();
  const username = getPlayer().username;

  const index = ranked.findIndex((p) => p.username === username);
  return index >= 0 ? index + 1 : null;
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

// ======================================================
// FRIEND ACTIONS
// ======================================================
export async function addFriendByUsername(usernameRaw) {
  ensureFriendsData();

  const p = getPlayer();
  const username = normalizeText(usernameRaw);

  if (!username) {
    alert("Введи нік");
    return false;
  }

  if (username === p.username) {
    alert("Не можна додати себе");
    return false;
  }

  const target = await apiGetPlayer(username);
  if (!target) {
    alert("Гравця не знайдено");
    return false;
  }

  if (p.friends.includes(username)) {
    alert("Вже в друзях");
    return false;
  }

  p.friends.push(username);
  saveFriendsData();

  await apiAddHistory(p.username, `Add friend: ${username}`, 0);
  return true;
}

export async function removeFriendByUsername(usernameRaw) {
  ensureFriendsData();

  const p = getPlayer();
  const username = normalizeText(usernameRaw);

  if (!username) return false;
  if (!p.friends.includes(username)) return false;

  p.friends = p.friends.filter((name) => name !== username);
  saveFriendsData();

  await apiAddHistory(p.username, `Remove friend: ${username}`, 0);
  return true;
}

// ======================================================
// SEARCH
// ======================================================
async function searchPlayerByUsername() {
  const username = normalizeText(getInputValue("friend-search-input"));
  if (!username) {
    alert("Введи нік");
    return null;
  }

  const p = getPlayer();
  ensureFriendsData();
  p.friends_meta.last_search = username;
  saveFriendsData();

  const target = await apiGetPlayer(username);
  return target;
}

// ======================================================
// RENDER HELPERS
// ======================================================
function summaryCards(friendPlayers, topPlayers) {
  const onlineFriends = friendPlayers.filter(isOnline).length;
  const myRank = getMyRank();
  const totalFriendsWorth = friendPlayers.reduce((sum, player) => sum + totalPortfolioValue(player), 0);

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">Friends</div>
        <div class="stat-value">${friendPlayers.length}</div>
        <div class="stat-sub">Added players</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Online</div>
        <div class="stat-value green">${onlineFriends}</div>
        <div class="stat-sub">Friends online now</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">My Rank</div>
        <div class="stat-value blue">${myRank || "-"}</div>
        <div class="stat-sub">Top list position</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Friends Worth</div>
        <div class="stat-value">₴ ${formatCompact(totalFriendsWorth)}</div>
        <div class="stat-sub">Total friend portfolio</div>
      </div>
    </div>
  `;
}

function addFriendPanel() {
  return `
    <div class="dashboard-grid">
      <div class="card">
        <h3>Add Friend</h3>
        <p class="muted" style="margin-bottom:12px;">Введи нік гравця і додай його до друзів.</p>
        <div class="profile-actions">
          <input id="friend-search-input" placeholder="Username">
          <button id="friend-search-btn">Search</button>
          <button class="secondary" id="friend-add-btn">Add Friend</button>
        </div>
      </div>

      <div class="card">
        <h3>Your Status</h3>
        <p><span class="muted">Username:</span> ${getPlayer().username || "—"}</p>
        <p><span class="muted">Class:</span> ${getPlayer().class || "none"}</p>
        <p><span class="muted">Balance:</span> ₴ ${formatMoney(getPlayer().balance || 0)}</p>
        <p><span class="muted">Device:</span> ${getPlayer().device || "desktop"}</p>
      </div>
    </div>
  `;
}

function friendCard(player) {
  const portfolio = totalPortfolioValue(player);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${player.username}</div>
          <div class="asset-price ${onlineStatusClass(player)}">${onlineStatusText(player)}</div>
        </div>

        <div class="asset-meta">
          <span>₴ ${formatCompact(player.balance)}</span>
          <span>$ ${formatCompact(player.usd)}</span>
          <span>${player.class || "none"}</span>
          <span>${player.device || "desktop"}</span>
        </div>

        <p><span class="muted">Portfolio:</span> ₴ ${formatMoney(portfolio)}</p>
        <p><span class="muted">Earned:</span> ₴ ${formatMoney(player.total_earned || 0)}</p>

        <div class="asset-actions full">
          <button class="secondary" data-remove-friend="${player.username}">Remove Friend</button>
        </div>
      </div>
    </div>
  `;
}

function topCard(player, index) {
  const isMe = player.username === getPlayer().username;
  const alreadyFriend = getFriendNames().includes(player.username);
  const portfolio = totalPortfolioValue(player);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">#${index + 1} ${player.username}${isMe ? " (You)" : ""}</div>
          <div class="asset-price">${onlineStatusText(player)}</div>
        </div>

        <div class="asset-meta">
          <span>₴ ${formatCompact(player.balance)}</span>
          <span>${player.class || "none"}</span>
          <span>${player.device || "desktop"}</span>
          <span>${onlineStatusText(player)}</span>
        </div>

        <p><span class="muted">Portfolio:</span> ₴ ${formatMoney(portfolio)}</p>
        <p><span class="muted">Earned:</span> ₴ ${formatMoney(player.total_earned || 0)}</p>

        <div class="asset-actions full">
          ${
            isMe
              ? `<button disabled>Current User</button>`
              : alreadyFriend
                ? `<button class="secondary" data-remove-friend="${player.username}">Remove Friend</button>`
                : `<button data-add-friend="${player.username}">Add Friend</button>`
          }
        </div>
      </div>
    </div>
  `;
}

function searchedPlayerCard(player) {
  if (!player) {
    return `
      <div class="card">
        <h3>Search Result</h3>
        <p class="muted">Після пошуку тут з’явиться гравець.</p>
      </div>
    `;
  }

  const isMe = player.username === getPlayer().username;
  const alreadyFriend = getFriendNames().includes(player.username);

  return `
    <div class="card">
      <h3>Search Result</h3>
      <p><span class="muted">Username:</span> ${player.username}</p>
      <p><span class="muted">Status:</span> <span class="${onlineStatusClass(player)}">${onlineStatusText(player)}</span></p>
      <p><span class="muted">Class:</span> ${player.class || "none"}</p>
      <p><span class="muted">Balance:</span> ₴ ${formatMoney(player.balance || 0)}</p>
      <p><span class="muted">USD:</span> $ ${formatMoney(player.usd || 0)}</p>
      <p><span class="muted">Portfolio:</span> ₴ ${formatMoney(totalPortfolioValue(player))}</p>

      <div class="profile-actions" style="margin-top:12px;">
        ${
          isMe
            ? `<button disabled>Current User</button>`
            : alreadyFriend
              ? `<button class="secondary" data-remove-friend="${player.username}">Remove Friend</button>`
              : `<button data-add-friend="${player.username}">Add Friend</button>`
        }
      </div>
    </div>
  `;
}

// ======================================================
// MAIN PAGE
// ======================================================
export async function renderFriendsPage() {
  document.body.dataset.currentPage = "friends";
  ensureFriendsData();

  AppState.allPlayers = await apiGetAllPlayers();

  const friendPlayers = getFriendPlayers();
  const topPlayers = getTopPlayers(100);

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>Friends & Top 100</h2>
      <p>Список друзів, онлайн-статуси, пошук гравців і глобальний рейтинг.</p>
    </div>

    ${summaryCards(friendPlayers, topPlayers)}
    ${addFriendPanel()}

    <div class="section-title">Search</div>
    <div id="searched-player-block" class="dashboard-grid">
      ${searchedPlayerCard(null)}
    </div>

    <div class="section-title">Friends</div>
    <div class="asset-grid">
      ${
        friendPlayers.length
          ? friendPlayers.map(friendCard).join("")
          : `
            <div class="card" style="grid-column:1 / -1;">
              <h3>No Friends Yet</h3>
              <p>Додай першого друга через пошук вище.</p>
            </div>
          `
      }
    </div>

    <div class="section-title">Top 100</div>
    <div class="asset-grid">
      ${topPlayers.map((player, index) => topCard(player, index)).join("")}
    </div>
  `);
}

// ======================================================
// BIND
// ======================================================
function bindFriendsUI() {
  const searchBtn = document.getElementById("friend-search-btn");
  const addBtn = document.getElementById("friend-add-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const player = await searchPlayerByUsername();
      const block = document.getElementById("searched-player-block");
      if (!block) return;
      block.innerHTML = searchedPlayerCard(player);
      bindFriendsUI();
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      const username = getInputValue("friend-search-input");
      const ok = await addFriendByUsername(username);
      if (ok) {
        renderFriendsPage();
      }
    });
  }

  document.querySelectorAll("[data-add-friend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const username = btn.getAttribute("data-add-friend");
      const ok = await addFriendByUsername(username);
      if (ok) {
        renderFriendsPage();
      }
    });
  });

  document.querySelectorAll("[data-remove-friend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const username = btn.getAttribute("data-remove-friend");
      const ok = await removeFriendByUsername(username);
      if (ok) {
        renderFriendsPage();
      }
    });
  });
}
