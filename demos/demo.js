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
 * C8d8681c4a2
 * 
 * @type {*}
 * 
 */
let C8d8681c4a2 = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");
console.log("[C8d8681c4a2] Testing returns: ", C8d8681c4a2);

/** 
 * Version:
 * V00_00_7
 * 
 * @type {*}
 * 
 */
let V00_00_7 = requireurls("https://github.com/ganeshkbhat/requireurl/blob/a34a222d761bb70d51ff3267c8530f40918db53e/index.js");
console.log("[V00_00_7] Testing returns: ", V00_00_7);

/** 
 * Tag:
 * T0_0_7
 * 
 * @type {*}
 * 
 */
let T0_0_7 = requireurls("https://github.com/ganeshkbhat/requireurl/blob/a34a222d761bb70d51ff3267c8530f40918db53e/index.js");
console.log("[T0_0_7] Testing returns: ", T0_0_7);

/** 
 * Commit:
 * C2e5181793d
 * 
 * @type {*}
 * 
 */
let C2e5181793d = requireurls("https://github.com/ganeshkbhat/requireurl/blob/2e5181793dd8c076aafd46f3330c59e4abd70908/index.js");
console.log("[C2e5181793d] Testing returns: ", C2e5181793d);


/** 
 * Commit:
 * Clatestcommit
 * 
 * @type {*}
 * 
 */
let Clatestcommit = requireurls("https://github.com/ganeshkbhat/requireurl/blob/main/index.js", { baseType: "git", recursive: true, forceUpdate: true, logger: console.log, cacheFetch: false, getMethods: false, noRequire: false });
console.log("[Clatestcommit] index.js: ", Clatestcommit);

