'use strict';
/* ---------------- input ---------------- */
const keys={},pressed={};
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',
  KeyZ:'a',Space:'a',KeyJ:'a',Enter:'a',NumpadEnter:'a',KeyX:'b',KeyK:'b',KeyE:'grow',Tab:'grow',KeyG:'grow',KeyQ:'quest',
  KeyM:'mute',KeyC:'wear',KeyF:'fly',Escape:'back',KeyP:'pause',Backspace:'back'};
function press(k){if(!keys[k])pressed[k]=true;keys[k]=true;}
addEventListener('keydown',e=>{const k=KEYMAP[e.code];initAudio();if(!k)return;e.preventDefault();if(e.repeat&&k!=='up'&&k!=='down'&&k!=='left'&&k!=='right')return;press(k);});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)keys[k]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
/* ---- touch controls ---- */
function buzz(){try{if(navigator.vibrate)navigator.vibrate(8);}catch(e){}}
function toggleFull(){const d=document;try{if(!d.fullscreenElement)d.documentElement.requestFullscreen().catch(()=>{});else d.exitFullscreen();}catch(e){}}
{
  const T=document.getElementById('touch');
  addEventListener('touchstart',()=>{if(!TOUCH){TOUCH=true;resize();}},{passive:true});
  if(!document.documentElement.requestFullscreen)document.getElementById('btnFull').style.display='none';
  T.querySelectorAll('button[data-k]').forEach(b=>{const k=b.dataset.k;
    b.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();buzz();b.classList.add('down');if(k==='full'){toggleFull();return;}press(k);});
    const up=()=>{if(k!=='full')keys[k]=false;b.classList.remove('down');};
    b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up);b.addEventListener('pointercancel',up);});
  // one slide-able d-pad with diagonals
  const dp=document.getElementById('dpad'),DK=['up','down','left','right'];let dpId=null;
  const dpSet=dirs=>{for(const k of DK){const on=dirs.includes(k);if(on&&!keys[k])press(k);if(!on)keys[k]=false;dp.querySelector('.'+k[0]).classList.toggle('on',on);}};
  const dpMove=e=>{const r=dp.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy);
    if(len<r.width*0.12){dpSet([]);return;}const nx=dx/len,ny=dy/len,d=[];
    if(ny<-0.38)d.push('up');if(ny>0.38)d.push('down');if(nx<-0.38)d.push('left');if(nx>0.38)d.push('right');dpSet(d);};
  dp.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();buzz();dpId=e.pointerId;try{dp.setPointerCapture(e.pointerId);}catch(_){}dpMove(e);});
  dp.addEventListener('pointermove',e=>{if(e.pointerId===dpId)dpMove(e);});
  const dpEnd=e=>{if(e.pointerId===dpId){dpId=null;dpSet([]);}};
  dp.addEventListener('pointerup',dpEnd);dp.addEventListener('pointercancel',dpEnd);
  // tapping the game screen = A, except during normal play (so you never peck by accident)
  let tapA=false;
  cv.addEventListener('pointerdown',e=>{if(!TOUCH||e.pointerType==='mouse')return;if(state==='play'||state==='warp')return;initAudio();press('a');tapA=true;});
  const tapEnd=()=>{if(tapA){keys.a=false;tapA=false;}};
  cv.addEventListener('pointerup',tapEnd);cv.addEventListener('pointercancel',tapEnd);
}
function facingTalk(){
  const f=frontPoint();
  for(const e of ents)if(e.type==='npc'&&onCur(e)&&Math.abs(f.x-e.x)<e.w/2+7&&f.y>e.y-20&&f.y<e.y+7)return true;
  const t=tileAt(Math.floor(f.x/16),Math.floor(f.y/16));return t==='s'||t==='n';
}
function updateTouchUI(){
  if(!TOUCH)return;
  const show=(id,v)=>{const el=document.getElementById(id);if(el)el.style.display=v?'':'none';};
  const menus=state==='grow'||state==='quests';
  show('menu',state!=='title'&&state!=='ending'&&state!=='p2intro'&&state!=='flying'&&state!=='egg');
  show('btnB',(state==='play'&&has('flap'))||(menus&&G&&G.part2));
  show('btnMap',!!(G&&G.part2));
  let la='PECK',lb=menus?'PAGE':'FLAP';
  if(state==='title'||state==='ending'||state==='p2intro')la='START';
  else if(state==='talk')la=dlg&&dlg.lines[dlg.i]&&dlg.lines[dlg.i].choices?'OK':'NEXT';
  else if(state!=='play')la='OK';else if(G&&P&&facingTalk())la='TALK';
  const a=document.querySelector('#btnA small'),b=document.querySelector('#btnB small');
  if(a&&a.textContent!==la)a.textContent=la;if(b&&b.textContent!==lb)b.textContent=lb;
}
// on-screen text talks about keys; swap in button names on touch devices
const TOUCH_TXT=[[/Walk with the ARROW KEYS\. Press Z or SPACE to peck!/g,'Walk with the D-PAD. Tap A to peck!'],[/Press Z or SPACE/g,'Tap A'],
  [/Press Z/g,'Tap A'],[/Press E/g,'Tap GROW'],[/Press C/g,'Tap OUTFIT'],[/Press F/g,'Tap MAP'],[/Press X/g,'Tap B'],
  [/\bZ: /g,'A: '],[/\bX: /g,'B: '],[/\b[EQFC]: close/g,'X: close'],[/ESC: leave/g,'X: leave'],[/E:GROW|Q:QUESTS|F: FLY/g,'']];
function tt(s){if(!TOUCH||typeof s!=='string')return s;for(const [a,b] of TOUCH_TXT)s=s.replace(a,b);return s;}

