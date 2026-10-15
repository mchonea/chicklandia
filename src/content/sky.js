'use strict';
/* content: the Sky Kingdom (Phase 6). Data only: where everything is, the Sky Tree II, outfits, foods.
   Positions are written as [screen, col, row]; the screens are the keys of SKO (top-left tile of each screen).
     m0 m1 = Cloud Meadows     g0 g1 = Floating Gardens     c0 c1 = Cloud City     p0 p1 = Storm Peaks     lair = the dragon's lair
     plume star weather cottage nursery = the five Cloud City rooms                                                         */
const SKO={m0:[0,204],m1:[16,204],g0:[48,204],g1:[64,204],c0:[0,228],c1:[16,228],p0:[48,228],p1:[64,228],lair:[0,252],
  plume:[48,252],star:[64,252],weather:[80,252],cottage:[96,252],nursery:[112,252]};
const skp=(o,c,r)=>({x:(SKO[o][0]+c)*16+8,y:(SKO[o][1]+r)*16+12});      // -> pixel position (feet)
const skpA=a=>skp(a[0],a[1],a[2]);
const SKY_AREAS=['meadows','gardens','skycity','peaks','lair'];
// where the fly map and "arrive" put Pip, and where the snowy-peak sky gate is
const SKY_NODES={meadows:{at:['m0',2,8],mx:62,my:78,icon:'cloud'},gardens:{at:['g0',7,7],mx:194,my:78,icon:'flower'},
  skycity:{at:['c0',7,8],mx:62,my:150,icon:'brickWin'},peaks:{at:['p0',2,8],mx:194,my:150,icon:'storm'}};
const SKY_GATE={tile:[29,54]};                                           // the cloud stairway on the snowy peak (global tile)
const gatePx=()=>({x:SKY_GATE.tile[0]*16+8,y:SKY_GATE.tile[1]*16+12});
const gateOut=()=>({x:SKY_GATE.tile[0]*16+8,y:SKY_GATE.tile[1]*16+36});
// bouncy clouds: stepping on one launches Pip to "to" (or straight up and down when to is null: that is where DIVE-BOMB lands)
const SKY_PADS=[
  {id:'pad_m0a',at:['m0',10,4],to:['m0',10,2]},{id:'pad_m0b',at:['m0',12,2],to:['m0',12,4]},{id:'pad_m0c',at:['m0',2,2],to:['m0',2,4]},
  {id:'pad_m1',at:['m1',8,9],to:null},
  {id:'pad_g1a',at:['g1',9,2],to:['g1',9,4]},{id:'pad_g1b',at:['g1',3,2],to:['g1',3,4]},{id:'pad_g0',at:['g0',13,9],to:null}];
// updraft vents: UPDRAFT lifts Pip up to the island above
const SKY_VENTS=[{id:'vm0',at:['m0',5,4],to:['m0',5,2]},{id:'vg1',at:['g1',7,5],to:['g1',7,2]}];
// sky portals (cloud stairways) between the four areas. Both ends are listed; Pip lands one tile beside the far end.
const SKY_PORTALS=[
  {id:'down',at:['m0',2,10],label:'DOWN',to:null},
  {id:'m1g0',at:['m1',14,5],to:['g0',2,5],label:'GARDENS'},{id:'g0m1',at:['g0',1,5],to:['m1',13,5],label:'MEADOWS'},
  {id:'g1c0',at:['g1',14,5],to:['c0',2,4],label:'CITY'},{id:'c0g1',at:['c0',1,4],to:['g1',13,5],label:'GARDENS'},
  {id:'c1p0',at:['c1',14,9],to:['p0',2,8],label:'PEAKS'},{id:'p0c1',at:['p0',1,8],to:['c1',13,9],label:'CITY'},
  {id:'p1lair',at:['p1',14,6],to:['lair',8,8],label:"LAIR",lair:true},{id:'lairp1',at:['lair',8,10],to:['p1',13,6],label:'LEAVE',lair:true}];
