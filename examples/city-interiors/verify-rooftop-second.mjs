import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
const out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1000,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/city-interiors/rooftop-second-take.html');
 const f=page.frameLocator('iframe'),root=f.locator('#chick-roof-second');await root.waitFor();
 await f.locator('[data-roof-state]').filter({hasText:'Gull: warning'}).waitFor();await page.waitForTimeout(300);
 const sceneHashes=[];
 for(const section of ['0','1','2']){
  await f.locator('#roof-take-section').selectOption(section);
  sceneHashes.push(await f.locator('[data-roof-screen]').evaluate(c=>c.toDataURL()));
  await f.locator('[data-roof-screen]').screenshot({path:out('second-take-section-'+section+'.png')});
 }
 await f.locator('#roof-take-section').selectOption('1');
 await root.screenshot({path:out('second-take-review.png')});
 const overview=await f.locator('[data-roof-block]').evaluate(c=>c.toDataURL().split(',')[1]);await fs.writeFile(out('second-take-block.png'),Buffer.from(overview,'base64'));
 const phaseNames=[],phaseHashes=[];
 for(let i=0;i<4;i++){
  await f.locator('#roof-gull-step').click();phaseNames.push(await f.locator('[data-roof-state]').textContent());
  phaseHashes.push(await f.locator('[data-roof-screen]').evaluate(c=>c.toDataURL()));
  await f.locator('[data-roof-screen]').screenshot({path:out('second-take-gull-'+i+'.png')});
 }
 const controlChanges=await root.evaluate(async root=>{
  window.__roofBindings=[];window.Tweak=class{constructor(o){this.onChange=o.onChange;}addToggle(o,k){window.__roofBindings.push({o,k,onChange:this.onChange});}};
  const script=[...document.scripts].find(s=>s.textContent.includes("const root=document.getElementById('chick-roof-second')"));(0,eval)(script.textContent);
  await new Promise(resolve=>setTimeout(resolve,100));
  const changes={};
  for(const b of window.__roofBindings){const c=root.querySelector('[data-roof-block]'),before=c.toDataURL();b.o[b.k]=!b.o[b.k];b.onChange();changes[b.k]=c.toDataURL()!==before;b.o[b.k]=!b.o[b.k];b.onChange();}
  return changes;
 });
 const sizes=[];
 for(const width of [736,320]){await page.setViewportSize({width,height:1100});await page.waitForTimeout(100);sizes.push(await root.evaluate(r=>({width:r.clientWidth,scroll:r.scrollWidth})));}
 await root.screenshot({path:out('second-take-mobile.png')});
 const report={errors,uniqueSections:new Set(sceneHashes).size,phaseNames,uniqueGullPhases:new Set(phaseHashes).size,controlChanges,sizes};
 report.allPass=!errors.length&&report.uniqueSections===3&&report.uniqueGullPhases===4&&Object.values(controlChanges).every(Boolean)&&sizes.every(s=>s.width===s.scroll);
 await fs.writeFile(out('second-take-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
