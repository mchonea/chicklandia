'use strict';
/* ---------------- game state ---------------- */
const DIRV=[[0,1],[0,-1],[-1,0],[1,0]];
let state='title',tick=0,G=null,P=null,CS={x:0,y:0},camX=0,camY=0,trans=null,ents=[],TRAIL=[];
let parts=[],floats=[],toasts=[],dlg=null,shake=0,fade=0,fadeColor='#000';
let titleSave,titleConfirm=false,confirmSel=1;
let growSel=0,lvlAnim=0,growMsg=null,titleSel=0,FT=0,END=null,questPage=0;

function has(s){return G&&G.skills.has(s);}
function level(){return 1+G.skills.size;}
function stage(){return Math.min(4,Math.floor((level()-1)/2));}
function wearing(id){return !!G&&G.wear===id;}
function maxHearts(){return 3+(has('down')?1:0)+(has('tough')?1:0)+(has('golden')?1:0)+(wearing('bow')?1:0);}
function speed(){return ((has('quick')?1.45:1.05)+(has('golden')?0.2:0))*(wearing('ears')?1.2:1)+(wearing('ninja')?0.12:0);}
function priceOf(o){return Math.max(1,o.price-(wearing('shades')?1:0));}
function upCost(u){return Math.max(1,u.cost-(wearing('shades')?1:0));}
function setWear(id){G.wear=id;G.hearts=Math.min(G.hearts,maxHearts());}
function strawBonus(x,y){if(wearing('straw')&&Math.random()<0.25){G.seeds++;G.earned++;SFX.seed();float(x,y-26,'+1 SEED (hat!)','#ffd83a');}}

