'use strict';
/* ---------------- growth tree ---------------- */
const SKILLS=[
  {id:'down',name:'FLUFFY DOWN',cost:2,req:[],x:30,y:70,desc:'Grow extra fluffy feathers. +1 heart!',learn:'+1 heart! So fluffy!'},
  {id:'quick',name:'QUICK FEET',cost:2,req:[],x:30,y:118,desc:'Scurry around the farm much faster.',learn:'You scurry faster now!'},
  {id:'peck',name:'STRONG PECK',cost:3,req:['down'],x:78,y:70,desc:'Smash rocks and crates, shake apple trees, and give foxes a real OUCH.',learn:'Smash rocks, crates & shake apple trees!'},
  {id:'hop',name:'HOP',cost:3,req:['quick'],x:78,y:118,desc:'Walk into a hay bale to hop right over it. Taught by Clyde the horse.',learn:'Walk into hay bales to hop over them!'},
  {id:'tough',name:'TOUGH FEATHERS',cost:4,req:['peck'],x:126,y:70,desc:'Sturdier feathers that shrug off bumps. +1 heart!',learn:'+1 heart! Tough as nails!'},
  {id:'flutter',name:'FLUTTER',cost:4,req:['hop'],x:126,y:118,desc:'Flap your little wings to glide right over water.',learn:'You can flutter over water now!'},
  {id:'flap',name:'WING FLAP',cost:5,req:['tough','flutter'],x:176,y:94,desc:'Press X to gust away leaves and geese! Taught by Sir Cluckington.',learn:'Press X to WING FLAP!'},
  {id:'fly',name:'FLIGHT',cost:7,req:['flap'],x:226,y:94,desc:'Real, true FLIGHT! Head to the Big Fence and soar right over it!',learn:'You can FLY! Go to the Big Fence!'}
];
const SKILLS2=[
  {id:'swim',name:'SWIM',cost:4,req:[],x:44,y:72,desc:'Paddle through deep rivers and the ocean! Taught by Lifeguard Sandy.',learn:'You can swim in deep water!'},
  {id:'glide',name:'GLIDE',cost:4,req:[],x:44,y:120,desc:'Spread your wings and glide right over chasms and gaps.',learn:'You can glide over chasms!'},
  {id:'super',name:'SUPER PECK',cost:5,req:['glide'],x:120,y:120,desc:'A peck so mighty it smashes huge boulders! Taught by Bucky the beaver.',learn:'SUPER PECK smashes boulders!'},
  {id:'golden',name:'GOLDEN WINGS',cost:8,req:['swim','super'],x:204,y:96,desc:'Shimmering golden wings! +1 heart and even faster feet.',learn:'+1 heart and speed! So shiny!'}
];
let growPage=0;
const TREE=()=>growPage?SKILLS2:SKILLS;
const STAGE_NAMES=['TEENY PEEP','LITTLE CHICK','GROWING CHICK','BIG CHICK','ALMOST A CHICKEN'];
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
function titleOptions(){return loadSave()?['CONTINUE','NEW GAME']:['NEW GAME'];}
function updateTitle(){
  const opts=titleOptions();
  if(pressed.up||pressed.down){titleSel=(titleSel+1)%opts.length;SFX.menu();}
  titleSel=Math.min(titleSel,opts.length-1);
  if(pressed.a){SFX.pick();if(opts[titleSel]==='CONTINUE')continueGame();else newGame();}
}
function updateFaint(){
  FT++;
  if(FT<=50){fade=FT/50;fadeColor='#000';}
  if(FT===50){P=newPlayer(56,76);CS={x:0,y:0};camX=0;camY=0;G.hearts=maxHearts();resetEnemies();TRAIL=[];
    for(const d of ents)if(d.type==='duckling'&&d.mode==='follow'){d.x=P.x;d.y=P.y;}}
  if(FT>50)fade=Math.max(0,1-(FT-50)/50);
  if(FT>=100){state='play';const m=ents.find(e=>e.id==='mom');say([{who:m,text:"Oh my! You came home all tuckered out, sweet pea. Rest up... there, all better!"}]);}
}

