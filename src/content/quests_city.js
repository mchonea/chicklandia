'use strict';
/* content: the six city home quests (same shape as the other quests), plus the museum exhibits and where finds hide. */
Object.assign(NAMES,{rocco:'Rocco',cleo:'Cleo',waddles:'Mrs. Waddles',pablo:'Pablo the Painter'});
const ORDER3=['rocco','cleo','cookoff','vane','babysit','portrait'];
// who gives the quest (for the "go tell them the good news" hints) -- cookoff is Remy's, vane is Pidge's
const QUEST_GIVER={cookoff:'remy',vane:'pidge',babysit:'waddles',portrait:'pablo'};
const QUEST_OF={pablo:'portrait',waddles:'babysit'};       // npc id -> quest id when they differ
const FOLLOWUP={remy:'cookoff',pidge:'vane'};     // the giver starts this quest after finishing their first one
Object.assign(QUESTS,{
  rocco:{title:'Borrowed Things',loc:'CITY: den by the fountain',
    check:()=>retCount()>=3,prog:()=>retCount()+'/3 returned',reward:4,
    intro:["Psst. Pip, right? ...I have a little problem.","I 'borrowed' a few things around the city. A hat, a whisk and a bell. I only meant to look at them!","Now I feel awful. Could you find them and give them back? They're hidden around the city!",
      {t:"The hat is Pidge's, the whisk is Remy's, and the bell is Cleo's. Thank you, thank you!",fx:()=>{G.flags.rocco1=1;}}],
    remind:()=>retCount()+"/3 returned. The hat is Pidge's, the whisk is Remy's, the bell is Cleo's. Look in the park, the harbor and the lane!",
    done:["You returned them all?! Now I don't feel so crummy.","Here, take 4 seeds. I found them, uh, in the fountain."],
    after:()=>["I'm a changed raccoon. Mostly. Sometimes I still borrow a napkin."],
    hint:()=>"Rocco 'borrowed' a hat, a whisk and a bell. Find them around the city and return them to Pidge, Remy and Cleo."},
  cleo:{title:'The Sunbeam Spot',loc:'CITY: market square (daytime)',
    check:()=>!!G.flags.sunbeam,prog:()=>G.flags.sunbeam?'found it!':'be there at noon',reward:4,
    intro:["Mrrow. I am looking for my favorite sunbeam. It moves, you see. Very rude of it.","I only nap there when the sun is at its highest. At NOON.","It shines on one spot. Somewhere in the city park. Stand in it, and tell me it's real!"],
    remind:()=>G.flags.sunbeam?"You found it? Tell me everything.":"Be in the city park at NOON, when the sun is highest. Look for a bright warm patch!",
    done:["It's real! A golden sunbeam, just like I remember...","I'll nap there tomorrow. Here, 4 seeds for the guide."],
    after:()=>["Purrr... best nap spot in all of Chicklandia. Don't tell Rocco."],
    hint:()=>"Cleo's sunbeam shines in the city park at noon. Stand in the warm patch of light!"},
  cookoff:{title:'The Great Cook-Off',loc:'CITY: Remy in the market (daytime)',
    check:()=>G.items.pepper>0&&G.items.salt>0&&G.items.mushroom>0,
    prog:()=>[G.items.pepper?'pepper':'',G.items.salt?'salt':'',G.items.mushroom?'mushroom':''].filter(Boolean).join(' ')||'0/3 items',reward:5,
    intro:["Pip! Big news. The BIG COOK-OFF is tonight at my bistro! I need a showstopper dish.","I need three rare things: MOUNTAIN PEPPER from the snowy trail, SEA SALT from the beach, and a FOREST MUSHROOM.","Bring me one of each, and I'll cook my best stew ever!"],
    remind:()=>"I still need: "+[G.items.pepper?'':'mountain pepper',G.items.salt?'':'sea salt',G.items.mushroom?'':'a forest mushroom'].filter(Boolean).join(', ')+".",
    done:["Pepper, salt, mushroom... PERFECTION! *chop chop sizzle*","The judges loved it! Here are 5 seeds, and a taste of the winning stew!"],
    onDone:()=>{G.items.pepper=0;G.items.salt=0;G.items.mushroom=0;tasteFood('stew');},
    after:()=>["Remy's Winning Stew! The bistro is full every night now."],
    hint:()=>"Remy needs mountain pepper, sea salt and a forest mushroom for the cook-off."},
  vane:{title:'The Wobbly Weathervane',loc:'CITY: rooftops (needs GLIDE)',
    check:()=>!!G.flags.vane,prog:()=>G.flags.vane?'fixed!':'peck it on the roof',reward:5,
    intro:["Coo! Pip, one more thing. The weathervane on the rooftops is stuck, and I can't tell which way the wind blows!","It's way up on the roofs. You can get there from the stairs in the toy shop.","You'll need to GLIDE across the gaps. Give it a good peck and it'll spin again!"],
    remind:()=>G.flags.vane?"Is it spinning?":"Go up the stairs in the toy shop. Glide over the gaps, and peck the weathervane!",
    done:["It's spinning! Wind from the east! Coo coo!","Here are 5 seeds. Now I know which way to fly!"],
    after:()=>["Coo! The wind is blowing from the harbor today."],
    hint:()=>"Pidge's weathervane is on the rooftops. Take the toy shop stairs, glide over the gaps, and peck it."},
  babysit:{title:'Duckling Duty',loc:'CITY: duck flat in the lane',
    check:()=>!!(G.flags.baby&&G.flags.baby.done),prog:()=>G.flags.baby&&G.flags.baby.stops?G.flags.baby.stops+'/3 stops':'lead 4 ducklings',reward:5,
    intro:["Quack! Oh, Pip! I'm Mrs. Waddles, Mrs. Quackers' cousin.","My four ducklings have been cooped up all day. They want a walk in the park!","Could you lead them to the gazebo, the pond and the bandstand, and bring them ALL home? Don't walk too fast!",
      {t:"Walk up to them and they'll follow! Don't lose a single one!",fx:()=>{startBabysit();}}],
    remind:()=>babyRemind(),
    done:["All four! Quack quack hooray! Not a single one lost!","You're the best babysitter in the city. Take 5 seeds!"],
    after:()=>["The ducklings still talk about their big walk. Quack!"],
    hint:()=>"Mrs. Waddles' ducklings want a walk. Visit the gazebo, the pond and the bandstand in the park, then come home."},
  portrait:{title:'Pose for a Portrait',loc:'CITY: artist studio in the lane',
    check:()=>(G.flags.poses||[]).length>=3,prog:()=>(G.flags.poses||[]).length+'/3 poses',reward:5,
    intro:["Ah! A model! Pablo the peacock, painter of the people!","I want to paint you three times, each in a DIFFERENT outfit. Wear something, then talk to me.","Come back on different visits with a new look each time!"],
    remind:()=>(G.flags.poses||[]).length+"/3 portraits. Wear an outfit you haven't posed in, then talk to me, once per visit!",
    done:["Magnifique! Three portraits! I shall hang them in your coop!","And 5 seeds for your trouble, my muse!"],
    onDone:()=>{G.decor.painting=1;placeDecor();},
    after:()=>["Your portraits look splendid in the coop. I'm a genius."],
    hint:()=>"Pablo wants to paint Pip in 3 different outfits, one per visit to his studio."}
});
const INTRO3={rocco:"Rocco the raccoon lives in the den next to the city gate. He looked guilty.",
  cleo:"Cleo the cat naps in the market square in the daytime.",cookoff:"Chef Remy is planning a big cook-off in the market.",
  vane:"Postmaster Pidge could use help with a weathervane.",babysit:"Mrs. Waddles at the duck flat could use a babysitter.",
  portrait:"Pablo the peacock paints in the artist studio in the residential lane."};
