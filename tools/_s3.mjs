import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
const rd=f=>fs.readFileSync(f,'utf8');
// ---- state ----
ed('src/engine/state.js',[
 ["vfound:0,v_pig:0","sea_cove:0,sea_xmarks:0,sea_smug:0,sea_pearl:0,sea_wreck:0,sea_springs:0,sea_forge:0,sea_light:0,sea_boss:0,vfound:0,v_pig:0"],
 ["pebble:0,plank:0,snowball:0}","pebble:0,plank:0,snowball:0,pearl:0,wreckbell:0,crate:0,sunstone:0,ironore:0,powderkeg:0,conch:0}"],
 ["vil:{open:false,","sea:{open:false,lv:{sails:0,hull:0,cannon:0},salv:{sailcloth:0,hullplank:0,cannonpart:0},visited:{},dug:{},chest:0,lamps:0,boss:0},vil:{open:false,"],
 ["sacks:G.sacks,vil:G.vil,","sacks:G.sacks,vil:G.vil,sea:G.sea,"],
 ["if(s.vil)G.vil=Object.assign(G.vil,s.vil);","if(s.vil)G.vil=Object.assign(G.vil,s.vil);if(s.sea)G.sea=Object.assign(G.sea,s.sea);"],
 ["  makeVillageEnts();\n","  makeVillageEnts();\n  makeSeaEnts();\n"]]);
// ---- fortress hook ----
ed('src/systems/seas.js',[["function fortressArrive(){toast(\"Squawkbeard's ship! Peck him when he lands!\",'#ffd83a');}","function fortressArrive(){if(G.sea.boss<4)fortressStart();else toast(\"Squawkbeard's old ship. It's quiet now.\",'#a6e0ff');}"]]);
// ---- input ----
ed('src/engine/input.js',[["Escape:'back',KeyP:'pause',","Escape:'back',KeyP:'pause',ShiftLeft:'dash',ShiftRight:'dash',KeyV:'dash',"],
 ["  show('btnB',(state==='play'&&has('flap'))||(menus&&G&&G.part2));","  show('btnB',(state==='play'&&has('flap'))||(menus&&G&&G.part2));\n  show('btnD',(state==='play'||state==='chase')&&!!G&&has('dash'));"]]);
ed('tools/shell.html',[["  <div id=\"menu\">","  <button class=\"act\" id=\"btnD\" data-k=\"dash\"><b>D</b><small>DASH</small></button>\n  <div id=\"menu\">"]]);
ed('src/engine/canvas.js',[["    S('btnB',{right:(24+a)+'px',left:'auto',bottom:safe(14),width:b,height:b});","    S('btnB',{right:(24+a)+'px',left:'auto',bottom:safe(14),width:b,height:b});\n    S('btnD',{right:(32+a+b)+'px',left:'auto',bottom:safe(14),width:b,height:b});"],
 ["    S('btnB',{right:(big?Math.max(6,(bar-a)/2-b*0.35):24+a)+'px',left:'auto',bottom:safe(12),width:b,height:b});","    S('btnB',{right:(big?Math.max(6,(bar-a)/2-b*0.35):24+a)+'px',left:'auto',bottom:safe(12),width:b,height:b});\n    S('btnD',{right:(big?(bar-a)/2:16)+'px',left:'auto',bottom:safe(32+a+b),width:b,height:b});"]]);
