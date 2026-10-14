import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/ui/render.js',[
 ["+'/'+TOTAL_SEEDS+'     Q: close'","+'/'+TOTAL_SEEDS+'   X: next page   Q: close'"],
 ["  txt(questPage===1?'QUESTS - PART 2':'QUESTS',W/2,12,9,'#ffd83a',{align:'center',shadow:true});\n  if(questPage===2){drawTrainingPage();return;}","  if(questPage===2){drawTrainingPage();return;}\n  txt(questPage===1?'QUESTS - PART 2':'QUESTS',W/2,12,9,'#ffd83a',{align:'center',shadow:true});"]]);
ed('src/main.js',[["questPage=(questPage+1)%(G.part2?3:2)===1&&!G.part2?2:(questPage+1)%(G.part2?3:2);","{const pg=G.part2?[0,1,2]:[0,2];questPage=pg[(pg.indexOf(questPage)+1)%pg.length];}"]]);
