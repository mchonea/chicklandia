import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true}),out=name=>new URL('./'+name,import.meta.url);
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 if(process.argv.includes('--baseline')){
  const shots=await page.evaluate(()=>{const shots={};for(let lv=1;lv<=4;lv++){newGame();G.autoMom=0;G.part2=true;G.rank=7;G.gp=420;G.coop={site:'forest',lv};G.sibs=['peep','cheep','tweet'];G.clock=DAY*.3;G.weather='clear';G.wInt=0;SET.music=0;SET.sound=0;state='play';fade=0;tick=110;makeEnts();__chick.tp(COOP_IN.x,COOP_IN.y);toasts=[];parts=[];floats=[];shake=0;P.inv=0;TQ=[];render();shots['level'+lv]=mk(256,192,g=>g.drawImage(cv,0,96,768,576,0,0,256,192)).toDataURL();}return shots;});
  // Only run before implementation; this frozen reference is deliberately separate.
  await fs.writeFile(out('baseline.json'),JSON.stringify(shots),{flag:'wx'});console.log('Captured original coop interiors.');
 }else{
  await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
  if(!process.argv.includes('--captures-only')){report.gameplay=await page.evaluate(await fs.readFile(new URL('../../tests/coop_interior.js',import.meta.url),'utf8'));console.log(JSON.stringify(report.gameplay));}
  const captures=await page.evaluate(()=>{const shots={};for(let lv=1;lv<=4;lv++)for(const progress of ['early','earned']){
   newGame();G.autoMom=0;G.part2=true;G.rank=7;G.gp=420;G.skills=new Set(['peck','quick','fly']);G.coop={site:'forest',lv};G.sibs=['peep','cheep','tweet'];G.clock=DAY*.3;G.weather='clear';G.wInt=0;SET.music=0;SET.sound=0;state='play';fade=0;tick=110;
   if(progress==='earned'){for(const id of ORDER2)G.q[id]=2;G.harvests=24;G.mgFirst={egg:1,bonk:1,ffly:1};G.best.race=37;G.flags.village=1;G.flags.seas=1;G.flags.sky=1;for(const e of EXHIBITS)G.museum[e.id]=e.need;}
   makeEnts();toasts=[];parts=[];floats=[];shake=0;
   for(const floor of lv===1?['home']:['home','loft']){const o=coopRoomOrigin(floor);__chick.tp(o.x+128,o.y+(floor==='home'?168:136));P.inv=0;TQ=[];render();shots['level'+lv+'-'+floor+'-'+progress]=mk(256,192,g=>g.drawImage(cv,0,96,768,576,0,0,256,192)).toDataURL();}
  }return shots;});
  for(const [id,url] of Object.entries(captures))await fs.writeFile(out('implemented-'+id+'.png'),Buffer.from(url.split(',')[1],'base64'));
  await fs.writeFile(out('captures.json'),JSON.stringify(captures));
  await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
  report.standalone=await page.evaluate(()=>{newGame();G.coop={site:'forest',lv:4};makeEnts();const o=coopRoomOrigin('loft');__chick.tp(o.x+128,o.y+136);fade=0;render();return {allPass:regionAt()?.id==='cooploft'&&COOP_TROPHIES.length===10&&!pBlocked(P.x,P.y)};});
  report.errors=errors;report.allPass=report.gameplay?.allPass!==false&&report.standalone.allPass&&!errors.length;await fs.writeFile(out(process.argv.includes('--captures-only')?'capture-checks.json':'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({allPass:report.allPass,errors}));if(!report.allPass)process.exitCode=1;
 }
}finally{await browser.close();}
