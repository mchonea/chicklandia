'use strict';
/* ---------------- city systems: treats, special seeds, parcels, museum, library, decorations ---------------- */
/* ---- bakery buffs (one in-game day) ---- */
function buffActive(id){const b=G&&G.buff;return !!b&&G.clock<b.until&&(!id||b.id===id);}
function checkBuffExpiry(){
  if(G.buff&&G.clock>=G.buff.until){G.buff=null;G.hearts=Math.min(G.hearts,maxHearts());toast('Your treat has worn off.','#b8a8d8');}
}
function overChasm(){return tileAt(Math.floor(P.x/16),Math.floor((P.y-3)/16))==='z';}

/* ---- garden: special seeds ---- */
let PL=null;   // planting menu
function plantChoices(){
  const L=[];if(G.seeds>=1)L.push('plain');
  for(const k of ['speedy','giant','moon','pumpkin'])if(G.sacks[k]>0)L.push(k);
  return L;
}
function plantSeed(e,k){
  const t=SEED_TYPES[k];
  if(k==='plain')G.seeds--;else G.sacks[k]--;
  G.plots[e.id]={p:0,k};SFX.pop();puff(e.x,e.y-4,6,['#9a6234','#94dc64'],0.8,0.05);float(e.x,e.y-16,'Planted '+(k==='plain'?'':t.name+'!'),'#94dc64');save();
}
function openPlantMenu(e,list){PL={e,list,sel:0};state='plant';SFX.menu();}
function updatePlant(){
  if(pressed.back){state='play';PL=null;SFX.menu();return;}
  if(pressed.up){PL.sel=(PL.sel+PL.list.length-1)%PL.list.length;SFX.menu();}
  if(pressed.down){PL.sel=(PL.sel+1)%PL.list.length;SFX.menu();}
  if(pressed.a){const k=PL.list[PL.sel],e=PL.e;state='play';PL=null;plantSeed(e,k);}
}
function drawPlant(){
  const w=150,h=22+PL.list.length*16,x=(W-w)/2,y=70;
  box(x,y,w,h,'#1d1430','#94dc64');txt('WHAT SHALL I PLANT?',W/2,y+6,5,'#94dc64',{align:'center'});
  PL.list.forEach((k,i)=>{const t=SEED_TYPES[k],yy=y+18+i*16,sel=i===PL.sel;
    if(sel){ctx.fillStyle='#3b2a56';ctx.fillRect(x+4,yy-2,w-8,15);}
    if(SPR[t.spr])drawImg(SPR[t.spr],x+8,yy+(sel?0:1));
    txt(t.name,x+24,yy+3,5,sel?'#fff8ec':'#b8a8d8');
    txt(k==='plain'?'1 seed':'x'+G.sacks[k],x+w-8,yy+3,5,'#ffd83a',{align:'right'});});
}
// extra plots bought at the Seed & Feed
function extraPlotTiles(){const S=SITES[G.coop.site];return (S.extraPlots||[]).slice(0,G.coop.extra||0);}

/* ---- toy-shop decorations in Pip's coop ---- */
const DECOR_POS={flowers:[[34,52],[45,52]],lights:[[36,50],[43,50],[45,50]],lamp:[[40,57]],painting:[[40,49]]};
function placeDecor(){
  ents=ents.filter(e=>e.type!=='decor');
  for(const k in G.decor)if(G.decor[k])for(const [c,r] of DECOR_POS[k]||[])addEnt({type:'decor',kind:k,x:c*16+8,y:r*16+12});
}

/* ---- post office parcels ---- */
const JOB_PAY={seeds:2,gp:3};
function refreshJobs(){
  const d=dayNum();if(G.jobs.day===d)return;G.jobs.day=d;
  G.jobs.list=G.jobs.list.filter(j=>j.st!==2);
  const n=1+(hash2(d,7)%2);                         // one or two new runs each in-game day
  for(let i=0;i<n&&G.jobs.list.length<4;i++){
    let k=hash2(d*3+i,11)%JOB_TARGETS.length,tries=0;
    while(G.jobs.list.some(j=>j.to===JOB_TARGETS[k][0])&&tries++<20)k=(k+1)%JOB_TARGETS.length;
    G.jobs.list.push({to:JOB_TARGETS[k][0],st:0});}
}
function deliverJob(e,it){
  const j=G.jobs.list.find(x=>x.to===e.id&&x.st===1);if(!j)return false;
  it("A parcel from the post office? For me? Thank you so much, Pip!",()=>{j.st=2;G.flags.parcels=(G.flags.parcels||0)+1;addSeeds(JOB_PAY.seeds,inBeyond(e.x,e.y)?2:1,0);gainGP(JOB_PAY.gp);
    toast('Delivered! +'+JOB_PAY.seeds+' seeds','#a6e0ff');SFX.questDone();save();});
  return true;
}

/* ---- museum ---- */
function donatable(){return EXHIBITS.some(x=>G.hold[x.item]>0&&G.museum[x.id]<x.need);}
function donateAll(){
  let any=false;
  for(const x of EXHIBITS){const n=Math.min(G.hold[x.item]||0,x.need-G.museum[x.id]);if(n<=0)continue;
    G.hold[x.item]-=n;G.museum[x.id]+=n;any=true;
    if(G.museum[x.id]>=x.need){addSeeds(x.reward.seeds,2,0);gainGP(x.reward.gp);toast(x.name+' exhibit complete! +'+x.reward.seeds+' seeds','#ffd83a');SFX.questDone();}}
  if(!any){SFX.deny();return {s:"You aren't carrying anything the museum needs yet.",c:'#ff8080'};}
  SFX.pick();save();return {s:'Thank you! The exhibit looks wonderful.',c:'#94dc64'};
}
function museumFull(){return EXHIBITS.every(x=>G.museum[x.id]>=x.need);}

/* ---- library ---- */
function guideLines(area){
  const out=[],pool={farm:['mom',...ORDER],forest:['granny','bucky','doe'],mountains:['mo','elda'],beach:['pinch','sandy'],city:['pidge','remy','rocco','cleo','cookoff','vane','babysit','portrait']}[area]||[];
  for(const id of pool){const q=QUESTS[id];if(!q||!q.hint)continue;if(G.q[id]===1||(G.q[id]===0&&G.met.has(id)))out.push(q.hint());}
  if(!out.length){const left=pool.filter(id=>G.q[id]===0).length;
    out.push(left?'There are friends here who still need help. Explore and say hello!':'You have helped everyone here. What a good friend!');}
  return out.slice(0,3);
}
function readGuide(b){
  const lib=ents.find(e=>e.id==='olive'),L=[{who:lib||'me',text:"The "+b.name+": "+guideLines(b.area)[0]}];
  guideLines(b.area).slice(1).forEach(t=>L.push({who:lib||'me',text:t}));
  state='play';SH=null;say(L);
}
function readLore(l){const lib=ents.find(e=>e.id==='olive');state='play';SH=null;say(l.text.map(t=>({who:lib||'me',text:t})));}
function readStory(){G.flags.stories=(G.flags.stories||0)+1;say([{who:'me',text:STORIES[(G.flags.stories-1)%STORIES.length]},{who:'me',text:"What a lovely story. I feel cozy now."}]);}
