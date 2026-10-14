'use strict';
/* ---------------- world map ---------------- */
// F fence  H big fence  T tree  A apple tree  W water  h hay bale  R rock  C crate  L leaf pile
// b/B/D barn roof/wall/door  v/c/K coop roof/wall/door  s sign  u bush  . grass  , flowers
// d dirt  p worm patch  m mud  r reeds
const SCREENS=[[
 [ // coop (0,0)
  'FFFFFFFFFFFFFFFF',
  'F.vvvv.....T.,.T',
  'F.vvvv..,......T',
  'F.cKcc.........T',
  'F...d....,..u..T',
  'F.,.dddddddddddd',
  'F...d...,.......',
  'F.,.d.pp...pp..T',
  'F...d.pp.,.pp..T',
  'F,..d.....s..@.T',
  'FT..dddd...,..TT',
  'FTT....dd..TTTTT'],
 [ // barnyard (1,0)
  'FFFFFFFFFFFFFFFF',
  'TbbbbbbbT.hhhhhT',
  'TbbbbbbbT.h...hT',
  'TBBBDBBB.,h...hT',
  'T...d.....hhhhhT',
  '..,.d......,....',
  'dddddddddddddddd',
  'T.,....dd...,..T',
  'T......dd.VVVVuT',
  'T...,..dd.VVVV.T',
  'T.u....dd.....,T',
  'TTTTT..dd..TTTTT'],
 [ // orchard (2,0)
  'FFFFFFFFFFFFFFFF',
  'TjjjjjT..A..A.,F',
  'TjjjjjT.....C..F',
  'TJIOIJ..A...C..F',
  'T..d...mmm.,...F',
  '...d..,.mm.C...F',
  'dddddddd.......F',
  'T..A..Ad..A..C.F',
  'T.......d,.....F',
  'T.A..A..d...,..F',
  'T......RR......F',
  'TTTTTTT..TTTTTTF']],
[
 [ // pond (0,1)
  'FTTTTTT..TTTTTTT',
  'F.,....dd..,...T',
  'F..WWWWWWWWW...T',
  'F.WWWWWWWWWWW..T',
  'F.WW.WWWWW.WW..T',
  'F.WWWWWWWWWWW.dd',
  'F.WWWW.WWWWWW.dd',
  'F.WWWWWWWWWWWr..',
  'F..WWWWWWWWW.r.T',
  'F,.r..........RT',
  'F..,....,...,..T',
  'FFFFFFFFFFFFFFFF'],
 [ // field (1,1)
  'TTTTTTT..TTTTTTT',
  'T.,....dd....,.T',
  'T..u...dd..L...T',
  'T....,.dd......T',
  'T.L....dd...,..T',
  'dddddddddddddddd',
  'dd....,.......dd',
  'T..,.......u...T',
  'T.....,....L...T',
  'T.u.........,..T',
  'T..,...L.......T',
  'FFFFFFFFFFFFFFFF'],
 [ // big fence (2,1)
  'TTTTTTT..TTTTTTF',
  'T......dd..u...H',
  'T.,....dd..u...H',
  'T......dd..u.,.H',
  'T...,..dd..u.s.H',
  'dddddddddd.u...H',
  'dd........dddd.H',
  'T....,.....u...H',
  'T..L.......u.,.H',
  'T.....,....u...H',
  'T...,......u...H',
  'FFFFFFFFFFFFFFFF']],
[
 [ // inside the coop (0,2)
  '################',
  '################',
  '##i###i##i###i##',
  '##nn::::::::nn##',
  '##::::::::::::##',
  '##n::::::::::n##',
  '##::::::::::::##',
  '##::::oooo::::##',
  '##::::oooo::::##',
  '##::::::::::::##',
  '##::::::::::::##',
  '#######XX#######'],
 [ // inside the barn (1,2)
  '################',
  '################',
  '#i####i##i####i#',
  '#::::::::::::::#',
  '#::::::::::::::#',
  '#yyyyyyyyyyyyyy#',
  '#::::::::::::::#',
  '#SSS::::::::SSS#',
  '#:::S::::::S:::#',
  '#:::S::::::S:::#',
  '#::::::::::::::#',
  '#######XX#######'],
 [ // inside the farmhouse (2,2)
  '################',
  '################',
  '#i##i##ff##i#ii#',
  '#kkk________#e_#',
  '#___________#e_#',
  '#_tt________#__#',
  '#_tt___oooo____#',
  '#______oooo_#__#',
  '#P__________#P_#',
  '#_________Z_####',
  '#______________#',
  '#######XX#######']],
[
 [ // secret rabbit burrow (0,3)
  '%%%%%%%%%%%%%%%%',
  '%%%%%%%%%%%%%%%%',
  '%%%%--------%%%%',
  '%%%----------%%%',
  '%%------------%%',
  '%%------------%%',
  '%%------------%%',
  '%%------------%%',
  '%%%----------%%%',
  '%%%%--------%%%%',
  '%%%%%%----%%%%%%',
  '%%%%%%%XX%%%%%%%'],
 [ // secret farmhouse cellar (1,3)
  '&&&&&&&&&&&&&&&&',
  '&&&&&&&&&&&&&&&&',
  '&&&&&&;;;;&&&&&&',
  '&&&&&&;;;;&&&&&&',
  '&&&&&&&GG&&&&&&&',
  '&0;;;;;;;;;;;;0&',
  '&;;+;;;;;;;;+;;&',
  '&;;;;;0;;0;;;;;&',
  '&;;;;;;;;;;;;;;&',
  '&0;;;;;;;;;;;;0&',
  '&;;;;;;;;;;;;;;&',
  '&&&&&&&XX&&&&&&&'],
 [ // secret moonlit grove (2,3)
  'TTTTTTTTTTTTTTTT',
  'TTT..,....,..TTT',
  'TT.,...*..,...TT',
  'T..,.*....*..,.T',
  'T.....,.......,T',
  'T.WW...,...*...T',
  'T.WW.*......,..T',
  'T....,...*.....T',
  'TT..,.......,.TT',
  'TTT....,.....TTT',
  'TTTTTT.@..TTTTTT',
  'TTTTTTTTTTTTTTTT']],
/* ===== PART 2: BEYOND THE FARM ===== */
[
 [ // mountain trail (0,4)
  'NNNNNNNNNNNNNNNN',
  'NNgEggggggggEgNN',
  'NggggMMMggggggEN',
  'NgEgMgggMggEgggN',
  'NggggMMMgggggggN',
  'NgEggggggggggggg',
  'Nggggggggggggggg',
  'NNggEggggggEgggN',
  'NgggggggggggggNN',
  'NEgggggggggggEgN',
  'NNggggggggggNNNN',
  'NNNNNNNggNNNNNNN'],
 [ // snowy peak (1,4)
  'NNNNNNNNNNNNNNNN',
  'NgggEgggNNgggggN',
  'NgggggggzzgggEgN',
  'NgEgggggzzgggggN',
  'NgggggggzzggggNN',
  'ggggggggzzgggggN',
  'ggggggggzzgggggN',
  'NgggEgggzzggEggN',
  'NgggggggzzgggggN',
  'NNggggggzzgggNNN',
  'NNNgggggzzggNNNN',
  'NNNNNNNNNNNNNNNN'],
 [ // inside YOUR coop (2,4)
  '################',
  '################',
  '##i###i##i###i##',
  '##nn::::::::nn##',
  '##::::::::::::##',
  '##::::::::::::##',
  '##::::oooo::::##',
  '##::::oooo::::##',
  '##::::::::::::##',
  '##n::::::::::n##',
  '##::::::::::::##',
  '#######XX#######']],
[
 [ // forest edge (0,5)
  'TTTTTTT..TTTTTTT',
  'T.q..T.dd..q..TT',
  'Tvvv...dd....q.T',
  'TcKc.,.dd.,....T',
  'T.d..VV.d...T..T',
  'T.dddddddddddddd',
  'T.......d.,.....',
  'Tq....,.d..!!!.T',
  'T..T....d..!!!.T',
  'T.,..q..d..s...T',
  'TT..,...dd...TTT',
  'TTTTTTT..TTTTTTT'],
 [ // deep woods (1,5)
  'TTTTTTTTTTTTTTTT',
  'T..q.,...T..q..T',
  'T.T....,...T...T',
  'T...q..T....,..T',
  'T.,......q.....T',
  'dddddddddddddddd',
  '................',
  '..T......,....T.',
  'wwwwwwwxxwwwwwww',
  'wwwwwwwxxwwwwwww',
  'T..,.......q.,.T',
  'TTTTTTTTTTTTTTTT'],
 [ // city gate (2,5)
  'aaaaaaaaaaaaaaaa',
  'aaaaaaaaaaaaaaaa',
  'UQUUQUlllUQUUQUa',
  '=|=====[=====|aa',
  '==============aa',
  '==============aa',
  '==============aa',
  '=|====$$====|=aa',
  '======$$======aa',
  '=[==========[=aa',
  'aaaaaaa==aaaaaaa',
  'aaaaaaa==aaaaaaa']],
[
 [ // sandy shore (0,6)
  'TTTTTTT..TTTTTTT',
  '2~~2~~~~~~~~2~~2',
  '2~~~~~~~~~~~~~~2',
  '2~~~~2~~~~~~~~~2',
  '2~~~~~~~~~~~~~~2',
  '2~~~~~~~~~~~~~~~',
  '2~~~~~~~~~~~~~~~',
  '2~~~~~~~~~~~~~~2',
  'WWWWWWWWWWWWWWWW',
  'wwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwww'],
 [ // tide pools (1,6)
  'TTTTTTTTTTTTTTTT',
  '2~~~~~~2~~~~~~~2',
  '~~((~~~~~~((~~~2',
  '~(WW(~~~~(WW(~~2',
  '~~~~~~~~~~~~~~~2',
  '~~~~~~~~~~~~~333',
  '~~~~~~~~~~~~~333',
  '~~~~((~~~~~~~~~2',
  'WWWWWWWWWWWWWWW2',
  'wwwwwwwwwwwwwww2',
  'wwwwwwwwwwwwwww2',
  'wwwwwwwwwwwwwwww'],
 [ // market square (2,6)
  'aaaaaaa==aaaaaaa',
  'UUQUUU|==|UUQUUU',
  '================',
  '=lll===lll===lll',
  '=kkk===kkk===kkk',
  '================',
  '================',
  '==|=========|===',
  '=====[==[=======',
  '================',
  '================',
  'aaaaaaaaaaaaaaaa']]];
