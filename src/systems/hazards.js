'use strict';
/* ---------------- Part 2 hazards (gentle!) and secret spots ----------------
   Forest: grumpy bees near 2 hives (Wing Flap scatters them)
   Mountains: rolling snowballs on set lanes (Super Peck smashes them)
   Beach: snappy crabs near the shells (Peck knocks them back)
   City: safe.  Ninja stealth shrinks how far away they notice Pip.            */
const HIVES=[[12,63],[27,61]];
const SNOW_LANES=[ // horizontal: roll along a row from one column to another; vertical: along a column
  {axis:'x',fixed:56,from:13,to:1,delay:150},
  {axis:'y',fixed:21,from:49,to:58,delay:210}];
const CRABS=[[6,77,3],[11,76,3],[24,74,2]];
const SPOTS=[
  {id:'spot_forest',kind:'log',c:20,r:62,name:'a hollow log'},
  {id:'spot_peak',kind:'ice',c:18,r:57,name:'an ice cave'},
  {id:'spot_beach',kind:'sandmound',c:11,r:75,name:'a sand mound'},
  {id:'spot_city',kind:'planter',c:46,r:81,name:'a rooftop garden'}];
function makeHazards(){
  HIVES.forEach(([c,r],i)=>{const x=c*16+8,y=r*16+12;
    addEnt({type:'hive',x,y,sx:Math.floor(x/256),sy:Math.floor(y/192),solid:true,w:12});
    addEnt({type:'bees',x:x,y:y-6,hx:x,hy:y-6,sx:Math.floor(x/256),sy:Math.floor(y/192),st:'home',t:0,cool:0,ph:i*40});});
  SNOW_LANES.forEach((L,i)=>{const e={type:'snowball',lane:L,st:'wait',t:L.delay*0.5,x:0,y:0};
    if(L.axis==='x'){e.sx=Math.floor(L.from*16/256);e.sy=Math.floor(L.fixed*16/192);}else{e.sx=Math.floor(L.fixed*16/256);e.sy=Math.floor(L.from*16/192);}
    ballPlace(e,L.from);addEnt(e);});
  CRABS.forEach(([c,r,rng],i)=>{const x=c*16+8,y=r*16+12;
    addEnt({type:'crab',x,y,hx:x,hy:y,rng:rng*16,dir:i%2?1:-1,sx:Math.floor(x/256),sy:Math.floor(y/192),stun:0,kt:0,kx:0,flash:0,cool:0});});
  SPOTS.forEach(s=>{if(!G.collected.has(s.id))addEnt({type:'spot',id:s.id,skind:s.kind,spotName:s.name,x:s.c*16+8,y:s.r*16+12});});
}
function resetHazards(){
  for(const e of ents){
    if(e.type==='bees'){e.x=e.hx;e.y=e.hy;e.st='home';e.cool=60;}
    else if(e.type==='snowball'){e.st='wait';e.t=e.lane.delay*0.5;ballPlace(e,e.lane.from);}
    else if(e.type==='crab'){e.x=e.hx;e.stun=0;e.kt=0;}
  }
}
function stealth(near,ninjaNear){return wearing('ninja')?ninjaNear:near;}
function ballPlace(e,v){const L=e.lane;if(L.axis==='x'){e.x=v*16+8;e.y=L.fixed*16+12;}else{e.x=L.fixed*16+8;e.y=v*16+12;}e.pos=v;}

