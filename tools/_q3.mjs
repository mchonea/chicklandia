import fs from 'fs';
let o=JSON.parse(fs.readFileSync('src/order.json','utf8'));
const i=o.indexOf('regions/beach.js');
o.splice(i+1,0,'regions/city.js'); // placeholder removed below
o=o.filter((x,k)=>!(x==='regions/city.js'&&k!==o.indexOf('regions/city.js')));
// city must stay before cityin/rooftops; make sure single entries
o=[...new Set(o)];
const ci=o.indexOf('regions/city.js');
o.splice(o.indexOf('regions/beach.js')+1,0,'regions/cityin.js','regions/rooftops.js');
o=[...new Set(o)];
o.splice(o.indexOf('content/world_data.js'),0,'content/city.js');
fs.writeFileSync('src/order.json',JSON.stringify(o,null,1));
console.log(o.slice(3,20).join(' '));
