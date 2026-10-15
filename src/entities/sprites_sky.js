'use strict';
/* ---------------- Sky Kingdom sprites ---------------- */
SPR.cloudsheep=makeSprite(['....cccccc....','..cccwwwwccc..','.ccwwwwwwwwcc.','ccwwwwwwwwwwcc','.cwwkwwwwkwwc.','.cwwwwppwwwwc.','ccwwwwwwwwwwcc','.cwwwwwwwwwwc.','..ccwwwwwwcc..','...cc....cc...']);
SPR.fernbird=makeSprite(['..GGG....','.GllGG...','.GlkGGoo.','..GGGG...','..GllGG..','.GGGlGGG.','..GG.GG..','..oo.oo..']);
SPR.zephyr=makeSprite(['....ccc...','...ccuuc..','..cckuccoo','.ccccuc...','ccuuccccc.','.ccuuccc..','..ccc.cc..','..oo..oo..']);
SPR.nimbus=makeSprite(['.e......e.','.ee....ee.','.eeeeeeee.','eewweeewwe','ewkweeewke','eewweqqwwe','.eeeeqqeee','.eEEEEEEe.','eeEeyyeEee','.eEEEEEEe.','..ee..ee..','..oo..oo..']);
SPR.plumeKeeper=decorate(SPR.pigeon,x=>{P_(x,'#ff6fae',0,0,3,2);P_(x,'#ffd83a',2,0,1,1);});
SPR.starla=decorate(SPR.owl,x=>{P_(x,'#ffd83a',5,0,2,2);P_(x,'#ffd83a',4,1,4,1);});
SPR.tweeta=makeSprite(['..yyy..','.yyyyy.','.ykyyy.','ooyyy..','.yyyyy.','..yyy..','..o.o..']);
SPR.eaglet=makeSprite(['..nnn...','.nnnnn..','.nkntnn.','.nnqqn..','..nnnn..','.nnnnnn.','.nTnnTn.','..q..q..']);
SPR.dragon=mk(72,52,x=>{const R=(c,i,j,w,h)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};
  R('#21142b',8,14,50,30);R('#8a98c8',10,16,46,26);R('#a8b8e0',12,17,40,10);R('#6a78a8',10,36,46,6);
  R('#21142b',36,2,26,24);R('#8a98c8',38,4,22,20);R('#a8b8e0',40,5,16,6);R('#21142b',42,10,6,6);R('#ff6a6a',43,11,4,4);R('#fff8ec',43,11,1,1);
  R('#21142b',52,12,6,6);R('#ff6a6a',53,13,4,4);R('#6a78a8',58,20,12,4);R('#21142b',57,18,5,3);R('#ffe84a',39,0,3,5);R('#ffe84a',46,0,3,4);R('#ffe84a',54,1,3,4);
  R('#21142b',0,22,12,12);R('#8a98c8',1,23,10,10);R('#a8b8e0',2,24,6,3);R('#21142b',16,44,8,8);R('#6a78a8',17,45,6,6);R('#21142b',40,44,8,8);R('#6a78a8',41,45,6,6);
  R('#4a5a8a',14,26,6,4);R('#4a5a8a',26,28,6,4);R('#4a5a8a',38,26,6,4);R('#9aa8d8',18,18,30,2);});
// finds and goods
SPR.lamb=makeSprite(['..ccc..','.cwwwc.','cwkwwkc','cwwppwc','.cwwwc.','.c...c.']);
SPR.chime=makeSprite(['..k...','.kkk..','kqkqkq','.q.q.q','.q.q.q','.q.q.q']);
SPR.skyfeather=makeSprite(['....ww','...wcw','..wcww','.wcww.','wcww..','ww....']);
SPR.cloudpuff=makeSprite(['.ww.','wwww','wwwww','.www']);
SPR.rod=makeSprite(['..y..','.yy..','..yy.','.yyyy','..yy.','..y..','..k..','..k..']);
SPR.starfruit=makeSprite(['..y..','.yyy.','yyyyy','.yyy.','y.y.y','..G..']);
SPR.cake=makeSprite(['.ppp.','wwwww','pwwwp','wwwww','.eee.']);
SPR.sbell=makeSprite(['..qq..','.qqqq.','qqQQqq','qQqqQq','qqqqqq','.qqqq.','..kk..']);
SPR.shard=mk(9,11,x=>{P_(x,'#21142b',3,0,3,1);P_(x,'#21142b',2,1,5,8);P_(x,'#21142b',3,9,3,1);P_(x,'#8a4ad8',3,1,3,8);P_(x,'#6a2ab8',4,3,2,6);P_(x,'#c898f8',3,2,1,5);P_(x,'#ffe84a',5,5,1,2);});
SPR.cloudbloom=makeSprite(['..p..','.pyp.','pyqyp','.pyp.','..l..','.ll..']);
SPR.bolt=makeSprite(['...yy.','..yy..','.yyyy.','..yy..','.yy...','yy....']);
SPR.peg=mk(12,16,x=>{x.fillStyle='#21142b';x.fillRect(3,6,6,10);x.fillStyle='#c8c8d8';x.fillRect(4,7,4,8);x.fillStyle='#21142b';x.fillRect(1,0,10,8);});
// Sky Tree II icons
Object.assign(ICON,{
  updraft:makeSprite(['...yy...','..yyyy..','.yyyyyy.','...yy...','...yy...','..y..y..','.y....y.','y......y']),
  divebomb:makeSprite(['...kk...','..kyyk..','..kyyk..','..kyyk..','.kyyyyk.','kyyyyyyk','.kkkkkk.','..y..y..']),
  cloudwalk:makeSprite(['..wwww..','.wwwwww.','wwwwwwww','.wwwwww.','..y..y..','..y..y..','.yy..yy.','........']),
  thunder:makeSprite(['....yy..','...yy...','..yyyy..','.yyyy...','...yy...','..yy....','.yy.....','y.......'])});
Object.assign(OUTFIT_SPR,{quill:makeSprite(['...ww','..wcw','.wwcw','wwc..','wc...','c....']),bloom:makeSprite(['p.y.p.y.p','.pyypyypy.','GlGGlGGlG']),stormcap:makeSprite(['..eeee..','.eEEEEe.','eEeeeeEe','kkkkkkkk','.yy.....']),scarf:makeSprite(['pppppppp','.pp..pp.','.....pp.'],false)});
