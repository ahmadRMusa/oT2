// CSS is actually compiled as a separate file
require("./css/index.scss");

let localforage = require('localforage');
import {FileController} from './controllers/file';
import {PickerController} from './controllers/picker';
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
let pickerController = PickerController({
    element: fileController.find('.picker-container')
});
pickerController.observe('file',(file)=>{
	mediaController.set('file',file);
	fileController.set('fileLoaded',!!file.url);
	console.log('file.title',file.title)
	if (file.title) {
		fileController.set('lastMedia',file.title);
		pickerController.set('lastMedia',file.title);
	}
	console.log(fileController.get(),pickerController.get())
});
mediaController.on('resetMedia',()=>{
	pickerController.fire('resetPicker');
	fileController.set('fileLoaded',false);
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
			pickerController.set('lastMedia',file.lastMedia);
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


