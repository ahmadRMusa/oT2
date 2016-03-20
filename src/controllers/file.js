let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/file.html');
let Scribe = require('scribe-editor');
import {timestampPlugin} from '../scribe-timestamp-plugin';

/*
opts:
- element
- setTime (callback that takes time in seconds as argument)
- getTime (callback that returns time in seconds)
*/
function createFileController(opts){
    let model = {
        date: +(new Date()),
        lastMedia: "",
        offsetSeconds: 0,
        history: [],
        text: '',
        _userEditing: false,
        cleanText: function(){
            // TODO: filter out non-whitelisted HTML
            return this.get('text');
        },
        wordCount: 0
    };

    

    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model
    });
    
    controller.set('editorSidePanelPosition',
        getPanelPosition(controller.find('.text-editor'))
    );

    let scribe = new Scribe(controller.find('.text-editor'));
    scribe.use( timestampPlugin );
    scribe.on('content-changed',()=>{
        controller.set('wordCount', countWords(scribe.getTextContent()) );
    });
    
    function insertTimestamp(){
        scribe.commands.insertTimestamp.execute( opts.getTime() );
        setTimeout(()=>addTimestampEvents,10);
    }
    controller.on('insertTimestamp',()=>{
        insertTimestamp();
        return false;
    });
    scribe.el.addEventListener('keydown', (event)=>{
        if (event.keyCode === 74 && event.metaKey) {
            event.preventDefault();
            console.log(event);
            scribe.el.focus();
            insertTimestamp();
            return false;
        }
    });
    
    setInterval( addTimestampEvents, 100);
        
    function setFromTimestamp(){
        opts.setTime( +this.dataset.timestamp );
    };
    function addTimestampEvents(){
        let timestamps = opts.element.querySelectorAll('.timestamp');
        // console.log(timestamps)
        for (var i = 0; i < timestamps.length; i++) {
            // timestamps[i].removeEventListener('click',setFromTimestamp);
            timestamps[i].addEventListener('click',setFromTimestamp);
        }
    }

    return [controller, scribe];
}

export {createFileController as FileController};


// small utility for getting the word count of a string
// originally contributed by Piotr Tarasewicz
function countWords(str){
    var trimmedStr = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
    if (trimmedStr){
        return trimmedStr.match(/[\S]+/gi).length;
    }
    return 0;
}



function getPanelPosition(editorEl){
    return editorEl.offsetLeft + editorEl.offsetWidth;
}


