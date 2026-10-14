import fs from 'fs';let s=fs.readFileSync('src/ui/render.js','utf8');
s=s.replace("Seeds found '+G.found+'/'+TOTAL_SEEDS+''","Seeds found '+G.sp1+'/'+TOTAL_SEEDS");fs.writeFileSync('src/ui/render.js',s);
