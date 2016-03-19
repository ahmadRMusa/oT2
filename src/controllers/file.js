let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/file.html');
let Scribe = require('scribe-editor');
import {timestampPlugin} from '../scribe-timestamp-plugin';

/*
opts:
- element
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

    let scribe = new Scribe(controller.find('.text-editor'));
    scribe.use( timestampPlugin );

    // small utility for getting the word count of a string
    // originally contributed by Piotr Tarasewicz
    function countWords(str){
        var trimmedStr = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
        if (trimmedStr){
            return trimmedStr.match(/[\S]+/gi).length;
        }
        return 0;
    }
    
    return [controller, scribe];
}

export {createFileController as FileController};


