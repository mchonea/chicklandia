'use strict';
/* =====================================================================
   WORLD SYSTEMS: day & night, weather, outfits, minigames, secrets
   ===================================================================== */
let MG=null,EG=null,drops=[],flies=[],flash=0,shopSel=0,shopMsg=null,wardSel=0;
function dayT(){return (G.clock%DAY)/DAY;}
function dayNum(){return Math.floor(G.clock/DAY)+1;}
function nightAmt(){
  if(!G)return 0;const t=dayT();
  if(t>=0.05&&t<0.55)return 0;if(t>=0.55&&t<0.65)return (t-0.55)/0.1;if(t>=0.65&&t<0.95)return 1;
  const u=t>=0.95?t-0.95:t+0.05;return Math.max(0,1-u/0.1);
}
function duskAmt(){return Math.max(0,1-Math.abs(dayT()-0.58)/0.07);}
function dawnAmt(){const t=dayT(),u=t>=0.9?t-1:t;return Math.max(0,1-Math.abs(u-0.03)/0.05);}
function isOutdoor(){const k=CS.x+','+CS.y;return WALK.has(k)||k==='2,3';}
function isCave(){return CS.y===3&&CS.x<2;}
function rainAmt(){return (G.weather==='rain'||G.weather==='storm')?G.wInt:0;}
function rollWeather(){
  const r=Math.random(),w=r<0.5?'clear':r<0.68?'cloudy':r<0.92?'rain':'storm';
  if(w===G.weather)return;G.weather=w;
  if(isOutdoor()&&state==='play'){if(w==='rain')toast("It's starting to rain!",'#a6d0ff');else if(w==='storm')toast('A storm is rolling in!','#a6d0ff');else if(w==='clear')toast('The sky is clearing up!');}
}
function onPuddle(){
  if(G.puddle<0.4||!WALK.has(CS.x+','+CS.y)||areaOf()==='mountains')return false;
  const c=Math.floor(P.x/16),r=Math.floor((P.y-3)/16);return '.,d=~'.includes(tileAt(c,r))&&hash2(c,r)%9===0;
}
function pickTrack(){
  if(state==='egg'||MG)return'mini';
  if(state==='map'||state==='flying'||state==='p2intro')return'grove';
  if(CS.y===3)return CS.x===2?'grove':'cave';
  if(CS.y===2||(CS.y===4&&CS.x===2))return'indoor';
  if(nightAmt()>0.45)return'night';
  if(CS.y>=4)return areaOf();
  if(CS.x===0&&CS.y===1)return'pond';
  return'farm';
}
function updateEnv(){
  const prev=dayT();G.clock++;const t=dayT();
  if(G.clock>DAY*0.5&&((prev<0.3&&t>=0.3)||(prev<0.8&&t>=0.8)))rollWeather();
  if(prev<0.04&&t>=0.04&&isOutdoor())SFX.crow();
  G.wInt+=((G.weather==='clear'?0:1)-G.wInt)*0.004;
  const rain=rainAmt(),out=isOutdoor(),n=nightAmt();
  G.puddle=clamp(G.puddle+(rain>0.5?0.0015:-0.0006),0,1);
  updatePlots();
  const snowy=areaOf()==='mountains';
  if(out&&rain>0.05){const k=Math.round(rain*(G.weather==='storm'?5:3));
    for(let i=0;i<k;i++)drops.push({x:Math.random()*(W+70),y:HUD-12-Math.random()*30,v:snowy?0.8+Math.random()*0.8:4+Math.random()*2,l:5+Math.random()*4,gy:HUD+16+Math.random()*(VH-16),snow:snowy,ph:Math.random()*6});}
  for(const d of drops){d.y+=d.v;d.x-=d.snow?Math.sin(d.y/12+d.ph)*0.5+0.2:d.v*0.35;
    if(d.y>=d.gy){d.dead=true;if(Math.random()<0.25)parts.push({x:d.x+camX,y:d.y-HUD+camY,vx:-0.3,vy:-0.7,g:0.1,life:7,c:'#c6dcff'});}}
  drops=out?drops.filter(d=>!d.dead):[];
  if(G.weather==='storm'&&G.wInt>0.6&&out&&Math.random()<0.003){flash=1;setTimeout(()=>SFX.thunder(),300+Math.random()*900);}
  if(flash>0)flash=Math.max(0,flash-0.05);
  if(out&&n>0.4&&rain<0.3&&flies.length<10&&Math.random()<0.05)
    flies.push({x:camX+Math.random()*W,y:camY+20+Math.random()*(VH-30),p:Math.random()*6,life:500+Math.random()*300});
  for(const f of flies){f.p+=0.03;f.x+=Math.cos(f.p*1.3)*0.3;f.y+=Math.sin(f.p)*0.25;f.life--;}
  flies=flies.filter(f=>f.life>0&&out&&n>0.3&&f.x>camX-20&&f.x<camX+W+20&&f.y>camY-20&&f.y<camY+VH+20);
  if(out&&state==='play'){
    if(n>0.6&&tick%50===0&&Math.random()<0.6)SFX.cricket();
    if(n>0.7&&Math.random()<0.0015)SFX.hoot();
    if(n<0.1&&rain<0.2&&Math.random()<0.003)SFX.birdy();
    if(n>0.6&&tick%100===0)for(const e of ents)if(e.type==='npc'&&onCur(e)&&e.id!=='hootie'&&!e.sib&&Math.random()<0.5)float(e.x+6,e.y-22,'z','#b8c8ff');
  }
  if(AC&&rainGain&&tick%10===0)rainGain.gain.setTargetAtTime(rain*(out?0.14:0.04),AC.currentTime,0.4);
}
/* lighting: a dark layer with glowing holes punched out around lights */
const lightC=document.createElement('canvas');lightC.width=W;lightC.height=VH;const lctx=lightC.getContext('2d');
function drawEnvFX(){
  const out=isOutdoor(),cave=isCave(),n=nightAmt();
  if(out){
    const wk=G.wInt*({clear:0,cloudy:0.06,rain:0.14,storm:0.24}[G.weather]);
    if(wk>0.005){ctx.fillStyle='rgba(20,30,60,'+(wk*0.45)+')';
      for(let i=0;i<3;i++){const span=W+200,x=Math.round(((i*170-tick*0.3)%span+span)%span-100),y=HUD+20+i*58;ctx.fillRect(x,y+6,90,22);ctx.fillRect(x+12,y,60,34);}
      ctx.fillStyle='rgba(40,50,90,'+wk+')';ctx.fillRect(0,HUD,W,VH);}
    const du=duskAmt(),da=dawnAmt();
    if(du>0){ctx.fillStyle='rgba(255,110,50,'+(du*0.18)+')';ctx.fillRect(0,HUD,W,VH);}
    if(da>0){ctx.fillStyle='rgba(255,150,190,'+(da*0.12)+')';ctx.fillRect(0,HUD,W,VH);}
    ctx.fillStyle='rgba(200,220,255,0.75)';
    for(const d of drops){if(d.snow)continue;for(let k=0;k<d.l;k++)ctx.fillRect(Math.round(d.x+k*0.35),Math.round(d.y-k),1,1);}
    ctx.fillStyle='#ffffff';for(const d of drops)if(d.snow)ctx.fillRect(Math.round(d.x),Math.round(d.y),2,2);
  }
  const dark=cave?0.62:out?n*0.68:n*0.3;
  if(dark>0.02){
    lctx.globalCompositeOperation='source-over';lctx.clearRect(0,0,W,VH);
    lctx.fillStyle=cave?'rgba(10,4,14,'+dark+')':'rgba(8,8,36,'+dark+')';lctx.fillRect(0,0,W,VH);
    lctx.globalCompositeOperation='destination-out';lctx.fillStyle='#000';
    const light=(x,y,r)=>{for(const [f,a] of [[1,0.3],[0.72,0.5],[0.46,1]]){lctx.globalAlpha=a;lctx.beginPath();lctx.arc(Math.round(x),Math.round(y),r*f,0,7);lctx.fill();}lctx.globalAlpha=1;};
    light(P.x-camX,P.y-camY-8-P.z,wearing('astronaut')?(cave?104:84):(cave?60:46));
    const c0=Math.floor(camX/16),r0=Math.floor(camY/16);
    for(let r=r0;r<=r0+12;r++)for(let c=c0;c<=c0+16;c++){const ch=tileAt(c,r),x=c*16-camX+8,y=r*16-camY+8;
      if(ch==='I')light(x,y+2,26);else if(ch==='f')light(x,y+4,48);else if(ch==='*')light(x,y,16);else if(ch==='@')light(x,y,22);
      else if(ch==='|')light(x,y-4,34);else if(ch==='Q')light(x,y+4,18);}
    for(const f of flies)light(f.x-camX,f.y-camY,10);
    for(const e of ents)if(e.type==='ffly'&&onCur(e))light(e.x-camX,e.y-camY-8,12);
    ctx.drawImage(lightC,0,HUD);
  }
  ctx.fillStyle='#f4ff8a';for(const f of flies)if(Math.sin(f.p*3)>-0.3)ctx.fillRect(Math.round(f.x-camX),Math.round(f.y-camY+HUD),2,2);
  if(flash>0){ctx.fillStyle='rgba(255,255,255,'+(flash*0.7)+')';ctx.fillRect(0,HUD,W,VH);}
}

