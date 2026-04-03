// =====================
// IMPORTS
// =====================
import { saveSession, startApp } from "./app.js";
import { apiCreatePlayer, apiGetPlayer } from "./api.js";

// =====================
// HELPERS
// =====================
function getLoginUsername(){
  return document.getElementById("login-username")?.value.trim() || "";
}

function getLoginPassword(){
  return document.getElementById("login-password")?.value || "";
}

function getRegisterUsername(){
  return document.getElementById("register-username")?.value.trim() || "";
}

function getRegisterPassword(){
  return document.getElementById("register-password")?.value || "";
}

function showAuthMessage(text){
  const box = document.getElementById("auth-message");
  if(box){
    box.textContent = text;
  } else {
    alert(text);
  }
}

function currentDeviceType(){
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "phone" : "desktop";
}

function generateCardNumber(){
  const parts = [];
  for(let i = 0; i < 4; i++){
    parts.push(String(Math.floor(1000 + Math.random() * 9000)));
  }
  return parts.join(" ");
}

function generateCardExpiry(){
  const now = new Date();
  const year = String((now.getFullYear() + 3) % 100).padStart(2, "0");
  const month = String(Math.max(1, now.getMonth() + 1)).padStart(2, "0");
  return `${month}/${year}`;
}

function generateCardCVV(){
  return String(Math.floor(100 + Math.random() * 900));
}

function getStarterPlayer(username, password){
  const now = new Date().toISOString();

  return {
    username,
    password,
    class: "none",
    balance: 1000,
    usd: 0,
    total_earned: 0,
    card_name: username,
    card_color: "#3b82f6",
    card_cvv: generateCardCVV(),
    card_number: generateCardNumber(),
    card_expiry: generateCardExpiry(),
    device: currentDeviceType(),
    banned: false,
    last_seen: now,
    last_bonus_day: "",
    vip_giveaway_day: "",
    crypto: {},
    stocks: {},
    businesses: [],
    business_levels: {},
    realty: [],
    cars: [],
    titles: [],
    friends: [],
    inventory: [],
    achievements: [],
    completed_quests: [],
    bank: 0,
    loan: 0,
    insurance: false
  };
}

// =====================
// VALIDATION
// =====================
function validateUsername(username){
  if(!username) return "Введи логін";
  if(username.length < 3) return "Логін має бути від 3 символів";
  if(username.length > 24) return "Логін занадто довгий";
  if(!/^[a-zA-Z0-9_]+$/.test(username)){
    return "Логін: тільки букви, цифри і _";
  }
  return "";
}

function validatePassword(password){
  if(!password) return "Введи пароль";
  if(password.length < 4) return "Пароль має бути від 4 символів";
  if(password.length > 64) return "Пароль занадто довгий";
  return "";
}

// =====================
// LOGIN
// =====================
export async function loginUser(){
  const username = getLoginUsername();
  const password = getLoginPassword();

  const userError = validateUsername(username);
  if(userError){
    showAuthMessage(userError);
    return;
  }

  const passError = validatePassword(password);
  if(passError){
    showAuthMessage(passError);
    return;
  }

  const user = await apiGetPlayer(username);

  if(!user){
    showAuthMessage("Користувача не знайдено");
    return;
  }

  if(user.password !== password){
    showAuthMessage("Неправильний пароль");
    return;
  }

  if(user.banned){
    showAuthMessage("Акаунт заблоковано");
    return;
  }

  saveSession(username);
  await startApp(username);
}

// =====================
// REGISTER
// =====================
export async function registerUser(){
  const username = getRegisterUsername();
  const password = getRegisterPassword();

  const userError = validateUsername(username);
  if(userError){
    showAuthMessage(userError);
    return;
  }

  const passError = validatePassword(password);
  if(passError){
    showAuthMessage(passError);
    return;
  }

  const existing = await apiGetPlayer(username);

  if(existing){
    showAuthMessage("Такий логін уже існує");
    return;
  }

  const newPlayer = getStarterPlayer(username, password);

  const created = await apiCreatePlayer(newPlayer);

  if(!created){
    showAuthMessage("Не вдалося створити акаунт");
    return;
  }

  showAuthMessage("Реєстрація успішна. Тепер увійди.");
  clearRegisterForm();
}

// =====================
// FORM HELPERS
// =====================
function clearRegisterForm(){
  const u = document.getElementById("register-username");
  const p = document.getElementById("register-password");

  if(u) u.value = "";
  if(p) p.value = "";
}

function switchTab(tab){
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");

  if(tab === "login"){
    loginForm?.classList.remove("hidden");
    registerForm?.classList.add("hidden");
    loginTab?.classList.add("active");
    registerTab?.classList.remove("active");
  } else {
    loginForm?.classList.add("hidden");
    registerForm?.classList.remove("hidden");
    loginTab?.classList.remove("active");
    registerTab?.classList.add("active");
  }
}

// =====================
// BIND AUTH EVENTS
// =====================
export function bindAuthEvents(){
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");

  if(loginBtn){
    loginBtn.addEventListener("click", loginUser);
  }

  if(registerBtn){
    registerBtn.addEventListener("click", registerUser);
  }

  if(loginTab){
    loginTab.addEventListener("click", ()=>switchTab("login"));
  }

  if(registerTab){
    registerTab.addEventListener("click", ()=>switchTab("register"));
  }

  const loginPassword = document.getElementById("login-password");
  const registerPassword = document.getElementById("register-password");

  if(loginPassword){
    loginPassword.addEventListener("keydown", async (e)=>{
      if(e.key === "Enter"){
        await loginUser();
      }
    });
  }

  if(registerPassword){
    registerPassword.addEventListener("keydown", async (e)=>{
      if(e.key === "Enter"){
        await registerUser();
      }
    });
  }
}
