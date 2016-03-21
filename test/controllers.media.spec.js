import {MediaController} from '../src/controllers/media';
let Ractive = require('ractive');
Ractive.DEBUG = false;
let expect = require('chai').expect;

let mediaController = MediaController({
    element: document.body
});

describe('mediaController', function(){
    this.timeout(5000);
    describe('basic functions', () => {
        it('should return a Ractive instance', () => {
            expect(mediaController).to.be.instanceof(Ractive);
        });        
        
        /*
        Restore these tests when proper loading-in of media is implemented
        
        it('should return time', () => {
            expect(mediaController.get('time')).to.equal(0);
        });        
        it('should start playing', (done) => {
            expect(mediaController.get('status')).to.equal('loading');
            setTimeout(()=>{
                expect(mediaController.get('status')).to.equal('paused');
                mediaController.fire('playPause');
                expect(mediaController.get('status')).to.equal('playing');
                mediaController.fire('playPause');
                done();
            },3000);              
        });        
        it('should have formatted time', (done) => {
            setTimeout(()=>{
                expect( mediaController.get('status') ).to.equal('paused');
                mediaController.fire('skipForwards');
                setTimeout(()=>{
                    mediaController.fire('skipForwards');
                    setTimeout(()=>{
                        mediaController.fire('skipForwards');
                        setTimeout(()=>{
                            mediaController.fire('skipForwards');
                            setTimeout(()=>{
                                expect(mediaController.get('time')).to.equal(6);
                                expect(mediaController.get('timeFormatted')).to.equal('0:06');
                                done();
                            },10);
                        },10);
                    },10);
                },10);
            },2000);
        });  
        */      
    });
});