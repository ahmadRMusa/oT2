// CSS is actually compiled as a separate file
require("./css/index.scss");

let localforage = require('localforage');
import {FileController} from './controllers/file';
import {MediaController} from './controllers/media';
import {Storage} from './storage';

let mediaController = MediaController({
    element: document.querySelector('.media-container')
});
let [fileController, scribe] = FileController({
    element: document.querySelector('.transcript-container'),
    setTime: (time)=> mediaController.set('_time',time),
    getTime: ()=> mediaController.get('time')
});

// let storage = localforage.createInstance({
//     name: 'oTranscribe'
// });

// storage.getItem('settings')
//     .then(applySettings,storageError)
//     .then();

let storage = Storage({
    /* no opts needed... yet */
});
storage.list().then(function(list){
    if (list.length > 0) {
        storage.load(list[0].id)
        .then(function(file){
            fileController.set(file);
        }, storageError);
    } else {
        fileController.set({
            id: +(new Date()),
            text: 'Blank document text.....'
        });
    }
    
    fileController.on('save',function(){
      let current = fileController.get();
        storage.save(current).then(function(){
            console.log('Saved files');
        }, storageError);
    });
}, storageError);


function applySettings(value){
    if (value !== null) {
        settings.skipTime = value.skipTime || settings.skipTime;
    }
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

function storageError(error){
    console.error('Problem using storage.', error);
}


