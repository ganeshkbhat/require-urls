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

var { packageJsonParser } = require("../index.js");

let pkgjson = packageJsonParser(require("./package.json"));
console.log(pkgjson);
