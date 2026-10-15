import fs from 'fs';
function ed(f,pairs){let s=fs.readFileSync(f,'utf8');for(const [a,b] of pairs){if(!s.includes(a)){console.log('MISSING in '+f+': '+a.slice(0,90));continue;}s=s.replace(a,()=>b);}fs.writeFileSync(f,s);}
ed('src/content/quests_village.js',[["title:r.name.split(' ').slice(-1)[0].replace(/^(\w)(\w*)$/,(m,a,b)=>a+b.toLowerCase())+' Moves In',","title:({pig:'Porkchop Moves In',whiskers:'Whiskers Moves In',clyde:'Clyde Moves In',daisy:'Daisy Moves In',doe:'Doe Moves In',penny:'Penny Moves In',rooster:'Cluckington Moves In'})[r.id],"]]);
let o=JSON.parse(fs.readFileSync('src/order.json','utf8'));
if(!o.includes('entities/sprites_village.js'))o.splice(o.indexOf('entities/sprites_city.js')+1,0,'entities/sprites_village.js');
fs.writeFileSync('src/order.json',JSON.stringify(o,null,1));
console.log(o.join(' '));
