import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage();await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);
 const assets=await page.evaluate(()=>{const out={};for(const k of ['snow','sand','pine','palm','brock','boulder','cliff','chasm','water','deep','planks']){const tiles=Array.isArray(TILE[k])?TILE[k]:[TILE[k]];tiles.forEach((tile,n)=>{out['tile-'+k+(tiles.length>1?'-'+n:'')]=tile.toDataURL();});}out.berryBush=SPR.berryBush.toDataURL();return out;});
 await fs.writeFile(new URL('./terrain-assets.json',import.meta.url),JSON.stringify(assets));console.log('Copied original terrain art without changing the baseline captures.');
}finally{await browser.close();}
