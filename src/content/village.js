'use strict';
/* content: Chicklandia Village. Data only: building types, pads, material spots, residents and their wishes, seasons. */
const MATS=['wood','stone','wool','clay'];
const MAT_NAME={wood:'WOOD',stone:'STONE',wool:'WOOL',clay:'CLAY'};
// building types. cost.seeds + materials. happy = village happiness it adds. only: 'river' pads only.
const BUILDING_TYPES={
  home:{name:'COZY HOME',cost:{seeds:6,wood:3,clay:1},happy:5,desc:'A snug little house for a friend to move into.'},
  bakery:{name:'BAKERY BRANCH',cost:{seeds:8,wood:2,stone:2,clay:2},happy:6,desc:'Warm bread smells. A friend baker could live here.'},
  mill:{name:'WATERMILL',cost:{seeds:9,wood:4,stone:3},happy:6,only:'river',desc:'Turns the river into flour. Gives 1 seed every day!'},
  band:{name:'BANDSTAND',cost:{seeds:9,wood:4,clay:2},happy:8,desc:'Music and dancing! Villagers love it.'},
  school:{name:'SCHOOL',cost:{seeds:9,wood:3,stone:2,wool:2},happy:6,desc:'A little school with a big bell.'},
  clinic:{name:'CLINIC',cost:{seeds:9,wood:2,stone:2,wool:3},happy:6,desc:'Rest and heal here. Free full hearts any time!'}};
const BUILD_ORDER=['home','bakery','mill','band','school','clinic'];
const BUILD_TIME=Math.round(DAY*0.2);                 // one build takes about a minute (half with Master Builder)
// pads (tile col,row of the top-left tile of a 2x2 pad). river: next to the water.
const PADS=VILLAGE_LOTS;
// gathering spots: wood, stone, clay come back every in-game day; stone needs CARRY
const NODES=[
  {id:'nw0',kind:'wood',c:3,r:101},{id:'nw1',kind:'wood',c:10,r:100},{id:'nw2',kind:'wood',c:4,r:105},{id:'nw3',kind:'wood',c:9,r:105},
  {id:'ns0',kind:'stone',c:28,r:98},{id:'ns1',kind:'stone',c:30,r:103},{id:'ns2',kind:'stone',c:28,r:101},
  {id:'nc0',kind:'clay',c:18,r:105},{id:'nc1',kind:'clay',c:19,r:106},{id:'nc2',kind:'clay',c:28,r:104}];
const NODE_YIELD={wood:2,stone:2,clay:2};
// sheep to shear (2 wool each, once a day) in the meadow pasture
const VSHEEP=[{id:'vs0',c:59,r:100},{id:'vs1',c:61,r:102},{id:'vs2',c:60,r:103}];
// crop rows (garden plots) and orchard
const CROP_ROWS=[...[34,35,36,37].flatMap(c=>[[c,98],[c,104]]),...[50,51,52,53].flatMap(c=>[[c,98],[c,104]])];
// Scenery is anchored at its feet, like the farm's characters and buildings.
const VILLAGE_PROPS=[
  {id:'greenOak',kind:'oak',c:10,r:88,w:22,solid:true},
  {id:'picnic',kind:'picnic',c:13,r:89,w:32,solid:true},
  {id:'greenBench',kind:'bench',c:2,r:91,w:24,solid:true},
  {id:'swings',kind:'swings',c:3,r:94,w:34,solid:true},
  {id:'slide',kind:'slide',c:6,r:94,w:24,solid:true},
  {id:'greenFlowers',kind:'planter',c:7,r:86},
  {id:'hillFlags',kind:'bunting',c:23,r:86},
  {id:'hillBench0',kind:'bench',c:18,r:90,w:24,solid:true},
  {id:'hillBench1',kind:'bench',c:22,r:90,w:24,solid:true},
  {id:'seasonDisplay',kind:'seasonal',c:25,r:88},
  {id:'hillHay',kind:'haycart',c:27,r:95,w:30,solid:true},
  {id:'squareWell',kind:'well',c:37,r:92,w:20,solid:true},
  {id:'marketBench',kind:'bench',c:35,r:94,w:24,solid:true},
  {id:'marketLamp',kind:'lamp',c:45,r:88,w:6,solid:true},
  {id:'laneLamp',kind:'lamp',c:56,r:88,w:6,solid:true},
  {id:'laneFlowers',kind:'planter',c:57,r:94},
  {id:'laneTree',kind:'fruitTree',c:61,r:87,w:15,solid:true},
  {id:'workshop',kind:'workshop',c:5,r:99,w:48,solid:true},
  {id:'lumberRack',kind:'lumber',c:11,r:98,w:30,solid:true},
  {id:'sawbench',kind:'workbench',c:6,r:103,w:28,solid:true},
  {id:'yardCart',kind:'haycart',c:2,r:104,w:30,solid:true},
  {id:'yardStump',kind:'stump',c:10,r:104,w:12,solid:true},
  {id:'pondReeds',kind:'reeds',c:14,r:104},
  {id:'millSacks',kind:'sacks',c:30.5,r:101,w:16,solid:true},
  {id:'millBarrels',kind:'barrels',c:30.5,r:99,w:18,solid:true},
  {id:'gardenBench',kind:'bench',c:45,r:103,w:24,solid:true},
  {id:'gardenTools',kind:'tools',c:33,r:103,w:14,solid:true},
  {id:'gardenFlowers',kind:'planter',c:41,r:99},
  {id:'pastureShelter',kind:'shelter',c:60,r:99,w:38,solid:true},
  {id:'pastureTrough',kind:'trough',c:60,r:105,w:24,solid:true},
  {id:'pastureHay',kind:'hay',c:59,r:104,w:16,solid:true}
];
const VILLAGE_SIGNS=[
  {id:'greenSign',c:12,r:91,name:'VILLAGE GREEN',text:'A shady place to meet your neighbours. The school and clinic can settle beside the green. Come by for a picnic!'},
  {id:'yardSign',c:12,r:101,name:"BUILDERS' YARD",text:"Bucky's workshop. Gather the log bundles around the yard each day. Barnaby teaches Master Builder; look around here for his fine planks."},
  {id:'gardenSign',c:41,r:101,name:'COMMUNITY GARDENS',text:'Shared beds, fresh apples and a sunny seat. Plant your seeds here. Green Wings waters the growing crops!'}
];
const VILLAGE_WISH_ART={pig:['mudpond',31,9],whiskers:['cushion',26,7],clyde:['haycart',38,8],daisy:['dairy',29,8],doe:['blankets',29,8],penny:['desks',29,9],rooster:['stoneStage',0,9]};
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
