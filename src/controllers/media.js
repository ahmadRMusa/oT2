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
        time: 0,
        speed: 1,
        speedSliderClass: ''
    };
    let computed = {
        timeFormatted: function(){
            return formatTime(this.get('time'));
        },
        lengthFormatted: function(){
            return formatTime(this.get('length'));
        },
        progressPercent: function(){
            return (this.get('time') / this.get('length')) * 100;
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
        if (!mouseButtonDown) {
            controller.set('speed',player.getSpeed());
        }
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
    controller.on('speedUp',()=>{
        player.speed('up');
        updateStatus();
    });
    controller.on('speedDown',()=>{
        player.speed('down');
        updateStatus();
    });
    
    var mouseButtonDown = false;
    document.addEventListener('mousedown', (ev)=>{
        mouseButtonDown = true;
    }, false)
    document.addEventListener('mouseup', (ev)=>{
        mouseButtonDown = false;
    }, false)
    
    controller.on('speedSlider',(ev)=>{
        player.setSpeed( +ev.node.value );
    });
    controller.on('speedSliderFixed',(ev)=>{
        if(ev.original.target.className.match('speed-box')) {
            return;
        }
        if (controller.get('speedSliderClass')==='fixed') {
            controller.set('speedSliderClass','');
        } else {
            controller.set('speedSliderClass','fixed');
        }
    });
    
    setUpProgressBar(controller,player);
        
    Mousetrap.bind('esc', ()=> {
        controller.fire('playPause');
        return false;
    });
    Mousetrap.bind(['f1','mod+1'], ()=>{
        controller.fire('skipBackwards');
    });
    Mousetrap.bind(['f2','mod+2'], ()=>{
        controller.fire('skipForwards');
    });
    Mousetrap.bind(['f3','mod+3'], ()=>{
        controller.fire('speedDown');
    });
    Mousetrap.bind(['f4','mod+4'], ()=>{
        controller.fire('speedUp');
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

function setUpProgressBar(controller,player){
    var progressBar = controller.find('.progress-bar-inner');
    var mouseButtonDown = false;
    controller.on('progressBarMouseDown',(ev)=>{
        mouseButtonDown = true;
        setProgressFromProgressBar(ev);
    });
    document.addEventListener('mousemove', (ev)=>{
        setProgressFromProgressBar(ev);
    }, false)
    document.addEventListener('mouseup', (ev)=>{
        mouseButtonDown = false;
    }, false)
    function setProgressFromProgressBar(ev){
        if (!mouseButtonDown) { return; }
        if (!ev.x) {
            ev.x = ev.original.x;
        }
        var progress = (ev.x - progressBar.offsetLeft)/progressBar.offsetWidth;
        if (progress > 1) {
            progress = 1;
        } else if (progress < 0) {
            progress = 0;
        }
        var newTime = player.getLength() * progress;
        player.setTime( newTime );
    }
    
}