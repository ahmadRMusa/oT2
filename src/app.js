
let localforage = require('localforage');
import {FileController} from './controllers/file';
import {PickerController} from './controllers/picker';
import {MediaController} from './controllers/media';
import {StorageController} from './controllers/storage';

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
    element: document.querySelector('.storage-container'),
    getEditorContents: ()=>fileController.getFile(),
    onFileChange: (file)=>{
        fileController.setFile(file);
    	pickerController.set('lastMedia',file.lastMedia);    
    }
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


// setInterval(()=>{
//     console.log(fileController.getFile().id);
//     storageController.updateFile(fileController.getFile());
// },1000*1);



