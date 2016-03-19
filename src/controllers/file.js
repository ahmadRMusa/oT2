let Ractive = require('ractive');
Ractive.DEBUG = false;
let prosemirror = require("prosemirror");
let template = require('raw!../templates/file.html');

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

    let editor = new prosemirror.ProseMirror({
        place: controller.find('.text-editor'),
        docFormat: 'html',
        doc: ''
    });

    // when user types something update the model
    editor.on('change',function(){
        controller.set('_userEditing',true);
        controller.set('text', editor.getContent('html'));
        controller.set('_userEditing',false);
    });

    // small utility for getting the word count of a string
    // originally contributed by Piotr Tarasewicz
    function countWords(str){
        var trimmedStr = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
        if (trimmedStr){
            return trimmedStr.match(/[\S]+/gi).length;
        }
        return 0;
    }

    // when text in model is set programmatically, update editor
    controller.observe('text', function(newValue, oldValue){
        if ( !controller.get('_userEditing') ) {
            editor.setContent(newValue, 'html');
        }
        controller.set('wordCount',
            countWords(
                editor.getContent('text')
            )
        );
    });
    
    return controller;
}

export {createFileController as FileController};