// part 2 legend: N cliff  g snow  E pine  M boulder  z chasm  w deep water  q oak  x broken dam  3 planks
// ~ sand  2 palm  ( beach rock  = cobblestone  a roof  U brick  Q lit window  l awning  | lamp  $ fountain  [ bench  ! coop site
const WALK=new Set(['0,0','1,0','2,0','0,1','1,1','2,1','0,4','1,4','0,5','1,5','2,5','0,6','1,6','2,6']);
// secrets legend: % cave wall  - cave floor  & stone wall  ; stone floor  + plate  G gate  0 barrel
// Z creaky floorboard  Y trapdoor  ^ burrow hole  * glowing mushrooms  @ fairy ring
const EXITS3=[{x:296,y:283},{x:680,y:555}];
const SECRET_NAMES=['BURROW','CELLAR','GROVE'];
// interior legend: # wall  i window  _ wood floor  : straw  n nest  o rug  X exit  y hay  S stall rail
// k counter  t table  e bed  f fireplace  P plant.  Farmhouse outside: j roof  J wall  I window  O door.  V garden
const DOORS={'3,3':{x:128,y:555},'20,3':{x:384,y:555},'35,3':{x:640,y:555}};
const EXITS=[{x:56,y:76},{x:328,y:76},{x:568,y:76}];
const ROOM_NAMES=['COOP','BARN','FARMHOUSE'];
const MAP=[];
for(let sy=0;sy<SCREENS.length;sy++)for(let r=0;r<12;r++){
  const row=SCREENS[sy].map(s=>s[r]).join('');
  if(row.length!==MW)console.warn('map row length',sy,r,row.length);
  MAP.push(row);
}
let tiles=MAP.map(r=>r.split(''));
function tileAt(c,r){if(c<0||r<0||c>=MW||r>=MH)return'F';return tiles[r][c];}
const SOLID=new Set('FHTAhRCLBbDcvKsu#iktenfyPSjJIO%&G0NEMqx2(UQal|$['.split(''));
const FLOORISH=new Set('_:XoP'.split(''));
function solidTile(ch,forPlayer=true){
  if(ch==='W')return !(forPlayer&&has('flutter'));
  if(ch==='w')return !(forPlayer&&has('swim'));
  if(ch==='z')return !(forPlayer&&has('glide'));
  return SOLID.has(ch);
}

