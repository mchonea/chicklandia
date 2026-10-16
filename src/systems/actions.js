'use strict';
/* ---------------- player actions ---------------- */
function frontPoint(){const [dx,dy]=DIRV[P.dir];return {x:P.x+dx*10,y:P.y-4+dy*10,dx,dy};}
function action(){
  const f=frontPoint();
  if(cityInteriorAction(f))return;
  for(const e of ents){if(e.type!=='npc'||!onCur(e))continue;
    if(Math.abs(f.x-e.x)<e.w/2+7&&f.y>e.y-20&&f.y<e.y+7){talkTo(e);return;}}
  if(villageAction(f))return;
  for(const e of ents){if(e.type==='shipdock'&&onCur(e)&&G.sea.open&&Math.abs(f.x-e.x)<26&&Math.abs(f.y-(e.y-4))<20){openCatalog('ship');return;}if(e.type==='seachest'&&onCur(e)&&Math.abs(f.x-e.x)<16&&Math.abs(f.y-(e.y-6))<16){openSeaChest(e);return;}}
  for(const e of ents){if(e.type==='nook'&&onCur(e)&&Math.abs(f.x-e.x)<16&&Math.abs(f.y-(e.y-4))<12){useNook();return;}}
  for(const e of ents){if(e.type==='bowl'&&has('fly')&&onCur(e)&&Math.abs(f.x-e.x)<14&&Math.abs(f.y-(e.y-4))<12){useBowl(e);return;}}
  for(const e of ents){if(e.type==='chest'&&onCur(e)&&Math.abs(f.x-e.x)<14&&Math.abs(f.y-(e.y-4))<12){openChest();return;}}
  const plot=ents.filter(e=>e.type==='plot'&&onCur(e)&&Math.abs(f.x-e.x)<11&&Math.abs(f.y-(e.y-5))<11).sort((a,b)=>Math.hypot(f.x-a.x,f.y-a.y+5)-Math.hypot(f.x-b.x,f.y-b.y+5))[0];
  if(plot){P.peckT=10;usePlot(plot);return;}
  const c=Math.floor(f.x/16),r=Math.floor(f.y/16);
  if(tileAt(c,r)==='n'){trySleep();return;}
  if(tileAt(c,r)==='s'&&siteFor(c,r)){siteSign(siteFor(c,r),c,r);return;}
  if(tileAt(c,r)==='s'){const s=SIGNS[c+','+r];if(s){say([{who:{x:c*16+8,y:r*16,name:s.name},text:s.text}]);return;}}
  peck(f);
}
function peck(f){
  P.peckT=12;SFX.peck();
  const pr={x:f.x-8,y:f.y-8,w:16,h:16};
  if(MG&&MG.type==='bonk')for(const e of ents){if(e.type==='hole'&&e.up>0&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-6-f.y)<14){
    MG.score+=e.gold?2:1;e.up=0;SFX.bonk();puff(e.x,e.y-8,8,e.gold?['#ffd21e','#2d664e']:['#f07832','#2d664e']);float(e.x,e.y-18,e.gold?'+2!':'+1','#ffe05a');return;}}
  if(MG&&MG.type==='ffly')for(const e of ents){if(e.type==='ffly'&&Math.abs(e.x-f.x)<15&&Math.abs(e.y-8-f.y)<15){
    e.dead=true;MG.score++;SFX.chirp();puff(e.x,e.y-8,6,['#e8ff70','#fff8ec'],0.8,0);float(e.x,e.y-16,''+MG.score,'#e8ff70');return;}}
  for(const e of ents){
    if(hazardPeck(e,f,pr)||cityPeck(e,f,pr)||villagePeck(e,f,pr)||seaPeck(e,f,pr)||skyPeck(e,f,pr))return;
    if(e.type==='worm'&&Math.abs(e.x-f.x)<12&&Math.abs(e.y-4-f.y)<12){
      e.dead=true;G.collected.add(e.id);G.items.worm++;tasteFood('worm');SFX.pick();puff(e.x,e.y-4,6,['#f6a6b6','#a66c46']);strawBonus(e.x,e.y);
      float(e.x,e.y-14,'WORM '+Math.min(G.items.worm,3)+'/3','#f6a6b6');
      if(G.items.worm===3&&G.q.mom===1)toast('Go show Mama Hen!');save();return;}
    if(e.type==='carrot'&&Math.abs(e.x-f.x)<12&&Math.abs(e.y-4-f.y)<12){
      e.dead=true;G.collected.add(e.id);G.items.carrot++;tasteFood('carrot');SFX.pick();puff(e.x,e.y-4,8,['#f07832','#2d664e','#a66c46']);strawBonus(e.x,e.y);
      float(e.x,e.y-14,'CARROT '+Math.min(G.items.carrot,3)+'/3','#f07832');save();return;}
    if(e.type==='mound'&&Math.abs(e.x-f.x)<12&&Math.abs(e.y-4-f.y)<12){
      if(!has('peck')){SFX.clunk();float(e.x,e.y-14,'Too hard to dig!');return;}
      e.dead=true;G.collected.add(e.id);SFX.brk();puff(e.x,e.y-4,14,['#a66c46','#594437','#b69965'],1.4,0.08);
      if(e.has==='bone')spawnItem('bone','bone',e.x,e.y,true);
      else if(e.has==='seed')spawnItem('seed_mound','seed',e.x,e.y,true);
      else float(e.x,e.y-16,e.has,'#d5e5eb');
      save();return;}
    if((e.type==='fox'&&!e.gone)||(e.type==='goose'&&!e.blown)){
      if(ov(pr,{x:e.x-8,y:e.y-12,w:16,h:14})){hitEnemy(e);return;}}
    if(e.type==='stump'&&Math.abs(e.x-f.x)<13&&Math.abs(e.y-5-f.y)<13){
      if(!has('peck')){SFX.clunk();float(e.x,e.y-16,'Too tough!');return;}
      e.dead=true;G.collected.add(e.id);G.items.stump++;SFX.brk();shake=4;puff(e.x,e.y-6,14,['#a66c46','#594437','#b69965'],1.6,0.08);
      float(e.x,e.y-18,'STUMP '+Math.min(3,G.items.stump)+'/3','#b69965');if(G.items.stump>=3)toast('All stumps smashed! Tell Bucky.','#ff9cd0');save();return;}
    if(e.type==='berry'&&Math.abs(e.x-f.x)<13&&Math.abs(e.y-5-f.y)<13){
      if(G.items.snowberry){float(e.x,e.y-16,'You have a snowberry!');SFX.clunk();}
      else{G.items.snowberry=1;tasteFood('snowberry');SFX.pick();puff(e.x,e.y-6,6,['#fff8ec','#2d664e']);toast('Picked a SNOWBERRY!');save();}return;}
    if(e.type==='fishspot'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-6-f.y)<(landscapeKind(e.x,e.y)==='beach'?24:14)){
      if(G.items.fish){float(e.x,e.y-16,'You already have a fish!');SFX.clunk();}
      else{G.items.fish=1;tasteFood('fish');SFX.splash();puff(e.x,e.y-4,10,['#a6d0ff','#fff8ec'],1.2,0.08);toast('Caught a FISH!');save();}return;}
  }
  if(forestTreePeck(f))return;
  if(landscapeBoulderPeck(f))return;
  const c=Math.floor(f.x/16),r=Math.floor(f.y/16),t=tileAt(c,r);
  if(t==='R'||t==='C'){if(has('peck'))breakTile(c,r,t);else{SFX.clunk();float(c*16+8,r*16,'Too hard!');}}
  else if(t==='A'){if(has('peck'))shakeTree(c,r,f);else{SFX.clunk();float(c*16+8,r*16,'*wobble*');}}
  else if(t==='q'&&regionOfPos(f.x,f.y)?.id!=='forest')shakeTree(c,r,f,'acorn');
  else if(t==='M'){if(has('super')){setTile(c,r,'g');SFX.brk();shake=8;puff(c*16+8,r*16+8,18,['#a9b7c5','#64758b','#fff8ec'],2,0.08);save();if(!G.flags.mo&&c<16&&r>=48&&r<60)freeMo();}
    else{SFX.clunk();float(c*16+8,r*16,'Too big! Need SUPER PECK');}}
  else if(t==='Z'){if(has('peck')){setTile(c,r,'Y');SFX.brk();shake=4;puff(c*16+8,r*16+8,12,['#a66c46','#594437','#b69965'],1.4,0.08);toast('A secret trapdoor!');save();}
    else{SFX.clunk();float(c*16+8,r*16,'*creeeak*');}}
  else if(t==='θ'){if(has('thunder'))smashCrystal(c,r);else{SFX.clunk();float(c*16+8,r*16,'*zzzt* Too buzzy!','#c898f8');}}
  else if(t==='κ'){SFX.clunk();float(c*16+8,r*16,'Needs a big SLAM!','#b2e7e0');}
  else if(t==='h'||t==='T'||t==='u'){SFX.clunk();}
}
function setTile(c,r,ch){tiles[r][c]=ch;G.mods[c+','+r]=ch;}
function breakTile(c,r,t){
  setTile(c,r,'.');SFX.brk();shake=4;
  puff(c*16+8,r*16+8,14,t==='R'?['#a9b7c5','#64758b','#fff8ec']:['#a66c46','#594437','#b69965'],1.6,0.08);
  revealHidden(c,r);save();
}
function revealHidden(c,r){
  const h=HIDDEN[c+','+r];if(h&&!G.collected.has(h.id)){spawnItem(h.id,h.kind,c*16+8,r*16+12,true);SFX.chirp();puff(c*16+8,r*16+6,8,['#ffd21e','#fff8ec'],1,0);}
}
function shakeTree(c,r,f,kind='apple'){
  const k=c+','+r;shake=3;puff(c*16+8,r*16+4,8,['#2d664e','#55aa62','#a1d970'],1.2,0.05);
  if(G.picked[k]){SFX.clunk();float(c*16+8,r*16,'No more '+kind+'s');return;}
  let ac=c-f.dx,ar=r-f.dy;if(solidTile(tileAt(ac,ar),false))ac=c,ar=r+1;
  const x=ac*16+8+(f.dx?0:4),y=ar*16+12;G.picked[k]=[x,y,kind];
  spawnItem(kind+'_'+k,kind,x,y,true);SFX.brk();save();
}
function hitEnemy(e){
  const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;
  if(e.type==='fox'){
    if(has('peck')){e.hp--;e.flash=16;e.kx=dx/d*3.5;e.ky=dy/d*3.5;e.kt=10;e.stun=30;SFX.brk();float(e.x,e.y-20,'OUCH!','#ff8080');
      if(e.hp<=0){e.gone=true;G.foxGone=true;SFX.quest();toast('The fox ran away for good!');save();}}
    else{e.kx=dx/d*2;e.ky=dy/d*2;e.kt=6;e.stun=20;SFX.tickle();float(e.x,e.y-20,'tickle!','#f6a6b6');}
  }else{e.kx=dx/d*2.2;e.ky=dy/d*2.2;e.kt=6;e.cool=25;e.st='back';e.flash=8;SFX.honk();float(e.x,e.y-24,'HONK!');}
}
function wingFlap(){
  if(!has('flap')||P.flapCd>0)return;
  P.flapCd=G.rank>=10?20:40;P.flapAnim=22;SFX.gust();
  const [dx,dy]=DIRV[P.dir];
  for(let i=0;i<18;i++){const s=1.5+Math.random()*2;parts.push({x:P.x+dx*8+(dy?(Math.random()-.5)*20:0),y:P.y-6+dy*8+(dx?(Math.random()-.5)*16:0),
    vx:dx*s+(Math.random()-.5)*0.4,vy:dy*s+(Math.random()-.5)*0.4,g:0,life:22+Math.random()*10,c:i%3?'#fff8ec':'#b2e7e0'});}
  const seen=new Set();
  for(const dist of [12,26,40])for(const lat of [-8,0,8]){
    const x=P.x+dx*dist+(dy?lat:0),y=P.y-4+dy*dist+(dx?lat:0),c=Math.floor(x/16),r=Math.floor(y/16),k=c+','+r;
    if(seen.has(k))continue;seen.add(k);
    if(tileAt(c,r)==='L'){const burrow=c===18&&r===16;setTile(c,r,burrow?'^':'.');if(burrow){toast('A secret hole!');SFX.chirp();}for(let i=0;i<14;i++){const s=1+Math.random()*2;
      parts.push({x:c*16+8,y:r*16+10,vx:dx*s+(Math.random()-.5)*1.5,vy:dy*s-Math.random()*1.5,g:0.03,life:40,c:['#ec6c24','#eb6654','#c98a00','#a66c46'][i%4]});}
      revealHidden(c,r);save();}
  }
  hazardFlap(dx,dy);greenWings(dx,dy);seaFlap(dx,dy);cityFlap(dx,dy);
  for(const e of ents){
    if(!((e.type==='fox'&&!e.gone)||(e.type==='goose'&&!e.blown)))continue;
    const vx=e.x-P.x,vy=e.y-P.y,along=vx*dx+vy*dy,lat=Math.abs(vx*dy-vy*dx);
    if(along>-4&&along<56&&lat<20){
      if(e.type==='goose'){e.blown=true;e.t=0;e.solid=false;G.gooseGone=true;SFX.honk();float(e.x,e.y-24,'HOOONK!');toast('The grumpy goose got blown away!');save();}
      else{e.kx=dx*4;e.ky=dy*4;e.kt=12;e.stun=80;float(e.x,e.y-20,'Whoa!');}
    }
  }
}
function tryHop(dx,dy){
  const fx=P.x+dx*9,fy=P.y-2+dy*7,c=Math.floor(fx/16),r=Math.floor(fy/16);
  if(tileAt(c,r)!=='h'&&tileAt(c,r)!=='y')return false;
  const lc=c+dx,lr=r+dy;if(solidTile(tileAt(lc,lr)))return false;
  const tx=dx?lc*16+8:c*16+8,ty=dy?lr*16+11:r*16+11;
  if(pBlocked(tx,ty))return false;
  P.hop={x0:P.x,y0:P.y,x1:tx,y1:ty,t:0,d:wearing('astronaut')?34:26};SFX.hop();return true;
}
function updateHop(){
  const h=P.hop;h.t++;if(h.slam){if(h.t<h.d*0.5)h.t=Math.ceil(h.d*0.5);h.t+=2;}
  const p=Math.min(1,h.t/h.d);P.x=lerp(h.x0,h.x1,p);P.y=lerp(h.y0,h.y1,p);P.z=Math.sin(p*Math.PI)*(h.hz||(wearing('astronaut')?26:14));P.moving=true;
  if(h.t>=h.d){P.hop=null;P.z=0;puff(P.x,P.y,4,['#e8cd98','#fff8ec'],0.6,0);if(h.sky)skyLand(h);}
}
let WARP=null;
function warpTo(x,y,dir,after,then){WARP={t:0,x,y,dir,after,then};state='warp';SFX.door();}
function updateWarp(){
  WARP.t++;
  if(WARP.t<=16){fade=WARP.t/16;fadeColor='#000';}
  if(WARP.t===16){P.x=WARP.x;P.y=WARP.y;P.dir=WARP.dir;P.kt=0;P.hop=null;P.z=0;
    CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;
    G.visited.add(CS.x+','+CS.y);resetEnemies();TRAIL=[];
    for(const d of ents)if(((d.type==='duckling'||d.type==='follower'||d.type==='cduck')&&d.mode==='follow')||d.follow){d.x=P.x;d.y=P.y;}
    noteArea();if(WARP.after)WARP.after();save();}
  if(WARP.t>16)fade=Math.max(0,1-(WARP.t-16)/16);
  if(WARP.t>=32){const th=WARP.then;WARP=null;state='play';fade=0;if(th)th();}
}
function tryPush(dx,dy){
  const c=Math.floor((P.x+dx*9)/16),r=Math.floor((P.y-3+dy*7)/16);
  const b=ents.find(e=>e.type==='block'&&e.bc===c&&e.br===r);if(!b||b.sl||G.cellar)return !!b;
  P.pushT=(P.pushB===b?P.pushT:0)+1;P.pushB=b;P.pushing=3;
  if(P.pushT<12)return true;
  P.pushT=0;const nc=c+dx,nr=r+dy,t=tileAt(nc,nr);
  if(solidTile(t,false)||t==='X'||ents.some(e=>e.type==='block'&&e.bc===nc&&e.br===nr)){SFX.clunk();return true;}
  b.sl={x0:b.x,y0:b.y,t:0};b.bc=nc;b.br=nr;SFX.push();return true;
}
function checkPlates(){
  const on=PLATES.filter(([c,r])=>ents.some(e=>e.type==='block'&&e.bc===c&&e.br===r)).length;
  if(on===2&&!G.cellar){G.cellar=true;GATE.forEach(([c,r])=>setTile(c,r,';'));SFX.gate();shake=6;toast('Click! Click! The gate opened!');save();}
  else if(on>0)SFX.click();
}
function bump(ix,iy){
  if(roofBump(ix,iy))return;
  if(tryPush(ix,iy))return;
  if(skyBump(ix,iy))return;
  if(has('hop')&&tryHop(ix,iy))return;
  if(iy<0&&(WALK.has(CS.x+','+CS.y)||cellAt().kind==='indoor')){for(const ox of [0,-5,5]){const c=Math.floor((P.x+ox)/16),r=Math.floor((P.y-9)/16),d=DOORS[c+','+r];
    if(d){if(d.b&&!buildingOpen(d.b)){closedSign(d.b);return;}warpTo(d.x,d.y,d.roof?0:1,null,()=>{if(d.b)enteredBuilding(d.b);if(d.roof&&regionAt().id==='rooftops')secretFound('rooftops');});return;}}}
  if(ix>0&&tileAt(Math.floor((P.x+8)/16),Math.floor((P.y-2)/16))==='H'){
    if(G.part2){FLY={t:0,dest:'forest'};state='flying';SFX.magic();}
    else if(has('fly'))startEnding();
    else if(P.bubbleCd<=0){P.bubbleCd=300;say([{who:'me',text:"This fence is WAY too tall... If only I could FLY over it!"}]);}
  }
}
function hurt(src){
  if(P.inv>0||P.hop)return;
  G.hearts--;P.inv=80;const dx=P.x-src.x,dy=P.y-src.y,d=Math.hypot(dx,dy)||1;
  P.kx=dx/d*3;P.ky=dy/d*3;P.kt=has('sealegs')&&seaRegion()?0:8;SFX.hurt();shake=8;float(P.x,P.y-22,'OUCH','#ff6060');
  if(G.hearts<=0){if(bossActive()){bossRetry();return;}if(skyBossActive()){skyBossRetry();return;}G.hearts=0;state='faint';FT=0;}
}
function trailPush(){const l=TRAIL[TRAIL.length-1];if(!l||l.x!==P.x||l.y!==P.y){TRAIL.push({x:P.x,y:P.y});if(TRAIL.length>120)TRAIL.shift();}}

