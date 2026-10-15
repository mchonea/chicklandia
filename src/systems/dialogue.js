'use strict';
/* ---------------- dialogue engine: say/talkTo/hints/rewards. Lines live in src/content/. ---------------- */
function hint(){
  if(G.part2)return hint2();
  if(G.q.mom===2&&rankFull()&&nextRank().gateHint)return nextRank().gateHint;
  if(G.q.mom<2)return "Peck 3 worms in the dirt patches!";
  if(G.skills.size===0)return "Press E to open your Growth Tree and spend your seeds!";
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===1&&G.train[k]===1)return t.hint();}
  for(const id of ORDER){if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[id]+" the good news!";}
  for(const id of ORDER){if(G.q[id]===0&&!G.met.has(id))return INTRO_HINT[id];}
  for(const id of ORDER){if(G.q[id]===1)return QUESTS[id].hint();}
  if(!has('fly'))return "You've grown so much! Keep spending seeds in your Growth Tree until you learn FLIGHT!";
  return "Go on, fly over that Big Fence! Mama is so proud of you!";
}
function reward(n,id){const base=n;if(wearing('crown'))n++;addSeeds(n,(ORDER2.includes(id)||ORDER3.includes(id)||ORDER4.includes(id)||ORDER5.includes(id)||ORDER6.includes(id))?2:1,(ORDER3.includes(id)||ORDER4.includes(id)||ORDER5.includes(id)||ORDER6.includes(id))?0:base);G.q[id]=2;SFX.questDone();toast('+'+n+' SEEDS!');questGP(id);save();}
function say(lines,onEnd){lines.forEach(l=>l.text=tt(l.text));dlg={lines,i:0,shown:0,onEnd};state='talk';}
function talkTo(e){
  const L=[];const it=(t,fx)=>L.push({who:e,text:t,fx});const me=t=>L.push({who:'me',text:t});
  if(e.id==='duck'||e.id==='rooster')e.flip=P.x>e.x;
  G.met.add(e.id);
  if(e.deco){it(['Baa.','Baaa?','*munch munch*','Baa baa!'][(Math.random()*4)|0]);say(L);return;}
  if(talkP2(e,it)){say(L);return;}
  if(deliverJob(e,it)||returnBorrowed(e,it)){say(L);return;}
  if(e.sib){
    if(e.home){it(e.sib.homeLine);say(L);return;}
    if(G.q.penny===0){it("Shhh! We're playing hide-and-seek! Go talk to Penny in the coop if you want to play!");say(L);return;}
    it(e.sib.found);
    say(L,()=>{puff(e.x,e.y-6,10,['#ffd83a','#fff8ec']);G.sibs.push(e.id);e.home=true;Object.assign(e,at(...((G.coop&&G.coop.lv>=3)?FAMILY_POS[e.id]:e.sib.home)));SFX.chirp();
      toast(G.sibs.length>=3?'Found all 3! Go tell Penny.':'Found '+e.name+'! ('+G.sibs.length+'/3)');save();});
    return;
  }
  const ask=(t,choices,cb)=>L.push({who:e,text:t,choices,cb});
  const spec=TALK[e.id];if(spec&&spec(e,{it,me,ask})!==false){say(L);return;}
  let qid=QUEST_OF[e.id]||e.id;const base=qid;
  {let prev=base;for(const fq of [].concat(FOLLOWUP[e.id]||[])){if(G.q[prev]!==2)break;if(G.q[fq]!==2){if((!FOLLOW_GATE[e.id]||FOLLOW_GATE[e.id]())&&(!FOLLOW_GATE[fq]||FOLLOW_GATE[fq]()))qid=fq;break;}prev=fq;}}
  if(qid===base&&trainTalk(e,it)){say(L);return;}
  const q=QUESTS[qid];if(!q)return;
  const pushLine=l=>typeof l==='string'?it(l):(l.me?me(l.me):it(l.t,l.fx));
  const doneLines=()=>{q.done.forEach((l,i)=>it(l,i===q.done.length-1?()=>{if(q.onDone)q.onDone();reward(q.reward,qid);}:null));(q.post||[]).forEach(pushLine);};
  if(G.q[qid]===0){q.intro.forEach(pushLine);G.q[qid]=1;if(q.check())doneLines();}
  else if(G.q[qid]===1){if(q.check())doneLines();else it(q.remind());}
  else q.after().forEach(pushLine);
  say(L);
}
function speakerPos(who){
  if(who==='me'){const s=getChick(stage(),0,0,false);return {x:P.x-camX,top:P.y-camY+HUD+2-s.height-P.z,bot:P.y-camY+HUD+3,name:'PIP',voice:900};}
  if(who.type){const s=SPR[who.spr];return {x:who.x-camX,top:who.y-camY+HUD+2-s.height,bot:who.y-camY+HUD+3,name:who.name,voice:who.voice};}
  return {x:who.x-camX,top:who.y-camY+HUD,bot:who.y-camY+HUD+16,name:who.name,voice:300};
}
function updateTalk(){
  const d=dlg,line=d.lines[d.i];
  if(!line.started){line.started=true;if(line.fx)line.fx();}
  if(d.shown<line.text.length){
    const before=Math.floor(d.shown);d.shown=Math.min(line.text.length,d.shown+TEXT_SPEED_MUL[SET.speed]);
    if(Math.floor(d.shown)!==before&&before%3===0&&line.text[before]!==' '){const sp=speakerPos(line.who);SFX.blip(sp.voice+((before*37)%60));}
    if(pressed.a)d.shown=line.text.length;
  }else if(line.choices){
    if(pressed.back){dlg=null;state='play';SFX.menu();return;}
    if(pressed.left||pressed.right||pressed.up||pressed.down){d.sel=(d.sel||0)^1;SFX.menu();}
    if(pressed.a){const cb=line.cb,sel=d.sel||0;dlg=null;state='play';SFX.pick();if(cb)cb(sel);}
  }else if(pressed.a||pressed.back){
    d.i++;d.shown=0;SFX.menu();
    if(d.i>=d.lines.length){dlg=null;state='play';if(d.onEnd)d.onEnd();}
  }
}


/* ---- city doors ---- */
function closedSign(b){
  SFX.deny();say([{who:{x:b.door[0]*16+8,y:b.door[1]*16,name:'SIGN'},text:b.name+': CLOSED. '+(b.hours==='dawn'?'Open from sunrise until evening!':'Come back in the daytime!')}]);
}
function enteredBuilding(b){if(!G.flags.visited)G.flags.visited={};if(!G.flags.visited[b.id]){G.flags.visited[b.id]=1;}if(b.id==='artist')G.flags.posed=false;}
