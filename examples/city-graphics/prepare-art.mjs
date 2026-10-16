// Transfer the approved pixel studies into the game's native canvas helpers.
import fs from 'node:fs/promises';
const source=await fs.readFile('C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/city-art-directions.html','utf8');
let code=source.slice(source.indexOf('const P={ink:'),source.indexOf('function labels()'));
code=code.replace(/function sprite\(key,x,y\)\{[^\n]*\}\r?\n/,'');
code=code.replace(/function sign\(s,x,y,w\)\{[^\n]*\}/,"function sign(s,x,y,w){R(P.ink,x-w/2,y,w,10);R(P.cream,x-w/2+1,y+1,w-2,8);}");
code=code.replace('R(P.blue,x+1,y+1,w-2,h-2);R(P.blueLight,x+2,y+2,Math.max(2,w/3),h-4);','R(lit?P.gold:P.blue,x+1,y+1,w-2,h-2);R(lit?P.paper:P.blueLight,x+2,y+2,Math.max(2,w/3),h-4);');
code=code.replace('windowAt(x+8,winY,winW,16);windowAt(x+w-9-winW,winY,winW,16);',"if(x+8+winW<doorX-5)windowAt(x+8,winY,winW,16);if(x+w-9-winW>doorX+5)windowAt(x+w-9-winW,winY,winW,16);");
const tail=`
function laundry(x,y){line(P.woodD,[[x,y-20],[x,y],[x+63,y],[x+63,y-19]],1);R(P.paper,x+12,y-9,7,11);R(P.blueLight,x+27,y-9,7,10);R(P.red,x+43,y-9,6,9);}
const painters={ground,stone,road,crossing,building,rowhouses,bench,lamp,tree,bed,pot,fountain,stall,table,clock,pond,gazebo,laundry};
return {colors:P,paint(target,kind,args=[],night=false){if(lit!==night){lit=night;rowhouseArt=null;}g=target;painters[kind](...args);}};
})();
`;
await fs.writeFile(new URL('../../src/engine/city_art.js',import.meta.url),"'use strict';\n/* Shared native pixel art for the city's buildings, terrace and public spaces. */\nconst CITY_ART=(()=>{\nlet g,lit=false;\n"+code+tail);
console.log('Prepared approved city artwork.');
