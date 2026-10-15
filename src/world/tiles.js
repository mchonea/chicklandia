'use strict';
/* ---------------- tiles ---------------- */
const TILE={};
function grassBase(x,seed){P_(x,'g',0,0,16,16);const r=mulberry(seed);
  // Sparse clusters leave room for characters, items and quest markers to read.
  if(seed%3!==0){const i=2+(r()*11|0),j=3+(r()*10|0);P_(x,'G',i,j,2,1);P_(x,'G',i+1,j-1);}
  if(seed%3===1)P_(x,'l',2+(r()*12|0),2+(r()*12|0),2,1);}
function blob(x,cx,cy,rx,ry,fn){for(let j=0;j<16;j++)for(let i=0;i<16;i++){const dx=(i+.5-cx)/rx,dy=(j+.5-cy)/ry,d=dx*dx+dy*dy;if(d<1){const c=fn(d,dx,dy,i,j);if(c)P_(x,c,i,j);}}}
TILE.grass=[0,1,2].map(s=>mk(16,16,x=>grassBase(x,s*99+7)));
TILE.flower=[0,1].map(s=>mk(16,16,x=>{grassBase(x,s+50);const r=mulberry(s+3);
  for(let n=0;n<2;n++){const i=(3+r()*10)|0,j=(3+r()*10)|0;const pc=(n===1&&s===1)?'p':'w';
    P_(x,pc,i-1,j);P_(x,pc,i+1,j);P_(x,pc,i,j-1);P_(x,pc,i,j+1);P_(x,'y',i,j);}}));
TILE.dirt=mk(16,16,x=>{P_(x,'t',0,0,16,16);[[3,4],[12,10],[6,14]].forEach(([i,j])=>{P_(x,'T',i,j,2,1);P_(x,'n',i,j-1);});});
TILE.patch=mk(16,16,x=>{grassBase(x,17);blob(x,8,8,7.5,6.8,(d,dx,dy,i,j)=>d>0.8?'B':((i*7+j*3)%5===0?'m':'b'));});
TILE.mud=mk(16,16,x=>{P_(x,'b',0,0,16,16);const r=mulberry(5);for(let n=0;n<8;n++)P_(x,'B',(r()*15)|0,(r()*15)|0,2,1);P_(x,'T',4,5);P_(x,'T',11,10);});
TILE.water=[0,1].map(f=>mk(16,16,x=>{P_(x,'u',0,0,16,16);
  for(const [i,j] of [[2,4],[10,11]]){const o=(i+f*2)%12;P_(x,'U',o+1,j+1,3,1);P_(x,'c',o,j,4,1);P_(x,'w',o+1,j,1,1);}}));
TILE.reeds=mk(16,16,x=>{grassBase(x,31);[[3,5],[6,3],[9,6],[12,4]].forEach(([i,j])=>{P_(x,'G',i,j,1,16-j);P_(x,'B',i,j-3,1,3);});P_(x,'l',4,9,1,6);P_(x,'l',10,10,1,5);});
TILE.fenceH=mk(16,16,x=>{grassBase(x,13);
  for(const y of [4,9]){P_(x,'k',0,y-1,16,1);P_(x,'T',0,y,16,1);P_(x,'b',0,y+1,16,1);P_(x,'k',0,y+2,16,1);}
  P_(x,'k',5,1,6,14);P_(x,'T',6,2,4,1);P_(x,'b',6,3,4,11);P_(x,'B',9,3,1,11);P_(x,'G',5,15,6,1);});
TILE.fenceV=mk(16,16,x=>{grassBase(x,13);P_(x,'k',6,0,4,16);P_(x,'T',7,0,1,16);P_(x,'b',8,0,1,16);
  P_(x,'k',4,3,8,10);P_(x,'T',5,4,6,1);P_(x,'b',5,5,6,7);P_(x,'B',10,5,1,7);P_(x,'G',4,13,8,2);});
TILE.tall=mk(16,16,x=>{P_(x,'B',0,0,16,16);for(let i=0;i<16;i+=4){P_(x,'b',i,0,3,16);P_(x,'T',i,0,1,16);P_(x,'k',i+3,0,1,16);}
  P_(x,'k',0,5,16,1);P_(x,'m',0,6,16,2);P_(x,'k',0,8,16,1);});
function treeTile(x,apples){grassBase(x,21);P_(x,'G',3,13,11,2);P_(x,'k',7,10,3,6);P_(x,'b',8,11,1,4);
  const canopy=['......kkkk......','....kkllllkk....','...klllllllgk...','..klllggggggGk..','.kllggggggggGGk.','.klggggggggGGGk.','kgggggggggGGGGGk','kggggggggGGGGGGk','.kgggggGGGGGGGk.','..kGGGGGGGGGGk..','...kkGGGGGGkk...','.....kkkkkk.....'];
  canopy.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]!=='.')P_(x,row[i],i,j);});P_(x,'l',3,5,2,1);P_(x,'g',10,7,2,1);
  if(apples)[[5,4],[10,3],[8,8],[3,8]].forEach(([i,j])=>{P_(x,'R',i,j+1,2,1);P_(x,'r',i,j,2,1);P_(x,'w',i,j);});}
