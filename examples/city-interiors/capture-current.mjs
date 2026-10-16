import {chromium} from 'file:///C:/Users/Michael%20Honea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8082/?debug=1');await page.waitForFunction(()=>!!window.__chick);await page.evaluate(()=>document.fonts.ready);
 const data=await page.evaluate(()=>{
  (0,eval)("newGame();G.autoMom=0;G.clock=DAY*.3;G.part2=true;G.rank=7;G.skills=new Set(['peck','quick','hop','glide']);G.hearts=maxHearts();fade=0;tick=100;SET.music=0;SET.sound=0;state='play';makeEnts();");
  const rooms={},shots={},assets={},layouts={};
  for(const id of ['post','rocco','bistro','boutique','seed','bakery','toy','cleo','artist','ducks','loft','library','museum']){
   (0,eval)(`{const o=roomOrigin('${id}');__chick.tp(o.x+128,o.y+158);}TQ=[];render();`);
   shots[id]=(0,eval)('cv.toDataURL()');layouts[id]=(0,eval)(`roomCell('${id}').rows`);
  }
  (0,eval)('startRace();__chick.step(60);fade=0;state="play";toasts=[];parts=[];floats=[];');
  const roofs=[];
  for(const [i,x] of [56,88,184].entries()){
   (0,eval)(`__chick.tp(${(5+i)*256+x},${7*192+92});TQ=[];render();`);shots['roof'+i]=(0,eval)('cv.toDataURL()');
   roofs.push((0,eval)('(()=>{const [x,y,r]=[P.x,P.y,G.race];P.x=-1000;P.y=-1000;G.race=null;TQ=[];render();const u=cv.toDataURL();P.x=x;P.y=y;G.race=r;return u;})()'));
  }
  for(const key of ['pigeon','raccoon','chef','magpie','goat','badger','ferret','catO','peacock','duck','duckling','owlGlasses','curator','easel','book','seed','muffin','sbun','tart','sprout','moonSeed','star','flag','vane','vaneFixed','parcel','seashell','plume','fossil','petal','goggles']){
   const a=(0,eval)(`SPR['${key}']`);if(a?.toDataURL)assets[key]=a.toDataURL();
  }
  assets.pip=(0,eval)('chickSprite(stageOfRank(7),0,0,false).toDataURL()');
  return {shots,roofs,assets,layouts,course:(0,eval)('({rows:REGIONS.rooftops.screens,stars:RACE_STARS.slice(0,10),need:RACE_NEED,seconds:RACE_LIMIT/60})')};
 });
 const native=await page.evaluate(async data=>{
  const out={};for(const [key,url] of Object.entries(data.shots)){const i=new Image();i.src=url;await i.decode();const c=document.createElement('canvas');c.width=256;c.height=224;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(i,0,0,256,224);out[key]=c.toDataURL();}
  const c=document.createElement('canvas');c.width=768;c.height=192;const g=c.getContext('2d');g.imageSmoothingEnabled=false;for(const [n,url] of data.roofs.entries()){const i=new Image();i.src=url;await i.decode();g.drawImage(i,0,96,768,576,n*256,0,256,192);}out.roofOverview=c.toDataURL();
  const atlas=document.createElement('canvas');atlas.width=1024;atlas.height=768;const a=atlas.getContext('2d');a.imageSmoothingEnabled=false;a.fillStyle='#192639';a.fillRect(0,0,1024,768);for(const [n,key] of Object.keys(data.layouts).entries()){const i=new Image();i.src=out[key];await i.decode();a.drawImage(i,0,32,256,192,n%4*256,Math.floor(n/4)*192,256,192);}out.roomContact=atlas.toDataURL();return out;
 },data);
 for(const [key,url] of Object.entries(native))await fs.writeFile(new URL('./current-'+key+'.png',import.meta.url),Buffer.from(url.split(',')[1],'base64'));
 await fs.writeFile(new URL('./baseline.json',import.meta.url),JSON.stringify({shots:native,assets:data.assets,layouts:data.layouts,course:data.course}));
 const audit=await page.evaluate(()=>{
  (0,eval)("newGame();G.autoMom=0;G.part2=true;G.rank=7;G.clock=DAY*.3;G.skills=new Set(['peck','quick','hop','glide']);G.hearts=maxHearts();SET.music=0;SET.sound=0;fade=0;state='play';startRace();__chick.step(40);toasts=[];");
  let hops=0,frames=0;const stops=[];
  const go=(x,y)=>{let n=0;for(;n<1400&&G.race;n++){
   if(!trans&&Math.abs(P.x-x)<2&&Math.abs(P.y-y)<2)break;
   keys.left=P.x>x+1.4;keys.right=P.x<x-1.4;keys.up=P.y>y+1.4;keys.down=P.y<y-1.4;__chick.step(1);frames++;if(P.hop)hops++;
  }for(const k of ['left','right','up','down'])keys[k]=false;return !!G.race&&Math.abs(P.x-x)<3&&Math.abs(P.y-y)<3;};
  go(5*256+72,P.y);
  for(const [x,y] of [[72,66],[56,130],[120,98],[200,82],[216,130],[296,98],[392,98],[504,130],[552,98]]){
   const baseX=5*256,baseY=7*192,approach=x===56?72:x;if(Math.abs(P.x-(baseX+56))<8)go(baseX+72,P.y);const reached=go(P.x,baseY+24)&&go(baseX+approach,baseY+24)&&go(baseX+approach,baseY+y)&&(approach===x||go(baseX+x,baseY+y));stops.push({x,y,reached,stars:G.race?.stars});if(!reached)break;
  }
  const starsBeforeFinish=G.race?.stars;
  go(P.x,7*192+24);go(5*256+712,7*192+24);go(5*256+712,7*192+98);__chick.step(80);
  return {stops,starsBeforeFinish,frames,hopFrames:hops,won:!!G.best.race,bestSeconds:G.best.race||null};
 });
 await fs.writeFile(new URL('./race-audit.json',import.meta.url),JSON.stringify(audit,null,2));
 console.log('Race movement audit: '+JSON.stringify(audit));
 console.log(JSON.stringify({rooms:Object.keys(data.layouts),race:data.course,errors}));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