// ---- player update: dash, cannon charge, hooks ----
ed('src/systems/actions.js',[
 ["  updateSunbeam();updateBabysit();updateRace();updateVillage();\n","  updateSunbeam();updateBabysit();updateRace();updateVillage();updateSeas();updateCharge();\n  if(pressed.dash)tryDash();\n"],
 ["      const sp=speed()*(ix&&iy?0.72:1),single=!(ix&&iy);let mx=true,my=true;","      const sp=speed()*(ix&&iy?0.72:1)*(P.dashT>0?2.5:1),single=!(ix&&iy);let mx=true,my=true;"],
 ["    if(ix||iy){\n      if(ix&&iy)","    if(P.dashT>0&&!ix&&!iy){const [ddx,ddy]=DIRV[P.dir];moveP(ddx*speed()*2.5,ddy*speed()*2.5,false);P.moving=true;}\n    if(ix||iy){\n      if(ix&&iy)"],
 ["hazardPeck(e,f,pr)||cityPeck(e,f,pr)||villagePeck(e,f,pr))return;","hazardPeck(e,f,pr)||cityPeck(e,f,pr)||villagePeck(e,f,pr)||seaPeck(e,f,pr))return;"],
 ["  hazardFlap(dx,dy);greenWings(dx,dy);\n","  hazardFlap(dx,dy);greenWings(dx,dy);seaFlap(dx,dy);\n"],
 ["    else if(e.type==='bees')updBees(e);","    else if(e.type==='gullp')updGull(e);else if(e.type==='jelly')updJelly(e);else if(e.type==='spark')updSpark(e);else if(e.type==='bubbles')updBubbles(e);else if(e.type==='boss')updBoss(e);else if(e.type==='barrel')updBarrel(e);\n    else if(e.type==='bees')updBees(e);"],
 ["function hurt(src){\n  if(P.inv>0||P.hop)return;\n  G.hearts--;P.inv=80;const dx=P.x-src.x,dy=P.y-src.y,d=Math.hypot(dx,dy)||1;\n  P.kx=dx/d*3;P.ky=dy/d*3;P.kt=8;SFX.hurt();shake=8;float(P.x,P.y-22,'OUCH','#ff6060');\n  if(G.hearts<=0){G.hearts=0;state='faint';FT=0;}","function hurt(src){\n  if(P.inv>0||P.hop)return;\n  G.hearts--;P.inv=80;const dx=P.x-src.x,dy=P.y-src.y,d=Math.hypot(dx,dy)||1;\n  P.kx=dx/d*3;P.ky=dy/d*3;P.kt=has('sealegs')&&seaRegion()?0:8;SFX.hurt();shake=8;float(P.x,P.y-22,'OUCH','#ff6060');\n  if(G.hearts<=0){if(bossActive()){bossRetry();return;}G.hearts=0;state='faint';FT=0;}"],
 ["  const sx=P.x,sy=P.y;","  const sx=P.x,sy=P.y;"]]);
ed('src/ui/growth.js',[["  if(FT===50){const far=G.part2&&inBeyond(),sp=far?(G.coop?coopExit():{x:136,y:1067}):{x:56,y:76};","  if(FT===50){const far=G.part2&&inBeyond(),sn=seaRegion()?SEA_NODES.find(n=>n.id===curNode()&&n.id!=='harbor'):null,sp=sn?sn.arrive:far?(G.coop?coopExit():{x:136,y:1067}):{x:56,y:76};"]]);
// ---- main + render states ----
ed('src/main.js',[["    case 'pinch':updatePinch();break;","    case 'pinch':updatePinch();break;\n    case 'sail':updateSail();break;\n    case 'voyage':updateVoyage();break;\n    case 'chase':updateChase();break;"]]);
ed('src/ui/render.js',[
 ["  else if(state==='pinch')drawPinch();","  else if(state==='pinch')drawPinch();\n  else if(state==='sail')drawSail();\n  else if(state==='voyage')drawVoyage();\n  else if(state==='chase')drawChase();"],
 ["    case 'worm':{","    case 'gullp':case 'jelly':case 'spark':case 'bubbles':case 'swarp':case 'shipdock':case 'xmark':case 'seachest':case 'brazier':case 'boss':case 'barrel':drawSeaEnt(e,sx,sy);break;\n    case 'worm':{"],
 ["    case 'item':{const s=SPR[e.kind];","    case 'item':{const s=SPR[e.kind];if(cellAt()&&cellAt().kind==='water'&&!wearing('pirate')&&Math.hypot(P.x-e.x,P.y-e.y)>64){if(tick%50<8){ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(sx,sy-6,2,2);}break;}"],
 ["  drawSeasonFX(cx,cy);","  drawSeasonFX(cx,cy);"],
 ["camX=ocx;camY=ocy;drawSeasonFX(cx,cy);","camX=ocx;camY=ocy;drawSeasonFX(cx,cy);drawSeaFX(cx,cy);"],
 ["  if(inBeyond()){\n    const cl0=cellAt(),rid=cl0.region.id;","  if(inBeyond()){\n    const cl0=cellAt(),rid=cl0.region.id;\n    if(cl0.kind==='water'){txt('DEEP REEF',252,7,5,'#a6e0ff',{align:'right'});ctx.fillStyle='#21142b';ctx.fillRect(168,16,84,8);ctx.fillStyle='#3a70c8';ctx.fillRect(169,17,82,6);const f=(G.air==null?AIR_MAX:G.air)/AIR_MAX;ctx.fillStyle=f>0.25?'#a6e0ff':(Math.floor(tick/6)%2?'#ff8080':'#fff8ec');ctx.fillRect(169,17,Math.round(82*f),6);txt('AIR',208,25,4,'#fff8ec',{align:'center'});return;}\n    if(rid==='fortress'&&bossActive()&&BOSS){txt('SQUAWKBEARD',252,7,5,'#ff8080',{align:'right'});for(let i=0;i<BOSS.max;i++){ctx.fillStyle=i<BOSS.hp?'#ff8080':'#4a3a66';ctx.fillRect(252-(BOSS.max-i)*10,17,8,7);}return;}"],
 ["    const cs=MINIMAP_BEYOND(),w=","    const cs=MINIMAP_BEYOND(),w="]]);
