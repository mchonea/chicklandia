import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/entities/sprites.js',[["    if(gold){put(cx-rx-6.6,wy,'w');","    if(gold){ell(cx-rx-3.4,wy-0.7,2.2,0.8,'n');ell(Wd-(cx-rx-3.4),wy-0.7,2.2,0.8,'n');put(cx-rx-6.6,wy,'w');"]]);
