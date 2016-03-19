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
    });
});
