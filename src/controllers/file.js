let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/file.html');
let Scribe = require('scribe-editor');

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
    console.log(scribe, scribe.el.innerHTML)

    // small utility for getting the word count of a string
    // originally contributed by Piotr Tarasewicz
    function countWords(str){
        var trimmedStr = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
        if (trimmedStr){
            return trimmedStr.match(/[\S]+/gi).length;
        }
        return 0;
    }
    
    controller.on('insertTimestamp',() => {
        scribe.insertHTML('<span style="color: red;" contentEditable=false>0:00</span>');
        let stamps = scribe.el.querySelectorAll('span')
        for (var i = 0; i < stamps.length; i++) {
            stamps[i].setAttribute('contentEditable',false);
        }
    });

    return controller;
}

export {createFileController as FileController};


