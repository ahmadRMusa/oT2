/*
Plugin for Scribe

Register it:
    let scribe = new Scribe( scribeContainer );
    scribe.use( timestampPlugin );

Use it:
    scribe.getCommand('insertTimestamp').execute( 30 );

*/

function timestampPlugin(scribeInstance){
    let command = new scribeInstance.api.Command('insertHTML');
    command.execute = function (time) {
        let markup = createTimestampMarkup(time);
        scribeInstance.api.Command.prototype.execute.call( this, markup);
        
        let timestamps = scribeInstance.el.querySelectorAll('.timestamp');
        for (var i = 0; i < timestamps.length; i++) {
            timestamps[i].setAttribute('contentEditable',false);
        }
    }
    scribeInstance.commands['insertTimestamp'] = command;
    return scribeInstance;
}

function createTimestampMarkup(time) {
    let minutes = Math.floor(time / 60);
    let seconds = ("0" + Math.floor( time - minutes * 60 ) ).slice(-2);
    let formattedTime = minutes+":"+seconds;
    let markup = '<span class="timestamp" data-timestamp="'+time+'" >' + formattedTime + '</span>&nbsp;';
    return markup;
}

export {timestampPlugin as timestampPlugin};