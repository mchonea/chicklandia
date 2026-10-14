import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/systems/city2.js',[["  if(!G.flags.poses)G.flags.poses=[];\n  const k=poseKey();","  if(!G.flags.poses)G.flags.poses=[];\n  if(G.flags.poses.length>=3)return false;\n  const k=poseKey();"]]);
