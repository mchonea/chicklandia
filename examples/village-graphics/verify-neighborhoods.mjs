import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 if(process.argv.includes('--checks')||process.argv.includes('--all')||process.argv.includes('--regressions')||process.argv.includes('--layout-only')){
  await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
  const suites=process.argv.includes('--layout-only')?['village_layout']:process.argv.includes('--regressions')?['city','seas','coastal','sky']:process.argv.includes('--all')?['village_layout','village','smoke','city','seas','coastal','sky']:['village_layout','village','smoke'];
  for(const suite of suites){report[suite]=await page.evaluate(await fs.readFile(new URL('../../tests/'+suite+'.js',import.meta.url),'utf8'));console.log(suite+': '+JSON.stringify(report[suite]));}
 }
 await page.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.vil.open=true;G.rank=7;G.skills=new Set(['peck','quick','hop','glide','flap']);G.hearts=maxHearts();fade=0;tick=100;SET.music=0;SET.sound=0;state='play';G.seeds=200;for(const [id,kind] of [['p0','home'],['p1','home'],['p2','bakery'],['p3','band'],['p4','school'],['p5','clinic'],['p6','home'],['p7','home'],['p8','mill'],['p9','mill']])G.vil.b[id]={kind,done:true,t0:0,dur:BUILD_TIME};G.vil.res={pig:'p0',whiskers:'p1',daisy:'p2',rooster:'p3',penny:'p4',doe:'p5',clyde:'p8'};G.q.vfound=2;G.q.bucky=2;makeEnts();updateSchedules(true);");});
 await page.evaluate(()=>{(0,eval)("for(const [i,[c,r]] of CROP_ROWS.entries())G.plots['plot_'+c+'_'+r]={p:[.2,.6,1][i%3],k:'plain'}");});
 const names=['green','hill','square','lane','yard','mill','gardens','pasture'],native={};
 const positions=[[216,1458],[440,1490],[648,1494],[904,1482],[208,1644],[440,1644],[664,1644],[888,1644]];
 for(const [season,d] of [['spring',0],['summer',3],['autumn',6],['winter',9]]){
  native[season]=[];
  for(let i=0;i<names.length;i++){
   await page.evaluate(([x,y,d])=>{(0,eval)("G.clock="+d+"*DAY+DAY*.3;__chick.tp("+x+","+y+");TQ=[];render()");},[...positions[i],d]);
   if(season==='spring'||i===0||i===1)await page.screenshot({path:fileURLToPath(new URL('./village-'+season+'-'+names[i]+'.png',import.meta.url))});
   native[season].push(await page.evaluate(()=>{const [x,y]=[P.x,P.y];P.x=-1000;P.y=-1000;TQ=[];render();const url=pix.toDataURL();P.x=x;P.y=y;return url;}));
  }
 }
 const maps=await page.evaluate(async data=>{const out={};for(const [s,urls] of Object.entries(data)){const c=document.createElement('canvas');c.width=1024;c.height=384;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
   for(let i=0;i<urls.length;i++){const a=new Image();a.src=urls[i];await a.decode();g.drawImage(a,0,32,256,192,(i%4)*256,Math.floor(i/4)*192,256,192);}out[s]=c.toDataURL();}return out;},native);
 for(const [s,url] of Object.entries(maps))await fs.writeFile(new URL('./village-overview-'+s+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 await page.evaluate(()=>{(0,eval)("G.vil.b={};G.vil.res={};makeEnts();G.clock=DAY*.3;__chick.tp(216,1458);fade=0;TQ=[];render()");});
 await page.screenshot({path:fileURLToPath(new URL('./village-starting-green.png',import.meta.url))});
 await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
 report.standalone=await page.evaluate(()=>{(0,eval)("newGame();G.vil.open=true;fade=0;__chick.tp(216,1458);render()");return {allPass:(0,eval)("PADS.length===10&&!!SPR.v_workshop&&CELL['0,7'].label==='VILLAGE GREEN'")};});
 // Gallery controls and image references work on desktop and narrow screens.
 await page.setViewportSize({width:1100,height:1100});await page.goto('http://127.0.0.1:8082/examples/village-graphics/neighborhoods.html');
 const controls=[];
 for(const season of ['Spring','Summer','Autumn','Winter']){
  await page.getByRole('button',{name:season,exact:true}).click();controls.push(await page.locator('#overview').evaluate(async i=>{await i.decode();return i.naturalWidth===1024;}));
 }
 for(let i=0;i<8;i++){
  await page.locator('[data-scene="'+i+'"]').click();for(const mode of ['before','after']){
   await page.locator('[data-mode="'+mode+'"]').click();controls.push(await page.locator('#scene').evaluate(async i=>{await i.decode();return i.naturalWidth>0;}));
  }
 }
 await page.getByRole('button',{name:'Spring',exact:true}).click();await page.locator('[data-scene="0"]').click();
 await page.screenshot({path:fileURLToPath(new URL('./village-review-desktop.png',import.meta.url))});
 await page.setViewportSize({width:390,height:844});const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 report.gallery={controls:controls.every(Boolean),fitsPhone:fits,allPass:controls.every(Boolean)&&fits};
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));
 await phone.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await phone.goto('http://127.0.0.1:8082/?debug=1');await phone.waitForFunction(()=>!!window.__chick);
 await phone.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.part2=true;G.vil.open=true;G.rank=7;G.seeds=200;G.vil.mat={wood:99,stone:99,wool:99,clay:99};G.clock=DAY*.3;fade=0;SET.sound=0;SET.music=0;const q=padCenter(PADS.find(p=>p.id==='p4'));__chick.tp(q.x,q.y+14);P.dir=1;updateTouchUI();render()");});
 await phone.locator('#btnA').tap();const opens=await phone.evaluate(()=>{__chick.step(1);return state==='catalog'&&SH.id==='build';});
 await phone.locator('#btnA').tap();const builds=await phone.evaluate(()=>{__chick.step(1);return !!G.vil.b.p4&&!G.vil.b.p4.done;});
 const completes=await phone.evaluate(()=>{(0,eval)("G.clock+=BUILD_TIME+1;tick=30;updateVillage();fade=0;updateTouchUI();render()");return !!G.vil.b.p4.done;});
 await phone.screenshot({path:fileURLToPath(new URL('./village-mobile.png',import.meta.url))});report.mobile={opens,builds,completes,allPass:opens&&builds&&completes};
 report.errors=errors;await fs.writeFile(new URL(process.argv.includes('--layout-only')?'./mill-approach-checks.json':process.argv.includes('--regressions')?'./neighborhood-regressions.json':process.argv.includes('--checks')||process.argv.includes('--all')?'./neighborhood-checks.json':'./neighborhood-captures.json',import.meta.url),JSON.stringify(report,null,2));
 console.log('Browser errors: '+JSON.stringify(errors));if(errors.length||Object.values(report).some(r=>r&&r.allPass===false))process.exitCode=1;
}finally{await browser.close();}