TILE.tree=mk(16,16,x=>treeTile(x,false));
TILE.apple=mk(16,16,x=>treeTile(x,true));
TILE.bush=mk(16,16,x=>{grassBase(x,41);P_(x,'G',2,13,12,2);
  blob(x,8,8.5,7.6,6.6,(d,dx,dy)=>d>0.8?'k':dy>0.28||dx>0.5?'G':dx<-0.15&&dy<-0.2?'l':'g');P_(x,'g',4,8,3,1);P_(x,'l',7,4,2,1);});
TILE.hay=mk(16,16,x=>{grassBase(x,51);P_(x,'k',1,2,14,13);P_(x,'y',2,3,12,10);P_(x,'Y',2,10,12,3);
  for(let i=4;i<13;i+=3)P_(x,'Q',i,4,1,7);P_(x,'B',2,7,12,1);P_(x,'w',3,3,4,1);});
TILE.rock=mk(16,16,x=>{grassBase(x,61);P_(x,'G',2,13,13,2);
  blob(x,8,8.5,7.4,6.8,(d,dx,dy)=>{if(d>0.75)return'k';if(dy>0.35)return'E';if(dx<-0.2&&dy<-0.2&&d<0.4)return'n';return'e';});
  P_(x,'k',7,4,1,3);P_(x,'k',8,7,1,2);P_(x,'k',9,9,1,2);P_(x,'k',6,7,1,1);});
TILE.crate=mk(16,16,x=>{grassBase(x,71);P_(x,'k',1,2,14,13);P_(x,'b',2,3,12,11);P_(x,'B',2,12,12,2);P_(x,'T',2,3,12,1);
  for(let k=0;k<8;k++){P_(x,'T',4+k,4+k);P_(x,'T',11-k,4+k);}P_(x,'B',2,3,1,11);P_(x,'B',13,3,1,11);});
TILE.leaves=mk(16,16,x=>{grassBase(x,81);blob(x,8,10,7.8,6,(d,dx,dy)=>d>0.8?'B':dy>0.35?'b':'o');
  [[3,8],[7,6],[10,9],[5,12],[11,12]].forEach(([i,j],n)=>{P_(x,n%2?'r':'Q',i,j,3,1);P_(x,'Y',i,j-1,2,1);});});
TILE.sign=mk(16,16,x=>{grassBase(x,91);P_(x,'k',7,8,3,7);P_(x,'B',8,8,1,6);P_(x,'k',1,2,14,8);P_(x,'t',2,3,12,6);P_(x,'T',3,4,9,1);P_(x,'T',3,6,7,1);});
TILE.roof=mk(16,16,x=>{P_(x,'R',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'k',0,j+3,16,1);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'k',i,j,1,3);}P_(x,'r',0,0,16,1);});
TILE.barn=mk(16,16,x=>{P_(x,'r',0,0,16,16);for(let i=0;i<16;i+=4)P_(x,'R',i,0,1,16);P_(x,'w',0,0,16,2);P_(x,'k',0,2,16,1);P_(x,'R',0,15,16,1);});
TILE.door=mk(16,16,x=>{P_(x,'r',0,0,16,16);P_(x,'w',0,0,16,2);P_(x,'k',0,2,16,1);P_(x,'w',1,3,14,13);P_(x,'R',3,5,10,11);
  for(let k=0;k<10;k++){P_(x,'w',3+k,5+k);P_(x,'w',12-k,5+k);}});
