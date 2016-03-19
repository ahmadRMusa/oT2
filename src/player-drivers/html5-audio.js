let HTML5_AUDIO = function(source){
    this.element = document.createElement( 'audio' );
    this.element.src = source;
}
HTML5_AUDIO.prototype.play = function(){
    this.element.play();
}
HTML5_AUDIO.prototype.pause = function(){
    this.element.pause();
}
HTML5_AUDIO.prototype.getTime = function(){
    return this.element.currentTime;
}
HTML5_AUDIO.prototype.setTime = function(time){
    this.element.currentTime = time;
}




export {HTML5_AUDIO as HTML5_AUDIO};