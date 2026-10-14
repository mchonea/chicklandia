'use strict';
/* ---------------- reusable catalog UI that every city shop uses ----------------
   SHOPS[id] = {title, owner (sprite key), color, intro, items:()=>[...]}  (data lives in content/shops.js)
   an item = {name, price?, tag?, desc, bonus?, outfit? (id to preview on Pip), icon? (SPR key), off?, act()->{s,c}|undefined}
   Up/Down choose, Z does the item's action, ESC (or the LEAVE row) closes. */
let SH=null;
function openCatalog(id){SH={id,sel:0,top:0,msg:null};state='catalog';SFX.menu();}
function catalogItems(){return SHOPS[SH.id].items();}
function updateCatalog(){
  const items=catalogItems(),n=items.length+1;
  if(pressed.back||pressed.wear||pressed.quest||pressed.grow){state='play';SH=null;SFX.menu();return;}
  if(pressed.up){SH.sel=(SH.sel+n-1)%n;SH.msg=null;SFX.menu();}
  if(pressed.down){SH.sel=(SH.sel+1)%n;SH.msg=null;SFX.menu();}
  SH.top=clamp(SH.top,Math.max(0,SH.sel-4),SH.sel);
  if(!pressed.a)return;
  if(SH.sel===items.length){state='play';SH=null;SFX.menu();return;}
  const it=items[SH.sel];
  if(it.off){SFX.deny();SH.msg={s:it.offMsg||'Not available yet.',c:'#ff8080'};return;}
  const sid=SH.id,r=it.act&&it.act();
  if(state==='catalog'&&SH&&SH.id===sid){if(r){SH.msg=r;}if(!r||r.c!=='#ff8080')SFX.pick();else SFX.deny();}
}
function drawCatalog(){
  const S=SHOPS[SH.id],items=catalogItems();
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838',S.color);
  if(SPR[S.owner])drawImg(SPR[S.owner],12,6);txt(S.title,W/2+8,12,7,S.color,{align:'center',shadow:true});
  drawImg(SPR.seed,196,26);txt('x'+G.seeds,206,28,7,'#fff8ec');
  const rows=items.concat([{leave:true,name:S.leave||'LEAVE'}]);
  for(let k=0;k<5;k++){const i=SH.top+k;if(i>=rows.length)break;const it=rows[i],y=40+k*20,sel=i===SH.sel;
    box(12,y,130,17,sel?'#3b2a56':'#1d1430',sel?'#fff8ec':'#4a3a66');
    if(it.leave){txt(it.name,20,y+6,5,'#d8c8f8');continue;}
    txt(it.name,20,y+6,5,it.off?'#6a5a90':it.own?'#94dc64':'#fff8ec');
    if(it.tag)txt(it.tag,136,y+6,5,it.on?'#ffd83a':'#94dc64',{align:'right'});
    else if(it.price!=null){drawImg(SPR.seed,120,y+4);txt(''+it.price,136,y+6,5,G.seeds>=it.price?'#fff8ec':'#ff8080',{align:'right'});}}
  if(SH.top>0)txt('^',138,34,5,'#b8a8d8');if(SH.top+5<rows.length)txt('v',138,141,5,'#b8a8d8');
  box(150,40,94,100,'#2e2048','#6a5a90');
  const cur=rows[SH.sel];
  if(cur&&cur.outfit)drawPip(stage(),[0,2,1,3][Math.floor(tick/50)%4],Math.floor(tick/12)%2,false,197,128,3,cur.outfit);
  else if(cur&&cur.icon&&SPR[cur.icon]){const s=SPR[cur.icon],z=Math.min(6,Math.floor(70/Math.max(s.width,s.height)));ctx.drawImage(s,Math.round(197-s.width*z/2),Math.round(90-s.height*z/2),s.width*z,s.height*z);}
  else if(cur&&cur.leave&&SPR[S.owner]){const s=SPR[S.owner];ctx.drawImage(s,Math.round(197-s.width*2),Math.round(100-s.height*2),s.width*4,s.height*4);}
  box(12,148,W-24,66,'#1d1430','#6a5a90');
  if(cur&&!cur.leave){txt(cur.name,20,154,7,S.color);wrap(cur.desc||'',5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,165+i*8,5,'#d8c8f8'));
    if(cur.bonus)wrap('BONUS: '+cur.bonus,5,W-44).slice(0,2).forEach((l,i)=>txt(l,20,182+i*8,5,'#94dc64'));}
  else txt(S.bye||'Come back soon!',20,160,6,'#d8c8f8');
  if(SH.msg)txt(SH.msg.s,20,202,5,SH.msg.c);else txt('Z: choose     ESC: leave',20,202,5,'#8a7ab0');
}
function shopBuy(price,what,fn){
  if(G.seeds<price){const k=price-G.seeds;SFX.deny();return {s:'You need '+k+' more seed'+(k>1?'s':'')+'.',c:'#ff8080'};}
  G.seeds-=price;SFX.cash();const m=fn();save();return m||{s:what,c:'#ffd83a'};
}
