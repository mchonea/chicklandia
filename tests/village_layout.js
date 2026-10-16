/* Village neighbourhood regression. Real walking, actions, old-save recovery and
   resident additions. Needs ?debug=1 and tests/walk.js. No swimming or flight. */
(async()=>{
 const c=window.__chick,R={},ok=(k,v)=>R[k]=!!v;let g;
 c.newGame();g=c.G;g.autoMom=0;g.part2=true;g.rank=7;g.skills=new Set(['peck','quick','hop','carry','flap']);g.hearts=maxHearts();g.seeds=200;SET.music=0;SET.sound=0;openVillage();
 const reset=()=>{state='play';dlg=null;SH=null;VB=null;PL=null;trans=null;fade=0;P.kt=0;P.inv=99999;g.clock=DAY*.3;};
 const start=()=>{reset();c.tp(39*16+8,89*16+12);};
 window.WALK_AVOID='Ww';
 ok('ten_stable_lot_ids',PADS.length===10&&PADS.map(p=>p.id).sort().join(',')==='p0,p1,p2,p3,p4,p5,p6,p7,p8,p9');
 ok('all_eight_places_named',new Set([0,1,2,3].flatMap(x=>[7,8].map(y=>CELL[x+','+y].label))).size===8);
 ok('wishes_wait_for_move_in',!ents.some(e=>e.wish));
 const problems=[];
 for(const s of VILLAGE_SIGNS){start();const e=ents.find(e=>e.id===s.id),w=walkTo(e.x,e.y+14);if(!w.ok)problems.push(s.id);}
 ok('green_yard_garden_signs_reachable',problems.length===0);R.unreachableSigns=problems;
 const props=VILLAGE_PROPS.filter(p=>p.solid),blocked=[];
 for(const p of props){const e=ents.find(e=>e.id===p.id);if(rectTiles(e.x-(e.w||10)/2,e.y-6,e.w||10,7,true))blocked.push(p.id);}
 ok('solid_scenery_on_land',blocked.length===0);R.sceneryOnBlockedTiles=blocked;
 // Fully built lots are the hardest case for routing and front-door access.
 for(const [id,kind] of [['p0','home'],['p1','home'],['p2','bakery'],['p3','band'],['p4','school'],['p5','clinic'],['p6','home'],['p7','home'],['p8','mill'],['p9','mill']])g.vil.b[id]={kind,done:true,t0:0,dur:BUILD_TIME};
 g.vil.res={pig:'p0',whiskers:'p1',daisy:'p2',rooster:'p3',penny:'p4',doe:'p5',clyde:'p8'};makeEnts();
 const approach=e=>{
  for(const [dx,dy] of [[26,14],[-26,14],[0,14],[14,0],[-14,0],[0,-12]]){
    if(pBlocked(e.x+dx,e.y+dy))continue;if(walkTo(e.x+dx,e.y+dy).ok)return true;
  }return false;
 };
 const pads=[];for(const p of PADS){start();const q=padCenter(p);if(!approach(q))pads.push(p.id);}
 ok('all_finished_front_doors_reachable',pads.length===0);R.unreachablePads=pads;
 const resources=[];for(const e of ents.filter(e=>['vnode','vsheep','plot'].includes(e.type)&&regionOfPos(e.x,e.y).area==='village')){
  start();const targets=[[0,12],[14,0],[-14,0],[0,-12]];let reached=false;
  for(const [dx,dy] of targets){if(pBlocked(e.x+dx,e.y+dy))continue;if(walkTo(e.x+dx,e.y+dy).ok){reached=true;break;}}
  if(!reached)resources.push(e.id);
 }
 ok('gathering_sheep_and_every_crop_reachable',resources.length===0);R.unreachableResources=resources;
 const training=[];for(const k of ['master','whistle']){g.train[k]=1;spawnTrain(k);for(const [id,x,y] of TRAIN[k].spawn){start();if(!walkTo(x*16+8,y*16+12).ok)training.push(id);}}
 ok('all_training_pickups_reachable',training.length===0);R.unreachableTraining=training;
 g.clock=9*DAY+DAY*.3;spawnSeasonItems();const snow=ents.filter(e=>e.kind==='snowball'&&e.type==='item'),snowBad=[];
 for(const e of snow){reset();g.clock=9*DAY+DAY*.3;c.tp(39*16+8,89*16+12);if(!walkTo(e.x,e.y).ok)snowBad.push(e.id);}
 ok('winter_pickups_reachable',snow.length===3&&snowBad.length===0);R.unreachableSnow=snowBad;
 start();const mail=ents.find(e=>e.type==='vmail');ok('mailbox_walk',walkTo(mail.x,mail.y+14).ok);P.dir=1;pressed.a=true;c.step(1);ok('mailbox_action',state==='talk');
 start();const board=ents.find(e=>e.type==='vcontest');ok('contest_walk',walkTo(board.x,board.y+14).ok);P.dir=1;pressed.a=true;c.step(1);ok('contest_action',state==='catalog'&&SH.id==='contest');
 start();const clinic=ents.find(e=>e.id==='p5');ok('clinic_walk',walkTo(clinic.x+26,clinic.y-3).ok);g.hearts=1;P.dir=2;pressed.a=true;c.step(1);ok('clinic_heals',state==='talk'&&g.hearts===maxHearts());
 start();const mill=ents.find(e=>e.id==='p8');ok('mill_walk',walkTo(mill.x+26,mill.y-3).ok);const seeds=g.seeds;g.vil.millDay=-1;P.dir=2;pressed.a=true;c.step(1);ok('mill_pays',state==='talk'&&g.seeds===seeds+1);
 ok('all_resident_wishes_visible',RESIDENTS.every(r=>ents.some(e=>e.wish===r.id)));
 // The existing schedule system moves visitors only when they are off screen.
 start();updateSchedules(false);const cat=ents.find(e=>e.id==='whiskers');ok('neighbour_visits_green',cat.at==='day'&&regionOfPos(cat.x,cat.y).id==='vhill');
 c.tp(cat.x,cat.y+20);g.clock=DAY*.8;const old=[cat.x,cat.y];updateSchedules(false);ok('visitors_do_not_vanish_on_screen',cat.x===old[0]&&cat.y===old[1]);
 c.tp(632,1452);updateSchedules(false);ok('neighbour_returns_home',cat.at==='night'&&Math.abs(cat.x-padCenter(PADS.find(p=>p.id==='p1')).x)<20);
 reset();g.vil.mat.wood=17;g.vil.b.p6={kind:'home',done:false,t0:g.clock-100,dur:BUILD_TIME};g.plots.plot_34_98={k:'giant',p:.52,w:3};
 // A position from an earlier map can now lie in the reshaped mill stream.
 c.tp(21*16+8,100*16+12);save();const raw=JSON.parse(localStorage.getItem(SAVE_KEY));c.continueGame();g=c.G;reset();
 const b=pBox(P.x,P.y);ok('old_save_recovers_from_new_obstacle',!rectTiles(b.x,b.y,b.w,b.h,true)&&!ents.some(e=>e.solid&&ov(b,entBox(e))));
 ok('load_keeps_buildings_and_construction',g.vil.b.p2.kind==='bakery'&&g.vil.b.p6.done===false&&g.vil.b.p6.t0===raw.vil.b.p6.t0);
 ok('load_keeps_materials_residents_and_crops',g.vil.mat.wood===17&&Object.keys(g.vil.res).length===7&&g.plots.plot_34_98.p===.52&&g.plots.plot_34_98.w===3);
 ok('load_restores_wish_scenery',RESIDENTS.every(r=>ents.some(e=>e.wish===r.id)));
 window.WALK_AVOID=null;
 R.allPass=Object.entries(R).filter(([k])=>!['unreachableSigns','sceneryOnBlockedTiles','unreachablePads','unreachableResources','unreachableTraining','unreachableSnow'].includes(k)).every(([,v])=>v===true);return R;
})()
