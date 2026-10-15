import fs from 'fs';
let s=fs.readFileSync('src/systems/festival.js','utf8');
s=s.replace("function startPinch(){PIN={t:0,line:0,shown:0};state='pinch';fade=0;SFX.fanfare();}","function startPinch(){PIN={t:0,line:0,shown:0,lines:PINCH_LINES,after:pinchAfter};state='pinch';fade=0;SFX.fanfare();}\nfunction pinchAfter(){G.flags.pinchMap=1;G.flags.seasReady=1;save();state='play';\n  const sq={x:40*16+8,y:89*16+12};P.x=sq.x;P.y=sq.y+24;CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;\n  say([{who:'me',text:\"The Pirate Seas! I wonder what's out there... Cap'n Pinch will be at the city harbor, next to his ship.\"}]);}");
const a=s.indexOf("function updatePinch(){"),b=s.indexOf("function drawPinch(){");
s=s.slice(0,a)+`function updatePinch(){
  const p=PIN;p.t++;if(p.t<40){fade=1-p.t/40;return;}fade=0;
  if(p.t<(p.sunset?60:260)){if(p.t%30===0)SFX.flap();return;}
  const L=p.lines[p.line];
  if(p.shown<L.length){p.shown+=TEXT_SPEED_MUL[SET.speed];if(pressed.a)p.shown=L.length;}
  else if(pressed.a){p.line++;p.shown=0;SFX.menu();
    if(p.line>=p.lines.length){const after=p.after;PIN=null;after();}}
}
`+s.slice(b);
s=s.replace("const sx=Math.round(lerp(300,110,Math.min(1,p.t/240))),sy","const sx=Math.round(lerp(300,110,Math.min(1,p.t/(p.sunset?40:240)))),sy");
s=s.replace("  if(p.t>=260){const L=PINCH_LINES[p.line];","  if(p.t>=(p.sunset?60:260)){const L=p.lines[p.line];");
fs.writeFileSync('src/systems/festival.js',s);
