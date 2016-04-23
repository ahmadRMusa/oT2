
let localforage = require('localforage');
import {EditorController} from './controllers/editor';
import {PickerController} from './controllers/picker';
import {MediaController} from './controllers/media';
import {StorageController} from './controllers/storage';

let mediaController = MediaController({
    element: document.querySelector('.media-container')
});
let editorController = EditorController({
    element: document.querySelector('.transcript-container'),
    setTime: mediaController.setTime,
    getTime: mediaController.getTime
});
let pickerController = PickerController({
    element: editorController.find('.picker-container')
});
let storageController = StorageController({
    element: document.querySelector('.storage-container'),
    getEditorContents: ()=>editorController.getFile(),
    onFileChange: (file)=>{
        editorController.setFile(file);
    	pickerController.set('lastMedia',file.lastMedia);    
    },
    onOpen: editorController.lock,
    onClose: editorController.unlock
});
pickerController.observe('file',(file)=>{
	mediaController.setFile(file);
	editorController.setFileLoaded(!!file.url);
	if (file.title) {
        editorController.setLastMedia(file.title);
		pickerController.set('lastMedia',file.title);
	}
});
mediaController.onReset(()=>{
	pickerController.fire('resetPicker');
	editorController.setFileLoaded(false);
});



