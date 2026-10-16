import fs from 'node:fs/promises';
const read=async name=>JSON.parse(await fs.readFile(new URL('./'+name,import.meta.url),'utf8'));
const [regression,layout,ui,captures]=await Promise.all(['game-checks.json','layout-checks.json','ui-checks.json','capture-checks.json'].map(read));
// The focused rerun supersedes the initial route result after clearing the pond approach.
const results={...regression,city_layout:layout.city_layout,standalone:captures.standalone,ui};
const suites=['city_layout','city','smoke','village_layout','village','coastal','seas','sky'];
const counts=Object.fromEntries(suites.map(k=>[k,Object.entries(results[k]).filter(([name,v])=>name!=='allPass'&&typeof v==='boolean').length]));
const allPass=suites.every(k=>results[k].allPass)&&ui.allPass&&captures.standalone.allPass&&![regression,layout,captures,ui].some(r=>r.errors.length);
const report={allPass,gameplayChecks:Object.values(counts).reduce((a,b)=>a+b,0),counts,sources:{regressions:'game-checks.json',cityLayoutRerun:'layout-checks.json',ui:'ui-checks.json',captures:'capture-checks.json'},results};
await fs.writeFile(new URL('./final-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify({allPass,gameplayChecks:report.gameplayChecks,counts}));if(!allPass)process.exitCode=1;
