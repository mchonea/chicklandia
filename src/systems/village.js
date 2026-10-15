'use strict';
/* ---------------- Chicklandia Village: materials, building, residents, happiness, seasons, contests ---------------- */
/* ---- calendar ---- */
function seasonNow(){const d=dayNum()-1,i=Math.floor(d/SEASON_DAYS)%4;return {i,name:SEASONS[i],year:Math.floor(d/(SEASON_DAYS*4))};}
function daysToNextSeason(){return SEASON_DAYS-((dayNum()-1)%SEASON_DAYS);}
/* ---- numbers ---- */
function builtList(kind){return Object.entries(G.vil.b).filter(([id,b])=>b.done&&(!kind||b.kind===kind)).map(([id,b])=>Object.assign({id},b));}
function happiness(){
  let h=0;for(const b of builtList())h+=BUILDING_TYPES[b.kind].happy;
  h+=Object.keys(G.vil.res).length*HAPPY_WISH;h+=Object.keys(G.vil.contest).length*HAPPY_CONTEST;return h;
}
function buildTime(){return has('master')?Math.round(BUILD_TIME/2):BUILD_TIME;}
function costOf(kind){const c=Object.assign({},BUILDING_TYPES[kind].cost);if(has('master')&&c.wood>1)c.wood--;return c;}
function costText(c){return [c.seeds?c.seeds+' SEEDS':'',...MATS.filter(m=>c[m]).map(m=>c[m]+' '+MAT_NAME[m])].filter(Boolean).join(', ');}
function missingFor(c){const out=[];if((c.seeds||0)>G.seeds)out.push((c.seeds-G.seeds)+' SEEDS');for(const m of MATS)if((c[m]||0)>G.vil.mat[m])out.push((c[m]-G.vil.mat[m])+' '+MAT_NAME[m]);return out;}
function payCost(c){G.seeds-=c.seeds||0;for(const m of MATS)G.vil.mat[m]-=c[m]||0;}
function matsLine(){return MATS.map(m=>MAT_NAME[m]+' '+G.vil.mat[m]).join('   ');}
function gainMat(kind,n,x,y){G.vil.mat[kind]+=n;SFX.pick();float(x,y-16,'+'+n+' '+MAT_NAME[kind],'#ffe05a');}
/* ---- opening the village ---- */
function openVillage(){
  if(G.vil.open)return;G.vil.open=true;
  for(const [c,r] of VILLAGE_ROAD)setTile(c,r,'=');
  if(!G.areas.includes('village'))G.areas.push('village');
  toast('The village road is open!','#a1d970');save();
}
/* ---- entities ---- */
function padCenter(p){return {x:(p.c+1)*16,y:(p.r+2)*16-2};}
function makeVillageEnts(){
  for(const p of PADS){const q=padCenter(p);addEnt({type:'vpad',id:p.id,pad:p,x:q.x,y:q.y,w:30});}
  for(const n of NODES)addEnt({type:'vnode',id:n.id,kind:n.kind,x:n.c*16+8,y:n.r*16+12});
  for(const s of VSHEEP)addEnt({type:'vsheep',id:s.id,x:s.c*16+8,y:s.r*16+12,ph:s.c*3,solid:true,w:14});
  for(const [c,r] of CROP_ROWS)addPlot(c,r,false);
  addEnt({type:'vmail',x:37*16+8,y:88*16+12});
  addEnt({type:'vboard',x:41*16+8,y:88*16+12});
  addEnt({type:'vwhistle',x:44*16+8,y:90*16+12});
  addEnt({type:'vcontest',x:21*16+8,y:88*16+12});
  addEnt({type:'windmill',x:29*16+8,y:89*16+14,solid:true,w:26});
  addEnt({type:'scarecrow',x:37*16+8,y:100*16+12});
  addEnt({type:'vsculpt',x:24*16+8,y:90*16+12,solid:true,w:16});
  spawnSeasonItems();
  relocateResidents();
}
function relocateResidents(){
  for(const id in G.vil.res){const e=ents.find(x=>x.id===id),p=PADS.find(q=>q.id===G.vil.res[id]);if(!e||!p)continue;
    const q=padCenter(p),k=Object.keys(G.vil.res).indexOf(id);Object.assign(e,{x:q.x-10+(k%3)*10,y:q.y+14,sched:null});e.vres=true;}
}
/* ---- per-frame upkeep (called from updatePlay) ---- */
function spawnSeasonItems(){
  ents=ents.filter(e=>!(e.type==='item'&&e.kind==='snowball'));
  const sc=seasonNow();
  if(sc.name==='WINTER'&&!contestDone())[[4,87],[11,89],[13,92]].forEach(([c,r],i)=>spawnItem('sb'+i+'_'+sc.year,'snowball',c*16+8,r*16+12));
}
let lastSeason=-1;
function updateVillage(){
  if(!G.vil.open)return;
  if(tick%30===0){
    for(const [id,b] of Object.entries(G.vil.b))if(!b.done&&G.clock-b.t0>=b.dur){b.done=true;
      const t=BUILDING_TYPES[b.kind];toast(t.name+' is finished!','#a1d970');SFX.questDone();shake=4;gainGP(GP.build);
      const p=PADS.find(q=>q.id===id),q=padCenter(p);puff(q.x,q.y-12,16,['#ffe05a','#fff8ec','#a1d970'],1.6,0.05);save();}
    checkLetters();
    const s=seasonNow();if(lastSeason!==s.i+s.year*4){if(lastSeason!==-1&&regionAt()&&regionAt().area==='village')toast('It is '+s.name+' in the village!','#ffe05a');lastSeason=s.i+s.year*4;spawnSeasonItems();}
  }
}
function freeBuilding(kind){const taken=Object.values(G.vil.res);return builtList(kind).find(b=>!taken.includes(b.id));}
function checkLetters(){
  // a friend whose letter went missing (quest started, never moved in, no letter in the box) gets a fresh letter
  for(const r of RESIDENTS){const q='v_'+r.id;if(G.vil.res[r.id]||G.vil.letters.includes(r.id))continue;
    if((G.q[q]===0||G.q[q]===1)&&freeBuilding(r.needs)){const fresh=G.q[q]===0;G.q[q]=1;G.vil.letters.push(r.id);toast(fresh?'A letter arrived at the village mailbox!':'A letter is waiting at the village mailbox!','#ff9cd0');SFX.chirp();}}
}
/* ---- building ---- */
let VB=null;      // the pad being built on
function tryBuild(kind){
  const pad=VB.pad,t=BUILDING_TYPES[kind],c=costOf(kind);
  if(t.only==='river'&&!pad.river)return {s:'A mill must be built beside the river!',c:'#ff8080'};
  const miss=missingFor(c);if(miss.length){SFX.deny();return {s:'You still need '+miss.join(', ')+'.',c:'#ff8080'};}
  payCost(c);G.vil.b[pad.id]={kind,t0:G.clock,dur:buildTime(),done:false};
  SFX.cash();shake=3;const q=padCenter(pad);puff(q.x,q.y-8,12,['#b69965','#fff8ec'],1.4,0.06);
  state='play';SH=null;VB=null;toast('Construction started!','#ffe05a');save();return null;
}
function padAction(e){
  const b=G.vil.b[e.id];
  if(!b){VB={pad:e.pad};openCatalog('build');return;}
  const t=BUILDING_TYPES[b.kind];
  if(!b.done){const pct=Math.min(99,Math.floor((G.clock-b.t0)/b.dur*100));say([{who:'me',text:"The "+t.name+" is going up! About "+pct+"% done. The builders are busy!"}]);return;}
  const who=Object.keys(G.vil.res).find(id=>G.vil.res[id]===e.id);
  if(b.kind==='mill'){
    if(G.vil.millDay!==dayNum()){G.vil.millDay=dayNum();addSeeds(1,2,0);float(e.x,e.y-34,'+1 SEED (flour sale)','#ffe05a');SFX.seed();save();
      say([{who:'me',text:"The mill ground some flour and sold it. One seed in the till!"}]);}
    else say([{who:'me',text:"The mill is busy grinding. More flour tomorrow!"}]);return;}
  if(b.kind==='clinic'){G.hearts=maxHearts();SFX.pick();float(e.x,e.y-34,'All better!','#a1d970');
    say([{who:'me',text:"A cozy bed, a warm blanket and a cup of tea. All my hearts are full!"}]);return;}
  say([{who:'me',text:who?(RESIDENTS.find(r=>r.id===who).name+" lives here. "+RESIDENTS.find(r=>r.id===who).home):"A lovely "+t.name+"."+(['home','bakery','school','band'].includes(b.kind)?" Maybe a friend would like to live here?":"")}]);
}
/* ---- mailbox and residents ---- */
function mailboxAction(){
  const id=G.vil.letters[0];
  if(!id){say([{who:'me',text:G.vil.open?"No new mail. Friends will write when there's a place for them to live!":""}]);return;}
  const r=RESIDENTS.find(x=>x.id===id),give=r.give,miss=missingFor(Object.assign({},give));
  const L=[{who:'me',text:"A letter from "+r.name+": \"Dear Pip, I'd love to move to your village! My one wish: "+r.wish+"\""+(G.vil.letters.length>1?" ("+(G.vil.letters.length-1)+" more letter"+(G.vil.letters.length>2?'s':'')+" waiting.)":'')}];
  L.push({who:'me',text:matsLine()+".   Give "+costText(give)+"?",choices:['Give it!','Later'],cb:i=>{
    if(i!==0)return;
    const m=missingFor(give);if(m.length){SFX.deny();say([{who:'me',text:"I still need "+m.join(', ')+". I'll find more!"}]);return;}
    payCost(give);moveIn(id);}});
  say(L);
}
function moveIn(id){
  const r=RESIDENTS.find(x=>x.id===id),b=freeBuilding(r.needs);
  G.vil.letters=G.vil.letters.filter(x=>x!==id);
  if(!b){toast('The home is gone?!','#ff8080');return;}
  G.vil.res[id]=b.id;relocateResidents();
  const qid='v_'+id;reward(QUESTS[qid].reward,qid);
  const e=ents.find(x=>x.id===id);
  toast(r.name+' '+r.how+'!','#a1d970');SFX.fanfare();
  const p=PADS.find(q=>q.id===b.id),q=padCenter(p);for(let i=0;i<14;i++)puff(q.x,q.y-10,1,['#ff6fae','#ffe05a','#fff8ec','#a1d970'],2,0.05);
  if(e)say([{who:e,text:r.home}]);save();
}
/* ---- gathering ---- */
function villagePeck(e,f,pr){
  if(e.type==='vnode'&&G.vil.nodes[e.id]!==dayNum()&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-6-f.y)<14){
    if(e.kind==='stone'&&!has('carry')){SFX.clunk();float(e.x,e.y-16,'Too heavy! Learn CARRY','#ff9cd0');return true;}
    if(!has('peck')&&e.kind!=='clay'){SFX.clunk();float(e.x,e.y-16,'Too tough!');return true;}
    G.vil.nodes[e.id]=dayNum();gainMat(e.kind,NODE_YIELD[e.kind]+((wearing('overalls')||G.rank>=8)?1:0),e.x,e.y);puff(e.x,e.y-4,8,['#b69965','#e8d8b0'],1.2,0.06);SFX.brk();save();return true;}
  if(e.type==='vsheep'&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-5-f.y)<14){
    if(G.vil.shear[e.id]===dayNum()){float(e.x,e.y-18,'Baa! (Come back tomorrow)','#fff8ec');SFX.menu();return true;}
    G.vil.shear[e.id]=dayNum();gainMat('wool',2+((wearing('overalls')||G.rank>=8)?1:0),e.x,e.y);puff(e.x,e.y-8,8,['#fff8ec','#e8e8f0'],1.2,0.04);save();return true;}
  if(e.type==='vsculpt'&&Math.abs(e.x-f.x)<16&&Math.abs(e.y-5-f.y)<16){sculptAction();return true;}
  return false;
}
/* ---- other interactables ---- */
function villageAction(f){
  for(const e of ents){if(!onCur(e))continue;
    if(e.type==='vpad'&&Math.abs(f.x-e.x)<26&&Math.abs(f.y-(e.y-10))<24){padAction(e);return true;}
    if(e.type==='vmail'&&Math.abs(f.x-e.x)<14&&Math.abs(f.y-(e.y-5))<14){mailboxAction();return true;}
    if(e.type==='vboard'&&Math.abs(f.x-e.x)<16&&Math.abs(f.y-(e.y-5))<14){openCatalog('board');return true;}
    if(e.type==='vcontest'&&Math.abs(f.x-e.x)<16&&Math.abs(f.y-(e.y-5))<14){openCatalog('contest');return true;}
    if(e.type==='vwhistle'&&Math.abs(f.x-e.x)<14&&Math.abs(f.y-(e.y-5))<14){whistleAction(e);return true;}}
  return false;
}
function whistleAction(e){
  if(!has('whistle')){say([{who:'me',text:"A whistle post! If only I knew how to whistle for helpers. Dash the sheepdog might teach me!"}]);return;}
  say([{who:'me',text:"Who shall I whistle for?",choices:['The sheep','The beaver'],cb:i=>{
    const k=i===0?'wool':'wood',day=G.vil.whistle[k];
    if(day===dayNum()){say([{who:'me',text:i===0?"The sheep already brought wool today!":"The beaver already hauled logs today!"}]);return;}
    G.vil.whistle[k]=dayNum();SFX.magic();gainMat(k,2+((wearing('overalls')||G.rank>=8)?1:0),e.x,e.y);
    toast(i===0?'A sheep trots over with a bundle of wool!':'A beaver drags in a stack of logs!','#ffe05a');save();}}]);
}
/* ---- skills ---- */
// Green Wings: a flap over crop rows waters them
function greenWings(dx,dy){
  if(!has('green'))return;
  for(const e of ents){if(e.type!=='plot')continue;const s=G.plots[e.id];if(!s||s.p>=1)continue;
    const vx=e.x-P.x,vy=e.y-P.y,along=vx*dx+vy*dy,lat=Math.abs(vx*dy-vy*dx);
    if(along>-8&&along<56&&lat<28){s.p=Math.min(1,s.p+0.12);s.w=(s.w||0)+1;puff(e.x,e.y-6,6,['#a6d0ff','#fff8ec'],1,0.08);float(e.x,e.y-14,'Watered!','#a6d0ff');}}
}
/* ---- seasons: drawing ---- */
function drawSeasonFX(cx,cy){
  const rg=regionAt();if(!rg||rg.area!=='village')return;
  const s=seasonNow();ctx.fillStyle=SEASON_TINT[s.name];ctx.fillRect(0,HUD,W,VH);
  const n=s.name==='WINTER'?36:s.name==='AUTUMN'?18:s.name==='SPRING'?12:6;
  for(let i=0;i<n;i++){
    const sp=0.5+(i%4)*0.18,x=((i*53+tick*(s.name==='WINTER'?0.25:0.5)*(1+i%3*0.2))%(W+20))-10,y=HUD+((i*37+tick*sp)%VH);
    if(s.name==='WINTER'){ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x),Math.round(y),2,2);}
    else if(s.name==='AUTUMN'){ctx.fillStyle=['#e8a02c','#eb6654','#f07832'][i%3];ctx.fillRect(Math.round(x),Math.round(y+Math.sin(tick/9+i)*3),3,2);}
    else if(s.name==='SPRING'){ctx.fillStyle=i%2?'#ffb0d0':'#fff8ec';ctx.fillRect(Math.round(x),Math.round(y),2,2);}
    else{if(tick%40<20){ctx.fillStyle='rgba(255,255,200,0.7)';ctx.fillRect(Math.round(x),Math.round(HUD+((i*61)%VH)),1,1);}}}
}
function seasonPlotMul(){const n=seasonNow().name;return n==='SPRING'?1.25:n==='WINTER'?0.5:1;}
/* ---- contests (Windmill Hill) ---- */
function contestKey(){const s=seasonNow();return s.name+'_'+s.year;}
function contestDone(){return !!G.vil.contest[contestKey()];}
function contestWin(){
  const s=seasonNow(),k=contestKey();if(G.vil.contest[k])return;
  G.vil.contest[k]=1;addSeeds(4,2,0);gainGP(8);
  const first=!G.vil.contestFirst;if(first){G.vil.contestFirst=1;}
  toast('You won the '+s.name+' contest! +4 seeds, village happier!','#ffe05a');SFX.fanfare();save();
}
function contestInfo(){
  const s=seasonNow();
  return {SPRING:{name:'EGG RACE',desc:'Catch 20 eggs before 5 crack!',icon:'egg'},SUMMER:{name:'KITE CATCH',desc:'Catch 15 kites riding the summer wind!',icon:'kite'},
    AUTUMN:{name:'GIANT PUMPKIN',desc:'Grow a pumpkin in the meadow and water it with Green Wings. Weigh in at 24 or more!',icon:'pumpkin'},
    WINTER:{name:'SNOW SCULPTURE',desc:'Gather 3 snowballs around the hill and add them to the sculpture!',icon:'snowball'}}[s.name];
}
function startContest(){
  const s=seasonNow();
  if(s.name==='SPRING'){state='play';SH=null;startEgg('barnaby');EG.contest=true;return;}
  if(s.name==='SUMMER'){state='play';SH=null;startMG('ffly','barnaby');MG.contest=true;MG.goal=15;return;}
  if(s.name==='AUTUMN'){G.sacks.pumpkin=(G.sacks.pumpkin||0)+(G.sacks.pumpkin?0:1);state='play';SH=null;
    say([{who:ents.find(e=>e.id==='barnaby')||'me',text:"Plant this pumpkin seed in a meadow crop row. Water it with a Green Wings flap, then bring the harvest to the scales!"}]);return;}
  state='play';SH=null;say([{who:ents.find(e=>e.id==='barnaby')||'me',text:"Find 3 snowballs around the hill and roll them to the sculpture by the stage!"}]);
}
function sculptAction(){
  const n=G.vil.snow||0;
  if(seasonNow().name!=='WINTER'){say([{who:'me',text:"A snowy stage waits for winter, when the sculpture contest starts."}]);return;}
  if(contestDone()){say([{who:'me',text:"What a masterpiece! The judges loved it."}]);return;}
  if(G.items.snowball>0){G.items.snowball--;G.vil.snow=n+1;SFX.pop();toast('Added to the sculpture! ('+G.vil.snow+'/3)','#b2e7e0');
    if(G.vil.snow>=3){G.vil.snow=0;contestWin();}save();return;}
  say([{who:'me',text:"The sculpture needs "+(3-n)+" more snowballs. Look around the hill!"}]);
}
function pumpkinWeigh(plotState){   // returns weight in pounds
  return 16+(plotState.w||0)*4+(hash2(dayNum(),plotState.t||3)%6);
}

