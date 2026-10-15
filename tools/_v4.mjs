import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
const rd=f=>fs.readFileSync(f,'utf8');
// ---- state defaults ----
ed('src/engine/state.js',[["bhat:0,bwhisk:0,bbell:0,pepper:0,salt:0,mushroom:0}","bhat:0,bwhisk:0,bbell:0,pepper:0,salt:0,mushroom:0,pebble:0,plank:0,snowball:0}"]]);
// ---- remove double spawns of trainer items ----
ed('src/systems/village.js',[
 ["  for(const t of [['pb0',56,99],['pb1',62,106],['pb2',51,102]])if(G.train.whistle===1)spawnItem(t[0],'pebble',t[1]*16+8,t[2]*16+12);\n  for(const t of [['pl0',9,100],['pl1',13,103],['pl2',3,101]])if(G.train.master===1)spawnItem(t[0],'plank',t[1]*16+8,t[2]*16+12);\n",""]]);
// ---- seeds / plots ----
ed('src/content/shops.js',[["  plain:{name:'PLAIN SEED',grow:1,yield:3,spr:'seed'},","  plain:{name:'PLAIN SEED',grow:1,yield:3,spr:'seed'},\n  pumpkin:{name:'GIANT PUMPKIN',grow:0.4,yield:4,spr:'pumpkin',pumpkin:true,desc:'The autumn contest pumpkin.'},"]]);
ed('src/systems/city.js',[["  for(const k of ['speedy','giant','moon'])if(G.sacks[k]>0)L.push(k);","  for(const k of ['speedy','giant','moon','pumpkin'])if(G.sacks[k]>0)L.push(k);"]]);
ed('src/systems/part2.js',[
 ["  if(buffActive('bun'))r*=1.25;if(rainAmt()>0.5)r*=2;return r*kind.grow;}","  if(buffActive('bun'))r*=1.25;if(rainAmt()>0.5)r*=2;if(!e.coop&&G.vil.open)r*=seasonPlotMul();return r*kind.grow;}"],
 ["if(kd.petal){G.hold.petal++;toast('A rare MOON PETAL! Take it to the museum.','#e8a0d0');}","if(kd.petal){G.hold.petal++;toast('A rare MOON PETAL! Take it to the museum.','#e8a0d0');}\n  if(kd.pumpkin){tasteFood('pumpkin');const wt=pumpkinWeigh(s);toast('Your pumpkin weighs '+wt+' pounds!','#f37d22');if(wt>=24&&seasonNow().name==='AUTUMN')contestWin();else if(wt<24)toast('Judges want 24. Water it with Green Wings next time!','#b8a8d8');}"]]);
ed('src/content/ranks.js',[["{id:'stew',name:'WINNING STEW',color:'#e8a422'}];","{id:'stew',name:'WINNING STEW',color:'#e8a422'},{id:'pumpkin',name:'PUMPKIN',spr:'pumpkin'}];"]]);
// ---- skills: Village Tree ----
ed('src/content/skills.js',[["let growPage","let growPage"]]);
fs.appendFileSync('src/content/skills.js',`
// Village Tree: whistle and master are taught by trainers (see trainers.js)
const SKILLS3=[
  {id:'carry',name:'CARRY',cost:5,req:[],x:44,y:96,desc:'Lift heavy stone and big loads. You need it for stone at the riverside!',learn:'You can carry heavy stone!'},
  {id:'whistle',name:'WHISTLE',cost:6,req:['carry'],x:112,y:62,desc:'Whistle at the village whistle post for a helper to bring wool or wood. Taught by Dash.',learn:'Whistle for helpers at the post!'},
  {id:'green',name:'GREEN WINGS',cost:6,req:['carry'],x:112,y:130,desc:'Flap over crop rows to water them and make them grow faster!',learn:'Flap over crops to water them!'},
  {id:'master',name:'MASTER BUILDER',cost:8,req:['whistle','green'],x:196,y:96,desc:'Buildings go up twice as fast and need less wood. Taught by Foreman Barnaby.',learn:'Buildings finish twice as fast!'}];
`);
ed('src/ui/growth.js',[
 ["const TREE=()=>growPage===1?SKILLS2:SKILLS;","const TREE=()=>growPage===1?SKILLS2:growPage===3?SKILLS3:SKILLS;\nfunction growPages(){return [0,...(G.part2?[1]:[]),...(G.vil.open?[3]:[]),2];}"],
 ["{const pg=G.part2?[0,1,2]:[0,2];growPage=","{const pg=growPages();growPage="]]);
