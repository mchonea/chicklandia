'use strict';
/* ---------------- Sky Kingdom: bouncy clouds, vents, wind, storms, the sky gate, hatching, naming, chime puzzle ---------------- */
for(const c of SKY_CAST){const p=SKO[c.o];CHARACTERS.push({id:c.id,name:c.name,spr:c.spr,c:p[0]+c.c,r:p[1]+c.r,voice:c.voice,w:c.w});}
Object.assign(AREA_LABEL,{meadows:'CLOUD MEADOWS',gardens:'FLOATING GARDENS',skycity:'CLOUD CITY',peaks:'STORM PEAKS',lair:"DRAGON'S LAIR"});
Object.assign(WEAR_ICON,{quill:OUTFIT_SPR.quill,bloom:OUTFIT_SPR.bloom,stormcap:OUTFIT_SPR.stormcap,scarf:OUTFIT_SPR.scarf});
function skyRegion(){const r=regionAt();return !!r&&!!r.sky;}
function skyArea(){const r=regionAt();return r&&r.sky&&r.area?r.area:null;}
function skyRain(){const r=regionAt();if(r&&r.sky)return (r.area==='peaks'||r.area==='lair')?0.55:0;return rainAmt();}
function skyDark(){const r=regionAt();if(!r||!r.sky||r.kind==='indoor')return null;const n=nightAmt();
  if(r.area==='peaks')return 0.3+n*0.25;if(r.area==='lair')return 0.42;return n*0.3;}   // sky areas: gentle nights; the storm always dims the peaks
