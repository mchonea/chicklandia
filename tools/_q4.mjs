import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
let c=fs.readFileSync('src/content/city.js','utf8');
const signs={post:'POST',rocco:'DEN',bistro:'BISTRO',boutique:'BOUTIQUE',seed:'FEED',bakery:'BAKERY',toy:'TOYS',library:'LIBRARY',museum:'MUSEUM',cleo:'CLEO',artist:'ARTIST',ducks:'DUCKS',loft:'LOFT'};
for(const k in signs)c=c.replace("{id:'"+k+"',","{id:'"+k+"',sign:'"+signs[k]+"',");
fs.writeFileSync('src/content/city.js',c);
ed('src/systems/actions.js',[
 ["  if(iy<0&&WALK.has(CS.x+','+CS.y)){for(const ox of [0,-5,5]){const c=Math.floor((P.x+ox)/16),r=Math.floor((P.y-9)/16),d=DOORS[c+','+r];\n    if(d){warpTo(d.x,d.y,1);return;}}}",
  "  if(iy<0&&(WALK.has(CS.x+','+CS.y)||cellAt().kind==='indoor')){for(const ox of [0,-5,5]){const c=Math.floor((P.x+ox)/16),r=Math.floor((P.y-9)/16),d=DOORS[c+','+r];\n    if(d){if(d.b&&!buildingOpen(d.b)){closedSign(d.b);return;}warpTo(d.x,d.y,d.roof?0:1,null,d.roof?null:()=>{if(d.b)enteredBuilding(d.b);});return;}}}"],
 ["const e=cl.region.id==='coop'?coopExit():(cl.region.id==='rooms'?EXITS:EXITS3)[cl.gx];","const e=cl.region.id==='coop'?coopExit():cl.region.id==='cityin'?BUILDING_BY_ROOM[cl.id].out:(cl.region.id==='rooms'?EXITS:EXITS3)[cl.gx];"]]);
ed('src/ui/render.js',[["  if(G.coop&&G.coop.lv>=4&&regionAt().id==='coop'){const cols","  for(const b of BUILDINGS){const px=b.door[0]*16+8-cx,py=b.door[1]*16-cy+HUD;if(px<-24||px>W+24||py<HUD-16||py>H)continue;\n    const open=buildingOpen(b),lab=open?b.sign:'CLOSED',w=Math.ceil(measure(lab,5))+6;\n    ctx.fillStyle='#21142b';ctx.fillRect(Math.round(px-w/2),py-10,w,10);ctx.fillStyle=open?'#f2dca0':'#ffc8c8';ctx.fillRect(Math.round(px-w/2)+1,py-9,w-2,8);\n    txt(lab,px,py-8,5,open?'#5e3a1c':'#c02020',{align:'center'});}\n  if(G.coop&&G.coop.lv>=4&&regionAt().id==='coop'){const cols"]]);
let s=fs.readFileSync('src/systems/dialogue.js','utf8');
s+="\n/* ---- city doors ---- */\nfunction closedSign(b){\n  SFX.deny();say([{who:{x:b.door[0]*16+8,y:b.door[1]*16,name:'SIGN'},text:b.name+': CLOSED. '+(b.hours==='dawn'?'Open from sunrise until evening!':'Come back in the daytime!')}]);\n}\nfunction enteredBuilding(b){if(!G.flags.visited)G.flags.visited={};if(!G.flags.visited[b.id]){G.flags.visited[b.id]=1;}}\n";
fs.writeFileSync('src/systems/dialogue.js',s);
