import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/entities/sprites.js',[
 ["ell(cx+S*0.14,by+0.3,rx*0.5,ry*0.6,WC)","ell(cx+S*0.14,by+0.3,rx*0.5,ry*0.6,gold?'Q':'Y')"],
 ["ell(cx-rx+1.3,by+0.5,1.6,ry*0.62,WC);ell(Wd-(cx-rx+1.3),by+0.5,1.6,ry*0.62,WC);","ell(cx-rx+1.3,by+0.5,1.6,ry*0.62,gold?'Q':'Y');ell(Wd-(cx-rx+1.3),by+0.5,1.6,ry*0.62,gold?'Q':'Y');"]]);