/* ---- Pip with outfits ---- */
const OUTFITS=[
  {id:'straw',name:'STRAW HAT',price:2,bonus:'Garden grows 50% faster. Worms, carrots, apples & acorns may drop a seed.',desc:'A classic farm look. Keeps the sun off your fluff.'},
  {id:'astronaut',name:'ASTRONAUT',price:2,bonus:'Helmet light: big glow at night and in caves. Moon-bounce hops!',desc:'One small peck for a chick, one giant leap for chicken-kind!'},
  {id:'shades',name:'COOL SHADES',price:3,bonus:'Too cool: outfits and coop upgrades cost 1 less seed.',desc:'Too cool for the coop.'},
  {id:'ninja',name:'NINJA',price:6,bonus:'Stealth: foxes and geese barely notice you. A bit faster, too!',desc:'Silent. Swift. Fluffy. The shadow of the farm.'},
  {id:'bow',name:'PINK BOW',bonus:'Family love: +1 heart.',how:'Win Egg Catch with your big sister.',desc:'A gift from Penny.'},
  {id:'ears',name:'BUNNY EARS',bonus:'Hoppity: move 20% faster.',how:'Win a game in a secret burrow.',desc:'Hop hop hooray!'},
  {id:'crown',name:'GOLDEN CROWN',bonus:'Royal reward: +1 seed from every quest.',how:'Find a hidden treasure chest.',desc:'Fit for the ruler of all Chicklandia!'},
  {id:'pirate',name:'PIRATE',bonus:'Treasure sense: hidden treasures and secrets sparkle.',how:'Win a game under the moon.',desc:'Arr! Yo ho ho and a bucket of seeds!'}];
