import fs from 'fs';let s=fs.readFileSync('src/systems/world.js','utf8');
const a=s.indexOf("    if(!G.outfits.includes(prize)){grantOutfit(prize);\n      if(m.npc==='fizz'");
const b=s.indexOf('    else L.push({who:npc,text:"You won again!');
if(a<0||b<0)throw new Error('markers');
const fix=`    if(!G.outfits.includes(prize)){grantOutfit(prize);
      L.push({who:npc,text:m.npc==='fizz'?"You won with "+m.score+" points! Take the prize, it's yours!":key==='bonk'?"WOW! You bonked "+m.score+" carrots! You win my spare BUNNY EARS!":"Hoo-hoo! Splendid! "+m.score+" fireflies! A pirate captain left this PIRATE OUTFIT in my tree long ago. It's yours! Arr!",
        fx:()=>toast('Got the '+(prize==='ears'?'BUNNY EARS':'PIRATE OUTFIT')+'! Press C to wear.')});}
`;
s=s.slice(0,a)+fix+s.slice(b);
s=s.replace("else{SFX.deny();L.push({who:npc,text:(key==='bonk'?\"Time's up! You got \":\"The moon is setting! You caught \")+m.score+\". Talk to me to try again!\"});}","else{SFX.deny();L.push({who:npc,text:(key==='bonk'?\"Time's up! You got \":\"The moon is setting! You caught \")+m.score+\". Talk to me to try again!\"});}\n  if(m.npc==='fizz'){state='catalog';SH={id:'toy',sel:0,top:0,msg:null};}");
fs.writeFileSync('src/systems/world.js',s);
