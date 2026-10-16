'use strict';
/* Approved shore and peak anchors, shared by painting, collision and interactions. */
const BEACH_PALMS=[[0,16],[16,16],[32,18],[0,32],[0,48],[16,44],[64,18],[80,18],[176,18],[192,18],[208,28],[232,18],[264,18],[280,18],[352,18],[368,22],[432,18],[448,22],[480,18],[496,18],[496,34],[496,50]];
const BEACH_TREES=Array.from({length:32},(_,i)=>[i*16,0]).filter(([x])=>x<112||x>=144);
const BEACH_ROCKS=[[30,112],[228,114],[268,114],[443,113]];
const BEACH_POOLS=[[311,57,46,30],[419,70,52,32],[473,44,25,17]];
const MOUNTAIN_PINES=[[16,36],[32,36],[16,52],[48,37],[64,36],[192,36],[208,30],[228,49],[16,134],[32,143],[48,157],[176,151],[192,150],[208,146],[240,139],[264,28],[280,32],[336,26],[352,26],[360,44],[440,36],[456,27],[480,35],[496,42],[488,139],[472,146],[456,148],[344,146],[328,152]];
const MOUNTAIN_BOULDERS=[[64,55],[80,62],[96,64],[112,60],[128,50]];
const MOUNTAIN_RIDGE=[[0,18],[32,18],[32,27],[80,27],[80,18],[144,18],[144,24],[208,24],[208,14],[272,14],[272,23],[336,23],[336,15],[376,15],[376,26],[448,26],[448,18],[512,18]];
const MOUNTAIN_LEDGES=[[[0,170],[32,170],[32,176],[91,176],[91,184],[113,184]],[[151,184],[173,184],[173,174],[233,174],[233,169],[260,169]],[[445,177],[472,177],[472,168],[512,168]]];
function beachShoreY(x){return Math.round(131+5*Math.sin((x-24)/61)+2*Math.sin(x/19));}
function landscapePool(x,y,w,h){return [[x-w/2,y-3],[x-w/2+6,y-h/2],[x-7,y-h/2],[x-7,y-h/2-2],[x+7,y-h/2-2],[x+7,y-h/2],[x+w/2-4,y-h/2+2],[x+w/2,y-3],[x+w/2,y+4],[x+w/2-5,y+h/2],[x+6,y+h/2],[x+6,y+h/2+2],[x-9,y+h/2+2],[x-9,y+h/2],[x-w/2+3,y+h/2-3]];}
function landscapeInside(x,y,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function landscapeEdgeY(p,x){for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i];if(x>=a[0]&&x<b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return null;}
function mountainChasmEdges(y){const n=Math.floor(y/16),t=y/16-n;return [384+(n%2?0:-3)*(1-t)+((n+1)%2?0:-3)*t,416+(n%2?2:0)*(1-t)+((n+1)%2?2:0)*t];}
const LANDSCAPE_MASK={};
function landscapeMask(kind){
 if(LANDSCAPE_MASK[kind])return LANDSCAPE_MASK[kind];
 const m=new Uint8Array(512*192),trees=kind==='beach'?[...BEACH_TREES,...BEACH_PALMS,...BEACH_ROCKS]:MOUNTAIN_PINES;
 const wet=BEACH_POOLS.map(([x,y,w,h])=>landscapePool(x,y,w,h).map(([xx,yy])=>[Math.round(x+(xx-x)*.72),Math.round(y+(yy-y)*.65)]));
 for(let y=0;y<192;y++)for(let x=0;x<512;x++){
  let v=0;
  if(kind==='beach'){
   const shore=beachShoreY(x);if(y>=shore)v=y>=shore+19?3:2;
   if(wet.some(p=>landscapeInside(x+.5,y+.5,p)))v=2;
   if((x>=60&&x<77&&y>=71&&y<78)||(x>=73&&x<76&&y>=50&&y<75)||(x>=283&&x<313&&y>=76&&y<84))v=1;
   if((x>=473&&x<475||x>=507&&x<509)&&y>=82&&y<86)v=1;
  }else{
   if(y<landscapeEdgeY(MOUNTAIN_RIDGE,x)+7)v=1;
   if(MOUNTAIN_LEDGES.some(p=>{const edge=landscapeEdgeY(p,x);return edge!==null&&y>=edge;}))v=1;
   // The rockslide backing encloses the original rescue pocket from the north.
   if(x>=77&&x<123&&y>=36&&y<43)v=1;
   if((x>=77&&x<82||x>=119&&x<124)&&y>=43&&y<64)v=1;
   if(y>=32){const [l,r]=mountainChasmEdges(y);if(x>=l&&x<r)v=4;}
   if(x>=458&&x<474&&y>=55&&y<71)v=1;
   if((x>=374&&x<376||x>=425&&x<427)&&y>=103&&y<114)v=1;
  }
  if(trees.some(([tx,ty])=>x>=tx&&x<tx+16&&y>=ty&&y<ty+16))v=1;
  m[y*512+x]=v;
 }return LANDSCAPE_MASK[kind]=m;
}
function landscapeScreens(kind){const m=landscapeMask(kind),chars=kind==='beach'?['~','2','W','w','z']:['g','N','W','w','z'];return [0,1].map(n=>Array.from({length:12},(_,r)=>Array.from({length:16},(_,c)=>chars[m[r*16*512+8*512+(c+n*16)*16+8]]).join('')));}
