import fs from 'fs';let s=fs.readFileSync('src/systems/actions.js','utf8');
const a="e=cl.region.id==='coop'?coopExit():(cl.region.id==='rooms'?EXITS:EXITS3)[cl.gx];";
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,"e=cl.region.id==='coop'?coopExit():cl.region.id==='cityin'?BUILDING_BY_ROOM[cl.id].out:(cl.region.id==='rooms'?EXITS:EXITS3)[cl.gx];");
fs.writeFileSync('src/systems/actions.js',s);
