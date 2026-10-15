import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/regions/seas.js',[
 ["const SEA=[['sea',true]];\n",""],
 ["['r',5,5,10,7,'B'],['r',6,6,9,6,'b'],","['r',5,5,10,7,'\\'],['r',6,6,9,6,'/'],['p',7,7,'/'],['p',8,7,'/'],"]]);
ed('src/world/regions.js',[
 ["const REGIONS={},REGION_LIST=[],CELL={},WALK=new Set();","const REGIONS={},REGION_LIST=[],CELL={},WALK=new Set(),ROAM=new Set();   // WALK = outdoor screens, ROAM = screens you can walk between (outdoor + roam regions like caves)"],
 ["      if(cell.kind==='outdoor')WALK.add(cx+','+cy);","      if(cell.kind==='outdoor')WALK.add(cx+','+cy);\n      if(cell.kind==='outdoor'||r.roam)ROAM.add(cx+','+cy);"]]);
ed('src/systems/actions.js',[
 ["  if(!WALK.has(CS.x+','+CS.y)){","  if(!ROAM.has(CS.x+','+CS.y)){"],
 ["  if(d&&WALK.has((CS.x+d[0])+','+(CS.y+d[1])))startTrans(d[0],d[1]);","  if(d&&ROAM.has((CS.x+d[0])+','+(CS.y+d[1])))startTrans(d[0],d[1]);"]]);
ed('src/world/tilemap.js',[
 ["const SOLID=new Set('FHTAhRCLBbDcvKsu#iktenfyPSjJIO%&G0NEMqx2(UQal|$[1569456'.split(''));","const SOLID=new Set('FHTAhRCLBbDcvKsu#iktenfyPSjJIO%&G0NEMqx2(UQal|$[1569456)\\'.split(''));"],
 ["    case '1':img=TILE.brickDoor;break;","    case '1':img=TILE.brickDoor;break;\n    case ')':img=TILE.coral;break;\n    case ']':img=TILE.seaweed;break;\n    case '<':img=TILE.curL[Math.floor(tick/8)%4];break;\n    case '>':img=TILE.curR[Math.floor(tick/8)%4];break;\n    case '{':img=TILE.lava[Math.floor(tick/20+c+r)%2];break;\n    case '}':img=TILE.spring[Math.floor(tick/24+c)%2];break;\n    case '\"':img=TILE.obsidian;break;\n    case '`':img=TILE.deck;break;\n    case '\\':img=TILE.wreck;break;\n    case '/':img=TILE.wreckDeck;break;"]]);
ed('src/world/tiles.js',[["function groundFor(c,r,h){",`// sea tiles
TILE.coral=mk(16,16,x=>{x.drawImage(TILE.sand[0],0,0);P_(x,'k',2,6,5,9);P_(x,'#ff6fae',3,6,3,8);P_(x,'k',7,3,6,12);P_(x,'#e03838',8,3,4,11);P_(x,'k',11,7,4,8);P_(x,'#f6a6b6',11,7,3,7);P_(x,'#fff8ec',4,7,1,1);P_(x,'#fff8ec',9,4,1,1);});
TILE.seaweed=mk(16,16,x=>{x.drawImage(TILE.sand[1],0,0);for(const [i,h] of [[3,10],[7,13],[11,9]]){P_(x,'G',i,15-h,2,h);P_(x,'g',i+1,15-h+1,1,h-2);P_(x,'l',i,15-h,1,2);}});
TILE.curR=[0,1,2,3].map(f=>mk(16,16,x=>{x.drawImage(TILE.water[0],0,0);P_(x,'c',0,0,16,1);for(const j of [4,10]){for(let i=-4;i<16;i+=8){const o=((i+f*2+16)%16);P_(x,'w',o,j,4,1);P_(x,'w',o+3,j-1,1,3);}}}));
TILE.curL=[0,1,2,3].map(f=>mk(16,16,x=>{x.drawImage(TILE.water[1],0,0);P_(x,'c',0,0,16,1);for(const j of [4,10]){for(let i=-4;i<16;i+=8){const o=((i-f*2+32)%16);P_(x,'w',o,j,4,1);P_(x,'w',o,j-1,1,3);}}}));
TILE.lava=[0,1].map(f=>mk(16,16,x=>{P_(x,'#a8301c',0,0,16,16);for(let n=0;n<8;n++)P_(x,n%2?'#f37d22':'#ffb030',(n*5+f*3)%14,(n*7+f*2)%14,3,2);P_(x,'#ffd83a',(5+f*4)%12,(8+f*3)%12,2,1);P_(x,'#6a1810',0,0,16,1);}));
TILE.spring=[0,1].map(f=>mk(16,16,x=>{P_(x,'#46b8c8',0,0,16,16);P_(x,'#8ae0e8',2+f*3,3,4,2);P_(x,'#8ae0e8',9-f*2,9,4,2);P_(x,'#fff8ec',5+f*4,6,1,1);P_(x,'#2a8aa0',0,15,16,1);P_(x,'#e8e0d0',0,0,16,1);}));
TILE.obsidian=mk(16,16,x=>{P_(x,'#3a2a4a',0,0,16,16);const r=mulberry(777);for(let n=0;n<8;n++)P_(x,'#5a4a6a',(r()*13)|0,(r()*14)|0,3,1);P_(x,'#1a0e24',0,0,16,1);P_(x,'#7a6a8a',2,3,2,1);});
TILE.deck=mk(16,16,x=>{P_(x,'#b8844c',0,0,16,16);for(let i=0;i<16;i+=4)P_(x,'#8a5c30',i,0,1,16);P_(x,'#d0a068',1,2,2,1);P_(x,'#d0a068',9,9,2,1);});
TILE.wreck=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'#4a3a2a',1,1,14,14);for(let j=3;j<16;j+=4)P_(x,'#2a1c10',1,j,14,1);P_(x,'#6a5a3a',3,5,3,1);P_(x,'#2a6a4a',2,12,5,2);});
TILE.wreckDeck=mk(16,16,x=>{P_(x,'#6a5a3a',0,0,16,16);for(let i=0;i<16;i+=5)P_(x,'#3a2c1c',i,0,1,16);P_(x,'#8a7a5a',2,4,2,1);});
function groundFor(c,r,h){`]]);
