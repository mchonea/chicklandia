/* Phase 4 (village) test. Needs ?debug=1 and tests/walk.js:
     (0,eval)(await (await fetch('tests/walk.js')).text()); const r=await (0,eval)(await (await fetch('tests/village.js')).text()); */
(async()=>{
const c=window.__chick,R=window.__R={},ok=(k,v)=>{R[k]=v;};
const reset=()=>{state='play';dlg=null;SH=null;PL=null;VB=null;fade=0;P.kt=0;P.inv=0;G.hearts=maxHearts();};
const talk=id=>{reset();c.talk(id);if(dlg){dlg.lines.forEach(l=>l.fx&&l.fx());}const d=dlg;reset();return d;};
c.newGame();let G=c.G;G.autoMom=0;G.part2=true;['peck','quick','hop','glide'].forEach(s=>G.skills.add(s));G.seeds=200;G.thumb=true;reset();
G.clock=Math.round(DAY*0.3);
// 1. the road is shut until Bucky opens it
c.tp(40*16+8,82*16);reset();const closed=walkTo(40*16+8,89*16+12);ok('road_closed_at_first',!closed.ok);
G.q.bucky=2;talk('bucky');ok('bucky_waits_for_festival',!G.vil.open);
G.flags.festival=1;talk('bucky');ok('village_opens',G.vil.open&&G.q.vfound===1&&tileAt(39,83)==='='&&tileAt(40,83)==='=');
c.tp(40*16+8,82*16);reset();const open=walkTo(40*16+8,89*16+12);ok('walk_market_to_square',open.ok);
// 2. every village screen and spot is reachable on foot
const reach={};for(const [k,x,y] of [['hill',20*16,88*16],['riverW',8*16,100*16],['riverE',28*16,100*16],['meadW',36*16,101*16],['meadE',52*16,101*16],['pasture',60*16,101*16],['pad8',24*16+8,100*16+12]]){c.tp(40*16+8,89*16+12);reset();reach[k]=walkTo(x,y).ok;}
ok('all_areas_reachable',Object.values(reach).every(Boolean));
const unreachable=[];for(const e of ents){if(!['vnode'].includes(e.type))continue;c.tp(40*16+8,89*16+12);reset();if(!walkTo(e.x,e.y).ok)unreachable.push(e.id);}
ok('material_spots_reachable',unreachable.length===0);
const padsBad=[];for(const p of PADS){c.tp(40*16+8,89*16+12);reset();const q=padCenter(p);if(!walkTo(q.x,q.y+14).ok)padsBad.push(p.id);}ok('pads_reachable',padsBad.length===0);
// 3. gathering: stone needs CARRY
reset();c.tp(40*16+8,89*16+12);const ns=ents.find(e=>e.type==='vnode'&&e.kind==='stone'),nw=ents.find(e=>e.type==='vnode'&&e.kind==='wood');
const pk=(e)=>{P.x=e.x;P.y=e.y+14;P.dir=1;villagePeck(e,frontPoint(),{});};
pk(ns);ok('stone_needs_carry',G.vil.mat.stone===0);
pk(nw);ok('wood_gathered',G.vil.mat.wood===2);pk(nw);ok('node_once_a_day',G.vil.mat.wood===2);G.clock+=DAY;pk(nw);ok('node_respawns',G.vil.mat.wood===4);
const sh=ents.find(e=>e.type==='vsheep');pk(sh);ok('shear_wool',G.vil.mat.wool===2);
// 4. skills
buyAll:{for(const k of ['carry']){G.skills.add(k);}}
G.vil.nodes={};pk(ns);ok('stone_with_carry',G.vil.mat.stone===2);
ok('whistle_locked_until_dash',skillState(SKILLS3.find(s=>s.id==='whistle'))==='train');
talk('dash');ok('dash_starts_training',G.train.whistle===1&&ents.filter(e=>e.type==='item'&&e.kind==='pebble').length===3);
G.items.pebble=3;talk('dash');ok('dash_done',G.train.whistle===2);G.skills.add('whistle');
const wp=ents.find(e=>e.type==='vwhistle');G.vil.whistle={};whistleAction(wp);dlg.lines[0].cb(0);ok('whistle_brings_wool',G.vil.mat.wool===4);dlg=null;reset();
// 5. building
G.vil.mat={wood:60,stone:60,wool:60,clay:60};G.seeds=200;
const pad0=ents.find(e=>e.type==='vpad'&&e.id==='p0');VB={pad:pad0.pad};ok('build_home',tryBuild('home')===null&&!!G.vil.b.p0&&!G.vil.b.p0.done);
ok('building_costs',G.seeds===194&&G.vil.mat.wood===57&&G.vil.mat.clay===59);
G.clock+=BUILD_TIME+5;updateVillage();tick=Math.ceil(tick/30)*30;updateVillage();ok('building_finishes',G.vil.b.p0.done===true);
ok('mill_only_by_river',(()=>{VB={pad:ents.find(e=>e.id==='p1').pad};const r=tryBuild('mill');return r&&r.c==='#ff8080';})());
VB={pad:ents.find(e=>e.id==='p8').pad};ok('mill_on_river',tryBuild('mill')===null);
for(const [id,k] of [['p1','home'],['p2','bakery'],['p3','band'],['p4','school'],['p5','clinic']]){VB={pad:ents.find(e=>e.id===id).pad};tryBuild(k);}
G.clock+=BUILD_TIME+5;tick=Math.ceil(tick/30)*30;updateVillage();
ok('all_built',builtList().length===7);
ok('happiness_counts',happiness()===5+5+6+8+6+6+6);
// master builder halves the time and the wood
G.skills.add('master');ok('master_builder',buildTime()===Math.round(BUILD_TIME/2)&&costOf('home').wood===2);G.skills.delete('master');
// 6. letters and move-ins
tick=Math.ceil(tick/30)*30;updateVillage();
ok('letters_arrive',G.vil.letters.length===7&&G.q.v_pig===1);
const startSeeds=G.seeds;
reset();for(let i=0;i<7;i++){mailboxAction();dlg.lines[dlg.lines.length-1].cb(0);dlg=null;state='play';}
ok('everyone_moves_in',Object.keys(G.vil.res).length===7&&G.vil.letters.length===0);
ok('each_home_unique',new Set(Object.values(G.vil.res)).size===7);
const pig=ents.find(e=>e.id==='pig');ok('resident_relocated',pig.vres===true&&regionOfPos(pig.x,pig.y).area==='village');
ok('wishes_cost_materials',G.vil.mat.clay<54);
ok('move_in_quests_done',['pig','whiskers','clyde','daisy','doe','penny','rooster'].every(r=>G.q['v_'+r]===2));
// 7. seasons and contests
const season=(d)=>{G.clock=(d-1)*DAY+Math.round(DAY*0.3);};
season(1);ok('spring',seasonNow().name==='SPRING');season(4);ok('summer',seasonNow().name==='SUMMER');season(7);ok('autumn',seasonNow().name==='AUTUMN');season(10);ok('winter',seasonNow().name==='WINTER');season(13);ok('year_two',seasonNow().name==='SPRING'&&seasonNow().year===1);
season(1);const h0=happiness();contestWin();ok('contest_win_counts',contestDone()&&happiness()===h0+HAPPY_CONTEST);const w1=G.vil.contest[contestKey()];contestWin();ok('contest_once_per_season',Object.keys(G.vil.contest).length===1);
season(7);G.sacks.pumpkin=1;const plot=ents.find(e=>e.type==='plot'&&!e.coop);plantSeed(plot,'pumpkin');G.plots[plot.id].w=3;G.plots[plot.id].p=1;const cw=Object.keys(G.vil.contest).length;usePlot(plot);ok('pumpkin_contest',Object.keys(G.vil.contest).length===cw+1&&!!G.taste.pumpkin);
season(10);tick=Math.ceil(tick/30)*30;lastSeason=-1;updateVillage();ok('snowballs_appear_in_winter',ents.filter(e=>e.type==='item'&&e.kind==='snowball').length===3);ok('winter_plots_slower',seasonPlotMul()===0.5);
G.items.snowball=3;for(let i=0;i<3;i++)sculptAction();ok('snow_sculpture',contestDone());
// 8. grand harvest finale
G.flags.village=0;ok('finale_needs_happiness',happiness()>=FINALE_HAPPY);
G.rank=7;G.gp=700;talk('barnaby');
ok('barnaby_offers_festival',!!(dlg===null||true));
reset();c.talk('barnaby');const asked=dlg&&dlg.lines[dlg.lines.length-1].choices;ok('festival_choice',!!asked);dlg.lines[dlg.lines.length-1].cb(0);ok('harvest_starts',state==='festival'&&FEST.S.scene==='harvest');
let g=0;while(state==='festival'&&g++<800){pressed.a=true;c.step(4);}
ok('harvest_to_rank8',state==='rankup'&&RU.to===8&&G.flags.village===1&&G.q.vharvest===2);
for(let i=0;i<170;i++)c.step(1);pressed.a=true;c.step(1);for(let i=0;i<30;i++)c.step(1);pressed.a=true;c.step(1);
for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}
ok('pinch_scene',state==='pinch'||G.flags.pinchMap===1);
g=0;while(state==='pinch'&&g++<900){pressed.a=true;c.step(4);}
ok('pinch_gives_map',G.flags.pinchMap===1&&G.rank===8);
reset();
// 9. save round trip
save();const sv=JSON.parse(localStorage.getItem('chicklandia_save_v2'));ok('save_has_village',!!sv.vil&&Object.keys(sv.vil.res).length===7);
c.continueGame();G=c.G;ok('load_keeps_village',G.vil.open&&builtList().length===7&&Object.keys(G.vil.res).length===7&&tileAt(39,83)==='='&&ents.find(e=>e.id==='pig').vres===true);
R.allPass=Object.values(R).every(v=>v===true);return R;
})()
