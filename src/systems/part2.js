'use strict';
/* =====================================================================
   PART 2: BEYOND THE FARM
   ===================================================================== */
Object.assign(NAMES,{granny:'Granny Shell',bucky:'Bucky',doe:'Doe',mo:'Mo',elda:'Elda',pidge:'Postmaster Pidge',remy:'Chef Remy',pinch:'Capn Pinch',sandy:'Lifeguard Sandy'});
const ORDER2=['granny','bucky','pidge','sandy','remy','doe','pinch','elda','mo'];
const MAIL_TO={rocco:'Rocco by the city fountain',cleo:'Cleo the cat in the market',granny:'Granny Shell in the forest'};
Object.assign(QUESTS,{
  granny:{title:'Acorn Hunt',check:()=>G.items.acorn>=3,prog:()=>Math.min(3,G.items.acorn)+'/3 acorns',reward:2,
    intro:["Well, well... a FLYING chick! Haven't seen one of those in a hundred years. And I'm 112!","I'm Granny Shell. I grow the finest sunflowers in the forest.","My old legs are too slow for acorn hunting, though. Peck the big oak trees and bring me 3 acorns, dearie?"],
    remind:()=>Math.min(3,G.items.acorn)+"/3 acorns, dearie. Give the big oak trees a good peck!",
    done:["Ooh, lovely plump acorns! Now let me teach you something special...","This is how you GROW seeds! Plant a seed in soft soil, wait a while, and it grows into a sunflower full of MORE seeds.","Use my garden plots right here whenever you like. Peck a plot to plant or harvest. Here's 2 seeds to start!"],
    onDone:()=>{G.items.acorn-=3;G.thumb=true;toast('You learned GARDENING!','#94dc64');},
    after:()=>["Seeds grow twice as fast in the rain. Nature's watering can!",hint2()],
    hint:()=>"Granny Shell in the forest wants 3 acorns. Peck the big oak trees!"},
  bucky:{title:'Dam Builder',check:()=>G.items.stick>=4,prog:()=>Math.min(4,G.items.stick)+'/4 sticks',reward:3,
    intro:["Hey hey! Bucky the beaver here, master builder!","My dam broke in the big storm, and now the river's all wild! I need 4 sturdy STICKS to fix it.","I've seen sticks all over: the forest, the mountain trail, even the beach!"],
    remind:()=>Math.min(4,G.items.stick)+"/4 sticks. They wash up all over: the forest, the mountain trail, and the beach!",
    done:["Perfect sticks! *chomp chomp* *slap slap* ...Ta-da! Good as new!","And look, the dam makes a bridge across the river now! Take 3 seeds!"],
    onDone:()=>{G.items.stick-=4;G.flags.dam=true;[[23,68],[24,68],[23,69],[24,69]].forEach(([c,r])=>setTile(c,r,'3'));shake=6;SFX.brk();},
    after:()=>[G.coop?"How's the coop treating you? Bucky builds 'em to last!":"Have you seen the COOP SITE sign at the forest edge? Read it, and I'll build you a home for free!"],
    hint:()=>"Bucky the beaver needs 4 sticks to fix his dam."},
  doe:{title:'Little Lost Fawn',check:()=>!!G.flags.fawn,prog:()=>G.flags.fawn?'Clover is home!':'find Clover',reward:4,
    intro:["Oh! Oh dear! Have you seen my fawn, Clover?","She wandered across the river while I napped, and now she can't get back!","If only someone could SWIM across... or if Bucky's dam were fixed, we could walk over!"],
    remind:()=>has('swim')||G.flags.dam?"Clover is across the river! Go get her, and she'll follow you home!":"Clover is across the river. You'd need to SWIM, or help Bucky fix his dam...",
    done:["Clover! My little Clover! *nuzzle nuzzle*","Thank you, brave chick. Please take 4 seeds."],
    after:()=>["Clover wants to be a flying deer now. I blame you. *giggle*"],
    hint:()=>"Doe's fawn Clover is across the river in the deep woods. Swim, or fix Bucky's dam!"},
  mo:{title:'Rockslide Rescue',check:()=>!!G.flags.mo,prog:()=>G.flags.mo?'babies free!':'free the babies',reward:4,
    intro:["Eek! Eek! Help!","A rockslide trapped my two babies behind those boulders!","Those rocks are HUGE. Only a SUPER PECK could crack them!"],
    remind:()=>has('super')?"Smash one of those boulders with your SUPER PECK!":"Only a SUPER PECK can break those. Bucky the beaver in the forest is the strongest pecker I know!",
    done:["My babies! *squeak squeak* You're our hero!","Here, have 4 seeds from our winter stash!"],
    after:()=>["We're digging a new tunnel. Far, FAR away from the rocks!"],
    hint:()=>"Mo the marmot's babies are trapped behind boulders. Bucky the beaver can teach you SUPER PECK."},
  elda:{title:"The Eagle's Egg",check:()=>G.items.eagleEgg>0,prog:()=>G.items.eagleEgg?'egg found!':'find the egg',reward:4,
    intro:["Screeee! A young flyer! Perhaps you can help.","A gust of wind blew my egg right across the great chasm!","I can't leave my nest. Can you GLIDE across and bring it back? Gently!"],
    remind:()=>has('glide')?"Glide across the chasm and bring back my egg!":"That chasm is too wide to walk. Learn GLIDE in your Sky Tree.",
    done:["My egg! Not a scratch! You have the heart of an eagle, little one.","Take 4 seeds. Fly high!"],
    onDone:()=>{G.items.eagleEgg=0;},
    after:()=>["When my chick hatches, I'll tell it all about the brave little chicken."],
    hint:()=>"Elda the eagle's egg is across the chasm on the snowy peak. Learn GLIDE!"},
  pidge:{title:'Special Delivery',check:()=>['rocco','cleo','granny'].every(k=>G.mail[k]===2),prog:()=>['rocco','cleo','granny'].filter(k=>G.mail[k]===2).length+'/3 delivered',reward:3,
    intro:["Coo! Coo! Postmaster Pidge here! Busiest bird in the city!","I've got 3 letters to deliver, and my wing's in a sling. Could you help a pigeon out?",
      {t:"One for Rocco by the fountain, one for Cleo the cat in the market, and one for Granny Shell in the forest!",fx:()=>{['rocco','cleo','granny'].forEach(k=>{if(!G.mail[k])G.mail[k]=1;});toast('Got 3 letters to deliver!');SFX.pick();}}],
    remind:()=>"Still to deliver: "+['rocco','cleo','granny'].filter(k=>G.mail[k]!==2).map(k=>MAIL_TO[k]).join(', ')+".",
    done:["All delivered? Coo! You're faster than any pigeon I know!","Here's 3 seeds for your trouble!"],
    after:()=>["Coo! The mail must go through!"],
    hint:()=>"Postmaster Pidge's letters go to Rocco, Cleo, and Granny Shell."},
  remy:{title:'Super Soup',check:()=>G.items.acorn>=1&&G.items.fish>0&&G.items.snowberry>0,
    prog:()=>[G.items.acorn>=1?'acorn':'',G.items.fish?'fish':'',G.items.snowberry?'berry':''].filter(Boolean).join(' ')||'0/3 items',reward:5,
    intro:["Ah, bonjour! Remy, chef extraordinaire! Cousin of Nibbles, you know.","I'm making my famous Forest-Mountain-Sea Soup, but I'm missing ingredients!","I need 1 ACORN from the forest, 1 SNOWBERRY from the mountains, and 1 FISH from the tide pools!"],
    remind:()=>"Still need: "+[G.items.acorn>=1?'':'an ACORN (forest oaks)',G.items.snowberry?'':'a SNOWBERRY (mountain bush)',G.items.fish?'':'a FISH (tide pools)'].filter(Boolean).join(', ')+".",
    done:["Magnifique! *stir stir* *sniff* ...PERFECTION!","For you, my feathered friend: 5 seeds!"],
    onDone:()=>{G.items.acorn--;G.items.fish=0;G.items.snowberry=0;},
    after:()=>["Come back any time. The soup is always on!"],
    hint:()=>"Chef Remy in the city needs an acorn, a snowberry, and a fish."},
  pinch:{title:'Shell Seeker',check:()=>G.items.shell>=5,prog:()=>Math.min(5,G.items.shell)+'/5 shells',reward:4,
    intro:["Arr! Cap'n Pinch at yer service! *click click*","A rogue wave washed away me prized seashell collection! Five shells, scattered everywhere!","Some be on the sand, some by the tide pools... and some out in the DEEP water. Can ye SWIM, matey?"],
    remind:()=>Math.min(5,G.items.shell)+"/5 shells. "+(has('swim')?"Check the sand, the tide pools, and out in the deep water!":"Some be out in deep water. Lifeguard Sandy can teach ye to SWIM!"),
    done:["Me shells! All five! Yer a true sea chick!","Take 4 seeds, matey!"],
    after:()=>["Arr, the sea be callin'. Come sail with me some day!"],
    hint:()=>"Cap'n Pinch at the beach lost 5 shells. Some are in deep water!"},
  sandy:{title:'Turtle Rescue',check:()=>G.turtles.length>=3,prog:()=>G.turtles.length+'/3 in the sea',reward:3,
    intro:["Squawk! Lifeguard Sandy here! We've got a situation!","Three baby sea turtles just hatched, but they're wandering the wrong way!","Lead them to the water! They'll follow you if you walk right up to them."],
    remind:()=>G.turtles.length+"/3 turtles in the sea. Walk up to them, then lead them to the waves!",
    done:["Squawk! All three babies made it to the sea! Beautiful!","Here's 3 seeds, junior lifeguard!"],
    after:()=>["Squawk! Remember: no running by the tide pools!"],
    hint:()=>"Lifeguard Sandy at the beach needs help leading baby turtles to the sea."}
});
const INTRO2={granny:"Granny Shell the tortoise lives by her garden in the forest.",bucky:"Bucky the beaver is building something in the deep woods.",
  pidge:"Postmaster Pidge is the busiest bird in the city.",sandy:"Lifeguard Sandy watches over the beach.",remy:"Chef Remy cooks in the city market.",
  doe:"A worried deer is pacing in the deep woods.",pinch:"Cap'n Pinch the crab is on the sandy shore.",elda:"An eagle lives up on the snowy peak.",mo:"A marmot is squeaking for help on the mountain trail."};
