'use strict';
/* Shared pixel artwork for the sea chart, sailing vignette and moored ships.
   Ship variants are cached by the three independent upgrade bits. */
const COAST={ink:'#202840',paper:'#fff8ec',sand:'#e8cd98',sandLight:'#f6ead0',sandShadow:'#b69965',green:'#55aa62',leaf:'#a1d970',forest:'#2d664e',deep:'#204a74',water:'#306a9d',shallow:'#60bfc6',foam:'#b2e7e0',wood:'#a66c46',woodLight:'#ce9560',woodDark:'#594437',red:'#eb6654',gold:'#ffe05a',rock:'#64758b',rockLight:'#a9b7c5'};
function coastRect(g,color,x,y,w=1,h=1){g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function coastPoly(g,color,points){g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
function coastLine(g,color,points,width=1){g.strokeStyle=color;g.lineWidth=width;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function coastPalm(g,x,y){
  coastLine(g,COAST.woodDark,[[x,y+10],[x+2,y+2],[x,y-5]],2);
  coastPoly(g,COAST.forest,[[x,y-7],[x-8,y-6],[x-11,y-1],[x-3,y-3],[x-4,y+1],[x,y-3],[x+6,y+1],[x+4,y-4],[x+10,y-2],[x+6,y-7]]);
  coastRect(g,COAST.leaf,x-6,y-6,6,1);
}
function coastCoral(g,x,y){const R=(c,a,b,w,h)=>coastRect(g,c,a,b,w,h);R(COAST.red,x,y-4,3,10);R(COAST.red,x-4,y-1,4,3);R(COAST.red,x-5,y-5,2,6);R(COAST.red,x+2,y,5,2);R(COAST.red,x+5,y-3,2,4);R('#f6a6b6',x,y-4,1,6);}
function coastLighthouse(g,x,y,lit=true){
  coastPoly(g,COAST.ink,[[x-6,y+13],[x-4,y-8],[x+4,y-8],[x+7,y+13]]);
  coastPoly(g,COAST.paper,[[x-4,y+11],[x-2,y-7],[x+2,y-7],[x+5,y+11]]);
  coastRect(g,COAST.red,x-3,y+2,7,4);coastRect(g,COAST.ink,x-6,y-10,12,3);
  coastRect(g,lit?COAST.gold:COAST.rock,x-4,y-16,8,6);coastRect(g,COAST.ink,x-6,y-17,12,2);
  coastPoly(g,COAST.ink,[[x-7,y-18],[x,y-23],[x+7,y-18]]);
}
function coastSideShip(g,x,y,scale=1,lv={},enemy=false){
  g.save();g.translate(Math.round(x),Math.round(y));g.scale(scale,scale);
  const R=(c,a,b,w,h)=>coastRect(g,c,a,b,w,h),P=(c,p)=>coastPoly(g,c,p),L=(p,w=.7)=>coastLine(g,COAST.ink,p,w);
  const sail=enemy?'#303447':COAST.paper;
  P(COAST.ink,[[-34,-5],[-25,-3],[23,-3],[36,-8],[30,2],[23,9],[-23,9],[-30,3]]);
  P(COAST.wood,[[-30,-3],[-23,-1],[22,-1],[32,-5],[27,2],[22,6],[-22,6],[-27,2]]);
  R(COAST.woodLight,-24,0,48,2);R(COAST.woodDark,-23,5,45,2);
  for(let a=-16;a<24;a+=12){R(COAST.ink,a,2,5,3);R(COAST.gold,a+1,2,3,2);}
  R(COAST.ink,-25,-14,15,10);R(COAST.woodLight,-24,-13,13,9);R(COAST.ink,-26,-15,17,2);R(sail,-23,-17,11,3);
  R(COAST.ink,-21,-11,4,4);R(COAST.foam,-20,-10,2,2);
  R(COAST.ink,-3,-56,3,53);R(COAST.woodLight,-2,-54,1,49);R(COAST.ink,-18,-42,39,2);
  P(sail,[[-16,-40],[-3,-40],[-3,-10],[-14,-12],[-20,-17],[-18,-26]]);
  P(sail,[[1,-48],[5,-44],[13,-36],[20,-27],[22,-16],[1,-15]]);
  const shade=enemy?'#4f4c63':'#e1d4b6';
  P(shade,[[-16,-38],[-16,-21],[-13,-15],[-3,-12],[-3,-9],[-15,-11],[-20,-16],[-18,-30]]);
  P(shade,[[2,-17],[20,-19],[22,-16],[1,-14],[1,-44],[3,-42]]);
  L([[-3,-52],[-31,-5]]);L([[0,-51],[31,-6]]);
  if(enemy){R(COAST.paper,8,-33,7,6);R(COAST.ink,9,-31,2,2);R(COAST.ink,13,-31,2,2);R(COAST.paper,10,-27,3,2);}
  else{R(COAST.gold,8,-32,7,7);R(COAST.ink,13,-31,1,2);R(COAST.red,15,-29,3,2);}
  P(COAST.red,[[-2,-56],[12,-54],[7,-51],[-2,-52]]);
  if(lv.sails){P(sail,[[-18,-44],[-3,-44],[-3,-53],[-13,-51]]);R(COAST.ink,-19,-44,17,1);}
  if(lv.hull){R(COAST.gold,-23,6,45,1);R(COAST.ink,-28,-2,5,5);R(COAST.ink,24,-3,4,5);}
  if(lv.cannon){R(COAST.ink,14,-7,14,4);R(COAST.rock,15,-7,10,2);R(COAST.ink,16,-3,4,2);}
  g.restore();
}
function coastTopShip(g,x,y,scale=1,lv={}){
  g.save();g.translate(Math.round(x),Math.round(y));g.scale(scale,scale);
  const R=(c,a,b,w,h)=>coastRect(g,c,a,b,w,h),P=(c,p)=>coastPoly(g,c,p);
  P(COAST.ink,[[-10,-26],[9,-26],[15,-19],[14,13],[9,23],[0,32],[-9,23],[-14,12],[-14,-17]]);
  P(COAST.woodLight,[[-9,-23],[8,-23],[12,-18],[11,12],[6,22],[0,28],[-6,22],[-11,12],[-11,-17]]);
  for(let j=-18;j<24;j+=5)R(COAST.wood,j>12?-6:-10,j,j>12?12:21,1);
  R(COAST.woodDark,-8,-21,16,10);R(COAST.paper,-6,-20,12,3);R(COAST.ink,-2,-15,5,4);R(COAST.foam,-1,-14,3,2);
  R(COAST.ink,-2,-12,3,30);coastLine(g,COAST.ink,[[-11,-12],[10,14]],.7);coastLine(g,COAST.ink,[[11,-12],[-10,15]],.7);
  P(COAST.paper,[[-17,-5],[0,-9],[16,-4],[12,3],[1,8],[-12,3]]);P('#e1d4b6',[[-14,0],[1,4],[13,0],[12,3],[1,8],[-12,3]]);
  R(COAST.gold,-3,-2,6,5);R(COAST.red,0,-18,11,3);R(COAST.ink,0,-21,1,13);R(COAST.ink,-1,16,3,4);
  if(lv.sails){P(COAST.paper,[[-12,-12],[0,-15],[11,-12],[1,-9]]);}
  if(lv.hull){R(COAST.gold,-10,9,2,7);R(COAST.gold,9,9,2,7);}
  if(lv.cannon){R(COAST.ink,10,12,10,4);R(COAST.rock,12,12,7,2);}
  g.restore();
}
const COAST_SHIPS=new Map();
function coastalShipSprite(lv={},top=false){
  const bits=(lv.sails?1:0)|(lv.hull?2:0)|(lv.cannon?4:0),key=bits+(top?8:0);
  if(!COAST_SHIPS.has(key))COAST_SHIPS.set(key,top?mk(44,66,g=>coastTopShip(g,20,28,1,lv)):mk(76,68,g=>coastSideShip(g,37,57,1,lv)));
  return COAST_SHIPS.get(key);
}
const COAST_SHAPES={
  cove:[[-23,-10],[-13,-19],[5,-20],[20,-13],[25,-4],[20,4],[9,1],[4,-5],[-4,-5],[-9,2],[-5,11],[7,12],[13,18],[-1,22],[-18,16],[-27,4]],
  reef:[[-26,-3],[-21,-14],[-7,-21],[11,-20],[25,-10],[28,4],[17,17],[0,22],[-19,15],[-28,5]],
  volcano:[[-25,7],[-22,-6],[-14,-14],[-4,-19],[7,-17],[12,-8],[23,-5],[27,9],[16,17],[0,20],[-17,17]],
  lighthouse:[[-14,-16],[-4,-23],[7,-19],[10,-7],[17,0],[12,8],[15,15],[3,22],[-8,17],[-9,6],[-17,-3]],
  harbor:[[-29,-23],[24,-23],[28,-11],[14,-5],[7,4],[-4,8],[-7,24],[-29,24]]
};
function coastInside(x,y,p){let v=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [a,b]=p[i],[c,d]=p[j];if(((b>y)!==(d>y))&&(x<(c-a)*(y-b)/(d-b)+a))v=!v;}return v;}
const COAST_ISLANDS=new Map();
function coastalIslandSprite(id,lit=false){
  const key=id+(lit?'lit':'');if(COAST_ISLANDS.has(key))return COAST_ISLANDS.get(key);
  const sprite=mk(76,76,g=>{
    if(id==='fortress'){coastSideShip(g,37,57,.85,{sails:1,hull:1,cannon:1},true);return;}
    const a=38,b=41,p=COAST_SHAPES[id]||COAST_SHAPES.cove;
    const land=(x,y)=>coastInside(x-a,y-b,p)&&(id!=='reef'||Math.hypot((x-a)/14,(y-b)/10)>1);
    for(let y=10;y<72;y+=2)for(let x=4;x<72;x+=2)if(land(x,y)||[[-5,0],[5,0],[0,-5],[0,5]].some(([i,j])=>land(x+i,y+j)))coastRect(g,COAST.shallow,x,y,2,2);
    for(let y=10;y<72;y+=2)for(let x=4;x<72;x+=2)if(land(x,y))coastRect(g,id==='volcano'?'#443a4c':COAST.rock,x,y+4,2,2);
    for(let y=10;y<72;y+=2)for(let x=4;x<72;x+=2){if(!land(x,y))continue;
      const edge=[[-2,0],[2,0],[0,-2],[0,2]].some(([i,j])=>!land(x+i,y+j));
      const c=id==='volcano'?(edge?'#524654':'#74606b'):id==='lighthouse'?(edge?COAST.rock:COAST.rockLight):(edge?COAST.sandShadow:COAST.sand);
      coastRect(g,c,x,y,2,2);if(edge&&!land(x,y+3)&&(x+y)%8===0)coastRect(g,COAST.foam,x,y+6,3,1);
    }
    if(id==='cove'){coastPalm(g,a-15,b);coastPalm(g,a+3,b-12);coastRect(g,COAST.woodDark,a-18,b+8,12,4);coastRect(g,COAST.woodLight,a-18,b+8,12,1);}
    if(id==='reef'){coastCoral(g,a-18,b);coastCoral(g,a+13,b-9);coastCoral(g,a+15,b+9);}
    if(id==='volcano'){coastPoly(g,'#393749',[[a-16,b+5],[a-5,b-17],[a+5,b-18],[a+18,b+6]]);coastPoly(g,COAST.red,[[a-6,b-16],[a+5,b-17],[a+8,b-11],[a+1,b-11],[a-1,b],[a-5,b+3],[a-3,b-10],[a-8,b-10]]);coastRect(g,COAST.gold,a-4,b-16,7,2);coastRect(g,'#8c778b',a-6,b-25,7,3);}
    if(id==='lighthouse')coastLighthouse(g,a,b-2,lit);
    if(id==='harbor'){coastRect(g,COAST.woodDark,a+2,b+4,18,5);for(let i=3;i<20;i+=4)coastRect(g,COAST.woodLight,a+i,b+4,2,4);coastRect(g,COAST.red,a-18,b-16,12,5);coastRect(g,COAST.paper,a-17,b-11,10,10);}
  });COAST_ISLANDS.set(key,sprite);return sprite;
}
