'use strict';
/* region: the city rooftops (3 screens). Reached by the stairs in the Toy Shop. Gaps need GLIDE, hay walls need HOP.
   8 roof you can walk on   z gap (chasm)   h hay wall   1 stairs back down   Rooftop Race + Pidge's weathervane live here. */
defineRegion({id:'rooftops',name:'ROOFTOPS',kind:'outdoor',origin:[5,7],grid:[3,1],ground:'cobble',beyond:true,music:'city',
 screens:[
 grid('z',[['r',1,2,5,9,'8'],['r',9,3,15,8,'8'],['r',11,3,11,8,'h'],['p',3,2,'1']]),
 grid('z',[['r',0,3,6,8,'8'],['r',3,3,3,8,'h'],['r',10,3,15,8,'8'],['r',12,3,12,8,'h']]),
 grid('z',[['r',0,3,5,8,'8'],['r',9,2,14,9,'8']])]});