const SHOP=['straw','astronaut','shades','ninja'];
const WEAR_ICON={straw:OUTFIT_SPR.straw,astronaut:makeSprite(['.ccc.','c.w.c','c...c','.ccc.']),shades:OUTFIT_SPR.shadesF,ninja:makeSprite(['kkkkk','rrrrr','kkkkk']),
  bow:OUTFIT_SPR.bow,ears:OUTFIT_SPR.ears,crown:OUTFIT_SPR.crown,pirate:makeSprite(['.kkkk.','kkwwkk','qqqqqq'])};
const OUTFIT_RENAME={crown:'ninja',explorer:'crown',bandana:'astronaut',cape:'pirate'};
function drawPip(st,dir,fr,flap,cx,bottom,sc=1,wear){
  if(wear===undefined)wear=G?G.wear:null;
  const base=chickSprite(st,dir===3?2:dir,fr,flap),spr=dir===3?flipOf(base):base,hd=base.head;
  const w=spr.width,h=spr.height,x0=Math.round(cx-w*sc/2),y0=Math.round(bottom-h*sc);
  const mx=v=>dir===3?w-v:v,hx=x0+mx(hd.x)*sc,top=y0+hd.top*sc,hy=y0+hd.y*sc,R=hd.r*sc;
  const D=(img,x,y,fl)=>{const im=fl?flipOf(img):img;ctx.drawImage(im,Math.round(x),Math.round(y),im.width*sc,im.height*sc);};
  // paint rows of the head (used by the ninja hood)
  const headRows=fn=>{for(let yy=Math.floor(hy-R);yy<=Math.ceil(hy+R);yy++){const dy=(yy+0.5-hy)/R;if(Math.abs(dy)>1)continue;const hw=Math.sqrt(1-dy*dy)*R;fn(yy,Math.round(hx-hw),Math.max(1,Math.round(2*hw)));}};
  const eyeY=y0+Math.floor(hd.y)*sc;
  if(wear==='astronaut'&&dir!==0){ctx.fillStyle='#d8dce8';ctx.fillRect(Math.round(hx-R*0.8+(dir===2?R*0.6:dir===3?-R*0.6:0)),Math.round(hy+R*0.7),Math.round(R*1.6),Math.round(R*1.4));}
  ctx.drawImage(spr,x0,y0,w*sc,h*sc);
  const O=OUTFIT_SPR;
  switch(wear){
    case 'straw':{const o=O[wear];D(o,hx-o.width*sc/2,top-o.height*sc+3*sc);break;}
    case 'pirate':{const o=O.pirate;D(o,hx-o.width*sc/2,top-o.height*sc+3*sc);
      if(dir!==1){ctx.fillStyle=PAL.k;ctx.fillRect(Math.round(hx-R),eyeY-sc,Math.round(2*R),sc);
        const ex=dir===0?x0+(Math.floor(hd.x-hd.r*0.45))*sc:x0+mx(hd.x-hd.r*0.35)*sc;ctx.fillRect(Math.round(ex-sc),eyeY-sc,3*sc,3*sc);}break;}
    case 'ninja':{const dark='#2a2a3a';ctx.fillStyle=dark;
      headRows((yy,x,wd)=>{if(dir===1||yy<eyeY-sc||yy>=eyeY+2*sc)ctx.fillRect(x,yy,wd,1);});
      ctx.fillStyle=PAL.r;ctx.fillRect(Math.round(hx-R),eyeY-2*sc,Math.round(2*R),sc);
      const tx=dir===2?hx+R:dir===3?hx-R-3*sc:hx+R*0.4;ctx.fillRect(Math.round(tx),eyeY-2*sc,3*sc,sc);ctx.fillRect(Math.round(tx+(dir===3?-sc:sc)),eyeY-sc,3*sc,sc);break;}
    case 'astronaut':{ctx.fillStyle='rgba(166,224,255,0.35)';ctx.beginPath();ctx.arc(hx,hy,R+2.5*sc,0,7);ctx.fill();
      ctx.lineWidth=sc;ctx.strokeStyle='#e8f0f8';ctx.beginPath();ctx.arc(hx,hy,R+2.5*sc,0,7);ctx.stroke();
      ctx.fillStyle='#fff';ctx.fillRect(Math.round(hx-R*0.6),Math.round(hy-R*0.5),sc,2*sc);
      ctx.fillStyle=PAL.E;ctx.fillRect(Math.round(hx-sc/2),Math.round(hy-R-6*sc),sc,3*sc);ctx.fillStyle=PAL.r;ctx.fillRect(Math.round(hx-sc),Math.round(hy-R-7*sc),2*sc,2*sc);
      if(dir===0){ctx.fillStyle='#d8dce8';ctx.fillRect(Math.round(hx-R*0.9),Math.round(hy+R+2*sc),Math.round(R*1.8),2*sc);ctx.fillStyle=PAL.u;ctx.fillRect(Math.round(hx-sc),Math.round(hy+R+2*sc),2*sc,2*sc);}break;}
    case 'crown':case 'ears':{const o=O[wear];D(o,hx-o.width*sc/2,top-o.height*sc+2*sc);break;}
    case 'bow':{const o=O.bow,off=dir===2?-R*0.5:R*0.45;D(o,hx+off-o.width*sc/2,top-2*sc);break;}
    case 'shades':{if(dir===1)break;const ey=y0+Math.floor(hd.y)*sc-sc;
      if(dir===0){const o=O.shadesF;D(o,hx-o.width*sc/2,ey);}
      else{const o=O.shadesS,ex=x0+mx(hd.x-hd.r*0.35)*sc;D(o,ex-o.width*sc/2,ey,dir===3);}break;}
  }
}
function openShop(){state='shop';shopSel=0;shopMsg=null;SFX.menu();}
function updateShop(){
  if(pressed.back||pressed.wear||pressed.quest||pressed.grow){state='play';SFX.menu();return;}
  const n=SHOP.length+1;
  if(pressed.up){shopSel=(shopSel+n-1)%n;shopMsg=null;SFX.menu();}
  if(pressed.down){shopSel=(shopSel+1)%n;shopMsg=null;SFX.menu();}
  if(!pressed.a)return;
  if(shopSel===SHOP.length){state='play';SFX.menu();return;}
  const o=OUTFITS.find(x=>x.id===SHOP[shopSel]);
  if(G.outfits.includes(o.id)){setWear(G.wear===o.id?null:o.id);shopMsg={s:G.wear===o.id?'Wearing it! Gorgeous!':'Taken off.',c:'#94dc64'};SFX.pick();save();}
  else if(G.seeds<priceOf(o)){const k=priceOf(o)-G.seeds;shopMsg={s:'You need '+k+' more seed'+(k>1?'s':'')+', darling.',c:'#ff8080'};SFX.deny();}
  else{G.seeds-=priceOf(o);G.outfits.push(o.id);setWear(o.id);shopMsg={s:'Sold! You look FABULOUS!',c:'#ffd83a'};SFX.cash();save();}
}
function drawShop(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ff6fae');
  drawImg(SPR.magpie,12,8);txt("MAGGIE'S BOUTIQUE",W/2+8,12,7,'#ff9cd0',{align:'center',shadow:true});
  drawImg(SPR.seed,196,26);txt('x'+G.seeds,206,28,7,'#fff8ec');
  SHOP.concat(['leave']).forEach((id,i)=>{const y=40+i*20,sel=i===shopSel;
    box(12,y,130,17,sel?'#3b2a56':'#1d1430',sel?'#fff8ec':'#4a3a66');
    if(id==='leave'){txt('LEAVE SHOP',20,y+6,5,'#d8c8f8');return;}
    const o=OUTFITS.find(x=>x.id===id),own=G.outfits.includes(id);
    txt(o.name,20,y+6,5,own?'#94dc64':'#fff8ec');
    if(own)txt(G.wear===id?'ON':'OWN',136,y+6,5,'#94dc64',{align:'right'});
    else{drawImg(SPR.seed,120,y+4);txt(''+priceOf(o),136,y+6,5,G.seeds>=priceOf(o)?'#fff8ec':'#ff8080',{align:'right'});}});
  box(150,40,94,100,'#2e2048','#6a5a90');
  const id=shopSel<SHOP.length?SHOP[shopSel]:G.wear;
  drawPip(stage(),[0,2,1,3][Math.floor(tick/50)%4],Math.floor(tick/12)%2,false,197,128,3,id);
  box(12,148,W-24,66,'#1d1430','#6a5a90');
  if(shopSel<SHOP.length){const o=OUTFITS.find(x=>x.id===SHOP[shopSel]);txt(o.name,20,154,7,'#ff9cd0');wrap(o.desc,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,165+i*8,5,'#d8c8f8'));wrap('BONUS: '+o.bonus,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,183+i*8,5,'#94dc64'));}
  else txt('Come back soon, darling!',20,160,6,'#d8c8f8');
  if(shopMsg)txt(shopMsg.s,20,202,5,shopMsg.c);else txt('Z: buy / wear     ESC: leave',20,202,5,'#8a7ab0');
}
function openWardrobe(){state='wardrobe';SFX.menu();wardSel=Math.max(0,[null,...OUTFITS.map(o=>o.id)].indexOf(G.wear));}
function updateWardrobe(){
  if(pressed.wear||pressed.back||pressed.grow||pressed.quest){state='play';SFX.menu();return;}
  const n=9;let m=false;
  if(pressed.left){wardSel=(wardSel+n-1)%n;m=true;}if(pressed.right){wardSel=(wardSel+1)%n;m=true;}
  if(pressed.up){wardSel=(wardSel+n-3)%n;m=true;}if(pressed.down){wardSel=(wardSel+3)%n;m=true;}
  if(m)SFX.menu();
  if(pressed.a){const id=wardSel?OUTFITS[wardSel-1].id:null;if(id&&!G.outfits.includes(id))SFX.deny();else{setWear(id);SFX.pick();save();}}
}
function drawWardrobe(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ffd83a');
  txt("PIP'S CLOSET",W/2,10,8,'#ffd83a',{align:'center',shadow:true});
  txt(G.outfits.length+'/8',W-14,11,5,'#b8a8d8',{align:'right'});
  for(let i=0;i<9;i++){
    const col=i%3,row=Math.floor(i/3),x=12+col*78,y=24+row*44,o=i?OUTFITS[i-1]:null,id=o?o.id:null,own=!id||G.outfits.includes(id),sel=i===wardSel,on=G.wear===id;
    if(sel){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.fillRect(x-2,y-2,78,44);}
    box(x,y,74,40,on?'#3a3010':'#1d1430',on?'#ffd83a':'#4a3a66');
    if(own){drawPip(stage(),0,0,false,x+17,y+36,1,id);wrap(o?o.name:'NO OUTFIT',5,40).forEach((l,j)=>txt(l,x+33,y+10+j*9,5,on?'#ffd83a':'#fff8ec'));}
    else{txt('?',x+17,y+14,10,'#4a3a66',{align:'center'});txt('???',x+33,y+14,5,'#6a5a90');}
  }
  const o=wardSel?OUTFITS[wardSel-1]:null,own=!o||G.outfits.includes(o.id);
  box(12,160,W-24,54,'#1d1430','#6a5a90');
  txt(own?(o?o.name:'NO OUTFIT'):'???',20,166,7,'#ffd83a');
  const desc=!o?'Just plain, fluffy Pip.':own?o.desc:(o.how||"Sold at Maggie's Boutique in the barnyard ("+o.price+" seeds).");
  wrap(desc,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,177+i*8,5,'#d8c8f8'));
  if(o)wrap('BONUS: '+o.bonus,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,195+i*8,5,own?'#94dc64':'#6a8a60'));
  txt(own?(G.wear===(o?o.id:null)?'Wearing it!':'Z: wear'):'Not found yet',W-20,166,5,own?'#94dc64':'#8a7ab0',{align:'right'});
}

