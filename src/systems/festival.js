'use strict';
/* ---------------- Part 2 finale: the Coming-of-Age Festival, rank 7 transformation, credits ---------------- */
let FEST=null,CRED=null;
function festivalReady(){return !G.flags.festival&&allP2Done()&&!!G.coop&&G.coop.lv>=4&&G.gp>=RANKS[6].gp;}
const FEST_GUESTS=['hen','penny','peep','cheep','tweet','tortoise','beaver','deer','marmot','eagle','pigeon','chef','crab','gull','cow','horse','pig','dog','cat','duck','sheepBow','rooster','mouse','raccoon','catO','owl'];
const FEST_LINES=[
  ['mom',"MAMA HEN","Pip, my little peep... look at all your friends!"],
  ['granny',"GRANNY SHELL","Every animal you helped came to watch you grow up, dearie."],
  ['penny',"PENNY","Your big sister is SO proud of you, Pip!"],
  ['peep',"THE TRIPLETS","You're the best flyer in the whole wide world!"],
  ['bucky',"BUCKY","That's the sturdiest coop I ever built. You inspired me!"],
  ['doe',"DOE","Thank you for finding my little fawn, Pip."],
  ['clyde',"CLYDE","Neeeigh! I knew you'd fly higher than me!"],
  ['rooster',"SIR CLUCKINGTON","COCK-A-DOODLE-WOW! You've got real pluck, kid!"],
  ['pinch',"CAPN PINCH","Arr! A true sea chick, ye are!"],
  ['granny',"GRANNY SHELL","Now close your eyes, Pip. It's time to grow up!"]];
const HARVEST_GUESTS=['beaver','dog','pig','cat','horse','cow','deer','penny','rooster','hen','tortoise','sheepBow','duck','mouse','peacock','goat','badger','ferret','owlGlasses','pigeon','raccoon','catO','marmot','eagle','crab','gull'];
const HARVEST_LINES=[
  ['barnaby',"FOREMAN BARNABY","Look at this village, Pip! Every pad has a building and every building has a friend!"],
  ['daisy',"DAISY","Mooo-velous! Milk and bread for everyone!"],
  ['pig',"PORKCHOP","Best mud pond in Chicklandia. I rolled in it twice today."],
  ['clyde',"CLYDE","Neeeigh! A mill, a wagon and a hay barn. A horse's dream!"],
  ['penny',"PENNY","Class is full! Everyone wants to learn from the chick who built it all!"],
  ['rooster',"SIR CLUCKINGTON","COCK-A-DOODLE-DOO! I crow the sun up on my own stage every morning!"],
  ['doe',"DOE","The clinic is quiet. That's the best sign of a happy village."],
  ['whiskers',"WHISKERS","Purr. The cushion is perfect. The sun is perfect. You are... acceptable."],
  ['bucky',"BUCKY","Beaver-tail slap! We did it, Pip! A whole village, from a muddy meadow!"],
  ['mom',"MAMA HEN","My little peep, the Village Hero. I'm the proudest hen in the world!"]];
const FEST_SCRIPTS={
  coming:{lines:FEST_LINES,guests:FEST_GUESTS,scene:'coop',end:()=>{G.flags.festival=1;G.flags.part2done=1;save();finaleRank(7,startCredits);}},
  harvest:{lines:HARVEST_LINES,guests:HARVEST_GUESTS,scene:'harvest',end:()=>{G.flags.village=1;reward(QUESTS.vharvest.reward,'vharvest');save();finaleRank(8,startPinch);}}};
