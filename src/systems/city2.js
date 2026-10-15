'use strict';
/* ---------------- city part 2: residents' day/night routines, city quest mechanics, rooftop race ---------------- */
/* ---- residents: out in the city by day, home at night ---- */
function updateSchedules(force){
  const ph=nightAmt()>0.5?'night':'day';
  for(const e of ents){
    if(e.type!=='npc'||!e.sched||e.at===ph)continue;
    if(!force&&onCur(e))continue;                     // never vanish in front of Pip
    const p=e.sched[ph];Object.assign(e,at(p[0],p[1]));e.at=ph;}
}

/* ---- Rocco's borrowed things ---- */
function retCount(){const r=G.flags.ret||{};return (r.hat?1:0)+(r.whisk?1:0)+(r.bell?1:0);}
function returnBorrowed(e,it){
  if(!G.flags.ret)G.flags.ret={};
  for(const b of BORROWED){
    if(b.owner===e.id&&G.items[b.item]&&!G.flags.ret[b.flag]){
      it("Is that "+b.name+"? You found it! Thank you, Pip!",()=>{G.flags.ret[b.flag]=1;G.items[b.item]=0;SFX.pick();
        toast('Returned! ('+retCount()+'/3)','#a1d970');if(retCount()>=3)toast('All returned! Tell Rocco.','#ff9cd0');save();});
      return true;}}
  return false;
}

/* ---- Cleo's sunbeam ---- */
const SUNBEAM={x:71*16+8,y:65*16+8};
let sbTimer=0;
function sunbeamOn(){const t=dayT();return t>=0.26&&t<0.36;}
function updateSunbeam(){
  if(G.q.cleo!==1||G.flags.sunbeam)return;
  if(sunbeamOn()&&Math.hypot(P.x-SUNBEAM.x,P.y-6-SUNBEAM.y)<13){
    if(++sbTimer===1)toast('Ahh... so warm and golden.','#ffe05a');
    if(sbTimer>=100){G.flags.sunbeam=1;toast("You found Cleo's sunbeam! Go tell her.",'#ff9cd0');SFX.questDone();save();}
  }else sbTimer=0;
}
function drawSunbeam(cx,cy){
  if(G.q.cleo<1||!sunbeamOn()||regionAt().id!=='city')return;
  const sx=SUNBEAM.x-cx,sy=SUNBEAM.y-cy+HUD,a=0.22+0.06*Math.sin(tick/20);
  ctx.fillStyle='rgba(255,236,140,'+a+')';ctx.beginPath();ctx.ellipse(sx,sy,15,10,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,248,200,'+(a+0.12)+')';ctx.beginPath();ctx.ellipse(sx,sy,8,5,0,0,7);ctx.fill();
  for(let i=0;i<4;i++){const t=(tick/3+i*17)%30;ctx.fillStyle='rgba(255,255,220,'+(1-t/30)+')';ctx.fillRect(Math.round(sx-9+i*6),Math.round(sy-t/2),1,1);}
}

