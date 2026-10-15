import fs from 'fs';let s=fs.readFileSync('src/systems/dialogue.js','utf8');
const a="  if(trainTalk(e,it)){say(L);return;}\n  let qid=QUEST_OF[e.id]||e.id;if(FOLLOWUP[e.id]&&G.q[e.id]===2&&G.q[FOLLOWUP[e.id]]!==2&&(!FOLLOW_GATE[e.id]||FOLLOW_GATE[e.id]()))qid=FOLLOWUP[e.id];\n";
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,"  let qid=QUEST_OF[e.id]||e.id;const base=qid;if(FOLLOWUP[e.id]&&G.q[e.id]===2&&G.q[FOLLOWUP[e.id]]!==2&&(!FOLLOW_GATE[e.id]||FOLLOW_GATE[e.id]()))qid=FOLLOWUP[e.id];\n  if(qid===base&&trainTalk(e,it)){say(L);return;}\n");
fs.writeFileSync('src/systems/dialogue.js',s);
