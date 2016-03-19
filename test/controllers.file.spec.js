import {FileController} from '../src/controllers/file';
let Ractive = require('ractive');
Ractive.DEBUG = false;
let expect = require('chai').expect;

let fileController = FileController({
    element: document.body
});

describe('fileController', () => {
    describe('basic functions', () => {
        it('should return a Ractive instance', () => {
            expect(fileController).to.be.instanceof(Ractive);
        });
        it('should read and write the text property', () => {
            let testString = '<p>TESTING</p>';
            fileController.set('text',testString);
            expect(fileController.get('text',testString)).to.equal(testString);
        });
        
    });
});
