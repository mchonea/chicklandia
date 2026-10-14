import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
const o=JSON.parse(fs.readFileSync('src/order.json','utf8'));
o.splice(o.indexOf('engine/audio.js'),0,'engine/settings.js');o.splice(o.indexOf('ui/render.js'),0,'ui/pause.js');
fs.writeFileSync('src/order.json',JSON.stringify(o,null,1));
ed('src/engine/audio.js',[
 ["let AC=null,master=null,","let AC=null,master=null,sfxBus=null,"],
 ["master.connect(AC.destination);\n    musicGain=AC.createGain();musicGain.gain.value=musicOn?1:0;musicGain.connect(master);","master.connect(AC.destination);\n    sfxBus=AC.createGain();sfxBus.connect(master);\n    musicGain=AC.createGain();musicGain.connect(master);applyVolumes();"],
 ["function tone(","function applyVolumes(){if(musicGain)musicGain.gain.value=musicOn?SET.music/10:0;if(sfxBus)sfxBus.gain.value=SET.sound/10;}\nfunction tone("],
 ["g.connect(dest||master);","g.connect(dest||sfxBus);"],
 ["g.connect(master);s.start(t);s.stop(t+d+0.05);","g.connect(sfxBus);s.start(t);s.stop(t+d+0.05);"],
 ["rainGain.connect(master);","rainGain.connect(sfxBus);"]]);
ed('src/main.js',[
 ["if(musicGain)musicGain.gain.value=musicOn?1:0;","applyVolumes();"],
 ["    case 'grow':","    case 'pause':updatePause();break;\n    case 'grow':"]]);
ed('src/engine/input.js',[["Escape:'back',","Escape:'back',KeyP:'pause',"]]);
ed('src/systems/actions.js',[["  if(pressed.grow){openGrow();return;}\n  if(pressed.quest)","  if(pressed.pause||pressed.back){openPause();return;}\n  if(pressed.grow){openGrow();return;}\n  if(pressed.quest)"]]);
ed('src/content/quests.js',[["d.shown+0.85)","d.shown+TEXT_SPEED_MUL[SET.speed])"]]);
ed('src/ui/render.js',[
 ["function txt(s,x,y,size=7,color='#fff8ec',o={}){TQ.push(","function txt(s,x,y,size=7,color='#fff8ec',o={}){if(SET.big&&size<7)size+=1;TQ.push("],
 ["    else if(state==='quests'){TQ=[];drawQuests();}","    else if(state==='quests'){TQ=[];drawQuests();}\n    else if(state==='pause'){TQ=[];drawPause();}"]]);
ed('tools/shell.html',[['<button data-k="back">&#10005;</button>','<button data-k="pause">&#9776;</button><button data-k="back">&#10005;</button>']]);
