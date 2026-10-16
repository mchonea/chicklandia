/* Gaps left by the forest and coast/peaks suites: stump training, tree pecks, oak keys, swim-only water,
   region seams, hidden tile edits, turtle escort edges, real 2f1dcad saves, the Dream Coop and Clover on load.
   Needs tests/walk.js. Non-boolean entries are diagnostics for failing checks. */
(async()=>{
 const c=window.__chick,R={},ok=(k,v)=>R[k]=!!v;
 const reset=()=>{state='play';dlg=null;SH=null;PL=null;trans=null;fade=0;P.kt=0;P.inv=99999;G.clock=DAY*.3;G.autoMom=0;SET.music=0;SET.sound=0;};
 const home={forest:[132,1068],beach:[132,1180],mountains:[132,920]};
 const fresh=(kind='forest')=>{c.newGame();G.part2=true;G.rank=7;G.gp=420;G.skills=new Set(['peck','quick']);G.hearts=maxHearts();reset();c.tp(...home[kind]);};
 const start=(kind='forest')=>{reset();c.tp(...home[kind]);};
 const walk=(x,y)=>{const r=walkTo(x,y);if(!r.ok)return r;for(let i=0;i<90&&(Math.abs(P.x-x)>1||Math.abs(P.y-y)>1);i++){keys.left=P.x>x+1;keys.right=P.x<x-1;keys.up=P.y>y+1;keys.down=P.y<y-1;c.step(1);}for(const k of ['left','right','up','down'])keys[k]=false;return {ok:Math.abs(P.x-x)<=1&&Math.abs(P.y-y)<=1};};
 const approach=(e,kind)=>{for(const [dx,dy,dir] of [[0,14,1],[0,-12,0],[-14,0,3],[14,0,2]]){start(kind);if(pBlocked(e.x+dx,e.y+dy))continue;if(walk(e.x+dx,e.y+dy).ok){P.dir=dir;return true;}}return false;};
 const finishTalk=()=>{for(let n=0;n<400&&state==='talk';n++){pressed.a=true;c.step(1);}reset();};

 // 1. Bucky's stump training: smash all three moved stumps with a real peck, then finish the lesson.
 // Finishing Bucky's quest (which repairs the dam) is what unlocks this training; one stump is across the river.
 fresh();G.items.stick=4;QUESTS.bucky.onDone();G.q.bucky=2;reset();G.train.super=1;spawnTrain('super');const stumps=[];
 for(const id of ['stump0','stump1','stump2']){const e=ents.find(e=>e.id===id);const reached=approach(e,'forest');if(reached){P.peckT=0;action();c.step(2);}stumps.push({id,reached,smashed:!!e.dead});}
 R.stumps=stumps;ok('all_three_moved_stumps_can_be_smashed',stumps.every(s=>s.reached&&s.smashed)&&G.items.stump===3);
 start();c.talk('bucky');finishTalk();ok('stump_training_completes_with_bucky',G.train.super===2);

 // 2. A plain tree soaks up a peck without side effects; nearby finds are not blocked by tree pecks.
 fresh();const plain=FOREST_TREES.find(t=>!t.oak&&!pBlocked(t.x+8,960+t.y+28)&&walkTo(t.x+8,960+t.y+28).ok);
 const snap=()=>JSON.stringify([G.items,G.seeds,G.picked,G.collected.size]);
 if(plain){P.dir=1;const before=snap();action();c.step(20);ok('plain_tree_peck_changes_nothing',snap()===before);}else ok('plain_tree_peck_changes_nothing',false);
 const pecked=[];fresh();G.skills.add('super');
 for(const e of ents.filter(e=>['spot','fmound'].includes(e.type)&&regionOfPos(e.x,e.y)?.id==='forest')){
  const nearTree=FOREST_TREES.some(t=>Math.abs(t.x+8-e.x)<28&&Math.abs(960+t.y+8-e.y)<28);
  const reached=approach(e,'forest');if(reached){P.peckT=0;action();c.step(2);}
  pecked.push({id:e.id,nearTree,reached,done:G.collected.has(e.id)||!!e.dead});
 }
 R.forestPeckables=pecked;ok('forest_secret_and_dig_spots_respond_to_peck',pecked.length>0&&pecked.every(p=>p.reached&&p.done));

 // 3. Each oak needs its own save key, or pecking one empties its neighbour too.
 const oakKeys=FOREST_TREES.filter(t=>t.oak).map(t=>t.c+','+t.r);
 R.sharedOakKeys=[...new Set(oakKeys.filter((k,i)=>oakKeys.indexOf(k)!==i))];
 ok('every_forest_oak_has_a_unique_key',!R.sharedOakKeys.length);

 // 4. Swim is sold without Flutter, so check deep-water shells with Swim alone.
 fresh('beach');G.skills=new Set(['peck','quick','swim']);const swimOnly=[];
 // Note both spots first: walking to one can collect the other on the way.
 const offshore=['shell2','shell3'].map(id=>{const e=ents.find(e=>e.id===id);return [e.x,e.y];});
 for(const [x,y] of offshore){start('beach');swimOnly.push(walk(x,y).ok);}
 R.swimOnlyShells=swimOnly;ok('swim_without_flutter_reaches_offshore_shells',swimOnly.every(Boolean)&&G.items.shell===2);

 // 5. Region seams: collision across a border should match each side's own collision.
 fresh();G.skills=new Set(['peck']);
 const raw=b=>{const city=cityLayoutBlocked(b);return city===true||(city===null&&rectTiles(b.x,b.y,b.w,b.h,true));};
 const tilesOnly=(x,y,w,h)=>{for(let r=Math.floor(y/16);r<=Math.floor((y+h-.01)/16);r++)for(let cc=Math.floor(x/16);cc<=Math.floor((x+w-.01)/16);cc++)if(solidTile(tileAt(cc,r),true))return true;return false;};
 const side=(x,y,w,h)=>{const l=landscapeRectBlocked(x,y,w,h,true);if(l!==null)return l;const f=forestRectBlocked(x,y,w,h,true);if(f!==null)return f;const b={x,y,w,h},city=cityLayoutBlocked(b);return city===true||(city===null&&tilesOnly(x,y,w,h));};
 const seams={};
 for(const [name,Y] of [['mountains_forest',960],['forest_beach',1152]]){const bad=[];
  for(let x=10;x<=502;x++)for(const y of [Y+1,Y+3,Y+5]){const b=pBox(x,y);const want=side(b.x,b.y,b.w,Y-b.y)||side(b.x,Y,b.w,b.y+b.h-Y);if(raw(b)!==want)bad.push([x,y,want?'should block':'should be open']);}
  seams[name]=bad;}
 for(const [name,y0] of [['mountains_city',768],['forest_city',960],['beach_city',1152]]){const bad=[];
  for(let y=y0+8;y<y0+190;y++)for(const x of [508,510,512,514,516]){const b=pBox(x,y);const want=side(b.x,b.y,512-b.x,b.h)||side(512,b.y,b.x+b.w-512,b.h);if(raw(b)!==want)bad.push([x,y,want?'should block':'should be open']);}
  seams[name]=bad;}
 R.seamMismatches=Object.fromEntries(Object.entries(seams).map(([k,v])=>[k,{count:v.length,first:v.slice(0,6)}]));
 ok('region_seams_match_both_sides',Object.values(seams).every(v=>!v.length));

 // 6. Painted areas ignore the tile grid: no feature may rely on a tile edit there being visible.
 fresh();const edits=[],realSet=setTile;setTile=(cc,r,ch)=>{edits.push([cc,r,ch]);return realSet(cc,r,ch);};
 try{
  G.flags.mo=false;for(const k in TRAIN){try{G.train[k]=1;spawnTrain(k);}catch(e){}}
  for(const [id,q] of Object.entries(QUESTS)){try{if(q.onDone){G.items.stick=9;q.onDone();}}catch(e){}reset();}
  G.coop={site:'forest',lv:4,extra:4};try{applyCoop(true);}catch(e){}
  G.skills.add('super');for(let i=0;i<MOUNTAIN_BOULDERS.length;i++){const [bx,by]=MOUNTAIN_BOULDERS[i];P.x=bx+8;P.y=768+by+30;landscapeBoulderPeck({x:bx+8,y:768+by+8});}
 }finally{setTile=realSet;}
 const handled=(cc,r,ch)=>{
  if(r>=72&&r<84&&cc<32)return false;                                          // beach: nothing may edit tiles
  if(r>=48&&r<60&&cc<32)return ch==='g'&&MOUNTAIN_BOULDERS.some(([x,y])=>Math.floor(x/16)===cc&&48+Math.floor(y/16)===r);
  if(r>=60&&r<72&&cc<32){const S=SITES.forest,plot=[...S.plots,...S.extraPlots].some(([pc,pr])=>pc===cc&&pr===r);
   return (ch==='V'&&plot)||('vcK'.includes(ch)&&cc>=S.c&&cc<S.c+3&&r>=S.r&&r<S.r+2)||(ch==='3'&&cc>=23&&cc<=24&&r>=68&&r<=69);}
  return true;};
 R.hiddenTileEdits=edits.filter(e=>!handled(...e));ok('no_invisible_tile_edits_in_painted_areas',!R.hiddenTileEdits.length);

 // 7. Turtles only head for the surf when Pip leads them to the bank.
 fresh('beach');G.q.sandy=1;const t0=ents.find(e=>e.id==='turtle0'),t2=ents.find(e=>e.id==='turtle2');
 walk(t0.x,t0.y);for(let i=0;i<24;i++)c.step(1);const picked=t0.mode==='follow';
 const along=[[60,0],[120,0],[200,0]].map(([x])=>walk(x,1152+beachShoreY(x)-30).ok);for(let i=0;i<30;i++)c.step(1);
 ok('following_turtle_stays_with_pip_away_from_the_bank',picked&&along.every(Boolean)&&t0.mode==='follow'&&!t0.toSurf&&!G.turtles.includes('turtle0'));
 const t2pos=[t2.x,t2.y];t2.mode=t2.mode||'idle';if(t2.mode!=='follow'){P.x=t2.x+20;P.y=1152+beachShoreY(t2.x+20)-3;for(let i=0;i<60;i++)c.step(1);}
 ok('unclaimed_turtle_ignores_pip_at_the_bank',t2.mode!=='swim'&&!t2.toSurf&&t2.x===t2pos[0]&&t2.y===t2pos[1]);

 // 8-9. Real saves written by commit 2f1dcad, loaded into this version.
 const fx=await (await fetch('tests/fixtures/save_2f1dcad.json')).json(),loads={};
 for(const [name,{pos,save:s}] of Object.entries(fx.saves)){
  localStorage.setItem(SAVE_KEY,JSON.stringify(s));c.continueGame();reset();
  const b=pBox(P.x,P.y),coopPlots=ents.filter(e=>e.type==='plot'&&e.coop).length;
  const acorn=ents.find(e=>e.id==='acorn_11,61'&&!e.dead);
  const fawn=ents.find(e=>e.id==='fawn'),doe=ents.find(e=>e.id==='doe');
  const L=loads[name]={from:pos,to:[P.x,P.y],
   clear:!rectTiles(b.x,b.y,b.w,b.h,true)&&!ents.some(e=>e.solid&&ov(b,entBox(e))),
   progress:G.rank===7&&G.seeds===37&&G.coop?.lv===4&&G.coop?.extra===4&&G.flags.dam&&G.flags.fawn&&G.flags.mo&&G.turtles.length===3&&G.items.shell===5&&['stick0','stump0','stump1','stump2'].every(id=>G.collected.has(id))&&ORDER2.every(id=>G.q[id]===2),
   crops:G.plots.plot_5_64?.p===.42&&G.plots.plot_5_64?.k==='moon'&&G.plots.plot_6_64?.p===1&&G.plots.plot_14_67?.k==='giant'&&G.plots.plot_14_69?.k==='speedy',
   plots:coopPlots===12&&!!ents.find(e=>e.id==='plot_5_64')&&!!ents.find(e=>e.id==='plot_6_64'),
   noStumps:!ents.some(e=>e.type==='stump'&&!e.dead),
   acorn:!!acorn&&!rectTiles(acorn.x-3,acorn.y-5,6,6,false),
   clover:!!fawn&&!!doe&&Math.abs(fawn.x-(doe.x+16))<1&&Math.abs(fawn.y-(doe.y+2))<1&&regionOfPos(fawn.x,fawn.y)?.id==='forest'};
  if(name==='forest_house'&&acorn){const keep=[P.x,P.y];L.acornReachable=walkTo(acorn.x,acorn.y).ok;for(let i=0;i<10;i++)c.step(1);L.acornCollected=G.collected.has('acorn_11,61');P.x=keep[0];P.y=keep[1];}
 }
 R.oldSaveLoads=loads;const L=Object.values(loads);
 ok('old_saves_land_on_clear_ground',L.every(l=>l.clear));
 ok('old_saves_keep_quest_coop_and_collection_progress',L.every(l=>l.progress&&l.noStumps));
 ok('old_saves_keep_every_crop_and_all_fourteen_plots',L.every(l=>l.crops&&l.plots));
 ok('old_uncollected_acorn_moves_to_open_ground_and_can_be_picked_up',L.every(l=>l.acorn)&&loads.forest_house.acornReachable&&loads.forest_house.acornCollected);
 ok('clover_waits_beside_doe_after_loading',L.every(l=>l.clover));

 // 9. Dream Coop: level 4 gets the golden roof, in the art and in the game.
 const gold=lv=>{const cv2=mk(80,60,g=>FOREST_ART.paint(g,'coop',10,50,lv));const d=cv2.getContext('2d').getImageData(0,0,80,60).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===0xc9&&d[i+1]===0x8a&&d[i+2]===0)n++;return n;};
 R.goldPixels={lv1:gold(1),lv4:gold(4)};ok('dream_coop_art_has_golden_roof_only_at_level_4',R.goldPixels.lv4>50&&R.goldPixels.lv1===0);
 localStorage.setItem(SAVE_KEY,JSON.stringify(fx.saves.forest_house.save));c.continueGame();reset();c.tp(206,1129);
 const calls=[],realPaint=FOREST_ART.paint;FOREST_ART.paint=(...a)=>{calls.push(a.slice(1));return realPaint(...a);};
 try{render();}finally{FOREST_ART.paint=realPaint;}
 ok('loaded_dream_coop_draws_at_level_4',calls.some(a=>a[0]==='coop'&&a[3]===4));

 R.allPass=Object.entries(R).filter(([,v])=>typeof v==='boolean').every(([,v])=>v);return R;
})()
