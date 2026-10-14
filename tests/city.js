/* Phase 3 (city) test. Needs ?debug=1 and tests/walk.js loaded:
     (0,eval)(await (await fetch('tests/walk.js')).text()); const r=await (0,eval)(await (await fetch('tests/city.js')).text()); */
(async()=>{
const c=window.__chick,R={},ok=(k,v)=>{R[k]=v;};
const reset=()=>{state='play';dlg=null;SH=null;PL=null;fade=0;P.kt=0;P.inv=0;G.hearts=maxHearts();};
c.newGame();let G=c.G;G.autoMom=0;G.part2=true;['peck','quick','hop','glide'].forEach(s=>G.skills.add(s));G.seeds=60;reset();c.tp(136,1067);c.step(3);
const noon=()=>{G.clock=Math.round(DAY*0.3);},night=()=>{G.clock=Math.round(DAY*0.8);};
const find=(id)=>ents.find(e=>e.id===id);
const buy=(shop,name)=>{const it=SHOPS[shop].items().find(i=>i.name===name);return it.act();};
// 1. opening hours
noon();const b=id=>BUILDINGS.find(x=>x.id===id);
ok('open_by_day',buildingOpen(b('boutique'))&&buildingOpen(b('bakery'))&&buildingOpen(b('museum')));
night();ok('closed_at_night',!buildingOpen(b('boutique'))&&!buildingOpen(b('toy'))&&buildingOpen(b('cleo')));
G.clock=Math.round(DAY*0.985);ok('bakery_opens_at_dawn',buildingOpen(b('bakery'))&&!buildingOpen(b('boutique')));
// 2. closed sign blocks the door, an open door lets Pip in (real walking)
night();reset();let w=walkTo(b('boutique').out.x,b('boutique').out.y);keys.up=true;for(let i=0;i<40;i++)c.step(1);keys.up=false;ok('closed_door_stays_out',regionAt().id==='city'&&state==='talk');
reset();noon();keys.up=true;for(let i=0;i<60;i++)c.step(1);keys.up=false;ok('open_door_enters',cellAt().id==='boutique');
// 3. boutique buys outfits, grants growth once
const gp0=G.gp,s0=G.seeds;buy('boutique','CHEF HAT');ok('boutique_buy',G.outfits.includes('chef')&&wearing('chef')&&G.seeds===s0-4&&G.gp===gp0+3);
const g1=G.gp;tasteFood('worm');ok('chef_bonus',G.gp===g1+5);   // 4 for the taste + 1 for the chef hat
// 4. seed & feed: special seeds + plots
buy('seed','SPEEDY SPROUT');buy('seed','GIANT SUNFLOWER');buy('seed','MOONFLOWER');ok('sacks',G.sacks.speedy===1&&G.sacks.giant===1&&G.sacks.moon===1);
G.coop={site:'forest',lv:4};G.thumb=true;applyCoop(true);const plots0=ents.filter(e=>e.type==='plot').length;buy('seed','GARDEN PLOTS +2');ok('extra_plots',G.coop.extra===2&&ents.filter(e=>e.type==='plot').length===plots0+2);
// 5. garden kinds grow at different speeds; moonflower waits for night
const pl=ents.filter(e=>e.type==='plot'&&e.coop).slice(0,4);noon();
plantSeed(pl[0],'plain');plantSeed(pl[1],'speedy');plantSeed(pl[2],'giant');plantSeed(pl[3],'moon');
for(let i=0;i<300;i++)updatePlots();
const pr=k=>G.plots[pl[k].id].p;ok('speedy_faster',pr(1)>pr(0)*1.9&&pr(2)<pr(0)*0.6&&pr(3)===0);
night();for(let i=0;i<300;i++)updatePlots();ok('moon_grows_at_night',pr(3)>0);
G.plots[pl[3].id].p=1;const sd=G.seeds,pt=G.hold.petal;usePlot(pl[3]);ok('moon_harvest',G.seeds===sd+4+(G.rank>=6?1:0)&&G.hold.petal===pt+1);
// 6. bakery buffs
noon();reset();const sp0=speed();buy('bakery','CORN MUFFIN');ok('muffin_speed',Math.abs(speed()/sp0-1.1)<0.001&&buffActive('muffin'));
ok('only_one_treat',buy('bakery','SEED BUN').c==='#ff8080');
G.clock+=DAY+5;checkBuffExpiry();ok('buff_expires',!buffActive());
const h0=maxHearts();buy('bakery','BERRY TART');ok('tart_heart',maxHearts()===h0+1);G.clock+=DAY+5;checkBuffExpiry();
ok('treats_are_foods',!!(G.taste.muffin&&G.taste.tart));
// 7. post office: jobs, parcel, delivery
G.jobs={day:0,list:[]};refreshJobs();const jobs=G.jobs.list.length;ok('jobs_made',jobs>=1&&jobs<=2);
const j=G.jobs.list[0];SHOPS.post.items()[0].act();ok('job_taken',j.st===1);
c.tp(30*16,70*16);reset();const tgt=find(j.to);dlg=null;const sd2=G.seeds,gp2=G.gp;c.talk(j.to);dlg.lines.forEach(l=>l.fx&&l.fx());ok('job_delivered',j.st===2&&G.seeds===sd2+2&&G.gp===gp2+3);reset();
// 8. museum: finds, donation, rewards
G.hold.seashell=5;G.hold.plume=4;const gm=G.gp,sm=G.seeds;donateAll();ok('exhibits_complete',G.museum.seashell===5&&G.museum.plume===4&&G.gp===gm+20&&G.seeds===sm+10);
ok('nothing_left_to_donate',donateAll().c==='#ff8080');
// 9. library gives hints
reset();readGuide(BOOKS[0]);ok('guide_speaks',state==='talk'&&dlg.lines.length>=1);reset();
// 10. quests
// rocco: borrowed things go back to their owners
reset();c.talk('rocco');dlg.lines.forEach(l=>l.fx&&l.fx());reset();ok('rocco_started',G.q.rocco===1);
for(const bo of BORROWED){G.items[bo.item]=1;reset();c.talk(bo.owner);dlg.lines.forEach(l=>l.fx&&l.fx());reset();}
ok('rocco_returned',retCount()===3&&QUESTS.rocco.check());c.talk('rocco');dlg.lines.forEach(l=>l.fx&&l.fx());ok('rocco_done',G.q.rocco===2);reset();
// cleo: the sunbeam only shines at noon, and only if you stand in it
reset();c.talk('cleo');dlg.lines.forEach(l=>l.fx&&l.fx());reset();night();c.tp(SUNBEAM.x,SUNBEAM.y+6);reset();P.x=SUNBEAM.x;P.y=SUNBEAM.y+6;sbTimer=0;for(let i=0;i<150;i++)updateSunbeam();ok('sunbeam_dark_at_night',!G.flags.sunbeam);
noon();G.clock=Math.round(DAY*0.31);for(let i=0;i<150;i++)updateSunbeam();ok('sunbeam_at_noon',!!G.flags.sunbeam);c.talk('cleo');dlg.lines.forEach(l=>l.fx&&l.fx());ok('cleo_done',G.q.cleo===2);reset();
// cook-off: three ingredients from three regions
G.q.remy=2;reset();c.talk('remy');dlg.lines.forEach(l=>l.fx&&l.fx());reset();ok('cookoff_started',G.q.cookoff===1);
G.items.pepper=1;G.items.salt=1;G.items.mushroom=1;c.talk('remy');dlg.lines.forEach(l=>l.fx&&l.fx());ok('cookoff_done',G.q.cookoff===2&&!!G.taste.stew);reset();
// weathervane: needs the rooftops
G.q.pidge=2;reset();c.talk('pidge');dlg.lines.forEach(l=>l.fx&&l.fx());reset();ok('vane_started',G.q.vane===1);
const vane=ents.find(e=>e.type==='vane');ok('vane_on_roof',regionOfPos(vane.x,vane.y).id==='rooftops');
c.tp(vane.x,vane.y+14);reset();P.x=vane.x;P.y=vane.y+14;P.dir=1;cityPeck(vane,frontPoint(),{});ok('vane_fixed',!!G.flags.vane);
c.talk('pidge');dlg.lines.forEach(l=>l.fx&&l.fx());ok('vane_done',G.q.vane===2);reset();
// portrait: three different outfits, one pose per visit
reset();c.talk('pablo');dlg.lines.forEach(l=>l.fx&&l.fx());reset();ok('portrait_started',G.q.portrait===1);
G.outfits.push('straw','ninja');for(const o of ['chef','straw','ninja']){setWear(null);setWear(o,true);G.flags.posed=false;c.talk('pablo');dlg.lines.forEach(l=>l.fx&&l.fx());reset();}
ok('three_poses',(G.flags.poses||[]).length===3);
G.flags.posed=false;c.talk('pablo');dlg.lines.forEach(l=>l.fx&&l.fx());ok('portrait_done',G.q.portrait===2&&G.decor.painting===1);reset();
// 11. babysitting: lead all four, lose none
reset();c.talk('waddles');dlg.lines.forEach(l=>l.fx&&l.fx());reset();ok('babysit_started',G.q.babysit===1&&G.flags.baby.on);
const ducks=ents.filter(e=>e.type==='cduck');ok('four_ducklings',ducks.length===4&&ducks.every(d=>d.mode==='follow'));
for(const [sc,sr] of BABY_STOPS){P.x=sc*16+8;P.y=sr*16+8;for(const d of ducks){d.x=P.x;d.y=P.y;}updateBabysit();}
ok('three_stops',G.flags.baby.stops===3);
const fo=roomOrigin('ducks');c.tp(fo.x+128,fo.y+120);reset();const wd=find('waddles');for(const d of ducks){d.x=P.x;d.y=P.y;}updateBabysit();ok('ducklings_home',G.flags.baby.done);
c.talk('waddles');dlg.lines.forEach(l=>l.fx&&l.fx());ok('babysit_done',G.q.babysit===2);reset();
// losing one resets the walk
G.q.babysit=1;G.flags.baby={on:true,stops:1,seen:[1,0,0],fail:false,done:false};ducks.forEach(d=>{d.mode='follow';d.lost=0;});P.x=1000;P.y=1000;ducks[0].x=1500;ducks[0].y=1500;for(let i=0;i<200;i++)updCduck(ducks[0]);ok('lost_duckling_fails',G.flags.baby.fail===true&&ducks.every(d=>d.mode==='home'));
// 12. day/night routines
reset();night();c.tp(30*16,60*16);reset();updateSchedules(true);const roc=find('rocco');ok('rocco_home_at_night',regionOfPos(roc.x,roc.y).id==='cityin');
noon();updateSchedules(true);ok('rocco_out_by_day',regionOfPos(roc.x,roc.y).id==='city');
// 13. rooftop race
reset();noon();c.tp(136,1067);reset();ok('race_needs_hop_glide',(()=>{G.skills.delete('glide');const o=SHOPS.toy.items().find(i=>i.name==='ROOFTOP RACE').off;G.skills.add('glide');return o;})());
startRace();for(let i=0;i<60;i++)c.step(1);ok('race_started',regionAt().id==='rooftops'&&!!G.race&&ents.filter(e=>e.type==='star').length===10);
const stars=ents.filter(e=>e.type==='star');for(const s of stars.slice(0,8)){P.x=s.x;P.y=s.y+6;updateRace();}
const flag=ents.find(e=>e.type==='flag');P.x=flag.x;P.y=flag.y;updateRace();for(let i=0;i<80;i++)c.step(1);
ok('race_won_goggles',G.outfits.includes('goggles')&&G.best.race>0&&!G.race&&regionAt().id==='cityin');reset();
ok('goggles_are_accessory',ACCESSORY_IDS.includes('goggles'));
// 14. save round trip keeps the new fields
save();const sv=JSON.parse(localStorage.getItem('chicklandia_save_v2'));ok('save_has_city_state',!!sv.sacks&&!!sv.museum&&!!sv.jobs&&!!sv.decor&&!!sv.flags.poses);
c.continueGame();G=c.G;ok('load_keeps_city_state',G.museum.seashell===5&&G.decor.painting===1&&G.best.race>0&&G.outfits.includes('chef'));
// 15. extras: rooftop secret, city hidden seeds, quest pages
c.newGame();G=c.G;G.autoMom=0;G.part2=true;['hop','glide'].forEach(s=>G.skills.add(s));reset();startRace();for(let i=0;i<60;i++)c.step(1);ok('rooftops_secret',!!G.secrets.rooftops);G.race=null;
const sh=ents.find(e=>e.id==='seed_harbor'),g2=G.gp,sp=G.sp2;collect(sh);ok('city_hidden_seed',G.sp2===sp+1&&G.gp===g2+2);
ok('sleuth_page_needs_cap',!questPages().includes(4));G.outfits.push('detective');ok('sleuth_page_with_cap',questPages().includes(4)&&questPages().includes(3));
ok('tally_cap',TOTAL_SEEDS2===38);
R.allPass=Object.values(R).every(v=>v===true);return R;
})()
