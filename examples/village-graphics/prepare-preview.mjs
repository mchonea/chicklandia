import fs from 'node:fs/promises';
const path='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/village-art-directions.html';
let html=await fs.readFile(path,'utf8');
html=html.replace('__BASELINE__',await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8')).replace('__ASSETS__',await fs.readFile(new URL('./assets.json',import.meta.url),'utf8'));
await fs.writeFile(path,html);console.log('Village review: '+Buffer.byteLength(html)+' bytes.');
