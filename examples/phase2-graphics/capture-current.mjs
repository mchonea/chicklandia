import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 const result=await page.evaluate(async()=>{
  const shots={},assets={},layouts={};
  for(const helped of [false,true]){
   newGame();G.autoMom=0;G.part2=true;G.rank=7;G.skills=new Set(['peck','quick','hop','glide','flap']);G.hearts=maxHearts();G.clock=DAY*.3;G.weather='clear';G.wInt=0;SET.music=0;SET.sound=0;state='play';fade=0;tick=110;
   if(helped){G.flags.mo=1;G.flags.fawn=true;G.items.stick=4;G.turtles=['turtle0','turtle1','turtle2'];G.collected.add('eagleEgg');G.coop={site:'forest',lv:2};G.thumb=true;}
   makeEnts();if(helped){QUESTS.bucky.onDone();G.plots['plot_5_64']={p:.8,k:'plain'};G.plots['plot_6_64']={p:1,k:'plain'};}toasts=[];parts=[];floats=[];shake=0;
   for(const [id,sx,sy] of [['forest0',0,5],['forest1',1,5],['beach0',0,6],['beach1',1,6],['mountains0',0,4],['mountains1',1,4]]){
    __chick.tp(sx*256+128,sy*192+106);P.inv=0;TQ=[];render();
    const c=document.createElement('canvas');c.width=256;c.height=192;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(cv,0,96,768,576,0,0,256,192);shots[id+'-'+(helped?'helped':'early')]=c.toDataURL();
   }
  }
  for(const id of ['forest','beach','mountains'])layouts[id]=REGIONS[id].cells.map(c=>c.rows);
  for(const k of ['tortoise','beaver','deer','marmot','eagle','mokid','fawn','turtle','gull','crab','acorn','stick','shell','fish','eagleEgg','seed','stump','moonSeed','star'])if(SPR[k]?.toDataURL)assets[k]=SPR[k].toDataURL();
  assets.pip=chickSprite(stageOfRank(7),0,0,false).toDataURL();
  for(const k of ['tree','oak','pine','palm','grass','flower','dirt','garden','hroof','hwall','hwin','hdoor','croof','cwall','cdoor','water','deep']){
   const tiles=Array.isArray(TILE[k])?TILE[k]:[TILE[k]];
   tiles.forEach((tile,n)=>{assets['tile-'+k+(tiles.length>1?'-'+n:'')]=tile.toDataURL();});
  }
  return {shots,assets,layouts};
 });
 for(const [k,url] of Object.entries(result.shots))await fs.writeFile(new URL('./current-'+k+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 await fs.writeFile(new URL('./baseline.json',import.meta.url),JSON.stringify(result));console.log(JSON.stringify({views:Object.keys(result.shots),assets:Object.keys(result.assets),errors}));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
