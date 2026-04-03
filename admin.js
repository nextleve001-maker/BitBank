// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import {
  apiGetPlayer,
  apiUpdatePlayer,
  apiDeletePlayer,
  apiBanUser,
  apiUnbanUser
} from "./api.js";

// =====================
// CHECK ADMIN
// =====================
export function isAdmin(){
  const p = AppState.player;
  return p && (p.class === "creator" || p.username === "admin");
}

// =====================
// RENDER ADMIN PAGE
// =====================
export function renderAdminPage(){

  if(!isAdmin()){
    alert("No access");
    return;
  }

  document.getElementById("page-content").innerHTML = `
    <h2>Admin Panel</h2>

    <input id="admin-user" placeholder="username">
    <input id="admin-amount" placeholder="amount">

    <button onclick="adminGive()">Give Money</button>
    <button onclick="adminTake()">Take Money</button>
    <button onclick="adminSet()">Set Balance</button>

    <hr>

    <button onclick="adminBanUserUI()">Ban</button>
    <button onclick="adminUnbanUserUI()">Unban</button>
    <button onclick="adminDeleteUserUI()">Delete</button>

    <hr>

    <button onclick="adminShowPlayers()">Show Players</button>

    <div id="admin-output"></div>
  `;
}

// =====================
// UI HELPERS
// =====================
function getInputUser(){
  return document.getElementById("admin-user").value;
}

function getInputAmount(){
  return Number(document.getElementById("admin-amount").value);
}

function setOutput(text){
  document.getElementById("admin-output").innerHTML = text;
}

// =====================
// ADMIN ACTIONS
// =====================
async function giveMoney(){

  const username = getInputUser();
  const amount = getInputAmount();

  const user = await apiGetPlayer(username);
  if(!user) return setOutput("User not found");

  user.balance += amount;
  user.total_earned += amount;

  await apiUpdatePlayer(username, {
    balance:user.balance,
    total_earned:user.total_earned
  });

  setOutput("Money given");
}

async function takeMoney(){

  const username = getInputUser();
  const amount = getInputAmount();

  const user = await apiGetPlayer(username);
  if(!user) return setOutput("User not found");

  user.balance -= amount;

  await apiUpdatePlayer(username, {
    balance:user.balance
  });

  setOutput("Money taken");
}

async function setBalance(){

  const username = getInputUser();
  const amount = getInputAmount();

  await apiUpdatePlayer(username, {
    balance:amount
  });

  setOutput("Balance set");
}

async function banUser(){

  const username = getInputUser();

  await apiBanUser(username);

  setOutput("User banned");
}

async function unbanUser(){

  const username = getInputUser();

  await apiUnbanUser(username);

  setOutput("User unbanned");
}

async function deleteUser(){

  const username = getInputUser();

  await apiDeletePlayer(username);

  setOutput("User deleted");
}

// =====================
// SHOW PLAYERS
// =====================
function showPlayers(){

  const players = AppState.allPlayers;

  let html = "<h3>Players</h3>";

  players.forEach(p=>{
    html += `
      <div class="card">
        <p>${p.username}</p>
        <p>₴ ${Math.floor(p.balance)}</p>
      </div>
    `;
  });

  setOutput(html);
}

// =====================
// BIND GLOBAL UI
// =====================
window.adminGive = giveMoney;
window.adminTake = takeMoney;
window.adminSet = setBalance;

window.adminBanUserUI = banUser;
window.adminUnbanUserUI = unbanUser;
window.adminDeleteUserUI = deleteUser;

window.adminShowPlayers = showPlayers;
