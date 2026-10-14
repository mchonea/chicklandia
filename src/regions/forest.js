'use strict';
/* region: forest */
// w deep water  q oak  x broken dam  3 planks  ! coop site
defineRegion({id:'forest',name:'FOREST',kind:'outdoor',origin:[0,5],grid:[2,1],ground:'grass',beyond:true,
 screens:[
 [ // forest edge
  'TTTTTTT..TTTTTTT',
  'T.q..T.dd..q..TT',
  'Tvvv...dd....q.T',
  'TcKc.,.dd.,....T',
  'T.d..VV.d...T..T',
  'T.dddddddddddddd',
  'T.......d.,.....',
  'Tq....,.d..!!!.T',
  'T..T....d..!!!.T',
  'T.,..q..d..s...T',
  'TT..,...dd...TTT',
  'TTTTTTT..TTTTTTT'],
 [ // deep woods
  'TTTTTTTTTTTTTTTT',
  'T..q.,...T..q..T',
  'T.T....,...T...T',
  'T...q..T....,..T',
  'T.,......q.....T',
  'dddddddddddddddd',
  '................',
  '..T......,....T.',
  'wwwwwwwxxwwwwwww',
  'wwwwwwwxxwwwwwww',
  'T..,.......q.,.T',
  'TTTTTTTTTTTTTTTT']]});
