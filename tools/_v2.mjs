import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/content/village.js',[
 ["  {id:'bramble',name:'BAKER BRAMBLE',needs:'bakery',give:{wood:2},wish:\"a shiny new sign for the bakery. It needs 2 WOOD.\",home:\"Fresh bread every morning, dearie. Come by!\",how:'moves into the bakery branch'},",
  "  {id:'daisy',name:'DAISY',needs:'bakery',give:{wood:2},wish:\"a milking stool for her dairy corner at the bakery. It needs 2 WOOD.\",home:\"Moooo! Fresh milk and warm bread. Come by anytime!\",how:'moves into the bakery branch'},"],
 ["  {id:'pablo',name:'PABLO PEACOCK',needs:'band',give:{stone:2},wish:\"a painted stage backdrop. It needs 2 STONE.\",home:\"Magnifique! The village will have its own gallery of song!\",how:'moves in by the bandstand'}];",
  "  {id:'rooster',name:'SIR CLUCKINGTON',needs:'band',give:{stone:2},wish:\"a big stone stage to crow from. It needs 2 STONE.\",home:\"COCK-A-DOODLE-DOO! Every morning, at the top of my lungs!\",how:'moves in by the bandstand'}];"],
 ["const FINALE_HAPPY=60;","const FINALE_HAPPY=100;"]]);
ed('src/engine/state.js',[["v_bramble:0,v_doe:0,v_penny:0,v_pablo:0,vharvest:0}","v_daisy:0,v_doe:0,v_penny:0,v_rooster:0,vharvest:0}"],
 ["    if(lv>=3&&(e.id==='penny'||(e.sib&&e.home)))Object.assign(e,at(...FAMILY_POS[e.id]));}","    if(lv>=3&&(e.id==='penny'||(e.sib&&e.home))&&!(G.vil&&G.vil.res[e.id]))Object.assign(e,at(...FAMILY_POS[e.id]));}"]]);
// outfit: farmer's cap
ed('src/content/outfits.js',[["  {id:'pirate',name:'PIRATE',","  {id:'overalls',name:'FARMER CAP',bonus:'Strong arms: gathering at the village gives +1 material.',how:'Help Bucky start the village.',desc:'Straw in the pockets, mud on the boots.'},\n  {id:'pirate',name:'PIRATE',"]]);
ed('src/entities/sprites_city.js',[["WEAR_ICON_EXTRA={chef:","WEAR_ICON_EXTRA={overalls:OUTFIT_SPR.overalls,chef:"],["Object.assign(OUTFIT_SPR,{chef:","Object.assign(OUTFIT_SPR,{overalls:makeSprite(['..uuuu..','.uuuuuu.','uuuuuuuu','kkkkkkkk']),chef:"]]);
ed('src/systems/world.js',[["HAT={straw:5,pirate:5,astronaut:8,chef:6,detective:4}","HAT={straw:5,pirate:5,astronaut:8,chef:6,detective:4,overalls:4}"],["    case 'chef':case 'detective':{","    case 'chef':case 'detective':case 'overalls':{"]]);
