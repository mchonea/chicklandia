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
function startFestival(){FEST={t:0,line:0,shown:0};state='festival';fade=0;SFX.fanfare();}
function updateFestival(){
  const f=FEST;f.t++;
  if(f.t<40){fade=1-f.t/40;return;}fade=0;
  const L=FEST_LINES[f.line];
  if(f.shown<L[2].length){f.shown+=TEXT_SPEED_MUL[SET.speed];if(Math.floor(f.shown)%3===0&&f.t%2===0)SFX.blip(500+(f.line*53)%300);if(pressed.a)f.shown=L[2].length;}
  else if(pressed.a){
    f.line++;f.shown=0;SFX.menu();
    if(f.line>=FEST_LINES.length){FEST=null;G.flags.festival=1;G.flags.part2done=1;save();
      startRankUp(7,startCredits);}
  }
}
function drawFestival(){
  const f=FEST;
  drawSky(tick);for(let x=0;x<W;x++){const h=Math.round(120+Math.sin(x/23)*5);ctx.fillStyle='#4ea84a';ctx.fillRect(x,h,1,H-h);}
  for(let x=0;x<W;x+=16){ctx.drawImage(TILE.grass[(x/16)%3],x,150);ctx.drawImage(TILE.grass[(x/16+1)%3],x,166);ctx.drawImage(TILE.flower[(x/16)%2],x,182);}
  // the dream coop with its golden roof
  for(let i=0;i<3;i++){ctx.drawImage(TILE.goldroof,104+i*16,92);ctx.drawImage(i===1?TILE.cdoor:TILE.cwall,104+i*16,108);}
  // bunting
  for(let x=10;x<W-10;x+=12){ctx.fillStyle=['#e03838','#ffd83a','#3a86e8','#94dc64','#ff6fae'][(x/12)%5|0];ctx.fillRect(x,40+Math.round(Math.sin(x/20)*3),8,6);}
  ctx.fillStyle='#21142b';ctx.fillRect(10,40,W-20,1);
  // guests, popping in one by one
  const n=Math.min(FEST_GUESTS.length,Math.floor((f.t-10)/6));
  FEST_GUESTS.forEach((k,i)=>{if(i>=n)return;const s=SPR[k];if(!s)return;
    const row=i%2,x=14+Math.floor(i/2)*18+(row?9:0),y=(row?196:178)+Math.round(Math.sin((tick+i*9)/12)*1);
    drawImg(i%3===0?flipOf(s):s,x-(s.width>>1),y-s.height);});
  drawPip(stageOfRank(G.rank),0,Math.floor(tick/14)%2,false,128,160,2);
  const L=FEST_LINES[f.line];
  if(f.t>=40){box(10,10,W-20,22,'#fff8ec','#21142b');
    txt(L[1],16,13,5,'#ec6c24');
    txt(L[2].slice(0,Math.floor(f.shown)),16,22,5,'#21142b');
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
function startCredits(){CRED={t:0};state='credits';fade=0;}
function updateCredits(){
  const c=CRED;c.t++;
  if(c.t%16===0&&c.t<900)SFX.flap();
  if(c.t>CREDITS.length*14+120&&pressed.a){CRED=null;const e=coopExit();P.x=e.x;P.y=e.y+8;CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;state='play';save();
    say([{who:'me',text:"What a day! And it sounds like there's more adventure ahead..."}]);}
  else if(pressed.a&&c.t>20)c.t+=6;
}
function drawCredits(){
  const c=CRED;ctx.fillStyle='#0d0814';ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){const x=(i*53)%W,y=(i*97+Math.floor(c.t/3))%H;ctx.fillStyle=(i+Math.floor(c.t/10))%5?'#3b2a56':'#ffd83a';ctx.fillRect(x,y,1,1);}
  let y=H-c.t*0.7+10;
  CREDITS.forEach(l=>{if(l==='')y+=8;else l.forEach((s,j)=>{const big=l===CREDITS[0]||l[0]==='TO BE CONTINUED...';if(y>-12&&y<H+4)txt(s,W/2,y,big?8:6,big?'#ffd83a':'#fff8ec',{align:'center'});y+=big?14:11;});});
  drawPip(stageOfRank(G.rank),0,Math.floor(tick/14)%2,false,W/2,Math.max(150,y+20),2);
  if(c.t>CREDITS.length*14+120&&Math.floor(c.t/25)%2)txt('Press Z to keep playing',W/2,H-14,6,'#b8a8d8',{align:'center'});
}
