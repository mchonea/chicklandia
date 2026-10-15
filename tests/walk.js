/* Chicklandia test walker. Load in a ?debug=1 page:  (0,eval)(await (await fetch('tests/walk.js')).text())
   Defines window.walkTo(x,y): breadth-first path on a 4px grid through real collision, then walks Pip with real key input. */
window.walkTo=function(tx,ty,maxFrames=9000){
  const c=window.__chick,G=c.G,S=4,key=(x,y)=>x+','+y,start={x:Math.round(P.x/S)*S,y:Math.round(P.y/S)*S},goal={x:Math.round(tx/S)*S,y:Math.round(ty/S)*S};
  const q=[start],prev=new Map([[key(start.x,start.y),null]]);let found=null;
  while(q.length){const n=q.shift();if(Math.abs(n.x-goal.x)<=S&&Math.abs(n.y-goal.y)<=S){found=n;break;}
    for(const [dx,dy] of [[S,0],[-S,0],[0,S],[0,-S]]){const x=n.x+dx,y=n.y+dy;if(x<8||x>MW*16-8||y<8||y>MH*16-8)continue;const k=key(x,y);if(prev.has(k)||pBlocked(x,y)||(window.WALK_AVOID&&window.WALK_AVOID.includes(tileAt(Math.floor(x/16),Math.floor((y-3)/16)))))continue;prev.set(k,n);q.push({x,y});}}
  if(!found)return {ok:false,why:'no path'};
  const path=[];for(let n=found;n;n=prev.get(key(n.x,n.y)))path.unshift(n);
  let h0=G.hearts,dmg=0,i=0,f=0,stuck=0;
  while(i<path.length&&f<maxFrames){if(state==='faint'||state==='talk')break;
    const w=path[i],dx=w.x-P.x,dy=w.y-P.y;if(Math.abs(dx)<2&&Math.abs(dy)<2){i++;continue;}
    keys.left=dx<-1.5;keys.right=dx>1.5;keys.up=dy<-1.5;keys.down=dy>1.5;
    const px=P.x,py=P.y;c.step(1);f++;
    if(Math.abs(P.x-px)+Math.abs(P.y-py)<0.05&&!trans&&state==='play'){if(++stuck>40){i++;stuck=0;}}else stuck=0;
    if(G.hearts<h0){dmg+=h0-G.hearts;h0=G.hearts;}}
  for(const k of ['up','down','left','right'])keys[k]=false;
  return {ok:i>=path.length,dmg,frames:f,pos:[Math.round(P.x),Math.round(P.y)]};
};
