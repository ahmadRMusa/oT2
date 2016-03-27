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
		pickingExternal: false,
		url: '',
		file: {},
		dragging: false
    };
    let model = clone(defaultModel);
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
	    if ( formats[type].indexOf(format) > -1 ){
			controller.set('typeWarning','');
			controller.set('active','');
			controller.set('file', {
				url: createObjectURL(file),
				title: file.name
			});
	    } else {
			// show warning message that format is incompatible
			controller.set('typeWarning',file.type);
			// give #formats class .warning
	    }
		
	});
	
	controller.on('resetPicker',()=>{
		controller.set(clone(defaultModel));
	});

	controller.on('openExternalPicker',()=>{
		controller.set('pickingExternal',true);
	});

	// drag-n-drop UI cue
	controller.on('dragover',()=>{
		controller.set('dragging',true);
	});
	controller.on('dragleave',()=>{
		controller.set('dragging',false);
	});

    return controller;
}

export {createPickerController as PickerController};


function listSupportedFormats(){
	let formats = {
		audio: ['mp3', 'ogg', 'webm', 'wav', 'x-wav', 'mpeg'],
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

function createObjectURL(file){
    if (window.webkitURL) {
        return window.webkitURL.createObjectURL(file);
    } else {
        return window.URL.createObjectURL(file);      
    }
}

function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}
