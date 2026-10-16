'use strict';
/* Farm-like paths and small shared spaces, confined to the village regions. */
function drawVillageTile(ch,c,r,sx,sy,wf){
  const R=(col,x,y,w,h)=>vRect(ctx,col,sx+x,sy+y,w,h),h=hash2(c,r);
  if(ch==='d'||ch==='='){
    ctx.drawImage(ch==='='?TILE.cobble:TILE.dirt,sx,sy);
    if(ch==='d'){R('#c9ae7c',0,0,16,16);R('#b69965',3+(h%7),5,3,1);R('#e8cd98',9,12-(h%5),2,1);}
    const road=q=>ch==='='?q==='=':'d=37'.includes(q),north=road(tileAt(c,r-1)),south=road(tileAt(c,r+1)),west=road(tileAt(c-1,r)),east=road(tileAt(c+1,r));
    if(!north)R(ch==='d'?'#a88d60':'#789b85',0,0,16,1);if(!south)R(ch==='d'?'#a88d60':'#789b85',0,15,16,1);
    if(!west)R(ch==='d'?'#a88d60':'#789b85',0,0,1,16);if(!east)R(ch==='d'?'#a88d60':'#789b85',15,0,1,16);
    if(ch==='='){
      if(!north)R('#d4dce0',0,0,16,2);if(!south){R('#7896ae',0,13,16,1);R('#d4dce0',0,14,16,2);}
      if(!west)R('#d4dce0',0,0,2,16);if(!east){R('#7896ae',13,0,1,16);R('#d4dce0',14,0,2,16);}
    }
    for(const [x,y,a,b] of [[0,0,north,west],[14,0,north,east],[0,14,south,west],[14,14,south,east]])if(!a&&!b){R(PAL.g,x,y,2,2);R(PAL.G,x+(x?0:1),y+(y?0:1),1,1);}return true;
  }
  if(ch==='7'){
    ctx.drawImage(TILE.grass[h%3],sx,sy);const p=PADS.find(p=>c>=p.c&&c<p.c+2&&r>=p.r&&r<p.r+2);
    if(!p||G.vil.b[p.id]&&G.vil.b[p.id].done)return true;
    const dx=c-p.c,dy=r-p.r;R('#c9ae7c',dx?0:2,dy?0:2,14,14);R('#b69965',6,8,3,1);
    const x=dx?13:1,y=dy?12:1;R('dark',x,y,2,4);R('light',x,y,1,3);return true;
  }
  if(ch==='W'){
    ctx.drawImage(TILE.water[(wf+(c+r)%2)%2],sx,sy);const wet=q=>q==='W'||q==='3';
    const n=wet(tileAt(c,r-1)),s=wet(tileAt(c,r+1)),w=wet(tileAt(c-1,r)),e=wet(tileAt(c+1,r));
    if(!n){R('forest',0,0,16,1);R('foam',1,1,14,1);}if(!s){R('foam',1,14,14,1);R('forest',0,15,16,1);}
    if(!w){R('forest',0,0,1,16);R('foam',1,1,1,14);}if(!e){R('foam',14,1,1,14);R('forest',15,0,1,16);}
    for(const [x,y,a,b] of [[0,0,n,w],[13,0,n,e],[0,13,s,w],[13,13,s,e]])if(!a&&!b)R(PAL.g,x,y,3,3);return true;
  }
  if(ch==='3'){
    R('dark',0,0,16,16);R('wood',0,2,16,12);for(let x=1;x<16;x+=4){R('light',x,2,2,12);R('cream',x,2,1,1);}R('light',0,0,16,2);R('light',0,14,16,2);return true;
  }
  if(ch==='V'){
    R('#805c44',0,0,16,16);R('#a67750',0,1,16,2);R('#a67750',0,8,16,2);R('#b68b5b',3+(h%7),2,3,1);return true;
  }
  return false;
}
function drawVillageGround(cx,cy){
  if(regionAt().area!=='village'&&!trans)return;
  // Raised-bed borders sit under the growing plants rather than covering them.
  for(const c of [34,50])for(const r of [98,104]){
    const x=c*16-cx,y=r*16-cy+HUD;if(x>W||x+68<0||y>H||y+34<HUD)continue;
    vRect(ctx,'dark',x-3,y-3,70,36);vRect(ctx,'light',x-2,y-2,68,34);vRect(ctx,'#805c44',x,y,64,32);
    for(let j=0;j<4;j++)vRect(ctx,'#a67750',x,y+2+j*8,64,2);
    for(const px of [x-2,x+65]){vRect(ctx,'cream',px,y-2,1,2);vRect(ctx,'dark',px,y+31,2,2);}
  }
}
function drawVillageProp(e,sx,sy){
  const k=e.kind==='oak'||e.kind==='fruitTree'||e.kind==='seasonal'?e.kind+'_'+seasonNow().name:e.kind,s=SPR['v_'+k];if(!s)return;
  if(e.kind==='oak')shadow(sx,sy+1,40);else if(e.solid)shadow(sx,sy+1,Math.min(e.w||20,30));
  drawImg(s,sx-s.anchorX,sy-s.anchorY);
  if(e.kind==='lamp'&&nightAmt()>.3){ctx.fillStyle='rgba(255,224,90,.12)';ctx.fillRect(sx-9,sy-33,18,18);}
  if(e.kind==='seasonal'&&contestDone()){vRect(ctx,'gold',sx+13,sy-20,5,7);vRect(ctx,'red',sx+14,sy-13,3,5);}
}
