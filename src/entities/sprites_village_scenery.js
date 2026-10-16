'use strict';
/* Cached scenery for the village's shared spaces. All art uses integer pixels. */
const VART={ink:'#202840',wood:'#a66c46',light:'#ce9560',dark:'#594437',cream:'#f6ead0',wall:'#dcad86',red:'#eb6654',redDark:'#a43d43',gold:'#ffe05a',green:'#55aa62',forest:'#2d664e',leaf:'#a1d970',blue:'#409dc5',foam:'#b2e7e0',stone:'#a9b7c5'};
SPR.v_fence=mk(22,14,g=>{vRect(g,'wood',2,6,18,2);vRect(g,'light',2,6,18,1);for(const x of [2,18]){vRect(g,'dark',x,2,2,10);vRect(g,'cream',x,2,2,1);}});SPR.v_fence.anchorX=11;SPR.v_fence.anchorY=8;
function vRect(g,c,x,y,w=1,h=1){g.fillStyle=VART[c]||c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function vPoly(g,c,pts){
  for(let y=Math.floor(Math.min(...pts.map(p=>p[1])));y<Math.ceil(Math.max(...pts.map(p=>p[1])));y++){
    const hits=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){
      const a=pts[j],b=pts[i];if((a[1]>y+.5)!==(b[1]>y+.5))hits.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    hits.sort((a,b)=>a-b);for(let i=0;i+1<hits.length;i+=2){const l=Math.ceil(hits[i]-.5);vRect(g,c,l,y,Math.ceil(hits[i+1]-.5)-l,1);}
  }
}
function vEllipse(g,c,cx,cy,rx,ry){for(let y=-ry;y<=ry;y++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));vRect(g,c,cx-w,cy+y,w*2+1,1);}}
function vLine(g,c,a,b,w=1){let [x,y]=a;const dx=Math.abs(b[0]-x),dy=-Math.abs(b[1]-y),sx=x<b[0]?1:-1,sy=y<b[1]?1:-1;let e=dx+dy;
  for(;;){vRect(g,c,x,y,w,w);if(x===b[0]&&y===b[1])break;const e2=2*e;if(e2>=dy){e+=dy;x+=sx;}if(e2<=dx){e+=dx;y+=sy;}}}
function vSprite(w,h,fn,ax=w/2,ay=h-4){const s=mk(w,h,g=>fn(g));s.anchorX=ax;s.anchorY=ay;return s;}
function villageOak(season,small=false){return vSprite(small?50:80,small?58:76,g=>{
  const R=(c,x,y,w,h)=>vRect(g,c,x,y,w,h),cx=small?25:40,base=small?54:72;
  vEllipse(g,'#478556',cx,base,small?14:24,3);R('ink',cx-5,base-29,11,30);R('wood',cx-3,base-28,7,28);R('light',cx-2,base-25,2,21);
  vLine(g,'dark',[cx,base-15],[cx-14,base-31],4);vLine(g,'wood',[cx,base-17],[cx-13,base-31],2);
  vLine(g,'dark',[cx+1,base-23],[cx+15,base-36],3);
  if(season==='WINTER'){
    for(const [a,b] of [[-23,-47],[-15,-55],[0,-64],[19,-54],[29,-42]]){const dx=small?Math.round(a*.65):a,dy=small?Math.round(b*.75):b;vLine(g,'dark',[cx,base-24],[cx+dx,base+dy],3);vLine(g,'light',[cx,base-24],[cx+dx,base+dy],1);R('cream',cx+dx-4,base+dy,9,2);}return;
  }
  const shade=season==='AUTUMN'?'#946039':'forest',mid=season==='AUTUMN'?'#d39744':'green',lit=season==='AUTUMN'?'#f0c15e':'leaf';
  const lobes=small?[[0,22,21,18],[-11,28,12,14],[12,27,12,16]]:[[0,25,25,22],[-19,34,17,18],[20,32,17,20],[-7,43,24,14]];
  for(const [dx,y,rx,ry] of lobes){vEllipse(g,'ink',cx+dx,y,rx,ry);vEllipse(g,shade,cx+dx,y,rx-2,ry-2);vEllipse(g,mid,cx+dx-2,y-3,rx-3,ry-4);vEllipse(g,lit,cx+dx-5,y-7,Math.max(4,rx-9),Math.max(3,ry-10));}
  R(lit,cx-22,28,5,2);R(lit,cx+12,17,5,2);R(mid,cx+20,42,4,2);
  if(small)for(const [x,y] of [[15,20],[32,16],[35,30],[20,36]]){R('redDark',x,y+1,4,3);R('red',x,y,4,3);R('cream',x,y,1,1);}
 });}
