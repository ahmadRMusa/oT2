let localforage = require('localforage');
import {fileController} from './controllers/file';

let settings = {
    skipTime: 1.5
};
let files = [];
addNewFile();
let activeFile = files[0];

let storage = localforage.createInstance({
    name: 'oTranscribe'
});

storage.getItem('settings').then(applySettings,loadError);
storage.getItem('files').then(loadFiles,loadError);

function applySettings(value){
    if (value !== null) {
        settings.skipTime = value.skipTime || settings.skipTime;
    }
}

function loadFiles(value){
    // if no files in storage
    if ((value !== null) && (value.length > 0)) {
        files = value;
        files = files.sort(function(a,b){
            return a.date - b.date;
        });
        // load latest file
        changeFile(files[0]);
    }
    saveFiles();
}

function changeFile(file) {
    console.log(file);
    activeFile = file;
    fileController.set(file);
}

function loadError(error){
    console.error(error);
}

function addNewFile(){
    files.push({
        text: ''
    });
}

function saveFiles(){
    storage.setItem('files',files)
      .then(onSaveSuccess,saveError);
    // save every minute
    setTimeout(saveFiles, 1000*60*1);
}

function onSaveSuccess(){
    // nothing yet... UI cue?
}

function saveError(error){
    console.error(error);
}




