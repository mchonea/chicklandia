import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
const rd=f=>fs.readFileSync(f,'utf8');
// ---- dialogue: hooks, follow-up quests, city hints ----
ed('src/systems/dialogue.js',[
 ["  if(talkP2(e,it)){say(L);return;}","  if(talkP2(e,it)){say(L);return;}\n  if(deliverJob(e,it)||returnBorrowed(e,it)){say(L);return;}"],
 ["  const q=QUESTS[e.id];if(!q)return;","  let qid=e.id;if(FOLLOWUP[e.id]&&G.q[e.id]===2&&G.q[FOLLOWUP[e.id]]!==2)qid=FOLLOWUP[e.id];\n  const q=QUESTS[qid];if(!q)return;"],
 ["reward(q.reward,e.id);}:null));","reward(q.reward,qid);}:null));"],
 ["  if(G.q[e.id]===0){q.intro.forEach(pushLine);G.q[e.id]=1;if(q.check())doneLines();}\n  else if(G.q[e.id]===1){if(q.check())doneLines();else it(q.remind());}","  if(G.q[qid]===0){q.intro.forEach(pushLine);G.q[qid]=1;if(q.check())doneLines();}\n  else if(G.q[qid]===1){if(q.check())doneLines();else it(q.remind());}"]]);
ed('src/systems/ranks.js',[["function questGP(id){gainGP(ORDER2.includes(id)?GP.quest2:GP.quest1);}","function questGP(id){gainGP(ORDER3.includes(id)?GP.quest3:ORDER2.includes(id)?GP.quest2:GP.quest1);}"]]);
ed('src/systems/dialogue.js',[["function reward(n,id){const base=n;if(wearing('crown'))n++;addSeeds(n,ORDER2.includes(id)?2:1,base);","function reward(n,id){const base=n;if(wearing('crown'))n++;addSeeds(n,(ORDER2.includes(id)||ORDER3.includes(id))?2:1,ORDER3.includes(id)?0:base);"]]);
ed('src/systems/part2.js',[["Postmaster Pidge is the busiest bird in the city.","Postmaster Pidge works at the post office by the city gate."]]);
ed('src/content/quests_beyond.js',[["pidge:\"Postmaster Pidge is the busiest bird in the city.\"","pidge:\"Postmaster Pidge works at the post office by the city gate.\""]]);
ed('src/content/ranks.js',[["quest2:12,quest3:14,","quest2:12,quest3:14,"],
 ["{id:'snowberry',name:'SNOWBERRY',color:'#fff8ec'}];","{id:'snowberry',name:'SNOWBERRY',color:'#fff8ec'},\n  {id:'muffin',name:'CORN MUFFIN',spr:'muffin'},{id:'bun',name:'SEED BUN',spr:'sbun'},{id:'tart',name:'BERRY TART',spr:'tart'},{id:'stew',name:'WINNING STEW',color:'#e8a422'}];"]]);
ed('src/systems/ranks.js',[["  const f=FOODS.find(x=>x.id===id);toast('Tasted '","  if(wearing('chef'))gainGP(1);\n  const f=FOODS.find(x=>x.id===id);toast('Tasted '"]]);
// journal: taste log now has 11 foods - tighter rows
ed('src/ui/journal.js',[["  FOODS.forEach((f,i)=>{const y=42+i*11,got=!!G.taste[f.id];","  FOODS.forEach((f,i)=>{const y=40+i*8,got=!!G.taste[f.id];"],
 ["txt('SECRETS '+Object.keys(G.secrets).length+'/'+SECRET_IDS.length,132,124,6,'#d890ff');\n  SECRET_IDS.forEach((s,i)=>txt(G.secrets[s.id]?s.name:'???',134,136+i*9,5,G.secrets[s.id]?'#fff8ec':'#4a3a66'));\n  txt('BEST SCORES',132,167,6,'#e8ff70');\n  [['EGG CATCH',G.best.egg],['CARROT BONK',G.best.bonk],['FIREFLY CATCH',G.best.ffly]].forEach(([n,v],i)=>txt(n+' '+(v||'-'),134,179+i*9,5,v?'#fff8ec':'#4a3a66'));",
  "txt('SECRETS '+Object.keys(G.secrets).length+'/'+SECRET_IDS.length,132,132,5,'#d890ff');\n  SECRET_IDS.forEach((s,i)=>txt(G.secrets[s.id]?s.name:'???',134,141+i*8,5,G.secrets[s.id]?'#fff8ec':'#4a3a66'));\n  txt('BEST SCORES',132,168,5,'#e8ff70');\n  [['EGG',G.best.egg],['BONK',G.best.bonk],['FIREFLY',G.best.ffly],['RACE',G.best.race?G.best.race+'s':0]].forEach(([n,v],i)=>txt(n+' '+(v||'-'),134,177+i*8,5,v?'#fff8ec':'#4a3a66'));"]]);