function updBees(e){
  e.ph=(e.ph||0)+1;
  if(e.cool>0)e.cool--;
  const dx=P.x-e.x,dy=P.y-6-e.y,d=Math.hypot(dx,dy)||1;
  if(e.st==='home'){
    e.x=e.hx+Math.cos(e.ph/14)*7;e.y=e.hy+Math.sin(e.ph/9)*4;
    if(e.cool<=0&&!P.hop&&d<stealth(34,13)){e.st='chase';e.t=170;float(e.x,e.y-14,'BZZZ!','#ffd83a');}
  }else if(e.st==='chase'){
    e.x+=dx/d*0.8+Math.cos(e.ph/4)*0.3;e.y+=dy/d*0.8+Math.sin(e.ph/5)*0.3;
    if(--e.t<=0){e.st='return';}
    if(d<9&&P.inv<=0&&!P.hop){hurt(e);e.st='return';e.cool=120;}
  }else{ // return
    const hx=e.hx-e.x,hy=e.hy-e.y,hd=Math.hypot(hx,hy);
    if(hd<2){e.st='home';e.cool=Math.max(e.cool,90);}else{e.x+=hx/hd*1.3;e.y+=hy/hd*1.3;}
  }
}
function updBall(e){
  const L=e.lane;e.t++;
  if(e.st==='wait'){if(e.t>=L.delay&&onCur(e)){e.st='tell';e.t=0;}ballPlace(e,L.from);return;}
  if(e.st==='tell'){ballPlace(e,L.from);if(e.t>=45){e.st='roll';e.t=0;}return;}
  if(e.st==='roll'){
    const step=(L.to>L.from?1:-1)*1.7/16;e.pos+=step;ballPlace(e,e.pos);
    if((L.to-e.pos)*(L.to>L.from?1:-1)<=0){e.st='wait';e.t=0;}
    else if(Math.abs(e.x-P.x)<9&&Math.abs(e.y-P.y)<9&&P.inv<=0&&!P.hop)hurt(e);
    return;}
  if(e.st==='smashed'){if(e.t>=300){e.st='wait';e.t=L.delay-60;}}
}
function updCrab(e){
  if(e.flash>0)e.flash--;
  if(e.kt>0){e.kt--;entMove(e,e.kx,0);return;}
  if(e.stun>0){e.stun--;return;}
  if(e.cool>0)e.cool--;
  const dxp=P.x-e.x,dyp=P.y-e.y,near=Math.abs(dxp)<stealth(34,12)&&Math.abs(dyp)<14;
  const sp=near&&e.cool<=0?0.95:0.45;
  const nx=e.x+e.dir*sp;
  if(Math.abs(nx-e.hx)>e.rng||entBlocked(e,nx,e.y))e.dir*=-1;else e.x=nx;
  if(Math.abs(dxp)<10&&Math.abs(dyp)<8&&P.inv<=0&&!P.hop){hurt(e);e.cool=90;}
}
/* peck hooks: returns true when the peck was used on a hazard or spot */
function hazardPeck(e,f,pr){
  if(e.type==='crab'&&ov(pr,{x:e.x-9,y:e.y-12,w:18,h:14})){
    const away=e.x>=P.x?1:-1;e.kx=away*3.2;e.kt=12;e.stun=70;e.flash=10;e.dir=away;SFX.brk();float(e.x,e.y-16,'SNAP!','#ff9cd0');return true;}
  if(e.type==='snowball'&&e.st==='roll'&&ov(pr,{x:e.x-8,y:e.y-12,w:16,h:16})){
    if(has('super')){e.st='smashed';e.t=0;SFX.brk();shake=5;puff(e.x,e.y-6,16,['#fff8ec','#cfdcec','#a6e0ff'],1.8,0.06);float(e.x,e.y-16,'SMASH!','#a6e0ff');}
    else{SFX.clunk();float(e.x,e.y-16,'Too big! Dodge!','#a6e0ff');}
    return true;}
  if(e.type==='spot'&&Math.abs(e.x-f.x)<13&&Math.abs(e.y-4-f.y)<13){
    if(!has('peck')){SFX.clunk();float(e.x,e.y-14,'Too hard to dig!');return true;}
    e.dead=true;G.collected.add(e.id);SFX.chirp();puff(e.x,e.y-4,12,['#ffd21e','#fff8ec','#c49a5c'],1.4,0.06);
    spawnItem(e.id+'_seed','seed',e.x,e.y,true);toast('You found '+e.spotName+'!','#ffd21e');save();return true;}
  return false;
}
function hazardFlap(dx,dy){
  for(const e of ents){if(e.type!=='bees'||e.st==='home'&&Math.hypot(e.x-P.x,e.y-P.y)>56)continue;
    const vx=e.x-P.x,vy=e.y-P.y,along=vx*dx+vy*dy,lat=Math.abs(vx*dy-vy*dx);
    if(along>-6&&along<64&&lat<26){e.st='return';e.cool=240;puff(e.x,e.y,8,['#ffd83a','#21142b'],1.6,0);float(e.x,e.y-14,'Shoo!','#fff8ec');}}
}