// museum exhibits (id = the item you carry)
const EXHIBITS=[
  {id:'seashell',item:'seashell',name:'SEASHELLS',need:5,desc:'Five shells from the shore.',where:'Look for pretty shells on the beach and in the tide pools!',reward:{seeds:5,gp:10}},
  {id:'plume',item:'plume',name:'FEATHERS',need:4,desc:'Four feathers from faraway places.',where:'Feathers drift down in the field, forest, mountains and park.',reward:{seeds:5,gp:10}},
  {id:'fossil',item:'fossil',name:'FOSSILS',need:4,desc:'Old bones dug out of the ground.',where:'Peck the strange dirt mounds (needs Strong Peck).',reward:{seeds:5,gp:10}},
  {id:'petal',item:'petal',name:'MOON PETALS',need:3,desc:'Three rare petals.',where:'Grow Moonflowers at night in your garden.',reward:{seeds:6,gp:12}}];
// where the museum finds hide (tile col,row)
const FINDS=[
  ...[[5,74],[8,76],[12,75],[20,74],[28,77]].map(([c,r],i)=>({id:'ms'+i,kind:'seashell',c,r})),
  ...[[24,15],[4,70],[12,50],[75,64]].map(([c,r],i)=>({id:'mp'+i,kind:'plume',c,r})),
  ...[[2,57],[14,62],[14,73],[50,80]].map(([c,r],i)=>({id:'mf'+i,kind:'fossilmound',c,r}))];
// things Rocco borrowed, and where they are hidden
const BORROWED=[{id:'b_hat',kind:'hat',item:'bhat',owner:'pidge',c:66,r:67,name:"Pidge's hat",flag:'hat'},
  {id:'b_whisk',kind:'whisk',item:'bwhisk',owner:'remy',c:70,r:74,name:"Remy's whisk",flag:'whisk'},
  {id:'b_bell',kind:'collarBell',item:'bbell',owner:'cleo',c:55,r:81,name:"Cleo's bell",flag:'bell'}];
// cook-off ingredients
const INGREDIENTS=[{id:'i_pepper',kind:'pepper',item:'pepper',c:9,r:55},{id:'i_salt',kind:'salt',item:'salt',c:6,r:79},{id:'i_mush',kind:'mushroom',item:'mushroom',c:9,r:69}];

// where each quest's friend can be found (the Detective Cap shows these in the quest log)
const QUEST_LOC={mom:'FARM: coop yard',daisy:'FARM: barnyard',clyde:'FARM: inside the barn',squeaks:'FARM: inside the barn',penny:'FARM: inside the coop',pig:'FARM: orchard',
  sheep:'FARM: the field',whiskers:'FARM: farmhouse',biscuit:'FARM: farmhouse',duck:'FARM: by the pond',rooster:'FARM: by the Big Fence',granny:'FOREST: her garden',
  bucky:'FOREST: deep woods',doe:'FOREST: deep woods',mo:'MOUNTAINS: the trail',elda:'MOUNTAINS: snowy peak',pidge:'CITY: post office by the gate',remy:'CITY: market square',
  pinch:'BEACH: sandy shore',sandy:'BEACH: sandy shore'};
function questLoc(id){return (QUESTS[id]&&QUESTS[id].loc)||QUEST_LOC[id]||'';}