TILE.croof=mk(16,16,x=>{P_(x,'B',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'b',0,j,16,3);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'B',i,j,1,3);}});
TILE.cwall=mk(16,16,x=>{P_(x,'t',0,0,16,16);for(let j=0;j<16;j+=4)P_(x,'T',0,j+3,16,1);P_(x,'k',0,0,16,1);});
TILE.cdoor=mk(16,16,x=>{x.drawImage(TILE.cwall,0,0);P_(x,'k',3,4,10,12);P_(x,'B',4,5,8,11);P_(x,'y',5,13,6,3);P_(x,'Y',6,14,2,1);});
// farmhouse exterior
TILE.hroof=mk(16,16,x=>{P_(x,'U',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'k',0,j+3,16,1);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'k',i,j,1,3);}P_(x,'u',0,0,16,1);});
TILE.hwall=mk(16,16,x=>{P_(x,'w',0,0,16,16);for(let j=3;j<16;j+=4)P_(x,'e',0,j,16,1);P_(x,'k',0,0,16,1);P_(x,'E',0,15,16,1);});
TILE.hwin=mk(16,16,x=>{x.drawImage(TILE.hwall,0,0);P_(x,'k',3,3,10,9);P_(x,'c',4,4,8,7);P_(x,'k',7,4,1,7);P_(x,'k',4,7,8,1);P_(x,'w',4,4,2,1);P_(x,'r',2,12,12,2);P_(x,'g',3,11,2,1);P_(x,'g',9,11,3,1);});
TILE.hdoor=mk(16,16,x=>{x.drawImage(TILE.hwall,0,0);P_(x,'k',3,2,10,14);P_(x,'b',4,3,8,13);P_(x,'B',4,8,8,1);P_(x,'T',5,4,6,3);P_(x,'T',5,10,6,4);P_(x,'q',10,9,1,1);});
TILE.garden=mk(16,16,x=>{P_(x,'b',0,0,16,16);for(let j=2;j<16;j+=5){P_(x,'B',0,j,16,2);P_(x,'T',0,j+2,16,1);}});
// interiors
TILE.floor=mk(16,16,x=>{P_(x,'t',0,0,16,16);for(let j=0;j<16;j+=8){P_(x,'T',0,j+7,16,1);P_(x,'T',j?4:12,j,1,7);P_(x,'n',1,j+1,5,1);}});
TILE.straw=mk(16,16,x=>{P_(x,'t',0,0,16,16);const r=mulberry(123);for(let n=0;n<7;n++){const i=(r()*13)|0,j=(r()*15)|0;P_(x,n%3?'Y':'y',i,j,3,1);}});
TILE.wtop=mk(16,16,x=>{P_(x,'#2e1c10',0,0,16,16);P_(x,'#3a2416',0,7,16,1);P_(x,'#3a2416',7,0,1,7);P_(x,'#3a2416',12,8,1,8);});
TILE.wface=mk(16,16,x=>{P_(x,'b',0,0,16,16);for(let i=0;i<16;i+=4){P_(x,'B',i,0,1,16);P_(x,'T',i+1,0,1,16);}P_(x,'k',0,0,16,2);P_(x,'B',0,13,16,3);});
TILE.wwin=mk(16,16,x=>{x.drawImage(TILE.wface,0,0);P_(x,'k',3,3,10,9);P_(x,'c',4,4,8,7);P_(x,'k',7,4,1,7);P_(x,'k',4,7,8,1);P_(x,'w',4,4,2,1);P_(x,'w',8,8,1,1);});
TILE.hearth=mk(16,16,x=>{P_(x,'e',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'E',0,j+3,16,1);P_(x,'E',(j%8?4:11),j,1,3);}P_(x,'k',2,6,12,10);P_(x,'B',3,7,10,9);P_(x,'E',0,0,16,2);});
TILE.counter=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'n',0,1,16,5);P_(x,'w',0,1,16,1);P_(x,'b',0,7,16,9);P_(x,'B',0,11,16,1);P_(x,'B',7,7,1,9);P_(x,'q',3,9,2,1);P_(x,'q',11,9,2,1);});
TILE.table=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',0,2,16,11);P_(x,'b',0,3,16,8);P_(x,'T',0,3,16,1);P_(x,'B',0,10,16,1);P_(x,'k',2,13,2,3);P_(x,'k',12,13,2,3);});
TILE.bedtop=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',0,0,16,16);P_(x,'B',1,0,14,4);P_(x,'w',2,5,12,6);P_(x,'n',2,9,12,2);P_(x,'r',1,12,14,4);});
TILE.bedlow=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',0,0,16,15);P_(x,'r',1,0,14,14);for(let i=1;i<15;i+=4)for(let j=1;j<14;j+=4){P_(x,'w',i+1,j+1,2,2);}P_(x,'R',1,12,14,2);});
TILE.rug=mk(16,16,x=>{P_(x,'r',0,0,16,16);for(let i=2;i<16;i+=6)for(let j=2;j<16;j+=6){P_(x,'q',i+1,j,1,3);P_(x,'q',i,j+1,3,1);}});
TILE.plant=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',4,9,8,7);P_(x,'f',5,10,6,5);P_(x,'o',5,10,6,1);
  blob(x,8,6,6,5,(d,dx,dy)=>d>0.8?'k':(dx<0&&dy<0?'l':'g'));P_(x,'G',8,4,1,4);});
