import { AppState } from "./app.js";

// ======================================================
// CONFIG
// ======================================================
export const LANGUAGES = [
  { id: "ua", label: "UA" },
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "pl", label: "PL" },
  { id: "it", label: "IT" }
];

const STORAGE_KEY = "bb_lang";

// ======================================================
// DICTIONARY
// ======================================================
export const I18N = {
  ua: {
    language: "Мова",
    profile: "Профіль",
    business: "Бізнес",
    crypto: "Крипта",
    stocks: "Акції",
    finance: "Фінанси",
    cards: "Картки",
    friends: "Друзі",
    battle: "Битва",
    casino: "Казино",
    loot: "Лут",
    collections: "Колекції",
    roles: "Ролі",
    inventory: "Інвентар",
    history: "Історія",
    stats: "Статистика",
    admin: "Адмін",
    login: "Вхід",
    register: "Реєстрація",
    logout: "Вийти",
    username: "Нік",
    password: "Пароль",
    balance: "Баланс",
    currentClass: "Поточний клас",
    portfolio: "Портфель",
    device: "Пристрій",
    online: "Онлайн",
    offline: "Офлайн",
    market: "Ринок",
    transfers: "Перекази",
    cardSettings: "Налаштування картки",
    click: "Клік",
    save: "Зберегти",
    remove: "Видалити",
    add: "Додати",
    search: "Пошук",
    open: "Відкрити",
    buy: "Купити",
    sell: "Продати",
    apply: "Застосувати",
    active: "Активно",
    owned: "Куплено",
    reward: "Нагорода",
    complete: "Завершено",
    inProgress: "В процесі",
    noData: "Немає даних",
    prestige: "Престиж",
    totalEarned: "Всього зароблено",
    clickIncome: "Дохід за клік",
    passiveIncome: "Пасивний дохід",
    wealthTier: "Рівень багатства",
    noFriendsYet: "Друзів ще немає",
    addFriend: "Додати друга",
    removeFriend: "Видалити друга",
    currentUser: "Поточний користувач",
    top100: "Топ 100",
    cardDesigns: "Дизайни карток",
    financeCenter: "Фінансовий центр",
    deposits: "Депозити",
    credit: "Кредит",
    transferLimit: "Ліміт переказу",
    battleArena: "Арена битв",
    availableRoles: "Доступні ролі",
    collectionBonuses: "Бонуси колекцій",
    noMatchingHistory: "Нічого не знайдено",
    item: "Предмет",
    car: "Авто",
    realty: "Нерухомість",
    theme: "Тема",
    role: "Роль",
    className: "Клас",
    businessProjects: "Бізнес-проєкти",
    currentCard: "Поточна картка",
    currentRole: "Поточна роль",
    cardNickname: "Нік картки",
    cardAccent: "Акцент картки",
    sendUAH: "Надіслати UAH",
    sendUSD: "Надіслати USD",
    recipient: "Отримувач",
    amount: "Сума",
    openDeposit: "Відкрити депозит",
    repay: "Погасити",
    takeCredit: "Взяти кредит",
    claim: "Забрати",
    closeEarly: "Закрити достроково",
    settings: "Налаштування"
  },

  en: {
    language: "Language",
    profile: "Profile",
    business: "Business",
    crypto: "Crypto",
    stocks: "Stocks",
    finance: "Finance",
    cards: "Cards",
    friends: "Friends",
    battle: "Battle",
    casino: "Casino",
    loot: "Loot",
    collections: "Collections",
    roles: "Roles",
    inventory: "Inventory",
    history: "History",
    stats: "Stats",
    admin: "Admin",
    login: "Login",
    register: "Register",
    logout: "Logout",
    username: "Username",
    password: "Password",
    balance: "Balance",
    currentClass: "Current class",
    portfolio: "Portfolio",
    device: "Device",
    online: "Online",
    offline: "Offline",
    market: "Market",
    transfers: "Transfers",
    cardSettings: "Card settings",
    click: "Click",
    save: "Save",
    remove: "Remove",
    add: "Add",
    search: "Search",
    open: "Open",
    buy: "Buy",
    sell: "Sell",
    apply: "Apply",
    active: "Active",
    owned: "Owned",
    reward: "Reward",
    complete: "Complete",
    inProgress: "In progress",
    noData: "No data",
    prestige: "Prestige",
    totalEarned: "Total earned",
    clickIncome: "Click income",
    passiveIncome: "Passive income",
    wealthTier: "Wealth tier",
    noFriendsYet: "No friends yet",
    addFriend: "Add friend",
    removeFriend: "Remove friend",
    currentUser: "Current user",
    top100: "Top 100",
    cardDesigns: "Card designs",
    financeCenter: "Finance center",
    deposits: "Deposits",
    credit: "Credit",
    transferLimit: "Transfer limit",
    battleArena: "Battle arena",
    availableRoles: "Available roles",
    collectionBonuses: "Collection bonuses",
    noMatchingHistory: "No matching history",
    item: "Item",
    car: "Car",
    realty: "Realty",
    theme: "Theme",
    role: "Role",
    className: "Class",
    businessProjects: "Business projects",
    currentCard: "Current card",
    currentRole: "Current role",
    cardNickname: "Card nickname",
    cardAccent: "Card accent",
    sendUAH: "Send UAH",
    sendUSD: "Send USD",
    recipient: "Recipient",
    amount: "Amount",
    openDeposit: "Open deposit",
    repay: "Repay",
    takeCredit: "Take credit",
    claim: "Claim",
    closeEarly: "Close early",
    settings: "Settings"
  },

  fr: {
    language: "Langue",
    profile: "Profil",
    business: "Business",
    crypto: "Crypto",
    stocks: "Actions",
    finance: "Finance",
    cards: "Cartes",
    friends: "Amis",
    battle: "Combat",
    casino: "Casino",
    loot: "Butin",
    collections: "Collections",
    roles: "Rôles",
    inventory: "Inventaire",
    history: "Historique",
    stats: "Statistiques",
    admin: "Admin",
    login: "Connexion",
    register: "Inscription",
    logout: "Déconnexion",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    balance: "Solde",
    currentClass: "Classe actuelle",
    portfolio: "Portefeuille",
    device: "Appareil",
    online: "En ligne",
    offline: "Hors ligne",
    market: "Marché",
    transfers: "Transferts",
    cardSettings: "Paramètres de carte",
    click: "Cliquer",
    save: "Enregistrer",
    remove: "Retirer",
    add: "Ajouter",
    search: "Rechercher",
    open: "Ouvrir",
    buy: "Acheter",
    sell: "Vendre",
    apply: "Appliquer",
    active: "Actif",
    owned: "Possédé",
    reward: "Récompense",
    complete: "Terminé",
    inProgress: "En cours",
    noData: "Pas de données",
    prestige: "Prestige",
    totalEarned: "Total gagné",
    clickIncome: "Revenu par clic",
    passiveIncome: "Revenu passif",
    wealthTier: "Niveau de richesse",
    noFriendsYet: "Pas encore d'amis",
    addFriend: "Ajouter un ami",
    removeFriend: "Supprimer un ami",
    currentUser: "Utilisateur actuel",
    top100: "Top 100",
    cardDesigns: "Designs de cartes",
    financeCenter: "Centre financier",
    deposits: "Dépôts",
    credit: "Crédit",
    transferLimit: "Limite de transfert",
    battleArena: "Arène de combat",
    availableRoles: "Rôles disponibles",
    collectionBonuses: "Bonus de collection",
    noMatchingHistory: "Aucun historique trouvé",
    item: "Objet",
    car: "Voiture",
    realty: "Immobilier",
    theme: "Thème",
    role: "Rôle",
    className: "Classe",
    businessProjects: "Projets business",
    currentCard: "Carte actuelle",
    currentRole: "Rôle actuel",
    cardNickname: "Surnom de carte",
    cardAccent: "Accent de carte",
    sendUAH: "Envoyer UAH",
    sendUSD: "Envoyer USD",
    recipient: "Destinataire",
    amount: "Montant",
    openDeposit: "Ouvrir un dépôt",
    repay: "Rembourser",
    takeCredit: "Prendre un crédit",
    claim: "Récupérer",
    closeEarly: "Fermer plus tôt",
    settings: "Paramètres"
  },

  pl: {
    language: "Język",
    profile: "Profil",
    business: "Biznes",
    crypto: "Krypto",
    stocks: "Akcje",
    finance: "Finanse",
    cards: "Karty",
    friends: "Znajomi",
    battle: "Bitwa",
    casino: "Kasyno",
    loot: "Loot",
    collections: "Kolekcje",
    roles: "Role",
    inventory: "Ekwipunek",
    history: "Historia",
    stats: "Statystyki",
    admin: "Admin",
    login: "Logowanie",
    register: "Rejestracja",
    logout: "Wyloguj",
    username: "Nazwa użytkownika",
    password: "Hasło",
    balance: "Saldo",
    currentClass: "Aktualna klasa",
    portfolio: "Portfel",
    device: "Urządzenie",
    online: "Online",
    offline: "Offline",
    market: "Rynek",
    transfers: "Przelewy",
    cardSettings: "Ustawienia karty",
    click: "Klik",
    save: "Zapisz",
    remove: "Usuń",
    add: "Dodaj",
    search: "Szukaj",
    open: "Otwórz",
    buy: "Kup",
    sell: "Sprzedaj",
    apply: "Zastosuj",
    active: "Aktywne",
    owned: "Posiadane",
    reward: "Nagroda",
    complete: "Ukończono",
    inProgress: "W toku",
    noData: "Brak danych",
    prestige: "Prestiż",
    totalEarned: "Łącznie zarobiono",
    clickIncome: "Dochód za klik",
    passiveIncome: "Dochód pasywny",
    wealthTier: "Poziom bogactwa",
    noFriendsYet: "Nie masz jeszcze znajomych",
    addFriend: "Dodaj znajomego",
    removeFriend: "Usuń znajomego",
    currentUser: "Bieżący użytkownik",
    top100: "Top 100",
    cardDesigns: "Style kart",
    financeCenter: "Centrum finansowe",
    deposits: "Depozyty",
    credit: "Kredyt",
    transferLimit: "Limit przelewu",
    battleArena: "Arena walki",
    availableRoles: "Dostępne role",
    collectionBonuses: "Bonusy kolekcji",
    noMatchingHistory: "Brak pasującej historii",
    item: "Przedmiot",
    car: "Auto",
    realty: "Nieruchomość",
    theme: "Motyw",
    role: "Rola",
    className: "Klasa",
    businessProjects: "Projekty biznesowe",
    currentCard: "Aktualna karta",
    currentRole: "Aktualna rola",
    cardNickname: "Nazwa karty",
    cardAccent: "Akcent karty",
    sendUAH: "Wyślij UAH",
    sendUSD: "Wyślij USD",
    recipient: "Odbiorca",
    amount: "Kwota",
    openDeposit: "Otwórz depozyt",
    repay: "Spłać",
    takeCredit: "Weź kredyt",
    claim: "Odbierz",
    closeEarly: "Zamknij wcześniej",
    settings: "Ustawienia"
  },

  it: {
    language: "Lingua",
    profile: "Profilo",
    business: "Business",
    crypto: "Crypto",
    stocks: "Azioni",
    finance: "Finanza",
    cards: "Carte",
    friends: "Amici",
    battle: "Battaglia",
    casino: "Casinò",
    loot: "Loot",
    collections: "Collezioni",
    roles: "Ruoli",
    inventory: "Inventario",
    history: "Cronologia",
    stats: "Statistiche",
    admin: "Admin",
    login: "Accesso",
    register: "Registrazione",
    logout: "Esci",
    username: "Nome utente",
    password: "Password",
    balance: "Saldo",
    currentClass: "Classe attuale",
    portfolio: "Portafoglio",
    device: "Dispositivo",
    online: "Online",
    offline: "Offline",
    market: "Mercato",
    transfers: "Trasferimenti",
    cardSettings: "Impostazioni carta",
    click: "Clic",
    save: "Salva",
    remove: "Rimuovi",
    add: "Aggiungi",
    search: "Cerca",
    open: "Apri",
    buy: "Compra",
    sell: "Vendi",
    apply: "Applica",
    active: "Attivo",
    owned: "Posseduto",
    reward: "Ricompensa",
    complete: "Completato",
    inProgress: "In corso",
    noData: "Nessun dato",
    prestige: "Prestigio",
    totalEarned: "Totale guadagnato",
    clickIncome: "Guadagno per clic",
    passiveIncome: "Guadagno passivo",
    wealthTier: "Livello ricchezza",
    noFriendsYet: "Nessun amico ancora",
    addFriend: "Aggiungi amico",
    removeFriend: "Rimuovi amico",
    currentUser: "Utente attuale",
    top100: "Top 100",
    cardDesigns: "Design carte",
    financeCenter: "Centro finanziario",
    deposits: "Depositi",
    credit: "Credito",
    transferLimit: "Limite trasferimento",
    battleArena: "Arena di battaglia",
    availableRoles: "Ruoli disponibili",
    collectionBonuses: "Bonus collezioni",
    noMatchingHistory: "Nessuna cronologia trovata",
    item: "Oggetto",
    car: "Auto",
    realty: "Immobili",
    theme: "Tema",
    role: "Ruolo",
    className: "Classe",
    businessProjects: "Progetti business",
    currentCard: "Carta attuale",
    currentRole: "Ruolo attuale",
    cardNickname: "Nome carta",
    cardAccent: "Accento carta",
    sendUAH: "Invia UAH",
    sendUSD: "Invia USD",
    recipient: "Destinatario",
    amount: "Importo",
    openDeposit: "Apri deposito",
    repay: "Rimborsa",
    takeCredit: "Prendi credito",
    claim: "Riscatta",
    closeEarly: "Chiudi prima",
    settings: "Impostazioni"
  }
};

