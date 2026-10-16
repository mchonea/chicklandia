'use strict';
/* regions: the Pirate Seas (4 islands, 11 screens). Reached only by ship from the city harbor.
     Pirate Cove (0,9)(1,9) + smuggler caves (0,15)(1,15)    Coral Reef (3,9)(4,9) + deep reef (3,11)(4,11) [underwater, air meter]
     Volcano Isle (0,11)(1,11)                               Lighthouse Rock (0,13)(1,13)    Squawkbeard's flagship (3,13)
   Islands are separated by empty screens so you can only reach them by ship.
   ) coral (solid)  ] seaweed  < > current (pushes Pip)  { lava (hurts)  } hot spring (heals)  " obsidian path (fire-safe)
   \` ship deck  3 planks  w deep water  ~ sand  N cliff  2 palm  ( beach rock  R rock (peck it)  */
// Authored outlines span both screens; bays and causeways remain continuous at the seam.
// Props are clipped to land, while piers can extend over the water.
const SEA_COAST_ROWS={
  cove:[[],[[8,26]],[[5,28]],[[3,29]],[[2,29]],[[2,30]],[[2,29]],[[2,12],[19,29]],[[2,12],[20,28]],[[3,11],[21,28]],[[5,10],[22,26]],[]],
  reef:[[],[[7,24]],[[4,27]],[[3,11],[21,29]],[[2,11],[21,29]],[[2,11],[19,29]],[[2,11],[21,30]],[[2,11],[21,29]],[[3,11],[21,29]],[[4,27]],[[7,24]],[]],
  volcano:[[[21,24]],[[6,11],[19,27]],[[3,14],[17,29]],[[2,15],[17,29]],[[2,29]],[[2,30]],[[2,30]],[[3,29]],[[3,28]],[[4,12],[18,28]],[[5,10],[20,26]],[]],
  lighthouse:[[[21,25]],[[20,27]],[[5,11],[18,28]],[[3,13],[18,29]],[[2,14],[18,29]],[[2,29]],[[2,30]],[[3,29]],[[3,13],[18,29]],[[3,12],[18,29]],[[5,10],[18,28]],[]]
};
function islandScreen(kind,half,ops){
  const ground=kind==='cove'||kind==='reef'?'~':'=',rows=SEA_COAST_ROWS[kind];
  const g=rows.map(spans=>Array.from({length:16},(_,c)=>spans.some(([a,b])=>c+half*16>=a&&c+half*16<=b)?ground:'w'));
  for(const o of ops){const rect=o[0]==='r',c0=o[1],r0=o[2],c1=rect?o[3]:c0,r1=rect?o[4]:r0,ch=rect?o[5]:o[3];
    for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)if(ch==='3'||g[r][c]!=='w')g[r][c]=ch;
  }return g.map(row=>row.join(''));
}
const dock=(r0=8)=>['r',0,r0,3,r0+1,'3'];
defineRegion({id:'cove',name:'PIRATE COVE',kind:'outdoor',origin:[0,9],grid:[2,1],ground:'sand',beyond:true,area:'cove',music:'cove',sea:true,mm:'sea',
 screens:[
  islandScreen('cove',0,[dock(),['p',4,3,'2'],['p',7,2,'2'],['p',12,3,'2'],['p',5,6,'2'],['p',12,7,'2'],['r',8,3,10,4,'a'],['r',8,5,10,5,'U'],['p',5,2,'('],['p',13,1,'('],['p',6,9,'('],['r',2,4,2,5,'W']]),
  islandScreen('cove',1,[['r',3,1,10,2,'N'],['p',2,4,'2'],['p',12,4,'2'],['p',5,8,'2'],['p',11,7,'2'],['p',8,6,'R'],['p',9,8,'('],['p',1,9,'('],['p',13,9,'(']])]});
defineRegion({id:'cavecove',name:'SMUGGLER CAVES',kind:'cave',origin:[0,15],grid:[2,1],ground:'sand',beyond:true,area:'cove',music:'cave',roam:true,sea:true,mm:'sea',
 screens:[
  grid('%',[['r',1,1,14,10,'-'],['r',6,10,9,11,'-'],['r',4,3,5,4,'%'],['r',10,6,11,7,'%'],['r',2,8,3,9,'%'],['r',0,5,0,6,'-'],['r',15,5,15,6,'-']]),
  grid('%',[['r',1,1,14,10,'-'],['r',0,5,0,6,'-'],['r',7,3,8,4,'%'],['r',3,7,4,8,'%'],['r',11,2,12,3,'%'],['r',12,8,13,9,'%']])]});
