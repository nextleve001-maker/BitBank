export const LANGUAGES = {
  ua: {
    profile: "Профіль",
    business: "Бізнес",
    crypto: "Крипто",
    stocks: "Акції",
    realty: "Нерухомість",
    cars: "Машини",
    inventory: "Інвентар",
    friends: "Друзі",
    battle: "Битва",
    casino: "Казино",
    transfers: "Перекази",
    card: "Картка",
    history: "Історія",
    stats: "Статистика",
    admin: "Адмін",
    logout: "Вийти",
    login: "Увійти",
    register: "Реєстрація",
    username: "Логін",
    password: "Пароль",
    loading: "Завантаження...",
    balance: "Баланс",
    currentClass: "Клас",
    device: "Пристрій",
    supportBank: "Банк підтримки",
    commissionBank: "Комісійний банк",
    noHistory: "Історія порожня",
    historyTitle: "Історія операцій",
    amount: "Сума",
    date: "Дата",
    action: "Дія",
    refresh: "Оновити",
    noData: "Немає даних",
    globalMessage: "Глобальне повідомлення",
    transferHub: "Центр переказів",
    cardSettings: "Налаштування картки",
    buy: "Купити",
    sell: "Продати",
    upgrade: "Прокачати",
    owned: "Кількість",
    income: "Дохід",
    perMinute: "за хвилину",
    current: "Поточний",
    market: "Ринок",
    portfolio: "Портфель",
    classSystem: "Система класів",
    premiumDashboard: "Преміальна панель",
    tapToEarn: "Натисни щоб заробити"
  },

  en: {
    profile: "Profile",
    business: "Business",
    crypto: "Crypto",
    stocks: "Stocks",
    realty: "Realty",
    cars: "Cars",
    inventory: "Inventory",
    friends: "Friends",
    battle: "Battle",
    casino: "Casino",
    transfers: "Transfers",
    card: "Card",
    history: "History",
    stats: "Stats",
    admin: "Admin",
    logout: "Logout",
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    loading: "Loading...",
    balance: "Balance",
    currentClass: "Class",
    device: "Device",
    supportBank: "Support Bank",
    commissionBank: "Commission Bank",
    noHistory: "History is empty",
    historyTitle: "Transaction History",
    amount: "Amount",
    date: "Date",
    action: "Action",
    refresh: "Refresh",
    noData: "No data",
    globalMessage: "Global Message",
    transferHub: "Transfer Hub",
    cardSettings: "Card Settings",
    buy: "Buy",
    sell: "Sell",
    upgrade: "Upgrade",
    owned: "Owned",
    income: "Income",
    perMinute: "per minute",
    current: "Current",
    market: "Market",
    portfolio: "Portfolio",
    classSystem: "Class System",
    premiumDashboard: "Premium Dashboard",
    tapToEarn: "Tap to Earn"
  },

  fr: {
    profile: "Profil",
    business: "Business",
    crypto: "Crypto",
    stocks: "Actions",
    realty: "Immobilier",
    cars: "Voitures",
    inventory: "Inventaire",
    friends: "Amis",
    battle: "Combat",
    casino: "Casino",
    transfers: "Transferts",
    card: "Carte",
    history: "Historique",
    stats: "Statistiques",
    admin: "Admin",
    logout: "Déconnexion",
    login: "Connexion",
    register: "Inscription",
    username: "Identifiant",
    password: "Mot de passe",
    loading: "Chargement...",
    balance: "Solde",
    currentClass: "Classe",
    device: "Appareil",
    supportBank: "Banque de support",
    commissionBank: "Banque des commissions",
    noHistory: "Historique vide",
    historyTitle: "Historique des opérations",
    amount: "Montant",
    date: "Date",
    action: "Action",
    refresh: "Actualiser",
    noData: "Pas de données",
    globalMessage: "Message global",
    transferHub: "Centre de transferts",
    cardSettings: "Paramètres de carte",
    buy: "Acheter",
    sell: "Vendre",
    upgrade: "Améliorer",
    owned: "Possédé",
    income: "Revenu",
    perMinute: "par minute",
    current: "Actuel",
    market: "Marché",
    portfolio: "Portefeuille",
    classSystem: "Système de classes",
    premiumDashboard: "Tableau premium",
    tapToEarn: "Touchez pour gagner"
  },

  it: {
    profile: "Profilo",
    business: "Business",
    crypto: "Crypto",
    stocks: "Azioni",
    realty: "Immobili",
    cars: "Auto",
    inventory: "Inventario",
    friends: "Amici",
    battle: "Battaglia",
    casino: "Casino",
    transfers: "Trasferimenti",
    card: "Carta",
    history: "Cronologia",
    stats: "Statistiche",
    admin: "Admin",
    logout: "Esci",
    login: "Accedi",
    register: "Registrati",
    username: "Username",
    password: "Password",
    loading: "Caricamento...",
    balance: "Saldo",
    currentClass: "Classe",
    device: "Dispositivo",
    supportBank: "Banca supporto",
    commissionBank: "Banca commissioni",
    noHistory: "Cronologia vuota",
    historyTitle: "Cronologia operazioni",
    amount: "Importo",
    date: "Data",
    action: "Azione",
    refresh: "Aggiorna",
    noData: "Nessun dato",
    globalMessage: "Messaggio globale",
    transferHub: "Centro trasferimenti",
    cardSettings: "Impostazioni carta",
    buy: "Compra",
    sell: "Vendi",
    upgrade: "Potenzia",
    owned: "Posseduto",
    income: "Reddito",
    perMinute: "al minuto",
    current: "Attuale",
    market: "Mercato",
    portfolio: "Portafoglio",
    classSystem: "Sistema classi",
    premiumDashboard: "Dashboard premium",
    tapToEarn: "Tocca per guadagnare"
  }
};

export function getCurrentLanguage() {
  return localStorage.getItem("bitbank_lang") || "ua";
}

export function setCurrentLanguage(lang) {
  localStorage.setItem("bitbank_lang", lang);
}

export function t(key) {
  const lang = getCurrentLanguage();
  return LANGUAGES[lang]?.[key] || LANGUAGES.ua[key] || key;
}

export function renderLanguageSwitcher() {
  return `
    <div class="card" style="grid-column:1 / -1;">
      <h3>Language</h3>
      <div class="asset-actions" style="grid-template-columns:repeat(4,1fr);">
        <button data-lang="ua">UA</button>
        <button data-lang="en">EN</button>
        <button data-lang="fr">FR</button>
        <button data-lang="it">IT</button>
      </div>
    </div>
  `;
}

export function bindLanguageSwitcher(onChange) {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setCurrentLanguage(lang);
      if (typeof onChange === "function") {
        onChange(lang);
      } else {
        location.reload();
      }
    });
  });
}
