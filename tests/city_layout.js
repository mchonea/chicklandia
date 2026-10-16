/* City scenery and circulation: real walking, every entrance, park stops,
   grounded pickups and old-save recovery. Needs tests/walk.js. */
(async()=>{
 const c=window.__chick,R={},ok=(k,v)=>R[k]=!!v;let g;
 c.newGame();g=c.G;g.autoMom=0;g.part2=true;g.rank=7;g.skills=new Set(['peck','quick','hop','carry']);g.hearts=maxHearts();g.seeds=70;SET.music=0;SET.sound=0;openVillage();
 const reset=()=>{state='play';dlg=null;SH=null;trans=null;fade=0;P.kt=0;P.inv=99999;g.clock=DAY*.3;};
 const start=()=>{reset();c.tp(640,1064);};window.WALK_AVOID='Ww';
 ok('six_named_districts',REGIONS.city.cells.length===6&&new Set(REGIONS.city.cells.map(c=>c.label)).size===6);
 const buildings=BUILDINGS.filter(b=>CITY_LOTS.some(l=>l.id===b.id));
 ok('thirteen_stable_building_ids',buildings.length===13&&buildings.every(b=>tileAt(...b.door)==='1'&&DOORS[b.door.join(',')].b===b));
 const unreachable=[],failedEntry=[],failedExit=[];
 for(const b of buildings){
  start();if(!walkTo(b.out.x,b.out.y).ok){unreachable.push(b.id);continue;}
  keys.up=true;for(let i=0;i<60;i++)c.step(1);keys.up=false;
  if(cellAt()?.id!==b.room){failedEntry.push(b.id);continue;}
  keys.down=true;for(let i=0;i<75;i++)c.step(1);keys.down=false;
  if(regionAt()?.id!=='city'||pBlocked(P.x,P.y))failedExit.push(b.id);
 }
 R.unreachableDoors=unreachable;R.entryFailures=failedEntry;R.exitFailures=failedExit;
 ok('all_door_approaches_reachable',!unreachable.length);ok('all_doors_enter_real_interiors',!failedEntry.length);ok('all_interiors_return_to_clear_pavement',!failedExit.length);
 const routes=[[[526,1064],[1256,1064]],[[640,1076],[640,1312]],[[896,1076],[896,1276]],[[1152,1076],[1152,1236]],[[640,1308],[640,1392]],[[860,1240],[1144,1228]]];
 const badRoutes=[];for(const [a,b] of routes){reset();c.tp(...a);if(!walkTo(...b).ok)badRoutes.push([a,b]);}
 R.unreachableRoutes=badRoutes;ok('district_forest_village_and_harbor_connections',!badRoutes.length);
 // Side streets must also be direct, without weaving around scenery.
 const badSpines=[];for(const x of [640,896,1152]){reset();c.tp(x,1092);keys.down=true;for(let i=0;i<140;i++)c.step(1);keys.down=false;if(Math.abs(P.x-x)>1||P.y<1190)badSpines.push([x,P.x,P.y]);}
 R.blockedSpines=badSpines;ok('three_northern_approaches_are_clear',!badSpines.length);
 const pickupProblems=[];for(const e of ents.filter(e=>(e.type==='item'||e.type==='fmound')&&regionOfPos(e.x,e.y)?.id==='city')){
  start();const offsets=e.type==='fmound'?[[0,12],[12,0],[-12,0],[0,-12]]:[[0,0],[8,0],[-8,0],[0,8]];
  if(!offsets.some(([dx,dy])=>!pBlocked(e.x+dx,e.y+dy)&&walkTo(e.x+dx,e.y+dy).ok))pickupProblems.push(e.id);
 }
 R.unreachablePickups=pickupProblems;ok('all_city_quest_items_and_finds_reachable',!pickupProblems.length);
 const parkProblems=[];for(const [x,y] of [...BABY_STOPS.map(([c,r])=>[c*16+8,r*16+8]),[SUNBEAM.x,SUNBEAM.y+6]]){start();if(!walkTo(x,y).ok)parkProblems.push([x,y]);}
 R.unreachableParkStops=parkProblems;ok('all_duckling_stops_and_sunbeam_reachable',!parkProblems.length);
 // Scenery must not spawn through a resident or a door's landing.
 ok('daytime_city_residents_clear',ents.filter(e=>e.type==='npc'&&regionOfPos(e.x,e.y)?.id==='city').every(e=>!rectTiles(e.x-5,e.y-5,10,6,true)&&!ents.some(p=>p.type==='cityprop'&&ov({x:e.x-5,y:e.y-5,w:10,h:6},entBox(p)))));
 const recovery=[];for(const [x,y] of [[568,1000],[896,1000],[1078,1000],[571,1192],[856,1192],[571,1110]]){
  reset();c.tp(x,y);g.flags.cityLayoutSentinel=17;save();c.continueGame();g=c.G;reset();const b=pBox(P.x,P.y);recovery.push(!rectTiles(b.x,b.y,b.w,b.h,true)&&!ents.some(e=>e.solid&&ov(b,entBox(e)))&&g.flags.cityLayoutSentinel===17);
 }
 ok('old_positions_recover_without_losing_progress',recovery.every(Boolean));
 window.WALK_AVOID=null;
 R.allPass=Object.entries(R).filter(([,v])=>typeof v==='boolean').every(([,v])=>v);return R;
})()
