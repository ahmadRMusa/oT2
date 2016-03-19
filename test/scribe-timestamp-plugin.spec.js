let expect = require('chai').expect;
import {timestampPlugin} from './../src/scribe-timestamp-plugin';
let Scribe = require('scribe-editor');

let scribeContainer = document.createElement('div');
document.body.appendChild( scribeContainer );
let scribe = new Scribe( scribeContainer );
scribe.use( timestampPlugin );


describe('insertTimestamp', () => {
    it('should register the insertTimestamp command', () => {
        expect( scribe.commands ).to.have.property('insertTimestamp');
    });
    it('should insert a timestamp into a Scribe instance', () => {
        scribe.el.focus();
        scribe.getCommand('insertTimestamp').execute( 30 );
        expect( scribe.el.querySelectorAll('.timestamp').length ).to.equal(1);
        expect( document.querySelectorAll('.timestamp').length ).to.equal(1);
    });
    it('should be contentEditable=false', () => {
        expect( scribeContainer.querySelector('.timestamp').getAttribute('contentEditable') ).to.equal('false');
    });
    it('should format time correctly', () => {
        scribeContainer.innerHTML = '';
        scribe.el.focus();
        scribe.getCommand('insertTimestamp').execute( 60 );
        expect( scribeContainer.querySelector('.timestamp').textContent ).to.equal('1:00');

        scribeContainer.innerHTML = '';
        scribe.getCommand('insertTimestamp').execute( 61.999 );
        expect( scribeContainer.querySelector('.timestamp').textContent ).to.equal('1:01');

        scribeContainer.innerHTML = '';
        scribe.getCommand('insertTimestamp').execute( 59.999 );
        expect( scribeContainer.querySelector('.timestamp').textContent ).to.equal('0:59');
    });
    it('should insert multiple next to each other', () => {
        scribeContainer.innerHTML = '';
        scribe.el.focus();
        scribe.getCommand('insertTimestamp').execute( 60 );
        scribe.getCommand('insertTimestamp').execute( 0 );
        scribe.getCommand('insertTimestamp').execute( 120 );
        expect( scribeContainer.querySelectorAll('.timestamp').length ).to.equal(3);
    });
});