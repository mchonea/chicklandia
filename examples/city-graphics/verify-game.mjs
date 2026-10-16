import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 if(process.argv.includes('--checks')||process.argv.includes('--all')||process.argv.includes('--layout-only')){
  await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
  const suites=process.argv.includes('--layout-only')?['city_layout']:process.argv.includes('--all')?['city_layout','city','smoke','village_layout','village','coastal','seas','sky']:['city_layout','city','smoke','coastal','seas'];
  for(const suite of suites){report[suite]=await page.evaluate(await fs.readFile(new URL('../../tests/'+suite+'.js',import.meta.url),'utf8'));console.log(suite+': '+JSON.stringify(report[suite]));}
 }
 await page.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.rank=8;G.sea.open=true;G.flags.pinchMap=true;G.skills=new Set(['peck','quick','hop','carry','glide']);G.hearts=maxHearts();fade=0;tick=100;SET.music=0;SET.sound=0;state='play';openVillage();makeEnts();toasts=[];");});
 const captures={};
 for(const [phase,t] of [['day',.3],['night',.8]]){
  const urls=[];
  for(const [i,key] of ['gate','street','park','market','homes','harbor'].entries()){
   const sx=2+i%3,sy=5+Math.floor(i/3);
   await page.evaluate(([sx,sy,t])=>{(0,eval)(`G.clock=DAY*${t};updateSchedules(true);__chick.tp(${sx*256+128},${sy*192+108});fade=0;TQ=[];render();`);},[sx,sy,t]);
   await page.screenshot({path:fileURLToPath(new URL('./implemented-'+phase+'-'+key+'.png',import.meta.url))});
   urls.push(await page.evaluate(()=>{const x=P.x,y=P.y;P.x=-1000;P.y=-1000;TQ=[];render();const s=(0,eval)('cv.toDataURL()');P.x=x;P.y=y;return s;}));
  }
  const overview=await page.evaluate(async urls=>{const c=document.createElement('canvas');c.width=768;c.height=384;const g=c.getContext('2d');g.imageSmoothingEnabled=false;for(const [i,url] of urls.entries()){const im=new Image();im.src=url;await im.decode();g.drawImage(im,0,96,768,576,i%3*256,Math.floor(i/3)*192,256,192);}return c.toDataURL();},urls);
  await fs.writeFile(new URL('./implemented-'+phase+'-overview.png',import.meta.url),Buffer.from(overview.split(',')[1],'base64'));
  captures[phase]=urls;
 }
 await fs.writeFile(new URL('./implemented-captures.json',import.meta.url),JSON.stringify(captures));
 await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
 report.standalone=await page.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.part2=true;G.clock=DAY*.3;__chick.tp(896,1064);fade=0;render();");return {allPass:(0,eval)("CITY_LOTS.length===13&&CITY_PROPS.length>30&&tileAt(...BUILDINGS.find(b=>b.id==='boutique').door)==='1'")};});
 report.errors=errors;await fs.writeFile(new URL(process.argv.includes('--layout-only')?'./layout-checks.json':process.argv.includes('--checks')||process.argv.includes('--all')?'./game-checks.json':'./capture-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log('Browser errors: '+JSON.stringify(errors));
 if(errors.length||Object.values(report).some(v=>v?.allPass===false))process.exitCode=1;
}finally{await browser.close();}
