import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/world/regions.js',[
 ["function defineRegion(d){REGIONS[d.id]=d;REGION_LIST.push(d);}",
  `function defineRegion(d){REGIONS[d.id]=d;REGION_LIST.push(d);}
// map-making helpers for region files. grid(fill, ops): ['r',c0,r0,c1,r1,ch] fills a rectangle, ['p',c,r,ch] sets one tile.
function grid(fill,ops=[],w=16,h=12){
  const g=[...Array(h)].map(()=>Array(w).fill(fill));
  for(const o of ops){if(o[0]==='r'){for(let r=o[2];r<=o[4];r++)for(let c=o[1];c<=o[3];c++)g[r][c]=o[5];}else g[o[2]][o[1]]=o[3];}
  return g.map(r=>r.join(''));
}
// a one-screen room: walls on top and bottom, windows, an exit at the bottom; floor spans cols 2-13, rows 3-10
function room(ops=[],floor='_'){
  const base=['################','################','##i###i##i###i##',...Array(8).fill('##'+floor.repeat(12)+'##'),'#######XX#######'];
  return grid('#',[['r',0,0,15,11,'#'],...base.flatMap((row,r)=>[...row].map((ch,c)=>['p',c,r,ch])),...ops]);
}`],
 ["      const cell={region:r,sx:cx,sy:cy,gx,gy,i,rows:r.screens[i],kind:(r.kinds&&r.kinds[i])||r.kind,label:r.labels&&r.labels[i]};",
  "      const sc=r.screens[i];if(!sc)continue;const meta=Array.isArray(sc)?{}:sc;\n      const cell={region:r,sx:cx,sy:cy,gx,gy,i,rows:Array.isArray(sc)?sc:sc.rows,meta,id:meta.id,kind:meta.kind||(r.kinds&&r.kinds[i])||r.kind,label:meta.label||(r.labels&&r.labels[i])};"]]);
