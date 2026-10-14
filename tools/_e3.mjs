import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/engine/state.js',[
 ["function strawBonus(x,y){if(wearing('straw')&&Math.random()<0.25){G.seeds++;","function strawBonus(x,y){if(wearing('straw')&&Math.random()<0.25){G.seeds++;G.earned++;"],
 ["function save(){\n  if(!G)return;","function save(){\n  if(!G)return;titleSave=undefined;"],
 ["let growSel=0,","let titleSave,titleConfirm=false,confirmSel=1;\nlet growSel=0,"]]);
ed('src/content/quests.js',[["Object.assign(e,at(...e.sib.home));SFX.chirp();","Object.assign(e,at(...((G.coop&&G.coop.lv>=3)?FAMILY_POS[e.id]:e.sib.home)));SFX.chirp();"]]);
ed('src/systems/part2.js',[["delete G.plots[e.id];G.seeds+=3;G.harvests++;","delete G.plots[e.id];addSeeds(3,2,0);G.harvests++;"]]);
ed('src/ui/growth.js',[
 ["function titleOptions(){return loadSave()?['CONTINUE','NEW GAME']:['NEW GAME'];}\nfunction updateTitle(){\n  const opts=titleOptions();",
  "function titleOptions(){if(titleSave===undefined)titleSave=!!loadSave();return titleSave?['CONTINUE','NEW GAME']:['NEW GAME'];}\nfunction updateTitle(){\n  const opts=titleOptions();\n  if(titleConfirm){\n    if(pressed.up||pressed.down||pressed.left||pressed.right){confirmSel^=1;SFX.menu();}\n    if(pressed.back||pressed.b){titleConfirm=false;SFX.menu();}\n    else if(pressed.a){SFX.pick();titleConfirm=false;if(confirmSel===0)newGame();}\n    return;}"],
 ["if(opts[titleSel]==='CONTINUE')continueGame();else newGame();}","if(opts[titleSel]==='CONTINUE')continueGame();else if(titleSave){titleConfirm=true;confirmSel=1;}else newGame();}"],
 ["  if(FT===50){P=newPlayer(56,76);CS={x:0,y:0};camX=0;camY=0;G.hearts=maxHearts();resetEnemies();TRAIL=[];",
  "  if(FT===50){const far=G.part2&&P.y>=48*16,sp=far?(G.coop?coopExit():{x:136,y:1067}):{x:56,y:76};\n    P=newPlayer(sp.x,sp.y);CS={x:Math.floor(sp.x/256),y:Math.floor(sp.y/192)};camX=CS.x*256;camY=CS.y*192;G.hearts=maxHearts();resetEnemies();TRAIL=[];FAINT_FAR=far;"],
 ["  if(FT>=100){state='play';const m=ents.find(e=>e.id==='mom');say([{who:m,text:\"Oh my! You came home all tuckered out, sweet pea. Rest up... there, all better!\"}]);}",
  "  if(FT>=100){state='play';const m=ents.find(e=>e.id==='mom');\n    if(!FAINT_FAR&&m&&onCur(m))say([{who:m,text:\"Oh my! You came home all tuckered out, sweet pea. Rest up... there, all better!\"}]);\n    else say([{who:'me',text:FAINT_FAR?(G.coop?\"Phew... I made it back to my coop. I feel much better!\":\"Phew... I'm back at the forest. I feel much better!\"):\"Phew... back home. I feel much better!\"}]);}"],
 ["function updateFaint(){","let FAINT_FAR=false;\nfunction updateFaint(){"]]);
ed('src/ui/render.js',[["  txt(TOUCH?'Tap the screen or A to start!'","  if(titleConfirm){box(36,78,184,62,'#241838','#ffd83a');\n    txt('Start over?',W/2,86,8,'#ffd83a',{align:'center'});txt('Your saved game will be erased.',W/2,102,5,'#fff8ec',{align:'center'});\n    ['Yes','No'].forEach((o,i)=>txt((confirmSel===i?'> ':'  ')+o,W/2-30+i*60,120,8,confirmSel===i?'#fff8ec':'#8a7ab0',{align:'center',shadow:confirmSel===i}));return;}\n  txt(TOUCH?'Tap the screen or A to start!'"]]);
