'use strict';
/* ---------------- palette & helpers ---------------- */
const PAL={k:'#21142b',w:'#fff8ec',y:'#ffd83a',Y:'#e8a422',o:'#f37d22',r:'#e03838',R:'#962430',
  p:'#f6a6b6',P:'#d06f8a',b:'#9a6234',B:'#5e3a1c',g:'#5cb84c',G:'#2f7d3a',l:'#94dc64',u:'#3a86e8',
  U:'#1f55a8',c:'#a6e0ff',e:'#a8a8b8',E:'#62627a',t:'#ecd09a',T:'#c49a5c',n:'#f6ead0',f:'#ec6c24',
  q:'#ffd21e',Q:'#c98a00',m:'#7a5230'};
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function hash2(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return (h^(h>>>16))>>>0;}
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x);return c;}
function P_(x,col,i,j,w=1,h=1){x.fillStyle=PAL[col]||col;x.fillRect(i,j,w,h);}
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function makeSprite(rows,outline=true){
  const pad=outline?1:0,h=rows.length,w=Math.max(...rows.map(r=>r.length));
  return mk(w+pad*2,h+pad*2,x=>{
    const filled=(i,j)=>{if(j<0||j>=h)return false;const ch=rows[j][i];return !!ch&&ch!=='.'&&ch!==' ';};
    if(outline){x.fillStyle=PAL.k;
      for(let j=-1;j<=h;j++)for(let i=-1;i<=w;i++){if(filled(i,j))continue;
        if(filled(i-1,j)||filled(i+1,j)||filled(i,j-1)||filled(i,j+1))x.fillRect(i+pad,j+pad,1,1);}}
    for(let j=0;j<h;j++)for(let i=0;i<rows[j].length;i++){const ch=rows[j][i];if(ch==='.'||ch===' ')continue;
      x.fillStyle=PAL[ch]||'#f0f';x.fillRect(i+pad,j+pad,1,1);}
  });
}
const flipMap=new WeakMap();
function flipOf(c){let f=flipMap.get(c);if(f)return f;
  f=mk(c.width,c.height,x=>{x.translate(c.width,0);x.scale(-1,1);x.drawImage(c,0,0);});flipMap.set(c,f);return f;}

