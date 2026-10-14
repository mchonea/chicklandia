import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
function rd(f){return fs.readFileSync(f,'utf8');}
// ---------- fixes to city2.js ----------
ed('src/systems/city2.js',[
 ["it(\"Is that \"+b.name.replace(\"'s\",\" 's\").replace(' 's',\"'s\")+\"? You found it! Thank you, Pip!\",","it(\"Is that \"+b.name+\"? You found it! Thank you, Pip!\","],
 ["  return G.flags.poses.length<2?true:false;                  // after the third pose, fall through to the \"all done\" lines\n","  if(G.flags.poses.length===2)it(\"That makes three portraits! Talk to me again and I'll show you something special!\");\n  return true;\n"]]);
// ---------- sprite palette helpers ----------
ed('src/entities/sprites_city.js',[["SPR.sunbeam=null;","SPR.plant0=SPR.plant[2];\nObject.assign(OUTFIT_SPR,{chef:makeSprite(['..www..','.wwwww.','wwwwwww','wwwwwww','.wwwww.','kkkkkkk']),detective:makeSprite(['..tttt..','.tTTTTt.','tTtTtTtt','TTTTTTTT','kkkkkkkk']),\n  gogF:makeSprite(['uuuuuuuu','uccuucu','.uu..uu.'],false),gogS:makeSprite(['uuuu','ucuu','.uu.'],false)});\nWEAR_ICON_EXTRA={chef:OUTFIT_SPR.chef,detective:OUTFIT_SPR.detective,goggles:OUTFIT_SPR.gogF};"]]);
ed('src/systems/world.js',[["const WEAR_ICON={","let WEAR_ICON_EXTRA;\nconst WEAR_ICON={"],
 ["function drawPip(","Object.assign(WEAR_ICON,WEAR_ICON_EXTRA);\nfunction drawPip("]]);
// ---------- outfits ----------
ed('src/content/outfits.js',[
 ["  {id:'pirate',name:'PIRATE',","  {id:'chef',name:'CHEF HAT',price:4,bonus:'Foodie: every food you taste for the first time gives +1 extra growth.',desc:'A tall white hat. Smells like cinnamon.'},\n  {id:'detective',name:'DETECTIVE CAP',price:4,bonus:'Sharp eyes: the quest log shows WHERE each task is.',desc:'Elementary, my dear chick!'},\n  {id:'goggles',name:'RACING GOGGLES',bonus:'Speedy: +15% speed while gliding or flying.',how:'Win the Rooftop Race at the Toy Shop.',desc:'Zoom zoom! Strapped on tight.'},\n  {id:'pirate',name:'PIRATE',"],
 ["const ACCESSORY_IDS=['bow','shades','ears','crown'];","const ACCESSORY_IDS=['bow','shades','ears','crown','goggles'];"],
 ["const SHOP=['straw','astronaut','shades','ninja'];","const SHOP=['straw','astronaut','shades','ninja','chef','detective'];"]]);
// drawPip: new outfits
ed('src/systems/world.js',[
 ["  const O=OUTFIT_SPR,HAT={straw:5,pirate:5,astronaut:8},lift=","  const O=OUTFIT_SPR,HAT={straw:5,pirate:5,astronaut:8,chef:6,detective:4},lift="],
 ["    case 'crown':case 'ears':{","    case 'chef':case 'detective':{const o=O[wear];D(o,hx-o.width*sc/2,top-o.height*sc+3*sc);break;}\n    case 'goggles':{if(dir===1)break;const ey=y0+Math.floor(hd.y)*sc-sc;\n      if(dir===0){const o=O.gogF;D(o,hx-o.width*sc/2,ey);}else{const o=O.gogS,ex=x0+mx(hd.x-hd.r*0.35)*sc;D(o,ex-o.width*sc/2,ey,dir===3);}break;}\n    case 'crown':case 'ears':{"],
 ["  if(acc==='shades')wearItem(acc,0);","  if(acc==='shades'||acc==='goggles')wearItem(acc,0);"],
 ["  if(acc&&acc!=='shades')wearItem(acc,lift);","  if(acc&&acc!=='shades'&&acc!=='goggles')wearItem(acc,lift);"]]);
