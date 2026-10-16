'use strict';
/* Furnished city rooms. Native furniture painters provide the matching physical footprints.
   Stable room IDs, screen coordinates and bottom exits preserve existing saves and content links. */
defineRegion({id:'cityin',name:'CITY',kind:'indoor',origin:[5,4],grid:[5,3],ground:'grass',beyond:true,
 screens:[
 ...[
  ['post','POST OFFICE'],['rocco',"ROCCO'S DEN"],['bistro',"REMY'S BISTRO"],['boutique',"MAGGIE'S BOUTIQUE"],['seed','SEED & FEED'],
  ['bakery','BAKERY'],['toy','TOY SHOP & ARCADE'],['cleo',"CLEO'S APARTMENT"],['artist',"THE ARTIST'S STUDIO"],['ducks','THE DUCK FLAT'],
  ['loft',"PIDGE'S LOFT"],['library','LIBRARY'],['museum','MUSEUM']
 ].map(([id,label])=>({id,label,rows:grid('#',[['r',1,3,14,10,'_'],['r',7,11,8,11,'X'],...(id==='toy'?[['p',13,9,'1']]:[])])})),
 null,null]});