// minimap groups: sea screens in their own little map
{let s=rd('src/ui/render.js');
 s=s.replace("function MINIMAP_BEYOND(){\n  if(_mmCache)return _mmCache;\n  const cells=REGION_LIST.filter(r=>r.beyond&&r.area).flatMap(r=>r.cells);","function MINIMAP_BEYOND(){\n  const sea=seaRegion();if(!_mmCache)_mmCache={};if(_mmCache[sea])return _mmCache[sea];\n  const cells=REGION_LIST.filter(r=>r.beyond&&r.area&&!!r.sea===sea).flatMap(r=>r.cells);");
 s=s.replace("  return _mmCache={cells,x0,y0,cols:Math.max(...xs)-x0+1,rows:Math.max(...ys)-y0+1};","  return _mmCache[sea]={cells,x0,y0,cols:Math.max(...xs)-x0+1,rows:Math.max(...ys)-y0+1};");
 s=s.replace("let _mmCache=null;","let _mmCache=null;");
 s+=`
// quest log page for the seas
function drawSeasPage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#a6e0ff');
  txt('QUESTS - PIRATE SEAS',W/2,10,9,'#a6e0ff',{align:'center',shadow:true});
  ORDER5.forEach((id,i)=>{const y=21+i*15,q=QUESTS[id],st=G.q[id];
    box(10,y,W-20,13,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    if(st===0){txt('???',16,y+4,5,'#6a5a90');txt(id==='sea_cove'||id==='sea_boss'?'see Capn Pinch':'sail to meet them',W-16,y+4,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+4,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+4,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
  txt('SHIP: '+SEA_LEVEL_NAMES[Math.min(3,shipLevel())]+'   SAILCLOTH '+G.sea.salv.sailcloth+'  PLANKS '+G.sea.salv.hullplank+'  PARTS '+G.sea.salv.cannonpart,W/2,H-21,4,'#c49a5c',{align:'center'});
  txt('X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
`;
 s=s.replace("function questPages(){const p=[0];if(G.part2)p.push(1,3);if(G.vil.open)p.push(5);","function questPages(){const p=[0];if(G.part2)p.push(1,3);if(G.vil.open)p.push(5);if(G.sea.open)p.push(6);");
 s=s.replace("  if(questPage===5){drawVillagePage();return;}","  if(questPage===5){drawVillagePage();return;}\n  if(questPage===6){drawSeasPage();return;}");
 fs.writeFileSync('src/ui/render.js',s);}
