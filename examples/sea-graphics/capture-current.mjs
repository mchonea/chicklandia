import { chromium } from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:768,height:672}});
if(process.argv.includes('--review')){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1060,height:1400});
  await page.goto('http://127.0.0.1:8082/examples/sea-graphics/review.html');
  const frame=page.frameLocator('iframe');
  await frame.locator('#chick-sea-review').waitFor();
  await page.waitForTimeout(700);
  console.log('Controls: '+JSON.stringify(await frame.locator('button,select').evaluateAll(es=>es.map(e=>({tag:e.tagName,label:e.getAttribute('aria-label'),text:e.textContent.trim()})))));
  const names={coastal:'Coastal adventure',chart:"Captain's chart",miniature:'Miniature archipelago',current:'Current game'};
  for(const design of ['coastal','chart','miniature','current']){
    await frame.locator('.viz-carousel-picker > summary').click();
    await frame.getByRole('button',{name:names[design],exact:true}).click();
    await frame.locator('[data-design="'+design+'"]').screenshot({path:fileURLToPath(new URL('./concept-'+design+'.png',import.meta.url))});
  }
  const pixels=await frame.locator('canvas').evaluateAll(es=>es.map(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let colors=new Set();for(let i=0;i<d.length;i+=4)colors.add(d.slice(i,i+4).join(','));return {design:c.parentElement.parentElement.dataset.design,scene:c.dataset.scene,colors:colors.size};}));
  await frame.getByRole('button',{name:'Next variant',exact:true}).click();
  if(!(await frame.locator('[data-design="coastal"]').isVisible()))throw new Error('Carousel next did not wrap to Coastal adventure');
  await frame.getByRole('button',{name:'Previous variant',exact:true}).click();
  if(!(await frame.locator('[data-design="current"]').isVisible()))throw new Error('Carousel previous did not restore Current game');
  await page.setViewportSize({width:320,height:1200});
  await frame.locator('.viz-carousel-picker > summary').click();
  await frame.getByRole('button',{name:'Coastal adventure',exact:true}).click();
  const overflow=await frame.locator('#chick-sea-review').evaluate(e=>({scroll:e.scrollWidth,client:e.clientWidth,frames:[...e.querySelectorAll('[data-design="coastal"] figure')].map(q=>q.getBoundingClientRect().width)}));
  await frame.locator('[data-design="coastal"]').screenshot({path:fileURLToPath(new URL('./concept-mobile.png',import.meta.url))});
  console.log(JSON.stringify({errors,pixels,overflow},null,2));
  await fs.writeFile(new URL('./visual-checks.json',import.meta.url),JSON.stringify({errors,pixels,overflow},null,2));
  await browser.close();process.exit(errors.length?1:0);
}
await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
await page.goto('http://127.0.0.1:8082/?debug=1');
await page.evaluate(()=>document.fonts.ready);
await page.waitForFunction(()=>!!window.__chick);
const baseline=await page.evaluate(()=>{
  (0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.vil.open=true;G.sea.open=true;G.flags.pinchMap=1;G.sea.lv={sails:1,hull:1,cannon:1};G.flags.lit=1;G.rank=8;G.hearts=maxHearts();fade=0;state='play';tick=100;SET.music=0;SET.sound=0;makeEnts();");
  const scenes={};
  const shot=(name,code)=>{(0,eval)(code+';render()');scenes[name]=(0,eval)('pix.toDataURL()');};
  shot('harbor',"state='play';CS={x:4,y:6};camX=1024;camY=1152;P.x=69*16+8;P.y=78*16+12");
  shot('map',"openSailMap();SAIL.sel=1");
  shot('sailing',"state='voyage';SAIL=null;VOY={from:SEA_NODES[0],to:SEA_NODES[1],t:70,dur:150}");
  shot('islands',"state='play';VOY=null;CS={x:0,y:9};camX=0;camY=1728;P.x=56;P.y=1868");
  shot('boss',"CS={x:3,y:13};camX=768;camY=2496;P.x=824;P.y=2640");
  shot('reef',"CS={x:3,y:9};camX=768;camY=1728;P.x=824;P.y=1868");
  shot('volcano',"CS={x:0,y:11};camX=0;camY=2112;P.x=56;P.y=2252");
  shot('lighthouse',"CS={x:1,y:13};camX=256;camY=2496;P.x=312;P.y=2640");
  return scenes;
});
await fs.writeFile(new URL('./baseline.json',import.meta.url),JSON.stringify(baseline));
for(const [name,data] of Object.entries(baseline))await fs.writeFile(new URL(`./current-${name}.png`,import.meta.url),Buffer.from(data.split(',')[1],'base64'));
console.log('Captured '+Object.keys(baseline).join(', '));
await browser.close();
