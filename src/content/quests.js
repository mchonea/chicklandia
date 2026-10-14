'use strict';
/* ---------------- quests & dialogue ---------------- */
const NAMES={mom:'Mama Hen',daisy:'Daisy',pig:'Porkchop',duck:'Mrs. Quackers',sheep:'Woolly',rooster:'Sir Cluckington',
  penny:'Penny',clyde:'Clyde',squeaks:'Squeaks',biscuit:'Biscuit',whiskers:'Whiskers'};
const QUESTS={
  mom:{title:'Breakfast Worms',check:()=>G.items.worm>=3,prog:()=>Math.min(3,G.items.worm)+'/3 worms'},
  daisy:{title:'The Lost Bell',check:()=>G.items.bell>0,prog:()=>G.items.bell?'bell found!':'find the bell',reward:3,
    intro:["Moooo... Oh, hello there, little one.","I lost my favorite bell! I think it rolled into the hay pen just north of here.","Those bales are much too tall for a chick... but if you learned to HOP, you could jump right over them!"],
    remind:()=>"My bell is in the hay pen north of here. "+(has('hop')?"Walk into a hay bale to HOP over it!":"Clyde the horse in the barn is a champion jumper. He could teach you to HOP!"),
    done:["You found my bell! *ding ding* Moooo-velous!","Here, take 3 seeds, sweetie!"],
    after:()=>["*ding ding* I'm the best-dressed cow on the whole farm!"],
    hint:()=>has('hop')?"Daisy's bell is in the hay pen. HOP over the bales by walking into them!":"Daisy's bell is behind those tall hay bales. Clyde the horse in the barn can teach you to HOP!"},
  pig:{title:'Apple Snack',check:()=>G.items.apple>=3,prog:()=>Math.min(3,G.items.apple)+'/3 apples',reward:3,
    intro:["Oink! I'm sooo hungry... I want APPLES!","But they're all stuck way up in the trees. I tried climbing. Pigs can't climb.","A STRONG PECK on an apple tree might shake one loose! Bring me 3, pretty please?"],
    remind:()=>Math.min(3,G.items.apple)+"/3 apples. "+(has('peck')?"Give the apple trees a good peck!":"You'll need STRONG PECK from your Growth Tree."),
    done:["*CRUNCH* *MUNCH* *SLURP* Oink oink! Best. Day. EVER!","Here, have 3 seeds!"],
    after:()=>["I'm gonna go roll in the mud now. Don't judge."],
    hint:()=>has('peck')?"Porkchop wants apples. Peck the apple trees in the orchard!":"Porkchop wants apples. You'll need a STRONG PECK to shake the trees."},
  duck:{title:'Lost Ducklings',check:()=>G.home.length>=3,prog:()=>G.home.length+'/3 home',reward:4,
    intro:["Quack! Oh dear, oh dear, oh dear!","My three ducklings paddled out to the islands, and now they're too scared to swim back!","If you could FLUTTER over the water, they'd follow you right home!"],
    remind:()=>G.home.length+"/3 ducklings home. "+(has('flutter')?"Flutter over the pond and lead them back to me!":"Learn FLUTTER to cross the water."),
    done:["All my babies are home safe! Quack quack hooray!","You're a brave little chick. Take 4 seeds!"],
    after:()=>["The ducklings say they want to be just like you when they grow up!"],
    hint:()=>has('flutter')?"Mrs. Quackers' ducklings are on the pond islands. Flutter out and lead them home!":"Mrs. Quackers' ducklings are stuck on the pond islands. Learn FLUTTER!"},
  sheep:{title:'Fox Trouble',check:()=>G.foxGone,prog:()=>G.foxGone?'fox scared off!':'scare off the fox',reward:4,
    intro:["Baaa! A sneaky FOX keeps chasing my flock around this field!","Your little pecks would just tickle him...","But a STRONG PECK might scare him off for good! Be careful, he bites!"],
    remind:()=>has('peck')?"That fox is still prowling around! Peck him 3 times with your Strong Peck!":"Get STRONG PECK first, or that fox will just laugh at you!",
    done:["Baaa-rilliant! That fox won't be back any time soon!","Here are 4 seeds, my fluffy hero!"],
    after:()=>["Now we can munch grass in peace. Baaa."],
    hint:()=>has('peck')?"Woolly's fox is prowling the field. Give him 3 strong pecks!":"Woolly needs help with a fox. You'll need STRONG PECK."},
  rooster:{title:'Golden Feathers',check:()=>G.items.feather>=3,prog:()=>Math.min(3,G.items.feather)+'/3 feathers',reward:4,
    intro:["COCK-A-DOODLE-HALT! Who goes there?",{me:"I'm going to learn to fly... right over the Big Fence!"},"Ha! Many a chicken has dreamed that dream.","Prove you've got pluck! Find my 3 GOLDEN FEATHERS. The wind scattered them across the farm.","I saw one land in an orchard crate, one float out to a pond island, and one blow under some leaves in the field."],
    remind:()=>Math.min(3,G.items.feather)+"/3 golden feathers. Check the orchard crates, the pond islands, and the leaf piles in the field!",
    done:["My golden feathers! You've got real pluck, kid.","Take these 4 seeds."],
    post:["And listen close... Once you learn FLIGHT, get past that grumpy goose and fly over the BIG FENCE!"],
    after:()=>[has('fly')?"What are you waiting for? Fly over that Big Fence, kid!":(G.gooseGone?"Learn FLIGHT, then head for the Big Fence!":"A WING FLAP will blow that grumpy goose clean away. Then learn FLIGHT!")],
    hint:()=>"Sir Cluckington's golden feathers: a crate in the orchard, a pond island, and a leaf pile in the field."},
  penny:{title:'Hide and Seek',check:()=>G.sibs.length>=3,prog:()=>G.sibs.length+'/3 found',reward:3,
    intro:["Pip! There you are!","I'm playing hide-and-seek with the triplets, but I can't find ANY of them!","Peep, Cheep and Tweet could be hiding anywhere. Will you help me find them?","Tweet loves climbing up high in the barn. Cheep hides in bushes. And Peep is always sneaking into the farmhouse!"],
    remind:()=>G.sibs.length+"/3 found. Tweet climbs up high in the barn, Cheep hides in the field bushes, and Peep sneaks into the farmhouse!",
    done:["You found all three! You're the best seeker on the whole farm, Pip!","I saved 3 seeds for you. Here!"],
    after:()=>["Next time, I'm hiding and YOU'RE counting!"],
    hint:()=>"The triplets are hiding! Tweet is up in the barn loft, Cheep is in the field bushes, and Peep is in the farmhouse."},
  clyde:{title:'Carrot Crunch',check:()=>G.items.carrot>=3,prog:()=>Math.min(3,G.items.carrot)+'/3 carrots',reward:3,
    intro:["Neeeigh... Hello there, small fluffy friend.","I've been in this stall all day, and my tummy is rumbling.","There's a carrot patch in the barnyard. Could you peck 3 carrots out of the ground for old Clyde?"],
    remind:()=>Math.min(3,G.items.carrot)+"/3 carrots. The carrot patch is in the barnyard, south-east of the barn. Just peck them!",
    done:["*crunch crunch* Neeeigh! Just like the good old days.","Have 3 seeds, little one."],
    after:()=>["Someday you'll fly higher than I ever jumped, Pip."],
    hint:()=>"Clyde the horse wants carrots. Peck them out of the patch in the barnyard!"},
  squeaks:{title:'Mouse Mail',check:()=>G.items.cheese>0,prog:()=>G.items.cheese?'bring cheese to Squeaks':(G.items.letter?'deliver letter to Nibbles':'waiting for reply'),reward:3,
    intro:["Squeak! Squeak! A visitor!","I wrote a letter to my cousin Nibbles. He's the chef in the farmhouse kitchen.",{t:"Mice are too tiny to go that far. Could you deliver it for me?",fx:()=>{G.items.letter=1;toast("Got Squeaks' letter!");SFX.pick();}}],
    remind:()=>G.items.letter?"Please take my letter to Nibbles! He lives in the farmhouse kitchen, in the orchard.":"Did Nibbles write back yet?",
    done:["A letter AND cheese from Nibbles?! Squeak squeak HOORAY!","Here, 3 seeds for the best mail-chick ever!"],
    onDone:()=>{G.items.cheese=0;},
    after:()=>["Nibbles says you're the speediest mail carrier he's ever met!"],
    hint:()=>G.items.letter?"Squeaks' letter goes to Nibbles in the farmhouse kitchen.":"Bring Nibbles' cheese back to Squeaks in the barn."},
  biscuit:{title:'Buried Bone',check:()=>G.items.bone>0,prog:()=>G.items.bone?'bone found!':'dig up the bone',reward:3,
    intro:["Woof! Woof! Oh, hi! I'm Biscuit! Wanna play?","I buried my favorite bone somewhere on the farm... and I forgot where! Woof!","Look for little dirt mounds. A STRONG PECK can dig them right up!"],
    remind:()=>has('peck')?"Find the dirt mounds around the farm and peck them open! I KNOW it's in one of them!":"You'll need a STRONG PECK to dig. Woof!",
    done:["MY BONE! You found it! *wag wag wag wag*","You're a good chick! Yes you are! Here, 3 seeds!"],
    after:()=>["*chews bone happily* Woof.","Sniff sniff... I smell a BUNNY under one of the leaf piles in the field! A big gust of wind might uncover it!"],
    hint:()=>has('peck')?"Biscuit's bone is buried in one of the dirt mounds around the farm. Peck them open!":"Biscuit's bone is buried. You'll need STRONG PECK to dig it up."},
  whiskers:{title:'Lost Yarn',check:()=>G.items.yarn>0,prog:()=>G.items.yarn?'yarn found!':'find the yarn',reward:3,
    intro:["Mrrrow. Oh. A chick. How... fluffy.","My ball of yarn rolled up into the barn loft. I'd fetch it myself, but I'm very busy napping.","The loft is behind a wall of hay. Bring it back, and I MIGHT share some seeds."],
    remind:()=>has('hop')?"My yarn is in the barn loft. Hop over the hay.":"The loft is behind a wall of hay. That show-off horse Clyde could teach you to HOP.",
    done:["My yarn! *bat bat bat* ...Ahem. I mean, thank you.","Here. 3 seeds. Don't tell the dog I was nice."],
    after:()=>["Purrr... zzzz...","...mrrp. At night, the mushrooms by your coop glow. Owls like that sort of thing."],
    hint:()=>"Whiskers' yarn is up in the barn loft, behind the wall of hay."}
};
const ORDER=['daisy','clyde','squeaks','penny','pig','sheep','whiskers','biscuit','duck','rooster'];
const INTRO_HINT={daisy:"Daisy the cow lives in the barnyard, just east of the coop. She looked upset.",
  clyde:"Clyde the horse lives inside the big red barn. Walk up to the door to go in!",
  squeaks:"I hear some little squeaks coming from the barn. Somebody needs help!",
  penny:"Your big sister Penny is inside our coop. Walk up to the little door!",
  whiskers:"Whiskers the cat lives in the farmhouse, over in the orchard.",
  biscuit:"Biscuit the dog lives in the farmhouse too. He's always losing things!",
  pig:"Porkchop the pig lives in the orchard, past the barnyard. I hear his tummy rumbling from here!",
  sheep:"Woolly the sheep grazes in the field south of the barnyard. Watch out for that fox!",
  duck:"Mrs. Quackers lives by the pond, south of the coop. She sounded worried.",
  rooster:"Sir Cluckington struts around by the Big Fence, east of the field."};
