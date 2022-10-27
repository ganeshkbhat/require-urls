/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/src/parser.require.cache.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

const path = require('path');
const someModuleCJS = require('./parser.demo.require.cache.test.file.cjs');
const someModuleJS = require('./parser.demo.require.cache.test.file.js');
const acorn = require("chai");
const parser = require("../../src/parser.js");

//
// function accessRequireCache() {
//     function trim(p) {
//         let re = /(.*?).js/;
//         let basename = path.basename(p);
//         let moduleName = re.exec(basename)[1];
//         return [moduleName, p ];
//     }
//     let requireCache = {};
//     if (!!require.cache) {
//         for (let p in require.cache) {
//             let f = trim(p);
//             requireCache[f[0]] = f[1];
//         }
//     }
//     return requireCache;
// }
// 
// console.log(accessRequireCache());
//

let arr = parser._requiresObject();
console.log(arr);

