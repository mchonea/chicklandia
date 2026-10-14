'use strict';
/* =====================================================================
   CHICKLANDIA - a tiny chick's big dream
   ===================================================================== */
const W=256,H=224,HUD=32,TS=16,VW=256,VH=192,TOTAL_SEEDS=45,TOTAL_SEEDS2=36,DAY=18000;
const FONT='"Press Start 2P", monospace';
const SAVE_KEY='chicklandia_save_v2';

const cv=document.getElementById('c'),dctx=cv.getContext('2d');
const pix=document.createElement('canvas');pix.width=W;pix.height=H;
const ctx=pix.getContext('2d');ctx.imageSmoothingEnabled=false;
let K=1,OX=0,OY=0,TOUCH=!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches);
function resize(){
  const dpr=window.devicePixelRatio||1;
  cv.width=Math.floor(innerWidth*dpr);cv.height=Math.floor(innerHeight*dpr);
  const portrait=TOUCH&&innerHeight>innerWidth;            // phones held upright: game on top, controls below
  let k=Math.min(cv.width/W,(portrait?cv.height*0.58:cv.height)/H);if(k>=2&&!TOUCH)k=Math.floor(k);
  K=k;OX=Math.floor((cv.width-W*K)/2);OY=portrait?Math.floor(10*dpr):Math.floor((cv.height-H*K)/2);
  layoutTouch();
}
function layoutTouch(){
  const T=document.getElementById('touch');if(!T)return;T.classList.toggle('on',TOUCH);if(!TOUCH)return;
  const dpr=window.devicePixelRatio||1,vw=innerWidth,vh=innerHeight,gx=OX/dpr,gy=OY/dpr,gh=H*K/dpr;
  const S=(id,o)=>{const el=document.getElementById(id);for(const k in o)el.style[k]=typeof o[k]==='number'?o[k]+'px':o[k];};
  const safe=v=>'calc('+v+'px + env(safe-area-inset-bottom))';
  if(vh>vw){
    const top=gy+gh+10,area=vh-top;
    S('menu',{left:'8px',right:'8px',top,justifyContent:'center'});
    const pad=Math.max(110,Math.min(180,area-90,vw*0.46));
    S('dpad',{left:'14px',bottom:safe(16),width:pad,height:pad});
    const a=Math.min(88,pad*0.56),b=Math.round(a*0.78);
    S('btnA',{right:'16px',left:'auto',bottom:safe(16+pad*0.42),width:a,height:a});
    S('btnB',{right:(24+a)+'px',left:'auto',bottom:safe(14),width:b,height:b});
  }else{
    const bar=gx,big=bar>=130;
    const pad=Math.min(big?bar-24:150,vh*0.48,170);
    S('dpad',{left:(big?(bar-pad)/2:14)+'px',bottom:safe(18),width:pad,height:pad});
    const a=Math.min(84,big?bar*0.46:78),b=Math.round(a*0.78);
    S('btnA',{right:(big?(bar-a)/2:16)+'px',left:'auto',bottom:safe(24+b),width:a,height:a});
    S('btnB',{right:(big?Math.max(6,(bar-a)/2-b*0.35):24+a)+'px',left:'auto',bottom:safe(12),width:b,height:b});
    if(big)S('menu',{left:(vw-bar+8)+'px',right:'8px',top:'8px',justifyContent:'center'});
    else S('menu',{left:'8px',right:'8px',top:'6px',justifyContent:'flex-end'});
  }
}
addEventListener('resize',resize);resize();

