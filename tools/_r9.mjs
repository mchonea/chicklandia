import fs from 'fs';let s=fs.readFileSync('src/systems/city2.js','utf8');
s=s.replace("secs=Math.round(r.t/60);","secs=Math.max(1,Math.round(r.t/60));").replace("[[3,4],[3,7],[7,5],","[[4,3],[3,7],[7,5],");
fs.writeFileSync('src/systems/city2.js',s);
