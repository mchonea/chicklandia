import fs from 'node:fs/promises';
const path='C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/city-interiors-rooftops.html';
const all=JSON.parse(await fs.readFile(new URL('./baseline.json',import.meta.url),'utf8'));
delete all.shots.roomContact;delete all.shots.roofOverview;
all.assets.city='data:image/png;base64,'+(await fs.readFile(new URL('../city-graphics/implemented-day-overview.png',import.meta.url))).toString('base64');
let html=await fs.readFile(path,'utf8');html=html.replace(/(<script type="application\/json" id="interior-review-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(all)+'$2');
await fs.writeFile(path,html);console.log('Prepared interior and race review: '+Buffer.byteLength(html)+' bytes.');
