import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1060,height:1300}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8082/examples/city-graphics/review.html');
 const f=page.frameLocator('iframe');await f.locator('#chick-city-review').waitFor();await page.waitForTimeout(400);
 const dirs=['gate','street','park','market','homes','harbor'];
 const checks=[];
 for(const district of dirs){
  await f.locator('#city-district').selectOption(district);
  const label=await f.locator('[data-design="districts"] [data-caption="after"]').textContent();
  await f.locator('[data-design="districts"] [data-view="after"]').screenshot({path:fileURLToPath(new URL('./concept-'+district+'.png',import.meta.url))});
  checks.push({district,label});
 }
 await f.locator('#city-district').selectOption('street');
 await f.locator('[data-design="districts"] [data-view="map"]').screenshot({path:fileURLToPath(new URL('./concept-overview.png',import.meta.url))});
 await f.locator('[data-design="districts"]').screenshot({path:fileURLToPath(new URL('./review-neighborhoods.png',import.meta.url))});
 await f.getByRole('button',{name:'Next variant',exact:true}).click();
 const variantChanged=await f.locator('[data-design="buildings"]').isVisible();
 await f.locator('[data-design="buildings"]').screenshot({path:fileURLToPath(new URL('./review-buildings.png',import.meta.url))});
 await f.getByRole('button',{name:'Previous variant',exact:true}).click();
 const returned=await f.locator('[data-design="districts"]').isVisible();
 const controls=await f.locator('#chick-city-review').evaluate(root=>{
  const code=[...document.scripts].find(s=>s.textContent.includes("const root=document.getElementById('chick-city-review')"));
  window.__cityBindings=[];window.Tweak=class{constructor(o){this.onChange=o.onChange;}addToggle(o,k,opts){window.__cityBindings.push({o,k,opts,onChange:this.onChange});}};
  (0,eval)(code.textContent);return window.__cityBindings.map(b=>b.k);
 });
 await page.waitForTimeout(200);
 const toggles=await f.locator('#chick-city-review').evaluate(root=>{const out={};for(const b of window.__cityBindings){const c=root.querySelector('[data-design="districts"] [data-view="map"]'),start=c.toDataURL();b.o[b.k]=false;b.onChange();out[b.k]=c.toDataURL()!==start;b.o[b.k]=true;b.onChange();}return out;});
 const sizes=[];
 for(const width of [736,320]){
  await page.setViewportSize({width,height:1300});await page.waitForTimeout(100);
  sizes.push(await f.locator('#chick-city-review').evaluate(root=>({width:root.clientWidth,scroll:root.scrollWidth})));
 }
 await f.locator('[data-design="districts"]').screenshot({path:fileURLToPath(new URL('./review-mobile.png',import.meta.url))});
 const report={errors,checks,variantChanged,returned,controls,toggles,sizes};
 await fs.writeFile(new URL('./review-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(errors.length||!variantChanged||!returned||Object.values(toggles).includes(false)||sizes.some(s=>s.scroll>s.width))process.exitCode=1;
}finally{await browser.close();}
