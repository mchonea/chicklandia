import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/engine/state.js',[["  npc('cleo','CLEO','catO',35,78,520,12);","  npc('cleo','CLEO','catO',35,78,520,12);\n  npc('maggie2','MAGGIE','magpie',43,78,1400,12); // temporary city branch of the boutique (until Phase 3)"]]);
ed('src/content/quests.js',[["  if(e.id==='maggie'){","  if(e.id==='maggie'||e.id==='maggie2'){"]]);
