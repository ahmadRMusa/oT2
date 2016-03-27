import {Player} from './../src/player';
let expect = require('chai').expect;

let data = require('raw!./mp3.txt');
let prefix = 'data:audio/mp3;base64,';
let mp3 = prefix+data;

describe('audio player', function(){
    describe('init', function(){
        it('should throw an error if initialised without required options', () => {
            expect(() => {
                let p = Player();
            }).to.throw();
            expect(() => {
                let p = Player({
                    driver: Player.drivers.HTML5_AUDIO
                });
            }).to.throw();
            expect(() => {
                let p = Player({
                    source: 'xx'
                });
            }).to.throw();
        });
        it('should initialise correctly', function(done){
            this.timeout(5000);
            let p = Player({
                driver: Player.drivers.HTML5_AUDIO,
                source: mp3,
                onReady: function(){ done(); }
            });
			p.destroy();
            done();
        });
        it('should destroy self', () => {
            let p = Player({
                driver: Player.drivers.HTML5_AUDIO,
                source: mp3
            });
			p.destroy();
            expect( document.querySelectorAll('audio').length ).to.equal( 0 );
        });
		
    });
    describe('playback control', () => {
        it('should run tests onReady',function(done){
            this.timeout(5000);
            var p = Player({
                driver: Player.drivers.HTML5_AUDIO,
                source: mp3,
                onReady: ()=>{
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
                    it('should return correct duration', () => {
                        console.log( p.getLength() );
                    });
                    it('should skip back when resuming', () => {
                        p.skipTo( 20 );
                        p.play();
                        expect( p.getTime() ).to.equal( 18.5 );
                        p.pause();
                    });
		            it('should destroy self', () => {
						p.destroy();
		                expect( p.getStatus() ).to.equal( 'destroyed' );
		                expect( document.querySelectorAll('audio').length ).to.equal( 0 );
		            });
                    done();
                }
            });
            it('should have status of loading', () => {
                expect( p.getStatus() ).to.equal( 'loading' );
            });
        });
        

    });
    describe('speed control', () => {
        it('should run tests onReady',function(done){
            this.timeout(5000);
            let p = Player({
                driver: Player.drivers.HTML5_AUDIO,
                source: mp3,
                onReady: ()=>{
                    it('should return the speed', () => {
                        expect( p.getSpeed() ).to.equal( 1 );
                    });
                    it('should set the speed', () => {
                        p.setSpeed(2);
                        expect( p.getSpeed() ).to.equal( 2 );
                    });
                    it('should speed down and up', () => {
                        expect.throws(()=>{
                            p.speed('xxx');
                        })
                        p.speed('down');
                        expect( p.getSpeed() ).to.equal( 1.75 );
                        p.speed('up');
                        expect( p.getSpeed() ).to.equal( 2 );
                        // below current minimum
                        p.speed(0.25);
                        expect( p.getSpeed() ).to.equal( 2 );
                        p.speed(1.25);
                        expect( p.getSpeed() ).to.equal( 1.25 );
                    });
					p.destroy();
                    done();
                }
            });
        });
    });
});


