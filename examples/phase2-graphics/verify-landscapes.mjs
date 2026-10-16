import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
 if(process.argv.includes('--diagnose-smoke')){
  const body=(await fs.readFile(new URL('../../tests/smoke.js',import.meta.url),'utf8')).replace("ok('spot_'+s.id,", "R[s.id+'_diagnostic']={route:w,state,pos:[P.x,P.y],target:[e.x,e.y],front:frontPoint(),hearts:G.hearts,collected:[...G.collected]};ok('spot_'+s.id,");
  console.log(JSON.stringify(await page.evaluate(body)));process.exitCode=0;
 }else{
 if(!process.argv.includes('--captures-only')){report.gameplay=await page.evaluate(await fs.readFile(new URL('../../tests/landscapes.js',import.meta.url),'utf8'));console.log(JSON.stringify(report.gameplay));}
 const captures=await page.evaluate(()=>{const shots={};for(const stage of ['early','helped']){
  newGame();G.part2=true;G.rank=7;G.skills=new Set(['peck','quick']);G.autoMom=0;G.clock=DAY*.3;G.weather='clear';G.wInt=0;SET.music=0;SET.sound=0;state='play';fade=0;tick=110;
  if(stage==='helped'){G.flags.mo=true;G.turtles=['turtle0','turtle1','turtle2'];G.collected.add('eagleEgg');G.items.eagleEgg=1;G.skills.add('glide');G.skills.add('swim');G.skills.add('super');}
  makeEnts();toasts=[];parts=[];floats=[];shake=0;
  for(const kind of ['beach','mountains'])for(let scene=0;scene<2;scene++){__chick.tp(kind==='beach'?scene*256+132:scene?350:146,landscapeOrigin(kind)+(kind==='beach'?101:136));P.inv=0;TQ=[];render();shots[kind+scene+'-'+stage]=mk(256,192,g=>g.drawImage(pix,0,32,256,192,0,0,256,192)).toDataURL();}
 }return shots;});
 for(const [id,url] of Object.entries(captures))await fs.writeFile(new URL('./applied-'+id+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 await fs.writeFile(new URL('./landscape-captures.json',import.meta.url),JSON.stringify(captures));
 await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
 report.standalone=await page.evaluate(()=>{newGame();G.part2=true;makeEnts();__chick.tp(132,1180);fade=0;render();return {allPass:!!LANDSCAPE_ART&&ents.some(e=>e.kind==='boardwalk')&&!pBlocked(P.x,P.y)&&landscapeFootTile(40,1308)==='w'};});
 report.errors=errors;report.allPass=!errors.length&&report.standalone.allPass&&report.gameplay?.allPass!==false;await fs.writeFile(new URL('./landscape-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify({allPass:report.allPass,errors}));if(!report.allPass)process.exitCode=1;
 }
}finally{await browser.close();}
