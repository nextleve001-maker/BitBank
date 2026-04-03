// =====================
// GLOBAL STATE
// =====================
export const AppState = {
  currentUser: null,
  player: null,
  allPlayers: [],
  gameState: null,
  lang: "ua",
  initialized: false
};

// =====================
// INIT APP
// =====================
export async function initApp(){

  console.log("🚀 BitBank старт");

  bindGlobalEvents();

  const session = loadSession();

  if(session){
    await startApp(session);
  } else {
    showLogin();
  }

  startLoops();
}

// =====================
// START APP (LOGINED)
// =====================
export async function startApp(username){

  AppState.currentUser = username;

  hideLogin();
  showApp();

  await loadPlayer();
  await loadGameState();
  await loadAllPlayers();

  applyOfflineIncome();

  updateHeader();
  renderDefaultPage();

  AppState.initialized = true;
}

// =====================
// LOADERS
// =====================
async function loadPlayer(){

  const {data} = await supabaseClient
    .from("players")
    .select("*")
    .eq("username",AppState.currentUser)
    .single();

  AppState.player = data;
}

async function loadGameState(){

  const {data} = await supabaseClient
    .from("game_state")
    .select("*")
    .eq("id",1)
    .single();

  AppState.gameState = data;
}

async function loadAllPlayers(){

  const {data} = await supabaseClient
    .from("players")
    .select("*");

  AppState.allPlayers = data || [];
}

// =====================
// SESSION
// =====================
export function saveSession(username){
  localStorage.setItem("bb_user", username);
}

export function loadSession(){
  return localStorage.getItem("bb_user");
}

export function logout(){
  localStorage.removeItem("bb_user");
  location.reload();
}

// =====================
// UI CONTROL
// =====================
function showLogin(){
  document.getElementById("login-screen").classList.remove("hidden");
}

function hideLogin(){
  document.getElementById("login-screen").classList.add("hidden");
}

function showApp(){
  document.getElementById("app-screen").classList.remove("hidden");
}

// =====================
// HEADER
// =====================
export function updateHeader(){

  const p = AppState.player;

  document.getElementById("header-username").innerText = p.username;
  document.getElementById("balance-uah").innerText = "₴ " + Math.floor(p.balance);
  document.getElementById("balance-usd").innerText = "$ " + Math.floor(p.usd);
}

// =====================
// DEFAULT PAGE
// =====================
function renderDefaultPage(){

  document.getElementById("page-content").innerHTML = `
    <h2>Welcome ${AppState.player.username}</h2>
    <p>Balance: ${Math.floor(AppState.player.balance)}</p>
  `;
}

// =====================
// OFFLINE INCOME
// =====================
function applyOfflineIncome(){

  const p = AppState.player;

  if(!p.last_seen) return;

  const last = new Date(p.last_seen);
  const now = new Date();

  const minutes = Math.floor((now - last)/60000);

  if(minutes <= 0) return;

  const income = minutes * calcPassiveIncome();

  p.balance += income;
  p.total_earned += income;

  updatePlayer({
    balance:p.balance,
    total_earned:p.total_earned
  });
}

// =====================
// EVENTS
// =====================
function bindGlobalEvents(){

  document.getElementById("logout-btn").onclick = logout;

  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const page = btn.dataset.page;
      renderPage(page);
    });
  });
}

// =====================
// ROUTER
// =====================
function renderPage(page){

  console.log("Render:", page);

  switch(page){
    case "profile":
      renderProfilePage();
      break;

    case "crypto":
      renderCryptoPage();
      break;

    case "stocks":
      renderStocksPage();
      break;

    case "business":
      renderBusinessPage();
      break;

    case "cars":
      renderCarsPage();
      break;

    case "realty":
      renderRealtyPage();
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

    case "admin":
      renderAdminPage();
      break;

    default:
      renderDefaultPage();
  }
}

// =====================
// LOOPS
// =====================
function startLoops(){

  setInterval(presenceTick,5000);
  setInterval(passiveTick,1000);
  setInterval(marketTick,3000);
  setInterval(checkQuests,5000);
  setInterval(checkAchievements,7000);
}

// =====================
// PLAYER UPDATE
// =====================
export async function updatePlayer(patch){

  const username = AppState.player.username;

  await supabaseClient
    .from("players")
    .update(patch)
    .eq("username",username);

  Object.assign(AppState.player, patch);

  updateHeader();
}

// =====================
// BOOT
// =====================
initApp();