defineRegion({id:'reef',name:'CORAL REEF',kind:'outdoor',origin:[3,9],grid:[2,1],ground:'sand',beyond:true,area:'reef',music:'reef',sea:true,mm:'sea',
 screens:[
  islandScreen('reef',0,[dock(),['r',5,6,10,6,'>'],['p',4,3,'2'],['p',11,2,')'],['p',12,3,')'],['p',6,8,')'],['p',9,9,')'],['p',13,8,'('],['p',4,9,'('],['r',2,2,3,2,'(']]),
  islandScreen('reef',1,[['r',7,5,9,5,'<'],['p',5,3,')'],['p',4,3,')'],['p',11,3,'2'],['p',10,8,')'],['p',6,9,'('],['p',12,6,'('],['p',2,7,'2']])]});
defineRegion({id:'deepreef',name:'DEEP REEF',kind:'water',origin:[3,11],grid:[2,1],ground:'sand',beyond:true,area:'reef',music:'reef',roam:true,sea:true,mm:'sea',
 screens:[
  grid('~',[['r',0,0,15,0,')'],['r',0,11,15,11,')'],['r',0,0,0,11,')'],['r',3,2,4,3,')'],['r',10,2,11,3,')'],['r',7,8,8,9,')'],['r',13,6,14,8,')'],['r',2,8,2,9,']'],['r',6,5,6,6,']'],['r',11,9,12,9,']'],['p',9,3,']'],['p',3,5,']']]),
  grid('~',[['r',0,0,15,0,')'],['r',0,11,15,11,')'],['r',15,0,15,11,')'],['r',0,0,0,4,')'],['r',0,7,0,11,')'],['r',3,2,4,3,')'],['r',11,8,12,9,')'],['r',7,2,9,2,')'],['r',5,5,10,7,'\\'],['r',6,6,9,6,'/'],['p',7,7,'/'],['p',8,7,'/'],['p',2,8,']'],['p',13,4,']'],['p',13,5,']']])]});
defineRegion({id:'volcano',name:'VOLCANO ISLE',kind:'outdoor',origin:[0,11],grid:[2,1],ground:'cobble',beyond:true,area:'volcano',music:'volcano',sea:true,mm:'sea',
 screens:[
  islandScreen('volcano',0,[dock(),['r',6,1,8,10,'{'],['r',6,5,8,6,'"'],['r',9,5,15,6,'"'],['r',2,5,5,6,'"'],['r',11,2,12,3,'}'],['p',3,2,'N'],['p',4,2,'N'],['p',13,9,'N'],['p',10,9,'N'],['r',3,8,5,9,'"']]),
  islandScreen('volcano',1,[['r',5,1,10,3,'N'],['r',0,5,13,6,'"'],['r',8,4,9,8,'{'],['r',8,5,9,6,'"'],['r',2,7,3,9,'{'],['p',12,8,'}'],['p',13,8,'}'],['p',12,2,'N']])]});
defineRegion({id:'lighthouse',name:'LIGHTHOUSE ROCK',kind:'outdoor',origin:[0,13],grid:[2,1],ground:'cobble',beyond:true,area:'lighthouse',music:'lighthouse',sea:true,mm:'sea',
 screens:[
  islandScreen('lighthouse',0,[dock(),['p',4,2,'N'],['p',12,3,'N'],['p',10,8,'N'],['p',3,9,'N'],['r',7,5,9,5,'>'],['p',13,6,'(']]),
  islandScreen('lighthouse',1,[['r',6,0,8,4,'U'],['p',7,5,'1'],['p',2,3,'N'],['p',12,8,'N'],['p',3,8,'N'],['p',11,3,'(']])]});
defineRegion({id:'fortress',name:"SQUAWKBEARD'S SHIP",kind:'outdoor',origin:[3,13],grid:[1,1],ground:'sand',beyond:true,area:'fortress',music:'boss',sea:true,mm:'sea',
 screens:[[
  'wwwwwwwwwwwwwwww',
  'wwwwFFF``FFFwwww',
  'wwFF````````FFww',
  'wF````````````Fw',
  'wF`````````````F',
  'wF`````````````F',
  'wF`````````````F',
  'wF````````````Fw',
  '``````````````Fw',
  '``F`````````FFww',
  'wwwFFFFFFFFFFwww',
  'wwwwwwwwwwwwwwww']]});
