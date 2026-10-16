'use strict';
/* Native canvas artwork from the approved coast and peaks study. */
const LANDSCAPE_ART=(()=>{
const C={ink:'#202840',paper:'#fff8ec',sand:'#f2dca0',sandD:'#dcc080',snow:'#e8f0f8',snowD:'#cfdcec',snowW:'#ffffff',stone:'#a9b7c5',stoneD:'#64758b',wood:'#a66c46',woodD:'#594437',woodL:'#b69965',water:'#409dc5',foam:'#b2e7e0',gold:'#ffe05a',red:'#eb6654',leaf:'#2d664e'};
let g,wf=0;
const R=(c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,p){g.fillStyle=c;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
function line(c,p,w=1){g.strokeStyle=c;g.lineWidth=w;g.lineJoin='round';g.lineCap='round';g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function tile(k,x,y){const a=k.split('-'),v=TILE[a[0]],i=Array.isArray(v)?v[a[1]===undefined?wf:Number(a[1])]:v;g.drawImage(i,Math.round(x),Math.round(y));}
function ground(kind){for(let y=0;y<192;y+=16)for(let x=0;x<512;x+=16)tile(kind+'-'+hash2(x/16,y/16)%2,x,y);}
function texture(points,key){g.save();g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.clip();g.fillStyle=g.createPattern((Array.isArray(TILE[key.split('-')[0]])?TILE[key.split('-')[0]][wf]:TILE[key]),'repeat');g.fillRect(0,0,512,192);g.restore();}
function rockPool(x,y,w,h){
 const p=[[x-w/2,y-3],[x-w/2+6,y-h/2],[x-7,y-h/2],[x-7,y-h/2-2],[x+7,y-h/2-2],[x+7,y-h/2],[x+w/2-4,y-h/2+2],[x+w/2,y-3],[x+w/2,y+4],[x+w/2-5,y+h/2],[x+6,y+h/2],[x+6,y+h/2+2],[x-9,y+h/2+2],[x-9,y+h/2],[x-w/2+3,y+h/2-3]];
 poly(C.ink,p);poly(C.stone,p.map(([xx,yy])=>[x+(xx-x)*.94,y+(yy-y)*.91]));
 const wet=p.map(([xx,yy])=>[Math.round(x+(xx-x)*.72),Math.round(y+(yy-y)*.65)]);texture(wet,'water-0');
 R(C.paper,x-w/2+7,y-h/2+1,12,1);R(C.foam,x-12,y-3,8,1);R(C.foam,x+3,y+5,9,1);
 for(const [xx,yy] of [[x-w/2+1,y+3],[x+w/2-10,y+h/2-3]]){R(C.stoneD,xx,yy,8,4);R(C.paper,xx+1,yy,5,1);}
}
function umbrella(x,y){
 R(C.woodD,x-1,y-14,2,24);R(C.woodL,x,y-13,1,22);
 poly(C.ink,[[x-13,y-12],[x-9,y-20],[x,y-25],[x+9,y-20],[x+13,y-12]]);
 poly(C.red,[[x-11,y-13],[x-8,y-19],[x,y-23],[x+8,y-19],[x+11,y-13]]);poly(C.paper,[[x-4,y-13],[x-2,y-20],[x,y-23],[x+2,y-20],[x+4,y-13]]);
 R(C.woodD,x-14,y+7,16,3);R(C.wood,x-13,y+7,14,1);R(C.woodD,x-13,y+10,2,4);R(C.woodD,x-2,y+10,2,4);
 R(C.ink,x+9,y+3,9,9);R(C.paper,x+10,y+4,7,7);R(C.red,x+12,y+4,3,2);R(C.red,x+12,y+9,3,2);R(C.sand,x+12,y+6,3,3);
}
function boardwalk(){for(let x=472;x<517;x+=5){R(C.woodD,x,85,5,20);R(C.woodL,x+1,86,3,17);R('#f6ead0',x+1,86,2,1);}R(C.woodD,473,82,2,25);R(C.woodD,507,82,2,25);R(C.paper,472,82,38,1);}
function fish(x,y){poly(C.stoneD,[[x-6,y-2],[x-2,y-4],[x+5,y-2],[x+8,y-5],[x+8,y+2],[x+5,y],[x-2,y+2]]);R(C.paper,x-4,y-3,6,1);R(C.ink,x-4,y-2,1,1);}
function ledge(points,depth=9){
 const face=[...points,...points.slice().reverse().map(([x,y])=>[x,y+depth])];texture(face,'cliff');
 line(C.snowW,points,2);line(C.snowD,points.map(([x,y])=>[x,y+2]),1);
}
function nest(x,y){
 poly(C.ink,[[x-17,y-7],[x-12,y-12],[x+10,y-12],[x+17,y-7],[x+14,y+2],[x-12,y+3]]);poly(C.woodD,[[x-15,y-6],[x-11,y-10],[x+10,y-10],[x+15,y-6],[x+12,y],[x-11,y+1]]);
 for(let yy=y-7;yy<y+1;yy+=3)R(C.woodL,x-12,yy,25,1);R(C.wood,x-8,y-9,16,4);R('#e8cd98',x-10,y-8,5,1);R('#e8cd98',x+3,y-5,7,1);
}
function iceNook(x,y){
 poly(C.ink,[[x-13,y],[x-12,y-17],[x-6,y-23],[x+6,y-23],[x+13,y-16],[x+14,y]]);poly(C.stoneD,[[x-11,y-1],[x-10,y-16],[x-5,y-21],[x+5,y-21],[x+11,y-15],[x+12,y-1]]);
 poly(C.snowW,[[x-12,y-16],[x-5,y-23],[x+5,y-23],[x+12,y-16],[x+7,y-17],[x+3,y-20],[x-5,y-18]]);poly('#306a9d',[[x-7,y],[x-6,y-13],[x,y-17],[x+7,y-12],[x+8,y]]);R(C.foam,x-4,y-12,2,11);R(C.water,x+2,y-13,2,10);
}

function beachGround(){
 ground('sand');
 for(let x=0;x<512;x++){const y=beachShoreY(x);R(C.sandD,x,y-2,1,3);g.fillStyle=g.createPattern(TILE.water[wf],'repeat');g.fillRect(x,y,1,19);g.fillStyle=g.createPattern(TILE.deep[wf],'repeat');g.fillRect(x,y+19,1,192-y-19);R(C.foam,x,y,1,1);}
 line('#fff0c8',[[132,-4],[132,49],[139,73],[156,90],[236,94],[270,102],[363,107],[450,96],[520,96]],9);
 for(const p of BEACH_POOLS)rockPool(...p);
 for(let n=0;n<9;n++){R(C.sandD,74+n*7,98+n*2,1,2);R(C.sandD,77+n*7,99+n*2,1,2);}
}
function mountainGround(){
 ground('snow');
 texture([[0,0],[512,0],...MOUNTAIN_RIDGE.slice().reverse()],'cliff');ledge(MOUNTAIN_RIDGE,7);
 const trail=[[132,199],[132,153],[113,130],[146,98],[190,94],[254,96],[350,97]];
 line(C.snowD,trail,9);line('#f4f8ff',trail,5);
 for(let x=158;x<349;x+=16){R('#bacde0',x,96,2,1);R('#bacde0',x+5,99,2,1);}
 MOUNTAIN_LEDGES.forEach((p,i)=>ledge(p,i===0?8:9));
 const left=[],right=[];for(let y=32;y<=192;y+=16){const [l,r]=mountainChasmEdges(y);left.push([l,y]);right.push([r,y]);}
 texture([...left,...right.slice().reverse()],'chasm');line(C.stone,left,2);line(C.snowW,right,2);
 line(C.snowD,[[426,101],[450,99],[467,74]],7);
 poly('#bdcee0',[[64,53],[69,40],[85,34],[118,34],[132,43],[137,57]]);poly('#71879e',[[77,55],[80,43],[95,39],[116,43],[121,55]]);R(C.snowW,82,37,33,2);
}
function paint(target,kind,x=0,y=0){g=target;g.save();g.translate(x,y);
 if(kind==='umbrella')umbrella(0,-14);
 else if(kind==='boardwalk'){g.translate(-494,-106);boardwalk();}
 else if(kind==='perch'){R(C.woodD,-15,-10,30,8);R(C.wood,-14,-9,28,5);R('#f6ead0',-13,-9,5,4);R(C.woodD,-11,-8,2,2);line(C.woodD,[[2,-10],[20,-23]],1);line(C.paper,[[20,-23],[27,-19]],1);R(C.red,26,-19,2,2);}
 else if(kind==='fish')fish(0,-8);
 else if(kind==='nest')nest(0,0);
 else if(kind==='ice')iceNook(0,0);
 else if(kind==='sandmound'){poly(C.sandD,[[-10,-1],[-8,-7],[3,-8],[10,-3],[8,2],[-7,2]]);R('#fff0c8',-6,-5,10,1);}
 else if(kind==='post'){R(C.woodD,0,-11,2,11);R(C.gold,-2,-12,6,2);}
 g.restore();
}
return {paint,ground(target,kind,frame){g=target;wf=frame;if(kind==='beach')beachGround();else mountainGround();}};
})();
