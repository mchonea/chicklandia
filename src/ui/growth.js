'use strict';
/* ---------------- growth tree ---------------- */
let growPage=0;
const TREE=()=>growPage?SKILLS2:SKILLS;
function openGrow(){state='grow';SFX.menu();growMsg=null;growPage=G.part2?1:0;growSel=0;const i=TREE().findIndex(s=>!has(s.id)&&s.req.every(has));if(i>=0)growSel=i;}
function skillState(s){if(has(s.id))return'learned';if(!s.req.every(has))return'locked';if(TRAIN[s.id]&&G.train[s.id]!==2)return'train';return'open';}
function updateGrow(){
  if(lvlAnim>0)lvlAnim--;
  if(pressed.grow||pressed.back||pressed.quest){state='play';SFX.menu();return;}
  if(pressed.b&&G.part2){growPage^=1;growSel=0;growMsg=null;SFX.menu();return;}
  const SKILLS=TREE();
  const cur=SKILLS[growSel];
  const dirs=[['up',0,-1],['down',0,1],['left',-1,0],['right',1,0]];
  for(const [k,dx,dy] of dirs){if(!pressed[k])continue;
    let best=-1,bs=1e9;SKILLS.forEach((s,i)=>{if(i===growSel)return;const vx=s.x-cur.x,vy=s.y-cur.y;const along=vx*dx+vy*dy;if(along<=0)return;
      const perp=Math.abs(vx*dy-vy*dx);const sc=along+perp*2;if(sc<bs){bs=sc;best=i;}});
    if(best>=0){growSel=best;growMsg=null;SFX.menu();}}
  if(pressed.a){
    const st=skillState(cur);
    if(st==='learned'){growMsg={s:'Already learned!',c:'#94dc64'};SFX.deny();}
    else if(st==='locked'){growMsg={s:'Learn '+cur.req.filter(r=>!has(r)).map(r=>SKILLS.find(x=>x.id===r).name).join(' & ')+' first!',c:'#ff8080'};SFX.deny();}
    else if(st==='train'){growMsg={s:trainMsg(cur.id),c:'#ff9cd0'};SFX.deny();}
    else if(G.seeds<cur.cost){growMsg={s:'You need '+(cur.cost-G.seeds)+' more seed'+(cur.cost-G.seeds>1?'s':'')+'. Help the animals!',c:'#ff8080'};SFX.deny();}
    else{G.seeds-=cur.cost;G.skills.add(cur.id);G.hearts=maxHearts();lvlAnim=110;SFX.lvl();growMsg={s:cur.learn,c:'#ffd83a'};toast(cur.name+': '+cur.learn);save();}
  }
}

/* ---------------- ending ---------------- */
function startEnding(){state='ending';END={t:0,phase:1};P.dir=3;P.flying=true;G.won=true;save();SFX.fanfare();}
function updateEnding(){
  END.t++;const t=END.t;
  if(END.phase===1){
    if(t<45)P.z=t*0.35;else{P.x+=1.3;P.z=15.75+(t-45)*0.3;}
    if(t%14===0)SFX.flap();
    if(t>110){fade=Math.min(1,(t-110)/30);fadeColor='#fff';}
    if(t>=145){END.phase=2;END.t=0;}
  }else{
    if(t<40)fade=1-t/40;else fade=0;
    if(t%16===0&&t<600)SFX.flap();
    if(t>420&&pressed.a){END=null;fadeColor='#000';if(!G.part2)startPart2();else{state='title';titleSel=0;fade=1;}}
  }
  updateAmbient();
}

/* ---------------- title ---------------- */
function titleOptions(){if(titleSave===undefined)titleSave=!!loadSave();return titleSave?['CONTINUE','NEW GAME']:['NEW GAME'];}
function updateTitle(){
  const opts=titleOptions();
  if(titleConfirm){
    if(pressed.up||pressed.down||pressed.left||pressed.right){confirmSel^=1;SFX.menu();}
    if(pressed.back||pressed.b){titleConfirm=false;SFX.menu();}
    else if(pressed.a){SFX.pick();titleConfirm=false;if(confirmSel===0)newGame();}
    return;}
  if(pressed.up||pressed.down){titleSel=(titleSel+1)%opts.length;SFX.menu();}
  titleSel=Math.min(titleSel,opts.length-1);
  if(pressed.a){SFX.pick();if(opts[titleSel]==='CONTINUE')continueGame();else if(titleSave){titleConfirm=true;confirmSel=1;}else newGame();}
}
let FAINT_FAR=false;
function updateFaint(){
  FT++;
  if(FT<=50){fade=FT/50;fadeColor='#000';}
  if(FT===50){const far=G.part2&&inBeyond(),sp=far?(G.coop?coopExit():{x:136,y:1067}):{x:56,y:76};
    P=newPlayer(sp.x,sp.y);CS={x:Math.floor(sp.x/256),y:Math.floor(sp.y/192)};camX=CS.x*256;camY=CS.y*192;G.hearts=maxHearts();resetEnemies();TRAIL=[];FAINT_FAR=far;
    for(const d of ents)if(d.type==='duckling'&&d.mode==='follow'){d.x=P.x;d.y=P.y;}}
  if(FT>50)fade=Math.max(0,1-(FT-50)/50);
  if(FT>=100){state='play';const m=ents.find(e=>e.id==='mom');
    if(!FAINT_FAR&&m&&onCur(m))say([{who:m,text:"Oh my! You came home all tuckered out, sweet pea. Rest up... there, all better!"}]);
    else say([{who:'me',text:FAINT_FAR?(G.coop?"Phew... I made it back to my coop. I feel much better!":"Phew... I'm back at the forest. I feel much better!"):"Phew... back home. I feel much better!"}]);}
}

