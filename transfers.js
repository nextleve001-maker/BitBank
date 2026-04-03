// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import { apiGetPlayer, apiUpdatePlayer, apiGetGameState, apiUpdateGameState, apiAddHistory } from "./api.js";
import { MarketState } from "./market.js";

// =====================
// CONSTANTS
// =====================
const UAH_TRANSFER_FEE = 0.05;
const USD_TRANSFER_FEE = 0.05;
const CRYPTO_TRANSFER_FEE = 0.01;
const USD_RATE = 40;

// =====================
// HELPERS
// =====================
function getPlayer(){
  return AppState.player;
}

function setPage(html){
  const root = document.getElementById("page-content");
  if(root){
    root.innerHTML = html;
  }
}

function normalizeNumber(value){
  const n = Number(value);
  if(!Number.isFinite(n)) return 0;
  return n;
}

function normalizeText(value){
  return String(value || "").trim();
}

function isSelfRecipient(username){
  const me = getPlayer()?.username || "";
  return username === me || username.toLowerCase() === "me";
}

function ensureCryptoWallet(player){
  if(!player.crypto){
    player.crypto = {};
  }
}

function getCryptoPrice(symbol){
  const asset = (MarketState?.crypto || []).find(item => item.id === symbol || item.symbol === symbol);
  return asset ? Number(asset.price || 0) : 0;
}

function validAmount(amount){
  return Number.isFinite(amount) && amount > 0;
}

function feeAmount(amount, feeRate){
  return amount * feeRate;
}

async function addCommission(amountUAH){
  const state = await apiGetGameState();
  const next = Number(state?.commission_bank || 0) + Number(amountUAH || 0);

  await apiUpdateGameState({
    commission_bank: next
  });

  if(AppState.gameState){
    AppState.gameState.commission_bank = next;
  }
}

async function addSupport(amountUAH){
  const state = await apiGetGameState();
  const next = Number(state?.support_bank || 0) + Number(amountUAH || 0);

  await apiUpdateGameState({
    support_bank: next
  });

  if(AppState.gameState){
    AppState.gameState.support_bank = next;
  }
}

