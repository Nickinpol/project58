const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const todayKey = () => new Date().toISOString().slice(0,10);
const defaultState = {
  // Generic, editable starter targets. Personal values live only in this device's local storage.
  targets:{calories:2000,protein:75,water:2.0},
  weight:[],
  food:{},
  water:{},
  habits:{},
  workouts:{},
  cookDay:"today"
};
let state;
try { state = {...defaultState,...JSON.parse(localStorage.getItem("p58-state")||"{}")}; } catch { state={...defaultState}; }
state.targets={...defaultState.targets,...(state.targets||{})};
state.weight=state.weight||defaultState.weight; state.food=state.food||{}; state.water=state.water||{}; state.habits=state.habits||{}; state.workouts=state.workouts||{};
function save(){localStorage.setItem("p58-state",JSON.stringify(state));renderAll()}
function dayFood(){return state.food[todayKey()]||[]}
function totals(){return dayFood().reduce((a,x)=>({k:a.k+x.kcal,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f}),{k:0,p:0,c:0,f:0})}
function waterMl(){return state.water[todayKey()]||0}
function dateKeyOffset(offset){const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)}
function totalsFor(date){return (state.food[date]||[]).reduce((a,x)=>({k:a.k+x.kcal,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f}),{k:0,p:0,c:0,f:0})}
function shortDate(date){return new Date(date+"T12:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric"})}
function latestWeight(){return state.weight.length?state.weight[state.weight.length-1].value:null}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
const workouts=[
 {day:"Monday",name:"Chest · Shoulders · Triceps",type:"UPPER PUSH",items:[["Push-ups","3 × 8–15"],["Dumbbell floor press","3 × 8–12"],["Dumbbell shoulder press","3 × 8–12"],["Dumbbell lateral raise","3 × 12–20"],["Overhead triceps extension","2 × 10–15"]]},
 {day:"Tuesday",name:"Back · Biceps",type:"UPPER PULL",items:[["One-arm dumbbell row","3 × 8–12 / side"],["Resistance-band pulldown","3 × 10–15"],["Dumbbell reverse fly","2 × 12–15"],["Dumbbell curl","3 × 8–12"],["Hammer curl","2 × 10–15"]]},
 {day:"Wednesday",name:"Legs · Core",type:"LOWER",items:[["Goblet squat","3 × 8–12"],["Dumbbell Romanian deadlift","3 × 8–12"],["Reverse lunge","2 × 8–10 / leg"],["Standing calf raise","3 × 12–20"],["Plank","3 × 30–60 sec"]]},
 {day:"Thursday",name:"Recovery",type:"REST DAY",items:[["Easy walk","15–30 min"],["Gentle mobility","5–10 min"],["Prioritise food and sleep","Recover well"]]},
 {day:"Friday",name:"Upper body",type:"UPPER",items:[["Dumbbell floor press","3 × 8–12"],["One-arm dumbbell row","3 × 8–12 / side"],["Dumbbell lateral raise","3 × 12–20"],["Push-ups","2 × near-comfortable max"],["Dumbbell curl","2 × 10–15"],["Triceps extension","2 × 10–15"]]},
 {day:"Saturday",name:"Legs · Arms",type:"LOWER + ARMS",items:[["Goblet squat","3 × 10–12"],["Dumbbell Romanian deadlift","3 × 10–12"],["Split squat","2 × 8–10 / leg"],["Hammer curl","3 × 10–15"],["Close-grip push-up","2 × 6–12"]]},
 {day:"Sunday",name:"Full rest",type:"RESET",items:[["Rest and meal prep","Set up the week ahead"]]}
];
const quickFoods=[
 {name:"Banana + milk shake",kcal:260,p:10,c:42,f:6,meal:"Breakfast"},
 {name:"Oats, milk & peanut butter",kcal:430,p:17,c:55,f:16,meal:"Breakfast"},
 {name:"2 eggs + 2 roti",kcal:390,p:20,c:42,f:15,meal:"Breakfast"},
 {name:"Paneer bhurji + 2 roti",kcal:560,p:27,c:55,f:24,meal:"Lunch"},
 {name:"Chicken curry + rice",kcal:590,p:38,c:65,f:16,meal:"Lunch"},
 {name:"Curd + roasted chana",kcal:230,p:13,c:28,f:7,meal:"Snack"},
 {name:"Dal + 2 roti + sabzi",kcal:520,p:20,c:78,f:13,meal:"Dinner"},
 {name:"Peanut butter toast",kcal:300,p:11,c:32,f:15,meal:"Snack"}
];
const mealIdeas=[
 ["Breakfast","Banana-oats shake","Oats 50g, milk 250ml, banana 1 medium, peanut butter 10g. Blend until smooth.","~450 kcal · ~17g protein"],
 ["Lunch","Chicken, rice & veg","Chicken 120g raw, rice 75g dry, mixed vegetables 150g, curd 100g, oil 5g. Cook chicken thoroughly.","~650 kcal · ~42g protein"],
 ["Snack","Curd & roasted chana","Plain curd 200g with roasted chana 30g and one seasonal fruit.","~300 kcal · ~15g protein"],
 ["Dinner","Paneer bhurji & roti","Paneer 100g, 2 medium rotis (60g atta total), tomato/onion, vegetables and 5g oil.","~600 kcal · ~27g protein"],
 ["Optional","Milk","Milk 200ml if hungry or short on calories/protein.","~125 kcal · ~7g protein"]
];
const weekIdeas=[
 ["Monday","Oats-banana shake","Chicken rice bowl","Dal, roti & seasonal sabzi"],
 ["Tuesday","Egg bhurji + roti","Rajma rice + curd","Paneer bhurji + roti"],
 ["Wednesday","Curd, oats & apple bowl","Chicken curry + rice","Moong dal khichdi + curd"],
 ["Thursday","Peanut-banana milk shake","Chole + rice + salad","Egg curry + roti"],
 ["Friday","Paneer sandwich + milk","Dal, rice, sabzi","Chicken + roti + vegetables"],
 ["Saturday","Oats shake + boiled eggs","Paneer rice bowl","Dal + roti + seasonal sabzi"],
 ["Sunday","Aloo/paneer paratha + curd","Home-style chicken/rajma meal","Light khichdi + curd"]
];
function renderHome(){
 const t=totals(), target=state.targets;
 $("#caloriesValue").innerHTML=`${Math.round(t.k)} <small>/ ${target.calories.toLocaleString("en-IN")}</small>`;
 $("#proteinValue").innerHTML=`${Math.round(t.p)}g <small>/ ${target.protein}g</small>`;
 $("#waterValue").innerHTML=`${(waterMl()/1000).toFixed(2)} <small>/ ${target.water.toFixed(1)}L</small>`;
 const weight=latestWeight();
 $("#weightValue").innerHTML=weight===null?'— <small>kg</small>':weight.toFixed(1)+' <small>kg</small>';
 [["caloriesBar",t.k/target.calories],["proteinBar",t.p/target.protein],["waterBar",waterMl()/(target.water*1000)]].forEach(([id,v])=>$("#"+id).style.width=Math.min(100,v*100)+"%");
 $("#caloriesHint").textContent=`${Math.round(t.k/target.calories*100)}% of daily target`;
 $("#proteinHint").textContent=t.p>=target.protein?"Target reached — nice work.":"Build and recover";
 const day=new Date().getDay(), w=workouts[day===0?6:day-1];
 $("#todayWorkout").innerHTML=`<div><b>${w.name}</b><p>${w.items.slice(0,3).map(x=>x[0]).join(" · ")}${w.items.length>3?" + more":""}</p></div><span class="tag">${w.type}</span>`;
 $$(".checklist-card input").forEach(i=>i.checked=!!(state.habits[todayKey()]||{})[i.dataset.habit]);
}
function renderFood(){
 const t=totals(); $("#foodCalories").innerHTML=Math.round(t.k).toLocaleString("en-IN")+' <small>kcal</small>';$("#foodTargetHint").textContent='of '+state.targets.calories.toLocaleString("en-IN")+' kcal target';
 $("#foodProtein").textContent=`P ${Math.round(t.p)}g`;$("#foodCarbs").textContent=`C ${Math.round(t.c)}g`;$("#foodFat").textContent=`F ${Math.round(t.f)}g`;
 const groups=["Breakfast","Lunch","Snack","Dinner"];
 $("#mealList").innerHTML=groups.map(g=>{const items=dayFood().filter(x=>x.meal===g);const sum=items.reduce((a,x)=>a+x.kcal,0);return `<div class="meal-group"><div class="meal-group-head"><b>${g}</b><span>${Math.round(sum)} kcal</span></div>${items.length?items.map(x=>`<div class="food-entry"><div><b>${esc(x.name)}</b><small>${Math.round(x.p)}g protein · ${Math.round(x.c)}g carbs · ${Math.round(x.f)}g fat</small></div><strong>${Math.round(x.kcal)} kcal <button class="delete-food" data-delete="${x.id}" aria-label="Delete ${esc(x.name)}">×</button></strong></div>`).join(""):'<small class="muted">Nothing logged yet.</small>'}</div>`}).join("");
 $("#quickFoods").innerHTML=quickFoods.map((f,i)=>`<button class="quick-food" data-quick="${i}"><b>${f.name}</b><small>${f.kcal} kcal · ${f.p}g protein　＋</small></button>`).join("");
}
function renderTrain(){
 $("#workoutDays").innerHTML=workouts.map((w,i)=>`<article class="day-card ${i===new Date().getDay()-1?"open":""}"><div class="day-head" data-toggle="${i}"><div><b>${w.day} · ${w.name}</b><small>${w.items.length} movements · home-friendly</small></div><span class="day-label">${w.type}　⌄</span></div><div class="exercise-list">${w.items.map(x=>`<div class="exercise"><span>${x[0]}</span><span>${x[1]}</span></div>`).join("")}</div></article>`).join("");
}
function renderProgress(){
 const cur=latestWeight();
 $("#currentWeight").textContent=cur===null?"—":cur.toFixed(1);$("#weightTrendHint").textContent=cur===null?"Add a private check-in when you are ready.":"Your latest private check-in.";
 $("#weightHistory").innerHTML=state.weight.slice().reverse().slice(0,12).map(x=>`<div class="history-row"><span>${new Date(x.date+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span><span>${x.value.toFixed(1)} kg</span></div>`).join("")||'<p class="muted">No check-ins yet.</p>';
 $("#weeklySummary").innerHTML=[-6,-5,-4,-3,-2,-1,0].map(offset=>{const date=dateKeyOffset(offset),t=totalsFor(date),h=Object.values(state.habits[date]||{}).filter(Boolean).length,done=!!state.workouts[date];return '<article class="day-summary '+(offset===0?'today':'')+'"><div><b>'+shortDate(date)+'</b><small>'+Math.round(t.k)+' kcal · '+Math.round(t.p)+'g protein</small></div><div class="summary-badges"><span>'+((state.water[date]||0)/1000).toFixed(1)+'L</span><span>'+h+'/3 habits</span><span class="'+(done?'done':'')+'">'+(done?'Workout ✓':'Workout —')+'</span></div></article>'}).join("");
 $("#targetCalories").value=state.targets.calories;$("#targetProtein").value=state.targets.protein;$("#targetWater").value=state.targets.water;
}
function renderCook(){
 const todayMeals=mealIdeas.map(m=>`<div class="cook-meal"><b>${m[0]} · ${m[1]}</b><p>${m[2]}</p><span>${m[3]}</span></div>`).join("");
 const week=weekIdeas.map(d=>`<div class="cook-day"><h3>${d[0]}</h3><div class="cook-meal"><b>Breakfast</b><p>${d[1]}</p></div><div class="cook-meal"><b>Lunch</b><p>${d[2]}</p></div><div class="cook-meal"><b>Dinner</b><p>${d[3]}</p></div></div>`).join("");
 $("#cookContent").innerHTML=state.cookDay==="today"?'<div class="cook-day"><h3>Suggested day</h3>'+todayMeals+'</div>':week;
}
function renderWorkoutTracking(){const done=!!state.workouts[todayKey()];$("#workoutStatus").textContent=done?"Completed today":"Not logged yet";$("#completeWorkoutBtn").textContent=done?"✓ Workout completed":"Mark workout complete"}
function renderAll(){renderHome();renderWorkoutTracking();renderFood();renderTrain();renderProgress();renderCook()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(view){$$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));$$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$("#todayDate").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});
$$("[data-water]").forEach(b=>b.addEventListener("click",()=>{state.water[todayKey()]=waterMl()+Number(b.dataset.water);save();toast(`Added ${b.dataset.water} ml water`)}));
$$(".checklist-card input").forEach(i=>i.addEventListener("change",()=>{state.habits[todayKey()]={...(state.habits[todayKey()]||{}),[i.dataset.habit]:i.checked};save()}));
$("#addFoodBtn").addEventListener("click",()=>$("#foodDialog").showModal());
$("#foodForm").addEventListener("submit",e=>{e.preventDefault();const x={id:Date.now(),name:$("#foodName").value.trim(),kcal:+$("#foodKcal").value,p:+$("#foodP").value||0,c:+$("#foodC").value||0,f:+$("#foodF").value||0,meal:$("#foodMeal").value};state.food[todayKey()]=[...dayFood(),x];$("#foodDialog").close();e.target.reset();save();toast("Food added to your diary")});
$("#foodList");
$("#mealList").addEventListener("click",e=>{const b=e.target.closest("[data-delete]");if(!b)return;state.food[todayKey()]=dayFood().filter(x=>String(x.id)!==b.dataset.delete);save();toast("Entry removed")});
$("#quickFoods").addEventListener("click",e=>{const b=e.target.closest("[data-quick]");if(!b)return;const f=quickFoods[+b.dataset.quick];state.food[todayKey()]=[...dayFood(),{...f,id:Date.now()}];save();toast("Quick food added")});
$("#workoutDays").addEventListener("click",e=>{const h=e.target.closest("[data-toggle]");if(h)h.parentElement.classList.toggle("open")});
$("#completeWorkoutBtn").addEventListener("click",()=>{const key=todayKey();state.workouts[key]=!state.workouts[key];save();toast(state.workouts[key]?"Workout completed":"Workout marked incomplete")});
$("#weightForm").addEventListener("submit",e=>{e.preventDefault();const v=+$("#weightInput").value;if(v<30||v>150)return;state.weight.push({date:todayKey(),value:v});state.weight.sort((a,b)=>a.date.localeCompare(b.date));$("#weightInput").value="";save();toast("Weight check-in saved")});
$("#settingsForm").addEventListener("submit",e=>{e.preventDefault();state.targets={calories:+$("#targetCalories").value,protein:+$("#targetProtein").value,water:+$("#targetWater").value};save();toast("Targets updated")});
$$("[data-cookday]").forEach(b=>b.addEventListener("click",()=>{state.cookDay=b.dataset.cookday;$$("[data-cookday]").forEach(x=>x.classList.toggle("active",x===b));renderCook()}));
let installPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").hidden=false});
$("#installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").hidden=true});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js?v=2").catch(()=>{});
renderAll();
