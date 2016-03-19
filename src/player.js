import {HTML5_AUDIO} from './player-drivers/html5-audio';

/*

methods:
- play
- pause
- getTime
- setTime (takes time in seconds)

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
        return driver.getTime();
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
    }
    return self;
};

Player.drivers = {
    HTML5_AUDIO: HTML5_AUDIO
};

export {Player as Player};


