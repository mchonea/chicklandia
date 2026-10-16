'use strict';
/* Roofline Run: shared pixel geometry for the art, collisions, stairs and race. */
const ROOF_TERRACES=[
 {x:16,y:49,w:160,h:81,roof:'#527d91',light:'#7398a3',shade:'#3f6078',walls:['#edc59c','#dfc4a2'],trim:['#407f83','#8e6c95']},
 {x:216,y:43,w:168,h:87,roof:'#b77763',light:'#ce9680',shade:'#965e55',walls:['#e3c79c','#dba787'],trim:['#537f83','#a65e55']},
 {x:424,y:49,w:176,h:81,roof:'#708982',light:'#95a498',shade:'#546c6d',walls:['#d4ccb0','#e6cda7'],trim:['#5d7e69','#407f83']},
 {x:640,y:43,w:112,h:87,roof:'#796b7a',light:'#a18d97',shade:'#5d586d',walls:['#e1bca0','#dbceb0'],trim:['#8b4143','#467b95']}
];
const ROOF_ENTRY=[43,108],ROOF_FLAG=[730,99],ROOF_VANE=[740,49];
const ROOF_PIPES=[[115,101,39,13],[234,102,38,13],[540,102,39,13],[656,97,33,13]];
const ROOF_SOLIDS=[
 [30,77,29,15], // stair hut base
 [132,68,18,12],[239,68,18,12],[550,68,18,12], // chimney bases
 [64,96,29,13],[282,79,29,13],[491,96,31,13], // raised skylights
 [91,117,31,13],[440,117,31,13],[687,117,31,13], // dormer bases
 [345,59,22,10],[735,62,9,17], // nest and planter
 [659,55,3,23],[704,55,3,23] // laundry posts; the cloth stays overhead
];
const ROOF_SCENERY=[
 ['stairHut',[43,84],43,92],['dormer',[106,128,'#dfc4a2'],106,130],['dormer',[455,128,'#d4ccb0'],455,130],['dormer',[702,128,'#e1bca0'],702,130],
 ['chimney',[141,79,18,25],141,80],['chimney',[248,79,18,25],248,80],['chimney',[559,79,18,25],559,80],
 ['skylight',[64,94,28],78,109],['skylight',[282,77,28],296,92],['skylight',[491,94,30],506,109],
 ['pipe',[119,108,30],134,114],['pipe',[238,109,29],252,115],['pipe',[544,109,30],559,115],['pipe',[660,104,24],672,110],
 ['laundry',[659,73,46],682,78],['pot',[738,77],738,79],['nest',[356,65],356,69]
];
const ROOF_STAR_POS=[[75,115],[111,69],[169,97],[225,97],[284,115],[370,87],[436,95],[525,71],[587,112],[723,93]];
defineRegion({id:'rooftops',name:'ROOFTOPS',kind:'outdoor',origin:[5,7],grid:[3,1],ground:'cobble',beyond:true,music:'city',
 screens:Array.from({length:3},(_,i)=>grid('#',Array.from({length:5},(_,row)=>Array.from({length:16},(_,col)=>{
  const x=i*256+col*16+8;
  return ['p',col,row+3,ROOF_TERRACES.some(b=>x>=b.x&&x<b.x+b.w)?'8':'z'];
 })).flat().concat(i===0?[['p',2,5,'1']]:[])))});
