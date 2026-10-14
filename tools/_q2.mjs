import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/world/tiles.js',[["function groundFor(c,r,h){",`// city tiles
TILE.brickDoor=mk(16,16,x=>{x.drawImage(TILE.brick,0,0);P_(x,'k',3,2,10,14);P_(x,'b',4,3,8,13);P_(x,'B',4,8,8,1);P_(x,'T',5,4,6,3);P_(x,'T',5,10,6,4);P_(x,'q',10,9,1,1);P_(x,'#e8c8a0',2,1,12,1);});
TILE.ship=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'B',0,1,16,14);for(let j=3;j<14;j+=4)P_(x,'b',0,j,16,1);P_(x,'T',0,1,16,1);P_(x,'k',5,6,6,6);P_(x,'c',6,7,4,4);P_(x,'#e8c8a0',7,7,1,4);});
TILE.stackCrate=mk(16,16,x=>{x.drawImage(TILE.cobble,0,0);P_(x,'k',1,5,14,10);P_(x,'b',2,6,12,8);P_(x,'T',2,6,12,1);P_(x,'B',7,6,1,8);P_(x,'k',3,0,10,6);P_(x,'t',4,1,8,4);P_(x,'T',4,1,8,1);});
TILE.roofWalk=mk(16,16,x=>{P_(x,'#d8805c',0,0,16,16);for(let j=0;j<16;j+=4){P_(x,'#b85c3c',0,j+3,16,1);for(let i=((j/4)%2)*4;i<16;i+=8)P_(x,'#b85c3c',i,j,1,3);}P_(x,'#f0a080',0,0,16,1);});
TILE.shelf=mk(16,16,x=>{P_(x,'B',0,0,16,16);P_(x,'k',0,0,16,1);P_(x,'k',0,7,16,1);P_(x,'k',0,15,16,1);const cs=['r','u','y','g','p','o'];for(let i=0;i<6;i++){P_(x,cs[i],1+i*2+(i>2?1:0),1,2,6);P_(x,cs[(i+2)%6],1+i*2+(i>2?1:0),8,2,7);}});
TILE.pedestal=mk(16,16,x=>{x.drawImage(TILE.floor,0,0);P_(x,'k',2,7,12,9);P_(x,'e',3,8,10,7);P_(x,'E',3,13,10,2);P_(x,'k',3,1,10,7);P_(x,'c',4,2,8,5);P_(x,'w',5,2,1,2);});
function groundFor(c,r,h){`]]);
ed('src/world/tilemap.js',[
 ["const SOLID=new Set('FHTAhRCLBbDcvKsu#iktenfyPSjJIO%&G0NEMqx2(UQal|$['.split(''));","const SOLID=new Set('FHTAhRCLBbDcvKsu#iktenfyPSjJIO%&G0NEMqx2(UQal|$[1569456'.split(''));"],
 ["    case 'a':img=TILE.roofC;break;","    case 'a':img=TILE.roofC;break;\n    case '1':img=TILE.brickDoor;break;\n    case '5':img=TILE.ship;break;\n    case '6':img=TILE.stackCrate;break;\n    case '8':img=TILE.roofWalk;break;\n    case '9':img=TILE.shelf;break;\n    case '4':img=TILE.pedestal;break;"]]);
