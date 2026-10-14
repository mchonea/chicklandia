'use strict';
/* region: beach */
// ~ sand  2 palm  ( beach rock
defineRegion({id:'beach',name:'BEACH',kind:'outdoor',origin:[0,6],grid:[2,1],ground:'sand',beyond:true,
 screens:[
 [ // sandy shore
  'TTTTTTT..TTTTTTT',
  '2~~2~~~~~~~~2~~2',
  '2~~~~~~~~~~~~~~2',
  '2~~~~2~~~~~~~~~2',
  '2~~~~~~~~~~~~~~2',
  '2~~~~~~~~~~~~~~~',
  '2~~~~~~~~~~~~~~~',
  '2~~~~~~~~~~~~~~2',
  'WWWWWWWWWWWWWWWW',
  'wwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwww'],
 [ // tide pools
  'TTTTTTTTTTTTTTTT',
  '2~~~~~~2~~~~~~~2',
  '~~((~~~~~~((~~~2',
  '~(WW(~~~~(WW(~~2',
  '~~~~~~~~~~~~~~~2',
  '~~~~~~~~~~~~~333',
  '~~~~~~~~~~~~~333',
  '~~~~((~~~~~~~~~2',
  'WWWWWWWWWWWWWWW2',
  'wwwwwwwwwwwwwww2',
  'wwwwwwwwwwwwwww2',
  'wwwwwwwwwwwwwwww']]});
