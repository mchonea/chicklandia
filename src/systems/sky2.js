'use strict';
/* ---------------- Sky Kingdom part 2: the Storm Dragon (3 stages), the finale, the flyover, credits, drawing ---------------- */
let SKB=null;
function skyBossActive(){const r=regionAt();return !!G&&!!G.sky&&!!SKB&&G.sky.boss>0&&G.sky.boss<4&&!!r&&r.id==='lair';}
function dragonEnt(){return ents.find(e=>e.type==='sdragon');}
function addDragon(){const d=skp('lair',8,3);return addEnt({type:'sdragon',name:'STORM DRAGON',spr:'dragon',x:d.x,y:d.y-8,hx:d.x,hy:d.y-8,t:0,flash:0,flip:false,phase:0,w:44,voice:110});}
const SKY_STAGE_TXT=['','STAGE 1: Dodge the lightning!','STAGE 2: Smash the storm crystals! (THUNDER PECK)','STAGE 3: Ring the 3 sky bells!'];
function skyBossStart(){
  const st=G.sky.boss>0&&G.sky.boss<4?G.sky.boss:1;
  ents=ents.filter(e=>!['sdragon','scrys','sbell'].includes(e.type));
  const d=addDragon();
  if(!G.sky.metBoss){G.sky.metBoss=1;
    say([{who:d,text:"GRRRUMBLE! Go away! This is MY storm. MY sky!"},{who:'me',text:"(He sounds angry... but a little bit sad, too. "+(G.sky.name||'My chick')+" is hiding behind my wing.)"}],()=>startSkyStage(st));}
  else startSkyStage(st);
}
function startSkyStage(st){
  ents=ents.filter(e=>!['scrys','sbell'].includes(e.type));STRIKES.length=0;G.sky.boss=st;
  if(!dragonEnt())addDragon();
  SKB={st,t:0,intro:90,timer:0,need:1500,left:0,bells:0,swoop:null,next:200};
  if(st===2){for(const [id,o,c,r] of SKY_CRYS){const p=skp(o,c,r);addEnt({type:'scrys',id,x:p.x,y:p.y,solid:true,w:14,hp:1});}SKB.left=SKY_CRYS.length;}
  if(st===3){for(const [id,o,c,r] of SKY_BELLS){const p=skp(o,c,r);addEnt({type:'sbell',id,x:p.x,y:p.y,solid:true,w:12,rung:false,sw:0});}}
  toast(SKY_STAGE_TXT[st],'#ffe05a');save();
}
function updateSkyBoss(){
  const B=SKB,d=dragonEnt();if(!B||!d)return;
  if(d.flash>0)d.flash--;
  if(B.intro>0){B.intro--;d.y=d.hy+Math.sin(tick/9)*3;return;}
  B.t++;
  if(!B.swoop){d.t++;d.x=d.hx+Math.sin(d.t/70)*70;d.y=d.hy+Math.sin(d.t/23)*5;d.flip=Math.cos(d.t/70)>0;}
  const rate=B.st===1?44:B.st===2?80:110;
  if(B.t%rate===0)spawnStrike(P.x+(Math.random()-.5)*(B.st===1?28:70),P.y+(Math.random()-.5)*(B.st===1?24:60),B.st===1?58:62);
  if(B.st===1&&B.t%rate===Math.floor(rate/2))spawnStrike(SKO.lair[0]*16+24+Math.random()*208,SKO.lair[1]*16+40+Math.random()*130,70);
  if(B.st===1){B.timer++;if(B.timer>=B.need){skyStageClear();return;}}
  if(B.st===3){
    const o=SKO.lair;
    if(!B.swoop){if(--B.next<=0){const y=clamp(P.y-6,o[1]*16+52,o[1]*16+150);B.swoop={ph:0,t:0,y,dir:Math.random()<0.5?1:-1};B.next=190+Math.random()*70;SFX.honk();}}
    else{const s=B.swoop;s.t++;
      if(s.ph===0){d.x+=((s.dir>0?o[0]*16+22:o[0]*16+234)-d.x)*0.1;d.y+=(s.y-d.y)*0.1;d.flip=s.dir>0;if(s.t>=58){s.ph=1;s.t=0;SFX.gust();}}
      else{d.x+=s.dir*5.6;d.y=s.y;d.flip=s.dir>0;
        if(Math.abs(P.x-d.x)<28&&Math.abs(P.y-6-s.y)<13&&P.inv<=0&&!P.hop)hurt(d);
        if(s.t>=46){B.swoop=null;d.t=0;d.hx=o[0]*16+128;d.y=d.hy;d.x=d.hx;}}}}
}
function hitCrystal(e){
  if(!has('thunder')){SFX.clunk();float(e.x,e.y-20,'*zzzt* Need THUNDER PECK!','#c898f8');return;}
  e.dead=true;SFX.brk();shake=6;puff(e.x,e.y-8,18,['#c898f8','#8a4ad8','#ffe84a','#ffffff'],2,0.05);
  const B=SKB;if(!B||B.st!==2)return;B.left--;float(e.x,e.y-22,B.left?B.left+' left!':'ALL GONE!','#ffe05a');
  const d=dragonEnt();if(d)d.flash=16;
  if(B.left<=0)skyStageClear();
}
function ringBell(e){
  if(e.rung)return;const B=SKB;
  e.rung=true;e.sw=40;SFX.magic();SFX.chime&&SFX.chime();puff(e.x,e.y-10,10,['#ffe05a','#fff8ec'],1.2,-0.02);
  if(!B||B.st!==3){float(e.x,e.y-22,'Dong!','#ffe05a');return;}
  B.bells++;float(e.x,e.y-22,B.bells+'/3','#ffe05a');const d=dragonEnt();if(d)d.flash=12;
  if(B.bells>=3)skyBossWin();
}
function skyStageClear(){
  const B=SKB,next=B.st+1;SFX.questDone();toast('Stage cleared!','#a1d970');STRIKES.length=0;
  for(const e of ents)if(e.type==='scrys'||e.type==='sbell')e.dead=true;
  SKB=null;G.sky.boss=next;save();
  const d=dragonEnt();
  say([{who:d||'me',text:next===2?"GRRR! Why won't you leave?! ...My storm crystals keep it raining. Please... don't break them.":"*sniff* ...The crystals are gone. Now the bells... don't touch the bells!"},
    {who:'me',text:next===2?"Those crystals feed the storm! "+(G.sky.name||'My chick')+" says: smash them with THUNDER PECK!":"The three sky bells! Their song might calm him. Ring them all!"}],()=>startSkyStage(next));
}
function skyBossRetry(){
  toast('A kind breeze catches you! Try this stage again!','#ffe05a');
  const o=skp('lair',8,9);P.x=o.x;P.y=o.y;P.inv=60;P.kt=0;G.hearts=maxHearts();STRIKES.length=0;
  startSkyStage(Math.max(1,Math.min(3,G.sky.boss||1)));
}
function skyBossWin(){
  SKB=null;G.sky.boss=4;G.flags.sky=1;STRIKES.length=0;ents=ents.filter(e=>!['sdragon','scrys','sbell'].includes(e.type));
  const p=skp('lair',8,4);const s=addEnt({type:'npc',id:'stormy',name:'STORMY',spr:'dragon',x:p.x,y:p.y,w:44,voice:120,solid:true,phase:0,flip:false});
  SFX.fanfare();shake=8;toast('The sky is calm!','#b2e7e0');save();
  const nm=G.sky.name||'My chick';
  say([{who:s,text:"*sniff*... The bells. They sound like... voices. Far away, kind voices."},
    {who:s,text:"I'm sorry. I get so lonely up here, and then the storms come out all on their own."},
    {who:'me',text:"You don't have to be lonely! Come and visit Cloud City. "+nm+" and I will show you around!"},
    {who:s,text:"Really? ...Friends. I would like that very much. My name is Stormy. Here, take my old cap, to keep the rain off."}],
    ()=>{reward(QUESTS.sk_boss.reward,'sk_boss');if(grantOutfit('stormcap'))toast('Stormy gave you the STORM CAP!','#ff9cd0');
      for(let i=0;i<30;i++)parts.push({x:P.x+(Math.random()-.5)*60,y:P.y-30+Math.random()*30,vx:(Math.random()-.5)*1.5,vy:-0.6-Math.random(),g:0.02,life:50,c:['#ffe05a','#fff8ec','#b2e7e0','#ff6fae'][(Math.random()*4)|0]});
      save();startFlyover();});
}
function drawSkyBossHUD(){
  const B=SKB;if(!B)return;txt('STORM DRAGON',252,7,5,'#c898f8',{align:'right'});
  if(B.st===1){ctx.fillStyle='#202840';ctx.fillRect(168,16,84,8);ctx.fillStyle='#425b72';ctx.fillRect(169,17,82,6);ctx.fillStyle='#ffe84a';ctx.fillRect(169,17,Math.round(82*Math.min(1,B.timer/B.need)),6);}
  else for(let i=0;i<(B.st===2?4:3);i++){const on=B.st===2?i<B.left:i<B.bells;ctx.fillStyle=B.st===2?(on?'#c898f8':'#425b72'):(on?'#425b72':'#ffe05a');ctx.fillRect(252-((B.st===2?4:3)-i)*12,16,10,8);}
}
/* ---- the flyover ---- */
let FLYO=null;
const FLYO_SCENES=[['THE STORM PEAKS','peaks',['dragon']],['CLOUD CITY','skycity',['plumeKeeper','starla','nimbus']],['THE FLOATING GARDENS','gardens',['fernbird']],['THE CLOUD MEADOWS','meadows',['cloudsheep','zephyr']],
  ['THE SNOWY PEAK','mountains',['eagle','marmot']],['THE FOREST','forest',['tortoise','beaver','deer']],['THE CITY','city',['pigeon','chef','magpie']],['THE PIRATE SEAS','sea',['parrot','crab']],
  ['THE VILLAGE','village',['beaver','goat','dog']],['HOME: THE FARM','farm',['hen','cow','pig','horse']]];
