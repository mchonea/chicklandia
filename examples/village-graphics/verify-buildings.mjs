import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[],report={};
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>!!window.__chick);
 if(!process.argv.includes('--capture-only')){
  await page.evaluate(await fs.readFile(new URL('../../tests/walk.js',import.meta.url),'utf8'));
  for(const suite of ['village','smoke']){
   report[suite]=await page.evaluate(await fs.readFile(new URL('../../tests/'+suite+'.js',import.meta.url),'utf8'));
   console.log(suite+': '+JSON.stringify(report[suite]));
  }
 }
 await page.evaluate(()=>{(0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.vil.open=true;G.rank=7;G.skills=new Set(['peck','quick','hop','glide','flap','swim']);G.hearts=maxHearts();fade=0;tick=100;SET.music=0;SET.sound=0;state='play';G.seeds=200;for(const [id,kind] of [['p0','home'],['p1','home'],['p2','bakery'],['p3','band'],['p4','school'],['p5','clinic'],['p6','home'],['p7','home'],['p8','mill'],['p9','mill']])G.vil.b[id]={kind,done:true,t0:0,dur:BUILD_TIME};G.vil.res={pig:'p0',whiskers:'p1',daisy:'p2',rooster:'p3',penny:'p4',doe:'p5',clyde:'p8'};makeEnts();");});
 report.art=await page.evaluate(()=>{
  const result={sprites:[],construction:true};
  for(const kind of (0,eval)('BUILD_ORDER')){
   const s=(0,eval)('SPR.b_'+kind),d=s.getContext('2d').getImageData(0,0,s.width,s.height).data;
   let edge=false,crisp=true,minX=s.width,minY=s.height,maxX=0,maxY=0;
   for(let y=0;y<s.height;y++)for(let x=0;x<s.width;x++){const a=d[(y*s.width+x)*4+3];if(a!==0&&a!==255)crisp=false;if(!a)continue;
    if(x===0||y===0||x===s.width-1||y===s.height-1)edge=true;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
   result.sprites.push({kind,width:s.width,height:s.height,unclipped:!edge,crisp,fitsCatalog:s.width<=70&&s.height<=70,foot:maxY-s.anchorY,bounds:[minX,minY,maxX,maxY]});
   for(const fraction of [0,.25,.75,1]){
    const calls=[],draw=ctx.drawImage;ctx.drawImage=function(...args){calls.push(args);return draw.apply(this,args);};
    try{(0,eval)("G.vil.b.p0={kind:'"+kind+"',done:false,t0:G.clock-BUILD_TIME*"+fraction+",dur:BUILD_TIME};drawVillageEnt(ents.find(e=>e.id==='p0'),128,130)");}
    finally{ctx.drawImage=draw;}
    const c=calls.find(c=>c[0]===s);result.construction&&=!!c&&c.length===9&&c[4]>0&&c[4]<=s.height&&c[3]===s.width&&c[7]===s.width&&c[8]===c[4]&&c[6]+c[8]===130-s.anchorY+s.height;
   }
  }
  (0,eval)("G.vil.b.p0={kind:'home',done:true,t0:0,dur:BUILD_TIME}");
  result.allPass=result.construction&&result.sprites.every(s=>s.unclipped&&s.crisp&&s.fitsCatalog&&s.foot>=0&&s.foot<=3);return result;
 });
 const shots={square:"__chick.tp(632,1430)",east:"__chick.tp(888,1430)",river:"G.clock=3*DAY+DAY*.3;__chick.tp(408,1640)",construction:"G.vil.b.p0={kind:'home',done:false,t0:G.clock-BUILD_TIME*.45,dur:BUILD_TIME};__chick.tp(632,1430)",schoolConstruction:"G.vil.b.p4={kind:'school',done:false,t0:G.clock-BUILD_TIME*.75,dur:BUILD_TIME};__chick.tp(888,1430)",catalog:"VB={pad:PADS.find(p=>p.id==='p8')};openCatalog('build');SH.sel=2"};
 for(const [name,code] of Object.entries(shots)){
  await page.evaluate(code+';TQ=[];render()');await page.screenshot({path:fileURLToPath(new URL('./implemented-'+name+'.png',import.meta.url))});
 }
 const atlas=await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=600;c.height=108;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#192639';g.fillRect(0,0,c.width,c.height);
  const labels=['HOME','BAKERY','WATERMILL','BANDSTAND','SCHOOL','CLINIC'];
  (0,eval)('BUILD_ORDER').forEach((kind,i)=>{const s=(0,eval)('SPR.b_'+kind);g.drawImage(s,i*100+50-s.anchorX,78-s.anchorY);g.font='10px monospace';g.fillStyle='#fff8ec';g.textAlign='center';g.fillText(labels[i],i*100+50,99);});return c.toDataURL();
 });
 await fs.writeFile(new URL('./implemented-buildings.png',import.meta.url),Buffer.from(atlas.split(',')[1],'base64'));
 await page.goto('http://127.0.0.1:8082/dist/chicklandia.html?debug=1');await page.waitForFunction(()=>!!window.__chick);
 report.standalone=await page.evaluate(()=>{(0,eval)("newGame();G.vil.open=true;G.vil.b.p0={kind:'home',done:true};fade=0;__chick.tp(632,1430);render()");return {allPass:(0,eval)("SPR.b_home.width===48&&SPR.b_school.height===62")};});
 await page.setViewportSize({width:1060,height:1100});await page.goto('http://127.0.0.1:8082/examples/village-graphics/implemented.html');
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.getByRole('button',{name:'Before',exact:true}).click();await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 const before=await page.locator('#comparison img').evaluateAll(imgs=>imgs.every(i=>i.getAttribute('src')===i.dataset.before&&i.naturalWidth>0));
 await page.getByRole('button',{name:'Market Village',exact:true}).click();await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 const after=await page.locator('#comparison img').evaluateAll(imgs=>imgs.every(i=>i.getAttribute('src')===i.dataset.after&&i.naturalWidth>0));
 await page.screenshot({path:fileURLToPath(new URL('./implemented-gallery.png',import.meta.url))});
 await page.setViewportSize({width:390,height:844});const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 report.gallery={before,after,fitsPhone:fits,allPass:before&&after&&fits};
 report.errors=errors;console.log('Art: '+JSON.stringify(report.art));console.log('Browser errors: '+JSON.stringify(errors));
 await fs.writeFile(new URL(process.argv.includes('--capture-only')?'./building-captures.json':'./building-checks.json',import.meta.url),JSON.stringify(report,null,2));
 if(errors.length||Object.values(report).some(r=>r&&r.allPass===false))process.exitCode=1;
}finally{await browser.close();}