ed('src/systems/dialogue.js',[["  for(const id of ORDER2){if(G.q[id]===1)return QUESTS[id].hint();}","  for(const id of ORDER2){if(G.q[id]===1)return QUESTS[id].hint();}"]]);
ed('src/systems/part2.js',[
 ["  for(const id of ORDER2){if(G.q[id]===1)return QUESTS[id].hint();}\n","  for(const id of ORDER2){if(G.q[id]===1)return QUESTS[id].hint();}\n  for(const id of ORDER3){if(G.q[id]===1&&QUESTS[id].check())return \"Go tell \"+NAMES[QUEST_GIVER[id]||id]+\" the good news!\";}\n  for(const id of ORDER3){if(G.q[id]===1)return QUESTS[id].hint();}\n"],
 ["\"Almost there! Keep growing: garden harvests, secrets and the snack bowl all help. Then see Granny Shell.\"","\"Almost there! Keep growing: the city has shops and homes to explore, and garden harvests and the snack bowl help too.\""]]);
// ---- items collected ----
ed('src/systems/actions.js',[
 ["    case 'feather':G.items.feather++;","    case 'hat':case 'whisk':case 'collarBell':{const b=BORROWED.find(x=>x.kind===e.kind);G.items[b.item]=1;SFX.quest();toast('Found '+b.name+'! Return it.','#ff9cd0');break;}\n    case 'pepper':case 'salt':case 'mushroom':G.items[e.kind]=1;SFX.pick();toast('Got '+({pepper:'MOUNTAIN PEPPER',salt:'SEA SALT',mushroom:'a FOREST MUSHROOM'})[e.kind]+'!','#ff9cd0');break;\n    case 'seashell':case 'plume':case 'fossil':G.hold[e.kind]++;SFX.pick();toast('Found '+({seashell:'a pretty SEASHELL',plume:'a rare FEATHER',fossil:'a FOSSIL'})[e.kind]+'! Take it to the museum.','#c49a5c');break;\n    case 'feather':G.items.feather++;"],
 ["    if(hazardPeck(e,f,pr))return;","    if(hazardPeck(e,f,pr)||cityPeck(e,f,pr))return;"],
 ["  for(const e of ents){if(e.type==='bowl'&&has('fly')","  for(const e of ents){if(e.type==='nook'&&onCur(e)&&Math.abs(f.x-e.x)<16&&Math.abs(f.y-(e.y-4))<12){useNook();return;}}\n  for(const e of ents){if(e.type==='bowl'&&has('fly')"],
 ["    if(e.type==='follower'){updFollower(e);continue;}","    if(e.type==='follower'){updFollower(e);continue;}\n    if(e.type==='cduck'){updCduck(e);continue;}"],
 ["  if(checkRankUp())return;\n","  if(checkRankUp())return;\n  if(tick%30===0){updateSchedules(false);checkBuffExpiry();}\n  updateSunbeam();updateBabysit();updateRace();\n"],
 ["for(const d of ents)if((d.type==='duckling'||d.type==='follower')&&d.mode==='follow'){d.x=P.x;d.y=P.y;}\n    noteArea();","for(const d of ents)if((d.type==='duckling'||d.type==='follower'||d.type==='cduck')&&d.mode==='follow'){d.x=P.x;d.y=P.y;}\n    noteArea();"]]);
// ---- garden: plot kinds ----
ed('src/systems/part2.js',[
 ["function plotRate(e){let r=wearing('straw')?1.5:1;","function plotRate(e){const st=G.plots[e.id],kind=SEED_TYPES[(st&&st.k)||'plain'];let r=wearing('straw')?1.5:1;r*=kind.grow;if(kind.night&&nightAmt()<0.5)return 0;if(buffActive('bun'))r*=1.25;"],
 ["  if(!s){if(G.seeds<1){SFX.deny();float(e.x,e.y-16,'Need a seed!','#ff8080');return;}\n    G.seeds--;G.plots[e.id]={p:0};SFX.pop();puff(e.x,e.y-4,6,['#9a6234','#94dc64'],0.8,0.05);float(e.x,e.y-16,'Planted!','#94dc64');save();return;}",
  "  if(!s){const opts=plantChoices();if(!opts.length){SFX.deny();float(e.x,e.y-16,'Need a seed!','#ff8080');return;}\n    if(opts.length===1)plantSeed(e,opts[0]);else openPlantMenu(e,opts);return;}"],
 ["  if(s.p<1){float(e.x,e.y-16,'Growing... '+Math.floor(s.p*100)+'%','#94dc64');SFX.menu();return;}\n  const yield_=3+(G.rank>=6?1:0);","  const kd=SEED_TYPES[s.k||'plain'];\n  if(s.p<1){float(e.x,e.y-16,(kd.night&&nightAmt()<0.5?'Sleeping until night... ':'Growing... ')+Math.floor(s.p*100)+'%','#94dc64');SFX.menu();return;}\n  const yield_=kd.yield+(G.rank>=6?1:0);if(kd.petal){G.hold.petal++;toast('A rare MOON PETAL! Take it to the museum.','#e8a0d0');}\n  "],
 ["delete G.plots[e.id];addSeeds(yield_,2,0)","delete G.plots[e.id];addSeeds(yield_,2,0)"]]);