function allP2Done(){return ORDER2.every(id=>G.q[id]===2);}
function hint2(){
  if(!G.coop)return "There's a COOP SITE sign in the forest. You can build your very own home there!";
  for(const id of ORDER2){if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[id]+" the good news!";}
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===2&&G.train[k]===1)return t.hint();}
  for(const id of ORDER2){if(G.q[id]===0)return INTRO2[id];}
  for(const id of ORDER2){if(G.q[id]===1)return QUESTS[id].hint();}
  if(G.coop&&G.coop.lv<4)return "Upgrade your coop! Read the sign next to it.";
  return "Your Dream Coop is finished! What a journey, little one.";
}
function areaOf(cs=CS){const k=cs.x+','+cs.y;if(cs.y<2)return'farm';if(k==='0,4'||k==='1,4')return'mountains';if(k==='0,5'||k==='1,5')return'forest';
  if(k==='2,5'||k==='2,6')return'city';if(k==='0,6'||k==='1,6')return'beach';if(k==='2,4')return'coop';return null;}
const AREA_LABEL={farm:'FARM',forest:'FOREST',mountains:'MOUNTAINS',city:'CITY',beach:'BEACH',coop:'MY COOP'};
function noteArea(){const a=areaOf();if(a&&a!=='coop'&&!G.areas.includes(a)){G.areas.push(a);if(G.part2)toast('Discovered the '+AREA_LABEL[a]+'!','#94dc64');}}

