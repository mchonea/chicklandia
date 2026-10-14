'use strict';
/* content: what the characters with special conversations say.
   Each TALK entry is (e,{it,me,ask})=>... : it(text,fx) = they speak, me(text) = Pip speaks, ask(text,choices,cb) = a choice.
   Return false to fall through to the character's quest dialogue. Quest lines live in quests_farm/quests_beyond. */
const TALK={
penny:(e,{it,me,ask})=>{
  if(G.q.penny!==2)return false;
    ask(G.outfits.includes('bow')?"Egg Catch again? Your best is "+G.best.egg+" eggs!":"Wanna play EGG CATCH? Catch 20 eggs in your basket, and don't let 5 crack! Win, and I'll give you my spare PINK BOW!",
      ["Let's play!","Later"],i=>{if(i===0)startEgg();});
},
maggie:(e,{it,me,ask})=>{
    if(!e.greeted){e.greeted=1;it("Ooh! Shiny! A customer! Welcome to Maggie's Boutique, darling!");}
    ask("Care to try something on? Every chick deserves to look FABULOUS.",['Shop','Bye!'],i=>{if(i===0)openShop();});
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
      it("Please bring Squeaks my letter, and this fresh cheese! Merci, little chick!",()=>{G.items.letter=0;G.items.cheese=1;toast('Got cheese for Squeaks!');SFX.pick();save();});
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
TALK.maggie2=TALK.maggie;
