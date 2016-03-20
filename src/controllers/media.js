let Ractive = require('ractive');
Ractive.DEBUG = false;
import Mousetrap from 'mousetrap';

let template = require('raw!../templates/media.html');
import {Player, DummyPlayer} from '../player';

/*
opts:
- element
*/
function createMediaController(opts){
    let model = {
        status: 'paused',
        loading: false,
        time: 0
    };
    let computed = {
        timeFormatted: function(){
            return formatTime(this.get('time'));
        },
        lengthFormatted: function(){
            return formatTime(this.get('length'));
        }
    };
    if (!opts.element) {
        throw ('Needs element');
    }
    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model,
        computed: computed
    });
        
    let player = Player({
        driver: Player.drivers.HTML5_AUDIO,
        source: 'http://ejb.github.io/progressor.js/demos/echoplex.mp3',
        onReady: updateStatus
    });
    
    function updateStatus(){
        controller.set('status', player.getStatus() || 'paused');
        controller.set('time',player.getTime());
        controller.set('length',player.getLength());
    }
    
    // use temporary write-only properties
    // to prevent an endless loop
    controller.observe('_time',(time)=>{
        if (typeof time === 'number') {
            player.setTime(time);
        }
    });
    
    setInterval(updateStatus,5);

    controller.on('playPause',()=>{
        if (player.getStatus() !== 'playing') {
            player.play();
        } else {
            player.pause();
        }
        updateStatus();
    });

    controller.on('skipForwards',()=>{
        player.skip('forwards');
        updateStatus();
    });
    controller.on('skipBackwards',()=>{
        player.skip('backwards');
        updateStatus();
    });
    
    Mousetrap.bind('esc', ()=> {
        controller.fire('playPause');
        return false;
    });

    return controller;
}

export {createMediaController as MediaController};

function formatTime(time){
    let minutes = Math.floor(time / 60);
    let seconds = ("0" + Math.floor( time - minutes * 60 ) ).slice(-2);
    let formattedTime = minutes+":"+seconds;
    return formattedTime;
}