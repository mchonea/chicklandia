import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/content/quests_city.js',[["const QUEST_GIVER={cookoff:'remy',vane:'pidge'};","const QUEST_GIVER={cookoff:'remy',vane:'pidge',babysit:'waddles',portrait:'pablo'};\nconst QUEST_OF={pablo:'portrait',waddles:'babysit'};       // npc id -> quest id when they differ"]]);
ed('src/systems/dialogue.js',[["  let qid=e.id;if(FOLLOWUP","  let qid=QUEST_OF[e.id]||e.id;if(FOLLOWUP"]]);
