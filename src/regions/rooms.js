'use strict';
/* region: rooms */
// interior legend: # wall  i window  _ wood floor  : straw  n nest  o rug  X exit  y hay  S stall rail
// k counter  t table  e bed  f fireplace  P plant.  Farmhouse outside: j roof  J wall  I window  O door.  V garden
defineRegion({id:'rooms',name:'INSIDE',kind:'indoor',origin:[0,2],grid:[3,1],ground:'grass',beyond:false,labels:['COOP','BARN','FARMHOUSE'],
 screens:[
 [ // inside the coop
  '################',
  '################',
  '##i###i##i###i##',
  '##nn::::::::nn##',
  '##::::::::::::##',
  '##n::::::::::n##',
  '##::::::::::::##',
  '##::::oooo::::##',
  '##::::oooo::::##',
  '##::::::::::::##',
  '##::::::::::::##',
  '#######XX#######'],
 [ // inside the barn
  '################',
  '################',
  '#i####i##i####i#',
  '#::::::::::::::#',
  '#::::::::::::::#',
  '#yyyyyyyyyyyyyy#',
  '#::::::::::::::#',
  '#SSS::::::::SSS#',
  '#:::S::::::S:::#',
  '#:::S::::::S:::#',
  '#::::::::::::::#',
  '#######XX#######'],
 [ // inside the farmhouse
  '################',
  '################',
  '#i##i##ff##i#ii#',
  '#kkk________#e_#',
  '#___________#e_#',
  '#_tt________#__#',
  '#_tt___oooo____#',
  '#______oooo_#__#',
  '#P__________#P_#',
  '#_________Z_####',
  '#______________#',
  '#######XX#######']]});
