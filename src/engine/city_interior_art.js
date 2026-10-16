'use strict';
/* Approved furnished city rooms. Paint once; furniture footprints are captured by the painters. */
const CITY_INTERIOR_ART=(()=>{
let g;
const C={ink:'#202840',paper:'#fff8ec',cream:'#ead6aa',wall:'#dfc2a0',wood:'#a66c46',light:'#cf9865',dark:'#594437',red:'#d45d50',blue:'#467b95',glass:'#8bb6c5',teal:'#407f83',gold:'#ffe05a',green:'#5b9e64',leaf:'#a1cb7c',purple:'#8e6c95',stone:'#a5b1b2'};
const R=(c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,pts){g.fillStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
function L(c,pts,w=1){g.strokeStyle=c;g.lineWidth=w;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function label(s,x,y,c=C.paper,size=6,align='left'){g.fillStyle=c;g.font=size+'px monospace';g.textAlign=align;g.textBaseline='top';g.fillText(s,Math.round(x),Math.round(y));}
function sprite(k,x,y,scale=1){if(['pigeon','raccoon','chef','magpie','goat','badger','ferret','catO','peacock','duck','duckling','owlGlasses','curator','pip','easel'].includes(k))return;const i=SPR[k];if(i)g.drawImage(i,Math.round(x-i.width*scale/2),Math.round(y-i.height*scale),Math.round(i.width*scale),Math.round(i.height*scale));}
const accents={post:C.blue,rocco:'#71865e',bistro:C.red,boutique:C.purple,seed:C.green,bakery:'#bb764e',toy:C.teal,cleo:'#c27d78',artist:C.teal,ducks:'#6e9ba5',loft:C.blue,library:C.teal,museum:'#b2aa8b'};
function planks(x,y,w,h,tile=false){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();R(tile?'#d6c7ac':'#be9c70',x,y,w,h);for(let yy=y;yy<y+h;yy+=tile?12:8){R(tile?'#b3b4a4':'#a58563',x,yy,w,1);for(let xx=x+((yy/8|0)%2?12:0);xx<x+w;xx+=tile?12:32){R(tile?'#b3b4a4':'#a58563',xx,yy,1,tile?12:8);if(!tile)R('#ceb187',xx+3,yy+2,9,1);}}g.restore();}
function windowAt(x,y,w=28,h=22){R(C.ink,x-2,y-2,w+4,h+4);R(C.cream,x-1,y-1,w+2,h+2);R(C.blue,x,y,w,h);R(C.glass,x+2,y+2,w-4,h-4);R(C.paper,x+3,y+2,3,h-4);R(C.cream,x+w/2-1,y,2,h);R(C.cream,x,y+h/2-1,w,2);R(C.light,x-3,y+h+2,w+6,3);}
function shell(id,art=false){
 R('#273744',0,0,256,192);const x=art?32:16,w=art?192:224;
 R(C.ink,x-3,art?28:9,w+6,174-(art?28:9));R(C.wall,x,art?32:12,w,164-(art?32:12));
 for(let y=18;y<50;y+=6){R('#d1b69b',x,y,w,1);for(let xx=x+(y%12?6:0);xx<x+w;xx+=16)R('#d1b69b',xx,y,1,6);}
 R(accents[id],x,43,w,9);R(C.paper,x,43,w,2);planks(x+4,53,w-8,123,['bistro','bakery','museum'].includes(id));
 R(C.dark,x,52,4,126);R(C.cream,x+2,52,2,126);R(C.dark,x+w-4,52,4,126);R(C.cream,x+w-4,52,2,126);
 R(C.ink,x,176,w,9);R(C.wall,x+3,177,w-6,6);R(C.ink,115,176,26,12);R('#d6c7ac',117,176,22,12);R(C.cream,116,174,24,3);R(C.light,117,185,22,2);
 if(!art&&id!=='loft'){windowAt(32,20,31,20);windowAt(190,20,31,20);}
 else if(art)for(const xx of [36,100,148,212])windowAt(xx,36,8,10);
}
function rug(x,y,w,h,c=C.teal){R(C.dark,x-1,y-1,w+2,h+2);R(C.cream,x,y,w,h);R(c,x+2,y+2,w-4,h-4);R('#ffffff22',x+5,y+5,w-10,1);R('#ffffff22',x+5,y+h-6,w-10,1);for(let xx=x+4;xx<x+w;xx+=5){R(C.cream,xx,y-2,2,2);R(C.cream,xx,y+h,2,2);}}
function pot(x,y){hit([x-5,y-17,11,19],'pot');R(C.dark,x-5,y-7,11,8);R(C.red,x-4,y-6,9,6);R(C.cream,x-5,y-8,11,2);R(C.green,x-5,y-15,11,6);R(C.leaf,x-2,y-20,5,10);R(C.gold,x+2,y-17,2,2);}
function counter(x,y,w,h=18,c=C.wood){hit([x,y,w,h],'counter');R(C.ink,x,y,w,h);R(c,x+1,y+4,w-2,h-5);R(C.dark,x+1,y+h-4,w-2,3);for(let xx=x+4;xx<x+w-3;xx+=18){R(C.light,xx,y+8,12,1);R(C.dark,xx+13,y+5,1,h-10);}R(C.cream,x-1,y-2,w+2,6);R(C.paper,x,y-2,w,1);}
function shelf(x,y,w=48,h=36,kind='books'){hit([x,y,w,h],'shelf');
 R(C.ink,x,y,w,h);R(C.dark,x+2,y+2,w-4,h-4);R(C.light,x,y,w,3);for(let yy=y+5;yy<y+h-3;yy+=12){
  for(let xx=x+4;xx<x+w-4;xx+=kind==='toys'?14:5){if(kind==='parcels'){R(C.cream,xx,yy+3,4,6);R(C.paper,xx+1,yy+5,3,1);}else if(kind==='bread'){R(C.gold,xx,yy+4,4,4);R(C.cream,xx+1,yy+4,1,2);}else if(kind==='toys'){const n=(xx+yy)%3;R([C.red,C.teal,C.gold][n],xx,yy+5,10,4);R([C.gold,C.purple,C.paper][n],xx+3,yy+2,4,4);R(C.ink,xx+1,yy+9,2,1);R(C.ink,xx+7,yy+9,2,1);}else{const n=(xx*7+yy)%4;R([C.blue,C.red,C.cream,C.teal][n],xx,yy+1,3,8);R(C.paper,xx+1,yy+3,1,1);}}
  R(C.light,x+2,yy+10,w-4,2);
 }
 R(C.light,x,y,2,h);R(C.wood,x+w-2,y,2,h);
}
function chair(x,y,c=C.teal){hit([x-9,y-13,19,20],'chair');R(C.dark,x-8,y-16,17,17);R(c,x-6,y-14,13,8);R(C.light,x-9,y-5,19,3);R(c,x-6,y-4,13,5);R(C.dark,x-7,y+1,2,5);R(C.dark,x+6,y+1,2,5);}
function table(x,y,w=32,h=18){hit([x-w/2,y,w,h+4],'table');R(C.dark,x-w/2+2,y+3,w-4,3);R(C.dark,x-w/2+4,y+h-1,3,6);R(C.dark,x+w/2-6,y+h-1,3,6);R(C.ink,x-w/2,y,w,h);R(C.light,x-w/2+1,y+1,w-2,h-3);R(C.cream,x-w/2+2,y+1,w-4,2);}
function cafe(x,y){chair(x-21,y+7,C.red);chair(x+21,y+7,C.red);table(x,y,32,16);R(C.paper,x-7,y+3,13,9);R(C.cream,x-5,y+5,4,4);R(C.red,x+3,y+5,3,3);}
function framed(x,y,w,h,color=C.teal){R(C.ink,x,y,w,h);R(C.light,x+1,y+1,w-2,h-2);R(C.cream,x+3,y+3,w-6,h-6);R(color,x+4,y+4,w-8,h-8);poly(C.leaf,[[x+5,y+h-5],[x+w/2,y+8],[x+w-5,y+h-5]]);R(C.gold,x+w-10,y+5,3,3);}
function sofa(x,y,w=46,c=C.teal){hit([x-3,y-15,w+6,24],'sofa');R(C.dark,x-2,y-16,w+4,21);R(c,x,y-15,w,17);R(C.paper,x+3,y-13,w-6,2);R(C.cream,x-3,y-7,5,15);R(C.cream,x+w-2,y-7,5,15);R('#ffffff22',x+5,y-2,w-10,1);R(C.dark,x+2,y+5,3,4);R(C.dark,x+w-5,y+5,3,4);}
function bed(x,y,w=30,c=C.teal,nest=false){hit([x-2,y-2,w+4,29],'bed');R(C.dark,x-2,y-2,w+4,27);R(C.light,x-1,y-1,w+2,25);R(C.paper,x+2,y+1,w-4,8);R(c,x+1,y+9,w-2,12);R(C.cream,x+2,y+10,w-4,2);R(C.dark,x-2,y+23,3,4);R(C.dark,x+w-1,y+23,3,4);if(nest){for(let i=0;i<5;i++)R('#d0ae66',x+2+i*5,y+20,4,3);}}
function oven(x,y,w=38){hit([x,y,w,44],'oven');R(C.ink,x,y,w,43);R('#a3a49a',x+1,y+1,w-2,41);for(let yy=y+3;yy<y+20;yy+=5){R('#7d878b',x+2,yy,w-4,1);R(C.cream,x+4,yy+2,7,1);}R(C.dark,x+6,y+21,w-12,16);R('#1c2632',x+8,y+23,w-16,13);R(C.red,x+11,y+30,w-22,6);R(C.gold,x+15,y+27,w-30,8);R(C.cream,x+16,y+26,3,5);R(C.cream,x-1,y+18,w+2,3);R(C.dark,x+4,y+41,w-8,3);}
function pastry(x,y,w=82){hit([x,y-4,w,31],'pastry');counter(x,y+10,w,17);poly(C.ink,[[x,y+10],[x+4,y-4],[x+w-5,y-4],[x+w,y+10]]);poly('#8bb6c566',[[x+2,y+9],[x+5,y-2],[x+w-6,y-2],[x+w-2,y+9]]);R(C.paper,x+6,y-1,w-12,1);for(let i=0;i<3;i++)sprite(['muffin','sbun','tart'][i],x+15+i*(w-25)/3,y+9);R(C.cream,x,y+9,w,2);}
function sack(x,y,c=C.cream){hit([x-8,y-18,16,20],'sack');poly(C.dark,[[x-6,y-16],[x-3,y-20],[x+4,y-20],[x+7,y-15],[x+8,y],[x-8,y]]);poly(c,[[x-5,y-15],[x-2,y-18],[x+3,y-18],[x+5,y-14],[x+6,y-2],[x-6,y-2]]);R(C.wood,x-5,y-14,10,2);R(C.green,x-2,y-8,4,3);}
function barrel(x,y){hit([x-8,y-18,17,20],'barrel');R(C.dark,x-8,y-18,17,20);R(C.wood,x-7,y-17,15,17);R(C.light,x-5,y-17,4,17);R(C.stone,x-8,y-14,17,2);R(C.stone,x-8,y-4,17,2);R(C.cream,x-6,y-18,13,2);}
function clothing(x,y,w=64){hit([x-3,y-25,w+6,29],'clothing');R(C.dark,x,y-24,2,26);R(C.dark,x+w-2,y-24,2,26);R(C.stone,x-2,y-25,w+4,3);for(let n=0;n<4;n++){const xx=x+7+n*(w-12)/4,c=[C.purple,C.red,C.teal,C.blue][n];L(C.cream,[[xx-3,y-20],[xx,y-23],[xx+4,y-20]]);R(c,xx-4,y-19,9,8);poly(c,[[xx-3,y-15],[xx-6,y-5],[xx+8,y-5],[xx+4,y-15]]);}R(C.dark,x-3,y+2,8,2);R(C.dark,x+w-5,y+2,8,2);}
function mirror(x,y){hit([x-12,y-34,25,39],'mirror');R(C.dark,x-10,y-34,21,36);R(C.cream,x-8,y-32,17,31);R(C.blue,x-6,y-30,13,27);poly(C.glass,[[x-5,y-30],[x+6,y-30],[x+6,y-22],[x-5,y-8]]);R(C.paper,x-4,y-29,2,14);R(C.light,x-12,y+2,25,3);}
function arcade(x,y,n=0){hit([x-2,y-32,23,35],'arcade');poly(C.ink,[[x,y-32],[x+19,y-32],[x+21,y],[x-2,y]]);R([C.purple,C.teal,C.red][n%3],x+1,y-30,17,28);R(C.gold,x+2,y-29,15,4);R(C.ink,x+3,y-23,14,12);R('#467b95',x+4,y-22,12,10);sprite(['star','seed','muffin'][n%3],x+10,y-12);R(C.cream,x+1,y-8,19,3);R(C.red,x+12,y-7,2,2);R(C.ink,x+6,y-8,2,3);R(C.ink,x+7,y+1,10,2);}
function stairs(x,y){hit([x-3,y-61,33,64],'stairs');R(C.dark,x,y-52,27,54);for(let n=0;n<7;n++){R(C.light,x+2,y-4-n*6,23,5);R(C.cream,x+2,y-4-n*6,23,1);}R(C.paper,x-2,y-49,2,51);R(C.paper,x+27,y-49,2,51);R(C.teal,x-3,y-61,33,10);label('ROOFS',x+13,y-59,C.paper,6,'center');}
function caseAt(x,y,key){hit([x-15,y-23,30,29],'caseAt');R(C.dark,x-15,y-6,30,11);R(C.cream,x-14,y-5,28,8);R(C.ink,x-15,y-23,30,18);R('#659eac66',x-13,y-21,26,15);R(C.paper,x-12,y-20,24,1);R(C.gold,x-6,y,12,2);}
function roomScene(id,mode,canvas,mini=false){
 g=canvas.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,256,192);hitList=[];shell(id);
 
 if(id==='post'){
  shelf(133,20,51,30,'parcels');framed(75,20,48,25,C.blue);sprite('pigeon',156,80);counter(88,84,135,21,C.blue);counter(204,103,19,33,C.blue);
  table(49,126,42,20);R(C.paper,34,128,18,10);L(C.blue,[[36,130],[43,135],[50,130]]);sack(196,158);barrel(220,159);rug(103,126,47,36,C.blue);pot(29,165);
 }else if(id==='bistro'){
  R(C.dark,84,20,57,27);R(C.paper,87,22,51,2);label('TODAY',112,26,C.cream,6,'center');R(C.cream,92,36,40,1);R(C.cream,92,40,29,1);
  sprite('chef',106,78);counter(27,81,123,19,C.red);oven(182,50,38);R(C.paper,46,73,17,7);R(C.red,75,75,5,4);cafe(58,126);cafe(196,126);rug(110,116,36,48,C.red);pot(28,163);pot(228,163);
 }else if(id==='boutique'){
  clothing(29,91,67);mirror(182,130);R(C.dark,200,59,25,80);R(C.purple,202,60,22,76);for(let x=204;x<224;x+=5)R('#b290b8',x,62,1,71);R(C.gold,201,58,25,3);
  sprite('magpie',156,75);counter(113,81,77,18,C.purple);rug(92,113,66,46,C.purple);table(52,133,40,16);R(C.paper,42,129,20,7);R(C.purple,45,124,14,5);pot(28,163);
 }else if(id==='seed'){
  shelf(76,20,104,32,'parcels');sprite('goat',158,78);counter(117,84,106,20,C.green);
  for(const [x,y] of [[39,93],[55,91],[47,111],[207,143],[220,153]])sack(x,y);barrel(218,119);table(60,141,60,18);for(let i=0;i<4;i++){R(C.dark,37+i*14,137,11,7);R(C.green,39+i*14,128,7,10);R(C.leaf,42+i*14,124,2,9);}
  rug(109,123,41,39,C.green);pot(29,164);
 }else if(id==='bakery'){
  shelf(77,22,76,28,'bread');oven(181,48,42);sprite('badger',149,82);pastry(31,93,125);table(198,141,43,18);sprite('muffin',195,144);R(C.paper,203,144,7,4);sack(42,153);sack(62,156);rug(105,130,48,33,'#b68159');pot(226,167);
 }else if(id==='toy'){
  shelf(76,21,104,30,'toys');sprite('ferret',171,72);counter(122,78,103,18,C.teal);sprite('star',202,73);
  arcade(29,118,0);arcade(55,118,1);arcade(81,118,2);table(60,146,58,16);R(C.red,38,140,13,7);R(C.teal,52,136,12,11);R(C.gold,65,141,13,6);R(C.ink,41,147,3,2);R(C.ink,70,147,3,2);
  stairs(202,158);rug(104,111,80,51,C.teal);
 }else if(id==='rocco'){
  shelf(132,21,51,31,'parcels');framed(83,22,40,24,'#71865e');bed(33,66,44,'#71865e',true);sofa(30,139,49,'#71865e');table(188,123,43,20);R(C.cream,177,127,9,6);sprite('book',196,132);rug(99,113,58,42,'#71865e');if(settings.people)sprite('raccoon',174,101);pot(225,164);
 }else if(id==='cleo'){
  poly('rgba(255,236,160,.24)',[[31,43],[66,43],[120,116],[45,119]]);counter(30,69,66,19,'#b88675');framed(104,22,42,25,C.blue);bed(177,67,43,'#c27d78');sofa(170,139,48,'#c27d78');rug(74,112,81,47,'#c27d78');table(48,138,29,17);sprite('book',49,147);if(settings.people)sprite('catO',120,136);pot(227,163);
 }else if(id==='artist'){
  framed(77,20,32,29,C.blue);framed(116,19,32,29,C.red);framed(153,22,29,26,C.purple);R('#ddd4bf',77,77,104,75);L('#d2c5a6',[[78,80],[91,147],[174,150]],1);R('#e8d8ad',86,86,81,1);
  sprite('easel',151,118,1.4);framed(42,69,27,35,C.teal);framed(30,78,21,28,C.purple);table(200,140,45,19);for(let i=0;i<5;i++){R([C.red,C.blue,C.gold,C.teal,C.paper][i],182+i*7,133,5,9);}R(C.blue,107,131,4,2);R(C.red,165,140,3,2);if(settings.people)sprite('peacock',58,133);pot(226,165);
 }else if(id==='ducks'){
  for(let i=0;i<4;i++)bed(29+i*54,65,35,[C.blue,C.teal,'#c27d78',C.purple][i],true);
  rug(41,112,115,45,'#6e9ba5');table(195,120,36,22);R(C.paper,186,124,18,10);R(C.gold,43,132,7,6);R(C.red,65,145,7,5);R(C.light,212,151,18,12);R(C.cream,213,150,16,3);
  if(settings.people){sprite('duck',193,105);for(const [x,y] of [[62,125],[86,139],[113,123],[134,145]])sprite('duckling',x,y);}pot(226,165);
 }else if(id==='loft'){
  poly(C.dark,[[16,13],[32,13],[56,52],[16,52]]);poly(C.dark,[[224,13],[240,13],[240,52],[200,52]]);windowAt(95,18,65,27);R(C.paper,106,32,12,2);R(C.paper,139,27,9,2);
  bed(31,71,47,C.blue,true);table(183,81,77,22);R(C.cream,157,83,39,16);L(C.blue,[[159,96],[168,88],[177,91],[186,86],[192,97]]);R(C.paper,205,82,8,5);R(C.paper,207,88,8,4);chair(47,141,C.blue);rug(91,124,72,32,C.blue);if(settings.people)sprite('pigeon',196,125);pot(226,165);
 }else if(id==='library'){
  shelf(73,19,108,33);shelf(24,58,29,57);shelf(204,58,29,57);sprite('owlGlasses',170,78);counter(142,84,62,19,C.teal);
  rug(30,131,65,28,C.teal);chair(50,145,C.teal);table(80,139,22,13);sprite('book',80,146);cafe(182,133);sprite('book',181,143);pot(228,165);
 }else if(id==='museum'){
  R(C.dark,83,17,88,30);R('#c5c0a7',85,19,84,26);L(C.cream,[[96,37],[107,30],[116,32],[124,27],[139,30],[149,24],[158,26]],3);for(let i=0;i<7;i++)L(C.cream,[[104+i*7,30],[103+i*7,39]],1);
  for(const [n,key] of ['seashell','plume','fossil','petal','shard','star'].entries())caseAt(n<3?47:209,79+n%3*34,key);
  sprite('curator',130,74);counter(107,78,46,17,'#a4a590');rug(104,112,49,52,C.blue);
 }
 if(settings.people)sprite('pip',128,169);
 if(settings.walkways&&!mini){R('rgba(178,231,224,.28)',116,104,24,67);for(let y=112;y<170;y+=12)R(C.paper,127,y,2,3);}
}

const cache=new Map(),boxes=new Map();let hitList=[];const settings={people:false,walkways:false};
function hit(b,kind){hitList.push({x:b[0],y:b[1],w:b[2],h:b[3],kind});}
function art(id){if(!cache.has(id)){const c=mk(256,192,()=>{});roomScene(id,'furnished',c);cache.set(id,c);boxes.set(id,hitList);}return cache.get(id);}
return {art,hits(id){art(id);return boxes.get(id);}};
})();
