// CSS is actually compiled as a separate file
require("./css/index.scss");

let localforage = require('localforage');
import {FileController} from './controllers/file';
import {PickerController} from './controllers/picker';
import {MediaController} from './controllers/media';
import {StorageController} from './controllers/storage';
import {Storage} from './storage';

let mediaController = MediaController({
    element: document.querySelector('.media-container')
});
let fileController = FileController({
    element: document.querySelector('.transcript-container'),
    setTime: mediaController.setTime,
    getTime: mediaController.getTime
});
let pickerController = PickerController({
    element: fileController.find('.picker-container')
});
let storageController = StorageController({
    element: document.querySelector('.storage-container')
});
pickerController.observe('file',(file)=>{
	mediaController.setFile(file);
	fileController.setFileLoaded(!!file.url);
	console.log('file.title',file.title)
	if (file.title) {
        fileController.setLastMedia(file.title);
		pickerController.set('lastMedia',file.title);
	}
});
mediaController.onReset(()=>{
	pickerController.fire('resetPicker');
	fileController.setFileLoaded(false);
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
            fileController.setFile(file);
			pickerController.set('lastMedia',file.lastMedia);
        }, storageError);
    } else {
        fileController.set({
            id: +(new Date()),
            text: 'Blank document text.....'
        });
    }
    
    fileController.onSave(function(){
        let current = fileController.getFile();
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


