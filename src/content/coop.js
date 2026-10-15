'use strict';
/* content: coop sites, upgrades and where the family moves to */
const SITES={
  forest:{name:'FOREST',c:11,r:67,sign:[11,69],plots:[[14,67],[14,68],[9,67],[10,67],[9,68],[10,68],[12,66],[13,66]],extraPlots:[[14,66],[9,66],[10,66],[14,69]]}};
// coop sites from older versions, used only to clean up old saves
const OLD_SITES={mountains:{c:2,r:56,plots:[[5,56],[6,56],[1,56],[6,57],[7,57],[7,56],[2,55],[3,55]]},
  city:{c:41,r:64,plots:[[40,64],[40,65],[44,64],[45,64],[41,63],[42,63],[43,63],[45,65]]},
  beach:{c:5,r:76,plots:[[4,76],[4,77],[9,76],[9,77],[4,75],[6,75],[7,75],[10,76]]}};
// seed tallies: old saves only had one "found" counter that also counted bonus seeds
function migrateSeeds(s){
  if(s.sp1!==undefined){G.sp1=s.sp1;G.sp2=s.sp2||0;G.earned=s.earned||0;return;}
  const f=s.found||0;G.sp1=Math.min(TOTAL_SEEDS,f);G.sp2=G.part2?Math.min(TOTAL_SEEDS2,Math.max(0,f-TOTAL_SEEDS)):0;G.earned=f;
}
function addSeeds(n,part,base){G.seeds+=n;G.earned+=n;if(base===undefined)base=n;
  if(part===2)G.sp2=Math.min(TOTAL_SEEDS2,G.sp2+base);else G.sp1=Math.min(TOTAL_SEEDS,G.sp1+base);}
function migrateSave(s){
  if(!s.ov){G.outfits=[...new Set(G.outfits.map(id=>OUTFIT_RENAME[id]||id))];if(G.wear)G.wear=OUTFIT_RENAME[G.wear]||G.wear;}
  if(G.coop&&OLD_SITES[G.coop.site]){const o=OLD_SITES[G.coop.site];
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<3;dx++){const k=(o.c+dx)+','+(o.r+dy);delete G.mods[k];tiles[o.r+dy][o.c+dx]=MAP[o.r+dy][o.c+dx];}
    for(const [c,r] of o.plots){const k=c+','+r;delete G.mods[k];tiles[r][c]=MAP[r][c];delete G.plots['plot_'+c+'_'+r];}
    G.coop.site='forest';G.coop.fresh=true;}
}
const COOP_IN={x:640,y:939};
const FAMILY_POS={mom:[39,52],penny:[42,53],peep:[37,54],cheep:[38,55],tweet:[41,55]};
// upgrades unlock as you help animals out here (need = Part 2 quests done), and cost a few seeds
const UPGRADES=[null,null,{cost:6,need:2,text:'A bigger coop, 2 more garden plots, and MAMA HEN moves in!'},
  {cost:9,need:5,text:'A family wing, 2 more plots, faster growing, and PENNY & the TRIPLETS move in!'},
  {cost:12,need:9,text:'The DREAM COOP! A golden roof, 2 more plots, super-fast growing, and a big party!'}];
