import {Player} from './../src/player';
let expect = require('chai').expect;

describe('audio player', () => {
    describe('init', () => {
        it('should throw an error if initialised without required options', () => {
            expect(() => {
                let p = new Player();
            }).to.throw();
            expect(() => {
                let p = new Player({
                    driver: Player.drivers.HTML5_AUDIO
                });
            }).to.throw();
            expect(() => {
                let p = new Player({
                    source: 'xx'
                });
            }).to.throw();
        });
        it('should initialise correctly', () => {
            let p = new Player({
                driver: Player.drivers.HTML5_AUDIO,
                source: 'http://ejb.github.io/progressor.js/demos/echoplex.mp3'
            });
            expect( p ).to.respondTo( 'play' );
            
        });
    });
    describe('playback control', () => {
        let p = new Player({
            driver: Player.drivers.HTML5_AUDIO,
            source: 'http://ejb.github.io/progressor.js/demos/echoplex.mp3'
        });
        it('should return the time', () => {
            expect( p.getTime() ).to.equal( 0 );
        });
        it('should skip to specified time', () => {
            p.setTime(70);
            expect( p.getTime() ).to.equal( 70 );
        });
        it('should skip forwards & backwards', () => {
            p.skip('forwards');
            expect( p.getTime() ).to.equal( 71.5 );
            p.skip('backwards');
            p.skip('back');
            expect( p.getTime() ).to.equal( 68.5 );
        });
        it('should return correct status when playing and pausing', () => {
            p.play();
            expect( p.getStatus() ).to.equal( 'playing' );
            p.pause();
            expect( p.getStatus() ).to.equal( 'paused' );
        });
        
    });
});
