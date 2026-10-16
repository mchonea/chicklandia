'use strict';
/* Shared native pixel art for the city's buildings, terrace and public spaces. */
const CITY_ART=(()=>{
let g,lit=false;
const P={ink:'#202840',paper:'#fff8ec',cream:'#ead6aa',wall:'#edc59c',shadow:'#ae9b86',sand:'#d9c8a6',brick:'#c8755d',red:'#d45d50',redDark:'#8b4143',blue:'#467b95',blueLight:'#8bb6c5',teal:'#407f83',violet:'#8e6c95',gold:'#ffe05a',wood:'#a66c46',woodL:'#cf9865',woodD:'#594437',grass:'#70a76b',grassL:'#91b87c',grassD:'#4e805b',leaf:'#5b9e64',leafL:'#a1cb7c',leafD:'#30664f',stone:'#a5b1b2',joint:'#8e9da5',curb:'#d6d3bd',curbD:'#6b8391',water:'#3d93b4',foam:'#b2e7e0'};
const R=(c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,pts){g.fillStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
function line(c,pts,w=1){g.strokeStyle=c;g.lineWidth=w;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function text(s,x,y,c=P.ink,size=7,align='left'){g.font=size+'px monospace';g.textAlign=align;g.textBaseline='top';g.fillStyle=c;g.fillText(s,Math.round(x),Math.round(y));}
function seeded(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};}
function ground(){R(P.grass,0,0,256,192);const rnd=seeded(401);for(let n=0;n<75;n++){const x=rnd()*256|0,y=rnd()*192|0;R(n%3?P.grassL:P.grassD,x,y,2,1);}}
function stone(x,y,w,h,tone=P.stone){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();R(tone,x,y,w,h);for(let yy=Math.floor(y/6)*6;yy<y+h;yy+=6){const off=(yy/6)%2?5:0;R(P.joint,x,yy,w,1);for(let xx=Math.floor(x/10)*10-off;xx<x+w;xx+=10)R(P.joint,xx,yy,1,6);}g.restore();}
function road(){stone(0,82,256,44);R(P.curb,0,78,256,3);R(P.curbD,0,81,256,1);R(P.curbD,0,126,256,1);R(P.curb,0,127,256,3);}
function crossing(x=112,y=126,h=66){stone(x,y,32,h);R(P.curb,x-3,y,3,h);R(P.curbD,x+32,y,3,h);}
function bench(x,y){R(P.ink,x-10,y+5,2,5);R(P.ink,x+9,y+5,2,5);R(P.woodD,x-12,y-2,26,9);R(P.woodL,x-11,y-1,24,2);R(P.wood,x-11,y+3,24,2);R(P.woodL,x-13,y+6,28,2);}
function lamp(x,y){R(P.ink,x-1,y-26,3,28);R(P.ink,x-4,y-28,9,3);R(P.ink,x-4,y-25,9,9);R(P.gold,x-3,y-24,7,6);R(P.paper,x-1,y-23,2,4);R(P.ink,x-3,y+1,7,2);}
function tree(x,y,z=1){g.save();g.translate(x,y);g.scale(z,z);R('rgba(32,40,64,.18)',-13,-1,28,5);R(P.woodD,-2,-20,5,22);R(P.wood,-1,-15,2,15);poly(P.leafD,[[-17,-17],[-18,-27],[-12,-35],[-5,-39],[5,-39],[15,-32],[18,-23],[14,-14],[5,-10],[-7,-11]]);poly(P.leaf,[[-15,-23],[-12,-32],[-4,-36],[6,-35],[14,-28],[14,-20],[5,-15],[-7,-16]]);poly(P.leafL,[[-12,-28],[-7,-34],[1,-35],[8,-31],[7,-28],[-2,-30],[-6,-24]]);g.restore();}
function bed(x,y,w,h,flowers=true){R(P.curbD,x,y,w,h);R(P.curb,x,y,w,h-2);R(P.grassD,x+3,y+2,w-6,h-5);for(let xx=x+5;xx<x+w-4;xx+=7){R(P.leaf,xx,y+4,5,h-9);if(flowers){R(P.red,xx+1,y+4,2,2);R(P.gold,xx+3,y+7,2,2);}}}
function pot(x,y){R(P.woodD,x-4,y-5,9,6);R(P.brick,x-3,y-4,7,5);R(P.leafD,x-5,y-10,11,5);R(P.leaf,x-3,y-13,8,6);R(P.gold,x-2,y-12,2,2);}
function fountain(x,y){poly(P.curbD,[[x-20,y-8],[x-14,y-14],[x+14,y-14],[x+20,y-8],[x+20,y+10],[x+13,y+16],[x-14,y+16],[x-20,y+10]]);poly(P.curb,[[x-18,y-9],[x-12,y-12],[x+12,y-12],[x+18,y-8],[x+18,y+8],[x+11,y+13],[x-11,y+13],[x-18,y+7]]);R(P.water,x-15,y-7,31,16);R(P.foam,x-11,y+6,9,1);R(P.curbD,x-3,y-22,7,27);R(P.curb,x-2,y-23,5,25);R(P.curbD,x-11,y-19,23,4);R(P.foam,x-9,y-20,19,2);R(P.foam,x-10,y-16,1,12);R(P.foam,x+9,y-16,1,12);R(P.paper,x,y-28,1,6);}
function windowAt(x,y,w=10,h=13){R(P.ink,x,y,w,h);R(lit?P.gold:P.blue,x+1,y+1,w-2,h-2);R(lit?P.paper:P.blueLight,x+2,y+2,Math.max(2,w/3),h-4);R(P.cream,x+(w/2|0),y+1,1,h-2);R(P.cream,x+1,y+(h/2|0),w-2,1);R(P.woodD,x-1,y+h,w+2,2);}
function sign(s,x,y,w){R(P.ink,x-w/2,y,w,10);R(P.cream,x-w/2+1,y+1,w-2,8);}
function awning(x,y,w,c){R(P.ink,x-1,y-1,w+2,10);for(let xx=0;xx<w;xx+=6){R((xx/6)%2?P.paper:c,x+xx,y,Math.min(6,w-xx),7);R((xx/6)%2?P.cream:P.woodD,x+xx,y+7,Math.min(6,w-xx),2);}R('rgba(32,40,64,.18)',x,y+10,w,3);}
function door(x,y,h=18){R(P.ink,x-5,y-h,11,h);R(P.woodD,x-4,y-h+1,9,h-1);R(P.woodL,x-3,y-h+2,7,6);R(P.gold,x+2,y-6,1,1);R(P.curb,x-7,y,15,2);}
const styles={
 post:{name:'POST',roof:P.blue,wall:P.cream},den:{name:'ROCCO',roof:P.redDark,wall:'#ca947c'},boutique:{name:'BOUTIQUE',roof:P.violet,wall:'#eed5b8',awning:P.violet},seed:{name:'SEED & FEED',roof:P.teal,wall:'#dace9f',awning:P.leafD},bakery:{name:'BAKERY',roof:P.red,wall:P.wall,awning:P.red},toy:{name:'TOYS',roof:P.blue,wall:'#e9d8a9',awning:P.teal},library:{name:'LIBRARY',roof:P.blue,wall:'#d1c7ab'},museum:{name:'MUSEUM',roof:P.teal,wall:'#c8c9ba'},bistro:{name:'BISTRO',roof:P.redDark,wall:'#e6b693',awning:P.red},cleo:{name:'CLEO',roof:P.blue,wall:'#eac6a5'},artist:{name:'STUDIO',roof:P.violet,wall:'#c3cdbb'},ducks:{name:'DUCK FLAT',roof:P.teal,wall:'#ead7b1'},loft:{name:'PIDGE',roof:P.redDark,wall:'#cbb3a1'}
};
function building(kind,x,baseY,w,h=62,doorOffset=.5){
 const s=styles[kind],top=baseY-h,roofH=Math.round(h*.36),wallTop=top+roofH-2,wallH=baseY-wallTop,doorX=Math.round(x+w*doorOffset);g.save();
 R('rgba(32,40,64,.20)',x+4,baseY-1,w,6);
 R(P.ink,x+2,wallTop,w-4,wallH);R(s.wall,x+4,wallTop+2,w-8,wallH-3);R(P.shadow,x+w-9,wallTop+2,5,wallH-3);R(P.woodD,x+3,baseY-4,w-6,4);
 if(kind==='museum'){
  poly(P.ink,[[x-1,wallTop+2],[x+4,top+12],[x+w/2-8,top+1],[x+w/2+8,top+1],[x+w-4,top+12],[x+w+1,wallTop+2]]);
  poly(s.roof,[[x+2,wallTop-1],[x+7,top+14],[x+w/2-7,top+4],[x+w/2+7,top+4],[x+w-7,top+14],[x+w-2,wallTop-1]]);
  R(P.ink,x+w/2-11,top+8,22,9);R(P.blueLight,x+w/2-9,top+10,18,5);for(let i=0;i<3;i++)R(P.cream,x+w/2-5+i*5,top+10,1,5);
 }else{
  poly(P.ink,[[x-1,wallTop+3],[x+7,top+2],[x+w-10,top+2],[x+w+1,wallTop+3]]);
  poly(s.roof,[[x+2,wallTop],[x+9,top+4],[x+w-12,top+4],[x+w-2,wallTop]]);
  for(let yy=top+8;yy<wallTop-1;yy+=5)R(kind==='bakery'||kind==='bistro'?P.redDark:'#ffffff22',x+7,yy,w-17,1);
  R(P.woodD,x-1,wallTop+1,w+2,3);R(P.cream,x+1,wallTop+1,w-2,1);
  if(!['bistro','seed'].includes(kind)){
   const gw=Math.min(24,w-18),gx=kind==='boutique'?x+w-12-gw:x+(w-gw)/2;
   poly(P.ink,[[gx-2,wallTop+2],[gx+gw/2,top-1],[gx+gw+2,wallTop+2]]);
   poly(s.wall,[[gx+1,wallTop],[gx+gw/2,top+4],[gx+gw-1,wallTop]]);
   line(P.cream,[[gx,wallTop],[gx+gw/2,top+2],[gx+gw,wallTop]],2);
   if(roofH>16)windowAt(Math.round(gx+gw/2-3),wallTop-9,6,7);
  }
 }
 if(['bakery','bistro','den','cleo'].includes(kind)){R(P.ink,x+w-15,top-3,8,14);R(P.brick,x+w-14,top-2,6,12);R(P.cream,x+w-16,top-4,10,3);if(kind==='bakery'){R('#cbd6d0',x+w-12,top-10,4,4);R('#dde5da',x+w-9,top-16,5,4);}}
 const winY=baseY-22,winW=w<60?9:13;
 if(wallH>38&&w>50&&!['museum','library'].includes(kind)){windowAt(x+8,wallTop+3,6,8);windowAt(x+w-14,wallTop+3,6,8);}
 if(x+8+winW<doorX-5)windowAt(x+8,winY,winW,16);if(x+w-9-winW>doorX+5)windowAt(x+w-9-winW,winY,winW,16);
 if(kind==='library'||kind==='museum'){for(const px of [x+5,x+23,x+w-27,x+w-9]){R(P.curbD,px,wallTop+11,5,baseY-wallTop-11);R(P.paper,px,wallTop+11,3,baseY-wallTop-12);R(P.cream,px-1,wallTop+9,7,3);}R(P.curb,x-1,baseY,w+2,3);R(P.curbD,x-3,baseY+3,w+6,2);}
 door(doorX,baseY,18);
 if(s.awning)awning(x+6,baseY-27,w-12,s.awning);
 sign(s.name,doorX,baseY-37,Math.min(w-8,s.name.length*3+9));
 if(kind==='post'){
  R(P.ink,x+w/2-5,top+9,11,11);R(P.paper,x+w/2-4,top+10,9,9);line(P.ink,[[x+w/2,top+12],[x+w/2,top+15],[x+w/2+3,top+15]]);
  R(P.woodD,x+10,baseY-1,9,10);R(P.blue,x+8,baseY-8,13,10);R(P.paper,x+10,baseY-7,9,5);line(P.red,[[x+10,baseY-7],[x+14,baseY-3],[x+19,baseY-7]]);
 }else if(kind==='seed'){
  R(P.woodD,x+w-24,baseY-2,18,6);for(let i=0;i<3;i++){R(P.woodL,x+w-23+i*5,baseY-6,4,7);R(P.leaf,x+w-23+i*5,baseY-10,4,5);R(P.gold,x+w-22+i*5,baseY-8,2,2);}
 }else if(kind==='bakery'){
  R(P.woodD,x+9,baseY-4,13,4);R(P.gold,x+10,baseY-8,11,4);for(let i=0;i<3;i++)R(P.cream,x+12+i*3,baseY-8,1,2);
 }else if(kind==='toy'){
  R(P.ink,x+w-15,top-5,1,14);R(P.gold,x+w-19,top-10,10,5);R(P.gold,x+w-16,top-14,6,5);R(P.red,x+w-10,top-11,3,2);R(P.ink,x+w-13,top-13,1,1);
 }else if(kind==='boutique'){
  R(P.violet,x+11,baseY-15,6,8);poly(P.violet,[[x+14,baseY-14],[x+9,baseY-6],[x+20,baseY-6]]);R(P.paper,x+13,baseY-16,2,3);
 }else if(kind==='artist'){
  R(P.woodD,x+w-17,baseY-15,13,15);R(P.paper,x+w-15,baseY-13,9,9);R(P.red,x+w-14,baseY-12,3,3);R(P.blue,x+w-10,baseY-9,3,3);R(P.gold,x+w-13,baseY-7,3,2);
 }else if(kind==='ducks'){
  for(let i=0;i<3;i++){R(P.paper,x+7+i*5,baseY-29,4,3);R(P.gold,x+10+i*5,baseY-28,2,1);}
 }else if(kind==='loft'){
  R(P.ink,x+w/2-4,top-9,9,9);R(P.cream,x+w/2-3,top-7,7,6);R(P.blue,x+w/2-1,top-6,3,4);poly(P.redDark,[[x+w/2-6,top-9],[x+w/2,top-14],[x+w/2+6,top-9]]);
 }
 g.restore();
}
let rowhouseArt;
function rowhouses(x,baseY,w=256,h=67){
 if(!rowhouseArt){
  rowhouseArt=document.createElement('canvas');rowhouseArt.width=256;rowhouseArt.height=70;
  const target=g;g=rowhouseArt.getContext('2d');g.imageSmoothingEnabled=false;
  R('rgba(32,40,64,.20)',0,66,256,4);
  R(P.ink,0,12,256,55);R('#c98d75',1,14,254,52);
  for(let yy=17;yy<66;yy+=5){R('#b07a68',1,yy,254,1);for(let xx=(yy/5|0)%2?4:9;xx<255;xx+=10)R('#b07a68',xx,yy,1,5);}
  poly(P.ink,[[0,14],[4,2],[251,2],[256,14]]);
  poly('#596779',[[1,11],[6,4],[249,4],[254,11]]);
  R('#83909b',5,5,246,1);R('#3e4e63',2,10,252,1);
  for(let xx=13;xx<250;xx+=14)R('#6d7d8c',xx,7,8,1);
  R(P.ink,0,12,256,4);R(P.cream,0,13,256,2);
  R(P.cream,0,35,256,3);R(P.shadow,0,38,256,1);
  for(let xx=5;xx<254;xx+=8)R(P.paper,xx,14,3,3);
  for(const xx of [62,190]){R(P.ink,xx,0,8,12);R('#ad7665',xx+1,1,6,10);R(P.cream,xx-1,0,10,2);R('#815e55',xx+1,5,6,1);}
  for(const [i,kind] of ['boutique','seed','bakery','toy'].entries()){
   const xx=i*64,s=styles[kind];
   R(P.shadow,xx,16,2,50);R(P.cream,xx+2,16,2,50);
   for(const wx of [xx+13,xx+41]){windowAt(wx,19,10,13);R(P.cream,wx-1,18,12,2);R(P.paper,wx-2,32,14,2);}
   R(s.awning,xx+4,39,56,28);R(P.ink,xx+7,49,25,16);R(P.blue,xx+8,50,23,14);R(P.blueLight,xx+9,51,5,11);R(P.cream,xx+19,50,1,14);R(P.woodD,xx+6,65,27,2);
   windowAt(xx+49,51,8,13);door(xx+40,67,20);
   sign(s.name,xx+32,32,56);awning(xx+4,43,56,s.awning);
   R(P.cream,xx+3,53,2,14);R(P.cream,xx+59,53,2,14);
   if(kind==='boutique'){
    R(P.paper,xx+18,54,3,2);R(P.violet,xx+16,56,7,4);poly(P.violet,[[xx+17,58],[xx+13,63],[xx+26,63],[xx+22,58]]);R(P.cream,xx+19,55,1,8);
   }else if(kind==='seed'){
    R(P.woodL,xx+10,61,18,3);for(let n=0;n<3;n++){R(P.woodD,xx+11+n*6,59,5,3);R(P.leafL,xx+12+n*6,55,3,5);R(P.gold,xx+13+n*6,55,1,2);}
    R(P.woodD,xx+49,64,9,4);R(P.cream,xx+50,60,7,5);R(P.leafD,xx+52,59,3,3);
   }else if(kind==='bakery'){
    for(let yy=55;yy<64;yy+=6){R(P.woodD,xx+9,yy+3,21,2);for(let n=0;n<3;n++){R(P.gold,xx+10+n*7,yy,5,3);R(P.cream,xx+12+n*7,yy,1,1);}}
   }else{
    R(P.gold,xx+13,55,10,5);R(P.gold,xx+18,52,5,4);R(P.red,xx+22,55,3,2);R(P.ink,xx+21,53,1,1);R(P.red,xx+11,62,8,2);R(P.teal,xx+20,60,7,4);R(P.ink,xx+13,64,2,1);R(P.ink,xx+23,64,2,1);
   }
  }
  R(P.cream,254,16,2,51);g=target;
 }
 g.drawImage(rowhouseArt,0,0,256,70,Math.round(x),Math.round(baseY-h),Math.round(w),Math.round(h+3));
}
function stall(x,y,c){R(P.woodD,x,y,48,26);R(P.woodL,x+2,y+13,44,11);R(P.ink,x+1,y+24,3,5);R(P.ink,x+44,y+24,3,5);awning(x-2,y-8,52,c);R(P.woodD,x+3,y+11,42,3);for(let i=0;i<5;i++){R(i%2?P.gold:P.red,x+7+i*7,y+7,5,4);}R(P.wood,x+4,y+16,40,1);}
function table(x,y){R(P.woodD,x-9,y-2,20,8);R(P.cream,x-10,y-5,22,9);R(P.red,x-10,y-5,22,2);R(P.paper,x-3,y-4,6,4);R(P.woodD,x-8,y+5,2,5);R(P.woodD,x+8,y+5,2,5);R(P.woodD,x-15,y-1,4,8);R(P.woodD,x+13,y-1,4,8);}
function clock(x,y){R(P.ink,x-2,y-24,5,26);R(P.ink,x-9,y-38,19,18);R(P.gold,x-7,y-36,15,14);R(P.paper,x-5,y-34,11,10);line(P.ink,[[x,y-33],[x,y-29],[x+3,y-28]],1);R(P.ink,x-5,y+1,11,2);}
function pond(x,y){poly(P.curbD,[[x,y+8],[x+8,y],[x+43,y-2],[x+61,y+7],[x+64,y+23],[x+54,y+32],[x+15,y+34],[x-3,y+24]]);poly(P.water,[[x+2,y+10],[x+10,y+3],[x+42,y+1],[x+58,y+9],[x+60,y+22],[x+51,y+29],[x+16,y+31],[x+1,y+23]]);R(P.foam,x+15,y+9,10,1);R(P.foam,x+36,y+21,12,1);R(P.leafD,x+6,y+5,5,3);R(P.leafD,x+44,y+24,6,3);}
function gazebo(x,y){R(P.curbD,x-24,y+5,49,6);R(P.cream,x-21,y+3,43,3);for(const xx of [-18,16]){R(P.woodD,x+xx,y-23,4,27);R(P.paper,x+xx+1,y-22,2,25);}poly(P.ink,[[x-27,y-22],[x-12,y-35],[x+12,y-35],[x+27,y-22]]);poly(P.teal,[[x-23,y-24],[x-11,y-32],[x+11,y-32],[x+23,y-24]]);R(P.woodD,x-25,y-23,51,3);R(P.wood,x-18,y-3,37,3);R(P.gold,x-1,y-40,3,5);}

function laundry(x,y){line(P.woodD,[[x,y-20],[x,y],[x+63,y],[x+63,y-19]],1);R(P.paper,x+12,y-9,7,11);R(P.blueLight,x+27,y-9,7,10);R(P.red,x+43,y-9,6,9);}
const painters={ground,stone,road,crossing,building,rowhouses,bench,lamp,tree,bed,pot,fountain,stall,table,clock,pond,gazebo,laundry};
return {colors:P,paint(target,kind,args=[],night=false){if(lit!==night){lit=night;rowhouseArt=null;}g=target;painters[kind](...args);}};
})();