// pick-ups: [id, kind, screen, col, row]
const SKY_ITEMS=[
  ['lamb0','lamb','m0',13,9],['lamb1','lamb','m1',12,5],['lamb2','lamb','g0',1,9],
  ['sf0','skyfeather','m0',9,1],['sf1','skyfeather','m0',4,1],['sf2','skyfeather','g0',13,4],['sf3','skyfeather','g1',6,1],
  ['ch0','chime','m0',14,10],['ch1','chime','m1',8,5],['ch2','chime','g1',13,9],
  ['pg0','peg','g0',1,3],['pg1','peg','g1',12,9],['pg2','peg','m1',2,10],
  ['cp0','cloudpuff','g0',7,10],['cp1','cloudpuff','c0',14,9],['cp2','cloudpuff','c1',2,9],
  ['bt0','bolt','p0',2,4],['bt1','bolt','p0',3,9],['bt2','bolt','p0',8,6],
  ['rd0','rod','p1',2,5],['rd1','rod','p1',7,5],['rd2','rod','p1',13,8],
  // hidden seeds: two on islands that need Updraft, two behind Cloud Walk, three out in the open, one in the storm
  ['shd0','shard','p0',13,6],['shd1','shard','p1',12,5],['shd2','shard','p1',14,9],
  ['cb0','cloudbloom','m0',11,1],['cb1','cloudbloom','g1',7,1],['cb2','cloudbloom','m0',3,1],
  ['sk_s0','seed','m0',13,1],['sk_s1','seed','m0',2,1],['sk_s2','seed','m1',3,1],['sk_s3','seed','g1',1,1],['sk_s4','seed','g1',5,1],
  ['sk_s5','seed','c1',1,10],['sk_s6','seed','p0',14,9],['sk_s7','seed','p1',13,10]];
const SKY_ITEM_NAME={lamb:'LAMB',skyfeather:'SKY FEATHER',chime:'WIND CHIME',peg:'PEG',cloudpuff:'CLOUD PUFF',bolt:'STATIC BOLT',rod:'LIGHTNING ROD'};
const SKY_ITEM_KINDS=Object.keys(SKY_ITEM_NAME);
// floating garden: soil blocks (every tile is a plot), and the three chime posts of the garden puzzle (small, BIG, medium)
const SKY_SOIL=[[3,5,5,6],[9,5,11,6],[3,8,5,9],[9,8,11,9]];             // [c0,r0,c1,r1] on g0
const SKY_CHIMES=[['small','g1',3,7],['big','g1',7,7],['mid','g1',11,7]];
const CHIME_TUNE=['big','small','mid'];
// the boss lair
const SKY_BELLS=[['b0','lair',3,3],['b1','lair',12,3],['b2','lair',8,9]];
const SKY_CRYS=[['c0','lair',3,5],['c1','lair',12,5],['c2','lair',5,8],['c3','lair',10,8]];
// characters (screen-local positions, see SKO)
const SKY_CAST=[
  {id:'puff',name:'PUFF',spr:'cloudsheep',o:'m0',c:6,r:6,voice:420,w:16},
  {id:'zephyr',name:'ZEPHYR',spr:'zephyr',o:'m1',c:3,r:6,voice:1300,w:12},
  {id:'fern',name:'FERN',spr:'fernbird',o:'g0',c:7,r:4,voice:900,w:12},
  {id:'plume',name:'PLUME',spr:'plumeKeeper',o:'plume',c:7,r:4,voice:1000,w:10},
  {id:'starla',name:'STARLA',spr:'starla',o:'star',c:6,r:4,voice:380,w:12},
  {id:'nimbus',name:'NIMBUS',spr:'nimbus',o:'weather',c:6,r:4,voice:260,w:14},
  {id:'tweeta',name:'TWEETA',spr:'tweeta',o:'cottage',c:5,r:8,voice:1500,w:10},
  {id:'nb1',name:'BABY BIRD',spr:'tweeta',o:'nursery',c:6,r:7,voice:1600,w:8},
  {id:'nb2',name:'BABY BIRD',spr:'eaglet',o:'nursery',c:9,r:7,voice:1450,w:10}];
// Cloud City buildings use the same machinery as the city's (see content/city.js): sign, door tile, room
const SKY_BUILDINGS=[
  {id:'plume',sign:'PLUME',name:'FEATHER BOUTIQUE',door:['c0',3,2],room:'sk_plume',hours:'always'},
  {id:'starstand',sign:'STARS',name:'STAR-FRUIT STAND',door:['c0',8,2],room:'sk_star',hours:'always'},
  {id:'weather',sign:'WEATHER',name:'WEATHER SHOP',door:['c0',12,2],room:'sk_weather',hours:'always'},
  {id:'cottage',sign:'TWEETA',name:"TWEETA'S COTTAGE",door:['c1',4,2],room:'sk_cottage',hours:'always'},
  {id:'nursery',sign:'NURSERY',name:'SKY NURSERY',door:['c1',11,2],room:'sk_nursery',hours:'always'}];