function startFestival(name){const S0=FEST_SCRIPTS[name||'coming'];if(S0.mk)S0.lines=S0.mk();FEST={t:0,line:0,shown:0,S:S0};state='festival';fade=0;SFX.fanfare();}
function updateFestival(){
  const f=FEST;f.t++;
  if(f.t<40){fade=1-f.t/40;return;}fade=0;
  const L=f.S.lines[f.line];
  if(f.shown<L[2].length){f.shown+=TEXT_SPEED_MUL[SET.speed];if(Math.floor(f.shown)%3===0&&f.t%2===0)SFX.blip(500+(f.line*53)%300);if(pressed.a)f.shown=L[2].length;}
  else if(pressed.a){
    f.line++;f.shown=0;SFX.menu();
    if(f.line>=f.S.lines.length){const end=f.S.end;FEST=null;end();}
  }
}
function drawFestival(){
  const f=FEST,S=f.S,harvest=S.scene==='harvest';
  drawSky(harvest?tick+700:tick);for(let x=0;x<W;x++){const h=Math.round(120+Math.sin(x/23)*5);ctx.fillStyle=harvest?'#8aa84a':'#4ea84a';ctx.fillRect(x,h,1,H-h);}
  for(let x=0;x<W;x+=16){ctx.drawImage(TILE.grass[(x/16)%3],x,150);ctx.drawImage(TILE.grass[(x/16+1)%3],x,166);ctx.drawImage(TILE.flower[(x/16)%2],x,182);}
  if(harvest){ctx.fillStyle='rgba(255,160,60,0.14)';ctx.fillRect(0,0,W,H);
    ctx.drawImage(SPR.windmillBase,108,64);const a=tick/40;ctx.strokeStyle='#202840';ctx.lineWidth=3;for(let i=0;i<4;i++){const an=a+i*Math.PI/2;ctx.beginPath();ctx.moveTo(128,78);ctx.lineTo(128+Math.cos(an)*24,78+Math.sin(an)*24);ctx.stroke();}
    for(let i=0;i<5;i++)drawImg(SPR.pumpkin,20+i*52,152);}
  else for(let i=0;i<3;i++){ctx.drawImage(TILE.goldroof,104+i*16,92);ctx.drawImage(i===1?TILE.cdoor:TILE.cwall,104+i*16,108);}
  for(let x=10;x<W-10;x+=12){ctx.fillStyle=['#eb6654','#ffe05a','#409dc5','#a1d970','#ff6fae'][(x/12)%5|0];ctx.fillRect(x,40+Math.round(Math.sin(x/20)*3),8,6);}
  ctx.fillStyle='#202840';ctx.fillRect(10,40,W-20,1);
  const n=Math.min(S.guests.length,Math.floor((f.t-10)/6));
  S.guests.forEach((k,i)=>{if(i>=n)return;const s=SPR[k];if(!s)return;
    const lg=S.scene==='legend',row=lg?i%3:i%2,x=lg?10+Math.floor(i/3)*15+row*5:14+Math.floor(i/2)*18+(row?9:0),y=(lg?[172,186,200][row]:(row?196:178))+Math.round(Math.sin((tick+i*9)/12)*1);
    drawImg(i%3===0?flipOf(s):s,x-(s.width>>1),y-s.height);});
  drawPip(stageOfRank(G.rank),0,Math.floor(tick/14)%2,false,128,160,2);
  if(S.scene==='legend'){ctx.fillStyle='rgba(255,200,120,0.12)';ctx.fillRect(0,0,W,H);const hh=SPR.eaglet;ctx.drawImage(hh,150,160-hh.height*2,hh.width*2,hh.height*2);txt('THE LEGEND OF CHICKLANDIA',W/2,48,7,'#ffe05a',{align:'center',shadow:true});}
  const L=S.lines[f.line];
  if(f.t>=40){box(10,10,W-20,22,'#fff8ec','#202840');
    txt(L[1],16,13,5,'#ec6c24');
    txt(L[2].slice(0,Math.floor(f.shown)),16,22,5,'#202840');
    if(f.shown>=L[2].length&&Math.floor(tick/15)%2)txt('v',W-22,24,5,'#ec6c24');}
}
/* ---- credits ---- */
const CREDITS=[
  ['THANK YOU FOR PLAYING','PART 2!'],'',
  ['PIP THE CHICK'],'',
  ['MAMA HEN & PENNY','PEEP, CHEEP & TWEET'],'',
  ['GRANNY SHELL','BUCKY','DOE','MO','ELDA'],'',
  ['POSTMASTER PIDGE','CHEF REMY','CAPN PINCH','LIFEGUARD SANDY'],'',
  ['DAISY','CLYDE','PORKCHOP','WOOLLY','MRS. QUACKERS','SIR CLUCKINGTON'],'',
  ['SQUEAKS','NIBBLES','BISCUIT','WHISKERS','MAGGIE'],'',
  ['AND EVERY FRIEND','YOU MADE ALONG THE WAY'],'','',
  ['BUT WAIT...'],'',
  ["Animals from all over are asking","to move in near Pip's coop!"],'',
  ['TO BE CONTINUED...']];