ed('src/ui/growth.js',[["  if(pressed.b){const pg=G.part2?[0,1,2]:[0,2];growPage=pg[","  if(pressed.b){const pg=growPages();growPage=pg["]]);
ed('src/ui/render.js',[
 ["  box(4,4,W-8,H-8,'#241838',growPage?'#a6e0ff':'#ffd83a');","  const gcol=growPage===1?'#a6e0ff':growPage===3?'#94dc64':'#ffd83a';\n  box(4,4,W-8,H-8,'#241838',gcol);"],
 ["  txt(growPage?'SKY TREE':'GROWTH TREE',W/2,10,9,growPage?'#a6e0ff':'#ffd83a',{align:'center',shadow:true});","  txt(growPage===1?'SKY TREE':growPage===3?'VILLAGE TREE':'GROWTH TREE',W/2,10,9,gcol,{align:'center',shadow:true});"]]);
// ---- trainers ----
{let s=rd('src/content/trainers.js');
 s=s.replace(/\n\};\s*$/,`,
  whistle:{phase:4,who:'dash',whoName:'DASH',skill:'WHISTLE',title:'Sheepdog School',avail:()=>G.vil.open&&has('carry'),item:'pebble',need:3,noun:'whistle pebbles',
    spawn:[['pb0',56,99],['pb1',62,106],['pb2',51,102]],
    lock:"Learn CARRY first. Then Dash the sheepdog, out in the meadow pasture, will teach you to WHISTLE!",
    intro:["Woof! You're the chick who started the village! I'm Dash, the sheepdog.","A good whistle can call every helper in the meadow. I'll teach you!","First, find 3 smooth WHISTLE PEBBLES in the meadow. They make the best whistle sound!"],
    remind:()=>Math.min(3,G.items.pebble)+"/3 whistle pebbles. Look around the pasture and the meadow paths!",
    done:["Perfect pebbles! Now put your beak like THIS... and blow!","Tweeeet! There! Learn WHISTLE in the Village Tree. Press E!"],
    hint:()=>"Find 3 smooth pebbles in the meadow for Dash."},
  master:{phase:4,who:'barnaby',whoName:'BARNABY',skill:'MASTER BUILDER',title:'Master Class',avail:()=>builtList().length>=2,item:'plank',need:3,noun:'fine planks',
    spawn:[['pl0',9,100],['pl1',13,103],['pl2',3,101]],
    lock:"Build 2 buildings, and Foreman Barnaby will teach you to be a MASTER BUILDER!",
    intro:["Ho ho! Two buildings already? Bucky's cousin is impressed!","A master builder works fast and wastes no wood. I'll show you the tricks!","Bring me 3 FINE PLANKS from the riverside. Straight and strong. Then class begins!"],
    remind:()=>Math.min(3,G.items.plank)+"/3 fine planks. They're scattered around the riverside!",
    done:["Beautiful planks! Hammer like this, measure twice, cut once!","Now learn MASTER BUILDER in the Village Tree. Press E!"],
    hint:()=>"Find 3 fine planks at the riverside for Foreman Barnaby."}
};
`);fs.writeFileSync('src/content/trainers.js',s);}
// ---- item pickups ----
ed('src/systems/actions.js',[["    case 'hat':case 'whisk':","    case 'pebble':case 'plank':case 'snowball':G.items[e.kind]++;SFX.pick();float(e.x,e.y-16,({pebble:'PEBBLE',plank:'PLANK',snowball:'SNOWBALL'})[e.kind]+' x'+G.items[e.kind],'#fff8ec');break;\n    case 'hat':case 'whisk':"],
 ["hazardPeck(e,f,pr)||cityPeck(e,f,pr))return;","hazardPeck(e,f,pr)||cityPeck(e,f,pr)||villagePeck(e,f,pr))return;"],
 ["  updateSunbeam();updateBabysit();updateRace();\n","  updateSunbeam();updateBabysit();updateRace();updateVillage();\n"],
 ["  for(const e of ents){if(e.type==='nook'&&onCur(e)","  if(villageAction(f))return;\n  for(const e of ents){if(e.type==='nook'&&onCur(e)"],
 ["  hazardFlap(dx,dy);\n","  hazardFlap(dx,dy);greenWings(dx,dy);\n"]]);
