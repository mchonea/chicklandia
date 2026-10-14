'use strict';
/* ---------------- sprites ---------------- */
const SPR={};
SPR.hen=makeSprite([
'......rr......','.....rrrr.....','....tttttt....','...tttttttt...','...tkttttkt...','...tttoottt...',
'....ttrrtt....','..ttttrrtttt..','.tttttttttttt.','.tTTwwwwwwTTt.','.tTTTwwwwTTTt.','.ttTTwwwwTTtt.',
'..ttttwwtttt..','...tttttttt...','.....o..o.....','....oo..oo....']);
SPR.cow=makeSprite([
'....n........n....','....nn......nn....','...wwwwwwwwwwww...','bbbwbbbwwwwwwwwbbb','.bbwbbbwwwwwwwwbb.',
'...wbkbwwwwwkww...','...wbbbwwwwwwww...','...wwwwwwwwwwww...','....pppppppppp....','....pPppppppPp....',
'....pppppppppp....','..wwwwwwwwwwwwww..','.wwbbbwwwwwwwbbww.','.wbbbbwwwwwwwwbbw.','.wwbbwwwwwwbbwwww.',
'.wwwwwwwwwwbbbwww.','..ww.ww....ww.ww..','..EE.EE....EE.EE..']);
SPR.pig=makeSprite([
'..pp........pp..','..pPpp....ppPp..','..pppppppppppp..','.pppppppppppppp.','.ppkppppppppkpp.',
'.ppppPPPPPPpppp.','.ppppPkPPkPpppp.','.ppppPPPPPPpppp.','.pppppppppppppp.','pppppppppppppppp',
'pppppppppppppppp','.pppppppppppppp.','..pppppppppppp..','..pp.pp..pp.pp..','..BB.BB..BB.BB..']);
SPR.duck=makeSprite([
'...uuuu........','..uuuuuuu......','..wkwwww.......','ooowwwww.......','oooowwww.......',
'...wwwww.......','....wwww.......','...wwwwwww...ww','..wwwwwwwwwwwww','..wwweeeeewwww.',
'..wwwweeeewwww.','...wwwwwwwwww..','....wwwwwwww...','.....oo..oo....']);
SPR.duckling=makeSprite(['..yyyy...','.yykyyy..','ooyyyyy..','..yyyyyy.','..yYYyyyy','..yyyyyy.','...o..o..']);
const SHEEP=['....nnnnnnnn....','..nnnnnnnnnnnn..','.nnnnEEEEEEnnnn.','EEnnEEEEEEEEnnEE','.EnnEwkEEkwEnnE.',
'.nnnEEEEEEEEnnn.','.nnnnEEppEEnnnn.','nnnnnnEEEEnnnnnn','nnnnnnnnnnnnnnnn','nnnnnnnnnnnnnnnn',
'.nnnnnnnnnnnnnn.','..nnnnnnnnnnnn..','...EE......EE...','...EE......EE...'];
SPR.sheep=makeSprite(SHEEP);
SPR.sheepBow=makeSprite(['....nnnrrnnn....',...SHEEP.slice(1)].map((r,i)=>i===1?'..nnnnnrrnnnnn..':r));
SPR.rooster=makeSprite([
'....r.r...........','...rrrrr......GG..','...qqqqq.....GGUG.','..qkqqqqq...GUGGG.','ooqqqqqqq..GGGUGG.',
'.ooqqqqqq..GUGGGG.','..rqqqqbb.GGGGUG..','..rr.qbbbbbGGGG...','.....bbffffbbGG...','....bbfffffbbb....',
'....bbbffffbbb....','.....bbbbbbbb.....','......bbbbbb......','.......o..o.......','......oo.oo.......']);
SPR.goose=makeSprite([
'..wwww..........','.kkkwww.........','.wwkwww.........','ooowwww.........','oooowww.........',
'...wwww.........','....www.........','....www.........','....wwww....ww..','...wwwwwwwwwwww.',
'..wwwweeeewwwww.','..wwwwweeeewwww.','...wwwwwwwwwww..','....wwwwwwwww...','.....o.....o....','....oo....oo....']);
SPR.fox=makeSprite([
'..f.f.............','..fff.............','.ffkf.............','kfffff............','.nnnff..........ff.',
'....fffffffffff.fff','....ffffffffffffffn','....nnfffffffff..nn','.....ff.ff.ff.ff...','.....kk.kk.kk.kk...']);
SPR.worm=[makeSprite(['..pp.','.pkp.','.pp..','..pp.','..pp.','.BBBB']),makeSprite(['.pp..','.pkp.','..pp.','..pp.','.pp..','BBBB.'])];
SPR.bell=makeSprite(['...BB...','..qqqq..','.qqqqqq.','.qqwqqq.','.qqqqqq.','qqqqqqqq','QQQQQQQQ','...kk...']);
SPR.apple=makeSprite(['...G...','..rBG..','.rrrrr.','rrwrrrr','rrrrrrr','.rrrrr.','..rRr..']);
SPR.feather=makeSprite(['......qq','.....qqQ','....qqQq','...qqQq.','..qqQq..','.qqQq...','.qQq....','Qq......']);
SPR.seed=makeSprite(['..bb..','.bnbb.','.bnbb.','bbnbbb','bbnbbb','.bnbb.','..bb..']);
SPR.heart=makeSprite(['.rr.rr.','rwrrrrr','rrrrrrr','.rrrrr.','..rrr..','...r...']);
SPR.heartE=makeSprite(['.EE.EE.','EEEEEEE','EEEEEEE','.EEEEE.','..EEE..','...E...']);
SPR.excl=makeSprite(['yy','yy','yy','yy','..','yy']);
SPR.pexcl=makeSprite(['pp','pp','pp','pp','..','pp']);
SPR.pques=makeSprite(['.ppp.','pp.pp','...pp','..pp.','..p..','.....','..p..']);
SPR.ques=makeSprite(['.lll.','ll.ll','...ll','..ll.','..l..','.....','..l..']);
SPR.horse=makeSprite([
'....bb....bb....','....bbbBBbbb....','....bbBBBBbb....','...bbbbwwbbbb...','...bkbbwwbbkb...','...bbbbwwbbbb...',
'....bbbwwbbb....','....bbbbbbbb....','....bTTTTTTb....','....TkTTTTkT....','....TTTTTTTT....','..bbbbbbbbbbbb..',
'.bbbbbbbbbbbbbb.','.bbbbbbbbbbbbbb.','.bbbbbbbbbbbbbb.','..bb.bb..bb.bb..','..bb.bb..bb.bb..','..kk.kk..kk.kk..']);
const MOUSE=['...pe.....','..eeee....','.ekeeeee..','peeeeeeee.','.eeeeeeeep','..e...e..p'];
SPR.mouse=makeSprite(MOUSE);
SPR.chef=makeSprite(['..www.....','.wwwww....','..www.....',...MOUSE]);
SPR.dog=makeSprite([
'.bb........bb.','bbbbttttttbbbb','bbbttttttttbbb','.bbtkttttktbb.','...tttttttt...','...ttnkkntt...','....tnppnt....',
'....rrrrrr....','..tttttttttt..','.tttttttttttt.','.ttttnnnnnttt.','.tttnnnnnnttt.','..tt.tt.tt.tt.','..TT.TT.TT.TT.']);
SPR.cat=makeSprite([
'.e........e.','.pe......ep.','.eeeeeeeeee.','eEeeeeeeeeEe','eelkeeeeklee','eeeeeppeeeee','.eeewwwweee.',
'..eeeeeeee..','.eeEeeeeEee.','.eeeEeeEeeee','.eeeeeeeeeee','..ww....ww..']);
SPR.carrot=makeSprite(['.G.G.','..GG.','.GGG.','.ooo.','..o..']);
SPR.bone=makeSprite(['ww....ww','wwwwwwww','ww....ww']);
SPR.yarn=makeSprite(['..rrrr..','.rRrrRr.','rrrRRrrr','rRrrrrRr','rrRrrRrr','.rrRRrr.','..rrrrr.','......rr']);
SPR.mound=makeSprite(['...bbbb...','.bbTbbbbb.','bbbbbbbBbb','BbBbbBbbbB']);
SPR.worm0=SPR.worm[0];
SPR.magpie=makeSprite([
'....kkk.......','...kkkkk......','..kkwkkk......','EEkkkkkk......','..kkpppkk.....','..kwwwwkkk..UU',
'.kwwwwwwUUkUU.','.kwwwwwkUUUU..','..kwwwkkkU....','...kkkkk......','....E..E......','...EE.EE......']);
SPR.rabbit=makeSprite([
'..ww....ww..','..wp....pw..','..wp....pw..','..wp....pw..','..wwwwwwww..','.wwwwwwwwww.','.wwkwwwwkww.',
'.wwwwppwwww.','.wpwwwwwwpw.','..wwwwwwww..','.wwwwwwwwww.','wwwwwwwwwwww','.wwwwwwwwww.','..ww....ww..']);
SPR.owl=makeSprite([
'.b........b.','.bb......bb.','.bbbbbbbbbb.','bbwwbbbbwwbb','bwkwbbbbwkwb','bbwwbqqbwwbb','.bbbbqqbbbb.',
'.bTTTTTTTTb.','bbTtTtTtTtbb','bbTTTTTTTTbb','.bTtTtTtTtb.','.bbTTTTTTbb.','..bb....bb..','..oo....oo..']);
SPR.chest=makeSprite(['.BBBBBBBBBBBB.','BbbbbbqqbbbbbB','BbbbbbqqbbbbbB','BBBBBBBBBBBBBB','BbbbbbqqbbbbbB','BbbbbbbbbbbbbB','BBBBBBBBBBBBBB']);
SPR.chestOpen=makeSprite(['.BBBBBBBBBBBB.','B............B','BqqqqqqqqqqqqB','BBBBBBBBBBBBBB','BbbbbbqqbbbbbB','BbbbbbbbbbbbbB','BBBBBBBBBBBBBB']);
SPR.block=mk(16,16,x=>{P_(x,'k',0,0,16,16);P_(x,'e',1,1,14,13);P_(x,'E',1,12,14,3);P_(x,'#d0d0dc',1,1,14,1);P_(x,'#d0d0dc',1,1,1,11);
  P_(x,'E',5,4,6,1);P_(x,'E',5,8,6,1);P_(x,'E',5,4,1,5);P_(x,'E',10,4,1,5);});
