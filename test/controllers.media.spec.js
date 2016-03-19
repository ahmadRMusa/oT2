import {MediaController} from '../src/controllers/media';
let Ractive = require('ractive');
Ractive.DEBUG = false;
let expect = require('chai').expect;

let mediaController = MediaController({
    element: document.body
});

describe('mediaController', () => {
    describe('basic functions', () => {
        it('should return a Ractive instance', () => {
            expect(mediaController).to.be.instanceof(Ractive);
        });        
        it('should return time', () => {
            expect(mediaController.get('time')).to.equal(0);
        });        
        it('should start playing', () => {
            expect(mediaController.get('status')).to.equal('paused');
            mediaController.fire('playPause');
            expect(mediaController.get('status')).to.equal('playing');
        });        
    });
});
