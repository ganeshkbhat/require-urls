/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: 
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: test/test-require-import.js
 * Test for File: index.js
 * File Description: 
 * 
*/

const expect = require('chai').expect;

describe('test-require-import.js::require-urls: Test Suite for Traverse Files', function () {

    let requireurls;
    before(async function () {
        requireurls = require("../index.js");
        console.log("requireurls: ", requireurls);
        // let requireurls = require("../index");
        // let c = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");
        // c.then(d => console.log("[require-urls] test-require-js.js: Testing returns", d));
    });

    describe('test-require-js.js::require-urls: [Test A] Test Suite for requireurls functions - single non-recursive function tests', function () {

        // it('[Test B] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test A] Test for ', function (done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test A] Test for  ', function (done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test A] Test for ', function (done) {

            done();
        });

        it('[Test A] Test for  ', function (done) {

            done();
        });

        it('[Test A] Test for ', function (done) {

            done();
        });

        it('[Test A] Test for  ', function (done) {

            done();
        });

        it('[Test A] Test for ', function (done) {

            done();
        });

        it('[Test A] Test for  ', function (done) {

            done();
        });

    });

    describe('test-require-js.js::require-urls: [Test B] Test Suite for requireurls functions - recursive function tests', function () {

        // it('[Test B] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

    });

    describe('test-require-js.js::require-urls: [Test C] Test Suite for requireurls functions - packagejson tests', function () {

        // it('[Test C] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

    });

    describe('test-require-js.js::require-urls: [Test D] Test Suite for requireurls functions - repository root tests', function () {

        // it('[Test D] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

    });

});

