// /**
//  * 
//  * Package: 
//  * Author: Ganesh B
//  * Description: 
//  * Install: npm i require-urls --save
//  * Github: https://github.com/ganeshkbhat/requireurl
//  * npmjs Link: https://www.npmjs.com/package/require-urls
//  * File: test-require-mjs.js
//  * Test for File: loader.mjs + wrapper.mjs
//  * File Description: 
//  * 
// */

// const expect = require('chai').expect;
// const traverse = require("../src/traverse");

// describe('test.search.files.js::traverse:fssys:traverse-cli: Test Suite for Traverse Files', function() {

//     let resultSingleArray, resultNestedArray;
//     before(async function(){
//         resultSingleArray = await traverse.dir("./", true, (d, f) => { return path.join(d, f.name); }, false, (e) => { console.log(e) }, "single");
//         resultNestedArray = await traverse.dir("./", true, (d, f) => { return path.join(d, f.name); }, false, (e) => { console.log(e) }, "nested");
//     });


//     describe ('test.search.files.js::traverse:fssys:traverse-cli: [Test A] Test Suite for traversing and searching folders in main repo directory', function() {
//         // it('[Test B] status', function(done){
//         //     expect(200).to.equal(200);
//         //     done();
//         // });

//         it('[Test B] Search file LICENSE in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test B] Search file package.json in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test B] Search file package-lock.json in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test B] Search folder ./node_modules in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//         it('[Test B] Search folder ./test in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });
//     });


// });



import  requireurls from "https://github.com/cgi-js/cgi-js/blob/main/src/index.js";

console.log("[REQUIREURLS] demo.mjs ", requireurls);


// requireurls.then(d => console.log("Testing returns", d));

