'use strict';
/* content: what every city shop sells or does. Data first, then the SHOPS table that the catalog UI reads. */
// special garden seeds (Seed & Feed). grow = speed multiplier, yield = seeds per harvest; moon only grows at night and also drops a petal.
const SEED_TYPES={
  plain:{name:'PLAIN SEED',grow:1,yield:3,spr:'seed'},
  pumpkin:{name:'GIANT PUMPKIN',grow:0.4,yield:4,spr:'pumpkin',pumpkin:true,desc:'The autumn contest pumpkin.'},
  speedy:{name:'SPEEDY SPROUT',price:1,grow:2,yield:2,spr:'sprout',desc:'Grows twice as fast! Gives 2 seeds.'},
  giant:{name:'GIANT SUNFLOWER',price:3,grow:0.5,yield:6,spr:'giant',desc:'Slow, but gives a whopping 6 seeds!'},
  moon:{name:'MOONFLOWER',price:2,grow:1,yield:4,night:true,petal:true,spr:'moonSeed',desc:'Only grows at night. Gives 4 seeds and a rare petal for the Museum.'}};
const PLOT_PRICE=6,PLOT_STEP=2,PLOT_MAX_EXTRA=4;
// bakery treats: a buff for one in-game day. They are also new Taste Log foods.
const TREATS=[
  {id:'muffin',name:'CORN MUFFIN',price:2,spr:'muffin',desc:'Warm and sweet!',bonus:'+10% speed for one day.'},
  {id:'bun',name:'SEED BUN',price:2,spr:'sbun',desc:'Crunchy seeds baked on top.',bonus:'Your garden grows 25% faster for one day.'},
  {id:'tart',name:'BERRY TART',price:3,spr:'tart',desc:'Sticky, sweet and bright red.',bonus:'+1 extra heart for one day.'}];
// nest decorations from the toy shop (cosmetic, drawn in Pip's coop)
const TOYS=[
  {id:'flowers',name:'NEST FLOWERS',price:2,spr:'petal',desc:'Pretty pots of flowers for your coop.'},
  {id:'lights',name:'STRING LIGHTS',price:3,spr:'star',desc:'Twinkly lights that glow at night.'},
  {id:'lamp',name:'GOLDEN LAMP',price:4,spr:'token',desc:'A shiny lamp for the middle of the coop.'}];
// library
const BOOKS=[
  {id:'farm',name:'FARM GUIDE',area:'farm'},{id:'forest',name:'FOREST GUIDE',area:'forest'},{id:'mountains',name:'MOUNTAIN GUIDE',area:'mountains'},
  {id:'beach',name:'BEACH GUIDE',area:'beach'},{id:'city',name:'CITY GUIDE',area:'city'}];
const LORE=[
  {name:'HISTORY OF CHICKLANDIA',text:["Long ago, all the animals of Chicklandia lived by one big river. They shared seeds, stories and songs.","Over time they built farms, forests and cities. But they never forgot to look after each other."]},
  {name:'THE FLYING CHICK',text:["An old tale says that one day a tiny chick will learn to fly over the biggest fence of all.","And when that chick grows up, the whole land will celebrate!"]}];
const STORIES=["Once upon a time, a little duck wanted to be a lighthouse. She stood on one foot all night and shone her beak. The ships were VERY confused, but they said thank you.",
  "A grumpy cloud once rained only on one hat. The hat didn't mind. It said, 'I always wanted a pet cloud.'",
  "The moon dropped a button in the pond. Every frog took a turn to sew it back on. It took ten frogs and one very patient snail.",
  "A tiny acorn dreamed of becoming a big, big tree. She dreamed and dreamed. Then she grew, and her dream had acorns of its own."];
// post office: who can get a parcel, and where to find them
const JOB_TARGETS=[
  ['mom','MAMA HEN','in the farm coop yard'],['daisy','DAISY','in the barnyard'],['pig','PORKCHOP','in the orchard'],['clyde','CLYDE','in the barn'],
  ['whiskers','WHISKERS','in the farmhouse'],['biscuit','BISCUIT','in the farmhouse'],['granny','GRANNY SHELL','in the forest'],['bucky','BUCKY','in the deep woods'],
  ['doe','DOE','in the deep woods'],['mo','MO','on the mountain trail'],['elda','ELDA','on the snowy peak'],['pinch','CAPN PINCH','on the beach'],
  ['sandy','LIFEGUARD SANDY','on the beach'],['rocco','ROCCO','by the city fountain (daytime)'],['cleo','CLEO','in the market (daytime)']];

