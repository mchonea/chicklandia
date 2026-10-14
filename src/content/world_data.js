'use strict';
/* content: farm family, dirt mounds, hidden items and signs */
const SIBS=[
  {id:'peep',name:'PEEP',spr:'peep',hide:[46,31],home:[4,28],found:"Aww, you found me! I was hiding behind the bed!",homeLine:"Peep peep! Next time I'm hiding under the bed. Don't tell!"},
  {id:'cheep',name:'CHEEP',spr:'cheep',hide:[17,21],home:[11,28],found:"Nooo! That bush was the PERFECT hiding spot!",homeLine:"Pip, when you can fly, will you take me for a ride?"},
  {id:'tweet',name:'TWEET',spr:'tweet',hide:[28,27],home:[5,33],found:"How did you get up here?! Okay, okay, I'm going home!",homeLine:"I'm gonna be a big strong chicken just like you, Pip!"}];
const MOUNDS=[{id:'mound0',c:29,r:21,has:'An old boot!'},{id:'mound1',c:2,r:22,has:'seed'},{id:'mound2',c:45,r:9,has:'A rusty spoon!'},{id:'mound3',c:38,r:21,has:'bone'}];
const HIDDEN={'44,2':{id:'feather_crate',kind:'feather'},'44,3':{id:'seed_crate',kind:'seed'},
  '14,21':{id:'seed_rock',kind:'seed'},'23,22':{id:'feather_leaf',kind:'feather'},'35,20':{id:'seed_leaf',kind:'seed'}};
const SIGNS={'10,9':{name:'SIGN',text:'CHICKEN COOP - Home sweet home! (Press E to open your Growth Tree.)'},
  '45,16':{name:'SIGN',text:'THE BIG FENCE. No chicken has ever flown over it. Beyond it lies... THE WHOLE WIDE WORLD!'}};

SIGNS['28,7']={name:'SIGN',text:"MAGGIE'S BOUTIQUE has moved to MAIN STREET in the city! (Past the forest, in Part 2.)"};
