/* Approved forest mix: real walking, working landmarks and old-save progress. */
(async()=>{
 const c=window.__chick,R={},ok=(k,v)=>R[k]=!!v;
 const reset=()=>{state='play';dlg=null;SH=null;PL=null;trans=null;fade=0;P.kt=0;P.inv=99999;G.clock=DAY*.3;G.autoMom=0;SET.music=0;SET.sound=0;};
 const fresh=()=>{c.newGame();G.part2=true;G.rank=7;G.gp=420;G.skills=new Set(['peck','quick']);G.hearts=maxHearts();reset();c.tp(132,1068);};
 const start=()=>{reset();c.tp(132,1068);};
 fresh();
 ok('original_tree_sprites_remain_native',TILE.tree.width===16&&TILE.tree.height===16&&TILE.oak.width===16&&TILE.oak.height===16);
 ok('two_forest_screens_remain',REGIONS.forest.cells.length===2&&REGIONS.forest.origin.join(',')==='0,5');
 const badRoutes=[];
 for(const [a,b] of [[[132,1068],[132,932]],[[132,1068],[132,1172]],[[132,1068],[532,1064]]]){reset();c.tp(...a);if(!walkTo(...b).ok)badRoutes.push([a,b]);}
 R.unreachableConnections=badRoutes;ok('mountain_beach_and_city_connections_walkable',!badRoutes.length);
 const badResidents=[];for(const id of ['granny','bucky','doe']){start();const e=ents.find(e=>e.id===id);if(!walkTo(e.x,e.y+14).ok)badResidents.push(id);else{P.dir=1;action();if(state!=='talk')badResidents.push(id+'_talk');}}
 R.unreachableResidents=badResidents;ok('all_forest_residents_reachable_and_talkable',!badResidents.length);
 // Peck three actual oak canopies from clear ground; each drops a collectible acorn.
 fresh();const harvested=[];
 for(const t of FOREST_TREES.filter(t=>t.oak)){
  const k=t.c+','+t.r;if(G.picked[k])continue;
  const candidates=[[t.x+8,960+t.y+28,1],[t.x-7,960+t.y+12,3],[t.x+23,960+t.y+12,2]];
  let worked=false;for(const [x,y,dir] of candidates){start();if(pBlocked(x,y)||!walkTo(x,y).ok)continue;P.dir=dir;const n=G.items.acorn;action();for(let i=0;i<60;i++)c.step(1);if(G.items.acorn>n){worked=true;break;}}
  if(worked)harvested.push(k);if(harvested.length>=3)break;
 }
 R.harvestedOakKeys=harvested;ok('three_oaks_can_be_walked_to_pecked_and_collected',harvested.length===3);
 // The site sign uses the normal action and build choice, then real door movement.
 start();const sign=SITES.forest.sign;const signReach=walkTo(sign[0]*16+8,sign[1]*16+28).ok;P.dir=1;action();
 ok('coop_site_sign_reachable',signReach&&state==='talk'&&!!dlg.lines[0].choices);
 if(dlg?.lines[0].cb)dlg.lines[0].cb(0);reset();ok('normal_sign_choice_builds_coop',G.coop?.lv===1);
 start();const entryReach=walkTo(206,1129).ok;keys.up=true;for(let i=0;i<65;i++)c.step(1);keys.up=false;
 ok('new_coop_door_enters_existing_interior',entryReach&&regionAt()?.id==='coop');
 keys.down=true;for(let i=0;i<100;i++)c.step(1);keys.down=false;
 ok('coop_exit_returns_to_clear_yard',regionAt()?.id==='forest'&&!pBlocked(P.x,P.y));
 G.thumb=true;G.seeds=99;for(const id of ORDER2)G.q[id]=2;
 const counts=[];for(let lv=1;lv<=4;lv++){
  if(lv>1){reset();upgradeCoop();reset();}
  counts.push(ents.filter(e=>e.type==='plot'&&e.coop).length);
 }
 ok('all_four_coop_levels_unlock_existing_plot_counts',counts.join(',')==='2,4,6,8');
 G.coop.extra=4;applyCoop(false);ok('all_four_purchased_extra_plots_remain',ents.filter(e=>e.type==='plot'&&e.coop).length===12);
 const beds=Object.values(FOREST_PLOTS).map(([x,y,w,h])=>({x:x-Math.floor(w/2),y:y-14,w,h}));
 ok('expanded_garden_beds_clear_each_other_and_trees',beds.every((b,i)=>beds.every((other,j)=>i===j||!ov(b,other))&&!FOREST_TREES.some(t=>ov(b,{x:t.x,y:t.y,w:16,h:16}))));
 const badPlots=[],harvests=[];
 for(const e of ents.filter(e=>e.type==='plot'&&regionOfPos(e.x,e.y)?.id==='forest')){
  let used=false;
  for(const [dx,dy,dir] of [[0,-12,0],[-12,-4,3],[12,-4,2],[0,14,1]]){
   start();if(pBlocked(e.x+dx,e.y+dy)||!walkTo(e.x+dx,e.y+dy).ok)continue;
   P.dir=dir;const before=G.seeds;G.plots[e.id]={p:1,k:'plain'};action();if(!G.plots[e.id]&&G.seeds>before){used=true;break;}
  }
  if(used)harvests.push(e.id);else badPlots.push(e.id);
 }
 R.inaccessiblePlots=badPlots;ok('all_fourteen_plots_can_be_walked_to_and_harvested',harvests.length===14&&!badPlots.length);
 // Water cannot be walked across until the original dam reward repairs the bridge.
 fresh();ok('broken_dam_keeps_swimming_gate',rectTiles(389,1101,10,6,true));G.skills.add('swim');ok('swimming_allows_the_visible_water',!rectTiles(389,1101,10,6,true));G.skills.delete('swim');
 G.items.stick=4;QUESTS.bucky.onDone();reset();ok('original_reward_repairs_visible_bridge',G.flags.dam&&!rectTiles(389,1101,10,6,true)&&tileAt(23,68)==='3');
 c.tp(394,1074);const crossed=walkTo(394,1130).ok;ok('repaired_dam_can_be_crossed_without_swimming',crossed);
 G.q.doe=1;const fawn=ents.find(e=>e.id==='fawn');const found=walkTo(fawn.x,fawn.y-6).ok;for(let i=0;i<15;i++)c.step(1);
 const followed=fawn.mode==='follow';const home=walkTo(464,1078).ok;for(let i=0;i<80;i++)c.step(1);ok('clover_follows_over_bridge_and_reunites',found&&followed&&home&&G.flags.fawn);
 // Existing find/training IDs stay usable around the moved scenery.
 fresh();G.items.stick=4;QUESTS.bucky.onDone();reset();G.train.super=1;spawnTrain('super');const badFinds=[];
 for(const e of ents.filter(e=>['item','spot','stump'].includes(e.type)&&regionOfPos(e.x,e.y)?.id==='forest')){
  start();if(![[0,12],[12,0],[-12,0],[0,-12]].some(([dx,dy])=>!pBlocked(e.x+dx,e.y+dy)&&walkTo(e.x+dx,e.y+dy).ok))badFinds.push(e.id);
 }
 R.inaccessibleFinds=badFinds;ok('forest_items_secret_and_training_stumps_accessible',!badFinds.length);
 G.skills.add('flap');reset();const bee=ents.find(e=>e.type==='bees');c.tp(bee.hx-20,bee.hy+4);P.dir=3;bee.st='chase';wingFlap();ok('existing_bees_still_respond_to_wing_flap',bee.st==='return'&&bee.cool>=240);
 const recovered=[];for(const [x,y] of [[50,1030],[20,1138],[222,984],[322,1145]]){
  reset();G.coop={site:'forest',lv:4,extra:4};applyCoop(true);G.plots.plot_5_64={p:.42,k:'moon',w:2};G.flags.forestSentinel=17;G.collected.add('stick0');c.tp(x,y);save();c.continueGame();reset();
  const b=pBox(P.x,P.y);recovered.push(!rectTiles(b.x,b.y,b.w,b.h,true)&&!ents.some(e=>e.solid&&ov(b,entBox(e)))&&G.flags.forestSentinel===17&&G.collected.has('stick0')&&G.plots.plot_5_64.p===.42&&G.plots.plot_5_64.k==='moon'&&G.plots.plot_5_64.w===2);
 }
 ok('older_positions_recover_and_keep_quest_crop_and_collectible_progress',recovered.every(Boolean));
 fresh();ok('new_game_cannot_enter_unbuilt_coop',!DOORS['12,69']);
 R.allPass=Object.entries(R).filter(([,v])=>typeof v==='boolean').every(([,v])=>v);return R;
})()
