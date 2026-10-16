import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true}),out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/phase2-graphics/implemented.html');
 for(const area of ['0','1'])for(const lv of ['0','1','2','3','4']){await page.locator('#area').selectOption(area);await page.locator('#level').selectOption(lv);images.push(await page.locator('#after').evaluate(async i=>{await i.decode();return i.naturalWidth===256&&i.naturalHeight===192;}));}
 await page.locator('#area').selectOption('0');await page.locator('#level').selectOption('2');await page.screenshot({path:out('implemented-gallery-desktop.png'),fullPage:true});
 await page.setViewportSize({width:320,height:1000});const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);await page.screenshot({path:out('implemented-gallery-mobile.png'),fullPage:true});
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));await phone.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await phone.goto('http://127.0.0.1:8082/?debug=1');await phone.waitForFunction(()=>!!window.__chick);await phone.evaluate(()=>document.fonts.ready);
 await phone.evaluate(()=>{newGame();G.autoMom=0;G.part2=true;G.rank=7;G.gp=420;G.skills=new Set(['peck','quick']);G.hearts=maxHearts();G.clock=DAY*.3;SET.music=0;SET.sound=0;state='play';fade=0;__chick.tp(92,1059);P.dir=1;updateTouchUI();render();});
 await phone.locator('#btnA').tap();const talks=await phone.evaluate(()=>{__chick.step(1);return state==='talk';});
 await phone.evaluate(()=>{state='play';dlg=null;G.thumb=true;G.seeds=5;__chick.tp(53,1098);P.dir=1;updateTouchUI();render();});
 await phone.locator('#btnA').tap();const plants=await phone.evaluate(()=>{__chick.step(1);return !!G.plots.plot_5_64;});
 await phone.evaluate(()=>{state='play';dlg=null;G.coop={site:'forest',lv:4,extra:4};applyCoop(true);G.flags.dam=true;__chick.tp(132,1068);toasts=[];render();});await phone.screenshot({path:out('implemented-phone.png')});
 const text=await phone.evaluate(()=>{const checks=[];for(const big of [false,true])for(const time of [.3,.8])for(const x of [132,388]){SET.big=big;G.clock=DAY*time;__chick.tp(x,1068);TQ=[];render();checks.push(TQ.filter(t=>t.y<HUD).every(t=>{const w=measure(t.s,t.size);return t.align==='right'?t.x-w>=0:t.align==='center'?t.x-w/2>=0&&t.x+w/2<=W:t.x+w<=W;}));}return checks.every(Boolean);});
 await phone.evaluate(()=>{SET.big=false;G.clock=DAY*.8;__chick.tp(132,1068);render();});await phone.screenshot({path:out('implemented-phone-night.png')});
 const report={exampleStates:images.length,allImagesLoad:images.every(Boolean),fits320:fits,mobileTalkButton:talks,mobilePlantingButton:plants,dayNightAndLargeTextFits:text,errors};report.allPass=images.every(Boolean)&&fits&&talks&&plants&&text&&!errors.length;
 await fs.writeFile(out('implemented-ui-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
