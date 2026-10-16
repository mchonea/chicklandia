'use strict';
/* Approved roofline scene: upper facades, alleys and rear yards, drawn at native resolution. */
const CITY_ROOF_ART=(()=>{
const blocks=ROOF_TERRACES;
let g;
const C={ink:'#202840',paper:'#fff8ec',cream:'#ead6aa',gold:'#ffe05a',wood:'#a66c46',woodL:'#cf9865',woodD:'#594437',stone:'#a5b1b2',grass:'#749767',leaf:'#5b9e64',leafL:'#a1cb7c',leafD:'#30664f'};
const R=(c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,pts){g.fillStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
function text(s,x,y,c=C.paper,size=7,align='left'){g.font='bold '+size+'px monospace';g.textAlign=align;g.textBaseline='top';g.fillStyle=c;g.fillText(s,x,y);}
function sprite(k,x,y,scale=1){const i=SPR[k];if(i)g.drawImage(i,Math.round(x-i.width*scale/2),Math.round(y-i.height*scale),i.width*scale,i.height*scale);}
function shadow(x,y,w=22){R('#20284040',x-w/2+3,y-2,w-6,5);R('#20284040',x-w/2,y-1,w,3);}
function stone(x,y,w,h,base='#9ca8a3',joint='#8b9998'){
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();R(base,x,y,w,h);
 for(let yy=y;yy<y+h;yy+=6){R(joint,x,yy,w,1);for(let xx=x-(yy%12?5:0);xx<x+w;xx+=10)R(joint,xx,yy,1,6);}g.restore();
}
function fence(x,y,w){R('#536358',x,y+3,w,3);R('#69775f',x,y+10,w,2);for(let xx=x;xx<x+w;xx+=7){R(C.woodD,xx,y,3,15);R('#c4ac80',xx,y,2,13);R(C.cream,xx,y,1,3);}}
function tree(x,y){shadow(x,y,27);R(C.woodD,x-2,y-18,5,19);R(C.wood,x-1,y-13,2,12);poly(C.leafD,[[x-15,y-11],[x-17,y-22],[x-11,y-31],[x+1,y-35],[x+12,y-29],[x+16,y-19],[x+11,y-10],[x,y-7]]);poly(C.leaf,[[x-14,y-20],[x-9,y-29],[x+1,y-32],[x+11,y-26],[x+12,y-17],[x+3,y-11],[x-6,y-13]]);R(C.leafL,x-8,y-27,8,3);R(C.leafL,x-11,y-23,5,3);R(C.leafL,x,y-29,5,2);}
function pot(x,y){R(C.woodD,x-4,y-5,9,7);R('#bf7960',x-3,y-4,7,5);R(C.cream,x-5,y-6,11,2);R(C.leafD,x-5,y-12,10,5);R(C.leaf,x-3,y-16,7,8);R(C.gold,x-2,y-13,2,2);}
function laundry(x,y,w=45){R(C.woodD,x,y-17,2,21);R(C.woodD,x+w,y-17,2,21);R(C.cream,x,y-15,w+1,1);for(let n=0;n<4;n++){const xx=x+5+n*10,c=['#e3d9b9','#b58184','#83a3aa','#e3d9b9'][n];R(C.woodL,xx+2,y-16,2,3);R(c,xx,y-13,7,10);R('#ffffff33',xx+1,y-12,2,7);R(c,xx-2,y-12,2,4);R(c,xx+7,y-12,2,4);}}
function yard(b,n){
 const x=b.x,w=b.w;
 R('#58755e',x-2,0,w+4,b.y+4);R('#7f9c6d',x,0,w,b.y);stone(x+w-35,9,27,b.y-9,'#b9b79f','#a4ac99');
 R('#617f60',x+5,13,w-45,2);fence(x-1,1,w+2);
 for(let xx=x+8;xx<x+w-40;xx+=16){R('#8da979',xx,21,3,1);R('#66885f',xx+4,32,2,2);}
 if(!settings.yardDetails)return;
 if(n===0){
  tree(x+23,39);R('#536c53',x+62,21,41,17);R(C.woodD,x+60,20,44,3);for(let k=0;k<4;k++){R('#779460',x+64+k*10,25,6,9);R(C.leafL,x+65+k*10,24,3,4);R('#bd7964',x+66+k*10,29,2,2);}pot(x+w-21,32);
 }else if(n===1){
  laundry(x+19,36,44);R('#5b765b',x+82,23,26,13);R('#b89b76',x+82,22,26,3);R(C.woodD,x+85,27,2,12);R(C.woodD,x+103,27,2,12);pot(x+w-23,29);
 }else if(n===2){
  tree(x+24,41);R('#886e55',x+57,18,54,18);for(let yy=21;yy<35;yy+=5)R('#d5bd89',x+60,yy,48,1);for(let xx=x+64;xx<x+106;xx+=8){R('#385e4d',xx,21,4,11);R(C.leafL,xx,21,3,3);}pot(x+w-22,36);
 }else{laundry(x+12,36,36);pot(x+w-22,31);}
}
function alley(x,w,n){
 stone(x,0,w,192,'#8c9698','#78878c');R('#3b4d5a70',x,0,10,192);R('#27384650',x+w-8,0,8,192);
 R('#cfccb2',x+11,18,w-21,2);R('#4c6667',x+12,21,11,11);R('#344c56',x+11,20,13,3);R('#91a696',x+12,21,2,9);R('#404d59',x+w/2-5,171,11,5);for(let i=0;i<4;i++)R('#9aabab',x+w/2-4+i*2,171,1,4);
 for(let yy=48;yy<190;yy+=21)R('#abb2aa',x+w/2-1,yy,3,1);
 if(n===1){R('#576571',x+3,88,11,52);for(let y=92;y<140;y+=8)R('#c4bfa6',x+3,y,11,2);R('#283c4a',x+4,88,1,53);R('#283c4a',x+12,88,1,53);}
}
function windowAt(x,y,trim){
 R('#ad9883',x-4,y-3,25,31);R(C.cream,x-2,y-2,21,28);R(C.ink,x,y,17,24);R('#467b95',x+1,y+1,15,22);R('#8bb6c5',x+2,y+2,5,18);R('#b4cec7',x+3,y+2,2,9);R(C.cream,x+8,y+1,1,21);R(C.cream,x+1,y+11,15,1);
 R(C.woodD,x-7,y,5,24);R(trim,x-6,y+1,3,21);R(C.woodD,x+19,y,5,24);R(trim,x+20,y+1,3,21);for(let yy=y+4;yy<y+22;yy+=4){R('#ffffff33',x-6,yy,3,1);R('#ffffff33',x+20,yy,3,1);}R(C.woodD,x-3,y+25,23,3);R(C.cream,x-4,y+24,25,2);
}
function facade(b,n){
 const x=b.x,w=b.w,y=b.y+b.h;
 R('#20284050',x+7,y-2,w,65);R(C.ink,x-1,y,w+2,70);
 const half=Math.round(w/2);
 for(let k=0;k<2;k++){
  const xx=x+k*half,ww=k?w-half:half,c=b.walls[k];R(c,xx,y+4,ww,65);
  for(let yy=y+8;yy<193;yy+=6){R('#8b6e5522',xx+1,yy,ww-2,1);for(let px=xx+(yy%12?7:0);px<xx+ww;px+=16)R('#8b6e5522',px,yy,1,6);}
  R('#ffffff22',xx+2,y+8,3,60);R('#8b6e5540',xx+ww-5,y+8,4,60);
  const wins=ww>70?2:1;
  for(let j=0;j<wins;j++)windowAt(xx+(wins===2?14+j*(ww-44):Math.round(ww/2)-8),y+17,b.trim[k]);
  R('#9c8873',xx,y+54,ww,2);R(C.cream,xx,y+56,ww,2);
  const awningY=y+61;
  for(let p=0;p<ww-12;p+=6){R((p/6)%2?C.paper:b.trim[k],xx+6+p,awningY,Math.min(6,ww-12-p),7);}R('#594437',xx+6,awningY+7,ww-12,2);
 }
 R('#8f806f',x,y+5,w,4);R(C.cream,x-2,y+2,w+4,4);R(C.paper,x-3,y,w+6,2);
 for(let px=x+8;px<x+w-7;px+=16){R('#b7a78c',px,y+7,4,3);R(C.cream,px,y+6,3,3);}
 R('#ad9980',x+w-3,y+9,3,62);R('#394e5a',x+w+1,y+4,5,68);
 R('#536877',x+w-6,y+7,2,62);R('#a6b6b0',x+w-6,y+7,1,62);
}
function roof(b){
 const {x,y,w,h}=b;R(C.ink,x-2,y-2,w+4,h+4);R(b.shade,x,y,w,h);R(b.roof,x+5,y+6,w-10,h-16);
 for(let yy=y+9;yy<y+h-12;yy+=6){R(b.shade,x+5,yy,w-10,1);R('#ffffff12',x+6,yy+1,w-12,1);for(let xx=x+6+(yy%12?6:0);xx<x+w-5;xx+=12)R(b.shade,xx,yy+1,1,5);}
 for(let yy=y+h-12;yy<y+h;yy+=4){const inset=(yy-(y+h-12))/2;R(b.light,x+inset,yy,w-inset*2,1);R(b.shade,x+inset,yy+1,w-inset*2,1);}
 R('#c9bca1',x-1,y-2,w+2,3);R(C.paper,x,y-2,w,1);R('#8d8d80',x,y+1,w,3);R(C.cream,x-2,y,3,h-2);R('#c3b79b',x+w-1,y,3,h-2);
 R('#ffffff18',x+5,y+5,w-10,1);
}
function chimney(x,y,w=17,h=24){
 shadow(x+9,y+2,w+14);R(C.ink,x-w/2-1,y-h,w+2,h);R('#a96756',x-w/2,y-h+1,w,h-1);R('#cf9478',x-w/2+1,y-h+2,4,h-4);R('#754e4c',x+w/2-4,y-h+2,4,h-3);
 for(let yy=y-h+5;yy<y;yy+=5){R('#784e49',x-w/2,yy,w,1);R('#784e49',x+((yy%10)?-3:3),yy-4,1,4);}
 R(C.ink,x-w/2-3,y-h-3,w+6,5);R(C.cream,x-w/2-2,y-h-3,w+4,3);R('#584a48',x-w/2+1,y-h-1,w-2,2);R(C.ink,x-4,y-h-8,8,5);R('#b17f68',x-3,y-h-8,6,4);R(C.cream,x-4,y-h-9,8,2);
}
function skylight(x,y,w=29){
 shadow(x+w/2+4,y+10,w+7);poly(C.ink,[[x,y+11],[x+5,y-7],[x+w-3,y-7],[x+w,y+11]]);poly('#b2b6a7',[[x+2,y+8],[x+7,y-5],[x+w-5,y-5],[x+w-2,y+8]]);poly('#467b95',[[x+5,y+5],[x+8,y-3],[x+w-7,y-3],[x+w-5,y+5]]);poly('#8bb6c5',[[x+7,y+4],[x+9,y-2],[x+15,y-2],[x+12,y+4]]);R(C.cream,x+16,y-3,2,10);R(C.cream,x+5,y+3,w-10,1);R('#e3d6b8',x,y+8,w,3);R('#777d7b',x+1,y+11,w-2,3);
}
function pipe(x,y,w=33){
 shadow(x+w/2,y+3,w+7);R(C.ink,x-3,y-6,7,11);R('#76939b',x-2,y-5,5,8);R(C.ink,x,y-5,w,7);R('#77969e',x+1,y-4,w-2,5);R('#c7d0c3',x+2,y-4,w-4,2);R('#4f697b',x+2,y,w-4,1);R(C.ink,x+w-4,y-7,7,12);R('#77969e',x+w-3,y-6,5,10);R(C.cream,x+w-3,y-6,2,8);R('#c7d0c3',x-4,y-7,9,3);R('#c7d0c3',x+w-5,y-8,9,3);
}
function dormer(x,y,c){
 shadow(x+12,y+2,35);R(C.ink,x-13,y-23,28,25);R(c,x-11,y-21,24,22);R('#fff8ec55',x-10,y-19,2,19);R(C.ink,x-6,y-18,13,16);R('#467b95',x-5,y-17,11,14);R('#8bb6c5',x-4,y-16,4,11);R(C.cream,x,y-16,1,13);R(C.cream,x-5,y-10,11,1);R(C.cream,x-8,y-2,17,3);
 poly(C.ink,[[x-17,y-22],[x,y-34],[x+18,y-22],[x+14,y-17],[x,y-27],[x-13,y-17]]);poly('#527d91',[[x-14,y-22],[x,y-31],[x+15,y-22],[x+13,y-20],[x,y-28],[x-12,y-20]]);R(C.paper,x-1,y-32,2,3);
}
function stairHut(x,y){
 shadow(x+11,y+3,29);R(C.ink,x-12,y-23,26,28);R(C.cream,x-10,y-22,22,25);R(C.woodD,x-6,y-18,14,21);R(C.woodL,x-5,y-17,11,4);R(C.wood,x-5,y-11,11,11);R(C.gold,x+3,y-8,2,2);R('#c6b998',x-12,y+3,26,4);R(C.paper,x-13,y+2,28,2);poly(C.ink,[[x-17,y-23],[x,y-35],[x+19,y-23],[x+15,y-20],[x,y-29],[x-13,y-20]]);poly('#8b4143',[[x-14,y-23],[x,y-32],[x+16,y-23],[x+13,y-22],[x,y-29],[x-12,y-22]]);
}
function nest(x,y){
 shadow(x,y+1,23);R('#574c40',x-10,y-4,21,7);R('#b29565',x-9,y-6,19,8);R('#584a40',x-6,y-5,13,5);R('#e0c08a',x-11,y-3,9,2);R('#cfad78',x+2,y-3,10,2);R('#e0c08a',x-7,y+1,15,2);R(C.cream,x-4,y-5,4,4);R('#ddd5b5',x+2,y-5,4,4);
}
function gull(x,y,flying=false){
 const pixels=flying?[
 '.............kk.............',
 '............kwwk............',
 '.......kk..kwwwwk..kk.......',
 '......kwwkkwwggwwkkwwk......',
 '.....kwwwwwwwggwwwwwwwk.....',
 '....kwwwwwwwwggwwwwwwwwk....',
 '..kkgggwwwwwwwwwwwwggggkk..',
 '.kggggggggwwwwwwwwgggggggk.',
 'kkkkkkkkggwwwwwwwwggkkkkkkk.',
 '.........kwwwwwwwwk........',
 '.......kkwwwwwwwwk.........',
 '......kwwwkwwwwwk..........',
 '...ooowwwwwwwkkk...........',
 '...ooowwwwwkk..............',
 '.......kkkk................'
 ]:[
 '.....kkkk...............',
 '....kwwwwk..............',
 '...kwwwwwwk.............',
 '...kwwkwwwk.............',
 'ooowwwwwwwk.............',
 'ooowwwwwwkk.............',
 '....kwwwwwwkkkk.........',
 '....kwwwwwwwwwwk........',
 '....kwwwwwggggwwkk......',
 '.....kwwwgggggggggkk....',
 '.....kwwwwgggggggggkk...',
 '......kwwwwwwwwwwkkk....',
 '.......kkwwwwwwkk.......',
 '.........kkkkkk.........',
 '..........o..o..........',
 '.........oo.oo..........'
 ];
 const colors={k:C.ink,w:C.paper,g:'#a5b4b4',o:'#d7a54e'},ox=Math.round(x-pixels[0].length/2),oy=Math.round(y-pixels.length);
 for(let yy=0;yy<pixels.length;yy++)for(let xx=0;xx<pixels[yy].length;xx++){const c=colors[pixels[yy][xx]];if(c)R(c,ox+xx,oy+yy);}
}

const settings={yardDetails:true};
function background(){return mk(768,192,ctx=>{g=ctx;R('#89968b',0,0,768,192);blocks.forEach(yard);[[176,40],[384,40],[600,40]].forEach(([x,w],i)=>alley(x,w,i));blocks.forEach(facade);blocks.forEach(roof);});}
const props={stairHut,dormer,chimney,pipe,skylight,laundry,pot,nest};
return {background,prop(ctx,kind,args){g=ctx;props[kind](...args);},gull(ctx,x,y,flying){g=ctx;gull(x,y,flying);}};
})();
