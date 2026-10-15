'use strict';
/* ---------------- Pirate Seas part 2: enemies, island puzzles, Captain Squawkbeard (3 stages), the ending ---------------- */
/* ---- enemies ---- */
function gullKnock(e){e.st='gone';e.gone=600;e.flash=10;SFX.honk();puff(e.x,e.y,10,['#fff8ec','#e8e8f0'],1.4,0.05);float(e.x,e.y-16,'SQUAWK!','#fff8ec');}
function updGull(e){
  if(e.flash>0)e.flash--;
  if(e.gone>0){e.gone--;if(e.gone<=0){e.st='patrol';e.t=0;e.x=e.hx;e.y=e.hy;}return;}
  e.t++;
  const dx=P.x-e.x,dy=P.y-6-e.y;
  if(e.st==='patrol'){e.x=e.hx+Math.cos(e.t/50+e.ph)*34;e.y=e.hy+Math.sin(e.t/37+e.ph)*8;e.flip=Math.sin(e.t/50+e.ph)>0;
    if(e.t>90&&Math.hypot(P.x-e.hx,P.y-e.hy)<(wearing('ninja')?38:92)&&!P.hop){e.st='tell';e.t=0;e.tx=P.x;e.ty=P.y-6;SFX.honk();}}
  else if(e.st==='tell'){e.x+=(Math.random()-.5)*1.2;if(e.t>=28){e.st='dive';e.t=0;e.tx=P.x;e.ty=P.y-6;}}
  else if(e.st==='dive'){const vx=e.tx-e.x,vy=e.ty-e.y,d=Math.hypot(vx,vy)||1;e.flip=vx>0;
    if(d>4&&e.t<44){e.x+=vx/d*3.2;e.y+=vy/d*3.2;}else{e.st='rest';e.t=0;}
    if(Math.abs(P.x-e.x)<10&&Math.abs(P.y-6-e.y)<10&&P.inv<=0&&!P.hop){hurt(e);e.st='rest';e.t=0;}}
  else if(e.st==='rest'){if(e.t>=36){e.st='rise';e.t=0;}}
  else if(e.st==='rise'){const vx=e.hx-e.x,vy=e.hy-e.y,d=Math.hypot(vx,vy);if(d<3){e.st='patrol';e.t=-60;}else{e.x+=vx/d*1.4;e.y+=vy/d*1.4;}}
}
function updJelly(e){
  if(e.flash>0)e.flash--;
  if(e.stun>0){e.stun--;e.x+=(e.hx-e.x)*0.04;e.y+=(e.hy-e.y)*0.04;return;}
  e.ph+=0.02;e.x=e.hx+Math.cos(e.ph*1.3)*22;e.y=e.hy+Math.sin(e.ph)*14;
  if(Math.abs(P.x-e.x)<10&&Math.abs(P.y-6-e.y)<9&&P.inv<=0&&!P.hop){hurt(e);e.stun=60;}
}
function updSpark(e){
  e.t++;const c=e.t%190;
  if(c<44){const p=c/44;e.up=1;e.x=e.bx+Math.sin(p*Math.PI)*6;e.y=e.by-Math.sin(p*Math.PI)*38;
    if(Math.abs(P.x-e.x)<8&&Math.abs(P.y-6-e.y)<9&&P.inv<=0&&!P.hop&&!(P.dashT>0))hurt(e);}
  else{e.up=0;e.x=e.bx;e.y=e.by;}
}
function updBubbles(e){if(e.cool>0){e.cool--;return;}
  if(Math.abs(P.x-e.x)<12&&Math.abs(P.y-6-e.y)<14){G.air=Math.min(AIR_MAX,(G.air||0)+1500);e.cool=700;SFX.pop();float(e.x,e.y-18,'AIR!','#b2e7e0');}}