// ======================================================
// CORE
// ======================================================
export function getCurrentLanguage() {
  const fromState = String(AppState.lang || "").trim();
  if (fromState && I18N[fromState]) return fromState;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && I18N[saved]) return saved;

  return "ua";
}

export function setLanguage(lang) {
  const value = I18N[lang] ? lang : "ua";
  AppState.lang = value;
  localStorage.setItem(STORAGE_KEY, value);
  document.documentElement.setAttribute("lang", value);
  return value;
}

export function initLanguage() {
  const lang = getCurrentLanguage();
  setLanguage(lang);
  return lang;
}

export function t(key, fallback = null) {
  const lang = getCurrentLanguage();
  const dict = I18N[lang] || I18N.ua;

  if (dict[key] !== undefined) return dict[key];
  if (fallback !== null) return fallback;
  if (I18N.en[key] !== undefined) return I18N.en[key];

  return key;
}

// ======================================================
// UI SWITCHER
// ======================================================
export function renderLanguageSwitcher() {
  const current = getCurrentLanguage();

  return `
    <div class="card" style="grid-column:1 / -1;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <div>
          <h3 style="margin-bottom:6px;">${t("language")}</h3>
          <p class="muted">Switch interface language</p>
        </div>

        <div class="titles-list">
          ${LANGUAGES.map((lang) => `
            <button
              class="${current === lang.id ? "" : "secondary"}"
              data-lang-switch="${lang.id}"
              type="button"
            >
              ${lang.label}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

export function bindLanguageSwitcher(onChange) {
  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    if (btn.dataset.boundLang === "1") return;
    btn.dataset.boundLang = "1";

    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang-switch");
      setLanguage(lang);

      if (typeof onChange === "function") {
        onChange(lang);
      } else {
        location.reload();
      }
    });
  });
}