// ---------- remove the old shop screen + rewrite the closet as a paged grid ----------
{let s=rd('src/systems/world.js');
 const a=s.indexOf('function openShop(){'),b=s.indexOf('/* ---- minigames ---- */');
 if(a<0||b<0)console.log('MISSING shop block');
 const closet=`/* ---- closet: 12 slots (none + 11 outfits), 4 across ---- */
const WARD_COLS=4;
function openWardrobe(){state='wardrobe';SFX.menu();wardSel=Math.max(0,[null,...OUTFITS.map(o=>o.id)].indexOf(G.wear||G.acc));}
function updateWardrobe(){
  if(pressed.wear||pressed.back||pressed.grow||pressed.quest){state='play';SFX.menu();return;}
  const n=OUTFITS.length+1;let m=false;
  if(pressed.left){wardSel=(wardSel+n-1)%n;m=true;}if(pressed.right){wardSel=(wardSel+1)%n;m=true;}
  if(pressed.up){wardSel=(wardSel+n-WARD_COLS)%n;m=true;}if(pressed.down){wardSel=(wardSel+WARD_COLS)%n;m=true;}
  if(m)SFX.menu();
  if(pressed.a){const id=wardSel?OUTFITS[wardSel-1].id:null;if(id&&!G.outfits.includes(id))SFX.deny();else{setWear(id);SFX.pick();save();}}
}
function drawWardrobe(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ffd83a');
  txt("PIP'S CLOSET",W/2,10,8,'#ffd83a',{align:'center',shadow:true});
  txt(G.outfits.length+'/'+OUTFITS.length+(G.rank>=7?'  OUTFIT + ACCESSORY':''),W-14,11,5,'#b8a8d8',{align:'right'});
  const n=OUTFITS.length+1;
  for(let i=0;i<n;i++){
    const col=i%WARD_COLS,row=Math.floor(i/WARD_COLS),x=10+col*59,y=24+row*43,o=i?OUTFITS[i-1]:null,id=o?o.id:null,own=!id||G.outfits.includes(id),sel=i===wardSel,on=id?wearing(id):(!G.wear&&!G.acc);
    if(sel){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.fillRect(x-2,y-2,57,41);}
    box(x,y,53,37,on?'#3a3010':'#1d1430',on?'#ffd83a':'#4a3a66');
    if(own){drawPip(stage(),0,0,false,x+14,y+24,1,id);wrap(o?o.name:'NONE',5,26).slice(0,3).forEach((l,j)=>txt(l,x+28,y+5+j*8,5,on?'#ffd83a':'#fff8ec'));}
    else{txt('?',x+14,y+10,10,'#4a3a66',{align:'center'});txt('???',x+28,y+10,5,'#6a5a90');}
  }
  const o=wardSel?OUTFITS[wardSel-1]:null,own=!o||G.outfits.includes(o.id);
  box(12,160,W-24,54,'#1d1430','#6a5a90');
  txt(own?(o?o.name:'NO OUTFIT'):'???',20,166,7,'#ffd83a');
  const desc=!o?'Just plain, fluffy Pip.':own?o.desc:(o.how||"Sold at Maggie's Boutique on Main Street in the city ("+o.price+" seeds).");
  wrap(desc,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,177+i*8,5,'#d8c8f8'));
  if(o)wrap('BONUS: '+o.bonus,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,195+i*8,5,own?'#94dc64':'#6a8a60'));
  txt(own?(o?(wearing(o.id)?'Wearing it!':'Z: wear'):'Z: take all off'):'Not found yet',W-20,166,5,own?'#94dc64':'#8a7ab0',{align:'right'});
}

`;
 s=s.slice(0,a)+closet+s.slice(b);fs.writeFileSync('src/systems/world.js',s);}
