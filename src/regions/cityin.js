'use strict';
/* region: city interiors (13 one-screen rooms). Doors and shop hours live in content/city.js (BUILDINGS).
   Room legend: _ floor  k counter (the shopkeeper stands on it)  t table  e bed  f fireplace/oven  P plant  n nest  o rug
   y hay  0 barrel  9 bookshelf  4 museum case  1 door  X exit.  Grid is 5 wide: row 1 = post, rocco, bistro, boutique, seed. */
defineRegion({id:'cityin',name:'CITY',kind:'indoor',origin:[5,4],grid:[5,3],ground:'grass',beyond:true,
 screens:[
 {id:'post',label:'POST OFFICE',rows:room([['r',3,4,12,4,'k'],['p',2,3,'P'],['p',13,3,'P'],['r',6,8,9,9,'o'],['p',3,7,'t'],['p',12,7,'t']])},
 {id:'rocco',label:"ROCCO'S DEN",rows:room([['r',3,3,4,4,'y'],['p',12,3,'y'],['p',12,4,'y'],['r',6,6,9,6,'t'],['p',3,8,'n'],['p',4,8,'n'],['r',7,9,8,9,'o']])},
 {id:'bistro',label:"REMY'S BISTRO",rows:room([['r',3,4,8,4,'k'],['p',12,3,'f'],['p',13,3,'f'],['p',4,7,'t'],['p',5,7,'t'],['p',10,7,'t'],['p',11,7,'t'],['r',6,8,9,9,'o']])},
 {id:'boutique',label:"MAGGIE'S BOUTIQUE",rows:room([['r',4,4,11,4,'k'],['p',2,3,'P'],['p',13,3,'P'],['r',5,7,10,8,'o'],['p',3,9,'P'],['p',12,9,'P']])},
 {id:'seed',label:'SEED & FEED',rows:room([['r',3,4,9,4,'k'],['r',11,3,12,4,'y'],['p',13,3,'0'],['p',2,10,'0'],['p',13,10,'0']])},
 {id:'bakery',label:'BAKERY',rows:room([['r',3,4,12,4,'k'],['p',13,3,'f'],['p',4,8,'t'],['p',11,8,'t'],['r',6,7,9,8,'o']])},
 {id:'toy',label:'TOY SHOP & ARCADE',rows:room([['r',3,4,8,4,'k'],['p',13,2,'1'],['p',2,3,'P']])},
 {id:'cleo',label:"CLEO'S APARTMENT",rows:room([['p',3,3,'e'],['p',4,3,'e'],['r',6,6,9,6,'t'],['r',7,8,10,9,'o'],['p',12,3,'P'],['p',13,3,'P']])},
 {id:'artist',label:"THE ARTIST'S STUDIO",rows:room([['p',3,3,'P'],['p',13,3,'P'],['p',3,9,'t'],['p',4,9,'t'],['r',5,7,10,8,'o']])},
 {id:'ducks',label:'THE DUCK FLAT',rows:room([['p',3,3,'n'],['p',4,3,'n'],['p',12,3,'n'],['p',13,3,'n'],['r',6,7,9,8,'o']])},
 {id:'loft',label:"PIDGE'S LOFT",rows:room([['p',3,3,'n'],['p',4,3,'n'],['p',5,3,'n'],['r',10,4,12,4,'t'],['p',13,3,'P'],['r',6,8,9,9,'o']])},
 {id:'library',label:'LIBRARY',rows:room([['r',2,3,13,3,'9'],['r',2,4,2,8,'9'],['r',13,4,13,8,'9'],['r',6,6,9,6,'k'],['r',3,8,5,9,'o'],['p',10,9,'P']])},
 {id:'museum',label:'MUSEUM',rows:room([['p',3,4,'4'],['p',6,4,'4'],['p',9,4,'4'],['p',12,4,'4'],['p',2,3,'P'],['p',13,3,'P'],['r',5,7,10,8,'o']])},
 null,null]});
