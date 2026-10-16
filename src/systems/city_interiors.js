'use strict';
/* Physical furniture and the roofline course use the approved native-resolution art. */
let roofGround;
function roofAlleyAt(x,y){const px=x-1280;return y>=1401&&y<=1471&&[[176,40],[384,40],[600,40]].some(([gx,w])=>px>=gx&&px<gx+w);}
const roofPropArt=new Map();
function makeRoofScenery(){ROOF_SCENERY.forEach(([kind,args,x,y],i)=>addEnt({type:'roofprop',id:'roofprop'+i,kind,args,x:1280+x,y:1344+y,solid:false}));}
function drawRoofProp(e){
 if(!roofPropArt.has(e.id)){
  const raw=mk(768,192,g=>CITY_ROOF_ART.prop(g,e.kind,e.args));
  const a=raw.getContext('2d').getImageData(0,0,768,192).data;let x0=768,y0=192,x1=0,y1=0;
  for(let y=0;y<192;y++)for(let x=0;x<768;x++)if(a[(y*768+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  roofPropArt.set(e.id,{art:mk(x1-x0+1,y1-y0+1,g=>g.drawImage(raw,-x0,-y0)),x:x0,y:y0});
 }
 const p=roofPropArt.get(e.id);drawImg(p.art,1280+p.x-camX,1344+p.y-camY+HUD);
}
function drawCityRoomTile(c,r,sx,sy,region){
 if(region.id==='rooftops'){
  if(!roofGround)roofGround=CITY_ROOF_ART.background();
  ctx.drawImage(roofGround,(c-80)*16,(r-84)*16,16,16,sx,sy,16,16);return true;
 }
 if(region.id!=='cityin')return false;
 const cell=CELL[Math.floor(c/16)+','+Math.floor(r/12)];if(!cell?.id)return false;
 ctx.drawImage(CITY_INTERIOR_ART.art(cell.id),(c%16)*16,(r%12)*16,16,16,sx,sy,16,16);return true;
}
function cityLayoutBlocked(b){
 const region=regionOfPos(b.x+b.w/2,b.y+b.h/2);if(!region)return null;
 if(region.id==='rooftops'){
  const x=b.x-1280,y=b.y-1344;
  if(x<19||x+b.w>750||y<57||y+b.h>127)return true;
  if(!has('glide')&&[[176,40],[384,40],[600,40]].some(([gx,w])=>x<gx+w&&x+b.w>gx))return true;
  return [...ROOF_SOLIDS,...ROOF_PIPES].some(([px,py,w,h])=>ov({x,y,w:b.w,h:b.h},{x:px,y:py,w,h}));
 }
 if(region.id!=='cityin')return null;
 const cell=CELL[Math.floor((b.x+b.w/2)/256)+','+Math.floor((b.y+b.h/2)/192)];if(!cell?.id)return true;
 const x=b.x-cell.sx*256,y=b.y-cell.sy*192,local={x,y,w:b.w,h:b.h};
 if(x<21||x+b.w>235||y<53||y+b.h>192)return true;
 if(y+b.h>176&&(x<116||x+b.w>140))return true;
 return CITY_INTERIOR_ART.hits(cell.id).some(h=>ov(local,h));
}
function cityInteriorAction(f){
 if(regionAt()?.id!=='cityin'||MG)return false;
 const cell=cellAt(),ox=cell.sx*256,oy=cell.sy*192;
 // The deeper display cases keep their shopkeepers within reach from the customer side.
 if(P.dir===1)for(const e of ents){
  if(e.type!=='npc'||!onCur(e)||!['pidge','remy','maggie','grumble','bramble','fizz','olive','sheldon'].includes(e.id))continue;
  if(P.y>e.y&&P.y-e.y<62&&Math.abs(P.x-e.x)<28){talkTo(e);return true;}
 }
 const bed=CITY_INTERIOR_ART.hits(cell.id).find(b=>b.kind==='bed'&&f.x-ox>=b.x-5&&f.x-ox<=b.x+b.w+5&&f.y-oy>=b.y-5&&f.y-oy<=b.y+b.h+5);
 if(bed){trySleep();return true;}return false;
}
function roofBump(dx,dy){
 if(regionAt()?.id!=='rooftops')return false;
 const x=P.x-1280,y=P.y-1344;
 if(dy<0&&Math.abs(x-43)<18&&y>88&&y<114){const t=ROOF_STAIRS.toyDoor;warpTo(t[0]*16+8,(t[1]+1)*16+11,0);return true;}
 if(!has('hop'))return false;
 const probe={x:x+dx*10-5,y:y+dy*9-5,w:10,h:6};
 const pipe=ROOF_PIPES.find(([px,py,w,h])=>ov(probe,{x:px,y:py,w,h}));if(!pipe)return false;
 const [px,py,w,h]=pipe,tx=dx?1280+(dx>0?px+w+6:px-6):P.x,ty=dy?1344+(dy>0?py+h+6:py-2):P.y;
 if(pBlocked(tx,ty))return false;
 P.hop={x0:P.x,y0:P.y,x1:tx,y1:ty,t:0,d:26};SFX.hop();return true;
}
function placeCityInteriorCast(){
 const places={pidge:['post',156,80,'loft',196,125],rocco:[null,0,0,'rocco',174,101],remy:[null,0,0,'bistro',106,78],cleo:[null,0,0,'cleo',120,136],maggie:['boutique',156,75],grumble:['seed',158,78],bramble:['bakery',149,82],fizz:['toy',171,72],olive:['library',170,78],sheldon:['museum',130,74],pablo:['artist',58,133],waddles:['ducks',193,105],nibbles2:['bistro',173,101]};
 for(const [id,a] of Object.entries(places)){
  const e=ents.find(e=>e.id===id);if(!e)continue;
  if(a[0]){const o=roomOrigin(a[0]),x=o.x+a[1],y=o.y+a[2];Object.assign(e,{x,y});if(e.sched)e.sched.day=[(x-8)/16,(y-12)/16];}
  if(a[3]&&e.sched){const o=roomOrigin(a[3]);e.sched.night=[(o.x+a[4]-8)/16,(o.y+a[5]-12)/16];}
 }
}
function makeRoofGull(){addEnt({type:'roofgull',id:'nesting_gull',x:1620,y:1422,hx:1620,hy:1422,st:'perch',t:0,cool:90,solid:false});}
function resetRoofGull(){const e=ents.find(e=>e.type==='roofgull');if(e)Object.assign(e,{x:e.hx,y:e.hy,st:'perch',t:0,cool:90});}
function scareRoofGull(e){e.st='stunned';e.t=0;SFX.honk();puff(e.x,e.y-5,6,['#fff8ec','#ead6aa'],1,0);float(e.x,e.y-22,'SQUAWK!','#ffe05a');}
function cityFlap(dx,dy){for(const e of ents)if(e.type==='roofgull'&&onCur(e)){const x=e.x-P.x,y=e.y-P.y;if(x*dx+y*dy>-5&&x*dx+y*dy<52&&Math.abs(x*dy-y*dx)<22)scareRoofGull(e);}}
function updateRoofGull(e){
 e.t++;
 if(e.st==='perch'){
  if(e.cool>0)e.cool--;
  if(e.cool<=0&&Math.hypot(P.x-e.hx,P.y-e.hy)<88){e.st='tell';e.t=0;e.tx=clamp(P.x,1555,1652);e.ty=clamp(P.y-3,1433,1465);SFX.honk();}
 }else if(e.st==='tell'){
  if(e.t>=48){e.st='swoop';e.t=0;e.x0=e.x;e.y0=e.y;e.hit=false;}
 }else if(e.st==='swoop'){
  const p=Math.min(1,e.t/28);e.x=lerp(e.x0,e.tx,p);e.y=lerp(e.y0,e.ty,p);
  if(!e.hit&&!P.hop&&Math.hypot(P.x-e.x,P.y-4-e.y)<12){hurt(e);e.hit=true;}
  if(e.t>=28){e.st='return';e.t=0;e.x0=e.x;e.y0=e.y;}
 }else if(e.st==='return'){
  const p=Math.min(1,e.t/48);e.x=lerp(e.x0,e.hx,p);e.y=lerp(e.y0,e.hy,p);
  if(e.t>=48){e.st='perch';e.t=0;e.cool=150;}
 }else if(e.st==='stunned'&&e.t>=150){e.st='return';e.t=0;e.x0=e.x;e.y0=e.y;}
}
function drawRoofGull(e,sx,sy){
 const flying=e.st==='swoop'||e.st==='return';shadow(sx,sy+4,flying?25:18);
 CITY_ROOF_ART.gull(ctx,sx,sy-(flying?4:0),flying);
 if(e.st==='tell'){
  box(sx-6,sy-31,13,11,'#ffe05a','#202840');txt('!',sx,sy-28,6,'#202840',{align:'center'});
  ctx.save();ctx.strokeStyle='#ffe05a99';ctx.setLineDash([3,4]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx,sy+5);ctx.lineTo(e.tx-camX,e.ty-camY+HUD);ctx.stroke();ctx.restore();
 }else if(e.st==='stunned'){txt('*',sx,sy-24,7,'#ffe05a',{align:'center'});}
}
function restoreCityInteriorLanding(){
 if(!['cityin','rooftops'].includes(regionAt()?.id))return;
 if(!pBlocked(P.x,P.y))return;
 const ox=P.x,oy=P.y;
 for(let d=4;d<=256;d+=4)for(let dy=-d;dy<=d;dy+=4)for(const dx of Math.abs(dy)===d?Array.from({length:d/2+1},(_,i)=>-d+i*4):[-d,d]){
  const x=ox+dx,y=oy+dy;if(Math.floor(x/256)!==CS.x||Math.floor(y/192)!==CS.y)continue;
  if(!pBlocked(x,y)){P.x=x;P.y=y;return;}
 }
}
