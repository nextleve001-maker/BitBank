// =====================
// SUPABASE INIT
// =====================
import { AppState } from "./app.js";

const SUPABASE_URL = "YOUR_URL";
const SUPABASE_KEY = "YOUR_KEY";

export const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =====================
// GENERIC REQUESTS
// =====================
async function fetchOne(table, query){

  const {data, error} = await supabaseClient
    .from(table)
    .select("*")
    .match(query)
    .single();

  if(error){
    console.error("fetchOne error:", error);
    return null;
  }

  return data;
}

async function fetchMany(table){

  const {data, error} = await supabaseClient
    .from(table)
    .select("*");

  if(error){
    console.error("fetchMany error:", error);
    return [];
  }

  return data;
}

async function insertRow(table, payload){

  const {data, error} = await supabaseClient
    .from(table)
    .insert(payload)
    .select()
    .single();

  if(error){
    console.error("insert error:", error);
    return null;
  }

  return data;
}

async function updateRow(table, query, patch){

  const {error} = await supabaseClient
    .from(table)
    .update(patch)
    .match(query);

  if(error){
    console.error("update error:", error);
  }
}

async function deleteRow(table, query){

  const {error} = await supabaseClient
    .from(table)
    .delete()
    .match(query);

  if(error){
    console.error("delete error:", error);
  }
}

// =====================
// PLAYER API
// =====================
export async function apiGetPlayer(username){
  return await fetchOne("players", {username});
}

export async function apiGetAllPlayers(){
  return await fetchMany("players");
}

export async function apiUpdatePlayer(username, patch){
  await updateRow("players", {username}, patch);
}

export async function apiCreatePlayer(data){
  return await insertRow("players", data);
}

export async function apiDeletePlayer(username){
  await deleteRow("players", {username});
}

// =====================
// GAME STATE API
// =====================
export async function apiGetGameState(){
  return await fetchOne("game_state", {id:1});
}

export async function apiUpdateGameState(patch){
  await updateRow("game_state", {id:1}, patch);
}

// =====================
// HISTORY API
// =====================
export async function apiAddHistory(username, text, amount){

  return await insertRow("history", {
    username,
    text,
    amount,
    created_at: new Date().toISOString()
  });
}

export async function apiGetHistory(username){

  const {data, error} = await supabaseClient
    .from("history")
    .select("*")
    .eq("username", username)
    .order("created_at", {ascending:false})
    .limit(50);

  if(error){
    console.error(error);
    return [];
  }

  return data;
}

// =====================
// CASINO API
// =====================
export async function apiLogCasino(username, game, bet, result){

  await insertRow("casino_logs", {
    username,
    game,
    bet,
    result,
    created_at: new Date().toISOString()
  });
}

// =====================
// BATTLE API
// =====================
export async function apiCreateBattle(payload){
  return await insertRow("tap_battles", payload);
}

export async function apiUpdateBattle(id, patch){
  await updateRow("tap_battles", {id}, patch);
}

export async function apiGetBattles(){

  const {data} = await supabaseClient
    .from("tap_battles")
    .select("*");

  return data || [];
}

// =====================
// MARKET API
// =====================
export async function apiSaveMarket(data){
  await updateRow("game_state", {id:1}, {market:data});
}

// =====================
// FRIENDS API
// =====================
export async function apiUpdateFriends(username, friends){
  await updateRow("players", {username}, {friends});
}

// =====================
// ADMIN API
// =====================
export async function apiBanUser(username){
  await updateRow("players", {username}, {banned:true});
}

export async function apiUnbanUser(username){
  await updateRow("players", {username}, {banned:false});
}

export async function apiSetBalance(username, balance){
  await updateRow("players", {username}, {balance});
}

// =====================
// BULK OPERATIONS
// =====================
export async function apiMassUpdatePlayers(players){

  for(const p of players){
    await updateRow("players", {username:p.username}, p);
  }
}

// =====================
// PRESENCE
// =====================
export async function apiUpdatePresence(username, device){

  await updateRow("players", {username}, {
    last_seen:new Date().toISOString(),
    device
  });
}
