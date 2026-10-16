'use strict';
/* Home upgrades reveal a second floor; honors read existing progress, including older saves. */
const COOP_TROPHIES=[
 {id:'flight',name:'FIRST FLIGHT',icon:'wing',color:'#ffe05a',earned:()=>G.part2||G.won,story:'The day a tiny farm chick spread their wings and set off into the world.',hint:()=> 'Fly beyond the farm to begin your adventure.'},
 {id:'friends',name:'HELPING WINGS',icon:'acorn',color:'#a1d970',earned:()=>ORDER2.every(id=>G.q[id]===2),story:'For every friend you helped beyond the farm. A small kindness can change a whole world.',hint:()=> 'Help all 9 friends beyond the farm. You have helped '+ORDER2.filter(id=>G.q[id]===2).length+'/9.'},
 {id:'garden',name:'GOLDEN GARDENER',icon:'flower',color:'#ffe05a',earned:()=>G.harvests>=10,story:'Ten harvests, from one little seed. Your garden has grown along with you!',hint:()=> 'Harvest 10 garden plots. Your harvests: '+Math.min(10,G.harvests)+'/10.'},
 {id:'games',name:'ARCADE ACE',icon:'cup',color:'#eb6654',earned:()=>['egg','bonk','ffly'].every(k=>G.mgFirst[k]),story:'Egg Catch, Carrot Bonk and Firefly Chase: you won them all!',hint:()=> 'Win Egg Catch, Carrot Bonk and Firefly Chase. Wins: '+['egg','bonk','ffly'].filter(k=>G.mgFirst[k]).length+'/3.'},
 {id:'home',name:'DREAM BUILDER',icon:'home',color:'#ffe05a',earned:()=>G.coop?.lv>=4,story:'A golden roof, a home for your family, and a place for every memory.',hint:()=> 'Upgrade your coop to level 4.'},
 {id:'race',name:'ROOF RUNNER',icon:'flag',color:'#b2e7e0',earned:()=>G.best.race>0,story:()=> 'For finishing Roofline Run. Your best time is '+G.best.race+' seconds!',hint:()=> 'Win Roofline Run at the city toy shop.'},
 {id:'museum',name:'MUSEUM KEEPER',icon:'museum',color:'#c9b0df',earned:()=>EXHIBITS.every(e=>(G.museum[e.id]||0)>=e.need),story:'A complete museum collection, shared with everyone in Chicklandia.',hint:()=> 'Complete all '+EXHIBITS.length+' museum collections. Completed: '+EXHIBITS.filter(e=>(G.museum[e.id]||0)>=e.need).length+'/'+EXHIBITS.length+'.'},
 {id:'village',name:'VILLAGE HERO',icon:'village',color:'#a1d970',earned:()=>!!G.flags.village,story:'From an empty meadow to a village full of friends. This home is part of something bigger.',hint:()=> 'Finish the village chapter and celebrate the Harvest Festival.'},
 {id:'seas',name:'SEA CAPTAIN',icon:'wheel',color:'#b2e7e0',earned:()=>!!G.flags.seas,story:'For your courage on the Pirate Seas and your victory over Captain Squawkbeard.',hint:()=> 'Complete the Pirate Seas adventure.'},
 {id:'sky',name:'SKY LEGEND',icon:'star',color:'#ffe05a',earned:()=>!!G.flags.sky,story:'The skies are peaceful again. A little chick from the farm became a legend.',hint:()=> 'Complete the Sky Kingdom adventure.'}
];
const COOP_TROPHY_SLOTS=[[48,84],[100,84],[152,84],[204,84],[48,124],[100,124],[152,124],[48,160],[100,160],[152,160]];
const COOP_ROOM_LAYOUTS=new Map();
function coopDisplayCount(lv=G.coop?.lv||1){return lv>=4?10:lv>=3?7:lv>=2?4:0;}
function coopRoomOrigin(floor){const r=REGIONS[floor==='loft'?'cooploft':'coop'];return {x:r.origin[0]*256,y:r.origin[1]*192};}
function coopRoomProps(floor,lv){
 const key=floor+lv;if(COOP_ROOM_LAYOUTS.has(key))return COOP_ROOM_LAYOUTS.get(key);
 const p=[],add=(id,kind,x,y,w,h,hit=[0,0,w,h],extra={})=>p.push({id,kind,x,y,w,h,hit,...extra});
 if(floor==='home'){
  add('kitchen','kitchen',29,57,57,25,[0,6,57,19]);add('hearth','hearth',108,41,36,38,[0,14,36,24]);
  add('sofa','sofa',30,90,48,25,[0,6,48,19]);
  if(lv>=2)add('up','stairsup',188,52,40,54);else add('future','books',191,58,35,43);
  add('nests','nests',lv===1?34:29,lv>=3?118:128,lv===1?40:50,lv>=3?45:32);
  add('table','table',107,109,42,23,[0,3,42,20]);add('chair','chair',119,137,18,20,[0,5,18,15]);
  if(lv>=3)add('books','books',205,126,25,27);
  add('plant','plant',219,158,13,17,[1,8,11,9]);
 }else{
  add('down','stairsdown',188,143,40,33);
  if(lv===2)add('curation','desk',109,113,40,22);
  if(lv<4)add('bench','bench',29,145,45,20,[0,6,45,14]);
  COOP_TROPHIES.slice(0,coopDisplayCount(lv)).forEach((t,i)=>{const [x,y]=COOP_TROPHY_SLOTS[i];add(t.id,'display',x-15,y-30,30,32,[1,20,28,12],{trophy:t});});
 }COOP_ROOM_LAYOUTS.set(key,p);return p;
}
