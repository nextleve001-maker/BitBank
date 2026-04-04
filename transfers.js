import { AppState, updatePlayer } from "./app.js";
import {
  apiGetPlayer,
  apiUpdatePlayer,
  apiGetGameState,
  apiUpdateGameState,
  apiAddHistory
} from "./api.js";
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
function getPlayer() {
  return AppState.player || {};
}

function setPage(html) {
  const root = document.getElementById("page-content");
  if (!root) return;
  root.innerHTML = html;
  bindTransferUI();
}

function normalizeNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n;
}

function normalizeText(value) {
  return String(value || "").trim();
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

function validAmount(amount) {
  return Number.isFinite(amount) && amount > 0;
}

function isSelfRecipient(username) {
  return normalizeText(username) === normalizeText(getPlayer().username);
}

function feeAmount(amount, rate) {
  return Number(amount || 0) * Number(rate || 0);
}

function ensureCryptoWallet(player) {
  if (!player.crypto || typeof player.crypto !== "object" || Array.isArray(player.crypto)) {
    player.crypto = {};
  }
}

function getCryptoPrice(symbol) {
  const asset = (MarketState.crypto || []).find(
    (item) => item.id === symbol || item.symbol === symbol
  );
  return asset ? Number(asset.price || 0) : 0;
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function getCardPreviewColor() {
  return getPlayer().card_color || "#1f5fff";
}

function isPhone() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// =====================
// GAME STATE BANKS
// =====================
async function addCommission(amountUAH) {
  const state = await apiGetGameState();
  const next = Number(state?.commission_bank || 0) + Number(amountUAH || 0);

  await apiUpdateGameState({
    commission_bank: next
  });

  if (AppState.gameState) {
    AppState.gameState.commission_bank = next;
  }
}

async function addSupport(amountUAH) {
  const state = await apiGetGameState();
  const next = Number(state?.support_bank || 0) + Number(amountUAH || 0);

  await apiUpdateGameState({
    support_bank: next
  });

  if (AppState.gameState) {
    AppState.gameState.support_bank = next;
  }
}

// =====================
// VALIDATION
// =====================
async function resolveRecipient(usernameRaw) {
  const username = normalizeText(usernameRaw);

  if (!username) {
    alert("Enter recipient");
    return null;
  }

  if (isSelfRecipient(username)) {
    return getPlayer();
  }

  const recipient = await apiGetPlayer(username);

  if (!recipient) {
    alert("Recipient not found");
    return null;
  }

  return recipient;
}

function validateCVV(cvv) {
  const p = getPlayer();
  return normalizeText(cvv) === String(p.card_cvv || "");
}

// =====================
// UAH TRANSFER
// =====================
export async function transferUAH(recipientUsername, amountRaw, cvvRaw) {
  const sender = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if (!validAmount(amount)) {
    alert("Invalid amount");
    return false;
  }

  if (!validateCVV(cvvRaw)) {
    alert("Wrong CVV");
    return false;
  }

  const recipient = await resolveRecipient(recipientUsername);
  if (!recipient) return false;

  const fee = feeAmount(amount, UAH_TRANSFER_FEE);
  const total = amount + fee;

  if (Number(sender.balance || 0) < total) {
    alert("Not enough UAH");
    return false;
  }

  sender.balance = Number(sender.balance || 0) - total;

  if (recipient.username === sender.username) {
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
export async function transferUSD(recipientUsername, amountRaw, cvvRaw) {
  const sender = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if (!validAmount(amount)) {
    alert("Invalid amount");
    return false;
  }

  if (!validateCVV(cvvRaw)) {
    alert("Wrong CVV");
    return false;
  }

  const recipient = await resolveRecipient(recipientUsername);
  if (!recipient) return false;

  const fee = feeAmount(amount, USD_TRANSFER_FEE);
  const total = amount + fee;

  if (Number(sender.usd || 0) < total) {
    alert("Not enough USD");
    return false;
  }

  sender.usd = Number(sender.usd || 0) - total;

  if (recipient.username === sender.username) {
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

  await apiAddHistory(
    sender.username,
    `USD transfer to ${recipient.username}`,
    -((amount * USD_RATE) + (fee * USD_RATE))
  );

  await apiAddHistory(
    recipient.username,
    `USD received from ${sender.username}`,
    amount * USD_RATE
  );

  return true;
}

// =====================
// CRYPTO TRANSFER
// =====================
export async function transferCrypto(recipientUsername, symbolRaw, amountRaw, cvvRaw) {
  const sender = getPlayer();
  const symbol = normalizeText(symbolRaw).toUpperCase();
  const amount = normalizeNumber(amountRaw);

  if (!validAmount(amount)) {
    alert("Invalid amount");
    return false;
  }

  if (!validateCVV(cvvRaw)) {
    alert("Wrong CVV");
    return false;
  }

  const recipient = await resolveRecipient(recipientUsername);
  if (!recipient) return false;

  ensureCryptoWallet(sender);
  ensureCryptoWallet(recipient);

  const senderAmount = Number(sender.crypto[symbol] || 0);
  const fee = feeAmount(amount, CRYPTO_TRANSFER_FEE);
  const total = amount + fee;

  if (senderAmount < total) {
    alert("Not enough crypto");
    return false;
  }

  sender.crypto[symbol] = senderAmount - total;

  if (recipient.username === sender.username) {
    sender.crypto[symbol] += amount;

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

  await apiAddHistory(
    sender.username,
    `${symbol} transfer to ${recipient.username}`,
    -((amount * getCryptoPrice(symbol)) + commissionUAH)
  );

  await apiAddHistory(
    recipient.username,
    `${symbol} received from ${sender.username}`,
    amount * getCryptoPrice(symbol)
  );

  return true;
}

// =====================
// EXCHANGE
// =====================
export async function exchangeUAHtoUSD(amountRaw) {
  const p = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if (!validAmount(amount)) {
    alert("Invalid amount");
    return false;
  }

  if (Number(p.balance || 0) < amount) {
    alert("Not enough UAH");
    return false;
  }

  const usd = amount / USD_RATE;

  p.balance = Number(p.balance || 0) - amount;
  p.usd = Number(p.usd || 0) + usd;

  await updatePlayer({
    balance: p.balance,
    usd: p.usd
  });

  await apiAddHistory(p.username, "Exchange UAH to USD", -amount);
  return true;
}

export async function exchangeUSDtoUAH(amountRaw) {
  const p = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if (!validAmount(amount)) {
    alert("Invalid amount");
    return false;
  }

  if (Number(p.usd || 0) < amount) {
    alert("Not enough USD");
    return false;
  }

  const uah = amount * USD_RATE;

  p.usd = Number(p.usd || 0) - amount;
  p.balance = Number(p.balance || 0) + uah;

  await updatePlayer({
    balance: p.balance,
    usd: p.usd
  });

  await apiAddHistory(p.username, "Exchange USD to UAH", uah);
  return true;
}

// =====================
// SUPPORT
// =====================
export async function donateToSupport(amountRaw) {
  const p = getPlayer();
  const amount = normalizeNumber(amountRaw);

  if (!validAmount(amount)) {
    alert("Invalid amount");
    return false;
  }

  if (Number(p.balance || 0) < amount) {
    alert("Not enough balance");
    return false;
  }

  p.balance = Number(p.balance || 0) - amount;

  await updatePlayer({
    balance: p.balance
  });

  await addSupport(amount);
  await apiAddHistory(p.username, "Support donation", -amount);

  return true;
}

// =====================
// CARD SETTINGS
// =====================
export async function changeCardCVV(newCVV) {
  const p = getPlayer();
  const cvv = normalizeText(newCVV);

  if (!/^\d{3}$/.test(cvv)) {
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

export async function changeCardName(newName) {
  const p = getPlayer();
  const cardName = normalizeText(newName);

  if (!cardName) {
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

export async function changeCardColor(newColor) {
  const p = getPlayer();
  const color = normalizeText(newColor);

  if (!color) {
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
// RENDER HELPERS
// =====================
function sectionCard(title, subtitle, body) {
  return `
    <div class="card">
      <h3>${title}</h3>
      ${subtitle ? `<p class="muted" style="margin-bottom:12px;">${subtitle}</p>` : ""}
      ${body}
    </div>
  `;
}

function renderTransfersHero() {
  const p = getPlayer();

  return `
    <div class="dashboard-grid" style="grid-template-columns:1.25fr .75fr;">
      <div class="card">
        <h2>Money Transfer Hub</h2>
        <p>Premium transfer center for UAH, USD and crypto movements.</p>

        <div class="balance-duo" style="margin-top:16px;">
          <div class="balance-card">
            <div class="currency">UAH Balance</div>
            <div class="amount green">₴ ${formatMoney(p.balance)}</div>
            <div class="hint">Available for local transfer</div>
          </div>

          <div class="balance-card">
            <div class="currency">USD Balance</div>
            <div class="amount orange">$ ${formatMoney(p.usd)}</div>
            <div class="hint">Available for FX transfer</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Fees</h3>
        <p>UAH transfer fee: 5%</p>
        <p>USD transfer fee: 5%</p>
        <p>Crypto transfer fee: 1%</p>
        <p>Exchange rate: 1 USD = ${USD_RATE} UAH</p>
      </div>
    </div>
  `;
}

function renderCardHero() {
  const p = getPlayer();

  return `
    <div class="dashboard-grid" style="grid-template-columns:1.2fr .8fr;">
      <div class="bank-card" style="background:
        radial-gradient(circle at top right, rgba(255,255,255,.18), transparent 24%),
        radial-gradient(circle at bottom left, rgba(91,224,255,.14), transparent 20%),
        linear-gradient(135deg, ${getCardPreviewColor()} 0%, #143b9f 50%, #0b245d 100%);
      ">
        <div class="bank-top">
          <div>
            <div class="bank-label">BitBank Personal</div>
            <div class="bank-name">${p.card_name || p.username || "Player"}</div>
          </div>
          <div class="bank-chip"></div>
        </div>

        <div class="bank-number">${p.card_number || "0000 0000 0000 0000"}</div>

        <div class="bank-bottom">
          <div>
            <div class="bank-small">holder</div>
            <div class="bank-big">${p.username || "Unknown"}</div>
          </div>
          <div>
            <div class="bank-small">cvv</div>
            <div class="bank-big">${p.card_cvv || "000"}</div>
          </div>
          <div>
            <div class="bank-small">exp</div>
            <div class="bank-big">${p.card_expiry || "12/30"}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Card Profile</h3>
        <p><span class="muted">Name:</span> ${p.card_name || p.username || "Player"}</p>
        <p><span class="muted">Color:</span> ${p.card_color || "#1f5fff"}</p>
        <p><span class="muted">Protected:</span> CVV active</p>
      </div>
    </div>
  `;
}

// =====================
// RENDER TRANSFERS PAGE
// =====================
export function renderTransfersPage() {
  document.body.dataset.currentPage = "transfers";

  setPage(`
    ${renderTransfersHero()}

    <div class="section-title">Transfers</div>

    <div class="asset-grid">
      ${sectionCard(
        "UAH Transfer",
        "Send hryvnia to another player",
        `
          <div class="profile-actions">
            <input id="uah-recipient" placeholder="Recipient username">
            <input id="uah-amount" type="number" min="1" step="1" placeholder="Amount">
            <input id="uah-cvv" placeholder="CVV">
            <button id="transfer-uah-btn">Send UAH</button>
          </div>
        `
      )}

      ${sectionCard(
        "USD Transfer",
        "Send dollar balance to another player",
        `
          <div class="profile-actions">
            <input id="usd-recipient" placeholder="Recipient username">
            <input id="usd-amount" type="number" min="0.01" step="0.01" placeholder="Amount">
            <input id="usd-cvv" placeholder="CVV">
            <button id="transfer-usd-btn">Send USD</button>
          </div>
        `
      )}

      ${sectionCard(
        "Crypto Transfer",
        "Transfer crypto by symbol",
        `
          <div class="profile-actions">
            <input id="crypto-recipient" placeholder="Recipient username">
            <input id="crypto-symbol" placeholder="BTC / ETH / TON">
            <input id="crypto-amount" type="number" min="0.0001" step="0.0001" placeholder="Amount">
            <input id="crypto-cvv" placeholder="CVV">
            <button id="transfer-crypto-btn">Send Crypto</button>
          </div>
        `
      )}
    </div>

    <div class="section-title">Exchange & Support</div>

    <div class="asset-grid">
      ${sectionCard(
        "UAH → USD",
        "Convert local balance to dollar reserve",
        `
          <div class="profile-actions">
            <input id="exchange-uah" type="number" min="1" step="1" placeholder="UAH amount">
            <button id="exchange-uah-usd-btn">Convert to USD</button>
          </div>
        `
      )}

      ${sectionCard(
        "USD → UAH",
        "Convert dollar balance to hryvnia",
        `
          <div class="profile-actions">
            <input id="exchange-usd" type="number" min="0.01" step="0.01" placeholder="USD amount">
            <button id="exchange-usd-uah-btn">Convert to UAH</button>
          </div>
        `
      )}

      ${sectionCard(
        "Support Bank",
        "Donate directly into the support bank",
        `
          <div class="profile-actions">
            <input id="support-amount" type="number" min="1" step="1" placeholder="Donation amount">
            <button id="support-donate-btn">Donate</button>
          </div>
        `
      )}
    </div>
  `);
}

// =====================
// RENDER CARD SETTINGS PAGE
// =====================
export function renderCardSettingsPage() {
  document.body.dataset.currentPage = "card";

  setPage(`
    ${renderCardHero()}

    <div class="section-title">Card Settings</div>

    <div class="asset-grid">
      ${sectionCard(
        "Change CVV",
        "Set new 3-digit security code",
        `
          <div class="profile-actions">
            <input id="card-cvv-input" placeholder="New CVV">
            <button id="card-cvv-save-btn">Save CVV</button>
          </div>
        `
      )}

      ${sectionCard(
        "Change Card Name",
        "Rename your premium card",
        `
          <div class="profile-actions">
            <input id="card-name-input" placeholder="New card name">
            <button id="card-name-save-btn">Save Name</button>
          </div>
        `
      )}

      ${sectionCard(
        "Change Card Color",
        "Apply a custom card accent",
        `
          <div class="profile-actions">
            <input id="card-color-input" placeholder="#1f5fff">
            <button id="card-color-save-btn">Save Color</button>
          </div>
        `
      )}
    </div>
  `);
}

// =====================
// BIND UI
// =====================
function bindTransferUI() {
  const bind = (id, handler) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", handler);
    el.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        handler();
      },
      { passive: false }
    );
  };

  bind("transfer-uah-btn", async () => {
    const ok = await transferUAH(
      getInputValue("uah-recipient"),
      getInputValue("uah-amount"),
      getInputValue("uah-cvv")
    );
    if (ok) renderTransfersPage();
  });

  bind("transfer-usd-btn", async () => {
    const ok = await transferUSD(
      getInputValue("usd-recipient"),
      getInputValue("usd-amount"),
      getInputValue("usd-cvv")
    );
    if (ok) renderTransfersPage();
  });

  bind("transfer-crypto-btn", async () => {
    const ok = await transferCrypto(
      getInputValue("crypto-recipient"),
      normalizeText(getInputValue("crypto-symbol")).toUpperCase(),
      getInputValue("crypto-amount"),
      getInputValue("crypto-cvv")
    );
    if (ok) renderTransfersPage();
  });

  bind("exchange-uah-usd-btn", async () => {
    const ok = await exchangeUAHtoUSD(getInputValue("exchange-uah"));
    if (ok) renderTransfersPage();
  });

  bind("exchange-usd-uah-btn", async () => {
    const ok = await exchangeUSDtoUAH(getInputValue("exchange-usd"));
    if (ok) renderTransfersPage();
  });

  bind("support-donate-btn", async () => {
    const ok = await donateToSupport(getInputValue("support-amount"));
    if (ok) renderTransfersPage();
  });

  bind("card-cvv-save-btn", async () => {
    const ok = await changeCardCVV(getInputValue("card-cvv-input"));
    if (ok) renderCardSettingsPage();
  });

  bind("card-name-save-btn", async () => {
    const ok = await changeCardName(getInputValue("card-name-input"));
    if (ok) renderCardSettingsPage();
  });

  bind("card-color-save-btn", async () => {
    const ok = await changeCardColor(getInputValue("card-color-input"));
    if (ok) renderCardSettingsPage();
  });
}
