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
    else warpTo(n.arrive.x,n.arrive.y,3,null,()=>toast('Welcome to '+n.name+'!','#a6e0ff'));}
}
const SEA_COL={harbor:'#c49a5c',cove:'#f2dca0',reef:'#ff9cd0',volcano:'#e8683c',lighthouse:'#e8e8f0',fortress:'#8a8a9a'};
function drawSea(sel,shipAt){
  for(let i=0;i<14;i++){ctx.fillStyle=['#1f4fa0','#2358ac','#2860b8','#2c68c0','#306fc8','#3476cf','#387dd6','#3c84dc','#408be2','#4492e8','#4899ee','#4ca0f2','#50a7f6','#54aefa'][i];ctx.fillRect(0,i*16,W,16);}
  for(let k=0;k<30;k++){const x=(k*47+tick*0.4)%W,y=(k*29)%H;ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fillRect(Math.round(x),y,6,1);ctx.fillRect(Math.round(x)+2,y+1,3,1);}
  const nodes=SEA_NODES;
  ctx.strokeStyle='rgba(255,248,236,0.45)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
  for(const n of nodes){if(n.id==='harbor')continue;const from=n.id==='volcano'||n.id==='cove'||n.id==='reef'?nodes[0]:n.id==='lighthouse'?nodes[3]:nodes[4];
    if(!n.need())continue;ctx.beginPath();ctx.moveTo(from.mx,from.my);ctx.lineTo(n.mx,n.my);ctx.stroke();}
  ctx.setLineDash([]);
  nodes.forEach((n,i)=>{const open=n.need(),s=i===sel;
    if(s){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.beginPath();ctx.arc(n.mx,n.my,19,0,7);ctx.fill();}
    ctx.fillStyle='#21142b';ctx.beginPath();ctx.arc(n.mx,n.my,17,0,7);ctx.fill();
    ctx.fillStyle=open?SEA_COL[n.id]:'#4a5a7a';ctx.beginPath();ctx.arc(n.mx,n.my,15,0,7);ctx.fill();
    if(open){ctx.fillStyle='#21142b';
      if(n.id==='volcano'){ctx.beginPath();ctx.moveTo(n.mx-9,n.my+8);ctx.lineTo(n.mx,n.my-9);ctx.lineTo(n.mx+9,n.my+8);ctx.fill();ctx.fillStyle='#ffb030';ctx.fillRect(n.mx-2,n.my-9,4,3);}
      else if(n.id==='lighthouse'){ctx.fillRect(n.mx-3,n.my-9,6,17);ctx.fillStyle='#e03838';ctx.fillRect(n.mx-3,n.my-3,6,4);ctx.fillStyle='#ffd83a';ctx.fillRect(n.mx-2,n.my-11,4,3);}
      else if(n.id==='fortress'){ctx.fillStyle='#fff8ec';ctx.fillRect(n.mx-4,n.my-5,8,7);ctx.fillStyle='#21142b';ctx.fillRect(n.mx-3,n.my-3,2,2);ctx.fillRect(n.mx+1,n.my-3,2,2);ctx.fillRect(n.mx-1,n.my+2,2,2);}
      else if(n.id==='reef'){ctx.fillStyle='#e03838';ctx.fillRect(n.mx-6,n.my,3,8);ctx.fillRect(n.mx-1,n.my-5,3,13);ctx.fillRect(n.mx+4,n.my+1,3,7);}
      else if(n.id==='cove'){ctx.fillStyle='#2f7d3a';ctx.fillRect(n.mx-1,n.my-8,3,12);ctx.fillRect(n.mx-7,n.my-8,14,3);}
      else{ctx.fillStyle='#9a6234';ctx.fillRect(n.mx-8,n.my+2,16,4);ctx.fillRect(n.mx-6,n.my-6,3,8);ctx.fillRect(n.mx+3,n.my-6,3,8);}}
    else txt('?',n.mx,n.my-4,8,'#c8d0e8',{align:'center'});
  });
  const at=nodes.find(n=>n.id===shipAt);if(at&&!VOY)ctx.drawImage(SPR.shipIcon,at.mx-12,at.my-28);
}
function drawSail(){
  drawSea(SAIL.sel,curNode());
  box(8,8,W-16,16,'#1d1430','#a6e0ff');txt('WHERE TO, CAPTAIN?',W/2,13,7,'#a6e0ff',{align:'center'});
  const n=SEA_NODES[SAIL.sel];box(8,H-34,W-16,26,'#1d1430','#6a5a90');
  txt(n.need()?n.name:'???',W/2,H-30,7,n.need()?'#fff8ec':'#8a7ab0',{align:'center'});
  txt(n.need()?(n.id===curNode()?'You are here.':'Z: set sail     ESC: close'):n.lock,W/2,H-19,5,n.need()?'#b8a8d8':'#ff8080',{align:'center'});
  txt('SHIP: '+SEA_LEVEL_NAMES[Math.min(3,shipLevel())],W-14,28,5,'#ffd83a',{align:'right'});
}
function drawVoyage(){
  const v=VOY,k=Math.min(1,v.t/v.dur),x=lerp(v.from.mx,v.to.mx,k),y=lerp(v.from.my,v.to.my,k);
  drawSea(-1,null);ctx.drawImage(SPR.shipIcon,Math.round(x-17),Math.round(y-28+Math.sin(tick/6)*2));
  for(let i=0;i<5;i++){const t=(v.t*1.5+i*9)%40;ctx.fillStyle='rgba(255,255,255,'+(1-t/40)+')';ctx.fillRect(Math.round(x-t*0.6+6),Math.round(y+3+i%2),2,1);}
  txt('Sailing to '+v.to.name+'...',W/2,H-20,6,'#fff8ec',{align:'center',shadow:true});
}
function fortressArrive(){if(G.sea.boss<4)fortressStart();else toast("Squawkbeard's old ship. It's quiet now.",'#a6e0ff');}
/* ---- ship upgrades (used by the ship menu) ---- */
function upgradeNeeds(u){return costTextSeas(u);}
function costTextSeas(u){return u.seeds+' SEEDS, '+Object.entries(u.salv).map(([k,n])=>n+' '+SALV_NAME[k]+' (have '+G.sea.salv[k]+')').join(', ');}
function buyUpgrade(u){
  if(G.sea.lv[u.id])return {s:'Already installed!',c:'#94dc64'};
  const miss=[];if(G.seeds<u.seeds)miss.push((u.seeds-G.seeds)+' seeds');for(const k in u.salv)if(G.sea.salv[k]<u.salv[k])miss.push((u.salv[k]-G.sea.salv[k])+' '+SALV_NAME[k]);
  if(miss.length){SFX.deny();return {s:'Still need '+miss.join(', ')+'.',c:'#ff8080'};}
  G.seeds-=u.seeds;for(const k in u.salv)G.sea.salv[k]-=u.salv[k];G.sea.lv[u.id]=1;SFX.questDone();gainGP(GP.upgrade);shake=4;
  toast(u.name+' installed!','#ffd83a');save();return {s:u.name+' is on the ship!',c:'#ffd83a'};
}
/* ---- entities ---- */
function makeSeaEnts(){
  // docks: your ship waits at the end of each island's pier
  for(const [o,c,r,key] of [['cove',0,8,'cove'],['reef',0,8,'reef'],['volc',0,8,'volcano'],['light',0,8,'lighthouse']]){const p=spx(o,c,r);addEnt({type:'shipdock',x:p.x,y:p.y+4,node:key});}
  {const p=ents.find(e=>e.id==='pinch');if(G.flags.pinchMap&&p)Object.assign(p,at(69,78));}
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
    if(under==='>'||under==='<'){if(!has('sealegs')&&!P.hop){moveP(under==='>'?0.8:-0.8,0,false);}else if(tick%90===0)float(P.x,P.y-24,'Sea legs!','#a6e0ff');}
    if(under==='{'&&P.inv<=0&&!P.hop&&!(P.dashT>0)){hurt({x:P.x,y:P.y});if(lastSafe){P.x=lastSafe.x;P.y=lastSafe.y;float(P.x,P.y-24,'Hot hot hot!','#ffb030');}}
    else if(under!=='{'&&under!=='w'&&!P.hop)lastSafe={x:P.x,y:P.y};
    if(under==='}'){if(++springT%120===0&&G.hearts<maxHearts()){G.hearts++;SFX.pick();float(P.x,P.y-24,'Ahh... +1','#94dc64');}}else springT=0;
  }
  // swim/dive handling: air meter in deep reef
  if(inDeep()){
    G.air=Math.max(0,(G.air==null?AIR_MAX:G.air)-(G.rank>=9&&tick%3===0?0:1));
    if(G.air<=0&&state==='play'){surface(true);}
  }else G.air=AIR_MAX;
  for(const e of ents){
    if(e.type==='swarp'&&onCur(e)&&warpCool<=0&&state==='play'&&!WARP&&Math.abs(P.x-e.x)<10&&Math.abs(P.y-e.y)<10){
      if(e.dive&&!has('dive')){warpCool=60;float(e.x,e.y-20,'Learn DIVE first!','#a6e0ff');SFX.deny();continue;}
      warpCool=50;warpTo(e.to.x,e.to.y,e.up?1:0,null,()=>{if(e.dive){G.air=AIR_MAX;toast('Blub blub! Watch your AIR.','#a6e0ff');}else if(e.up)toast('Fresh air!','#a6e0ff');});}
  }
  updateSeaQuests();
}
function surface(gasp){
  const up=ents.find(e=>e.type==='swarp'&&e.up&&regionAt()===regionOfPos(e.x,e.y));
  const t=(ents.find(e=>e.type==='swarp'&&e.up&&e.to&&regionOfPos(e.x,e.y)===regionAt())||ents.find(e=>e.type==='swarp'&&e.up)).to;
  G.air=AIR_MAX;warpCool=60;warpTo(t.x,t.y,1,null,()=>toast(gasp?'Pop! Pip bobs up gasping for air.':'Fresh air!','#a6e0ff'));
}
/* ---- skills: Dash, Cannon Peck ---- */
function tryDash(){
  if(!has('dash')||P.dashCd>0||P.hop||P.flying)return;
  P.dashT=14;P.dashCd=70;P.inv=Math.max(P.inv,18);SFX.gust();
  const [dx,dy]=DIRV[P.dir];for(let i=0;i<8;i++)parts.push({x:P.x-dx*8,y:P.y-6-dy*8,vx:-dx*(1+Math.random()),vy:-dy*(1+Math.random())-0.3,g:0,life:14,c:i%2?'#fff8ec':'#ffd83a'});
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
  for(let i=0;i<18;i++)parts.push({x:P.x+dx*10,y:P.y-6+dy*10,vx:dx*(2+Math.random()*3),vy:dy*(2+Math.random()*3),g:0,life:20,c:i%2?'#ffd83a':'#ff6fae'});
  let hit=0;
  for(const e of ents){if(!onCur(e))continue;
    const vx=e.x-P.x,vy=e.y-P.y,along=vx*dx+vy*dy,lat=Math.abs(vx*dy-vy*dx);
    if(along<-4||along>58||lat>18)continue;
    if(e.type==='crab'){e.kx=dx*5;e.kt=18;e.stun=120;hit++;}
    else if(e.type==='gullp'){gullKnock(e);hit++;}
    else if(e.type==='jelly'){e.stun=150;e.hx=e.x+dx*40;e.hy=e.y+dy*40;hit++;}
    else if(e.type==='boss'){bossHit(2);hit++;}
    else if(e.type==='barrel'){e.vx=dx*3;e.vy=dy*3;e.back=true;hit++;}}
  if(hit)float(P.x,P.y-24,'KAPOW!','#ffd83a');
}
