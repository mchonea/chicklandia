'use strict';
/* ---------------- audio ---------------- */
let AC=null,master=null,musicGain=null,musicOn=true,noiseBuf=null;
function initAudio(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=0.55;master.connect(AC.destination);
    musicGain=AC.createGain();musicGain.gain.value=musicOn?1:0;musicGain.connect(master);
    noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    startMusic();}catch(e){AC=null;}
}
function tone(f,d,type='square',v=0.1,slide=0,when=0,dest){
  if(!AC)return;const t=AC.currentTime+Math.max(0,when);const o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0008,t+d);o.connect(g);g.connect(dest||master);o.start(t);o.stop(t+d+0.03);
}
function noise(d,v=0.15,freq=1200){
  if(!AC)return;const t=AC.currentTime;const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=freq;
  const g=AC.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+0.05);
}
const SFX={
  peck:()=>tone(900,0.05,'square',0.05,-400),
  blip:p=>tone(p,0.03,'square',0.03),
  pick:()=>{tone(880,0.07,'square',0.06);tone(1320,0.1,'square',0.06,0,0.07);},
  seed:()=>[660,880,1100,1320].forEach((f,i)=>tone(f,0.08,'square',0.05,0,i*0.05)),
  chirp:()=>{tone(1500,0.05,'square',0.04,600);tone(1700,0.05,'square',0.04,600,0.07);},
  hurt:()=>tone(320,0.25,'sawtooth',0.09,-230),
  hop:()=>tone(300,0.16,'square',0.05,500),
  brk:()=>{noise(0.2,0.25,900);tone(120,0.1,'square',0.05,-40);},
  clunk:()=>tone(150,0.08,'square',0.06,-50),
  tickle:()=>tone(1200,0.06,'triangle',0.06,300),
  honk:()=>{tone(270,0.15,'sawtooth',0.08,-60);tone(250,0.18,'sawtooth',0.06,-60,0.17);},
  gust:()=>noise(0.45,0.16,2000),
  lvl:()=>[523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,0.12,'square',0.06,0,i*0.08)),
  quest:()=>[784,988,1175,1568].forEach((f,i)=>tone(f,0.16,'triangle',0.12,0,i*0.1)),
  menu:()=>tone(700,0.04,'square',0.04),
  door:()=>{tone(220,0.08,'square',0.05);tone(330,0.1,'square',0.05,0,0.09);},
  deny:()=>tone(200,0.14,'square',0.06,-60),
  flap:()=>noise(0.1,0.08,1500),
  fanfare:()=>[523,523,523,659,784,659,784,1047].forEach((f,i)=>tone(f,i===7?0.6:0.14,'square',0.07,0,[0,.12,.24,.36,.6,.84,.96,1.2][i]))
};
Object.assign(SFX,{
  step:k=>{if(k==='wood')tone(190,0.03,'triangle',0.035);else if(k==='stone')tone(150,0.03,'square',0.018);else if(k==='straw')noise(0.04,0.03,2500);else noise(0.035,0.035,700);},
  splash:()=>{noise(0.15,0.09,3000);tone(900,0.06,'sine',0.03,-500);},
  cricket:()=>{const f=4000+Math.random()*600;for(let i=0;i<3;i++)tone(f,0.025,'sine',0.012,0,i*0.06);},
  hoot:()=>{tone(392,0.22,'sine',0.045,-20);tone(370,0.35,'sine',0.045,-30,0.32);},
  birdy:()=>{const f=1800+Math.random()*900;tone(f,0.06,'sine',0.025,500);tone(f*1.2,0.08,'sine',0.025,-400,0.09);},
  thunder:()=>{noise(1.8,0.4,260);noise(0.6,0.25,600);},
  crow:()=>{tone(520,0.14,'sawtooth',0.05,220);tone(700,0.12,'sawtooth',0.05,120,0.16);tone(820,0.5,'sawtooth',0.05,-260,0.3);},
  cash:()=>{tone(1320,0.06,'square',0.05);tone(1760,0.18,'square',0.05,0,0.07);},
  chest:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,0.18,'triangle',0.1,0,i*0.07)),
  push:()=>noise(0.18,0.12,500),
  click:()=>tone(1000,0.05,'square',0.05),
  gate:()=>{noise(0.4,0.15,700);[392,523,659,784].forEach((f,i)=>tone(f,0.15,'triangle',0.09,0,0.3+i*0.08));},
  catchEgg:()=>tone(1100,0.06,'square',0.045,300),
  crackEgg:()=>{noise(0.12,0.15,1800);tone(300,0.1,'square',0.04,-150);},
  pop:()=>tone(500,0.06,'sine',0.05,500),
  bonk:()=>{tone(700,0.05,'square',0.06,-300);noise(0.05,0.1,1500);},
  magic:()=>[880,1109,1319,1760,2217].forEach((f,i)=>tone(f,0.25,'sine',0.05,0,i*0.06)),
  lullaby:()=>[784,659,523,659,784,1047].forEach((f,i)=>tone(f,0.35,'sine',0.06,0,i*0.28)),
  questDone:()=>[523,659,784,1047,0,784,1047].forEach((f,i)=>{if(f)tone(f,0.16,'square',0.06,0,i*0.09);})
});
/* music: one track per area, switched on bar boundaries */
const TRACKS={
  farm:{bpm:138,lead:'square',lv:0.028,len:0.85,bass:'triangle',bv:0.07,
    mel:[72,0,76,79,81,79,76,0, 77,0,81,0,79,76,72,0, 74,76,77,0,76,74,72,0, 74,0,67,0,71,74,79,0, 72,0,76,79,81,79,76,0, 81,0,84,0,81,79,76,0, 77,76,74,0,79,0,71,0, 72,0,67,0,72,0,0,0],
    ch:[[48,55],[53,60],[43,50],[43,50],[48,55],[53,60],[43,50],[48,55]]},
  night:{bpm:84,lead:'triangle',lv:0.05,len:1.8,bass:'sine',bv:0.06,
    mel:[76,0,0,79,76,0,74,0, 72,0,0,0,69,0,0,0, 74,0,0,76,74,0,72,0, 71,0,0,0,67,0,0,0, 76,0,0,79,81,0,79,0, 76,0,0,74,72,0,0,0, 74,0,76,0,74,0,71,0, 72,0,0,0,0,0,0,0],
    ch:[[48,55],[45,52],[41,48],[43,50],[48,55],[41,48],[43,50],[48,55]]},
  indoor:{bpm:112,lead:'triangle',lv:0.05,len:0.9,bass:'triangle',bv:0.06,
    mel:[65,69,72,69,70,0,69,0, 67,70,74,70,72,0,0,0, 69,72,77,72,76,74,72,70, 69,0,67,0,65,0,0,0, 65,69,72,69,70,0,69,0, 67,70,74,70,72,0,74,0, 77,0,76,74,72,0,70,69, 67,0,69,67,65,0,0,0],
    ch:[[41,48],[36,43],[36,43],[41,48],[41,48],[46,53],[36,43],[41,48]]},
  pond:{bpm:118,lead:'triangle',lv:0.045,len:1.1,bass:'sine',bv:0.07,
    mel:[67,71,74,79,0,74,71,0, 72,76,79,84,0,79,76,0, 74,78,81,86,0,81,78,0, 79,0,74,0,71,0,0,0, 67,71,74,79,0,74,71,0, 72,76,79,84,0,79,76,0, 74,0,78,0,81,0,78,74, 79,0,0,0,0,0,0,0],
    ch:[[43,50],[48,55],[50,57],[43,50],[43,50],[48,55],[50,57],[43,50]]},
  cave:{bpm:92,lead:'square',lv:0.022,len:1.2,bass:'triangle',bv:0.07,
    mel:[69,0,0,72,0,0,71,0, 69,0,0,0,0,0,64,0, 65,0,0,69,0,0,68,0, 64,0,0,0,0,0,0,0, 69,0,72,0,76,0,75,0, 76,0,72,0,69,0,0,0, 65,0,0,64,0,0,68,0, 69,0,0,0,0,0,0,0],
    ch:[[45,52],[45,52],[41,48],[40,47],[45,52],[45,52],[38,45],[40,47]]},
  grove:{bpm:100,lead:'sine',lv:0.07,len:1.6,bass:'sine',bv:0.05,
    mel:[74,78,81,86,81,78,74,0, 76,79,83,88,83,79,76,0, 78,81,85,90,85,81,78,0, 79,0,78,0,76,0,0,0, 74,0,81,0,86,0,85,83, 81,0,78,0,76,0,0,0, 79,81,83,85,86,0,85,0, 86,0,0,0,0,0,0,0],
    ch:[[50,57],[52,59],[54,61],[55,62],[50,57],[55,62],[57,64],[50,57]]},
  mini:{bpm:172,lead:'square',lv:0.03,len:0.8,bass:'triangle',bv:0.07,
    mel:[72,74,76,79,76,74,72,0, 72,74,76,79,84,0,79,0, 77,76,74,77,76,74,72,76, 74,72,71,74,72,0,67,0, 72,76,79,84,79,76,72,76, 74,77,81,86,81,77,74,77, 76,79,84,79,77,81,86,81, 79,0,83,0,84,0,0,0],
    ch:[[48,55],[48,55],[53,60],[48,55],[48,55],[50,57],[43,50],[48,55]]},
  forest:{bpm:104,lead:'triangle',lv:0.05,len:1.1,bass:'triangle',bv:0.06,
    mel:[67,0,71,0,74,0,72,71, 69,0,72,0,71,0,0,0, 67,0,71,0,74,0,76,74, 72,0,71,0,69,0,0,0, 71,0,74,0,79,0,78,76, 74,0,72,0,71,0,69,0, 67,0,69,71,72,0,71,69, 67,0,0,0,0,0,0,0],
    ch:[[43,50],[50,57],[43,50],[48,55],[43,50],[50,57],[48,55],[43,50]]},
  mountains:{bpm:96,lead:'square',lv:0.025,len:1.4,bass:'triangle',bv:0.07,
    mel:[74,0,0,0,78,0,81,0, 79,0,0,0,76,0,0,0, 74,0,0,0,78,0,81,0, 86,0,0,0,85,0,0,0, 83,0,81,0,79,0,78,0, 76,0,0,0,79,0,0,0, 78,0,76,0,74,0,73,0, 74,0,0,0,0,0,0,0],
    ch:[[50,57],[55,62],[50,57],[45,52],[55,62],[52,59],[45,52],[50,57]]},
  city:{bpm:128,lead:'square',lv:0.028,len:0.7,bass:'triangle',bv:0.07,
    mel:[72,0,75,76,0,72,0,0, 79,0,76,0,72,0,74,0, 72,0,75,76,0,79,0,81, 79,0,76,0,74,0,0,0, 77,0,76,0,74,0,72,0, 74,0,76,0,79,0,0,0, 81,79,77,76,74,72,71,74, 72,0,0,0,0,0,0,0],
    ch:[[48,55],[48,55],[45,52],[43,50],[41,48],[43,50],[41,48],[48,55]]},
  beach:{bpm:132,lead:'triangle',lv:0.05,len:0.7,bass:'triangle',bv:0.07,
    mel:[65,0,69,72,0,69,0,72, 74,0,72,0,69,0,0,0, 70,0,74,77,0,74,0,77, 76,0,74,0,72,0,0,0, 65,0,69,72,0,69,72,74, 77,0,76,0,74,72,0,0, 70,72,74,0,72,70,69,67, 65,0,0,0,0,0,0,0],
    ch:[[41,48],[41,48],[46,53],[36,43],[41,48],[46,53],[36,43],[41,48]]}
};
let curTrack='farm',wantTrack='farm',nextT=0,step=0,rainGain=null;
const mf=n=>440*Math.pow(2,(n-69)/12);
function startMusic(){
  nextT=AC.currentTime+0.1;
  // rain: looped filtered noise whose volume follows the weather
  const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=2600;f.Q.value=0.5;
  rainGain=AC.createGain();rainGain.gain.value=0;s.connect(f);f.connect(rainGain);rainGain.connect(master);s.start();
  setInterval(()=>{
    if(!AC)return;if(nextT<AC.currentTime-0.2)nextT=AC.currentTime+0.05;
    while(nextT<AC.currentTime+0.3){
      if(wantTrack!==curTrack&&step%8===0){curTrack=wantTrack;step=0;}
      const T=TRACKS[curTrack],STEP=60/T.bpm/2;
      const m=T.mel[step%64],bar=Math.floor((step%64)/8),bs=step%8,w=nextT-AC.currentTime;
      if(m)tone(mf(m),STEP*T.len,T.lead,T.lv,0,w,musicGain);
      if(bs%2===0)tone(mf(T.ch[bar][bs%4===0?0:1]),STEP*1.7,T.bass,T.bv,0,w,musicGain);
      nextT+=STEP;step++;
    }
  },60);
}

