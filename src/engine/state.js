'use strict';
/* ---------------- game state ---------------- */
const DIRV=[[0,1],[0,-1],[-1,0],[1,0]];
let state='title',tick=0,G=null,P=null,CS={x:0,y:0},camX=0,camY=0,trans=null,ents=[],TRAIL=[];
let parts=[],floats=[],toasts=[],dlg=null,shake=0,fade=0,fadeColor='#000';
let titleSave,titleConfirm=false,confirmSel=1;
let growSel=0,lvlAnim=0,growMsg=null,titleSel=0,FT=0,END=null,questPage=0;

function has(s){return G&&G.skills.has(s);}
function level(){return 1+G.skills.size;}
function stage(){return G?stageOfRank(G.rank):0;}
function wearing(id){return !!G&&(G.wear===id||G.acc===id);}
function maxHearts(){return (typeof buffActive==='function'&&buffActive('tart')?1:0)+3+(has('down')?1:0)+(has('tough')?1:0)+(has('golden')?1:0)+(wearing('bow')?1:0)+(G.rank>=4?1:0)+(G.rank>=7?1:0);}
function speed(){return speed0()*(buffActive('muffin')?1.1:1)*(wearing('goggles')&&(P.flying||overChasm())?1.15:1);}
function speed0(){return ((has('quick')?1.45:1.05)+(has('golden')?0.2:0))*(wearing('ears')?1.2:1)*(G.rank>=2?1.05:1)+(wearing('ninja')?0.12:0);}
function priceOf(o){return Math.max(1,o.price-(wearing('shades')?1:0));}
function upCost(u){return Math.max(1,u.cost-(wearing('shades')?1:0));}
// outfits: one slot until rank 7, then an outfit slot plus an accessory slot. setWear(id) toggles; setWear(null) takes everything off.
function setWear(id,forceOn){
  if(!id){G.wear=null;G.acc=null;}
  else if(!forceOn&&wearing(id)){if(G.wear===id)G.wear=null;if(G.acc===id)G.acc=null;}
  else if(G.rank<7){G.wear=id;G.acc=null;}
  else if(ACCESSORY_IDS.includes(id))G.acc=id;
  else G.wear=id;
  G.hearts=Math.min(G.hearts,maxHearts());}
function strawBonus(x,y){if(wearing('straw')&&Math.random()<0.25){G.seeds++;G.earned++;SFX.seed();float(x,y-26,'+1 SEED (hat!)','#ffd83a');}}

