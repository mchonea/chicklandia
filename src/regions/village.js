'use strict';
/* regions: Chicklandia Village (4 areas, 8 screens), south of the city market.
     Windmill Hill (0,7)(1,7) | Village Square (2,7)(3,7)
     Riverside     (0,8)(1,8) | Meadow Farmlands (2,8)(3,8)
   7 building pad   V tilled soil   A apple tree   F fence   W river (flutter crosses it)   3 plank bridge / stage   m mud (clay)
   The road from the city market is closed until Bucky shows Pip the meadow (see content/village.js). */
const VEG=[['p',3,1,','],['p',12,9,','],['p',2,9,','],['p',13,2,',']];
defineRegion({id:'vhill',name:'WINDMILL HILL',kind:'outdoor',origin:[0,7],grid:[2,1],ground:'grass',beyond:true,area:'village',music:'farm',
 screens:[
  grid('T',[['r',1,1,14,10,'.'],['r',1,5,15,6,'='],['r',4,5,5,11,'='],['r',8,2,13,3,','],['r',3,8,6,9,','],...VEG]),
  grid('T',[['r',1,1,14,10,'.'],['r',0,5,15,6,'='],['r',10,5,11,11,'='],['r',3,2,8,3,'3'],['r',3,4,8,4,'.'],['r',12,2,13,3,'.'],['p',2,9,','],['p',13,9,',']])]});
defineRegion({id:'vsquare',name:'VILLAGE SQUARE',kind:'outdoor',origin:[2,7],grid:[2,1],ground:'grass',beyond:true,area:'village',music:'farm',
 screens:[
  grid('T',[['r',1,1,14,10,'.'],['r',7,0,8,11,'='],['r',0,5,15,6,'='],['r',3,2,4,3,'7'],['r',11,2,12,3,'7'],['r',3,8,4,9,'7'],['r',11,8,12,9,'7'],['p',6,4,','],['p',9,7,','],['p',1,1,'u'],['p',14,1,'u']]),
  grid('T',[['r',1,1,14,10,'.'],['r',0,5,10,6,'='],['r',7,5,8,11,'='],['r',3,2,4,3,'7'],['r',11,2,12,3,'7'],['r',3,8,4,9,'7'],['r',11,8,12,9,'7'],['p',6,4,','],['p',9,7,',']])]});
defineRegion({id:'vriver',name:'RIVERSIDE',kind:'outdoor',origin:[0,8],grid:[2,1],ground:'grass',beyond:true,area:'village',music:'farm',
 screens:[
  grid('T',[['r',1,1,14,10,'.'],['r',4,0,5,5,'='],['r',4,5,15,6,'='],['r',8,8,12,10,'W'],['r',2,2,3,3,'T'],['r',2,9,3,10,'T'],...VEG]),
  grid('T',[['r',1,1,14,10,'.'],['r',10,0,11,5,'='],['r',0,5,15,6,'='],['r',4,1,6,10,'W'],['r',4,5,6,6,'3'],['r',8,2,9,3,'7'],['r',8,8,9,9,'7'],['r',2,8,3,9,'m'],['r',12,8,13,9,'m']])]});
defineRegion({id:'vmeadow',name:'MEADOW FARMLANDS',kind:'outdoor',origin:[2,8],grid:[2,1],ground:'grass',beyond:true,area:'village',music:'farm',
 screens:[
  grid('T',[['r',1,1,14,10,'.'],['r',7,0,8,5,'='],['r',0,5,15,6,'='],['r',2,2,5,3,'V'],['r',2,8,5,9,'V'],['p',11,2,'A'],['p',13,2,'A'],['p',12,4,'A'],['p',10,9,'u'],['p',13,8,'u']]),
  grid('T',[['r',1,1,14,10,'.'],['r',7,0,8,5,'='],['r',0,5,8,6,'='],['r',9,2,14,9,'F'],['r',10,3,13,8,'.'],['r',9,5,9,6,'.'],['r',2,2,5,3,'V'],['r',2,8,5,9,'V']])]});
