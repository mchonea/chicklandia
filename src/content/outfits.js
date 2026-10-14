'use strict';
/* content: outfits and the shop list. Data only (icons are drawn in systems/world.js). */
const OUTFITS=[
  {id:'straw',name:'STRAW HAT',price:2,bonus:'Garden grows 50% faster. Worms, carrots, apples & acorns may drop a seed.',desc:'A classic farm look. Keeps the sun off your fluff.'},
  {id:'astronaut',name:'ASTRONAUT',price:2,bonus:'Helmet light: big glow at night and in caves. Moon-bounce hops!',desc:'One small peck for a chick, one giant leap for chicken-kind!'},
  {id:'shades',name:'COOL SHADES',price:3,bonus:'Too cool: outfits and coop upgrades cost 1 less seed.',desc:'Too cool for the coop.'},
  {id:'ninja',name:'NINJA',price:6,bonus:'Stealth: foxes and geese barely notice you. A bit faster, too!',desc:'Silent. Swift. Fluffy. The shadow of the farm.'},
  {id:'bow',name:'PINK BOW',bonus:'Family love: +1 heart.',how:'Win Egg Catch with your big sister.',desc:'A gift from Penny.'},
  {id:'ears',name:'BUNNY EARS',bonus:'Hoppity: move 20% faster.',how:'Win a game in a secret burrow.',desc:'Hop hop hooray!'},
  {id:'crown',name:'GOLDEN CROWN',bonus:'Royal reward: +1 seed from every quest.',how:'Find a hidden treasure chest.',desc:'Fit for the ruler of all Chicklandia!'},
  {id:'chef',name:'CHEF HAT',price:4,bonus:'Foodie: every food you taste for the first time gives +1 extra growth.',desc:'A tall white hat. Smells like cinnamon.'},
  {id:'detective',name:'DETECTIVE CAP',price:4,bonus:'Sharp eyes: the quest log shows WHERE each task is.',desc:'Elementary, my dear chick!'},
  {id:'goggles',name:'RACING GOGGLES',bonus:'Speedy: +15% speed while gliding or flying.',how:'Win the Rooftop Race at the Toy Shop.',desc:'Zoom zoom! Strapped on tight.'},
  {id:'pirate',name:'PIRATE',bonus:'Treasure sense: hidden treasures and secrets sparkle.',how:'Win a game under the moon.',desc:'Arr! Yo ho ho and a bucket of seeds!'}];
const ACCESSORY_IDS=['bow','shades','ears','crown','goggles'];   // fit the accessory slot that opens at rank 7
const SHOP=['straw','astronaut','shades','ninja','chef','detective'];
const OUTFIT_RENAME={crown:'ninja',explorer:'crown',bandana:'astronaut',cape:'pirate'};
