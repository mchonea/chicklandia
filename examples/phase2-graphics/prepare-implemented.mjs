import fs from 'node:fs/promises';
const baseline=JSON.parse(await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8'));
const after=JSON.parse(await fs.readFile(new URL('./implemented-captures.json',import.meta.url),'utf8'));
const data={before:Object.fromEntries(Object.entries(baseline.shots).filter(([k])=>k.startsWith('forest'))),after};
const path=new URL('./implemented.html',import.meta.url);let html=await fs.readFile(path,'utf8');html=html.replace(/(<script type="application\/json" id="capture-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data)+'$2');await fs.writeFile(path,html);console.log('Prepared actual forest game gallery.');
