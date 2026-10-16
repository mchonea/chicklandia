import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true}),out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/phase2-graphics/landscapes-implemented.html');
 for(const area of ['beach0','beach1','mountains0','mountains1'])for(const stage of ['early','helped']){await page.locator('#area').selectOption(area);await page.locator('#stage').selectOption(stage);images.push(await page.locator('#after').evaluate(async i=>{await i.decode();return i.naturalWidth===256&&i.naturalHeight===192;}));}
 await page.locator('#area').selectOption('beach0');await page.locator('#stage').selectOption('early');await page.screenshot({path:out('landscape-gallery-desktop.png'),fullPage:true});
 await page.setViewportSize({width:320,height:1000});const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);await page.screenshot({path:out('landscape-gallery-mobile.png'),fullPage:true});
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));await phone.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await phone.goto('http://127.0.0.1:8082/?debug=1');await phone.waitForFunction(()=>!!window.__chick);await phone.evaluate(()=>document.fonts.ready);
 await phone.evaluate(()=>{newGame();G.autoMom=0;G.part2=true;G.rank=7;G.gp=420;G.skills=new Set(['peck','quick']);G.hearts=maxHearts();G.clock=DAY*.3;SET.music=0;SET.sound=0;state='play';fade=0;__chick.tp(100,1241);P.dir=1;updateTouchUI();render();});
 await phone.locator('#btnA').tap();const talks=await phone.evaluate(()=>{__chick.step(1);return state==='talk';});
 await phone.evaluate(()=>{state='play';dlg=null;__chick.tp(308,1244);P.dir=1;P.peckCd=0;updateTouchUI();render();});
 await phone.locator('#btnA').tap();const fishes=await phone.evaluate(()=>{__chick.step(1);return G.items.fish===1;});
 await phone.evaluate(()=>{state='play';dlg=null;G.skills.add('super');__chick.tp(104,860);P.dir=1;P.peckCd=0;updateTouchUI();render();});
 await phone.locator('#btnA').tap();const rescues=await phone.evaluate(()=>{__chick.step(1);return !!G.flags.mo;});
 await phone.evaluate(()=>{G.skills.add('flap');updateTouchUI();});
 const text=await phone.evaluate(()=>{const checks=[];for(const big of [false,true])for(const time of [.3,.8])for(const [x,y] of [[132,1253],[363,1253],[146,904],[350,904]]){SET.big=big;G.clock=DAY*time;__chick.tp(x,y);toasts=[];TQ=[];render();checks.push(TQ.filter(t=>t.y<HUD).every(t=>{const w=measure(t.s,t.size);return t.align==='right'?t.x-w>=0:t.align==='center'?t.x-w/2>=0&&t.x+w/2<=W:t.x+w<=W;}));}return checks.every(Boolean);});
 await phone.evaluate(()=>{SET.big=false;G.clock=DAY*.3;__chick.tp(132,1253);render();});await phone.screenshot({path:out('landscape-phone-beach.png')});
 await phone.evaluate(()=>{G.clock=DAY*.8;__chick.tp(350,904);render();});await phone.screenshot({path:out('landscape-phone-peak-night.png')});
 const controls=await phone.evaluate(()=>['btnA','btnB','dpad'].every(id=>{const b=document.getElementById(id).getBoundingClientRect();return b.width>40&&b.left>=0&&b.right<=innerWidth&&b.bottom<=innerHeight;}));
 const report={galleryStates:images.length,allImagesLoad:images.every(Boolean),fits320:fits,mobileSandyTalk:talks,mobileFishing:fishes,mobileSuperPeckRescue:rescues,dayNightAndLargeTextFits:text,mobileControlsFit:controls,errors};report.allPass=images.every(Boolean)&&fits&&talks&&fishes&&rescues&&text&&controls&&!errors.length;
 await fs.writeFile(out('landscape-ui-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
