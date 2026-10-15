'use strict';
/* ---------------- village sprites: buildings (drawn in code), materials, skill icons, props ---------------- */
// each builder draws a 32x30 building into context x. pal = colors.
function drawBuildingArt(x,kind,t){
  const R=(c,i,j,w,h)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};
  const body=(wall,roof,rdark)=>{R('#21142b',2,12,28,18);R(wall,3,13,26,16);R('#21142b',0,3,32,11);R(roof,1,4,30,9);for(let i=2;i<30;i+=4)R(rdark,i,6,2,1);R(rdark,1,12,30,1);R('#21142b',13,19,6,11);R('#9a6234',14,20,4,10);R('#ffd21e',17,25,1,1);};
  switch(kind){
    case 'home':body('#f6ead0','#e03838','#962430');R('#a6e0ff',5,17,5,5);R('#a6e0ff',22,17,5,5);R('#21142b',7,17,1,5);R('#21142b',24,17,1,5);R('#21142b',22,0,5,6);R('#962430',23,1,3,4);break;
    case 'bakery':body('#f2dca0','#e8a422','#c98a00');R('#a6e0ff',5,17,6,5);R('#e03838',4,15,8,2);R('#fff8ec',6,15,2,2);R('#21142b',23,-2,5,8);R('#6a5a90',24,-1,3,6);if(t!==undefined){R('rgba(255,255,255,0.7)',24+((t/6)%3|0),-5-((t/10)%4|0),3,3);}break;
    case 'mill':body('#d8c8a0','#9a6234','#5e3a1c');R('#21142b',-1,16,6,14);R('#3a86e8',0,17,4,12);R('#a6e0ff',1,19,1,8);R('#21142b',24,2,2,12);R('#fff8ec',25,3,1,11);R('#a6e0ff',6,17,5,5);break;
    case 'band':R('#21142b',1,14,30,16);R('#9a6234',2,22,28,7);R('#c49a5c',2,22,28,1);R('#21142b',1,2,30,13);R('#ff6fae',2,3,28,11);for(let i=3;i<30;i+=4)R('#ffd83a',i,3,2,11);R('#21142b',3,14,2,9);R('#21142b',27,14,2,9);R('#fff8ec',14,18,4,4);R('#21142b',15,18,2,3);break;
    case 'school':body('#f4c0a0','#3a86e8','#1f55a8');R('#a6e0ff',5,17,5,5);R('#a6e0ff',22,17,5,5);R('#21142b',13,-3,6,8);R('#ffd21e',14,-2,4,6);R('#21142b',15,3,2,2);R('#fff8ec',14,13,4,2);break;
    case 'clinic':body('#fff8ec','#94dc64','#2f7d3a');R('#e03838',14,15,4,1);R('#e03838',15,14,2,3);R('#a6e0ff',5,17,5,5);R('#a6e0ff',22,17,5,5);R('#21142b',6,17,3,1);break;
  }
}
for(const k of BUILD_ORDER)SPR['b_'+k]=mk(32,34,x=>{x.translate(0,4);drawBuildingArt(x,k);});
SPR.scaffold=mk(32,34,x=>{x.fillStyle='#21142b';x.fillRect(2,10,3,24);x.fillRect(27,10,3,24);x.fillRect(2,10,28,3);x.fillRect(2,22,28,3);x.fillStyle='#c49a5c';x.fillRect(3,11,1,22);x.fillRect(28,11,1,22);x.fillRect(3,11,26,1);x.fillRect(3,23,26,1);x.fillStyle='#9a6234';x.fillRect(8,26,6,3);x.fillRect(18,14,6,3);});
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
SPR.windmillBase=mk(40,64,x=>{const R=(c,i,j,w,h)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};R('#21142b',6,22,28,42);R('#e8d8b0',8,24,24,40);for(let j=26;j<62;j+=6)R('#c8b890',8,j,24,1);R('#21142b',16,44,8,20);R('#9a6234',17,45,6,19);R('#a6e0ff',17,32,6,6);R('#21142b',2,14,36,10);R('#e03838',4,15,32,8);R('#962430',4,21,32,2);R('#21142b',17,8,6,8);});
// skill icons for the Village Tree
Object.assign(ICON,{
  carry:makeSprite(['..kkkk..','.kbbbbk.','kbTbbTbk','kbbbbbbk','.kkkkkk.','..y..y..','.yy..yy.']),
  whistle:makeSprite(['.kkkkk..','kqqqqqk.','kqqqqqqk','.kqqqqk.','..kkkk..','.....y..','....y...']),
  green:makeSprite(['..G..G..','.GlG.GlG','GGlGGGlG','.GGG.GGG','..uu.uu.','.u..u..u','u..u..u.']),
  master:makeSprite(['....kk....','...kbbk...','..kbTTbk..','.kkkkkkkk.','..kbbbbk..','..kbTTbk..','..kbbbbk..','...kkkk...'])});
SPR.snowSculpture=[makeSprite(['.www.','wwwww','wwwww']),makeSprite(['..ww..','.wwww.','wwwwww','wwwwww','.wwww.']),makeSprite(['...kk...','..wwww..','.wwwwww.','wwwwwwww','wwwwwwww','.wwwwww.','..wwww..'])];
SPR.pumpkin=makeSprite(['..G..','.ooo.','ooooo','ooOoo','.ooo.']);
SPR.kite=makeSprite(['..r..','.rrr.','rrrrr','.rrr.','..r..','..k..']);