/* ---- skill trainers: some skills need a special lesson before you can buy them ---- */
const TRAIN={
  hop:{phase:1,who:'clyde',whoName:'CLYDE',skill:'HOP',title:'Hurdle Training',avail:()=>G.q.clyde===2,item:'horseshoe',need:3,noun:'horseshoes',
    spawn:[['hs0',9,6],['hs1',28,15],['hs2',46,5]],
    lock:"Help CLYDE the horse in the barn, and he'll teach you to HOP!",
    intro:["Neeeigh! Say, did I ever tell you? I was the county's champion HURDLE jumper!","I could teach you to HOP over hay bales like a pro. But first, a warm-up!","I lost my 3 lucky HORSESHOES around the farm. Find them, and I'll show you how to hop!"],
    remind:()=>Math.min(3,G.items.horseshoe)+"/3 lucky horseshoes. One's by the coop, one's in the field, and one's in the orchard!",
    done:["My lucky horseshoes! Now watch closely... bend your knees... and SPRING!","There! Now you can learn HOP in your Growth Tree. Press E. Go get 'em, champ!"],
    hint:()=>"Clyde's lucky horseshoes are by the coop, in the field, and in the orchard."},
  flap:{phase:1,who:'rooster',whoName:'SIR CLUCK',skill:'WING FLAP',title:'Wind Training',avail:()=>G.q.rooster>=1,item:'puff',need:5,noun:'dandelion puffs',puffs:true,
    lock:"Talk to SIR CLUCKINGTON by the Big Fence. He'll train your wings!",
    intro:["Hold on there, kid. To blow those leaves away, you'll need a mighty WING FLAP.","A wing flap takes strong, quick wings! Training time!","Dandelion puffs are blowing all over the field. Catch 5 of 'em before the wind carries 'em off!"],
    remind:()=>Math.min(5,G.items.puff)+"/5 dandelion puffs. Chase 'em down in the field!",
    done:["Ha! Quick as the wind! Now flap like THIS... WHOOSH!","You're ready. Learn WING FLAP in your Growth Tree, then go find my feathers!"],
    hint:()=>"Catch the dandelion puffs blowing around the field for Sir Cluckington."},
  swim:{phase:2,who:'sandy',whoName:'SANDY',skill:'SWIM',title:'Lifeguard Training',avail:()=>G.q.sandy===2,item:'ring',need:3,noun:'life rings',
    spawn:[['ring0',14,77],['ring1',27,75],['ring2',30,79]],
    lock:"Help LIFEGUARD SANDY at the beach, and she'll teach you to SWIM!",
    intro:["Squawk! You saved those turtles. But can you SWIM, junior lifeguard?","Every lifeguard needs swim training! First, find my 3 lost LIFE RINGS.","They floated off somewhere around the beach and the tide pools!"],
    remind:()=>Math.min(3,G.items.ring)+"/3 life rings. Check the beach and the tide pools!",
    done:["My life rings! Okay: kick your feet, paddle your wings, and keep your beak up!","Now you can learn SWIM in your Sky Tree. Press E. Squawk!"],
    hint:()=>"Lifeguard Sandy's life rings are on the beach and in the tide pools."},
  super:{phase:2,who:'bucky',whoName:'BUCKY',skill:'SUPER PECK',title:'Stump Smashing',avail:()=>G.q.bucky===2,item:'stump',need:3,noun:'stumps',
    stumps:[['stump0',3,66],['stump1',29,63],['stump2',17,64]],
    lock:"Help BUCKY the beaver in the deep woods, and he'll teach you SUPER PECK!",
    intro:["Hey hey! Wanna know the secret to my super-strong teeth? PRACTICE!","There are 3 old tree stumps in the forest that need clearing out. Peck 'em to splinters!","Do that, and I'll teach you the SUPER PECK!"],
    remind:()=>Math.min(3,G.items.stump)+"/3 stumps smashed. They're around the forest edge and the deep woods!",
    done:["Look at those splinters! You've got the power, kid!","Now you can learn SUPER PECK in your Sky Tree. Press E!"],
    hint:()=>"Smash the 3 old tree stumps in the forest for Bucky."}
};
function trainCount(k){return G.items[TRAIN[k].item]||0;}
function trainMsg(k){const t=TRAIN[k],st=G.train[k]||0;
  if(st===1)return t.whoName+"'s training: "+Math.min(t.need,trainCount(k))+'/'+t.need+' '+t.noun+(trainCount(k)>=t.need?' - go tell them!':'');
  return t.avail()?'Talk to '+t.whoName+' to start training!':t.lock;}