for(const s of SEASONS){SPR['v_oak_'+s]=villageOak(s);SPR['v_fruitTree_'+s]=villageOak(s,true);}
SPR.v_picnic=vSprite(46,28,g=>{const R=(...a)=>vRect(g,...a);
  for(const x of [10,32]){vPoly(g,'ink',[[x,13],[x+3,13],[x+7,24],[x+3,24]]);R('light',x+2,15,2,8);}
  R('ink',1,15,44,5);R('wood',2,16,42,3);R('light',2,16,42,1);R('ink',7,6,32,10);R('wood',8,7,30,8);
  for(const y of [8,12])R('light',8,y,30,1);R('cream',17,7,11,8);for(let x=18;x<28;x+=4)for(let y=8;y<15;y+=4)R('red',x,y,2,2);
  R('dark',20,3,6,5);R('gold',21,3,4,2);R('foam',31,6,3,4);
});
SPR.v_bench=vSprite(30,20,g=>{const R=(...a)=>vRect(g,...a);R('ink',2,1,26,10);R('wood',3,2,24,8);for(const y of [2,6])R('light',3,y,24,1);
  R('ink',0,11,30,4);R('light',1,11,28,1);R('wood',1,12,28,2);for(const x of [3,24]){R('ink',x,14,3,3);R('light',x+1,14,1,3);}});
SPR.v_swings=vSprite(52,42,g=>{const R=(...a)=>vRect(g,...a);for(const x of [8,41]){vLine(g,'ink',[x,3],[x-6,37],3);vLine(g,'light',[x,4],[x-5,36]);vLine(g,'dark',[x,3],[x+6,37],2);}
  R('ink',5,2,42,4);R('wood',6,3,40,2);for(const x of [17,32]){R('dark',x,6,1,23);R('cream',x+1,6,1,22);}R('ink',15,28,22,4);R('red',16,28,20,2);});
SPR.v_slide=vSprite(38,32,g=>{const R=(...a)=>vRect(g,...a);R('ink',4,4,10,4);R('light',5,5,8,2);R('ink',4,7,3,20);R('wood',5,7,1,19);R('ink',12,7,3,20);
  for(let y=11;y<27;y+=5)R('light',6,y,7,2);vPoly(g,'ink',[[12,6],[16,5],[33,24],[35,24],[35,28],[29,28],[12,10]]);vPoly(g,'blue',[[14,7],[16,7],[31,25],[34,25],[34,27],[30,27]]);vLine(g,'foam',[15,7],[31,25]);});
SPR.v_planter=vSprite(26,20,g=>{const R=(...a)=>vRect(g,...a);R('dark',2,11,22,6);R('wood',3,12,20,4);R('light',2,11,22,2);
  for(let i=0;i<5;i++){const x=4+i*4,y=5+(i%2)*2;R('forest',x,y,2,7);R('green',x-1,y+4,4,2);R(i%2?'red':'cream',x-1,y-2,4,3);R('gold',x,y-1,2,1);}});
SPR.v_bunting=vSprite(126,28,g=>{const cols=['red','gold','blue','leaf','cream'];for(let x=2;x<124;x++){const y=5+Math.round(Math.sin((x-2)/122*Math.PI)*6);vRect(g,'dark',x,y);if(x%13<7&&x>4&&x<120)vPoly(g,cols[Math.floor(x/13)%5],[[x,y+1],[x+6,y+1],[x+3,y+9]]);}for(const x of [2,121]){vRect(g,'dark',x,2,2,23);vRect(g,'light',x,2,1,23);}});
SPR.v_well=vSprite(38,42,g=>{const R=(...a)=>vRect(g,...a);vEllipse(g,'ink',19,32,15,6);R('ink',4,26,31,7);R('stone',5,26,29,8);R('cream',6,26,27,2);for(const x of [12,23])R('#7896ae',x,29,1,5);
  vEllipse(g,'ink',19,26,15,4);vEllipse(g,'blue',19,26,11,2);for(const x of [8,28]){R('ink',x,10,3,20);R('light',x+1,11,1,18);}R('dark',10,17,20,2);R('cream',20,17,1,10);R('wood',18,24,5,4);
  vPoly(g,'ink',[[1,13],[19,1],[37,13],[35,16],[3,16]]);vPoly(g,'red',[[4,12],[19,4],[34,12]]);R('redDark',4,13,30,2);vLine(g,'#f6c6a0',[5,11],[18,5]);});