function freshState(){
  return {seeds:0,skills:new Set(),hearts:3,q:{mom:0,daisy:0,pig:0,duck:0,sheep:0,rooster:0,penny:0,clyde:0,squeaks:0,biscuit:0,whiskers:0,
      granny:0,bucky:0,doe:0,mo:0,elda:0,pidge:0,remy:0,pinch:0,sandy:0,rocco:0,cleo:0,cookoff:0,vane:0,babysit:0,portrait:0,vfound:0,v_pig:0,v_whiskers:0,v_clyde:0,v_daisy:0,v_doe:0,v_penny:0,v_rooster:0,vharvest:0},
    items:{worm:0,bell:0,apple:0,feather:0,carrot:0,bone:0,yarn:0,letter:0,cheese:0,acorn:0,stick:0,shell:0,fish:0,snowberry:0,eagleEgg:0,horseshoe:0,puff:0,ring:0,stump:0,bhat:0,bwhisk:0,bbell:0,pepper:0,salt:0,mushroom:0,pebble:0,plank:0,snowball:0},collected:new Set(),mods:{},picked:{},foxGone:false,gooseGone:false,
    sp1:0,sp2:0,earned:0,gp:0,rank:1,taste:{},secrets:{},mgFirst:{},mgDay:{d:-1,n:0},acc:null,accessoryUnlocked:false,snackFirst:false,snackEaten:0,growMsgOnLoad:false,vil:{open:false,b:{},mat:{wood:0,stone:0,wool:0,clay:0},res:{},letters:[],nodes:{},shear:{},whistle:{},skills:0,contest:{},decor:{}},time:0,met:new Set(),home:[],sibs:[],visited:new Set(['0,0']),autoMom:0,won:false,
    clock:Math.round(DAY*0.07),weather:'clear',wInt:0,puddle:0,outfits:[],wear:null,best:{egg:0,bonk:0,ffly:0,race:0},sacks:{speedy:0,giant:0,moon:0},decor:{},buff:null,jobs:{day:0,list:[]},hold:{seashell:0,plume:0,fossil:0,petal:0},museum:{seashell:0,plume:0,fossil:0,petal:0},cellar:false,chest:false,
    part2:false,areas:['farm'],thumb:false,coop:null,plots:{},mail:{rocco:0,cleo:0,granny:0},flags:{},turtles:[],harvests:0,train:{}};
}
function newPlayer(x,y){return {x,y,dir:0,z:0,moving:false,hop:null,kt:0,kx:0,ky:0,inv:0,peckT:0,flapCd:0,flapAnim:0,bubbleCd:0,flying:false};}
function resetTransient(){RU=null;FEST=null;CRED=null;PIN=null;VB=null;SH=null;PL=null;MG=null;EG=null;dlg=null;}
function newGame(){
  resetTransient();
  G=freshState();tiles=MAP.map(r=>r.split(''));P=newPlayer(56,76);CS={x:0,y:0};camX=0;camY=0;trans=null;
  TRAIL=[];parts=[];floats=[];toasts=[];makeEnts();G.autoMom=50;state='play';fade=1;fadeColor='#000';
}
function save(){
  if(!G)return;titleSave=undefined;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify({sv:3,pos:toRegionPos(P.x,P.y),seeds:G.seeds,skills:[...G.skills],hearts:G.hearts,q:G.q,
    items:G.items,collected:[...G.collected],mods:G.mods,picked:G.picked,foxGone:G.foxGone,gooseGone:G.gooseGone,sp1:G.sp1,sp2:G.sp2,earned:G.earned,gp:G.gp,rank:G.rank,taste:G.taste,secrets:G.secrets,mgFirst:G.mgFirst,mgDay:G.mgDay,acc:G.acc,accessoryUnlocked:G.accessoryUnlocked,snackFirst:G.snackFirst,snackEaten:G.snackEaten,sacks:G.sacks,vil:G.vil,decor:G.decor,buff:G.buff,jobs:G.jobs,hold:G.hold,museum:G.museum,
    time:G.time,met:[...G.met],home:G.home,sibs:G.sibs,visited:[...G.visited],won:G.won,
    clock:G.clock,weather:G.weather,outfits:G.outfits,wear:G.wear,best:G.best,cellar:G.cellar,chest:G.chest,
    part2:G.part2,areas:G.areas,thumb:G.thumb,coop:G.coop,plots:G.plots,mail:G.mail,flags:G.flags,turtles:G.turtles,harvests:G.harvests,train:G.train,ov:2}));}catch(e){}
}
function loadSave(){try{const s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function continueGame(){
  resetTransient();
  const s=loadSave();if(!s){newGame();return;}
  G=freshState();Object.assign(G,{seeds:s.seeds,skills:new Set(s.skills),hearts:s.hearts,q:Object.assign(G.q,s.q),items:Object.assign(G.items,s.items),collected:new Set(s.collected),
    mods:s.mods||{},picked:s.picked||{},foxGone:s.foxGone,gooseGone:s.gooseGone,time:s.time,met:new Set(s.met),
    home:s.home||[],sibs:s.sibs||[],visited:new Set(s.visited||['0,0']),won:!!s.won,
    clock:s.clock||G.clock,weather:s.weather||'clear',outfits:s.outfits||[],wear:s.wear||null,best:Object.assign(G.best,s.best),cellar:!!s.cellar,chest:!!s.chest,
    part2:!!s.part2,areas:s.areas||['farm'],thumb:!!s.thumb,coop:s.coop||null,plots:s.plots||{},mail:Object.assign(G.mail,s.mail),flags:s.flags||{},turtles:s.turtles||[],harvests:s.harvests||0});
  G.wInt=G.weather==='clear'?0:1;
  tiles=MAP.map(r=>r.split(''));for(const k in G.mods){const [c,r]=k.split(',').map(Number);tiles[r][c]=G.mods[k];}
  {const p=s.pos?fromRegionPos(s.pos):{x:s.x,y:s.y};P=newPlayer(p.x,p.y);CS=s.pos?{x:Math.floor(p.x/256),y:Math.floor((p.y-1)/192)}:(s.cs||{x:0,y:0});if(!cellAt(CS)){P=newPlayer(56,76);CS={x:0,y:0};}}
  camX=CS.x*256;camY=CS.y*192;trans=null;TRAIL=[];parts=[];floats=[];toasts=[];
  G.train=Object.assign({},s.train||{});migrateSave(s);
  G.sacks=Object.assign(G.sacks,s.sacks||{});if(s.vil)G.vil=Object.assign(G.vil,s.vil);G.decor=s.decor||{};G.buff=s.buff||null;G.jobs=s.jobs||{day:0,list:[]};G.hold=Object.assign(G.hold,s.hold||{});G.museum=Object.assign(G.museum,s.museum||{});
  migrateSeeds(s);migrateGrowth(s);G.hearts=Math.max(1,Math.min(G.hearts,maxHearts()));makeEnts();state='play';fade=1;fadeColor='#000';
  if(G.growMsgOnLoad){G.growMsgOnLoad=false;toast("You've grown! You are now a "+RANKS[G.rank-1].name+'!','#94dc64');}
}

/* ---------------- entities ---------------- */
function addEnt(o){ents.push(o);return o;}
function at(c,r){return {x:c*16+8,y:r*16+12};}
function spawnCast(part){
  for(const c of CHARACTERS)if((c.c!==undefined)&&((c.r>=48)===(part===2)))
    addEnt({type:'npc',id:c.id,name:c.name,spr:c.spr,...at(c.c,c.r),w:c.w||14,voice:c.voice,solid:true,phase:(Math.random()*60)|0,flip:false,deco:c.deco,
      sched:c.night?{day:[c.c,c.r],night:c.night}:null,at:'day'});
}
function makeEnts(){
  ents=[];
  const npc=(id,name,spr,c,r,voice)=>addEnt({type:'npc',id,name,spr,...at(c,r),w:14,voice,solid:true,phase:(Math.random()*60)|0,flip:false});
  spawnCast(1);
  SIBS.forEach(s=>{const n=npc(s.id,s.name,s.spr,s.hide[0],s.hide[1],950);n.sib=s;n.w=10;if(G.sibs.includes(s.id)){n.home=true;Object.assign(n,at(...s.home));}});
  // (family may later move to the new coop; see relocateFamily)
  [[26,8],[28,8],[27,9],[29,9]].forEach(([c,r],i)=>{const id='carrot'+i;if(!G.collected.has(id))addEnt({type:'carrot',id,x:c*16+8,y:r*16+11});});
  MOUNDS.forEach(m=>{if(!G.collected.has(m.id))addEnt({type:'mound',id:m.id,x:m.c*16+8,y:m.r*16+11,has:m.has});});
  spawnItem('yarn','yarn',19*16+8,27*16+12);
  [[4,41],[7,41],[10,41],[5,44],[8,44],[11,44]].forEach(([c,r],i)=>addEnt({type:'hole',id:'hole'+i,x:c*16+8,y:r*16+12,up:0,max:1}));
  addEnt({type:'chest',x:384,y:39*16+12,solid:true,w:16});
  placeBlocks();
  [[6,7],[12,7],[7,8],[11,8]].forEach(([c,r],i)=>{const id='worm'+i;if(!G.collected.has(id))addEnt({type:'worm',id,x:c*16+8,y:r*16+11,phase:i*13});});
  spawnItem('bell','bell',28*16+8,2*16+12);
  spawnItem('seed_pen','seed',27*16+8,3*16+12);
  spawnItem('feather_pond','feather',6*16+12,18*16+11);
  [[4,16],[10,16],[6,18]].forEach(([c,r],i)=>{const id='duckling'+i;
    const d=addEnt({type:'duckling',id,x:c*16+8-(i===2?3:0),y:r*16+12,mode:'wait',phase:i*20,flip:false,fi:0});
    if(G.home.includes(id))d.mode='home';});
  placeHome();
  for(const k in G.mods){const h=HIDDEN[k];if(h&&!G.collected.has(h.id)){const [c,r]=k.split(',').map(Number);spawnItem(h.id,h.kind,c*16+8,r*16+12);}}
  for(const k in G.picked){const [x,y,kind='apple']=G.picked[k],id=kind+'_'+k;if(!G.collected.has(id))spawnItem(id,kind,x,y);}
  addEnt({type:'bowl',x:184,y:28*16+12});addEnt({type:'bowl',x:44*16+8,y:52*16+12});
  makeP2Ents();
  makeCityEnts();
  makeVillageEnts();
  if(!G.foxGone){const p=at(27,16);addEnt({type:'fox',x:p.x,y:p.y,hx:p.x,hy:p.y,sx:1,sy:1,hp:3,wt:0,wx:0,wy:0,kt:0,stun:0,cool:0,flash:0,flip:false});}
  if(!G.gooseGone){const p=at(43,18);addEnt({type:'goose',x:p.x,y:p.y,hx:p.x,hy:p.y,sx:2,sy:1,st:'idle',t:0,kt:0,cool:0,flash:0,flip:false,solid:true,w:14});}
}
/* ---- part 2 entities ---- */
function inSite(c,r){const s=G.coop&&SITES[G.coop.site];return !!s&&c>=s.c&&c<s.c+3&&r>=s.r&&r<s.r+2;}
function makeP2Ents(){
  const npc=(id,name,spr,c,r,voice,w=14)=>addEnt({type:'npc',id,name,spr,...at(c,r),w,voice,solid:true,phase:(Math.random()*60)|0,flip:false});
  spawnCast(2);
  ['mokid1','mokid2'].forEach((id,i)=>{const n=npc(id,'BABY MARMOT','mokid',G.flags.mo?11+i:5+i*2,G.flags.mo?53:51,1300,6);n.deco2=true;n.solid=false;});
  const fawn=addEnt({type:'follower',kind:'fawn',id:'fawn',x:20*16+8,y:70*16+12,mode:'wait',fi:0,flip:false});
  if(G.flags.fawn){const d=ents.find(e=>e.id==='doe');fawn.mode='home';fawn.x=d.x+16;fawn.y=d.y+2;}
  [[3,75],[9,74],[12,78]].forEach(([c,r],i)=>{const id='turtle'+i;if(!G.turtles.includes(id))addEnt({type:'follower',kind:'turtle',id,x:c*16+8,y:r*16+12,mode:'wait',fi:0,flip:false});});
  [['stick0',13,69],['stick1',29,62],['stick2',3,54],['stick3',14,74]].forEach(([id,c,r])=>spawnItem(id,'stick',c*16+8,r*16+12));
  [['shell0',4,78],['shell1',10,78],['shell2',2,81],['shell3',13,82],['shell4',22,73]].forEach(([id,c,r])=>spawnItem(id,'shell',c*16+8,r*16+12));
  spawnItem('eagleEgg','eagleEgg',28*16+8,51*16+12);
  addEnt({type:'fishspot',x:304,y:75*16+12});
  addEnt({type:'berry',x:13*16+8,y:56*16+12,solid:true,w:12});
  addPlot(5,64,false);addPlot(6,64,false);
  if(G.coop){applyCoop(!!G.coop.fresh);delete G.coop.fresh;}
  makeHazards();
  for(const k in TRAIN)if(G.train[k]===1)spawnTrain(k);
}
function addPlot(c,r,coop){const id='plot_'+c+'_'+r;if(!ents.some(e=>e.id===id))addEnt({type:'plot',id,x:c*16+8,y:r*16+12,coop});}
function applyCoop(fresh){
  const S=SITES[G.coop.site],c=S.c,r=S.r;
  if(fresh)[[0,0,'v'],[1,0,'v'],[2,0,'v'],[0,1,'c'],[1,1,'K'],[2,1,'c']].forEach(([dx,dy,ch])=>setTile(c+dx,r+dy,ch));
  DOORS[(c+1)+','+(r+1)]=COOP_IN;
  S.plots.slice(0,G.coop.lv*2).concat(extraPlotTiles()).forEach(([pc,pr])=>{if(tileAt(pc,pr)!=='V')setTile(pc,pr,'V');addPlot(pc,pr,true);});
  relocateFamily();
}
function coopExit(){const S=SITES[G.coop.site];return {x:(S.c+1)*16+8,y:(S.r+2)*16+11};}
function relocateFamily(){
  if(!G.coop)return;const lv=G.coop.lv;
  for(const e of ents){if(e.type!=='npc')continue;
    if(e.id==='mom'&&lv>=2)Object.assign(e,at(...FAMILY_POS.mom));
    if(lv>=3&&(e.id==='penny'||(e.sib&&e.home))&&!(G.vil&&G.vil.res[e.id]))Object.assign(e,at(...FAMILY_POS[e.id]));}
}
const PLATES=[[19,42],[28,42]],GATE=[[23,40],[24,40]];
function placeBlocks(){
  ents=ents.filter(e=>e.type!=='block');
  (G.cellar?PLATES:[[22,45],[25,45]]).forEach(([c,r])=>addEnt({type:'block',bc:c,br:r,x:c*16+8,y:r*16+16,solid:true,sl:null}));
}
function spawnItem(id,kind,x,y,pop){
  if(G.collected.has(id))return null;
  return addEnt({type:'item',id,kind,x,y,z:pop?2:0,vz:pop?2.6:0,delay:pop?24:0});
}
function placeHome(){
  const duck=ents.find(e=>e.id==='duck');if(!duck)return;
  for(const e of ents)if(e.type==='duckling'&&e.mode==='home'){const k=G.home.indexOf(e.id);e.x=duck.x-16-k*10;e.y=duck.y+2;e.flip=true;}
}
function resetEnemies(){
  resetHazards();
  for(const e of ents){if(e.type==='fox'||e.type==='goose'){if(e.gone||e.blown)continue;e.x=e.hx;e.y=e.hy;e.kt=0;e.stun=0;e.cool=30;e.st='idle';}}
}
function onCur(e){return Math.floor(e.x/256)===CS.x&&Math.floor((e.y-1)/192)===CS.y;}

