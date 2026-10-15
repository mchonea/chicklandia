// Isolated art study: production rendering and world coordinates are unchanged.
draw(3,0);
const lowScene=document.getElementById('scene3');
const lowStrip=document.getElementById('strip3');
document.querySelector('main').innerHTML=`<header><div class="eyebrow">Chicklandia / Bright Adventure / resolution study</div><h1>A little more room for personality.</h1><p>Same world size and palette. Left: 16 px tiles. Right: 24 px tiles, with newly drawn details.</p></header><section><article><small>01 / original pixel density</small><h2>Bright Adventure · 16 px</h2><p>The first concept, shown at 3× scale. Bold and chunky, with a very small pixel budget for faces.</p><canvas id="low" width="192" height="128"></canvas><h3>Sprite close-up</h3><canvas id="loDetail" width="96" height="32"></canvas></article><article><small>02 / 1.5× pixel resolution</small><h2>Bright Adventure · 24 px</h2><p>Shown at 2× scale for the same world size. Finer outlines, expressive eyes, feather shading and leaf clusters.</p><canvas id="high" width="288" height="192"></canvas><h3>Sprite close-up</h3><canvas id="hiDetail" width="144" height="48"></canvas></article></section><footer>Concept only • Both scenes have identical framing and occupy the same displayed size • Whole-number display scaling, no smoothing<br>24 px tiles offer 2.25× as many pixels per tile. A full-game equivalent would be 384 × 336, up from 256 × 224.<br>The proposed scene redraws Pip, the hen, trees, grass, paths, water, fences and coop tiles. Apple and seed remain scaled placeholders.</footer>`;
document.head.insertAdjacentHTML('beforeend',`<style>main{width:1220px;margin:24px auto}section{gap:16px}article{padding:12px}canvas{width:576px;height:384px}h3{font-size:12px;color:#bac5bf;margin:14px 0 6px}#loDetail,#hiDetail{width:576px;height:192px}article p{min-height:40px}footer{line-height:1.8}header p{font-size:14px}</style>`);
const lo=document.getElementById('low').getContext('2d');lo.drawImage(lowScene,0,0);
Object.assign(PAL,original,palettes[3]);
function tile24(fn){return mk(24,24,fn)}
function grass24(v){return tile24(x=>{P_(x,'g',0,0,24,24);if(v===0){P_(x,'G',5,16,2,1);P_(x,'G',6,15);P_(x,'l',17,6,2,1)}if(v===1){P_(x,'G',17,10,2,1);P_(x,'l',5,20)}})}
const grassHi=[0,1,2].map(grass24);
const treeHi=tile24(x=>{x.drawImage(grassHi[2],0,0);P_(x,'G',5,20,16,3);P_(x,'k',10,14,5,10);P_(x,'B',11,14,3,9);P_(x,'b',11,16,1,6);P_(x,'T',11,19,1,2);
// Each row describes a deliberate hard-edged canopy silhouette.
const widths=[6,10,14,16,18,20,20,22,22,22,22,22,20,20,18,14,10];
widths.forEach((w,y)=>{const a=(24-w)/2;P_(x,'k',a,y,w,1);if(y>0&&y<16){P_(x,y>11?'G':'g',a+1,y,w-2,1);}});
[[8,2,5,2],[5,4,6,2],[3,7,5,2],[11,4,4,1]].forEach(a=>P_(x,'l',...a));
[[14,7,5,2],[11,10,8,3],[6,13,11,2],[18,9,3,4]].forEach(a=>P_(x,'G',...a));P_(x,'g',7,11,3,1);P_(x,'g',13,14,3,1);P_(x,'l',5,6,2,1);
});
const dirtHi=tile24(x=>{P_(x,'t',0,0,24,24);[[3,5],[16,3],[10,18],[20,15],[5,21]].forEach(([a,b])=>{P_(x,'T',a,b,2,1);P_(x,'n',a,b-1)});});
const waterHi=tile24(x=>{P_(x,'u',0,0,24,24);[[3,4],[15,12],[6,20]].forEach(([a,b])=>{P_(x,'U',a+1,b+1,5,1);P_(x,'c',a,b,5,1);P_(x,'w',a+1,b,2,1)});});
const flowerHi=tile24(x=>{x.drawImage(grassHi[2],0,0);P_(x,'G',12,13,1,5);P_(x,'l',13,16,2,1);P_(x,'p',11,10,3,5);P_(x,'p',10,11,5,3);P_(x,'w',11,10,2,1);P_(x,'y',12,12)});
const fenceHi=tile24(x=>{x.drawImage(grassHi[2],0,0);for(const y of [6,14]){P_(x,'k',0,y-1,24,4);P_(x,'T',0,y,24,1);P_(x,'b',0,y+1,24,1)}P_(x,'k',8,1,7,22);P_(x,'T',9,2,5,1);P_(x,'b',9,3,5,18);P_(x,'B',13,3,1,18);P_(x,'T',9,4,1,14)});
const roofHi=tile24(x=>{P_(x,'B',0,0,24,24);for(let j=0;j<24;j+=6){P_(x,'b',0,j,24,5);P_(x,'T',0,j,24,1);for(let a=(j%12?6:0);a<24;a+=12)P_(x,'B',a,j,1,5)}});
const wallHi=tile24(x=>{P_(x,'t',0,0,24,24);for(let y=5;y<24;y+=6){P_(x,'T',0,y,24,1);P_(x,'n',0,y+1,24,1)}P_(x,'k',0,0,24,1)});
const doorHi=tile24(x=>{x.drawImage(wallHi,0,0);P_(x,'k',5,5,14,19);P_(x,'B',6,6,12,18);P_(x,'b',7,7,1,14);P_(x,'b',11,7,1,14);P_(x,'y',7,20,10,4);P_(x,'Y',9,22,2,1)});
const pipHi=makeSprite([
'.......yy.........',
'.....yyyyyy.......',
'....yywwyyyy......',
'...yywwwwyyyy.....',
'...yyyyyyyyyy.....',
'...ykkyyyykky.....',
'...ywkyyyywky.....',
'...yyyyyyyyyy.....',
'...pyyoooyypy.....',
'....yyYoYyyy......',
'.....yyyyyy.......',
'...yyyyyyyyyy.....',
'..yYyyyyyyyyYy....',
'..yYYyyyyyyYYy....',
'..yYYYyyyyYYYy....',
'...yYYYYYYYYy.....',
'....YYYYYYYY......',
'.....oo..oo.......',
'....ooo..ooo......']);
const henHi=makeSprite([
'.........rr..........','........rrrr.........','.......rrRrr.........','......tttttttt.......','.....ttnntttttt......','....ttnnnntttttt.....','....ttkttttttktt.....','....ttkttttttktt.....','....tttttoottttt.....','.....ttttootttt......','......ttrrtttt.......','....ttttrRtttttt.....','...tttttRRttttttt....','..tttTTwwwwwwTTttt...','..ttTTwwwwwwwwTTtt...','..ttTTTwwwwwwTTTtt...','...ttTTTwwwwTTTtt....','....ttTTwwwwTTtt.....','.....ttttwwtttt......','......tttttttt.......','........o..o.........','.......oo..oo........']);
const h=document.getElementById('high').getContext('2d');h.imageSmoothingEnabled=false;
map.slice(0,8).forEach((row,y)=>[...row.slice(0,12)].forEach((c,x)=>h.drawImage(c==='F'?fenceHi:c==='T'?treeHi:c==='d'?dirtHi:c==='W'?waterHi:c===','?flowerHi:grassHi[(x*7+y*3)%3],x*24,y*24)));
for(let y=1;y<4;y++)for(let x=2;x<6;x++)h.drawImage(y<3?roofHi:wallHi,x*24,y*24);h.drawImage(doorHi,72,72);
function putHi(s,x,y){h.fillStyle=PAL.G;h.fillRect(x+3,y+s.height-2,s.width-5,3);h.drawImage(s,x,y)}
putHi(pipHi,173,137);putHi(henHi,227,90);
h.drawImage(sets[3].seed,114,168,Math.round(sets[3].seed.width*1.5),Math.round(sets[3].seed.height*1.5));
function detail(id,sprites,step){const x=document.getElementById(id).getContext('2d');x.fillStyle='#28313a';x.fillRect(0,0,x.canvas.width,x.canvas.height);sprites.forEach((s,i)=>x.drawImage(s,Math.round(8*step+i*46*step),Math.round((x.canvas.height-s.height)/2)))}
detail('loDetail',[sets[3].front,sets[3].hen],1);detail('hiDetail',[pipHi,henHi],1.5);
