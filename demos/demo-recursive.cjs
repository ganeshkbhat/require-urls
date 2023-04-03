/**
 * 
 * Package: requireurl
 * Author: Ganesh B
 * Description: 
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/demo.mjs
 * File Description: Using requireurl instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
*/

/* eslint no-console: 0 */

'use strict';

// // Following needs recursive url import

let requireurls = require("../index");

let d = requireurls("https://github.com/cgi-js/cgi-js/blob/main/src/index.js", { baseType: "git", recursive: true, forceUpdate: true, logger: console.log, cacheFetch: false, getMethods: false, noRequire: false });
console.log("[require-urls] demo-recursive.js: Getting cgi-js file: ", d.then(r => console.log(r)));


// let d = import("https://github.com/cgi-js/cgi-js/blob/main/src/index.js");
// console.log(d.then(r => console.log(r.source)));

// requireurls.then(d => console.log("Testing returns", d));
