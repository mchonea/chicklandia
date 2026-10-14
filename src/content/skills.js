'use strict';
/* content: skills (Growth Tree + Sky Tree) and growth-stage names. Data only. */
const SKILLS=[
  {id:'down',name:'FLUFFY DOWN',cost:2,req:[],x:30,y:70,desc:'Grow extra fluffy feathers. +1 heart!',learn:'+1 heart! So fluffy!'},
  {id:'quick',name:'QUICK FEET',cost:2,req:[],x:30,y:118,desc:'Scurry around the farm much faster.',learn:'You scurry faster now!'},
  {id:'peck',name:'STRONG PECK',cost:3,req:['down'],x:78,y:70,desc:'Smash rocks and crates, shake apple trees, and give foxes a real OUCH.',learn:'Smash rocks, crates & shake apple trees!'},
  {id:'hop',name:'HOP',cost:3,req:['quick'],x:78,y:118,desc:'Walk into a hay bale to hop right over it. Taught by Clyde the horse.',learn:'Walk into hay bales to hop over them!'},
  {id:'tough',name:'TOUGH FEATHERS',cost:4,req:['peck'],x:126,y:70,desc:'Sturdier feathers that shrug off bumps. +1 heart!',learn:'+1 heart! Tough as nails!'},
  {id:'flutter',name:'FLUTTER',cost:4,req:['hop'],x:126,y:118,desc:'Flap your little wings to glide right over water.',learn:'You can flutter over water now!'},
  {id:'flap',name:'WING FLAP',cost:5,req:['tough','flutter'],x:176,y:94,desc:'Press X to gust away leaves and geese! Taught by Sir Cluckington.',learn:'Press X to WING FLAP!'},
  {id:'fly',name:'FLIGHT',cost:7,req:['flap'],x:226,y:94,desc:'Real, true FLIGHT! Head to the Big Fence and soar right over it!',learn:'You can FLY! Go to the Big Fence!'}
];
const SKILLS2=[
  {id:'swim',name:'SWIM',cost:4,req:[],x:44,y:72,desc:'Paddle through deep rivers and the ocean! Taught by Lifeguard Sandy.',learn:'You can swim in deep water!'},
  {id:'glide',name:'GLIDE',cost:4,req:[],x:44,y:120,desc:'Spread your wings and glide right over chasms and gaps.',learn:'You can glide over chasms!'},
  {id:'super',name:'SUPER PECK',cost:5,req:['glide'],x:120,y:120,desc:'A peck so mighty it smashes huge boulders! Taught by Bucky the beaver.',learn:'SUPER PECK smashes boulders!'},
  {id:'golden',name:'GOLDEN WINGS',cost:8,req:['swim','super'],x:204,y:96,desc:'Shimmering golden wings! +1 heart and even faster feet.',learn:'+1 heart and speed! So shiny!'}
];
const STAGE_NAMES=['TEENY PEEP','LITTLE CHICK','GROWING CHICK','BIG CHICK','ALMOST A CHICKEN'];
