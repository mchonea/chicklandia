'use strict';
/* Warm timber rooms and small, individually drawn honors at the game's native resolution. */
const COOP_INTERIOR_ART=(()=>{
 let g;const cache=new Map(),C={ink:'#202840',cream:'#ead6aa',paper:'#fff8ec',wall:'#dfc7a6',wood:'#ae784f',light:'#cfaa78',dark:'#594437',blue:'#467b95',teal:'#407f83',glass:'#99c5d0',gold:'#ffe05a',red:'#d45d50',green:'#5b9e64'};
 const R=(c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 function poly(c,p){g.fillStyle=c;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
 function text(s,x,y,color=C.paper,size=6){g.fillStyle=color;g.font=size+'px monospace';g.textAlign='center';g.textBaseline='top';g.fillText(s,x,y);}
 function windowAt(x,y,w,h,loft){
  R(C.dark,x-2,y-2,w+4,h+5);R(C.cream,x-1,y-1,w+2,h+2);R(C.blue,x,y,w,h);R('#9ccbd1',x+2,y+2,w-4,h-4);
  poly('#75a778',[[x+2,y+h-3],[x+w*.3,y+h-9],[x+w*.6,y+h-5],[x+w-2,y+h-10],[x+w-2,y+h-2]]);
  R(C.paper,x+3,y+3,2,h-6);R(C.cream,x+w/2-1,y,2,h);R(C.cream,x,y+h/2,w,1);R(C.light,x-3,y+h+2,w+6,3);
  if(!loft){R(C.teal,x-5,y,3,h);R(C.teal,x+w+2,y,3,h);R(C.cream,x-5,y+3,3,1);R(C.cream,x+w+2,y+3,3,1);}
 }
 function rug(x,y,w,h,c){R(C.dark,x-1,y-1,w+2,h+2);R(C.cream,x,y,w,h);R(c,x+2,y+2,w-4,h-4);for(let xx=x+3;xx<x+w-2;xx+=5){R(C.cream,xx,y-2,2,2);R(C.cream,xx,y+h,2,2);}R('#ffffff25',x+5,y+5,w-10,1);R('#ffffff25',x+5,y+h-6,w-10,1);}
 function ground(floor,lv){const key='ground'+floor+lv;if(cache.has(key))return cache.get(key);const art=mk(256,192,target=>{
  g=target;const loft=floor==='loft',x=lv===1?24:16,w=256-x*2;
  R('#273744',0,0,256,192);R(C.ink,x-3,9,w+6,178);R(C.wall,x,12,w,165);
  for(let xx=x+5;xx<x+w;xx+=12){R('#cfb18a',xx,13,1,38);R('#e8d5b7',xx+1,13,1,38);}
  R(C.dark,x,50,w,4);R(lv===4?C.gold:C.teal,x,45,w,5);R(C.paper,x,45,w,1);
  R('#bf9c71',x+4,54,w-8,122);
  for(let y=54;y<176;y+=8){R('#a58763',x+4,y,w-8,1);for(let xx=x+4+(y%16?17:0);xx<x+w-4;xx+=35){R('#a58763',xx,y,1,8);R('#d1b486',xx+4,y+2,12,1);}}
  R(C.dark,x,52,4,126);R(C.cream,x+2,52,2,126);R(C.dark,x+w-4,52,4,126);R(C.cream,x+w-4,52,2,126);
  R(C.ink,x,176,w,10);R(C.wood,x+3,178,w-6,6);R(C.cream,x+3,178,w-6,1);
  if(loft){
   poly(C.dark,[[x,12],[x+12,12],[x+40,45],[x+32,45]]);poly(C.dark,[[x+w-12,12],[x+w,12],[x+w-32,45],[x+w-40,45]]);
   windowAt(101,18,54,23,true);windowAt(32,22,27,18,true);windowAt(197,22,27,18,true);
   rug(82,59,92,112,lv===4?'#8c4e57':'#51798c');
   R(C.dark,82,45,92,8);R(lv===4?C.gold:C.cream,83,45,90,1);text('TROPHY ROOM',128,46,C.paper,6);
   for(const xx of [24,229]){R(C.dark,xx,58,3,111);R(lv===4?C.gold:C.cream,xx+1,58,1,111);}
   if(lv===4)for(const xx of [75,179]){R(C.dark,xx-5,17,10,22);R(C.red,xx-4,18,8,18);poly(C.gold,[[xx-3,35],[xx,38],[xx+3,35]]);R(C.gold,xx-2,22,5,5);}
  }else{
   windowAt(37,22,35,19,false);windowAt(183,22,35,19,false);
   rug(87,96,81,68,lv===4?'#8c4e57':C.teal);
   R(C.dark,103,17,49,24);R(C.light,105,19,45,20);R(C.cream,108,22,39,14);
   poly(C.blue,[[110,34],[119,26],[126,30],[133,25],[145,34]]);R(C.gold,136,24,4,4);R(C.paper,115,25,6,1);
   R(C.ink,115,176,26,12);R('#d6c7ac',117,176,22,12);R(C.cream,116,174,24,3);R(C.light,117,185,22,2);
   if(lv===1){R(C.dark,187,45,43,8);text('LOFT: LV 2',208,46,C.cream,5);}
   // The Dream Coop's celebration stays on its family floor.
   if(lv===4)for(let i=0;i<14;i++){const xx=25+i*15;R(C.dark,xx,14,15,1);poly([C.red,C.gold,C.blue,C.green][i%4],[[xx+2,15],[xx+10,15],[xx+6,21]]);}
  }
 });cache.set(key,art);return art;}
 function books(w,h){R(C.ink,0,0,w,h);R(C.dark,2,2,w-4,h-4);for(let y=3;y<h-4;y+=11){for(let x=4;x<w-4;x+=5){R([C.red,C.teal,C.cream,C.blue][(x+y)%4],x,y+1,3,7);R(C.paper,x+1,y+2,1,1);}R(C.light,2,y+9,w-4,2);}R(C.wood,0,0,2,h);R(C.light,w-2,0,2,h);R(C.light,0,0,w,2);}
 function trophy(icon,c,x,y){
  if(icon==='cup'){R(C.dark,x-5,y+8,11,2);R(c,x-3,y+7,7,2);R(c,x-1,y+2,3,6);poly(c,[[x-6,y-7],[x+7,y-7],[x+5,y+1],[x,y+4],[x-4,y+1]]);R(C.paper,x-4,y-6,3,5);for(const dx of [-9,7]){R(c,x+dx,y-6,3,7);R(c,x+dx,y,4,2);}}
  else if(icon==='wing'){poly(c,[[x-10,y+3],[x-8,y-5],[x-4,y-1],[x-1,y-7],[x+2,y-2],[x+8,y-8],[x+10,y-5],[x+6,y+4],[x,y+7]]);R(C.paper,x-5,y+1,10,1);R(c,x-1,y+5,2,4);}
  else if(icon==='acorn'){poly(C.wood,[[x-5,y-2],[x+6,y-2],[x+5,y+6],[x,y+9],[x-4,y+5]]);R(c,x-7,y-5,14,5);R(C.dark,x-5,y-5,2,2);R(C.dark,x+1,y-4,2,2);R(C.gold,x,y-8,2,3);R(C.paper,x-2,y+1,2,4);}
  else if(icon==='flower'){R(C.green,x-1,y,2,10);poly(C.green,[[x,y+7],[x-7,y+2],[x-6,y+7],[x,y+9]]);for(const [dx,dy] of [[-5,-6],[0,-9],[5,-6],[-5,-1],[5,-1],[0,2]])R(c,x+dx-2,y+dy-2,5,5);R(C.dark,x-3,y-6,7,7);R(C.wood,x-2,y-5,5,5);R(C.paper,x-1,y-4,2,2);}
  else if(icon==='home'||icon==='village'){const house=(xx,yy,ww)=>{R(C.cream,xx-ww/2,yy,ww,8);poly(c,[[xx-ww/2-2,yy],[xx,yy-7],[xx+ww/2+2,yy]]);R(C.dark,xx-1,yy+3,3,5);R(C.blue,xx-ww/2+2,yy+2,2,2);};if(icon==='home')house(x,y,16);else{house(x-5,y+1,10);house(x+6,y-3,9);}}
  else if(icon==='flag'){R(C.cream,x-6,y-9,2,18);R(C.dark,x-9,y+8,9,2);R(c,x-4,y-9,14,10);for(let yy=0;yy<3;yy++)for(let xx=0;xx<4;xx++)if((xx+yy)%2)R(C.ink,x-4+xx*3,y-9+yy*3,3,3);}
  else if(icon==='museum'){R(C.cream,x-9,y+6,19,3);R(c,x-8,y-4,17,2);poly(c,[[x-10,y-5],[x,y-10],[x+10,y-5]]);for(const xx of [-6,0,6]){R(C.paper,x+xx-1,y-1,3,7);R(c,x+xx,y,1,5);}}
  else if(icon==='wheel'){for(let i=0;i<8;i++){const a=i*Math.PI/4;R(c,x+Math.round(Math.cos(a)*9)-1,y+Math.round(Math.sin(a)*9)-1,3,3);}g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.arc(x,y,6,0,Math.PI*2);g.stroke();R(c,x-1,y-7,2,15);R(c,x-7,y-1,15,2);R(C.paper,x-1,y-1,3,3);}
  else{poly(c,[[x,y-10],[x+3,y-3],[x+10,y-3],[x+5,y+2],[x+7,y+9],[x,y+5],[x-7,y+9],[x-5,y+2],[x-10,y-3],[x-3,y-3]]);R(C.paper,x-2,y-4,2,6);R(C.paper,x-4,y-2,6,2);}
 }
 function prop(p,lv,earned=false){const key=p.kind+p.id+lv+earned;if(cache.has(key))return cache.get(key);const art=mk(p.w,p.h,target=>{
  g=target;const w=p.w,h=p.h,gold=lv===4?C.gold:C.cream;
  if(p.kind==='kitchen'){
   R(C.ink,0,5,w,h-5);R(C.wood,1,7,w-2,h-8);R(C.dark,2,h-4,w-4,3);R(C.cream,0,4,w,5);R(C.paper,1,4,w-2,1);
   for(let x=3;x<w-8;x+=17){R(C.light,x,13,13,1);R(C.dark,x+12,10,1,9);R(C.gold,x+8,16,2,1);}
   R(C.dark,6,1,15,4);R(C.glass,7,2,13,2);R(C.dark,26,0,2,5);R(C.paper,38,0,6,5);R(C.teal,46,1,5,4);
  }else if(p.kind==='hearth'){
   R(C.dark,4,0,w-8,h);R('#a99b91',5,1,w-10,h-2);for(let y=5;y<h-3;y+=6){R('#877d7c',5,y,w-10,1);R('#d3c7af',8,y-2,8,1);}
   R(C.cream,0,12,w,4);R(C.paper,1,12,w-2,1);R(C.ink,9,20,w-18,16);R(C.red,12,28,w-24,7);R(C.gold,16,24,5,11);R(C.paper,18,26,2,7);R(C.cream,0,h-3,w,3);
  }else if(p.kind==='sofa'||p.kind==='bench'){
   const color=p.kind==='sofa'?C.teal:C.blue;R(C.dark,2,0,w-4,h-3);R(color,4,2,w-8,h-6);R(C.paper,6,3,w-12,2);R(C.cream,0,7,5,h-9);R(C.cream,w-5,7,5,h-9);R(C.dark,4,h-4,3,4);R(C.dark,w-7,h-4,3,4);R(C.light,5,h-10,w-10,2);R(C.cream,10,6,8,7);R(C.red,11,7,6,5);
  }else if(p.kind==='stairsup'){
   R(C.ink,0,0,w,h);R(C.dark,3,8,w-6,h-8);for(let i=0;i<7;i++){R(C.wood,6,12+i*6,w-12,6);R(C.light,6,12+i*6,w-12,2);R(C.cream,7,12+i*6,w-14,1);}
   R(C.cream,1,8,3,h-8);R(C.cream,w-4,8,3,h-8);R(gold,0,0,w,10);text('UP',w/2,1,C.dark,7);
  }else if(p.kind==='stairsdown'){
   R(C.ink,0,0,w,h);R(C.dark,3,3,w-6,h-6);for(let i=0;i<5;i++){const xx=5+i;R(C.wood,xx,5+i*5,w-xx*2,4);R(C.light,xx,5+i*5,w-xx*2,1);}R(gold,0,0,3,h);R(gold,w-3,0,3,h);R(C.cream,0,h-3,w,3);R(C.ink,6,0,w-12,9);text('DOWN',w/2,1,C.paper,6);
  }else if(p.kind==='books')books(w,h);
  else if(p.kind==='nests'){
   const rows=lv>=3?2:1,cols=lv>=2?2:1;R(C.dark,0,0,w,h-2);R(C.light,1,1,w-2,h-4);R(C.cream,2,2,w-4,2);
   for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const nx=3+c*(w-6)/cols,ny=6+r*(h-10)/rows,nw=(w-6)/cols-2,nh=(h-10)/rows-2;R(C.dark,nx,ny,nw,nh);R('#d8b970',nx+1,ny+2,nw-2,nh-3);R(C.cream,nx+3,ny+3,Math.max(5,nw-6),4);R(r===0?C.blue:C.teal,nx+2,ny+nh-7,nw-4,5);for(let i=0;i<3;i++)R('#efcf87',nx+2+i*5,ny+nh-2,4,1);}
   R(gold,0,h-4,w,2);R(C.dark,2,h-2,3,2);R(C.dark,w-5,h-2,3,2);
  }else if(p.kind==='table'||p.kind==='desk'){
   R(C.dark,3,4,w-6,h-4);R(C.dark,4,h-5,3,5);R(C.dark,w-7,h-5,3,5);R(C.ink,0,0,w,h-5);R(C.light,1,1,w-2,h-7);R(C.cream,2,1,w-4,2);
   if(p.kind==='desk'){R(C.paper,5,5,19,9);R(C.blue,7,8,13,1);R(C.blue,9,10,9,1);R(C.red,28,5,5,7);R(C.gold,29,6,3,1);}
   else{R(C.cream,7,6,10,7);R(C.red,10,8,4,3);R(C.cream,w-17,6,10,7);R(C.gold,w-14,8,4,3);R(C.teal,w/2-2,3,4,6);R(C.green,w/2-3,1,6,3);}
  }else if(p.kind==='chair'){R(C.dark,2,0,w-4,h);R(C.teal,4,2,w-8,7);R(C.light,0,10,w,3);R(C.teal,3,13,w-6,4);R(C.dark,2,h-3,3,3);R(C.dark,w-5,h-3,3,3);}
  else if(p.kind==='plant'){R(C.dark,1,10,w-2,7);R(C.red,2,11,w-4,5);R(C.cream,0,9,w,2);R(C.green,1,4,w-2,5);R('#a1cb7c',5,0,4,10);R(C.gold,8,3,3,3);}
  else if(p.kind==='display'){
   R(C.ink,0,20,w,12);R(lv===4?'#bda36a':C.wood,1,21,w-2,10);R(C.dark,2,29,w-4,2);R(C.cream,1,20,w-2,2);R(C.dark,9,25,12,3);R(earned?C.gold:'#8a857b',10,26,10,1);
   R(C.dark,1,0,w-2,20);R('#24394b',3,2,w-6,17);R('#93c4d533',3,2,w-6,17);R(C.paper,3,2,2,10);R(C.glass,3,2,w-6,1);
   if(earned){trophy(p.trophy.icon,p.trophy.color,15,11);R('#ffffff25',4,3,22,1);}else{R('#73848b',12,9,6,5);R('#89979c',13,8,4,1);R('#73848b',14,14,2,3);R('#73848b',11,17,8,1);}
   R(lv===4?C.gold:C.light,1,19,w-2,2);
  }
 });cache.set(key,art);return art;}
 return {ground,prop};
})();