SPR.carrotG=makeSprite(['.G.G.','..GG.','.GGG.','.qqq.','..q..']);
SPR.egg=makeSprite(['.ww.','wwww','wwww','.ww.']);
SPR.goldEgg=makeSprite(['.qq.','qqqq','qQqq','.qq.']);
const OUTFIT_SPR={
  straw:makeSprite(['...tttt...','..tTTTTt..','..rrrrrr..','tttttttttt']),
  pirate:makeSprite(['....kk....','..kkkkkk..','.kkkwwkkk.','kkkkwwkkkk','qqqqqqqqqq']),
  crown:makeSprite(['q..q..q','qq.q.qq','qqqqqqq','qrqqqrq']),
  ears:makeSprite(['ww..ww','wp..pw','wp..pw','wp..pw','ww..ww']),
  bow:makeSprite(['pp.pp','pPPPp','pp.pp']),
  shadesF:makeSprite(['kkkkkkkk','.kk..kk.'],false),
  shadesS:makeSprite(['kkkk','.kk.'],false)
};
const ICO={
  sun:makeSprite(['...y...','.y.y.y.','..yyy..','yyyyyyy','..yyy..','.y.y.y.','...y...']),
  dusk:makeSprite(['...o...','.o.o.o.','..ooo..','ooooooo','..ooo..','.o.o.o.','...o...']),
  moon:makeSprite(['..nnn..','.nn....','nn.....','nn.....','nn.....','.nn....','..nnn..']),
  cloudy:makeSprite(['...ww...','.wwwww..','wwwwwwww','.wwwwww.']),
  rain:makeSprite(['...ww...','.wwwww..','wwwwwwww','.wwwwww.','.u..u..u','u..u..u.']),
  storm:makeSprite(['...ee...','.eeeee..','eeeeeeee','.eeeeee.','...qq...','..qq....','...q....'])
};
const ICON={
  down:makeSprite(['...yy.....','..yyyy.yy.','.yyyyyyyyy','yyyyyyyyyy','yywyyyyyyy','.yyyyyyyy.','..yyyyyy..','...y..y...']),
  quick:makeSprite(['......o...','ww....o...','......o...','www...o...','.....ooo..','ww..o.o.o.','...o..o..o']),
  peck:makeSprite(['yy........','yyyoo..q..','yyyoooo...','yyyoooooqq','yyyoooo...','yyyoo..q..','yy........']),
  hop:makeSprite(['..wwww....','.w....w...','w......w..','......www.','.......w..','..........','.yyyyyy...','.yQyQyy...','.yyyyyy...']),
  tough:makeSprite(['.eeeeeee.','eerr.rree','errrrrrre','errrrrrre','.errrrre.','..errre..','...eee...']),
  flutter:makeSprite(['y.......y','yy.....yy','.yyy.yyy.','..yyyyy..','...yyy...','.........','cc.cc.cc.','uuuuuuuuu']),
  flap:makeSprite(['..wwww....','.w....w...','......w...','wwwwww....','..........','wwwwwwww..','........w.','......ww..']),
  fly:makeSprite(['w..........w','ww........ww','yww......wwy','yyww.yy.wwyy','.yyyyyyyyyy.','..yyyyyyyy..','....oyyo....'])
};

