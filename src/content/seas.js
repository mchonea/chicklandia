'use strict';
/* content: the Pirate Seas. Data only: where everything is, what the ship upgrades cost, the sail map. */
// top-left tile (col,row) of each screen group, so positions below read as screen-local numbers
const SO={cove:[0,108],coveE:[16,108],reef:[48,108],reefE:[64,108],volc:[0,132],volcE:[16,132],deep:[48,132],deepE:[64,132],
  light:[0,156],lightE:[16,156],fort:[48,156],cave:[0,180],caveE:[16,180]};
const stile=(o,c,r)=>[SO[o][0]+c,SO[o][1]+r];                    // -> [col,row]
const spx=(o,c,r)=>({x:(SO[o][0]+c)*16+8,y:(SO[o][1]+r)*16+12});   // -> pixel position (feet)
// sail map: nodes are drawn on a little sea chart. arrive = where Pip lands (the dock)
const SEA_NODES=[
  {id:'harbor',name:'CITY HARBOR',mx:36,my:48,arrive:{x:69*16+8,y:78*16+12},need:()=>true},
  {id:'cove',name:'PIRATE COVE',mx:100,my:92,arrive:spx('cove',3,8),need:()=>true},
  {id:'reef',name:'CORAL REEF',mx:176,my:56,arrive:spx('reef',3,8),need:()=>true},
  {id:'volcano',name:'VOLCANO ISLE',mx:58,my:158,arrive:spx('volc',3,8),need:()=>G.sea.lv.sails>=1,lock:'Needs BETTER SAILS'},
  {id:'lighthouse',name:'LIGHTHOUSE ROCK',mx:150,my:172,arrive:spx('light',3,8),need:()=>G.sea.lv.hull>=1,lock:'Needs a STRONGER HULL'},
  {id:'fortress',name:"SQUAWKBEARD'S SHIP",mx:222,my:128,arrive:spx('fort',3,8),need:()=>G.sea.lv.cannon>=1&&!!G.flags.lit,lock:'Needs the SEED CANNON and a lit lighthouse'}];
// ship upgrades: seeds + salvage. Each unlocks a farther place.
const SHIP_UPGRADES=[
  {id:'sails',name:'BETTER SAILS',seeds:8,salv:{sailcloth:3},icon:'sailcloth',desc:'Faster and bolder! Unlocks VOLCANO ISLE.'},
  {id:'hull',name:'STRONGER HULL',seeds:10,salv:{hullplank:4},icon:'hullplank',desc:'Planks that shrug off waves. Unlocks LIGHTHOUSE ROCK.'},
  {id:'cannon',name:'SEED CANNON',seeds:12,salv:{cannonpart:2},icon:'cannonpart',desc:'Shoots seeds! Needed to take on CAPTAIN SQUAWKBEARD.'}];
const SALV_NAME={sailcloth:'SAILCLOTH',hullplank:'HULL PLANKS',cannonpart:'CANNON PARTS'};
// pick-ups: [id, kind, island, col, row]
const SEA_ITEMS=[
  ['sc0','sailcloth','cove',9,8],['sc1','sailcloth','cove',11,6],['sc2','sailcloth','cove',6,4],
  ['hp0','hullplank','deepE',4,9],['hp1','hullplank','deepE',12,4],['hp2','hullplank','deepE',2,3],['hp3','hullplank','deepE',14,9],
  ['pe0','pearl','deep',13,2],['pe1','pearl','deep',5,9],['pe2','pearl','deepE',12,10],
  ['wbell','wreckbell','deepE',7,6],
  ['cr0','crate','cave',12,3],['cr1','crate','cave',6,8],['cr2','crate','caveE',12,5],
  ['ss0','sunstone','volc',4,8],['ss1','sunstone','volcE',2,5],['ss2','sunstone','volcE',11,9],
  ['ore0','ironore','volcE',6,8],['ore1','ironore','volcE',12,5]];
// retired pirates' treasure hunt: dig spots (any order) on the cove's east beach
const XMARKS=[['x0','coveE',4,5],['x1','coveE',11,5],['x2','coveE',7,9]];
// places Pip warps between (cave mouth <-> caves, dive pools <-> deep reef, lighthouse door)
const SEA_WARPS=[
  {id:'cave_in',at:['coveE',6,3],to:['cave',7,10],label:'CAVE'},{id:'cave_out',at:['cave',7,11],to:['coveE',6,4],label:'EXIT'},
  {id:'cave2_in',at:['cave',14,5],to:['caveE',2,5],label:''},{id:'cave2_out',at:['caveE',1,5],to:['cave',13,5],label:''},
  {id:'pool1',at:['reef',9,3],to:['deep',7,5],label:'DIVE',dive:true},{id:'pool2',at:['reefE',11,7],to:['deepE',4,6],label:'DIVE',dive:true},
  {id:'up1',at:['deep',7,3],to:['reef',9,4],label:'UP',up:true},{id:'up2',at:['deepE',3,6],to:['reefE',11,8],label:'UP',up:true}];
// characters of the Pirate Seas (positions are screen-local, see SO)
const SEA_CAST=[
  {id:'polly',name:'PEGLEG POLLY',spr:'parrot',o:'cove',c:9,r:7,voice:1500,w:12},
  {id:'sam',name:'SALTY SAM',spr:'seaturtle',o:'cove',c:8,r:9,voice:150,w:16},
  {id:'coral',name:'CORAL',spr:'octopus',o:'reef',c:6,r:4,voice:700,w:14},
  {id:'ember',name:'EMBER',spr:'salamander',o:'volc',c:11,r:7,voice:480,w:12},
  {id:'gus',name:'KEEPER GUS',spr:'gullkeeper',o:'lightE',c:7,r:6,voice:880,w:12}];
const SEA_LEVEL_NAMES=['RICKETY','SAILING','SEA-WORTHY','FEARSOME'];
