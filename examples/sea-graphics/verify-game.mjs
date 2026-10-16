import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
await page.goto('http://127.0.0.1:8082/?debug=1');await page.evaluate(()=>document.fonts.ready);
await page.waitForFunction(()=>!!window.__chick);
const report={};
await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
for(const suite of (process.argv.includes('--capture-only')?[]:process.argv.includes('--coastal-only')?['coastal']:process.argv.includes('--all')?['coastal','seas','city','smoke','village','sky']:['coastal','seas'])){
  report[suite]=await page.evaluate(await fs.readFile(new URL('../../tests/'+suite+'.js',import.meta.url),'utf8'));
  console.log(suite+': '+JSON.stringify(report[suite]));
}
await page.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.sea.open=true;G.flags.pinchMap=1;G.sea.lv={sails:1,hull:1,cannon:1};G.flags.lit=1;G.rank=8;G.skills=new Set(['peck','quick','hop','glide','swim','dive','dash','flap']);G.hearts=maxHearts();fade=0;state='play';tick=100;SET.music=0;SET.sound=0;makeEnts();");});
const shots={
  harbor:"state='play';__chick.tp(69*16+8,78*16+12)",
  map:"openSailMap();SAIL.sel=1",
  sailing:"state='voyage';SAIL=null;VOY={from:SEA_NODES[0],to:SEA_NODES[1],t:70,dur:150}",
  cove:"state='play';VOY=null;__chick.tp(56,1868)",
  coveEast:"__chick.tp(376,1850)",
  reef:"__chick.tp(824,1868)",
  reefEast:"__chick.tp(1144,1850)",
  volcano:"__chick.tp(56,2252)",
  lighthouse:"__chick.tp(376,2620)",
  flagship:"__chick.tp(824,2640)",
  locked:"__chick.tp(69*16+8,78*16+12);G.sea.lv={sails:0,hull:0,cannon:0};G.flags.lit=0;openSailMap();SAIL.sel=5",
  baseShip:"SAIL=null;state='voyage';VOY={from:SEA_NODES[0],to:SEA_NODES[1],t:70,dur:150}"
};
for(const [name,code] of Object.entries(shots)){
  await page.evaluate(code+';TQ=[];render()');
  await page.screenshot({path:fileURLToPath(new URL('./implemented-'+name+'.png',import.meta.url))});
}
await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
report.standalone=await page.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.sea.open=1;fade=0;openSailMap();render();state='voyage';VOY={from:SEA_NODES[0],to:SEA_NODES[1],t:50,dur:150};render();");return {allPass:!!window.__chick};});
const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
phone.on('pageerror',e=>errors.push(e.message));await phone.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
await phone.goto('http://127.0.0.1:8082/?debug=1');await phone.evaluate(()=>document.fonts.ready);
await phone.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.part2=true;G.sea.open=1;fade=0;openSailMap();updateTouchUI();render();");});
await phone.screenshot({path:fileURLToPath(new URL('./implemented-mobile.png',import.meta.url))});
report.mobile=await phone.evaluate(()=>{const water=ctx.getImageData(0,80,1,1).data;return {layout:!!(TOUCH&&document.getElementById('btnA').getBoundingClientRect().bottom<=innerHeight&&SAIL&&state==='sail'),painted:water[2]>water[0]};});
await phone.locator('#btnA').tap();report.mobile.setSail=await phone.evaluate(()=>{__chick.step(1);return state==='voyage';});
await phone.evaluate(()=>{(0,eval)("keys.a=false;openSailMap();updateTouchUI();render();");});
await phone.locator('#btnMap').tap();report.mobile.closeMap=await phone.evaluate(()=>{__chick.step(1);return state==='play';});
report.mobile.allPass=Object.values(report.mobile).every(Boolean);
report.errors=errors;const reportPath=new URL(process.argv.includes('--coastal-only')?'./coastal-final-checks.json':'./game-checks.json',import.meta.url);await fs.writeFile(reportPath,JSON.stringify(report,null,2));
console.log('Browser errors: '+JSON.stringify(errors));
await browser.close();
if(errors.length||Object.values(report).some(r=>r&&r.allPass===false))process.exitCode=1;
