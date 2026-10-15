import fs from 'fs';let s=fs.readFileSync('tests/seas.js','utf8');
const a="CH.bstun=0;CH.dashT=14;CH.x=CH.bx-5;CH.y=CH.by;updateChase();CH.bstun=0;CH.dashT=14;CH.x=CH.bx-5;CH.y=CH.by;updateChase();";
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,"for(let k=0;k<2;k++){CH.bstun=0;CH.bx=200;CH.dashT=14;CH.x=CH.bx-5;CH.y=CH.by;updateChase();}");
fs.writeFileSync('tests/seas.js',s);