/* ---- peck / flap hooks ---- */
function seaPeck(e,f,pr){
  if(e.type==='gullp'&&!e.gone&&ov(pr,{x:e.x-9,y:e.y-9,w:18,h:16})){gullKnock(e);return true;}
  if(e.type==='jelly'&&ov(pr,{x:e.x-10,y:e.y-10,w:20,h:16})){e.stun=140;e.hx=e.x+(e.x<P.x?-26:26);e.flash=10;SFX.brk();float(e.x,e.y-14,'BLOOP!','#ff9cd0');return true;}
  if(e.type==='xmark'&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-4-f.y)<14){
    if(!has('peck')){SFX.clunk();float(e.x,e.y-14,'Too hard to dig!');return true;}
    e.dead=true;G.sea.dug[e.id]=1;SFX.brk();puff(e.x,e.y-4,14,['#e8d8b0','#b69965','#fff8ec'],1.4,0.08);
    const n=Object.keys(G.sea.dug).length;toast('Dug up a spot! ('+n+'/3)','#ffe05a');
    if(n>=3){G.sea.chest=1;const p=spx('coveE',8,3);addEnt({type:'seachest',x:p.x,y:p.y,solid:true,w:16});toast('A treasure chest rises from the sand!','#ff9cd0');SFX.questDone();}
    save();return true;}
  if(e.type==='seachest'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-6-f.y)<16){openSeaChest(e);return true;}
  if(e.type==='brazier'&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-6-f.y)<14){lightBrazier(e);return true;}
  if(e.type==='boss'&&e.st==='land'&&Math.abs(e.x-f.x)<22&&Math.abs(e.y-8-f.y)<20){bossHit(1);return true;}
  return false;
}
function seaTalkChest(f){for(const e of ents)if(e.type==='seachest'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-6-f.y)<16){openSeaChest(e);return true;}return false;}
function openSeaChest(e){
  if(G.sea.chest===2){say([{who:'me',text:"An empty chest. What a treasure it was!"}]);return;}
  G.sea.chest=2;e.opened=true;SFX.chest();shake=3;addSeeds(4,2,0);G.sea.salv.hullplank+=1;
  toast('TREASURE! 4 seeds and a HULL PLANK!','#ffe05a');say([{who:'me',text:"Pieces of eight! Four seeds and a sturdy plank for the ship. Let's tell Polly!"}]);save();
}
function seaFlap(dx,dy){
  for(const e of ents){if(e.type!=='barrel'||e.back)continue;
    const vx=e.x-P.x,vy=e.y-P.y,along=vx*dx+vy*dy,lat=Math.abs(vx*dy-vy*dx);
    if(along>-6&&along<54&&lat<24){e.back=true;e.st='back';SFX.gust();float(e.x,e.y-14,'WHOOSH!','#b2e7e0');}}
}
/* ---- Lighthouse puzzle ---- */
const BRAZIERS=[['sun',3,5],['moon',11,5],['star',3,9],['wave',11,9]];
function makeSeaQuestEnts(){
  BRAZIERS.forEach(([k,c,r])=>{const p=spx('lightE',c,r);addEnt({type:'brazier',sym:k,x:p.x,y:p.y,solid:true,w:12,lit:!!G.flags.lit});});
}
function lightBrazier(e){
  if(G.flags.lit){float(e.x,e.y-20,'Already glowing!','#ffe05a');return;}
  const next=SUN_ORDER[G.sea.lamps||0];
  if(e.sym===next){e.lit=true;G.sea.lamps=(G.sea.lamps||0)+1;SFX.magic();puff(e.x,e.y-8,12,['#ffb030','#ffe05a'],1.4,-0.02);float(e.x,e.y-20,(G.sea.lamps)+'/4','#ffe05a');
    if(G.sea.lamps>=4){G.flags.lit=1;toast('THE LIGHTHOUSE IS LIT! Tell Keeper Gus.','#ff9cd0');SFX.fanfare();shake=6;}save();}
  else{G.sea.lamps=0;for(const b of ents)if(b.type==='brazier')b.lit=false;SFX.deny();float(e.x,e.y-20,'Fizzle! Wrong order.','#ff8080');puff(e.x,e.y-6,8,['#8a8a9a','#e8e8f0'],1,0.04);}
}
function updateSeaQuests(){
  // the sunken bell and other pick-ups need nothing special; keep braziers in sync after loading
  if(G.flags.lit)for(const e of ents)if(e.type==='brazier'&&!e.lit)e.lit=true;
}
/* ---- Captain Squawkbeard ---- */
let BOSS=null;
function bossActive(){const r=regionAt();return !!r&&r.id==='fortress'&&!!G.sea&&G.sea.boss>0&&G.sea.boss<4;}
function fortressStart(){startBossStage(G.sea.boss>0&&G.sea.boss<4?G.sea.boss:1);}
function startBossStage(st){
  ents=ents.filter(e=>!['boss','barrel','bshadow'].includes(e.type));G.sea.boss=st;
  if(st>=3){startChase();return;}
  const o=SO.fort,bx=o[0]*16+128,by=o[1]*16+34;
  BOSS={st,hp:st===1?4:3,max:st===1?4:3,t:0,intro:90};
  addEnt({type:'boss',st:'enter',x:bx,y:by,hx:bx,hy:by,t:0,flash:0,flip:false,tx:bx,ty:by});
  toast(st===1?'STAGE 1: Peck him when he lands!':'STAGE 2: Flap the barrels back at him!','#ffe05a');
}
function bossEnt(){return ents.find(e=>e.type==='boss');}
function bossHit(n){
  const b=bossEnt();if(!b||!BOSS||BOSS.intro>0||(b.st==='dazed'))return;
  BOSS.hp-=n;b.flash=18;SFX.brk();shake=6;float(b.x,b.y-24,'SQUAWK!','#ff8080');puff(b.x,b.y-8,14,['#fff8ec','#e8e8f0','#ff8080'],1.8,0.05);
  if(BOSS.hp<=0){b.st='dazed';b.t=0;ents=ents.filter(e=>e.type!=='barrel');return;}
  if(BOSS.st===1){b.st='rise';b.t=0;}
}
function stageClear(){
  const next=G.sea.boss+1;toast('Stage cleared!','#a1d970');SFX.questDone();save();
  const b=bossEnt();if(b)b.dead=true;
  say([{who:'me',text:next===2?"He's mad now! He's throwing barrels! WING FLAP blows them right back at him!":"He's running! After him through the sky! DASH to catch him and GLIDE to dodge!"}],
    ()=>{if(next===3&&!(has('dash')&&has('glide'))){G.sea.boss=2;startBossStage(2);toast('Stage 3 needs DASH and GLIDE. Learn them first!','#ff9cd0');say([{who:'me',text:"I need DASH (Sea Tree) and GLIDE (Sky Tree) to catch him in the air!"}]);}else startBossStage(next);});
  G.sea.boss=next>=3?(has('dash')&&has('glide')?3:2):next;
}
function updBoss(e){
  const o=SO.fort,B=BOSS;if(!B)return;
  if(e.flash>0)e.flash--;
  if(B.intro>0){B.intro--;e.y=e.hy+Math.sin(tick/9)*3;return;}
  e.t++;
  if(e.st==='dazed'){e.y+=1.2;e.x+=(e.hx-e.x)*0.02;if(e.t>50)stageClear();return;}
  if(B.st===1){
    if(e.st==='enter'||e.st==='hover'){e.st='hover';e.x=e.hx+Math.sin(e.t/28)*58;e.y=e.hy+Math.sin(e.t/17)*5;e.flip=Math.cos(e.t/28)>0;
      if(e.t>80){e.st='tell';e.t=0;e.tx=P.x;e.ty=P.y;}}
    else if(e.st==='tell'){e.x+=(e.tx-e.x)*0.08;e.y=e.hy+Math.sin(e.t/4)*3;if(e.t===1)SFX.honk();if(e.t>=46){e.st='dive';e.t=0;}}
    else if(e.st==='dive'){const gy=e.ty-4;e.x+=(e.tx-e.x)*0.3;e.y+=(gy-e.y)*0.28;
      if(e.t>=14){e.st='land';e.t=0;e.x=e.tx;e.y=gy;shake=6;SFX.brk();puff(e.x,e.y+4,12,['#e8d8b0','#fff8ec'],1.6,0.06);
        if(Math.abs(P.x-e.x)<20&&Math.abs(P.y-4-e.y)<18&&P.inv<=0&&!P.hop)hurt(e);}}
    else if(e.st==='land'){if(e.t>=110){e.st='rise';e.t=0;}}
    else if(e.st==='rise'){e.y+=(e.hy-e.y)*0.12;e.x+=(e.hx-e.x)*0.04;if(e.t>=34){e.st='hover';e.t=0;}}
  }else{
    e.st='perch';e.x=e.hx+Math.sin(e.t/50)*18;e.y=e.hy+Math.sin(e.t/13)*3;e.flip=Math.cos(e.t/50)<0;
    if(e.t%140===70){const col=Math.max(2,Math.min(13,Math.round((P.x-o[0]*16)/16)))*16+8+o[0]*16;
      const row=Math.max(3,Math.min(9,Math.round((P.y-o[1]*16)/16)));
      addEnt({type:'barrel',st:'fall',t:0,x:col,y:o[1]*16+row*16+12,fy:o[1]*16+row*16+12,lane:row,dirx:Math.random()<0.5?1:-1,vx:0,vy:0});SFX.honk();}
  }
}
function updBarrel(e){
  const b=bossEnt();
  if(e.st==='fall'){e.t++;if(e.t>=36){e.st='roll';e.vx=e.dirx*1.7;e.vy=0;e.x=SO.fort[0]*16+(e.dirx>0?36:236);SFX.bonk&&SFX.bonk();}return;}
  if(e.st==='roll'){e.x+=e.vx;e.t++;
    if(Math.abs(P.x-e.x)<10&&Math.abs(P.y-4-e.y)<9&&P.inv<=0&&!P.hop&&!(P.dashT>0)){hurt(e);e.dead=true;puff(e.x,e.y,8,['#b69965','#fff8ec'],1.4,0.05);}
    if(e.x<SO.fort[0]*16+20||e.x>SO.fort[0]*16+236)e.dead=true;return;}
  if(e.st==='back'&&b){const vx=b.x-e.x,vy=b.y-e.y,d=Math.hypot(vx,vy)||1;e.x+=vx/d*3.4;e.y+=vy/d*3.4;
    if(d<16){e.dead=true;bossHit(1);}}
}
function bossRetry(){
  toast('Pinch fishes you out! Try this stage again!','#ffe05a');
  const o=SO.fort;P.x=o[0]*16+60;P.y=o[1]*16+8*16+12;P.inv=60;P.kt=0;G.hearts=maxHearts();
  if(state==='chase'){state='play';CH=null;}
  startBossStage(Math.min(G.sea.boss||1,3)===3&&!(has('dash')&&has('glide'))?2:Math.max(1,Math.min(3,G.sea.boss||1)));
}
/* ---- stage 3: the chase through the sky ---- */
let CH=null;
function startChase(){
  ents=ents.filter(e=>!['boss','barrel'].includes(e.type));
  CH={t:0,x:56,y:110,hp:3,bx:206,by:100,bph:0,balls:[],inv:0,dashT:0,dashCd:0,flash:0,bstun:0,intro:80};
  state='chase';fade=0;toast('STAGE 3: Catch him in the sky!','#ffe05a');SFX.fanfare();
}
function updateChase(){
  const c=CH;c.t++;
  if(c.intro>0){c.intro--;return;}
  if(c.inv>0)c.inv--;if(c.dashCd>0)c.dashCd--;if(c.flash>0)c.flash--;if(c.bstun>0)c.bstun--;
  const sp=has('glide')?2.4:1.8;
  const ix=(keys.right?1:0)-(keys.left?1:0),iy=(keys.down?1:0)-(keys.up?1:0);
  if(c.dashT>0){c.dashT--;c.x+=4.6;}else{c.x+=ix*sp;c.y+=iy*sp;}
  c.x=clamp(c.x,24,190);c.y=clamp(c.y,50,190);
  if((pressed.dash||pressed.a)&&c.dashCd<=0&&has('dash')){c.dashT=14;c.dashCd=60;SFX.gust();}
  c.bph+=0.03;
  if(c.bstun<=0){c.bx+=(206-c.bx)*0.04+(c.bx>200&&c.dashT>0?0:0);c.by=110+Math.sin(c.bph*2)*54;}
  if(c.t%38===0)c.balls.push({x:W+10,y:60+((c.t*53)%130),v:1.9+Math.min(1,c.t/1500)});
  for(const b of c.balls){b.x-=b.v;if(c.inv<=0&&Math.abs(b.x-c.x)<9&&Math.abs(b.y-c.y)<9){b.x=-99;G.hearts--;c.inv=70;SFX.hurt();shake=5;
      if(G.hearts<=0){G.hearts=maxHearts();toast('Pinch fishes you out! Try again!','#ffe05a');startChase();return;}}}
  c.balls=c.balls.filter(b=>b.x>-20);
  if(c.dashT>0&&c.bstun<=0&&Math.abs(c.x-c.bx)<22&&Math.abs(c.y-c.by)<20){c.hp--;c.bstun=50;c.bx=min2(240,c.bx+30);c.flash=20;SFX.brk();shake=6;toast(c.hp>0?'HIT! '+c.hp+' to go!':'GOT HIM!','#ffe05a');
    if(c.hp<=0){bossWin();return;}}
}
function min2(a,b){return a<b?a:b;}
function drawChase(){
  const c=CH;drawSky(c.t*2);ctx.fillStyle='#2a5fb0';ctx.fillRect(0,170,W,54);
  for(let i=0;i<20;i++){const x=((i*37-c.t*3)%W+W)%W;ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillRect(x,172+(i*7)%40,10,1);}
  for(let i=0;i<4;i++){const x=((i*90-c.t*1.5)%(W+60)+W+60)%(W+60)-30;cloud(Math.round(x),30+i*22,1+(i%2));}
  for(const b of c.balls)drawImg(SPR.cannonball,Math.round(b.x-4),Math.round(b.y-4));
  if(!(c.flash>0&&Math.floor(c.flash/2)%2)){const s=flipOf(SPR.squawk);ctx.drawImage(s,Math.round(c.bx-20),Math.round(c.by-18));}
  if(!(c.inv>0&&Math.floor(c.inv/3)%2)){if(c.dashT>0){ctx.fillStyle='rgba(255,216,58,0.5)';ctx.fillRect(Math.round(c.x-40),Math.round(c.y-4),40,6);}
    drawPip(stage(),3,Math.floor(c.t/5)%2,true,Math.round(c.x),Math.round(c.y+8),1);}
  for(let i=0;i<maxHearts();i++)drawImg(i<G.hearts?SPR.heart:SPR.heartE,8+i*9,8);
  box(70,6,116,14,'#192639','#ff8080');txt('SQUAWKBEARD',78,10,5,'#fff8ec');for(let i=0;i<3;i++){ctx.fillStyle=i<c.hp?'#ff8080':'#425b72';ctx.fillRect(150+i*10,10,8,6);}
  txt(has('dash')?'Z or SHIFT: DASH into him!':'You need DASH!',W/2,H-14,5,'#fff8ec',{align:'center',shadow:true});
  if(c.intro>0)txt('GET READY!',W/2,100,10,'#ffe05a',{align:'center',shadow:true});
}
function bossWin(){
  CH=null;state='play';G.sea.boss=4;G.flags.seas=1;G.flags.skyMap=1;
  ents=ents.filter(e=>!['boss','barrel'].includes(e.type));
  const o=SO.fort;P.x=o[0]*16+60;P.y=o[1]*16+8*16+12;P.inv=60;
  reward(QUESTS.sea_boss.reward,'sea_boss');addSeeds(12,2,0);toast('Squawkbeard dropped his chest: 12 golden seeds!','#ffe05a');SFX.fanfare();save();
  finaleRank(9,startSeaEnding);
}
function startSeaEnding(){
  PIN={t:0,line:0,shown:0,lines:SEA_END_LINES,sunset:true,after:()=>{const h=SEA_NODES[0].arrive;warpTo(h.x,h.y,0,null,()=>say([{who:'me',text:"Captain of the Seas! And a map of the SKY... I wonder what Elda's egg is up to?"}]));}};
  state='pinch';fade=0;SFX.fanfare();
}
const SEA_END_LINES=["YARRR! Ye did it, Captain Pip! The Pirate Seas be safe!","Squawkbeard dropped his treasure chest. Golden seeds, and... what's this?","An ANCIENT MAP! It shows CLOUDS, floating islands and a great storm!","And I hear Elda's egg is about to hatch. The sky awaits ye, Pip!","TO BE CONTINUED... THE SKY KINGDOM"];

function seaHint(){
  if(!G.flags.pinchMap)return null;
  if(G.q.sea_cove===0)return "Capn Pinch is at the city harbor with a treasure map. Talk to him!";
  for(const id of ORDER5)if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[QUEST_GIVER[id]]+" the good news!";
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===5&&G.train[k]===1)return t.hint();}
  for(const id of ORDER5)if(G.q[id]===1)return QUESTS[id].hint();
  if(!G.flags.seas)return G.sea.lv.cannon?"Sail to Squawkbeard's ship when you're ready!":"Upgrade your ship at the harbor: sails, hull and a seed cannon!";
  return null;
}
