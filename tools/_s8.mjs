import fs from 'fs';let s=fs.readFileSync('tests/seas.js','utf8');
function rep(a,b){if(!s.includes(a)){console.log('MISSING '+a.slice(0,70));return;}s=s.replace(a,b);}
rep("ok('dive_works',regionAt().id==='deepreef'&&G.air===AIR_MAX);","ok('dive_works',regionAt().id==='deepreef'&&G.air>AIR_MAX-200);");
rep("// 8. quests\n","// 8. quests\nG.skills.delete('cpeck');\n");
rep("G.items.powderkeg=3;talk('ember');ok('ember_training_done',G.train.cpeck===2);","G.items.powderkeg=3;talk('ember');ok('ember_training_done',G.train.cpeck===2);G.skills.add('cpeck');");
rep("for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}reset();\nok('stage3_chase'","for(let i=0;i<10&&state==='talk';i++){pressed.a=true;c.step(30);}\nok('stage3_chase'");
fs.writeFileSync('tests/seas.js',s);
