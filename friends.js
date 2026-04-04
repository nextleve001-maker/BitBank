import { AppState, updatePlayer } from "./app.js";
import { apiGetAllPlayers, apiGetPlayer, apiAddHistory } from "./api.js";
import { t, renderLanguageSwitcher, bindLanguageSwitcher } from "./i18n.js";

// =====================
// HELPERS
// =====================
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

function formatMoney(n) {
  return Math.floor(Number(n || 0)).toLocaleString("en-US");
}

function formatCompact(n) {
  const value = Number(n || 0);

  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";

  return Math.floor(value).toString();
}

function setPage(html, rerenderFn = null) {
  const root = document.getElementById("page-content");
  if (!root) return;

  root.innerHTML = html;
  bindFriendsUI();

  if (rerenderFn) {
    bindLanguageSwitcher(() => {
      rerenderFn();
    });
  }
}

function isOnline(player) {
  if (!player?.last_seen) return false;

  const lastSeen = new Date(player.last_seen).getTime();
  if (Number.isNaN(lastSeen)) return false;

  return Date.now() - lastSeen < 15000;
}

function getFriendUsernames() {
  return safeArray(getPlayer().friends);
}

function getFriendPlayers() {
  const usernames = getFriendUsernames();
  const all = getPlayers();

  return usernames
    .map((username) => all.find((p) => p.username === username))
    .filter(Boolean);
}

function getTopPlayers(limit = 100) {
  return [...getPlayers()]
    .sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0))
    .slice(0, limit);
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

// =====================
// FRIEND ACTIONS
// =====================
export async function addFriendByUsername(usernameRaw) {
  const p = getPlayer();
  const username = normalizeText(usernameRaw);

  if (!username) {
    alert("Enter username");
    return false;
  }

  if (username === p.username) {
    alert("You cannot add yourself");
    return false;
  }

  const target = await apiGetPlayer(username);
  if (!target) {
    alert("User not found");
    return false;
  }

  if (!Array.isArray(p.friends)) {
    p.friends = [];
  }

  if (p.friends.includes(username)) {
    alert("Already in friends");
    return false;
  }

  p.friends.push(username);

  await updatePlayer({
    friends: p.friends
  });

  await apiAddHistory(p.username, `Add friend: ${username}`, 0);
  return true;
}

export async function removeFriendByUsername(usernameRaw) {
  const p = getPlayer();
  const username = normalizeText(usernameRaw);

  if (!username) return false;

  if (!Array.isArray(p.friends)) {
    p.friends = [];
  }

  p.friends = p.friends.filter((item) => item !== username);

  await updatePlayer({
    friends: p.friends
  });

  await apiAddHistory(p.username, `Remove friend: ${username}`, 0);
  return true;
}

// =====================
// RENDER HELPERS
// =====================
function statusBadge(player) {
  return isOnline(player)
    ? `<span class="green">● Online</span>`
    : `<span class="muted">● Offline</span>`;
}

