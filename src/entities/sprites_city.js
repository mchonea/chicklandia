'use strict';
/* ---------------- city sprites: new residents, collectibles, shop goods ---------------- */
SPR.goat=makeSprite(['.T......T.','.TT....TT.','..wwwwww..','.wwkwwkww.','.wwwwwwww.','..wwppww..','...wwww...','...wBBw...','..wwwwww..','.wwwwwwww.','.wwwwwwww.','.wwwwwwww.','..ww..ww..','..TT..TT..']);
SPR.badger=makeSprite(['..www.....','.wwwww....','...kkkk...','..kwkkwk..','.kwwkkwwk.','.kwkkkkwk.','..kkppkk..','..eeeeee..','.eewwwwee.','.eewwwwee.','.eeeeeeee.','..ee..ee..','..kk..kk..']);
SPR.ferret=makeSprite(['..tt..tt..','.tTTttTTt.','.tkTttTkt.','.tttnnttt.','..ttppntt.','...tttt...','..tTttTt..','.ttTttTtt.','.ttttttttt','..tt..tt..','..TT..TT..']);
SPR.peacock=makeSprite(['....uu.......','...uUuU..G.G.','..uuuuuu.GUUG','..ukuuuuGUGUG','.ouuuuuuGGUGG','...uuuuu.GUGG','..uUuuuUuGGG.','.uuuuuuuuG...','.uuuuuuuu....','..uu..uu.....','..oo..oo.....']);
SPR.owlGlasses=decorate(SPR.owl,x=>{P_(x,'k',2,4,4,1);P_(x,'k',7,4,4,1);P_(x,'k',5,4,2,1);});
SPR.curator=decorate(SPR.tortoise,x=>{P_(x,'q',8,3,1,1);P_(x,'k',8,2,3,1);P_(x,'k',8,4,3,1);});
// things Rocco "borrowed"
SPR.hat=makeSprite(['..UUUU..','.UUUUUU.','UUUUUUUU','kkkkkkkk']);
SPR.whisk=makeSprite(['.e.e.e.','.e.e.e.','..eee..','...b...','...b...']);
SPR.collarBell=makeSprite(['..q..','.qqq.','qqkqq','qqqqq','..k..']);
// cook-off ingredients
SPR.pepper=makeSprite(['...G...','..rrr..','.rrRrr.','.rrrrr.','..rrr..']);
SPR.salt=makeSprite(['..ww..','.wwww.','.wcww.','wwwwww','.eeee.']);
SPR.mushroom=makeSprite(['..rrr..','.rwrwr.','rrrrrrr','..nnn..','..nnn..']);
// museum finds
SPR.plume=makeSprite(['....cc','...cuC','..cuCc','.cuCc.','cuCc..','Cc....']);
SPR.fossil=makeSprite(['.ee.ee.','eeEeeEe','.eeEee.','..eEe..','.eE.Ee.','eE...Ee']);
SPR.petal=makeSprite(['.ppp.','pPPpp','pPppP','.ppp.','..p..']);
SPR.seashell=makeSprite(['..c...','.cwc..','cwcwc.','cccwcc','.cccc.']);
// shop goods
SPR.muffin=makeSprite(['.yyyy.','yYyyYy','yyyyyy','.bbbb.','.bBBb.']);
SPR.sbun=makeSprite(['.tttt.','tTtttT','tttttt','ttnntt','.tttt.']);
SPR.tart=makeSprite(['.rrrr.','rRrrRr','rrrrrr','.tttt.','.TTTT.']);
SPR.sprout=makeSprite(['..l.l.','.lGlG.','..GG..','.bbbb.','.bBBb.']);
SPR.giant=makeSprite(['.yyyyy.','yYYYYYy','yYBBBYy','yYBBBYy','.yYYYy.','...G...','..lG...']);
SPR.moonSeed=makeSprite(['..uuu.','.uUwuu','uuUuuu','.uuuu.','..uu..']);
SPR.token=makeSprite(['.qqqq.','qQqqQq','qqkkqq','qQqqQq','.qqqq.']);
SPR.parcel=makeSprite(['tttttt','tTTTTt','tTrrTt','tTTTTt','tttttt']);
SPR.star=makeSprite(['..y..','..y..','yyyyy','.yyy.','yy.yy']);
SPR.vane=makeSprite(['..k...','.kkk..','kkkkk.','..b...','..b...','..b...','.bbb..']);
SPR.vaneFixed=makeSprite(['..k.kk','.kkkkkk','kkkkkkk','..b..k.','..b....','..b....','.bbb...']);
SPR.easel=makeSprite(['.bbbbbbb.','bwwwwwwwb','bwwwwwwwb','bwwwwwwwb','bwwwwwwwb','.b.....b.','.b.....b.','bb.....bb']);
SPR.flag=makeSprite(['kkkkkk','krkwwk','kwkrwk','krkwrk','k.....','k.....','k.....','k.....']);
SPR.book=makeSprite(['.rrrrr','rwwwwr','rwkkwr','rwwwwr','.rrrrr']);
SPR.sunbeam=null;
