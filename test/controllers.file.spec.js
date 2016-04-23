import {FileController} from '../src/controllers/file';
let expect = require('chai').expect;

let fileController = FileController({
    element: document.body
});

describe('fileController', () => {
    it('should have a getFile method', () => {
        expect(fileController.getFile().text).to.equal('');
    });
    it('should have a setFile method', () => {
        fileController.setFile({
            text: 'test'
        });
        expect(fileController.getFile().text).to.equal('test');
    });
    it('should have an onSave method', () => {
        expect(fileController.onSave).to.be.a('function');
    });
    it('should have a setFileLoaded method', () => {
        fileController.setFileLoaded(true);
        expect(fileController.getFile().fileLoaded).to.equal(true);
        fileController.setFileLoaded(false);
        expect(fileController.getFile().fileLoaded).to.equal(false);
    });
    it('should have a setLastMedia method', () => {
        fileController.setLastMedia('xyz');
        expect(fileController.getFile().lastMedia).to.equal('xyz');
    });
    it('should have a find method', () => {
        expect( fileController.find('.text-editor-container') ).to.be.an.instanceOf(Node);
    });
    it('should have lock and unlock methods', () => {
        expect( fileController.find('.text-editor').getAttribute('contentEditable') ).to.equal('true');
        fileController.lock();
        expect( fileController.find('.text-editor').getAttribute('contentEditable') ).to.equal('false');
        fileController.unlock();
        expect( fileController.find('.text-editor').getAttribute('contentEditable') ).to.equal('true');
    });
});
