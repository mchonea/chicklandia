import fs from 'node:fs/promises';
const read=async name=>JSON.parse(await fs.readFile(new URL('./'+name,import.meta.url),'utf8'));
const baseline=await read('baseline.json'),after=await read('landscape-captures.json');
const data={before:Object.fromEntries(Object.entries(baseline.shots).filter(([k])=>/^(beach|mountains)/.test(k))),after};
const path=new URL('./landscapes-implemented.html',import.meta.url);let html=await fs.readFile(path,'utf8');html=html.replace(/(<script type="application\/json" id="capture-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data)+'$2');await fs.writeFile(path,html);console.log('Prepared actual beach and mountain gallery.');
