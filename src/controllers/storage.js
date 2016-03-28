let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/storage.html');
import {Storage} from '../storage';

function createController(opts){

    let storage = Storage();
    
    let model = {
    };

    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model
    });
    
    storage.list().then((files)=>{
        files.forEach((f)=>{
            f.dateFormatted = Date(f);
        })
        controller.set('files',files);
    });
    return controller;
}

export {createController as StorageController};
