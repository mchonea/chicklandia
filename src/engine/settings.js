'use strict';
/* ---------------- settings (saved separately from game progress) ---------------- */
const SETTINGS_KEY='chicklandia_settings_v1';
const SET=Object.assign({music:10,sound:10,speed:1,big:false},(()=>{try{return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{};}catch(e){return {};}})());
function saveSettings(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(SET));}catch(e){}}
const TEXT_SPEEDS=['SLOW','NORMAL','FAST'],TEXT_SPEED_MUL=[0.5,0.85,1.7];