// ======================================================
// DIRECT DOM TRANSLATION
// ======================================================
export function applyStaticTranslations() {
  const map = [
    [".nav-btn[data-page='profile'] .nav-label", "profile"],
    [".nav-btn[data-page='business'] .nav-label", "business"],
    [".nav-btn[data-page='crypto'] .nav-label", "crypto"],
    [".nav-btn[data-page='stocks'] .nav-label", "stocks"],
    [".nav-btn[data-page='finance'] .nav-label", "finance"],
    [".nav-btn[data-page='cards'] .nav-label", "cards"],
    [".nav-btn[data-page='friends'] .nav-label", "friends"],
    [".nav-btn[data-page='battle'] .nav-label", "battle"],
    [".nav-btn[data-page='casino'] .nav-label", "casino"],
    [".nav-btn[data-page='loot'] .nav-label", "loot"],
    [".nav-btn[data-page='collections'] .nav-label", "collections"],
    [".nav-btn[data-page='roles'] .nav-label", "roles"],
    [".nav-btn[data-page='inventory'] .nav-label", "inventory"],
    [".nav-btn[data-page='history'] .nav-label", "history"],
    [".nav-btn[data-page='stats'] .nav-label", "stats"],
    [".nav-btn[data-page='admin'] .nav-label", "admin"],

    [".mobile-tab-btn[data-page='profile'] small", "profile"],
    [".mobile-tab-btn[data-page='business'] small", "business"],
    [".mobile-tab-btn[data-page='crypto'] small", "market"],
    [".mobile-tab-btn[data-page='cards'] small", "cards"],
    [".mobile-tab-btn[data-page='friends'] small", "friends"],

    ["#tab-login", "login"],
    ["#tab-register", "register"],
    ["#logout-btn", "logout"]
  ];

  map.forEach(([selector, key]) => {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = t(key);
    }
  });
}

// ======================================================
// FORMAT HELPERS
// ======================================================
export function formatCurrencyLocalized(value, currency = "UAH") {
  const lang = getCurrentLanguage();

  const localeMap = {
    ua: "uk-UA",
    en: "en-US",
    fr: "fr-FR",
    pl: "pl-PL",
    it: "it-IT"
  };

  const locale = localeMap[lang] || "uk-UA";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency
    }).format(Number(value || 0));
  } catch {
    return `${Number(value || 0).toLocaleString(locale)} ${currency}`;
  }
}
