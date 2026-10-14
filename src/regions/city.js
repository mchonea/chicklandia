'use strict';
/* region: city */
// = cobblestone  a roof  U brick  Q lit window  l awning  | lamp  $ fountain  [ bench
defineRegion({id:'city',name:'CITY',kind:'outdoor',origin:[2,5],grid:[1,2],ground:'cobble',beyond:true,
 screens:[
 [ // city gate
  'aaaaaaaaaaaaaaaa',
  'aaaaaaaaaaaaaaaa',
  'UQUUQUlllUQUUQUa',
  '=|=====[=====|aa',
  '==============aa',
  '==============aa',
  '==============aa',
  '=|====$$====|=aa',
  '======$$======aa',
  '=[==========[=aa',
  'aaaaaaa==aaaaaaa',
  'aaaaaaa==aaaaaaa'],
 [ // market square
  'aaaaaaa==aaaaaaa',
  'UUQUUU|==|UUQUUU',
  '================',
  '=lll===lll===lll',
  '=kkk===kkk===kkk',
  '================',
  '================',
  '==|=========|===',
  '=====[==[=======',
  '================',
  '================',
  'aaaaaaaaaaaaaaaa']]});
