/**
 * 
 * Package: requireurl
 * Author: Ganesh B
 * Description: 
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/demo.js
 * File Description: Using requireurl instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
*/

/* eslint no-console: 0 */

'use strict';

let requireurls = require("../index");

/**
 * 
 * Demos are based on commit numbers or on tag numbers or version numbers
 * 
 * A commit number variable will start with C. Example C8d8681c4a2 will be commit - 8d8681c4a2
 * A version number based fetch example will start with V. Example V00_00_7 will be version - 00.00.7
 * A tag commit based fetch example will start with T. Example T0_0_7 will be tag - 0.0.7
 * 
 * NOTE:
 * 
 * All function implements will be based on the most recent commit of index.js.
 * Any change in demos of usage of function will be based on the recent commit. 
 * The URLs usage will based on what was fetched.
 * 
 */


/** 
 * Commit:
 * C2e5181793d
 * 
 * @type {*}
 * 
 */
let ESCJSC2e5181793d = import("https://github.com/ganeshkbhat/requireurl/blob/2e5181793dd8c076aafd46f3330c59e4abd70908/index.js");
console.log("[ESCJSC2e5181793d] Testing returns: ", ESCJSC2e5181793d);