/* ---- minigames ---- */
function startMG(type,npc){
  MG={type,npc,t:0,score:0,goal:type==='bonk'?12:15,limit:type==='bonk'?1800:2400};
  toast(type==='bonk'?'Peck the carrots! GO!':'Catch the fireflies! GO!','#e8ff70');SFX.magic();
}
function updateMG(){
  const m=MG;m.t++;
  if(m.type==='bonk'){
    const holes=ents.filter(e=>e.type==='hole');for(const h of holes)if(h.up>0)h.up--;
    if(Math.random()<0.035+m.t/1800*0.035){const free=holes.filter(h=>h.up<=0);
      if(free.length){const h=free[(Math.random()*free.length)|0];h.up=h.max=Math.round(80-m.t/1800*35);h.gold=Math.random()<0.12;SFX.pop();}}
  }else{
    const fl=ents.filter(e=>e.type==='ffly'),sx=CS.x*256,sy=CS.y*192;
    if(fl.length<9&&Math.random()<0.06)addEnt({type:'ffly',x:sx+40+Math.random()*176,y:sy+40+Math.random()*120,p:Math.random()*6,v:0.6+Math.random()*0.6+m.t/2400});
    for(const f of fl){f.p+=0.04;f.x=clamp(f.x+Math.cos(f.p*0.9+f.v)*f.v,sx+24,sx+232);f.y=clamp(f.y+Math.sin(f.p*1.3)*f.v*0.8,sy+30,sy+176);}
  }
  if(m.score>=m.goal||m.t>=m.limit)endMG();
}
function endMG(){
  const m=MG;MG=null;for(const e of ents){if(e.type==='hole')e.up=0;if(e.type==='ffly')e.dead=true;}
  const win=m.score>=m.goal,key=m.type,prize=key==='bonk'?'ears':'pirate',npc=ents.find(n=>n.id===m.npc);
  G.best[key]=Math.max(G.best[key],m.score);const L=[];
  if(win){SFX.questDone();
    if(!G.outfits.includes(prize)){G.outfits.push(prize);
      L.push({who:npc,text:key==='bonk'?"WOW! You bonked "+m.score+" carrots! You win my spare BUNNY EARS!":"Hoo-hoo! Splendid! "+m.score+" fireflies! A pirate captain left this PIRATE OUTFIT in my tree long ago. It's yours! Arr!",
        fx:()=>toast('Got the '+(prize==='ears'?'BUNNY EARS':'PIRATE OUTFIT')+'! Press C to wear.')});}
    else L.push({who:npc,text:"You won again! Score: "+m.score+". Best: "+G.best[key]+"!"});}
  else{SFX.deny();L.push({who:npc,text:(key==='bonk'?"Time's up! You got ":"The moon is setting! You caught ")+m.score+". Talk to me to try again!"});}
  save();say(L);
}
function drawMG(){
  if(!MG)return;const left=Math.max(0,Math.ceil((MG.limit-MG.t)/60));
  box(52,H-22,152,16,'#1d1430','#e8ff70');
  txt((MG.type==='bonk'?'CARROTS ':'FIREFLIES ')+MG.score+'/'+MG.goal+'   '+left+'s',W/2,H-17,6,'#e8ff70',{align:'center'});
}
function startEgg(){EG={px:128,eggs:[],splats:[],score:0,miss:0,t:0,next:50,over:0,win:false};state='egg';SFX.magic();}
function updateEgg(){
  const e=EG;
  if(e.over){e.over++;if(e.over>150||(e.over>40&&pressed.a))endEgg();return;}
  e.t++;const sp=has('quick')?3.2:2.6;
  if(keys.left)e.px-=sp;if(keys.right)e.px+=sp;e.px=clamp(e.px,20,236);
  if(--e.next<=0){const hx=[44,100,156,212][(Math.random()*4)|0];
    e.eggs.push({x:hx,y:52,vy:0.4+Math.min(1.1,e.t/1800),gold:Math.random()<0.1});e.next=Math.max(22,60-e.t/40)+Math.random()*20;}
  for(const g of e.eggs){g.vy+=0.02;g.y+=g.vy;
    if(g.y>=186&&g.y<=199&&Math.abs(g.x-e.px)<17){g.done=true;e.score+=g.gold?3:1;SFX.catchEgg();}
    else if(g.y>206){g.done=true;e.miss++;SFX.crackEgg();e.splats.push({x:g.x,gold:g.gold});}}
  e.eggs=e.eggs.filter(g=>!g.done);
  if(e.score>=20){e.over=1;e.win=true;SFX.questDone();}else if(e.miss>=5){e.over=1;SFX.deny();}
}
function endEgg(){
  const e=EG;EG=null;state='play';const penny=ents.find(n=>n.id==='penny'),L=[];G.best.egg=Math.max(G.best.egg,e.score);
  if(e.win){if(!G.outfits.includes('bow')){G.outfits.push('bow');
      L.push({who:penny,text:"WOW! "+e.score+" eggs! You're amazing, Pip! Here, take my spare PINK BOW!",fx:()=>{toast('Got the PINK BOW! Press C to wear.');SFX.quest();}});}
    else L.push({who:penny,text:"You did it again! "+e.score+" eggs. Egg-cellent!"});}
  else L.push({who:penny,text:"Aww, "+e.score+" eggs! So close! Talk to me to try again."});
  save();say(L);
}
function drawEgg(){
  const e=EG;
  for(let y=24;y<H;y+=16)for(let x=0;x<W;x+=16)ctx.drawImage(TILE.straw,x,y);
  ctx.fillStyle='#1d1430';ctx.fillRect(0,0,W,24);
  ctx.fillStyle=PAL.k;ctx.fillRect(0,46,W,8);ctx.fillStyle=PAL.b;ctx.fillRect(0,47,W,5);ctx.fillStyle=PAL.T;ctx.fillRect(0,47,W,1);
  [44,100,156,212].forEach((hx,i)=>{const s=i%2?flipOf(SPR.hen):SPR.hen;drawImg(s,hx-(s.width>>1),48-s.height+(Math.floor((tick+i*7)/20)%2));});
  for(const g of e.eggs)drawImg(g.gold?SPR.goldEgg:SPR.egg,g.x-3,g.y-3);
  for(const s of e.splats){ctx.fillStyle=s.gold?PAL.q:PAL.w;ctx.fillRect(s.x-6,208,12,2);ctx.fillRect(s.x-3,206,6,2);ctx.fillStyle=PAL.y;ctx.fillRect(s.x-1,207,3,2);}
  drawPip(stage(),0,(keys.left||keys.right)?Math.floor(tick/7)%2:0,false,e.px,214,1);
  ctx.fillStyle=PAL.k;ctx.fillRect(e.px-13,190,26,9);ctx.fillStyle=PAL.b;ctx.fillRect(e.px-12,191,24,7);
  ctx.fillStyle=PAL.T;for(let i=-10;i<12;i+=4)ctx.fillRect(e.px+i,191,1,7);
  txt('EGG CATCH',8,9,6,'#ffd83a');txt(e.score+' / 20',W/2,8,8,'#fff8ec',{align:'center'});
  for(let i=0;i<5;i++)drawImg(i<5-e.miss?SPR.heart:SPR.heartE,W-54+i*10,8);
  if(e.t<120&&!e.over)txt('Catch 20 eggs!',W/2,110,8,'#21142b',{align:'center'});
  if(e.over){box(48,86,160,40,'#1d1430','#ffd83a');txt(e.win?'YOU WIN!':'OOPS!',W/2,96,10,e.win?'#ffd83a':'#ff8080',{align:'center'});
    txt(e.score+' eggs caught',W/2,112,6,'#fff8ec',{align:'center'});}
}

