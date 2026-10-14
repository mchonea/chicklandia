import fs from 'fs';let s=fs.readFileSync('src/engine/state.js','utf8');
s=s.replace("function newGame(){\n","function resetTransient(){RU=null;FEST=null;CRED=null;SH=null;PL=null;MG=null;EG=null;dlg=null;}\nfunction newGame(){\n  resetTransient();\n");
s=s.replace("function continueGame(){\n","function continueGame(){\n  resetTransient();\n");
fs.writeFileSync('src/engine/state.js',s);
