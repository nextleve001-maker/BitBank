// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import { apiAddHistory } from "./api.js";

// =====================
// GET PLAYER
// =====================
export function getPlayer(){
  return AppState.player;
}

// =====================
// BALANCE
// =====================
export function addBalance(amount){

  const p = getPlayer();

  p.balance += amount;
  p.total_earned += amount;

  updatePlayer({
    balance:p.balance,
    total_earned:p.total_earned
  });

  apiAddHistory(p.username, "Earn", amount);
}

export function removeBalance(amount){

  const p = getPlayer();

  if(p.balance < amount){
    return false;
  }

  p.balance -= amount;

  updatePlayer({
    balance:p.balance
  });

  apiAddHistory(p.username, "Spend", -amount);

  return true;
}

// =====================
// USD
// =====================
export function addUSD(amount){

  const p = getPlayer();

  p.usd += amount;

  updatePlayer({
    usd:p.usd
  });
}

export function removeUSD(amount){

  const p = getPlayer();

  if(p.usd < amount) return false;

  p.usd -= amount;

  updatePlayer({
    usd:p.usd
  });

  return true;
}

// =====================
// CLICK SYSTEM
// =====================
export function getClickValue(){

  const p = getPlayer();

  let base = 5;

  if(p.status === "basic") base = 15;
  if(p.status === "medium") base = 50;
  if(p.status === "vip") base = 200;

  return base;
}

export function handleClick(){

  const reward = getClickValue();

  addBalance(reward);
}

// =====================
// PASSIVE INCOME
// =====================
export function calcPassiveIncome(){

  const p = getPlayer();

  let total = 0;

  (p.businesses || []).forEach(id=>{
    total += 10 * id; // приклад
  });

  return total;
}

export function passiveTick(){

  const p = getPlayer();

  const income = calcPassiveIncome() / 60;

  p.balance += income;
  p.total_earned += income;

  updatePlayer({
    balance:p.balance,
    total_earned:p.total_earned
  });
}

// =====================
// INVENTORY
// =====================
export function addItem(item){

  const p = getPlayer();

  if(!p.inventory){
    p.inventory = [];
  }

  p.inventory.push(item);

  updatePlayer({
    inventory:p.inventory
  });
}

export function removeItem(index){

  const p = getPlayer();

  if(!p.inventory) return;

  p.inventory.splice(index,1);

  updatePlayer({
    inventory:p.inventory
  });
}

export function getInventory(){
  return getPlayer().inventory || [];
}

// =====================
// FRIENDS
// =====================
export function addFriend(id){

  const p = getPlayer();

  if(!p.friends){
    p.friends = [];
  }

  if(!p.friends.includes(id)){
    p.friends.push(id);

    updatePlayer({
      friends:p.friends
    });
  }
}

// =====================
// STATUS / CLASS
// =====================
export function setStatus(status){

  const p = getPlayer();

  p.status = status;

  updatePlayer({
    status
  });
}

// =====================
// LAST SEEN
// =====================
export function updateLastSeen(){

  const p = getPlayer();

  p.last_seen = new Date().toISOString();

  updatePlayer({
    last_seen:p.last_seen
  });
}

// =====================
// FULL SAVE
// =====================
export function saveFullPlayer(){

  const p = getPlayer();

  updatePlayer(p);
}
