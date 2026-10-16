import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1000,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8082/examples/city-interiors/review.html');
 const f=page.frameLocator('iframe');await f.locator('#chick-interiors-review').waitFor();await page.waitForTimeout(350);
 const rooms=['post','bistro','boutique','seed','bakery','toy','library','museum','rocco','cleo','artist','ducks','loft'],hashes=[];
 for(const room of rooms){
  await f.locator('#interior-room').selectOption(room);
  hashes.push(await f.locator('[data-interiors="furnished"] [data-room-view="after"]').evaluate(c=>c.toDataURL()));
  await f.locator('[data-interiors="furnished"] [data-room-view="after"]').screenshot({path:fileURLToPath(new URL('./concept-'+room+'.png',import.meta.url))});
 }
 await f.locator('[data-interiors="furnished"] [data-room-view="contact"]').screenshot({path:fileURLToPath(new URL('./concept-all-interiors.png',import.meta.url))});
 await f.locator('#interior-room').selectOption('bakery');
 const carousel=f.locator('.viz-carousel').nth(0);await carousel.getByRole('button',{name:'Next variant',exact:true}).click();
 const interiorVariant=await f.locator('[data-interiors="art"]').isVisible();
 await f.locator('[data-interiors="art"]').screenshot({path:fileURLToPath(new URL('./concept-existing-layout.png',import.meta.url))});
 await carousel.getByRole('button',{name:'Previous variant',exact:true}).click();
 const roofHashes=[];
 for(const roof of ['0','1','2']){
  await f.locator('#roof-scene').selectOption(roof);roofHashes.push(await f.locator('[data-roofs="circuit"] [data-roof-view="after"]').evaluate(c=>c.toDataURL()));
  await f.locator('[data-roofs="circuit"] [data-roof-view="after"]').screenshot({path:fileURLToPath(new URL('./concept-roof-'+roof+'.png',import.meta.url))});
 }
 await f.locator('[data-roofs="circuit"] [data-roof-view="overview"]').screenshot({path:fileURLToPath(new URL('./concept-circuit.png',import.meta.url))});
 const roofCarousel=f.locator('.viz-carousel').nth(1);await roofCarousel.getByRole('button',{name:'Next variant',exact:true}).click();
 const roofVariant=await f.locator('[data-roofs="art"]').isVisible();
 await f.locator('[data-roofs="art"]').screenshot({path:fileURLToPath(new URL('./concept-roof-art.png',import.meta.url))});
 await roofCarousel.getByRole('button',{name:'Previous variant',exact:true}).click();
 const controls=await f.locator('#chick-interiors-review').evaluate(root=>{
  window.__interiorBindings=[];window.Tweak=class{constructor(o){this.onChange=o.onChange;}addToggle(o,k){window.__interiorBindings.push({o,k,onChange:this.onChange});}};
  const code=[...document.scripts].find(s=>s.textContent.includes("const root=document.getElementById('chick-interiors-review')"));(0,eval)(code.textContent);return window.__interiorBindings.map(b=>b.k);
 });
 await page.waitForTimeout(150);
 const controlChanges=await f.locator('#chick-interiors-review').evaluate(root=>{const out={};for(const b of window.__interiorBindings){const c=root.querySelector('[data-interiors="furnished"] [data-room-view="after"]'),first=c.toDataURL();b.o[b.k]=!b.o[b.k];b.onChange();out[b.k]=c.toDataURL()!==first;b.o[b.k]=!b.o[b.k];b.onChange();}return out;});
 const sizes=[];
 for(const width of [736,320]){await page.setViewportSize({width,height:1100});await page.waitForTimeout(80);sizes.push(await f.locator('#chick-interiors-review').evaluate(root=>({width:root.clientWidth,scroll:root.scrollWidth})));}
 await f.locator('[data-interiors="furnished"]').screenshot({path:fileURLToPath(new URL('./concept-mobile.png',import.meta.url))});
 const report={errors,uniqueRoomStudies:new Set(hashes).size,uniqueRoofViews:new Set(roofHashes).size,interiorVariant,roofVariant,controls,controlChanges,sizes};
 report.allPass=!errors.length&&report.uniqueRoomStudies===13&&report.uniqueRoofViews===3&&interiorVariant&&roofVariant&&Object.values(controlChanges).every(Boolean)&&sizes.every(s=>s.width===s.scroll);
 await fs.writeFile(new URL('./review-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.allPass)process.exitCode=1;
}finally{await browser.close();}