function startFlyover(){FLYO={t:0};state='flyover';fade=0;SFX.fanfare();}
function updateFlyover(){
  const f=FLYO;f.t++;if(f.t%14===0)SFX.flap();if(pressed.a&&f.t>30)f.t+=9;
  if(f.t>=FLYO_SCENES.length*140){FLYO=null;startLegendGathering();}
}
function drawFlyover(){
  const f=FLYO,dur=140,i=Math.min(FLYO_SCENES.length-1,Math.floor(f.t/dur)),lt=f.t-i*dur,[name,kind,friends]=FLYO_SCENES[i],off=f.t*2.4,g=150;
  const SK={peaks:['#2a3050','#8a98c8'],skycity:['#6ab0ff','#e6f2ff'],gardens:['#78baff','#f0f8ff'],meadows:['#7cc0fa','#ffffff'],mountains:['#8ac4f0','#e8f4ff'],forest:['#8ac8f4','#d8f0ff'],city:['#9ad0ff','#fff0d8'],sea:['#ffb080','#fff0d8'],village:['#ffa868','#ffe8c0'],farm:['#ff9a60','#ffe0b0']}[kind];
  for(let b=0;b<12;b++){ctx.fillStyle=lerpColor(SK[0],SK[1],b/11);ctx.fillRect(0,b*(g/12),W,Math.ceil(g/12)+1);}
  if(kind==='farm'||kind==='village'||kind==='sea'){ctx.fillStyle='#fff3a0';ctx.beginPath();ctx.arc(200,60,16,0,7);ctx.fill();}
  for(let k=0;k<4;k++){const x=((k*98-off*0.35)%(W+90)+W+90)%(W+90)-45;cloud(Math.round(x),20+k*22,1+(k%2));}
  const GR={peaks:'#6a78a8',skycity:'#ffffff',gardens:'#cfe8b0',meadows:'#e6f2ff',mountains:'#f0f4fa',forest:'#3f9a46',city:'#9a8a7a',sea:'#2a5fb0',village:'#8aa84a',farm:'#4ea84a'}[kind];
  ctx.fillStyle=GR;ctx.fillRect(0,g,W,H-g);
  for(let x=-16;x<W+16;x+=16){const px=Math.round(x-(off%16));
    const cx=Math.floor((x+off)/16);
    ctx.fillStyle='rgba(20,10,30,0.12)';ctx.fillRect(px,g+((cx*7)%3)*8+4,10,2);}
  const prop=(x,k)=>{const h=hash2(k,7)%3;
    if(kind==='peaks'){ctx.fillStyle='#4a5a8a';ctx.beginPath();ctx.moveTo(x-16,g);ctx.lineTo(x,g-34-h*8);ctx.lineTo(x+16,g);ctx.fill();ctx.fillStyle='#ffe84a';if((tick+k*11)%90<6)ctx.fillRect(x,g-30-h*8,2,12);}
    else if(kind==='skycity'||kind==='city'){ctx.fillStyle=kind==='city'?'#b69965':'#e8b070';ctx.fillRect(x-9,g-20-h*6,18,20+h*6);ctx.fillStyle='#eb6654';ctx.fillRect(x-11,g-24-h*6,22,5);ctx.fillStyle='#ffe05a';ctx.fillRect(x-4,g-14-h*6,3,4);ctx.fillRect(x+2,g-14-h*6,3,4);}
    else if(kind==='gardens'||kind==='meadows'){ctx.fillStyle=kind==='gardens'?'#ff6fae':'#c8dcf0';ctx.fillRect(x-3,g-6-h*2,6,6+h*2);ctx.fillStyle='#ffe05a';ctx.fillRect(x-1,g-9-h*2,2,3);}
    else if(kind==='mountains'){ctx.fillStyle='#8a98b8';ctx.beginPath();ctx.moveTo(x-18,g);ctx.lineTo(x,g-38-h*6);ctx.lineTo(x+18,g);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(x-6,g-26-h*6);ctx.lineTo(x,g-38-h*6);ctx.lineTo(x+6,g-26-h*6);ctx.fill();}
    else if(kind==='forest'){ctx.fillStyle='#594437';ctx.fillRect(x-1,g-8,3,8);ctx.fillStyle='#2d664e';ctx.beginPath();ctx.arc(x,g-14-h*2,9,0,7);ctx.fill();}
    else if(kind==='sea'){ctx.fillStyle='#3a70c8';ctx.fillRect(x-8,g+8,16,2);if(k%5===0){ctx.drawImage(TILE.ship,x-8,g-8,16,16);}}
    else if(kind==='village'){if(k%4===0){ctx.fillStyle='#e8d8b0';ctx.fillRect(x-7,g-22,14,22);ctx.fillStyle='#202840';const a=tick/30;ctx.lineWidth=2;ctx.strokeStyle='#202840';for(let q=0;q<4;q++){ctx.beginPath();ctx.moveTo(x,g-18);ctx.lineTo(x+Math.cos(a+q*1.57)*12,g-18+Math.sin(a+q*1.57)*12);ctx.stroke();}}else{ctx.fillStyle='#e8c050';ctx.fillRect(x-5,g-6,10,6);}}
    else{ctx.fillStyle=k%4===0?'#c0392b':'#e8d8b0';ctx.fillRect(x-8,g-14,16,14);ctx.fillStyle='#8a4a1c';ctx.fillRect(x-10,g-18,20,5);}};
  for(let k=0;k<7;k++){const x=((k*54-off*0.9)%(W+60)+W+60)%(W+60)-30;prop(Math.round(x),k+i*13);}
  friends.forEach((fk,j)=>{const s=SPR[fk];if(!s)return;const x=Math.round(((j*86+40-off*1.0)%(W+80)+W+80)%(W+80)-40),y=g+8+(j%2)*10+Math.round(Math.abs(Math.sin((tick+j*9)/8))*-3);
    drawImg(j%2?flipOf(s):s,x-(s.width>>1),y-s.height);});
  const by=84+Math.round(Math.sin(tick/10)*5);
  const h=SPR.eaglet;ctx.drawImage(flipOf(h),66,by+16+Math.round(Math.sin(tick/7)*2),h.width*2,h.height*2);
  drawPip(stageOfRank(G.rank),3,Math.floor(tick/5)%2,true,112,by+34,2);
  const a=Math.min(1,lt/20,(dur-lt)/20);ctx.globalAlpha=Math.max(0,a);box(40,H-34,176,24,'#192639','#ffe05a');txt(name,W/2,H-30,7,'#ffe05a',{align:'center'});
  txt(i===FLYO_SCENES.length-1?'...and everyone is waiting!':'A friend waves hello!',W/2,H-20,5,'#fff8ec',{align:'center'});ctx.globalAlpha=1;
  if(f.t<24){ctx.fillStyle='rgba(255,255,255,'+(1-f.t/24)+')';ctx.fillRect(0,0,W,H);}
  txt('Z: speed up',W-8,6,5,'#202840',{align:'right',alpha:0.7});
}
function lerpColor(a,b,t){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';}
/* ---- the gathering, rank 10, and the credits ---- */
const LEGEND_MK=()=>{const nm=G.sky.name||'The chick';return [
  ['mom','MAMA HEN',"Pip! My little peep! You flew all the way above the clouds and back home again!"],
  ['penny','PENNY',"A village, a ship and a whole sky saved... and you're STILL my favorite peep."],
  ['elda','ELDA',"Screee! Look at "+nm+", flapping like a champion. Thank you, Pip."],
  ['pinch','CAPN PINCH',"Arr! The sea AND the sky! Captain Pip, ye be a legend!"],
  ['barnaby','FOREMAN BARNABY',"Every building in the village has a story with your name in it, Pip!"],
  ['granny','GRANNY SHELL',"I always said you'd fly higher than all of us, dearie."],
  ['zephyr','ZEPHYR',"Whoosh! Cloud Kingdom express delivery! We flew down just to cheer for you!"],
  ['nimbus','NIMBUS',"Hmph. Even the weather's behaving today. Congratulations."],
  ['stormy','STORMY',"*rumble* Hello, everyone. I made a tiny rain cloud for the party. It only rains confetti."],
  ['rooster','SIR CLUCKINGTON',"COCK-A-DOODLE-LEGEND! Never have I seen such pluck!"],
  ['hatch',nm.toUpperCase(),"*PEEP PEEP PEEP!* (Your chick shouts it as loud as a tiny chick can!)"],
  ['mom','MAMA HEN',"Now, who's hungry? There's dinner on the table, Legend of Chicklandia!"]];};
const LEGEND_GUESTS=[...new Set([...CHARACTERS.filter(c=>!c.deco&&!/^nb\d|^sheep/.test(c.id)).map(c=>c.spr),'hen','penny','peep','cheep','tweet','eaglet','dragon','sheep'])];
Object.assign(FEST_SCRIPTS,{legend:{lines:[['mom','MAMA HEN','...']],guests:LEGEND_GUESTS,scene:'legend',mk:LEGEND_MK,
  end:()=>{G.flags.legend=1;save();finaleRank(10,startLegendCredits);}}});
function startLegendGathering(){
  P.x=56;P.y=76;CS={x:0,y:0};camX=0;camY=0;TRAIL=[];const h=ents.find(e=>e.id==='hatch');if(h){h.x=P.x-10;h.y=P.y;}
  startFestival('legend');
}
function finaleRank(n,after){
  if(G.rank>=n){after();return;}
  if(G.gp<RANKS[n-1].gp)G.gp=RANKS[n-1].gp;      // the story itself tops up whatever growth is missing
  startRankUp(n,after);
}
function legendCreditList(){
  const nm=(G.sky.name||'THE CHICK').toUpperCase();
  const names=[...new Set(CHARACTERS.filter(c=>!c.deco&&!/^nb\d|^sheep/.test(c.id)&&c.id!=='sheep').map(c=>c.name))].filter(n=>n!=='BABY BIRD');
  const out=[['#THE LEGEND OF','#CHICKLANDIA'],'',['PIP THE CHICK'],['AND '+nm],'',['MAMA HEN','PENNY','PEEP, CHEEP & TWEET'],''];
  for(let i=0;i<names.length;i+=4)out.push(names.slice(i,i+4),'');
  out.push(['STORMY','THE DRAGON WHO FOUND FRIENDS'],'',['AND EVERY FRIEND','YOU MADE ALONG THE WAY'],'','',['#THANK YOU FOR PLAYING!'],'',
    ['The sky is saved. The seas are safe.','The village is happy. The coop is golden.'],'',['But the story is not over.','Free play is open: the whole world is yours!'],'',['#THE END'],['(and the adventure goes on)']);
  return out;
}
function startLegendCredits(){CRED={t:0,list:legendCreditList(),end:()=>{
  P.x=56;P.y=76;CS={x:0,y:0};camX=0;camY=0;TRAIL=[];state='play';fade=0;
  const h=ents.find(e=>e.id==='hatch');if(h){h.x=P.x-10;h.y=P.y;}save();
  say([{who:'me',text:"The Legend of Chicklandia! ...Funny. It still feels like the same little farm. Maybe there are more secrets up in the clouds."}]);}};state='credits';fade=0;}
/* ---- drawing of every sky thing ---- */
function drawSkyEnt(e,sx,sy){
  switch(e.type){
    case 'spad':{const sq=e.sq>0?3:0;ctx.fillStyle='rgba(20,10,30,0.18)';ctx.fillRect(sx-8,sy-1,16,3);
      ctx.fillStyle='#c8dcf0';ctx.fillRect(sx-9,sy-5+sq,18,6-sq);ctx.fillStyle='#ffffff';ctx.fillRect(sx-8,sy-7+sq,16,5);ctx.fillRect(sx-5,sy-9+sq,10,3);
      ctx.fillStyle='#ff6fae';ctx.fillRect(sx-1,sy-6+sq,2,2);if(tick%60<10){ctx.fillStyle='#ffe05a';ctx.fillRect(sx-1,sy-12+sq,2,2);}break;}
    case 'svent':{ctx.fillStyle='rgba(20,10,30,0.15)';ctx.fillRect(sx-7,sy-1,14,3);ctx.fillStyle='#a6d8ff';ctx.fillRect(sx-7,sy-3,14,3);
      for(let k=0;k<3;k++){const t=(tick*1.4+k*18)%54,x=sx-5+k*5+Math.round(Math.sin((t+k)/6)*2);ctx.fillStyle='rgba(255,255,255,'+(1-t/54)+')';ctx.fillRect(x,Math.round(sy-4-t*0.5),2,5);}
      if(!has('updraft')){ctx.fillStyle='#ff9cd0';ctx.fillRect(sx-1,sy-12,2,5);ctx.fillRect(sx-1,sy-5,2,2);}break;}
    case 'sport':{const down=e.down,col=e.lair?'#c898f8':'#ffffff';
      ctx.fillStyle='rgba(20,10,30,0.18)';ctx.fillRect(sx-9,sy-1,18,3);
      for(let k=0;k<3;k++){const w=18-k*4;ctx.fillStyle=k%2?'#e6f2ff':col;ctx.fillRect(sx-w/2,sy-3-k*4,w,4);}
      ctx.fillStyle=(Math.floor(tick/12)%2)?'#ffe05a':'#fff8ec';ctx.fillRect(sx-1,sy-16+Math.round(Math.sin(tick/9)*2),2,2);
      if(Math.hypot(P.x-e.x,P.y-e.y)<46)txt(e.label,sx,sy-26,5,'#fff8ec',{align:'center',shadow:true});break;}
    case 'sgate':{if(!G.flags.skyMap)break;const on=!!G.sky.hatched;ctx.globalAlpha=on?1:0.45;
      for(let k=0;k<4;k++){const w=20-k*3,y=sy-2-k*6;ctx.fillStyle='rgba(20,10,30,0.2)';if(k===0)ctx.fillRect(sx-10,sy-1,20,3);ctx.fillStyle=k%2?'#e6f2ff':'#ffffff';ctx.fillRect(sx-w/2+k*2,y-4,w,5);}
      for(let k=0;k<5;k++){const t=(tick*0.8+k*14)%60;ctx.fillStyle='rgba(255,248,236,'+(1-t/60)+')';ctx.fillRect(sx-8+k*4,Math.round(sy-t*0.9),2,2);}
      ctx.globalAlpha=1;break;}
    case 'gchime':{const sw=e.ring>0?(e.ring--,Math.round(Math.sin(e.ring)*2)):0,L={small:6,mid:9,big:13}[e.id];
      ctx.fillStyle='rgba(20,10,30,0.2)';ctx.fillRect(sx-7,sy-1,14,3);ctx.fillStyle='#8a4a1c';ctx.fillRect(sx-6,sy-18,12,2);ctx.fillRect(sx-5,sy-18,2,18);ctx.fillRect(sx+3,sy-18,2,18);
      ctx.fillStyle=e.ring>0?'#fff8ec':'#ffe05a';ctx.fillRect(sx-2+sw,sy-16,4,L);ctx.fillStyle='#b69965';ctx.fillRect(sx-1+sw,sy-16,1,L);break;}
    case 'skychest':{const s=SPR.chest;shadow(sx,sy+1,14);drawImg(s,sx-(s.width>>1),sy+1-s.height);if(tick%60<5){ctx.fillStyle='#fff';ctx.fillRect(sx+4,sy-s.height,1,1);}break;}
    case 'snest':{ctx.fillStyle='#8a5a2c';ctx.fillRect(sx-7,sy-4,14,4);ctx.fillRect(sx-5,sy-6,10,3);ctx.fillStyle='#b69965';ctx.fillRect(sx-6,sy-4,12,1);if(!G.sky.nest&&tick%40<8){ctx.fillStyle='#ffe05a';ctx.fillRect(sx-1,sy-10,2,2);}break;}
    case 'sbell':{const sw=e.sw>0?(e.sw--,Math.round(Math.sin(e.sw/2)*3)):0;ctx.fillStyle='#8a4a1c';ctx.fillRect(sx-8,sy-26,16,2);ctx.fillRect(sx-1,sy-26,2,6);
      const s=SPR.sbell;ctx.save();ctx.translate(sx,sy-20);ctx.rotate(sw*0.06);ctx.drawImage(s,-(s.width>>1),0);ctx.restore();
      if(!e.rung&&tick%50<6){ctx.fillStyle='#fff';ctx.fillRect(sx+4,sy-18,1,1);}break;}
    case 'scrys':{shadow(sx,sy+1,14);ctx.drawImage(TILE.stormCrystal,sx-8,sy-14);if(tick%24<4){ctx.fillStyle='#ffe84a';ctx.fillRect(sx+2,sy-12,2,5);}break;}
    case 'sdragon':{if(e.flash>0&&Math.floor(e.flash/2)%2)break;const s=e.flip?flipOf(SPR.dragon):SPR.dragon;
      shadow(sx,sy+30,44);ctx.drawImage(s,Math.round(sx-s.width/2),Math.round(sy-s.height/2));
      if(SKB&&SKB.swoop&&SKB.swoop.ph===0){ctx.fillStyle='rgba(255,60,60,'+(0.25+0.15*Math.sin(tick/3))+')';ctx.fillRect(0,Math.round(SKB.swoop.y-camY+HUD-14),W,26);}break;}
  }
}
function drawSkyFX(cx,cy){
  for(const s of STRIKES){const x=Math.round(s.x-cx),y=Math.round(s.y-cy+HUD);
    if(s.x<cx-20||s.x>cx+276)continue;
    if(s.t<s.warn){const p=s.t/s.warn;ctx.fillStyle='rgba(255,232,74,'+(0.15+0.25*p)+')';ctx.beginPath();ctx.ellipse(x,y-4,16*p+2,7*p+1,0,0,7);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y-4,16,7,0,0,7);ctx.stroke();}
    else{const k=1-(s.t-s.warn)/14;ctx.fillStyle='rgba(255,255,255,'+k+')';ctx.fillRect(x-3,HUD,6,y-HUD);ctx.fillStyle='rgba(255,232,74,'+k+')';ctx.fillRect(x-1,HUD,2,y-HUD);
      ctx.beginPath();ctx.ellipse(x,y-4,14*k,6*k,0,0,7);ctx.fill();}}
  if(skyArea()==='peaks'||skyArea()==='lair'){ctx.fillStyle='rgba(30,38,70,0.13)';ctx.fillRect(0,HUD,W,VH);}
}