/* ---- entities ---- */
function addHatchling(){
  if(ents.some(e=>e.id==='hatch'))return;
  addEnt({type:'npc',id:'hatch',name:G.sky.name||'CHICK',spr:'eaglet',x:P.x-10,y:P.y,w:10,voice:1500,solid:false,phase:0,flip:false,follow:true});
}
function makeSkyEnts(){
  const S=G.sky;
  for(const p of SKY_PADS){const a=skpA(p.at);addEnt({type:'spad',id:p.id,x:a.x,y:a.y,to:p.to?skpA(p.to):null,sq:0});}
  for(const v of SKY_VENTS){const a=skpA(v.at);addEnt({type:'svent',id:v.id,x:a.x,y:a.y,to:skpA(v.to)});}
  for(const p of SKY_PORTALS){const a=skpA(p.at);addEnt({type:'sport',id:p.id,x:a.x,y:a.y,to:p.to?skpA(p.to):null,label:p.label,lair:!!p.lair,down:p.id==='down'});}
  for(const [id,kind,o,c,r] of SKY_ITEMS){if(kind==='chime'||kind==='peg'||kind==='bolt')continue;const p=skp(o,c,r);spawnItem(id,kind,p.x,p.y);}
  for(const [c0,r0,c1,r1] of SKY_SOIL)for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)addPlot(SKO.g0[0]+c,SKO.g0[1]+r,false);
  {const g=gatePx();addEnt({type:'sgate',x:g.x,y:g.y});}
  for(const [k,o,c,r] of SKY_CHIMES){const p=skp(o,c,r);addEnt({type:'gchime',id:k,x:p.x,y:p.y,solid:true,w:12,ring:0});}
  if(S.chimes===1){const p=skp('g1',7,9);addEnt({type:'skychest',id:'chimechest',kind:'chime',x:p.x,y:p.y,solid:true,w:16});}
  if(!G.outfits.includes('scarf')){const p=skp('m1',12,8);addEnt({type:'skychest',id:'scarfchest',kind:'scarf',x:p.x,y:p.y,solid:true,w:16});}
  {const p=skp('m1',5,1);addEnt({type:'snest',x:p.x,y:p.y+2});}
  if(S.hatched)addHatchling();
  if(G.flags.sky){const p=skp('lair',8,4);addEnt({type:'npc',id:'stormy',name:'STORMY',spr:'dragon',x:p.x,y:p.y,w:44,voice:120,solid:true,phase:0,flip:false});}
}
function skyFollow(){
  const h=ents.find(e=>e.id==='hatch');if(!h||!h.follow)return;
  const p=TRAIL[Math.max(0,TRAIL.length-1-(followerCount()+1)*12)];
  if(p){if(Math.abs(p.x-h.x)>0.3)h.flip=p.x>h.x;h.x+=(p.x-h.x)*0.4;h.y+=(p.y-h.y)*0.4;}
  if(Math.hypot(h.x-P.x,h.y-P.y)>180){h.x=P.x;h.y=P.y;}
}
/* ---- per-frame ---- */
let skyCool=0,skySafe=null;
const STRIKES=[];let strikeT=60,chimeSeq=[];
function updateSky(){
  if(!G||!P||!G.sky)return;
  if(skyCool>0)skyCool--;
  skyFollow();
  // the sky gate on the snowy peak
  for(const e of ents){if(e.type!=='sgate'||!onCur(e)||state!=='play'||P.hop)continue;
    if(Math.abs(P.x-e.x)<12&&Math.abs(P.y-e.y)<12&&warpCool<=0){
      if(!G.sky.hatched){if(P.bubbleCd<=0){P.bubbleCd=240;float(e.x,e.y-26,G.flags.skyMap?'The clouds shimmer. Wait for the egg!':'A faint swirl of cloud...','#a6e0ff');}continue;}
      warpCool=80;const a=skpA(SKY_NODES.meadows.at);
      if(!G.sky.open){G.sky.open=1;save();say([{who:'me',text:"A stairway of clouds, just like the ancient map! "+(G.sky.name||'My chick')+" is tugging my wing. Let's climb!"}],()=>warpTo(a.x,a.y,3,null,()=>toast('Welcome to the CLOUD MEADOWS!','#a6e0ff')));}
      else warpTo(a.x,a.y,3,null,()=>toast('Up the cloud stairs...','#a6e0ff'));}}
  const rg=regionAt();if(!rg||!rg.sky){STRIKES.length=0;return;}
  if(P.hop&&P.hop.sky&&!P.hop.slam&&pressed.a&&has('divebomb')&&P.hop.t>6){P.hop.slam=true;SFX.gust();float(P.x,P.y-26-P.z,'DIVE!','#ffd83a');}
  const under=tileAt(Math.floor(P.x/16),Math.floor((P.y-3)/16));
  if(!P.hop&&state==='play'){
    if(under==='ε'||under==='ζ'){if(!wearing('scarf'))moveP(under==='ε'?0.9:-0.9,0,false);else if(tick%120===0)float(P.x,P.y-24,'Cozy scarf!','#ff9cd0');}
    if(under==='ι'&&!wearing('stormcap')&&P.inv<=0){hurt({x:P.x,y:P.y});if(skySafe){P.x=skySafe.x;P.y=skySafe.y;}float(P.x,P.y-24,'Brrr! Rain wall!','#a6c8ff');}
    else if(under!=='ι'&&under!=='ε'&&under!=='ζ')skySafe={x:P.x,y:P.y};
  }
  if(state==='play')for(const e of ents){if(!onCur(e))continue;
    if(P.hop)break;
    const near=Math.abs(P.x-e.x)<9&&Math.abs(P.y-e.y)<9;
    if(e.type==='spad'&&near&&skyCool<=0)skyLaunch(e);
    else if(e.type==='svent'&&near&&skyCool<=0)ventUse(e);
    else if(e.type==='sport'&&warpCool<=0&&Math.abs(P.x-e.x)<10&&Math.abs(P.y-e.y)<10)portalUse(e);}
  for(const e of ents)if(e.sq>0)e.sq--;
  updateStorm();
  if(skyBossActive())updateSkyBoss();
}
function skyLaunch(e){
  const q=wearing('quill'),to=e.to||{x:e.x,y:e.y};
  P.x=e.x;P.y=e.y;P.hop={x0:P.x,y0:P.y,x1:to.x,y1:to.y,t:0,d:Math.round((e.to?40:46)*(q?0.8:1)),hz:e.to?34:44,sky:true};skyCool=P.hop.d+30;   // time to walk off the cloud before it bounces again
  e.sq=10;SFX.hop();puff(e.x,e.y-4,8,['#ffffff','#e6f2ff'],1.4,0.05);
  if(!e.to&&has('divebomb')&&!G.sky.dbTip){G.sky.dbTip=1;toast('Press peck in mid-air to DIVE-BOMB!','#ffd83a');}
}
function ventUse(e){
  if(!has('updraft')){skyCool=120;float(e.x,e.y-26,'Strong wind! Learn UPDRAFT.','#a6e0ff');SFX.deny();return;}
  P.x=e.x;P.y=e.y;P.hop={x0:P.x,y0:P.y,x1:e.to.x,y1:e.to.y,t:0,d:Math.round(46*(wearing('quill')?0.8:1)),hz:46,sky:true};skyCool=P.hop.d+30;
  SFX.gust();puff(e.x,e.y-6,10,['#ffffff','#a6e0ff'],1.2,-0.04);
}
function portalUse(e){
  if(e.down){warpCool=80;const o=gateOut();warpTo(o.x,o.y,0,null,()=>toast('Down the cloud stairs...','#a6e0ff'));return;}
  if(e.id==='p1lair'&&G.sky.boss<4){warpCool=80;warpTo(e.to.x,e.to.y,1,null,()=>skyBossStart());return;}
  if(e.id==='lairp1'){SKB=null;ents=ents.filter(x=>!['sdragon','scrys','sbell'].includes(x.type));STRIKES.length=0;}
  warpCool=80;warpTo(e.to.x,e.to.y,e.to.x>e.x?3:2,null,null);
}
function skyLand(h){
  if(!h.slam)return;
  shake=7;SFX.brk();
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;parts.push({x:P.x,y:P.y-2,vx:Math.cos(a)*2.2,vy:Math.sin(a)*1.2,g:0,life:18,c:i%2?'#ffffff':'#ffd83a'});}
  let n=0;const c0=Math.floor(P.x/16),r0=Math.floor((P.y-3)/16);
  for(let dr=-3;dr<=3;dr++)for(let dc=-3;dc<=3;dc++){const c=c0+dc,r=r0+dr;
    if(tileAt(c,r)==='κ'&&Math.hypot(c*16+8-P.x,r*16+8-(P.y-3))<=44){setTile(c,r,'α');n++;puff(c*16+8,r*16+8,10,['#ffffff','#a8b4c8'],1.6,0.06);}}
  for(const e of ents)if(e.type==='sbell'&&!e.rung&&Math.hypot(e.x-P.x,e.y-P.y)<26)ringBell(e);
  if(n){toast('SLAM! The cloud barrier cracks!','#ffd83a');save();}
}
function skyBump(ix,iy){
  if(!skyRegion()||P.bubbleCd>0)return false;
  const [dx,dy]=[ix?Math.sign(ix):0,iy?Math.sign(iy):0],t=tileAt(Math.floor((P.x+dx*9)/16),Math.floor((P.y-3+dy*7)/16));
  const msg={γ:"This cloud is too thin to stand on... Cloud Walk could do it!",κ:"A cloud barrier! Something heavy, falling from above, might crack it.",θ:"A storm crystal, buzzing with lightning!",η:null}[t];
  if(msg){P.bubbleCd=200;float(P.x,P.y-26,msg.length>34?msg.slice(0,msg.lastIndexOf(' ',34))+'...':msg,'#a6e0ff');return true;}
  return false;
}
/* ---- storms ---- */
function spawnStrike(x,y,warn){
  const c=Math.floor(x/16),r=Math.floor((y-3)/16),t=tileAt(c,r);if(t!=='α'&&t!=='ε'&&t!=='ζ')return;
  STRIKES.push({x:c*16+8,y:r*16+12,t:0,warn:(warn||56)+(wearing('stormcap')?24:0)});
}
function updateStorm(){
  if(skyArea()==='peaks'&&state==='play'&&--strikeT<=0){strikeT=110+Math.random()*100;spawnStrike(P.x+(Math.random()-.5)*130,P.y+(Math.random()-.5)*100);}
  for(const s of STRIKES){s.t++;
    if(s.t===s.warn){SFX.thunder();flash=Math.max(flash,0.6);shake=5;
      if(Math.hypot(P.x-s.x,P.y-6-(s.y-8))<16&&!P.hop)hurt({x:s.x,y:s.y});}}
  for(let i=STRIKES.length-1;i>=0;i--)if(STRIKES[i].t>STRIKES[i].warn+14)STRIKES.splice(i,1);
}
/* ---- peck hooks ---- */
function skyPeck(e,f,pr){
  if(e.type==='gchime'&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-8-f.y)<14){ringChime(e);return true;}
  if(e.type==='skychest'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-6-f.y)<16){openSkyChest(e);return true;}
  if(e.type==='snest'&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-4-f.y)<14){peckNest(e);return true;}
  if(e.type==='sbell'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-8-f.y)<16){ringBell(e);return true;}
  if(e.type==='scrys'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-8-f.y)<16){hitCrystal(e);return true;}
  return false;
}
function skyTalkChest(f){for(const e of ents)if(e.type==='skychest'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-6-f.y)<16){openSkyChest(e);return true;}return false;}
function smashCrystal(c,r){
  setTile(c,r,'α');SFX.brk();shake=6;puff(c*16+8,r*16+8,16,['#c898f8','#8a4ad8','#ffe84a','#ffffff'],1.8,0.06);
  if(!G.sky.crys)toast('The storm crystal shatters! A gap in the wall!','#c898f8');G.sky.crys=(G.sky.crys||0)+1;save();
}
function ringChime(e){
  e.ring=20;SFX.blip({small:980,mid:720,big:470}[e.id]);
  if(G.sky.chimes>=1){float(e.x,e.y-20,'The garden hums...','#94dc64');return;}
  chimeSeq.push(e.id);
  if(chimeSeq.some((k,i)=>k!==CHIME_TUNE[i])){chimeSeq=[];SFX.deny();float(e.x,e.y-20,'...off-key. Try again!','#b8a8d8');return;}
  float(e.x,e.y-20,chimeSeq.length+'/3','#ffd83a');
  if(chimeSeq.length>=3){chimeSeq=[];G.sky.chimes=1;SFX.fanfare();shake=4;toast('The chimes sing! A chest appears!','#ff9cd0');
    const p=skp('g1',7,9);addEnt({type:'skychest',id:'chimechest',kind:'chime',x:p.x,y:p.y,solid:true,w:16});puff(p.x,p.y-8,16,['#ffd83a','#fff8ec','#ff9cd0'],1.8,0.04);save();}
}
function openSkyChest(e){
  if(e.kind==='chime'){e.dead=true;G.sky.chimes=2;SFX.chest();shake=3;G.sacks.star=(G.sacks.star||0)+3;addSeeds(4,2,0);
    toast('3 STAR-FRUIT seeds and 4 seeds!','#ffd83a');say([{who:'me',text:"The garden chest held star-fruit seeds and a few seeds! Time to plant."}]);}
  else if(e.kind==='scarf'){e.dead=true;SFX.chest();shake=5;
    if(grantOutfit('scarf'))toast('Found the CLOUD SCARF!','#ff9cd0');say([{who:'me',text:"A hidden pocket in the clouds, and a CLOUD SCARF inside! Press C to wear it."}]);}
  save();
}
function peckNest(e){
  if(G.sky.nest){float(e.x,e.y-16,'An empty old nest.','#b8a8d8');SFX.clunk();return;}
  G.sky.nest=1;SFX.chirp();puff(e.x,e.y-6,12,['#c49a5c','#fff8ec','#ffd83a'],1.4,0.05);addSeeds(3,2,0);secretFound('skynest');
  say([{who:'me',text:"The last cloud of the island! A tiny, ancient nest, and three seeds tucked inside."}]);save();
}
/* ---- hatching ---- */
let HAT=null,NAMEUI=null;
function startHatch(){HAT={t:0};state='hatch';fade=0;SFX.magic();}
function updateHatch(){
  const h=HAT;h.t++;
  if(h.t<150&&h.t%24===0)SFX.clunk();
  if(h.t===150){SFX.crackEgg();shake=4;}
  if(h.t===195){SFX.catchEgg();shake=3;}
  if(h.t===230)SFX.chirp();
  if(h.t>290&&pressed.a){SFX.menu();openNaming();}
  updateAmbient();
}
function drawHatch(){
  const h=HAT,t=h.t;
  drawSky(tick);ctx.fillStyle='#fff8ec';ctx.fillRect(0,150,W,H-150);ctx.fillStyle='#d8eefc';ctx.fillRect(0,150,W,2);
  for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#e6f2ff':'#ffffff';ctx.fillRect(i*22-6,146+(i%3)*2,26,6);}
  const el=SPR.eagle;ctx.drawImage(el,34,170-el.height*2,el.width*2,el.height*2);
  drawPip(stageOfRank(G.rank),3,Math.floor(tick/14)%2,false,210,184,2);
  const cx=128,cy=168;
  if(t<195){const w=t<150?Math.sin(t/4)*Math.min(14,t/8):0,e=SPR.eagleEgg;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(w*0.03);ctx.drawImage(e,-e.width*3,-e.height*6,e.width*6,e.height*6);
    if(t>=150){ctx.fillStyle='#21142b';ctx.fillRect(-4,-22,2,10);ctx.fillRect(-2,-14,6,2);ctx.fillRect(2,-12,2,8);}
    ctx.restore();}
  else{const e=SPR.eaglet,k=Math.min(1,(t-195)/20);
    ctx.fillStyle='#fff8ec';ctx.fillRect(cx-22,cy-8,16,10);ctx.fillRect(cx+8,cy-8,16,10);ctx.fillStyle='#21142b';ctx.fillRect(cx-22,cy-9,16,2);ctx.fillRect(cx+8,cy-9,16,2);
    ctx.drawImage(e,Math.round(cx-e.width*2*k),Math.round(cy-e.height*4*k-Math.sin(t/6)*1.5),Math.round(e.width*4*k),Math.round(e.height*4*k));
    if(t%5===0)parts.push({x:cx-12+Math.random()*24+camX,y:cy-30+camY,vx:(Math.random()-.5)*1.5,vy:-0.8-Math.random(),g:0.02,life:30,c:['#ffd83a','#fff8ec','#ff6fae'][(Math.random()*3)|0]});}
  for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x-camX),Math.round(p.y-camY),2,2);}
  const msg=t<150?'The egg is wobbling...':t<195?'Crack... crack...':t<290?'A tiny eaglet blinks up at you!':'Press Z';
  box(40,16,176,22,'#fff8ec','#21142b');txt(msg,W/2,23,7,'#21142b',{align:'center'});
}
const NAME_ROWS=[['SKY','NIMBLE','PEEPER','ZIPPY'],'ABCDEFG'.split(''),'HIJKLMN'.split(''),'OPQRSTU'.split(''),['V','W','X','Y','Z','DEL','OK']];
function openNaming(){NAMEUI={s:'',row:0,col:0};state='naming';HAT=null;}
function updateNaming(){
  const N=NAMEUI;
  if(pressed.up){N.row=(N.row+NAME_ROWS.length-1)%NAME_ROWS.length;SFX.menu();}
  if(pressed.down){N.row=(N.row+1)%NAME_ROWS.length;SFX.menu();}
  if(pressed.left){N.col--;SFX.menu();}if(pressed.right){N.col++;SFX.menu();}
  const rl=NAME_ROWS[N.row].length;N.col=((N.col%rl)+rl)%rl;
  if(pressed.b||pressed.back){N.s=N.s.slice(0,-1);SFX.menu();}
  if(pressed.a){const k=NAME_ROWS[N.row][N.col];
    if(N.row===0){N.s=k;SFX.pick();}
    else if(k==='DEL'){N.s=N.s.slice(0,-1);SFX.menu();}
    else if(k==='OK'){if(N.s.length>0)finishNaming();else{SFX.deny();}}
    else if(N.s.length<10){N.s+=k;SFX.pick();}else SFX.deny();}
  updateAmbient();
}
function drawNaming(){
  const N=NAMEUI;ctx.fillStyle='#241838';ctx.fillRect(0,0,W,H);
  for(let i=0;i<30;i++){ctx.fillStyle=(i+Math.floor(tick/12))%4?'#3b2a56':'#ffd83a';ctx.fillRect((i*53)%W,(i*37+Math.floor(tick/4))%H,1,1);}
  box(10,8,W-20,H-16,'#1d1430','#ffd83a');txt('NAME YOUR CHICK!',W/2,14,9,'#ffd83a',{align:'center',shadow:true});
  const e=SPR.eaglet;ctx.drawImage(e,Math.round(W/2-e.width*1.5),32,e.width*3,e.height*3);
  box(54,64,148,18,'#fff8ec','#21142b');let nm=N.s;if(Math.floor(tick/20)%2&&N.s.length<10)nm+='_';txt(nm,W/2,70,9,'#21142b',{align:'center'});
  NAME_ROWS.forEach((row,ri)=>{const y=ri===0?90:106+(ri-1)*17,n=row.length,cw=ri===0?42:ri===4?(ri===4?30:26):26;
    const total=ri===0?4*44:n*28,x0=Math.round((W-total)/2);
    row.forEach((k,ci)=>{const w=ri===0?42:26,x=ri===0?x0+ci*44:x0+ci*28,sel=ri===N.row&&ci===N.col;
      box(x,y,w,ri===0?13:15,sel?'#ffd83a':'#3b2a56',sel?'#fff8ec':'#6a5a90');
      txt(k,x+w/2,y+(ri===0?4:5),ri===0?5:6,sel?'#21142b':(k==='OK'?'#94dc64':k==='DEL'?'#ff8080':'#fff8ec'),{align:'center'});});});
  txt('Z: pick     X: erase',W/2,H-22,5,'#b8a8d8',{align:'center'});
}
function finishNaming(){
  const name=NAMEUI.s;NAMEUI=null;state='play';G.sky.name=name;G.sky.hatched=1;
  const h=ents.find(e=>e.id==='hatch');if(h)h.name=name;else addHatchling();
  const hh=ents.find(e=>e.id==='hatch');if(hh)hh.name=name;
  SFX.fanfare();reward(QUESTS.sk_hatch.reward,'sk_hatch');
  const el=ents.find(e=>e.id==='elda');
  say([{who:el||'me',text:name+"! What a fine, strong name. Screeee!"},
    {who:el||'me',text:"The old map shows a stairway of clouds just east of my nest. "+name+" belongs up there, in the sky, and so do you."},
    {who:'me',text:"A cloud stairway! Come on, "+name+"! Let's see the Sky Kingdom!"}],()=>{toast('A cloud stairway shimmers east of Elda!','#a6e0ff');save();});
}
/* ---- quest marker and hint for the sky ---- */
function skyHint(){
  if(!G.flags.skyMap)return null;
  if(!G.sky.hatched)return "Elda's egg is about to hatch! Visit her on the snowy peak.";
  if(!G.sky.open)return "A cloud stairway shimmers just east of Elda's nest on the snowy peak. Take your chick up!";
  for(const id of ORDER6)if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[QUEST_GIVER[id]]+" the good news!";
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===6&&G.train[k]===1)return t.hint();}
  for(const id of ORDER6)if(G.q[id]===1)return QUESTS[id].hint();
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===6&&!has(k)&&G.train[k]!==2&&t.avail())return "Talk to "+t.whoName+" to learn "+t.skill+"!";}
  for(const s of SKILLS5)if(skillState(s)==='open'&&G.seeds>=s.cost)return "You can learn "+s.name+" in your Sky Tree II. Press E!";
  for(const id of ORDER6){if(G.q[id]===0&&(id!=='sk_hatch')&&(!FOLLOW_GATE[id]||FOLLOW_GATE[id]())){
    const gv=QUEST_GIVER[id];if(id==='sk_chimes'&&G.q.sk_moon!==2)continue;if(id==='sk_boss'&&G.q.sk_rods!==2)continue;
    return "Talk to "+NAMES[gv].toUpperCase()+" ("+QUESTS[id].loc+").";}}
  if(G.q.sk_boss===1&&!G.flags.sky)return QUESTS.sk_boss.hint();
  if(!G.flags.sky)return has('thunder')?"Take on the Storm Dragon: the lair is past the second crystal wall in the Storm Peaks.":"Learn THUNDER PECK from Starla to break the crystal walls in the Storm Peaks.";
  return null;
}
function skyMarker(e){
  if(e.id==='elda'&&G.flags.skyMap&&G.q.elda===2&&!G.sky.hatched)return SPR.excl;
  const a=QUEST_OF[e.id];if(!a)return (e.id==='starla'||e.id==='hatch')?trainerMarker(e):undefined;
  const seq=[a].concat(FOLLOWUP[e.id]||[]);
  for(const id of seq){if(!QUESTS[id])continue;const st=G.q[id];
    if(st===2)continue;if(FOLLOW_GATE[id]&&!FOLLOW_GATE[id]())return trainerMarker(e);
    if(st===0)return SPR.excl;if(st===1&&QUESTS[id].check())return SPR.ques;return trainerMarker(e);}
  return trainerMarker(e);
}
/* ---- the fly map's sky page ---- */
const SKY_MAP_ORDER=['meadows','gardens','skycity','peaks'];
function skyMapNodes(){return SKY_MAP_ORDER.filter(k=>k==='meadows'||G.areas.includes(k));}
for(const k of SKY_MAP_ORDER){const a=skpA(SKY_NODES[k].at);DEST[k]={x:a.x,y:a.y,mx:SKY_NODES[k].mx,my:SKY_NODES[k].my,icon:SKY_NODES[k].icon};}
function drawSkyMap(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(6,6,W-12,H-12,'#cfe8ff','#5a78b8');
  for(let i=0;i<5;i++)cloud(10+i*52,28+(i%2)*12,1+(i%2));
  txt('THE SKY KINGDOM',W/2,14,8,'#21408a',{align:'center'});
  const nodes=skyMapNodes();
  ctx.fillStyle='#fff8ec';for(const [a,b] of [['meadows','gardens'],['gardens','peaks'],['meadows','skycity'],['skycity','peaks'],['gardens','skycity']]){
    const A=DEST[a],B=DEST[b];if(!nodes.includes(a)||!nodes.includes(b))continue;const n=Math.max(Math.abs(B.mx-A.mx),Math.abs(B.my-A.my))/4;
    for(let i=0;i<=n;i+=2)ctx.fillRect(Math.round(lerp(A.mx,B.mx,i/n))-1,Math.round(lerp(A.my,B.my,i/n))-1,2,2);}
  for(const k of SKY_MAP_ORDER){const d=DEST[k],open=nodes.includes(k),sel=k===mapSel;
    if(sel){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.fillRect(d.mx-17,d.my-17,34,34);}
    box(d.mx-15,d.my-15,30,30,open?'#fff8ec':'#9aa8c8',open?'#21408a':'#6a78a8');
    if(open){const cl=ctx.fillStyle;
      if(k==='meadows'){ctx.fillStyle='#e6f2ff';ctx.fillRect(d.mx-10,d.my-1,20,8);ctx.fillRect(d.mx-6,d.my-6,12,7);ctx.fillStyle='#c8dcf0';ctx.fillRect(d.mx-10,d.my+6,20,2);}
      else if(k==='gardens'){ctx.fillStyle='#94dc64';ctx.fillRect(d.mx-9,d.my+2,18,6);ctx.fillStyle='#ff6fae';ctx.fillRect(d.mx-6,d.my-6,4,6);ctx.fillStyle='#ffd83a';ctx.fillRect(d.mx+2,d.my-8,4,8);}
      else if(k==='skycity'){ctx.fillStyle='#e8b070';ctx.fillRect(d.mx-9,d.my-4,18,12);ctx.fillStyle='#e03838';ctx.fillRect(d.mx-10,d.my-8,20,4);ctx.fillStyle='#21142b';ctx.fillRect(d.mx-2,d.my+1,4,7);}
      else{ctx.fillStyle='#6a78a8';ctx.fillRect(d.mx-10,d.my-2,20,9);ctx.fillRect(d.mx-6,d.my-8,12,7);ctx.fillStyle='#ffe84a';ctx.fillRect(d.mx-1,d.my-6,3,8);}}
    else txt('?',d.mx,d.my-4,8,'#6a78a8',{align:'center'});
    txt(open?AREA_LABEL[k]:'???',d.mx,d.my+19,5,open?'#21408a':'#6a78a8',{align:'center'});
    if(skyArea()===k)drawPip(stage(),0,Math.floor(tick/12)%2,false,d.mx+14,d.my-8,1);}
  txt('Z: fly    X: ground page    F: close',W/2,H-20,5,'#21408a',{align:'center'});
}
