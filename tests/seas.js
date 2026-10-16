/* Phase 5 (Pirate Seas) test. Needs ?debug=1 and tests/walk.js:
     (0,eval)(await (await fetch('tests/walk.js')).text()); const r=await (0,eval)(await (await fetch('tests/seas.js')).text()); */
(async()=>{
const c=window.__chick,R=window.__R={},ok=(k,v)=>{R[k]=v;};
const reset=()=>{state='play';dlg=null;SH=null;PL=null;VB=null;SAIL=null;VOY=null;fade=0;P.kt=0;P.inv=0;G.hearts=maxHearts();};
const talk=id=>{reset();c.talk(id);if(dlg){dlg.lines.forEach(l=>l.fx&&l.fx());}const d=dlg;reset();return d;};
const near=(id)=>{const e=ents.find(x=>x.id===id);return e;};
c.newGame();let G=c.G;G.autoMom=0;G.part2=true;['peck','quick','hop','glide','flap','swim'].forEach(s=>G.skills.add(s));G.seeds=300;G.thumb=true;reset();
G.clock=Math.round(DAY*0.3);
// 1. Pinch opens the seas after the village chapter
G.flags.pinchMap=1;G.q.pinch=2;G.flags.village=1;save();c.continueGame();G=c.G;reset();
ok('pinch_at_harbor',regionOfPos(near('pinch').x,near('pinch').y).id==='city'&&Math.abs(near('pinch').x-(69*16+8))<2);
talk('pinch');ok('sea_opens',G.sea.open&&G.q.sea_cove===1);
// 2. ship menu and sailing
openCatalog('ship');ok('ship_menu',state==='catalog'&&SHOPS.ship.items().length===4);
SHOPS.ship.items()[0].act();ok('sail_map_opens',state==='sail');
SAIL.sel=SEA_NODES.findIndex(n=>n.id==='cove');pressed.a=true;c.step(1);ok('voyage_starts',state==='voyage');
for(let i=0;i<200&&state==='voyage';i++)c.step(1);for(let i=0;i<40;i++)c.step(1);reset();
ok('arrive_at_cove',regionAt().id==='cove'&&G.sea.visited.cove===1);
ok('locked_nodes',!SEA_NODES.find(n=>n.id==='volcano').need()&&!SEA_NODES.find(n=>n.id==='lighthouse').need()&&!SEA_NODES.find(n=>n.id==='fortress').need());
talk('pinch');ok('sea_cove_done',G.q.sea_cove===2);
// 3. every island: walk from the dock to every pick-up and person (lava avoided)
window.WALK_AVOID='{';
const bad=[];
for(const [isl,res] of [['cove',['sc0','sc1','sc2','x0','x1','x2']],['reef',[]],['volc',[]],['light',[]]]){}
const arrive=n=>SEA_NODES.find(x=>x.id===n).arrive;
function visit(node,ids,extra){c.tp(arrive(node).x,arrive(node).y);reset();for(const id of ids){const e=ents.find(x=>x.id===id);if(!e){bad.push(id+':missing');continue;}const r=walkTo(e.x,e.y+(e.type==='npc'?18:0));reset();if(!r.ok)bad.push(id+':'+JSON.stringify(r));}}
visit('cove',['sc0','sc1','sc2','x0','x1','x2','polly','sam']);
visit('reef',['coral','hp0']);
G.sea.lv.sails=1;visit('volcano',['ss0','ss1','ss2','ore0','ore1','ember']);
G.sea.lv.hull=1;visit('lighthouse',['gus']);
window.__bad=bad;ok('islands_reachable_on_foot',bad.filter(b=>!b.startsWith('hp0')).length===0);
window.WALK_AVOID='';
// 4. caves
c.tp(arrive('cove').x,arrive('cove').y);reset();const mouth=ents.find(e=>e.id==='cave_in');ok('cave_mouth_reachable',walkTo(mouth.x,mouth.y+20).ok);
P.x=mouth.x;P.y=mouth.y;warpCool=0;updateSeas();for(let i=0;i<60;i++)c.step(1);ok('cave_warp_in',regionAt().id==='cavecove');
const cb=[];for(const id of ['cr0','cr1','cr2']){const e=ents.find(x=>x.id===id);const cur=cellAt();c.tp(7*16+8,(190)*16+12);reset();const r=walkTo(e.x,e.y);reset();if(!r.ok)cb.push(id);}
ok('crates_reachable',cb.length===0);
const out=ents.find(e=>e.id==='cave_out');c.tp(7*16+8,190*16+12);reset();ok('cave_exit_reachable',walkTo(out.x,out.y-16).ok);
P.x=out.x;P.y=out.y;warpCool=0;updateSeas();for(let i=0;i<60;i++)c.step(1);ok('cave_warp_out',regionAt().id==='cove');
// 5. skills
G.sea.visited={cove:1,reef:1,volcano:1,lighthouse:1};G.skills.add('dash');
ok('dive_pool_needs_dive',(()=>{c.tp(arrive('reef').x,arrive('reef').y);reset();const p=ents.find(e=>e.id==='pool1');P.x=p.x;P.y=p.y;warpCool=0;updateSeas();for(let i=0;i<30;i++)c.step(1);return regionAt().id==='reef';})());
talk('coral');ok('dive_training_started',G.train.dive===1&&ents.filter(e=>e.type==='item'&&e.kind==='conch').length===3);
const cres=ents.filter(e=>e.type==='item'&&e.kind==='conch').map(e=>walkTo(e.x,e.y).ok);reset();ok('conchs_reachable',cres.every(Boolean));
G.items.conch=3;talk('coral');ok('dive_training_done',G.train.dive===2);G.skills.add('dive');
const pool=ents.find(e=>e.id==='pool1');c.tp(arrive('reef').x,arrive('reef').y);reset();walkTo(pool.x,pool.y+14);P.x=pool.x;P.y=pool.y;warpCool=0;updateSeas();for(let i=0;i<60;i++)c.step(1);
ok('dive_works',regionAt().id==='deepreef'&&G.air>AIR_MAX-200);
for(let i=0;i<AIR_MAX-100;i++)updateSeas();ok('air_drains',G.air<200&&inDeep());
for(let i=0;i<400;i++)updateSeas();for(let i=0;i<80;i++)c.step(1);ok('surface_when_out_of_air',regionAt().id==='reef'&&G.air===AIR_MAX);
// deep reef: reachability of pearls, planks, bell underwater
c.tp(arrive('reef').x,arrive('reef').y);reset();walkTo(pool.x,pool.y+14);P.x=pool.x;P.y=pool.y;warpCool=0;updateSeas();for(let i=0;i<60;i++)c.step(1);reset();
const dres={};for(const id of ['pe0','pe1','pe2','wbell','hp0','hp1','hp2','hp3']){c.tp(spx('deep',7,5).x,spx('deep',7,5).y);reset();const e=ents.find(x=>x.id===id);dres[id]=e?walkTo(e.x,e.y).ok:false;reset();}
ok('deep_reef_items_reachable',Object.values(dres).every(Boolean));
// 6. dash and cannon peck and sea legs
G.skills.add('dash');G.skills.add('cpeck');G.skills.add('sealegs');reset();c.tp(arrive('cove').x,arrive('cove').y);reset();
P.dir=3;tryDash();ok('dash_starts',P.dashT>0&&P.inv>=18);const x0=P.x;for(let i=0;i<14;i++)c.step(1);ok('dash_moves_pip',Math.abs(P.x-x0)>20);
const cr=ents.find(e=>e.type==='crab'&&regionOfPos(e.x,e.y).id==='cove');c.tp(cr.x-30,cr.y);reset();P.dir=3;cr.cool=0;cannonPeck();ok('cannon_peck_stuns',cr.stun>0&&cr.kt>0);
hurt({x:P.x-5,y:P.y});ok('sea_legs_no_knockback',P.kt===0);reset();
// 7. enemies
const gull=ents.find(e=>e.type==='gullp');c.tp(gull.hx,gull.hy+30);reset();P.inv=0;gull.t=200;for(let i=0;i<8;i++)updGull(gull);ok('gull_notices',gull.st==='tell'||gull.st==='dive');
for(let i=0;i<80;i++)updGull(gull);ok('gull_swoops_and_hurts_or_misses',gull.st!=='patrol'||G.hearts<=maxHearts());
gullKnock(gull);ok('gull_peck_sends_away',gull.gone>0);
// 8. quests
G.skills.delete('cpeck');
G.sea.salv={sailcloth:0,hullplank:0,cannonpart:0};for(const k of ['crate','pearl','wreckbell','sunstone','ironore','powderkeg','conch'])G.items[k]=0;
// x marks
c.tp(arrive('cove').x,arrive('cove').y);reset();
for(const id of ['x0','x1','x2']){const e=ents.find(x=>x.id===id);P.x=e.x;P.y=e.y+12;P.dir=1;seaPeck(e,frontPoint(),{x:e.x-8,y:e.y-8,w:16,h:16});}
ok('chest_rises',G.sea.chest===1&&ents.some(e=>e.type==='seachest'));
talk('polly');ok('polly_started',G.q.sea_xmarks===1);
const ch=ents.find(e=>e.type==='seachest');const sd=G.seeds;openSeaChest(ch);reset();ok('chest_gives_loot',G.sea.chest===2&&G.seeds===sd+4&&G.sea.salv.hullplank===1);
talk('polly');ok('polly_done',G.q.sea_xmarks===2);
// smugglers
talk('sam');ok('sam_started',G.q.sea_smug===1);G.items.crate=3;talk('sam');ok('sam_done',G.q.sea_smug===2&&G.sea.salv.sailcloth===1);
// pearls and bell
talk('coral');G.items.pearl=3;talk('coral');ok('coral_pearls_done',G.q.sea_pearl===2);
talk('coral');ok('coral_wreck_started',G.q.sea_wreck===1);G.items.wreckbell=1;talk('coral');ok('coral_wreck_done',G.q.sea_wreck===2&&G.sea.salv.hullplank===2);
// ember: training, sunstones, forge
talk('ember');ok('ember_training_started',G.train.cpeck===1);G.items.powderkeg=3;talk('ember');ok('ember_training_done',G.train.cpeck===2);G.skills.add('cpeck');
talk('ember');ok('ember_springs_started',G.q.sea_springs===1);G.items.sunstone=3;talk('ember');ok('ember_springs_done',G.q.sea_springs===2);
talk('ember');ok('forge_started',G.q.sea_forge===1);G.items.ironore=2;talk('ember');ok('forge_done',G.q.sea_forge===2&&G.sea.salv.cannonpart===2);
// 9. ship upgrades
G.sea.lv={sails:0,hull:0,cannon:0};G.sea.salv.sailcloth=3;G.sea.salv.hullplank=4;G.sea.salv.cannonpart=2;
const s0=G.seeds;for(const u of SHIP_UPGRADES)buyUpgrade(u);ok('upgrades_bought',G.sea.lv.sails&&G.sea.lv.hull&&G.sea.lv.cannon&&G.seeds===s0-45&&G.sea.salv.sailcloth===0);
ok('nodes_unlock',SEA_NODES.find(n=>n.id==='volcano').need()&&SEA_NODES.find(n=>n.id==='lighthouse').need()&&!SEA_NODES.find(n=>n.id==='fortress').need());
// 10. lighthouse puzzle
c.tp(arrive('lighthouse').x,arrive('lighthouse').y);reset();talk('gus');ok('gus_started',G.q.sea_light===1);
const br=Object.fromEntries(ents.filter(e=>e.type==='brazier').map(e=>[e.sym,e]));
lightBrazier(br.moon);ok('wrong_order_fizzles',G.sea.lamps===0);
for(const k of SUN_ORDER)lightBrazier(br[k]);ok('lighthouse_lit',G.flags.lit===1&&G.sea.lamps===4);
talk('gus');ok('gus_done',G.q.sea_light===2);
ok('fortress_unlocked',SEA_NODES.find(n=>n.id==='fortress').need());
// 11. boss
G.skills.add('dash');reset();talk('pinch');ok('boss_quest_started',G.q.sea_boss===1);
c.tp(arrive('fortress').x,arrive('fortress').y);reset();fortressArrive();ok('stage1_starts',BOSS&&BOSS.st===1&&!!bossEnt());
BOSS.intro=0;const b=bossEnt();b.st='land';b.t=0;const hp0=BOSS.hp;bossHit(1);ok('boss_peck_hurts',BOSS.hp===hp0-1);
bossHit(1);bossHit(1);bossHit(2);ok('stage1_ends_dazed',bossEnt()&&bossEnt().st==='dazed');
for(let i=0;i<60;i++){const e=bossEnt();if(!e||e.dead)break;updBoss(e);}ok('stage_clear_saves_progress',G.sea.boss===2);
for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}reset();
ok('stage2_starts',BOSS&&BOSS.st===2&&!!bossEnt());BOSS.intro=0;
bossEnt().t=69;updBoss(bossEnt());ok('barrels_thrown',ents.some(e=>e.type==='barrel'));
const bar=ents.find(e=>e.type==='barrel');for(let i=0;i<40;i++)updBarrel(bar);ok('barrel_rolls',bar.st==='roll');
bar.x=P.x+6;bar.y=P.y-4;seaFlap(1,0);ok('flap_sends_barrel_back',bar.st==='back');
const hp2=BOSS.hp;bar.x=bossEnt().x+4;bar.y=bossEnt().y;updBarrel(bar);ok('barrel_hits_boss',BOSS.hp===hp2-1);
BOSS.hp=1;const bar2={type:'barrel',st:'back',x:bossEnt().x+2,y:bossEnt().y,dead:false};ents.push(bar2);updBarrel(bar2);
for(let i=0;i<60;i++){const e=bossEnt();if(!e||e.dead)break;updBoss(e);}for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}
ok('stage3_chase',state==='chase'&&CH.hp===3);
CH.intro=0;CH.dashT=14;CH.dashCd=60;CH.bstun=0;CH.x=CH.bx-5;CH.y=CH.by;updateChase();ok('chase_hit',CH.hp===2);
for(let k=0;k<2;k++){CH.bstun=0;CH.bx=200;CH.dashT=14;CH.x=CH.bx-5;CH.y=CH.by;updateChase();}
ok('chase_win',G.flags.seas===1&&G.q.sea_boss===2&&G.flags.skyMap===1&&state==='rankup'&&RU.to===9);
for(let i=0;i<170;i++)c.step(1);pressed.a=true;c.step(1);for(let i=0;i<30;i++)c.step(1);pressed.a=true;c.step(1);
for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}
let g=0;while(state==='pinch'&&g++<900){pressed.a=true;c.step(4);}
ok('ending_scene_done',G.rank===9&&state!=='pinch');
for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}reset();
// 12. retry instead of fainting at the boss
G.sea.boss=1;c.tp(arrive('fortress').x,arrive('fortress').y);reset();fortressStart();G.hearts=1;P.inv=0;hurt({x:P.x,y:P.y});ok('boss_retry_not_faint',state!=='faint'&&G.hearts===maxHearts());
// 13. save round trip
reset();c.tp(arrive('harbor').x,arrive('harbor').y);save();const sv=JSON.parse(localStorage.getItem('chicklandia_save_v2'));ok('save_has_sea',!!sv.sea&&sv.sea.lv.cannon===1);
c.continueGame();G=c.G;ok('load_keeps_sea',G.sea.open&&G.sea.lv.cannon===1&&G.flags.seas===1&&G.rank===9);
// F at sea opens the sea chart (never the sky map, which has no node for the sea) from the flagship and every island
for(const n of ['fortress','cove','reef','volcano','lighthouse']){const a=SEA_NODES.find(x=>x.id===n).arrive;reset();c.tp(a.x,a.y);G.sea.boss=4;pressed.fly=true;c.step(1);ok('F_sails_from_'+n,state==='sail');state='play';SAIL=null;}
// the sea must never connect to the land by swimming or walking off an edge (the village sits on the map right above the cove and the reef)
{let crossed=0,tried=0;for(const k in CELL){const a=CELL[k];if(!a.region.sea||!ROAM.has(k))continue;for(const [dx,dy,key] of [[0,-1,'up'],[0,1,'down'],[-1,0,'left'],[1,0,'right']]){const nk=(a.sx+dx)+','+(a.sy+dy),n=CELL[nk];if(!n||n.region.sea)continue;
  for(let t=0;t<12;t++){reset();const ex=dx===0?a.sx*256+16+t*20:(dx<0?a.sx*256+14:a.sx*256+242),ey=dy===0?a.sy*192+30+t*12:(dy<0?a.sy*192+34:a.sy*192+186);c.tp(ex,ey);if(pBlocked(P.x,P.y))continue;tried++;keys[key]=true;for(let i=0;i<150;i++)c.step(1);keys[key]=false;if(!regionAt()||!regionAt().sea)crossed++;}}}ok('sea_edges_closed',tried>10&&crossed===0);}
R.allPass=Object.values(R).every(v=>v===true);return R;
})()
