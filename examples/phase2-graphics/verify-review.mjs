if(process.argv.includes('--landscape-ui')){await import('./verify-landscape-ui.mjs');process.exit(process.exitCode||0);}
if(process.argv.includes('--landscapes')){await import('./verify-landscapes.mjs');process.exit(process.exitCode||0);}
if(process.argv.includes('--coast-peaks')){await import('./verify-coast-peaks.mjs');process.exit();}
if(process.argv.includes('--terrain-assets')){await import('./capture-terrain.mjs');process.exit();}
if(process.argv.includes('--implemented-ui')){await import('./verify-implemented-ui.mjs');process.exit();}
if(process.argv.includes('--game')){await import('./verify-game.mjs');process.exit();}
if(process.argv.includes('--forest-sprites')){await import('./verify-forest-sprites.mjs');process.exit();}
import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true}),out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1000,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8082/examples/phase2-graphics/review.html');
 const f=page.frameLocator('iframe'),root=f.locator('#chick-phase-two');await root.waitFor();await page.waitForTimeout(300);
 const scenes=['forest0','forest1','beach0','beach1','mountains0','mountains1'],hashes={landscape:[],refresh:[]},progressChanges={};
 for(const direction of ['landscape','refresh']){
  if(direction==='refresh')await f.getByRole('button',{name:'Next variant',exact:true}).click();
  const panel=f.locator('[data-direction="'+direction+'"]');
  for(const scene of scenes){
   await f.locator('#phase-two-scene').selectOption(scene);await f.locator('#phase-two-progress').selectOption('early');const before=await panel.locator('[data-proposed]').evaluate(c=>c.toDataURL());hashes[direction].push(before);
   await panel.locator('[data-proposed]').screenshot({path:out('concept-'+direction+'-'+scene+'.png')});
   await panel.locator('[data-overview]').screenshot({path:out('overview-'+direction+'-'+scene.slice(0,-1)+'.png')});
   await f.locator('#phase-two-progress').selectOption('helped');const after=await panel.locator('[data-proposed]').evaluate(c=>c.toDataURL());progressChanges[direction+'-'+scene]=before!==after;
   if(scene==='forest0'||scene==='mountains0')await panel.locator('[data-proposed]').screenshot({path:out('concept-'+direction+'-'+scene+'-helped.png')});
  }
 }
 await f.getByRole('button',{name:'Previous variant',exact:true}).click();await f.locator('#phase-two-scene').selectOption('forest0');await f.locator('#phase-two-progress').selectOption('early');await root.screenshot({path:out('review-desktop.png')});
 const controls=await root.evaluate(async root=>{
  window.__phaseBindings=[];window.Tweak=class{constructor(o){this.onChange=o.onChange;}addToggle(o,k){window.__phaseBindings.push({o,k,change:this.onChange});}};
  const script=[...document.scripts].find(s=>s.textContent.includes("const root=document.getElementById('chick-phase-two')"));(0,eval)(script.textContent);await new Promise(resolve=>setTimeout(resolve,100));
  const results={};for(const b of window.__phaseBindings){const c=root.querySelector('[data-direction="landscape"] [data-proposed]'),before=c.toDataURL();b.o[b.k]=!b.o[b.k];b.change();results[b.k]=before!==c.toDataURL();b.o[b.k]=!b.o[b.k];b.change();}return results;
 });
 const sizes=[];for(const width of [736,320]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(100);sizes.push(await root.evaluate(r=>({width:r.clientWidth,scroll:r.scrollWidth})));}await root.screenshot({path:out('review-mobile.png')});
 const report={errors,uniqueLandscapeScenes:new Set(hashes.landscape).size,uniqueRefreshScenes:new Set(hashes.refresh).size,progressChanges,controls,sizes};
 // These states change in the local scene; the river, turtle shore and rescue/egg areas must visibly respond.
 report.allPass=!errors.length&&report.uniqueLandscapeScenes===6&&report.uniqueRefreshScenes===6&&['landscape-forest0','landscape-forest1','landscape-beach0','landscape-mountains0','landscape-mountains1'].every(k=>progressChanges[k])&&Object.values(controls).every(Boolean)&&sizes.every(s=>s.width===s.scroll);
 await fs.writeFile(out('review-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
