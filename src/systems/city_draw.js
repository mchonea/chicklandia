'use strict';
/* Cached streets and facades; tall scenery participates in the normal depth sort. */
const CITY_GROUNDS=new Map(),CITY_PROP_ART=new Map();
function cityGround(night){
 if(!CITY_GROUNDS.has(night))CITY_GROUNDS.set(night,mk(768,384,g=>{
  for(let i=0;i<5;i++){
   g.save();g.translate(i%3*256,Math.floor(i/3)*192);g.beginPath();g.rect(0,0,256,192);g.clip();
   const paint=(k,...a)=>CITY_ART.paint(g,k,a,night),p=CITY_ART.colors;
   paint('ground');paint('stone',0,0,256,78);paint('road');
   if(i===0){paint('crossing');paint('stone',8,130,100,58);}
   if(i===1){paint('crossing');paint('rowhouses',0,67);}
   if(i===2){paint('crossing');paint('pond',17,145);}
   if(i===3){
    paint('stone',8,8,240,176,p.sand);paint('road');paint('crossing',112,0,82);paint('crossing');
   }
   if(i===4){paint('crossing',112,0,82);paint('stone',25,135,206,47,p.sand);}
   for(const b of CITY_LOTS.filter(b=>b.screen===i&&!b.rowhouse))paint('building',b.id==='rocco'?'den':b.id,b.x,b.y,b.w,b.h,(b.dc*16+8-b.x)/b.w);
   g.restore();
  }
 }));
 return CITY_GROUNDS.get(night);
}
function drawCityTile(ch,c,r,sx,sy){
 if(c>=64&&r>=72)return false;
 ctx.drawImage(cityGround(nightAmt()>.35),(c-32)*16,(r-60)*16,16,16,sx,sy,16,16);
 if(ch==='F')ctx.drawImage(TILE.fenceH,sx,sy);
 if(ch==='W'&&(tick+c*9+r)%80<28){ctx.fillStyle='#b2e7e0';ctx.fillRect(sx+5,sy+7,5,1);}
 return true;
}
function cityPropSprite(p){
 if(!CITY_PROP_ART.has(p.id)){
  const raw=mk(320,256,g=>{g.translate(32,32);CITY_ART.paint(g,p.kind,p.args);});
  const data=raw.getContext('2d').getImageData(0,0,320,256).data;let x0=320,y0=256,x1=0,y1=0;
  for(let y=0;y<256;y++)for(let x=0;x<320;x++)if(data[(y*320+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  const art=mk(x1-x0+1,y1-y0+1,g=>g.drawImage(raw,-x0,-y0));
  CITY_PROP_ART.set(p.id,{art,x:x0-32,y:y0-32});
 }
 return CITY_PROP_ART.get(p.id);
}
function makeCityScenery(){
 for(const p of CITY_PROPS){
  const ox=512+p.screen%3*256,oy=960+Math.floor(p.screen/3)*192;
  addEnt({type:'cityprop',id:p.id,p,x:ox+p.hit[0]+p.hit[2]/2,y:oy+p.hit[1]+p.hit[3],ox,oy,solid:true,w:p.hit[2]});
 }
}
function drawCityProp(e){
 const s=cityPropSprite(e.p);drawImg(s.art,e.ox+s.x-camX,e.oy+s.y-camY+HUD);
 if(e.p.kind==='lamp'&&nightAmt()>.35){ctx.fillStyle='rgba(255,224,90,.16)';ctx.fillRect(e.ox+e.p.args[0]-9-camX,e.oy+e.p.args[1]-33-camY+HUD,19,18);}
}
function drawCitySign(b,cx,cy){
 const lot=CITY_LOTS.find(l=>l.id===b.id);if(!lot)return false;
 const ox=512+lot.screen%3*256,oy=960+Math.floor(lot.screen/3)*192;
 const brand=SET.big?({artist:'ART'}[b.id]||b.sign):({rocco:'ROCCO',seed:'SEED & FEED',artist:'STUDIO',ducks:'DUCK FLAT',loft:'PIDGE'}[b.id]||b.sign);
 const label=buildingOpen(b)?brand:'CLOSED';
 const x=ox+(lot.rowhouse?lot.x+32:lot.dc*16+8)-cx,y=oy+(lot.rowhouse?32:lot.y-37)-cy+HUD;
 if(x<-60||x>W+60||y<HUD-10||y>H)return true;
 const w=Math.max(Math.ceil(measure(label,SET.big?7:5))+6,lot.rowhouse?56:Math.min(lot.w-8,label.length*3+9));
 if(x+w/2<0||x-w/2>W)return true;
 coastRect(ctx,'#202840',x-w/2,y,w,10);coastRect(ctx,buildingOpen(b)?'#ead6aa':'#ffc8c8',x-w/2+1,y+1,w-2,8);
 txt(label,x,y+2,5,buildingOpen(b)?'#594437':'#a43d43',{align:'center'});return true;
}
function restoreCityLanding(){
 if(regionAt()?.id!=='city'||CS.x===4&&CS.y===6)return;
 const ox=P.x,oy=P.y,sx=CS.x*256,sy=CS.y*192;
 const clear=(x,y)=>{const b=pBox(x,y);return x>=sx+6&&x<=sx+250&&y>=sy+6&&y<=sy+188&&!rectTiles(b.x,b.y,b.w,b.h,true)&&!ents.some(e=>e.solid&&ov(b,entBox(e)));};
 if(clear(ox,oy))return;
 for(let d=4;d<=256;d+=4)for(let dy=-d;dy<=d;dy+=4)for(const dx of Math.abs(dy)===d?Array.from({length:d/2+1},(_,i)=>-d+i*4):[-d,d]){
  if(clear(ox+dx,oy+dy)){P.x=ox+dx;P.y=oy+dy;return;}
 }
 P.x=sx+128;P.y=sy+104;
}
