import {EditorController} from '../src/controllers/editor';
let expect = require('chai').expect;

let editorController = EditorController({
    element: document.body
});

describe('editorController', () => {
    it('should have a getFile method', () => {
        expect(editorController.getFile().text).to.equal('');
    });
    it('should have a setFile method', () => {
        editorController.setFile({
            text: 'test'
        });
        expect(editorController.getFile().text).to.equal('test');
    });
    it('should have an onSave method', () => {
        expect(editorController.onSave).to.be.a('function');
    });
    it('should have a setFileLoaded method', () => {
        editorController.setFileLoaded(true);
        expect(editorController.getFile().fileLoaded).to.equal(true);
        editorController.setFileLoaded(false);
        expect(editorController.getFile().fileLoaded).to.equal(false);
    });
    it('should have a setLastMedia method', () => {
        editorController.setLastMedia('xyz');
        expect(editorController.getFile().lastMedia).to.equal('xyz');
    });
    it('should have a find method', () => {
        expect( editorController.find('.text-editor-container') ).to.be.an.instanceOf(Node);
    });
    it('should have lock and unlock methods', () => {
        expect( editorController.find('.text-editor').getAttribute('contentEditable') ).to.equal('true');
        editorController.lock();
        expect( editorController.find('.text-editor').getAttribute('contentEditable') ).to.equal('false');
        editorController.unlock();
        expect( editorController.find('.text-editor').getAttribute('contentEditable') ).to.equal('true');
    });
});
