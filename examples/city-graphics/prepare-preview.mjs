import fs from 'node:fs/promises';
const path='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/city-art-directions.html';
let html=await fs.readFile(path,'utf8');
const all=JSON.parse(await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8'));
const keys=['gate','street','park','market','homes','harbor'];
const data=Object.fromEntries(Object.entries(all).filter(([k])=>keys.includes(k)||keys.some(n=>k==='clean-'+n)));
const assets=await fs.readFile(new URL('./assets.json',import.meta.url),'utf8');
html=html.replace(/(<script type="application\/json" id="city-review-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data)+'$2').replace(/(<script type="application\/json" id="city-review-assets">)[\s\S]*?(<\/script>)/,'$1'+assets+'$2');
await fs.writeFile(path,html);console.log('Prepared city review, '+Buffer.byteLength(html)+' bytes.');
