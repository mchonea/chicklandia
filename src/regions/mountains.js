'use strict';
/* region: mountains */
// N cliff  g snow  E pine  M boulder  z chasm
defineRegion({id:'mountains',name:'MOUNTAINS',kind:'outdoor',origin:[0,4],grid:[2,1],ground:'snow',beyond:true,
 screens:[
 [ // mountain trail
  'NNNNNNNNNNNNNNNN',
  'NNgEggggggggEgNN',
  'NggggMMMggggggEN',
  'NgEgMgggMggEgggN',
  'NggggMMMgggggggN',
  'NgEggggggggggggg',
  'Nggggggggggggggg',
  'NNggEggggggEgggN',
  'NgggggggggggggNN',
  'NEgggggggggggEgN',
  'NNggggggggggNNNN',
  'NNNNNNNggNNNNNNN'],
 [ // snowy peak
  'NNNNNNNNNNNNNNNN',
  'NgggEgggNNgggggN',
  'NgggggggzzgggEgN',
  'NgEgggggzzgggggN',
  'NgggggggzzggggNN',
  'ggggggggzzgggggN',
  'ggggggggzzgggggN',
  'NgggEgggzzggEggN',
  'NgggggggzzgggggN',
  'NNggggggzzgggNNN',
  'NNNgggggzzggNNNN',
  'NNNNNNNNNNNNNNNN']]});
