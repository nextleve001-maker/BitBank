// =====================
// SUPABASE INIT
// =====================
const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// GLOBAL STATE
// =====================
let currentUser = null;
let player = null;
let allPlayers = [];
let gameState = null;
let currentLang = "ua";

// =====================
// LANGUAGE SYSTEM
// =====================
const LANG = {
  ua: {
    login: "Увійти",
    register: "Реєстрація",
    balance: "Баланс",
    total: "Зароблено",
    class: "Клас",
    business: "Бізнес",
    buy: "Купити",
    upgrade: "Прокачати",
    owned: "Куплено",
    notEnough: "Недостатньо коштів"
  },
  en: {
    login: "Login",
    register: "Register",
    balance: "Balance",
    total: "Total earned",
    class: "Class",
    business: "Business",
    buy: "Buy",
    upgrade: "Upgrade",
    owned: "Owned",
    notEnough: "Not enough money"
  }
};

function t(key){
  return LANG[currentLang][key] || key;
}

// =====================
// DEVICE
// =====================
function currentDeviceType(){
  return /Mobi/.test(navigator.userAgent) ? "phone" : "desktop";
}

// =====================
// SESSION
// =====================
function saveSession(username){
  localStorage.setItem("bb_user", username);
}
function loadSession(){
  return localStorage.getItem("bb_user");
}
function logoutUser(){
  localStorage.removeItem("bb_user");
  location.reload();
}