SPR.v_stall=vSprite(48,44,g=>{const R=(...a)=>vRect(g,...a);for(const x of [5,40]){R('ink',x,16,3,24);R('light',x+1,17,1,22);}R('ink',4,26,40,13);R('wood',5,27,38,11);R('light',5,27,38,2);for(const x of [10,20,30,40])R('dark',x,30,1,8);
  vPoly(g,'ink',[[5,4],[42,4],[47,18],[1,18]]);vPoly(g,'cream',[[6,6],[41,6],[44,16],[4,16]]);for(let x=6;x<42;x+=12)vPoly(g,'red',[[x,6],[x+6,6],[x+7,16],[x-2,16]]);R('redDark',2,17,44,3);
  for(let i=0;i<5;i++){R(i%2?'gold':'red',8+i*7,23-(i%2),5,3);R('forest',10+i*7,21-(i%2),1,2);}R('dark',11,7,25,6);R('cream',14,9,19,1);});
SPR.v_lamp=vSprite(18,40,g=>{const R=(...a)=>vRect(g,...a);R('ink',7,14,4,22);R('light',8,15,1,20);R('dark',4,35,10,2);R('ink',3,3,12,13);R('gold',5,5,8,9);R('cream',6,5,3,7);R('dark',8,3,2,12);vPoly(g,'ink',[[1,4],[9,0],[17,4]]);});
SPR.v_workshop=vSprite(78,60,g=>{const R=(...a)=>vRect(g,...a);R('ink',9,23,60,34);R('wall',11,25,56,29);R('light',11,27,56,3);for(const y of [33,41,49])R('wood',11,y,56,1);
  R('dark',39,31,20,24);R('ink',40,32,18,23);R('wood',42,33,14,21);R('light',43,34,2,19);R('gold',52,44,1,2);R('cream',14,32,17,14);R('dark',15,33,15,12);R('foam',16,34,13,10);R('wood',22,34,2,10);
  vPoly(g,'ink',[[2,25],[39,2],[76,25],[73,28],[5,28]]);vPoly(g,'blue',[[7,24],[39,6],[71,24]]);vPoly(g,'#306a9d',[[39,6],[71,24],[63,24],[39,10]]);vLine(g,'foam',[9,22],[37,7]);R('dark',6,24,66,3);
  R('dark',30,19,21,7);R('cream',32,21,17,1);vLine(g,'stone',[19,39],[28,49],2);R('dark',17,37,7,3);R('stone',16,36,8,2);R('light',8,55,62,2);});
SPR.v_lumber=vSprite(46,34,g=>{const R=(...a)=>vRect(g,...a);for(const x of [3,39]){R('ink',x,4,3,26);R('light',x+1,5,1,24);}R('dark',2,28,42,3);
  for(let j=0;j<3;j++){R('ink',5,8+j*7,34,6);R('wood',6,9+j*7,32,4);R('light',7,9+j*7,29,1);R('cream',6,9+j*7,3,4);}vPoly(g,'ink',[[0,6],[7,0],[39,0],[46,6]]);vPoly(g,'forest',[[4,5],[8,2],[38,2],[42,5]]);});
SPR.v_workbench=vSprite(36,24,g=>{const R=(...a)=>vRect(g,...a);for(const x of [5,28]){R('dark',x,12,3,9);R('light',x,13,1,7);}R('ink',1,8,34,7);R('wood',2,9,32,5);R('light',2,9,32,1);R('cream',5,6,22,3);vLine(g,'stone',[17,4],[28,8],2);R('dark',16,3,4,3);R('ink',5,3,8,2);R('red',6,2,6,2);});
SPR.v_stump=vSprite(20,18,g=>{vRect(g,'dark',3,6,15,9);vRect(g,'wood',5,7,11,7);vEllipse(g,'ink',10,6,8,4);vEllipse(g,'light',10,6,6,2);vRect(g,'cream',7,5,6,1);vLine(g,'stone',[11,6],[14,1],2);vRect(g,'dark',13,0,5,3);});
SPR.v_haycart=vSprite(42,30,g=>{const R=(...a)=>vRect(g,...a);for(const x of [10,31]){vEllipse(g,'ink',x,23,5,5);vEllipse(g,'light',x,23,3,3);R('dark',x,21,1,5);}R('dark',3,15,36,6);R('wood',4,16,34,4);R('light',4,16,34,1);
  R('#c98a45',7,5,26,11);R('#e8cd98',8,4,24,10);for(let i=0;i<7;i++)R('#ffe0a0',9+i*3,5,1,8);R('wood',5,11,2,8);R('wood',35,11,2,8);R('dark',37,17,5,2);});
