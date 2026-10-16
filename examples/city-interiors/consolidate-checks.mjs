import fs from 'node:fs/promises';
const read=async path=>JSON.parse(await fs.readFile(new URL(path,import.meta.url),'utf8'));
const prior=await read('../city-graphics/game-checks.json'),implemented=await read('./implemented-checks.json'),ui=await read('./implemented-ui-checks.json');
const suites=Object.fromEntries(Object.entries(prior).filter(([,v])=>v&&typeof v==='object'&&'allPass' in v&&Object.keys(v).length>1));
suites.city_interiors=implemented.gameplay;
const gameplay=Object.fromEntries(Object.entries(suites).map(([name,r])=>[name,{checks:Object.entries(r).filter(([k,v])=>k!=='allPass'&&typeof v==='boolean').length,allPass:r.allPass}]));
const report={date:'2026-10-16',gameplay,totalGameplayChecks:Object.values(gameplay).reduce((n,v)=>n+v.checks,0),standalone:implemented.standalone,galleryAndMobile:ui.allPass,browserErrors:[...prior.errors,...implemented.errors,...ui.errors]};
report.allPass=Object.values(gameplay).every(s=>s.allPass)&&report.standalone&&report.galleryAndMobile&&!report.browserErrors.length;
await fs.writeFile(new URL('./final-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