function startCredits(){CRED={t:0,list:CREDITS};state='credits';fade=0;}
function updateCredits(){
  const c=CRED;c.t++;
  if(c.t%16===0&&c.t<900)SFX.flap();
  if(c.t>c.list.length*14+120&&pressed.a){const en=c.end;CRED=null;if(en){en();return;}const e=coopExit();P.x=e.x;P.y=e.y+8;CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;state='play';save();
    say([{who:'me',text:"What a day! And it sounds like there's more adventure ahead..."}]);}
  else if(pressed.a&&c.t>20)c.t+=6;
}
function drawCredits(){
  const c=CRED;ctx.fillStyle='#0d0814';ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){const x=(i*53)%W,y=(i*97+Math.floor(c.t/3))%H;ctx.fillStyle=(i+Math.floor(c.t/10))%5?'#29465b':'#ffe05a';ctx.fillRect(x,y,1,1);}
  let y=H-c.t*0.7+10;
  c.list.forEach(l=>{if(l==='')y+=8;else l.forEach((s0,j)=>{const big=l===c.list[0]||l[0]==='TO BE CONTINUED...'||s0[0]==='#',s=s0[0]==='#'?s0.slice(1):s0;if(y>-12&&y<H+4)txt(s,W/2,y,big?8:6,big?'#ffe05a':'#fff8ec',{align:'center'});y+=big?14:11;});});
  drawPip(stageOfRank(G.rank),0,Math.floor(tick/14)%2,false,W/2,Math.max(150,y+20),2);
  if(c.t>c.list.length*14+120&&Math.floor(c.t/25)%2)txt('Press Z to keep playing',W/2,H-14,6,'#b9d1dd',{align:'center'});
}

/* ---- Cap'n Pinch sails in with the treasure map (end of the village chapter) ---- */
let PIN=null;
const PINCH_LINES=["Ahoy, Pip! Cap'n Pinch be here! I sailed all night to find ye!","While scrubbin' me ship's hold, I found an OLD TREASURE MAP!","It leads to the PIRATE SEAS! Gold, volcanoes... and a gull named Captain Squawkbeard!","Get yer sea legs ready, matey. A grand adventure awaits ye!"];
function startPinch(){PIN={t:0,line:0,shown:0,lines:PINCH_LINES,after:pinchAfter};state='pinch';fade=0;SFX.fanfare();}
function pinchAfter(){G.flags.pinchMap=1;G.flags.seasReady=1;save();state='play';
  const sq={x:40*16+8,y:89*16+12};P.x=sq.x;P.y=sq.y+24;CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;
  say([{who:'me',text:"The Pirate Seas! I wonder what's out there... Cap'n Pinch will be at the city harbor, next to his ship."}]);}
function updatePinch(){
  const p=PIN;p.t++;if(p.t<40){fade=1-p.t/40;return;}fade=0;
  if(p.t<(p.sunset?60:260)){if(p.t%30===0)SFX.flap();return;}
  const L=p.lines[p.line];
  if(p.shown<L.length){p.shown+=TEXT_SPEED_MUL[SET.speed];if(pressed.a)p.shown=L.length;}
  else if(pressed.a){p.line++;p.shown=0;SFX.menu();
    if(p.line>=p.lines.length){const after=p.after;PIN=null;after();}}
}
function drawPinch(){
  const p=PIN;
  for(let i=0;i<9;i++){ctx.fillStyle=['#ff8a60','#ff9a6a','#ffaa78','#ffba88','#ffca98','#ffd8a8','#ffe0b8','#ffe8c8','#fff0d8'][i];ctx.fillRect(0,i*14,W,14);}
  ctx.fillStyle='#fff3a0';ctx.beginPath();ctx.arc(190,110,16,0,7);ctx.fill();
  ctx.fillStyle='#2a5fb0';ctx.fillRect(0,120,W,H-120);ctx.fillStyle='#3a70c8';for(let x=0;x<W;x+=10)ctx.fillRect(x,122+Math.round(Math.sin((x+tick*2)/9)*2),6,2);
  const sx=Math.round(lerp(300,110,Math.min(1,p.t/(p.sunset?40:240)))),sy=134+Math.round(Math.sin(tick/14)*2);
  ctx.fillStyle='#202840';ctx.fillRect(sx-4,sy-52,3,52);ctx.fillStyle='#fff8ec';ctx.beginPath();ctx.moveTo(sx,sy-50);ctx.lineTo(sx+34,sy-14);ctx.lineTo(sx,sy-14);ctx.fill();
  ctx.fillStyle='#eb6654';ctx.fillRect(sx-4,sy-56,12,5);
  for(let i=0;i<5;i++)ctx.drawImage(TILE.ship,sx-40+i*16,sy-12,16,16);
  drawImg(SPR.crab,sx-12,sy-12-SPR.crab.height+4+Math.round(Math.sin(tick/9)*1));
  if(p.t>=(p.sunset?60:260)){const L=p.lines[p.line];box(10,150,W-20,60,'#fff8ec','#202840');txt("CAP'N PINCH",16,155,5,'#ec6c24');
    wrap(L.slice(0,Math.floor(p.shown)),5,W-36).forEach((l,i)=>txt(l,16,166+i*10,5,'#202840'));
    if(p.shown>=L.length&&Math.floor(tick/15)%2)txt('v',W-22,198,5,'#ec6c24');}
}
