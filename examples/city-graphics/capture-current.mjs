import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}});
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');
 await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 const shots=await page.evaluate(()=>{
  (0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.rank=8;G.flags.pinchMap=true;G.flags.seaOpen=true;G.hearts=maxHearts();fade=0;tick=100;SET.music=0;SET.sound=0;state='play';makeEnts();");
  const out={};
  for(const [key,sx,sy] of [['gate',2,5],['street',3,5],['park',4,5],['market',2,6],['homes',3,6],['harbor',4,6],['roof',5,7]]){
   (0,eval)(`__chick.tp(${sx*256+128},${sy*192+148});TQ=[];render();`);out[key]=(0,eval)('cv.toDataURL()');
  }
  for(const key of ['bakery','bistro','library','museum']){
   (0,eval)(`{const o=roomOrigin('${key}');__chick.tp(o.x+128,o.y+146);}TQ=[];render();`);out[key]=(0,eval)('cv.toDataURL()');
  }
  const clean={};
  for(const [key,sx,sy] of [['gate',2,5],['street',3,5],['park',4,5],['market',2,6],['homes',3,6],['harbor',4,6]]){
   (0,eval)(`__chick.tp(${sx*256+128},${sy*192+148});P.x=-1000;P.y=-1000;TQ=[];render();`);clean[key]=(0,eval)('cv.toDataURL()');
  }
  out.clean=clean;return out;
 });
 const native=await page.evaluate(async shots=>{const out={};for(const [key,url] of Object.entries({...shots,...Object.fromEntries(Object.entries(shots.clean).map(([k,v])=>['clean-'+k,v]))})){if(key==='clean')continue;const i=new Image();i.src=url;await i.decode();const c=document.createElement('canvas');c.width=256;c.height=224;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(i,0,0,256,224);out[key]=c.toDataURL();}const o=document.createElement('canvas');o.width=768;o.height=384;const g=o.getContext('2d');for(const [n,key] of ['gate','street','park','market','homes','harbor'].entries()){const i=new Image();i.src=out['clean-'+key];await i.decode();g.drawImage(i,0,32,256,192,n%3*256,Math.floor(n/3)*192,256,192);}out.overview=o.toDataURL();return out;},shots);
 await fs.writeFile(new URL('./baseline.json',import.meta.url),JSON.stringify(native));
 for(const [key,url] of Object.entries(native))await fs.writeFile(new URL('./current-'+key+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 const assets=await page.evaluate(()=>{const out={};for(const key of ['pigeon','raccoon','catO','chef','duck','hen','magpie','badger','ferret','owlGlasses','curator','easel','book','mailbox']){const s=(0,eval)(`SPR['${key}']`);if(s&&s.toDataURL)out[key]=s.toDataURL();}out.pip=(0,eval)('chickSprite(stageOfRank(8),0,0,false).toDataURL()');return out;});
 await fs.writeFile(new URL('./assets.json',import.meta.url),JSON.stringify(assets));
 console.log('Captured city exteriors, rooftops and four interiors.');
}finally{await browser.close();}
