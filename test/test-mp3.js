let data = require('raw!./mp3.txt');
let prefix = 'data:audio/mp3;base64,';
function mp3(){ return prefix+data };
export {mp3 as mp3};