/* ---- drawing the village entities ---- */
function drawVillageEnt(e,sx,sy){
  switch(e.type){
    case 'vpad':{
      const b=G.vil.b[e.id];e.solid=!!b;
      if(!b){if(G.vil.open&&tick%90<40){ctx.fillStyle='rgba(255,236,140,0.8)';ctx.fillRect(sx-1,sy-14,2,6);ctx.fillRect(sx-3,sy-12,6,2);}break;}
      const img=SPR['b_'+b.kind];
      if(b.done){shadow(sx,sy+1,14);ctx.drawImage(img,sx-16,sy-30);if(b.kind==='bakery'&&tick%20<10){ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fillRect(sx+8,sy-34-(tick%30)/5|0,3,3);}}
      else{const k=Math.min(1,(G.clock-b.t0)/b.dur),h=Math.max(1,Math.round(34*k));
        ctx.drawImage(img,0,34-h,32,h,sx-16,sy-30+34-h,32,h);ctx.drawImage(SPR.scaffold,sx-16,sy-30);
        ctx.fillStyle='#202840';ctx.fillRect(sx-12,sy-36,24,5);ctx.fillStyle='#a1d970';ctx.fillRect(sx-11,sy-35,Math.round(22*k),3);
        if(tick%16===0)puff(e.x+(Math.random()-.5)*20,e.y-14,1,['#b69965','#fff8ec'],0.8,0.05);}
      break;}
    case 'vnode':{if(G.vil.nodes[e.id]===dayNum())break;const s=SPR['node_'+e.kind];shadow(sx,sy+1,7);drawImg(s,sx-(s.width>>1),sy+1-s.height);
      if(tick%70<5){ctx.fillStyle='#fff';ctx.fillRect(sx+3,sy-s.height,1,1);}break;}
    case 'vsheep':{let s=SPR.sheep;if(Math.floor(e.ph/40)%2)s=flipOf(s);shadow(sx,sy+1,10);drawImg(s,sx-(s.width>>1),sy+2-s.height+Math.floor((tick+e.ph)/40)%2);
      if(G.vil.shear[e.id]===dayNum()){ctx.fillStyle='rgba(60,60,90,0.18)';ctx.fillRect(sx-8,sy-12,16,10);}break;}
    case 'vmail':{drawImg(SPR.mailbox,sx-(SPR.mailbox.width>>1),sy-SPR.mailbox.height+1);if(G.vil.letters.length){const b=Math.round(Math.sin(tick/8)*2);ctx.fillStyle='#ff6fae';ctx.fillRect(sx-3,sy-17+b,7,5);ctx.fillStyle='#fff8ec';ctx.fillRect(sx-2,sy-16+b,5,1);}break;}
    case 'vboard':drawImg(SPR.board,sx-(SPR.board.width>>1),sy-SPR.board.height+1);break;
    case 'vwhistle':drawImg(SPR.whistlePost,sx-(SPR.whistlePost.width>>1),sy-SPR.whistlePost.height+1);break;
    case 'vcontest':{drawImg(SPR.board,sx-(SPR.board.width>>1),sy-SPR.board.height+1);const i=contestInfo();if(SPR[i.icon]&&!contestDone())drawImg(SPR[i.icon],sx-(SPR[i.icon].width>>1),sy-SPR.board.height-SPR[i.icon].height-1+Math.round(Math.sin(tick/12)*1.5));break;}
    case 'scarecrow':drawImg(SPR.scarecrow,sx-(SPR.scarecrow.width>>1),sy-SPR.scarecrow.height+1);break;
    case 'windmill':{shadow(sx,sy+1,18);ctx.drawImage(SPR.windmillBase,sx-20,sy-62);
      const cx=sx,cy=sy-50,a=tick/40;ctx.strokeStyle='#202840';ctx.lineWidth=3;
      for(let i=0;i<4;i++){const an=a+i*Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(an)*24,cy+Math.sin(an)*24);ctx.stroke();}
      ctx.strokeStyle='#f6ead0';ctx.lineWidth=1;for(let i=0;i<4;i++){const an=a+i*Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(an)*23,cy+Math.sin(an)*23);ctx.stroke();}
      ctx.fillStyle='#202840';ctx.fillRect(cx-2,cy-2,5,5);break;}
    case 'vsculpt':{ctx.fillStyle='#202840';ctx.fillRect(sx-9,sy-4,18,5);ctx.fillStyle='#b69965';ctx.fillRect(sx-8,sy-3,16,3);
      const n=G.vil.snow||0,done=contestDone()&&seasonNow().name==='WINTER';
      if(done||n>0){const s=SPR.snowSculpture[Math.min(2,done?2:n-1)];drawImg(s,sx-(s.width>>1),sy-4-s.height);}break;}
  }
}
