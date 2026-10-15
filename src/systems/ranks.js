'use strict';
/* ---------------- growth backbone: growth points (GP), ranks, taste log, rank-up scene ---------------- */
let RU=null;                                   // the rank-up celebration in progress
function rankNum(){return G?G.rank:1;}
function rankAtLeast(n){return !!G&&G.rank>=n;}
function nextRank(){return G&&RANKS[G.rank]||null;}
function rankPointsMet(){const n=nextRank();return !!n&&G.gp>=n.gp;}
function rankGateOk(n){return !n.gate||!!n.gate();}
function rankFull(){const n=nextRank();return !!n&&G.gp>=n.gp&&!rankGateOk(n);}   // "FULL - ready to grow!"
function rankProgress(){const n=nextRank(),c=RANKS[G.rank-1];if(!n)return 1;return clamp((G.gp-c.gp)/(n.gp-c.gp),0,1);}
function stageOfRank(r){return r>=7?6:r-1;}

function gainGP(n,note){
  if(!G||!(n>0))return;
  G.gp+=n;
  if(P&&state!=='title')float(P.x,P.y-30,'+'+n+' GROWTH','#94dc64');
}
function questGP(id){gainGP((ORDER3.includes(id)||ORDER4.includes(id))?GP.quest3:ORDER2.includes(id)?GP.quest2:GP.quest1);}
function tasteFood(id){
  if(!G||G.taste[id])return;G.taste[id]=1;gainGP(GP.taste);
  if(wearing('chef'))gainGP(1);
  const f=FOODS.find(x=>x.id===id);toast('Tasted '+(f?f.name:id)+' for the first time! +'+GP.taste+' growth','#94dc64');
}
function secretFound(id){
  if(!G||G.secrets[id])return;G.secrets[id]=1;gainGP(GP.secret);
  const s=SECRET_IDS.find(x=>x.id===id);toast('Secret found: '+(s?s.name:id)+'! +'+GP.secret+' growth','#d890ff');
}
function minigameGP(key,win){
  if(!win||!G)return 0;
  if(!G.mgFirst[key]){G.mgFirst[key]=1;gainGP(GP.mgFirst);return GP.mgFirst;}
  const d=dayNum();if(G.mgDay.d!==d){G.mgDay={d,n:0};}
  if(G.mgDay.n<GP.mgPerDay){G.mgDay.n++;gainGP(GP.mgRepeat);return GP.mgRepeat;}
  return 0;
}
function grantOutfit(id){
  if(G.outfits.includes(id))return false;G.outfits.push(id);gainGP(GP.outfit);return true;
}