/* ---- Mrs. Waddles' ducklings ---- */
const BABY_STOPS=[[71,65],[66,67],[76,69]];       // gazebo, pond, bandstand (tile col,row)
const BABY_NAMES=['the gazebo','the pond','the bandstand'];
function startBabysit(){
  G.flags.baby={on:true,stops:0,seen:[0,0,0],fail:false,done:false};
  for(const d of ents)if(d.type==='cduck'){d.mode='follow';d.lost=0;}
  toast('Lead the ducklings around the park!','#ffe05a');
}
function babyHome(){for(const d of ents)if(d.type==='cduck'){d.mode='home';d.x=d.hx;d.y=d.hy;}}
function babyRemind(){
  const b=G.flags.baby;
  if(!b||b.fail||!b.on){startBabysit();return "Oh dear, you lost one! Let's try again. Lead all four to the gazebo, the pond and the bandstand, then home!";}
  if(b.stops<3)return b.stops+"/3 stops. Next: "+BABY_NAMES[b.seen.indexOf(0)]+". Walk slowly so nobody gets left behind!";
  return "All three stops! Now bring them home to me. Quack!";
}
function updCduck(e){
  e.ph=(e.ph||0)+1;
  const b=G.flags.baby;
  if(e.mode==='home'){e.x=e.hx+Math.round(Math.sin((e.ph+e.i*20)/30)*2);e.y=e.hy;return;}
  const p=TRAIL[Math.max(0,TRAIL.length-1-(e.i+1)*14)];
  if(p){if(Math.abs(p.x-e.x)>0.3)e.flip=p.x>e.x;e.x+=(p.x-e.x)*0.35;e.y+=(p.y-e.y)*0.35;}
  const d=Math.hypot(P.x-e.x,P.y-e.y);e.lost=d>90?(e.lost||0)+1:0;
  if(e.lost>140&&b&&!b.fail){b.fail=true;b.on=false;babyHome();toast('Oh no! A duckling got lost!','#ff8080');SFX.deny();}
}
function updateBabysit(){
  const b=G.flags.baby;if(!b||!b.on||b.fail||b.done)return;
  const ducks=ents.filter(e=>e.type==='cduck');
  const together=ducks.every(d=>d.mode==='follow'&&Math.hypot(P.x-d.x,P.y-d.y)<46);
  BABY_STOPS.forEach(([c,r],i)=>{if(b.seen[i]||!together)return;
    if(Math.hypot(P.x-(c*16+8),P.y-(r*16+8))<28){b.seen[i]=1;b.stops++;toast('Stop '+b.stops+'/3: '+BABY_NAMES[i]+'!','#a1d970');SFX.chirp();save();}});
  const w=ents.find(e=>e.id==='waddles');
  if(b.stops>=3&&w&&together&&Math.hypot(P.x-w.x,P.y-w.y)<60&&regionAt().id==='cityin'){b.done=true;b.on=false;babyHome();toast('All four ducklings are home! Tell Mrs. Waddles.','#ff9cd0');SFX.questDone();save();}
}

/* ---- Pablo's portraits ---- */
function poseKey(){return (G.wear||'')+'+'+(G.acc||'');}
function tryPose(e,it){
  if(!G.flags.poses)G.flags.poses=[];
  if(G.flags.poses.length>=3)return false;
  const k=poseKey();
  if(k==='+'){it("Hmm, you look... fluffy. Lovely, but wear an OUTFIT first, my muse!");return true;}
  if(G.flags.poses.includes(k)){it("I've already painted you in that look! Wear something DIFFERENT, mon ami.");return true;}
  if(G.flags.posed){it("One portrait per visit! Leave, change outfits, and come back. Art takes time!");return true;}
  it("Magnifique! Hold still... *scritch scratch* ...Done!",()=>{G.flags.poses.push(k);G.flags.posed=true;toast('Portrait '+G.flags.poses.length+'/3 painted!','#ffe05a');SFX.chirp();save();});
  if(G.flags.poses.length===2)it("That makes three portraits! Talk to me again and I'll show you something special!");
  return true;
}

/* ---- peck hooks for city things ---- */
function cityPeck(e,f,pr){
  if(e.type==='vane'&&Math.abs(e.x-f.x)<14&&Math.abs(e.y-8-f.y)<16){
    if(!G.flags.vane){G.flags.vane=1;SFX.brk();puff(e.x,e.y-12,12,['#ffe05a','#fff8ec'],1.4,0.04);toast("The weathervane is spinning! Tell Pidge.",'#ff9cd0');save();}
    else{float(e.x,e.y-24,'Spinning!','#b2e7e0');SFX.menu();}
    return true;}
  if(e.type==='fmound'&&Math.abs(e.x-f.x)<13&&Math.abs(e.y-4-f.y)<13){
    if(!has('peck')){SFX.clunk();float(e.x,e.y-14,'Too hard to dig!');return true;}
    e.dead=true;G.collected.add(e.id);SFX.brk();puff(e.x,e.y-4,14,['#b69965','#e8d8b0','#fff8ec'],1.4,0.08);
    spawnItem(e.id+'_f','fossil',e.x,e.y,true);save();return true;}
  return false;
}
function useNook(){readStory();}

