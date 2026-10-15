import fs from 'fs';let s=fs.readFileSync('tests/walk.js','utf8');
s=s.replace("if(prev.has(k)||pBlocked(x,y))continue;","if(prev.has(k)||pBlocked(x,y)||(window.WALK_AVOID&&window.WALK_AVOID.includes(tileAt(Math.floor(x/16),Math.floor((y-3)/16)))))continue;");
fs.writeFileSync('tests/walk.js',s);
