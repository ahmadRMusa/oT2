let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/media.html');
import {Player} from '../player';

/*
opts:
- element
*/
function createMediaController(opts){
    let model = {};
    if (!opts.element) {
        throw ('Needs element');
    }
    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model
    });
    
    let player = Player({
        driver: Player.drivers.HTML5_AUDIO,
        source: 'http://ejb.github.io/progressor.js/demos/echoplex.mp3'
    });

    controller.on('playPause',()=>{
        if (player.getStatus() !== 'playing') {
            player.play();
        } else {
            player.pause();
        }
    });

    return controller;
}

export {createMediaController as MediaController};
