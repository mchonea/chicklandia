import fs from 'fs';let s=fs.readFileSync('tests/seas.js','utf8');
function rep(a,b){if(!s.includes(a)){console.log('MISSING '+a.slice(0,60));return;}s=s.replace(a,b);}
rep("// 5. skills\n","// 5. skills\nG.sea.visited={cove:1,reef:1,volcano:1,lighthouse:1};G.skills.add('dash');\n");
rep("// 8. quests\n","// 8. quests\nG.sea.salv={sailcloth:0,hullplank:0,cannonpart:0};for(const k of ['crate','pearl','wreckbell','sunstone','ironore','powderkeg','conch'])G.items[k]=0;\n");
rep("for(let i=0;i<60;i++)updBoss(bossEnt());ok('stage_clear_saves_progress',G.sea.boss===2);","for(let i=0;i<60;i++){const e=bossEnt();if(!e||e.dead)break;updBoss(e);}ok('stage_clear_saves_progress',G.sea.boss===2);");
rep("for(let i=0;i<60;i++)if(bossEnt())updBoss(bossEnt());for(let i=0;i<10&&state==='talk';i++)","for(let i=0;i<60;i++){const e=bossEnt();if(!e||e.dead)break;updBoss(e);}for(let i=0;i<10&&state==='talk';i++)");
fs.writeFileSync('tests/seas.js',s);
