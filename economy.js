// =====================
// IMPORTS
// =====================
import { AppState, updatePlayer } from "./app.js";
import { addBalance, removeBalance } from "./player.js";
import { apiAddHistory } from "./api.js";

// =====================
// BUSINESS DATA (25)
// =====================
export const BUSINESSES = [
{id:1,name:"Lemonade Stand",price:100,income:1},
{id:2,name:"Coffee Shop",price:500,income:5},
{id:3,name:"Car Wash",price:1500,income:15},
{id:4,name:"Restaurant",price:5000,income:50},
{id:5,name:"Hotel",price:20000,income:200},
{id:6,name:"Factory",price:50000,income:500},
{id:7,name:"Tech Startup",price:100000,income:1000},
{id:8,name:"Bank",price:300000,income:3000},
{id:9,name:"Airline",price:1000000,income:10000},
{id:10,name:"Oil Company",price:5000000,income:50000},

{id:11,name:"AI Lab",price:10000000,income:100000},
{id:12,name:"Space Company",price:30000000,income:300000},
{id:13,name:"Mars Mining",price:50000000,income:500000},
{id:14,name:"Quantum Corp",price:100000000,income:1000000},
{id:15,name:"Time Tech",price:200000000,income:2000000},

{id:16,name:"Galaxy Trade",price:500000000,income:5000000},
{id:17,name:"Universe Bank",price:1000000000,income:10000000},
{id:18,name:"Multiverse Corp",price:2000000000,income:20000000},
{id:19,name:"God Industry",price:5000000000,income:50000000},
{id:20,name:"Infinity Group",price:10000000000,income:100000000},

{id:21,name:"Hyper Corp",price:20000000000,income:200000000},
{id:22,name:"Nano Systems",price:50000000000,income:500000000},
{id:23,name:"Omega Labs",price:100000000000,income:1000000000},
{id:24,name:"Eternal Corp",price:200000000000,income:2000000000},
{id:25,name:"Final Entity",price:500000000000,income:5000000000}
];

// =====================
// GET PLAYER
// =====================
function getPlayer(){
  return AppState.player;
}

// =====================
// BUY BUSINESS
// =====================
export function buyBusiness(id){

  const p = getPlayer();
  const b = BUSINESSES.find(x=>x.id===id);

  if(!b) return;

  if(!removeBalance(b.price)){
    alert("Not enough money");
    return;
  }

  if(!p.businesses) p.businesses = [];

  p.businesses.push(id);

  updatePlayer({
    businesses:p.businesses
  });

  apiAddHistory(p.username, "Buy business", -b.price);
}

// =====================
// BUSINESS INCOME
// =====================
export function calcBusinessIncome(){

  const p = getPlayer();

  let total = 0;

  (p.businesses || []).forEach(id=>{
    const b = BUSINESSES.find(x=>x.id===id);
    if(b) total += b.income;
  });

  return total;
}

// =====================
// UPGRADE SYSTEM
// =====================
export function upgradeBusiness(id){

  const p = getPlayer();

  if(!p.business_levels){
    p.business_levels = {};
  }

  const level = p.business_levels[id] || 1;

  const cost = level * 1000;

  if(!removeBalance(cost)){
    return alert("no money");
  }

  p.business_levels[id] = level + 1;

  updatePlayer({
    business_levels:p.business_levels
  });
}

// =====================
// PASSIVE TOTAL
// =====================
export function calcTotalPassive(){

  const base = calcBusinessIncome();

  return base;
}

// =====================
// TICK
// =====================
export function passiveIncomeTick(){

  const p = getPlayer();

  const income = calcTotalPassive() / 60;

  p.balance += income;
  p.total_earned += income;

  updatePlayer({
    balance:p.balance,
    total_earned:p.total_earned
  });
}

// =====================
// SELL BUSINESS
// =====================
export function sellBusiness(index){

  const p = getPlayer();

  const id = p.businesses[index];

  const b = BUSINESSES.find(x=>x.id===id);

  if(!b) return;

  const refund = b.price * 0.5;

  p.businesses.splice(index,1);

  addBalance(refund);

  updatePlayer({
    businesses:p.businesses
  });
}

// =====================
// BUSINESS VALUE
// =====================
export function getBusinessValue(){

  const p = getPlayer();

  let total = 0;

  (p.businesses || []).forEach(id=>{
    const b = BUSINESSES.find(x=>x.id===id);
    if(b) total += b.price;
  });

  return total;
}

// =====================
// RESET BUSINESSES
// =====================
export function resetBusinesses(){

  const p = getPlayer();

  p.businesses = [];
  p.business_levels = {};

  updatePlayer({
    businesses:[],
    business_levels:{}
  });
}
