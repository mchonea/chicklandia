'use strict';
/* =====================================================================
   RENDERING
   ===================================================================== */
let TQ=[];
function txt(s,x,y,size=7,color='#fff8ec',o={}){if(SET.big&&size<7)size+=1;TQ.push({s:tt(s),x,y,size,color,align:o.align||'left',shadow:o.shadow,alpha:o.alpha==null?1:o.alpha});}
function measure(s,size){dctx.font=(size*K)+'px '+FONT;return dctx.measureText(s).width/K;}
function wrap(s,size,maxW){const words=s.split(' '),lines=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;if(cur&&measure(t,size)>maxW){lines.push(cur);cur=w;}else cur=t;}
  if(cur)lines.push(cur);return lines;}
function box(x,y,w,h,fill='#1d1430',border='#ffd83a'){
  x=Math.round(x);y=Math.round(y);ctx.fillStyle=border;ctx.fillRect(x+1,y,w-2,h);ctx.fillRect(x,y+1,w,h-2);
  ctx.fillStyle=fill;ctx.fillRect(x+2,y+1,w-4,h-2);ctx.fillRect(x+1,y+2,w-2,h-4);
}
function shadow(x,y,w){ctx.fillStyle='rgba(20,10,30,0.28)';ctx.fillRect(Math.round(x-w/2)+1,Math.round(y)-1,w-2,3);ctx.fillRect(Math.round(x-w/2),Math.round(y),w,1);}
function drawImg(s,x,y){ctx.drawImage(s,Math.round(x),Math.round(y));}

