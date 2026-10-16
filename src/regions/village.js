'use strict';
/* One continuous 64 x 24 meadow, split into the existing eight camera screens.
   The four region IDs and the city entrance stay stable for saved positions. */
const VILLAGE_LOTS=[
  {id:'p0',c:51,r:87},{id:'p1',c:59,r:91},{id:'p2',c:35,r:87},{id:'p3',c:19,r:87},
  {id:'p4',c:3,r:87},{id:'p5',c:10,r:92},{id:'p6',c:43,r:87},{id:'p7',c:50,r:92},
  {id:'p8',c:24,r:99,river:true},{id:'p9',c:24,r:104,river:true}];
function villageMeadow(){
  const g=Array.from({length:24},()=>Array(64).fill('.'));
  const rect=(a,b,c,d,ch)=>{for(let y=b;y<=d;y++)for(let x=a;x<=c;x++)g[y][x]=ch;};
  const lane=(pts,w=1,ch='d')=>{for(let i=1;i<pts.length;i++){
    const [a,b]=pts[i-1],[c,d]=pts[i];rect(Math.min(a,c),Math.min(b,d),Math.max(a,c)+w-1,Math.max(b,d)+w-1,ch);}};
  // Tree groves frame places; internal screen boundaries remain open meadow.
  rect(0,0,63,0,'T');rect(0,23,63,23,'T');rect(0,0,0,23,'T');rect(63,0,63,23,'T');
  for(const [a,b,c,d] of [[1,1,2,2],[14,1,16,2],[1,11,3,13],[14,11,15,13],[30,1,32,2],[46,1,48,2],[61,1,62,2],[46,10,48,12],[61,11,62,13],[1,21,2,22],[15,21,16,22],[30,21,31,22],[45,21,47,22]])rect(a,b,c,d,'T');
  for(const [a,b,c,d] of [[2,1,5,1],[12,2,13,3],[2,10,5,10],[16,4,17,5],[27,2,28,3],[30,8,32,9],[33,2,35,3],[44,8,45,9],[54,2,56,3],[58,11,60,11],[2,19,3,20],[16,15,17,16],[28,13,29,14],[42,20,44,21],[55,21,56,22]])rect(a,b,c,d,',');
  // Green, festival walk, market square and a smaller winding cottage lane.
  lane([[2,6],[14,6],[14,8],[29,8],[29,6],[39,6]],2);
  lane([[39,0],[39,5]],2,'=');
  lane([[41,6],[57,6],[57,10],[62,10]]);lane([[47,6],[47,7],[48,7],[48,10],[57,10]]);
  lane([[4,5],[4,6]]);lane([[8,6],[8,12]],2);lane([[11,10],[8,10]]);
  lane([[20,5],[20,8]]);rect(18,5,23,6,'=');
  lane([[52,5],[52,6]]);lane([[60,9],[60,10]]);lane([[51,10],[55,10]]);
  // Builders' courtyard, pond and the route over the mill bridge.
  lane([[8,12],[8,18],[18,18]],2);rect(3,16,10,18,'d');
  lane([[5,18],[5,21],[9,21]]);rect(11,20,14,22,'W');g[20][11]='r';g[22][14]='r';
  rect(19,13,21,14,'W');rect(20,15,23,16,'W');rect(21,17,23,21,'W');rect(20,22,22,22,'W');
  // The downhill lane meets the bridge in one straight line, outside the mill yards.
  lane([[29,9],[29,18]]);
  lane([[18,18],[31,18]],1);rect(20,18,23,18,'3');
  lane([[25,22],[29,22],[29,18]]);
  rect(18,21,19,22,'m');rect(28,20,29,21,'m');
  // Garden plots keep their coordinate IDs, preserving planted crops in old saves.
  for(const x of [34,50])for(const y of [14,20])rect(x,y,x+3,y+1,'V');
  lane([[39,8],[39,13],[40,13],[40,18],[55,18]]);
  lane([[31,18],[40,18]],2);lane([[55,10],[55,22]]);
  lane([[33,16],[39,16]]);lane([[33,22],[40,22],[40,18]]);
  lane([[49,16],[55,16]]);lane([[49,22],[55,22]]);
  for(const [x,y] of [[43,14],[45,14],[44,16]])g[y][x]='A';
  // Pasture gate opens toward Dash and the garden path.
  rect(57,14,62,14,'F');rect(57,22,62,22,'F');rect(57,14,57,22,'F');rect(62,14,62,22,'F');
  g[17][57]='d';g[18][57]='d';g[18][58]='d';
  // Pave the court after its approach lanes so dirt ends at a single clean edge.
  rect(35,5,44,9,'=');
  for(const p of VILLAGE_LOTS)rect(p.c,p.r-84,p.c+1,p.r-83,'7');
  return g;
}
const VILLAGE_MEADOW=villageMeadow();
function villageScreen(x,y){return VILLAGE_MEADOW.slice(y*12,y*12+12).map(r=>r.slice(x*16,x*16+16).join(''));}
for(const [id,name,x,y,labels] of [
  ['vhill','VILLAGE GREEN',0,0,['VILLAGE GREEN','FESTIVAL HILL']],
  ['vsquare','VILLAGE SQUARE',2,0,['MARKET SQUARE','COTTAGE LANE']],
  ['vriver','RIVERSIDE',0,1,["BUILDERS' YARD",'MILL REACH']],
  ['vmeadow','MEADOW FARMLANDS',2,1,['COMMUNITY GARDENS','SHEEP MEADOW']]]){
  defineRegion({id,name,kind:'outdoor',origin:[x,7+y],grid:[2,1],ground:'grass',beyond:true,area:'village',music:'farm',labels,screens:[villageScreen(x,y),villageScreen(x+1,y)]});
}