function drawHaz(e,sx,sy){
  switch(e.type){
    case 'hive':{ctx.fillStyle='#21142b';ctx.fillRect(sx-7,sy-14,14,15);ctx.fillStyle='#e8a422';ctx.fillRect(sx-6,sy-13,12,13);
      ctx.fillStyle='#c98a00';for(let j=0;j<3;j++)ctx.fillRect(sx-6,sy-10+j*4,12,1);ctx.fillStyle='#21142b';ctx.fillRect(sx-2,sy-5,4,5);
      ctx.fillStyle='#5e3a1c';ctx.fillRect(sx-1,sy-17,2,3);break;}
    case 'bees':{const n=5;for(let i=0;i<n;i++){const a=e.ph/5+i*1.3,bx=Math.round(sx+Math.cos(a*1.3)*5+(i-2)*2),by=Math.round(sy-4+Math.sin(a)*4);
        ctx.fillStyle='#21142b';ctx.fillRect(bx,by,3,2);ctx.fillStyle='#ffd83a';ctx.fillRect(bx+(i%2),by,1,2);ctx.fillStyle='#fff8ec';ctx.fillRect(bx,by-1,1+((e.ph>>1)%2),1);}
      break;}
    case 'snowball':{if(e.st==='wait'||e.st==='smashed')break;
      const L=e.lane,tell=e.st==='tell',w=tell?Math.round(Math.sin(e.t/2)):0;
      if(tell){ctx.fillStyle='rgba(255,120,120,0.55)';const a=(e.t%12<6)?1:0;ctx.fillRect(sx-3,sy-16,6,2+a);ctx.fillRect(sx-1,sy-13,2,2);}
      const r=7,rot=e.pos*10;ctx.fillStyle='#21142b';ctx.beginPath();ctx.arc(sx+w,sy-6,r+1,0,6.3);ctx.fill();
      ctx.fillStyle='#f4f8ff';ctx.beginPath();ctx.arc(sx+w,sy-6,r,0,6.3);ctx.fill();
      ctx.fillStyle='#cfdcec';ctx.fillRect(Math.round(sx+Math.cos(rot)*3),Math.round(sy-6+Math.sin(rot)*3),2,2);ctx.fillRect(Math.round(sx-Math.cos(rot)*3),Math.round(sy-6-Math.sin(rot)*3),2,2);break;}
    case 'crab':{if(e.flash>0&&Math.floor(e.flash/2)%2)break;
      const c='#e03838',k='#21142b',l=(Math.floor(tick/6)+(e.x|0))%2;shadow(sx,sy+1,8);
      ctx.fillStyle=k;ctx.fillRect(sx-7,sy-8,14,8);ctx.fillRect(sx-9,sy-12,4,5);ctx.fillRect(sx+5,sy-12,4,5);
      ctx.fillStyle=c;ctx.fillRect(sx-6,sy-7,12,6);ctx.fillRect(sx-8,sy-11,3,4);ctx.fillRect(sx+5,sy-11,3,4);ctx.fillStyle='#962430';ctx.fillRect(sx-8,sy-11,3,1);ctx.fillRect(sx+5,sy-11,3,1);
      ctx.fillStyle=k;ctx.fillRect(sx-5,sy-9,1,2);ctx.fillRect(sx+4,sy-9,1,2);ctx.fillStyle='#fff8ec';ctx.fillRect(sx-5,sy-10,1,1);ctx.fillRect(sx+4,sy-10,1,1);
      ctx.fillStyle=k;for(let i=0;i<3;i++){ctx.fillRect(sx-8-(i+l)%2,sy-1+(i%2),2,1);ctx.fillRect(sx+7+(i+l)%2,sy-1+(i%2),2,1);}
      if(e.stun>0&&e.kt<=0){ctx.fillStyle='#ffd83a';const a=tick/6;ctx.fillRect(sx+Math.round(Math.cos(a)*6),sy-14,2,2);ctx.fillRect(sx+Math.round(Math.cos(a+3.1)*6),sy-14,2,2);}
      break;}
    case 'spot':{
      const pir=wearing('pirate'),twinkle=tick%48<24;
      if(e.skind==='log'){ctx.fillStyle='#21142b';ctx.fillRect(sx-8,sy-8,16,9);ctx.fillStyle='#9a6234';ctx.fillRect(sx-7,sy-7,14,7);ctx.fillStyle='#5e3a1c';ctx.fillRect(sx-7,sy-3,14,3);ctx.fillStyle='#21142b';ctx.fillRect(sx+3,sy-6,4,5);ctx.fillStyle='#c49a5c';ctx.fillRect(sx-6,sy-7,6,1);}
      else if(e.skind==='ice'){const glow=wearing('astronaut')||pir;ctx.fillStyle='#21142b';ctx.fillRect(sx-8,sy-9,16,10);ctx.fillStyle='#e8f0f8';ctx.fillRect(sx-7,sy-8,14,8);ctx.fillStyle='#cfdcec';ctx.fillRect(sx-5,sy-5,10,5);
        ctx.fillStyle=glow?(twinkle?'#a6e0ff':'#6ab4ff'):'#2a3a5a';ctx.fillRect(sx-3,sy-6,6,6);ctx.fillStyle=glow?'#fff8ec':'#21142b';ctx.fillRect(sx-1,sy-4,2,3);}
      else if(e.skind==='sandmound'){ctx.fillStyle='#21142b';ctx.fillRect(sx-8,sy-7,16,8);ctx.fillStyle='#dcc080';ctx.fillRect(sx-7,sy-6,14,6);ctx.fillStyle='#f2dca0';ctx.fillRect(sx-5,sy-6,8,2);ctx.fillStyle='#b89858';ctx.fillRect(sx-2,sy-2,3,1);}
      else{ctx.fillStyle='#21142b';ctx.fillRect(sx-8,sy-8,16,9);ctx.fillStyle='#b0503c';ctx.fillRect(sx-7,sy-7,14,7);ctx.fillStyle='#5e3a1c';ctx.fillRect(sx-6,sy-7,12,3);
        ctx.fillStyle='#5cb84c';ctx.fillRect(sx-5,sy-9,3,3);ctx.fillRect(sx+1,sy-10,3,4);ctx.fillStyle='#ec6c24';ctx.fillRect(sx-4,sy-11,1,2);ctx.fillRect(sx+2,sy-12,1,2);}
      if(pir&&twinkle){ctx.fillStyle='#ffd21e';ctx.fillRect(sx+6,sy-12,2,2);ctx.fillRect(sx-8,sy-5,1,1);}
      break;}
  }
}