function drawWorld(){
  const sx0=shake?((Math.random()*3)|0)-1:0,sy0=shake?((Math.random()*3)|0)-1:0;
  const cx=Math.round(camX)-sx0,cy=Math.round(camY)-sy0;
  const c0=Math.floor(cx/16),r0=Math.floor(cy/16),wf=Math.floor(tick/32)%2;
  for(let r=r0;r<=r0+12;r++)for(let c=c0;c<=c0+16;c++){
    const ch=tileAt(c,r),sx=c*16-cx,sy=r*16-cy+HUD;drawTile(ch,c,r,sx,sy,wf);
    if(G.puddle>0.05&&(r<24||(r>=60&&r<84))&&'.,d=~'.includes(ch)&&hash2(c,r)%9===0){const pw=Math.round(10*G.puddle)+2,ph=Math.round(5*G.puddle)+1;
      ctx.fillStyle='#5d8fd8';ctx.fillRect((sx+8-pw/2)|0,(sy+9-ph/2)|0,pw,ph);ctx.fillStyle='#a6d0ff';ctx.fillRect((sx+9-pw/2)|0,(sy+9-ph/2)|0,Math.max(1,pw-3),1);}
  }
  drawSunbeam(cx,cy);
  for(const b of BUILDINGS){const px=b.door[0]*16+8-cx,py=b.door[1]*16-cy+HUD;if(px<-24||px>W+24||py<HUD-16||py>H)continue;
    const open=buildingOpen(b),lab=open?b.sign:'CLOSED',w=Math.ceil(measure(lab,5))+6;
    ctx.fillStyle='#21142b';ctx.fillRect(Math.round(px-w/2),py-10,w,10);ctx.fillStyle=open?'#f2dca0':'#ffc8c8';ctx.fillRect(Math.round(px-w/2)+1,py-9,w-2,8);
    txt(lab,px,py-8,5,open?'#5e3a1c':'#c02020',{align:'center'});}
  if(G.coop&&G.coop.lv>=4&&regionAt().id==='coop'){const cols=['#e03838','#ffd83a','#3a86e8','#94dc64','#ff6fae'];
    for(let i=0;i<30;i++){const bx=34+i*6.4,by=HUD+48+Math.round(Math.sin(i/2.5)*2);ctx.fillStyle=cols[i%5];ctx.fillRect(bx|0,by,5,2);ctx.fillRect((bx+1)|0,by+2,3,2);ctx.fillRect((bx+2)|0,by+4,1,1);}
    if(tick%8===0)parts.push({x:camX+40+Math.random()*176,y:camY+50,vx:(Math.random()-.5)*0.4,vy:0.4+Math.random()*0.4,g:0,life:120,c:cols[(Math.random()*5)|0]});}
  if((wearing('pirate')||rankAtLeast(3))&&Math.floor(tick/8)%3){ctx.fillStyle=Math.floor(tick/16)%2?'#ffd21e':'#fff8ec';
    for(let r=r0;r<=r0+12;r++)for(let c=c0;c<=c0+16;c++){const k=c+','+r,ch=tileAt(c,r),h=HIDDEN[k];
      const secret=(h&&!G.collected.has(h.id)&&'RCL'.includes(ch))||(c===18&&r===16&&ch==='L')||ch==='Z';
      if(secret&&senseNear(c*16+8,r*16+8)){const sx=c*16-cx,sy=r*16-cy+HUD,o=(tick/6+c*3+r)%12|0;ctx.fillRect(sx+2+o,sy+3,1,1);ctx.fillRect((sx+12-o/2)|0,sy+9,1,1);ctx.fillRect(sx+7,sy+1+(o%5),1,1);}}}
  for(const e of ents)if(e.type==='hole'&&onCur(e)){const hx=Math.round(e.x-cx),hy=Math.round(e.y-cy+HUD);
    ctx.fillStyle=PAL.B;ctx.fillRect(hx-7,hy-5,14,6);ctx.fillStyle='#140a08';ctx.fillRect(hx-6,hy-4,12,4);
    if(e.up>0){const s=e.gold?SPR.carrotG:SPR.carrot,rise=Math.min(7,e.up,e.max-e.up+1),vis=Math.min(s.height,rise+1);
      ctx.drawImage(s,0,0,s.width,vis,hx-s.width,hy-1-vis*2,s.width*2,vis*2);}}
  const list=ents.filter(e=>e.type!=='hole'&&Math.abs(e.x-camX-128)<160&&Math.abs(e.y-camY-96)<130);
  list.push({type:'player',y:P.y});
  list.sort((a,b)=>a.y-b.y);
  const ocx=camX,ocy=camY;camX=cx;camY=cy;
  for(const e of list){if(e.type==='player')drawPlayer();else drawEnt(e);}
  for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x-camX),Math.round(p.y-camY+HUD),2,2);}
  camX=ocx;camY=ocy;drawSeasonFX(cx,cy);drawSeaFX(cx,cy);drawSkyFX(cx,cy);
}
function drawPlayer(){
  const st=stage(),sx=Math.round(P.x-camX),sy=Math.round(P.y-camY+HUD);
  const overWater=tileAt(Math.floor(P.x/16),Math.floor((P.y-2)/16))==='W';
  const flap=overWater||P.flapAnim>0||P.flying;
  const fr=flap?Math.floor(tick/5)%2:(P.moving?Math.floor(tick/7)%2:0);
  const under=tileAt(Math.floor(P.x/16),Math.floor((P.y-2)/16)),swim=under==='w'||under==='x',glide=under==='z';
  if(!swim&&!glide)shadow(sx,sy+1,10+st*2-(P.z>4?2:0));
  if(P.inv>0&&Math.floor(P.inv/4)%2)return;
  let ox=0,oy=0;if(P.peckT>6){ox=DIRV[P.dir][0]*3;oy=DIRV[P.dir][1]*3;}
  if(swim){const bob2=Math.round(Math.sin(tick/9)*1.2);ctx.save();ctx.beginPath();ctx.rect(0,0,W,sy-1+bob2);ctx.clip();
    drawPip(st,P.dir,P.moving?Math.floor(tick/9)%2:0,false,sx+ox,sy+5+oy+bob2,1);ctx.restore();
    ctx.fillStyle='#a6d0ff';ctx.fillRect(sx-7,sy-1+bob2,14,1);if(P.moving&&tick%10<5){ctx.fillRect(sx-10,sy+1,3,1);ctx.fillRect(sx+7,sy+1,3,1);}return;}
  if(glide){drawPip(st,P.dir,Math.floor(tick/6)%2,true,sx+ox,sy-4+oy+Math.round(Math.sin(tick/8)*2),1);return;}
  const bob=overWater?Math.round(Math.sin(tick/8)*1.5)-3:0;
  drawPip(st,P.dir,fr,flap,sx+ox,sy+2-Math.round(P.z)+oy+bob,1);
}
function questMarker(e){
  {const m=skyMarker(e);if(m!==undefined)return m;}
  if(e.id==='nibbles')return G.items.letter?SPR.ques:null;
  if(G.mail&&G.mail[e.id]===1)return SPR.ques;
  const q=QUESTS[e.id];if(!q)return null;const st=G.q[e.id];
  if(e.id==='mom'){if(st===1&&q.check())return SPR.ques;return null;}
  if(st===0)return SPR.excl;if(st===1&&q.check())return SPR.ques;return trainerMarker(e);
}
function trainerMarker(e){
  for(const k in TRAIN){const t=TRAIN[k];if(t.who!==e.id||has(k))continue;const st=G.train[k]||0;
    if(st===0&&t.avail())return SPR.pexcl;if(st===1&&trainCount(k)>=t.need)return SPR.pques;}
  return null;
}
function drawEnt(e){
  const sx=Math.round(e.x-camX),sy=Math.round(e.y-camY+HUD);
  switch(e.type){
    case 'npc':{let s=SPR[e.spr];if(e.flip)s=flipOf(s);const bob=Math.floor((tick+e.phase)/32)%2;
      shadow(sx,sy+1,Math.min(18,s.width-4));const top=sy+2-s.height;drawImg(s,sx-(s.width>>1),top+bob);
      if(e.id==='daisy'&&G.q.daisy===2)drawImg(SPR.bell,sx-5,top+10+bob);
      if(state==='play'||state==='talk'){const m=questMarker(e);if(m&&!(dlg&&dlg.lines[dlg.i].who===e))drawImg(m,sx-(m.width>>1),top-m.height-3+Math.round(Math.sin(tick/9)*1.5));}
      break;}
    case 'hive':case 'bees':case 'snowball':case 'crab':case 'spot':drawHaz(e,sx,sy);break;
    case 'bowl':{if(!has('fly'))break;ctx.fillStyle='#21142b';ctx.fillRect(sx-6,sy-6,12,7);ctx.fillStyle='#c49a5c';ctx.fillRect(sx-5,sy-5,10,5);ctx.fillStyle='#9a6234';ctx.fillRect(sx-5,sy-2,10,2);
      ctx.fillStyle='#e8c88a';ctx.fillRect(sx-3,sy-7,2,2);ctx.fillRect(sx,sy-8,2,2);ctx.fillRect(sx+2,sy-7,2,2);ctx.fillRect(sx-4,sy-6,2,1);
      if(tick%90<8){ctx.fillStyle='#fff';ctx.fillRect(sx+4,sy-9,1,1);}break;}
    case 'fmound':case 'star':case 'flag':case 'vane':case 'cduck':case 'decor':case 'exhibit':case 'easel':case 'nook':drawCityEnt(e,sx,sy);break;
    case 'vpad':case 'vnode':case 'vsheep':case 'vmail':case 'vboard':case 'vwhistle':case 'vcontest':case 'windmill':case 'scarecrow':case 'vsculpt':drawVillageEnt(e,sx,sy);break;
    case 'gullp':case 'jelly':case 'spark':case 'bubbles':case 'swarp':case 'shipdock':case 'xmark':case 'seachest':case 'brazier':case 'boss':case 'barrel':drawSeaEnt(e,sx,sy);break;
    case 'spad':case 'svent':case 'sport':case 'sgate':case 'gchime':case 'skychest':case 'snest':case 'sbell':case 'scrys':case 'sdragon':drawSkyEnt(e,sx,sy);break;
    case 'worm':{const s=SPR.worm[Math.floor((tick+e.phase)/12)%2];drawImg(s,sx-(s.width>>1),sy+2-s.height);break;}
    case 'carrot':{const s=SPR.carrot,w=Math.floor((tick+e.x)/40)%2;drawImg(s,sx-(s.width>>1)+w,sy+2-s.height);break;}
    case 'mound':{const s=SPR.mound;drawImg(s,sx-(s.width>>1),sy+2-s.height);if(senseNear(e.x,e.y)&&(e.has==='seed'||e.has==='bone')&&tick%24<12){ctx.fillStyle='#ffd21e';ctx.fillRect(sx-1,sy-8,2,2);ctx.fillRect(sx+4,sy-5,1,1);}break;}
    case 'block':{drawImg(SPR.block,sx-8,sy-16);
      if(PLATES.some(([c,r])=>c===e.bc&&r===e.br)&&!e.sl){ctx.fillStyle=Math.floor(tick/15)%2?'#ffd21e':'#fff3a0';ctx.fillRect(sx-5,sy-12,10,1);}break;}
    case 'chest':{const s=G.chest?SPR.chestOpen:SPR.chest;drawImg(s,sx-(s.width>>1),sy+1-s.height);
      if(!G.chest&&(tick%60)<4){ctx.fillStyle='#fff';ctx.fillRect(sx+4,sy-s.height,1,1);}break;}
    case 'follower':{let s=e.kind==='fawn'?SPR.fawn:SPR.turtle;if(e.flip)s=flipOf(s);ctx.globalAlpha=e.alpha==null?1:Math.max(0,e.alpha);
      const wet='wW'.includes(tileAt(Math.floor(e.x/16),Math.floor((e.y-2)/16)));if(!wet)shadow(sx,sy+1,8);
      const hop=e.mode==='follow'&&P.moving?Math.floor(tick/6)%2:0;drawImg(s,sx-(s.width>>1),sy+2-s.height-hop+(wet?3:0));ctx.globalAlpha=1;break;}
    case 'plot':{const st=G.plots[e.id];if(!st){if(G.thumb&&tick%90<45){ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fillRect(sx-1,sy-6,2,2);}break;}
      const s=SPR.plant[st.p>=1?2:st.p>=0.33?1:0],pk=st.k||'plain',big=pk==='giant'?(0.7+0.5*Math.min(1,st.p)):1;
      if(big!==1){ctx.drawImage(s,Math.round(sx-s.width*big/2),Math.round(sy+1-s.height*big),Math.round(s.width*big),Math.round(s.height*big));}else drawImg(s,sx-(s.width>>1),sy+1-s.height);
      if(pk==='moon'){ctx.fillStyle='rgba(150,170,255,'+(st.p>=1?0.5:0.25)+')';ctx.fillRect(sx-5,sy-s.height-1,10,s.height);}
      if(pk==='speedy'&&tick%20<10){ctx.fillStyle='#ffd83a';ctx.fillRect(sx+4,sy-s.height+2,1,2);}
      if(st.p>=1&&(tick+((e.x*3)|0))%40<6){ctx.fillStyle='#fff';ctx.fillRect(sx+3,sy-s.height,1,1);}break;}
    case 'fishspot':{const w=Math.round(Math.sin(tick/20)*4);ctx.fillStyle='rgba(20,40,90,0.55)';ctx.fillRect(sx-4+w,sy-6,8,3);ctx.fillRect(sx+4+w,sy-7,2,5);
      if(tick%80<6){ctx.fillStyle='#fff';ctx.fillRect(sx+w,sy-9,1,1);}break;}
    case 'puff':{const s=SPR.puff;drawImg(s,sx-(s.width>>1),sy-14-s.height+Math.round(Math.sin(e.p*2)*2));ctx.fillStyle='rgba(20,10,30,0.18)';ctx.fillRect(sx-3,sy,6,1);break;}
    case 'stump':{const s=SPR.stump;shadow(sx,sy+1,12);drawImg(s,sx-(s.width>>1),sy+2-s.height);break;}
    case 'berry':{const s=SPR.berryBush;shadow(sx,sy+1,12);drawImg(s,sx-(s.width>>1),sy+2-s.height);break;}
    case 'ffly':{const on=Math.sin(e.p*4)>-0.4;ctx.fillStyle=on?'#f4ff8a':'#a8c850';ctx.fillRect(sx-1,sy-9,3,3);if(on){ctx.fillStyle='#fff';ctx.fillRect(sx,sy-8,1,1);}break;}
    case 'item':{const s=SPR[e.kind];if(cellAt()&&cellAt().kind==='water'&&!wearing('pirate')&&Math.hypot(P.x-e.x,P.y-e.y)>64){if(tick%50<8){ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(sx,sy-6,2,2);}break;}shadow(sx,sy,8);const fl=e.kind==='feather'||e.kind==='seed'?Math.round(Math.sin((tick+e.x)/12)):0;
      drawImg(s,sx-(s.width>>1),sy-s.height-Math.round(e.z)+fl-1);
      if((tick+((e.x*7)|0))%50<4){ctx.fillStyle='#fff';ctx.fillRect(sx+3,sy-s.height-2,1,1);}break;}
    case 'duckling':{let s=SPR.duckling;if(e.flip)s=flipOf(s);const inW=tileAt(Math.floor(e.x/16),Math.floor((e.y-2)/16))==='W';
      const bob=Math.floor((tick+e.phase)/20)%2;
      if(inW){ctx.drawImage(s,0,0,s.width,s.height-3,sx-(s.width>>1),sy-s.height+4+bob,s.width,s.height-3);ctx.fillStyle=PAL.c;ctx.fillRect(sx-6,sy+1,12,1);}
      else{shadow(sx,sy+1,8);drawImg(s,sx-(s.width>>1),sy+2-s.height-(e.mode==='wait'?bob:0));}
      break;}
    case 'fox':{let s=SPR.fox;if(e.flip)s=flipOf(s);if(e.flash>0&&Math.floor(e.flash/2)%2)return;
      ctx.globalAlpha=e.alpha==null?1:Math.max(0,e.alpha);shadow(sx,sy+1,14);
      const hopY=e.moving?Math.floor(tick/6)%2:0;drawImg(s,sx-(s.width>>1),sy+2-s.height-hopY);
      if(e.stun>0&&!e.gone&&e.kt<=0){ctx.fillStyle='#ffd83a';const a=tick/6;ctx.fillRect(sx+Math.round(Math.cos(a)*6),sy-s.height-2+Math.round(Math.sin(a)*2),2,2);ctx.fillRect(sx+Math.round(Math.cos(a+3.1)*6),sy-s.height-2+Math.round(Math.sin(a+3.1)*2),2,2);}
      ctx.globalAlpha=1;break;}
    case 'goose':{let s=SPR.goose;if(e.flip)s=flipOf(s);if(e.flash>0&&Math.floor(e.flash/2)%2)return;
      if(!e.blown)shadow(sx,sy+1,14);const lift=e.blown?Math.min(40,e.t):0;
      const wob=e.st==='charge'?Math.floor(tick/3)%2:0;drawImg(s,sx-(s.width>>1),sy+2-s.height-lift-wob);
      if(e.blown){ctx.fillStyle='#fff8ec';for(let i=0;i<3;i++)ctx.fillRect(sx-14-i*6,sy-10-lift+((tick+i*3)%6),4,1);}
      break;}
  }
}
function drawHUD(){
  ctx.fillStyle='#1d1430';ctx.fillRect(0,0,W,HUD);ctx.fillStyle='#3b2a56';ctx.fillRect(0,HUD-2,W,2);
  const mh=maxHearts();for(let i=0;i<mh;i++)drawImg(i<G.hearts?SPR.heart:SPR.heartE,6+i*9,5);
  drawImg(SPR.seed,6,17);txt('x'+G.seeds,16,19,7,'#fff8ec');
  drawImg(nightAmt()>0.5?ICO.moon:(duskAmt()>0.3?ICO.dusk:ICO.sun),40,17);
  if(G.weather!=='clear'&&G.wInt>0.3)drawImg(ICO[G.weather],49,17);
  {const rk=RANKS[G.rank-1],nx=nextRank(),full=rankFull();
   txt(rk.short,74,5,5,'#ffd83a');
   ctx.fillStyle='#21142b';ctx.fillRect(74,15,80,7);ctx.fillStyle='#3b2a56';ctx.fillRect(75,16,78,5);
   const fw=Math.round(78*(nx?rankProgress():1));ctx.fillStyle=full?(Math.floor(tick/10)%2?'#fff8ec':'#ffd83a'):'#94dc64';ctx.fillRect(75,16,fw,5);
   if(full)txt('FULL!',114,24,4,'#fff8ec',{align:'center'});}
  if(!inBeyond()){txt('E:GROW',160,6,6,'#d8c8f8');txt('Q:QUESTS',160,19,6,'#d8c8f8');}
  if(G.wear&&WEAR_ICON[G.wear]){const ic=WEAR_ICON[G.wear];drawImg(ic,60,26-ic.height);}
  {const cl=cellAt();if(cl&&cl.region.id==='rooms'){txt('INSIDE',232,7,5,'#b8a8d8',{align:'center'});txt(cl.label,232,18,5,'#ffd83a',{align:'center'});return;}
   if(cl&&cl.region.id==='secrets'){txt('SECRET!',232,7,5,'#d890ff',{align:'center'});txt(cl.label,232,18,5,'#ffd83a',{align:'center'});return;}}
  if(inBeyond()){
    const cl0=cellAt(),rid=cl0.region.id;
    if(cl0.kind==='water'){txt('DEEP REEF',252,7,5,'#a6e0ff',{align:'right'});ctx.fillStyle='#21142b';ctx.fillRect(168,16,84,8);ctx.fillStyle='#3a70c8';ctx.fillRect(169,17,82,6);const f=(G.air==null?AIR_MAX:G.air)/AIR_MAX;ctx.fillStyle=f>0.25?'#a6e0ff':(Math.floor(tick/6)%2?'#ff8080':'#fff8ec');ctx.fillRect(169,17,Math.round(82*f),6);txt('AIR',208,25,4,'#fff8ec',{align:'center'});return;}
    if(rid==='fortress'&&bossActive()&&BOSS){txt('SQUAWKBEARD',252,7,5,'#ff8080',{align:'right'});for(let i=0;i<BOSS.max;i++){ctx.fillStyle=i<BOSS.hp?'#ff8080':'#4a3a66';ctx.fillRect(252-(BOSS.max-i)*10,17,8,7);}return;}
    if(rid==='lair'&&skyBossActive()&&SKB){drawSkyBossHUD();return;}
    if(rid==='cityin'||rid==='rooftops'||rid==='skyin'){txt(rid==='rooftops'?'ROOFTOPS':'INSIDE',252,7,5,'#b8a8d8',{align:'right'});txt(rid==='rooftops'?'RACE!':cl0.label,252,18,5,'#ffd83a',{align:'right'});return;}
    const a=areaOf();txt(AREA_LABEL[a],220,7,5,'#94dc64',{align:'right'});txt(a==='coop'?'HOME':a==='village'&&G.vil.open?seasonNow().name:'F: FLY',220,18,5,'#ffd83a',{align:'right'});
    // minimap of the whole beyond-the-farm overworld (outdoor areas plus the coop room)
    const cs=MINIMAP_BEYOND(),w=Math.min(9,Math.floor((31-(cs.cols-1))/cs.cols)),h=Math.min(8,Math.floor((27-(cs.rows-1))/cs.rows));
    for(const c of cs.cells){const cur=CS.x===c.sx&&CS.y===c.sy,vis=G.visited.has(c.sx+','+c.sy);
      ctx.fillStyle=cur?(Math.floor(tick/20)%2?'#ffd83a':'#ffb020'):(vis?'#6a5a90':'#3b2a56');ctx.fillRect(224+(c.sx-cs.x0)*(w+1),3+(c.sy-cs.y0)*(h+1),w,h);}
    return;}
  for(let y=0;y<2;y++)for(let x=0;x<3;x++){const cur=CS.x===x&&CS.y===y,vis=G.visited.has(x+','+y);
    ctx.fillStyle=cur?(Math.floor(tick/20)%2?'#ffd83a':'#ffb020'):(vis?'#6a5a90':'#3b2a56');ctx.fillRect(214+x*12,7+y*9,11,8);}
}
function drawToast(){
  if(!toasts.length)return;const t=toasts[0],a=Math.min(1,t.t/10,(170-t.t)/15);
  const w=Math.min(240,measure(t.s,7)+16);const x=(W-w)/2,y=HUD+6-Math.round((1-a)*10);
  ctx.globalAlpha=a;box(x,y,Math.round(w),16,'#1d1430',t.color);ctx.globalAlpha=1;
  txt(t.s,W/2,y+5,7,t.color,{align:'center',alpha:a});
}
function drawFloats(){
  for(const f of floats){const a=Math.min(1,f.life/20);txt(f.s,f.x-camX,f.y-camY+HUD,6,f.color,{align:'center',shadow:true,alpha:a});}
}
function drawBubble(){
  if(!dlg)return;const line=dlg.lines[dlg.i];const sp=speakerPos(line.who);
  const size=7,lh=10,lines=wrap(line.text,size,176);
  const ch=line.choices;
  const tw=Math.max(...lines.map(l=>measure(l,size)),measure(sp.name,5)+8,ch?measure('> '+ch[0]+'    > '+ch[1],size):0);
  const w=Math.ceil(tw)+14,h=lines.length*lh+10+(ch?12:0);
  let bx=clamp(Math.round(sp.x-w/2),4,W-4-w),by=Math.round(sp.top-h-10),up=false;
  if(by<HUD+12){by=Math.round(sp.bot+10);up=true;}
  if(by+h>H-4)by=H-4-h;
  box(bx,by,w,h,'#fff8ec','#21142b');
  const tx=clamp(Math.round(sp.x),bx+8,bx+w-8);
  for(let i=0;i<6;i++){const ww=Math.max(1,9-i*2),yy=up?by-i:by+h-1+i;
    ctx.fillStyle='#21142b';ctx.fillRect(tx-(ww>>1)-1,yy,ww+2,1);if(i<5){ctx.fillStyle='#fff8ec';ctx.fillRect(tx-(ww>>1),yy,ww,1);}}
  const nw=Math.ceil(measure(sp.name,5))+8;box(bx+4,by-7,nw,10,line.who==='me'?'#ffd83a':'#ec6c24','#21142b');
  txt(sp.name,bx+8,by-4,5,'#21142b');
  let left=Math.floor(dlg.shown);
  lines.forEach((l,i)=>{if(left<=0)return;const part=l.slice(0,left);left-=l.length+1;txt(part,bx+7,by+6+i*lh,size,'#21142b');});
  if(ch&&dlg.shown>=line.text.length){const sel=dlg.sel||0,cy=by+8+lines.length*lh,half=Math.floor((w-14)/2);
    ch.forEach((c,i)=>txt((i===sel?'> ':'  ')+c,bx+7+i*half,cy,size,i===sel?'#e03838':'#8a7ab0'));}
  else if(dlg.shown>=line.text.length&&Math.floor(tick/15)%2){ctx.fillStyle='#ec6c24';const ax=bx+w-9,ay=by+h-7;ctx.fillRect(ax,ay,5,1);ctx.fillRect(ax+1,ay+1,3,1);ctx.fillRect(ax+2,ay+2,1,1);}
}
function drawGrow(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);
  if(growPage===2){drawJournal();return;}
  const gcol=growPage===1?'#a6e0ff':growPage===3?'#94dc64':growPage===4?'#46b8c8':growPage===5?'#ffb8e0':'#ffd83a';
  box(4,4,W-8,H-8,'#241838',gcol);
  const SKILLS=TREE();
  txt(growPage===1?'SKY TREE':growPage===3?'VILLAGE TREE':growPage===4?'SEA TREE':growPage===5?'SKY TREE II':'GROWTH TREE',W/2,10,9,gcol,{align:'center',shadow:true});
  txt('X: next page',W/2,22,5,'#8a7ab0',{align:'center'});
  const big=lvlAnim>0?1:0;drawPip(stage(),0,Math.floor(tick/12)%2,lvlAnim>60,28,46,1+big);
  txt(RANKS[G.rank-1].name,48,24,6,'#ffd83a');txt('LV '+level()+'   GROWTH '+G.gp,48,34,5,'#b8a8d8');
  drawImg(SPR.seed,196,22);txt('x'+G.seeds,206,24,7,'#fff8ec');
  for(const s of SKILLS)for(const rq of s.req){const r=SKILLS.find(x=>x.id===rq);const lit=has(rq);
    ctx.fillStyle=lit?'#ffd83a':'#4a3a66';const x0=r.x+13,x1=s.x-13,mx=Math.round((x0+x1)/2);
    ctx.fillRect(x0,r.y-1,mx-x0,2);ctx.fillRect(mx-1,Math.min(r.y,s.y)-1,2,Math.abs(s.y-r.y)+2);ctx.fillRect(mx,s.y-1,x1-mx,2);}
  SKILLS.forEach((s,i)=>{
    const st=skillState(s),sel=i===growSel,sz=s.id==='fly'?28:24,x=s.x-sz/2,y=s.y-sz/2;
    if(sel){ctx.fillStyle=Math.floor(tick/10)%2?'#ff6fae':'#fff8ec';ctx.fillRect(x-3,y-3,sz+6,sz+6);}
    box(x,y,sz,sz,st==='learned'?'#4a3a1a':(st==='open'?'#3b2a56':st==='train'?'#3a2040':'#1d1430'),st==='learned'?'#ffd83a':(st==='open'?'#fff8ec':st==='train'?'#ff9cd0':'#4a3a66'));
    const ic=ICON[s.id];ctx.globalAlpha=st==='locked'?0.3:st==='train'?0.6:1;drawImg(ic,s.x-(ic.width>>1),s.y-(ic.height>>1));ctx.globalAlpha=1;
    if(st==='train'||(TRAIN[s.id]&&st==='locked'&&G.train[s.id]!==2)){box(x+sz-7,y-3,10,10,'#ff9cd0','#21142b');txt('!',x+sz-2,y-1,5,'#21142b',{align:'center'});}
    if(st==='learned')txt('OK',s.x,y+sz+3,5,'#94dc64',{align:'center'});
    else{drawImg(SPR.seed,s.x-8,y+sz+2);txt(''+s.cost,s.x+1,y+sz+3,5,st==='locked'?'#6a5a90':(G.seeds>=s.cost?'#fff8ec':'#ff8080'));}
  });
  const s=SKILLS[growSel],st=skillState(s);
  box(10,152,W-20,62,'#1d1430','#6a5a90');
  txt(s.name,18,158,7,st==='learned'?'#ffd83a':'#fff8ec');
  wrap(s.desc,6,W-40).slice(0,2).forEach((l,i)=>txt(l,18,169+i*9,6,'#d8c8f8'));
  let msg,col;
  if(growMsg){msg=growMsg.s;col=growMsg.c;}
  else if(st==='learned'){msg='Learned!';col='#94dc64';}
  else if(st==='locked'){msg='Locked - learn '+s.req.filter(r=>!has(r)).map(r=>SKILLS.find(x=>x.id===r).name).join(' & ')+' first';col='#8a7ab0';}
  else if(st==='train'){msg=trainMsg(s.id);col='#ff9cd0';}
  else{msg=G.seeds>=s.cost?'Press Z to learn ('+s.cost+' seed'+(s.cost>1?'s':'')+')':'Costs '+s.cost+' seeds - you have '+G.seeds;col=G.seeds>=s.cost?'#ffd83a':'#ff8080';}
  wrap(msg,6,W-40).slice(0,2).forEach((l,i)=>txt(l,18,190+i*9,6,col));
  txt('E: close',W-14,10,5,'#8a7ab0',{align:'right'});
  if(lvlAnim>0){const a=Math.min(1,lvlAnim/20);const y=86-Math.round((110-lvlAnim)<15?(15-(110-lvlAnim))*2:0);
    ctx.globalAlpha=a;box(58,y,140,22,'#ffd83a','#21142b');ctx.globalAlpha=1;
    txt('LEVEL UP!  LV '+level(),W/2,y+7,8,['#21142b','#e03838'][Math.floor(tick/6)%2],{align:'center',alpha:a});
    if(lvlAnim%6===0)puff(W/2+(Math.random()-.5)*120,y+10,3,['#ffd83a','#fff8ec','#ff6fae'],1.5,0.05);
    for(const p of parts){ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x),Math.round(p.y),2,2);}
  }
}
function drawQuests(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ffd83a');
  if(questPage===2){drawTrainingPage(0);return;}
  if(questPage===8){drawTrainingPage(6);return;}
  if(questPage===7){drawSkyPage();return;}
  if(questPage===3){drawCityPage();return;}
  if(questPage===5){drawVillagePage();return;}
  if(questPage===6){drawSeasPage();return;}
  if(questPage===4){drawSleuthPage();return;}
  txt(questPage===1?'QUESTS - PART 2':'QUESTS',W/2,12,9,'#ffd83a',{align:'center',shadow:true});
  if(questPage){
    ORDER2.forEach((id,i)=>{const y=25+i*17,q=QUESTS[id],st=G.q[id];
      box(10,y,W-20,15,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
      if(st===0){txt('???',16,y+5,5,'#6a5a90');txt('not met yet',W-16,y+5,5,'#6a5a90',{align:'right'});return;}
      txt(q.title,16,y+5,5,st===2?'#94dc64':'#fff8ec');
      txt(st===2?'DONE!':q.prog(),W-16,y+5,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
    const cy=25+9*17;box(10,cy,W-20,15,G.coop?'#3a3010':'#1d1430',G.coop?'#ffd83a':'#4a3a66');
    txt(G.coop?'MY COOP - LEVEL '+G.coop.lv+'/4':'MY COOP - build it in the forest!',16,cy+5,5,G.coop?'#ffd83a':'#8a7ab0');
    txt('Seeds: '+G.sp2+'/'+TOTAL_SEEDS2+'  Harvests: '+G.harvests+'  X: next page  Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});return;}
  const ids=['mom',...ORDER];
  ids.forEach((id,i)=>{const y=25+i*16,q=QUESTS[id],st=G.q[id];
    box(10,y,W-20,14,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    if(st===0){txt('???',16,y+4,5,'#6a5a90');txt(G.met.has(id)?NAMES[id].toUpperCase():'not met yet',W-16,y+4,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+4,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+4,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});
  });
  txt('Seeds found: '+G.sp1+'/'+TOTAL_SEEDS+'   X: next page   Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
function drawTrainingPage(off){off=off||0;
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ff9cd0');
  txt('SKILL TRAINING',W/2,12,9,'#ff9cd0',{align:'center',shadow:true});
  Object.keys(TRAIN).slice(off,off+6).forEach((k,i)=>{const t=TRAIN[k],y=24+i*31,st=G.train[k]||0,done=has(k);
    const stat=done?'DONE!':st===2?'Learn it! (E)':st===1?trainCount(k)+'/'+t.need:t.avail()?'Talk to '+t.whoName:'locked';
    const col=done?'#94dc64':(st>=1||t.avail())?'#ffd83a':'#8a7ab0';
    box(10,y,W-20,28,done?'#23402a':'#1d1430',done?'#94dc64':st>=1?'#ff9cd0':'#4a3a66');
    txt(t.title+' ('+t.skill+')',16,y+5,5,'#fff8ec');txt(stat,W-16,y+5,5,col,{align:'right'});
    const info=done?t.whoName+' taught you!':st===1?trainMsg(k):t.avail()?'Ready! Find '+t.whoName+'.':t.lock;
    wrapTxt(info,16,y+14,W-34,5,done?'#94dc64':'#b8a8d8');});
  txt('Pink ! over a friend = training ready    X: next page',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
function wrapTxt(s,x,y,w,sz,c){let line='',yy=y;for(const wd of s.split(' ')){const t=line?line+' '+wd:wd;if(measure(t,sz)>w&&line){txt(line,x,yy,sz,c);yy+=8;line=wd;}else line=t;}if(line)txt(line,x,yy,sz,c);}
function cloud(x,y,s=1){ctx.fillStyle='#fff8ec';ctx.fillRect(x,y+4*s,24*s,6*s);ctx.fillRect(x+4*s,y,10*s,6*s);ctx.fillRect(x+12*s,y+2*s,8*s,4*s);
  ctx.fillStyle='#d8eefc';ctx.fillRect(x+2*s,y+9*s,20*s,1*s);}
function drawSky(t){
  const bands=['#4fb4f0','#5cbcf2','#6ac4f4','#78ccf6','#88d4f8','#98dcfa','#aae4fb','#bdebfc'];
  bands.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(0,i*20,W,20);});ctx.fillStyle='#bdebfc';ctx.fillRect(0,160,W,64);
  ctx.fillStyle='#fff3a0';ctx.fillRect(200,22,20,20);ctx.fillRect(197,25,26,14);ctx.fillRect(203,19,14,26);
  for(let i=0;i<6;i++){const sp=0.25+(i%3)*0.18,span=W+80;const x=(((i*97-t*sp)%span)+span)%span-40;cloud(Math.round(x),14+((i*29)%70),i%2?1:2);}
}
function drawTitle(){
  drawSky(tick);
  for(let x=0;x<W;x++){const h=Math.round(128+Math.sin(x/23)*6+Math.sin(x/9)*2);ctx.fillStyle='#4ea84a';ctx.fillRect(x,h,1,H-h);}
  for(let x=0;x<W;x+=16){ctx.drawImage(TILE.grass[(x/16)%3],x,160);ctx.drawImage(TILE.grass[(x/16+1)%3],x,176);ctx.drawImage(TILE.flower[(x/16)%2],x,192);ctx.drawImage(TILE.grass[(x/16+2)%3],x,208);ctx.drawImage(TILE.fenceH,x,144);}
  const fr=Math.floor(tick/10)%2,hopY=Math.abs(Math.sin(tick/14))*10;
  const cs=chickSprite(1,0,fr,false);ctx.drawImage(cs,W/2-cs.width*1.5,186-cs.height*3-hopY,cs.width*3,cs.height*3);
  shadow(W/2,187,22);
  drawImg(SPR.hen,40,184-SPR.hen.height);drawImg(flipOf(SPR.duck),200,186-SPR.duck.height);
  txt('CHICKLANDIA',W/2+2,38,16,'#21142b',{align:'center'});
  txt('CHICKLANDIA',W/2,36,16,'#ffd83a',{align:'center'});
  txt("Pip the chick's big dream",W/2,60,6,'#21142b',{align:'center'});
  const opts=titleOptions();
  opts.forEach((o,i)=>{const sel=i===titleSel;txt((sel?'> ':'  ')+o,W/2,82+i*13,8,sel?'#fff8ec':'#3b2a56',{align:'center',shadow:sel});});
  if(titleConfirm){box(36,78,184,62,'#241838','#ffd83a');
    txt('Start over?',W/2,86,8,'#ffd83a',{align:'center'});txt('Your saved game will be erased.',W/2,102,5,'#fff8ec',{align:'center'});
    ['Yes','No'].forEach((o,i)=>txt((confirmSel===i?'> ':'  ')+o,W/2-30+i*60,120,8,confirmSel===i?'#fff8ec':'#8a7ab0',{align:'center',shadow:confirmSel===i}));return;}
  txt(TOUCH?'Tap the screen or A to start!':'ARROWS move  Z peck/talk  E grow  C outfits',W/2,214,5,'#21142b',{align:'center'});
}
function drawEnding(){
  const t=END.t;drawSky(t+200);
  for(let x=0;x<W;x++){const h=Math.round(150+Math.sin((x+t*0.5)/23)*6+Math.sin((x+t*0.5)/9)*2);ctx.fillStyle='#4ea84a';ctx.fillRect(x,h,1,H-h);}
  ctx.fillStyle='#5cb84c';ctx.fillRect(0,184,W,40);
  const span=W+32;for(let k=0;k<12;k++){const x=Math.round(((k*24-t*1.6)%span+span)%span-16);ctx.drawImage(TILE.fenceH,x,196,16,16);}
  const off=t*1.2;
  const fx=Math.round(150-off);if(fx>-20){for(let j=0;j<3;j++)ctx.drawImage(TILE.tall,fx,168+j*16);}
  const friends=['hen','penny','cow','horse','pig','dog','cat','duck','sheepBow','rooster'];
  friends.forEach((f,i)=>{const s=SPR[f];const x=Math.round(10+i*14-off);if(x<-30)return;const jump=Math.abs(Math.sin((t+i*9)/7))*6;
    drawImg(s,x-(s.width>>1),216-s.height-jump);});
  const cy=146+Math.round(Math.sin(t/15)*6);drawPip(4,3,Math.floor(t/5)%2,true,170,cy,2);
  if(t>40)txt('YOU DID IT!',W/2,14,12,'#21142b',{align:'center'}),txt('YOU DID IT!',W/2-1,13,12,'#ffd83a',{align:'center'});
  if(t>130)txt('Pip flew over the Big Fence!',W/2,34,6,'#21142b',{align:'center'});
  if(t>260){txt('THE END',W/2,50,10,'#fff8ec',{align:'center',shadow:true});}
  if(t>330){const m=Math.floor(G.time/3600),s=Math.floor(G.time/60)%60;
    txt('Time '+m+':'+String(s).padStart(2,'0')+'   Seeds found '+G.sp1+'/'+TOTAL_SEEDS,W/2,68,5,'#21142b',{align:'center'});}
  if(t>420&&Math.floor(t/25)%2)txt('Press Z for PART 2!',W/2,80,7,'#3b2a56',{align:'center'});
}

function render(){
  TQ=[];ctx.clearRect(0,0,W,H);
  if(state==='title')drawTitle();
  else if(state==='ending'&&END.phase===2)drawEnding();
  else if(state==='egg')drawEgg();
  else if(state==='flying')drawFlying();
  else if(state==='p2intro')drawP2Intro();
  else if(state==='festival')drawFestival();
  else if(state==='pinch')drawPinch();
  else if(state==='sail')drawSail();
  else if(state==='voyage')drawVoyage();
  else if(state==='chase')drawChase();
  else if(state==='credits')drawCredits();
  else if(state==='hatch')drawHatch();
  else if(state==='naming')drawNaming();
  else if(state==='flyover')drawFlyover();
  else if(state==='map'){drawWorld();drawEnvFX();drawHUD();TQ=[];drawMap();}
  else{
    drawWorld();drawEnvFX();drawHUD();
    if(state==='play'||state==='talk'||state==='ending'||state==='faint')drawFloats();
    if(state==='grow'){TQ=[];drawGrow();}
    else if(state==='quests'){TQ=[];drawQuests();}
    else if(state==='pause'){TQ=[];drawPause();}
    else if(state==='catalog'){TQ=[];drawCatalog();}
    else if(state==='plant')drawPlant();
    else if(state==='rankup'){TQ=[];drawRankUp();}
    else if(state==='shop'){TQ=[];drawShop();}
    else if(state==='wardrobe'){TQ=[];drawWardrobe();}
    else{drawMG();drawRaceHUD();drawToast();if(state==='talk')drawBubble();}
  }
  dctx.setTransform(1,0,0,1,0,0);dctx.fillStyle='#0d0814';dctx.fillRect(0,0,cv.width,cv.height);
  dctx.imageSmoothingEnabled=false;dctx.drawImage(pix,OX,OY,W*K,H*K);
  dctx.textBaseline='top';
  for(const t of TQ){
    dctx.font=Math.round(t.size*K)+'px '+FONT;dctx.textAlign=t.align;dctx.globalAlpha=t.alpha;
    const x=OX+t.x*K,y=OY+t.y*K;
    if(t.shadow){dctx.fillStyle='#21142b';dctx.fillText(t.s,x+K,y+K);}
    dctx.fillStyle=t.color;dctx.fillText(t.s,x,y);
  }
  dctx.globalAlpha=1;
  if(fade>0){dctx.globalAlpha=fade;dctx.fillStyle=fadeColor;dctx.fillRect(OX,OY,W*K,H*K);dctx.globalAlpha=1;}
}


let _mmCache=null;
function MINIMAP_BEYOND(){
  const sea=seaRegion()?'sea':skyRegion()?'sky':'ground';if(!_mmCache)_mmCache={};if(_mmCache[sea])return _mmCache[sea];
  const cells=REGION_LIST.filter(r=>r.beyond&&r.area&&(r.sea?'sea':r.sky?'sky':'ground')===sea).flatMap(r=>r.cells);
  const xs=cells.map(c=>c.sx),ys=cells.map(c=>c.sy),x0=Math.min(...xs),y0=Math.min(...ys);
  return _mmCache[sea]={cells,x0,y0,cols:Math.max(...xs)-x0+1,rows:Math.max(...ys)-y0+1};
}

// quest-log pages: 0 farm, 1 part 2, 3 city, 2 training, 4 detective notes (only while a Detective Cap is owned)
function questPages(){const p=[0];if(G.part2)p.push(1,3);if(G.vil.open)p.push(5);if(G.sea.open)p.push(6);if(G.sky.open||G.flags.skyMap)p.push(7);p.push(2,8);if(G.outfits.includes('detective'))p.push(4);return p;}
function drawCityPage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ff9cd0');
  txt('QUESTS - CITY',W/2,12,9,'#ff9cd0',{align:'center',shadow:true});
  ORDER3.forEach((id,i)=>{const y=25+i*17,q=QUESTS[id],st=G.q[id],giver=QUEST_GIVER[id]||id;
    box(10,y,W-20,15,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    const seen=st>0||G.met.has(giver);
    if(!seen){txt('???',16,y+5,5,'#6a5a90');txt('not met yet',W-16,y+5,5,'#6a5a90',{align:'right'});return;}
    if(st===0){txt('???',16,y+5,5,'#6a5a90');txt(NAMES[giver]?NAMES[giver].toUpperCase():'',W-16,y+5,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+5,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+5,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
  const done=EXHIBITS.filter(x=>G.museum[x.id]>=x.need).length;
  box(10,129,W-20,15,'#1d1430','#c49a5c');txt('MUSEUM',16,134,5,'#c49a5c');txt(done+'/'+EXHIBITS.length+' exhibits',W-16,134,5,'#fff8ec',{align:'right'});
  box(10,146,W-20,15,'#1d1430','#a6e0ff');txt('PARCELS DELIVERED',16,151,5,'#a6e0ff');txt(''+(G.flags.parcels||0),W-16,151,5,'#fff8ec',{align:'right'});
  box(10,163,W-20,15,'#1d1430','#ffd83a');txt('ROOFTOP RACE BEST',16,168,5,'#ffd83a');txt(G.best.race?G.best.race+' sec':'-',W-16,168,5,'#fff8ec',{align:'right'});
  txt('Seeds: '+G.seeds+'     X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
function drawSleuthPage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#c49a5c');
  txt('DETECTIVE NOTES',W/2,12,9,'#c49a5c',{align:'center',shadow:true});
  const ids=['mom',...ORDER,...ORDER2,...ORDER3].filter(id=>G.q[id]===1);
  if(!ids.length)txt('No open tasks. Go find a friend who needs help!',W/2,100,5,'#b8a8d8',{align:'center'});
  ids.slice(0,9).forEach((id,i)=>{const y=24+i*20;box(10,y,W-20,18,'#1d1430','#4a3a66');
    txt(QUESTS[id].title,16,y+3,5,'#fff8ec');txt(QUESTS[id].prog(),W-16,y+3,5,QUESTS[id].check()?'#ffd83a':'#d8c8f8',{align:'right'});
    txt(questLoc(QUEST_GIVER[id]&&G.q[id]===1&&false?QUEST_GIVER[id]:id),16,y+11,5,'#94dc64');});
  txt('X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}

function drawVillagePage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#94dc64');
  txt('QUESTS - VILLAGE',W/2,10,9,'#94dc64',{align:'center',shadow:true});
  ORDER4.forEach((id,i)=>{const y=21+i*15,q=QUESTS[id],st=G.q[id];
    box(10,y,W-20,13,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    if(st===0){txt('???',16,y+4,5,'#6a5a90');txt(id==='vfound'?'see Bucky':id==='vharvest'?'later':'build for them',W-16,y+4,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+4,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+4,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
  const s=seasonNow();
  txt('HAPPY '+happiness()+'/'+FINALE_HAPPY+'   '+s.name+' ('+daysToNextSeason()+'d)',W/2,H-30,5,'#ffd83a',{align:'center'});
  txt(matsLine(),W/2,H-21,5,'#c49a5c',{align:'center'});
  txt('X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}

// quest log page for the sky
function drawSkyPage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ffb8e0');
  txt('QUESTS - SKY KINGDOM',W/2,10,9,'#ffb8e0',{align:'center',shadow:true});
  ORDER6.forEach((id,i)=>{const y=21+i*15,q=QUESTS[id],st=G.q[id];
    box(10,y,W-20,13,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    if(st===0){txt('???',16,y+4,5,'#6a5a90');txt(id==='sk_hatch'?'see Elda':id==='sk_boss'?'see Nimbus':'find them up there',W-16,y+4,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+4,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+4,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
  txt((G.sky.name?'CHICK: '+G.sky.name+'    ':'')+'SKY SKILLS '+SKILLS5.filter(s=>has(s.id)).length+'/4',W/2,H-21,5,'#c49a5c',{align:'center'});
  txt('X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
// quest log page for the seas
function drawSeasPage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#a6e0ff');
  txt('QUESTS - PIRATE SEAS',W/2,10,9,'#a6e0ff',{align:'center',shadow:true});
  ORDER5.forEach((id,i)=>{const y=21+i*15,q=QUESTS[id],st=G.q[id];
    box(10,y,W-20,13,st===2?'#23402a':'#1d1430',st===2?'#94dc64':(st===1?'#ffd83a':'#4a3a66'));
    if(st===0){txt('???',16,y+4,5,'#6a5a90');txt(id==='sea_cove'||id==='sea_boss'?'see Capn Pinch':'sail to meet them',W-16,y+4,5,'#6a5a90',{align:'right'});return;}
    txt(q.title,16,y+4,5,st===2?'#94dc64':'#fff8ec');
    txt(st===2?'DONE!':q.prog(),W-16,y+4,5,st===2?'#94dc64':(q.check()?'#ffd83a':'#d8c8f8'),{align:'right'});});
  txt('SHIP: '+SEA_LEVEL_NAMES[Math.min(3,shipLevel())]+'   SAILCLOTH '+G.sea.salv.sailcloth+'  PLANKS '+G.sea.salv.hullplank+'  PARTS '+G.sea.salv.cannonpart,W/2,H-21,4,'#c49a5c',{align:'center'});
  txt('X: next page     Q: close',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
