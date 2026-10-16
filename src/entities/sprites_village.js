'use strict';
/* ---------------- village sprites: buildings (drawn in code), materials, skill icons, props ---------------- */
// Market Village buildings share a footpoint, with room for eaves and the mill wheel.
// Integer scan lines keep the silhouettes crisp at the game's native resolution.
function drawBuildingArt(x,kind){
  const ink='#202840',cream='#f6ead0',wall='#dcad86',wood='#a66c46',dark='#594437',light='#ce9560';
  const R=(c,i,j,w=1,h=1)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};
  const P=(c,pts)=>{for(let y=Math.min(...pts.map(p=>p[1]));y<Math.max(...pts.map(p=>p[1]));y++){
    const hits=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){
      const a=pts[j],b=pts[i];if((a[1]>y+.5)!==(b[1]>y+.5))hits.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    hits.sort((a,b)=>a-b);for(let i=0;i<hits.length;i+=2){const l=Math.ceil(hits[i]-.5),r=Math.ceil(hits[i+1]-.5);R(c,l,y,r-l,1);}
  }};
  const L=(c,a,b)=>{let [i,j]=a;const dx=Math.abs(b[0]-i),dy=-Math.abs(b[1]-j),sx=i<b[0]?1:-1,sy=j<b[1]?1:-1;let e=dx+dy;
    for(;;){R(c,i,j);if(i===b[0]&&j===b[1])break;const e2=2*e;if(e2>=dy){e+=dy;i+=sx;}if(e2<=dx){e+=dx;j+=sy;}}};
  const base=(w=32,h=23)=>{R(ink,-w/2,-h,w,h+3);R(wall,1-w/2,1-h,w-2,h-1);R(cream,2-w/2,2-h,w-5,5);R('#c08d6b',w/2-4,1-h,3,h-1);R('#e8cd98',1-w/2,-4,w-2,4);R(dark,-w/2,0,w,2);R(light,1-w/2,0,w-2,1);};
  const roof=(w,eave,peak,c,shade)=>{P(ink,[[-w,eave],[0,peak],[w+1,eave],[w-1,eave+3],[-w+2,eave+3]]);
    P(c,[[2-w,eave],[0,peak+3],[w-1,eave],[-w+2,eave]]);P(shade,[[0,peak+3],[w-1,eave],[w-6,eave],[0,peak+7]]);
    L('#f6c6a0',[3-w,eave-1],[-1,peak+5]);R(shade,2-w,eave,w*2-3,2);R(ink,1-w,eave+2,w*2-1,1);};
  const window=(i,j,w=7,h=9)=>{R(ink,i,j,w,h);R('#b2e7e0',i+1,j+1,w-2,h-2);R('#fff8ec',i+1,j+1,1,h-2);R(dark,i+(w>>1),j+1,1,h-2);R(light,i-1,j+h,w+2,1);};
  const door=(i=-4,j=-14)=>{R(ink,i,j,9,17);R(wood,i+1,j+1,7,15);R(light,i+2,j+2,1,13);R('#ffe05a',i+6,j+9,1,2);R('#a9b7c5',i-2,1,13,2);R('#d4dce0',i-1,1,11,1);};
  const chimney=(i,j)=>{R(ink,i,j,6,18);R('#a43d43',i+1,j+2,4,15);R('#dcad86',i+1,j+5,2,1);R('#dcad86',i+3,j+10,2,1);R(cream,i-1,j,8,2);R(dark,i,j+2,6,1);};
  switch(kind){
    case 'home':
      chimney(10,-45);base();roof(22,-23,-48,'#eb6654','#a43d43');door();window(-14,-22,7,9);window(8,-22,7,9);
      for(const i of [-16,8]){R(dark,i,-2,10,3);R('#55aa62',i,-4,10,2);for(let j=0;j<3;j++){R('#eb6654',i+1+j*3,-5,2,2);R('#ffe05a',i+2+j*3,-5);}}break;
    case 'bakery':
      chimney(11,-48);base(38);roof(24,-23,-47,'#eb6654','#a43d43');door(7,-14);
      R(ink,-17,-16,22,14);R(dark,-16,-15,20,11);R('#fff8ec',-15,-14,18,2);R(light,-16,-5,20,3);R('#e8cd98',-15,-5,18,1);
      for(const [i,j] of [[-14,-9],[-8,-10],[-2,-9]]){R('#c98a45',i,j,5,3);R('#ffe0a0',i+1,j,3,1);R(cream,i+2,j-1,1,2);}
      R(ink,-20,-23,28,9);P('#eb6654',[[-18,-22],[5,-22],[7,-17],[-20,-17]]);
      for(let i=-16;i<6;i+=8)P('#fff8ec',[[i,-22],[i+4,-22],[i+5,-17],[i-1,-17]]);
      R('#fff8ec',-19,-17,26,2);for(let i=-19;i<7;i+=8)R('#eb6654',i,-17,4,3);R(dark,-20,-14,28,1);break;
    case 'mill':{
      base(34);roof(23,-23,-47,'#a66c46','#594437');R(dark,-16,-23,3,24);R(dark,1,-23,2,24);R(dark,14,-23,2,24);R(dark,-15,-12,30,2);window(-12,-22,9,10);door(5,-14);
      // Eight visible paddles and spokes make the river mill legible as a watermill.
      const cx=-23,cy=-9;for(let j=-12;j<=12;j++)for(let i=-12;i<=12;i++){
        const d=i*i+j*j;if(d>=81&&d<=144)R(d>121?ink:d<100?dark:light,cx+i,cy+j);}
      for(let i=0;i<8;i++){const a=i*Math.PI/4,dx=Math.round(Math.cos(a)*10),dy=Math.round(Math.sin(a)*10);
        L(dark,[cx,cy],[cx+dx,cy+dy]);L('#e8cd98',[cx+1,cy],[cx+dx+1,cy+dy]);
        R(ink,cx+dx-2,cy+dy-2,5,4);R(light,cx+dx-1,cy+dy-1,3,2);}
      R(ink,cx-2,cy-2,5,5);R('#e8cd98',cx-1,cy-1,3,3);R(wood,cx,cy);
      R(dark,17,-10,8,13);R('#e8cd98',18,-9,6,11);R(cream,19,-8,4,2);R(wood,19,-10,4,2);break;}
    case 'band':
      P(ink,[[-24,-4],[-20,-9],[20,-9],[25,-3],[22,3],[-21,3]]);P(wood,[[-22,-3],[-19,-7],[19,-7],[23,-3],[20,1],[-20,1]]);
      R(light,-21,-4,43,2);R('#e8cd98',-18,-7,37,1);R(dark,-20,0,41,2);R(wood,-13,2,26,2);R(light,-12,2,24,1);
      for(const i of [-19,18]){R(ink,i,-23,3,19);R(cream,i+1,-22,1,17);R(light,i,-7,3,2);}
      R(dark,-18,-8,36,1);R(ink,-5,-15,11,2);R(ink,0,-13,2,6);R('#a9b7c5',-4,-15,9,1);R(dark,-7,-7,15,1);
      R(ink,-2,-42,5,6);R('#ffe05a',-1,-41,3,5);roof(25,-23,-38,'#eb6654','#a43d43');break;
    case 'school':
      base();roof(22,-23,-39,'#409dc5','#306a9d');door();window(-14,-21);window(8,-21);
      R(ink,-6,-52,13,15);R(cream,-5,-51,11,12);R(dark,-3,-49,7,8);R('#ffe05a',-1,-48,3,5);R('#ffe05a',-2,-44,5,2);R(ink,0,-42,1,3);
      P(ink,[[-8,-52],[0,-57],[9,-52]]);P('#409dc5',[[-5,-53],[0,-55],[6,-53]]);R('#306a9d',-6,-52,13,1);
      R(dark,-22,-9,9,12);R('#2d664e',-21,-8,7,8);R('#fff8ec',-20,-7,5,1);R('#a1d970',-20,-4,3,1);break;
    case 'clinic':
      base(38);roof(25,-23,-46,'#55aa62','#2d664e');window(-16,-20);window(9,-20);door();
      R(ink,-6,-36,13,11);R('#fff8ec',-5,-35,11,9);R('#eb6654',-1,-34,3,7);R('#eb6654',-3,-32,7,3);
      R(ink,-23,-15,46,4);R('#2d664e',-22,-14,44,2);R('#a1d970',-21,-14,42,1);
      for(const i of [-21,19]){R(dark,i,-11,3,13);R(cream,i+1,-11,1,12);}R(light,-22,1,44,2);R('#e8cd98',-21,1,42,1);break;
  }
}
const BUILDING_ART={home:[48,54,24,50],bakery:[52,54,26,50],mill:[66,56,39,50],band:[54,50,27,44],school:[48,62,24,58],clinic:[54,52,27,48]};
for(const k of BUILD_ORDER){
  const [w,h,ax,ay]=BUILDING_ART[k],s=mk(w,h,x=>{x.translate(ax,ay);drawBuildingArt(x,k);});
  s.anchorX=ax;s.anchorY=ay;if(k==='bakery')s.smoke={x:ax+13,y:ay-49};SPR['b_'+k]=s;
  SPR['scaffold_'+k]=mk(w,h,x=>{x.translate(ax,ay);const R=(c,i,j,a,b)=>{x.fillStyle=c;x.fillRect(i,j,a,b);};
    const top=k==='school'?-51:k==='band'?-37:-42;
    for(const i of [-20,18]){R('#202840',i,top,3,3-top);R('#ce9560',i+1,top+1,1,1-top);}
    for(let j=top+3;j<-2;j+=13){R('#594437',-22,j,44,3);R('#ce9560',-21,j,42,1);}
    R('#202840',8,-28,6,30);R('#a66c46',9,-27,4,29);for(let j=-25;j<1;j+=5)R('#e8cd98',9,j,4,1);
  });
}
// materials and trainer items
SPR.m_wood=makeSprite(['.bbbbb.','bTtTtTb','bTbbbTb','bTtTtTb','.bbbbb.']);
SPR.m_stone=makeSprite(['..eee..','.eEeee.','eEeeEee','eeeEeee','.eeEee.']);
SPR.m_wool=makeSprite(['.nnnn.','nnnnnn','nnwnnn','nnnnnn','.nnnn.']);
SPR.m_clay=makeSprite(['.oooo.','oOooOo','oooooo','oOooOo','.OOOO.']);
SPR.pebble=makeSprite(['.ee.','eEee','.ee.']);
SPR.plank=makeSprite(['bbbbbbbb','bTtTtTtb','bbbbbbbb']);
SPR.snowball=makeSprite(['.www.','wwwww','wwewe','wwwww','.www.']);
SPR.node_wood=makeSprite(['.bbbbbb.','bTtTtTtb','bTbbbbTb','bTtTtTtb','.bbbbbb.','..BBBB..']);
SPR.node_stone=makeSprite(['..eeee..','.eEeeEe.','eeeEeeee','eEeeeEee','eeEeeeEe','.eeeeee.']);
SPR.node_clay=makeSprite(['..oooo..','.oOooOo.','oooOoooo','.oOooOo.','..oooo..']);
SPR.vsheep=SPR.sheep;
SPR.mailbox=makeSprite(['.rrrrr.','rrwwwrr','rrrrrrr','..bbb..','..bbb..','..bbb..']);
SPR.board=makeSprite(['bbbbbbbbbb','bttttttttb','btTtTtTttb','bttttttttb','bTtTtTtTtb','.b......b.','.b......b.']);
SPR.whistlePost=makeSprite(['..qq..','.qqqq.','..qq..','..bb..','..bb..','..bb..','.bbbb.']);
SPR.scarecrow=makeSprite(['..ttt..','.tkktt.','..ttt..','bbbbbbb','..bbb..','..bbb..','..b.b..']);
SPR.windmillBase=mk(40,64,x=>{const R=(c,i,j,w,h)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};R('#202840',6,22,28,42);R('#e8d8b0',8,24,24,40);for(let j=26;j<62;j+=6)R('#c8b890',8,j,24,1);R('#202840',16,44,8,20);R('#a66c46',17,45,6,19);R('#b2e7e0',17,32,6,6);R('#202840',2,14,36,10);R('#eb6654',4,15,32,8);R('#a43d43',4,21,32,2);R('#202840',17,8,6,8);});
// skill icons for the Village Tree
Object.assign(ICON,{
  carry:makeSprite(['..kkkk..','.kbbbbk.','kbTbbTbk','kbbbbbbk','.kkkkkk.','..y..y..','.yy..yy.']),
  whistle:makeSprite(['.kkkkk..','kqqqqqk.','kqqqqqqk','.kqqqqk.','..kkkk..','.....y..','....y...']),
  green:makeSprite(['..G..G..','.GlG.GlG','GGlGGGlG','.GGG.GGG','..uu.uu.','.u..u..u','u..u..u.']),
  master:makeSprite(['....kk....','...kbbk...','..kbTTbk..','.kkkkkkkk.','..kbbbbk..','..kbTTbk..','..kbbbbk..','...kkkk...'])});
SPR.snowSculpture=[makeSprite(['.www.','wwwww','wwwww']),makeSprite(['..ww..','.wwww.','wwwwww','wwwwww','.wwww.']),makeSprite(['...kk...','..wwww..','.wwwwww.','wwwwwwww','wwwwwwww','.wwwwww.','..wwww..'])];
SPR.pumpkin=makeSprite(['..G..','.ooo.','ooooo','ooOoo','.ooo.']);
SPR.kite=makeSprite(['..r..','.rrr.','rrrrr','.rrr.','..r..','..k..']);
