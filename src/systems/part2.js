'use strict';
/* =====================================================================
   PART 2: BEYOND THE FARM
   ===================================================================== */
function allP2Done(){return ORDER2.every(id=>G.q[id]===2);}
function hint2(){
  if(!G.coop)return "There's a COOP SITE sign in the forest. You can build your very own home there!";
  for(const id of ORDER2){if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[id]+" the good news!";}
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===2&&G.train[k]===1)return t.hint();}
  for(const id of ORDER2){if(G.q[id]===0)return INTRO2[id];}
  for(const id of ORDER2){if(G.q[id]===1)return QUESTS[id].hint();}
  if(G.coop&&G.coop.lv<4)return "Upgrade your coop! Read the sign next to it.";
  return "Your Dream Coop is finished! What a journey, little one.";
}
function areaOf(cs=CS){const r=regionAt(cs);return r?r.area:null;}
const AREA_LABEL={farm:'FARM',forest:'FOREST',mountains:'MOUNTAINS',city:'CITY',beach:'BEACH',coop:'MY COOP'};
function noteArea(){const a=areaOf();if(a&&a!=='coop'&&!G.areas.includes(a)){G.areas.push(a);if(G.part2)toast('Discovered the '+AREA_LABEL[a]+'!','#94dc64');}}

/* ---- skill trainers: some skills need a special lesson before you can buy them ---- */
function trainCount(k){return G.items[TRAIN[k].item]||0;}
function trainMsg(k){const t=TRAIN[k],st=G.train[k]||0;
  if(st===1)return t.whoName+"'s training: "+Math.min(t.need,trainCount(k))+'/'+t.need+' '+t.noun+(trainCount(k)>=t.need?' - go tell them!':'');
  return t.avail()?'Talk to '+t.whoName+' to start training!':t.lock;}
function spawnTrain(k){
  const t=TRAIN[k];
  if(t.spawn)t.spawn.forEach(([id,c,r])=>spawnItem(id,t.item,c*16+8,r*16+12));
  if(t.stumps)t.stumps.forEach(([id,c,r])=>{if(!G.collected.has(id)&&!ents.some(e=>e.id===id))addEnt({type:'stump',id,x:c*16+8,y:r*16+12,solid:true,w:14});});
  if(t.puffs){const have=ents.filter(e=>e.type==='puff').length;
    for(let i=have;i<t.need-trainCount(k);i++)addEnt({type:'puff',x:290+Math.random()*190,y:220+Math.random()*140,vx:(Math.random()<0.5?-1:1)*(0.35+Math.random()*0.3),p:Math.random()*6});}
}
function trainTalk(e,it){
  for(const k in TRAIN){const t=TRAIN[k];if(t.who!==e.id)continue;
    const st=G.train[k]||0;if(st===2||has(k)||!t.avail())return false;
    if(st===0){t.intro.forEach((l,i)=>it(l,i===t.intro.length-1?()=>{G.train[k]=1;spawnTrain(k);toast(t.title+' started!','#ff9cd0');SFX.magic();save();}:null));return true;}
    if(trainCount(k)>=t.need){t.done.forEach((l,i)=>it(l,i===t.done.length-1?()=>{G.train[k]=2;G.items[t.item]=0;SFX.lvl();
      toast('You can now learn '+t.skill+'! Press E','#ff9cd0');save();}:null));return true;}
    it(t.remind());return true;}
  return false;
}
function updPuff(e){
  e.p+=0.03;e.x+=e.vx+Math.sin(e.p)*0.3;e.y+=Math.cos(e.p*0.7)*0.3;
  if(e.x<280||e.x>488){e.vx*=-1;e.x=clamp(e.x,280,488);}e.y=clamp(e.y,212,372);
  if(Math.abs(e.x-P.x)<11&&Math.abs(e.y-P.y)<13){e.dead=true;G.items.puff++;SFX.chirp();puff(e.x,e.y-8,8,['#fff8ec','#e8f0f8']);
    float(e.x,e.y-16,'PUFF '+Math.min(5,G.items.puff)+'/5','#fff8ec');if(G.items.puff>=5)toast('Got 5 puffs! Tell Sir Cluckington.','#ff9cd0');save();}
}

