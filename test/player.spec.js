import {Player} from './../src/player';
let expect = require('chai').expect;

describe('audio player', () => {
    describe('init', () => {
        it('should initialise correctly', () => {
            let p = new Player();
            expect( p ).to.be.instanceOf( Player );
        });
    });
});