TILE.nest=mk(16,16,x=>{x.drawImage(TILE.straw,0,0);blob(x,8,10,7.5,5,(d)=>d>0.82?'k':(d>0.45?'b':'B'));P_(x,'k',5,5,6,6);P_(x,'w',6,6,4,4);P_(x,'n',6,8,4,2);P_(x,'Y',3,9,4,1);P_(x,'Y',10,11,3,1);});
TILE.hayIn=mk(16,16,x=>{x.drawImage(TILE.straw,0,0);P_(x,'k',1,2,14,13);P_(x,'y',2,3,12,10);P_(x,'Y',2,10,12,3);
  for(let i=4;i<13;i+=3)P_(x,'Q',i,4,1,7);P_(x,'B',2,7,12,1);P_(x,'w',3,3,4,1);});
TILE.railH=mk(16,16,x=>{x.drawImage(TILE.straw,0,0);for(const y of [4,9]){P_(x,'k',0,y-1,16,1);P_(x,'T',0,y,16,1);P_(x,'b',0,y+1,16,1);P_(x,'k',0,y+2,16,1);}
  P_(x,'k',5,1,6,14);P_(x,'T',6,2,4,1);P_(x,'b',6,3,4,11);P_(x,'B',9,3,1,11);});
TILE.railV=mk(16,16,x=>{x.drawImage(TILE.straw,0,0);P_(x,'k',6,0,4,16);P_(x,'T',7,0,1,16);P_(x,'b',8,0,1,16);P_(x,'k',4,3,8,10);P_(x,'T',5,4,6,1);P_(x,'b',5,5,6,7);P_(x,'B',10,5,1,7);});
// secret areas
TILE.caveWall=mk(16,16,x=>{P_(x,'#3a2414',0,0,16,16);const r=mulberry(301);for(let n=0;n<10;n++)P_(x,'#4a3020',(r()*14)|0,(r()*14)|0,3,2);});
TILE.caveFace=mk(16,16,x=>{P_(x,'B',0,0,16,16);const r=mulberry(302);for(let n=0;n<12;n++)P_(x,'m',(r()*14)|0,(r()*14)|0,2,2);P_(x,'k',0,0,16,1);P_(x,'#2a180c',0,13,16,3);P_(x,'G',3,1,1,9);P_(x,'G',11,3,1,7);P_(x,'l',3,9,1,1);P_(x,'l',11,9,1,1);});
TILE.caveFloor=mk(16,16,x=>{P_(x,'#b08850',0,0,16,16);const r=mulberry(303);for(let n=0;n<12;n++)P_(x,'#94703c',(r()*15)|0,(r()*15)|0,2,1);for(let n=0;n<4;n++)P_(x,'#c8a068',(r()*15)|0,(r()*15)|0,1,1);});
TILE.stoneTop=mk(16,16,x=>{P_(x,'#2a2a38',0,0,16,16);P_(x,'#3a3a4c',0,7,16,1);P_(x,'#3a3a4c',7,0,1,7);P_(x,'#3a3a4c',12,8,1,8);});
TILE.stoneFace=mk(16,16,x=>{P_(x,'E',0,0,16,16);for(let j=0;j<16;j+=5){P_(x,'k',0,j+4,16,1);P_(x,'k',(j%10?5:12),j,1,4);}P_(x,'e',1,1,3,1);P_(x,'e',8,6,3,1);P_(x,'k',0,0,16,1);});
TILE.stoneFloor=mk(16,16,x=>{P_(x,'#8295a5',0,0,16,16);P_(x,'#657b8b',0,7,16,1);P_(x,'#657b8b',7,0,1,7);P_(x,'#657b8b',11,8,1,8);P_(x,'#a8bcc7',1,1,4,1);P_(x,'#a8bcc7',1,9,5,1);});
TILE.plate=mk(16,16,x=>{x.drawImage(TILE.stoneFloor,0,0);P_(x,'k',2,2,12,12);P_(x,'#c98a00',3,3,10,10);P_(x,'#ffd21e',3,3,10,1);P_(x,'#8a5a00',3,12,10,1);});
TILE.gate=mk(16,16,x=>{x.drawImage(TILE.stoneFloor,0,0);P_(x,'k',0,0,16,2);for(let i=1;i<16;i+=4){P_(x,'k',i,0,3,16);P_(x,'e',i+1,0,1,16);}P_(x,'k',0,7,16,2);P_(x,'e',0,7,16,1);});
TILE.barrel=mk(16,16,x=>{x.drawImage(TILE.stoneFloor,0,0);P_(x,'k',2,1,12,15);P_(x,'b',3,2,10,13);P_(x,'B',3,5,10,1);P_(x,'B',3,11,10,1);P_(x,'T',4,3,2,11);P_(x,'B',3,2,10,1);});
TILE.crack=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'B',3,6,4,1);P_(x,'B',6,7,3,1);P_(x,'B',8,8,4,1);P_(x,'B',11,9,2,1);P_(x,'B',5,10,2,1);P_(x,'k',8,7,1,1);});
TILE.trap=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',1,1,14,14);P_(x,'#140a08',2,2,12,12);for(let j=0;j<4;j++)P_(x,'b',3,4+j*3,10,1);P_(x,'T',1,0,14,1);});
TILE.hole=mk(16,16,x=>{grassBase(x,401);blob(x,8,9,6.5,4.5,d=>d>0.7?'B':'k');P_(x,'G',3,5,2,1);P_(x,'G',11,5,2,1);});
TILE.shroom=mk(16,16,x=>{grassBase(x,411);[[4,9],[10,6],[11,12]].forEach(([i,j])=>{P_(x,'k',i-2,j-2,5,4);P_(x,'r',i-1,j-1,3,2);P_(x,'w',i,j-1,1,1);P_(x,'n',i,j+1,1,2);});});
TILE.ring=mk(16,16,x=>{grassBase(x,421);for(let a=0;a<8;a++){const i=Math.round(8+Math.cos(a*0.785)*6),j=Math.round(8+Math.sin(a*0.785)*5);P_(x,'k',i-1,j-1,3,3);P_(x,a%2?'p':'w',i,j,1,1);}});
function exitOn(base){return mk(16,16,x=>{x.drawImage(base,0,0);P_(x,'#ffe7a0',3,8,10,8);P_(x,'#fff6d0',5,12,6,4);});}
TILE.exitCave=exitOn(TILE.caveFloor);TILE.exitStone=exitOn(TILE.stoneFloor);
// part 2 tiles
TILE.snow=[0,1].map(s=>mk(16,16,x=>{P_(x,'#e8f0f8',0,0,16,16);for(const [i,j] of [[3+s*3,5],[10-s*2,12]]){P_(x,'#cfdcec',i,j,3,1);P_(x,'#ffffff',i-1,j-1,3,1);}}));
TILE.sand=[0,1].map(s=>mk(16,16,x=>{P_(x,'#f2dca0',0,0,16,16);for(const [i,j] of [[3+s*3,4],[10-s*2,12]]){P_(x,'#dcc080',i,j,2,1);P_(x,'#fff0c8',i,j-1,2,1);}}));
TILE.cobble=mk(16,16,x=>{P_(x,'#758b98',0,0,16,16);for(let j=0;j<16;j+=4)for(let i=(j%8?-4:0);i<16;i+=8){P_(x,'#95a9b2',i,j,7,3);P_(x,'#b8c9cc',i+1,j,5,1);}});
TILE.cliff=mk(16,16,x=>{P_(x,'#6a6a7a',0,0,16,16);const r=mulberry(540);for(let n=0;n<7;n++){const i=(r()*13)|0,j=(r()*12)|0;P_(x,'#8a8a9a',i,j,4,3);P_(x,'#4a4a5a',i,j+3,4,1);}P_(x,'#ffffff',0,0,16,2);P_(x,'#e8f0f8',2,2,5,1);P_(x,'#e8f0f8',10,2,4,1);});
TILE.pine=mk(16,16,x=>{x.drawImage(TILE.snow[0],0,0);P_(x,'#cfdcec',3,13,10,2);P_(x,'k',7,12,2,4);P_(x,'B',7,12,2,3);
  for(let j=0;j<3;j++){const w=4+j*2,y=1+j*4;P_(x,'k',8-w-1,y,w*2+2,5);P_(x,'G',8-w,y,w*2,4);P_(x,'#ffffff',8-w,y,w*2,1);P_(x,'g',8-w+1,y+1,2,2);}});