function spawnTrain(k){
  const t=TRAIN[k];
  if(t.spawn)t.spawn.forEach(([id,c,r])=>spawnItem(id,t.item,c*16+8,r*16+12));
  if(t.stumps)t.stumps.forEach(([id,c,r])=>{if(!G.collected.has(id)&&!ents.some(e=>e.id===id))addEnt({type:'stump',id,x:c*16+8,y:r*16+12,solid:true,w:14});});
  if(t.puffs){const have=ents.filter(e=>e.type==='puff').length;
    for(let i=have;i<t.need-trainCount(k);i++)addEnt({type:'puff',x:290+Math.random()*190,y:220+Math.random()*140,vx:(Math.random()<0.5?-1:1)*(0.35+Math.random()*0.3),p:Math.random()*6});}
}
function trainTalk(e,it){
  for(const k in TRAIN){const t=TRAIN[k];if(t.who!==e.id)continue;
    const st=G.train[k]||0;if(st===2||has(k)||!t.avail())return false;
    if(st===0){t.intro.forEach((l,i)=>it(l,i===t.intro.length-1?()=>{G.train[k]=1;spawnTrain(k);toast(t.title+' started!','#ff9cd0');SFX.magic();save();}:null));return true;}
    if(trainCount(k)>=t.need){t.done.forEach((l,i)=>it(l,i===t.done.length-1?()=>{G.train[k]=2;G.items[t.item]=0;SFX.lvl();
      toast('You can now learn '+t.skill+'! Press E','#ff9cd0');save();}:null));return true;}
    it(t.remind());return true;}
  return false;
}
function updPuff(e){
  e.p+=0.03;e.x+=e.vx+Math.sin(e.p)*0.3;e.y+=Math.cos(e.p*0.7)*0.3;
  if(e.x<280||e.x>488){e.vx*=-1;e.x=clamp(e.x,280,488);}e.y=clamp(e.y,212,372);
  if(Math.abs(e.x-P.x)<11&&Math.abs(e.y-P.y)<13){e.dead=true;G.items.puff++;SFX.chirp();puff(e.x,e.y-8,8,['#fff8ec','#e8f0f8']);
    float(e.x,e.y-16,'PUFF '+Math.min(5,G.items.puff)+'/5','#fff8ec');if(G.items.puff>=5)toast('Got 5 puffs! Tell Sir Cluckington.','#ff9cd0');save();}
}

