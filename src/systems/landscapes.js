'use strict';
const LANDSCAPE_GROUND=new Map();
function landscapeKind(x,y){return x>=0&&x<512?(y>=768&&y<960?'mountains':y>=1152&&y<1344?'beach':null):null;}
function landscapeOrigin(kind){return kind==='beach'?1152:768;}
function landscapeGround(kind,wf){const k=kind+wf;if(!LANDSCAPE_GROUND.has(k))LANDSCAPE_GROUND.set(k,mk(512,192,g=>LANDSCAPE_ART.ground(g,kind,wf)));return LANDSCAPE_GROUND.get(k);}
function drawLandscapeTile(c,r,sx,sy,wf,kind){ctx.drawImage(landscapeGround(kind,wf),c*16,r*16-landscapeOrigin(kind),16,16,sx,sy,16,16);}
function mountainBoulderGone(i){const [x,y]=MOUNTAIN_BOULDERS[i];return !!(G.flags.mo&&i>0&&i<4)||G.mods[Math.floor(x/16)+','+(48+Math.floor(y/16))]==='g';}
function landscapeRectBlocked(x,y,w,h,forPlayer){
 const kind=landscapeKind(x,y);if(!kind||x+w>512||y+h>landscapeOrigin(kind)+192)return null;
 const oy=landscapeOrigin(kind),m=landscapeMask(kind),allowed=[true,false,!!(forPlayer&&(has('flutter')||has('swim'))),!!(forPlayer&&has('swim')),!!(forPlayer&&has('glide'))];
 for(let py=Math.floor(y-oy);py<y-oy+h;py++)for(let px=Math.floor(x);px<x+w;px++)if(!allowed[m[py*512+px]])return true;
 if(kind==='mountains'&&MOUNTAIN_BOULDERS.some(([bx,by],i)=>!mountainBoulderGone(i)&&ov({x,y:y-oy,w,h},{x:bx,y:by,w:16,h:16})))return true;
 return false;
}
function landscapeFootTile(x,y){const kind=landscapeKind(x,y);return kind?['.','N','W','w','z'][landscapeMask(kind)[Math.floor(y-landscapeOrigin(kind))*512+Math.floor(x)]]:null;}
const LANDSCAPE_PLACEMENTS={
 sandy:['beach',100,75],mo:['mountains',170,86],elda:['mountains',326,82],
 turtle0:['beach',52,102],turtle1:['beach',108,112],turtle2:['beach',151,119],
 shell0:['beach',28,88],shell1:['beach',163,113],shell2:['beach',40,156],shell3:['beach',216,172],shell4:['beach',354,92],
 eagleEgg:['mountains',466,61],stick2:['mountains',54,142],stick3:['beach',239,95],
 spot_peak:['mountains',296,169],spot_beach:['beach',192,111],
 ring0:['beach',232,112],ring1:['beach',419,94],ring2:['beach',487,115],
 mp2:['mountains',210,90],mf0:['mountains',80,153],mf2:['beach',211,56],
 ms0:['beach',88,53],ms1:['beach',137,101],ms2:['beach',199,85],ms3:['beach',343,73],ms4:['beach',453,103],
 i_pepper:['mountains',152,123],i_salt:['beach',108,126]
};
function placeLandscapeEntity(e){const p=LANDSCAPE_PLACEMENTS[e.id];if(p&&landscapeKind(e.x,e.y)===p[0]){e.x=p[1];e.y=landscapeOrigin(p[0])+p[2];}}
function placeMountainKids(){ents.filter(e=>e.deco2).forEach((e,i)=>{e.x=G.flags.mo?175+i*16:92+i*19;e.y=768+(G.flags.mo?108+i*3:53);});}
function makeLandscapeEnts(){
 const add=(region,kind,x,y,extra={})=>addEnt({type:'landscapeprop',kind,x,y:landscapeOrigin(region)+y,solid:false,...extra});
 for(const [kind,points,sprite] of [['beach',BEACH_TREES,'tree'],['beach',BEACH_PALMS,'palm'],['beach',BEACH_ROCKS,'brock'],['mountains',MOUNTAIN_PINES,'pine']])for(const [x,y] of points)add(kind,'tile',x+8,y+16,{sprite});
 MOUNTAIN_BOULDERS.forEach(([x,y],i)=>add('mountains','boulder',x+8,y+16,{boulder:i}));
 add('mountains','tile',466,71,{sprite:'boulder'});add('mountains','nest',326,82);
 // Insert the nest before Elda at the same depth, so it sits underneath her.
 const nest=ents.pop();ents.splice(0,0,nest);
 add('mountains','post',374,114);add('mountains','post',425,114);
 add('beach','umbrella',74,78);add('beach','perch',298,86);add('beach','boardwalk',494,106);
 for(const e of ents){placeLandscapeEntity(e);if(e.type==='berry'){e.x=218;e.y=925;}if(e.type==='fishspot'){e.x=308;e.y=1218;}if(e.id==='eagleEgg')e.pickupOffset=8;}
 placeMountainKids();
 const crabs=ents.filter(e=>e.type==='crab');[[222,105],[349,101],[450,108]].forEach(([x,y],i)=>{const e=crabs[i];if(e)Object.assign(e,{x,y:1152+y,hx:x,hy:1152+y,sx:Math.floor(x/256),sy:6,rng:i===0?30:23});});
}
function drawLandscapeProp(e){const x=e.x-camX,y=e.y-camY+HUD;if(e.kind==='tile')drawImg(TILE[e.sprite],x-8,y-16);else if(e.kind==='boulder'){if(!mountainBoulderGone(e.boulder))drawImg(TILE.boulder,x-8,y-16);}else LANDSCAPE_ART.paint(ctx,e.kind,x,y);}
function landscapeBoulderPeck(f){
 if(landscapeKind(f.x,f.y)!=='mountains')return false;
 const i=MOUNTAIN_BOULDERS.findIndex(([x,y],i)=>!mountainBoulderGone(i)&&f.x>=x-3&&f.x<x+19&&f.y-768>=y-3&&f.y-768<y+19);if(i<0)return false;
 const [x,y]=MOUNTAIN_BOULDERS[i];if(!has('super')){SFX.clunk();float(x+8,y+768,'Too big! Need SUPER PECK');return true;}
 setTile(Math.floor(x/16),48+Math.floor(y/16),'g');SFX.brk();shake=8;puff(x+8,y+776,18,['#a9b7c5','#64758b','#fff8ec'],2,.08);if(!G.flags.mo)freeMo();save();return true;
}
function landscapeClearNear(ox,oy){
 const kind=landscapeKind(ox,oy);if(!kind)return null;
 const origin=landscapeOrigin(kind),side=kind==='mountains'?(ox<400?0:1):0;
 const clear=(x,y)=>x>=6&&x<=506&&y>=origin+6&&y<=origin+188&&(kind!=='mountains'||((x<400?0:1)===side&&(G.flags.mo||has('super')||x<82||x>=124||y<811||y>=832)))&&!pBlocked(x,y)&&!ents.some(e=>e.solid&&ov(pBox(x,y),entBox(e)));
 if(clear(ox,oy))return {x:ox,y:oy};
 for(let d=4;d<=256;d+=4)for(let dy=-d;dy<=d;dy+=4)for(const dx of Math.abs(dy)===d?Array.from({length:d/2+1},(_,i)=>-d+i*4):[-d,d])if(clear(ox+dx,oy+dy))return {x:ox+dx,y:oy+dy};return null;
}
function restoreLandscapeLanding(){if(landscapeKind(P.x,P.y)){const p=landscapeClearNear(P.x,P.y);if(p){P.x=p.x;P.y=p.y;CS={x:Math.floor(P.x/256),y:Math.floor(P.y/192)};camX=CS.x*256;camY=CS.y*192;}}}
