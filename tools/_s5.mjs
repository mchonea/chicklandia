import fs from 'fs';
const BS=String.fromCharCode(92),Q="'";
let s=fs.readFileSync('src/regions/seas.js','utf8');
s=s.split(Q+BS+Q).join(Q+BS+BS+Q);          // '\'  ->  '\\'
fs.writeFileSync('src/regions/seas.js',s);
let t=fs.readFileSync('src/world/tilemap.js','utf8');
t=t.replace("456)"+BS+Q+".split('')","456)"+BS+BS+Q+".split('')");
t=t.replace("case "+Q+BS+Q+":img=TILE.wreck","case "+Q+BS+BS+Q+":img=TILE.wreck");
fs.writeFileSync('src/world/tilemap.js',t);
