// Tiny static dev server: npm run dev  ->  http://localhost:8080/  (add ?debug=1 for test hooks)
import http from 'http';import fs from 'fs';import path from 'path';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';
  const f=path.join(process.cwd(),p);if(!f.startsWith(process.cwd())||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end('not found');}
  s.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(s);
}).listen(Number(process.argv[2]||8080),()=>console.log('http://localhost:'+(process.argv[2]||8080)+'/'));
