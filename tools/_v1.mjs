import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/content/village.js',[
 ["{id:'p0',c:34,r:86},{id:'p1',c:42,r:86},{id:'p2',c:34,r:92},{id:'p3',c:42,r:92},\n  {id:'p4',c:50,r:86},{id:'p5',c:58,r:86},{id:'p6',c:50,r:92},{id:'p7',c:58,r:92},","{id:'p0',c:35,r:86},{id:'p1',c:43,r:86},{id:'p2',c:35,r:92},{id:'p3',c:43,r:92},\n  {id:'p4',c:51,r:86},{id:'p5',c:59,r:86},{id:'p6',c:51,r:92},{id:'p7',c:59,r:92},"],
 ["{id:'nw3',kind:'wood',c:12,r:104}","{id:'nw3',kind:'wood',c:7,r:104}"]]);
ed('src/world/regions.js',[["r.area=AREA_IDS.includes(r.id)?r.id:null;","r.area=r.area||(AREA_IDS.includes(r.id)?r.id:null);"]]);
ed('src/regions/village.js',[["area:'village',\n screens:[\n  grid('T',[['r',1,1,14,10,'.'],['r',1,5,15,6,'='],['r',4,5,5,11","area:'village',music:'farm',\n screens:[\n  grid('T',[['r',1,1,14,10,'.'],['r',1,5,15,6,'='],['r',4,5,5,11"]]);
let v=fs.readFileSync('src/regions/village.js','utf8');v=v.replace(/area:'village',\n/g,"area:'village',music:'farm',\n").replace(/music:'farm',music:'farm'/g,"music:'farm'");fs.writeFileSync('src/regions/village.js',v);
ed('src/world/tiles.js',[["function groundFor(c,r,h){","TILE.pad=mk(16,16,x=>{x.drawImage(TILE.dirt,0,0);P_(x,'B',0,0,2,2);P_(x,'B',14,0,2,2);P_(x,'B',0,14,2,2);P_(x,'B',14,14,2,2);P_(x,'T',3,3,10,1);P_(x,'T',3,12,10,1);});\nfunction groundFor(c,r,h){"]]);
ed('src/world/tilemap.js',[["    case '1':img=TILE.brickDoor;break;","    case '1':img=TILE.brickDoor;break;\n    case '7':img=TILE.pad;break;"]]);
ed('src/systems/world.js',[["  {const a=areaOf();if(a&&a!=='farm')return a;}","  {const rm=regionAt();if(rm&&rm.music)return rm.music;}\n  {const a=areaOf();if(a&&a!=='farm')return a;}"]]);
ed('src/systems/part2.js',[
 ["const AREA_LABEL={farm:'FARM',forest:'FOREST',mountains:'MOUNTAINS',city:'CITY',beach:'BEACH',coop:'MY COOP'};","const AREA_LABEL={farm:'FARM',forest:'FOREST',mountains:'MOUNTAINS',city:'CITY',beach:'BEACH',coop:'MY COOP',village:'VILLAGE'};"],
 ["city:{x:600,y:1051,mx:214,my:110,icon:'brickWin'},","city:{x:600,y:1051,mx:214,my:110,icon:'brickWin'},village:{x:648,y:1436,mx:214,my:158,icon:'hay'},"],
 ["const ks=['farm','forest','mountains','city','beach'].filter(k=>G.areas.includes(k)||k==='farm'||k==='forest');","const ks=['farm','forest','mountains','city','beach','village'].filter(k=>(G.areas.includes(k)&&(k!=='village'||G.vil.open))||k==='farm'||k==='forest');"],
 ["  ['farm','mountains','city','beach'].forEach(k=>line('forest',k));\n  for(const k of ['farm','forest','mountains','city','beach','coop']){","  ['farm','mountains','city','beach'].forEach(k=>line('forest',k));if(G.vil.open)line('city','village');\n  for(const k of ['farm','forest','mountains','city','beach','village','coop']){\n    if(k==='village'&&!G.vil.open)continue;"]]);
ed('src/engine/state.js',[
 ["growMsgOnLoad:false,time:0","growMsgOnLoad:false,vil:{open:false,b:{},mat:{wood:0,stone:0,wool:0,clay:0},res:{},letters:[],nodes:{},shear:{},whistle:{},skills:0,contest:{},decor:{}},time:0"],
 ["sacks:G.sacks,decor:G.decor,","sacks:G.sacks,vil:G.vil,decor:G.decor,"],
 ["G.sacks=Object.assign(G.sacks,s.sacks||{});","G.sacks=Object.assign(G.sacks,s.sacks||{});if(s.vil)G.vil=Object.assign(G.vil,s.vil);"],
 ["rocco:0,cleo:0,cookoff:0,vane:0,babysit:0,portrait:0}","rocco:0,cleo:0,cookoff:0,vane:0,babysit:0,portrait:0,vfound:0,v_pig:0,v_whiskers:0,v_clyde:0,v_bramble:0,v_doe:0,v_penny:0,v_pablo:0,vharvest:0}"],
 ["  makeCityEnts();\n","  makeCityEnts();\n  makeVillageEnts();\n"]]);
// village NPCs
ed('src/content/characters.js',[["  {id:'nibbles2',","  {id:'barnaby',name:'FOREMAN BARNABY',spr:'beaver',c:38,r:89,voice:520,w:12},\n  {id:'dash',name:'DASH',spr:'dog',c:56,r:101,voice:340,w:14},\n  {id:'nibbles2',"]]);
ed('src/engine/canvas.js',[["TOTAL_SEEDS2=38","TOTAL_SEEDS2=38"]]);
fs.writeFileSync('src/order.json',JSON.stringify((()=>{let o=JSON.parse(fs.readFileSync('src/order.json','utf8'));
 o.splice(o.indexOf('regions/rooftops.js')+1,0,'regions/village.js');
 o.splice(o.indexOf('content/world_data.js'),0,'content/village.js');
 o.splice(o.indexOf('content/characters.js'),0,'content/quests_village.js');
 o.splice(o.indexOf('systems/city2.js')+1,0,'systems/village.js');return [...new Set(o)];})(),null,1));