// ---- skills ----
fs.appendFileSync('src/content/skills.js',`
// Sea Tree: dive and cpeck are taught by Coral and Ember (see trainers.js)
const SKILLS4=[
  {id:'dive',name:'DIVE',cost:6,req:[],x:44,y:72,desc:'Dive into the dive pools at the Coral Reef. Watch your AIR meter! Taught by Coral.',learn:'You can dive underwater!'},
  {id:'dash',name:'DASH',cost:5,req:[],x:44,y:124,desc:'Press SHIFT (or the DASH button) for a quick burst of speed that slips past danger!',learn:'Shift to DASH!'},
  {id:'cpeck',name:'CANNON PECK',cost:7,req:['dash'],x:120,y:124,desc:'Hold the peck button, then let go: a mighty peck that knocks enemies far back! Taught by Ember.',learn:'Hold to charge a CANNON PECK!'},
  {id:'sealegs',name:'SEA LEGS',cost:6,req:['dive'],x:204,y:96,desc:'No knockback on ship decks, and strong currents cannot push you around.',learn:'Steady on your feet!'}];
`);
ed('src/ui/growth.js',[
 ["const TREE=()=>growPage===1?SKILLS2:growPage===3?SKILLS3:SKILLS;\nfunction growPages(){return [0,...(G.part2?[1]:[]),...(G.vil.open?[3]:[]),2];}","const TREE=()=>growPage===1?SKILLS2:growPage===3?SKILLS3:growPage===4?SKILLS4:SKILLS;\nfunction growPages(){return [0,...(G.part2?[1]:[]),...(G.vil.open?[3]:[]),...(G.sea.open?[4]:[]),2];}"]]);
ed('src/ui/render.js',[
 ["const gcol=growPage===1?'#a6e0ff':growPage===3?'#94dc64':'#ffd83a';","const gcol=growPage===1?'#a6e0ff':growPage===3?'#94dc64':growPage===4?'#46b8c8':'#ffd83a';"],
 ["txt(growPage===1?'SKY TREE':growPage===3?'VILLAGE TREE':'GROWTH TREE'","txt(growPage===1?'SKY TREE':growPage===3?'VILLAGE TREE':growPage===4?'SEA TREE':'GROWTH TREE'"]]);
// trainers
{let s=rd('src/content/trainers.js');
 s=s.replace(/\n\};\s*$/,`,
  dive:{phase:5,who:'coral',whoName:'CORAL',skill:'DIVE',title:'Bubble Lessons',avail:()=>!!G.sea.visited.reef,item:'conch',need:3,noun:'conch shells',
    spawn:[['cn0',69,112],['cn1',73,116],['cn2',67,113]],
    lock:"Sail to the Coral Reef. Coral the octopus will teach you to DIVE!",
    intro:["Bloop! A chick on my reef! I'm Coral, and I teach bubble breathing.","To dive, you need to listen to the sea. And what listens best? CONCH SHELLS!","Find 3 conch shells on the east beach of the reef, and I'll teach you!"],
    remind:()=>Math.min(3,G.items.conch)+"/3 conch shells. Look around the east beach of the reef!",
    done:["Lovely shells! Hold one to your ear... hear the sea? That's the secret!","Now learn DIVE in your Sea Tree. Press E! Mind your AIR down there."],
    hint:()=>"Find 3 conch shells on the Coral Reef's east beach for Coral."},
  cpeck:{phase:5,who:'ember',whoName:'EMBER',skill:'CANNON PECK',title:'Powder Keg Practice',avail:()=>!!G.sea.visited.volcano&&has('dash'),item:'powderkeg',need:3,noun:'powder kegs',
    spawn:[['kg0',13,138],['kg1',20,135],['kg2',27,134]],
    lock:"Learn DASH, then ask Ember on Volcano Isle to teach you the CANNON PECK!",
    intro:["Hot stuff! I'm Ember. I teach the CANNON PECK: all your strength in one peck!","First you must learn what a big bang feels like. Three POWDER KEGS are scattered around the island.","Bring them to me (carefully!) and I'll show you how to charge a peck."],
    remind:()=>Math.min(3,G.items.powderkeg)+"/3 powder kegs. They're on both parts of the island, on the dark paths!",
    done:["Perfect kegs! Now: hold your peck, feel the power build... and RELEASE!","Learn CANNON PECK in your Sea Tree. Press E! Hold the peck button to charge."],
    hint:()=>"Find 3 powder kegs on Volcano Isle for Ember."}
};
`);fs.writeFileSync('src/content/trainers.js',s);}
// remove conch/keg from the always-spawned list
ed('src/content/seas.js',[
 ["  ['cn0','conch','reefE',5,4],['cn1','conch','reefE',9,8],['cn2','conch','reefE',3,5],\n",""],
 ["  ['kg0','powderkeg','volc',13,6],['kg1','powderkeg','volcE',4,3],['kg2','powderkeg','light',12,8]];","];"],
 ["  ['ore0','ironore','volcE',6,8],['ore1','ironore','volcE',12,5],\n];","  ['ore0','ironore','volcE',6,8],['ore1','ironore','volcE',12,5]];"]]);