/* ---- talking (part 2 extras) ---- */
function talkP2(e,it){
  if(G.mail&&G.mail[e.id]===1){
    it(e.id==='granny'?"A letter? For me? Oh my, it's from my old friend Pidge!":e.id==='rocco'?"A letter? Is it a reward? ...Oh. It's my library fine. Thanks, I guess.":"Mail? For moi? *purr* It's from my secret admirer!",
      ()=>{G.mail[e.id]=2;const n=['rocco','cleo','granny'].filter(k=>G.mail[k]===2).length;toast('Letter delivered! ('+n+'/3)');SFX.pick();save();});
    return true;}
  if(e.id==='rocco'){it(["Psst. Wanna buy a slightly used banana peel? No? Suit yourself.","I'm not stealing, I'm BORROWING. Forever.","Nice wings, kid. Very shiny."][(Math.random()*3)|0]);return true;}
  if(e.id==='cleo'){it(["Welcome to the city, country chick. Try the fish tacos.","Remy's soup is the best in town. Don't tell him I said so.","I nap in a different sunbeam every hour. It's a lot of work."][(Math.random()*3)|0]);return true;}
  if(e.deco2){it(G.flags.mo?"Eek! Thank you, thank you!":"Eek! We're stuck! Help!");return true;}
  return false;
}
/* ---- coop sites ---- */
function siteFor(c,r){for(const k in SITES){const s=SITES[k];if(s.sign[0]===c&&s.sign[1]===r)return k;}return null;}
function p2Done(){return ORDER2.filter(id=>G.q[id]===2).length;}
function siteSign(id,c,r){
  const who={x:c*16+8,y:r*16,name:'COOP SITE'},L=[];
  if(G.coop){const lv=G.coop.lv;
    if(lv>=4)L.push({who,text:"PIP'S DREAM COOP - Level 4. Fully upgraded! Plant seeds in all 8 garden plots!"});
    else{const u=UPGRADES[lv+1],d=p2Done();
      if(d<u.need)L.push({who,text:"PIP'S COOP - Level "+lv+". The next upgrade unlocks after you help "+u.need+" animals out here. ("+d+"/"+u.need+" so far!)"});
      else L.push({who,text:"PIP'S COOP - Level "+lv+". UPGRADE: "+u.text+" ("+upCost(u)+" seeds)",choices:['Upgrade!','Later'],cb:i=>{if(i===0)upgradeCoop();}});}}
  else L.push({who,text:"COOP SITE. Build your very own coop right here? Bucky the beaver will build it for FREE!",choices:['Build!','Not yet'],cb:i=>{if(i===0)buildCoop(id);}});
  say(L);
}
function buildCoop(id){
  G.coop={site:id,lv:1};applyCoop(true);shake=10;SFX.questDone();
  const S=SITES[id];for(let i=0;i<30;i++)puff((S.c+1.5)*16,(S.r+1)*16,1,['#ffd83a','#fff8ec','#ff6fae','#94dc64'],2.2,0.06);
  toast('Your coop is built!');save();
  say([{who:'me',text:"My very own coop! I can sleep in the nests, grow seeds in the garden, and fly here from the map!"},
    {who:'me',text:G.thumb?"The more animals I help out here, the bigger my coop can grow!":"Granny Shell knows all about gardening. I should go say hi! And the more animals I help, the bigger my coop can grow!"}]);
}
function upgradeCoop(){
  const u=UPGRADES[G.coop.lv+1];
  const cost=upCost(u);
  if(G.seeds<cost){SFX.deny();say([{who:'me',text:"I need "+(cost-G.seeds)+" more seeds for that upgrade. Better get gardening!"}]);return;}
  G.seeds-=cost;G.coop.lv++;applyCoop(false);shake=8;SFX.lvl();
  const S=SITES[G.coop.site];for(let i=0;i<40;i++)puff((S.c+1.5)*16,(S.r+1)*16,1,['#ffd83a','#fff8ec','#ff6fae','#a6e0ff'],2.4,0.05);
  const lv=G.coop.lv;toast('COOP LEVEL '+lv+'!');save();
  const msg=lv===2?"Mama Hen moved into my coop! She's inside right now!":lv===3?"Penny and the triplets moved in! The whole family is together again!":"A GOLDEN ROOF! It's my DREAM COOP! Everyone's inside for a party!";
  say([{who:'me',text:msg}]);
}
/* ---- garden plots ---- */
const GROW=5400;
function plotRate(e){let r=wearing('straw')?1.5:1;if(e.coop&&G.coop){if(G.coop.lv>=4)r=2;else if(G.coop.lv>=3)r=1.5;}if(rainAmt()>0.5)r*=2;return r;}
function updatePlots(){for(const e of ents)if(e.type==='plot'){const s=G.plots[e.id];if(s&&s.p<1)s.p=Math.min(1,s.p+plotRate(e)/GROW);}}
function usePlot(e){
  if(!G.thumb){say([{who:'me',text:"This soil looks so soft... Maybe Granny Shell knows how to grow things?"}]);return;}
  const s=G.plots[e.id];
  if(!s){if(G.seeds<1){SFX.deny();float(e.x,e.y-16,'Need a seed!','#ff8080');return;}
    G.seeds--;G.plots[e.id]={p:0};SFX.pop();puff(e.x,e.y-4,6,['#9a6234','#94dc64'],0.8,0.05);float(e.x,e.y-16,'Planted!','#94dc64');save();return;}
  if(s.p<1){float(e.x,e.y-16,'Growing... '+Math.floor(s.p*100)+'%','#94dc64');SFX.menu();return;}
  delete G.plots[e.id];addSeeds(3,2,0);G.harvests++;SFX.seed();puff(e.x,e.y-10,10,['#ffd83a','#fff8ec'],1.2,0.05);float(e.x,e.y-18,'+3 SEEDS!','#ffd83a');save();
}
/* ---- followers (fawn & baby turtles) ---- */
function followerCount(){return ents.filter(d=>(d.type==='duckling'||d.type==='follower')&&d.mode==='follow').length;}
function reindexFollowers(){let i=0;for(const d of ents)if((d.type==='duckling'||d.type==='follower')&&d.mode==='follow')d.fi=i++;}
function updFollower(e){
  if(e.mode==='swim'){e.y+=0.5;e.alpha=(e.alpha==null?1:e.alpha)-0.01;if(e.alpha<=0)e.dead=true;return;}
  if(e.mode==='follow'){
    const p=TRAIL[Math.max(0,TRAIL.length-1-(e.fi+1)*12)];
    if(p){if(Math.abs(p.x-e.x)>0.3)e.flip=p.x>e.x;e.x+=(p.x-e.x)*0.5;e.y+=(p.y-e.y)*0.5;}
    if(e.kind==='turtle'&&Math.floor(e.y/16)>=80&&e.x<512){
      e.mode='swim';G.turtles.push(e.id);SFX.splash();float(e.x,e.y-12,'Bye bye! '+G.turtles.length+'/3','#a6e0ff');reindexFollowers();
      if(G.turtles.length>=3&&G.q.sandy===1)toast('All turtles safe! Tell Sandy.');save();}
    if(e.kind==='fawn'){const d=ents.find(n=>n.id==='doe');
      if(d&&Math.abs(d.x-e.x)<48&&Math.abs(d.y-e.y)<36){e.mode='home';G.flags.fawn=true;e.x=d.x+16;e.y=d.y+2;SFX.chirp();float(d.x,d.y-24,'Clover!','#ffd83a');reindexFollowers();save();}}
  }else if(e.mode==='wait'&&onCur(e)&&Math.abs(P.x-e.x)<13&&Math.abs(P.y-e.y)<13){
    e.fi=followerCount();e.mode='follow';SFX.chirp();float(e.x,e.y-14,e.kind==='fawn'?'Mama?':'Peep!','#ffd83a');}
}
function freeMo(){
  G.flags.mo=true;SFX.questDone();toast('The baby marmots are free!');
  ents.filter(e=>e.deco2).forEach((e,i)=>{puff(e.x,e.y-4,6,['#9a6234','#fff8ec']);Object.assign(e,at(11+i,53));});save();
}
/* ---- fly map ---- */
const DEST={farm:{x:584,y:283,mx:40,my:110,icon:'door'},forest:{x:136,y:1067,mx:128,my:110,icon:'oak'},mountains:{x:136,y:923,mx:128,my:62,icon:'pine'},
  city:{x:600,y:1051,mx:214,my:110,icon:'brickWin'},beach:{x:136,y:1179,mx:128,my:158,icon:'palm'},coop:{mx:0,my:0,icon:'cdoor'}};
