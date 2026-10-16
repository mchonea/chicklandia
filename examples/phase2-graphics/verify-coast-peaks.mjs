import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true}),out=name=>fileURLToPath(new URL('./'+name,import.meta.url));
try{
 const page=await browser.newPage({viewport:{width:1000,height:1600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8082/examples/phase2-graphics/coast-peaks.html');
 const f=page.frameLocator('iframe'),root=f.locator('#chick-coast-peak');await root.waitFor();await root.locator('[data-after]').evaluate(c=>new Promise(resolve=>{const check=()=>c.getContext('2d').getImageData(0,0,1,1).data[3]?resolve():setTimeout(check,25);check();}));
 const hashes={},progress={};
 for(const area of ['beach0','beach1','mountains0','mountains1']){
  await f.locator('#coast-peak-area').selectOption(area);hashes[area]=[];
  for(const stage of ['early','helped']){
   await f.locator('#coast-peak-stage').selectOption(stage);const data=await root.locator('[data-after]').evaluate(c=>c.toDataURL());hashes[area].push(data);await fs.writeFile(out('refined-'+area+'-'+stage+'.png'),Buffer.from(data.split(',')[1],'base64'));
  }
  progress[area]=hashes[area][0]!==hashes[area][1];await f.locator('#coast-peak-stage').selectOption('early');
  if(area.endsWith('0')){const data=await root.locator('[data-world]').evaluate(c=>c.toDataURL());await fs.writeFile(out('refined-'+area.slice(0,-1)+'-overview.png'),Buffer.from(data.split(',')[1],'base64'));await root.screenshot({path:out('coast-peaks-'+area+'-desktop.png')});}
 }
 const exactTrees={};
 for(const [area,kind,x,y] of [['beach0','palm',0,48],['mountains0','pine',16,36]]){
  await f.locator('#coast-peak-area').selectOption(area);exactTrees[kind]=await root.evaluate(async(r,{kind,x,y})=>{const d=JSON.parse(document.getElementById('coast-peak-data').textContent),i=new Image();i.src=d.assets['tile-'+kind];await i.decode();const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');g.drawImage(i,0,0);const original=g.getImageData(0,0,16,16).data,revised=r.querySelector('[data-world]').getContext('2d').getImageData(x,y,16,16).data;return original.every((v,n)=>v===revised[n]);},{kind,x,y});
 }
 const controls=await root.evaluate(async r=>{
  window.__coastBindings=[];window.Tweak=class{constructor(o){this.change=o.onChange;}addToggle(o,k){window.__coastBindings.push({o,k,change:this.change});}};
  const script=[...document.scripts].find(s=>s.textContent.includes("const root=document.getElementById('chick-coast-peak')"));(0,eval)(script.textContent);await new Promise(resolve=>setTimeout(resolve,100));
  const result={};for(const b of window.__coastBindings){const c=r.querySelector('[data-world]'),before=c.toDataURL();b.o[b.k]=!b.o[b.k];b.change();result[b.k]=before!==c.toDataURL();b.o[b.k]=!b.o[b.k];b.change();}return result;
 });
 const sizes=[];for(const width of [736,320]){await page.setViewportSize({width,height:2000});await page.waitForTimeout(80);sizes.push(await root.evaluate(r=>({width:r.clientWidth,scroll:r.scrollWidth})));}await root.screenshot({path:out('coast-peaks-mobile.png')});await page.emulateMedia({colorScheme:'dark'});await root.screenshot({path:out('coast-peaks-dark.png')});
 const report={errors,uniqueAreas:new Set(Object.values(hashes).map(a=>a[0])).size,progress,exactTrees,controls,sizes};report.allPass=!errors.length&&report.uniqueAreas===4&&progress.beach0&&progress.mountains0&&progress.mountains1&&Object.values(exactTrees).every(Boolean)&&Object.values(controls).every(Boolean)&&sizes.every(s=>s.width===s.scroll);
 await fs.writeFile(out('coast-peaks-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
