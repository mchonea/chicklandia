import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/systems/part2.js',[["  if(e.id==='rocco'){it([","  if(e.id==='rocco'&&G.q.rocco===2){it(["],["  if(e.id==='cleo'){it([","  if(e.id==='cleo'&&G.q.cleo===2){it(["]]);
