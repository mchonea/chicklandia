import fs from 'fs';
let s=fs.readFileSync('src/systems/part2.js','utf8');
const a=s.indexOf('function plotRate(e){'),b=s.indexOf('\n',a);
s=s.slice(0,a)+"function plotRate(e){const st=G.plots[e.id],kind=SEED_TYPES[(st&&st.k)||'plain'];\n  if(kind.night&&nightAmt()<0.5)return 0;\n  let r=wearing('straw')?1.5:1;if(e.coop&&G.coop){if(G.coop.lv>=4)r=2;else if(G.coop.lv>=3)r=1.5;}\n  if(buffActive('bun'))r*=1.25;if(rainAmt()>0.5)r*=2;return r*kind.grow;}"+s.slice(b);
fs.writeFileSync('src/systems/part2.js',s);
let t=fs.readFileSync('tests/city.js','utf8');
t=t.replace("ok('treats_are_foods',G.taste.muffin&&G.taste.tart);","ok('treats_are_foods',!!(G.taste.muffin&&G.taste.tart));");
t=t.replace("const fo=roomOrigin('ducks');P.x=fo.x+128;P.y=fo.y+120;","const fo=roomOrigin('ducks');c.tp(fo.x+128,fo.y+120);reset();");
fs.writeFileSync('tests/city.js',t);
