'use strict';
/* ---------------- GROWTH JOURNAL: rank ladder, taste log, secrets, best scores ---------------- */
function drawJournal(){
  box(4,4,W-8,H-8,'#241838','#94dc64');
  txt('GROWTH JOURNAL',W/2,10,9,'#94dc64',{align:'center',shadow:true});
  txt('X: next page',W/2,22,5,'#8a7ab0',{align:'center'});
  // rank ladder
  RANKS.forEach((r,i)=>{const y=32+i*10,done=G.rank>=r.n,cur=G.rank===r.n;
    if(cur){ctx.fillStyle='#3b2a56';ctx.fillRect(10,y-2,114,10);}
    txt((done?'+ ':'  ')+r.n+' '+r.short,12,y,5,cur?'#ffd83a':done?'#94dc64':'#6a5a90');
    if(!done)txt(''+r.gp,120,y,5,'#6a5a90',{align:'right'});});
  const nx=nextRank();
  txt('GROWTH '+G.gp+(nx?' / '+nx.gp:' (MAX)'),12,138,6,'#fff8ec');
  ctx.fillStyle='#21142b';ctx.fillRect(12,149,110,7);ctx.fillStyle='#3b2a56';ctx.fillRect(13,150,108,5);
  ctx.fillStyle=rankFull()&&Math.floor(tick/10)%2?'#fff8ec':'#94dc64';ctx.fillRect(13,150,Math.round(108*(nx?rankProgress():1)),5);
  if(rankFull())wrapTxt('FULL - ready to grow! '+(nx.gateHint||''),12,162,112,5,'#ffd83a');
  else if(nx)wrapTxt('Next: '+nx.name+'. '+(nx.gate?'It needs a story event too.':'Keep helping, exploring and eating!'),12,162,112,5,'#b8a8d8');
  // taste log
  txt('TASTE LOG '+Object.keys(G.taste).length+'/'+FOODS.length,132,30,6,'#ffd83a');
  FOODS.forEach((f,i)=>{const y=40+i*8,got=!!G.taste[f.id];
    if(got){if(f.spr&&SPR[f.spr]){const s=SPR[f.spr];ctx.drawImage(s,134+(8-Math.min(8,s.width))/2,y-1+(8-Math.min(8,s.height))/2,Math.min(8,s.width),Math.min(8,s.height));}
      else{ctx.fillStyle=f.color||'#fff';ctx.fillRect(135,y,6,6);}}
    else txt('?',137,y,5,'#4a3a66');
    txt(got?f.name:'???',148,y,5,got?'#fff8ec':'#4a3a66');});
  txt('SECRETS '+Object.keys(G.secrets).length+'/'+SECRET_IDS.length,132,132,5,'#d890ff');
  SECRET_IDS.forEach((s,i)=>txt(G.secrets[s.id]?s.name:'???',134,141+i*8,5,G.secrets[s.id]?'#fff8ec':'#4a3a66'));
  txt('BEST SCORES',132,168,5,'#e8ff70');
  [['EGG',G.best.egg],['BONK',G.best.bonk],['FIREFLY',G.best.ffly],['RACE',G.best.race?G.best.race+'s':0]].forEach(([n,v],i)=>txt(n+' '+(v||'-'),134,177+i*8,5,v?'#fff8ec':'#4a3a66'));
}
