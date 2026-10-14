'use strict';
/* region: secrets */
// secrets legend: % cave wall  - cave floor  & stone wall  ; stone floor  + plate  G gate  0 barrel
// Z creaky floorboard  Y trapdoor  ^ burrow hole  * glowing mushrooms  @ fairy ring
defineRegion({id:'secrets',name:'SECRET!',kind:'cave',origin:[0,3],grid:[3,1],ground:'grass',beyond:false,kinds:['cave','cave','grove'],labels:['BURROW','CELLAR','GROVE'],
 screens:[
 [ // secret rabbit burrow
  '%%%%%%%%%%%%%%%%',
  '%%%%%%%%%%%%%%%%',
  '%%%%--------%%%%',
  '%%%----------%%%',
  '%%------------%%',
  '%%------------%%',
  '%%------------%%',
  '%%------------%%',
  '%%%----------%%%',
  '%%%%--------%%%%',
  '%%%%%%----%%%%%%',
  '%%%%%%%XX%%%%%%%'],
 [ // secret farmhouse cellar
  '&&&&&&&&&&&&&&&&',
  '&&&&&&&&&&&&&&&&',
  '&&&&&&;;;;&&&&&&',
  '&&&&&&;;;;&&&&&&',
  '&&&&&&&GG&&&&&&&',
  '&0;;;;;;;;;;;;0&',
  '&;;+;;;;;;;;+;;&',
  '&;;;;;0;;0;;;;;&',
  '&;;;;;;;;;;;;;;&',
  '&0;;;;;;;;;;;;0&',
  '&;;;;;;;;;;;;;;&',
  '&&&&&&&XX&&&&&&&'],
 [ // secret moonlit grove
  'TTTTTTTTTTTTTTTT',
  'TTT..,....,..TTT',
  'TT.,...*..,...TT',
  'T..,.*....*..,.T',
  'T.....,.......,T',
  'T.WW...,...*...T',
  'T.WW.*......,..T',
  'T....,...*.....T',
  'TT..,.......,.TT',
  'TTT....,.....TTT',
  'TTTTTT.@..TTTTTT',
  'TTTTTTTTTTTTTTTT']]});
