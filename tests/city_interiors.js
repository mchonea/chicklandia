/* Furnished rooms and Roofline Run: actual routes, interactions, movement and encounter timing.
   Load tests/walk.js first in a debug page with animation paused. */
(async()=>{
 const c=window.__chick,R={},ok=(k,v)=>R[k]=!!v;
 c.newGame();let g=c.G;g.autoMom=0;g.part2=true;g.rank=7;g.skills=new Set(['peck','hop','quick','glide','flap']);g.hearts=maxHearts();SET.music=0;SET.sound=0;
 const reset=()=>{state='play';dlg=null;SH=null;trans=null;WARP=null;fade=0;P.hop=null;P.z=0;P.kt=0;P.inv=99999;toasts=[];for(const k in keys)keys[k]=false;};
 const enter=id=>{reset();const e=roomEntry(id);c.tp(e.x,e.y);};
 const reach=(x,y)=>{const r=walkTo(x,y,1600);if(!r.ok)return r;for(let i=0;i<32&&state==='play'&&(Math.abs(P.x-x)>1.7||Math.abs(P.y-y)>1.7);i++){keys.left=P.x>x+1.7;keys.right=P.x<x-1.7;keys.up=P.y>y+1.7;keys.down=P.y<y-1.7;c.step(1);}for(const k of ['left','right','up','down'])keys[k]=false;return {ok:Math.hypot(P.x-x,P.y-y)<3,pos:[P.x,P.y]};};
 const badEntries=[],badTalk=[],badPaint=[],hits=[];R.accessDiagnostics=[];
 const people={post:'pidge',bistro:'remy',boutique:'maggie',seed:'grumble',bakery:'bramble',toy:'fizz',library:'olive',museum:'sheldon',rocco:'rocco',cleo:'cleo',artist:'pablo',ducks:'waddles',loft:'pidge'};
 for(const room of REGIONS.cityin.cells){
  g.clock=DAY*(['rocco','cleo','loft','bistro'].includes(room.id)?.8:.3);c.tp(100,100);updateSchedules(true);enter(room.id);
  if(pBlocked(P.x,P.y))badEntries.push(room.id);
  const art=CITY_INTERIOR_ART.art(room.id),box=CITY_INTERIOR_ART.hits(room.id);if(art.width!==256||art.height!==192||!box.length)badPaint.push(room.id);
  const target=ents.find(e=>e.id===people[room.id]);let reached=false;
  // Approach each resident from clear floor, then use the real action, including across a display case.
  const offsets=[[0,14],[0,18],[0,30],[0,40],[0,50],[-18,24],[18,24],[-25,40],[25,40]];
  for(const [dx,dy] of offsets){enter(room.id);const blocked=pBlocked(target.x+dx,target.y+dy);if(blocked){if(room.id==='cleo')R.accessDiagnostics.push({room:room.id,dx,dy,blocked});continue;}
   const route=reach(target.x+dx,target.y+dy);if(!route.ok){if(room.id==='cleo')R.accessDiagnostics.push({room:room.id,dx,dy,route,target:[target.x,target.y]});continue;}P.dir=1;action();if(room.id==='cleo')R.accessDiagnostics.push({room:room.id,dx,dy,route,state,target:[target.x,target.y],front:frontPoint()});if(state==='talk'||state==='catalog'){reached=true;break;}
  }
  if(!reached)badTalk.push(room.id);
  const first=box.find(b=>b.y>55&&b.kind!=='bed');if(first){enter(room.id);const o=roomOrigin(room.id);hits.push(pBlocked(o.x+first.x+first.w/2,o.y+first.y+first.h/2));}
 }
 R.blockedEntries=badEntries;R.unreachableResidents=badTalk;ok('all_thirteen_entries_clear',!badEntries.length);ok('all_thirteen_native_rooms_render',!badPaint.length);ok('every_room_resident_reachable_and_talks',!badTalk.length);ok('furniture_has_physical_footprints',hits.every(Boolean));
 enter('library');ok('library_reading_corner_reachable',reach(roomOrigin('library').x+80,roomOrigin('library').y+164).ok);P.dir=1;action();R.nookDiagnostic={state,stories:g.flags.stories,pos:[P.x,P.y],nook:ents.find(e=>e.type==='nook'),front:frontPoint()};ok('reading_corner_still_tells_a_story',state==='talk'&&g.flags.stories===1);
 enter('toy');const to=roomOrigin('toy');ok('stairs_approach_reachable',reach(to.x+216,to.y+173).ok);keys.up=true;for(let i=0;i<45&&state==='play';i++)c.step(1);keys.up=false;R.stairsDiagnostic={state,pos:[P.x-to.x,P.y-to.y],door:ROOF_STAIRS.toyDoor,tile:tileAt(...ROOF_STAIRS.toyDoor)};c.step(33);R.stairsAfter={state,region:regionAt()?.id,pos:[P.x,P.y]};ok('real_toy_stairs_enter_rooftops',regionAt()?.id==='rooftops'&&!pBlocked(P.x,P.y));
 reset();keys.up=true;for(let i=0;i<45&&state==='play';i++)c.step(1);keys.up=false;c.step(33);ok('real_roof_stairs_return_to_toy',cellAt()?.id==='toy'&&!pBlocked(P.x,P.y));
 const roof=(x,y)=>{reset();c.tp(1280+x,1344+y);};
 roof(134,122);g.skills.delete('hop');keys.up=true;c.step(24);keys.up=false;const stopped=P.y;ok('low_pipe_blocks_walking',stopped>=1344+118);
 g.skills.add('hop');keys.up=true;let hopFrames=0;for(let i=0;i<34;i++){c.step(1);if(P.hop)hopFrames++;}keys.up=false;ok('low_pipe_hops_with_real_input',hopFrames>10&&P.y<1344+101&&!pBlocked(P.x,P.y));
 roof(167,95);g.skills.delete('glide');keys.right=true;c.step(40);keys.right=false;ok('alley_requires_glide',P.x<=1280+172);
 g.skills.add('glide');keys.right=true;c.step(40);keys.right=false;ok('glide_crosses_to_next_roof',P.x>=1280+220);
 roof(284,115);const gull=ents.find(e=>e.type==='roofgull');resetRoofGull();gull.cool=0;updateRoofGull(gull);const tx=gull.tx,ty=gull.ty;ok('gull_warns_before_swooping',gull.st==='tell');
 for(let i=0;i<40;i++)updateRoofGull(gull);ok('gull_warning_is_generous',gull.st==='tell');
 P.x+=25;for(let i=0;i<9;i++)updateRoofGull(gull);ok('gull_commits_to_warned_target',gull.st==='swoop'&&gull.tx===tx&&gull.ty===ty);
 gull.st='tell';gull.x=P.x;gull.y=P.y-12;P.dir=1;cityPeck(gull,frontPoint(),{x:P.x-8,y:P.y-24,w:16,h:16});ok('peck_stuns_gull',gull.st==='stunned');
 gull.st='tell';gull.x=P.x;gull.y=P.y-20;P.flapCd=0;wingFlap();ok('wing_flap_stuns_gull',gull.st==='stunned');
 roof(284,115);P.inv=0;g.hearts=maxHearts();resetRoofGull();gull.cool=0;for(let i=0;i<78;i++)updateRoofGull(gull);ok('one_swoop_causes_at_most_one_hit',g.hearts===maxHearts()-1&&gull.st==='return');
 roof(284,115);P.inv=0;g.hearts=maxHearts();resetRoofGull();gull.cool=0;updateRoofGull(gull);P.x+=35;for(let i=0;i<77;i++)updateRoofGull(gull);ok('moving_out_of_warned_path_dodges_gull',g.hearts===maxHearts());
 enter('toy');startMG('bonk','fizz');const arcade=[];
 for(const hole of ents.filter(e=>e.arcade)){const moved=reach(hole.x,hole.y+14);hole.up=30;hole.max=60;P.dir=1;const before=MG?.score||0;action();arcade.push(moved.ok&&(MG?.score||0)>before);}
 ok('all_six_arcade_holes_can_be_pecked',arcade.every(Boolean));MG=null;
 // A complete timed run uses collision-aware walking rather than teleporting to its stars.
 reset();g.clock=DAY*.3;g.hearts=maxHearts();startRace();c.step(33);P.inv=99999;const missed=[];
 for(const [i,[x,y]] of ROOF_STAR_POS.entries()){
  if(!g.race)break;const route=walkTo(1280+x,1344+y+6,2200);if(!route.ok)missed.push({i,route});
 }
 if(g.race)walkTo(1280+ROOF_FLAG[0],1344+ROOF_FLAG[1],1000);c.step(70);
 R.raceRouteFailures=missed;ok('full_race_wins_by_walking',!missed.length&&g.best.race>0&&!g.race&&cellAt()?.id==='toy'&&g.outfits.includes('goggles'));
 reset();startRace();c.step(33);g.race.t=RACE_LIMIT-1;c.step(1);c.step(65);ok('timeout_returns_to_clear_toy_floor',!g.race&&cellAt()?.id==='toy'&&!pBlocked(P.x,P.y));
 const recovered=[];
 for(const [id,x,y] of [['bakery',68,100],['toy',216,120],['museum',47,79],['rooftops',390,160]]){
  reset();const o=id==='rooftops'?{x:1280,y:1344}:roomOrigin(id);c.tp(o.x+x,o.y+y);g.flags.interiorSentinel=23;save();c.continueGame();g=c.G;recovered.push(!pBlocked(P.x,P.y)&&g.flags.interiorSentinel===23);
 }
 ok('old_room_and_roof_saves_recover',recovered.every(Boolean));
 R.allPass=Object.entries(R).filter(([,v])=>typeof v==='boolean').every(([,v])=>v);return R;
})()
