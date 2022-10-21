// /**
//  * 
//  * Package: 
//  * Author: Ganesh B
//  * Description: 
//  * Install: npm i require-urls --save
//  * Github: https://github.com/ganeshkbhat/requireurl
//  * npmjs Link: https://www.npmjs.com/package/require-urls
//  * File: test-require-import.mjs
//  * Test for File: loader.mjs + wrapper.mjs
//  * File Description: 
//  * 
// */

// const expect = require('chai').expect;
// const traverse = require("../src/traverse");

// describe('test-require-import.mjs::require-urls: Test Suite for Traverse Files', function() {


//     before(async function(){
// 
//     });


//     describe ('test-require-import.mjs::require-urls: [Test A] Test Suite for traversing and searching folders in main repo directory', function() {
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

    let c = import("https://github.com/cgi-js/cgi-js/blob/main/src/configs.js");
    console.log(c);
    
    // // Following needs recursive url import
    // let d = import("https://github.com/cgi-js/cgi-js/blob/main/src/index.js");


// requireurls.then(d => console.log("Testing returns", d));

