let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/file.html');
let Scribe = require('scribe-editor');
import {timestampPlugin} from '../scribe-timestamp-plugin';
let Mousetrap = require('mousetrap');

/*
contructor opts:
- element
- setTime (callback that takes time in seconds as argument)
- getTime (callback that returns time in seconds)

returns object with methods:
- getFile
- setFile
- onSave
- setFileLoaded
- setLastMedia
- find

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
        wordCount: 0,
		fileLoaded: false
    };

    

    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model
    });
    

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
    Mousetrap.bind('mod+j', ()=> {
        scribe.el.focus();
        insertTimestamp();
        return false;
    });
    setInterval( addTimestampEvents, 100);

    ['bold','italic','underline'].forEach((c)=>{
        let command = c;
        controller.on(command,()=>{
            scribe.getCommand(command).execute();
            return false;
        });
        Mousetrap.bind('mod+'+c[0], ()=>{
            controller.fire(c);
            return false;
        });
    });
	    
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
    
    let onSaveFn = ()=>{};
    controller.on('save',()=>{
        onSaveFn();
    });
    
    return {
        getFile: file=>{
            return controller.get();
        },
        setFile: file=>{
            controller.set(file);            
        },
        onSave: fn=>{
            onSaveFn = fn;
        },
        setFileLoaded: bool=>{
            controller.set('fileLoaded',bool);
        },
        setLastMedia: media=>{
    		controller.set('lastMedia',media);  
        },
        find: selector => {
            return controller.find(selector)
        }
    }
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

