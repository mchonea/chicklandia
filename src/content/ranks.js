'use strict';
/* content: growth ranks, where growth points (GP) come from, and the Taste Log foods.
   gp   = growth points needed.   gate = optional story requirement (rank needs BOTH the points and the gate).
   short = name that fits the HUD.  perk = shown at rank-up.  react = what family says if they are on screen.
   letter = "Letter from Mama" shown when nobody is around.  Ranks 8-10 belong to later expansions.          */
const RANKS=[
  {n:1,name:'TEENY PEEP',short:'TEENY PEEP',gp:0,perk:''},
  {n:2,name:'LITTLE CHICK',short:'LITTLE CHICK',gp:40,perk:'Pip walks 5% faster!',
    react:"Look at you, Pip! You're getting bigger every day!",letter:"Dear Pip, you're a little chick now! I noticed your feet getting zoomier. Love, Mama"},
  {n:3,name:'GROWING CHICK',short:'GROWING CHICK',gp:100,perk:'Hidden things twinkle when Pip is close!',
    react:"Is that a little comb? My baby is growing up!",letter:"Dear Pip, there's a little comb on your head! Keep your eyes open: secret things may twinkle for you now. Love, Mama"},
  {n:4,name:'BIG CHICK',short:'BIG CHICK',gp:170,perk:'+1 heart!',
    react:"So big and strong! Your feathers are so thick!",letter:"Dear Pip, you're a big chick now, with a bigger heart too! Love, Mama"},
  {n:5,name:'ALMOST A CHICKEN',short:'ALMOST CHICKEN',gp:210,gate:()=>has('fly'),perk:'Flying between places is faster!',
    gateHint:"You're FULL of growth! Learn FLIGHT in your Growth Tree to grow again.",
    react:"My little chick can FLY! Oh, my feathers... I'm so proud!",letter:"Dear Pip, you can fly! You're almost a real chicken. Come home safe! Love, Mama"},
  {n:6,name:'YOUNG CHICKEN',short:'YOUNG CHICKEN',gp:300,perk:'Garden harvests give +1 seed!',
    react:"White feathers! You're turning into a real chicken, Pip!",letter:"Dear Pip, white feathers are growing in! Your garden thumbs are green, too. Love, Mama"},
  {n:7,name:'GROWN-UP CHICKEN',short:'GROWN-UP CHICKEN',gp:390,gate:()=>!!G.flags.festival,perk:'+1 heart, and an ACCESSORY slot in your closet!',
    gateHint:"You're FULL of growth! Finish your dream coop and ask GRANNY SHELL: it's time!",
    react:"Pip... you're all grown up. I'm the proudest hen in the world.",letter:"Dear Pip, you did it. You're a grown-up chicken. I love you to the moon. Mama"},
  {n:8,name:'VILLAGE HERO',short:'VILLAGE HERO',gp:650,gate:()=>!!G.flags.village,perk:'A hero sash! (Village perk comes later.)',
    react:"A hero! My Pip, the Village Hero!",letter:"Dear Pip, the whole village cheers for you! Mama"},
  {n:9,name:'CAPTAIN OF THE SEAS',short:'SEAS CAPTAIN',gp:850,gate:()=>!!G.flags.seas,perk:"A captain's badge! (Seas perk comes later.)",
    react:"Captain Pip! Arr, I mean... wow!",letter:"Dear Pip, a captain! Don't forget your scarf at sea. Mama"},
  {n:10,name:'LEGEND OF CHICKLANDIA',short:'LEGEND',gp:1100,gate:()=>!!G.flags.sky,perk:'A golden aura! (Legend perk comes later.)',
    react:"The Legend of Chicklandia... is my baby!",letter:"Dear Pip, a legend! Now come home for dinner. Mama"}
];
// growth points per source (see CHICKLANDIA_STATUS.md for the budget)
const GP={quest1:10,quest2:12,quest3:14,build:4,training:8,skill:5,taste:4,mgFirst:8,mgRepeat:2,mgPerDay:3,secret:6,hiddenSeed:2,outfit:3,coop:6,harvest:1,snack:1};
// Taste Log: foods Pip can try for the first time (4 growth each)
const FOODS=[
  {id:'worm',name:'WORM',spr:'worm0'},{id:'carrot',name:'CARROT',spr:'carrot'},{id:'apple',name:'APPLE',spr:'apple'},
  {id:'cheese',name:'CHEESE',color:'#ffd21e'},{id:'acorn',name:'ACORN',spr:'acorn'},{id:'fish',name:'FISH',color:'#a6d0ff'},
  {id:'snowberry',name:'SNOWBERRY',color:'#fff8ec'},
  {id:'muffin',name:'CORN MUFFIN',spr:'muffin'},{id:'bun',name:'SEED BUN',spr:'sbun'},{id:'tart',name:'BERRY TART',spr:'tart'},{id:'stew',name:'WINNING STEW',color:'#e8a422'},{id:'pumpkin',name:'PUMPKIN',spr:'pumpkin'}];
const SECRET_IDS=[{id:'burrow',name:'RABBIT BURROW'},{id:'cellar',name:'FARMHOUSE CELLAR'},{id:'grove',name:'MOONLIT GROVE'},{id:'rooftops',name:'THE ROOFTOPS'}];
