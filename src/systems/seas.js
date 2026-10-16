'use strict';
/* ---------------- Pirate Seas: sailing, ship upgrades, warps, dive/air, skills, island hazards ---------------- */
for(const c of SEA_CAST){const p=SO[c.o];CHARACTERS.push({id:c.id,name:c.name,spr:c.spr,c:p[0]+c.c,r:p[1]+c.r,voice:c.voice,w:c.w});}
function seaRegion(){const r=regionAt();return !!r&&!!r.sea;}
function inDeep(){const c=cellAt();return !!c&&c.kind==='water';}
function shipLevel(){return G.sea.lv.sails+G.sea.lv.hull+G.sea.lv.cannon;}
function curNode(){
  const r=regionAt();if(r&&r.sea){const a=r.area;return a==='fortress'?'fortress':a;}
  return 'harbor';
}
/* ---- sail map ---- */
let SAIL=null,VOY=null;
function openSailMap(){SAIL={sel:Math.max(0,SEA_NODES.findIndex(n=>n.id!==curNode()&&n.need()))};state='sail';SFX.menu();}
function updateSail(){
  if(pressed.back||pressed.fly||pressed.quest||pressed.grow){state='play';SAIL=null;SFX.menu();return;}
  const cur=SEA_NODES.find(n=>n.id===curNode())||SEA_NODES[0],S=SAIL;
  for(const [k,dx,dy] of [['up',0,-1],['down',0,1],['left',-1,0],['right',1,0]]){if(!pressed[k])continue;
    let best=-1,bs=1e9;const c0=SEA_NODES[S.sel];
    SEA_NODES.forEach((n,i)=>{if(i===S.sel)return;const vx=n.mx-c0.mx,vy=n.my-c0.my,al=vx*dx+vy*dy;if(al<=0)return;const sc=al+Math.abs(vx*dy-vy*dx)*2;if(sc<bs){bs=sc;best=i;}});
    if(best>=0){S.sel=best;SFX.menu();}}
  if(pressed.a){const n=SEA_NODES[S.sel];
    if(n.id===cur.id){SFX.deny();return;}
    if(!n.need()){SFX.deny();toast(n.lock,'#ff8080');return;}
    VOY={from:cur,to:n,t:0,dur:Math.round((G.sea.lv.sails>=1?100:150)*(G.rank>=9?0.8:1))};SAIL=null;state='voyage';SFX.magic();}
}
function updateVoyage(){
  const v=VOY;v.t++;if(v.t%14===0)SFX.splash&&SFX.splash();
  if(v.t>=v.dur){VOY=null;state='play';const n=v.to;G.sea.visited[n.id]=1;
    if(n.id==='fortress'){warpTo(n.arrive.x,n.arrive.y,3,null,()=>fortressArrive());}
    else warpTo(n.arrive.x,n.arrive.y,3,null,()=>toast('Welcome to '+n.name+'!','#b2e7e0'));}
}
function drawCoastalOcean(top=0,bottom=H){
  const bands=['#204a74','#255780','#306a9d','#347aa7'];
  bands.forEach((col,i)=>coastRect(ctx,col,0,top+i*(bottom-top)/4,W,(bottom-top)/4+1));
  for(let i=0;i<65;i++){const x=(i*47+tick*(i%3===0?.28:.12))%W,y=top+(i*29)%(bottom-top);
    coastRect(ctx,i%7===0?COAST.foam:'#4a92b8',x,y,3+i%4,1);}
}
function drawSea(sel,shipAt){
  drawCoastalOcean();const nodes=SEA_NODES,cur=nodes.find(n=>n.id===shipAt)||nodes[0];
  ctx.save();ctx.setLineDash([2,4]);
  for(const n of nodes){if(n.id==='harbor'||!n.need())continue;
    const from=n.id==='lighthouse'?nodes[3]:n.id==='fortress'?nodes[4]:nodes[0];
    coastLine(ctx,'#799fb3',[[from.mx,from.my],[n.mx,n.my]],1);}
  const selected=nodes[sel];if(selected&&selected.id!==cur.id)coastLine(ctx,selected.need()?COAST.gold:COAST.red,[[cur.mx,cur.my],[selected.mx,selected.my]],1);
  ctx.restore();
  nodes.forEach((n,i)=>{
    const open=n.need(),s=i===sel,z=n.id==='harbor'?.85:n.id==='fortress'?.7:.8;
    ctx.save();ctx.globalAlpha=open?1:.35;ctx.drawImage(coastalIslandSprite(n.id,!!G.flags.lit),Math.round(n.mx-38*z),Math.round(n.my-41*z),76*z,76*z);ctx.restore();
    if(!open){coastRect(ctx,COAST.ink,n.mx-4,n.my-5,8,10);txt('?',n.mx,n.my-3,6,COAST.rockLight,{align:'center'});}
    const name=n.id==='harbor'?'HARBOR':n.id==='lighthouse'?'LIGHTHOUSE':n.id==='fortress'?'SQUAWKBEARD':n.name;
    txt(open?name:'???',n.mx,n.my+24,5,s?COAST.gold:open?COAST.paper:'#98b3c7',{align:'center',shadow:true});
    if(s){const color=open?COAST.gold:COAST.red;coastPoly(ctx,color,[[n.mx-28,n.my-4],[n.mx-24,n.my],[n.mx-28,n.my+4]]);coastPoly(ctx,color,[[n.mx+28,n.my-4],[n.mx+24,n.my],[n.mx+28,n.my+4]]);}
  });
  if(shipAt)coastTopShip(ctx,cur.mx+(cur.id==='harbor'?20:-23),cur.my+5,.35,G.sea.lv);
  coastLine(ctx,COAST.foam,[[222,152],[222,178]],1);coastLine(ctx,COAST.foam,[[210,165],[234,165]],1);
  coastPoly(ctx,COAST.foam,[[222,154],[219,168],[222,165],[225,168]]);txt('N',222,144,4,COAST.foam,{align:'center'});
}
function drawSail(){
  drawSea(SAIL.sel,curNode());
  txt('WHERE TO, CAPTAIN?',W/2,10,7,COAST.paper,{align:'center',shadow:true});
  txt('SHIP: '+SEA_LEVEL_NAMES[Math.min(3,shipLevel())],W-10,26,4,COAST.foam,{align:'right'});
  const n=SEA_NODES[SAIL.sel];box(6,192,W-12,28,'#192639','#7896ae');
  txt(n.need()?n.name:'UNCHARTED WATERS',W/2,197,6,n.need()?COAST.paper:'#98b3c7',{align:'center'});
  const hint=n.need()?(n.id===curNode()?'You are here.':TOUCH?'A: set sail   MAP: close':'Z: set sail   ESC: close'):n.lock;
  wrap(hint,SET.big?6:5,W-24).slice(0,2).forEach((s,i)=>txt(s,W/2,207+i*6,5,n.need()?COAST.foam:COAST.red,{align:'center'}));
}
function drawVoyage(){
  const v=VOY,k=Math.min(1,v.t/v.dur),x=lerp(119,147,k),y=152+Math.round(Math.sin(tick/9)*2),z=1.8;
  coastRect(ctx,'#94cdd1',0,0,W,89);coastRect(ctx,'#c3dfd6',0,62,W,27);coastRect(ctx,COAST.sandLight,29,30,20,15);
  const cloud=155-(tick*.08)%60;coastRect(ctx,'#dbece0',cloud,29,42,4);coastRect(ctx,'#dbece0',cloud+17,25,14,4);
  drawCoastalOcean(89,H);coastRect(ctx,COAST.foam,0,89,W,1);
  const destination=coastalIslandSprite(v.to.id,!!G.flags.lit),dz=.6+k*.45;
  ctx.drawImage(destination,Math.round(211-38*dz),Math.round(89-41*dz*.45),76*dz,76*dz*.45);
  for(let i=0;i<14;i++){const t=(tick*1.5+i*9)%78;coastRect(ctx,i%3===0?COAST.foam:COAST.shallow,x-59-t*.7,y+9+i%4*3,14-t*.12,1);}
  coastRect(ctx,'#173f5e',x-51,y+13,107,4);ctx.drawImage(coastalShipSprite(G.sea.lv),Math.round(x-37*z),Math.round(y-57*z),76*z,68*z);
  drawPip(stage(),3,0,false,x-34,y-26,.65);
  txt('PIRATE SEAS',12,12,6,COAST.ink);txt('Fair winds, Captain!',12,23,4,COAST.ink);
  box(6,190,W-12,30,'#192639','#7896ae');txt('SAILING TO '+v.to.name,W/2,197,6,COAST.paper,{align:'center'});
  coastRect(ctx,'#344e65',18,210,W-36,3);coastRect(ctx,COAST.foam,18,210,Math.round((W-36)*k),3);
}
function fortressArrive(){if(G.sea.boss<4)fortressStart();else toast("Squawkbeard's old ship. It's quiet now. Press F to sail home.",'#b2e7e0');}
function restoreCoastalLanding(){
  const r=regionAt();if(!r||!(r.sea&&r.kind==='outdoor'||r.id==='city'&&CS.x===4&&CS.y===6))return;
  const b=pBox(P.x,P.y);if(!rectTiles(b.x,b.y,b.w,b.h,true))return;
  const n=SEA_NODES.find(n=>n.id===curNode());if(n){P.x=n.arrive.x;P.y=n.arrive.y;}
}
/* ---- ship upgrades (used by the ship menu) ---- */
function upgradeNeeds(u){return costTextSeas(u);}
function costTextSeas(u){return u.seeds+' SEEDS, '+Object.entries(u.salv).map(([k,n])=>n+' '+SALV_NAME[k]+' (have '+G.sea.salv[k]+')').join(', ');}
function buyUpgrade(u){
  if(G.sea.lv[u.id])return {s:'Already installed!',c:'#a1d970'};
  const miss=[];if(G.seeds<u.seeds)miss.push((u.seeds-G.seeds)+' seeds');for(const k in u.salv)if(G.sea.salv[k]<u.salv[k])miss.push((u.salv[k]-G.sea.salv[k])+' '+SALV_NAME[k]);
  if(miss.length){SFX.deny();return {s:'Still need '+miss.join(', ')+'.',c:'#ff8080'};}
  G.seeds-=u.seeds;for(const k in u.salv)G.sea.salv[k]-=u.salv[k];G.sea.lv[u.id]=1;SFX.questDone();gainGP(GP.upgrade);shake=4;
  toast(u.name+' installed!','#ffe05a');save();return {s:u.name+' is on the ship!',c:'#ffe05a'};
}
/* ---- entities ---- */
function makeSeaEnts(){
  // docks: your ship waits at the end of each island's pier
  for(const [o,key] of [['cove','cove'],['reef','reef'],['volc','volcano'],['light','lighthouse']]){const p=spx(o,1,9);addEnt({type:'shipdock',x:p.x,y:p.y,node:key});}
  addEnt({type:'shipdock',...at(71,80),node:'harbor'});
  {const p=ents.find(e=>e.id==='pinch');if(G.flags.pinchMap&&p)Object.assign(p,at(69,77));}
  for(const w of SEA_WARPS){const a=spx(...w.at),b=spx(...w.to);addEnt({type:'swarp',id:w.id,x:a.x,y:a.y,to:b,label:w.label,dive:w.dive,up:w.up});}
  for(const [id,kind,o,c,r] of SEA_ITEMS){const p=spx(o,c,r);spawnItem(id,kind,p.x,p.y);}
  for(const [id,o,c,r] of XMARKS){if(!G.sea.dug[id]){const p=spx(o,c,r);addEnt({type:'xmark',id,x:p.x,y:p.y+2});}}
  if(G.sea.chest===1)addEnt({type:'seachest',x:spx('coveE',8,3).x,y:spx('coveE',8,3).y,solid:true,w:16});
  // enemies
  for(const [o,c,r,rng] of [['cove',5,9,3],['coveE',10,9,3],['cave',8,5,4],['cave',4,9,3],['caveE',8,6,4],['reefE',6,3,3]]){const p=spx(o,c,r);
    addEnt({type:'crab',x:p.x,y:p.y,hx:p.x,hy:p.y,rng:rng*16,dir:1,sx:Math.floor(p.x/256),sy:Math.floor(p.y/192),stun:0,kt:0,kx:0,flash:0,cool:0});}
  for(const [o,c,r] of [['cove',10,2],['coveE',6,6],['volcE',4,4],['light',8,5],['lightE',10,9]]){const p=spx(o,c,r);addEnt({type:'gullp',x:p.x,y:p.y-30,hx:p.x,hy:p.y-30,st:'patrol',t:0,ph:c*7,hp:1,sx:Math.floor(p.x/256),sy:Math.floor(p.y/192),down:0,flash:0});}
  for(const [o,c,r] of [['deep',5,3],['deep',11,7],['deep',3,8],['deepE',3,4],['deepE',12,7],['deepE',9,9]]){const p=spx(o,c,r);addEnt({type:'jelly',x:p.x,y:p.y,hx:p.x,hy:p.y,ph:c*5,stun:0,sx:Math.floor(p.x/256),sy:Math.floor(p.y/192),flash:0});}
  for(const [o,c,r] of [['deep',9,9],['deepE',10,2],['deepE',6,10],['deep',2,5]]){const p=spx(o,c,r);addEnt({type:'bubbles',x:p.x,y:p.y,ph:c});}
  // lava sparks along the lava rivers
  for(const [o,c,r] of [['volc',7,3],['volc',7,8],['volcE',9,6],['volcE',9,2],['volcE',3,8],['volc',6,9]]){const p=spx(o,c,r);addEnt({type:'spark',x:p.x,y:p.y,bx:p.x,by:p.y,t:Math.floor(Math.random()*160),sx:Math.floor(p.x/256),sy:Math.floor(p.y/192),up:0});}
  makeSeaQuestEnts();
}
/* ---- per-frame ---- */
let warpCool=0,lastSafe=null,lavaT=0,springT=0;
function updateSeas(){
  if(!G||!P)return;
  if(warpCool>0)warpCool--;
  if(P.dashT>0){P.dashT--;}
  if(P.dashCd>0)P.dashCd--;
  const rg=regionAt();if(!rg)return;
  if(rg.sea){
    const under=tileAt(Math.floor(P.x/16),Math.floor((P.y-3)/16));
    if(under==='>'||under==='<'){if(!has('sealegs')&&!P.hop){moveP(under==='>'?0.8:-0.8,0,false);}else if(tick%90===0)float(P.x,P.y-24,'Sea legs!','#b2e7e0');}
    if(under==='{'&&P.inv<=0&&!P.hop&&!(P.dashT>0)){hurt({x:P.x,y:P.y});if(lastSafe){P.x=lastSafe.x;P.y=lastSafe.y;float(P.x,P.y-24,'Hot hot hot!','#ffb030');}}
    else if(under!=='{'&&under!=='w'&&!P.hop)lastSafe={x:P.x,y:P.y};
    if(under==='}'){if(++springT%120===0&&G.hearts<maxHearts()){G.hearts++;SFX.pick();float(P.x,P.y-24,'Ahh... +1','#a1d970');}}else springT=0;
  }
  // swim/dive handling: air meter in deep reef
  if(inDeep()){
    G.air=Math.max(0,(G.air==null?AIR_MAX:G.air)-(G.rank>=9&&tick%3===0?0:1));
    if(G.air<=0&&state==='play'){surface(true);}
  }else G.air=AIR_MAX;
  for(const e of ents){
    if(e.type==='swarp'&&onCur(e)&&warpCool<=0&&state==='play'&&!WARP&&Math.abs(P.x-e.x)<10&&Math.abs(P.y-e.y)<10){
      if(e.dive&&!has('dive')){warpCool=60;float(e.x,e.y-20,'Learn DIVE first!','#b2e7e0');SFX.deny();continue;}
      warpCool=50;warpTo(e.to.x,e.to.y,e.up?1:0,null,()=>{if(e.dive){G.air=AIR_MAX;toast('Blub blub! Watch your AIR.','#b2e7e0');}else if(e.up)toast('Fresh air!','#b2e7e0');});}
  }
  updateSeaQuests();
}
function surface(gasp){
  const up=ents.find(e=>e.type==='swarp'&&e.up&&regionAt()===regionOfPos(e.x,e.y));
  const t=(ents.find(e=>e.type==='swarp'&&e.up&&e.to&&regionOfPos(e.x,e.y)===regionAt())||ents.find(e=>e.type==='swarp'&&e.up)).to;
  G.air=AIR_MAX;warpCool=60;warpTo(t.x,t.y,1,null,()=>toast(gasp?'Pop! Pip bobs up gasping for air.':'Fresh air!','#b2e7e0'));
}
/* ---- skills: Dash, Cannon Peck ---- */
function tryDash(){
  if(!has('dash')||P.dashCd>0||P.hop||P.flying)return;
  P.dashT=14;P.dashCd=70;P.inv=Math.max(P.inv,18);SFX.gust();
  const [dx,dy]=DIRV[P.dir];for(let i=0;i<8;i++)parts.push({x:P.x-dx*8,y:P.y-6-dy*8,vx:-dx*(1+Math.random()),vy:-dy*(1+Math.random())-0.3,g:0,life:14,c:i%2?'#fff8ec':'#ffe05a'});
}
let prevA=false,aHold=0;
function updateCharge(){
  const held=!!keys.a&&state==='play';
  if(held)aHold++;
  if(has('cpeck')&&prevA&&!held&&aHold>=32){cannonPeck();}
  if(!held)aHold=0;prevA=held;P.charge=has('cpeck')&&held&&aHold>10?aHold:0;
}
function cannonPeck(){
  const [dx,dy]=DIRV[P.dir];SFX.brk();shake=5;P.peckT=14;
  for(let i=0;i<18;i++)parts.push({x:P.x+dx*10,y:P.y-6+dy*10,vx:dx*(2+Math.random()*3),vy:dy*(2+Math.random()*3),g:0,life:20,c:i%2?'#ffe05a':'#ff6fae'});
  let hit=0;
  for(const e of ents){if(!onCur(e))continue;
    const vx=e.x-P.x,vy=e.y-P.y,along=vx*dx+vy*dy,lat=Math.abs(vx*dy-vy*dx);
    if(along<-4||along>58||lat>18)continue;
    if(e.type==='crab'){e.kx=dx*5;e.kt=18;e.stun=120;hit++;}
    else if(e.type==='gullp'){gullKnock(e);hit++;}
    else if(e.type==='jelly'){e.stun=150;e.hx=e.x+dx*40;e.hy=e.y+dy*40;hit++;}
    else if(e.type==='boss'){bossHit(2);hit++;}
    else if(e.type==='barrel'){e.vx=dx*3;e.vy=dy*3;e.back=true;hit++;}}
  if(hit)float(P.x,P.y-24,'KAPOW!','#ffe05a');
}
