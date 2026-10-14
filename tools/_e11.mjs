import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
const o=JSON.parse(fs.readFileSync('src/order.json','utf8'));
if(!o.includes('systems/hazards.js'))o.splice(o.indexOf('systems/part2.js')+1,0,'systems/hazards.js');
fs.writeFileSync('src/order.json',JSON.stringify(o,null,1));
ed('src/systems/hazards.js',[["SFX.honk&&0;",""],["SFX.hop&&0;",""]]);
ed('src/engine/state.js',[
 ["  for(const k in TRAIN)if(G.train[k]===1)spawnTrain(k);\n}","  makeHazards();\n  for(const k in TRAIN)if(G.train[k]===1)spawnTrain(k);\n}"],
 ["function resetEnemies(){\n","function resetEnemies(){\n  resetHazards();\n"]]);
ed('src/systems/actions.js',[
 ["    if(e.type==='fox')updFox(e);else if(e.type==='goose')updGoose(e);else if(e.type==='item')updItem(e);else if(e.type==='puff')updPuff(e);",
  "    if(e.type==='fox')updFox(e);else if(e.type==='goose')updGoose(e);else if(e.type==='item')updItem(e);else if(e.type==='puff')updPuff(e);\n    else if(e.type==='bees')updBees(e);else if(e.type==='snowball')updBall(e);else if(e.type==='crab')updCrab(e);"],
 ["  for(const e of ents){\n    if(e.type==='worm'&&Math.abs(e.x-f.x)<12","  for(const e of ents){\n    if(hazardPeck(e,f,pr))return;\n    if(e.type==='worm'&&Math.abs(e.x-f.x)<12"],
 ["  for(const e of ents){\n    if(!((e.type==='fox'&&!e.gone)||(e.type==='goose'&&!e.blown)))continue;","  hazardFlap(dx,dy);\n  for(const e of ents){\n    if(!((e.type==='fox'&&!e.gone)||(e.type==='goose'&&!e.blown)))continue;"]]);
ed('src/ui/render.js',[["    case 'worm':{","    case 'hive':case 'bees':case 'snowball':case 'crab':case 'spot':drawHaz(e,sx,sy);break;\n    case 'worm':{"]]);