/* ---- secrets & sleeping ---- */
function openChest(){
  if(G.chest){say([{who:'me',text:"It's empty now. But what a treasure it was!"}]);return;}
  G.chest=true;if(!G.outfits.includes('crown'))G.outfits.push('crown');G.seeds+=3;G.found+=3;SFX.chest();shake=3;
  toast('TREASURE! Golden Crown + 3 seeds!');save();
  say([{who:'me',text:"Wow! A real GOLDEN CROWN and 3 seeds! I'm the ruler of Chicklandia! Press C to try on outfits!"}]);
}
function trySleep(){
  const t=dayT();
  if(t>0.05&&t<0.45){say([{who:'me',text:"My cozy nest! ...But I'm not sleepy yet. It's still daytime!"}]);return;}
  say([{who:'me',text:"*yaaawn* My cozy nest looks sooo comfy...",choices:['Sleep','Not yet'],cb:i=>{if(i===0){state='sleep';FT=0;SFX.lullaby();}}}]);
}
function updateSleep(){
  FT++;
  if(FT<=40){fade=FT/40;fadeColor='#000';}
  if(FT===60){const t=dayT(),base=G.clock-(G.clock%DAY);G.clock=(t<0.05?base:base+DAY)+Math.round(DAY*0.04);
    G.hearts=maxHearts();G.puddle=0;rollWeather();save();}
  if(FT>60)fade=Math.max(0,1-(FT-60)/40);
  if(FT>=100){state='play';toast('Good morning! Day '+dayNum());}
}

