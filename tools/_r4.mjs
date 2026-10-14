import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/systems/world.js',[["  if(m.npc==='fizz'){state='catalog';SH={id:'toy',sel:0,top:0,msg:null};}\n",""]]);
ed('src/regions/cityin.js',[["['p',13,2,'1'],['p',2,3,'P'],['r',5,10,10,10,'o']]","['p',13,2,'1'],['p',2,3,'P']]"]]);
ed('src/systems/city.js',[["const DECOR_POS={flowers:[[34,50],[45,50]],lights:[[36,49],[40,49],[44,49]],lamp:[[40,55]]};","const DECOR_POS={flowers:[[34,52],[45,52]],lights:[[36,50],[43,50],[45,50]],lamp:[[40,57]],painting:[[40,49]]};"]]);
ed('src/systems/dialogue.js',[["function enteredBuilding(b){if(!G.flags.visited)G.flags.visited={};if(!G.flags.visited[b.id]){G.flags.visited[b.id]=1;}}","function enteredBuilding(b){if(!G.flags.visited)G.flags.visited={};if(!G.flags.visited[b.id]){G.flags.visited[b.id]=1;}if(b.id==='artist')G.flags.posed=false;}"]]);
// ---- city entities (appended to city2.js) ----
let c=fs.readFileSync('src/systems/city2.js','utf8');
c+=`
/* ---- spawn everything the city adds to the world ---- */
function makeCityEnts(){
  for(const f of FINDS){if(G.collected.has(f.id))continue;
    if(f.kind==='fossilmound')addEnt({type:'fmound',id:f.id,x:f.c*16+8,y:f.r*16+11});else spawnItem(f.id,f.kind,f.c*16+8,f.r*16+12);}
  for(const b of BORROWED)if(!G.collected.has(b.id)&&!G.items[b.item]&&!(G.flags.ret&&G.flags.ret[b.flag]))spawnItem(b.id,b.kind,b.c*16+8,b.r*16+12);
  for(const i of INGREDIENTS)if(!G.collected.has(i.id))spawnItem(i.id,i.kind,i.c*16+8,i.r*16+12);
  const to=roomOrigin('toy');[[4,8],[7,8],[10,8],[5,10],[8,10],[11,10]].forEach(([c,r],i)=>addEnt({type:'hole',id:'ahole'+i,x:to.x+c*16+8,y:to.y+r*16+12,up:0,max:1,arcade:true}));
  const mo=roomOrigin('museum');EXHIBITS.forEach((x,i)=>addEnt({type:'exhibit',ex:x.id,x:mo.x+[3,6,9,12][i]*16+8,y:mo.y+4*16+13}));
  const lo=roomOrigin('library');addEnt({type:'nook',x:lo.x+4*16+8,y:lo.y+9*16+12});
  const ao=roomOrigin('artist');addEnt({type:'easel',x:ao.x+7*16+8,y:ao.y+6*16+14,solid:true,w:14});
  const o=raceOrigin();addEnt({type:'vane',x:(o.c+16+14)*16+8,y:(o.r+4)*16+12,solid:true,w:10});
  const fo=roomOrigin('ducks'),b=G.flags.baby,on=!!(b&&b.on&&!b.fail&&!b.done);
  [[6,7],[7,8],[9,7],[10,8]].forEach(([c,r],i)=>{const hx=fo.x+c*16+8,hy=fo.y+r*16+12;
    addEnt({type:'cduck',i,hx,hy,x:on?P.x:hx,y:on?P.y:hy,mode:on?'follow':'home',lost:0,flip:false,ph:i*11});});
  placeDecor();
  updateSchedules(true);
}
`;
fs.writeFileSync('src/systems/city2.js',c);
// ---- talk handlers ----
let d=fs.readFileSync('src/content/dialogue.js','utf8');
d=d.replace("ask(\"Care to try something on? Every chick deserves to look FABULOUS.\",['Shop','Bye!'],i=>{if(i===0)openShop();});","ask(\"Care to try something on? Every chick deserves to look FABULOUS.\",['Shop','Bye!'],i=>{if(i===0)openCatalog('boutique');});");
d=d.replace("Welcome to Maggie's Boutique, darling!","Welcome to my NEW boutique on Main Street, darling!");
d=d.replace("TALK.maggie2=TALK.maggie;\n","");
d+=`
// ---- the city ----
Object.assign(TALK,{
  grumble:(e,{it,ask})=>{ask("Hmph. Morning, sprout. Seeds, sprouts and plots. What'll it be?",['Shop','Bye'],i=>{if(i===0)openCatalog('seed');});},
  bramble:(e,{it,ask})=>{ask("Fresh from the oven, dearie! Try a warm treat. It's good for the whole day!",['Shop','Bye'],i=>{if(i===0)openCatalog('bakery');});},
  fizz:(e,{it,ask})=>{ask("Welcome to the Toy Shop and Arcade! Games, prizes and a secret rooftop race!",['Play','Bye'],i=>{if(i===0)openCatalog('toy');});},
  olive:(e,{it,ask})=>{if(!G.flags.libraryHi){G.flags.libraryHi=1;it("Hoo! Welcome to the library. I'm Olive, cousin of Hootie.");it("Take any guide you like. They're free! And the rug over there is a lovely reading nook.");}
    ask("What would you like to read today?",['Books','Bye'],i=>{if(i===0)openCatalog('library');});},
  sheldon:(e,{it,ask})=>{if(!G.flags.museumHi){G.flags.museumHi=1;it("Welcome to the Museum! I'm Sheldon. My sister is Granny Shell, you know. We are both very slow and very wise.");it("Bring me shells, feathers, fossils and moon petals. Every full exhibit earns a reward!");}
    ask(museumFull()?"The whole museum shines because of you, Pip!":"Have you found anything for the exhibits?",['Exhibits','Bye'],i=>{if(i===0)openCatalog('museum');});},
  pablo:(e,{it,me,ask})=>{if(G.q.portrait!==1)return false;return tryPose(e,it);},
  nibbles2:(e,{it})=>{it(G.q.cookoff===2?"Remy's winning stew! Magnifique! I visit every day just to smell it.":"Bonjour, little chick! I'm visiting my cousin Remy. The bistro smells wonderful, no?");},
  pidge:(e,{it,ask})=>{
    if(e.chatNow){e.chatNow=false;return false;}
    if(regionAt().id!=='cityin')return false;
    ask("Coo! Postmaster Pidge here. Looking for a delivery job?",['Job board','Chat'],i=>{if(i===0)openCatalog('post');else{e.chatNow=true;talkTo(e);}});}
});
`;
fs.writeFileSync('src/content/dialogue.js',d);
// ---- farm: Maggie's sign ----
ed('src/regions/farm.js',[["  'T.,....dd...,..T',\n","  'T.,....dd..s..,T'.replace('s','s'),\n"]]);
console.log('r4');
