// /**
//  * 
//  * Package: 
//  * Author: Ganesh B
//  * Description: 
//  * Install: npm i require-urls --save
//  * Github: https://github.com/ganeshkbhat/requireurl
//  * npmjs Link: https://www.npmjs.com/package/require-urls
//  * File: test-require-html.js
//  * Test for File: index.js
//  * File Description: 
//  * 
// */

// const expect = require('chai').expect;
// const traverse = require("../src/traverse");

// describe('test-require-html.js::require-urls: Test Suite for Traverse Files', function() {


//     before(async function(){
//     
//     });


//     describe ('test-require-html.js::require-urls: [Test A] Test Suite for traversing and searching folders in main repo directory', function() {
//         // it('[Test B] status', function(done){
//         //     expect(200).to.equal(200);
//         //     done();
//         // });

//         it('[Test B] Search file LICENSE in main directory', function(done) {
//             expect(100).to.equal(100);
//             done();
//         });

//     });


// });


let demo = require("../index");
let c = demo.requireurls("https://stackoverflow.com/questions/5612787/converting-an-object-to-a-string", { noRequire: true });

c.then(d => console.log("Testing returns", d));

