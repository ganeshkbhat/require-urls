/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/src/parser.demo.require.cache.test.file.cjs
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

var test = require('./parser.demo.require.cache.test.file.js');
var tester = import("./parser.demo.require.cache.test.file.js");

var path = require('path');
var c = require('fs');
var f = require('child_process');


// if (!!import.meta.cache) {
//     for (let p in import.meta.cache) {
//         console.log(trim(p));
//     }
// }

// function trim(p) {
//     var re = /(.*?).js/;
//     var basename = path.basename(p);
//     var moduleName = re.exec(basename)[1];
//     return [moduleName, p];
// }


