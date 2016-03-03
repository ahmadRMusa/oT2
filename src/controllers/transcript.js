let Ractive = require('ractive');

let template = require('raw!../templates/transcript.html');

let model = {
    _text: "",
    transcript: {
        date: +(new Date()),
        lastMedia: "",
        offsetSeconds: 0,
        history: []
    }
};

let computed = {
    'transcript:text': {
        get: function(){
            // TODO: filter HTML out
            return this._text;
        },
        set: function(text){
            this._text = text;
        }
    }
};

let transcriptController = new Ractive({
    el: document.querySelector('.transcript-container'),
    template: template,
    data: model,
    computed: computed
});

export {transcriptController as transcriptController};


