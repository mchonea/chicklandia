import { chromium } from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:768,height:672}});
if(process.argv.includes('--review')){
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__villageTweaks=[];window.Tweak=class{constructor(o){this.onChange=o.onChange;}addSelect(object,key,options){window.__villageTweaks.push({object,key,options,onChange:this.onChange});}addToggle(object,key,options){window.__villageTweaks.push({object,key,options,onChange:this.onChange});}};});
 await page.setViewportSize({width:1060,height:1500});await page.goto('http://127.0.0.1:8082/examples/village-graphics/review.html');
 const frame=page.frameLocator('iframe');await frame.locator('#chick-village-review').waitFor();await page.waitForTimeout(500);
 // Standalone previews omit the host inspector. Bind the same callbacks for interaction checks.
 await frame.locator('#chick-village-review').evaluate(()=>{
  window.__villageTweaks=[];window.Tweak=class{constructor(o){this.onChange=o.onChange;}addSelect(object,key,options){window.__villageTweaks.push({object,key,options,onChange:this.onChange});}addToggle(object,key,options){window.__villageTweaks.push({object,key,options,onChange:this.onChange});}};
  const code=[...document.scripts].find(s=>s.textContent.includes("const settings={season:'Scene defaults'"));if(!code)throw Error('Concept script not found');(0,eval)(code.textContent);
 });
 const variants={hamlet:'Meadow hamlet',market:'Market village',woodland:'Woodland village',current:'Current game'};
 for(const [key,name] of Object.entries(variants)){
  await frame.locator('.viz-carousel-picker > summary').click();await frame.getByRole('button',{name,exact:true}).click();
  await frame.locator('[data-design="'+key+'"]').screenshot({path:fileURLToPath(new URL('./concept-'+key+'.png',import.meta.url))});
 }
 await frame.getByRole('button',{name:'Next variant',exact:true}).click();
 if(!(await frame.locator('[data-design="hamlet"]').isVisible()))throw Error('Variant navigation failed');
 const interactions=await frame.locator('#chick-village-review').evaluate(root=>{
  const bindings=window.__villageTweaks||[],season=bindings.find(b=>b.key==='season'),construction=bindings.find(b=>b.key==='construction');
  if(!season||!construction)return {available:false};
  const c=root.querySelector('[data-design="hamlet"] [data-scene="square"]'),start=c.toDataURL();
  season.object.season='Winter';season.onChange();const winter=c.toDataURL();
  construction.object.construction='Frame';construction.onChange();const frame=c.toDataURL();
  return {available:true,seasonChangesScene:start!==winter,constructionChangesScene:winter!==frame};
 });
 await frame.locator('[data-design="hamlet"] [data-scene="square"]').screenshot({path:fileURLToPath(new URL('./construction-study.png',import.meta.url))});
 await frame.locator('#chick-village-review').evaluate(()=>{for(const b of window.__villageTweaks||[]){if(b.key==='season')b.object.season='Scene defaults';if(b.key==='construction')b.object.construction='Finished';b.onChange();}});
 const pixels=await frame.locator('canvas').evaluateAll(cs=>cs.map(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let colors=new Set();for(let i=0;i<d.length;i+=4)colors.add(d.slice(i,i+4).join(','));return {design:c.closest('[data-design]').dataset.design,scene:c.dataset.scene,colors:colors.size};}));
 await page.setViewportSize({width:320,height:1200});await page.waitForTimeout(100);
 const mobile=await frame.locator('#chick-village-review').evaluate(root=>({width:root.clientWidth,scroll:root.scrollWidth,atlasWidth:root.querySelector('[data-design="hamlet"] [data-scene="buildings"]').width,atlasHeight:root.querySelector('[data-design="hamlet"] [data-scene="buildings"]').height}));
 await frame.locator('[data-design="hamlet"]').screenshot({path:fileURLToPath(new URL('./concept-mobile.png',import.meta.url))});
 const report={errors,interactions,mobile,pixels};await fs.writeFile(new URL('./visual-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await browser.close();process.exit(errors.length||mobile.scroll>mobile.width||!interactions.seasonChangesScene||!interactions.constructionChangesScene?1:0);
}
await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
await page.goto('http://127.0.0.1:8082/?debug=1');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>!!window.__chick);
const data=await page.evaluate(()=>{
  (0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.vil.open=true;G.rank=7;G.skills=new Set(['peck','quick','hop','glide','flap','swim']);G.hearts=maxHearts();fade=0;tick=100;SET.music=0;SET.sound=0;state='play';");
  const shots={};
  const shot=(name,code)=>{(0,eval)(code+';render()');shots[name]=(0,eval)('cv.toDataURL()');};
  shot('square-empty',"__chick.tp(632,1430)");
  (0,eval)("for(const [id,kind] of [['p0','home'],['p1','home'],['p2','bakery'],['p3','band'],['p4','school'],['p5','clinic'],['p6','home'],['p7','home'],['p8','mill'],['p9','mill']])G.vil.b[id]={kind,done:true,t0:0,dur:BUILD_TIME};G.vil.res={pig:'p0',whiskers:'p1',daisy:'p2',rooster:'p3',penny:'p4',doe:'p5',clyde:'p8'};makeEnts();");
  shot('square',"__chick.tp(632,1430)");
  shot('square-east',"__chick.tp(888,1430)");
  shot('hill',"G.clock=6*DAY+DAY*.3;__chick.tp(440,1450)");
  shot('hill-west',"__chick.tp(120,1450)");
  shot('river',"G.clock=3*DAY+DAY*.3;__chick.tp(408,1640)");
  shot('river-west',"__chick.tp(120,1640)");
  shot('meadow',"G.clock=9*DAY+DAY*.3;__chick.tp(664,1640)");
  shot('meadow-east',"__chick.tp(888,1640)");
  shot('construction',"G.vil.b.p0={kind:'home',done:false,t0:G.clock-BUILD_TIME*.45,dur:BUILD_TIME};__chick.tp(632,1430)");
  shot('winter',"G.clock=9*DAY+DAY*.3;__chick.tp(888,1640)");
  shot('autumn',"G.clock=6*DAY+DAY*.3;__chick.tp(632,1430)");
  shot('festival',"G.clock=6*DAY+DAY*.3;startFestival('harvest');FEST.t=150;FEST.shown=0;fade=0");
  return shots;
});
for(const [key,url] of Object.entries(data))await fs.writeFile(new URL('./current-'+key+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
// Native resolution captures keep the inline comparison compact; text was drawn by the real game.
const native=await page.evaluate(async(data)=>{const out={};for(const [key,url] of Object.entries(data)){const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=256;c.height=224;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,0,0,256,224);out[key]=c.toDataURL();}return out;},data);
await fs.writeFile(new URL('./baseline.json',import.meta.url),JSON.stringify(native));
const assets=await page.evaluate(()=>{const out={};for(const n of ['pig','sheep','horse','hen','cat','deer']){const a=(0,eval)('SPR["'+n+'"]');if(a)out[n]=a.toDataURL();}out.pip=(0,eval)('chickSprite(stageOfRank(7),0,0,false).toDataURL()');const atlas=document.createElement('canvas');atlas.width=512;atlas.height=112;const g=atlas.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#192639';g.fillRect(0,0,512,112);const names=['HOME','BAKERY','WATERMILL','BANDSTAND','SCHOOL','CLINIC'];(0,eval)('BUILD_ORDER').forEach((kind,i)=>{const a=(0,eval)('SPR.b_'+kind);g.drawImage(a,i*85+10,14,64,68);g.font='9px monospace';g.fillStyle='#fff8ec';g.textAlign='center';g.fillText(names[i],i*85+42,103);});out.atlas=atlas.toDataURL();return out;});
await fs.writeFile(new URL('./assets.json',import.meta.url),JSON.stringify(assets));
console.log('Captured '+Object.keys(data).join(', '));await browser.close();