// ---- shops: build, contest, board ----
ed('src/content/shops.js',[["const SHOPS={","const SHOPS={\n  build:{title:'BUILD HERE',owner:'beaver',color:'#c49a5c',leave:'CANCEL',bye:'Take your time. Good builders plan!',\n    items:()=>BUILD_ORDER.map(k=>{const t=BUILDING_TYPES[k],c=costOf(k),pad=VB&&VB.pad;\n      return {name:t.name,price:c.seeds,icon:'b_'+k,desc:t.desc+' NEEDS: '+costText(Object.assign({},c,{seeds:0})).replace(/^, /,'')+'.',bonus:'Village happiness +'+t.happy+(has('master')?'. Master Builder: half the time!':''),\n        off:t.only==='river'&&!(pad&&pad.river),offMsg:'A mill must be built beside the river!',act:()=>tryBuild(k)};})},\n  contest:{title:'WINDMILL FESTIVAL',owner:'beaver',color:'#ffd83a',leave:'LEAVE',bye:'See you at the next festival!',\n    items:()=>{const i=contestInfo(),s=seasonNow();return [\n      {name:i.name,tag:contestDone()?'WON':'ENTER',on:contestDone(),icon:i.icon,desc:i.desc,off:contestDone(),offMsg:'You already won this season! Come back next season.',act:()=>{startContest();}},\n      {name:'SEASON: '+s.name,tag:daysToNextSeason()+'d left',icon:'star',desc:'Seasons change every '+SEASON_DAYS+' days. Each season has its own contest.',off:true,offMsg:daysToNextSeason()+' day(s) until the next season.'},\n      {name:'WINS SO FAR',tag:''+Object.keys(G.vil.contest).length,icon:'token',desc:'Every contest you win makes the village happier.',off:true,offMsg:'Each win adds '+HAPPY_CONTEST+' happiness.'}];}},\n  board:{title:'VILLAGE BOARD',owner:'beaver',color:'#94dc64',leave:'LEAVE',bye:'Our village is growing!',\n    items:()=>[\n      {name:'HAPPINESS',tag:happiness()+'/'+FINALE_HAPPY,icon:'token',desc:'Buildings, friends moving in and contest wins make the village happy.',off:true,offMsg:happiness()>=FINALE_HAPPY?'Happy enough for the Grand Harvest! Talk to Barnaby.':'Keep building, and help friends move in!'},\n      {name:'FRIENDS HOME',tag:Object.keys(G.vil.res).length+'/'+RESIDENTS.length,icon:'mailbox',desc:'Friends write when a building they want exists.',off:true,offMsg:'Check the mailbox for letters!'},\n      {name:'MATERIALS',tag:'',icon:'m_wood',desc:matsLine(),off:true,offMsg:matsLine()},\n      {name:'BUILDINGS',tag:''+builtList().length+'/'+PADS.length,icon:'b_home',desc:'Pads in the square and by the river.',off:true,offMsg:'Gather wood, stone, wool and clay!'},\n      {name:'SEASON',tag:seasonNow().name,icon:'star',desc:'Contests at Windmill Hill each season.',off:true,offMsg:daysToNextSeason()+' day(s) until the next season.'}]},"]]);
// ---- talk ----
let d=rd('src/content/dialogue.js');
d+=`
// ---- the village ----
Object.assign(TALK,{
  barnaby:(e,{it,me,ask})=>{
    if(!G.vil.open)return false;
    if(!G.flags.village&&RESIDENTS.every(r=>G.vil.res[r.id])&&happiness()>=FINALE_HAPPY){
      it("Pip! Every friend is home and the whole village is smiling!");it("It's time for the GRAND HARVEST FESTIVAL!");
      ask('Start the festival?',['Yes!','Not yet'],i=>{if(i===0)startFestival('harvest');});return;}
    if(trainTalk(e,it))return;
    it(G.flags.village?"The village is the pride of Chicklandia, Pip! And you built it.":"I'm Foreman Barnaby. I run the building site. Pads in the square, wood and stone at the riverside. Happy building!");},
  dash:(e,{it})=>{if(!G.vil.open)return false;if(trainTalk(e,it))return;it(G.flags.village?"Woof! Everything's peaceful. Even the sheep have a schedule now.":"Woof! I herd the sheep. Pebbles make great whistles, you know!");}
});
`;
fs.writeFileSync('src/content/dialogue.js',d);
// follow-up gating
ed('src/systems/dialogue.js',[["let qid=QUEST_OF[e.id]||e.id;if(FOLLOWUP[e.id]&&G.q[e.id]===2&&G.q[FOLLOWUP[e.id]]!==2)qid=FOLLOWUP[e.id];","let qid=QUEST_OF[e.id]||e.id;if(FOLLOWUP[e.id]&&G.q[e.id]===2&&G.q[FOLLOWUP[e.id]]!==2&&(!FOLLOW_GATE[e.id]||FOLLOW_GATE[e.id]()))qid=FOLLOWUP[e.id];"]]);
// contests: eggs and kites
ed('src/systems/world.js',[
 ["const e=EG;EG=null;state='play';const penny=ents.find(n=>n.id===e.host),L=[];","const e=EG;EG=null;state='play';const penny=ents.find(n=>n.id===e.host),L=[];if(e.contest&&e.win)contestWin();"],
 ["  const win=m.score>=m.goal,key=m.type,","  const win=m.score>=m.goal;if(win&&m.contest)contestWin();const key=m.type,"],
 ["text:m.npc==='fizz'?\"You won with \"","text:(m.npc==='fizz'||m.contest)?\"You won with \""]]);
