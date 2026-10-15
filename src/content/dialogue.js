'use strict';
/* content: what the characters with special conversations say.
   Each TALK entry is (e,{it,me,ask})=>... : it(text,fx) = they speak, me(text) = Pip speaks, ask(text,choices,cb) = a choice.
   Return false to fall through to the character's quest dialogue. Quest lines live in quests_farm/quests_beyond. */
const TALK={
granny:(e,{it,me,ask})=>{
  if(G.q.granny!==2||G.flags.festival)return false;
  if(festivalReady()){
    it("Pip, dearie... look how much you've grown!");
    it("I've waited 112 years to see a chick like you. It's time for the COMING-OF-AGE FESTIVAL!");
    ask('Are you ready?',['Ready!','Not yet'],i=>{if(i===0)startFestival();});return;}
  if(allP2Done()&&G.coop&&G.coop.lv>=4){
    it("Your dream coop is lovely, dearie! But you're not quite full-grown yet.");
    it("Keep growing: help friends, find secrets, tend your garden, and munch seeds at the snack bowl!");return;}
  return false;
},
penny:(e,{it,me,ask})=>{
  if(G.q.penny!==2)return false;
    ask(G.outfits.includes('bow')?"Egg Catch again? Your best is "+G.best.egg+" eggs!":"Wanna play EGG CATCH? Catch 20 eggs in your basket, and don't let 5 crack! Win, and I'll give you my spare PINK BOW!",
      ["Let's play!","Later"],i=>{if(i===0)startEgg();});
},
maggie:(e,{it,me,ask})=>{
    if(!e.greeted){e.greeted=1;it("Ooh! Shiny! A customer! Welcome to my NEW boutique on Main Street, darling!");}
    ask("Care to try something on? Every chick deserves to look FABULOUS.",['Shop','Bye!'],i=>{if(i===0)openCatalog('boutique');});
},
bunbun:(e,{it,me,ask})=>{
    if(!G.met.has('bunbun_hi')){G.met.add('bunbun_hi');it("Whoa! You found my secret burrow! Nobody EVER finds it!");it("I'm Bun-Bun! I love carrots more than anything in the whole world!");}
    ask("Wanna play CARROT BONK? Carrots pop out of the holes. Peck 12 before time runs out!"+(G.outfits.includes('ears')?" (Best: "+G.best.bonk+")":" Win, and you get my spare BUNNY EARS!"),
      ['Play!','Not now'],i=>{if(i===0)startMG('bonk','bunbun');});
},
hootie:(e,{it,me,ask})=>{
    if(nightAmt()<0.3){it("Hoo... *yawn*... it's far too bright. Come back when the moon is up, little one.");return true;}
    if(!G.met.has('hootie_hi')){G.met.add('hootie_hi');it("Hoo-hoo! Welcome to the Moonlit Grove. Very few chicks have ever seen it.");}
    ask("Care for a game of FIREFLY CATCH? Peck 15 fireflies before the moon goes down!"+(G.outfits.includes('pirate')?" (Best: "+G.best.ffly+")":" Win, and a PIRATE OUTFIT is yours."),
      ['Play!','Not now'],i=>{if(i===0)startMG('ffly','hootie');});
},
nibbles:(e,{it,me,ask})=>{
    if(G.items.letter){
      it("Bonjour! A letter from cousin Squeaks? How delightful!");
      it("*read read* ...Oh ho ho! Let me write back right away.");
      it("Please bring Squeaks my letter, and this fresh cheese! Merci, little chick!",()=>{G.items.letter=0;G.items.cheese=1;tasteFood('cheese');toast('Got cheese for Squeaks!');SFX.pick();save();});
    }else if(G.items.cheese)it("Hurry, hurry! Bring that cheese to Squeaks in the barn before I eat it myself!");
    else{it(G.q.squeaks===2?"Squeaks says thank you! You are a very fine mail carrier.":"Bonjour! I am Nibbles, chef of this kitchen. Mind the crumbs, s'il vous plait!");
      if(!G.cellar)it("Psst... One of the floorboards near the bedroom creaks. I think something is hidden underneath!");}
},
mom:(e,{it,me,ask})=>{
    if(G.q.mom===0){
      it("Good morning, Pip, my little peep! Did you sleep well?");
      me("Mama! I want to FLY! Over the Big Fence, to see the whole wide world!");
      it("Fly?! Oh, my feathers... You're just a teeny tiny chick!");
      it("To fly, you'll need to grow big and strong. And growing chicks need SEEDS.");
      it("The animals on the farm will share their seeds if you help them out.");
      it("But first, breakfast! Peck up 3 wiggly worms from the dirt patches.",()=>{G.q.mom=1;});
      it("Walk with the ARROW KEYS. Press Z or SPACE to peck!");
    }else if(G.q.mom===1){
      if(G.items.worm>=3){
        it("Yum! What a good little pecker you are!");
        it("Here, take 4 seeds, sweet pea.",()=>reward(4,'mom'));
        it("Press E to open your GROWTH TREE. Spend seeds there to learn skills and grow big and strong!");
        it("Then go help the other animals. Daisy the cow lives in the barnyard, and Clyde the horse is inside the big red barn.");
        it("Oh, and your big sister Penny is inside our coop. You can walk right in through the little door!");
      }else it("Find the wiggly worms in the dirt patches and peck them! ("+G.items.worm+"/3)");
    }else{
      it("*cuddle* There you go, all your hearts are full!",()=>{G.hearts=maxHearts();SFX.pick();});
      if(nightAmt()>0.4&&Math.random()<0.5)it("Isn't the night pretty? They say a fairy ring by our coop glows when the moon is out... And you can sleep in your nest inside the coop.");
      else it(hint());
    }
},
};

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

// ---- the seas ----
Object.assign(TALK,{
  pinch:(e,{it,ask})=>{
    if(!G.flags.pinchMap||G.q.pinch!==2||G.q.sea_cove===0)return false;
    if(G.q.sea_cove===1&&QUESTS.sea_cove.check())return false;
    if(G.q.sea_boss===0&&G.flags.lit&&G.sea.lv.cannon>=1)return false;
    if(G.q.sea_boss===1&&QUESTS.sea_boss.check())return false;
    ask("Ready to sail, Captain? Upgrade the ship, or set sail?",['Ship menu','Not now'],i=>{if(i===0)openCatalog('ship');});}
});