// GP constants
ed('src/content/ranks.js',[["quest3:14,build:4,","quest3:14,build:4,upgrade:6,"]]);
ed('src/systems/ranks.js',[["gainGP((ORDER3.includes(id)||ORDER4.includes(id))?GP.quest3:","gainGP((ORDER3.includes(id)||ORDER4.includes(id)||ORDER5.includes(id))?GP.quest3:"]]);
ed('src/systems/dialogue.js',[["addSeeds(n,(ORDER2.includes(id)||ORDER3.includes(id)||ORDER4.includes(id))?2:1,(ORDER3.includes(id)||ORDER4.includes(id))?0:base);","addSeeds(n,(ORDER2.includes(id)||ORDER3.includes(id)||ORDER4.includes(id)||ORDER5.includes(id))?2:1,(ORDER3.includes(id)||ORDER4.includes(id)||ORDER5.includes(id))?0:base);"]]);
// follow-up chains
ed('src/systems/dialogue.js',[["let qid=QUEST_OF[e.id]||e.id;const base=qid;if(FOLLOWUP[e.id]&&G.q[e.id]===2&&G.q[FOLLOWUP[e.id]]!==2&&(!FOLLOW_GATE[e.id]||FOLLOW_GATE[e.id]()))qid=FOLLOWUP[e.id];","let qid=QUEST_OF[e.id]||e.id;const base=qid;\n  {let prev=base;for(const fq of [].concat(FOLLOWUP[e.id]||[])){if(G.q[prev]!==2)break;if(G.q[fq]!==2){if((!FOLLOW_GATE[e.id]||FOLLOW_GATE[e.id]())&&(!FOLLOW_GATE[fq]||FOLLOW_GATE[fq]()))qid=fq;break;}prev=fq;}}"]]);
// collect cases
ed('src/systems/actions.js',[["    case 'pebble':case 'plank':case 'snowball':","    case 'sailcloth':case 'hullplank':case 'cannonpart':G.sea.salv[e.kind]++;SFX.pick();toast('Got '+SALV_NAME[e.kind]+'! ('+G.sea.salv[e.kind]+')','#ffd83a');break;\n    case 'pearl':case 'wreckbell':case 'crate':case 'sunstone':case 'ironore':case 'conch':case 'powderkeg':G.items[e.kind]++;SFX.pick();float(e.x,e.y-16,({pearl:'PEARL',wreckbell:'THE BELL!',crate:'CRATE',sunstone:'SUNSTONE',ironore:'IRON ORE',conch:'CONCH',powderkeg:'POWDER KEG'})[e.kind]+(e.kind==='wreckbell'?'':' x'+G.items[e.kind]),'#fff8ec');break;\n    case 'pebble':case 'plank':case 'snowball':"]]);
// hints
ed('src/systems/part2.js',[["  {const vh=villageHint();if(vh)return vh;}\n","  {const vh=villageHint();if(vh)return vh;}\n  {const sh=seaHint();if(sh)return sh;}\n"]]);
fs.appendFileSync('src/systems/seas2.js',`
function seaHint(){
  if(!G.flags.pinchMap)return null;
  if(G.q.sea_cove===0)return "Capn Pinch is at the city harbor with a treasure map. Talk to him!";
  for(const id of ORDER5)if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[QUEST_GIVER[id]]+" the good news!";
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===5&&G.train[k]===1)return t.hint();}
  for(const id of ORDER5)if(G.q[id]===1)return QUESTS[id].hint();
  if(!G.flags.seas)return G.sea.lv.cannon?"Sail to Squawkbeard's ship when you're ready!":"Upgrade your ship at the harbor: sails, hull and a seed cannon!";
  return null;
}
`);
// ship catalog + Pinch talk
ed('src/content/shops.js',[["const SHOPS={","const SHOPS={\n  ship:{title:\"CAPN PINCH'S SHIP\",owner:'crab',color:'#a6e0ff',leave:'LEAVE',bye:'Fair winds, Captain!',\n    items:()=>[{name:'SET SAIL',tag:'GO',icon:'shipIcon',desc:'Open the sea chart and choose where to sail.',act:()=>{SH=null;openSailMap();}},\n      ...SHIP_UPGRADES.map(u=>({name:u.name,price:G.sea.lv[u.id]?null:u.seeds,tag:G.sea.lv[u.id]?'DONE':null,own:!!G.sea.lv[u.id],icon:u.icon,desc:u.desc+' NEEDS: '+costTextSeas(u)+'.',act:()=>buyUpgrade(u)}))]},"]]);
{let d=rd('src/content/dialogue.js');
 d+=`
// ---- the seas ----
Object.assign(TALK,{
  pinch:(e,{it,ask})=>{
    if(!G.flags.pinchMap||G.q.pinch!==2||G.q.sea_cove===0)return false;
    if(G.q.sea_cove===1&&QUESTS.sea_cove.check())return false;
    if(G.q.sea_boss===0&&G.flags.lit&&G.sea.lv.cannon>=1)return false;
    if(G.q.sea_boss===1&&QUESTS.sea_boss.check())return false;
    ask("Ready to sail, Captain? Upgrade the ship, or set sail?",['Ship menu','Not now'],i=>{if(i===0)openCatalog('ship');});}
});
`;fs.writeFileSync('src/content/dialogue.js',d);}
// ship dock interaction in action()
ed('src/systems/actions.js',[["  if(villageAction(f))return;\n","  if(villageAction(f))return;\n  for(const e of ents){if(e.type==='shipdock'&&onCur(e)&&G.sea.open&&Math.abs(f.x-e.x)<26&&Math.abs(f.y-(e.y-4))<20){openCatalog('ship');return;}if(e.type==='seachest'&&onCur(e)&&Math.abs(f.x-e.x)<16&&Math.abs(f.y-(e.y-6))<16){openSeaChest(e);return;}}\n"]]);
// tracks
ed('src/engine/audio.js',[["let curTrack='farm'","Object.assign(TRACKS,SEA_TRACKS);\nlet curTrack='farm'"]]);
// order
{let o=JSON.parse(rd('src/order.json'));
 o.splice(o.indexOf('regions/village.js')+1,0,'regions/seas.js');
 o.splice(o.indexOf('content/world_data.js'),0,'content/seas.js');
 o.splice(o.indexOf('content/characters.js'),0,'content/quests_seas.js');
 o.splice(o.indexOf('entities/sprites_village.js')+1,0,'entities/sprites_seas.js');
 o.splice(o.indexOf('engine/audio.js'),0,'engine/tracks_seas.js');
 o.splice(o.indexOf('systems/village.js')+1,0,'systems/seas.js','systems/seas2.js','systems/seas_draw.js');
 fs.writeFileSync('src/order.json',JSON.stringify([...new Set(o)],null,1));}
console.log('s3 done');
