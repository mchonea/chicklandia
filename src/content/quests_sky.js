'use strict';
/* content: Sky Kingdom quests (9), trainers (3), shops (3) and the talk of the people up there. Same shape as every other quest. */
Object.assign(NAMES,{puff:'Puff',zephyr:'Zephyr',fern:'Fern',plume:'Plume',starla:'Starla',nimbus:'Nimbus',tweeta:'Tweeta',stormy:'Stormy',sk_hatch:'Elda',sk_boss:'Nimbus'});
const ORDER6=['sk_hatch','sk_lambs','sk_gust','sk_moon','sk_chimes','sk_cake','sk_boutique','sk_rods','sk_boss'];
Object.assign(QUEST_GIVER,{sk_hatch:'elda',sk_lambs:'puff',sk_gust:'zephyr',sk_moon:'fern',sk_chimes:'fern',sk_cake:'tweeta',sk_boutique:'plume',sk_rods:'nimbus',sk_boss:'nimbus'});
Object.assign(QUEST_OF,{puff:'sk_lambs',zephyr:'sk_gust',fern:'sk_moon',tweeta:'sk_cake',plume:'sk_boutique',nimbus:'sk_rods'});
Object.assign(FOLLOWUP,{fern:['sk_moon','sk_chimes'],nimbus:['sk_rods','sk_boss']});
Object.assign(FOLLOW_GATE,{sk_boss:()=>has('thunder')&&G.q.sk_rods===2&&!!G.sky.open});
const NIGHT_HINT='Moonflowers only grow at night.';
Object.assign(QUESTS,{
  sk_hatch:{title:'The Egg Hatches',loc:'SNOWY PEAK: Elda',check:()=>!!G.sky.hatched,prog:()=>G.sky.hatched?'hatched!':'watch the egg',reward:5,
    intro:[],done:[],after:()=>["Look after our little one, Pip."],
    hint:()=>"Elda the eagle is waiting on the snowy peak. Her egg is about to hatch!"},
  sk_lambs:{title:'Lost Lambs',loc:'MEADOWS: Puff',check:()=>G.items.lamb>=3,prog:()=>Math.min(3,G.items.lamb)+'/3 lambs',reward:5,
    intro:["Baaa... oh, a visitor! A chick, up here? I'm Puff, the cloud shepherd.","My three cloud lambs bounced off on the bouncy clouds and I can't find them!","Look around the meadows and the gardens. They hide in the soft spots!"],
    remind:()=>Math.min(3,G.items.lamb)+"/3 lambs. Try the plateau corners of the meadows, and the gardens!",
    done:["My lambs! Baaa-rilliant! Oh, bless your wings.","Here, take these seeds, and a CLOUDBERRY for the road."],
    onDone:()=>{G.items.lamb=0;tasteFood('cloudberry');},
    after:()=>["Baaa. The lambs are napping on a cloud. All thanks to you."],
    hint:()=>"Find 3 lost cloud lambs in the Cloud Meadows and the Floating Gardens for Puff."},
  sk_gust:{title:'Zephyr\'s Feathers',loc:'MEADOWS: Zephyr',check:()=>G.items.skyfeather>=4,prog:()=>Math.min(4,G.items.skyfeather)+'/4 feathers',reward:5,
    intro:["Whoosh! I'm Zephyr, the fastest bird in the sky. Well, I WAS, before the big gust.","It blew four of my tail feathers away, and now I fly in circles!","They landed on the islands. Learn UPDRAFT, ride the vents, and use the bouncy clouds!"],
    remind:()=>Math.min(4,G.items.skyfeather)+"/4 feathers. Hop on the bouncy clouds, and learn UPDRAFT for the vents!",
    done:["My feathers! Zzzoom! I'm back to full speed!","I'll teach you something for your trouble. Come and talk to me again!"],
    onDone:()=>{G.items.skyfeather=0;},
    after:()=>["Whoosh! Nothing beats a tailwind."],
    hint:()=>has('updraft')?"Collect Zephyr's 4 sky feathers on the islands: use bouncy clouds and updraft vents.":"Learn UPDRAFT in your Sky Tree, then ride the vents to the islands for Zephyr's feathers."},
  sk_moon:{title:'Sky Seeds',loc:'GARDENS: Fern',check:()=>G.sky.harv.moon>=1&&G.sky.harv.star>=1,prog:()=>(G.sky.harv.moon>=1?'moon ok':'moon?')+' / '+(G.sky.harv.star>=1?'star ok':'star?'),reward:5,
    intro:["Chirp! Welcome to the Floating Gardens! I'm Fern. Nothing grows like it does up here.","Sky soil is magic: everything grows three times as fast! Moonflowers, too, but only at night.","Take these: two STAR-FRUIT seeds and two MOONFLOWER seeds. Grow one of each and show me!",
      {t:"Plant them in the soil blocks. Press peck on the soil!",fx:()=>{G.sacks.star=(G.sacks.star||0)+2;G.sacks.moon=(G.sacks.moon||0)+2;toast('Got 2 STAR-FRUIT and 2 MOONFLOWER seeds!','#ffe05a');}}],
    remind:()=>(G.sky.harv.star>=1?'':'Grow a STAR-FRUIT. ')+(G.sky.harv.moon>=1?'':'Grow a MOONFLOWER. '+NIGHT_HINT)+' Peck the soil to plant!',
    done:["Gorgeous! A star-fruit AND a moonflower!","You've got the touch, little gardener. A crown of sun-blooms for you!"],
    onDone:()=>{if(grantOutfit('bloom'))toast('Got the SUN-BLOOM CROWN!','#ff9cd0');},
    after:()=>["Chirp! Everything grows better with a friend."],
    hint:()=>"Plant a star-fruit and a moonflower in the Floating Gardens' soil, and harvest both. Moonflowers grow at night."},
  sk_chimes:{title:'The Garden Chimes',loc:'GARDENS: Fern',check:()=>G.sky.chimes>=1,prog:()=>G.sky.chimes>=1?'sung!':'play the tune',reward:6,
    intro:["Chirp! One more thing. There are three old chimes in the east garden.","They play a tune: BIG... SMALL... MEDIUM. Peck them in that order and something nice happens.","If you get it wrong, they just go quiet. No harm done!"],
    remind:()=>G.sky.chimes?"The chest is waiting in the east garden!":"The tune is BIG, then SMALL, then MEDIUM. The chimes are in the east garden.",
    done:["I heard it all the way over here! Lovely!","Take this jar of SKY HONEY. The bees up here are very fancy."],
    onDone:()=>{tasteFood('skyhoney');},
    after:()=>["Chirp! The garden hums that tune every dusk."],
    hint:()=>"Peck the three chimes in the east Floating Gardens in order: BIG, SMALL, MEDIUM."},
  sk_cake:{title:'Star-Fruit Cake',loc:'CITY: Tweeta\'s cottage',check:()=>G.items.starfruit>=2,prog:()=>Math.min(2,G.items.starfruit)+'/2 star-fruit',reward:6,
    intro:["Tweet tweet! Oh, hello! It's my hatching-day, and I'm baking a cake!","A STAR-FRUIT CAKE needs two fresh star-fruit. I'm all out!","Grow two in the Floating Gardens. A seed is 3 at the Star-Fruit Stand!"],
    remind:()=>Math.min(2,G.items.starfruit)+"/2 star-fruit. Buy seeds at the stand, plant them in the sky soil, and harvest!",
    done:["Two perfect star-fruit! Mix, mix, mix... bake, bake, bake...","Ta-daaa! Have the first slice, and these seeds for your trouble!"],
    onDone:()=>{G.items.starfruit-=2;tasteFood('cake');},
    after:()=>["Tweet! The cake was a hit. Thank you, Pip!"],
    hint:()=>"Harvest 2 star-fruit in the Floating Gardens for Tweeta's cake. Star-fruit seeds are sold at the Star-Fruit Stand."},
  sk_boutique:{title:'Window Display',loc:'CITY: Feather Boutique',check:()=>G.items.cloudpuff>=3,prog:()=>Math.min(3,G.items.cloudpuff)+'/3 cloud puffs',reward:6,
    intro:["Coo! Welcome to the Feather Boutique! I'm Plume. The finest plumes in all the clouds.","My window needs a little FLUFF. Three CLOUD PUFFS would make it look like a dream!","They drift around the gardens and the city plazas. Just pick them up!"],
    remind:()=>Math.min(3,G.items.cloudpuff)+"/3 cloud puffs. Look in the Floating Gardens and around Cloud City's plazas!",
    done:["Perfect puffs! Look at my window now. Gorgeous!","Come in any time. The shop is yours to browse, darling!"],
    onDone:()=>{G.items.cloudpuff=0;},
    after:()=>["Coo! Feathers are my life."],
    hint:()=>"Find 3 cloud puffs in the Floating Gardens and Cloud City for Plume's window."},
  sk_rods:{title:'Lightning Rods',loc:'CITY: Weather Shop, then the Peaks',check:()=>G.items.rod>=3,prog:()=>Math.min(3,G.items.rod)+'/3 rods',reward:6,
    intro:["Hmph. Nimbus. I run the weather shop. And the weather has been... terrible lately.","A storm sits over the PEAKS. It rains and zaps. Something has made it grumpy.","I need three LIGHTNING RODS from the far peaks to measure it. A crystal wall blocks the way. THUNDER PECK shatters it!"],
    remind:()=>has('thunder')?Math.min(3,G.items.rod)+"/3 rods. Break the crystal walls in the Storm Peaks and look past them!":"You need THUNDER PECK to shatter the crystal walls. Starla at the Star-Fruit Stand teaches it!",
    done:["The rods! Look at that reading. It's not weather. It's a... a very sad dragon.","A dragon lives in the lair beyond the peaks. And I think he's lonely."],
    onDone:()=>{G.items.rod=0;},
    after:()=>["Hmph. Thank you. The rain is still rain, though."],
    hint:()=>has('thunder')?"Find 3 lightning rods past the crystal walls in the Storm Peaks for Nimbus.":"Learn THUNDER PECK from Starla, then find 3 lightning rods in the Storm Peaks for Nimbus."},
  sk_boss:{title:'The Lonely Storm',loc:'PEAKS: the dragon\'s lair',check:()=>!!G.flags.sky,prog:()=>G.flags.sky?'calmed!':(G.sky.boss?'stage '+Math.min(3,G.sky.boss)+'/3':'enter the lair'),reward:12,
    intro:["Pip. The storm is the dragon. He's not angry. He's alone up there, and his sadness makes the lightning.","Go to his lair, past the last crystal wall. Dodge the lightning. Smash the storm crystals. Ring the three sky bells.","The bells' song might calm him. Be brave. And bring your chick's courage!"],
    remind:()=>"The lair is past the second crystal wall in the Storm Peaks. Dodge, smash, then ring the 3 bells!",
    done:[],after:()=>["The skies are calm. Thank you, Pip."],
    hint:()=>"Enter the Dragon's Lair in the Storm Peaks and calm the Storm Dragon: dodge lightning, smash crystals, ring 3 bells."}
});
/* ---- trainers ---- */
const trainSpawn=kind=>SKY_ITEMS.filter(i=>i[1]===kind).map(i=>[i[0],SKO[i[2]][0]+i[3],SKO[i[2]][1]+i[4]]);
Object.assign(TRAIN,{
  cloudwalk:{phase:6,who:'zephyr',whoName:'ZEPHYR',skill:'CLOUD WALK',title:'Feather-Light Training',avail:()=>G.q.sk_gust===2,item:'chime',need:3,noun:'wind chimes',spawn:trainSpawn('chime'),
    lock:"Help ZEPHYR in the Cloud Meadows with his feathers, and he'll teach you CLOUD WALK!",
    intro:["Whoosh! You're quick, kid. Want to walk on the thin clouds? They hold only the lightest feet.","The trick is to listen to the wind. Three WIND CHIMES are hidden around the meadows and gardens.","Find them and bring me their song!"],
    remind:()=>Math.min(3,G.items.chime)+"/3 wind chimes. One's on the meadow plateau, one's in the next meadow, and one's in the gardens!",
    done:["Ting-ting-ting! Hear that? Light as a feather. Now you try!","Learn CLOUD WALK in your Sky Tree. Press E, and mind the thin clouds!"],
    hint:()=>"Find 3 wind chimes in the Cloud Meadows and the Floating Gardens for Zephyr."},
  divebomb:{phase:6,who:'hatch',whoName:'YOUR CHICK',skill:'DIVE-BOMB',title:'Dive Practice',avail:()=>!!G.sky.hatched,item:'peg',need:3,noun:'pegs',spawn:trainSpawn('peg'),
    lock:"Your chick wants to teach you something! Talk to your little one after the egg hatches.",
    intro:["*peep peep!* (Your chick flaps its tiny wings and points at three little pegs.)","(It wants to show you how to DIVE! But first it needs three PEGS to practise on.)","(They're lying around: one in the gardens, one by the meadow, one on the garden plateau!)"],
    remind:()=>Math.min(3,G.items.peg)+"/3 pegs. Look in the Floating Gardens and the next meadow!",
    done:["*PEEP!* (Your chick zooms up, tucks its wings... and drops like a stone, right on the peg!)","(Now you know! Learn DIVE-BOMB in your Sky Tree. Press E!)"],
    hint:()=>"Find 3 pegs in the Cloud Meadows and Floating Gardens for your chick."},
  thunder:{phase:6,who:'starla',whoName:'STARLA',skill:'THUNDER PECK',title:'Static Charge',avail:()=>has('cloudwalk')&&has('divebomb'),item:'bolt',need:3,noun:'static bolts',spawn:trainSpawn('bolt'),
    lock:"Learn CLOUD WALK and DIVE-BOMB first. Then Starla at the Star-Fruit Stand will teach you THUNDER PECK!",
    intro:["Hoo! A chick who walks on clouds AND dives? Now we're talking.","Thunder Peck takes real zap. Three STATIC BOLTS are drifting around the Storm Peaks entrance.","Stay out of the rain walls. They sting! Bring me the bolts and I'll charge your beak."],
    remind:()=>Math.min(3,G.items.bolt)+"/3 static bolts. They're in the west part of the Storm Peaks. Stay out of the rain walls!",
    done:["Fizz-crackle! Feel that tingle? Hold your beak steady...","Learn THUNDER PECK in your Sky Tree. Press E! It shatters storm crystals!"],
    hint:()=>"Find 3 static bolts in the west Storm Peaks for Starla."}
});
/* ---- shops ---- */
const SKY_FOOD=(id,name,price,spr,desc,heal)=>({name,price,icon:spr,tag:G.taste[id]?null:'NEW!',desc:desc+(G.taste[id]?'':' A new food for the Taste Log!'),
  act:()=>shopBuy(price,'Yum! '+name+'!',()=>{G.hearts=Math.min(maxHearts(),G.hearts+heal);tasteFood(id);})});
