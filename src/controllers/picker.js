let Ractive = require('ractive');
Ractive.DEBUG = false;

let template = require('raw!../templates/picker.html');

/*
opts:
- element
*/
function createPickerController(opts){
	let formats = listSupportedFormats();
	const defaultModel = {
		audioFormats: formats.audio.join('/'),
		videoFormats: formats.video.join('/'),
		typeWarning: '',
		active: 'active',
		pickingExternal: false
    };
    let model = defaultModel;
    let computed = {};
    if (!opts.element) {
        throw ('Needs element');
    }
    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model,
        computed: computed
    });
	
	controller.on('pickFile',(ev)=>{
	    let file = ev.node.files[0];
		let [type,format] = file.type.split('/');
		console.log(type,format)
	    if ( formats[type].indexOf(format) > -1 ){
			controller.set('typeWarning','');
			controller.set('active','');
			// send to player
			// save name of last file
	    } else {
			// show warning message that format is incompatible
			controller.set('typeWarning',file.type);
			// give #formats class .warning
	    }
		
	});
	
	controller.on('resetPicker',()=>{
		controller.set(defaultModel);
	});

	controller.on('openExternalPicker',()=>{
		controller.set('pickingExternal',true);
	});

    return controller;
}

export {createPickerController as PickerController};


function listSupportedFormats(){
	let formats = {
		audio: ['mp3', 'ogg', 'webm', 'wav', 'mpeg'],
		video: ['mp4', 'ogg', 'webm', 'quicktime']
	}
    let audio = formats.audio.filter(function(format) {
        return checkFormatSupport(format,'audio');
    });
    let video = formats.video.filter(function(format) {
        return checkFormatSupport(format,'video');
    });
    return {
    	audio: audio,
		video: video
    };
}
 
function checkFormatSupport(format,type){
    var a = document.createElement(type);
    return !!(a.canPlayType && a.canPlayType(type+'/'+format+';').replace(/no/, ''));
}
