'use strict';
/* ---------------- loop ---------------- */
function update(){
  tick++;
  if(pressed.mute){musicOn=!musicOn;applyVolumes();if(G&&state!=='title')toast(musicOn?'Music on':'Music off','#a6e0ff');}
  if(fade>0&&(state==='play'||state==='title')&&!trans){fade=Math.max(0,fade-0.04);}
  if(G&&(state==='play'||state==='talk'||state==='warp'))updateEnv();
  wantTrack=state==='title'?'farm':state==='egg'?'mini':G?pickTrack():'farm';
  switch(state){
    case 'title':updateTitle();break;
    case 'play':G.time++;updatePlay();break;
    case 'talk':G.time++;updateTalk();updateAmbient();break;
    case 'wardrobe':updateWardrobe();break;
    case 'egg':updateEgg();break;
    case 'sleep':updateSleep();break;
    case 'pause':updatePause();break;
    case 'rankup':updateRankUp();break;
    case 'catalog':updateCatalog();break;
    case 'plant':updatePlant();break;
    case 'festival':updateFestival();break;
    case 'pinch':updatePinch();break;
    case 'credits':updateCredits();break;
    case 'grow':updateGrow();updateAmbient();break;
    case 'quests':if(pressed.b){{const pg=questPages();questPage=pg[(pg.indexOf(questPage)+1)%pg.length];}SFX.menu();}else if(pressed.quest||pressed.back||pressed.a||pressed.grow){state='play';SFX.menu();}break;
    case 'map':updateMap();break;
    case 'flying':updateFlying();break;
    case 'p2intro':updateP2Intro();break;
    case 'faint':updateFaint();updateAmbient();break;
    case 'warp':updateWarp();updateAmbient();break;
    case 'ending':updateEnding();break;
  }
  for(const k in pressed)pressed[k]=false;
}
let last=performance.now(),acc=0;
function frame(now){
  const dpr=window.devicePixelRatio||1;
  if(cv.width!==Math.floor(innerWidth*dpr)||cv.height!==Math.floor(innerHeight*dpr))resize();
  acc+=Math.min(100,now-last);last=now;
  while(acc>=1000/60){update();acc-=1000/60;}
  if(tick%10===0)updateTouchUI();
  render();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
if(/[?&]debug=1(&|$)/.test(location.search))window.__chick={get G(){return G},get P(){return P},get state(){return state},set state(v){state=v},newGame,continueGame,get ents(){return ents},SKILLS,startPart2,openMap,talk(id){talkTo(ents.find(e=>e.id===id));},step(n=1){for(let i=0;i<n;i++)update();render();},get FLY(){return FLY},get mapSel(){return mapSel},get MG(){return MG},get EG(){return EG},get track(){return curTrack},startEgg,startMG,rollWeather,
  tp(x,y){P.x=x;P.y=y;CS={x:Math.floor(x/256),y:Math.floor(y/192)};camX=CS.x*256;camY=CS.y*192;G.visited.add(CS.x+','+CS.y);resetEnemies();}};