TILE.boulder=mk(16,16,x=>{x.drawImage(TILE.snow[1],0,0);blob(x,8,8.5,7.8,7.2,(d,dx,dy)=>{if(d>0.8)return'k';if(dy<-0.5&&d<0.75)return'w';if(dy>0.35)return'E';return'e';});
  P_(x,'k',5,5,1,4);P_(x,'k',6,8,3,1);P_(x,'k',10,4,1,3);P_(x,'G',3,11,3,1);});
TILE.chasm=mk(16,16,x=>{P_(x,'#140c1c',0,0,16,16);P_(x,'#202840',2,4,3,1);P_(x,'#202840',10,9,4,1);});
TILE.deep=[0,1].map(f=>mk(16,16,x=>{P_(x,'#24577c',0,0,16,16);for(const [i,j] of [[2,5],[10,12]]){const o=(i+f*2)%12;P_(x,'#193f60',o+1,j+1,4,1);P_(x,'#5c9eb5',o,j,4,1);}}));
TILE.oak=mk(16,16,x=>{treeTile(x,false);[[4,4],[10,3],[8,8],[11,8],[4,8]].forEach(([i,j])=>{P_(x,'b',i,j+1,2,1);P_(x,'B',i,j,2,1);});});
TILE.palm=mk(16,16,x=>{x.drawImage(TILE.sand[0],0,0);P_(x,'#dcc080',4,14,9,2);for(let j=5;j<15;j++){const i=7+Math.round(Math.sin(j/3)*1.2);P_(x,'k',i-1,j,4,1);P_(x,'T',i,j,2,1);}
  [[-1,-1],[1,-1],[-1,0],[1,0]].forEach(([dx,dy])=>{for(let k=0;k<6;k++){const i=8+dx*k,j=4+dy*2+Math.round(k*k*0.12);P_(x,'k',i-1,j-1,3,3);}});
  [[-1,-1],[1,-1],[-1,0],[1,0]].forEach(([dx,dy])=>{for(let k=0;k<6;k++){const i=8+dx*k,j=4+dy*2+Math.round(k*k*0.12);P_(x,k%2?'g':'G',i,j,1,1);P_(x,'g',i,j-1,1,1);}});
  P_(x,'b',6,4,2,2);P_(x,'b',9,5,2,2);});
