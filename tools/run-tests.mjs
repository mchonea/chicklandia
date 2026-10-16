// Runs every gameplay suite in one pass, each in a freshly loaded ?debug=1 page:  npm test
//   node tools/run-tests.mjs [suite ...] [--out report.json]
// Needs Playwright with Chrome. Set PLAYWRIGHT_MODULE to its index.mjs if 'playwright' is not installed here.
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const ALL=['smoke','forest_layout','landscapes','terrain_gaps','city_interiors','city_layout','city','village_layout','village','coastal','seas','sky'];
const args=process.argv.slice(2),outAt=args.indexOf('--out'),out=outAt>=0?args[outAt+1]:null;
const suites=args.filter((a,i)=>!a.startsWith('--')&&i!==outAt+1);for(const s of suites)if(!ALL.includes(s))throw new Error('unknown suite '+s);
const {chromium}=await (async()=>{
 if(process.env.PLAYWRIGHT_MODULE)return import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
 try{return await import('playwright');}catch{}
 return import(pathToFileURL(path.join(process.env.USERPROFILE||'','.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')).href);
})();
const root=process.cwd(),types={'.html':'text/html','.js':'text/javascript','.json':'application/json'};
const server=http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';const f=path.join(root,p);
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end();}
 s.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(s);}).listen(0,'127.0.0.1');
await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({channel:'chrome',headless:true}),report={suites:{},errors:{}};
const open=async url=>{const page=await browser.newPage({viewport:{width:768,height:672}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 // The tests step the game themselves; stop the page's own loop from running alongside them.
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto(url);await page.waitForFunction(()=>!!window.__chick);return {page,errors};};
try{
 for(const suite of suites.length?suites:ALL){
  const t0=Date.now(),{page,errors}=await open(base+'/?debug=1');page.setDefaultTimeout(0);
  let r;try{await page.evaluate(fs.readFileSync('tests/walk.js','utf8'));r=await page.evaluate(fs.readFileSync('tests/'+suite+'.js','utf8'));}catch(e){r={allPass:false,error:String(e.message||e)};}
  await page.close();
  const checks=Object.entries(r).filter(([k,v])=>k!=='allPass'&&typeof v==='boolean'),fails=checks.filter(([,v])=>!v).map(([k])=>k);
  report.suites[suite]={allPass:r.allPass===true&&!errors.length,checks:checks.length,fails,secs:Math.round((Date.now()-t0)/1000),result:r};
  if(errors.length)report.errors[suite]=errors;
  console.log((report.suites[suite].allPass?'PASS ':'FAIL ')+suite.padEnd(15)+String(checks.length).padStart(4)+' checks  '+report.suites[suite].secs+'s'+(fails.length?'  failed: '+fails.join(', '):'')+(r.error?'  error: '+r.error:'')+(errors.length?'  page errors: '+errors.join(' | '):''));
 }
 // The single-file build must load and start a game without errors.
 const {page,errors}=await open(base+'/dist/chicklandia.html?debug=1');
 const ok=await page.evaluate(()=>{__chick.newGame();__chick.step(5);return !!__chick.G&&__chick.state!=null;});await page.close();
 report.suites.standalone={allPass:ok&&!errors.length,checks:1,fails:ok?[]:['standalone_starts']};if(errors.length)report.errors.standalone=errors;
 console.log((report.suites.standalone.allPass?'PASS ':'FAIL ')+'standalone build');
}finally{await browser.close();server.close();}
const all=Object.values(report.suites);report.allPass=all.every(s=>s.allPass);report.checks=all.reduce((n,s)=>n+s.checks,0);
console.log((report.allPass?'ALL PASS':'FAILURES')+': '+report.checks+' checks, '+all.filter(s=>!s.allPass).length+' failing suite(s)');
if(out)fs.writeFileSync(out,JSON.stringify(report,null,1));
process.exitCode=report.allPass?0:1;
