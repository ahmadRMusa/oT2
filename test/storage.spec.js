import {Storage} from './../src/storage';
let localforage = require('localforage');
let expect = require('chai').expect;

localforage.createInstance({
    name: 'oTranscribe',
    driver: localforage.LOCALSTORAGE
}).clear();

describe('basic storage', () => {
    let storage = Storage({
        /* no opts needed... yet */
    });
    describe('listing', () => {
        it('should list an empty array', (done) => {
            storage.list().then((result) => {
                expect( result ).to.have.length(0);
                done();
            });
        });
    });
    describe('saving', () => {
        it('should save', (done) => {
            let file = {
                id: 234234
            };
            storage.save(file).then(() => {
                storage.list().then((result) => {
                    expect( result ).to.have.lengthOf(1);
                    expect( result[0].id ).to.equal(234234);
                    done();
                },err=>{
                    throw(err);
                });
            },err=>{
                throw(err);
            });
            
        });
        it('should have a last modified date', function(done) {
            storage.list().then((result) => {
                expect( result ).to.have.lengthOf(1);
                expect( result[0].lastModified ).to.be.ok;
                expect( result[0].lastModified ).to.be.a('number');
                done();
            },err=>{
                throw(err);
                expect( false ).to.be.ok;
            });
            
        });
    });
});