const HIDDEN={'44,2':{id:'feather_crate',kind:'feather'},'44,3':{id:'seed_crate',kind:'seed'},
  '14,21':{id:'seed_rock',kind:'seed'},'23,22':{id:'feather_leaf',kind:'feather'},'35,20':{id:'seed_leaf',kind:'seed'}};
const SIGNS={'10,9':{name:'SIGN',text:'CHICKEN COOP - Home sweet home! (Press E to open your Growth Tree.)'},
  '45,16':{name:'SIGN',text:'THE BIG FENCE. No chicken has ever flown over it. Beyond it lies... THE WHOLE WIDE WORLD!'}};

function drawTile(ch,c,r,sx,sy,wf){
  const h=hash2(c,r);let img;
  switch(ch){
    case '.':img=TILE.grass[h%3];break;
    case ',':img=TILE.flower[h%2];break;
    case 'd':img=TILE.dirt;break;
    case 'p':img=TILE.patch;break;
    case 'm':img=TILE.mud;break;
    case 'r':img=TILE.reeds;break;
    case 'W':{ctx.drawImage(TILE.water[(wf+(c+r)%2)%2],sx,sy);ctx.fillStyle=PAL.c;
      if(tileAt(c,r-1)!=='W')ctx.fillRect(sx,sy,16,2);
      if(tileAt(c,r+1)!=='W'){ctx.fillRect(sx,sy+14,16,2);}
      if(tileAt(c-1,r)!=='W')ctx.fillRect(sx,sy,2,16);
      if(tileAt(c+1,r)!=='W')ctx.fillRect(sx+14,sy,2,16);
      return;}
    case 'F':{const v=(tileAt(c,r-1)==='F'||tileAt(c,r+1)==='F')&&tileAt(c-1,r)!=='F'&&tileAt(c+1,r)!=='F';img=v?TILE.fenceV:TILE.fenceH;break;}
    case 'H':img=TILE.tall;break;
    case 'T':img=TILE.tree;break;
    case 'A':img=G.picked[c+','+r]?TILE.tree:TILE.apple;break;
    case 'h':img=TILE.hay;break;
    case 'R':img=TILE.rock;break;
    case 'C':img=TILE.crate;break;
    case 'L':img=TILE.leaves;break;
    case 's':if(r>=48){ctx.drawImage(groundFor(c,r,h),sx,sy);img=TILE.signO;}else img=TILE.sign;break;
    case 'u':img=TILE.bush;break;
    case 'b':img=TILE.roof;break;
    case 'B':img=TILE.barn;break;
    case 'D':img=TILE.door;break;
    case 'v':img=(G.coop&&G.coop.lv>=4&&r>=48&&inSite(c,r))?TILE.goldroof:TILE.croof;break;
    case 'c':img=TILE.cwall;break;
    case 'K':img=TILE.cdoor;break;
    case 'j':img=TILE.hroof;break;
    case 'J':img=TILE.hwall;break;
    case 'I':img=TILE.hwin;break;
    case 'O':img=TILE.hdoor;break;
    case 'V':img=TILE.garden;break;
    case '#':img=FLOORISH.has(tileAt(c,r+1))||'ktenfyS'.includes(tileAt(c,r+1))?TILE.wface:TILE.wtop;break;
    case 'i':img=TILE.wwin;break;
    case '_':img=TILE.floor;break;
    case ':':img=TILE.straw;break;
    case 'n':img=TILE.nest;break;
    case 'X':img=(r>=36&&r<48)?(c<16?TILE.exitCave:TILE.exitStone):TILE.exit;break;
    case 'g':img=TILE.snow[h%2];break;
    case '~':img=TILE.sand[h%2];break;
    case '=':img=TILE.cobble;break;
    case 'N':img=TILE.cliff;break;
    case 'E':img=TILE.pine;break;
    case 'M':img=TILE.boulder;break;
    case 'q':img=G.picked[c+','+r]?TILE.tree:TILE.oak;break;
    case '2':img=TILE.palm;break;
    case '(':img=TILE.brock;break;
    case '3':img=TILE.planks;break;
    case 'x':img=TILE.dam[wf];break;
    case 'a':img=TILE.roofC;break;
    case 'U':img=TILE.brick;break;
    case 'Q':{ctx.drawImage(TILE.brickWin,sx,sy);if(nightAmt()>0.35){ctx.fillStyle='#ffd870';ctx.fillRect(sx+4,sy+4,3,3);ctx.fillRect(sx+8,sy+4,4,3);ctx.fillRect(sx+4,sy+8,3,4);ctx.fillRect(sx+8,sy+8,4,4);}return;}
    case 'l':img=TILE.awning;break;
    case '|':img=TILE.lamp;break;
    case '[':img=TILE.bench;break;
    case 'z':{ctx.drawImage(TILE.chasm,sx,sy);if(tileAt(c,r-1)!=='z'){ctx.fillStyle=PAL.E;ctx.fillRect(sx,sy,16,3);ctx.fillStyle='#e8f0f8';ctx.fillRect(sx,sy,16,1);}
      if(tileAt(c-1,r)!=='z'){ctx.fillStyle='#2a2238';ctx.fillRect(sx,sy,2,16);}if(tileAt(c+1,r)!=='z'){ctx.fillStyle='#2a2238';ctx.fillRect(sx+14,sy,2,16);}return;}
    case 'w':{ctx.drawImage(TILE.deep[(wf+(c+r)%2)%2],sx,sy);ctx.fillStyle='#6aa0e8';
      if(!'wx'.includes(tileAt(c,r-1)))ctx.fillRect(sx,sy,16,2);if(!'wx'.includes(tileAt(c-1,r)))ctx.fillRect(sx,sy,2,16);if(!'wx'.includes(tileAt(c+1,r)))ctx.fillRect(sx+14,sy,2,16);return;}
    case '$':{ctx.drawImage(TILE.cobble,sx,sy);ctx.fillStyle=PAL.k;ctx.fillRect(sx,sy,16,16);ctx.fillStyle=PAL.e;ctx.fillRect(sx,sy,16,16);
      ctx.fillStyle=PAL.u;const L=tileAt(c-1,r)!=='$',R=tileAt(c+1,r)!=='$',T=tileAt(c,r-1)!=='$',B=tileAt(c,r+1)!=='$';
      ctx.fillRect(sx+(L?3:0),sy+(T?3:0),16-(L?3:0)-(R?3:0),16-(T?3:0)-(B?3:0));ctx.fillStyle=PAL.c;const sp=Math.floor(tick/8)%3;
      if(!R&&!B){ctx.fillStyle=PAL.e;ctx.fillRect(sx+12,sy+12,4,4);ctx.fillStyle=PAL.c;ctx.fillRect(sx+13,sy+8-sp,2,4+sp);ctx.fillRect(sx+11+sp,sy+10,1,1);}
      else{ctx.fillRect(sx+4+((tick/10+c*5)%8|0),sy+6+(r%2)*4,3,1);}return;}
    case '!':{const h2=hash2(c,r);ctx.drawImage(groundFor(c,r,h2),sx,sy);ctx.fillStyle=PAL.T;
      if(tileAt(c,r-1)!=='!')ctx.fillRect(sx,sy+2,16,1);if(tileAt(c,r+1)!=='!')ctx.fillRect(sx,sy+13,16,1);
      if(tileAt(c-1,r)!=='!')ctx.fillRect(sx+2,sy,1,16);if(tileAt(c+1,r)!=='!')ctx.fillRect(sx+13,sy,1,16);
      ctx.fillStyle=PAL.B;if(tileAt(c-1,r)!=='!'&&tileAt(c,r-1)!=='!')ctx.fillRect(sx+1,sy,3,5);if(tileAt(c+1,r)!=='!'&&tileAt(c,r+1)!=='!')ctx.fillRect(sx+12,sy+11,3,5);return;}
    case '%':img='-X'.includes(tileAt(c,r+1))?TILE.caveFace:TILE.caveWall;break;
    case '-':img=TILE.caveFloor;break;
    case '&':img=';+0GX'.includes(tileAt(c,r+1))?TILE.stoneFace:TILE.stoneTop;break;
    case ';':img=TILE.stoneFloor;break;
    case '+':img=TILE.plate;break;
    case 'G':img=TILE.gate;break;
    case '0':img=TILE.barrel;break;
    case 'Z':img=TILE.crack;break;
    case 'Y':img=TILE.trap;break;
    case '^':img=TILE.hole;break;
    case '*':{ctx.drawImage(TILE.shroom,sx,sy);if(nightAmt()>0.3){const g=Math.floor(tick/20+c)%2;ctx.fillStyle=g?'#7ff0ff':'#b8fff4';
      [[4,9],[10,6],[11,12]].forEach(([i,j])=>ctx.fillRect(sx+i-1,sy+j-1,3,2));}return;}
    case '@':{ctx.drawImage(TILE.ring,sx,sy);if(nightAmt()>0.3){ctx.fillStyle=Math.floor(tick/12)%2?'#ff9cf0':'#d890ff';
      for(let a=0;a<8;a++){const i=Math.round(8+Math.cos(a*0.785+tick/40)*6),j=Math.round(8+Math.sin(a*0.785+tick/40)*5);ctx.fillRect(sx+i,sy+j,1,1);}}return;}
    case 'y':img=TILE.hayIn;break;
    case 'S':{const v=(tileAt(c,r-1)==='S'||tileAt(c,r+1)==='S')&&tileAt(c-1,r)!=='S'&&tileAt(c+1,r)!=='S';img=v?TILE.railV:TILE.railH;break;}
    case 'k':img=TILE.counter;break;
    case 't':img=TILE.table;break;
    case 'e':img=tileAt(c,r-1)==='e'?TILE.bedlow:TILE.bedtop;break;
    case 'P':img=TILE.plant;break;
    case 'o':{ctx.drawImage(TILE.rug,sx,sy);ctx.fillStyle=PAL.R;
      if(tileAt(c,r-1)!=='o')ctx.fillRect(sx,sy,16,2);if(tileAt(c,r+1)!=='o')ctx.fillRect(sx,sy+14,16,2);
      if(tileAt(c-1,r)!=='o')ctx.fillRect(sx,sy,2,16);if(tileAt(c+1,r)!=='o')ctx.fillRect(sx+14,sy,2,16);return;}
    case 'f':{ctx.drawImage(TILE.hearth,sx,sy);const fl=Math.floor(tick/6)%3;
      ctx.fillStyle=PAL.o;ctx.fillRect(sx+4,sy+10-fl,8,6+fl);ctx.fillStyle=PAL.y;ctx.fillRect(sx+6,sy+12-((fl+1)%3),4,4);
      ctx.fillStyle=PAL.w;ctx.fillRect(sx+7,sy+14,2,2);ctx.fillStyle=PAL.B;ctx.fillRect(sx+3,sy+15,10,1);return;}
    default:img=TILE.grass[0];
  }
  ctx.drawImage(img,sx,sy);
}

