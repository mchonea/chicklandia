import fs from 'fs';let s=fs.readFileSync('src/ui/render.js','utf8');
const add=`function drawTrainingPage(){
  ctx.fillStyle='rgba(18,10,30,0.94)';ctx.fillRect(0,0,W,H);box(4,4,W-8,H-8,'#241838','#ff9cd0');
  txt('SKILL TRAINING',W/2,12,9,'#ff9cd0',{align:'center',shadow:true});
  Object.keys(TRAIN).forEach((k,i)=>{const t=TRAIN[k],y=25+i*34,st=G.train[k]||0,done=has(k);
    const stat=done?'DONE!':st===2?'Learn it! (E)':st===1?trainCount(k)+'/'+t.need:t.avail()?'Talk to '+t.whoName:'locked';
    const col=done?'#94dc64':(st>=1||t.avail())?'#ffd83a':'#8a7ab0';
    box(10,y,W-20,30,done?'#23402a':'#1d1430',done?'#94dc64':st>=1?'#ff9cd0':'#4a3a66');
    txt(t.title+' ('+t.skill+')',16,y+5,5,'#fff8ec');txt(stat,W-16,y+5,5,col,{align:'right'});
    const info=done?t.whoName+' taught you!':st===1?trainMsg(k):t.avail()?'Ready! Find '+t.whoName+'.':t.lock;
    wrapTxt(info,16,y+16,W-34,5,done?'#94dc64':'#b8a8d8');});
  txt('Pink ! over a friend = training ready    X: next page',W/2,H-12,5,'#b8a8d8',{align:'center'});
}
function wrapTxt(s,x,y,w,sz,c){let line='',yy=y;for(const wd of s.split(' ')){const t=line?line+' '+wd:wd;if(measure(t,sz)>w&&line){txt(line,x,yy,sz,c);yy+=8;line=wd;}else line=t;}if(line)txt(line,x,yy,sz,c);}
`;
s=s.replace('function cloud(',()=>add+'function cloud(');fs.writeFileSync('src/ui/render.js',s);
