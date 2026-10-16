'use strict';
/* The art and physical forest share anchors. Saved plot IDs stay stable. */
const FOREST_GROUND=new Map();
const FOREST_PLOTS={
 plot_5_64:[53,124,29,17],plot_6_64:[91,124,29,17],
 plot_14_67:[184,183,14,16],plot_14_68:[217,183,14,16],
 plot_9_67:[198,183,14,16],plot_10_67:[231,183,14,16],
 plot_9_68:[153,125,13,14],plot_10_68:[168,125,13,14],
 plot_12_66:[153,143,13,14],plot_13_66:[168,143,13,14],
 plot_14_66:[153,161,13,14],plot_9_66:[168,161,13,14],
 plot_10_66:[153,179,13,14],plot_14_69:[168,179,13,14]
};
function forestGround(wf){
 if(!FOREST_GROUND.has(wf))FOREST_GROUND.set(wf,mk(512,192,g=>{
  for(let r=0;r<12;r++)for(let c=0;c<32;c++)g.drawImage(TILE.grass[hash2(c,r+60)%3],c*16,r*16);
  g.strokeStyle=g.createPattern(TILE.dirt,'repeat');g.lineJoin='round';g.lineCap='round';
  for(const {p,w} of FOREST_TRAILS){g.lineWidth=w;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
  const water=g.createPattern(TILE.deep[wf],'repeat');
  for(let x=256;x<512;x++){const y=forestRiverY(x);coastRect(g,PAL.G,x,y-1,1,29);g.fillStyle=water;g.fillRect(x,y,1,27);coastRect(g,PAL.c,x,y,1,1);}
  for(const [x,y] of [[27,139],[94,65],[166,43],[280,109],[452,173]])g.drawImage(TILE.flower[0],x,y);
 }));return FOREST_GROUND.get(wf);
}
function drawForestTile(c,r,sx,sy,wf){ctx.drawImage(forestGround(wf),c*16,(r-60)*16,16,16,sx,sy,16,16);return true;}
function forestBridge(x,y){return !!G.flags.dam&&x>=378&&x<410&&y>=123&&y<168;}
function forestWater(x,y){return x>=256&&x<512&&y>=forestRiverY(x)&&y<forestRiverY(x)+27&&!forestBridge(x,y);}
function forestRectBlocked(x,y,w,h,forPlayer){
 if(x<0||x+w>512||y<960||y+h>1152)return null;
 const b={x,y:y-960,w,h};
 if(FOREST_TREES.some(t=>ov(b,{x:t.x,y:t.y,w:16,h:16})))return true;
 if(ov(b,{x:24,y:54,w:58,h:30}))return true;
 if(G.coop&&ov(b,{x:180,y:135,w:54,h:25}))return true;
 if(ov(b,{x:245,y:118,w:7,h:9}))return true;
 if(!(forPlayer&&has('swim')))for(let px=Math.floor(x);px<x+w;px++)for(const py of [b.y,b.y+h-.01])if(forestWater(px,py))return true;
 return false;
}
function forestFootTile(x,y){const landscape=landscapeFootTile(x,y);if(landscape!==null)return landscape;return x>=0&&x<512&&y>=960&&y<1152?(forestWater(x,y-960)?'w':'.'):tileAt(Math.floor(x/16),Math.floor(y/16));}
function placeForestPlot(e){const p=FOREST_PLOTS[e.id];if(p){e.x=p[0];e.y=960+p[1];}}
function drawForestPlot(e,sx,sy){
 const p=FOREST_PLOTS[e.id];if(!p||regionOfPos(e.x,e.y)?.id!=='forest')return false;
 FOREST_ART.paint(ctx,'plot',sx-Math.floor(p[2]/2),sy-14,p[2],p[3],G.plots[e.id]);
 if(!G.plots[e.id]&&G.thumb&&tick%90<45){ctx.fillStyle='#fff8ec80';ctx.fillRect(sx,sy-7,1,2);}return true;
}
function makeForestEnts(){
 delete DOORS['12,68'];if(G.coop)DOORS['12,69']=COOP_IN;else delete DOORS['12,69'];
 const add=(kind,x,y,extra={})=>addEnt({type:'forestprop',kind,x,y:960+y,solid:false,...extra});
 FOREST_TREES.forEach(t=>add('tree',t.x+8,t.y+16,{tree:t}));
 add('house',53,83);add('coop',206,158);add('dam',394,167);add('sign',248,127);
 const placements={granny:[92,85],bucky:[357,118],doe:[464,111],stick0:[104,149],stick1:[291,111],spot_forest:[320,43]};
 for(const e of ents){const p=placements[e.id];if(p&&regionOfPos(e.x,e.y)?.id==='forest'){e.x=p[0];e.y=960+p[1];}if(e.type==='plot')placeForestPlot(e);}
 const fawn=ents.find(e=>e.id==='fawn'),doe=ents.find(e=>e.id==='doe');if(fawn){fawn.x=G.flags.fawn?doe.x+16:331;fawn.y=G.flags.fawn?doe.y+2:1137;}
 for(const e of ents)if(['item','spot','stump','fmound'].includes(e.type)&&regionOfPos(e.x,e.y)?.id==='forest'){
  if(!rectTiles(e.x-3,e.y-5,6,6,false))continue;
  const p=forestClearNear(e.x,e.y,false);if(p){e.x=p.x;e.y=p.y;if(e.id?.startsWith('acorn_')&&G.picked[e.id.slice(6)])G.picked[e.id.slice(6)]=[e.x,e.y,'acorn'];}
 }
}
function drawForestProp(e){
 const x=e.x-camX,y=e.y-camY+HUD;
 if(e.kind==='tree'){const t=e.tree;drawImg(t.oak&&!G.picked[t.c+','+t.r]?TILE.oak:TILE.tree,x-8,y-16);}
 else if(e.kind==='house')FOREST_ART.paint(ctx,'house',x-31,y);
 else if(e.kind==='coop'){
  if(G.coop)FOREST_ART.paint(ctx,'coop',x-28,y,G.coop.lv);
  else{for(const [dx,dy] of [[-28,-34],[26,-34],[-28,0],[26,0]]){coastRect(ctx,PAL.B,x+dx,y+dy-4,2,7);coastRect(ctx,PAL.n,x+dx,y+dy-4,2,1);}coastRect(ctx,PAL.T,x-26,y-1,51,1);}
 }else if(e.kind==='sign')drawImg(TILE.signO,x-8,y-16);
 else if(e.kind==='dam'){
  coastRect(ctx,PAL.B,x-14,y-44,3,44);coastRect(ctx,PAL.B,x+11,y-44,3,44);
  for(let yy=-42;yy<-1;yy+=6)if(G.flags.dam||yy<-27||yy>-15){coastRect(ctx,PAL.k,x-16,y+yy,32,5);coastRect(ctx,PAL.b,x-15,y+yy+1,30,3);coastRect(ctx,'#cf9865',x-14,y+yy+1,27,1);}
  if(!G.flags.dam){coastRect(ctx,PAL.b,x-12,y-22,15,3);coastRect(ctx,PAL.c,x-7,y-16,10,1);}
 }
}
function forestTreePeck(f){
 if(regionOfPos(f.x,f.y)?.id!=='forest')return false;
 const trees=FOREST_TREES.filter(t=>f.x>=t.x-3&&f.x<t.x+19&&f.y-960>=t.y-3&&f.y-960<t.y+19);
 trees.sort((a,b)=>Math.hypot(f.x-a.x-8,f.y-960-a.y-8)-Math.hypot(f.x-b.x-8,f.y-960-b.y-8));
 const t=trees[0];if(!t)return false;if(!t.oak){SFX.clunk();return true;}
 const k=t.c+','+t.r;shakeTree(t.c,t.r,f,'acorn');const item=ents.find(e=>e.id==='acorn_'+k&&!e.dead);
 if(item){item.x=P.x;item.y=P.y;G.picked[k]=[item.x,item.y,'acorn'];save();}return true;
}
function forestClearNear(ox,oy,player=true){
 const clear=(x,y)=>x>=6&&x<=506&&y>=966&&y<=1148&&!rectTiles(x-5,y-5,10,6,player)&&(!player||!ents.some(e=>e.solid&&ov(pBox(x,y),entBox(e))));
 if(clear(ox,oy))return {x:ox,y:oy};
 for(let d=4;d<=192;d+=4)for(let dy=-d;dy<=d;dy+=4)for(const dx of Math.abs(dy)===d?Array.from({length:d/2+1},(_,i)=>-d+i*4):[-d,d]){
  const x=ox+dx,y=oy+dy;if(Math.floor(x/256)!==Math.floor(ox/256))continue;if(clear(x,y))return {x,y};
 }return null;
}
function restoreForestLanding(){if(regionAt()?.id==='forest'){const p=forestClearNear(P.x,P.y);if(p){P.x=p.x;P.y=p.y;}}}
