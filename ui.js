// =====================
// IMPORTS
// =====================
import { AppState } from "./app.js";
import { handleClick } from "./player.js";
import { BUSINESSES, buyBusiness } from "./economy.js";

// =====================
// ROOT
// =====================
const root = document.getElementById("page-content");

// =====================
// HELPERS
// =====================
function setPage(html){
  root.innerHTML = html;
}

function card(content){
  return `<div class="card">${content}</div>`;
}

// =====================
// PROFILE PAGE
// =====================
export function renderProfilePage(){

  const p = AppState.player;

  setPage(`
    <h2>Profile</h2>
    ${card(`
      <p>${p.username}</p>
      <p>Balance: ${Math.floor(p.balance)}</p>
      <p>USD: ${Math.floor(p.usd)}</p>
    `)}

    <button id="click-btn">CLICK</button>
  `);

  document.getElementById("click-btn").onclick = handleClick;
}

// =====================
// BUSINESS PAGE
// =====================
export function renderBusinessPage(){

  let html = "<h2>Business</h2>";

  BUSINESSES.forEach(b=>{
    html += card(`
      <h3>${b.name}</h3>
      <p>Price: ${b.price}</p>
      <p>Income: ${b.income}/sec</p>
      <button onclick="buyBusinessUI(${b.id})">Buy</button>
    `);
  });

  setPage(html);
}

// =====================
// UI WRAPPER
// =====================
window.buyBusinessUI = function(id){
  buyBusiness(id);
};

// =====================
// INVENTORY PAGE
// =====================
export function renderInventoryPage(){

  const inv = AppState.player.inventory || [];

  let html = "<h2>Inventory</h2>";

  inv.forEach(i=>{
    html += card(`
      <p>${i.name}</p>
      <p>${i.value}</p>
    `);
  });

  setPage(html);
}

// =====================
// STATS PAGE
// =====================
export function renderStatsPage(){

  const p = AppState.player;

  setPage(`
    <h2>Stats</h2>
    ${card(`
      <p>Total Earned: ${Math.floor(p.total_earned)}</p>
      <p>Businesses: ${(p.businesses||[]).length}</p>
      <p>Cars: ${(p.cars||[]).length}</p>
    `)}
  `);
}

// =====================
// FRIENDS PAGE
// =====================
export function renderFriendsPage(){

  const p = AppState.player;

  let html = "<h2>Friends</h2>";

  (p.friends || []).forEach(id=>{
    const f = AppState.allPlayers.find(x=>x.id===id);
    if(f){
      html += card(`<p>${f.username}</p>`);
    }
  });

  setPage(html);
}

// =====================
// SIMPLE ROUTER UI
// =====================
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
  }
}