/* part 2 characters & items */
SPR.tortoise=makeSprite(['......GGGG......','....GGlGGlGG....','...GlGGGGGGlG...','.tt.GGGlGGGGGG..','tktt.GGGGGlGGG..','tttt.BBBBBBBBB..','..ttttt..tt.tt..','...tt....tt.tt..']);
SPR.beaver=makeSprite(['..bb....bb..','.bbbbbbbbbb.','.bbkbbbbkbb.','.bbbbTTbbbb.','..bbTkkTbb..','..bbbwwbbb..','.bbbbwwbbbb.','bbbbTTTTbbbb','bbbTTTTTTbbb','.bbTTTTTTbb.','..bb....bb..','...BBBBBB...']);
SPR.deer=makeSprite(['..b.b...........','..bbb...........','.bbkb...........','Bbbbb...........','..bbbb..........','...bbbbbbbbbbb..','...bbnnbbbnbbbn.','...bbbbbbbbbbb..','....b.b....b.b..','....b.b....b.b..','....B.B....B.B..']);
SPR.fawn=makeSprite(['.b.b......','.bbb......','bkbb......','Bbbbbbbbb.','.bbnbnbnb.','..b.b..bb.','..B.B..BB.']);
SPR.marmot=makeSprite(['..bb..bb..','.bbbbbbbb.','.bkbbbbkb.','.bbbTTbbb.','..bTkkTb..','.bbbwwbbb.','bbbTTTTbbb','bbTTTTTTbb','.bTTTTTTb.','..bb..bb..']);
SPR.mokid=makeSprite(['b...b','bbbbb','bkbkb','bTkTb','bbbbb','.b.b.']);
SPR.eagle=makeSprite(['....wwww....','...wwwwww...','...wkwwkw...','....wqqw....','.....qq.....','..BBBBBBBB..','.BBBbbbbBBB.','BBBbbbbbbBBB','BB.bbbbbb.BB','B..bbbbbb..B','...bbbbbb...','....q..q....','...qq..qq...']);
SPR.pigeon=makeSprite(['..UUU......','..eeee.....','..ekeeU....','EEeeeUU....','...eUUeeee.','...eeeeeeeE','....eeweeEE','.....eeeeE.','......o.o..','......oo.oo']);
SPR.raccoon=makeSprite(['.ee......ee.','.eeeeeeeeee.','eekkeeeekkee','ekwkeeeekwke','eekkeeeekkee','.eeeewweeee.','..eeekkeee..','.eeeeeeeeee.','eeeeEEEEeeee','.eeeeeeeeee.','..ee....ee..']);
SPR.crab=makeSprite(['....kkkk....','...kkwkkk...','rr.kkkkkk.rr','rRr.k..k.rRr','.rr.w..w.rr.','..rrkrrkrr..','.rrrrrrrrrr.','rrrrrrrrrrrr','.r.r.rr.r.r.']);
SPR.gull=makeSprite(['...www.....','..wwwww....','..wkwwrr...','oooww......','...wwwww...','...weeeeeww','....eeeeewe','....wwwww..','.....o.o...']);
SPR.turtle=makeSprite(['..GG..','.GlGG.','tGGGGt','.GGGG.','t....t']);
SPR.catO=makeSprite(['.f........f.','.pf......fp.','.ffffffffff.','fBffffffffBf','fflkffffklff','fffffppfffff','.fffwwwwfff.','..ffffffff..','.ffBffffBff.','.fffBffBffff','.fffffffffff','..ww....ww..']);
SPR.horseshoe=makeSprite(['eeeee','e...e','e...e','E...E']);
SPR.ring=makeSprite(['.rwr.','w...w','r...r','w...w','.rwr.']);
SPR.puff=makeSprite(['.w.w.','wwwww','.www.','..G..','..G..']);
SPR.stump=makeSprite(['.bbbbbb.','bTtTtTTb','bbtTTtbb','bbbbbbbb','BbBbbBbB']);
SPR.stick=makeSprite(['B.....','.bB...','..bB.b','...bBb','....bB']);
SPR.acorn=makeSprite(['.BB.','BBBB','tttt','.tt.']);
SPR.shell=makeSprite(['..p..','.pPp.','pPpPp','pppPp','.ppp.']);
SPR.eagleEgg=makeSprite(['.nn.','nTnn','nnTn','nnnn','.nn.']);
SPR.berryBush=makeSprite(['..GGG.GG..','.GGwGGGwG.','GwGGGwGGGG','GGGGwGGGwG','.GwGGGGwG.','..GGGGGG..']);
SPR.plant=[makeSprite(['l.l','.G.','.G.']),makeSprite(['.lGl.','lGGGl','..G..','.lG..','..G..']),
  makeSprite(['.yyy.','yBbBy','yBBBy','.yyy.','..G..','.lG..','..Gl.','..G..'])];