let mapSel='forest',FLY=null;
function destOf(k){if(k==='coop'){const S=SITES[G.coop.site],a=DEST[G.coop.site];return Object.assign({},coopExit(),{mx:a.mx+26,my:a.my+18,icon:'cdoor'});}return DEST[k];}
function mapNodes(){const ks=['farm','forest','mountains','city','beach'].filter(k=>G.areas.includes(k)||k==='farm'||k==='forest');if(G.coop)ks.push('coop');return ks;}
function openMap(){
  if(!G.part2)return;
  const k=CS.x+','+CS.y;if(!WALK.has(k)){toast('Go outside to fly!','#a6e0ff');return;}
  state='map';mapSel=areaOf()||'farm';SFX.menu();
}
function updateMap(){
  if(pressed.back||pressed.fly||pressed.quest||pressed.grow){state='play';SFX.menu();return;}
  const nodes=mapNodes(),cur=destOf(mapSel);
  for(const [k,dx,dy] of [['up',0,-1],['down',0,1],['left',-1,0],['right',1,0]]){if(!pressed[k])continue;
    let best=null,bs=1e9;for(const n of nodes){if(n===mapSel)continue;const d=destOf(n),vx=d.mx-cur.mx,vy=d.my-cur.my,al=vx*dx+vy*dy;if(al<=0)continue;
      const sc=al+Math.abs(vx*dy-vy*dx)*2;if(sc<bs){bs=sc;best=n;}}
    if(best){mapSel=best;SFX.menu();}}
  if(pressed.a){FLY={t:0,dest:mapSel};state='flying';SFX.magic();}
}
function updateFlying(){
  FLY.t++;if(FLY.t%14===0)SFX.flap();
  if(FLY.t>=110){const d=destOf(FLY.dest),name=AREA_LABEL[FLY.dest];state='play';FLY=null;
    warpTo(d.x,d.y,0,null,()=>toast('Welcome to the '+name+'!','#94dc64'));}
}
function drawMap(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(6,6,W-12,H-12,'#f2dca0','#9a6234');
  txt('WHERE TO, PIP?',W/2,14,8,'#5e3a1c',{align:'center'});
  const nodes=mapNodes(),line=(a,b)=>{const A=destOf(a),B=destOf(b);ctx.fillStyle='#c49a5c';
    const n=Math.max(Math.abs(B.mx-A.mx),Math.abs(B.my-A.my))/4;for(let i=0;i<=n;i++){if(i%2)continue;ctx.fillRect(Math.round(lerp(A.mx,B.mx,i/n))-1,Math.round(lerp(A.my,B.my,i/n))-1,2,2);}};
  ['farm','mountains','city','beach'].forEach(k=>line('forest',k));
  for(const k of ['farm','forest','mountains','city','beach','coop']){
    if(k==='coop'&&!G.coop)continue;const d=destOf(k),open=nodes.includes(k),sel=k===mapSel;
    if(sel){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.fillRect(d.mx-15,d.my-15,30,30);}
    box(d.mx-13,d.my-13,26,26,open?'#fff8ec':'#c8b080',open?'#5e3a1c':'#9a8060');
    if(open)ctx.drawImage(TILE[d.icon],d.mx-8,d.my-8);else txt('?',d.mx,d.my-4,8,'#9a8060',{align:'center'});
    txt(open?AREA_LABEL[k]:'???',d.mx,d.my+16,5,open?'#5e3a1c':'#9a8060',{align:'center'});
    if(areaOf()===k||(k==='coop'&&false)){drawPip(stage(),0,Math.floor(tick/12)%2,false,d.mx+12,d.my-6,1);}
  }
  txt('Z: fly   F: close',W/2,H-20,5,'#5e3a1c',{align:'center'});
}
function drawFlying(){
  drawSky(tick*3);ctx.fillStyle='#4ea84a';
  for(let x=0;x<W;x++){const h=Math.round(170+Math.sin((x+tick*4)/23)*6);ctx.fillRect(x,h,1,H-h);}
  drawPip(stage(),3,Math.floor(tick/5)%2,true,128,120+Math.round(Math.sin(tick/10)*6),2);
  txt('Flying to the '+AREA_LABEL[FLY.dest]+'!',W/2,30,8,'#21142b',{align:'center'});
}
/* ---- part 2 begins ---- */
let P2T=0;
function startPart2(){state='p2intro';P2T=0;fade=0;}
function updateP2Intro(){
  P2T++;if(P2T<30)fade=1-P2T/30;
  if(P2T>90&&pressed.a){G.part2=true;if(!G.areas.includes('forest'))G.areas.push('forest');P.flying=false;P.z=0;P.dir=0;state='play';
    warpTo(136,1067,0,null,()=>say([{who:'me',text:"Wow... a whole FOREST! I wonder who lives out here?"},
      {who:'me',text:"I can fly home to the farm any time I want. Press F to open my map!"},
      {who:'me',text:"Ooh, and there's a COOP SITE sign right here in the forest. I could build my very own home!"}]));}
}
function drawP2Intro(){
  drawSky(tick+400);for(let x=0;x<W;x++){const h=Math.round(150+Math.sin(x/19)*8);ctx.fillStyle='#2f7d3a';ctx.fillRect(x,h,1,H-h);}
  for(let i=0;i<9;i++){ctx.drawImage(TILE.tree,i*30-4,150+(i%2)*6);}
  txt('PART 2',W/2+1,51,16,'#21142b',{align:'center'});txt('PART 2',W/2,50,16,'#ffd83a',{align:'center'});
  txt('BEYOND THE FARM',W/2,78,8,'#21142b',{align:'center'});
  drawPip(stage(),3,Math.floor(tick/5)%2,true,128,128+Math.round(Math.sin(tick/12)*4),2);
  if(P2T>90&&Math.floor(tick/25)%2)txt('Press Z',W/2,200,7,'#fff8ec',{align:'center',shadow:true});
}

