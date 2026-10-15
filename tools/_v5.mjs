import fs from 'fs';
let s=fs.readFileSync('src/systems/festival.js','utf8');
s=s.replace("function startFestival(){FEST={t:0,line:0,shown:0};state='festival';fade=0;SFX.fanfare();}",
`const HARVEST_GUESTS=['beaver','dog','pig','cat','horse','cow','deer','penny','rooster','hen','tortoise','sheepBow','duck','mouse','peacock','goat','badger','ferret','owlGlasses','pigeon','raccoon','catO','marmot','eagle','crab','gull'];
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
  coming:{lines:FEST_LINES,guests:FEST_GUESTS,scene:'coop',end:()=>{G.flags.festival=1;G.flags.part2done=1;save();startRankUp(7,startCredits);}},
  harvest:{lines:HARVEST_LINES,guests:HARVEST_GUESTS,scene:'harvest',end:()=>{G.flags.village=1;reward(QUESTS.vharvest.reward,'vharvest');save();startRankUp(8,startPinch);}}};
function startFestival(name){FEST={t:0,line:0,shown:0,S:FEST_SCRIPTS[name||'coming']};state='festival';fade=0;SFX.fanfare();}`);
s=s.replace("  const L=FEST_LINES[f.line];\n  if(f.shown<L[2].length)","  const L=f.S.lines[f.line];\n  if(f.shown<L[2].length)");
s=s.replace("    if(f.line>=FEST_LINES.length){FEST=null;G.flags.festival=1;G.flags.part2done=1;save();\n      startRankUp(7,startCredits);}","    if(f.line>=f.S.lines.length){const end=f.S.end;FEST=null;end();}");
const a=s.indexOf('function drawFestival(){'),b=s.indexOf('/* ---- credits');
const draw=`function drawFestival(){
  const f=FEST,S=f.S,harvest=S.scene==='harvest';
  drawSky(harvest?tick+700:tick);for(let x=0;x<W;x++){const h=Math.round(120+Math.sin(x/23)*5);ctx.fillStyle=harvest?'#8aa84a':'#4ea84a';ctx.fillRect(x,h,1,H-h);}
  for(let x=0;x<W;x+=16){ctx.drawImage(TILE.grass[(x/16)%3],x,150);ctx.drawImage(TILE.grass[(x/16+1)%3],x,166);ctx.drawImage(TILE.flower[(x/16)%2],x,182);}
  if(harvest){ctx.fillStyle='rgba(255,160,60,0.14)';ctx.fillRect(0,0,W,H);
    ctx.drawImage(SPR.windmillBase,108,64);const a=tick/40;ctx.strokeStyle='#21142b';ctx.lineWidth=3;for(let i=0;i<4;i++){const an=a+i*Math.PI/2;ctx.beginPath();ctx.moveTo(128,78);ctx.lineTo(128+Math.cos(an)*24,78+Math.sin(an)*24);ctx.stroke();}
    for(let i=0;i<5;i++)drawImg(SPR.pumpkin,20+i*52,152);}
  else for(let i=0;i<3;i++){ctx.drawImage(TILE.goldroof,104+i*16,92);ctx.drawImage(i===1?TILE.cdoor:TILE.cwall,104+i*16,108);}
  for(let x=10;x<W-10;x+=12){ctx.fillStyle=['#e03838','#ffd83a','#3a86e8','#94dc64','#ff6fae'][(x/12)%5|0];ctx.fillRect(x,40+Math.round(Math.sin(x/20)*3),8,6);}
  ctx.fillStyle='#21142b';ctx.fillRect(10,40,W-20,1);
  const n=Math.min(S.guests.length,Math.floor((f.t-10)/6));
  S.guests.forEach((k,i)=>{if(i>=n)return;const s=SPR[k];if(!s)return;
    const row=i%2,x=14+Math.floor(i/2)*18+(row?9:0),y=(row?196:178)+Math.round(Math.sin((tick+i*9)/12)*1);
    drawImg(i%3===0?flipOf(s):s,x-(s.width>>1),y-s.height);});
  drawPip(stageOfRank(G.rank),0,Math.floor(tick/14)%2,false,128,160,2);
  const L=S.lines[f.line];
  if(f.t>=40){box(10,10,W-20,22,'#fff8ec','#21142b');
    txt(L[1],16,13,5,'#ec6c24');
    txt(L[2].slice(0,Math.floor(f.shown)),16,22,5,'#21142b');
    if(f.shown>=L[2].length&&Math.floor(tick/15)%2)txt('v',W-22,24,5,'#ec6c24');}
}
`;
s=s.slice(0,a)+draw+s.slice(b);
s+=`
/* ---- Cap'n Pinch sails in with the treasure map (end of the village chapter) ---- */
let PIN=null;
const PINCH_LINES=["Ahoy, Pip! Cap'n Pinch be here! I sailed all night to find ye!","While scrubbin' me ship's hold, I found an OLD TREASURE MAP!","It leads to the PIRATE SEAS! Gold, volcanoes... and a gull named Captain Squawkbeard!","Get yer sea legs ready, matey. A grand adventure awaits ye!"];
function startPinch(){PIN={t:0,line:0,shown:0};state='pinch';fade=0;SFX.fanfare();}
function updatePinch(){
  const p=PIN;p.t++;if(p.t<40){fade=1-p.t/40;return;}fade=0;
  if(p.t<260){if(p.t%30===0)SFX.flap();return;}
  const L=PINCH_LINES[p.line];
  if(p.shown<L.length){p.shown+=TEXT_SPEED_MUL[SET.speed];if(pressed.a)p.shown=L.length;}
  else if(pressed.a){p.line++;p.shown=0;SFX.menu();
    if(p.line>=PINCH_LINES.length){PIN=null;G.flags.pinchMap=1;G.flags.seasReady=1;save();state='play';
      const sq={x:40*16+8,y:89*16+12};P.x=sq.x;P.y=sq.y+24;CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;
      say([{who:'me',text:"The Pirate Seas! I wonder what's out there... Cap'n Pinch said to meet at the city harbor when I'm ready."}]);}}
}
function drawPinch(){
  const p=PIN;
  for(let i=0;i<9;i++){ctx.fillStyle=['#ff8a60','#ff9a6a','#ffaa78','#ffba88','#ffca98','#ffd8a8','#ffe0b8','#ffe8c8','#fff0d8'][i];ctx.fillRect(0,i*14,W,14);}
  ctx.fillStyle='#fff3a0';ctx.beginPath();ctx.arc(190,110,16,0,7);ctx.fill();
  ctx.fillStyle='#2a5fb0';ctx.fillRect(0,120,W,H-120);ctx.fillStyle='#3a70c8';for(let x=0;x<W;x+=10)ctx.fillRect(x,122+Math.round(Math.sin((x+tick*2)/9)*2),6,2);
  const sx=Math.round(lerp(300,110,Math.min(1,p.t/240))),sy=134+Math.round(Math.sin(tick/14)*2);
  ctx.fillStyle='#21142b';ctx.fillRect(sx-4,sy-52,3,52);ctx.fillStyle='#fff8ec';ctx.beginPath();ctx.moveTo(sx,sy-50);ctx.lineTo(sx+34,sy-14);ctx.lineTo(sx,sy-14);ctx.fill();
  ctx.fillStyle='#e03838';ctx.fillRect(sx-4,sy-56,12,5);
  for(let i=0;i<5;i++)ctx.drawImage(TILE.ship,sx-40+i*16,sy-12,16,16);
  drawImg(SPR.crab,sx-12,sy-12-SPR.crab.height+4+Math.round(Math.sin(tick/9)*1));
  if(p.t>=260){const L=PINCH_LINES[p.line];box(10,150,W-20,60,'#fff8ec','#21142b');txt("CAP'N PINCH",16,155,5,'#ec6c24');
    wrap(L.slice(0,Math.floor(p.shown)),5,W-36).forEach((l,i)=>txt(l,16,166+i*10,5,'#21142b'));
    if(p.shown>=L.length&&Math.floor(tick/15)%2)txt('v',W-22,198,5,'#ec6c24');}
}
`;
fs.writeFileSync('src/systems/festival.js',s);
function ed(f,pairs){let t=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!t.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}t=t.replace(a,()=>b);}fs.writeFileSync(f,t);}
ed('src/main.js',[["    case 'festival':updateFestival();break;","    case 'festival':updateFestival();break;\n    case 'pinch':updatePinch();break;"]]);
ed('src/ui/render.js',[["  else if(state==='festival')drawFestival();","  else if(state==='festival')drawFestival();\n  else if(state==='pinch')drawPinch();"]]);
ed('src/engine/state.js',[["function resetTransient(){RU=null;FEST=null;CRED=null;","function resetTransient(){RU=null;FEST=null;CRED=null;PIN=null;VB=null;"]]);