/* ---- Rooftop Race ---- */
const RACE_LIMIT=90*60,RACE_NEED=8;
const RACE_STARS=[[4,3],[3,7],[7,5],[12,4],[13,7],[18,5],[24,5],[28,4],[31,7],[34,5],[39,6]];   // (col,row) in the 3-screen course, origin = roofs
function raceOrigin(){return {c:5*16,r:7*12};}
function startRace(){
  state='play';SH=null;
  const o=raceOrigin();
  G.race={t:0,stars:0,active:true};
  ents=ents.filter(e=>e.type!=='star'&&e.type!=='flag');
  RACE_STARS.slice(0,10).forEach(([c,r],i)=>addEnt({type:'star',id:'rs'+i,x:(o.c+c)*16+8,y:(o.r+r)*16+12,ph:i*7}));
  addEnt({type:'flag',x:(o.c+32+12)*16+8,y:(o.r+5)*16+12});
  warpTo((o.c+3)*16+8,(o.r+5)*16+11,0,null,()=>{secretFound('rooftops');toast('GO! Collect '+RACE_NEED+' stars and reach the flag!','#ffe05a');SFX.magic();});
}
function endRace(win){
  const r=G.race,secs=Math.max(1,Math.round(r.t/60));G.race=null;
  ents=ents.filter(e=>e.type!=='star'&&e.type!=='flag');
  const L=[],fiz=ents.find(e=>e.id==='fizz'),tdoor=ROOF_STAIRS.toyDoor;
  if(win){SFX.questDone();const first=!G.best.race;
    G.best.race=G.best.race?Math.min(G.best.race,secs):secs;
    const gp=minigameGP('race',true);
    if(grantOutfit('goggles'))L.push({who:fiz,text:"WOW! "+r.stars+" stars in "+secs+" seconds! You win my RACING GOGGLES!",fx:()=>toast('Got the RACING GOGGLES! Press C to wear.')});
    else L.push({who:fiz,text:"Zoom! "+r.stars+" stars in "+secs+" seconds! Best: "+G.best.race+"s!"});
    if(first)addSeeds(2,2,0);
  }else{SFX.deny();L.push({who:fiz,text:r.t>=RACE_LIMIT?"Time's up! You grabbed "+r.stars+" stars. Try again!":"You need at least "+RACE_NEED+" stars! You had "+r.stars+". Try again!"});}
  save();
  warpTo(tdoor[0]*16+8,(tdoor[1]+1)*16+11,1,null,()=>say(L));
}
function updateRace(){
  const r=G.race;if(!r||!r.active)return;
  if(regionAt().id!=='rooftops'&&state==='play'&&!WARP){G.race=null;ents=ents.filter(e=>e.type!=='star'&&e.type!=='flag');return;}
  r.t++;
  for(const e of ents)if(e.type==='star'&&!e.dead&&Math.hypot(P.x-e.x,P.y-6-e.y)<12){e.dead=true;r.stars++;SFX.chirp();float(e.x,e.y-14,r.stars+'/10','#ffe05a');puff(e.x,e.y-6,6,['#ffe05a','#fff8ec'],1,0);}
  const fl=ents.find(e=>e.type==='flag');
  if(fl&&Math.hypot(P.x-fl.x,P.y-fl.y)<14){endRace(r.stars>=RACE_NEED);return;}
  if(r.t>=RACE_LIMIT)endRace(false);
}
function drawRaceHUD(){
  const r=G.race;if(!r)return;
  box(40,H-22,176,16,'#192639','#ffe05a');
  txt('STARS '+r.stars+'/10     '+Math.max(0,Math.ceil((RACE_LIMIT-r.t)/60))+'s',W/2,H-17,6,'#ffe05a',{align:'center'});
}

