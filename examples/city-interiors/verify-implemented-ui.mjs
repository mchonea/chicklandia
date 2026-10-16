import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
const out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/city-interiors/implemented.html');
 const rooms=await page.locator('#room option').evaluateAll(o=>o.map(v=>v.value));
 for(const room of rooms){await page.locator('#room').selectOption(room);images.push(await page.locator('#room-after').evaluate(async i=>{await i.decode();return i.naturalWidth===768;}));}
 await page.locator('#room').selectOption('bakery');await page.screenshot({path:out('implemented-gallery-rooms.png'),fullPage:true});
 await page.locator('#roofs-tab').click();const roofVisible=await page.locator('#roofs-panel').isVisible();
 for(const roof of ['0','1','2']){await page.locator('#roof').selectOption(roof);images.push(await page.locator('#roof-after').evaluate(async i=>{await i.decode();return i.naturalWidth===768;}));}
 await page.locator('#roof').selectOption('1');await page.screenshot({path:out('implemented-gallery-roofs.png'),fullPage:true});
 await page.setViewportSize({width:320,height:1000});const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);await page.screenshot({path:out('implemented-gallery-mobile.png'),fullPage:true});
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));await phone.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await phone.goto('http://127.0.0.1:8082/?debug=1');await phone.waitForFunction(()=>!!window.__chick);
 await phone.evaluate(()=>{newGame();G.autoMom=0;G.part2=true;G.rank=7;G.skills=new Set(['hop','glide','peck']);G.hearts=maxHearts();G.clock=DAY*.3;SET.music=0;SET.sound=0;state='play';fade=0;const e=ents.find(e=>e.id==='fizz');__chick.tp(e.x,e.y+43);P.dir=1;updateTouchUI();render();});
 await phone.locator('#btnA').tap();const talks=await phone.evaluate(()=>{__chick.step(1);return state==='talk'||state==='catalog';});
 await phone.evaluate(()=>{state='play';dlg=null;startRace();__chick.step(33);G.race.t=500;__chick.tp(1559,1459);toasts=[];updateTouchUI();render();});
 await phone.screenshot({path:out('implemented-phone-roof.png')});
 const text=await phone.evaluate(()=>{const checks=[];for(const big of [false,true])for(const time of [.3,.8]){SET.big=big;G.clock=DAY*time;TQ=[];render();checks.push(TQ.filter(t=>t.y<HUD).every(t=>{const w=measure(t.s,t.size);return t.align==='right'?t.x-w>=0:t.align==='center'?t.x-w/2>=0&&t.x+w/2<=W:t.x+w<=W;}));}return checks.every(Boolean);});
 const report={roomImages:rooms.length,allImagesLoad:images.every(Boolean),roofVisible,fits320:fits,mobileTalkButton:talks,bigAndNightRaceTextFits:text,errors};report.allPass=images.every(Boolean)&&roofVisible&&fits&&talks&&text&&!errors.length;
 await fs.writeFile(out('implemented-ui-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
