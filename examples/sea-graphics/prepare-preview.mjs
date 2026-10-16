import fs from 'node:fs/promises';
const fragment='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/sea-art-directions.html';
let html=await fs.readFile(fragment,'utf8');
const baseline=await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8');
html=html.replace('__BASELINE__',baseline);
await fs.writeFile(fragment,html);
console.log('Prepared self-contained concept review: '+Buffer.byteLength(html)+' bytes.');
