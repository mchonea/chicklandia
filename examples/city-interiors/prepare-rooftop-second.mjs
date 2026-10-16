import fs from 'node:fs/promises';
const path='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/rooftop-second-take.html';
const {assets}=JSON.parse(await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8'));
const selected=Object.fromEntries(['pip','star','vaneFixed'].map(k=>[k,assets[k]]));
let html=await fs.readFile(path,'utf8');
html=html.replace(/(<script type="application\/json" id="roof-second-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(selected)+'$2');
await fs.writeFile(path,html);
console.log('Prepared rooftop second take: '+Buffer.byteLength(html)+' bytes.');
