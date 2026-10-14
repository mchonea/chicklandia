// Builds dist/chicklandia.html (single self-contained file) and index.html (dev shell loading src/ directly).
import fs from 'fs';
const shell=fs.readFileSync('tools/shell.html','utf8');
const order=JSON.parse(fs.readFileSync('src/order.json','utf8'));
fs.mkdirSync('dist',{recursive:true});
const code=order.map(f=>`/* ===== src/${f} ===== */\n`+fs.readFileSync('src/'+f,'utf8').replace(/^'use strict';\n/,'')).join('\n');
fs.writeFileSync('dist/chicklandia.html',shell+"<script>\n'use strict';\n"+code+"</script>\n</body>\n</html>\n");
fs.writeFileSync('index.html',shell+order.map(f=>`<script src="src/${f}"></script>`).join('\n')+"\n</body>\n</html>\n");
console.log('built dist/chicklandia.html ('+Math.round(fs.statSync('dist/chicklandia.html').size/1024)+' KB) and dev index.html');
