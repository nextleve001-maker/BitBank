export const LANG = {
  ua: {
    profile: "Профіль",
    balance: "Баланс",
    click: "Клік",
    business: "Бізнес",
    crypto: "Крипто",
    stocks: "Акції",
    casino: "Казино",
    battle: "Битва"
  },
  en: {
    profile: "Profile",
    balance: "Balance",
    click: "Click",
    business: "Business",
    crypto: "Crypto",
    stocks: "Stocks",
    casino: "Casino",
    battle: "Battle"
  },
  fr: {
    profile: "Profil",
    balance: "Solde",
    click: "Cliquer",
    business: "Business",
    crypto: "Crypto",
    stocks: "Actions",
    casino: "Casino",
    battle: "Combat"
  },
  it: {
    profile: "Profilo",
    balance: "Saldo",
    click: "Click",
    business: "Business",
    crypto: "Crypto",
    stocks: "Azioni",
    casino: "Casino",
    battle: "Battaglia"
  }
};

export let currentLang = "ua";

export function t(key) {
  return LANG[currentLang][key] || key;
}

export function setLang(lang) {
  currentLang = lang;
  location.reload();
}
