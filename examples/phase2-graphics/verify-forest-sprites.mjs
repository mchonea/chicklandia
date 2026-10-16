import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true}),out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1000,height:1200}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/phase2-graphics/forest-sprites.html');
 const f=page.frameLocator('iframe'),root=f.locator('#chick-forest-mix');await root.waitFor();
 await root.locator('[data-after]').evaluate(c=>new Promise(resolve=>{const check=()=>c.getContext('2d').getImageData(0,0,1,1).data[3]?resolve():setTimeout(check,30);check();}));
 const scenes=[],baselines=[];
 for(const area of ['0','1'])for(const stage of ['early','helped']){
  await f.locator('#forest-mix-area').selectOption(area);await f.locator('#forest-mix-stage').selectOption(stage);
  scenes.push(await root.locator('[data-after]').evaluate(c=>c.toDataURL()));baselines.push(await root.locator('[data-before]').evaluate(c=>c.toDataURL()));
  await root.locator('[data-after]').screenshot({path:out('refined-forest'+area+'-'+stage+'.png')});
 }
 await f.locator('#forest-mix-area').selectOption('0');await f.locator('#forest-mix-stage').selectOption('helped');
 await root.locator('[data-world]').screenshot({path:out('refined-forest-overview.png')});await root.screenshot({path:out('forest-sprites-desktop.png')});
 const exactTrees=await root.evaluate(async r=>{
  const d=JSON.parse(document.getElementById('forest-mix-data').textContent),g=r.querySelector('[data-world]').getContext('2d'),result={};
  for(const [kind,x] of [['tree',64],['oak',208]]){const i=new Image();i.src=d.assets['tile-'+kind];await i.decode();const c=document.createElement('canvas');c.width=c.height=16;const a=c.getContext('2d');a.drawImage(i,0,0);const original=a.getImageData(0,0,16,16).data,revised=g.getImageData(x,0,16,16).data;result[kind]=original.every((v,n)=>v===revised[n]);}return result;
 });
 const controls=await root.evaluate(async r=>{
  window.__forestBindings=[];window.Tweak=class{constructor(o){this.change=o.onChange;}addToggle(o,k){window.__forestBindings.push({o,k,change:this.change});}};
  const script=[...document.scripts].find(s=>s.textContent.includes("const root=document.getElementById('chick-forest-mix')"));(0,eval)(script.textContent);await new Promise(resolve=>setTimeout(resolve,100));
  const result={};for(const b of window.__forestBindings){const c=r.querySelector('[data-world]'),before=c.toDataURL();b.o[b.k]=!b.o[b.k];b.change();result[b.k]=before!==c.toDataURL();b.o[b.k]=!b.o[b.k];b.change();}return result;
 });
 const sizes=[];for(const width of [736,320]){await page.setViewportSize({width,height:2000});await page.waitForTimeout(80);sizes.push(await root.evaluate(r=>({width:r.clientWidth,scroll:r.scrollWidth})));}await root.screenshot({path:out('forest-sprites-mobile.png')});
 await page.emulateMedia({colorScheme:'dark'});await root.screenshot({path:out('forest-sprites-dark.png')});
 const report={errors,uniqueRevisedScenes:new Set(scenes).size,uniqueBaselines:new Set(baselines).size,exactTrees,controls,sizes};
 report.allPass=!errors.length&&report.uniqueRevisedScenes===4&&report.uniqueBaselines===4&&Object.values(exactTrees).every(Boolean)&&Object.values(controls).every(Boolean)&&sizes.every(s=>s.width===s.scroll);
 await fs.writeFile(out('forest-sprites-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
