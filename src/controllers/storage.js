let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/storage.html');
import {Storage} from '../storage';

function createController(opts){

    let storage = Storage();
    
    let model = {
        activeFile: -1
    };

    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model
    });
    
    controller.on('selectFile',(e)=>{
        let id = e.node.dataList.id;
        controller.set('activeFile',id);
    });
    
    storage.list().then((files)=>{
        let activeFile = controller.get('activeFile');
        files.forEach((f)=>{
            f.dateFormatted = Date(f);
            if (f.id === activeFile) {
                f.active = true;
            }
        })
        controller.set('files',files);
    });
    return controller;
}

export {createController as StorageController};