// ---------- state: new fields ----------
ed('src/engine/state.js',[
 ["      granny:0,bucky:0,doe:0,mo:0,elda:0,pidge:0,remy:0,pinch:0,sandy:0},","      granny:0,bucky:0,doe:0,mo:0,elda:0,pidge:0,remy:0,pinch:0,sandy:0,rocco:0,cleo:0,cookoff:0,vane:0,babysit:0,portrait:0},"],
 ["horseshoe:0,puff:0,ring:0,stump:0}","horseshoe:0,puff:0,ring:0,stump:0,bhat:0,bwhisk:0,bbell:0,pepper:0,salt:0,mushroom:0}"],
 ["best:{egg:0,bonk:0,ffly:0},","best:{egg:0,bonk:0,ffly:0,race:0},sacks:{speedy:0,giant:0,moon:0},decor:{},buff:null,jobs:{day:0,list:[]},hold:{seashell:0,plume:0,fossil:0,petal:0},museum:{seashell:0,plume:0,fossil:0,petal:0},"],
 ["snackEaten:G.snackEaten,","snackEaten:G.snackEaten,sacks:G.sacks,decor:G.decor,buff:G.buff,jobs:G.jobs,hold:G.hold,museum:G.museum,"],
 ["migrateSeeds(s);migrateGrowth(s);","G.sacks=Object.assign(G.sacks,s.sacks||{});G.decor=s.decor||{};G.buff=s.buff||null;G.jobs=s.jobs||{day:0,list:[]};G.hold=Object.assign(G.hold,s.hold||{});G.museum=Object.assign(G.museum,s.museum||{});\n  migrateSeeds(s);migrateGrowth(s);"],
 ["  makeP2Ents();\n","  makeP2Ents();\n  makeCityEnts();\n"],
 ["    addEnt({type:'npc',id:c.id,name:c.name,spr:c.spr,...at(c.c,c.r),w:c.w||14,voice:c.voice,solid:true,phase:(Math.random()*60)|0,flip:false,deco:c.deco});","    addEnt({type:'npc',id:c.id,name:c.name,spr:c.spr,...at(c.c,c.r),w:c.w||14,voice:c.voice,solid:true,phase:(Math.random()*60)|0,flip:false,deco:c.deco,\n      sched:c.night?{day:[c.c,c.r],night:c.night}:null,at:'day'});"],
 ["  addEnt({type:'bowl',x:184,y:28*16+12});addEnt({type:'bowl',x:44*16+8,y:52*16+12});\n","  addEnt({type:'bowl',x:184,y:28*16+12});addEnt({type:'bowl',x:44*16+8,y:52*16+12});\n"],
 ["function speed(){","function speed0(){"]]);
ed('src/engine/state.js',[
 ["function maxHearts(){return 3+","function maxHearts(){return (typeof buffActive==='function'&&buffActive('tart')?1:0)+3+"],
 ["(G.rank>=7?1:0);}","(G.rank>=7?1:0);}\nfunction speed(){return speed0()*(buffActive('muffin')?1.1:1)*(wearing('goggles')&&(P.flying||overChasm())?1.15:1);}"]]);
// ---------- characters ----------
{let s=rd('src/content/characters.js');
 s=s.replace(/  \{id:'maggie',name:'MAGGIE',spr:'magpie',c:28,r:7[^\n]*\n/,'');
 s=s.replace(/  \{id:'maggie2'[^\n]*\n/,'');
 s=s.replace("{id:'pidge',name:'POSTMASTER PIDGE',spr:'pigeon',c:35,r:65,voice:800,w:10}","{id:'pidge',name:'POSTMASTER PIDGE',spr:'pigeon',c:87,r:52,voice:800,w:10,night:[88,78]}");
 s=s.replace("c:43,r:68,voice:420,w:12}","c:43,r:68,voice:420,w:12,night:[104,53]}");
 s=s.replace("c:40,r:77,voice:1100,w:10}","c:40,r:77,voice:1100,w:10,night:[117,52]}");
 s=s.replace("c:35,r:78,voice:520,w:12}","c:35,r:78,voice:520,w:12,night:[120,65]}");
 s=s.replace("];\n",`  // ---- the city: shopkeepers and neighbours (inside their buildings) ----
  {id:'maggie',name:'MAGGIE',spr:'magpie',c:135,r:52,voice:1400,w:12},
  {id:'grumble',name:'FARMER GRUMBLE',spr:'goat',c:149,r:52,voice:180,w:12},
  {id:'bramble',name:'BAKER BRAMBLE',spr:'badger',c:87,r:64,voice:260,w:12},
  {id:'fizz',name:'FIZZ',spr:'ferret',c:101,r:64,voice:1250,w:12},
  {id:'olive',name:'LIBRARIAN OLIVE',spr:'owlGlasses',c:103,r:78,voice:400,w:12},
  {id:'sheldon',name:'CURATOR SHELDON',spr:'curator',c:120,r:78,voice:210,w:16},
  {id:'pablo',name:'PABLO PEACOCK',spr:'peacock',c:137,r:66,voice:700,w:12},
  {id:'waddles',name:'MRS. WADDLES',spr:'duck',c:152,r:65,voice:780,w:14},
  {id:'nibbles2',name:'NIBBLES',spr:'chef',c:123,r:53,voice:1100,w:10},
];
`);
 fs.writeFileSync('src/content/characters.js',s);}
// ---------- order ----------
{let o=JSON.parse(rd('src/order.json'));
 for(const f of ['content/quests_city.js','content/shops.js'])if(!o.includes(f))o.splice(o.indexOf('content/characters.js'),0,f);
 for(const f of ['systems/shops.js','systems/city.js','systems/city2.js'])if(!o.includes(f))o.splice(o.indexOf('systems/festival.js')+1,0,f);
 fs.writeFileSync('src/order.json',JSON.stringify(o,null,1));}
console.log('ok');