const shopOutfit=(id)=>{const o=OUTFITS.find(x=>x.id===id),own=G.outfits.includes(id);
  return {name:o.name,price:own?null:priceOf(o),tag:own?(wearing(id)?'ON':'OWN'):null,own,on:wearing(id),desc:o.desc,bonus:o.bonus,outfit:id,
    act:()=>{if(own){setWear(id);return {s:wearing(id)?'Wearing it! Gorgeous!':'Taken off.',c:'#a1d970'};}
      return shopBuy(priceOf(o),'Sold! Looking fabulous!',()=>{grantOutfit(id);setWear(id,true);});}};};
Object.assign(SHOPS,{
  plume:{title:'FEATHER BOUTIQUE',owner:'plumeKeeper',color:'#ff9cd0',leave:'LEAVE SHOP',bye:'Come back soon, darling!',
    items:()=>[shopOutfit('quill'),
      {name:'SKY FEATHER',price:null,icon:'skyfeather',desc:'Feathers from the islands make fine gifts.',off:true,offMsg:'Zephyr collects the best ones!'}]},
  starstand:{title:'STAR-FRUIT STAND',owner:'starla',color:'#ffe05a',leave:'LEAVE',bye:'Hoo! Stay glowing!',
    items:()=>[
      {name:'STAR-FRUIT SEED',price:SEED_TYPES.star.price,tag:G.sacks.star?'x'+G.sacks.star:null,icon:'starfruit',desc:SEED_TYPES.star.desc+' Plant it in the sky soil.',
        act:()=>shopBuy(SEED_TYPES.star.price,'Got a star-fruit seed! Plant it in the Floating Gardens.',()=>{G.sacks.star=(G.sacks.star||0)+1;})},
      SKY_FOOD('cloudberry','CLOUDBERRY',2,'cloudpuff','Sweet and light as a cloud.',2),
      SKY_FOOD('cake','STAR CAKE',4,'cake','Tweeta\'s favourite!',3),
      SKY_FOOD('skyhoney','SKY HONEY',3,'chime','Golden and slow, from the fancy sky bees.',3)]},
  weather:{title:'WEATHER SHOP',owner:'nimbus',color:'#a8b8e0',leave:'LEAVE',bye:'Hmph. Mind the rain.',
    items:()=>[
      SKY_FOOD('stormtea','STORM TEA',2,'bolt','Hot, strong and slightly electric.',2),
      {name:'RAIN CHARM',price:2,icon:'rod',desc:'Makes it rain. Gardens grow twice as fast in the rain!',act:()=>shopBuy(2,'Pitter patter! It starts to rain.',()=>{G.weather='rain';G.wInt=0.2;})},
      {name:'SUNNY CHARM',price:2,icon:'skyfeather',desc:'Clears the sky and sends the clouds away.',act:()=>shopBuy(2,'The clouds slide away. Sunshine!',()=>{G.weather='clear';})},
      shopOutfit('stormcap')]}
});
/* ---- talk ---- */
const trainPending=k=>{const t=TRAIN[k];return !!t&&t.avail()&&(G.train[k]||0)!==2&&!has(k);};
Object.assign(TALK,{
  elda:(e,{it,me,ask})=>{
    if(!G.flags.skyMap||G.q.elda!==2)return false;
    if(!G.sky.hatched){
      if(!G.q.sk_hatch)G.q.sk_hatch=1;
      it("Screeee! Pip! Come quickly! Look at the egg!");
      it("It's wobbling! The egg you saved is about to HATCH!");
      it("And that old map the pirates gave you? It shows a stairway in the clouds, right here on the peak. Our little one is meant to follow it with you.");
      ask("Will you watch the hatching with me?",['Yes!','Not yet'],i=>{if(i===0)startHatch();});return true;}
    if(!G.sky.open){it("Screee! The cloud stairway is just east of my nest, Pip. Take our little one up there!");return true;}
    it(G.flags.sky?"Screee! The skies are calm again, and my chick is so happy up there with you!":"Screee! I can see the storm over the peaks from here. Be careful, you two!");return true;},
  hatch:(e,{it,ask})=>{
    if(trainPending('divebomb'))return false;
    const n=G.sky.name||'CHICK';
    it(['*peep peep!*','*flap flap!* (It wants you to jump on the bouncy clouds!)','*peep?* (It looks up at the sky, then at you.)','*chirp!*'][(Math.random()*4)|0]);
    if(has('divebomb'))it("(Your chick did a tiny, proud dive-bomb into the cloud.)");},
  nb1:(e,{it})=>{it(['Peep!','Peep peep!','*flap flap*'][(Math.random()*3)|0]);},
  nb2:(e,{it})=>{it(['*sleepy peep*','Skree!','*waddles in a tiny circle*'][(Math.random()*3)|0]);},
  plume:(e,{it,ask})=>{
    if(G.q.sk_boutique!==2)return false;
    it("Coo! Lovely to see you, darling. The window looks divine!");
    ask("Care to try something on?",['Shop','Bye!'],i=>{if(i===0)openCatalog('plume');});},
  starla:(e,{it,ask})=>{
    if(trainPending('thunder')&&((G.train.thunder||0)===0||trainCount('thunder')>=TRAIN.thunder.need))return false;
    if(trainPending('thunder'))it(TRAIN.thunder.remind());
    if(!G.met.has('starla_hi')){G.met.add('starla_hi');it("Hoo! Welcome to the Star-Fruit Stand! I'm Starla. Fruit that glows in the dark!");}
    ask("Fancy a snack, or a seed to grow your own?",['Shop','Bye!'],i=>{if(i===0)openCatalog('starstand');});},
  nimbus:(e,{it,ask})=>{
    if(G.q.sk_rods!==2||(G.q.sk_boss!==2&&FOLLOW_GATE.sk_boss()))return false;
    it(G.flags.sky?"Hmph. The sky is clear. I'm almost bored.":"Hmph. Weather's weather.");
    ask("Anything for the weather?",['Shop','Bye!'],i=>{if(i===0)openCatalog('weather');});},
  tweeta:(e,{it})=>{if(G.q.sk_cake!==2)return false;it(['Tweet! The cake was delicious. Thank you!','Tweet tweet! Happy hatching-day to me!','Tweet! Have you met the babies in the nursery?'][(Math.random()*3)|0]);},
  puff:(e,{it})=>{if(G.q.sk_lambs!==2)return false;it(['Baaa. Everything is soft up here.','Baaa! The lambs say hello!','Baaa. Mind the thin clouds, dear.'][(Math.random()*3)|0]);},
  stormy:(e,{it,ask})=>{
    it(['*rumble* ...Hello, little friend.','*gentle rumble* I was so lonely. Not any more.','*puffs a tiny cloud heart*'][(Math.random()*3)|0]);}
});