/* ---------------- entity updates ---------------- */
function updFox(e){
  if(e.gone){e.x+=3.2;e.alpha=(e.alpha==null?1:e.alpha)-0.02;e.flip=true;e.moving=true;if(e.alpha<=0)e.dead=true;return;}
  if(e.flash>0)e.flash--;
  if(e.kt>0){e.kt--;entMove(e,e.kx,e.ky);return;}
  if(e.stun>0){e.stun--;e.moving=false;return;}
  if(e.cool>0)e.cool--;
  const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;let vx=0,vy=0;
  if(e.cool>0&&d<80){vx=-dx/d*0.6;vy=-dy/d*0.6;}
  else if(d<(wearing('ninja')?26:76)&&!P.hop){const sp=nightAmt()>0.5?0.82:0.7;vx=dx/d*sp;vy=dy/d*sp;}
  else{
    if(--e.wt<=0){e.wt=50+Math.random()*70;const a=Math.random()*Math.PI*2,go=Math.random()<0.7;e.wx=go?Math.cos(a)*0.45:0;e.wy=go?Math.sin(a)*0.45:0;
      const hd=Math.hypot(e.hx-e.x,e.hy-e.y);if(hd>60){e.wx=(e.hx-e.x)/hd*0.45;e.wy=(e.hy-e.y)/hd*0.45;}}
    vx=e.wx;vy=e.wy;
  }
  entMove(e,vx,vy);if(Math.abs(vx)>0.05)e.flip=vx>0;e.moving=!!(vx||vy);
  if(Math.abs(dx)<11&&Math.abs(dy)<8&&P.inv<=0&&!P.hop){hurt(e);e.cool=70;}
}
function updGoose(e){
  if(e.blown){e.t++;e.x+=2.2;e.y-=1.4;e.flip=true;if(e.t>90)e.dead=true;return;}
  if(e.flash>0)e.flash--;
  if(e.kt>0){e.kt--;entMove(e,e.kx,e.ky);return;}
  if(e.cool>0)e.cool--;
  const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;e.flip=dx>0;
  if(e.st==='idle'){if(d<(wearing('ninja')?20:50)&&e.cool<=0&&!P.hop){e.st='charge';e.t=0;e.vx=dx/d*2.2;e.vy=dy/d*2.2;SFX.honk();float(e.x,e.y-26,'HONK!');}}
  else if(e.st==='charge'){entMove(e,e.vx,e.vy);if(++e.t>16)e.st='back';}
  else{const hx=e.hx-e.x,hy=e.hy-e.y,hd=Math.hypot(hx,hy);if(hd<1.5){e.x=e.hx;e.y=e.hy;e.st='idle';e.cool=45;}else entMove(e,hx/hd*0.9,hy/hd*0.9);}
  if(Math.abs(dx)<12&&Math.abs(dy)<9&&P.inv<=0&&!P.hop){hurt(e);if(e.st==='charge')e.st='back';}
}
function updDuckling(e){
  if(e.mode==='follow'){
    const p=TRAIL[Math.max(0,TRAIL.length-1-(e.fi+1)*12)];
    if(p){if(Math.abs(p.x-e.x)>0.3)e.flip=p.x>e.x;e.x+=(p.x-e.x)*0.5;e.y+=(p.y-e.y)*0.5;}
    const duck=ents.find(n=>n.id==='duck');
    if(duck&&Math.abs(duck.x-e.x)<36&&Math.abs(duck.y-e.y)<30){
      e.mode='home';G.home.push(e.id);placeHome();SFX.chirp();float(duck.x,duck.y-26,'Quack! '+G.home.length+'/3','#b2e7e0');
      let i=0;for(const d of ents)if(d.type==='duckling'&&d.mode==='follow')d.fi=i++;
      if(G.home.length===3&&G.q.duck===1)toast('All ducklings home! Talk to Mrs. Quackers.');
      save();
    }
  }else if(e.mode==='wait'&&onCur(e)&&Math.abs(P.x-e.x)<13&&Math.abs(P.y-e.y)<13){
    e.fi=ents.filter(d=>d.type==='duckling'&&d.mode==='follow').length;e.mode='follow';SFX.chirp();float(e.x,e.y-14,'Peep!','#ffe05a');
  }
}
function updItem(e){
  if(e.delay>0)e.delay--;
  if(e.z>0||e.vz){e.z+=e.vz;e.vz-=0.25;if(e.z<=0){e.z=0;e.vz=Math.abs(e.vz)>0.9?-e.vz*0.4:0;}}
}
function collect(e){
  e.dead=true;G.collected.add(e.id);
  switch(e.kind){
    case 'seed':{const rr=regionOfPos(e.x,e.y);if(rr&&rr.sky)addSeeds(1,2,0);else addSeeds(1,inBeyond(e.x,e.y)?2:1);}gainGP(GP.hiddenSeed);SFX.seed();float(e.x,e.y-16,'+1 SEED','#ffe05a');toast('Found a hidden seed!');break;
    case 'bell':G.items.bell=1;SFX.quest();toast("Found Daisy's bell!");break;
    case 'apple':G.items.apple++;tasteFood('apple');SFX.pick();strawBonus(e.x,e.y);float(e.x,e.y-16,'APPLE '+Math.min(3,G.items.apple)+'/3','#ff8080');break;
    case 'bone':G.items.bone=1;SFX.quest();toast("Found Biscuit's bone!");break;
    case 'horseshoe':G.items.horseshoe++;SFX.pick();float(e.x,e.y-16,'HORSESHOE '+Math.min(3,G.items.horseshoe)+'/3','#d8dce8');if(G.items.horseshoe>=3)toast('Found all 3! Bring them to Clyde.','#ff9cd0');break;
    case 'ring':G.items.ring++;SFX.pick();float(e.x,e.y-16,'LIFE RING '+Math.min(3,G.items.ring)+'/3','#ff8080');if(G.items.ring>=3)toast('Found all 3! Bring them to Sandy.','#ff9cd0');break;
    case 'acorn':G.items.acorn++;tasteFood('acorn');SFX.pick();strawBonus(e.x,e.y);float(e.x,e.y-16,'ACORN x'+G.items.acorn,'#b69965');break;
    case 'stick':G.items.stick++;SFX.pick();float(e.x,e.y-16,'STICK '+Math.min(4,G.items.stick)+'/4','#b69965');break;
    case 'shell':G.items.shell++;SFX.pick();float(e.x,e.y-16,'SHELL '+Math.min(5,G.items.shell)+'/5','#f6a6b6');break;
    case 'eagleEgg':G.items.eagleEgg=1;SFX.quest();toast("Found Elda's egg! Carry it gently...");break;
    case 'yarn':G.items.yarn=1;SFX.quest();toast("Found Whiskers' yarn!");break;
    case 'sailcloth':case 'hullplank':case 'cannonpart':G.sea.salv[e.kind]++;SFX.pick();toast('Got '+SALV_NAME[e.kind]+'! ('+G.sea.salv[e.kind]+')','#ffe05a');break;
    case 'pearl':case 'wreckbell':case 'crate':case 'sunstone':case 'ironore':case 'conch':case 'powderkeg':G.items[e.kind]++;SFX.pick();float(e.x,e.y-16,({pearl:'PEARL',wreckbell:'THE BELL!',crate:'CRATE',sunstone:'SUNSTONE',ironore:'IRON ORE',conch:'CONCH',powderkeg:'POWDER KEG'})[e.kind]+(e.kind==='wreckbell'?'':' x'+G.items[e.kind]),'#fff8ec');break;
    case 'lamb':case 'skyfeather':case 'chime':case 'peg':case 'cloudpuff':case 'bolt':case 'rod':{G.items[e.kind]++;SFX.pick();const need={lamb:3,skyfeather:4,chime:3,peg:3,cloudpuff:3,bolt:3,rod:3}[e.kind],have=G.items[e.kind];
      float(e.x,e.y-16,SKY_ITEM_NAME[e.kind]+' '+Math.min(need,have)+'/'+need,'#fff8ec');if(have===need)toast('Got all '+need+'!','#ff9cd0');break;}
    case 'pebble':case 'plank':case 'snowball':G.items[e.kind]++;SFX.pick();float(e.x,e.y-16,({pebble:'PEBBLE',plank:'PLANK',snowball:'SNOWBALL'})[e.kind]+' x'+G.items[e.kind],'#fff8ec');break;
    case 'hat':case 'whisk':case 'collarBell':{const b=BORROWED.find(x=>x.kind===e.kind);G.items[b.item]=1;SFX.quest();toast('Found '+b.name+'! Return it.','#ff9cd0');break;}
    case 'pepper':case 'salt':case 'mushroom':G.items[e.kind]=1;SFX.pick();toast('Got '+({pepper:'MOUNTAIN PEPPER',salt:'SEA SALT',mushroom:'a FOREST MUSHROOM'})[e.kind]+'!','#ff9cd0');break;
    case 'seashell':case 'plume':case 'fossil':case 'shard':case 'cloudbloom':G.hold[e.kind]++;SFX.pick();toast('Found '+({seashell:'a pretty SEASHELL',plume:'a rare FEATHER',fossil:'a FOSSIL',shard:'a STORM SHARD',cloudbloom:'a CLOUD BLOOM'})[e.kind]+'! Take it to the museum.','#b69965');break;
    case 'feather':G.items.feather++;SFX.quest();toast('Golden feather! ('+Math.min(3,G.items.feather)+'/3)');break;
  }
  puff(e.x,e.y-6,8,['#ffd21e','#fff8ec'],1,0);save();
}
function checkPickups(){
  if(P.hop)return;
  for(const e of ents)if(e.type==='item'&&!e.dead&&e.delay<=0&&e.z<3&&Math.abs(e.x-P.x)<11&&Math.abs(e.y+(e.pickupOffset||0)-P.y)<11)collect(e);
}
function updateEnts(){
  for(const e of ents){
    if(e.type==='duckling'){updDuckling(e);continue;}
    if(e.type==='follower'){updFollower(e);continue;}
    if(e.type==='cduck'){updCduck(e);continue;}
    if(e.type==='block'&&e.sl){const s=e.sl;s.t++;const p=Math.min(1,s.t/8);e.x=lerp(s.x0,e.bc*16+8,p);e.y=lerp(s.y0,e.br*16+16,p);if(s.t>=8){e.sl=null;checkPlates();}continue;}
    if(!onCur(e)&&!(e.type==='fox'&&e.gone)&&!(e.type==='goose'&&e.blown))continue;
    if(e.type==='fox')updFox(e);else if(e.type==='goose')updGoose(e);else if(e.type==='item')updItem(e);else if(e.type==='puff')updPuff(e);
    else if(e.type==='roofgull')updateRoofGull(e);else if(e.type==='gullp')updGull(e);else if(e.type==='jelly')updJelly(e);else if(e.type==='spark')updSpark(e);else if(e.type==='bubbles')updBubbles(e);else if(e.type==='boss')updBoss(e);else if(e.type==='barrel')updBarrel(e);
    else if(e.type==='bees')updBees(e);else if(e.type==='snowball')updBall(e);else if(e.type==='crab')updCrab(e);
  }
  ents=ents.filter(e=>!e.dead);
}

