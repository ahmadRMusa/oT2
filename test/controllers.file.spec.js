import {FileController} from '../src/controllers/file';
let Ractive = require('ractive');
let Scribe = require('scribe-editor');
Ractive.DEBUG = false;
let expect = require('chai').expect;

let [fileController, scribe] = FileController({
    element: document.body
});

describe('fileController', () => {
    describe('basic functions', () => {
        it('should return a Ractive instance and a scribe instance', () => {
            expect(fileController).to.be.instanceof(Ractive);
            expect(scribe).to.be.instanceof(Scribe);
        });
        it('should read and write the text property', () => {
            let testString = '<p>TESTING</p>';
            fileController.set('text',testString);
            expect(fileController.get('text',testString)).to.equal(testString);
        });
        
    });
});
