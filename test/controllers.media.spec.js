import {MediaController} from '../src/controllers/media';
let Ractive = require('ractive');
Ractive.DEBUG = false;
let expect = require('chai').expect;

let data = require('raw!./mp3.txt');
let prefix = 'data:audio/mp3;base64,';
let mp3 = prefix+data;

let mediaController = MediaController({
    element: document.body
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
    });
});

// - onReset
// - setFile
// - getTime
// - setTime
