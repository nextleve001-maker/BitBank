// =====================
// SUPABASE SETUP
// =====================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://dznxdbiorjargerkilwf.supabase.co";
const SUPABASE_KEY = "sb_publishable_9eL4kseNCXHF3d7MFAyj3A_iB8pjYfv";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// PLAYERS
// =====================
export async function apiGetPlayer(username){
  const { data } = await supabaseClient
    .from("players")
    .select("*")
    .eq("username", username)
    .single();

  return data;
}

export async function apiCreatePlayer(player){
  const { data } = await supabaseClient
    .from("players")
    .insert([player]);

  return data;
}

export async function apiUpdatePlayer(username, patch){
  await supabaseClient
    .from("players")
    .update(patch)
    .eq("username", username);
}

export async function apiDeletePlayer(username){
  await supabaseClient
    .from("players")
    .delete()
    .eq("username", username);
}

export async function apiGetAllPlayers(){
  const { data } = await supabaseClient
    .from("players")
    .select("*");

  return data || [];
}

// =====================
// ONLINE / PRESENCE
// =====================
export async function apiUpdatePresence(username, device){
  await supabaseClient
    .from("players")
    .update({
      last_seen: new Date().toISOString(),
      device
    })
    .eq("username", username);
}

// =====================
// GAME STATE
// =====================
export async function apiGetGameState(){
  const { data } = await supabaseClient
    .from("game_state")
    .select("*")
    .limit(1)
    .single();

  return data;
}

export async function apiUpdateGameState(patch){
  await supabaseClient
    .from("game_state")
    .update(patch)
    .eq("id", 1);
}

// =====================
// HISTORY
// =====================
export async function apiAddHistory(username, action, amount){
  await supabaseClient
    .from("history")
    .insert([{
      username,
      action,
      amount,
      created_at: new Date().toISOString()
    }]);
}

// =====================
// CASINO LOG
// =====================
export async function apiLogCasino(username, game, bet, result){
  await supabaseClient
    .from("casino_logs")
    .insert([{
      username,
      game,
      bet,
      result,
      created_at: new Date().toISOString()
    }]);
}

// =====================
// BATTLES
// =====================
export async function apiCreateBattle(battle){
  const { data } = await supabaseClient
    .from("battles")
    .insert([battle])
    .select()
    .single();

  return data;
}

export async function apiGetBattles(){
  const { data } = await supabaseClient
    .from("battles")
    .select("*");

  return data || [];
}

export async function apiUpdateBattle(id, patch){
  await supabaseClient
    .from("battles")
    .update(patch)
    .eq("id", id);
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
