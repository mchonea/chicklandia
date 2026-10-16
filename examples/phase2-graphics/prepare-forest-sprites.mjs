import fs from 'node:fs/promises';
const path='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/forest-sprite-refinement.html';
const baseline=JSON.parse(await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8'));
const data={shots:Object.fromEntries(Object.entries(baseline.shots).filter(([k])=>k.startsWith('forest'))),assets:baseline.assets,layouts:{forest:baseline.layouts.forest}};
let html=await fs.readFile(path,'utf8');
html=html.replace(/(<script type="application\/json" id="forest-mix-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data)+'$2');
await fs.writeFile(path,html);console.log('Prepared forest sprite study: '+Buffer.byteLength(html)+' bytes.');
