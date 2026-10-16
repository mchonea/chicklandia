import fs from 'node:fs/promises';
const path='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/beach-mountain-refinement.html';
const baseline=JSON.parse(await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8')),terrain=JSON.parse(await fs.readFile(new URL('./terrain-assets.json',import.meta.url),'utf8'));
const data={shots:Object.fromEntries(Object.entries(baseline.shots).filter(([k])=>/^(beach|mountains)/.test(k))),assets:{...baseline.assets,...terrain},layouts:{beach:baseline.layouts.beach,mountains:baseline.layouts.mountains}};
let html=await fs.readFile(path,'utf8');html=html.replace(/(<script type="application\/json" id="coast-peak-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data)+'$2');await fs.writeFile(path,html);console.log('Prepared '+Buffer.byteLength(html)+' bytes.');
