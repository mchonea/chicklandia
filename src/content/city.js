'use strict';
/* content: the city's buildings. Door tiles are derived from CITY_LOTS in regions/city.js.
   room = id of the interior room (src/regions/cityin.js).  hours: 'day' | 'dawn' (bakery opens at sunrise) | 'always'.
   Closed buildings show a CLOSED sign and cannot be entered; homes are always open (the owners are just out or asleep). */
const BUILDINGS=[
  {id:'post',sign:'POST',name:'POST OFFICE',room:'post',hours:'day'},
  {id:'rocco',sign:'DEN',name:"ROCCO'S DEN",room:'rocco',hours:'always'},
  {id:'bistro',sign:'BISTRO',name:"REMY'S BISTRO",room:'bistro',hours:'always'},
  {id:'boutique',sign:'BOUTIQUE',name:"MAGGIE'S BOUTIQUE",room:'boutique',hours:'day'},
  {id:'seed',sign:'FEED',name:'SEED & FEED',room:'seed',hours:'day'},
  {id:'bakery',sign:'BAKERY',name:'BAKERY',room:'bakery',hours:'dawn'},
  {id:'toy',sign:'TOYS',name:'TOY SHOP',room:'toy',hours:'day'},
  {id:'library',sign:'LIBRARY',name:'LIBRARY',room:'library',hours:'day'},
  {id:'museum',sign:'MUSEUM',name:'MUSEUM',room:'museum',hours:'day'},
  {id:'cleo',sign:'CLEO',name:"CLEO'S FLAT",room:'cleo',hours:'always'},
  {id:'artist',sign:'ARTIST',name:'ARTIST STUDIO',room:'artist',hours:'always'},
  {id:'ducks',sign:'DUCKS',name:'DUCK FLAT',room:'ducks',hours:'always'},
  {id:'loft',sign:'LOFT',name:"PIDGE'S LOFT",room:'loft',hours:'always'}];
// the rooftop stairs (inside the toy shop) and back
const ROOF_STAIRS={toyDoor:[(5+1)*16+13,(4+1)*12+9],roofDoor:[5*16+2,7*12+5]};
const BUILDING_AT={},BUILDING_BY_ROOM={};
function roomCell(id){return REGION_LIST.find(r=>r.id==='cityin').cells.find(c=>c.id===id)||REGIONS.skyin.cells.find(c=>c.id===id);}
function roomOrigin(id){const c=roomCell(id);return {x:c.sx*256,y:c.sy*192};}
function roomEntry(id){const o=roomOrigin(id);return {x:o.x+128,y:o.y+171};}      // where Pip appears, just inside the exit
for(const b of BUILDINGS){
  const lot=CITY_LOTS.find(l=>l.id===b.id);b.door=[32+lot.screen%3*16+lot.dc,60+Math.floor(lot.screen/3)*12+lot.dr];
  b.out={x:b.door[0]*16+8,y:(b.door[1]+1)*16+11};      // where Pip stands outside the door
  b.in=roomEntry(b.room);BUILDING_AT[b.door[0]+','+b.door[1]]=b;BUILDING_BY_ROOM[b.room]=b;
  DOORS[b.door[0]+','+b.door[1]]={x:b.in.x,y:b.in.y,b};
}
// rooftop stairs: toy shop door -> roof start platform, roof stairs -> toy shop
{const t=ROOF_STAIRS.toyDoor,r=ROOF_STAIRS.roofDoor;
  DOORS[t[0]+','+t[1]]={x:1280+ROOF_ENTRY[0],y:1344+ROOF_ENTRY[1],roof:true};
  DOORS[r[0]+','+r[1]]={x:t[0]*16+8,y:(t[1]+1)*16+11,roof:true};}
// is a building open right now?
function buildingOpen(b){
  if(b.hours==='always')return true;
  const t=dayT();
  if(b.hours==='dawn')return t>=0.97||t<0.58;
  return t>=0.06&&t<0.57;
}
