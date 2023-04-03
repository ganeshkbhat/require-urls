/**
 * 
 * Package: requireurl
 * Author: Ganesh B
 * Description: 
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/demo-html-text-norequirefetch.js
 * File Description: Using requireurl instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
*/
/* eslint no-console: 0 */

'use strict';

/**
 * 
 * ERRONEOUS CODEBASE FOR HTML REQUIRES
 * TODO: TESTING
 * 
 */
let requireurls = require("../index");
let c = requireurls("https://stackoverflow.com/questions/5612787/converting-an-object-to-a-string", { noRequire: true, logger: console.log });

c.then(d => console.log("Testing returns", d));

