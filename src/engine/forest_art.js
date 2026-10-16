'use strict';
/* Native forest landmark art, taken from the approved original-tree study.
   Tree, grass, path and water art continues to use the existing TILE assets. */
const FOREST_ART=(()=>{
const C={ink:'#202840',paper:'#fff8ec',cream:'#ead6aa',wood:'#a66c46',woodL:'#cf9865',woodD:'#594437',gold:'#ffe05a',red:'#eb6654',blue:'#306a9d',glass:'#b2e7e0',grass:'#55aa62',leaf:'#2d664e',leafL:'#a1d970',earth:'#7a5230'};
let g;
const R=(c,x,y,w=1,h=1)=>coastRect(g,c,x,y,w,h);
const poly=(c,p)=>coastPoly(g,c,p);
function shadow(x,y,w){R('#2d664e',x-w/2,y-1,w,3);}
function windowAt(x,y){R(C.woodD,x-1,y-1,12,12);R(C.paper,x,y,10,10);R(C.blue,x+1,y+1,8,8);R(C.glass,x+1,y+1,3,7);R(C.paper,x+5,y,1,10);R(C.paper,x,y+5,10,1);R(C.woodD,x-3,y,2,11);R(C.woodL,x-3,y+1,1,8);R(C.woodD,x+11,y,2,11);}
function house(x,y){
 shadow(x+31,y,65);R(C.ink,x+2,y-29,58,31);R(C.cream,x+3,y-28,55,28);R('#c7ad86',x+53,y-27,5,26);R(C.woodD,x+3,y-2,56,3);
 for(let yy=y-24;yy<y-2;yy+=5)R('#bda47d',x+4,yy,53,1);
 poly(C.ink,[[x-3,y-27],[x+8,y-49],[x+52,y-49],[x+64,y-27]]);poly(C.blue,[[x,y-29],[x+9,y-47],[x+51,y-47],[x+60,y-29]]);
 for(let yy=y-44;yy<y-29;yy+=4){const inset=Math.ceil((y-29-yy)*.5);R('#409dc5',x+inset+1,yy,59-inset*2,1);for(let xx=x+inset+4+(yy%8?0:4);xx<x+58-inset;xx+=8)R('#202840',xx,yy+1,1,3);}
 R(C.paper,x-1,y-28,63,2);R(C.woodD,x+44,y-53,7,14);R('#c58169',x+45,y-52,5,12);R(C.paper,x+42,y-54,11,2);R(C.woodD,x+45,y-48,5,1);
 windowAt(x+8,y-23);windowAt(x+42,y-23);R(C.ink,x+25,y-20,12,22);R(C.woodD,x+26,y-19,10,19);R(C.woodL,x+27,y-18,8,6);R(C.wood,x+27,y-10,8,9);R(C.gold,x+33,y-10,1,2);R(C.paper,x+23,y+1,16,2);
 R(C.woodD,x+6,y-8,15,5);R(C.wood,x+7,y-7,13,3);for(let i=0;i<3;i++){R(C.leaf,x+8+i*4,y-12,3,5);R(i===1?'#f6a6b6':C.red,x+8+i*4,y-13,2,2);}
}
function coop(x,y,level=1){
 shadow(x+28,y,59);R(C.ink,x+2,y-23,52,25);R(C.wood,x+3,y-22,50,22);R('#b98552',x+4,y-21,47,1);for(let xx=x+9;xx<x+52;xx+=7){R(C.woodD,xx,y-21,1,20);R(C.woodL,xx+1,y-20,1,18);}
 poly(C.ink,[[x-2,y-22],[x+8,y-41],[x+46,y-41],[x+57,y-22]]);poly(level>=4?'#c98a00':'#a43d43',[[x+1,y-24],[x+9,y-39],[x+45,y-39],[x+54,y-24]]);for(let yy=y-36;yy<y-24;yy+=4)R(level>=4?C.gold:'#eb6654',x+10,yy,34,1);R(C.cream,x-1,y-23,57,2);
 poly(C.ink,[[x+18,y-24],[x+28,y-35],[x+39,y-24]]);poly(C.paper,[[x+21,y-25],[x+28,y-32],[x+35,y-25]]);R(C.gold,x+26,y-29,5,3);R(C.red,x+27,y-31,2,2);R(C.gold,x+30,y-30,2,1);
 R(C.ink,x+22,y-17,13,18);R(C.woodD,x+23,y-16,11,17);R('#e8a02c',x+24,y-2,9,3);R(C.cream,x+21,y+1,15,2);R(C.woodD,x+20,y+3,17,7);R(C.woodL,x+21,y+3,15,1);R(C.woodL,x+21,y+6,15,1);
 R(C.ink,x+7,y-16,9,9);R(C.glass,x+8,y-15,7,7);R(C.woodD,x+11,y-15,1,7);R(C.paper,x+8,y-12,7,1);
 R(C.ink,x+41,y-15,15,13);R(C.woodD,x+42,y-14,13,11);R(C.woodL,x+41,y-15,15,3);R(C.gold,x+44,y-6,9,2);R(C.paper,x+47,y-8,3,4);
 if(level>=3){R(C.ink,x+36,y-16,5,7);R(C.glass,x+37,y-15,3,5);R(C.cream,x+38,y-15,1,5);}
}
function field(x,y,mature=false){
 R(C.woodD,x,y,29,17);R('#a66c46',x+1,y+1,27,15);R('#b69965',x+1,y+1,27,1);
 for(let row=0;row<3;row++){const yy=y+3+row*5;R(C.earth,x+2,yy,25,3);R('#cf9865',x+2,yy+3,25,1);for(let col=0;col<4;col++){const xx=x+4+col*6;R(C.leaf,xx,yy-1,1,3);R(C.leafL,xx-1,yy-1,3,1);if(mature){R('#e8a02c',xx-1,yy+1,3,2);R(C.leaf,xx-1,yy-2,3,2);}}}
 if(mature)for(let n=0;n<3;n++){const xx=x+5+n*9;R(C.leaf,xx,y-6,1,8);R(C.leafL,xx-2,y-3,5,1);R(C.gold,xx-2,y-10,5,5);R(C.earth,xx-1,y-9,3,3);R(C.gold,xx,y-10,1,1);}
}
function hive(x,y,bees=true){
 R(C.woodD,x-1,y-23,3,9);R(C.wood,x,y-23,1,8);
 poly(C.ink,[[x-7,y-1],[x-9,y-6],[x-7,y-13],[x-3,y-17],[x+3,y-17],[x+7,y-13],[x+9,y-6],[x+7,y-1]]);
 poly('#e8a02c',[[x-6,y-2],[x-8,y-6],[x-6,y-12],[x-3,y-15],[x+3,y-15],[x+6,y-12],[x+8,y-6],[x+6,y-2]]);
 for(let yy=y-12;yy<y-2;yy+=3){R('#b69965',x-6,yy,12,1);R(C.gold,x-5,yy-1,4,1);}R(C.woodD,x+3,y-13,2,9);R(C.ink,x-2,y-6,4,3);R(C.woodD,x-5,y-1,10,1);
 if(bees)for(const [xx,yy] of [[x+12,y-9],[x-13,y-15]]){R(C.paper,xx,yy-2,3,2);R(C.ink,xx-1,yy,5,3);R(C.gold,xx,yy,3,2);R(C.ink,xx+1,yy,1,2);}
}

function plot(x,y,w,h,st){
 R(C.woodD,x,y,w,h);R(C.wood,x+1,y+1,w-2,h-2);R('#b69965',x+1,y+1,w-2,1);
 for(let row=0;row<3;row++){
  const yy=y+3+row*4;R(C.earth,x+2,yy,w-4,2);R(C.woodL,x+2,yy+2,w-4,1);
  if(!st)continue;
  const color=st.k==='moon'?'#b2b8f1':C.leafL;
  for(let xx=x+4;xx<x+w-3;xx+=6){R(C.leaf,xx,yy-1,1,3);R(color,xx-1,yy-1,3,1);if(st.p>=.33)R(color,xx-2,yy,5,1);if(st.p>=1)R('#e8a02c',xx-1,yy+1,3,2);}
 }
 if(st&&st.p>=.33){
  const size=st.k==='giant'?7:5,flower=st.k==='moon'?'#b2b8f1':st.k==='speedy'?'#f6a6b6':C.gold;
  for(let xx=x+5;xx<x+w-3;xx+=9){R(C.leaf,xx,y-4,1,7);R(C.leafL,xx-2,y,5,1);if(st.p>=1){R(flower,xx-Math.floor(size/2),y-8,size,size);R(C.earth,xx-1,y-7,3,3);}}
 }
}
return {paint(context,kind,...args){g=context;({house,coop,hive,plot}[kind])(...args);}};
})();
