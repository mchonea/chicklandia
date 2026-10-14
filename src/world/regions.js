'use strict';
/* ---------------- regions ----------------
   Every area of the game is a REGION: a grid of 16x12-tile screens with its own tiles, kind and name.
   Regions are defined in src/regions/*.js with defineRegion({...}) and stitched into one tile grid by
   buildWorld(). To add an area: create a region file, add it to src/order.json (before world/tilemap.js),
   give it an origin on free screen coordinates. Nothing else needs to know the global grid size.

   defineRegion fields
     id        unique id (also used by the save: Pip's position is {region,x,y} local to the region)
     name      HUD label          kind      'outdoor' | 'indoor' | 'cave'   (weather / darkness / music)
     origin    [sx,sy] top-left screen in the shared tile grid      grid [w,h] screens across/down
     screens   w*h screens, row-major, each an array of 12 strings of 16 tiles
     ground    'grass'|'snow'|'sand'|'cobble' (what shows under transparent tiles)   beyond: true for Part 2 areas
     kinds     optional per-screen kind override   labels: optional per-screen names (rooms, secrets)
     area      key used by the fly map / area discovery (defaults to none)                                  */
const REGIONS={},REGION_LIST=[],CELL={},WALK=new Set();
let MW=0,MH=0,MAP=[];
const AREA_IDS=['farm','mountains','coop','forest','city','beach'];
function defineRegion(d){REGIONS[d.id]=d;REGION_LIST.push(d);}
function buildWorld(){
  let maxX=0,maxY=0;
  for(const r of REGION_LIST){
    r.area=AREA_IDS.includes(r.id)?r.id:null;r.cells=[];
    for(let gy=0;gy<r.grid[1];gy++)for(let gx=0;gx<r.grid[0];gx++){
      const i=gy*r.grid[0]+gx,cx=r.origin[0]+gx,cy=r.origin[1]+gy;
      if(CELL[cx+','+cy])console.warn('region overlap at',cx,cy,r.id);
      const cell={region:r,sx:cx,sy:cy,gx,gy,i,rows:r.screens[i],kind:(r.kinds&&r.kinds[i])||r.kind,label:r.labels&&r.labels[i]};
      CELL[cx+','+cy]=cell;r.cells.push(cell);maxX=Math.max(maxX,cx);maxY=Math.max(maxY,cy);
      if(cell.kind==='outdoor')WALK.add(cx+','+cy);
    }
  }
  MW=(maxX+1)*16;MH=(maxY+1)*12;MAP=[];
  for(let sy=0;sy<=maxY;sy++)for(let r=0;r<12;r++){
    let row='';
    for(let sx=0;sx<=maxX;sx++){const c=CELL[sx+','+sy];row+=c?c.rows[r]:'TTTTTTTTTTTTTTTT';}
    MAP.push(row);
  }
}
function cellAt(cs=CS){return CELL[cs.x+','+cs.y]||null;}
function regionAt(cs=CS){const c=cellAt(cs);return c?c.region:null;}
function regionOfPos(x,y){return regionAt({x:Math.floor(x/256),y:Math.floor((y-1)/192)});}
function inBeyond(x=P.x,y=P.y){const r=regionOfPos(x,y);return !!r&&r.beyond;}
function groundOf(c,r){const g=regionOfPos(c*16+8,r*16+8);return g?g.ground:'grass';}
// saves store position as {region,x,y} relative to the region's top-left corner
function toRegionPos(x,y){const r=regionOfPos(x,y)||REGIONS.farm;return {region:r.id,x:Math.round(x-r.origin[0]*256),y:Math.round(y-r.origin[1]*192)};}
function fromRegionPos(p){const r=REGIONS[p.region]||REGIONS.farm;return {x:p.x+r.origin[0]*256,y:p.y+r.origin[1]*192};}