function transferResultCard(title, text){
  return `
    <div class="card">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function getInputValue(id){
  const el = document.getElementById(id);
  return el ? el.value : "";
}

// =====================
// VALIDATION
// =====================
async function resolveRecipient(usernameRaw){
  const username = normalizeText(usernameRaw);

  if(!username){
    alert("Enter recipient");
    return null;
  }

  if(isSelfRecipient(username)){
    return getPlayer();
  }

  const recipient = await apiGetPlayer(username);

  if(!recipient){
    alert("Recipient not found");
    return null;
  }

  return recipient;
}

function validateCVV(cvv){
  const p = getPlayer();

  if(normalizeText(cvv) !== String(p.card_cvv)){
    alert("Wrong CVV");
    return false;
  }

  return true;
}

// =====================
// UAH TRANSFER
// =====================
export async function transferUAH(recipientUsername, amountRaw, cvvRaw){

  const sender = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if(!validAmount(amount)){
    alert("Invalid amount");
    return false;
  }

  if(!validateCVV(cvvRaw)){
    return false;
  }

  const recipient = await resolveRecipient(recipientUsername);
  if(!recipient){
    return false;
  }

  const fee = feeAmount(amount, UAH_TRANSFER_FEE);
  const total = amount + fee;

  if(Number(sender.balance) < total){
    alert("Not enough UAH");
    return false;
  }

  sender.balance -= total;

  if(recipient.username === sender.username){
    sender.balance += amount;

    await updatePlayer({
      balance: sender.balance
    });

    await addCommission(fee);
    await apiAddHistory(sender.username, "UAH self transfer fee", -fee);

    return true;
  }

  recipient.balance = Number(recipient.balance || 0) + amount;

  await updatePlayer({
    balance: sender.balance
  });

  await apiUpdatePlayer(recipient.username, {
    balance: recipient.balance
  });

  await addCommission(fee);

  await apiAddHistory(sender.username, `UAH transfer to ${recipient.username}`, -total);
  await apiAddHistory(recipient.username, `UAH received from ${sender.username}`, amount);

  return true;
}

// =====================
// USD TRANSFER
// =====================
export async function transferUSD(recipientUsername, amountRaw, cvvRaw){

  const sender = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if(!validAmount(amount)){
    alert("Invalid amount");
    return false;
  }

  if(!validateCVV(cvvRaw)){
    return false;
  }

  const recipient = await resolveRecipient(recipientUsername);
  if(!recipient){
    return false;
  }

  const fee = feeAmount(amount, USD_TRANSFER_FEE);
  const total = amount + fee;

  if(Number(sender.usd) < total){
    alert("Not enough USD");
    return false;
  }

  sender.usd -= total;

  if(recipient.username === sender.username){
    sender.usd += amount;

    await updatePlayer({
      usd: sender.usd
    });

    await addCommission(fee * USD_RATE);
    await apiAddHistory(sender.username, "USD self transfer fee", -(fee * USD_RATE));

    return true;
  }

  recipient.usd = Number(recipient.usd || 0) + amount;

  await updatePlayer({
    usd: sender.usd
  });

  await apiUpdatePlayer(recipient.username, {
    usd: recipient.usd
  });

  await addCommission(fee * USD_RATE);

  await apiAddHistory(sender.username, `USD transfer to ${recipient.username}`, -(amount * USD_RATE + fee * USD_RATE));
  await apiAddHistory(recipient.username, `USD received from ${sender.username}`, amount * USD_RATE);

  return true;
}

// =====================
// CRYPTO TRANSFER
// =====================
export async function transferCrypto(recipientUsername, symbol, amountRaw, cvvRaw){

  const sender = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if(!validAmount(amount)){
    alert("Invalid amount");
    return false;
  }

  if(!validateCVV(cvvRaw)){
    return false;
  }

  const recipient = await resolveRecipient(recipientUsername);
  if(!recipient){
    return false;
  }

  ensureCryptoWallet(sender);
  ensureCryptoWallet(recipient);

  const currentSenderAmount = Number(sender.crypto[symbol] || 0);
  const fee = feeAmount(amount, CRYPTO_TRANSFER_FEE);
  const total = amount + fee;

  if(currentSenderAmount < total){
    alert("Not enough crypto");
    return false;
  }

  sender.crypto[symbol] = currentSenderAmount - total;

  if(recipient.username === sender.username){
    sender.crypto[symbol] = Number(sender.crypto[symbol] || 0) + amount;

    await updatePlayer({
      crypto: sender.crypto
    });

    const commissionUAH = fee * getCryptoPrice(symbol);
    await addCommission(commissionUAH);
    await apiAddHistory(sender.username, `${symbol} self transfer fee`, -commissionUAH);

    return true;
  }

  recipient.crypto[symbol] = Number(recipient.crypto[symbol] || 0) + amount;

  await updatePlayer({
    crypto: sender.crypto
  });

  await apiUpdatePlayer(recipient.username, {
    crypto: recipient.crypto
  });

  const commissionUAH = fee * getCryptoPrice(symbol);
  await addCommission(commissionUAH);

  await apiAddHistory(sender.username, `${symbol} transfer to ${recipient.username}`, -(amount * getCryptoPrice(symbol) + commissionUAH));
  await apiAddHistory(recipient.username, `${symbol} received from ${sender.username}`, amount * getCryptoPrice(symbol));

  return true;
}

// =====================
// SUPPORT DONATION
// =====================
export async function donateToSupport(amountRaw){

  const sender = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if(!validAmount(amount)){
    alert("Invalid amount");
    return false;
  }

  if(Number(sender.balance) < amount){
    alert("Not enough money");
    return false;
  }

  sender.balance -= amount;

  await updatePlayer({
    balance: sender.balance
  });

  await addSupport(amount);
  await apiAddHistory(sender.username, "Support donation", -amount);

  return true;
}

// =====================
// EXCHANGE UAH -> USD
// =====================
export async function exchangeUAHtoUSD(amountRaw){

  const p = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if(!validAmount(amount)){
    alert("Invalid amount");
    return false;
  }

  if(Number(p.balance) < amount){
    alert("Not enough UAH");
    return false;
  }

  const usd = amount / USD_RATE;

  p.balance -= amount;
  p.usd = Number(p.usd || 0) + usd;

  await updatePlayer({
    balance: p.balance,
    usd: p.usd
  });

  await apiAddHistory(p.username, "Exchange UAH to USD", -amount);

  return true;
}

// =====================
// EXCHANGE USD -> UAH
// =====================
export async function exchangeUSDtoUAH(amountRaw){

  const p = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if(!validAmount(amount)){
    alert("Invalid amount");
    return false;
  }

  if(Number(p.usd) < amount){
    alert("Not enough USD");
    return false;
  }

  const uah = amount * USD_RATE;

  p.usd -= amount;
  p.balance += uah;

  await updatePlayer({
    balance: p.balance,
    usd: p.usd
  });

  await apiAddHistory(p.username, "Exchange USD to UAH", uah);

  return true;
}

// =====================
// CARD SETTINGS
// =====================
export async function changeCardCVV(newCVV){

  const p = getPlayer();
  const cvv = normalizeText(newCVV);

  if(!/^\d{3}$/.test(cvv)){
    alert("CVV must be 3 digits");
    return false;
  }

  p.card_cvv = cvv;

  await updatePlayer({
    card_cvv: cvv
  });

  await apiAddHistory(p.username, "Changed CVV", 0);

  return true;
}

export async function changeCardName(newName){

  const p = getPlayer();
  const cardName = normalizeText(newName);

  if(!cardName){
    alert("Enter card name");
    return false;
  }

  p.card_name = cardName;

  await updatePlayer({
    card_name: cardName
  });

  await apiAddHistory(p.username, "Changed card name", 0);

  return true;
}

export async function changeCardColor(newColor){

  const p = getPlayer();
  const color = normalizeText(newColor);

  if(!color){
    alert("Enter color");
    return false;
  }

  p.card_color = color;

  await updatePlayer({
    card_color: color
  });

  await apiAddHistory(p.username, "Changed card color", 0);

  return true;
}

// =====================
// PROFILE CARD VIEW
// =====================
export function renderCardSettingsPage(){

  const p = getPlayer();

  setPage(`
    <h2>Card Settings</h2>

    <div class="card" style="background:${p.card_color || "#3b82f6"}; color:white;">
      <h3>${p.card_name || p.username}</h3>
      <p>${p.card_number || "0000 0000 0000 0000"}</p>
      <p>CVV: ${p.card_cvv || "***"}</p>
      <p>EXP: ${p.card_expiry || "12/30"}</p>
    </div>

    <div class="card">
      <h3>Change CVV</h3>
      <input id="card-cvv-input" placeholder="New CVV">
      <button onclick="window.changeCardCVVUI()">Save CVV</button>
    </div>

    <div class="card">
      <h3>Change Card Name</h3>
      <input id="card-name-input" placeholder="New Card Name">
      <button onclick="window.changeCardNameUI()">Save Name</button>
    </div>

    <div class="card">
      <h3>Change Card Color</h3>
      <input id="card-color-input" placeholder="#3b82f6">
      <button onclick="window.changeCardColorUI()">Save Color</button>
    </div>
  `);
}

// =====================
// TRANSFERS PAGE
// =====================
export function renderTransfersPage(){

  setPage(`
    <h2>Transfers</h2>

    <div class="card">
      <h3>UAH Transfer</h3>
      <input id="uah-recipient" placeholder="Recipient">
      <input id="uah-amount" type="number" min="1" step="1" placeholder="Amount">
      <input id="uah-cvv" placeholder="CVV">
      <button onclick="window.transferUAHUI()">Send UAH</button>
    </div>

    <div class="card">
      <h3>USD Transfer</h3>
      <input id="usd-recipient" placeholder="Recipient">
      <input id="usd-amount" type="number" min="1" step="0.01" placeholder="Amount">
      <input id="usd-cvv" placeholder="CVV">
      <button onclick="window.transferUSDUI()">Send USD</button>
    </div>

    <div class="card">
      <h3>Crypto Transfer</h3>
      <input id="crypto-recipient" placeholder="Recipient">
      <input id="crypto-symbol" placeholder="BTC / ETH / SOL">
      <input id="crypto-amount" type="number" min="0.0001" step="0.0001" placeholder="Amount">
      <input id="crypto-cvv" placeholder="CVV">
      <button onclick="window.transferCryptoUI()">Send Crypto</button>
    </div>

    <div class="card">
      <h3>Exchange</h3>
      <input id="exchange-uah" type="number" min="1" step="1" placeholder="UAH amount">
      <button onclick="window.exchangeUAHtoUSDUI()">UAH → USD</button>

      <hr>

      <input id="exchange-usd" type="number" min="0.01" step="0.01" placeholder="USD amount">
      <button onclick="window.exchangeUSDtoUAHUI()">USD → UAH</button>
    </div>

    <div class="card">
      <h3>Support Bank</h3>
      <input id="support-amount" type="number" min="1" step="1" placeholder="Donation">
      <button onclick="window.donateSupportUI()">Donate</button>
    </div>

    ${transferResultCard("Fees", "UAH/USD fee: 5%, Crypto fee: 1%")}
  `);
}

// =====================
// UI BRIDGE
// =====================
window.transferUAHUI = async function(){
  const ok = await transferUAH(
    getInputValue("uah-recipient"),
    getInputValue("uah-amount"),
    getInputValue("uah-cvv")
  );

  if(ok){
    renderTransfersPage();
  }
};

window.transferUSDUI = async function(){
  const ok = await transferUSD(
    getInputValue("usd-recipient"),
    getInputValue("usd-amount"),
    getInputValue("usd-cvv")
  );

  if(ok){
    renderTransfersPage();
  }
};

window.transferCryptoUI = async function(){
  const ok = await transferCrypto(
    getInputValue("crypto-recipient"),
    normalizeText(getInputValue("crypto-symbol")).toUpperCase(),
    getInputValue("crypto-amount"),
    getInputValue("crypto-cvv")
  );

  if(ok){
    renderTransfersPage();
  }
};

window.exchangeUAHtoUSDUI = async function(){
  const ok = await exchangeUAHtoUSD(
    getInputValue("exchange-uah")
  );

  if(ok){
    renderTransfersPage();
  }
};

window.exchangeUSDtoUAHUI = async function(){
  const ok = await exchangeUSDtoUAH(
    getInputValue("exchange-usd")
  );

  if(ok){
    renderTransfersPage();
  }
};

window.donateSupportUI = async function(){
  const ok = await donateToSupport(
    getInputValue("support-amount")
  );

  if(ok){
    renderTransfersPage();
  }
};

window.changeCardCVVUI = async function(){
  const ok = await changeCardCVV(
    getInputValue("card-cvv-input")
  );

  if(ok){
    renderCardSettingsPage();
  }
};

window.changeCardNameUI = async function(){
  const ok = await changeCardName(
    getInputValue("card-name-input")
  );

  if(ok){
    renderCardSettingsPage();
  }
};

window.changeCardColorUI = async function(){
  const ok = await changeCardColor(
    getInputValue("card-color-input")
  );

  if(ok){
    renderCardSettingsPage();
  }
};