ed('src/engine/state.js',[["  S.plots.slice(0,G.coop.lv*2).forEach(([pc,pr])=>{if(tileAt(pc,pr)!=='V')setTile(pc,pr,'V');addPlot(pc,pr,true);});","  S.plots.slice(0,G.coop.lv*2).concat(extraPlotTiles()).forEach(([pc,pr])=>{if(tileAt(pc,pr)!=='V')setTile(pc,pr,'V');addPlot(pc,pr,true);});"]]);
ed('src/content/coop.js',[["plots:[[14,67],[14,68],[9,67],[10,67],[9,68],[10,68],[12,66],[13,66]]}","plots:[[14,67],[14,68],[9,67],[10,67],[9,68],[10,68],[12,66],[13,66]],extraPlots:[[14,66],[9,66],[10,66],[14,69]]}"]]);
// ---- render ----
ed('src/ui/render.js',[
 ["    case 'worm':{","    case 'fmound':case 'star':case 'flag':case 'vane':case 'cduck':case 'decor':case 'exhibit':case 'easel':case 'nook':drawCityEnt(e,sx,sy);break;\n    case 'worm':{"],
 ["    else if(state==='pause'){TQ=[];drawPause();}","    else if(state==='pause'){TQ=[];drawPause();}\n    else if(state==='catalog'){TQ=[];drawCatalog();}\n    else if(state==='plant')drawPlant();"],
 ["    else{drawMG();drawToast();","    else{drawMG();drawRaceHUD();drawToast();"],
 ["      const s=SPR.plant[st.p>=1?2:st.p>=0.33?1:0];drawImg(s,sx-(s.width>>1),sy+1-s.height);","      const s=SPR.plant[st.p>=1?2:st.p>=0.33?1:0],pk=st.k||'plain',big=pk==='giant'?(0.7+0.5*Math.min(1,st.p)):1;\n      if(big!==1){ctx.drawImage(s,Math.round(sx-s.width*big/2),Math.round(sy+1-s.height*big),Math.round(s.width*big),Math.round(s.height*big));}else drawImg(s,sx-(s.width>>1),sy+1-s.height);\n      if(pk==='moon'){ctx.fillStyle='rgba(150,170,255,'+(st.p>=1?0.5:0.25)+')';ctx.fillRect(sx-5,sy-s.height-1,10,s.height);}\n      if(pk==='speedy'&&tick%20<10){ctx.fillStyle='#ffd83a';ctx.fillRect(sx+4,sy-s.height+2,1,2);}"],
 ["  for(const b of BUILDINGS){","  drawSunbeam(cx,cy);\n  for(const b of BUILDINGS){"]]);
ed('src/main.js',[["    case 'rankup':updateRankUp();break;","    case 'rankup':updateRankUp();break;\n    case 'catalog':updateCatalog();break;\n    case 'plant':updatePlant();break;"],
 ["    case 'shop':updateShop();break;\n",""]]);
// ---- minigames hosted by the toy shop ----
ed('src/systems/world.js',[
 ["    const holes=ents.filter(e=>e.type==='hole');for(const h of holes)if(h.up>0)h.up--;","    const holes=ents.filter(e=>e.type==='hole'&&onCur(e));for(const h of holes)if(h.up>0)h.up--;"],
 ["function startEgg(){EG={px:128,","function startEgg(host){EG={host:host||'penny',px:128,"],
 ["const e=EG;EG=null;state='play';const penny=ents.find(n=>n.id==='penny'),L=[];","const e=EG;EG=null;state='play';const penny=ents.find(n=>n.id===e.host),L=[];"],
 ["    L.push({who:npc,text:key==='bonk'?","    if(m.npc==='fizz'&&!G.outfits.includes(prize))grantOutfit(prize);\n    if(m.npc==='fizz')L.push({who:npc,text:\"You won! \"+m.score+\" points. Best: \"+G.best[key]+\"!\"});\n    else if(!G.outfits.includes(prize)){grantOutfit(prize);\n      L.push({who:npc,text:key==='bonk'?"]]);
console.log('part2 done');