function freshState(){
  return {seeds:0,skills:new Set(),hearts:3,q:{mom:0,daisy:0,pig:0,duck:0,sheep:0,rooster:0,penny:0,clyde:0,squeaks:0,biscuit:0,whiskers:0,
      granny:0,bucky:0,doe:0,mo:0,elda:0,pidge:0,remy:0,pinch:0,sandy:0},
    items:{worm:0,bell:0,apple:0,feather:0,carrot:0,bone:0,yarn:0,letter:0,cheese:0,acorn:0,stick:0,shell:0,fish:0,snowberry:0,eagleEgg:0,horseshoe:0,puff:0,ring:0,stump:0},collected:new Set(),mods:{},picked:{},foxGone:false,gooseGone:false,
    sp1:0,sp2:0,earned:0,time:0,met:new Set(),home:[],sibs:[],visited:new Set(['0,0']),autoMom:0,won:false,
    clock:Math.round(DAY*0.07),weather:'clear',wInt:0,puddle:0,outfits:[],wear:null,best:{egg:0,bonk:0,ffly:0},cellar:false,chest:false,
    part2:false,areas:['farm'],thumb:false,coop:null,plots:{},mail:{rocco:0,cleo:0,granny:0},flags:{},turtles:[],harvests:0,train:{}};
}
function newPlayer(x,y){return {x,y,dir:0,z:0,moving:false,hop:null,kt:0,kx:0,ky:0,inv:0,peckT:0,flapCd:0,flapAnim:0,bubbleCd:0,flying:false};}
function newGame(){
  G=freshState();tiles=MAP.map(r=>r.split(''));P=newPlayer(56,76);CS={x:0,y:0};camX=0;camY=0;trans=null;
  TRAIL=[];parts=[];floats=[];toasts=[];makeEnts();G.autoMom=50;state='play';fade=1;fadeColor='#000';
}
function save(){
  if(!G)return;titleSave=undefined;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify({sv:3,pos:toRegionPos(P.x,P.y),seeds:G.seeds,skills:[...G.skills],hearts:G.hearts,q:G.q,
    items:G.items,collected:[...G.collected],mods:G.mods,picked:G.picked,foxGone:G.foxGone,gooseGone:G.gooseGone,sp1:G.sp1,sp2:G.sp2,earned:G.earned,
    time:G.time,met:[...G.met],home:G.home,sibs:G.sibs,visited:[...G.visited],won:G.won,
    clock:G.clock,weather:G.weather,outfits:G.outfits,wear:G.wear,best:G.best,cellar:G.cellar,chest:G.chest,
    part2:G.part2,areas:G.areas,thumb:G.thumb,coop:G.coop,plots:G.plots,mail:G.mail,flags:G.flags,turtles:G.turtles,harvests:G.harvests,train:G.train,ov:2}));}catch(e){}
}
function loadSave(){try{const s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function continueGame(){
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
  migrateSeeds(s);G.hearts=Math.max(1,Math.min(G.hearts,maxHearts()));makeEnts();state='play';fade=1;fadeColor='#000';
}

/* ---------------- entities ---------------- */
function addEnt(o){ents.push(o);return o;}
const SIBS=[
  {id:'peep',name:'PEEP',spr:'peep',hide:[46,31],home:[4,28],found:"Aww, you found me! I was hiding behind the bed!",homeLine:"Peep peep! Next time I'm hiding under the bed. Don't tell!"},
  {id:'cheep',name:'CHEEP',spr:'cheep',hide:[17,21],home:[11,28],found:"Nooo! That bush was the PERFECT hiding spot!",homeLine:"Pip, when you can fly, will you take me for a ride?"},
  {id:'tweet',name:'TWEET',spr:'tweet',hide:[28,27],home:[5,33],found:"How did you get up here?! Okay, okay, I'm going home!",homeLine:"I'm gonna be a big strong chicken just like you, Pip!"}];
const MOUNDS=[{id:'mound0',c:29,r:21,has:'An old boot!'},{id:'mound1',c:2,r:22,has:'seed'},{id:'mound2',c:45,r:9,has:'A rusty spoon!'},{id:'mound3',c:38,r:21,has:'bone'}];
function at(c,r){return {x:c*16+8,y:r*16+12};}
function makeEnts(){
  ents=[];
  const npc=(id,name,spr,c,r,voice)=>addEnt({type:'npc',id,name,spr,...at(c,r),w:14,voice,solid:true,phase:(Math.random()*60)|0,flip:false});
  npc('mom','MAMA HEN','hen',6,4,560);
  npc('daisy','DAISY','cow',19,8,170).w=18;
  npc('pig','PORKCHOP','pig',40,4,240);
  npc('penny','PENNY','penny',8,29,820);
  npc('clyde','CLYDE','horse',18,33,150).w=16;
  npc('squeaks','SQUEAKS','mouse',29,33,1200).w=10;
  npc('nibbles','NIBBLES','chef',36,27,1100).w=10;
  npc('biscuit','BISCUIT','dog',41,32,300);
  npc('whiskers','WHISKERS','cat',40,30,500).w=12;
  SIBS.forEach(s=>{const n=npc(s.id,s.name,s.spr,s.hide[0],s.hide[1],950);n.sib=s;n.w=10;if(G.sibs.includes(s.id)){n.home=true;Object.assign(n,at(...s.home));}});
  // (family may later move to the new coop; see relocateFamily)
  [[26,8],[28,8],[27,9],[29,9]].forEach(([c,r],i)=>{const id='carrot'+i;if(!G.collected.has(id))addEnt({type:'carrot',id,x:c*16+8,y:r*16+11});});
  MOUNDS.forEach(m=>{if(!G.collected.has(m.id))addEnt({type:'mound',id:m.id,x:m.c*16+8,y:m.r*16+11,has:m.has});});
  spawnItem('yarn','yarn',19*16+8,27*16+12);
  npc('maggie','MAGGIE','magpie',28,7,1400).w=12;
  npc('bunbun','BUN-BUN','rabbit',8,39,1000).w=12;
  npc('hootie','HOOTIE','owl',40,40,350).w=12;
  [[4,41],[7,41],[10,41],[5,44],[8,44],[11,44]].forEach(([c,r],i)=>addEnt({type:'hole',id:'hole'+i,x:c*16+8,y:r*16+12,up:0,max:1}));
  addEnt({type:'chest',x:384,y:39*16+12,solid:true,w:16});
  placeBlocks();
  npc('duck','MRS. QUACKERS','duck',12,21,760);
  npc('sheep','WOOLLY','sheepBow',21,20,420);
  npc('rooster','SIR CLUCKINGTON','rooster',36,15,330);
  npc('sheep2','SHEEP','sheep',19,21,380).deco=true;
  npc('sheep3','SHEEP','sheep',23,19,460).deco=true;
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
  makeP2Ents();
  if(!G.foxGone){const p=at(27,16);addEnt({type:'fox',x:p.x,y:p.y,hx:p.x,hy:p.y,sx:1,sy:1,hp:3,wt:0,wx:0,wy:0,kt:0,stun:0,cool:0,flash:0,flip:false});}
  if(!G.gooseGone){const p=at(43,18);addEnt({type:'goose',x:p.x,y:p.y,hx:p.x,hy:p.y,sx:2,sy:1,st:'idle',t:0,kt:0,cool:0,flash:0,flip:false,solid:true,w:14});}
}
/* ---- part 2 entities ---- */
const SITES={
  forest:{name:'FOREST',c:11,r:67,sign:[11,69],plots:[[14,67],[14,68],[9,67],[10,67],[9,68],[10,68],[12,66],[13,66]]}};
// coop sites from older versions, used only to clean up old saves
const OLD_SITES={mountains:{c:2,r:56,plots:[[5,56],[6,56],[1,56],[6,57],[7,57],[7,56],[2,55],[3,55]]},
  city:{c:41,r:64,plots:[[40,64],[40,65],[44,64],[45,64],[41,63],[42,63],[43,63],[45,65]]},
  beach:{c:5,r:76,plots:[[4,76],[4,77],[9,76],[9,77],[4,75],[6,75],[7,75],[10,76]]}};
// seed tallies: old saves only had one "found" counter that also counted bonus seeds
function migrateSeeds(s){
  if(s.sp1!==undefined){G.sp1=s.sp1;G.sp2=s.sp2||0;G.earned=s.earned||0;return;}
  const f=s.found||0;G.sp1=Math.min(TOTAL_SEEDS,f);G.sp2=G.part2?Math.min(TOTAL_SEEDS2,Math.max(0,f-TOTAL_SEEDS)):0;G.earned=f;
}
function addSeeds(n,part,base){G.seeds+=n;G.earned+=n;if(base===undefined)base=n;
  if(part===2)G.sp2=Math.min(TOTAL_SEEDS2,G.sp2+base);else G.sp1=Math.min(TOTAL_SEEDS,G.sp1+base);}
function migrateSave(s){
  if(!s.ov){G.outfits=[...new Set(G.outfits.map(id=>OUTFIT_RENAME[id]||id))];if(G.wear)G.wear=OUTFIT_RENAME[G.wear]||G.wear;}
  if(G.coop&&OLD_SITES[G.coop.site]){const o=OLD_SITES[G.coop.site];
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<3;dx++){const k=(o.c+dx)+','+(o.r+dy);delete G.mods[k];tiles[o.r+dy][o.c+dx]=MAP[o.r+dy][o.c+dx];}
    for(const [c,r] of o.plots){const k=c+','+r;delete G.mods[k];tiles[r][c]=MAP[r][c];delete G.plots['plot_'+c+'_'+r];}
    G.coop.site='forest';G.coop.fresh=true;}
}
const COOP_IN={x:640,y:939};
const FAMILY_POS={mom:[39,52],penny:[42,53],peep:[37,54],cheep:[38,55],tweet:[41,55]};
function inSite(c,r){const s=G.coop&&SITES[G.coop.site];return !!s&&c>=s.c&&c<s.c+3&&r>=s.r&&r<s.r+2;}
function makeP2Ents(){
  const npc=(id,name,spr,c,r,voice,w=14)=>addEnt({type:'npc',id,name,spr,...at(c,r),w,voice,solid:true,phase:(Math.random()*60)|0,flip:false});
  npc('granny','GRANNY SHELL','tortoise',4,63,200,16);
  npc('bucky','BUCKY','beaver',22,67,500,12);
  npc('doe','DOE','deer',27,66,650,16);
  npc('mo','MO','marmot',10,52,900,10);
  npc('elda','ELDA','eagle',20,52,450,12);
  npc('pidge','POSTMASTER PIDGE','pigeon',35,65,800,10);
  npc('rocco','ROCCO','raccoon',43,68,420,12);
  npc('remy','CHEF REMY','chef',40,77,1100,10);
  npc('cleo','CLEO','catO',35,78,520,12);
  npc('maggie2','MAGGIE','magpie',43,78,1400,12); // temporary city branch of the boutique (until Phase 3)
  npc('pinch','CAPN PINCH','crab',13,75,350,12);
  npc('sandy','LIFEGUARD SANDY','gull',6,74,900,10);
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
  S.plots.slice(0,G.coop.lv*2).forEach(([pc,pr])=>{if(tileAt(pc,pr)!=='V')setTile(pc,pr,'V');addPlot(pc,pr,true);});
  relocateFamily();
}
function coopExit(){const S=SITES[G.coop.site];return {x:(S.c+1)*16+8,y:(S.r+2)*16+11};}
function relocateFamily(){
  if(!G.coop)return;const lv=G.coop.lv;
  for(const e of ents){if(e.type!=='npc')continue;
    if(e.id==='mom'&&lv>=2)Object.assign(e,at(...FAMILY_POS.mom));
    if(lv>=3&&(e.id==='penny'||(e.sib&&e.home)))Object.assign(e,at(...FAMILY_POS[e.id]));}
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

