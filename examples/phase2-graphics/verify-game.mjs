import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
 const suites=process.argv.includes('--smoke-only')?['smoke']:process.argv.includes('--all')?['landscapes','forest_layout','city_interiors','city_layout','city','smoke','village_layout','village','coastal','seas','sky']:['forest_layout'];
 const order=JSON.parse(await fs.readFile(new URL('../../src/order.json',import.meta.url),'utf8')),digest=createHash('sha256');
 for(const file of [...order.map(p=>'src/'+p),...suites.map(s=>'tests/'+s+'.js'),'tests/walk.js'])digest.update(await fs.readFile(new URL('../../'+file,import.meta.url)));
 const fingerprint=digest.digest('hex'),checkpoint=new URL('./game-checkpoint.json',import.meta.url);
 if(process.argv.includes('--resume'))try{const previous=JSON.parse(await fs.readFile(checkpoint,'utf8'));if(previous.fingerprint===fingerprint)Object.assign(report,previous.results);}catch{}
 for(const suite of suites){
  if(report[suite]?.allPass){console.log(suite+': retained passing result');continue;}
  report[suite]=await page.evaluate(await fs.readFile(new URL('../../tests/'+suite+'.js',import.meta.url),'utf8'));
  await fs.writeFile(checkpoint,JSON.stringify({fingerprint,results:report},null,2));
  console.log(suite+': '+JSON.stringify(report[suite]));
 }
 const captures=await page.evaluate(()=>{
  const shots={};
  for(const lv of [0,1,2,3,4]){
   newGame();G.autoMom=0;G.part2=true;G.rank=7;G.gp=420;G.skills=new Set(['peck','quick','hop','glide','flap']);G.hearts=maxHearts();G.clock=DAY*.3;G.weather='clear';G.wInt=0;SET.music=0;SET.sound=0;state='play';fade=0;tick=110;
   if(lv){G.flags.dam=true;G.flags.fawn=true;G.thumb=true;G.coop={site:'forest',lv,extra:lv===4?4:0};}makeEnts();
   if(lv)for(const [i,e] of ents.filter(e=>e.type==='plot'&&regionOfPos(e.x,e.y)?.id==='forest').entries())G.plots[e.id]={p:i%3===0?.1:i%3===1?.7:1,k:i===4?'moon':'plain'};
   toasts=[];parts=[];floats=[];shake=0;
   for(let scene=0;scene<2;scene++){__chick.tp(scene*256+132,1068);P.inv=0;TQ=[];render();const c=mk(256,192,g=>{g.imageSmoothingEnabled=false;g.drawImage(cv,0,96,768,576,0,0,256,192);});shots['forest'+scene+'-level'+lv]=c.toDataURL();}
  }return shots;
 });
 for(const [id,url] of Object.entries(captures))await fs.writeFile(new URL('./implemented-'+id+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 await fs.writeFile(new URL('./implemented-captures.json',import.meta.url),JSON.stringify(captures));
 await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
 report.standalone=await page.evaluate(()=>{newGame();G.autoMom=0;G.part2=true;G.coop={site:'forest',lv:4,extra:4};G.flags.dam=true;makeEnts();__chick.tp(206,1129);fade=0;render();return {allPass:FOREST_TREES.length>70&&ents.filter(e=>e.type==='plot'&&e.coop).length===12&&!pBlocked(P.x,P.y)&&!!DOORS['12,69']};});
 report.errors=errors;report.allPass=!errors.length&&Object.values(report).every(v=>v?.allPass!==false);
 report.gameplayChecks=suites.reduce((n,suite)=>n+Object.entries(report[suite]).filter(([k,v])=>k!=='allPass'&&typeof v==='boolean').length,0);
 await fs.writeFile(new URL(process.argv.includes('--smoke-only')?'./smoke-checks.json':process.argv.includes('--all')?'./game-checks.json':'./forest-layout-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log('Final: '+JSON.stringify({allPass:report.allPass,gameplayChecks:report.gameplayChecks,errors}));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
