'use strict';
/* content: Chicklandia Village. Data only: building types, pads, material spots, residents and their wishes, seasons. */
const MATS=['wood','stone','wool','clay'];
const MAT_NAME={wood:'WOOD',stone:'STONE',wool:'WOOL',clay:'CLAY'};
// building types. cost.seeds + materials. happy = village happiness it adds. only: 'river' pads only.
const BUILDING_TYPES={
  home:{name:'COZY HOME',cost:{seeds:4,wood:3,clay:1},happy:5,desc:'A snug little house for a friend to move into.'},
  bakery:{name:'BAKERY BRANCH',cost:{seeds:5,wood:2,stone:2,clay:2},happy:6,desc:'Warm bread smells. A friend baker could live here.'},
  mill:{name:'WATERMILL',cost:{seeds:6,wood:4,stone:3},happy:6,only:'river',desc:'Turns the river into flour. Gives 2 seeds every day!'},
  band:{name:'BANDSTAND',cost:{seeds:6,wood:4,clay:2},happy:8,desc:'Music and dancing! Villagers love it.'},
  school:{name:'SCHOOL',cost:{seeds:6,wood:3,stone:2,wool:2},happy:6,desc:'A little school with a big bell.'},
  clinic:{name:'CLINIC',cost:{seeds:6,wood:2,stone:2,wool:3},happy:6,desc:'Rest and heal here. Free full hearts any time!'}};
const BUILD_ORDER=['home','bakery','mill','band','school','clinic'];
const BUILD_TIME=Math.round(DAY*0.2);                 // one build takes about a minute (half with Master Builder)
// pads (tile col,row of the top-left tile of a 2x2 pad). river: next to the water.
const PADS=[
  {id:'p0',c:35,r:86},{id:'p1',c:43,r:86},{id:'p2',c:35,r:92},{id:'p3',c:43,r:92},
  {id:'p4',c:51,r:86},{id:'p5',c:59,r:86},{id:'p6',c:51,r:92},{id:'p7',c:59,r:92},
  {id:'p8',c:24,r:98,river:true},{id:'p9',c:24,r:104,river:true}];
// gathering spots: wood, stone, clay come back every in-game day; stone needs CARRY
const NODES=[
  {id:'nw0',kind:'wood',c:6,r:98},{id:'nw1',kind:'wood',c:10,r:97},{id:'nw2',kind:'wood',c:6,r:106},{id:'nw3',kind:'wood',c:7,r:104},
  {id:'ns0',kind:'stone',c:28,r:98},{id:'ns1',kind:'stone',c:30,r:106},{id:'ns2',kind:'stone',c:25,r:101},
  {id:'nc0',kind:'clay',c:18,r:104},{id:'nc1',kind:'clay',c:19,r:105},{id:'nc2',kind:'clay',c:28,r:104}];
const NODE_YIELD={wood:2,stone:2,clay:2};
// sheep to shear (2 wool each, once a day) in the meadow pasture
const VSHEEP=[{id:'vs0',c:59,r:100},{id:'vs1',c:61,r:102},{id:'vs2',c:60,r:103}];
// crop rows (garden plots) and orchard
const CROP_ROWS=[...[34,35,36,37].flatMap(c=>[[c,98],[c,104]]),...[50,51,52,53].flatMap(c=>[[c,98],[c,104]])];
// the people who can move in. needs = building kind, give = materials for their wish, quest id v_<id>
const RESIDENTS=[
  {id:'pig',name:'PORKCHOP',needs:'home',give:{clay:2},wish:"a proper MUD POND to roll in. It needs 2 CLAY.",home:"Oink! Best. Village. EVER.",how:'moves into a cozy home'},
  {id:'whiskers',name:'WHISKERS',needs:'home',give:{wool:2},wish:"a sunny window with a soft cushion. It needs 2 WOOL.",home:"Mrrow. This cushion is... acceptable. Very acceptable.",how:'moves into a cozy home'},
  {id:'clyde',name:'CLYDE',needs:'mill',give:{wood:3},wish:"a new hay wagon by the mill. It needs 3 WOOD.",home:"Neeeigh! A mill AND a wagon. I'm a lucky horse.",how:'moves in beside the mill'},
  {id:'daisy',name:'DAISY',needs:'bakery',give:{wood:2},wish:"a milking stool for her dairy corner at the bakery. It needs 2 WOOD.",home:"Moooo! Fresh milk and warm bread. Come by anytime!",how:'moves into the bakery branch'},
  {id:'doe',name:'DOE',needs:'clinic',give:{wool:2},wish:"soft blankets for the clinic beds. It needs 2 WOOL.",home:"Everyone is welcome here. Rest and be well.",how:'moves in at the clinic'},
  {id:'penny',name:'PENNY',needs:'school',give:{wood:3},wish:"desks for the little school. It needs 3 WOOD.",home:"Class is in session! Who wants to be teacher's pet?",how:'moves in at the school'},
  {id:'rooster',name:'SIR CLUCKINGTON',needs:'band',give:{stone:2},wish:"a big stone stage to crow from. It needs 2 STONE.",home:"COCK-A-DOODLE-DOO! Every morning, at the top of my lungs!",how:'moves in by the bandstand'}];
// one-time and daily events
const FINALE_HAPPY=100;                               // happiness needed for the Grand Harvest Festival
const GP_BUILD_NOTE='each finished building gives GP.build growth';
const HAPPY_WISH=8,HAPPY_CONTEST=5;
const SEASONS=['SPRING','SUMMER','AUTUMN','WINTER'];
const SEASON_DAYS=3;                                 // in-game days per season
const SEASON_TINT={SPRING:'rgba(190,255,190,0.10)',SUMMER:'rgba(255,240,120,0.12)',AUTUMN:'rgba(255,150,60,0.16)',WINTER:'rgba(210,230,255,0.25)'};
// the road from the city market opens here (tile col,row of the two market-bottom tiles)
const VILLAGE_ROAD=[[39,83],[40,83]];
