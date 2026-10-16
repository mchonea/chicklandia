import fs from 'node:fs/promises';
const read=async name=>JSON.parse(await fs.readFile(new URL('./'+name,import.meta.url),'utf8'));
const [game,ui,landscape,landscapeUI,smoke]=await Promise.all(['game-checks.json','implemented-ui-checks.json','landscape-checks.json','landscape-ui-checks.json','smoke-checks.json'].map(read));
// The full run caught the old smoke walker repeatedly walking into the moved
// crabs. Its normal peck defense and the final clear-of-tree fossil placement
// were then checked in targeted runs; retain those latest results explicitly.
const results={...game,landscapes:landscape.gameplay,smoke:smoke.smoke,ui,landscapeUI};
const suites=['landscapes','forest_layout','city_interiors','city_layout','city','smoke','village_layout','village','coastal','seas','sky'];
const counts=Object.fromEntries(suites.map(k=>[k,Object.entries(results[k]).filter(([name,v])=>name!=='allPass'&&typeof v==='boolean').length]));
results.errors=[...new Set([...game.errors,...smoke.errors,...landscape.errors,...ui.errors,...landscapeUI.errors])];
results.standalone={allPass:game.standalone.allPass&&smoke.standalone.allPass&&landscape.standalone.allPass};
results.allPass=suites.every(s=>results[s].allPass)&&results.standalone.allPass&&ui.allPass&&landscapeUI.allPass&&!results.errors.length;
results.gameplayChecks=Object.values(counts).reduce((a,b)=>a+b,0);
const report={allPass:results.allPass,gameplayChecks:results.gameplayChecks,counts,sources:{fullRun:'game-checks.json',finalSmoke:'smoke-checks.json',finalLandscapes:'landscape-checks.json',forestUI:'implemented-ui-checks.json',landscapeUI:'landscape-ui-checks.json'},validationNotes:['Full regression run followed by targeted smoke and landscape checks after the final collectible placement.','The smoke explorer uses normal peck input to defend against the arranged shore crabs.'],results};
await fs.writeFile(new URL('./final-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify({allPass:report.allPass,gameplayChecks:report.gameplayChecks,counts}));if(!report.allPass)process.exitCode=1;