/* ---- drawing for city entities ---- */
function drawCityEnt(e,sx,sy){
  switch(e.type){
    case 'fmound':{const s=SPR.mound;drawImg(s,sx-(s.width>>1),sy+2-s.height);ctx.fillStyle='#e8d8b0';ctx.fillRect(sx-3,sy-6,5,1);ctx.fillRect(sx+1,sy-4,3,1);
      if(senseNear(e.x,e.y)&&tick%24<12){ctx.fillStyle='#ffd21e';ctx.fillRect(sx-1,sy-9,2,2);}break;}
    case 'star':{const s=SPR.star,bob=Math.round(Math.sin((tick+e.ph*9)/10)*2);drawImg(s,sx-(s.width>>1),sy-14-bob);if(tick%30<4){ctx.fillStyle='#fff';ctx.fillRect(sx+3,sy-18,1,1);}break;}
    case 'flag':{const s=SPR.flag;drawImg(s,sx-(s.width>>1),sy-s.height);break;}
    case 'vane':{const s=G.flags.vane?SPR.vaneFixed:SPR.vane,w=G.flags.vane?Math.round(Math.sin(tick/8)*2):0;drawImg(s,sx-(s.width>>1)+w,sy-s.height);break;}
    case 'cduck':{let s=SPR.duckling;if(e.flip)s=flipOf(s);const bob=Math.floor((tick+e.i*9)/14)%2;shadow(sx,sy+1,5);drawImg(s,sx-(s.width>>1),sy+2-s.height-bob);
      if(e.lost>40&&tick%20<10){txt('?',sx,sy-16,6,'#ff8080',{align:'center'});}break;}
    case 'decor':{
      if(e.kind==='flowers'){ctx.fillStyle='#202840';ctx.fillRect(sx-5,sy-5,10,6);ctx.fillStyle='#c8603c';ctx.fillRect(sx-4,sy-4,8,5);ctx.fillStyle='#55aa62';ctx.fillRect(sx-3,sy-8,2,4);ctx.fillRect(sx+1,sy-9,2,5);
        ctx.fillStyle='#ff6fae';ctx.fillRect(sx-4,sy-10,3,2);ctx.fillRect(sx,sy-11,3,2);ctx.fillStyle='#ffe05a';ctx.fillRect(sx-3,sy-9,1,1);}
      else if(e.kind==='lights'){const on=nightAmt()>0.2||regionAt().kind==='indoor';ctx.fillStyle='#202840';ctx.fillRect(sx-7,sy-12,14,1);
        for(let i=0;i<3;i++){ctx.fillStyle=on&&(tick/20+i)%3<2?['#ffe05a','#ff6fae','#b2e7e0'][i]:'#7896ae';ctx.fillRect(sx-6+i*5,sy-11,3,3);}}
      else if(e.kind==='lamp'){ctx.fillStyle='#202840';ctx.fillRect(sx-4,sy-14,8,15);ctx.fillStyle='#c98a00';ctx.fillRect(sx-3,sy-6,6,6);ctx.fillRect(sx-1,sy-12,2,6);ctx.fillStyle='#ffd21e';ctx.fillRect(sx-3,sy-14,6,3);
        ctx.fillStyle='rgba(255,230,120,'+(0.25+0.1*Math.sin(tick/15))+')';ctx.beginPath();ctx.arc(sx,sy-12,9,0,7);ctx.fill();}
      else if(e.kind==='painting'){for(let i=0;i<3;i++){const x=sx-26+i*18;ctx.fillStyle='#202840';ctx.fillRect(x,sy-2,14,12);ctx.fillStyle='#b69965';ctx.fillRect(x+1,sy-1,12,10);ctx.fillStyle=['#b2e7e0','#ffe05a','#e8a0d0'][i];ctx.fillRect(x+3,sy+1,8,6);ctx.fillStyle='#fff8ec';ctx.fillRect(x+6,sy+2,3,3);}}
      break;}
    case 'exhibit':{const x=EXHIBITS.find(q=>q.id===e.ex),n=G.museum[e.ex];const s=SPR[x.item];
      for(let i=0;i<x.need;i++){const have=i<n;ctx.globalAlpha=have?1:0.18;drawImg(s,sx-14+i*6-(x.need>4?2:0),sy-17+(i%2)*3);ctx.globalAlpha=1;}
      if(n>=x.need&&tick%40<6){ctx.fillStyle='#fff';ctx.fillRect(sx+7,sy-18,1,1);}break;}
    case 'easel':{drawImg(SPR.easel,sx-(SPR.easel.width>>1),sy-SPR.easel.height+2);const n=(G.flags.poses||[]).length;
      if(n){ctx.fillStyle=['#b2e7e0','#ffe05a','#e8a0d0'][n-1];ctx.fillRect(sx-5,sy-16,10,7);ctx.fillStyle='#fff8ec';ctx.fillRect(sx-1,sy-14,3,3);}break;}
    case 'nook':{ctx.fillStyle='rgba(255,111,174,0.3)';ctx.fillRect(sx-12,sy-8,24,10);drawImg(SPR.book,sx-3,sy-9);if(tick%90<6){ctx.fillStyle='#fff';ctx.fillRect(sx+6,sy-10,1,1);}break;}
  }
}