const SHOPS={
  build:{title:'BUILD HERE',owner:'beaver',color:'#c49a5c',leave:'CANCEL',bye:'Take your time. Good builders plan!',
    items:()=>BUILD_ORDER.map(k=>{const t=BUILDING_TYPES[k],c=costOf(k),pad=VB&&VB.pad;
      return {name:t.name,price:c.seeds,icon:'b_'+k,desc:t.desc+' NEEDS: '+costText(Object.assign({},c,{seeds:0})).replace(/^, /,'')+'.',bonus:'Village happiness +'+t.happy+(has('master')?'. Master Builder: half the time!':''),
        off:t.only==='river'&&!(pad&&pad.river),offMsg:'A mill must be built beside the river!',act:()=>tryBuild(k)};})},
  contest:{title:'WINDMILL FESTIVAL',owner:'beaver',color:'#ffd83a',leave:'LEAVE',bye:'See you at the next festival!',
    items:()=>{const i=contestInfo(),s=seasonNow();return [
      {name:i.name,tag:contestDone()?'WON':'ENTER',on:contestDone(),icon:i.icon,desc:i.desc,off:contestDone(),offMsg:'You already won this season! Come back next season.',act:()=>{startContest();}},
      {name:'SEASON: '+s.name,tag:daysToNextSeason()+'d left',icon:'star',desc:'Seasons change every '+SEASON_DAYS+' days. Each season has its own contest.',off:true,offMsg:daysToNextSeason()+' day(s) until the next season.'},
      {name:'WINS SO FAR',tag:''+Object.keys(G.vil.contest).length,icon:'token',desc:'Every contest you win makes the village happier.',off:true,offMsg:'Each win adds '+HAPPY_CONTEST+' happiness.'}];}},
  board:{title:'VILLAGE BOARD',owner:'beaver',color:'#94dc64',leave:'LEAVE',bye:'Our village is growing!',
    items:()=>[
      {name:'HAPPINESS',tag:happiness()+'/'+FINALE_HAPPY,icon:'token',desc:'Buildings, friends moving in and contest wins make the village happy.',off:true,offMsg:happiness()>=FINALE_HAPPY?'Happy enough for the Grand Harvest! Talk to Barnaby.':'Keep building, and help friends move in!'},
      {name:'FRIENDS HOME',tag:Object.keys(G.vil.res).length+'/'+RESIDENTS.length,icon:'mailbox',desc:'Friends write when a building they want exists.',off:true,offMsg:'Check the mailbox for letters!'},
      {name:'MATERIALS',tag:'',icon:'m_wood',desc:matsLine(),off:true,offMsg:matsLine()},
      {name:'BUILDINGS',tag:''+builtList().length+'/'+PADS.length,icon:'b_home',desc:'Pads in the square and by the river.',off:true,offMsg:'Gather wood, stone, wool and clay!'},
      {name:'SEASON',tag:seasonNow().name,icon:'star',desc:'Contests at Windmill Hill each season.',off:true,offMsg:daysToNextSeason()+' day(s) until the next season.'}]},
  boutique:{title:"MAGGIE'S BOUTIQUE",owner:'magpie',color:'#ff9cd0',leave:'LEAVE SHOP',bye:'Come back soon, darling!',
    items:()=>SHOP.map(id=>{const o=OUTFITS.find(x=>x.id===id),own=G.outfits.includes(id);
      return {name:o.name,price:own?null:priceOf(o),tag:own?(wearing(id)?'ON':'OWN'):null,own,on:wearing(id),desc:o.desc,bonus:o.bonus,outfit:id,
        act:()=>{if(own){setWear(id);return {s:wearing(id)?'Wearing it! Gorgeous!':'Taken off.',c:'#94dc64'};}
          return shopBuy(priceOf(o),'Sold! You look FABULOUS!',()=>{grantOutfit(id);setWear(id,true);});}};})},
  seed:{title:'SEED & FEED',owner:'goat',color:'#94dc64',leave:'LEAVE',bye:'Happy planting, sprout!',
    items:()=>[...['speedy','giant','moon'].map(k=>{const t=SEED_TYPES[k];
      return {name:t.name,price:t.price,tag:G.sacks[k]?'x'+G.sacks[k]:null,icon:t.spr,desc:t.desc+' Plant it in a garden plot.',
        act:()=>shopBuy(t.price,'Got a '+t.name+'! Plant it in a plot.',()=>{G.sacks[k]++;})};}),
      {name:'GARDEN PLOTS +2',price:PLOT_PRICE,tag:G.coop?(G.coop.extra||0)+'/'+PLOT_MAX_EXTRA:null,icon:'plant0',off:!G.coop||(G.coop.extra||0)>=PLOT_MAX_EXTRA,
        offMsg:!G.coop?'Build your coop in the forest first!':'Your garden is already as big as it can be!',
        desc:'Two more garden plots next to your coop. Up to '+PLOT_MAX_EXTRA+' extra.',
        act:()=>shopBuy(PLOT_PRICE,'Two new plots by your coop!',()=>{G.coop.extra=(G.coop.extra||0)+PLOT_STEP;applyCoop(false);})}]},
  bakery:{title:'THE BAKERY',owner:'badger',color:'#ffd83a',leave:'LEAVE',bye:'Come back for more, dear!',
    items:()=>TREATS.map(t=>{const act=buffActive(t.id);return {name:t.name,price:t.price,tag:act?'ACTIVE':null,on:act,icon:t.spr,desc:t.desc,bonus:t.bonus,
      act:()=>{if(buffActive())return {s:"You're still full from your last treat!",c:'#ff8080'};
        return shopBuy(t.price,'Yum! '+t.name+'!',()=>{G.buff={id:t.id,until:G.clock+DAY};tasteFood(t.id);G.hearts=Math.min(maxHearts(),G.hearts+(t.id==='tart'?1:0));});}};})},
  toy:{title:'TOY SHOP & ARCADE',owner:'ferret',color:'#ff9cd0',leave:'LEAVE',bye:'Play again soon!',
    items:()=>[
      {name:'EGG CATCH',tag:'PLAY',desc:'Catch 20 eggs in the basket!',icon:'egg',off:G.q.penny!==2,offMsg:"Win Egg Catch with Penny first!",act:()=>{startEgg('ferret');}},
      {name:'CARROT BONK',tag:'PLAY',desc:'Peck 12 carrots before time runs out!',icon:'carrot',off:!G.met.has('bunbun_hi'),offMsg:"Find the secret burrow and meet Bun-Bun first!",act:()=>{state='play';SH=null;startMG('bonk','fizz');}},
      {name:'FIREFLY CATCH',tag:'PLAY',desc:'Peck 15 fireflies before they fly away!',icon:'seed',off:!G.met.has('hootie_hi'),offMsg:"Visit the Moonlit Grove at night and meet Hootie first!",act:()=>{state='play';SH=null;startMG('ffly','fizz');}},
      {name:'ROOFTOP RACE',tag:G.best.race?G.best.race+'s':'RACE',desc:'Race over the rooftops! Needs HOP and GLIDE. Collect the stars before time runs out.',icon:'star',
        off:!has('hop')||!has('glide'),offMsg:'You need HOP and GLIDE to race on the roofs!',act:()=>{startRace();}},
      ...TOYS.map(t=>({name:t.name,price:G.decor[t.id]?null:t.price,tag:G.decor[t.id]?'OWN':null,own:!!G.decor[t.id],icon:t.spr,desc:t.desc,
        off:!G.coop,offMsg:'Build your coop first, then come back!',act:()=>G.decor[t.id]?{s:'Already in your coop!',c:'#94dc64'}:shopBuy(t.price,'Placed in your coop!',()=>{G.decor[t.id]=1;placeDecor();})}))]},
  post:{title:'POST OFFICE',owner:'pigeon',color:'#a6e0ff',leave:'LEAVE',bye:'Coo! Come back tomorrow!',
    items:()=>{refreshJobs();const L=G.jobs.list.map((j,i)=>{const t=JOB_TARGETS.find(x=>x[0]===j.to);
      return {name:'TO '+t[1],tag:j.st===0?'TAKE':j.st===1?'TAKEN':'DONE',on:j.st===1,own:j.st===2,icon:'parcel',off:j.st===2,offMsg:'Delivered! Thank you!',
        desc:'Deliver this parcel to '+t[1]+', '+t[2]+'. Pays '+JOB_PAY.seeds+' seeds and growth!',
        act:()=>{if(j.st===1)return {s:'You are already carrying it!',c:'#ffd83a'};j.st=1;SFX.pick();save();return {s:'Parcel taken! Find '+t[1]+'.',c:'#94dc64'};}};});
      return L.length?L:[{name:'NO JOBS TODAY',desc:'Check back tomorrow for new deliveries.',off:true,icon:'parcel'}];}},
  library:{title:'THE LIBRARY',owner:'owlGlasses',color:'#d890ff',leave:'LEAVE',bye:'Hoo! Happy reading!',
    items:()=>[...BOOKS.map(b=>({name:b.name,tag:'READ',icon:'book',desc:'A free guide to the '+b.area+', with tips for tasks you have not finished.',act:()=>{readGuide(b);}})),
      ...LORE.map(l=>({name:l.name,tag:'READ',icon:'book',desc:'The old stories of Chicklandia.',act:()=>{readLore(l);}}))]},
  museum:{title:'THE MUSEUM',owner:'curator',color:'#c49a5c',leave:'LEAVE',bye:'Come back with more treasures!',
    items:()=>[{name:'DONATE FINDS',tag:donatable()?'READY':null,icon:'seashell',desc:'Hand over any shells, feathers, fossils and moon petals you are carrying.',act:()=>donateAll()},
      ...EXHIBITS.map(x=>({name:x.name,tag:G.museum[x.id]+'/'+x.need,own:G.museum[x.id]>=x.need,icon:x.item,desc:x.desc+(G.museum[x.id]>=x.need?' COMPLETE!':' Carrying: '+(G.hold[x.item]||0)),off:true,offMsg:x.where}))]}
};
