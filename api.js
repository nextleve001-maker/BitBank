import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// PLAYERS
// =====================
export async function apiGetPlayer(username){
  const { data, error } = await supabaseClient
    .from("players")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if(error){
    console.error("apiGetPlayer error:", error);
    return null;
  }

  return data;
}

export async function apiCreatePlayer(player){
  const { data, error } = await supabaseClient
    .from("players")
    .insert([player])
    .select()
    .single();

  if(error){
    console.error("apiCreatePlayer error:", error);
    return null;
  }

  return data;
}

export async function apiUpdatePlayer(username, patch){
  const { error } = await supabaseClient
    .from("players")
    .update(patch)
    .eq("username", username);

  if(error){
    console.error("apiUpdatePlayer error:", error);
  }
}

export async function apiDeletePlayer(username){
  const { error } = await supabaseClient
    .from("players")
    .delete()
    .eq("username", username);

  if(error){
    console.error("apiDeletePlayer error:", error);
  }
}

export async function apiGetAllPlayers(){
  const { data, error } = await supabaseClient
    .from("players")
    .select("*");

  if(error){
    console.error("apiGetAllPlayers error:", error);
    return [];
  }

  return data || [];
}

// =====================
// PRESENCE
// =====================
export async function apiUpdatePresence(username, device){
  const { error } = await supabaseClient
    .from("players")
    .update({
      last_seen: new Date().toISOString(),
      device
    })
    .eq("username", username);

  if(error){
    console.error("apiUpdatePresence error:", error);
  }
}

// =====================
// GAME STATE
// =====================
export async function apiGetGameState(){
  const { data, error } = await supabaseClient
    .from("game_state")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if(error){
    console.error("apiGetGameState error:", error);
    return null;
  }

  return data;
}

export async function apiUpdateGameState(patch){
  const payload = {
    id: 1,
    ...patch
  };

  const { error } = await supabaseClient
    .from("game_state")
    .upsert(payload);

  if(error){
    console.error("apiUpdateGameState error:", error);
  }
}

// =====================
// HISTORY
// тут поле text, не action
// =====================
export async function apiAddHistory(username, text, amount){
  const { error } = await supabaseClient
    .from("history")
    .insert([{
      username,
      text,
      amount
    }]);

  if(error){
    console.error("apiAddHistory error:", error);
  }
}

export async function apiGetHistory(username){
  const { data, error } = await supabaseClient
    .from("history")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false })
    .limit(100);

  if(error){
    console.error("apiGetHistory error:", error);
    return [];
  }

  return data || [];
}

// =====================
// CASINO LOGS
// =====================
export async function apiLogCasino(username, game, bet, result){
  const { error } = await supabaseClient
    .from("casino_logs")
    .insert([{
      username,
      game,
      bet,
      result
    }]);

  if(error){
    console.error("apiLogCasino error:", error);
  }
}

export async function apiGetCasinoLogs(username){
  const { data, error } = await supabaseClient
    .from("casino_logs")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false })
    .limit(20);

  if(error){
    console.error("apiGetCasinoLogs error:", error);
    return [];
  }

  return data || [];
}

// =====================
// TAP BATTLES
// у тебе таблиця tap_battles, не battles
// =====================
export async function apiCreateBattle(payload){
  const { data, error } = await supabaseClient
    .from("tap_battles")
    .insert([payload])
    .select()
    .single();

  if(error){
    console.error("apiCreateBattle error:", error);
    return null;
  }

  return data;
}

export async function apiGetBattles(){
  const { data, error } = await supabaseClient
    .from("tap_battles")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error("apiGetBattles error:", error);
    return [];
  }

  return data || [];
}

export async function apiUpdateBattle(id, patch){
  const { error } = await supabaseClient
    .from("tap_battles")
    .update(patch)
    .eq("id", id);

  if(error){
    console.error("apiUpdateBattle error:", error);
  }
}

// =====================
// ADMIN
// =====================
export async function apiBanUser(username){
  await apiUpdatePlayer(username, { banned: true });
}

export async function apiUnbanUser(username){
  await apiUpdatePlayer(username, { banned: false });
}