// ---- part2 hint: village ----
ed('src/systems/part2.js',[["  for(const id of ORDER3){if(G.q[id]===1)return QUESTS[id].hint();}\n","  for(const id of ORDER3){if(G.q[id]===1)return QUESTS[id].hint();}\n  {const vh=villageHint();if(vh)return vh;}\n"]]);
ed('src/ui/render.js',[
 ["    case 'worm':{","    case 'vpad':case 'vnode':case 'vsheep':case 'vmail':case 'vboard':case 'vwhistle':case 'vcontest':case 'windmill':case 'scarecrow':case 'vsculpt':drawVillageEnt(e,sx,sy);break;\n    case 'worm':{"],
 ["  drawSunbeam(cx,cy);","  drawSunbeam(cx,cy);"],
 ["    const a=areaOf();txt(AREA_LABEL[a],220,7,5,'#94dc64',{align:'right'});txt(a==='coop'?'HOME':'F: FLY',220,18,5,'#ffd83a',{align:'right'});","    const a=areaOf();txt(AREA_LABEL[a],220,7,5,'#94dc64',{align:'right'});txt(a==='coop'?'HOME':a==='village'&&G.vil.open?seasonNow().name:'F: FLY',220,18,5,'#ffd83a',{align:'right'});"],
 ["function questPages(){const p=[0];if(G.part2)p.push(1,3);","function questPages(){const p=[0];if(G.part2)p.push(1,3);if(G.vil.open)p.push(5);"],
 ["  if(questPage===3){drawCityPage();return;}","  if(questPage===3){drawCityPage();return;}\n  if(questPage===5){drawVillagePage();return;}"]]);
// season fx after tiles/entities: draw in drawWorld just before the sunbeam
ed('src/ui/render.js',[["  for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x-camX),Math.round(p.y-camY+HUD),2,2);}\n  camX=ocx;camY=ocy;","  for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x-camX),Math.round(p.y-camY+HUD),2,2);}\n  camX=ocx;camY=ocy;drawSeasonFX(cx,cy);"]]);
fs.appendFileSync('src/ui/render.js',`
function drawVillagePage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#94dc64');
  txt('QUESTS - VILLAGE',W/2,10,9,'#94dc64',{align:'center',shadow:true});
  ORDER4.forEach((id,i)=>{const y=21+i*15,q=QUESTS[id],st=G.q[id];
    box(10,y,W-20,13,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    if(st===0){txt('???',16,y+4,5,'#6a5a90');txt(id==='vfound'?'see Bucky':id==='vharvest'?'later':'build for them',W-16,y+4,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+4,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+4,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
  const s=seasonNow();
  txt('HAPPY '+happiness()+'/'+FINALE_HAPPY+'   '+s.name+' ('+daysToNextSeason()+'d)',W/2,H-30,5,'#ffd83a',{align:'center'});
  txt(matsLine(),W/2,H-21,5,'#c49a5c',{align:'center'});
  txt('X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
`);
console.log('v4');