for(const b of SKY_BUILDINGS){const d=SKO[b.door[0]];b.door=[d[0]+b.door[1],d[1]+b.door[2]];
  b.out={x:b.door[0]*16+8,y:(b.door[1]+1)*16+11};b.in=roomEntry(b.room);BUILDINGS.push(b);BUILDING_AT[b.door[0]+','+b.door[1]]=b;BUILDING_BY_ROOM[b.room]=b;
  DOORS[b.door[0]+','+b.door[1]]={x:b.in.x,y:b.in.y,b};}
/* ---- the Sky Tree II: Updraft is free to buy; the other three are taught (see TRAIN in this file's quests) ---- */
const SKILLS5=[
  {id:'updraft',name:'UPDRAFT',cost:5,req:[],x:44,y:96,desc:'Step on an updraft vent to ride the wind up to the islands above!',learn:'Ride the updraft vents!'},
  {id:'cloudwalk',name:'CLOUD WALK',cost:6,req:['updraft'],x:112,y:62,desc:'Light as a feather: walk across the thin, wispy clouds. Taught by Zephyr.',learn:'Thin clouds hold you now!'},
  {id:'divebomb',name:'DIVE-BOMB',cost:6,req:['updraft'],x:112,y:130,desc:'Bounce on a bouncy cloud, press peck in mid-air, and SLAM down! Cracks cloud barriers. Taught by your chick.',learn:'Peck in mid-air to DIVE-BOMB!'},
  {id:'thunder',name:'THUNDER PECK',cost:8,req:['cloudwalk','divebomb'],x:196,y:96,desc:'Your peck crackles with lightning and shatters storm crystals. Taught by Starla.',learn:'Your peck crackles with lightning!'}];
/* ---- outfits (1 or 2 per region), foods, secret ---- */
OUTFITS.push(
  {id:'scarf',name:'CLOUD SCARF',bonus:'Soft as a cloud: strong winds and wind lanes cannot push you around.',how:'Dive-bomb into the hidden pocket in Cloud Meadows.',desc:'A scarf that smells like rain and sunshine.'},
  {id:'bloom',name:'SUN-BLOOM CROWN',bonus:'Sky gardener: sky-garden harvests give +1 seed.',how:'Help Fern in the Floating Gardens.',desc:'A crown of everlasting flowers.'},
  {id:'quill',name:'FEATHER QUILL',price:5,bonus:'Fancy feathers: updraft vents and bouncy clouds lift you a little higher and faster.',desc:'A grand plume from the Feather Boutique.'},
  {id:'stormcap',name:'STORM CAP',price:6,bonus:'Rain-proof: rain walls cannot hurt you, and lightning warns you a little earlier.',desc:'A snug cap that keeps off the drizzle.'});
ACCESSORY_IDS.push('scarf');
FOODS.push({id:'starfruit',name:'STAR-FRUIT',spr:'starfruit'},{id:'cake',name:'STAR CAKE',spr:'cake'},{id:'cloudberry',name:'CLOUDBERRY',color:'#e6f2ff'},
  {id:'skyhoney',name:'SKY HONEY',color:'#ffd83a'},{id:'stormtea',name:'STORM TEA',color:'#a8b8e0'});
EXHIBITS.push({id:'shard',item:'shard',name:'STORM SHARDS',need:3,desc:'Three shards of storm crystal.',where:'Past the crystal walls in the Storm Peaks.',reward:{seeds:6,gp:12}},
  {id:'cloudbloom',item:'cloudbloom',name:'CLOUD BLOOMS',need:3,desc:'Three flowers that only grow on clouds.',where:'On the sky islands of the Meadows and the Gardens.',reward:{seeds:6,gp:12}});
SECRET_IDS.push({id:'skynest',name:'THE LAST CLOUD'});
SEED_TYPES.star={name:'STAR-FRUIT SEED',price:3,grow:0.8,yield:5,spr:'starfruit',star:true,desc:'Grows glowing star-fruit. Gives 5 seeds and a star-fruit.'};