/* ---------------- screen transitions ---------------- */
function checkEdges(){
  const fc=Math.floor(P.x/16),ft=tileAt(fc,Math.floor((P.y-3)/16));
  if(ft==='^'){warpTo(128,747,1,()=>{secretFound('burrow');if(!G.met.has('bunbun'))toast('A secret burrow!');});return;}
  if(ft==='Y'){warpTo(384,747,1,()=>{secretFound('cellar');if(!G.cellar){placeBlocks();toast('Push blocks onto the gold plates!');}});return;}
  if(ft==='@'){
    if(regionAt().id==='secrets'){warpTo(216,139,0);return;}
    if(nightAmt()>0.3){warpTo(648,731,1,()=>{secretFound('grove');SFX.magic();toast('The Moonlit Grove...','#d890ff');});return;}
    if(P.bubbleCd<=0){P.bubbleCd=240;float(P.x,P.y-24,'These mushrooms look magical...','#d890ff');}
  }
  if(!ROAM.has(CS.x+','+CS.y)){
    if(tileAt(fc,Math.floor(P.y/16))==='X'){const cl=cellAt(),e=cl.region.id==='coop'?coopExit():BUILDING_BY_ROOM[cl.id]?BUILDING_BY_ROOM[cl.id].out:(cl.region.id==='rooms'?EXITS:EXITS3)[cl.gx];if(e)warpTo(e.x,e.y,0);}
    return;}
  const L=CS.x*256,R=L+256,T=CS.y*192,B=T+192;let d=null;
  if(P.x-4<L)d=[-1,0];else if(P.x+4>R)d=[1,0];else if(P.y-6<T)d=[0,-1];else if(P.y>B)d=[0,1];
  if(d&&ROAM.has((CS.x+d[0])+','+(CS.y+d[1])))startTrans(d[0],d[1]);
}
function startTrans(dx,dy){trans={dx,dy,t:0,d:40,px0:P.x,py0:P.y,px1:P.x+dx*14,py1:P.y+dy*12};}
function updateTrans(){
  const t=trans;t.t++;const p=t.t/t.d,e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
  camX=(CS.x+t.dx*e)*256;camY=(CS.y+t.dy*e)*192;P.x=lerp(t.px0,t.px1,p);P.y=lerp(t.py0,t.py1,p);P.moving=true;trailPush();
  for(const d of ents){if(d.type==='duckling'&&d.mode==='follow')updDuckling(d);if(d.type==='follower'&&d.mode==='follow')updFollower(d);}
  if(t.t>=t.d){CS.x+=t.dx;CS.y+=t.dy;camX=CS.x*256;camY=CS.y*192;trans=null;G.visited.add(CS.x+','+CS.y);resetEnemies();noteArea();save();}
}

