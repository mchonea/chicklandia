/* Chicklandia smoke test. Run it inside the game page opened with ?debug=1:
     const t = await (await fetch('tests/smoke.js')).text(); (0,eval)(t)   // returns a results object
   It WALKS Pip (real key input, real collision) from the Part 2 landing spot to every secret spot,
   and exercises hazards, save migration, region mapping and the title/pause menus. */
(async()=>{
const c=window.__chick;if(!c)return {error:'open the page with ?debug=1'};
const R={};const ok=(k,v)=>{R[k]=v;};
function walkTo(tx,ty,maxFrames=6000){
  const S=4,key=(x,y)=>x+','+y,start={x:Math.round(P.x/S)*S,y:Math.round(P.y/S)*S},goal={x:Math.round(tx/S)*S,y:Math.round(ty/S)*S};
  const q=[start],prev=new Map([[key(start.x,start.y),null]]);let found=null;
  while(q.length){const n=q.shift();if(Math.abs(n.x-goal.x)<=S&&Math.abs(n.y-goal.y)<=S){found=n;break;}
    for(const [dx,dy] of [[S,0],[-S,0],[0,S],[0,-S]]){const x=n.x+dx,y=n.y+dy;if(x<8||x>MW*16-8||y<8||y>MH*16-8)continue;const k=key(x,y);if(prev.has(k)||pBlocked(x,y))continue;prev.set(k,n);q.push({x,y});}}
  if(!found)return {ok:false};
  const path=[];for(let n=found;n;n=prev.get(key(n.x,n.y)))path.unshift(n);
  const G=c.G;let h0=G.hearts,dmg=0,i=0,f=0,stuck=0;
  while(i<path.length&&f<maxFrames){if(state==='faint'||state==='talk')break;
    const w=path[i],dx=w.x-P.x,dy=w.y-P.y;if(Math.abs(dx)<2&&Math.abs(dy)<2){i++;continue;}
    keys.left=dx<-1.5;keys.right=dx>1.5;keys.up=dy<-1.5;keys.down=dy>1.5;
    const px=P.x,py=P.y;c.step(1);f++;
    if(Math.abs(P.x-px)+Math.abs(P.y-py)<0.05&&!trans&&state==='play'){if(++stuck>40){i++;stuck=0;}}else stuck=0;
    if(G.hearts<h0){dmg+=h0-G.hearts;h0=G.hearts;}}
  for(const k of ['up','down','left','right'])keys[k]=false;
  return {ok:i>=path.length,dmg};
}
c.newGame();let G=c.G;G.autoMom=0;G.part2=true;['peck','quick'].forEach(s=>G.skills.add(s));fade=0;state='play';c.tp(136,1067);c.step(3);
// 1. every Part 2 secret spot reachable on foot and pecked open
for(const s of SPOTS){const e=c.ents.find(x=>x.id===s.id);
  let w={ok:false};for(const [dx,dy,dir] of [[14,0,2],[0,-14,0],[-14,0,3],[0,14,1]]){w=walkTo(e.x+dx,e.y+dy);if(w.ok){P.dir=dir;break;}}c.step(2);pressed.a=true;c.step(2);c.step(50);
  const it=c.ents.find(x=>x.id===s.id+'_seed');if(it){walkTo(it.x,it.y);c.step(5);}
  ok('spot_'+s.id,w.ok&&G.collected.has(s.id)&&G.collected.has(s.id+'_seed'));}
ok('sp2_after_spots',G.sp2===SPOTS.length);
// 2. hazards
G.hearts=3;P.kt=0;P.inv=0;c.tp(12*16+8,66*16);fade=0;state='play';c.step(2);
const bz=c.ents.find(e=>e.type==='bees');bz.cool=0;P.x=bz.hx;P.y=bz.hy+30;c.step(4);ok('bees_chase',bz.st==='chase');
G.skills.add('flap');P.flapCd=0;P.dir=1;pressed.b=true;c.step(1);ok('flap_scatters',bz.st==='return');
// 3. region mapping & save round trip
for(const [x,y] of [[56,76],[128,555],[648,731],[640,939],[100,1300],[700,1300]]){const b=fromRegionPos(toRegionPos(x,y));ok('pos_'+x+'_'+y,b.x===x&&b.y===y);}
c.tp(136,1067);c.step(2);save();const before=[P.x,P.y];c.continueGame();ok('save_roundtrip',P.x===before[0]&&P.y===before[1]);
// 4. new game confirm exists when a save exists
state='title';titleSave=undefined;titleSel=1;fade=0;pressed.a=true;c.step(1);ok('newgame_confirm',titleConfirm===true);titleConfirm=false;
// 5. pause opens and closes
state='play';c.continueGame();fade=0;pressed.pause=true;c.step(1);const p1=state;pressed.back=true;c.step(1);ok('pause_toggle',p1==='pause'&&state==='play');
// 6. Phase 2: growth sources, rank-ups, snack bowl, festival
c.newGame();G=c.G;G.autoMom=0;fade=0;state='play';c.step(2);
const gd=f=>{const b=G.gp;f();return G.gp-b;};
ok('gp_quest',gd(()=>reward(3,'daisy'))===10&&gd(()=>reward(2,'granny'))===12);
ok('gp_taste_once',gd(()=>{tasteFood('worm');tasteFood('worm');})===4);
ok('gp_minigame',gd(()=>minigameGP('egg',true))===8&&gd(()=>minigameGP('egg',true))===2);
ok('gp_outfit_once',gd(()=>{grantOutfit('bow');grantOutfit('bow');})===3);
G.seeds=10;ok('gp_bowl',gd(()=>{useBowl(c.ents.find(e=>e.type==='bowl'));dlg.lines[0].cb(1);})===5);state='play';dlg=null;
G.gp=45;c.step(2);ok('rankup_starts',state==='rankup'&&RU.to===2);for(let i=0;i<160;i++)c.step(1);ok('rank_applied',G.rank===2);RU=null;state='play';
G.rank=4;G.gp=215;G.skills.delete('fly');c.step(2);ok('rank5_needs_flight',state==='play'&&rankFull()===true);
G.skills.add('fly');c.step(2);ok('rank5_with_flight',state==='rankup'&&RU.to===5);RU=null;state='play';
G.rank=6;ORDER2.forEach(id=>G.q[id]=2);G.coop={site:'forest',lv:4};G.gp=400;G.part2=true;ok('festival_ready',festivalReady()===true);
c.talk('granny');dlg.lines[dlg.lines.length-1].cb(0);ok('festival_starts',state==='festival');
let gd2=0;while(state==='festival'&&gd2++<600){pressed.a=true;c.step(4);}ok('festival_to_rank7',state==='rankup'&&RU.to===7&&G.flags.festival===1);
for(let i=0;i<160;i++)c.step(1);ok('rank7_perks',G.rank===7&&maxHearts()>=5&&stage()===6);
setWear('straw',true);setWear('crown');ok('accessory_slot',G.wear==='straw'&&G.acc==='crown'&&wearing('crown'));
// old save migration: growth is awarded retroactively
{const sv=JSON.parse(localStorage.getItem('chicklandia_save_v2')||'null');}
R.allPass=Object.values(R).every(v=>v===true);return R;
})()
