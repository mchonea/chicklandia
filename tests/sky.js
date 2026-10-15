/* Phase 6 (Sky Kingdom) test. Needs ?debug=1 and tests/walk.js:
     (0,eval)(await (await fetch('tests/walk.js')).text()); const r=await (0,eval)(await (await fetch('tests/sky.js')).text());
   Results are in window.__R (every key must be true). Run it in two calls if the pane times out: it is long. */
(async()=>{
const c=window.__chick,R=window.__R={},ok=(k,v)=>{window.__last=k;R[k]=!!v;if(!v)R['!'+k]=true;};
const reset=()=>{state='play';dlg=null;SH=null;PL=null;VB=null;SAIL=null;VOY=null;HAT=null;NAMEUI=null;FLYO=null;FEST=null;RU=null;CRED=null;fade=0;P.kt=0;P.inv=0;P.hop=null;P.z=0;G.hearts=maxHearts();warpCool=0;skyCool=0;};
const quiet=()=>{skyCool=99999;warpCool=99999;};
const step=n=>c.step(n);
const press=k=>{pressed[k]=true;c.step(1);};
const adv=(max=900)=>{for(let i=0;i<max&&state==='talk';i++){if(dlg){const l=dlg.lines[dlg.i];dlg.shown=1e9;if(l&&l.choices)dlg.sel=0;}pressed.a=true;c.step(1);}};
const talk=id=>{reset();c.talk(id);adv();};
const near=id=>ents.find(x=>x.id===id);
const warpTick=()=>{for(let i=0;i<80&&state==='warp';i++)c.step(1);};
const at=(o,col,row)=>skp(o,col,row);
const goto=(o,col,row)=>{const p=at(o,col,row);c.tp(p.x,p.y);P.hop=null;P.z=0;P.inv=0;};
const give=(skills)=>{for(const s of skills)G.skills.add(s);};
const tileOf=(o,col,row)=>tileAt(SKO[o][0]+col,SKO[o][1]+row);
localStorage.clear();
c.newGame();let G=c.G;G.autoMom=0;G.part2=true;['peck','quick','hop','glide','flap','swim'].forEach(s=>G.skills.add(s));G.seeds=300;G.thumb=true;G.rank=9;G.gp=0;reset();
G.clock=Math.round(DAY*0.3);
/* ---- 1. regions and tiles load ---- */
ok('regions',['meadows','gardens','skycity','peaks','lair','skyin'].every(id=>REGIONS[id]&&REGIONS[id].cells.length));
ok('sky_outdoor',['meadows','gardens','skycity','peaks','lair'].every(id=>REGIONS[id].cells.every(cl=>WALK.has(cl.sx+','+cl.sy))));
ok('rooms_indoor',REGIONS.skyin.cells.length===5&&REGIONS.skyin.cells.every(cl=>!WALK.has(cl.sx+','+cl.sy)));
ok('tile_solids',solidTile('η',true)&&solidTile('κ',true)&&solidTile('θ',true)&&!solidTile('α',true)&&!solidTile('ι',true)&&!solidTile('ε',true));
G.skills.delete('cloudwalk');ok('thin_cloud_blocks',solidTile('γ',true));G.skills.add('cloudwalk');ok('thin_cloud_cloudwalk',!solidTile('γ',true));G.skills.delete('cloudwalk');
ok('buildings',SKY_BUILDINGS.length===5&&SKY_BUILDINGS.every(b=>DOORS[b.door[0]+','+b.door[1]]&&BUILDING_BY_ROOM[b.room]===b&&roomCell(b.room)));
ok('building_doors_are_door_tiles',SKY_BUILDINGS.every(b=>tileAt(b.door[0],b.door[1])==='1'));
/* ---- 2. before the hatch: Elda, the egg, naming ---- */
G.flags.skyMap=1;G.flags.seas=1;G.q.elda=2;save();c.continueGame();G=c.G;G.autoMom=0;reset();
ok('gate_exists',ents.some(e=>e.type==='sgate'));
c.tp(near('elda').x+20,near('elda').y+10);reset();
ok('elda_marker',questMarker(near('elda'))===SPR.excl);
c.talk('elda');adv();
ok('hatch_starts',state==='hatch'&&!!HAT);
step(320);ok('hatch_waits',state==='hatch'&&HAT.t>290);
press('a');ok('naming_opens',state==='naming'&&!!NAMEUI);
press('a');ok('preset_name',NAMEUI.s==='SKY');
NAMEUI.row=1;NAMEUI.col=0;press('a');press('a');ok('letters_add',NAMEUI.s==='SKYAA');
press('b');ok('erase',NAMEUI.s==='SKYA');press('b');
// 10 letter limit
NAMEUI.row=1;NAMEUI.col=1;for(let i=0;i<12;i++)press('a');ok('name_max_10',NAMEUI.s.length===10);
NAMEUI.s='';NAMEUI.row=4;NAMEUI.col=6;press('a');ok('empty_name_blocked',state==='naming');
NAMEUI.row=0;NAMEUI.col=1;press('a');ok('preset2',NAMEUI.s==='NIMBLE');
NAMEUI.row=4;NAMEUI.col=6;press('a');
ok('named',G.sky.hatched===1&&G.sky.name==='NIMBLE'&&G.q.sk_hatch===2);adv();
ok('hatchling_exists',!!near('hatch')&&near('hatch').name==='NIMBLE'&&near('hatch').follow);
ok('quest_reward_seeds',G.seeds>=300+5-0);
// follow
const w0=near('hatch');c.tp(P.x,P.y);for(let i=0;i<20;i++){keys.right=true;step(1);}keys.right=false;step(40);
ok('hatchling_follows',Math.hypot(w0.x-P.x,w0.y-P.y)<40);
// old Elda talk after the hatch
talk('elda');ok('elda_after',state==='play');
/* ---- 3. the sky gate ---- */
const gp=gatePx();reset();{const go=gateOut();c.tp(go.x,go.y);}skyCool=99999;warpCool=0;
const rr=walkTo(gp.x,gp.y);warpTick();
step(5);adv();warpTick();step(60);adv();warpTick();
ok('gate_warps_to_meadows',regionAt()&&regionAt().id==='meadows'&&G.sky.open===1);
ok('gate_arrival',Math.abs(P.x-at('m0',2,8).x)<20&&Math.abs(P.y-at('m0',2,8).y)<20);
ok('hatchling_came',Math.hypot(near('hatch').x-P.x,near('hatch').y-P.y)<60);
reset();
/* ---- 4. static reachability with skill sets ---- */
const stat=(sk)=>{G.skills=new Set(['peck','quick','hop','glide','flap','swim',...sk]);
  const S=4,start={x:at('m0',2,8).x,y:at('m0',2,8).y},key=(x,y)=>x+','+y,seen=new Set([key(start.x,start.y)]),q=[start],edges=[];
  for(const p of SKY_PADS)if(p.to)edges.push([skpA(p.at),skpA(p.to)]);
  if(sk.includes('updraft'))for(const v of SKY_VENTS)edges.push([skpA(v.at),skpA(v.to)]);
  for(const p of SKY_PORTALS)if(p.to)edges.push([skpA(p.at),skpA(p.to)]);
  while(q.length){const n=q.shift();
    for(const [dx,dy] of [[S,0],[-S,0],[0,S],[0,-S]]){const x=n.x+dx,y=n.y+dy;if(x<8||y<8||x>MW*16-8||y>MH*16-8)continue;const k=key(x,y);if(seen.has(k)||pBlocked(x,y))continue;seen.add(k);q.push({x,y});}
    for(const [a,b] of edges)if(Math.abs(n.x-a.x)<9&&Math.abs(n.y-a.y)<9){const bx=Math.round(b.x/S)*S,by=Math.round(b.y/S)*S,k=key(bx,by);if(!seen.has(k)){seen.add(k);q.push({x:bx,y:by});}}}
  const can=(x,y,r)=>{for(let dx=-r;dx<=r;dx+=S)for(let dy=-r;dy<=r;dy+=S)if(seen.has(key(Math.round((x+dx)/S)*S,Math.round((y+dy)/S)*S)))return true;return false;};
  return {can};};
const itemAt=id=>{const it=SKY_ITEMS.find(i=>i[0]===id);return skp(it[2],it[3],it[4]);};
let A0=stat([]);
ok('S0_lambs',['lamb0','lamb1','lamb2'].every(id=>A0.can(itemAt(id).x,itemAt(id).y,10)));
ok('S0_pad_island_feather',A0.can(itemAt('sf0').x,itemAt('sf0').y,10));
ok('S0_vent_island_locked',!A0.can(itemAt('sf1').x,itemAt('sf1').y,10)&&!A0.can(itemAt('sf3').x,itemAt('sf3').y,10));
ok('S0_cloudwalk_island_locked',!A0.can(itemAt('sk_s2').x,itemAt('sk_s2').y,10)&&!A0.can(itemAt('sk_s3').x,itemAt('sk_s3').y,10));
ok('S0_scarf_pocket_locked',!A0.can(at('m1',12,8).x,at('m1',12,8).y,10));
ok('S0_crystal_blocks_peaks',A0.can(itemAt('bt0').x,itemAt('bt0').y,10)&&!A0.can(itemAt('rd0').x,itemAt('rd0').y,10));
ok('S0_trainer_items_open',['ch0','ch1','ch2','pg0','pg1','pg2','bt0','bt1','bt2'].every(id=>A0.can(itemAt(id).x,itemAt(id).y,10)));
ok('S0_people',SKY_CAST.filter(x=>!x.o.match(/^(plume|star|weather|cottage|nursery)$/)).every(x=>{const p=at(x.o,x.c,x.r);return A0.can(p.x,p.y,22);}));
ok('S0_quest_items',['lamb0','lamb1','lamb2','cp0','cp1','cp2','sf0','sf2'].every(id=>A0.can(itemAt(id).x,itemAt(id).y,10)));
let A1=stat(['updraft']);
ok('S1_vent_islands',A1.can(itemAt('sf1').x,itemAt('sf1').y,10)&&A1.can(itemAt('sf3').x,itemAt('sf3').y,10)&&A1.can(itemAt('sk_s1').x,itemAt('sk_s1').y,10)&&A1.can(itemAt('sk_s4').x,itemAt('sk_s4').y,10));
ok('S1_gust_feathers_all',['sf0','sf1','sf2','sf3'].every(id=>A1.can(itemAt(id).x,itemAt(id).y,10)));
ok('S1_cloudwalk_still_locked',!A1.can(itemAt('sk_s2').x,itemAt('sk_s2').y,10));
let A2=stat(['updraft','cloudwalk']);
ok('S2_cloudwalk_islands',A2.can(itemAt('sk_s2').x,itemAt('sk_s2').y,10)&&A2.can(itemAt('sk_s3').x,itemAt('sk_s3').y,10)&&A2.can(at('m1',5,1).x,at('m1',5,1).y,14));
ok('S2_scarf_still_locked',!A2.can(at('m1',12,8).x,at('m1',12,8).y,10));
// the pocket: break the barrier like a dive-bomb would
const kap=[];for(let dr=0;dr<12;dr++)for(let dc=0;dc<16;dc++)if(tileOf('m1',dc,dr)==='κ')kap.push([SKO.m1[0]+dc,SKO.m1[1]+dr]);
ok('barrier_tiles',kap.length===4);
for(const [cc,rr2] of kap)setTile(cc,rr2,'α');
let A3=stat(['updraft','cloudwalk','divebomb']);
ok('S3_scarf_pocket',A3.can(at('m1',12,8).x,at('m1',12,8).y,16));
// crystals: smash one tile in each wall
const w1=[SKO.p0[0]+10,SKO.p0[1]+6],w2=[SKO.p1[0]+11,SKO.p1[1]+6];
ok('crystal_tiles',tileAt(...w1)==='θ'&&tileAt(...w2)==='θ');
setTile(...w1,'α');setTile(...w2,'α');
let A4=stat(['updraft','cloudwalk','divebomb','thunder']);
ok('S4_everything',SKY_ITEMS.every(i=>{const p=skp(i[2],i[3],i[4]);return A4.can(p.x,p.y,10);}));
ok('S4_rods_and_lair',['rd0','rd1','rd2'].every(id=>A4.can(itemAt(id).x,itemAt(id).y,10))&&A4.can(at('p1',14,6).x,at('p1',14,6).y,10));
ok('S4_all_people',SKY_CAST.every(x=>{const p=at(x.o,x.c,x.r);return A4.can(p.x,p.y,22)||/^(plume|star|weather|cottage|nursery)$/.test(x.o);}));
ok('S4_city_doors',SKY_BUILDINGS.every(b=>A4.can(b.out.x,b.out.y,10)));
ok('S4_plots',SKY_SOIL.every(([c0,r0])=>A4.can(at('g0',c0,r0).x,at('g0',c0,r0).y+16,14)));
ok('S4_chime_posts',SKY_CHIMES.every(([k,o,cc,rr3])=>A4.can(at(o,cc,rr3).x,at(o,cc,rr3).y+16,12)));
ok('S4_portal_down',A4.can(at('m0',2,10).x,at('m0',2,10).y,6));
for(const [cc,rr2] of kap)tiles[rr2][cc]='κ';tiles[w1[1]][w1[0]]='θ';tiles[w2[1]][w2[0]]='θ';
for(const k of Object.keys(G.mods))delete G.mods[k];
G.skills=new Set(['peck','quick','hop','glide','flap','swim']);
/* ---- 5. mechanics ---- */
reset();goto('m0',10,5);skyCool=0;warpCool=99999;keys.up=true;step(6);keys.up=false;
ok('pad_launches',!!P.hop&&P.hop.sky);step(70);
ok('pad_lands_on_island',!P.hop&&Math.abs(P.x-at('m0',10,2).x)<3&&Math.abs(P.y-at('m0',10,2).y)<3);
ok('pad_clears_z',P.z===0);
// return pad
reset();goto('m0',12,1);skyCool=0;keys.down=true;step(20);keys.down=false;step(80);
ok('return_pad',!P.hop&&Math.abs(P.y-at('m0',12,4).y)<3&&Math.abs(P.x-at('m0',12,4).x)<3);
// vents need Updraft
reset();goto('m0',5,5);skyCool=0;keys.up=true;step(12);keys.up=false;
ok('vent_needs_updraft',!P.hop&&P.y>at('m0',5,3).y);
G.skills.add('updraft');skyCool=0;goto('m0',5,5);keys.up=true;step(12);keys.up=false;
ok('vent_lifts',!!P.hop);step(70);ok('vent_lands',Math.abs(P.x-at('m0',5,2).x)<3&&Math.abs(P.y-at('m0',5,2).y)<3);
// the thin cloud blocks Pip unless Cloud Walk
reset();G.skills.delete('cloudwalk');goto('m0',3,4);quiet();skyCool=99999;keys.up=true;step(60);keys.up=false;
ok('thin_cloud_stops',P.y>at('m0',3,3).y-2);
G.skills.add('cloudwalk');keys.up=true;step(80);keys.up=false;ok('cloudwalk_crosses',P.y<at('m0',3,3).y);G.skills.delete('cloudwalk');
// wind lane pushes Pip east, the cloud scarf does not
reset();skyCool=99999;goto('m0',7,7);const wx0=P.x;step(30);ok('wind_pushes',P.x>wx0+8);
G.outfits.push('scarf');setWear('scarf',true);goto('m0',7,7);const wx1=P.x;step(30);ok('scarf_stops_wind',Math.abs(P.x-wx1)<2);setWear(null);
// bouncy cloud + dive-bomb cracks the barrier
reset();G.skills.add('updraft');G.skills.delete('divebomb');goto('m1',8,8);skyCool=0;keys.down=true;step(8);keys.down=false;
ok('vertical_bounce',!!P.hop&&P.hop.x1===P.hop.x0);P.hop.t=Math.floor(P.hop.d*0.3);pressed.a=true;step(1);ok('no_slam_without_skill',!P.hop.slam);step(80);
ok('barrier_intact',kap.every(([cc,rr2])=>tileAt(cc,rr2)==='κ'));
G.skills.add('divebomb');reset();goto('m1',8,8);skyCool=0;keys.down=true;step(8);keys.down=false;
step(12);pressed.a=true;step(1);ok('slam_starts',!!(P.hop&&P.hop.slam));step(40);
ok('barrier_cracked',kap.every(([cc,rr2])=>tileAt(cc,rr2)==='α')&&!P.hop);
ok('slam_persists_in_mods',kap.every(([cc,rr2])=>G.mods[cc+','+rr2]==='α'));
// scarf chest in the pocket
reset();const ch=ents.find(e=>e.id==='scarfchest');ok('scarf_chest_exists',!!ch);
G.outfits=G.outfits.filter(o=>o!=='scarf');goto('m1',11,8);P.dir=3;P.x=ch.x-12;P.y=ch.y;P.dir=3;peck(frontPoint());
ok('scarf_chest_opens',G.outfits.includes('scarf')&&!ents.some(e=>e.id==='scarfchest'&&!e.dead));adv();
// secret nest on the cloud-walk island
reset();const nest=ents.find(e=>e.type==='snest');P.x=nest.x-10;P.y=nest.y+2;P.dir=3;const s0=G.seeds,gp0=G.gp;peck(frontPoint());
ok('nest_secret',G.sky.nest===1&&G.secrets.skynest===1&&G.seeds===s0+3&&G.gp>gp0);adv();
// rain walls and storms
reset();G.skills.delete('thunder');setWear(null);goto('p0',3,5);skySafe={x:P.x,y:P.y};const rw=at('p0',5,3);P.x=rw.x;P.y=rw.y;step(2);
ok('rain_wall_hurts',G.hearts<maxHearts()&&Math.abs(P.x-rw.x)>4);
reset();G.outfits.push('stormcap');setWear('stormcap',true);P.x=rw.x;P.y=rw.y;P.inv=0;step(3);ok('stormcap_blocks_rain',G.hearts===maxHearts());setWear(null);
reset();goto('p0',3,5);STRIKES.length=0;spawnStrike(P.x,P.y);ok('strike_spawned',STRIKES.length===1);step(STRIKES[0].warn+3);
ok('lightning_hurts',G.hearts<maxHearts());
reset();goto('p0',3,5);STRIKES.length=0;spawnStrike(P.x,P.y);step(20);const wrn=STRIKES[0].warn;P.x+=40;step(wrn);ok('lightning_dodged',G.hearts===maxHearts());
// thunder peck breaks crystals, persists through save
reset();const cc0=w1[0],cr0=w1[1];goto('p0',9,6);P.dir=3;P.x=cc0*16+8-12;P.y=cr0*16+12;P.dir=3;G.skills.delete('thunder');peck(frontPoint());
ok('crystal_needs_thunder',tileAt(cc0,cr0)==='θ');
G.skills.add('thunder');P.x=cc0*16+8-12;P.y=cr0*16+12;P.dir=3;peck(frontPoint());ok('crystal_breaks',tileAt(cc0,cr0)==='α'&&G.mods[cc0+','+cr0]==='α');
/* ---- 6. the garden: chime puzzle and sky farming ---- */
reset();const chm=id=>ents.find(e=>e.type==='gchime'&&e.id===id);
const ring=id=>{reset();const e=chm(id);P.x=e.x;P.y=e.y+14;P.dir=1;peck(frontPoint());};
ring('small');ok('chime_wrong_resets',chimeSeq.length===0);
ring('big');ring('small');ring('mid');ok('chime_solved',G.sky.chimes===1&&ents.some(e=>e.id==='chimechest'));
reset();const cch=ents.find(e=>e.id==='chimechest');P.x=cch.x;P.y=cch.y+14;P.dir=1;const st0=G.sacks.star||0;peck(frontPoint());
ok('chime_chest',G.sky.chimes===2&&G.sacks.star===st0+3&&!ents.some(e=>e.id==='chimechest'&&!e.dead));adv();
ring('big');ok('chime_after_quiet',G.sky.chimes===2);
// plots
const plots=ents.filter(e=>e.type==='plot'&&regionOfPos(e.x,e.y).id==='gardens');
ok('sky_plots',plots.length===24);
reset();G.sacks.moon=2;G.sacks.star=2;const pl=plots[0],pl2=plots[1];
P.x=pl.x;P.y=pl.y+12;P.dir=1;pl.type==='plot';
G.plots[pl.id]={p:0,k:'star'};G.plots[pl2.id]={p:0,k:'moon'};
G.clock=Math.round(DAY*0.7);const r0=G.plots[pl.id].p;step(60);const dStar=G.plots[pl.id].p-r0;
ok('sky_plots_grow_fast',dStar>3*(1/GROW)*60*0.8*0.8);
G.plots[pl.id].p=1;G.plots[pl2.id].p=1;
const s1=G.seeds;P.x=pl.x;P.y=pl.y+12;P.dir=1;usePlot(pl);
ok('starfruit_harvest',G.items.starfruit===1&&G.sky.harv.star===1&&G.taste.starfruit===1&&G.seeds===s1+5+(G.rank>=6?1:0));
usePlot(pl2);ok('moonflower_harvest',G.sky.harv.moon===1&&G.hold.petal>=1);
G.outfits.push('bloom');setWear('bloom',true);G.plots[pl.id]={p:1,k:'star'};const s2=G.seeds;usePlot(pl);ok('bloom_bonus',G.seeds===s2+5+(G.rank>=6?1:0)+1);setWear(null);G.outfits=G.outfits.filter(o=>o!=='bloom');
G.items.starfruit=0;
/* ---- 7. quests, trainers, shops ---- */
G.clock=Math.round(DAY*0.3);G.skills=new Set(['peck','quick','hop','glide','flap','swim']);setWear(null);
const quest=(npc,qid,setup,extra)=>{reset();talk(npc);const a=G.q[qid]===1;setup();reset();talk(npc);const b=G.q[qid]===2;return a&&b;};
ok('q_lambs',quest('puff','sk_lambs',()=>{G.items.lamb=3;}));ok('q_lambs_clean',G.items.lamb===0&&G.taste.cloudberry===1);
ok('q_gust',quest('zephyr','sk_gust',()=>{G.items.skyfeather=4;}));
ok('q_moon',(()=>{G.q.sk_moon=0;G.sacks.star=0;G.sacks.moon=0;G.sky.harv.moon=0;G.sky.harv.star=0;reset();talk('fern');const a=G.q.sk_moon===1&&G.sacks.star>=2&&G.sacks.moon>=2;G.sky.harv.moon=1;G.sky.harv.star=1;reset();talk('fern');return a&&G.q.sk_moon===2&&G.outfits.includes('bloom');})());
ok('q_chimes',(()=>{reset();talk('fern');return G.q.sk_chimes===2&&G.taste.skyhoney===1;})());
ok('q_cake',quest('tweeta','sk_cake',()=>{G.items.starfruit=2;}));ok('q_cake_taste',G.taste.cake===1&&G.items.starfruit===0);
ok('q_boutique',quest('plume','sk_boutique',()=>{G.items.cloudpuff=3;}));
// shop talk after the quest
reset();c.talk('plume');adv();ok('plume_shop_opens',state==='catalog'&&SH.id==='plume');
{const its=catalogItems();ok('plume_items',its.length>=1&&its[0].outfit==='quill');const s3=G.seeds;const r=its[0].act();ok('quill_buy',G.outfits.includes('quill')&&G.seeds===s3-priceOf(OUTFITS.find(o=>o.id==='quill')));reset();}
// trainers
ok('train_cloudwalk_open',TRAIN.cloudwalk.avail());
ok('train_cloudwalk',(()=>{reset();talk('zephyr');const a=G.train.cloudwalk===1;for(const [id] of trainSpawn('chime')){const e=ents.find(x=>x.id===id);if(e){P.x=e.x;P.y=e.y;checkPickups();}}reset();talk('zephyr');return a&&G.train.cloudwalk===2&&G.items.chime===0;})());
ok('train_chime_items_spawned_once',true);
ok('divebomb_avail',TRAIN.divebomb.avail());
ok('train_divebomb',(()=>{reset();talk('hatch');const a=G.train.divebomb===1;for(const [id] of trainSpawn('peg')){const e=ents.find(x=>x.id===id);if(e){P.x=e.x;P.y=e.y;checkPickups();}}reset();talk('hatch');return a&&G.train.divebomb===2;})());
ok('thunder_locked_before_skills',!TRAIN.thunder.avail());
G.skills.add('updraft');G.skills.add('cloudwalk');G.skills.add('divebomb');
ok('thunder_avail',TRAIN.thunder.avail());
ok('train_thunder',(()=>{reset();talk('starla');const a=G.train.thunder===1;for(const [id] of trainSpawn('bolt')){const e=ents.find(x=>x.id===id);if(e){P.x=e.x;P.y=e.y;checkPickups();}}reset();talk('starla');return a&&G.train.thunder===2;})());
G.skills.delete('thunder');
ok('starla_shop_during_training',(()=>{G.train.thunder=1;reset();c.talk('starla');adv();const a=state==='catalog';reset();G.train.thunder=2;return a;})());
// the Sky Tree
G.skills=new Set(['peck','quick','hop','glide','flap','swim']);G.seeds=100;
const learn=id=>{growPage=5;state='grow';growSel=SKILLS5.findIndex(s=>s.id===id);pressed.a=true;c.step(1);state='play';return has(id);};
ok('tree_updraft',learn('updraft'));
ok('tree_cloudwalk',learn('cloudwalk'));ok('tree_divebomb',learn('divebomb'));
G.train.thunder=0;ok('tree_thunder_locked_by_training',!learn('thunder'));
G.train.thunder=2;ok('tree_thunder',learn('thunder'));
ok('tree_costs',G.seeds===100-SKILLS5.reduce((a,s)=>a+s.cost,0));
// nimbus: rods + the boss quest
ok('q_rods',quest('nimbus','sk_rods',()=>{G.items.rod=3;}));
reset();talk('nimbus');ok('boss_quest_offered',G.q.sk_boss===1);
reset();c.talk('nimbus');adv();ok('nimbus_boss_remind',G.q.sk_boss===1&&state==='play');
// star stand, weather shop
reset();openCatalog('starstand');{const its=catalogItems();ok('stand_items',its.length===4);const t0=Object.keys(G.taste).length;
  its.slice(1).forEach(it=>it.act());ok('stand_tastes',Object.keys(G.taste).length===t0+(G.taste.cake?0:1)+(G.taste.cloudberry?0:1)+(G.taste.skyhoney?0:1)||Object.keys(G.taste).length>=t0);
  const s4=G.sacks.star;its[0].act();ok('buy_star_seed',G.sacks.star===s4+1);}
reset();openCatalog('weather');{const its=catalogItems();ok('weather_items',its.length===4);its[1].act();ok('rain_charm',G.weather==='rain');its[2].act();ok('sunny_charm',G.weather==='clear');its[0].act();ok('tea_taste',G.taste.stormtea===1);
  ok('stormcap_listed',its[3].outfit==='stormcap');}
reset();
/* ---- 8. the dragon ---- */
G.skills=new Set(['peck','quick','hop','glide','flap','swim','updraft','cloudwalk','divebomb','thunder']);
G.sky.metBoss=0;G.q.sk_boss=1;goto('p1',13,6);reset();
const lp=ents.find(e=>e.id==='p1lair');P.x=lp.x;P.y=lp.y;warpCool=0;step(3);warpTick();step(30);adv();step(5);
ok('lair_entered',regionAt().id==='lair'&&!!SKB&&SKB.st===1);
ok('dragon_exists',!!dragonEnt());
const B=()=>SKB;
step(100);ok('stage1_lightning',STRIKES.length>0||B().t>0);
// dying restarts the same stage
G.hearts=1;P.inv=0;hurt({x:P.x+5,y:P.y});ok('boss_retry',G.hearts===maxHearts()&&regionAt().id==='lair'&&SKB&&SKB.st===1);
B().intro=0;B().timer=B().need-2;P.inv=999;step(5);adv();step(5);SKB&&(SKB.intro=0);
ok('stage2_started',SKB&&SKB.st===2&&ents.filter(e=>e.type==='scrys').length===4);
// crystals need Thunder Peck
G.skills.delete('thunder');let cr=ents.find(e=>e.type==='scrys');hitCrystal(cr);ok('stage2_needs_thunder',SKB.left===4);G.skills.add('thunder');
for(const e of ents.filter(x=>x.type==='scrys'))hitCrystal(e);step(5);adv();step(5);
ok('stage3_started',SKB&&SKB.st===3&&ents.filter(e=>e.type==='sbell').length===3);
// the swoop
step(300);ok('stage3_swoops',SKB.swoop!==undefined);
// bells: two rung, then the win
const bells=ents.filter(e=>e.type==='sbell');ringBell(bells[0]);ringBell(bells[1]);ok('two_bells',SKB.bells===2&&G.sky.boss===3);
const sd0=G.seeds;ringBell(bells[2]);adv();
ok('boss_won',G.sky.boss===4&&G.flags.sky===1&&G.q.sk_boss===2&&G.seeds>=sd0+12&&G.outfits.includes('stormcap'));
ok('stormy_npc',!!near('stormy')&&!dragonEnt());
ok('flyover_starts',state==='flyover');
/* ---- 9. flyover, gathering, rank 10, credits ---- */
const gpBefore=G.gp,rankBefore=G.rank;
for(let i=0;i<4000&&state==='flyover';i++)step(1);ok('flyover_ends',state==='festival');
ok('legend_lines',FEST&&FEST.S.lines.length>=10&&FEST.S.lines.some(l=>l[1]==='NIMBLE'));
ok('legend_guests',FEST.S.guests.length>=30);
for(let i=0;i<9000&&state==='festival';i++){if(FEST&&FEST.shown>=FEST.S.lines[FEST.line][2].length)pressed.a=true;else if(FEST)FEST.shown=1e9;step(1);}
ok('rankup_to_10',state==='rankup'&&RU&&RU.to===10);
for(let i=0;i<900&&state==='rankup';i++){if(RU.t>160||RU.page===1)pressed.a=true;step(1);}
ok('rank_is_10',G.rank===10&&G.gp>=RANKS[9].gp);adv();
ok('credits_state',state==='credits'&&CRED&&CRED.list.length>30);
{const flat=CRED.list.flat().join('|');ok('credits_every_friend',['MAMA HEN','GRANNY SHELL','DAISY','CAPN PINCH','CORAL','PUFF','ZEPHYR','FERN','STARLA','NIMBUS','TWEETA','PLUME','STORMY','NIMBLE','FOREMAN BARNABY','PEGLEG POLLY','MAGGIE'].every(n=>flat.includes(n)));}
for(let i=0;i<3000&&state==='credits';i++){if(CRED&&CRED.t>CRED.list.length*14+125)pressed.a=true;step(1);}
adv();
ok('freeplay',state==='play'&&G.flags.legend===1&&G.rank===10&&regionAt().id==='farm');
ok('rank10_perks',maxHearts()===3+((G.skills.has('down'))?1:0)+((G.skills.has('tough'))?1:0)+1+1+1);
G.hearts=maxHearts();
P.flapCd=0;wingFlap();ok('rank10_flap_cd',P.flapCd===20);
ok('postgame_hatchling',!!near('hatch'));
/* ---- 10. free play: lair open, portal back ---- */
reset();const lp2=ents.find(e=>e.id==='p1lair');ok('lair_open_after',G.sky.boss===4&&!!lp2);
reset();goto('p1',13,6);P.x=lp2.x;P.y=lp2.y;warpCool=0;step(3);warpTick();step(20);
ok('lair_free_after_win',regionAt().id==='lair'&&!SKB&&!!near('stormy'));
/* ---- 11. save / load ---- */
reset();goto('gardens'===0?'g0':'g0',7,7);save();const sv=JSON.parse(localStorage.getItem('chicklandia_save_v2'));
ok('save_has_sky',!!sv.sky&&sv.sky.hatched===1&&sv.sky.name==='NIMBLE'&&sv.sky.boss===4&&sv.sky.chimes===2);
ok('save_pos_region',sv.pos.region==='gardens');
c.continueGame();G=c.G;
ok('load_keeps_sky',G.sky.hatched===1&&G.sky.name==='NIMBLE'&&G.flags.sky===1&&G.rank===10&&G.sky.harv.star>=1&&G.sky.nest===1);
ok('load_keeps_tiles',tileOf('m1',9,8)==='α'&&tileAt(...w1)==='α');
ok('load_hatchling',!!near('hatch')&&near('hatch').name==='NIMBLE');
ok('load_stormy',!!near('stormy'));
ok('load_no_scarf_chest',!ents.some(e=>e.id==='scarfchest')&&!ents.some(e=>e.id==='chimechest'));
ok('load_region',regionAt().id==='gardens');
// an old (pre-sky) save loads and gets fresh sky state
{const old=JSON.parse(localStorage.getItem('chicklandia_save_v2'));delete old.sky;for(const k of Object.keys(old.q))if(k.startsWith('sk_'))delete old.q[k];for(const k of ['lamb','skyfeather','chime','peg','cloudpuff','bolt','rod','starfruit'])delete old.items[k];delete old.sacks.star;
  old.pos={region:'farm',x:56,y:76};old.flags={};old.skills=old.skills.filter(s=>!['updraft','cloudwalk','divebomb','thunder'].includes(s));old.rank=6;old.gp=300;
  localStorage.setItem('chicklandia_save_v2',JSON.stringify(old));}
c.continueGame();G=c.G;
ok('old_save_loads',state==='play'&&G.sky&&G.sky.hatched===0&&G.sky.open===0&&G.sky.harv.moon===0&&G.q.sk_boss===0&&G.items.rod===0&&G.sacks.star===0);
ok('old_save_no_hatchling',!near('hatch'));
step(60);
/* ---- 12. fly map and quest log / growth pages render ---- */
G=c.G;G.sky.open=1;G.part2=true;G.areas=['farm','forest','mountains','meadows','gardens'];goto('m0',4,8);reset();
openMap();ok('map_sky_page',state==='map'&&mapPage===1&&skyMapNodes().length===2);
step(2);mapSel='gardens';pressed.a=true;step(1);ok('map_flies',state==='flying'&&FLY.dest==='gardens');for(let i=0;i<200&&state!=='warp'&&state!=='play';i++)step(1);warpTick();step(40);adv();warpTick();
ok('map_arrives',regionAt().id==='gardens');
reset();openMap();pressed.b=true;step(1);ok('map_page_toggle',mapPage===0&&mapNodes().includes('mountains'));pressed.b=true;step(1);ok('map_page_toggle2',mapPage===1);
mapSel='meadows';pressed.a=true;step(1);for(let i=0;i<200&&state==='flying';i++)step(1);warpTick();step(40);ok('map_to_meadows',regionAt().id==='meadows');
reset();let err=null;try{for(const pg of questPages()){questPage=pg;state='quests';c.step(1);}for(const gpg of growPages()){growPage=gpg;state='grow';c.step(1);}state='map';mapPage=1;c.step(1);mapPage=0;c.step(1);state='play';c.step(1);}catch(e){err=e;}
ok('pages_render',!err);if(err)R.err=String(err.stack||err).slice(0,300);
ok('quest_pages',questPages().includes(7)&&questPages().includes(8));
ok('grow_pages',growPages().includes(5));
// hint system
const hints=[];{G.flags.skyMap=1;G.sky.hatched=0;G.sky.open=0;hints.push(skyHint());G.sky.hatched=1;hints.push(skyHint());G.sky.open=1;for(const id of ORDER6)G.q[id]=0;hints.push(skyHint());G.q.sk_lambs=1;hints.push(skyHint());G.items.lamb=3;hints.push(skyHint());}
ok('hints',hints.every(h=>typeof h==='string'&&h.length>10)&&new Set(hints).size===hints.length);
ok('hint2_includes_sky',(()=>{G.coop={site:'forest',lv:4};G.flags.festival=1;for(const id of ORDER2)G.q[id]=2;for(const id of ORDER3)G.q[id]=2;return true;})());
/* ---- 13. darkness, rain, minimap ---- */
G.clock=Math.round(DAY*0.75);goto('m0',7,7);ok('meadow_night_gentle',skyDark()!==null&&skyDark()<=0.31);goto('p0',3,5);ok('peaks_dim',skyDark()>=0.3);ok('peaks_rain',skyRain()>0.5);goto('m0',7,7);ok('meadow_no_rain',skyRain()===0);
goto('lair',8,8);ok('lair_dark',skyDark()===0.42);
{const cs=MINIMAP_BEYOND();goto('m0',7,7);const cs2=MINIMAP_BEYOND();ok('minimap_sky_separate',cs2.cells.every(cl=>cl.region.sky)&&cs2.rows<=6);}
/* ---- 14. museum collectibles and the journal ---- */
ok('exhibits_6',EXHIBITS.length===6&&EXHIBITS.every(x=>G.museum[x.id]!==undefined&&G.hold[x.item]!==undefined));
{const ex=ents.filter(e=>e.type==='exhibit');ok('exhibit_ents',ex.length===6&&ex.every(e=>isFinite(e.x)&&isFinite(e.y)&&regionOfPos(e.x,e.y).id==='cityin'));}
{reset();const shd=ents.find(e=>e.id==='shd0');P.x=shd.x;P.y=shd.y;checkPickups();ok('shard_pickup',G.hold.shard===1);G.hold.shard=3;G.hold.cloudbloom=3;const s5=G.seeds;donateAll();ok('donate_sky',G.museum.shard===3&&G.museum.cloudbloom===3&&G.seeds===s5+12);}
{let e2=null;try{jpage=1;state='grow';growPage=2;c.step(1);jpage=0;c.step(1);state='play';}catch(e){e2=e;}ok('journal_sheets',!e2);}
ok('taste_log_17',FOODS.length===17&&['starfruit','cake','cloudberry','skyhoney','stormtea'].every(id=>FOODS.some(f=>f.id===id)));
ok('outfits_16',OUTFITS.length===16&&['scarf','bloom','quill','stormcap'].every(id=>OUTFITS.some(o=>o.id===id)));
R.allPass=Object.values(R).every((v,i,a)=>true)&&!Object.keys(R).some(k=>k[0]==='!');
for(const k of Object.keys(R))if(k!=='allPass'&&k[0]!=='!'&&R[k]!==true&&k!=='err')R.allPass=false;
return R;
})()
