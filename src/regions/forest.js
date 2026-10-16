'use strict';
/* Original 16px trees regrouped around the approved forest clearings.
   Shared pixel anchors drive collision, oak interactions and depth sorting. */
const FOREST_TREES=[];
// c,r is the tile under each canopy's centre; it is also the oak's acorn key, so no two oaks share one.
function forestGrove(points,oak=false){for(const [x,y] of points)FOREST_TREES.push({x,y,oak,c:Math.floor((x+8)/16),r:60+Math.floor((y+8)/16)});}
forestGrove([[0,0],[16,0],[32,0],[48,0],[64,0],[16,14],[32,13],[80,0],[92,12],[0,14],[0,30],[0,49],[0,65],[0,126],[0,143],[0,159],[16,157],[16,174],[31,174],[47,176],[63,162],[79,176],[0,176]]);
forestGrove([[160,0],[176,0],[192,0],[208,0],[224,0],[240,0],[176,14],[192,14],[224,15],[240,16],[240,33]],true);
forestGrove([[240,144],[240,160],[240,176],[256,0],[272,0],[288,0],[304,0],[320,0],[256,16],[272,16],[288,14],[256,33]]);
forestGrove([[336,0],[352,0],[368,0],[384,0],[400,0],[416,0],[432,0],[448,0],[464,0],[480,0],[496,0],[352,16],[368,15],[384,16],[432,16],[448,14],[480,16],[496,16],[496,32],[496,49],[496,66]],true);
forestGrove([[256,161],[272,177],[288,177],[304,176],[320,177],[336,176],[448,176],[464,161],[464,176],[480,176],[496,161],[496,177]]);
forestGrove([[214,24],[459,18]],true);
const FOREST_HIVES=[[222,58],[467,52]];
const FOREST_TRAILS=[{p:[[132,-8],[132,76],[130,120],[132,201]],w:24},{p:[[52,83],[66,94],[130,94],[246,94],[330,94],[358,99],[400,95],[454,94],[520,94]],w:23},{p:[[132,145],[158,145],[160,172],[208,172]],w:13}];
const forestRiverY=x=>Math.round(131+5*Math.sin((x-256)/43));
function forestScreens(){
 const rows=Array.from({length:12},()=>Array(32).fill('.'));
 for(let r=0;r<12;r++)for(let c=0;c<32;c++){
  const x=c*16+8,y=r*16+8;
  if(c>=16&&y>=forestRiverY(x)&&y<forestRiverY(x)+27)rows[r][c]='w';
  else if(Math.abs(x-132)<16||Math.abs(y-94)<16)rows[r][c]='d';
 }
 for(const t of FOREST_TREES)rows[t.r-60][t.c]=t.oak?'q':'T';
 rows[7][15]='s';rows[8][23]=rows[8][24]=rows[9][23]=rows[9][24]='x';
 return [0,1].map(n=>rows.map(row=>row.slice(n*16,n*16+16).join('')));
}
defineRegion({id:'forest',name:'FOREST',kind:'outdoor',origin:[0,5],grid:[2,1],ground:'grass',beyond:true,
 labels:['GRANNY’S CLEARING','BUCKY’S RIVER'],screens:forestScreens()});