/* ---- talking (part 2 extras) ---- */
function talkP2(e,it){
  if(G.mail&&G.mail[e.id]===1){
    it(e.id==='granny'?"A letter? For me? Oh my, it's from my old friend Pidge!":e.id==='rocco'?"A letter? Is it a reward? ...Oh. It's my library fine. Thanks, I guess.":"Mail? For moi? *purr* It's from my secret admirer!",
      ()=>{G.mail[e.id]=2;const n=['rocco','cleo','granny'].filter(k=>G.mail[k]===2).length;toast('Letter delivered! ('+n+'/3)');SFX.pick();save();});
    return true;}
  if(e.id==='rocco'){it(["Psst. Wanna buy a slightly used banana peel? No? Suit yourself.","I'm not stealing, I'm BORROWING. Forever.","Nice wings, kid. Very shiny."][(Math.random()*3)|0]);return true;}
  if(e.id==='cleo'){it(["Welcome to the city, country chick. Try the fish tacos.","Remy's soup is the best in town. Don't tell him I said so.","I nap in a different sunbeam every hour. It's a lot of work."][(Math.random()*3)|0]);return true;}
  if(e.deco2){it(G.flags.mo?"Eek! Thank you, thank you!":"Eek! We're stuck! Help!");return true;}
  return false;
}
/* ---- coop sites ---- */
function siteFor(c,r){for(const k in SITES){const s=SITES[k];if(s.sign[0]===c&&s.sign[1]===r)return k;}return null;}
// upgrades unlock as you help animals out here (need = Part 2 quests done), and cost a few seeds
const UPGRADES=[null,null,{cost:4,need:2,text:'A bigger coop, 2 more garden plots, and MAMA HEN moves in!'},
  {cost:6,need:5,text:'A family wing, 2 more plots, faster growing, and PENNY & the TRIPLETS move in!'},
  {cost:8,need:9,text:'The DREAM COOP! A golden roof, 2 more plots, super-fast growing, and a big party!'}];
