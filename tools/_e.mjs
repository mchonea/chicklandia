import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,60));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
const [,, ...x]=process.argv;
ed('src/engine/canvas.js',[['TOTAL_SEEDS=45,','TOTAL_SEEDS=45,TOTAL_SEEDS2=36,']]);
ed('src/engine/state.js',[
 ['found:0,time:0','sp1:0,sp2:0,earned:0,time:0'],
 ['foxGone:G.foxGone,gooseGone:G.gooseGone,found:G.found,','foxGone:G.foxGone,gooseGone:G.gooseGone,sp1:G.sp1,sp2:G.sp2,earned:G.earned,'],
 ['gooseGone:s.gooseGone,found:s.found,','gooseGone:s.gooseGone,'],
 ['G.hearts=Math.max(1,Math.min(G.hearts,maxHearts()));makeEnts();','migrateSeeds(s);G.hearts=Math.max(1,Math.min(G.hearts,maxHearts()));makeEnts();'],
 ['function migrateSave(s){','// seed tallies: old saves only had one "found" counter that also counted bonus seeds\nfunction migrateSeeds(s){\n  if(s.sp1!==undefined){G.sp1=s.sp1;G.sp2=s.sp2||0;G.earned=s.earned||0;return;}\n  const f=s.found||0;G.sp1=Math.min(TOTAL_SEEDS,f);G.sp2=G.part2?Math.min(TOTAL_SEEDS2,Math.max(0,f-TOTAL_SEEDS)):0;G.earned=f;\n}\nfunction addSeeds(n,part,base){G.seeds+=n;G.earned+=n;if(base===undefined)base=n;\n  if(part===2)G.sp2=Math.min(TOTAL_SEEDS2,G.sp2+base);else G.sp1=Math.min(TOTAL_SEEDS,G.sp1+base);}\nfunction migrateSave(s){'],
]);
ed('src/content/quests.js',[['function reward(n,id){if(wearing(\'crown\'))n++;G.seeds+=n;G.found+=n;','function reward(n,id){const base=n;if(wearing(\'crown\'))n++;addSeeds(n,ORDER2.includes(id)?2:1,base);']]);
ed('src/systems/actions.js',[["case 'seed':G.seeds++;G.found++;","case 'seed':addSeeds(1,e.y>=48*16?2:1);"]]);
ed('src/systems/world.js',[['G.seeds+=3;G.found+=3;SFX.chest()','addSeeds(3,1);SFX.chest()']]);
ed('src/ui/render.js',[
 ["txt('Seeds found: '+G.found+'/'+TOTAL_SEEDS+'     Q: close'","txt('Seeds found: '+G.sp1+'/'+TOTAL_SEEDS+'     Q: close'"],
 ["'Seeds found '+G.found+'/'+TOTAL_SEEDS+''","'Seeds found '+G.sp1+'/'+TOTAL_SEEDS"],
 ["txt('Harvests: '+G.harvests+'     X: part 1     Q: close'","txt('Seeds: '+G.sp2+'/'+TOTAL_SEEDS2+'  Harvests: '+G.harvests+'  X: part 1  Q: close'"],
]);
