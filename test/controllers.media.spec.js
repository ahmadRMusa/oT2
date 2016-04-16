import {MediaController} from '../src/controllers/media';
let Ractive = require('ractive');
Ractive.DEBUG = false;
let expect = require('chai').expect;

let data = require('raw!./mp3.txt');
let prefix = 'data:audio/mp3;base64,';
let mp3 = prefix+data;

var testDiv = document.createElement('div');
document.body.appendChild(testDiv);
let mediaController = MediaController({
    element: testDiv
});

describe('mediaController', function(){
    it('should have an onReset method', () => {
        expect(mediaController.onReset).to.be.a('function');
    });        
    it('should have setTime and getTime methods', () => {
        mediaController.setTime(123);        
        expect( mediaController.getTime() ).to.equal(0);
    });        
    it('should have a setFile method', () => {
        mediaController.setFile({
            url: mp3,
            title: 'test'
        });
        expect(true).to.be.ok;
        // cleanup
        var audio = document.querySelectorAll('audio');
        for (var i = 0; i < audio.length; i++) {
            audio[i].parentElement.removeChild(audio[i]);
        }
    });
});


// - onReset
// - setFile
// - getTime
// - setTime