/* ---- spawn everything the city adds to the world ---- */
function makeCityEnts(){
  for(const f of FINDS){if(G.collected.has(f.id))continue;
    if(f.kind==='fossilmound')addEnt({type:'fmound',id:f.id,x:f.c*16+8,y:f.r*16+11});else spawnItem(f.id,f.kind,f.c*16+8,f.r*16+12);}
  for(const b of BORROWED)if(!G.collected.has(b.id)&&!G.items[b.item]&&!(G.flags.ret&&G.flags.ret[b.flag]))spawnItem(b.id,b.kind,b.c*16+8,b.r*16+12);
  for(const i of INGREDIENTS)if(!G.collected.has(i.id))spawnItem(i.id,i.kind,i.c*16+8,i.r*16+12);
  const to=roomOrigin('toy');[[4,8],[7,8],[10,8],[5,10],[8,10],[11,10]].forEach(([c,r],i)=>addEnt({type:'hole',id:'ahole'+i,x:to.x+c*16+8,y:to.y+r*16+12,up:0,max:1,arcade:true}));
  const mo=roomOrigin('museum');EXHIBITS.forEach((x,i)=>{const [pc,pr]=[[3,4],[6,4],[9,4],[12,4],[4,10],[11,10]][i];addEnt({type:'exhibit',ex:x.id,x:mo.x+pc*16+8,y:mo.y+pr*16+13});});
  const lo=roomOrigin('library');addEnt({type:'nook',x:lo.x+4*16+8,y:lo.y+9*16+12});
  const ao=roomOrigin('artist');addEnt({type:'easel',x:ao.x+7*16+8,y:ao.y+6*16+14,solid:true,w:14});
  const o=raceOrigin();addEnt({type:'vane',x:(o.c+16+14)*16+8,y:(o.r+4)*16+12,solid:true,w:10});
  const fo=roomOrigin('ducks'),b=G.flags.baby,on=!!(b&&b.on&&!b.fail&&!b.done);
  [[6,7],[7,8],[9,7],[10,8]].forEach(([c,r],i)=>{const hx=fo.x+c*16+8,hy=fo.y+r*16+12;
    addEnt({type:'cduck',i,hx,hy,x:on?P.x:hx,y:on?P.y:hy,mode:on?'follow':'home',lost:0,flip:false,ph:i*11});});
  for(const [id,c,r] of [['seed_harbor',72,73],['seed_park',68,70]])spawnItem(id,'seed',c*16+8,r*16+12);
  placeDecor();
  updateSchedules(true);
}
