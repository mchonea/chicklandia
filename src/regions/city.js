'use strict';
/* City Gate / Main Street / City Park, then Market / Residential / Harbor.
   Lots, door anchors and scenery share coordinates with the artwork. */
const CITY_LOTS=[
 {id:'post',screen:0,x:8,y:65,w:92,h:60,dc:3,dr:3},
 {id:'rocco',screen:0,x:166,y:65,w:79,h:52,dc:13,dr:3},
 ...['boutique','seed','bakery','toy'].map((id,i)=>({id,screen:1,x:i*64,y:67,w:64,h:67,dc:i*4+2,dr:3,rowhouse:true})),
 {id:'library',screen:2,x:5,y:65,w:89,h:61,dc:3,dr:3},
 {id:'museum',screen:2,x:165,y:65,w:87,h:61,dc:12,dr:3},
 {id:'bistro',screen:3,x:13,y:64,w:83,h:55,dc:3,dr:3},
 {id:'cleo',screen:4,x:6,y:67,w:56,h:52,dc:2,dr:3},
 {id:'artist',screen:4,x:68,y:67,w:40,h:57,dc:5,dr:3},
 {id:'ducks',screen:4,x:148,y:67,w:42,h:51,dc:10,dr:3},
 {id:'loft',screen:4,x:201,y:67,w:50,h:63,dc:14,dr:3}
];
const CITY_PROPS=[];
function cityProp(screen,kind,args,hit){CITY_PROPS.push({id:'city_'+screen+'_'+CITY_PROPS.length,screen,kind,args,hit});}
// Small civic green; its fountain sits beside the route to the market.
cityProp(0,'fountain',[59,153],[39,141,40,26]);cityProp(0,'bench',[94,139],[81,140,27,8]);cityProp(0,'bench',[199,147],[186,148,27,8]);
cityProp(0,'bed',[8,175,85,13],[8,175,85,13]);cityProp(0,'bed',[163,175,85,13],[163,175,85,13]);
cityProp(0,'tree',[20,171,.6],[17,167,7,5]);cityProp(0,'tree',[226,169,.7],[223,165,7,5]);
for(const x of [22,235])cityProp(0,'lamp',[x,74],[x-3,73,7,3]);
// A single attached terrace, with seating south of the shopping street.
for(const x of [8,160])cityProp(1,'bed',[x,143,88,14],[x,143,88,14]);
for(const x of [54,204])cityProp(1,'bench',[x,171],[x-13,172,27,8]);
for(const x of [18,238])cityProp(1,'tree',[x,184,.65],[x-3,180,7,5]);
for(const x of [12,243])cityProp(1,'lamp',[x,75],[x-3,74,7,3]);
// Three existing duckling destinations: gazebo, pond bank and bandstand.
cityProp(2,'gazebo',[128,70],[108,71,40,6]);
cityProp(2,'gazebo',[205,165],[181,169,49,6]);
cityProp(2,'bench',[47,132],[34,133,27,8]);
cityProp(2,'tree',[10,185,.7],[7,181,7,5]);cityProp(2,'tree',[251,184,.8],[248,180,7,5]);
for(const x of [103,153])cityProp(2,'lamp',[x,74],[x-3,73,7,3]);
for(const x of [105,147])cityProp(2,'bed',[x,139,7,45,false],[x,139,7,45]);
// Market furniture stays on the square's edges, outside both through routes.
cityProp(3,'stall',[177,37,'#d45d50'],[177,46,48,18]);cityProp(3,'clock',[157,70],[154,68,7,5]);
for(const x of [40,83])cityProp(3,'table',[x,145],[x-15,143,32,12]);
cityProp(3,'stall',[185,150,'#407f83'],[185,159,48,18]);cityProp(3,'bench',[35,177],[22,178,27,8]);
cityProp(3,'bed',[8,169,7,18],[8,169,7,18]);cityProp(3,'bed',[161,179,80,9],[161,179,80,9]);
cityProp(3,'lamp',[101,74],[98,73,7,3]);cityProp(3,'lamp',[154,130],[151,129,7,3]);
// Shared courtyard and a laundry line; the northern approach stays unobstructed.
cityProp(4,'bed',[29,139,48,16],[29,139,48,16]);cityProp(4,'bed',[164,139,61,16],[164,139,61,16]);
cityProp(4,'bench',[124,174],[111,175,27,8]);cityProp(4,'laundry',[88,152],[86,150,4,4]);
cityProp(4,'tree',[18,183,.7],[15,179,7,5]);cityProp(4,'tree',[244,182,.7],[241,178,7,5]);
cityProp(4,'lamp',[154,75],[151,74,7,3]);
function cityDistrict(i){
 const g=Array.from({length:12},()=>Array(16).fill('.'));
 const rect=(x,y,w,h,ch)=>{for(let r=y;r<y+h;r++)for(let c=x;c<x+w;c++)g[r][c]=ch;};
 rect(0,0,16,8,'=');rect(7,8,2,4,'=');
 if(i===3){rect(0,0,16,12,'=');g[11][7]=g[11][8]='F';}
 if(i===4){rect(0,8,16,4,'.');rect(2,8,12,3,'=');}
 for(const b of CITY_LOTS.filter(b=>b.screen===i)){
  const left=Math.max(0,Math.floor((b.x+3)/16)),right=Math.min(15,Math.floor((b.x+b.w-4)/16));
  rect(left,0,right-left+1,b.dr+1,'U');g[b.dr][b.dc]='1';
 }
 if(i===2){rect(1,9,4,2,'W');g[9][1]='.';g[10][4]='.';}
 return g.map(r=>r.join(''));
}
defineRegion({id:'city',name:'CITY',kind:'outdoor',origin:[2,5],grid:[3,2],ground:'cobble',beyond:true,
 labels:['CITY GATE','MAIN STREET','CITY PARK','MARKET SQUARE','RESIDENTIAL LANE','HARBOR DOCKS'],
 screens:[...[0,1,2,3,4].map(cityDistrict),[
 'TTTTTTT==TTTTTTT','T=====6==6=====T','T==============T','T=[==========[=T',
 '======s========T','===============T','wwww33wwwwwwwwww','wwww33ww55wwwwww',
 'wwww333355wwwwww','wwww33ww55wwwwww','wwwwwwww55wwwwww','wwwwwwwwwwwwwwww']]});
