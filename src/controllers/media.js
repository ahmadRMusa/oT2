let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/media.html');

/*
opts:
- element
*/
function createMediaController(opts){
    let model = {};
    let controller = Ractive({
        element: opts.element,
        template: template,
        data: model
    });
    return controller;
}

export {createMediaController as MediaController};
