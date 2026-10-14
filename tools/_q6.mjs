import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
let s=fs.readFileSync('src/ui/render.js','utf8');
const a=s.indexOf("  if(inBeyond()){const a=areaOf();");
const b=s.indexOf("    return;}",a)+"    return;}".length;
if(a<0||b<a)console.log('MISSING minimap');
const neu=`  if(inBeyond()){
    const cl0=cellAt(),rid=cl0.region.id;
    if(rid==='cityin'||rid==='rooftops'){txt(rid==='rooftops'?'ROOFTOPS':'INSIDE',252,7,5,'#b8a8d8',{align:'right'});txt(rid==='rooftops'?'RACE!':cl0.label,252,18,5,'#ffd83a',{align:'right'});return;}
    const a=areaOf();txt(AREA_LABEL[a],220,7,5,'#94dc64',{align:'right'});txt(a==='coop'?'HOME':'F: FLY',220,18,5,'#ffd83a',{align:'right'});
    // minimap of the whole beyond-the-farm overworld (outdoor areas plus the coop room)
    const cs=MINIMAP_BEYOND(),w=Math.min(9,Math.floor(30/cs.cols)),h=Math.min(8,Math.floor(27/cs.rows));
    for(const c of cs.cells){const cur=CS.x===c.sx&&CS.y===c.sy,vis=G.visited.has(c.sx+','+c.sy);
      ctx.fillStyle=cur?(Math.floor(tick/20)%2?'#ffd83a':'#ffb020'):(vis?'#6a5a90':'#3b2a56');ctx.fillRect(224+(c.sx-cs.x0)*(w+1),3+(c.sy-cs.y0)*(h+1),w,h);}
    return;}`;
s=s.slice(0,a)+neu+s.slice(b);
s+="\nlet _mmCache=null;\nfunction MINIMAP_BEYOND(){\n  if(_mmCache)return _mmCache;\n  const cells=REGION_LIST.filter(r=>r.beyond&&r.area).flatMap(r=>r.cells);\n  const xs=cells.map(c=>c.sx),ys=cells.map(c=>c.sy),x0=Math.min(...xs),y0=Math.min(...ys);\n  return _mmCache={cells,x0,y0,cols:Math.max(...xs)-x0+1,rows:Math.max(...ys)-y0+1};\n}\n";
fs.writeFileSync('src/ui/render.js',s);
