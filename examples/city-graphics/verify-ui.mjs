import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/city-graphics/implemented.html');
 for(const time of ['day','night']){
  await page.locator('[data-time="'+time+'"]').click();
  checks.push(await page.locator('#overview').evaluate(async i=>{await i.decode();return i.naturalWidth===768;}));
  for(const scene of ['gate','street','park','market','homes','harbor']){
   await page.locator('[data-scene="'+scene+'"]').click();
   for(const mode of ['before','after']){await page.locator('[data-mode="'+mode+'"]').click();checks.push(await page.locator('#scene').evaluate(async i=>{await i.decode();return i.naturalWidth>0;}));}
  }
 }
 await page.locator('[data-time="day"]').click();await page.locator('[data-scene="street"]').click();
 await page.screenshot({path:fileURLToPath(new URL('./implemented-desktop.png',import.meta.url)),fullPage:true});
 await page.setViewportSize({width:320,height:1000});const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 await page.screenshot({path:fileURLToPath(new URL('./implemented-gallery-mobile.png',import.meta.url)),fullPage:true});
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));
 await phone.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await phone.goto('http://127.0.0.1:8082/?debug=1');await phone.waitForFunction(()=>!!window.__chick);
 await phone.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.part2=true;G.clock=DAY*.3;G.rank=7;G.hearts=maxHearts();fade=0;SET.music=0;SET.sound=0;state='play';const b=BUILDINGS.find(b=>b.id==='boutique');__chick.tp(b.out.x,b.out.y);updateTouchUI();render();");});
 const pad=phone.locator('#dpad'),r=await pad.boundingBox(),event={pointerId:7,pointerType:'touch',clientX:r.x+r.width/2,clientY:r.y+r.height*.15,bubbles:true};
 await pad.dispatchEvent('pointerdown',event);const enters=await phone.evaluate(()=>{__chick.step(60);return cellAt().id==='boutique';});await pad.dispatchEvent('pointerup',event);
 await phone.evaluate(()=>{(0,eval)("state='play';dlg=null;fade=0;const m=ents.find(e=>e.id==='maggie');__chick.tp(m.x,m.y+14);P.dir=1;updateTouchUI();TQ=[];render();");});
 await phone.locator('#btnA').tap();const talks=await phone.evaluate(()=>{__chick.step(1);return state==='talk';});
 await phone.evaluate(()=>{(0,eval)("state='play';dlg=null;fade=0;__chick.tp(896,1064);updateTouchUI();TQ=[];render();");});
 await phone.screenshot({path:fileURLToPath(new URL('./implemented-phone.png',import.meta.url))});
 const bigText=await phone.evaluate(()=>{const out=[];for(const big of [false,true])for(const t of [.3,.8]){(0,eval)(`SET.big=${big};G.clock=DAY*${t};TQ=[];render();`);out.push((0,eval)("TQ.filter(t=>t.y>=62&&t.y<=74).every(t=>t.x-measure(t.s,t.size)/2>=0&&t.x+measure(t.s,t.size)/2<=W)"));}return out.every(Boolean);});
 const report={gallery:{images:checks.every(Boolean),fitsPhone:fits},mobile:{entersShop:enters,talkButton:talks,bigTextFits:bigText},errors};report.allPass=checks.every(Boolean)&&fits&&enters&&talks&&bigText&&!errors.length;
 await fs.writeFile(new URL('./ui-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