function hint(){
  if(G.part2)return hint2();
  if(G.q.mom<2)return "Peck 3 worms in the dirt patches!";
  if(G.skills.size===0)return "Press E to open your Growth Tree and spend your seeds!";
  for(const k in TRAIN){const t=TRAIN[k];if(t.phase===1&&G.train[k]===1)return t.hint();}
  for(const id of ORDER){if(G.q[id]===1&&QUESTS[id].check())return "Go tell "+NAMES[id]+" the good news!";}
  for(const id of ORDER){if(G.q[id]===0&&!G.met.has(id))return INTRO_HINT[id];}
  for(const id of ORDER){if(G.q[id]===1)return QUESTS[id].hint();}
  if(!has('fly'))return "You've grown so much! Keep spending seeds in your Growth Tree until you learn FLIGHT!";
  return "Go on, fly over that Big Fence! Mama is so proud of you!";
}
function reward(n,id){if(wearing('crown'))n++;G.seeds+=n;G.found+=n;G.q[id]=2;SFX.questDone();toast('+'+n+' SEEDS!');save();}
function say(lines,onEnd){lines.forEach(l=>l.text=tt(l.text));dlg={lines,i:0,shown:0,onEnd};state='talk';}
function talkTo(e){
  const L=[];const it=(t,fx)=>L.push({who:e,text:t,fx});const me=t=>L.push({who:'me',text:t});
  if(e.id==='duck'||e.id==='rooster')e.flip=P.x>e.x;
  G.met.add(e.id);
  if(e.deco){it(['Baa.','Baaa?','*munch munch*','Baa baa!'][(Math.random()*4)|0]);say(L);return;}
  if(talkP2(e,it)){say(L);return;}
  if(e.sib){
    if(e.home){it(e.sib.homeLine);say(L);return;}
    if(G.q.penny===0){it("Shhh! We're playing hide-and-seek! Go talk to Penny in the coop if you want to play!");say(L);return;}
    it(e.sib.found);
    say(L,()=>{puff(e.x,e.y-6,10,['#ffd83a','#fff8ec']);G.sibs.push(e.id);e.home=true;Object.assign(e,at(...e.sib.home));SFX.chirp();
      toast(G.sibs.length>=3?'Found all 3! Go tell Penny.':'Found '+e.name+'! ('+G.sibs.length+'/3)');save();});
    return;
  }
  const ask=(t,choices,cb)=>L.push({who:e,text:t,choices,cb});
  if(e.id==='penny'&&G.q.penny===2){
    ask(G.outfits.includes('bow')?"Egg Catch again? Your best is "+G.best.egg+" eggs!":"Wanna play EGG CATCH? Catch 20 eggs in your basket, and don't let 5 crack! Win, and I'll give you my spare PINK BOW!",
      ["Let's play!","Later"],i=>{if(i===0)startEgg();});
    say(L);return;
  }
  if(e.id==='maggie'){
    if(!e.greeted){e.greeted=1;it("Ooh! Shiny! A customer! Welcome to Maggie's Boutique, darling!");}
    ask("Care to try something on? Every chick deserves to look FABULOUS.",['Shop','Bye!'],i=>{if(i===0)openShop();});
    say(L);return;
  }
  if(e.id==='bunbun'){
    if(!G.met.has('bunbun_hi')){G.met.add('bunbun_hi');it("Whoa! You found my secret burrow! Nobody EVER finds it!");it("I'm Bun-Bun! I love carrots more than anything in the whole world!");}
    ask("Wanna play CARROT BONK? Carrots pop out of the holes. Peck 12 before time runs out!"+(G.outfits.includes('ears')?" (Best: "+G.best.bonk+")":" Win, and you get my spare BUNNY EARS!"),
      ['Play!','Not now'],i=>{if(i===0)startMG('bonk','bunbun');});
    say(L);return;
  }
  if(e.id==='hootie'){
    if(nightAmt()<0.3){it("Hoo... *yawn*... it's far too bright. Come back when the moon is up, little one.");say(L);return;}
    if(!G.met.has('hootie_hi')){G.met.add('hootie_hi');it("Hoo-hoo! Welcome to the Moonlit Grove. Very few chicks have ever seen it.");}
    ask("Care for a game of FIREFLY CATCH? Peck 15 fireflies before the moon goes down!"+(G.outfits.includes('pirate')?" (Best: "+G.best.ffly+")":" Win, and a PIRATE OUTFIT is yours."),
      ['Play!','Not now'],i=>{if(i===0)startMG('ffly','hootie');});
    say(L);return;
  }
  if(e.id==='nibbles'){
    if(G.items.letter){
      it("Bonjour! A letter from cousin Squeaks? How delightful!");
      it("*read read* ...Oh ho ho! Let me write back right away.");
      it("Please bring Squeaks my letter, and this fresh cheese! Merci, little chick!",()=>{G.items.letter=0;G.items.cheese=1;toast('Got cheese for Squeaks!');SFX.pick();save();});
    }else if(G.items.cheese)it("Hurry, hurry! Bring that cheese to Squeaks in the barn before I eat it myself!");
    else{it(G.q.squeaks===2?"Squeaks says thank you! You are a very fine mail carrier.":"Bonjour! I am Nibbles, chef of this kitchen. Mind the crumbs, s'il vous plait!");
      if(!G.cellar)it("Psst... One of the floorboards near the bedroom creaks. I think something is hidden underneath!");}
    say(L);return;
  }
  if(e.id==='mom'){
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
    say(L);return;
  }
  if(trainTalk(e,it)){say(L);return;}
  const q=QUESTS[e.id];if(!q)return;
  const pushLine=l=>typeof l==='string'?it(l):(l.me?me(l.me):it(l.t,l.fx));
  const doneLines=()=>{q.done.forEach((l,i)=>it(l,i===q.done.length-1?()=>{if(q.onDone)q.onDone();reward(q.reward,e.id);}:null));(q.post||[]).forEach(pushLine);};
  if(G.q[e.id]===0){q.intro.forEach(pushLine);G.q[e.id]=1;if(q.check())doneLines();}
  else if(G.q[e.id]===1){if(q.check())doneLines();else it(q.remind());}
  else q.after().forEach(pushLine);
  say(L);
}
function speakerPos(who){
  if(who==='me'){const s=getChick(stage(),0,0,false);return {x:P.x-camX,top:P.y-camY+HUD+2-s.height-P.z,bot:P.y-camY+HUD+3,name:'PIP',voice:900};}
  if(who.type){const s=SPR[who.spr];return {x:who.x-camX,top:who.y-camY+HUD+2-s.height,bot:who.y-camY+HUD+3,name:who.name,voice:who.voice};}
  return {x:who.x-camX,top:who.y-camY+HUD,bot:who.y-camY+HUD+16,name:who.name,voice:300};
}
function updateTalk(){
  const d=dlg,line=d.lines[d.i];
  if(!line.started){line.started=true;if(line.fx)line.fx();}
  if(d.shown<line.text.length){
    const before=Math.floor(d.shown);d.shown=Math.min(line.text.length,d.shown+0.85);
    if(Math.floor(d.shown)!==before&&before%3===0&&line.text[before]!==' '){const sp=speakerPos(line.who);SFX.blip(sp.voice+((before*37)%60));}
    if(pressed.a)d.shown=line.text.length;
  }else if(line.choices){
    if(pressed.left||pressed.right||pressed.up||pressed.down){d.sel=(d.sel||0)^1;SFX.menu();}
    if(pressed.a){const cb=line.cb,sel=d.sel||0;dlg=null;state='play';SFX.pick();if(cb)cb(sel);}
  }else if(pressed.a||pressed.back){
    d.i++;d.shown=0;SFX.menu();
    if(d.i>=d.lines.length){dlg=null;state='play';if(d.onEnd)d.onEnd();}
  }
}

