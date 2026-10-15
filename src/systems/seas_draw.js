'use strict';
/* ---------------- drawing for the Pirate Seas ---------------- */
function drawSeaEnt(e,sx,sy){
  switch(e.type){
    case 'gullp':{if(e.gone>0)break;if(e.flash>0&&Math.floor(e.flash/2)%2)break;let s=SPR.gullp;if(e.flip)s=flipOf(s);
      if(e.st==='tell'||e.st==='dive'){ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(Math.round(e.tx-camX)-6,Math.round(e.ty-camY+HUD)+8,12,3);}
      const off=e.st==='rest'?0:Math.round(Math.sin(tick/5)*1.5);drawImg(s,sx-(s.width>>1),sy-s.height+off);
      if(e.st==='tell'){ctx.fillStyle='#ff4040';ctx.fillRect(sx-1,sy-s.height-9,2,5);ctx.fillRect(sx-1,sy-s.height-3,2,2);}break;}
    case 'jelly':{ctx.globalAlpha=0.85;const s=SPR.jelly,b=Math.round(Math.sin(tick/9+e.ph)*1.5);if(!(e.flash>0&&Math.floor(e.flash/2)%2))drawImg(s,sx-(s.width>>1),sy-s.height+b);ctx.globalAlpha=1;
      if(e.stun>0&&e.stun%20<10){ctx.fillStyle='#ffe05a';ctx.fillRect(sx-4,sy-14,2,2);ctx.fillRect(sx+3,sy-14,2,2);}break;}
    case 'spark':{if(e.up){drawImg(SPR.spark,sx-2,sy-5);ctx.fillStyle='rgba(255,180,60,0.35)';ctx.beginPath();ctx.arc(sx,sy-3,7,0,7);ctx.fill();}
      else if(tick%50<25){ctx.fillStyle='#ffb030';ctx.fillRect(sx-1,sy-1,2,2);}break;}
    case 'bubbles':{if(e.cool>0)break;for(let i=0;i<4;i++){const t=(tick*0.6+i*13)%40;ctx.globalAlpha=1-t/50;drawImg(SPR.bubble,sx-4+(i%2)*5,sy-t*0.7-(i*3));}ctx.globalAlpha=1;break;}
    case 'swarp':{
      if(e.dive){const r=7+Math.sin(tick/10)*1.5;ctx.fillStyle='#306a9d';ctx.beginPath();ctx.ellipse(sx,sy,14,8,0,0,7);ctx.fill();ctx.strokeStyle='#b2e7e0';ctx.lineWidth=1;
        for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(sx,sy,r+i*4,(r+i*4)*0.55,tick/30,0,5);ctx.stroke();}
        if(has('dive')){txt('DIVE',sx,sy-18,5,'#b2e7e0',{align:'center'});}else txt('?',sx,sy-18,6,'#b2e7e0',{align:'center'});}
      else if(e.up){for(let i=0;i<5;i++){const t=(tick*0.5+i*9)%36;ctx.globalAlpha=1-t/40;ctx.drawImage(SPR.bubble,sx-2+(i%2)*4,sy-t);}ctx.globalAlpha=1;txt('UP',sx,sy+4,5,'#fff8ec',{align:'center'});}
      else if(e.id==='cave_in'){ctx.fillStyle='#202840';ctx.fillRect(sx-12,sy-18,24,22);ctx.fillStyle='#0d0814';ctx.fillRect(sx-9,sy-15,18,19);ctx.fillStyle='#3a2a2a';ctx.fillRect(sx-12,sy-18,24,3);txt('CAVE',sx,sy-26,5,'#ffe05a',{align:'center'});}
      else if(e.id==='cave_out'){ctx.fillStyle='#ffe7a0';ctx.fillRect(sx-12,sy-4,24,8);ctx.fillStyle='#fff6d0';ctx.fillRect(sx-8,sy,16,4);txt('EXIT',sx,sy-10,5,'#fff8ec',{align:'center'});}
      break;}
    case 'shipdock':{const b=Math.round(Math.sin(tick/20+e.x)*1.5);shadow(sx,sy+2,14);ctx.drawImage(SPR.shipIcon,sx-17,sy-26+b);if(G.sea.open&&tick%90<45)txt('SHIP',sx,sy-34,4,'#ffe05a',{align:'center'});break;}
    case 'xmark':drawImg(SPR.xmark,sx-(SPR.xmark.width>>1),sy-SPR.xmark.height);if(senseNear(e.x,e.y)&&tick%24<12){ctx.fillStyle='#ffd21e';ctx.fillRect(sx+4,sy-9,2,2);}break;
    case 'seachest':{const s=SPR.chestSea;drawImg(s,sx-(s.width>>1),sy-s.height+1);if(G.sea.chest===1&&tick%50<5){ctx.fillStyle='#fff';ctx.fillRect(sx+4,sy-s.height,1,1);}if(G.sea.chest===2){ctx.fillStyle='rgba(30,20,40,0.35)';ctx.fillRect(sx-5,sy-s.height,11,s.height);}break;}
    case 'brazier':{shadow(sx,sy+1,8);ctx.fillStyle='#8a8a9a';ctx.fillRect(sx-7,sy-3,14,4);ctx.fillStyle='#6a6a7a';ctx.fillRect(sx-6,sy-2,12,2);
      const s=e.lit?SPR.brazierLit:SPR.brazier;drawImg(s,sx-(s.width>>1),sy-4-s.height);
      if(e.lit){const f=Math.round(Math.sin(tick/4)*1.5);ctx.fillStyle='rgba(255,200,80,0.28)';ctx.beginPath();ctx.arc(sx,sy-12,11+f,0,7);ctx.fill();}
      // symbol on the slab
      ctx.fillStyle=e.lit?'#ffe05a':'#c8c8d8';
      if(e.sym==='sun'){ctx.fillRect(sx-2,sy+3,5,5);ctx.fillRect(sx-4,sy+5,9,1);ctx.fillRect(sx,sy+1,1,9);}
      else if(e.sym==='moon'){ctx.fillRect(sx-3,sy+3,5,6);ctx.fillStyle='#202840';ctx.fillRect(sx,sy+4,3,4);}
      else if(e.sym==='star'){ctx.fillRect(sx,sy+2,1,8);ctx.fillRect(sx-4,sy+5,9,1);ctx.fillRect(sx-2,sy+3,5,5);}
      else{ctx.fillRect(sx-5,sy+5,4,2);ctx.fillRect(sx-1,sy+3,4,2);ctx.fillRect(sx+3,sy+5,3,2);}
      break;}
    case 'boss':{const B=BOSS;let s=SPR.squawk;if(e.flip)s=flipOf(s);
      if(e.st==='tell'||e.st==='dive'){const r=e.st==='tell'?Math.min(18,e.t/2.5):18;ctx.fillStyle='rgba(120,10,10,'+(0.25+(e.st==='tell'?e.t/120:0.3))+')';ctx.beginPath();ctx.ellipse(Math.round(e.tx-camX),Math.round(e.ty-camY+HUD),r,r*0.55,0,0,7);ctx.fill();}
      if(!(e.flash>0&&Math.floor(e.flash/2)%2)){ctx.globalAlpha=e.st==='dazed'?0.7:1;
        ctx.drawImage(s,Math.round(sx-20),Math.round(sy-(e.st==='land'?24:30)));ctx.globalAlpha=1;}
      if(e.st==='land'&&tick%20<10){ctx.fillStyle='#ffe05a';const a=tick/5;ctx.fillRect(sx+Math.round(Math.cos(a)*10),sy-30,2,2);ctx.fillRect(sx+Math.round(Math.cos(a+3)*10),sy-30,2,2);txt('PECK!',sx,sy-40,5,'#ffe05a',{align:'center'});}
      if(e.st==='dazed')for(let i=0;i<3;i++){ctx.fillStyle='#ffe05a';ctx.fillRect(sx-10+i*10,sy-34+Math.round(Math.sin(tick/4+i)*3),3,3);}
      if(B&&B.intro>0)txt('CAPTAIN SQUAWKBEARD!',W/2,50,7,'#ff8080',{align:'center',shadow:true});break;}
    case 'barrel':{if(e.st==='fall'){const k=e.t/36;ctx.fillStyle='rgba(0,0,0,'+(0.15+k*0.3)+')';ctx.beginPath();ctx.ellipse(sx,sy+1,8*k+2,4*k+1,0,0,7);ctx.fill();drawImg(SPR.barrel,sx-(SPR.barrel.width>>1),sy-Math.round((1-k)*80)-SPR.barrel.height);}
      else{shadow(sx,sy+1,7);ctx.save();ctx.translate(sx,sy-4);ctx.rotate(tick/6*(e.vx>=0?1:-1));ctx.drawImage(SPR.barrel,-SPR.barrel.width/2,-SPR.barrel.height/2);ctx.restore();}break;}
  }
}
/* underwater tint and bubbles; the lit lighthouse sweeps a beam */
function drawSeaFX(cx,cy){
  const cl=cellAt();if(!cl)return;
  if(cl.kind==='water'){
    ctx.fillStyle='rgba(30,100,200,0.30)';ctx.fillRect(0,HUD,W,VH);
    ctx.fillStyle='rgba(180,230,255,0.10)';for(let i=0;i<5;i++){const x=((i*61+tick*0.3)%(W+40))-20;ctx.beginPath();ctx.moveTo(x,HUD);ctx.lineTo(x+16,HUD);ctx.lineTo(x+60,HUD+VH);ctx.lineTo(x+30,HUD+VH);ctx.fill();}
    for(let i=0;i<14;i++){const y=HUD+VH-((tick*0.5+i*37)%VH),x=(i*47+Math.sin(tick/30+i)*6)%W;ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(Math.round(x),Math.round(y),2,2);}
  }
  if(cl.region.id==='lighthouse'&&G.flags.lit){
    const a=tick/90,bx=(cl.sx===1?7*16+8:7*16+8+256)-(cx-cl.sx*256)-0,by=HUD+20;
    if(cl.sx===1){ctx.fillStyle='rgba(255,240,150,0.22)';ctx.beginPath();ctx.moveTo(7*16+8,by);ctx.lineTo(7*16+8+Math.cos(a)*190-14,by+Math.sin(a)*70+120);ctx.lineTo(7*16+8+Math.cos(a)*190+14,by+Math.sin(a)*70+120);ctx.fill();
      ctx.fillStyle='rgba(255,248,200,0.6)';ctx.fillRect(7*16+4,by-8,8,6);}
  }
}
