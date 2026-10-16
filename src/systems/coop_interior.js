'use strict';
function coopFloor(){const id=regionAt()?.id;return id==='coop'?'home':id==='cooploft'?'loft':null;}
function coopRoomAt(x,y){const id=regionOfPos(x,y)?.id;return id==='coop'?'home':id==='cooploft'?'loft':null;}
function drawCoopTile(c,r,sx,sy,floor){const o=coopRoomOrigin(floor);ctx.drawImage(COOP_INTERIOR_ART.ground(floor,G.coop?.lv||1),c*16-o.x,r*16-o.y,16,16,sx,sy,16,16);}
function coopInteriorBlocked(b){
 const floor=coopRoomAt(b.x+b.w/2,b.y+b.h/2);if(!floor)return null;
 const lv=G.coop?.lv||1;if(floor==='loft'&&(!G.coop||lv<2))return true;
 const o=coopRoomOrigin(floor),x=b.x-o.x,y=b.y-o.y,edge=lv===1?29:21,local={x,y,w:b.w,h:b.h};
 if(x<edge||x+b.w>256-edge||y<54||y+b.h>192)return true;
 if(y+b.h>176&&(floor==='loft'||x<116||x+b.w>140))return true;
 return coopRoomProps(floor,lv).some(p=>ov(local,{x:p.x+p.hit[0],y:p.y+p.hit[1],w:p.hit[2],h:p.hit[3]}));
}
function makeCoopInteriorEnts(){
 ents=ents.filter(e=>e.type!=='coopprop');if(!G.coop)return;
 for(const floor of G.coop.lv>=2?['home','loft']:['home']){const o=coopRoomOrigin(floor);for(const p of coopRoomProps(floor,G.coop.lv))addEnt({type:'coopprop',id:'coop_'+floor+'_'+p.id,prop:p,floor,x:o.x+p.x+p.w/2,y:o.y+p.y+p.h,solid:false});}
}
function drawCoopProp(e){
 const p=e.prop,lv=G.coop?.lv||1,earned=p.trophy?!!p.trophy.earned():false,o=coopRoomOrigin(e.floor),x=o.x+p.x-camX,y=o.y+p.y-camY+HUD;
 drawImg(COOP_INTERIOR_ART.prop(p,lv,earned),x,y);
 if(p.kind==='display'&&earned&&(tick+COOP_TROPHIES.indexOf(p.trophy)*11)%90<9){coastRect(ctx,'#fff8ec',x+20,y+4,1,3);coastRect(ctx,'#fff8ec',x+19,y+5,3,1);}
 if(p.kind==='hearth'){coastRect(ctx,tick%18<9?'#ffe05a':'#fff8ec',x+18,y+25-(tick%18<9?2:0),2,8);}
}
function coopStairsReady(dir){
 const floor=coopFloor();if(!floor||!G.coop)return false;const o=coopRoomOrigin(floor),x=P.x-o.x,y=P.y-o.y;
 return x>=194&&x<=222&&(floor==='home'?G.coop.lv>=2&&dir===1&&y>=106&&y<=126:dir===0&&y>=124&&y<=144);
}
function useCoopStairs(){const up=coopFloor()==='home',o=coopRoomOrigin(up?'loft':'home');warpTo(o.x+208,o.y+(up?132:116),up?1:0);}
function coopBump(dx,dy){if(dy&&coopStairsReady(dy<0?1:0)){useCoopStairs();return true;}return false;}
function coopFacingProp(f){
 const floor=coopFloor();if(!floor||!G.coop)return null;const o=coopRoomOrigin(floor);
 return coopRoomProps(floor,G.coop.lv).filter(p=>['display','nests'].includes(p.kind)||p.id==='future').find(p=>f.x-o.x>=p.x-4&&f.x-o.x<=p.x+p.w+4&&f.y-o.y>=p.y+(p.kind==='display'?14:0)-4&&f.y-o.y<=p.y+p.h+5);
}
function coopActionLabel(){
 if(coopStairsReady(P.dir))return coopFloor()==='home'?'UP':'DOWN';
 const p=coopFacingProp(frontPoint());return p?(p.kind==='nests'?'REST':'LOOK'):null;
}
function coopInteriorAction(f){
 if(!coopFloor()||!G.coop)return false;
 if(coopStairsReady(P.dir)){useCoopStairs();return true;}
 const p=coopFacingProp(f);if(!p)return false;
 if(p.kind==='nests'){trySleep();return true;}
 if(p.id==='future'){say([{who:'me',text:'A cozy reading corner for now. The level 2 coop upgrade adds stairs to my own upstairs trophy room!'}]);return true;}
 const t=p.trophy,earned=!!t.earned(),o=coopRoomOrigin('loft');
 say([{who:{x:o.x+p.x+p.w/2,y:o.y+p.y-10,name:t.name},text:earned?'EARNED! '+(typeof t.story==='function'?t.story():t.story):'A place for the '+t.name+' trophy. '+t.hint()}]);return true;
}
function drawCoopInteriorDetails(){
 if(coopFloor()!=='loft')return;const earned=COOP_TROPHIES.filter(t=>t.earned()).length;
 txt('HONORS '+earned+'/'+COOP_TROPHIES.length,26,HUD+186,5,'#ead6aa');
 const label=coopActionLabel();if(label)txt(label==='DOWN'?'Z: downstairs':'Z: inspect',230,HUD+186,5,'#fff8ec',{align:'right'});
}
function restoreCoopInteriorLanding(){
 const floor=coopFloor();if(!floor)return;
 if(!G.coop||floor==='loft'&&G.coop.lv<2){const o=coopRoomOrigin('home');if(G.coop){P.x=o.x+128;P.y=o.y+171;}else{P.x=132;P.y=1068;}CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;return;}
 const o=coopRoomOrigin(floor),clear=(x,y)=>x>=o.x+26&&x<=o.x+230&&y>=o.y+60&&y<=o.y+174&&!coopInteriorBlocked(pBox(x,y))&&!ents.some(e=>e.solid&&ov(pBox(x,y),entBox(e)));
 if(clear(P.x,P.y))return;const ox=P.x,oy=P.y;
 for(let d=4;d<=256;d+=4)for(let dy=-d;dy<=d;dy+=4)for(const dx of Math.abs(dy)===d?Array.from({length:d/2+1},(_,i)=>-d+i*4):[-d,d])if(clear(ox+dx,oy+dy)){P.x=ox+dx;P.y=oy+dy;return;}
 P.x=o.x+128;P.y=o.y+168;
}
