import fs from 'node:fs/promises';
const read=async name=>JSON.parse(await fs.readFile(new URL('./'+name,import.meta.url),'utf8'));
const data={before:await read('baseline.json'),after:await read('captures.json')},path=new URL('./implemented.html',import.meta.url);
let html=await fs.readFile(path,'utf8');html=html.replace(/(<script type="application\/json" id="capture-data">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(data)+'$2');await fs.writeFile(path,html);console.log('Prepared playable coop upgrade gallery.');
