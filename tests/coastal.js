/* Coastal art regression: real walking without swimming, dock interactions,
   old-save recovery and the shared upgrade artwork. Needs tests/walk.js. */
(async()=>{
const c=window.__chick,R={},ok=(k,v)=>R[k]=!!v;
c.newGame();let g=c.G;g.autoMom=0;g.part2=true;g.flags.pinchMap=1;g.sea.open=true;
g.skills=new Set(['peck','quick','hop','flap','dash','glide','cpeck']);g.sea.lv={sails:1,hull:1,cannon:1};g.flags.lit=1;
makeEnts();g.clock=DAY*.3;SET.sound=0;SET.music=0;
const reset=()=>{state='play';dlg=null;SH=null;SAIL=null;VOY=null;trans=null;WARP=null;fade=0;P.kt=0;P.inv=99999;g.hearts=maxHearts();};
for(const e of ents)if(['crab','gullp','spark'].includes(e.type)){e.stun=99999;e.cool=99999;e.gone=99999;}
const failures=[];window.WALK_AVOID='wW{';
for(const node of ['cove','reef','volcano','lighthouse']){
  const a=SEA_NODES.find(n=>n.id===node).arrive;c.tp(a.x,a.y);reset();
  const people=SEA_CAST.filter(n=>({volc:'volcano',lightE:'lighthouse'}[n.o]||n.o)===node);
  const targets=[...SEA_ITEMS.filter(n=>({volc:'volcano',volcE:'volcano',coveE:'cove',reefE:'reef'}[n[2]]||n[2])===node).map(n=>[n[0],spx(n[2],n[3],n[4])]),
    ...people.map(n=>[n.id,{...spx(n.o,n.c,n.r),y:spx(n.o,n.c,n.r).y+18}])];
  if(node==='cove')for(const [id,o,x,y] of XMARKS)targets.push([id,spx(o,x,y)]);
  if(node==='reef')for(const [id,x,y] of TRAIN.dive.spawn)targets.push([id,at(x,y)]);
  if(node==='volcano')for(const [id,x,y] of TRAIN.cpeck.spawn)targets.push([id,at(x,y)]);
  if(node==='lighthouse')for(const [sym,x,y] of BRAZIERS){const p=spx('lightE',x,y);targets.push([sym,{x:p.x,y:p.y+14}]);}
  for(const [id,p] of targets){const w=walkTo(p.x,p.y);reset();if(!w.ok)failures.push(node+':'+id+':'+w.why);}
}
ok('quest_routes_do_not_require_swimming',failures.length===0);R.routeFailures=failures;
for(const node of ['harbor','cove','reef','volcano','lighthouse']){
  const a=SEA_NODES.find(n=>n.id===node).arrive;c.tp(a.x,a.y);reset();
  const e=ents.find(e=>e.type==='shipdock'&&e.node===node);
  const w=walkTo(e.x,e.y);reset();P.dir=3;action();ok('board_ship_'+node,w.ok&&state==='catalog'&&SH.id==='ship');
}
ok('harbor_opens_to_the_ocean',REGIONS.city.screens[5][11]==='wwwwwwwwwwwwwwww');
ok('world_screens_have_valid_dimensions',REGION_LIST.every(r=>r.screens.every(s=>{if(!s)return true;const rows=Array.isArray(s)?s:s.rows;return rows.length===12&&rows.every(row=>row.length===16);}))); 
const variants=[{}, {sails:1},{hull:1},{cannon:1},{sails:1,hull:1,cannon:1}].map(lv=>coastalShipSprite(lv).toDataURL());
ok('upgrades_change_the_ship_independently',new Set(variants).size===variants.length);
reset();c.tp(SO.fort[0]*16+12*16+8,SO.fort[1]*16+9*16+12);save();c.continueGame();g=c.G;
ok('old_save_on_new_railing_returns_to_landing',P.x===SEA_NODES[5].arrive.x&&P.y===SEA_NODES[5].arrive.y);
window.WALK_AVOID='';reset();
for(const big of [false,true]){SET.big=big;openSailMap();for(let i=0;i<SEA_NODES.length;i++){
  SAIL.sel=i;g.sea.lv={sails:0,hull:0,cannon:0};TQ=[];drawSail();
  ok('map_text_fits_'+i+'_'+big,TQ.every(t=>{const width=measure(t.s,t.size),left=t.align==='center'?t.x-width/2:t.align==='right'?t.x-width:t.x;return left>=0&&left+width<=W&&t.y+t.size<=H;}));
}}
SET.big=false;R.allPass=Object.entries(R).filter(([k])=>k!=='routeFailures').every(([,v])=>v===true);return R;
})()
