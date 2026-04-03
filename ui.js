import { AppState } from "./app.js";
import { handleClick } from "./player.js";
import { BUSINESSES } from "./economy.js";
import { MarketState } from "./market.js";

const root = document.getElementById("page-content");

function setPage(html){
  if(root){
    root.innerHTML = html;
  }
  highlightActiveNav();
  bindDynamicUI();
}

function highlightActiveNav(){
  const current = document.body.dataset.currentPage || "profile";
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.page === current);
  });
}

function bindDynamicUI(){
  const clickBtn = document.getElementById("premium-click-btn");
  if(clickBtn){
    clickBtn.addEventListener("click", handleClick);
  }
}

function safeArray(v){
  return Array.isArray(v) ? v : [];
}

function safeObj(v){
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function formatMoney(n){
  return Math.floor(Number(n || 0)).toLocaleString("en-US");
}

function formatCompact(n){
  const value = Number(n || 0);
  if(value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if(value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if(value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return Math.floor(value).toString();
}

function getPlayer(){
  return AppState.player || {};
}

function getTitles(){
  return safeArray(getPlayer().titles);
}

function getBusinesses(){
  return safeArray(getPlayer().businesses);
}

function getRealty(){
  return safeArray(getPlayer().realty);
}

function getCars(){
  return safeArray(getPlayer().cars);
}

function getFriends(){
  return safeArray(getPlayer().friends);
}

function getCryptoWallet(){
  return safeObj(getPlayer().crypto);
}

function getStockWallet(){
  return safeObj(getPlayer().stocks);
}

function calcPassiveIncome(){
  const ownedBusinesses = getBusinesses();
  const levels = safeObj(getPlayer().business_levels);

  let total = 0;

  ownedBusinesses.forEach(id=>{
    const b = BUSINESSES.find(x=>x.id === id);
    if(!b) return;

    const level = Number(levels[id] || 1);
    total += Number(b.income || 0) * level;
  });

  return total;
}

function calcAssetValue(){
  let total = 0;

  getBusinesses().forEach(id=>{
    const b = BUSINESSES.find(x=>x.id === id);
    if(b) total += Number(b.price || 0);
  });

  Object.entries(getCryptoWallet()).forEach(([symbol, amount])=>{
    const asset = safeArray(MarketState.crypto).find(x=>x.id === symbol || x.symbol === symbol);
    if(asset) total += Number(amount || 0) * Number(asset.price || 0);
  });

  Object.entries(getStockWallet()).forEach(([symbol, amount])=>{
    const asset = safeArray(MarketState.stocks).find(x=>x.id === symbol || x.symbol === symbol);
    if(asset) total += Number(amount || 0) * Number(asset.price || 0);
  });

  return total + Number(getPlayer().balance || 0);
}

function getClassLabel(){
  return getPlayer().class || "none";
}

function getProfileCardHTML(){
  const p = getPlayer();

  return `
    <div class="bank-card glow">
      <div class="bank-top">
        <div>
          <div class="bank-label">BitBank Platinum</div>
          <div class="bank-name">${p.card_name || p.username || "Player"}</div>
        </div>
        <div class="bank-chip"></div>
      </div>

      <div class="bank-number">${p.card_number || "0000 0000 0000 0000"}</div>

      <div class="bank-bottom">
        <div>
          <div class="bank-small">Holder</div>
          <div class="bank-big">${p.username || "Unknown"}</div>
        </div>

        <div>
          <div class="bank-small">CVV</div>
          <div class="bank-big">${p.card_cvv || "000"}</div>
        </div>

        <div>
          <div class="bank-small">EXP</div>
          <div class="bank-big">${p.card_expiry || "12/30"}</div>
        </div>
      </div>
    </div>
  `;
}

function getBalanceCardsHTML(){
  const p = getPlayer();

  return `
    <div class="balance-duo">
      <div class="balance-card balance-uah">
        <div class="currency">Main Balance · UAH</div>
        <div class="amount green">₴ ${formatMoney(p.balance)}</div>
        <div class="hint">Ready for business, crypto and transfers</div>
      </div>

      <div class="balance-card balance-usd">
        <div class="currency">Dollar Wallet · USD</div>
        <div class="amount orange">$ ${formatMoney(p.usd)}</div>
        <div class="hint">Use for premium assets and conversions</div>
      </div>
    </div>
  `;
}

function getStatsHTML(){
  const p = getPlayer();

  return `
    <div class="premium-stat-grid">
      <div class="card stat-card">
        <div class="stat-label">Total Earned</div>
        <div class="stat-value">₴ ${formatCompact(p.total_earned)}</div>
        <div class="stat-sub">All-time revenue</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Passive Income</div>
        <div class="stat-value green">₴ ${formatCompact(calcPassiveIncome())}</div>
        <div class="stat-sub">Per minute from businesses</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Class</div>
        <div class="stat-value">${getClassLabel()}</div>
        <div class="stat-sub">Current account status</div>
      </div>

      <div class="card stat-card">
        <div class="stat-label">Total Assets</div>
        <div class="stat-value blue">₴ ${formatCompact(calcAssetValue())}</div>
        <div class="stat-sub">Balance + holdings</div>
      </div>
    </div>
  `;
}

function getTitlesHTML(){
  const titles = getTitles();

  return `
    <div class="card">
      <h3>Titles & Status</h3>
      <div class="titles-list">
        ${
          titles.length
            ? titles.map(title => `<div class="title-pill">${title}</div>`).join("")
            : `<div class="title-pill">No titles yet</div>`
        }
      </div>
    </div>
  `;
}

function getQuickActionsHTML(){
  return `
    <div class="card">
      <h3>Card Actions</h3>
      <div class="profile-actions">
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=card]')?.click()">Edit Card</button>
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=transfers]')?.click()">Open Transfers</button>
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=stats]')?.click()">View Stats</button>
      </div>
    </div>
  `;
}

function getConvertHTML(){
  return `
    <div class="card">
      <h3>Convert Currency</h3>
      <p>Move value between UAH and USD for a premium banking feel.</p>
      <div class="profile-actions">
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=transfers]')?.click()">UAH → USD</button>
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=transfers]')?.click()">USD → UAH</button>
      </div>
    </div>
  `;
}

function getPassiveHTML(){
  return `
    <div class="card">
      <h3>Income Engine</h3>
      <p>Your passive revenue grows from businesses, assets and activity.</p>
      <div class="profile-actions">
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=business]')?.click()">Manage Businesses</button>
        <button class="secondary" onclick="document.querySelector('.nav-btn[data-page=crypto]')?.click()">Open Portfolio</button>
      </div>
    </div>
  `;
}

function getClickPanelHTML(){
  return `
    <div class="click-panel">
      <div class="click-copy">
        <h3>Instant Revenue</h3>
        <p>Tap to generate extra money and push your economy forward in real time.</p>
      </div>
      <button id="premium-click-btn" class="click-button">CLICK</button>
    </div>
  `;
}

export function renderProfilePage(){
  document.body.dataset.currentPage = "profile";

  const p = getPlayer();

  setPage(`
    <div class="dashboard-grid">
      <div class="profile-main">
        ${getProfileCardHTML()}
        <div class="profile-side-stack">
          ${getQuickActionsHTML()}
          ${getConvertHTML()}
          ${getPassiveHTML()}
        </div>
      </div>

      <div class="card">
        <h3>Account Overview</h3>
        <p><span class="muted">Username:</span> ${p.username || "—"}</p>
        <p><span class="muted">Device:</span> ${p.device || "desktop"}</p>
        <p><span class="muted">Class:</span> ${getClassLabel()}</p>
        <p><span class="muted">Friends:</span> ${getFriends().length}</p>
        <p><span class="muted">Businesses:</span> ${getBusinesses().length}</p>
        <p><span class="muted">Cars:</span> ${getCars().length}</p>
        <p><span class="muted">Realty:</span> ${getRealty().length}</p>
      </div>

      <div class="section-title">Wallet</div>
      ${getBalanceCardsHTML()}

      <div class="section-title">Performance</div>
      ${getStatsHTML()}

      <div class="section-title">Titles</div>
      ${getTitlesHTML()}

      <div class="section-title">Manual Income</div>
      ${getClickPanelHTML()}
    </div>
  `);
}

export function renderBusinessPage(){
  document.body.dataset.currentPage = "business";

  const cards = BUSINESSES.map(item=>{
    const owned = getBusinesses().includes(item.id);

    return `
      <div class="card asset-card">
        <div class="asset-cover">
          <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80" alt="${item.name}">
          <div class="asset-badge">${owned ? "Owned" : "Business"}</div>
        </div>

        <div class="asset-info">
          <div class="asset-head">
            <div class="asset-name">${item.name}</div>
            <div class="asset-price">₴ ${formatCompact(item.price)}</div>
          </div>

          <div class="asset-meta">
            <span>Income: ₴ ${formatCompact(item.income)}/min</span>
            <span>Status: ${owned ? "Purchased" : "Available"}</span>
          </div>

          <div class="asset-actions">
            <button>Buy</button>
            <button class="secondary">Upgrade</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  setPage(`
    <div class="section-title">Business Portfolio</div>
    <div class="asset-grid">${cards}</div>
  `);
}

export function renderInventoryPage(){
  document.body.dataset.currentPage = "inventory";

  const inventory = safeArray(getPlayer().inventory);

  setPage(`
    <div class="section-title">Inventory</div>
    <div class="asset-grid">
      ${
        inventory.length
          ? inventory.map((item, i)=>`
              <div class="card asset-card">
                <div class="asset-info">
                  <div class="asset-head">
                    <div class="asset-name">${item.name || `Item ${i + 1}`}</div>
                    <div class="asset-price">₴ ${formatCompact(item.value || 0)}</div>
                  </div>
                  <div class="asset-meta">
                    <span>Collectible</span>
                    <span>Stored asset</span>
                  </div>
                  <div class="asset-actions full">
                    <button class="secondary">Inspect</button>
                  </div>
                </div>
              </div>
            `).join("")
          : `
            <div class="card">
              <h3>No Items Yet</h3>
              <p>Your premium inventory will appear here after opening cases or buying items.</p>
            </div>
          `
      }
    </div>
  `);
}

export function renderStatsPage(){
  document.body.dataset.currentPage = "stats";

  const p = getPlayer();

  setPage(`
    <div class="dashboard-grid">
      <div class="card">
        <h3>Total Earnings</h3>
        <div class="stat-value">₴ ${formatMoney(p.total_earned)}</div>
        <p class="muted">All time income generated inside BitBank</p>
      </div>

      <div class="card">
        <h3>Portfolio Value</h3>
        <div class="stat-value blue">₴ ${formatMoney(calcAssetValue())}</div>
        <p class="muted">Balance + crypto + stocks + business value</p>
      </div>

      <div class="card">
        <h3>Passive / Min</h3>
        <div class="stat-value green">₴ ${formatMoney(calcPassiveIncome())}</div>
        <p class="muted">Automated business revenue</p>
      </div>

      <div class="card">
        <h3>Economy Snapshot</h3>
        <p>Businesses: ${getBusinesses().length}</p>
        <p>Crypto Assets: ${Object.keys(getCryptoWallet()).length}</p>
        <p>Stock Assets: ${Object.keys(getStockWallet()).length}</p>
        <p>Friends: ${getFriends().length}</p>
      </div>
    </div>
  `);
}

export function renderFriendsPage(){
  document.body.dataset.currentPage = "friends";

  const friends = getFriends();
  const players = safeArray(AppState.allPlayers);

  const cards = friends.length
    ? friends.map(id=>{
        const friend = players.find(p=>p.id === id);

        return `
          <div class="card asset-card">
            <div class="asset-info">
              <div class="asset-head">
                <div class="asset-name">${friend?.username || "Unknown Friend"}</div>
                <div class="asset-price">${friend?.device || "offline"}</div>
              </div>
              <div class="asset-meta">
                <span>ID: ${id}</span>
                <span>Status: ${friend ? "Known" : "Missing"}</span>
              </div>
              <div class="asset-actions full">
                <button class="secondary">Open Profile</button>
              </div>
            </div>
          </div>
        `;
      }).join("")
    : `
      <div class="card">
        <h3>No Friends Added</h3>
        <p>Add players by ID to build your premium network.</p>
      </div>
    `;

  setPage(`
    <div class="section-title">Friends Network</div>
    <div class="asset-grid">${cards}</div>
  `);
}

export function renderPageUI(page){
  switch(page){
    case "profile":
      renderProfilePage();
      break;
    case "business":
      renderBusinessPage();
      break;
    case "inventory":
      renderInventoryPage();
      break;
    case "stats":
      renderStatsPage();
      break;
    case "friends":
      renderFriendsPage();
      break;
    default:
      renderProfilePage();
      break;
  }
}