/* ---- rank-up ---- */
function reactorOnScreen(){
  for(const id of ['mom','penny','peep','cheep','tweet']){const e=ents.find(x=>x.id===id);if(e&&onCur(e))return e;}
  return null;
}
function checkRankUp(){
  if(RU||!G)return false;
  const n=nextRank();
  if(n&&G.gp>=n.gp&&rankGateOk(n)){startRankUp(n.n);return true;}
  return false;
}
function startRankUp(n,then){
  RU={t:0,from:G.rank,to:n,page:0,then:then||null,reactor:reactorOnScreen(),swapped:false};
  state='rankup';SFX.fanfare();P.moving=false;
}
function applyRank(n){
  G.rank=n;
  if(n>=7&&!G.accessoryUnlocked){G.accessoryUnlocked=true;
    // first time: accessories (bow, shades, ears, crown) move to the new slot
    if(G.wear&&ACCESSORY_IDS.includes(G.wear)){G.acc=G.wear;G.wear=null;}}
  G.hearts=maxHearts();
}
function updateRankUp(){
  const r=RU;r.t++;
  if(r.page===0){
    if(r.t===70){r.swapped=true;applyRank(r.to);SFX.lvl();}
    if(r.t%5===0)parts.push({x:P.x+(Math.random()-.5)*30,y:P.y-8-Math.random()*20,vx:(Math.random()-.5)*1.5,vy:-0.8-Math.random(),g:0.02,life:34,c:['#ffd83a','#fff8ec','#ff6fae','#a6e0ff'][(Math.random()*4)|0]});
    if(r.t>150&&pressed.a){SFX.menu();if(r.reactor&&RANKS[r.to-1].react){r.page=2;finishRankUp();return;}r.page=1;r.t=0;}
  }else{
    if(r.t>20&&pressed.a){finishRankUp();}
  }
  updateAmbient();
}
function finishRankUp(){
  const r=RU,def=RANKS[r.to-1];RU=null;state='play';save();
  if(r.page===2){say([{who:r.reactor,text:def.react}],r.then||undefined);return;}
  if(r.then)r.then();
  else if(!checkRankUp()){}
}
function drawRankUp(){
  const r=RU,def=RANKS[r.to-1];
  ctx.fillStyle='rgba(18,10,30,0.82)';ctx.fillRect(0,0,W,H);
  if(r.page===0){
    // starburst
    const cx=W/2,cy=104,n=16,rot=r.t/40;
    for(let i=0;i<n;i++){const a=rot+i*Math.PI*2/n,a2=a+Math.PI/n*0.8;
      ctx.fillStyle=i%2?'rgba(255,216,58,0.35)':'rgba(255,111,174,0.3)';
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*190,cy+Math.sin(a)*190);ctx.lineTo(cx+Math.cos(a2)*190,cy+Math.sin(a2)*190);ctx.fill();}
    const bannerY=20+Math.max(0,22-r.t)*2;
    box(40,bannerY,176,20,'#ffd83a','#21142b');txt('RANK UP!',W/2,bannerY+6,10,['#21142b','#e03838'][Math.floor(r.t/6)%2],{align:'center'});
    // morph: old sprite flickers, flash, new sprite
    const old=stageOfRank(r.from),nw=stageOfRank(r.to);
    if(r.t<70){if(r.t<40||Math.floor(r.t/3)%2)drawPip(old,0,Math.floor(r.t/12)%2,false,cx,150,3);
      if(r.t>40){ctx.globalAlpha=(r.t-40)/30*0.9;ctx.fillStyle='#fff';ctx.fillRect(cx-40,70,80,84);ctx.globalAlpha=1;}}
    else{const k=Math.min(1,(r.t-70)/20);drawPip(nw,0,Math.floor(r.t/12)%2,false,cx,150,3);
      if(k<1){ctx.globalAlpha=1-k;ctx.fillStyle='#fff';ctx.fillRect(cx-40,70,80,84);ctx.globalAlpha=1;}}
    for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x-camX),Math.round(p.y-camY+HUD),2,2);}
    if(r.t>75){txt(def.name,W/2,162,9,'#ffd83a',{align:'center',shadow:true});
      if(def.perk)wrapTxt(def.perk,28,178,200,6,'#fff8ec');
      if(r.t>150&&Math.floor(r.t/25)%2)txt('Press Z',W/2,208,6,'#b8a8d8',{align:'center'});}
  }else{
    box(24,40,208,130,'#f2dca0','#9a6234');txt('A LETTER FROM MAMA',W/2,50,7,'#5e3a1c',{align:'center'});
    const lines=wrap(def.letter||'',6,184);lines.forEach((l,i)=>txt(l,36,72+i*12,6,'#5e3a1c'));
    if(Math.floor(r.t/25)%2)txt('Press Z',W/2,208,6,'#b8a8d8',{align:'center'});
  }
}

