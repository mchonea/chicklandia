'use strict';
/* ---------------- collision ---------------- */
function rectTiles(x,y,w,h,forPlayer){
  const c0=Math.floor(x/16),c1=Math.floor((x+w-0.01)/16),r0=Math.floor(y/16),r1=Math.floor((y+h-0.01)/16);
  for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)if(solidTile(tileAt(c,r),forPlayer))return true;return false;
}
const ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function entBox(e){
  if(e.type==='goose')return {x:e.x-7,y:e.y-12,w:14,h:16};
  if(e.type==='block')return {x:e.x-8,y:e.y-16,w:16,h:16};
  if(e.type==='chest')return {x:e.x-8,y:e.y-8,w:16,h:9};
  return {x:e.x-e.w/2,y:e.y-6,w:e.w,h:7};
}
function pBox(x,y){return {x:x-5,y:y-5,w:10,h:6};}
function pBlocked(x,y){
  const b=pBox(x,y);if(rectTiles(b.x,b.y,b.w,b.h,true))return true;
  const cur=pBox(P.x,P.y);
  for(const e of ents){if(!e.solid||e.blown)continue;const eb=entBox(e);if(ov(b,eb)&&!ov(cur,eb))return true;}
  return false;
}
function moveP(dx,dy,nudge){
  if(!dx&&!dy)return true;const nx=P.x+dx,ny=P.y+dy;
  if(!pBlocked(nx,ny)){P.x=nx;P.y=ny;return true;}
  if(nudge){
    if(dx){for(let k=1;k<=7;k++){
      if(!pBlocked(nx,P.y-k)&&!pBlocked(P.x,P.y-1)){P.y-=1;return true;}
      if(!pBlocked(nx,P.y+k)&&!pBlocked(P.x,P.y+1)){P.y+=1;return true;}}}
    else{for(let k=1;k<=7;k++){
      if(!pBlocked(P.x-k,ny)&&!pBlocked(P.x-1,P.y)){P.x-=1;return true;}
      if(!pBlocked(P.x+k,ny)&&!pBlocked(P.x+1,P.y)){P.x+=1;return true;}}}
  }
  return false;
}
function entBlocked(e,x,y){
  const sx=e.sx*256,sy=e.sy*192;if(x<sx+8||x>sx+248||y<sy+14||y>sy+188)return true;
  return rectTiles(x-6,y-5,12,6,false);
}
function entMove(e,dx,dy){if(!entBlocked(e,e.x+dx,e.y))e.x+=dx;if(!entBlocked(e,e.x,e.y+dy))e.y+=dy;}

/* ---------------- effects ---------------- */
function puff(x,y,n,colors,spd=1.2,grav=0.04){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.random()*spd+0.3;
  parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-0.6,g:grav,life:25+Math.random()*20,c:colors[(Math.random()*colors.length)|0]});}}
function float(x,y,s,color='#fff'){floats.push({x,y,s,color,life:60});}
function toast(s,color='#ffe05a'){toasts.push({s:tt(s),color,t:0});}
function updateAmbient(){
  for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=0.97;p.life--;}parts=parts.filter(p=>p.life>0);
  for(const f of floats){f.y-=0.35;f.life--;}floats=floats.filter(f=>f.life>0);
  if(toasts.length){toasts[0].t++;if(toasts[0].t>170)toasts.shift();}
  if(shake>0)shake--;
}

