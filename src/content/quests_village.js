'use strict';
/* content: Chicklandia Village quests. vfound is Bucky's; the v_<friend> quests are moved along by the village mailbox;
   vharvest is the Grand Harvest Festival (talk to Foreman Barnaby when the village is happy enough). */
Object.assign(NAMES,{vfound:'Bucky',barnaby:'Foreman Barnaby',dash:'Dash'});
const ORDER4=['vfound','v_pig','v_whiskers','v_clyde','v_daisy','v_doe','v_penny','v_rooster','vharvest'];
Object.assign(QUEST_GIVER,{vfound:'bucky',vharvest:'barnaby'});
const FOLLOW_GATE={bucky:()=>!!G.flags.festival};
Object.assign(FOLLOWUP,{bucky:'vfound'});
Object.assign(QUESTS,{
  vfound:{title:'A Village At Last',loc:'FOREST: Bucky, then the village',
    check:()=>builtList().length>=1,prog:()=>builtList().length?'first building up!':'build something',reward:6,
    intro:["Pip! Pip! Big news! While you were growing up, I was out surveying.","I found the sunniest meadow in all Chicklandia, just south of the city market!","Your friends all want to live near you. Let's build them a VILLAGE!",
      {t:"The road is open now. Gather wood, stone, wool and clay, then use the building pads in the Village Square!",fx:()=>{openVillage();}}],
    remind:()=>builtList().length?"Great, a building is up! Tell me about it!":"Go south from the city market to the Village Square. Peck logs, stone and clay at the Riverside, and wool from the sheep. Then build on a pad!",
    done:["Look at that! A real building in our village! Beaver-tail slap!","Take these seeds, and this cap. Every builder needs one!"],
    onDone:()=>{grantOutfit('overalls');toast('Got the FARMER CAP! Press C to wear.','#ffd83a');},
    after:()=>["The village is lovely! Foreman Barnaby is running the building site."],
    hint:()=>"Walk south from the city market to find the village. Gather materials, then build on a pad in the Village Square."},
  vharvest:{title:'The Grand Harvest',loc:'VILLAGE: Foreman Barnaby',
    check:()=>!!G.flags.village,prog:()=>G.flags.village?'celebrated!':happiness()+'/'+FINALE_HAPPY+' happy',reward:8,
    intro:[],remind:()=>"The village needs "+happiness()+"/"+FINALE_HAPPY+" happiness and every friend moved in for the festival!",done:[],after:()=>["What a harvest festival!"],
    hint:()=>"Make the village happy: move in every friend, build more, win seasonal contests. Then talk to Foreman Barnaby."}});
for(const r of RESIDENTS){
  QUESTS['v_'+r.id]={title:({pig:'Porkchop Moves In',whiskers:'Whiskers Moves In',clyde:'Clyde Moves In',daisy:'Daisy Moves In',doe:'Doe Moves In',penny:'Penny Moves In',rooster:'Cluckington Moves In'})[r.id],loc:'VILLAGE: mailbox in the square',
    check:()=>!!G.vil.res[r.id],prog:()=>G.vil.res[r.id]?'moved in!':G.vil.letters.includes(r.id)?'read the letter':'needs a '+BUILDING_TYPES[r.needs].name.toLowerCase(),reward:4,
    intro:[],remind:()=>'',done:[],after:()=>[],
    hint:()=>G.vil.letters.includes(r.id)?r.name+" wrote a letter! Check the village mailbox and give the wish."
      :"Build a "+BUILDING_TYPES[r.needs].name+" in the village. Then "+r.name+" will write to you!"};
}
// next thing to do in the village (hint system)
function villageHint(){
  if(!G.vil.open)return null;
  if(G.vil.letters.length)return QUESTS['v_'+G.vil.letters[0]].hint();
  if(G.q.vfound===1&&!builtList().length)return QUESTS.vfound.hint();
  for(const r of RESIDENTS)if(G.q['v_'+r.id]===0)return QUESTS['v_'+r.id].hint();
  if(!G.flags.village)return happiness()>=FINALE_HAPPY?"The village is happy! Talk to Foreman Barnaby for the Grand Harvest Festival!":QUESTS.vharvest.hint();
  return null;
}