/* ---- save migration: award growth for everything an older save already did ---- */
function migrateGrowth(s){
  if(s.gp!==undefined){G.gp=s.gp;G.rank=s.rank||1;G.taste=s.taste||{};G.secrets=s.secrets||{};G.mgFirst=s.mgFirst||{};G.mgDay=s.mgDay||{d:-1,n:0};
    G.acc=s.acc||null;G.accessoryUnlocked=!!s.accessoryUnlocked;G.snackFirst=!!s.snackFirst;G.snackEaten=s.snackEaten||0;return;}
  let gp=0;
  for(const id of ['mom',...ORDER])if(G.q[id]===2)gp+=GP.quest1;
  for(const id of ORDER2)if(G.q[id]===2)gp+=GP.quest2;
  for(const k in TRAIN)if(G.train[k]===2||has(k))gp+=GP.training;
  gp+=G.skills.size*GP.skill;
  const col=p=>[...G.collected].some(x=>x.startsWith(p));
  const tasted={worm:G.q.mom>=2,carrot:col('carrot'),apple:col('apple_'),acorn:col('acorn_'),fish:!!G.items.fish||G.q.remy===2,snowberry:!!G.items.snowberry||G.q.remy===2,cheese:G.q.squeaks>=2||!!G.items.cheese};
  for(const f of FOODS)if(tasted[f.id]){G.taste[f.id]=1;gp+=GP.taste;}
  const mg={bonk:G.outfits.includes('ears'),ffly:G.outfits.includes('pirate'),egg:G.outfits.includes('bow')};
  for(const k in mg)if(mg[k]){G.mgFirst[k]=1;gp+=GP.mgFirst;}
  const sec={burrow:G.outfits.includes('ears')||G.best.bonk>0,cellar:G.cellar||G.chest,grove:G.outfits.includes('pirate')||G.best.ffly>0};
  for(const k in sec)if(sec[k]){G.secrets[k]=1;gp+=GP.secret;}
  for(const id of ['seed_pen','seed_crate','seed_rock','seed_leaf','seed_mound','spot_forest_seed','spot_peak_seed','spot_beach_seed','spot_city_seed'])if(G.collected.has(id))gp+=GP.hiddenSeed;
  gp+=G.outfits.length*GP.outfit;
  if(G.coop)gp+=(G.coop.lv-1)*GP.coop;
  gp+=(G.harvests||0)*GP.harvest;
  G.gp=gp;
  let r=1;while(RANKS[r]&&G.gp>=RANKS[r].gp&&(!RANKS[r].gate||(RANKS[r].n===5?G.skills.has('fly'):RANKS[r].n===7?!!G.flags.festival:false)))r++;
  G.rank=r;
  if(r>=7){G.accessoryUnlocked=true;if(G.wear&&ACCESSORY_IDS.includes(G.wear)){G.acc=G.wear;G.wear=null;}}
  if(gp>0)G.growMsgOnLoad=true;
}

/* ---- Snack Bowl: the long-term use for seeds (appears once Pip can fly) ---- */
function useBowl(e){
  const L=[{who:'me',text:"A snack bowl! I can eat seeds to grow bigger. ("+G.seeds+" seeds)",choices:['Eat 1 seed','Eat 5 seeds'],cb:i=>{
    const n=i===0?1:5;
    if(G.seeds<n){SFX.deny();say([{who:'me',text:"I only have "+G.seeds+" seed"+(G.seeds===1?'':'s')+". Better go find more!"}]);return;}
    G.seeds-=n;G.snackEaten+=n;SFX.pick();puff(e.x,e.y-10,8,['#e8c88a','#fff8ec'],1,0.05);gainGP(n*GP.snack);
    if(!G.snackFirst){G.snackFirst=true;const m=reactorOnScreen();if(m&&m.id==='mom')say([{who:m,text:"Eat up, growing chick!"}]);}
    save();}}];
  say(L);
}

// treasure sense: the Pirate outfit shows hidden things everywhere; rank 3+ shows them when Pip is close
function senseNear(x,y){if(wearing('pirate'))return true;return !!G&&G.rank>=3&&Math.hypot(P.x-x,P.y-y)<56;}