// =====================
// BUSINESS DATA (25)
// =====================
const BUSINESSES = [
{id:1,name:"Кав'ярня",price:1000,income:5,img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93"},
{id:2,name:"Магазин",price:2000,income:10,img:"https://images.unsplash.com/photo-1521335629791-ce4aec67dd53"},
{id:3,name:"Фітнес-клуб",price:5000,income:25,img:"https://images.unsplash.com/photo-1558611848-73f7eb4001ab"},
{id:4,name:"Ресторан",price:10000,income:50,img:"https://images.unsplash.com/photo-1555992336-03a23c6c4f6c"},
{id:5,name:"Готель",price:20000,income:100,img:"https://images.unsplash.com/photo-1566073771259-6a8506099945"},
{id:6,name:"IT студія",price:50000,income:250,img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085"},
{id:7,name:"ТЦ",price:100000,income:500,img:"https://images.unsplash.com/photo-1528701800489-20be3c07bb1b"},
{id:8,name:"Фабрика",price:200000,income:1000,img:"https://images.unsplash.com/photo-1581090700227-1e37b190418e"},
{id:9,name:"Авіакомпанія",price:500000,income:2500,img:"https://images.unsplash.com/photo-1498887960847-2a5e46312788"},
{id:10,name:"Банк",price:1000000,income:5000,img:"https://images.unsplash.com/photo-1565372910418-bc3d5b8b68d9"},

{id:11,name:"Crypto Startup",price:1500000,income:7000,img:"https://images.unsplash.com/photo-1621761191319-c6fb62004040"},
{id:12,name:"AI Company",price:2000000,income:9000,img:"https://images.unsplash.com/photo-1581090700227"},
{id:13,name:"Cloud Service",price:2500000,income:11000,img:"https://images.unsplash.com/photo-1504639725590-34d0984388bd"},
{id:14,name:"Game Studio",price:3000000,income:14000,img:"https://images.unsplash.com/photo-1542751371-adc38448a05e"},
{id:15,name:"Space Corp",price:5000000,income:20000,img:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"},
{id:16,name:"Mining Corp",price:7000000,income:26000,img:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f"},
{id:17,name:"Oil Company",price:9000000,income:32000,img:"https://images.unsplash.com/photo-1509395176047-4a66953fd231"},
{id:18,name:"Media Empire",price:12000000,income:40000,img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"},
{id:19,name:"Pharma Giant",price:15000000,income:50000,img:"https://images.unsplash.com/photo-1580281658629-40c0b1c2e0d1"},
{id:20,name:"Global Bank",price:20000000,income:65000,img:"https://images.unsplash.com/photo-1565372910418-bc3d5b8b68d9"},

{id:21,name:"Quantum Lab",price:30000000,income:90000,img:"https://images.unsplash.com/photo-1555949963-aa79dcee981c"},
{id:22,name:"Mars Colony",price:50000000,income:150000,img:"https://images.unsplash.com/photo-1446776811953"},
{id:23,name:"AI World",price:70000000,income:200000,img:"https://images.unsplash.com/photo-1581090700227"},
{id:24,name:"Meta Universe",price:90000000,income:300000,img:"https://images.unsplash.com/photo-1639322537228-f710d846310a"},
{id:25,name:"Time Corp",price:120000000,income:500000,img:"https://images.unsplash.com/photo-1500530855697"}
];

// =====================
// DATABASE CORE
// =====================
async function fetchAllPlayers(){
  const {data} = await supabaseClient.from("players").select("*");
  allPlayers = data || [];
}

async function fetchGameState(){
  const {data} = await supabaseClient
  .from("game_state")
  .select("*")
  .eq("id",1)
  .single();
  gameState = data;
}

// =====================
// AUTH
// =====================
async function createPlayer(username,password){
  await supabaseClient.from("players").insert({
    username,
    password,
    class:"none",
    balance:1000,
    usd:0,
    total_earned:0,
    crypto:{},
    stocks:{},
    businesses:[],
    business_levels:{},
    realty:[],
    cars:[],
    titles:[],
    friends:[],
    card_name:username,
    card_color:"#3b82f6",
    card_cvv:"123",
    card_number:"0000 0000 0000 0000",
    card_expiry:"12/30",
    device:currentDeviceType(),
    banned:false,
    last_seen:new Date().toISOString(),
    last_bonus_day:"",
    vip_giveaway_day:""
  });
}

async function loginPlayer(username,password){
  return await supabaseClient
  .from("players")
  .select("*")
  .eq("username",username)
  .eq("password",password)
  .maybeSingle();
}

// =====================
// START APP
// =====================
async function startApp(){
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  currentUser = loadSession();

  const {data} = await supabaseClient
  .from("players")
  .select("*")
  .eq("username",currentUser)
  .single();

  player = data;

  await fetchGameState();
  await fetchAllPlayers();

  updateHeader();
  renderProfilePage();
}

// =====================
// HEADER
// =====================
function updateHeader(){
  document.getElementById("header-username").innerText = player.username;
  document.getElementById("balance-uah").innerText = "₴ "+Math.floor(player.balance);
  document.getElementById("balance-usd").innerText = "$ "+Math.floor(player.usd);
}

// =====================
// PROFILE
// =====================
function renderProfilePage(){
  document.getElementById("page-content").innerHTML = `
    <h2>${player.username}</h2>
    <p>${t("class")}: ${player.class}</p>
    <p>${t("balance")}: ${Math.floor(player.balance)}</p>
    <p>${t("total")}: ${Math.floor(player.total_earned)}</p>
  `;
}

// =====================
// BUSINESS PAGE
// =====================
function renderBusinessPage(){

  let html = `<h2>${t("business")}</h2>`;

  BUSINESSES.forEach(b=>{

    const owned = player.businesses.includes(b.id);
    const level = player.business_levels[b.id] || 0;

    html += `
    <div class="card">
      <img src="${b.img}" onerror="this.src='https://via.placeholder.com/200'">
      <h3>${b.name}</h3>
      <p>₴ ${b.price}</p>
      <p>Income: ${b.income}</p>
      <p>Level: ${level}</p>

      ${
        !owned
        ? `<button onclick="buyBusiness(${b.id})">${t("buy")}</button>`
        : `<button onclick="upgradeBusiness(${b.id})">${t("upgrade")}</button>`
      }
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// BUY BUSINESS
// =====================
async function buyBusiness(id){

  const b = BUSINESSES.find(x=>x.id===id);

  if(player.balance < b.price){
    alert(t("notEnough"));
    return;
  }

  player.balance -= b.price;
  player.businesses.push(id);
  player.business_levels[id] = 1;

  await updatePlayer();

  renderBusinessPage();
}

// =====================
// UPGRADE BUSINESS
// =====================
async function upgradeBusiness(id){

  const lvl = player.business_levels[id] || 1;
  const price = lvl * 500;

  if(player.balance < price){
    alert(t("notEnough"));
    return;
  }

  player.balance -= price;
  player.business_levels[id]++;

  await updatePlayer();

  renderBusinessPage();
}

// =====================
// UPDATE PLAYER
// =====================
async function updatePlayer(){
  await supabaseClient
  .from("players")
  .update({
    balance:player.balance,
    businesses:player.businesses,
    business_levels:player.business_levels
  })
  .eq("username",player.username);

  updateHeader();
}

// =====================
// EVENTS
// =====================
function bindEvents(){

  document.getElementById("login-btn").onclick = async ()=>{
    const u = document.getElementById("login-username").value;
    const p = document.getElementById("login-password").value;

    const {data} = await loginPlayer(u,p);
    if(!data) return alert("error");

    saveSession(u);
    startApp();
  };

  document.getElementById("register-btn").onclick = async ()=>{
    const u = document.getElementById("register-username").value;
    const p = document.getElementById("register-password").value;

    await createPlayer(u,p);
    alert("ok");
  };

  document.getElementById("logout-btn").onclick = logoutUser;

  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.onclick = ()=>{
      const p = btn.dataset.page;

      if(p==="profile") renderProfilePage();
      if(p==="business") renderBusinessPage();
    };
  });

  document.getElementById("lang-btn").onclick = ()=>{
    currentLang = currentLang==="ua" ? "en" : "ua";
    renderProfilePage();
  };
}

// =====================
// INIT
// =====================
function initApp(){
  bindEvents();

  const s = loadSession();
  if(s) startApp();
}

initApp();
// =====================
// CRYPTO DATA (10)
// =====================
const CRYPTO = [
{symbol:"BTC",price:1000000,img:"https://cryptologos.cc/logos/bitcoin-btc-logo.png"},
{symbol:"ETH",price:70000,img:"https://cryptologos.cc/logos/ethereum-eth-logo.png"},
{symbol:"BNB",price:20000,img:"https://cryptologos.cc/logos/bnb-bnb-logo.png"},
{symbol:"SOL",price:5000,img:"https://cryptologos.cc/logos/solana-sol-logo.png"},
{symbol:"XRP",price:20,img:"https://cryptologos.cc/logos/xrp-xrp-logo.png"},
{symbol:"ADA",price:15,img:"https://cryptologos.cc/logos/cardano-ada-logo.png"},
{symbol:"DOGE",price:5,img:"https://cryptologos.cc/logos/dogecoin-doge-logo.png"},
{symbol:"TON",price:300,img:"https://cryptologos.cc/logos/toncoin-ton-logo.png"},
{symbol:"DOT",price:400,img:"https://cryptologos.cc/logos/polkadot-new-dot-logo.png"},
{symbol:"AVAX",price:900,img:"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
];

// =====================
// STOCK DATA (10)
// =====================
const STOCKS = [
{id:"apple",name:"Apple",price:7000,img:"https://logo.clearbit.com/apple.com"},
{id:"microsoft",name:"Microsoft",price:6500,img:"https://logo.clearbit.com/microsoft.com"},
{id:"google",name:"Google",price:6000,img:"https://logo.clearbit.com/google.com"},
{id:"amazon",name:"Amazon",price:5500,img:"https://logo.clearbit.com/amazon.com"},
{id:"tesla",name:"Tesla",price:8000,img:"https://logo.clearbit.com/tesla.com"},
{id:"nvidia",name:"NVIDIA",price:9000,img:"https://logo.clearbit.com/nvidia.com"},
{id:"meta",name:"Meta",price:5000,img:"https://logo.clearbit.com/meta.com"},
{id:"intel",name:"Intel",price:3000,img:"https://logo.clearbit.com/intel.com"},
{id:"amd",name:"AMD",price:4000,img:"https://logo.clearbit.com/amd.com"},
{id:"netflix",name:"Netflix",price:4500,img:"https://logo.clearbit.com/netflix.com"}
];

// =====================
// MARKET TICK
// =====================
function marketTick(){

  CRYPTO.forEach(c=>{
    let change = (Math.random()-0.5)*0.1;
    c.price += c.price * change;
    if(c.price < 1) c.price = 1;
  });

  STOCKS.forEach(s=>{
    let change = (Math.random()-0.5)*0.05;
    s.price += s.price * change;
    if(s.price < 10) s.price = 10;
  });

  if(document.getElementById("page-content").innerHTML.includes("Crypto")){
    renderCryptoPage();
  }
}

// =====================
// CRYPTO PAGE
// =====================
function renderCryptoPage(){

  let html = `<h2>Crypto</h2>`;

  CRYPTO.forEach(c=>{

    const owned = player.crypto[c.symbol] || 0;

    html += `
    <div class="card">
      <img src="${c.img}" width="50" onerror="this.src='https://via.placeholder.com/50'">
      <h3>${c.symbol}</h3>
      <p>₴ ${Math.floor(c.price)}</p>
      <p>Owned: ${owned}</p>

      <input id="buy-${c.symbol}" placeholder="Amount">
      <button onclick="buyCrypto('${c.symbol}')">Buy</button>

      <input id="sell-${c.symbol}" placeholder="Amount">
      <button onclick="sellCrypto('${c.symbol}')">Sell</button>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// BUY CRYPTO
// =====================
async function buyCrypto(symbol){

  const c = CRYPTO.find(x=>x.symbol===symbol);
  const amount = Number(document.getElementById("buy-"+symbol).value);

  const cost = amount * c.price;

  if(player.balance < cost){
    return alert("no money");
  }

  player.balance -= cost;
  player.crypto[symbol] = (player.crypto[symbol]||0) + amount;

  await updatePlayerFull();

  renderCryptoPage();
}

// =====================
// SELL CRYPTO
// =====================
async function sellCrypto(symbol){

  const c = CRYPTO.find(x=>x.symbol===symbol);
  const amount = Number(document.getElementById("sell-"+symbol).value);

  if((player.crypto[symbol]||0) < amount){
    return alert("not enough");
  }

  player.crypto[symbol] -= amount;
  player.balance += amount * c.price;

  await updatePlayerFull();

  renderCryptoPage();
}

// =====================
// STOCK PAGE
// =====================
function renderStocksPage(){

  let html = `<h2>Stocks</h2>`;

  STOCKS.forEach(s=>{

    const owned = player.stocks[s.id] || 0;

    html += `
    <div class="card">
      <img src="${s.img}" width="50">
      <h3>${s.name}</h3>
      <p>₴ ${Math.floor(s.price)}</p>
      <p>Owned: ${owned}</p>

      <input id="buy-stock-${s.id}" placeholder="Amount">
      <button onclick="buyStock('${s.id}')">Buy</button>

      <input id="sell-stock-${s.id}" placeholder="Amount">
      <button onclick="sellStock('${s.id}')">Sell</button>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// BUY STOCK
// =====================
async function buyStock(id){

  const s = STOCKS.find(x=>x.id===id);
  const amount = Number(document.getElementById("buy-stock-"+id).value);

  const cost = amount * s.price;

  if(player.balance < cost){
    return alert("no money");
  }

  player.balance -= cost;
  player.stocks[id] = (player.stocks[id]||0) + amount;

  await updatePlayerFull();

  renderStocksPage();
}

// =====================
// SELL STOCK
// =====================
async function sellStock(id){

  const s = STOCKS.find(x=>x.id===id);
  const amount = Number(document.getElementById("sell-stock-"+id).value);

  if((player.stocks[id]||0) < amount){
    return alert("not enough");
  }

  player.stocks[id] -= amount;
  player.balance += amount * s.price;

  await updatePlayerFull();

  renderStocksPage();
}

// =====================
// TRANSFER PAGE
// =====================
function renderTransferPage(){

  document.getElementById("page-content").innerHTML = `
    <h2>Transfer</h2>

    <input id="to-user" placeholder="Username">
    <input id="amount" placeholder="Amount">
    <input id="cvv" placeholder="CVV">

    <button onclick="transferUAH()">Send UAH</button>
  `;
}

// =====================
// TRANSFER UAH
// =====================
async function transferUAH(){

  const to = document.getElementById("to-user").value;
  const amount = Number(document.getElementById("amount").value);
  const cvv = document.getElementById("cvv").value;

  if(cvv !== player.card_cvv){
    return alert("wrong cvv");
  }

  const fee = amount * 0.05;

  if(player.balance < amount + fee){
    return alert("no money");
  }

  const {data} = await supabaseClient
    .from("players")
    .select("*")
    .eq("username",to)
    .single();

  if(!data) return alert("no user");

  player.balance -= amount + fee;
  data.balance += amount;

  await supabaseClient.from("players").update({
    balance:player.balance
  }).eq("username",player.username);

  await supabaseClient.from("players").update({
    balance:data.balance
  }).eq("username",to);

  gameState.commission_bank += fee;
  await saveGameState();

  alert("sent");
}

// =====================
// UPDATE FULL PLAYER
// =====================
async function updatePlayerFull(){

  await supabaseClient
  .from("players")
  .update({
    balance:player.balance,
    crypto:player.crypto,
    stocks:player.stocks
  })
  .eq("username",player.username);

  updateHeader();
}

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const p = btn.dataset.page;

    if(p==="crypto") renderCryptoPage();
    if(p==="stocks") renderStocksPage();
    if(p==="transfer") renderTransferPage();
  });
});

// =====================
// MARKET LOOP
// =====================
setInterval(marketTick,3000);
// =====================
// REALTY DATA (25)
// =====================
const REALTY = [
{id:1,name:"Palm Island",price:50000,img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e"},
{id:2,name:"Volcano Island",price:80000,img:"https://images.unsplash.com/photo-1501785888041-af3ef285b470"},
{id:3,name:"Paradise Island",price:120000,img:"https://images.unsplash.com/photo-1507525428034"},
{id:4,name:"Treasure Island",price:200000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:5,name:"Sky Villa",price:300000,img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994"},
{id:6,name:"Ocean Home",price:500000,img:"https://images.unsplash.com/photo-1507089947368-19c1da9775ae"},
{id:7,name:"Luxury Penthouse",price:800000,img:"https://images.unsplash.com/photo-1493809842364-78817add7ffb"},
{id:8,name:"Lake House",price:1000000,img:"https://images.unsplash.com/photo-1505691938895-1758d7feb511"},
{id:9,name:"Castle",price:2000000,img:"https://images.unsplash.com/photo-1507081323647-4d250478b919"},
{id:10,name:"Private Resort",price:5000000,img:"https://images.unsplash.com/photo-1501117716987-c8e1ecb2103b"},

{id:11,name:"Island City",price:7000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:12,name:"Space Base",price:10000000,img:"https://images.unsplash.com/photo-1446776811953"},
{id:13,name:"Underwater City",price:15000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:14,name:"Floating City",price:20000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:15,name:"Moon Colony",price:30000000,img:"https://images.unsplash.com/photo-1446776811953"},
{id:16,name:"Mars Colony",price:40000000,img:"https://images.unsplash.com/photo-1446776811953"},
{id:17,name:"Galactic Hub",price:60000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:18,name:"AI City",price:80000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:19,name:"Metaverse Land",price:100000000,img:"https://images.unsplash.com/photo-1639322537228"},
{id:20,name:"Time Realm",price:150000000,img:"https://images.unsplash.com/photo-1500530855697"},

{id:21,name:"Quantum Base",price:200000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:22,name:"Infinity Island",price:300000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:23,name:"Cyber Planet",price:500000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:24,name:"God Realm",price:800000000,img:"https://images.unsplash.com/photo-1500530855697"},
{id:25,name:"Universe Core",price:1000000000,img:"https://images.unsplash.com/photo-1500530855697"}
];

// =====================
// CARS DATA (25)
// =====================
const CARS = [
{id:1,name:"Toyota Corolla",price:2000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:2,name:"Honda Civic",price:3000,img:"https://cdn.pixabay.com/photo/2013/07/12/18/39/car-153700_1280.png"},
{id:3,name:"BMW 3",price:5000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:4,name:"Tesla Model 3",price:8000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:5,name:"Mercedes G",price:15000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:6,name:"Lambo Huracan",price:50000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:7,name:"Porsche 911",price:40000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:8,name:"Audi RS7",price:35000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:9,name:"Ferrari F8",price:60000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:10,name:"Rolls Cullinan",price:100000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},

{id:11,name:"Cyber Car",price:200000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:12,name:"AI Car",price:300000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:13,name:"Flying Car",price:500000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:14,name:"Space Car",price:800000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:15,name:"Quantum Car",price:1000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:16,name:"Time Car",price:1500000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:17,name:"Meta Car",price:2000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:18,name:"God Car",price:3000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:19,name:"Infinity Car",price:5000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:20,name:"Universe Car",price:8000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},

{id:21,name:"Galaxy Car",price:10000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:22,name:"AI Beast",price:15000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:23,name:"Cyber Beast",price:20000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:24,name:"Titan Car",price:30000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"},
{id:25,name:"Ultimate Car",price:50000000,img:"https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"}
];

// =====================
// REALTY PAGE
// =====================
function renderRealtyPage(){

  let html = "<h2>Realty</h2>";

  REALTY.forEach(r=>{
    const owned = player.realty.includes(r.id);

    html += `
    <div class="card">
      <img src="${r.img}" width="100">
      <h3>${r.name}</h3>
      <p>₴ ${r.price}</p>
      ${
        owned
        ? "<p>Owned</p>"
        : `<button onclick="buyRealty(${r.id})">Buy</button>`
      }
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// BUY REALTY
// =====================
async function buyRealty(id){

  const r = REALTY.find(x=>x.id===id);

  if(player.balance < r.price){
    return alert("no money");
  }

  player.balance -= r.price;
  player.realty.push(id);

  await updatePlayerAssets();

  renderRealtyPage();
}

// =====================
// CARS PAGE
// =====================
function renderCarsPage(){

  let html = "<h2>Cars</h2>";

  CARS.forEach(c=>{
    const owned = player.cars.includes(c.id);

    html += `
    <div class="card">
      <img src="${c.img}" width="100">
      <h3>${c.name}</h3>
      <p>$ ${c.price}</p>
      ${
        owned
        ? "<p>Owned</p>"
        : `<button onclick="buyCar(${c.id})">Buy</button>`
      }
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// BUY CAR
// =====================
async function buyCar(id){

  const c = CARS.find(x=>x.id===id);

  if(player.usd < c.price){
    return alert("no usd");
  }

  player.usd -= c.price;
  player.cars.push(id);

  await updatePlayerAssets();

  renderCarsPage();
}

// =====================
// UPDATE ASSETS
// =====================
async function updatePlayerAssets(){
  await supabaseClient
  .from("players")
  .update({
    balance:player.balance,
    usd:player.usd,
    realty:player.realty,
    cars:player.cars
  })
  .eq("username",player.username);

  updateHeader();
}

// =====================
// PASSIVE INCOME FROM BUSINESS
// =====================
function calcPassiveIncome(){

  let total = 0;

  player.businesses.forEach(id=>{
    const b = BUSINESSES.find(x=>x.id===id);
    const lvl = player.business_levels[id] || 1;

    total += b.income * lvl;
  });

  return total;
}

// =====================
// PASSIVE TICK
// =====================
function passiveTick(){

  const income = calcPassiveIncome()/60;

  player.balance += income;
  player.total_earned += income;

  updatePlayerFull();
}

// =====================
// TITLES SYSTEM
// =====================
function checkTitles(){

  if(player.total_earned >= 10000 && !player.titles.includes("💸 10K")){
    player.titles.push("💸 10K");
  }

  if(player.total_earned >= 100000 && !player.titles.includes("🏆 100K")){
    player.titles.push("🏆 100K");
  }

  if(player.businesses.length >= 3 && !player.titles.includes("🏢 Biz")){
    player.titles.push("🏢 Biz");
  }

  if(player.realty.length >= 2 && !player.titles.includes("🏝 Owner")){
    player.titles.push("🏝 Owner");
  }

  if(player.cars.length >= 2 && !player.titles.includes("🚗 Collector")){
    player.titles.push("🚗 Collector");
  }
}

// =====================
// FRIENDS SYSTEM
// =====================
function renderFriendsPage(){

  let html = "<h2>Friends</h2>";

  html += `
    <input id="friend-id" placeholder="ID">
    <button onclick="addFriend()">Add</button>
  `;

  player.friends.forEach(f=>{
    const friend = allPlayers.find(x=>x.id===f);

    if(friend){
      html += `<div>${friend.username}</div>`;
    }
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// ADD FRIEND
// =====================
async function addFriend(){

  const id = document.getElementById("friend-id").value;

  const {data} = await supabaseClient
    .from("players")
    .select("*")
    .eq("id",id)
    .single();

  if(!data) return alert("no user");

  player.friends.push(data.id);

  await updatePlayerFriends();
}

// =====================
// UPDATE FRIENDS
// =====================
async function updatePlayerFriends(){

  await supabaseClient
    .from("players")
    .update({
      friends:player.friends
    })
    .eq("username",player.username);
}

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const p = btn.dataset.page;

    if(p==="realty") renderRealtyPage();
    if(p==="cars") renderCarsPage();
    if(p==="friends") renderFriendsPage();
  });
});

// =====================
// LOOPS
// =====================
setInterval(passiveTick,1000);
setInterval(checkTitles,5000);
// =====================
// BATTLE SYSTEM
// =====================
let currentBattle = null;

// CREATE BATTLE
async function createBattle(){

  const stake = Number(prompt("Stake:"));

  if(player.balance < stake){
    return alert("no money");
  }

  player.balance -= stake;

  const now = new Date().toISOString();
  const end = new Date(Date.now()+60000).toISOString();

  const {data} = await supabaseClient
  .from("tap_battles")
  .insert({
    creator_username:player.username,
    stake,
    status:"waiting",
    creator_taps:0,
    opponent_taps:0,
    created_at:now,
    ends_at:end
  })
  .select()
  .single();

  currentBattle = data;

  await updatePlayerFull();
}

// JOIN BATTLE
async function joinBattle(id){

  const {data} = await supabaseClient
  .from("tap_battles")
  .select("*")
  .eq("id",id)
  .single();

  if(player.balance < data.stake){
    return alert("no money");
  }

  player.balance -= data.stake;

  const start = new Date().toISOString();
  const end = new Date(Date.now()+60000).toISOString();

  await supabaseClient
  .from("tap_battles")
  .update({
    opponent_username:player.username,
    status:"active",
    started_at:start,
    ends_at:end
  })
  .eq("id",id);

  currentBattle = data;

  await updatePlayerFull();
}

// TAP
async function battleTap(){

  if(!currentBattle) return;

  if(currentBattle.creator_username === player.username){

    currentBattle.creator_taps++;

    await supabaseClient
    .from("tap_battles")
    .update({
      creator_taps:currentBattle.creator_taps
    })
    .eq("id",currentBattle.id);

  } else {

    currentBattle.opponent_taps++;

    await supabaseClient
    .from("tap_battles")
    .update({
      opponent_taps:currentBattle.opponent_taps
    })
    .eq("id",currentBattle.id);
  }
}

// FINISH CHECK
async function battleCheck(){

  if(!currentBattle) return;

  const now = new Date();

  if(new Date(currentBattle.ends_at) < now){

    let winner = null;

    if(currentBattle.creator_taps > currentBattle.opponent_taps){
      winner = currentBattle.creator_username;
    } else if(currentBattle.opponent_taps > currentBattle.creator_taps){
      winner = currentBattle.opponent_username;
    }

    await supabaseClient
    .from("tap_battles")
    .update({
      status:"finished",
      winner_username:winner
    })
    .eq("id",currentBattle.id);

    if(winner === player.username){
      player.balance += currentBattle.stake * 2;
    }

    await updatePlayerFull();

    currentBattle = null;
  }
}

// RENDER BATTLE
async function renderBattlePage(){

  let html = `<h2>Battle</h2>
  <button onclick="createBattle()">Create</button>`;

  const {data} = await supabaseClient
  .from("tap_battles")
  .select("*");

  data.forEach(b=>{
    html += `
    <div class="card">
      <p>${b.creator_username} vs ${b.opponent_username||"???"}</p>
      <p>Stake: ${b.stake}</p>
      <button onclick="joinBattle('${b.id}')">Join</button>
    </div>`;
  });

  if(currentBattle){
    html += `
    <div class="card">
      <h3>ACTIVE</h3>
      <p>${currentBattle.creator_taps} vs ${currentBattle.opponent_taps}</p>
      <button onclick="battleTap()">TAP!</button>
    </div>`;
  }

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// CASINO
// =====================
function renderCasinoPage(){

  document.getElementById("page-content").innerHTML = `
    <h2>Casino</h2>

    <input id="bet" placeholder="Bet">

    <button onclick="coinflip()">Coinflip</button>
    <button onclick="dice()">Dice</button>
    <button onclick="slots()">Slots</button>

    <div id="casino-result"></div>
  `;
}

// =====================
// COINFLIP
// =====================
async function coinflip(){

  const bet = Number(document.getElementById("bet").value);

  if(player.balance < bet) return alert("no money");

  player.balance -= bet;

  const win = Math.random() < 0.5;

  if(win){
    player.balance += bet*2;
  }

  await logCasino("coinflip",bet,win?"win":"lose");

  updatePlayerFull();

  document.getElementById("casino-result").innerText = win?"WIN":"LOSE";
}

// =====================
// DICE
// =====================
async function dice(){

  const bet = Number(document.getElementById("bet").value);

  if(player.balance < bet) return;

  player.balance -= bet;

  const roll = Math.floor(Math.random()*6)+1;

  if(roll > 3){
    player.balance += bet*2;
  }

  await logCasino("dice",bet,roll);

  updatePlayerFull();

  document.getElementById("casino-result").innerText = "Roll: "+roll;
}

// =====================
// SLOTS
// =====================
async function slots(){

  const bet = Number(document.getElementById("bet").value);

  if(player.balance < bet) return;

  player.balance -= bet;

  const a = Math.floor(Math.random()*3);
  const b = Math.floor(Math.random()*3);
  const c = Math.floor(Math.random()*3);

  let win = false;

  if(a===b && b===c){
    player.balance += bet*5;
    win = true;
  }

  await logCasino("slots",bet,win?"win":"lose");

  updatePlayerFull();

  document.getElementById("casino-result").innerText = `${a}-${b}-${c}`;
}

// =====================
// CASINO LOG
// =====================
async function logCasino(game,bet,result){

  await supabaseClient
  .from("casino_logs")
  .insert({
    username:player.username,
    game,
    bet,
    result
  });
}

// =====================
// CASINO HISTORY
// =====================
async function renderCasinoHistory(){

  const {data} = await supabaseClient
  .from("casino_logs")
  .select("*")
  .eq("username",player.username)
  .order("created_at",{ascending:false})
  .limit(20);

  let html = "<h3>History</h3>";

  data.forEach(l=>{
    html += `<div>${l.game} - ${l.bet} - ${l.result}</div>`;
  });

  document.getElementById("page-content").innerHTML += html;
}

// =====================
// OFFLINE INCOME
// =====================
function applyOfflineIncomeAdvanced(){

  const last = new Date(player.last_seen);
  const now = new Date();

  const minutes = Math.floor((now-last)/60000);

  const income = minutes * calcPassiveIncome();

  player.balance += income;

  updatePlayerFull();
}

// =====================
// PRESENCE
// =====================
async function presenceTick(){

  await supabaseClient
  .from("players")
  .update({
    last_seen:new Date().toISOString(),
    device:currentDeviceType()
  })
  .eq("username",player.username);
}

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const p = btn.dataset.page;

    if(p==="battle") renderBattlePage();
    if(p==="casino") renderCasinoPage();
  });
});

// =====================
// LOOPS
// =====================
setInterval(battleCheck,2000);
setInterval(presenceTick,5000);
// =====================
// ADMIN PANEL
// =====================
async function renderAdminPage(){

  if(player.class !== "creator"){
    return alert("no access");
  }

  let html = `<h2>ADMIN PANEL</h2>`;

  html += `
    <input id="admin-user" placeholder="username">
    <input id="admin-amount" placeholder="amount">

    <button onclick="adminGiveMoney()">Give Money</button>
    <button onclick="adminTakeMoney()">Take Money</button>
    <button onclick="adminSetBalance()">Set Balance</button>
    <button onclick="adminBan()">Ban</button>
    <button onclick="adminUnban()">Unban</button>
    <button onclick="adminReset()">Reset</button>
    <button onclick="adminDelete()">Delete</button>

    <hr>

    <button onclick="adminMassMoney()">Mass Give Online</button>
    <button onclick="adminMassCrypto()">Mass Crypto</button>

    <hr>

    <input id="global-msg" placeholder="global message">
    <button onclick="setGlobalMessage()">Set Message</button>
  `;

  html += "<h3>Players</h3>";

  allPlayers.forEach(p=>{
    html += `<div>${p.username} (${p.device}) - ₴${p.balance}</div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// ADMIN FUNCTIONS
// =====================
async function adminGiveMoney(){

  const u = document.getElementById("admin-user").value;
  const a = Number(document.getElementById("admin-amount").value);

  const {data} = await supabaseClient.from("players").select("*").eq("username",u).single();

  data.balance += a;
  data.total_earned += a;

  await supabaseClient.from("players").update({
    balance:data.balance,
    total_earned:data.total_earned
  }).eq("username",u);
}

async function adminTakeMoney(){

  const u = document.getElementById("admin-user").value;
  const a = Number(document.getElementById("admin-amount").value);

  const {data} = await supabaseClient.from("players").select("*").eq("username",u).single();

  data.balance -= a;

  await supabaseClient.from("players").update({
    balance:data.balance
  }).eq("username",u);
}

async function adminSetBalance(){

  const u = document.getElementById("admin-user").value;
  const a = Number(document.getElementById("admin-amount").value);

  await supabaseClient.from("players").update({
    balance:a
  }).eq("username",u);
}

async function adminBan(){

  const u = document.getElementById("admin-user").value;

  await supabaseClient.from("players").update({
    banned:true
  }).eq("username",u);
}

async function adminUnban(){

  const u = document.getElementById("admin-user").value;

  await supabaseClient.from("players").update({
    banned:false
  }).eq("username",u);
}

async function adminReset(){

  const u = document.getElementById("admin-user").value;

  await supabaseClient.from("players").update({
    balance:1000,
    usd:0,
    crypto:{},
    stocks:{},
    businesses:[],
    realty:[],
    cars:[]
  }).eq("username",u);
}

async function adminDelete(){

  const u = document.getElementById("admin-user").value;

  await supabaseClient.from("history").delete().eq("username",u);
  await supabaseClient.from("casino_logs").delete().eq("username",u);
  await supabaseClient.from("players").delete().eq("username",u);
}

// =====================
// MASS FUNCTIONS
// =====================
async function adminMassMoney(){

  const a = Number(prompt("Amount"));

  const online = allPlayers.filter(p=>{
    return (Date.now() - new Date(p.last_seen)) < 10000;
  });

  for(const p of online){

    await supabaseClient.from("players").update({
      balance:p.balance + a,
      total_earned:p.total_earned + a
    }).eq("username",p.username);
  }
}

async function adminMassCrypto(){

  const symbol = prompt("symbol");
  const amount = Number(prompt("amount"));

  const online = allPlayers;

  for(const p of online){

    let crypto = p.crypto || {};
    crypto[symbol] = (crypto[symbol]||0) + amount;

    await supabaseClient.from("players").update({
      crypto
    }).eq("username",p.username);
  }
}

// =====================
// GLOBAL MESSAGE
// =====================
async function setGlobalMessage(){

  const msg = document.getElementById("global-msg").value;

  gameState.global_message = msg;

  await saveGameState();

  updateHeader();
}

// =====================
// TOP REALTIME UPDATE
// =====================
function updateTopRealtime(){

  const sorted = [...allPlayers]
  .sort((a,b)=>b.total_earned-a.total_earned)
  .slice(0,10);

  let html = "<h2>Top Live</h2>";

  sorted.forEach(p=>{
    html += `<div>${p.username} - ${Math.floor(p.total_earned)}</div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// EXTRA LOOPS
// =====================
setInterval(updateTopRealtime,5000);

// =====================
// NAV FINAL
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(btn.dataset.page==="admin"){
      renderAdminPage();
    }
  });
});
// =====================
// DAILY BONUS SYSTEM
// =====================
async function claimDailyBonus(){

  const today = new Date().toISOString().slice(0,10);

  if(player.last_bonus_day === today){
    return alert("already claimed");
  }

  const bonus = 500;

  player.balance += bonus;
  player.total_earned += bonus;
  player.last_bonus_day = today;

  await supabaseClient
  .from("players")
  .update({
    balance:player.balance,
    total_earned:player.total_earned,
    last_bonus_day:player.last_bonus_day
  })
  .eq("username",player.username);

  await appendHistory(player.username,"Daily bonus",bonus);

  updateHeader();
}

// =====================
// VIP GIVEAWAY
// =====================
async function vipGiveaway(){

  if(player.class !== "vip" && player.class !== "creator"){
    return alert("vip only");
  }

  const today = new Date().toISOString().slice(0,10);

  if(player.vip_giveaway_day === today){
    return alert("already today");
  }

  const to = prompt("username");
  const amount = Number(prompt("amount"));

  if(player.balance < amount){
    return alert("no money");
  }

  const {data} = await supabaseClient
  .from("players")
  .select("*")
  .eq("username",to)
  .single();

  if(!data) return alert("no user");

  player.balance -= amount;
  data.balance += amount;
  data.total_earned += amount;

  await supabaseClient.from("players").update({
    balance:player.balance,
    vip_giveaway_day:today
  }).eq("username",player.username);

  await supabaseClient.from("players").update({
    balance:data.balance,
    total_earned:data.total_earned
  }).eq("username",to);

  await appendHistory(player.username,"VIP giveaway",-amount);
}

// =====================
// CARD SYSTEM
// =====================
async function changeCVV(){

  const cvv = prompt("new cvv");

  player.card_cvv = cvv;

  await supabaseClient
  .from("players")
  .update({
    card_cvv:cvv
  })
  .eq("username",player.username);
}

async function changeCardName(){

  const name = prompt("new name");

  player.card_name = name;

  await supabaseClient
  .from("players")
  .update({
    card_name:name
  })
  .eq("username",player.username);
}

async function changeCardColor(){

  const color = prompt("color hex");

  player.card_color = color;

  await supabaseClient
  .from("players")
  .update({
    card_color:color
  })
  .eq("username",player.username);
}

// =====================
// EXCHANGE SYSTEM
// =====================
const USD_RATE = 40;

async function exchangeToUSD(){

  const amount = Number(prompt("UAH"));

  if(player.balance < amount){
    return alert("no money");
  }

  player.balance -= amount;
  player.usd += amount / USD_RATE;

  await updatePlayerAssets();
}

async function exchangeToUAH(){

  const amount = Number(prompt("USD"));

  if(player.usd < amount){
    return alert("no usd");
  }

  player.usd -= amount;
  player.balance += amount * USD_RATE;

  await updatePlayerAssets();
}

// =====================
// EXTRA UTILS (10)
// =====================
function formatMoney(n){
  return Math.floor(n).toLocaleString();
}

function randomInt(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function randomChoice(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function clamp(v,min,max){
  return Math.max(min,Math.min(max,v));
}

function percent(a,b){
  return (a/b)*100;
}

function now(){
  return new Date().toISOString();
}

function isOnline(p){
  return Date.now() - new Date(p.last_seen) < 10000;
}

function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

function sleep(ms){
  return new Promise(r=>setTimeout(r,ms));
}

function log(msg){
  console.log("[BitBank]",msg);
}

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(btn.dataset.page==="profile"){
      console.log("profile loaded");
    }
  });
});
// =====================
// QUEST SYSTEM (15 QUESTS)
// =====================
const QUESTS = [
{id:1,name:"Earn 1K",goal:1000,reward:200},
{id:2,name:"Earn 10K",goal:10000,reward:1000},
{id:3,name:"Earn 100K",goal:100000,reward:5000},
{id:4,name:"Buy 1 Business",goal:1,reward:500},
{id:5,name:"Buy 5 Business",goal:5,reward:2000},
{id:6,name:"Buy 10 Business",goal:10,reward:5000},
{id:7,name:"Own 1 Car",goal:1,reward:300},
{id:8,name:"Own 3 Cars",goal:3,reward:1000},
{id:9,name:"Own 5 Cars",goal:5,reward:3000},
{id:10,name:"Crypto 1",goal:1,reward:500},
{id:11,name:"Crypto 10",goal:10,reward:2000},
{id:12,name:"Crypto 50",goal:50,reward:5000},
{id:13,name:"Play Casino",goal:1,reward:200},
{id:14,name:"Win Casino",goal:1,reward:500},
{id:15,name:"Reach VIP",goal:1,reward:10000}
];

// =====================
// QUEST TRACK
// =====================
function checkQuests(){

  QUESTS.forEach(q=>{

    if(player.completed_quests?.includes(q.id)) return;

    let done = false;

    if(q.id <=3 && player.total_earned >= q.goal) done=true;
    if(q.id>=4 && q.id<=6 && player.businesses.length >= q.goal) done=true;
    if(q.id>=7 && q.id<=9 && player.cars.length >= q.goal) done=true;
    if(q.id>=10 && q.id<=12){
      let totalCrypto = 0;
      for(let k in player.crypto){
        totalCrypto += player.crypto[k];
      }
      if(totalCrypto >= q.goal) done=true;
    }

    if(done){
      completeQuest(q);
    }

  });

}

// =====================
// COMPLETE QUEST
// =====================
async function completeQuest(q){

  if(!player.completed_quests){
    player.completed_quests = [];
  }

  player.completed_quests.push(q.id);

  player.balance += q.reward;
  player.total_earned += q.reward;

  await supabaseClient.from("players").update({
    balance:player.balance,
    total_earned:player.total_earned,
    completed_quests:player.completed_quests
  }).eq("username",player.username);

  await appendHistory(player.username,"Quest reward",q.reward);
}

// =====================
// QUEST PAGE
// =====================
function renderQuestPage(){

  let html = "<h2>Quests</h2>";

  QUESTS.forEach(q=>{

    const done = player.completed_quests?.includes(q.id);

    html += `
    <div class="card">
      <h3>${q.name}</h3>
      <p>Goal: ${q.goal}</p>
      <p>Reward: ${q.reward}</p>
      <p>${done?"DONE":"ACTIVE"}</p>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// BOOST SYSTEM
// =====================
let activeBoosts = [];

function addBoost(type,value,duration){

  activeBoosts.push({
    type,
    value,
    ends:Date.now()+duration
  });
}

function getBoostMultiplier(type){

  let mult = 1;

  activeBoosts.forEach(b=>{
    if(b.type === type && b.ends > Date.now()){
      mult += b.value;
    }
  });

  return mult;
}

// =====================
// BOOST CLEAN
// =====================
function cleanBoosts(){

  activeBoosts = activeBoosts.filter(b=>b.ends > Date.now());
}

// =====================
// RANDOM EVENTS
// =====================
function randomEvent(){

  const roll = Math.random();

  if(roll < 0.2){

    const gain = randomInt(100,1000);

    player.balance += gain;

    appendHistory(player.username,"Random reward",gain);
  }

  if(roll > 0.8){

    const loss = randomInt(50,500);

    player.balance -= loss;

    appendHistory(player.username,"Random loss",-loss);
  }

  updateHeader();
}

// =====================
// MULTIPLIERS
// =====================
function getClickReward(){

  let base = 5;

  return base * getBoostMultiplier("click");
}

function getPassiveReward(){

  let base = calcPassiveIncome();

  return base * getBoostMultiplier("passive");
}

// =====================
// ADVANCED CLICK
// =====================
function handleClickAdvanced(){

  const reward = getClickReward();

  player.balance += reward;
  player.total_earned += reward;

  updatePlayerFull();
}

// =====================
// AUTO CLICKER
// =====================
let autoClick = false;

function toggleAutoClick(){
  autoClick = !autoClick;
}

function autoClickTick(){

  if(autoClick){
    handleClickAdvanced();
  }
}

// =====================
// EXTRA LOOPS
// =====================
setInterval(checkQuests,5000);
setInterval(cleanBoosts,3000);
setInterval(randomEvent,15000);
setInterval(autoClickTick,1000);

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(btn.dataset.page==="quests"){
      renderQuestPage();
    }
  });
});
// =====================
// ACHIEVEMENTS (20+)
// =====================
const ACHIEVEMENTS = [
{id:1,name:"👶 Beginner",check:()=>player.total_earned>=100},
{id:2,name:"💰 1K Earned",check:()=>player.total_earned>=1000},
{id:3,name:"💸 10K Earned",check:()=>player.total_earned>=10000},
{id:4,name:"🏆 100K Earned",check:()=>player.total_earned>=100000},
{id:5,name:"💎 1M Earned",check:()=>player.total_earned>=1000000},
{id:6,name:"🏢 Businessman",check:()=>player.businesses.length>=3},
{id:7,name:"🏝 Landlord",check:()=>player.realty.length>=2},
{id:8,name:"🚗 Collector",check:()=>player.cars.length>=2},
{id:9,name:"📈 Investor",check:()=>Object.keys(player.stocks).length>=3},
{id:10,name:"🪙 Crypto Holder",check:()=>Object.keys(player.crypto).length>=3},

{id:11,name:"⚡ Click Master",check:()=>player.total_earned>=50000},
{id:12,name:"🎰 Gambler",check:()=>true},
{id:13,name:"🤝 Friendly",check:()=>player.friends.length>=3},
{id:14,name:"👑 VIP",check:()=>player.class==="vip"},
{id:15,name:"🧠 Smart Investor",check:()=>player.stocks && Object.values(player.stocks).reduce((a,b)=>a+b,0)>50},

{id:16,name:"🌍 Global Player",check:()=>allPlayers.length>10},
{id:17,name:"🔥 Active",check:()=>true},
{id:18,name:"⏱ Loyal",check:()=>true},
{id:19,name:"🚀 Rich",check:()=>player.balance>1000000},
{id:20,name:"🧿 Legend",check:()=>player.total_earned>5000000}
];

// =====================
// CHECK ACHIEVEMENTS
// =====================
function checkAchievements(){

  if(!player.achievements){
    player.achievements = [];
  }

  ACHIEVEMENTS.forEach(a=>{
    if(!player.achievements.includes(a.id) && a.check()){
      player.achievements.push(a.id);

      player.balance += 1000;

      appendHistory(player.username,"Achievement",1000);
    }
  });

  supabaseClient.from("players").update({
    achievements:player.achievements,
    balance:player.balance
  }).eq("username",player.username);
}

// =====================
// RENDER ACHIEVEMENTS
// =====================
function renderAchievements(){

  let html = "<h2>Achievements</h2>";

  ACHIEVEMENTS.forEach(a=>{

    const done = player.achievements?.includes(a.id);

    html += `
    <div class="card">
      <h3>${a.name}</h3>
      <p>${done?"DONE":"LOCKED"}</p>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// HISTORY PAGE (FULL)
// =====================
async function renderHistoryPage(){

  const data = await fetchHistory(player.username);

  let html = "<h2>History</h2>";

  data.forEach(h=>{
    html += `
    <div class="card">
      <p>${h.text}</p>
      <p>${h.amount}</p>
      <small>${h.created_at}</small>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// PLAYER STATS
// =====================
function calcTotalAssets(){

  let total = player.balance;

  Object.values(player.crypto).forEach(v=>{
    total += v*1000;
  });

  Object.values(player.stocks).forEach(v=>{
    total += v*5000;
  });

  return total;
}

function renderStatsPage(){

  let html = `
  <h2>Stats</h2>

  <div class="card">
    <p>Total Assets: ${Math.floor(calcTotalAssets())}</p>
    <p>Businesses: ${player.businesses.length}</p>
    <p>Cars: ${player.cars.length}</p>
    <p>Realty: ${player.realty.length}</p>
    <p>Friends: ${player.friends.length}</p>
  </div>
  `;

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// RANK SYSTEM
// =====================
function getRank(){

  if(player.total_earned < 1000) return "Newbie";
  if(player.total_earned < 10000) return "Starter";
  if(player.total_earned < 100000) return "Pro";
  if(player.total_earned < 1000000) return "Elite";
  return "Legend";
}

// =====================
// RENDER RANK PAGE
// =====================
function renderRankPage(){

  document.getElementById("page-content").innerHTML = `
    <h2>Rank</h2>
    <div class="card">
      <h3>${getRank()}</h3>
      <p>Total: ${Math.floor(player.total_earned)}</p>
    </div>
  `;
}

// =====================
// ADVANCED EVENTS
// =====================
function megaRandomEvent(){

  const roll = Math.random();

  if(roll < 0.1){

    const boost = randomInt(1,3);

    addBoost("click",boost,30000);

    appendHistory(player.username,"Boost +"+boost,0);
  }

  if(roll > 0.9){

    const loss = randomInt(1000,5000);

    player.balance -= loss;

    appendHistory(player.username,"Crash",-loss);
  }

  updateHeader();
}

// =====================
// MINI GAMES
// =====================
function miniGameGuess(){

  const num = randomInt(1,5);
  const guess = Number(prompt("1-5"));

  if(guess === num){
    player.balance += 1000;
  } else {
    player.balance -= 500;
  }

  updatePlayerFull();
}

// =====================
// BONUS EVENTS LOOP
// =====================
setInterval(checkAchievements,7000);
setInterval(megaRandomEvent,20000);

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const p = btn.dataset.page;

    if(p==="history") renderHistoryPage();
    if(p==="stats") renderStatsPage();
    if(p==="rank") renderRankPage();
    if(p==="achievements") renderAchievements();
  });
});
// =====================
// FAKE CHART SYSTEM
// =====================
function generateChartData(points=20){
  let data = [];
  let value = 100;

  for(let i=0;i<points;i++){
    value += (Math.random()-0.5)*10;
    if(value < 1) value = 1;
    data.push(value);
  }

  return data;
}

function renderChart(title,data){

  let html = `<h3>${title}</h3><div class="chart">`;

  data.forEach(v=>{
    html += `<div class="bar" style="height:${v}px"></div>`;
  });

  html += "</div>";

  return html;
}

function renderChartsPage(){

  let html = "<h2>Market Charts</h2>";

  html += renderChart("Crypto", generateChartData());
  html += renderChart("Stocks", generateChartData());
  html += renderChart("Economy", generateChartData());

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// AI MARKET SYSTEM
// =====================
let marketTrend = 1;

function updateMarketTrend(){

  const roll = Math.random();

  if(roll < 0.3) marketTrend = 0.95;
  else if(roll > 0.7) marketTrend = 1.05;
  else marketTrend = 1;
}

function applyMarketTrend(){

  CRYPTO.forEach(c=>{
    c.price *= marketTrend;
  });

  STOCKS.forEach(s=>{
    s.price *= marketTrend;
  });
}

// =====================
// ECONOMY EVENTS
// =====================
function economyEvent(){

  const roll = Math.random();

  if(roll < 0.2){
    marketTrend = 0.8;
    appendHistory(player.username,"Market crash",0);
  }

  if(roll > 0.8){
    marketTrend = 1.2;
    appendHistory(player.username,"Market boom",0);
  }
}

// =====================
// BANK SYSTEM 2.0
// =====================
async function depositToBank(){

  const amount = Number(prompt("Deposit"));

  if(player.balance < amount){
    return alert("no money");
  }

  player.balance -= amount;

  if(!player.bank) player.bank = 0;

  player.bank += amount;

  await saveBank();
}

async function withdrawFromBank(){

  const amount = Number(prompt("Withdraw"));

  if(!player.bank || player.bank < amount){
    return alert("no bank money");
  }

  player.bank -= amount;
  player.balance += amount;

  await saveBank();
}

async function saveBank(){

  await supabaseClient
  .from("players")
  .update({
    balance:player.balance,
    bank:player.bank
  })
  .eq("username",player.username);

  updateHeader();
}

// =====================
// BANK INTEREST
// =====================
function bankInterestTick(){

  if(!player.bank) return;

  const gain = player.bank * 0.001;

  player.bank += gain;
}

// =====================
// LOAN SYSTEM
// =====================
async function takeLoan(){

  const amount = Number(prompt("Loan"));

  if(player.loan){
    return alert("already loan");
  }

  player.loan = amount;
  player.balance += amount;

  await saveLoan();
}

async function repayLoan(){

  if(!player.loan){
    return alert("no loan");
  }

  const repay = player.loan * 1.2;

  if(player.balance < repay){
    return alert("not enough");
  }

  player.balance -= repay;
  player.loan = 0;

  await saveLoan();
}

async function saveLoan(){

  await supabaseClient
  .from("players")
  .update({
    balance:player.balance,
    loan:player.loan
  })
  .eq("username",player.username);

  updateHeader();
}

// =====================
// LOAN PENALTY
// =====================
function loanPenaltyTick(){

  if(player.loan){

    player.loan *= 1.001;
  }
}

// =====================
// RISK SYSTEM
// =====================
function riskEvent(){

  const roll = Math.random();

  if(roll < 0.1){

    const loss = player.balance * 0.1;

    player.balance -= loss;

    appendHistory(player.username,"Risk loss",-loss);
  }

  if(roll > 0.9){

    const gain = player.balance * 0.2;

    player.balance += gain;

    appendHistory(player.username,"Risk gain",gain);
  }

  updateHeader();
}

// =====================
// INSURANCE SYSTEM
// =====================
function buyInsurance(){

  const price = 1000;

  if(player.balance < price){
    return alert("no money");
  }

  player.balance -= price;
  player.insurance = true;
}

function insuranceCheck(loss){

  if(player.insurance){
    player.insurance = false;
    return 0;
  }

  return loss;
}

// =====================
// ECONOMY LOOP
// =====================
setInterval(updateMarketTrend,10000);
setInterval(applyMarketTrend,5000);
setInterval(economyEvent,20000);
setInterval(bankInterestTick,5000);
setInterval(loanPenaltyTick,5000);
setInterval(riskEvent,25000);

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(btn.dataset.page==="charts"){
      renderChartsPage();
    }
  });
});
// =====================
// ONLINE PLAYERS LIST
// =====================
function getOnlinePlayers(){

  return allPlayers.filter(p=>{
    return Date.now() - new Date(p.last_seen) < 10000;
  });
}

function renderOnlinePlayers(){

  let html = "<h2>Online Players</h2>";

  const online = getOnlinePlayers();

  online.forEach(p=>{
    html += `
    <div class="card">
      <p>${p.username} (${p.device})</p>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// CHAT SYSTEM
// =====================
let chatMessages = [];

async function sendMessage(){

  const text = prompt("Message");

  if(!text) return;

  chatMessages.push({
    user:player.username,
    text,
    time:now()
  });

  renderChat();
}

function renderChat(){

  let html = "<h2>Chat</h2>";

  chatMessages.slice(-50).forEach(m=>{
    html += `
    <div class="card">
      <b>${m.user}</b>
      <p>${m.text}</p>
      <small>${m.time}</small>
    </div>`;
  });

  html += `<button onclick="sendMessage()">Send</button>`;

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// GLOBAL CHAT (FAKE REALTIME)
// =====================
function globalChatTick(){

  const randomUser = randomChoice(allPlayers);

  if(!randomUser) return;

  chatMessages.push({
    user:randomUser.username,
    text:randomChoice([
      "hello",
      "gg",
      "buy crypto",
      "market crash",
      "lol"
    ]),
    time:now()
  });
}

// =====================
// MESSAGES SYSTEM
// =====================
async function sendPrivateMessage(){

  const to = prompt("To:");
  const msg = prompt("Message:");

  if(!msg) return;

  await supabaseClient
  .from("history")
  .insert({
    username:to,
    text:"MSG from "+player.username+": "+msg,
    amount:0
  });
}

// =====================
// NOTIFICATION SYSTEM
// =====================
let notifications = [];

function addNotification(text){

  notifications.push({
    text,
    time:now()
  });
}

function renderNotifications(){

  let html = "<h2>Notifications</h2>";

  notifications.slice(-20).forEach(n=>{
    html += `
    <div class="card">
      <p>${n.text}</p>
      <small>${n.time}</small>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// AUTO NOTIFICATIONS
// =====================
function notificationTick(){

  if(Math.random() < 0.3){

    addNotification(randomChoice([
      "New event!",
      "Market changed",
      "You earned money",
      "Someone online"
    ]));
  }
}

// =====================
// GIFT SYSTEM
// =====================
async function sendGift(){

  const to = prompt("To:");
  const amount = Number(prompt("Amount"));

  if(player.balance < amount){
    return alert("no money");
  }

  const {data} = await supabaseClient
  .from("players")
  .select("*")
  .eq("username",to)
  .single();

  if(!data) return alert("no user");

  player.balance -= amount;
  data.balance += amount;

  await supabaseClient.from("players").update({
    balance:player.balance
  }).eq("username",player.username);

  await supabaseClient.from("players").update({
    balance:data.balance
  }).eq("username",to);

  addNotification("Gift sent to "+to);
}

// =====================
// RANDOM GIFT EVENT
// =====================
function randomGiftEvent(){

  if(Math.random() < 0.1){

    const gift = randomInt(100,1000);

    player.balance += gift;

    addNotification("You received gift: "+gift);
  }
}

// =====================
// MAILBOX SYSTEM
// =====================
let mailbox = [];

function addMail(text){

  mailbox.push({
    text,
    time:now()
  });
}

function renderMailbox(){

  let html = "<h2>Mailbox</h2>";

  mailbox.forEach(m=>{
    html += `
    <div class="card">
      <p>${m.text}</p>
      <small>${m.time}</small>
    </div>`;
  });

  document.getElementById("page-content").innerHTML = html;
}

// =====================
// AUTO MAIL
// =====================
function mailTick(){

  if(Math.random() < 0.2){

    addMail(randomChoice([
      "System reward",
      "Promo bonus",
      "Event reward"
    ]));
  }
}

// =====================
// FRIEND ONLINE CHECK
// =====================
function notifyFriendOnline(){

  player.friends.forEach(id=>{
    const f = allPlayers.find(x=>x.id===id);

    if(f && isOnline(f)){
      addNotification(f.username+" is online");
    }
  });
}

// =====================
// LOOPS
// =====================
setInterval(globalChatTick,3000);
setInterval(notificationTick,7000);
setInterval(randomGiftEvent,15000);
setInterval(mailTick,12000);
setInterval(notifyFriendOnline,8000);

// =====================
// NAV EXTEND
// =====================
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const p = btn.dataset.page;

    if(p==="chat") renderChat();
    if(p==="online") renderOnlinePlayers();
    if(p==="notifications") renderNotifications();
    if(p==="mail") renderMailbox();
  });
});
