import fs from 'fs';let o=JSON.parse(fs.readFileSync('src/order.json','utf8'));
o.splice(o.indexOf('entities/sprites.js')+1,0,'entities/sprites_city.js');fs.writeFileSync('src/order.json',JSON.stringify(o,null,1));
