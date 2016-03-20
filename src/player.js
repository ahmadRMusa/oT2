import {HTML5_AUDIO} from './player-drivers/html5-audio';

/*

options:
- driver
- source
- onReady

methods & properties:
- play
- pause
- getTime
- setTime (takes time in seconds)
- skip (forwards or backwards)
- getLength
- getStatus


*/
let Player = function( opts ){
    
    if (!opts) {
        throw('Player needs options');
    }
    if (!opts.driver) {
        throw('Driver not specified');
    }
    if (!opts.source) {
        throw('Source not specified');
    }
    
    let source = opts.source;
    let driver = new opts.driver(source);
    let skipTime = 1.5;
    
    let self = {}
    self.play = ()=>{
        driver.play();
    }
    self.pause = ()=>{
        driver.pause();
    }
    self.getTime = ()=>{
        return driver.isReady() ? driver.getTime() : 0;
    }
    self.setTime = (time)=>{
        driver.setTime(time);
    }
    self.skip = (direction)=>{
        if (direction === 'forwards') {
            driver.setTime( self.getTime() + skipTime );
        } else if ((direction === 'backwards') || direction === 'back') {
            driver.setTime( self.getTime() - skipTime );
        } else {
            throw ('Skip requires a direction: forwards or backwards')
        }
    },
    self.getStatus = ()=>{
        return driver.isReady() ? driver.getStatus() : 'loading';
    }
    self.getLength = ()=>{
        return driver.isReady() ? driver.getLength() : 0;
    }
    
    if (opts.onReady) {
        checkIfReady();
    };

    function checkIfReady(callback){
        if (driver.isReady()) {
            opts.onReady();
        } else {
            setTimeout(checkIfReady,10);
        }
    }

    return self;
};

Player.drivers = {
    HTML5_AUDIO: HTML5_AUDIO
};

export {Player as Player};