SPR.v_sacks=vSprite(28,24,g=>{for(const [x,y] of [[2,8],[14,6],[8,0]]){vPoly(g,'dark',[[x+2,y+4],[x+1,y],[x+8,y],[x+7,y+4],[x+10,y+8],[x+10,y+15],[x,y+15],[x,y+8]]);vRect(g,'cream',x+1,y+6,8,8);vRect(g,'light',x+2,y+3,6,2);vRect(g,'#e8cd98',x+6,y+7,2,6);}});
SPR.v_barrels=vSprite(28,26,g=>{for(const [x,y] of [[1,4],[14,0]]){vRect(g,'ink',x,y+3,12,18);vRect(g,'wood',x+1,y+4,10,16);for(const j of [4,16])vRect(g,'stone',x+1,y+j,10,2);vRect(g,'light',x+3,y+5,1,14);vEllipse(g,'dark',x+6,y+3,6,3);vEllipse(g,'light',x+6,y+3,4,1);}});
SPR.v_reeds=vSprite(30,26,g=>{for(let i=0;i<7;i++){const x=3+i*4,y=3+i%3*3;vLine(g,'forest',[x,22],[x+2,y]);vRect(g,'dark',x+1,y-2,3,5);vLine(g,'leaf',[x+1,22],[x-2,12]);}});
SPR.v_tools=vSprite(24,30,g=>{const R=(...a)=>vRect(g,...a);R('dark',3,16,18,10);R('wood',4,17,16,8);R('light',3,16,18,2);vLine(g,'light',[8,22],[5,2],2);R('stone',2,1,8,4);vLine(g,'light',[14,22],[17,4],2);R('stone',14,2,8,2);for(const x of [14,17,20])R('stone',x,0,1,5);});
SPR.v_shelter=vSprite(58,48,g=>{const R=(...a)=>vRect(g,...a);R('ink',7,20,44,24);R('wall',9,22,40,20);R('dark',16,24,26,19);R('ink',18,25,22,18);R('#e8cd98',18,39,22,4);for(let x=20;x<40;x+=4)R('gold',x,40,2,1);
  vPoly(g,'ink',[[1,22],[29,3],[57,22],[54,25],[4,25]]);vPoly(g,'red',[[5,21],[29,7],[53,21]]);R('redDark',4,22,50,2);vLine(g,'#f6c6a0',[7,20],[28,8]);R('light',8,42,42,2);});
