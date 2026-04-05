import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ======================================================
// SUPABASE CONFIG
// ======================================================
const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================================================
// TABLE NAMES
// ======================================================
const PLAYERS_TABLE = "players";
const HISTORY_TABLE = "history";
const CASINO_LOGS_TABLE = "casino_logs";

// ======================================================
// HELPERS
// ======================================================
function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function numberValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizePlayerRow(row) {
  if (!row) return null;

  const player = { ...row };

  if (!Array.isArray(player.titles)) player.titles = [];
  if (!Array.isArray(player.inventory)) player.inventory = [];
  if (!Array.isArray(player.friends)) player.friends = [];
  if (!Array.isArray(player.cars)) player.cars = [];
  if (!Array.isArray(player.realty)) player.realty = [];
  if (!Array.isArray(player.card_themes_owned)) player.card_themes_owned = ["classic_blue"];

  if (!player.crypto || typeof player.crypto !== "object" || Array.isArray(player.crypto)) player.crypto = {};
  if (!player.stocks || typeof player.stocks !== "object" || Array.isArray(player.stocks)) player.stocks = {};
  if (!player.business_projects || typeof player.business_projects !== "object" || Array.isArray(player.business_projects)) {
    player.business_projects = {};
  }

  if (!player.finances || typeof player.finances !== "object" || Array.isArray(player.finances)) {
    player.finances = {};
  }

  if (!player.loot_profile || typeof player.loot_profile !== "object" || Array.isArray(player.loot_profile)) {
    player.loot_profile = {};
  }

  if (!player.casino_profile || typeof player.casino_profile !== "object" || Array.isArray(player.casino_profile)) {
    player.casino_profile = {};
  }

  if (!player.role_stats || typeof player.role_stats !== "object" || Array.isArray(player.role_stats)) {
    player.role_stats = {};
  }

  if (!player.friends_meta || typeof player.friends_meta !== "object" || Array.isArray(player.friends_meta)) {
    player.friends_meta = {};
  }

  if (!player.collections_state || typeof player.collections_state !== "object" || Array.isArray(player.collections_state)) {
    player.collections_state = {};
  }

  if (!player.history_meta || typeof player.history_meta !== "object" || Array.isArray(player.history_meta)) {
    player.history_meta = {};
  }

  if (!player.transfer_profile || typeof player.transfer_profile !== "object" || Array.isArray(player.transfer_profile)) {
    player.transfer_profile = {};
  }

  if (!player.card_settings || typeof player.card_settings !== "object" || Array.isArray(player.card_settings)) {
    player.card_settings = {};
  }

  if (!player.card_cosmetics || typeof player.card_cosmetics !== "object" || Array.isArray(player.card_cosmetics)) {
    player.card_cosmetics = {};
  }

  if (!player.battle_profile || typeof player.battle_profile !== "object" || Array.isArray(player.battle_profile)) {
    player.battle_profile = {};
  }

  if (!player.class) player.class = "none";
  if (!player.role) player.role = "none";
  if (!player.card_theme) player.card_theme = "classic_blue";

  player.balance = numberValue(player.balance);
  player.usd = numberValue(player.usd);
  player.total_earned = numberValue(player.total_earned);
  player.clicks = numberValue(player.clicks);

  return player;
}

function stripUndefined(obj) {
  const out = {};
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] !== undefined) {
      out[key] = obj[key];
    }
  });
  return out;
}

function consoleApiError(label, error) {
  if (!error) return;
  console.error(`${label}:`, error);
}

// ======================================================
// PLAYERS
// ======================================================
export async function apiGetAllPlayers() {
  const { data, error } = await supabaseClient
    .from(PLAYERS_TABLE)
    .select("*")
    .order("balance", { ascending: false });

  if (error) {
    consoleApiError("apiGetAllPlayers error", error);
    return [];
  }

  return safeArray(data).map(normalizePlayerRow);
}

export async function apiGetPlayer(username) {
  const name = String(username || "").trim();
  if (!name) return null;

  const { data, error } = await supabaseClient
    .from(PLAYERS_TABLE)
    .select("*")
    .eq("username", name)
    .maybeSingle();

  if (error) {
    consoleApiError("apiGetPlayer error", error);
    return null;
  }

  return normalizePlayerRow(data);
}

export async function apiCreatePlayer(payload) {
  const clean = stripUndefined(payload || {});
  clean.created_at = clean.created_at || nowIso();
  clean.updated_at = nowIso();

  const { data, error } = await supabaseClient
    .from(PLAYERS_TABLE)
    .insert(clean)
    .select()
    .single();

  if (error) {
    consoleApiError("apiCreatePlayer error", error);
    return null;
  }

  return normalizePlayerRow(data);
}

export async function apiUpdatePlayer(username, patch) {
  const name = String(username || "").trim();
  if (!name) return null;

  const cleanPatch = stripUndefined({
    ...(patch || {}),
    updated_at: nowIso()
  });

  const { data, error } = await supabaseClient
    .from(PLAYERS_TABLE)
    .update(cleanPatch)
    .eq("username", name)
    .select()
    .single();

  if (error) {
    consoleApiError("apiUpdatePlayer error", error);
    return null;
  }

  return normalizePlayerRow(data);
}

export async function apiDeletePlayer(username) {
  const name = String(username || "").trim();
  if (!name) return false;

  const { error } = await supabaseClient
    .from(PLAYERS_TABLE)
    .delete()
    .eq("username", name);

  if (error) {
    consoleApiError("apiDeletePlayer error", error);
    return false;
  }

  return true;
}

export async function apiEnsureAdminExists(adminPayload) {
  const existing = await apiGetPlayer(adminPayload.username);
  if (existing) return existing;
  return await apiCreatePlayer(adminPayload);
}

export async function apiUpdatePresence(username, device = "desktop") {
  const player = await apiGetPlayer(username);
  if (!player) return null;

  return await apiUpdatePlayer(username, {
    last_seen: nowIso(),
    device
  });
}

// ======================================================
// HISTORY
// ======================================================
export async function apiAddHistory(username, text, amount = 0) {
  const name = String(username || "").trim();
  if (!name) return null;

  const payload = {
    username: name,
    text: String(text || ""),
    amount: numberValue(amount),
    created_at: nowIso()
  };

  const { data, error } = await supabaseClient
    .from(HISTORY_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    consoleApiError("apiAddHistory error", error);
    return null;
  }

  return data;
}

export async function apiGetHistory(username, limit = 300) {
  const name = String(username || "").trim();
  if (!name) return [];

  const { data, error } = await supabaseClient
    .from(HISTORY_TABLE)
    .select("*")
    .eq("username", name)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    consoleApiError("apiGetHistory error", error);
    return [];
  }

  return safeArray(data);
}

// ======================================================
// CASINO LOGS
// ======================================================
export async function apiLogCasino(username, game, bet, delta) {
  const payload = {
    username: String(username || "").trim(),
    game: String(game || ""),
    bet: numberValue(bet),
    delta: numberValue(delta),
    created_at: nowIso()
  };

  const { data, error } = await supabaseClient
    .from(CASINO_LOGS_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    consoleApiError("apiLogCasino error", error);
    return null;
  }

  return data;
}

// ======================================================
// GAME STATE
// ======================================================
export async function apiGetGameState() {
  return {
    global_message: "Welcome to BitBank",
    fetched_at: nowIso()
  };
}
