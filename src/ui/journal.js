'use strict';
/* ---------------- GROWTH JOURNAL: rank ladder, taste log, secrets, best scores ---------------- */
let jpage=0;      // the journal has two sheets: 0 = ranks and Taste Log, 1 = secrets, scores and collections
function drawJournal(){
  box(4,4,W-8,H-8,'#241838','#94dc64');
  txt('GROWTH JOURNAL',W/2,10,9,'#94dc64',{align:'center',shadow:true});
  txt('X: next page     Z: flip sheet ('+(jpage+1)+'/2)',W/2,22,5,'#8a7ab0',{align:'center'});
  if(jpage===1){drawJournal2();return;}
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
}
function drawJournal2(){
  txt('SECRETS '+Object.keys(G.secrets).length+'/'+SECRET_IDS.length,12,34,6,'#d890ff');
  SECRET_IDS.forEach((s,i)=>txt(G.secrets[s.id]?s.name:'???',14,46+i*9,5,G.secrets[s.id]?'#fff8ec':'#4a3a66'));
  txt('BEST SCORES',132,34,6,'#e8ff70');
  [['EGG CATCH',G.best.egg],['CARROT BONK',G.best.bonk],['FIREFLY',G.best.ffly],['ROOFTOP RACE',G.best.race?G.best.race+'s':0]].forEach(([n,v],i)=>txt(n+' '+(v||'-'),134,46+i*9,5,v?'#fff8ec':'#4a3a66'));
  const ex=EXHIBITS.filter(x=>G.museum[x.id]>=x.need).length;
  txt('COLLECTIONS',12,112,6,'#c49a5c');
  txt('OUTFITS '+G.outfits.length+'/'+OUTFITS.length,14,124,5,'#fff8ec');txt('MUSEUM '+ex+'/'+EXHIBITS.length+' EXHIBITS',14,133,5,'#fff8ec');
  txt('SKY SKILLS '+SKILLS5.filter(s=>has(s.id)).length+'/'+SKILLS5.length,14,142,5,'#fff8ec');
  if(G.sky&&G.sky.name)txt('YOUR CHICK: '+G.sky.name,14,160,6,'#ffd83a');
  if(G.flags.legend)txt('LEGEND OF CHICKLANDIA!',14,176,6,'#ffd83a');
}
