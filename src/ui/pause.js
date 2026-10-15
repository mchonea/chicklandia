'use strict';
/* ---------------- pause / settings menu ---------------- */
let pauseSel=0,pauseMode='menu',eraseSel=1;
const PAUSE_ROWS=['RESUME','CONTROLS','MUSIC','SOUND','TEXT SPEED','BIG TEXT','ERASE SAVE'];
function openPause(){state='pause';pauseSel=0;pauseMode='menu';eraseSel=1;SFX.menu();}
function updatePause(){
  if(pauseMode==='controls'){if(pressed.a||pressed.back||pressed.b||pressed.pause){pauseMode='menu';SFX.menu();}return;}
  if(pauseMode==='erase'){
    if(pressed.up||pressed.down||pressed.left||pressed.right){eraseSel^=1;SFX.menu();}
    if(pressed.back||pressed.b||pressed.pause){pauseMode='menu';SFX.menu();}
    else if(pressed.a){SFX.pick();pauseMode='menu';if(eraseSel===0)eraseSave();}
    return;}
  if(pressed.back||pressed.pause){state='play';SFX.menu();return;}
  if(pressed.up){pauseSel=(pauseSel+PAUSE_ROWS.length-1)%PAUSE_ROWS.length;SFX.menu();}
  if(pressed.down){pauseSel=(pauseSel+1)%PAUSE_ROWS.length;SFX.menu();}
  const d=(pressed.right?1:0)-(pressed.left?1:0),a=pressed.a;
  switch(pauseSel){
    case 0:if(a){state='play';SFX.menu();}break;
    case 1:if(a){pauseMode='controls';SFX.menu();}break;
    case 2:if(d||a){SET.music=a&&!d?(SET.music>=10?0:SET.music+1):clamp(SET.music+d,0,10);applyVolumes();saveSettings();SFX.menu();}break;
    case 3:if(d||a){SET.sound=a&&!d?(SET.sound>=10?0:SET.sound+1):clamp(SET.sound+d,0,10);applyVolumes();saveSettings();SFX.pick();}break;
    case 4:if(d||a){SET.speed=(SET.speed+(d||1)+3)%3;saveSettings();SFX.menu();}break;
    case 5:if(d||a){SET.big=!SET.big;saveSettings();SFX.menu();}break;
    case 6:if(a){pauseMode='erase';eraseSel=1;SFX.menu();}break;
  }
}
function eraseSave(){
  try{localStorage.removeItem(SAVE_KEY);}catch(e){}
  titleSave=false;G=null;ents=[];state='title';titleSel=0;titleConfirm=false;fade=1;fadeColor='#000';
}
function bar10(n){return '['+'|'.repeat(n)+'.'.repeat(10-n)+']';}
function drawPause(){
  ctx.fillStyle='rgba(18,28,44,0.88)';ctx.fillRect(0,0,W,H);box(24,14,W-48,H-28,'#24364a','#ffe05a');
  if(pauseMode==='controls'){
    txt('CONTROLS',W/2,22,9,'#ffe05a',{align:'center',shadow:true});
    const L=TOUCH?[['D-PAD','Walk'],['A','Peck / talk / OK'],['B','Wing flap (or page)'],['GROW','Skills & growth'],['QUESTS','Quest log'],['OUTFIT','Closet'],['MAP','Fly map (Part 2)'],['X','Close / back'],['MENU','Pause']]
      :[['ARROWS / WASD','Walk'],['Z / SPACE','Peck / talk / OK'],['X','Wing flap (or page)'],['E','Skills & growth'],['Q','Quest log'],['C','Closet'],['F','Fly map (Part 2)'],['ESC','Close / back'],['P','Pause'],['M','Mute music']];
    L.forEach(([k,v],i)=>{txt(k,36,40+i*14,6,'#ffe05a');txt(v,120,40+i*14,6,'#fff8ec');});
    txt('Press A to go back',W/2,H-30,5,'#b9d1dd',{align:'center'});return;}
  txt('PAUSED',W/2,22,10,'#ffe05a',{align:'center',shadow:true});
  const val=[null,null,bar10(SET.music),bar10(SET.sound),TEXT_SPEEDS[SET.speed],SET.big?'ON':'OFF',null];
  PAUSE_ROWS.forEach((r,i)=>{const y=44+i*20,sel=i===pauseSel;
    if(sel)box(32,y-4,W-64,16,'#29465b','#fff8ec');
    txt((sel?'> ':'  ')+r,40,y,7,sel?'#fff8ec':'#b9d1dd');
    if(val[i])txt(val[i],W-40,y,7,sel?'#ffe05a':'#98b3c7',{align:'right'});});
  txt('LEFT/RIGHT change   ESC resume',W/2,H-30,5,'#b9d1dd',{align:'center'});
  if(pauseMode==='erase'){box(44,88,168,58,'#192639','#ff8080');
    txt('Erase your saved game?',W/2,96,6,'#ff8080',{align:'center'});txt('This cannot be undone.',W/2,108,5,'#fff8ec',{align:'center'});
    ['Yes','No'].forEach((o,i)=>txt((eraseSel===i?'> ':'  ')+o,W/2-30+i*60,124,8,eraseSel===i?'#fff8ec':'#98b3c7',{align:'center'}));}
}