function p2Done(){return ORDER2.filter(id=>G.q[id]===2).length;}
function siteSign(id,c,r){
  const who={x:c*16+8,y:r*16,name:'COOP SITE'},L=[];
  if(G.coop){const lv=G.coop.lv;
    if(lv>=4)L.push({who,text:"PIP'S DREAM COOP - Level 4. Fully upgraded! Plant seeds in all 8 garden plots!"});
    else{const u=UPGRADES[lv+1],d=p2Done();
      if(d<u.need)L.push({who,text:"PIP'S COOP - Level "+lv+". The next upgrade unlocks after you help "+u.need+" animals out here. ("+d+"/"+u.need+" so far!)"});
      else L.push({who,text:"PIP'S COOP - Level "+lv+". UPGRADE: "+u.text+" ("+upCost(u)+" seeds)",choices:['Upgrade!','Later'],cb:i=>{if(i===0)upgradeCoop();}});}}
  else L.push({who,text:"COOP SITE. Build your very own coop right here? Bucky the beaver will build it for FREE!",choices:['Build!','Not yet'],cb:i=>{if(i===0)buildCoop(id);}});
  say(L);
}
function buildCoop(id){
  G.coop={site:id,lv:1};applyCoop(true);shake=10;SFX.questDone();
  const S=SITES[id];for(let i=0;i<30;i++)puff((S.c+1.5)*16,(S.r+1)*16,1,['#ffd83a','#fff8ec','#ff6fae','#94dc64'],2.2,0.06);
  toast('Your coop is built!');save();
  say([{who:'me',text:"My very own coop! I can sleep in the nests, grow seeds in the garden, and fly here from the map!"},
    {who:'me',text:G.thumb?"The more animals I help out here, the bigger my coop can grow!":"Granny Shell knows all about gardening. I should go say hi! And the more animals I help, the bigger my coop can grow!"}]);
}
function upgradeCoop(){
  const u=UPGRADES[G.coop.lv+1];
  const cost=upCost(u);
  if(G.seeds<cost){SFX.deny();say([{who:'me',text:"I need "+(cost-G.seeds)+" more seeds for that upgrade. Better get gardening!"}]);return;}
  G.seeds-=cost;G.coop.lv++;applyCoop(false);shake=8;SFX.lvl();
  const S=SITES[G.coop.site];for(let i=0;i<40;i++)puff((S.c+1.5)*16,(S.r+1)*16,1,['#ffd83a','#fff8ec','#ff6fae','#a6e0ff'],2.4,0.05);
  const lv=G.coop.lv;toast('COOP LEVEL '+lv+'!');save();
  const msg=lv===2?"Mama Hen moved into my coop! She's inside right now!":lv===3?"Penny and the triplets moved in! The whole family is together again!":"A GOLDEN ROOF! It's my DREAM COOP! Everyone's inside for a party!";
  say([{who:'me',text:msg}]);
}
/* ---- garden plots ---- */
const GROW=5400;
function plotRate(e){let r=wearing('straw')?1.5:1;if(e.coop&&G.coop){if(G.coop.lv>=4)r=2;else if(G.coop.lv>=3)r=1.5;}if(rainAmt()>0.5)r*=2;return r;}
function updatePlots(){for(const e of ents)if(e.type==='plot'){const s=G.plots[e.id];if(s&&s.p<1)s.p=Math.min(1,s.p+plotRate(e)/GROW);}}
function usePlot(e){
  if(!G.thumb){say([{who:'me',text:"This soil looks so soft... Maybe Granny Shell knows how to grow things?"}]);return;}
  const s=G.plots[e.id];
  if(!s){if(G.seeds<1){SFX.deny();float(e.x,e.y-16,'Need a seed!','#ff8080');return;}
    G.seeds--;G.plots[e.id]={p:0};SFX.pop();puff(e.x,e.y-4,6,['#9a6234','#94dc64'],0.8,0.05);float(e.x,e.y-16,'Planted!','#94dc64');save();return;}
  if(s.p<1){float(e.x,e.y-16,'Growing... '+Math.floor(s.p*100)+'%','#94dc64');SFX.menu();return;}
  delete G.plots[e.id];addSeeds(3,2,0);G.harvests++;SFX.seed();puff(e.x,e.y-10,10,['#ffd83a','#fff8ec'],1.2,0.05);float(e.x,e.y-18,'+3 SEEDS!','#ffd83a');save();
}
/* ---- followers (fawn & baby turtles) ---- */
function followerCount(){return ents.filter(d=>(d.type==='duckling'||d.type==='follower')&&d.mode==='follow').length;}
function reindexFollowers(){let i=0;for(const d of ents)if((d.type==='duckling'||d.type==='follower')&&d.mode==='follow')d.fi=i++;}
function updFollower(e){
  if(e.mode==='swim'){e.y+=0.5;e.alpha=(e.alpha==null?1:e.alpha)-0.01;if(e.alpha<=0)e.dead=true;return;}
  if(e.mode==='follow'){
    const p=TRAIL[Math.max(0,TRAIL.length-1-(e.fi+1)*12)];
    if(p){if(Math.abs(p.x-e.x)>0.3)e.flip=p.x>e.x;e.x+=(p.x-e.x)*0.5;e.y+=(p.y-e.y)*0.5;}
    if(e.kind==='turtle'&&Math.floor(e.y/16)>=80&&e.x<512){
      e.mode='swim';G.turtles.push(e.id);SFX.splash();float(e.x,e.y-12,'Bye bye! '+G.turtles.length+'/3','#a6e0ff');reindexFollowers();
      if(G.turtles.length>=3&&G.q.sandy===1)toast('All turtles safe! Tell Sandy.');save();}
    if(e.kind==='fawn'){const d=ents.find(n=>n.id==='doe');
      if(d&&Math.abs(d.x-e.x)<48&&Math.abs(d.y-e.y)<36){e.mode='home';G.flags.fawn=true;e.x=d.x+16;e.y=d.y+2;SFX.chirp();float(d.x,d.y-24,'Clover!','#ffd83a');reindexFollowers();save();}}
  }else if(e.mode==='wait'&&onCur(e)&&Math.abs(P.x-e.x)<13&&Math.abs(P.y-e.y)<13){
    e.fi=followerCount();e.mode='follow';SFX.chirp();float(e.x,e.y-14,e.kind==='fawn'?'Mama?':'Peep!','#ffd83a');}
}
function freeMo(){
  G.flags.mo=true;SFX.questDone();toast('The baby marmots are free!');
  ents.filter(e=>e.deco2).forEach((e,i)=>{puff(e.x,e.y-4,6,['#9a6234','#fff8ec']);Object.assign(e,at(11+i,53));});save();
}
/* ---- fly map ---- */
const DEST={farm:{x:584,y:283,mx:40,my:110,icon:'door'},forest:{x:136,y:1067,mx:128,my:110,icon:'oak'},mountains:{x:136,y:923,mx:128,my:62,icon:'pine'},
  city:{x:600,y:1051,mx:214,my:110,icon:'brickWin'},beach:{x:136,y:1179,mx:128,my:158,icon:'palm'},coop:{mx:0,my:0,icon:'cdoor'}};
