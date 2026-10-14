import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/systems/actions.js',[["if(CS.y<2)G.visited.add(CS.x+','+CS.y);resetEnemies();TRAIL=[];","if(CS.y<2||CS.y>=4)G.visited.add(CS.x+','+CS.y);resetEnemies();TRAIL=[];"]]);
ed('src/ui/render.js',[
 ["  txt('E:GROW',160,6,6,'#d8c8f8');txt('Q:QUESTS',160,19,6,'#d8c8f8');","  if(CS.y<4){txt('E:GROW',160,6,6,'#d8c8f8');txt('Q:QUESTS',160,19,6,'#d8c8f8');}"],
 ["  if(CS.y>=4){const a=areaOf();txt(AREA_LABEL[a],232,7,5,'#94dc64',{align:'center'});txt(a==='coop'?'HOME':'F: FLY',232,18,5,'#ffd83a',{align:'center'});return;}",
  "  if(CS.y>=4){const a=areaOf();txt(AREA_LABEL[a],220,7,5,'#94dc64',{align:'right'});txt(a==='coop'?'HOME':'F: FLY',220,18,5,'#ffd83a',{align:'right'});\n    for(let y=4;y<7;y++)for(let x=0;x<3;x++){const cur=CS.x===x&&CS.y===y,vis=G.visited.has(x+','+y);\n      ctx.fillStyle=cur?(Math.floor(tick/20)%2?'#ffd83a':'#ffb020'):(vis?'#6a5a90':'#3b2a56');ctx.fillRect(224+x*10,3+(y-4)*9,9,8);}\n    return;}"]]);