SPR.v_trough=vSprite(32,18,g=>{const R=(...a)=>vRect(g,...a);R('dark',2,6,28,8);R('wood',3,7,26,6);R('ink',4,3,24,7);R('blue',5,4,22,4);R('foam',7,4,16,1);R('light',2,9,28,1);R('dark',5,13,3,2);R('dark',24,13,3,2);});
SPR.v_hay=vSprite(24,20,g=>{const R=(...a)=>vRect(g,...a);R('dark',2,4,20,12);R('#e8cd98',3,5,18,10);for(let x=5;x<21;x+=3)R('#ffe0a0',x,6,1,7);R('wood',8,4,2,12);R('wood',17,4,2,12);});
SPR.v_mudpond=vSprite(38,20,g=>{vEllipse(g,'forest',19,12,18,6);vEllipse(g,'dark',19,11,17,6);vEllipse(g,'wood',19,10,15,4);vRect(g,'light',9,9,7,1);vRect(g,'light',23,12,5,1);});
SPR.v_cushion=vSprite(22,18,g=>{vRect(g,'dark',2,9,18,6);vRect(g,'wood',3,10,16,3);vPoly(g,'ink',[[3,6],[5,3],[17,3],[20,6],[19,11],[3,11]]);vRect(g,'#ff9cd0',5,4,12,6);vRect(g,'#ffd0e6',6,4,10,1);vRect(g,'redDark',11,7,2,1);});
SPR.v_dairy=vSprite(26,22,g=>{const R=(...a)=>vRect(g,...a);R('dark',3,11,3,8);R('dark',12,11,3,8);R('ink',1,8,16,4);R('light',2,8,14,2);R('ink',18,9,7,11);R('stone',19,10,5,9);R('cream',19,10,2,8);R('dark',20,7,3,3);});
SPR.v_blankets=vSprite(26,22,g=>{const R=(...a)=>vRect(g,...a);R('dark',2,11,22,8);R('wood',3,12,20,6);R('light',3,14,20,1);for(const [y,c] of [[10,'foam'],[6,'cream'],[2,'#ff9cd0']]){R('ink',5,y,16,5);R(c,6,y+1,14,3);R('cream',17,y+1,1,3);}});
SPR.v_desks=vSprite(28,24,g=>{const R=(...a)=>vRect(g,...a);for(const x of [3,21])R('dark',x,10,3,10);R('ink',1,6,26,6);R('wood',2,7,24,4);R('light',2,7,24,1);R('cream',7,4,10,4);R('blue',8,5,3,1);R('dark',7,19,15,2);});
SPR.v_stoneStage=vSprite(48,14,g=>{vPoly(g,'ink',[[3,2],[44,2],[47,6],[44,11],[4,11],[1,7]]);vRect(g,'stone',4,4,40,6);vRect(g,'cream',6,4,36,1);for(const x of [14,28,39])vRect(g,'#7896ae',x,6,1,4);});
for(const s of SEASONS)SPR['v_seasonal_'+s]=vSprite(38,34,g=>{
  if(s==='WINTER'){vEllipse(g,'stone',19,28,16,3);vEllipse(g,'cream',19,22,10,8);vEllipse(g,'cream',19,10,7,6);vRect(g,'ink',16,8);vRect(g,'ink',22,8);vRect(g,'red',13,15,13,3);vRect(g,'red',23,16,3,7);vRect(g,'gold',19,10,5,2);}
  else if(s==='AUTUMN'){for(const [x,y] of [[8,23],[21,24],[28,17]]){vEllipse(g,'redDark',x,y,7,6);vEllipse(g,'#e8a02c',x,y-1,6,5);vRect(g,'light',x-2,y-3,1,6);vRect(g,'forest',x,y-7,2,3);}}
  else if(s==='SUMMER'){for(const [x,y,c] of [[9,9,'blue'],[26,16,'red']]){vPoly(g,'ink',[[x,y-8],[x+7,y],[x,y+8],[x-7,y]]);vPoly(g,c,[[x,y-6],[x+5,y],[x,y+6],[x-5,y]]);vLine(g,'cream',[x,y+7],[x-3,30]);}}
  else{vRect(g,'dark',5,20,28,10);vRect(g,'wood',6,21,26,8);for(let i=0;i<4;i++){vEllipse(g,i%2?'#ff9cd0':'cream',10+i*6,19-i%2,3,4);vRect(g,'gold',10+i*6,18-i%2,1,1);}vRect(g,'leaf',8,25,22,1);}
});
// The landmark keeps its original dimensions and sail hub, shared with the festival.
SPR.windmillBase=mk(40,64,g=>{
  vPoly(g,'ink',[[13,19],[27,19],[36,64],[4,64]]);vPoly(g,'cream',[[15,20],[25,20],[33,62],[7,62]]);vPoly(g,'#e8cd98',[[25,20],[33,62],[28,62],[23,22]]);
  for(let y=30;y<61;y+=8)vRect(g,'light',12-(y-30)/8,y,18+(y-30)/4,1);
  vRect(g,'ink',17,43,9,21);vRect(g,'wood',18,44,7,19);vRect(g,'light',19,45,1,17);vRect(g,'gold',23,54,1,2);
  vRect(g,'ink',16,29,8,9);vRect(g,'foam',17,30,6,7);vRect(g,'wood',20,30,1,7);
  vPoly(g,'ink',[[3,23],[20,3],[37,23]]);vPoly(g,'red',[[7,21],[20,7],[33,21]]);vPoly(g,'redDark',[[20,7],[33,21],[28,21],[20,10]]);vRect(g,'dark',5,22,30,2);
});