let mapSel='forest',FLY=null;
function destOf(k){if(k==='coop'){const S=SITES[G.coop.site],a=DEST[G.coop.site];return Object.assign({},coopExit(),{mx:a.mx+26,my:a.my+18,icon:'cdoor'});}return DEST[k];}
function mapNodes(){const ks=['farm','forest','mountains','city','beach'].filter(k=>G.areas.includes(k)||k==='farm'||k==='forest');if(G.coop)ks.push('coop');return ks;}
function openMap(){
  if(!G.part2)return;
  const k=CS.x+','+CS.y;if(!WALK.has(k)){toast('Go outside to fly!','#a6e0ff');return;}
  state='map';mapSel=areaOf()||'farm';SFX.menu();
}
function updateMap(){
  if(pressed.back||pressed.fly||pressed.quest||pressed.grow){state='play';SFX.menu();return;}
  const nodes=mapNodes(),cur=destOf(mapSel);
  for(const [k,dx,dy] of [['up',0,-1],['down',0,1],['left',-1,0],['right',1,0]]){if(!pressed[k])continue;
    let best=null,bs=1e9;for(const n of nodes){if(n===mapSel)continue;const d=destOf(n),vx=d.mx-cur.mx,vy=d.my-cur.my,al=vx*dx+vy*dy;if(al<=0)continue;
      const sc=al+Math.abs(vx*dy-vy*dx)*2;if(sc<bs){bs=sc;best=n;}}
    if(best){mapSel=best;SFX.menu();}}
  if(pressed.a){FLY={t:0,dest:mapSel};state='flying';SFX.magic();}
}
function updateFlying(){
  FLY.t++;if(FLY.t%14===0)SFX.flap();
  if(FLY.t>=110){const d=destOf(FLY.dest),name=AREA_LABEL[FLY.dest];state='play';FLY=null;
    warpTo(d.x,d.y,0,null,()=>toast('Welcome to the '+name+'!','#94dc64'));}
}
function drawMap(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(6,6,W-12,H-12,'#f2dca0','#9a6234');
  txt('WHERE TO, PIP?',W/2,14,8,'#5e3a1c',{align:'center'});
  const nodes=mapNodes(),line=(a,b)=>{const A=destOf(a),B=destOf(b);ctx.fillStyle='#c49a5c';
    const n=Math.max(Math.abs(B.mx-A.mx),Math.abs(B.my-A.my))/4;for(let i=0;i<=n;i++){if(i%2)continue;ctx.fillRect(Math.round(lerp(A.mx,B.mx,i/n))-1,Math.round(lerp(A.my,B.my,i/n))-1,2,2);}};
  ['farm','mountains','city','beach'].forEach(k=>line('forest',k));
  for(const k of ['farm','forest','mountains','city','beach','coop']){
    if(k==='coop'&&!G.coop)continue;const d=destOf(k),open=nodes.includes(k),sel=k===mapSel;
    if(sel){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.fillRect(d.mx-15,d.my-15,30,30);}
    box(d.mx-13,d.my-13,26,26,open?'#fff8ec':'#c8b080',open?'#5e3a1c':'#9a8060');
    if(open)ctx.drawImage(TILE[d.icon],d.mx-8,d.my-8);else txt('?',d.mx,d.my-4,8,'#9a8060',{align:'center'});
    txt(open?AREA_LABEL[k]:'???',d.mx,d.my+16,5,open?'#5e3a1c':'#9a8060',{align:'center'});
    if(areaOf()===k||(k==='coop'&&false)){drawPip(stage(),0,Math.floor(tick/12)%2,false,d.mx+12,d.my-6,1);}
  }
  txt('Z: fly   F: close',W/2,H-20,5,'#5e3a1c',{align:'center'});
}
function drawFlying(){
  drawSky(tick*3);ctx.fillStyle='#4ea84a';
  for(let x=0;x<W;x++){const h=Math.round(170+Math.sin((x+tick*4)/23)*6);ctx.fillRect(x,h,1,H-h);}
  drawPip(stage(),3,Math.floor(tick/5)%2,true,128,120+Math.round(Math.sin(tick/10)*6),2);
  txt('Flying to the '+AREA_LABEL[FLY.dest]+'!',W/2,30,8,'#21142b',{align:'center'});
}
/* ---- part 2 begins ---- */
let P2T=0;
function startPart2(){state='p2intro';P2T=0;fade=0;}
function updateP2Intro(){
  P2T++;if(P2T<30)fade=1-P2T/30;
  if(P2T>90&&pressed.a){G.part2=true;if(!G.areas.includes('forest'))G.areas.push('forest');P.flying=false;P.z=0;P.dir=0;state='play';
    warpTo(136,1067,0,null,()=>say([{who:'me',text:"Wow... a whole FOREST! I wonder who lives out here?"},
      {who:'me',text:"I can fly home to the farm any time I want. Press F to open my map!"},
      {who:'me',text:"Ooh, and there's a COOP SITE sign right here in the forest. I could build my very own home!"}]));}
}
function drawP2Intro(){
  drawSky(tick+400);for(let x=0;x<W;x++){const h=Math.round(150+Math.sin(x/19)*8);ctx.fillStyle='#2f7d3a';ctx.fillRect(x,h,1,H-h);}
  for(let i=0;i<9;i++){ctx.drawImage(TILE.tree,i*30-4,150+(i%2)*6);}
  txt('PART 2',W/2+1,51,16,'#21142b',{align:'center'});txt('PART 2',W/2,50,16,'#ffd83a',{align:'center'});
  txt('BEYOND THE FARM',W/2,78,8,'#21142b',{align:'center'});
  drawPip(stage(),3,Math.floor(tick/5)%2,true,128,128+Math.round(Math.sin(tick/12)*4),2);
  if(P2T>90&&Math.floor(tick/25)%2)txt('Press Z',W/2,200,7,'#fff8ec',{align:'center',shadow:true});
}

