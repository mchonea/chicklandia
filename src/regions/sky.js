'use strict';
/* regions: the Sky Kingdom (4 areas, 8 screens + the dragon's lair + 5 Cloud City rooms), above the clouds.
     Cloud Meadows (0,17)(1,17)      Floating Gardens (3,17)(4,17)
     Cloud City    (0,19)(1,19)      Storm Peaks      (3,19)(4,19)       Storm Dragon's lair (0,21)   City rooms (3..7,21)
   α cloud floor   β (unused)   γ thin cloud (needs CLOUD WALK)   ε wind east   ζ wind west   η open sky (blocks)
   θ storm crystal (THUNDER PECK clears it)   ι rain wall (hurts)   κ cloud barrier (DIVE-BOMB breaks it)
   Bounce pads, updraft vents, portals and the sky gate are entities (see content/sky.js).                          */
const SKYREG={beyond:true,sky:true,mm:'sky',ground:'grass',kind:'outdoor'};
defineRegion(Object.assign({id:'meadows',name:'CLOUD MEADOWS',origin:[0,17],grid:[2,1],area:'meadows',music:'skymeadow'},SKYREG,{
 screens:[
  grid('η',[['r',1,4,14,10,'α'],['r',15,5,15,6,'α'],['r',8,1,13,2,'α'],['r',2,1,5,2,'α'],['p',3,3,'γ'],['r',6,7,9,7,'ε'],['p',12,9,'η']]),
  grid('η',[['r',0,4,14,10,'α'],['r',9,7,14,10,'η'],['r',11,8,12,9,'α'],['r',9,8,10,9,'κ'],['r',3,1,6,2,'α'],['r',4,3,5,3,'γ']])]}));
defineRegion(Object.assign({id:'gardens',name:'FLOATING GARDENS',origin:[3,17],grid:[2,1],area:'gardens',music:'skygarden'},SKYREG,{
 screens:[
  grid('η',[['r',1,3,14,10,'α'],['r',15,5,15,6,'α'],['r',0,5,0,6,'α'],['r',3,5,5,6,'V'],['r',9,5,11,6,'V'],['r',3,8,5,9,'V'],['r',9,8,11,9,'V']]),
  grid('η',[['r',0,4,14,10,'α'],['r',0,5,0,6,'α'],['r',15,5,15,6,'α'],['r',5,1,9,2,'α'],['r',1,1,3,2,'α'],['p',2,3,'γ']])]}));
defineRegion(Object.assign({id:'skycity',name:'CLOUD CITY',origin:[0,19],grid:[2,1],area:'skycity',music:'skycity'},SKYREG,{
 screens:[
  grid('η',[['r',1,0,14,1,'a'],['r',1,2,14,2,'U'],['p',3,2,'1'],['p',8,2,'1'],['p',12,2,'1'],['p',2,2,'Q'],['p',6,2,'Q'],['p',10,2,'Q'],['p',14,2,'Q'],['r',1,3,14,10,'α'],['r',15,5,15,6,'α'],['p',7,6,'$']]),
  grid('η',[['r',1,0,14,1,'a'],['r',1,2,14,2,'U'],['p',4,2,'1'],['p',11,2,'1'],['p',3,2,'Q'],['p',5,2,'Q'],['p',10,2,'Q'],['p',12,2,'Q'],['r',1,3,14,10,'α'],['r',0,5,0,6,'α'],['r',15,5,15,6,'α']])]}));
defineRegion(Object.assign({id:'peaks',name:'STORM PEAKS',origin:[3,19],grid:[2,1],area:'peaks',music:'skystorm'},SKYREG,{
 screens:[
  grid('η',[['r',1,3,14,10,'α'],['r',0,5,0,6,'α'],['r',5,3,6,4,'ι'],['r',5,7,6,10,'ι'],['r',10,3,10,10,'θ'],['r',12,3,13,4,'ι'],['r',12,8,13,9,'ι'],['r',15,5,15,6,'α']]),
  grid('η',[['r',0,3,14,10,'α'],['r',0,5,0,6,'α'],['r',4,3,5,4,'ι'],['r',4,7,5,10,'ι'],['r',8,8,9,10,'ι'],['r',11,3,11,10,'θ'],['r',13,3,14,4,'ι']])]}));
defineRegion(Object.assign({id:'lair',name:"DRAGON'S LAIR",origin:[0,21],grid:[1,1],area:'lair',music:'boss'},SKYREG,{
 screens:[grid('η',[['r',1,1,14,10,'α'],['r',2,2,13,9,'α']])]}));
defineRegion({id:'skyin',name:'CLOUD CITY',kind:'indoor',origin:[3,21],grid:[5,1],ground:'grass',beyond:true,sky:true,mm:'sky',
 screens:[
  {id:'sk_plume',label:'FEATHER BOUTIQUE',rows:room([['r',4,4,11,4,'k'],['p',2,3,'P'],['p',13,3,'P'],['r',5,7,10,8,'o']])},
  {id:'sk_star',label:'STAR-FRUIT STAND',rows:room([['r',3,4,9,4,'k'],['p',13,3,'P'],['p',12,3,'P'],['p',3,9,'0'],['p',12,9,'0'],['r',6,7,9,8,'o']])},
  {id:'sk_weather',label:'WEATHER SHOP',rows:room([['r',3,4,10,4,'k'],['p',2,3,'P'],['p',13,3,'P'],['r',5,8,10,8,'o']])},
  {id:'sk_cottage',label:"PUFF'S COTTAGE",rows:room([['p',3,3,'e'],['p',4,3,'e'],['r',6,6,9,6,'t'],['r',7,8,10,9,'o'],['p',12,3,'P'],['p',13,3,'P']])},
  {id:'sk_nursery',label:'SKY NURSERY',rows:room([['p',3,3,'n'],['p',4,3,'n'],['p',12,3,'n'],['p',13,3,'n'],['r',6,7,9,8,'o']])}]});
