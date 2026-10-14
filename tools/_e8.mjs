import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,70));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/entities/sprites.js',[
 ["function chickSprite(stage,dir,frame,flap){\n  const key=stage+'|'+dir+'|'+frame+'|'+flap;","function chickSprite(stage,dir,frame,flap,gold=false){\n  const WC=gold?'q':'Y',key=stage+'|'+dir+'|'+frame+'|'+flap+'|'+gold;"],
 ["ell(cx-rx-2.6,wy,4.4,2.3,'Y');ell(Wd-(cx-rx-2.6),wy,4.4,2.3,'Y');","ell(cx-rx-2.6,wy,4.4,2.3,WC);ell(Wd-(cx-rx-2.6),wy,4.4,2.3,WC);\n    if(gold){put(cx-rx-6.6,wy,'w');put(Wd-1-Math.floor(cx-rx-6.6),wy,'w');put(cx-rx-5.6,wy+1,'Q');put(Wd-1-Math.floor(cx-rx-5.6),wy+1,'Q');}"],
 ["if(side&&!flap)ell(cx+S*0.14,by+0.3,rx*0.5,ry*0.6,'Y');","if(side&&!flap){ell(cx+S*0.14,by+0.3,rx*0.5,ry*0.6,WC);if(gold)put(cx+S*0.14-1,by+ry*0.5,'w');}"],
 ["ell(cx-rx+1.3,by+0.5,1.6,ry*0.62,'Y');ell(Wd-(cx-rx+1.3),by+0.5,1.6,ry*0.62,'Y');}","ell(cx-rx+1.3,by+0.5,1.6,ry*0.62,WC);ell(Wd-(cx-rx+1.3),by+0.5,1.6,ry*0.62,WC);\n    if(gold){put(cx-rx+0.5,by-ry*0.4,'w');put(Wd-1-Math.floor(cx-rx+0.5),by-ry*0.4,'w');}}"],
 ["function getChick(stage,dir,frame,flap){return dir===3?flipOf(chickSprite(stage,2,frame,flap)):chickSprite(stage,dir,frame,flap);}","function getChick(stage,dir,frame,flap){const g=has('golden');return dir===3?flipOf(chickSprite(stage,2,frame,flap,g)):chickSprite(stage,dir,frame,flap,g);}"]]);
ed('src/systems/world.js',[["const base=chickSprite(st,dir===3?2:dir,fr,flap),","const base=chickSprite(st,dir===3?2:dir,fr,flap,has('golden')),"]]);
