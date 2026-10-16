'use strict';
/* ---------------- Pirate Seas sprites ---------------- */
SPR.parrot=makeSprite(['..rr....','.rrrrr..','.rkwrr..','oorrrr..','..rrGG..','..rGGG..','...GUU..','...U.U..','...oo...']);
SPR.seaturtle=makeSprite(['.......GG.......','.....GGllGG.....','...GGlGGGGlGG...','..GlGGGGGGGGlG..','.GGGGlGGGGlGGGG.','tGGGlGGGGGGlGGGt','kktGGGGGGGGGGtt.','tktt.GGGGGG.tt..','.tt..tt..tt.tt..']);
SPR.octopus=makeSprite(['...pppp...','..pppppp..','.ppwkppwkp','.pppppppp.','..pppPpp..','.pp.pp.pp.','pp..pp..pp','p..p..p..p']);
SPR.salamander=makeSprite(['..oo..oo..','.oooooooo.','oowkoookwo','.oooooooo.','..oYYYYo..','.ooYYYYoo.','.oo.oo.oo.','oo.......o','o....ffff.']);
SPR.gullkeeper=decorate(SPR.gull,x=>{P_(x,'#2a3a6a',2,0,5,2);P_(x,'#ffd21e',4,0,1,1);});
SPR.gullp=makeSprite(['...www.....','..wwwww....','..wkwwrr...','oooww......','...wwwww...','...wwwwwww.','....eeeeew.','.....e..e..','...rrrr....']);
SPR.squawk=mk(40,36,x=>{const R=(c,i,j,w,h)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};
  R('#202840',8,6,24,22);R('#fff8ec',10,8,20,18);R('#e8e8f0',12,20,16,6);R('#202840',4,14,8,10);R('#ec6c24',2,15,5,4);
  R('#202840',10,0,20,8);R('#eb6654',11,1,18,5);R('#ffd21e',18,2,4,3);R('#202840',12,12,5,5);R('#202840',23,12,5,5);R('#fff8ec',13,13,2,2);R('#fff8ec',24,13,2,2);R('#202840',14,13,1,2);R('#202840',25,13,1,2);
  R('#eb6654',26,16,12,3);R('#202840',30,22,8,6);R('#ec6c24',31,24,6,3);R('#202840',14,28,4,6);R('#ec6c24',14,32,6,2);R('#202840',22,28,4,6);R('#ec6c24',22,32,6,2);
  R('#202840',12,24,16,2);R('#7896ae',14,25,12,1);});
SPR.jelly=makeSprite(['..pppp..','.pppppp.','pwpppwpp','pppppppp','.p.pp.p.','p..p..p.','.p.p.p..']);
SPR.spark=makeSprite(['..y..','.yoy.','yoooy','.yoy.','..y..']);
// salvage and finds
SPR.sailcloth=makeSprite(['wwwwww.','wnwwnww','wwnwwnw','wwwwwww','.wwwww.','..wwww.']);
SPR.hullplank=makeSprite(['bbbbbbbb','bTbTbTbb','bbbbbbbb','BBBBBBBB']);
SPR.cannonpart=makeSprite(['..eeee..','.eEEEEe.','eEeeeeEe','eEeeeeEe','.eEEEEe.','..eeee..']);
SPR.pearl=makeSprite(['.ww.','wwcw','wwww','.ww.']);
SPR.wreckbell=makeSprite(['..qq..','.qqqq.','qqQQqq','qQqqQq','qqqqqq','.qqqq.','..kk..']);
SPR.conch=makeSprite(['..pp..','.pPpp.','pPpPpp','pppPp.','.ppp..']);
SPR.crate=makeSprite(['kkkkkkkk','kbbTbbbk','kbTbbTbk','kTbbbbTk','kbbTbbbk','kkkkkkkk']);
SPR.sunstone=makeSprite(['..oo..','.oyyo.','oyyyyo','.oyyo.','..oo..']);
SPR.ironore=makeSprite(['.eeee.','eEeeEe','eeEeee','.eEee.']);
SPR.powderkeg=makeSprite(['.bbbbb.','bTtTtTb','bBBBBBb','bTtTtTb','.bbbbb.']);
SPR.brazier=makeSprite(['..oo..','.oyyo.','..yy..','.kkkk.','..kk..','.kkkk.']);
SPR.brazierLit=makeSprite(['.oyyo.','oyyyyo','.yyyy.','.kkkk.','..kk..','.kkkk.']);
SPR.xmark=makeSprite(['r...r','.r.r.','..r..','.r.r.','r...r']);
SPR.chestSea=makeSprite(['.BBBBBBBBB.','BqqqqqqqqqB','BqQQQQQQQqB','BBBBBBBBBBB','BqqqkkqqqqB','BBBBBBBBBBB']);
SPR.barrel=makeSprite(['.bbbbb.','bTtTtTb','bbbbbbb','bTtTtTb','.bbbbb.']);
SPR.bubble=makeSprite(['.cc.','c..c','c..c','.cc.']);
SPR.cannonball=makeSprite(['.kk.','kEEk','kEEk','.kk.']);
// ship for the sail map and docks
SPR.shipIcon=mk(38,34,x=>x.drawImage(coastalShipSprite(),0,0,38,34));
// Sea Tree icons
Object.assign(ICON,{
  dive:makeSprite(['..cc....','.cwwc...','.cw.cc..','..cccuu.','.uuuuuuu','uuuuuuuu','.uuUUuu.','..uuuu..']),
  dash:makeSprite(['....yy..','...yyy..','..yyyy.y','.yyyyyyy','..yyyy.y','...yyy..','....yy..']),
  cannon:makeSprite(['..kkkk..','.kEEEEk.','kEeeeeEk','kEe..eEk','kEeeeeEk','.kEEEEk.','..kyyk..','...yy...']),
  sealegs:makeSprite(['..bb.bb.','.bbbbbbb','bbTbbbTb','.bbbbbb.','..uuuu..','.uuuuuu.','.u.uu.u.','u..uu..u'])});
// Cannon Peck icon (the Sea Tree page needs one for every skill, or the screen cannot draw)
Object.assign(ICON,{cpeck:makeSprite(['.....yy.','..oo.yqy','.oqqyyqy','oqqqyyyy','.oqqyyqy','..oo.yqy','.....yy.'])});