Object.assign(ICON,{
  swim:makeSprite(['...yy....','..ykyy...','..yyyyoo.','...yy....','.........','cc.cc.cc.','uuuuuuuuu','uuuuuuuuu']),
  glide:makeSprite(['y.........y','yyy.....yyy','.yyyy.yyyy.','...yyyyy...','....yyy....','...........','.kkkkkkkkk.']),
  super:makeSprite(['q...q...q.','.q..o..q..','...ooo....','qqoooooqq.','...ooo....','.q..o..q..','q...q...q.']),
  golden:makeSprite(['q..........q','qq........qq','yqq......qqy','yyqq.yy.qqyy','.yyyyyyyyyy.','..yyyyyyyy..','....oyyo....'])
});
/* procedural chick: grows with each stage */
const chickCache=new Map();
function chickSprite(stage,dir,frame,flap,gold=false){
  const WC=gold?'q':'Y',key=stage+'|'+dir+'|'+frame+'|'+flap+'|'+gold;let s=chickCache.get(key);if(s)return s;
  const side=dir===2,S=12+stage*2,Wd=S+(flap?10:0),Hd=S+1;
  const g=[...Array(Hd)].map(()=>Array(Wd).fill('.'));
  const put=(x,y,c)=>{x=Math.floor(x);y=Math.floor(y);if(x>=0&&y>=0&&x<Wd&&y<Hd)g[y][x]=c;};
  const ell=(cx,cy,rx,ry,c)=>{for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1)g[y][x]=c;}};
  const cx=Wd/2,foot=Hd-1,ry=S*0.27,rx=S*0.36,by=foot-ry-0.3,hr=S*(0.30-stage*0.014);
  let hx=cx,hy=by-ry*0.55-hr*0.6;if(side)hx=cx-S*0.12;
  if(!flap){
    if(side){const a=frame?1:0;put(cx-1-a,foot,'o');put(cx+1+a-1,foot,'o');}
    else if(frame){put(cx-3,foot,'o');put(cx+2,foot,'o');}else{put(cx-2,foot,'o');put(cx+1,foot,'o');}
  }
  if(flap){const wy=by-ry*0.4+(frame?-2.5:1.5);
    ell(cx-rx-2.6,wy,4.4,2.3,WC);ell(Wd-(cx-rx-2.6),wy,4.4,2.3,WC);
    if(gold){ell(cx-rx-3.4,wy-0.7,2.2,0.8,'n');ell(Wd-(cx-rx-3.4),wy-0.7,2.2,0.8,'n');put(cx-rx-6.6,wy,'w');put(Wd-1-Math.floor(cx-rx-6.6),wy,'w');put(cx-rx-5.6,wy+1,'Q');put(Wd-1-Math.floor(cx-rx-5.6),wy+1,'Q');}
    if(stage>=3){put(cx-rx-6,wy,'w');put(Wd-1-Math.floor(cx-rx-6),wy,'w');}}
  const BC=stage>=6?'w':'y';
  ell(cx+(side?S*0.06:0),by,rx,ry,BC);
  if(stage===5){for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++)if(g[y][x]==='y'&&(x*3+y*5)%7<3&&y>by-ry*0.4)g[y][x]='w';}
  if(side&&!flap){ell(cx+S*0.14,by+0.3,rx*0.5,ry*0.6,gold?'Q':'Y');if(gold)put(cx+S*0.14-1,by+ry*0.5,'w');}
  if(!side&&!flap){ell(cx-rx+1.3,by+0.5,1.6,ry*0.62,gold?'Q':'Y');ell(Wd-(cx-rx+1.3),by+0.5,1.6,ry*0.62,gold?'Q':'Y');
    if(gold){put(cx-rx+0.5,by-ry*0.4,'w');put(Wd-1-Math.floor(cx-rx+0.5),by-ry*0.4,'w');}}
  if(side){put(cx+rx+S*0.06-0.5,by-ry*0.5,'Y');put(cx+rx+S*0.06+0.5,by-ry*0.8,'Y');}
  ell(hx,hy,hr,hr*0.95,BC);
  if(stage===5){for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++)if(g[y][x]==='y'&&y<hy&&(x*5+y*3)%9<2)g[y][x]='w';}
  if(stage>=2){const t=Math.floor(hy-hr);put(hx-1,t,'r');put(hx,t,'r');put(hx,t-1,'r');if(stage>=3){put(hx+1,t,'r');put(hx-1,t-1,'r');}
    if(stage>=4){put(hx+1,t-1,'r');put(hx,t-2,'r');put(hx-2,t,'r');}if(stage>=6){put(hx-1,t-2,'r');put(hx+1,t-2,'r');put(hx,t-3,'r');}}
  if(stage>=6&&dir===0){const wy=Math.floor(hy+hr*0.4)+1;put(Wd/2-1,wy,'r');put(Wd/2,wy,'r');put(Wd/2-1,wy+1,'R');put(Wd/2,wy+1,'R');}
  if(stage>=6&&side){const tx=cx+rx+S*0.06;for(let k=0;k<4;k++){put(tx+k*0.9,by-ry*0.4-k*1.1,k%2?'q':'Y');put(tx+k*0.9+0.9,by-ry*0.4-k*1.1+0.9,'q');}}
  if(stage>=5&&!flap&&!side){ell(cx-rx+1.3,by+0.5,1.6,ry*0.62,gold?'Q':stage>=6?'q':'Y');ell(Wd-(cx-rx+1.3),by+0.5,1.6,ry*0.62,gold?'Q':stage>=6?'q':'Y');}
  if(dir===0){const xl=Math.floor(hx-hr*0.45),xr=Wd-1-xl,ey=Math.floor(hy);put(xl,ey,'k');put(xr,ey,'k');
    const by2=Math.floor(hy+hr*0.4);put(Wd/2-1,by2,'o');put(Wd/2,by2,'o');
    if(stage<2){put(xl-1,by2,'p');put(xr+1,by2,'p');}}
  else if(side){put(hx-hr*0.35,hy,'k');const byk=Math.floor(hy+hr*0.25);put(Math.floor(hx-hr)-1,byk,'o');put(Math.floor(hx-hr),byk,'o');
    if(stage<2)put(hx-hr*0.1,byk+1,'p');}
  s=makeSprite(g.map(r=>r.join('')));s.head={x:hx+1,y:hy+1,r:hr,top:hy-hr+1};s.S=S;chickCache.set(key,s);return s;
}
function getChick(stage,dir,frame,flap){const g=has('golden');return dir===3?flipOf(chickSprite(stage,2,frame,flap,g)):chickSprite(stage,dir,frame,flap,g);}
function decorate(base,fn){return mk(base.width,base.height,x=>{x.drawImage(base,0,0);fn(x);});}
SPR.penny=decorate(chickSprite(2,0,0,false),x=>{P_(x,'k',10,1,7,5);P_(x,'p',11,2,2,3);P_(x,'p',14,2,2,3);P_(x,'P',13,3,1,1);});
SPR.peep=decorate(chickSprite(0,0,0,false),x=>{P_(x,'k',6,0,3,2);P_(x,'Y',7,0,1,1);P_(x,'Y',7,1,1,1);});
SPR.cheep=decorate(chickSprite(0,0,0,false),x=>{P_(x,'k',8,0,6,4);P_(x,'u',9,1,2,2);P_(x,'u',12,1,1,2);P_(x,'U',11,2,1,1);});
SPR.tweet=decorate(chickSprite(0,0,0,false),x=>{P_(x,'k',4,0,7,3);P_(x,'l',5,1,5,1);P_(x,'G',7,0,1,1);});

