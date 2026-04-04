import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// ERROR HELPER
// =====================
function showApiError(scope, error) {
  console.error(`${scope} error:`, error);

  const message =
    error?.message ||
    error?.details ||
    error?.hint ||
    JSON.stringify(error);

  alert(`${scope}: ${message}`);
}

// =====================
// PLAYERS
// =====================
export async function apiGetPlayer(username) {
  const { data, error } = await supabaseClient
    .from("players")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    showApiError("apiGetPlayer", error);
    return null;
  }

  return data;
}

export async function apiCreatePlayer(player) {
  const { data, error } = await supabaseClient
    .from("players")
    .insert([player])
    .select()
    .single();

  if (error) {
    showApiError("apiCreatePlayer", error);
    return null;
  }

  return data;
}

export async function apiUpdatePlayer(username, patch) {
  const { error } = await supabaseClient
    .from("players")
    .update(patch)
    .eq("username", username);

  if (error) {
    showApiError("apiUpdatePlayer", error);
    return false;
  }

  return true;
}

export async function apiDeletePlayer(username) {
  const { error } = await supabaseClient
    .from("players")
    .delete()
    .eq("username", username);

  if (error) {
    showApiError("apiDeletePlayer", error);
    return false;
  }

  return true;
}

export async function apiGetAllPlayers() {
  const { data, error } = await supabaseClient
    .from("players")
    .select("*");

  if (error) {
    showApiError("apiGetAllPlayers", error);
    return [];
  }

  return data || [];
}

// =====================
// PRESENCE
// =====================
export async function apiUpdatePresence(username, device) {
  const { error } = await supabaseClient
    .from("players")
    .update({
      last_seen: new Date().toISOString(),
      device
    })
    .eq("username", username);

  if (error) {
    showApiError("apiUpdatePresence", error);
    return false;
  }

  return true;
}

// =====================
// GAME STATE
// =====================
export async function apiGetGameState() {
  const { data, error } = await supabaseClient
    .from("game_state")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    showApiError("apiGetGameState", error);
    return null;
  }

  return data;
}

export async function apiUpdateGameState(patch) {
  const payload = {
    id: 1,
    ...patch
  };

  const { error } = await supabaseClient
    .from("game_state")
    .upsert(payload);

  if (error) {
    showApiError("apiUpdateGameState", error);
    return false;
  }

  return true;
}

// =====================
// HISTORY
// =====================
export async function apiAddHistory(username, text, amount) {
  const { error } = await supabaseClient
    .from("history")
    .insert([
      {
        username,
        text,
        amount,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) {
    showApiError("apiAddHistory", error);
    return false;
  }

  return true;
}

export async function apiGetHistory(username) {
  const { data, error } = await supabaseClient
    .from("history")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    showApiError("apiGetHistory", error);
    return [];
  }

  return data || [];
}

// =====================
// CASINO LOGS
// =====================
export async function apiLogCasino(username, game, bet, result) {
  const { error } = await supabaseClient
    .from("casino_logs")
    .insert([
      {
        username,
        game,
        bet,
        result,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) {
    showApiError("apiLogCasino", error);
    return false;
  }

  return true;
}

export async function apiGetCasinoLogs(username) {
  const { data, error } = await supabaseClient
    .from("casino_logs")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    showApiError("apiGetCasinoLogs", error);
    return [];
  }

  return data || [];
}

// =====================
// BATTLES
// =====================
export async function apiCreateBattle(payload) {
  const { data, error } = await supabaseClient
    .from("tap_battles")
    .insert([payload])
    .select()
    .single();

  if (error) {
    showApiError("apiCreateBattle", error);
    return null;
  }

  return data;
}

export async function apiGetBattles() {
  const { data, error } = await supabaseClient
    .from("tap_battles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    showApiError("apiGetBattles", error);
    return [];
  }

  return data || [];
}

export async function apiUpdateBattle(id, patch) {
  const { error } = await supabaseClient
    .from("tap_battles")
    .update(patch)
    .eq("id", id);

  if (error) {
    showApiError("apiUpdateBattle", error);
    return false;
  }

  return true;
}

// =====================
// ADMIN
// =====================
export async function apiBanUser(username) {
  return await apiUpdatePlayer(username, { banned: true });
}

export async function apiUnbanUser(username) {
  return await apiUpdatePlayer(username, { banned: false });
}
