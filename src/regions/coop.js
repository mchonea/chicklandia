'use strict';
/* region: coop */
defineRegion({id:'coop',name:'MY COOP',kind:'indoor',origin:[2,4],grid:[1,1],ground:'grass',beyond:true,
 screens:[grid('#',[['r',1,3,14,10,'_'],['r',7,11,8,11,'X']])]});
// A separate room keeps the original ground-floor save coordinates and exterior door stable.
defineRegion({id:'cooploft',name:'TROPHY ROOM',area:'coop',kind:'indoor',origin:[3,4],grid:[1,1],ground:'grass',beyond:true,
 screens:[grid('#',[['r',1,3,14,10,'_']])]});