/* ---------------- main play update ---------------- */
function updatePlay(){
  if(trans){if(G.race)updateRace();if(state!=='play')return;updateTrans();updateAmbient();return;}
  if(G.autoMom>0&&--G.autoMom===0){const m=ents.find(e=>e.id==='mom');if(m){talkTo(m);return;}}
  if(pressed.pause||pressed.back){openPause();return;}
  if(checkRankUp())return;
  if(tick%30===0){updateSchedules(false);checkBuffExpiry();}
  updateSunbeam();updateBabysit();updateRace();updateVillage();updateSeas();updateSky();updateCharge();
  if(pressed.dash)tryDash();
  if(pressed.grow){openGrow();return;}
  if(pressed.quest){state='quests';questPage=wearing('detective')?4:(G.part2?1:0);sleuthTop=0;SFX.menu();return;}
  if(pressed.wear){openWardrobe();return;}
  if(pressed.fly){if(G.part2)openMap();return;}
  if(has('golden')&&tick%24===0)parts.push({x:P.x+(Math.random()-.5)*12,y:P.y-8-Math.random()*8,vx:0,vy:-0.3,g:0,life:20,c:'#ffd21e'});
  if(P.pushing>0)P.pushing--;else P.pushT=0;
  const ix=(keys.right?1:0)-(keys.left?1:0),iy=(keys.down?1:0)-(keys.up?1:0);
  P.moving=false;
  if(P.hop)updateHop();
  else if(P.kt>0){P.kt--;moveP(P.kx,0,false);moveP(0,P.ky,false);}
  else{
    if(P.dashT>0&&!ix&&!iy){const [ddx,ddy]=DIRV[P.dir];moveP(ddx*speed()*2.5,ddy*speed()*2.5,false);P.moving=true;}
    if(ix||iy){
      if(ix&&iy){if(!((P.dir===2&&ix<0)||(P.dir===3&&ix>0)||(P.dir===1&&iy<0)||(P.dir===0&&iy>0)))P.dir=ix<0?2:3;}
      else P.dir=ix<0?2:ix>0?3:iy<0?1:0;
      const sp=speed()*(ix&&iy?0.72:1)*(P.dashT>0?2.5:1),single=!(ix&&iy);let mx=true,my=true;
      if(ix)mx=moveP(ix*sp,0,single);if(iy)my=moveP(0,iy*sp,single);
      P.moving=mx||my;trailPush();
      if(single&&((ix&&!mx)||(iy&&!my)))bump(ix,iy);
      if(state!=='play')return;
    }
    if(pressed.a){action();if(state!=='play')return;}
    if(pressed.b)wingFlap();
  }
  if(P.inv>0)P.inv--;if(P.peckT>0)P.peckT--;if(P.flapCd>0)P.flapCd--;if(P.flapAnim>0)P.flapAnim--;if(P.bubbleCd>0)P.bubbleCd--;
  if(state!=='play')return;
  if(P.moving&&!P.hop){
    P.stepT=(P.stepT||0)+1;const ch=tileAt(Math.floor(P.x/16),Math.floor((P.y-3)/16));
    if(onPuddle()&&P.stepT%12===0){SFX.splash();puff(P.x,P.y,6,['#a6d0ff','#5d8fd8','#fff8ec'],1,0.08);}
    else if(P.stepT%15===0&&ch!=='W')SFX.step('_'.includes(ch)?'wood':':'.includes(ch)?'straw':';-'.includes(ch)?'stone':'grass');
  }
  updateEnts();if(MG)updateMG();updateAmbient();checkPickups();if(state==='play')checkEdges();
}