function friendCard(player) {
  const online = isOnline(player);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">${player.username}</div>
          <div class="asset-price ${online ? "green" : "muted"}">
            ${online ? "Online" : "Offline"}
          </div>
        </div>

        <div class="asset-meta">
          <span>₴ ${formatCompact(player.balance)}</span>
          <span>$ ${formatCompact(player.usd)}</span>
          <span>${player.class || "none"}</span>
          <span>${player.device || "desktop"}</span>
        </div>

        <p><span class="muted">${t("currentClass")}:</span> ${player.class || "none"}</p>
        <p><span class="muted">${t("device")}:</span> ${player.device || "desktop"}</p>

        <div class="asset-actions full">
          <button class="secondary" data-remove-friend="${player.username}">Remove Friend</button>
        </div>
      </div>
    </div>
  `;
}

function topCard(player, index) {
  const online = isOnline(player);
  const isMe = player.username === getPlayer().username;
  const alreadyFriend = getFriendUsernames().includes(player.username);

  return `
    <div class="card asset-card">
      <div class="asset-info">
        <div class="asset-head">
          <div class="asset-name">#${index + 1} ${player.username}${isMe ? " (You)" : ""}</div>
          <div class="asset-price">₴ ${formatCompact(player.balance)}</div>
        </div>

        <div class="asset-meta">
          <span>${player.class || "none"}</span>
          <span>${player.device || "desktop"}</span>
          <span>${online ? "Online" : "Offline"}</span>
          <span>$ ${formatCompact(player.usd)}</span>
        </div>

        <p><span class="muted">${t("portfolio")}:</span> ₴ ${formatMoney(player.balance || 0)}</p>
        <p><span class="muted">${t("device")}:</span> ${player.device || "desktop"}</p>

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

function renderFriendsSummary(friendPlayers, topPlayers) {
  const onlineFriends = friendPlayers.filter(isOnline).length;
  const myRank = topPlayers.findIndex((x) => x.username === getPlayer().username) + 1;

  return `
    <div class="dashboard-grid" style="grid-template-columns:repeat(4,1fr);">
      <div class="card stat-card">
        <div class="stat-label">${t("friends")}</div>
        <div class="stat-value">${friendPlayers.length}</div>
        <div class="stat-sub">Your friend list</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Online</div>
        <div class="stat-value green">${onlineFriends}</div>
        <div class="stat-sub">Friends online now</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Top Rank</div>
        <div class="stat-value blue">${myRank || "-"}</div>
        <div class="stat-sub">Your top position</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Top 100</div>
        <div class="stat-value">${topPlayers.length}</div>
        <div class="stat-sub">Best players list</div>
      </div>
    </div>
  `;
}

function renderAddFriendBox() {
  return `
    <div class="card">
      <h3>${t("friends")}</h3>
      <p>Add players by username to build your network.</p>
      <div class="profile-actions" style="margin-top:12px;">
        <input id="friend-username-input" placeholder="${t("username")}">
        <button id="add-friend-btn">Add Friend</button>
      </div>
    </div>
  `;
}

// =====================
// PAGE
// =====================
export async function renderFriendsHubPage() {
  document.body.dataset.currentPage = "friends";

  AppState.allPlayers = await apiGetAllPlayers();

  const friendPlayers = getFriendPlayers();
  const topPlayers = getTopPlayers(100);

  setPage(`
    <div class="card" style="grid-column:1 / -1;">
      <h2>${t("friends")} & Top 100</h2>
      <p>Friends network, online activity and ranking system for desktop and mobile.</p>
    </div>

    ${renderLanguageSwitcher()}
    ${renderFriendsSummary(friendPlayers, topPlayers)}

    <div class="dashboard-grid">
      ${renderAddFriendBox()}

      <div class="card">
        <h3>Profile Status</h3>
        <p><span class="muted">${t("username")}:</span> ${getPlayer().username || "—"}</p>
        <p><span class="muted">${t("currentClass")}:</span> ${getPlayer().class || "none"}</p>
        <p><span class="muted">${t("balance")}:</span> ₴ ${formatMoney(getPlayer().balance || 0)}</p>
        <p><span class="muted">${t("device")}:</span> ${getPlayer().device || "desktop"}</p>
      </div>
    </div>

    <div class="section-title">${t("friends")}</div>
    <div class="asset-grid">
      ${
        friendPlayers.length
          ? friendPlayers.map(friendCard).join("")
          : `
            <div class="card" style="grid-column:1 / -1;">
              <h3>No Friends Yet</h3>
              <p>Your friend list is empty. Add your first player above.</p>
            </div>
          `
      }
    </div>

    <div class="section-title">Top 100</div>
    <div class="asset-grid">
      ${topPlayers.map((player, index) => topCard(player, index)).join("")}
    </div>
  `, renderFriendsHubPage);
}

// =====================
// BIND
// =====================
function bindFriendsUI() {
  const addBtn = document.getElementById("add-friend-btn");
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      const username = getInputValue("friend-username-input");
      const ok = await addFriendByUsername(username);
      if (ok) {
        renderFriendsHubPage();
      }
    });
  }

  document.querySelectorAll("[data-add-friend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const username = btn.getAttribute("data-add-friend");
      const ok = await addFriendByUsername(username);
      if (ok) {
        renderFriendsHubPage();
      }
    });
  });

  document.querySelectorAll("[data-remove-friend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const username = btn.getAttribute("data-remove-friend");
      const ok = await removeFriendByUsername(username);
      if (ok) {
        renderFriendsHubPage();
      }
    });
  });
}