TILE.brock=mk(16,16,x=>{x.drawImage(TILE.sand[1],0,0);blob(x,8,9,7.4,6.4,(d,dx,dy)=>d>0.78?'k':(dy>0.3?'E':(dx<-0.2&&dy<-0.2?'n':'e')));P_(x,'G',4,6,2,1);});
TILE.planks=mk(16,16,x=>{P_(x,'#1f4fa0',0,0,16,16);P_(x,'k',0,1,16,14);for(let i=0;i<16;i+=4){P_(x,'t',i,2,3,12);P_(x,'T',i,12,3,2);}});
TILE.dam=[0,1].map(f=>mk(16,16,x=>{x.drawImage(TILE.deep[f],0,0);P_(x,'k',1,4,7,4);P_(x,'b',2,5,5,2);P_(x,'k',9,9,6,4);P_(x,'b',10,10,4,2);P_(x,'T',3,5,2,1);}));
TILE.roofC=mk(16,16,x=>{P_(x,'#c8603c',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'#9a4028',0,j+3,16,1);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'#9a4028',i,j,1,3);}P_(x,'#e08060',0,0,16,1);});
TILE.brick=mk(16,16,x=>{P_(x,'#b0503c',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'#e8c8a0',0,j+3,16,1);for(let i=(j%8?0:4);i<16;i+=8)P_(x,'#e8c8a0',i,j,1,3);}P_(x,'k',0,0,16,1);});
TILE.brickWin=mk(16,16,x=>{x.drawImage(TILE.brick,0,0);P_(x,'k',3,3,10,10);P_(x,'#2a3a5a',4,4,8,8);P_(x,'k',7,4,1,8);P_(x,'k',4,7,8,1);P_(x,'#e8c8a0',2,13,12,1);});
TILE.awning=mk(16,16,x=>{x.drawImage(TILE.brick,0,0);P_(x,'k',0,1,16,11);for(let i=0;i<16;i+=4){P_(x,'r',i,2,2,9);P_(x,'w',i+2,2,2,9);}for(let i=0;i<16;i+=4){P_(x,'k',i+1,11,2,2);P_(x,i%8?'w':'r',i+1,11,2,1);}});
TILE.lamp=mk(16,16,x=>{x.drawImage(TILE.cobble,0,0);P_(x,'k',7,4,2,12);P_(x,'E',7,5,1,11);P_(x,'k',4,0,8,5);P_(x,'#fff3a0',5,1,6,3);P_(x,'k',6,15,4,1);});
TILE.fountainBase=mk(16,16,x=>{x.drawImage(TILE.cobble,0,0);});
TILE.bench=mk(16,16,x=>{x.drawImage(TILE.cobble,0,0);P_(x,'k',1,4,14,7);P_(x,'b',2,5,12,2);P_(x,'T',2,5,12,1);P_(x,'b',2,8,12,2);P_(x,'k',2,11,2,3);P_(x,'k',12,11,2,3);});
TILE.signO=mk(16,16,x=>{P_(x,'k',7,8,3,7);P_(x,'B',8,8,1,6);P_(x,'k',1,2,14,8);P_(x,'t',2,3,12,6);P_(x,'T',3,4,9,1);P_(x,'T',3,6,7,1);});
TILE.stakes=mk(16,16,x=>{});
TILE.goldroof=mk(16,16,x=>{P_(x,'Q',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'q',0,j,16,3);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'Q',i,j,1,3);}P_(x,'w',2,1,2,1);P_(x,'w',10,9,2,1);});
// city tiles
TILE.brickDoor=mk(16,16,x=>{x.drawImage(TILE.brick,0,0);P_(x,'k',3,2,10,14);P_(x,'b',4,3,8,13);P_(x,'B',4,8,8,1);P_(x,'T',5,4,6,3);P_(x,'T',5,10,6,4);P_(x,'q',10,9,1,1);P_(x,'#e8c8a0',2,1,12,1);});
TILE.ship=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'B',0,1,16,14);for(let j=3;j<14;j+=4)P_(x,'b',0,j,16,1);P_(x,'T',0,1,16,1);P_(x,'k',5,6,6,6);P_(x,'c',6,7,4,4);P_(x,'#e8c8a0',7,7,1,4);});
TILE.stackCrate=mk(16,16,x=>{x.drawImage(TILE.cobble,0,0);P_(x,'k',1,5,14,10);P_(x,'b',2,6,12,8);P_(x,'T',2,6,12,1);P_(x,'B',7,6,1,8);P_(x,'k',3,0,10,6);P_(x,'t',4,1,8,4);P_(x,'T',4,1,8,1);});
TILE.roofWalk=mk(16,16,x=>{P_(x,'#d8805c',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'#b85c3c',0,j+3,16,1);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'#b85c3c',i,j,1,3);}P_(x,'#f0a080',0,0,16,1);});
TILE.shelf=mk(16,16,x=>{P_(x,'B',0,0,16,16);P_(x,'k',0,0,16,1);P_(x,'k',0,7,16,1);P_(x,'k',0,15,16,1);const cs=['r','u','y','g','p','o'];for(let i=0;i<6;i++){P_(x,cs[i],1+i*2+(i>2?1:0),1,2,6);P_(x,cs[(i+2)%6],1+i*2+(i>2?1:0),8,2,7);}});
TILE.pedestal=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',2,7,12,9);P_(x,'e',3,8,10,7);P_(x,'E',3,13,10,2);P_(x,'k',3,1,10,7);P_(x,'c',4,2,8,5);P_(x,'w',5,2,1,2);});
TILE.pad=mk(16,16,x=>{x.drawImage(TILE.dirt,0,0);P_(x,'B',0,0,2,2);P_(x,'B',14,0,2,2);P_(x,'B',0,14,2,2);P_(x,'B',14,14,2,2);P_(x,'T',3,3,10,1);P_(x,'T',3,12,10,1);});
// sea tiles
TILE.coral=mk(16,16,x=>{x.drawImage(TILE.sand[0],0,0);P_(x,'k',2,6,5,9);P_(x,'#ff6fae',3,6,3,8);P_(x,'k',7,3,6,12);P_(x,'#eb6654',8,3,4,11);P_(x,'k',11,7,4,8);P_(x,'#f6a6b6',11,7,3,7);P_(x,'#fff8ec',4,7,1,1);P_(x,'#fff8ec',9,4,1,1);});
TILE.seaweed=mk(16,16,x=>{x.drawImage(TILE.sand[1],0,0);for(const [i,h] of [[3,10],[7,13],[11,9]]){P_(x,'G',i,15-h,2,h);P_(x,'g',i+1,15-h+1,1,h-2);P_(x,'l',i,15-h,1,2);}});
TILE.curR=[0,1,2,3].map(f=>mk(16,16,x=>{x.drawImage(TILE.water[0],0,0);P_(x,'c',0,0,16,1);for(const j of [4,10]){for(let i=-4;i<16;i+=8){const o=((i+f*2+16)%16);P_(x,'w',o,j,4,1);P_(x,'w',o+3,j-1,1,3);}}}));
TILE.curL=[0,1,2,3].map(f=>mk(16,16,x=>{x.drawImage(TILE.water[1],0,0);P_(x,'c',0,0,16,1);for(const j of [4,10]){for(let i=-4;i<16;i+=8){const o=((i-f*2+32)%16);P_(x,'w',o,j,4,1);P_(x,'w',o,j-1,1,3);}}}));
TILE.lava=[0,1].map(f=>mk(16,16,x=>{P_(x,'#a8301c',0,0,16,16);for(let n=0;n<8;n++)P_(x,n%2?'#f07832':'#ffb030',(n*5+f*3)%14,(n*7+f*2)%14,3,2);P_(x,'#ffe05a',(5+f*4)%12,(8+f*3)%12,2,1);P_(x,'#6a1810',0,0,16,1);}));
TILE.spring=[0,1].map(f=>mk(16,16,x=>{P_(x,'#46b8c8',0,0,16,16);P_(x,'#8ae0e8',2+f*3,3,4,2);P_(x,'#8ae0e8',9-f*2,9,4,2);P_(x,'#fff8ec',5+f*4,6,1,1);P_(x,'#2a8aa0',0,15,16,1);P_(x,'#e8e0d0',0,0,16,1);}));
TILE.obsidian=mk(16,16,x=>{P_(x,'#3a2a4a',0,0,16,16);const r=mulberry(777);for(let n=0;n<8;n++)P_(x,'#5a4a6a',(r()*13)|0,(r()*14)|0,3,1);P_(x,'#1a0e24',0,0,16,1);P_(x,'#7a6a8a',2,3,2,1);});
TILE.deck=mk(16,16,x=>{P_(x,'#b8844c',0,0,16,16);for(let i=0;i<16;i+=4)P_(x,'#8a5c30',i,0,1,16);P_(x,'#d0a068',1,2,2,1);P_(x,'#d0a068',9,9,2,1);});
TILE.wreck=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'#4a3a2a',1,1,14,14);for(let j=3;j<16;j+=4)P_(x,'#2a1c10',1,j,14,1);P_(x,'#6a5a3a',3,5,3,1);P_(x,'#2a6a4a',2,12,5,2);});
TILE.wreckDeck=mk(16,16,x=>{P_(x,'#6a5a3a',0,0,16,16);for(let i=0;i<16;i+=5)P_(x,'#3a2c1c',i,0,1,16);P_(x,'#8a7a5a',2,4,2,1);});
// sky tiles
TILE.cloud=[0,1,2].map(s=>mk(16,16,x=>{P_(x,'#e6f2ff',0,0,16,16);P_(x,'#ffffff',2+s,3,8,2);P_(x,'#ffffff',4+s,2,4,1);P_(x,'#c8dcf0',8-s,12,7,1);P_(x,'#d6e7f5',3,9+s,4,1);}));
TILE.thinCloud=mk(16,16,x=>{x.fillStyle='rgba(235,245,255,0.55)';x.fillRect(0,0,16,16);for(let i=0;i<16;i+=4){x.fillStyle='rgba(160,200,240,0.6)';x.fillRect(i,0,2,1);x.fillRect(i,15,2,1);x.fillRect(0,i,1,2);x.fillRect(15,i,1,2);}x.fillStyle='rgba(255,255,255,0.7)';x.fillRect(4,5,6,2);x.fillRect(7,10,5,2);});
TILE.windR=[0,1,2,3].map(f=>mk(16,16,x=>{P_(x,'#a8d4fa',0,0,16,16);for(const j of [3,8,13]){for(let i=-8;i<16;i+=8){const o=i+f*2;for(const [dx,dy] of [[2,-2],[3,-1],[4,0],[3,1],[2,2]])P_(x,'#ffffff',o+dx,j+dy,1,1);P_(x,'#e6f4ff',o-2,j,3,1);}}}));
TILE.windL=[0,1,2,3].map(f=>mk(16,16,x=>{P_(x,'#a8d4fa',0,0,16,16);for(const j of [3,8,13]){for(let i=-8;i<24;i+=8){const o=i-f*2;for(const [dx,dy] of [[4,-2],[3,-1],[2,0],[3,1],[4,2]])P_(x,'#ffffff',o+dx,j+dy,1,1);P_(x,'#e6f4ff',o+5,j,3,1);}}}));
TILE.openSky=mk(16,16,x=>{P_(x,'#5aa8f0',0,0,16,16);const r=mulberry(950);for(let n=0;n<3;n++)P_(x,'#7cc0fa',(r()*12)|0,(r()*14)|0,4,2);P_(x,'#ffffff',(r()*14)|0,(r()*14)|0,1,1);});
TILE.stormCrystal=mk(16,16,x=>{x.drawImage(TILE.cloud[0],0,0);P_(x,'k',3,5,5,10);P_(x,'#8a4ad8',4,6,3,8);P_(x,'#c898f8',4,6,1,5);P_(x,'k',8,2,6,13);P_(x,'#6a2ab8',9,3,4,11);P_(x,'#d8b0ff',9,3,1,6);P_(x,'#ffe84a',11,8,1,2);});
TILE.rainWall=[0,1].map(f=>mk(16,16,x=>{P_(x,'#4a5a7a',0,0,16,16);for(let i=0;i<16;i+=3){const o=(i*5+f*4)%16;P_(x,'#a6c8ff',i,o,1,5);P_(x,'#8aa8e8',i+1,(o+8)%16,1,4);}P_(x,'#2a3a5a',0,0,16,2);}));
TILE.barrier=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'#d8e0ec',1,1,14,14);P_(x,'#ffffff',2,2,6,3);P_(x,'#a8b4c8',1,10,14,5);P_(x,'#a8b4c8',9,5,5,3);P_(x,'#8898b0',1,14,14,1);});
function groundFor(c,r,h){
  switch(groundOf(c,r)){
    case 'snow':return TILE.snow[h%2];
    case 'cobble':return TILE.cobble;
    case 'sand':return TILE.sand[h%2];
  }
  return TILE.grass[h%3];
}
TILE.exit=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',1,0,14,16);P_(x,'#ffe7a0',2,10,12,6);P_(x,'#fff6d0',3,13,10,3);P_(x,'#3a2416',2,0,12,10);});

