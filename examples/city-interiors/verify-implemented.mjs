import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 if(!process.argv.includes('--captures-only')){
  await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
  report.gameplay=await page.evaluate(await fs.readFile(new URL('../../tests/city_interiors.js',import.meta.url),'utf8'));console.log(JSON.stringify(report.gameplay,null,2));
 }
 const captures=await page.evaluate(()=>{
  (0,eval)("newGame();G.autoMom=0;G.part2=true;G.rank=7;G.skills=new Set(['peck','quick','hop','glide','flap']);G.hearts=maxHearts();SET.music=0;SET.sound=0;state='play';fade=0;tick=110;makeEnts();");
  const rooms={},roofs=[];
  for(const cell of REGIONS.cityin.cells){
   G.clock=DAY*(['rocco','cleo','loft','bistro'].includes(cell.id)?.8:.3);__chick.tp(100,100);updateSchedules(true);const entry=roomEntry(cell.id);__chick.tp(entry.x,entry.y-4);fade=0;TQ=[];render();rooms[cell.id]=cv.toDataURL();
  }
  G.clock=DAY*.3;startRace();__chick.step(33);toasts=[];G.race.t=500;
  for(const [x,y] of [[55,114],[279,115],[723,93]]){__chick.tp(1280+x,1344+y);const gull=ents.find(e=>e.type==='roofgull');Object.assign(gull,{st:'tell',tx:1559,ty:1456,t:20});G.race.stars=roofs.length*4;TQ=[];render();roofs.push(cv.toDataURL());}
  const block=document.createElement('canvas');block.width=768;block.height=192;const bg=block.getContext('2d');bg.drawImage(roofGround,0,0);for(const [kind,args] of ROOF_SCENERY)CITY_ROOF_ART.prop(bg,kind,args);
  return {rooms,roofs,block:block.toDataURL()};
 });
 for(const [id,url] of Object.entries(captures.rooms))await fs.writeFile(new URL('./implemented-'+id+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 for(const [i,url] of captures.roofs.entries())await fs.writeFile(new URL('./implemented-roof-'+i+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 await fs.writeFile(new URL('./implemented-roof-block.png',import.meta.url),Buffer.from(captures.block.split(',')[1],'base64'));
 await fs.writeFile(new URL('./implemented-captures.json',import.meta.url),JSON.stringify(captures));
 await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
 report.standalone=await page.evaluate(()=>{newGame();G.autoMom=0;G.part2=true;G.rank=7;G.skills=new Set(['hop','glide']);const o=roomEntry('bakery');__chick.tp(o.x,o.y);fade=0;render();const room=!pBlocked(P.x,P.y);startRace();__chick.step(35);return room&&regionAt()?.id==='rooftops'&&!pBlocked(P.x,P.y)&&ents.some(e=>e.type==='roofgull');});
 report.errors=errors;report.allPass=!errors.length&&report.standalone&&report.gameplay?.allPass!==false;
 await fs.writeFile(new URL('./implemented-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log('Final: '+JSON.stringify({allPass:report.allPass,errors,standalone:report.standalone}));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
