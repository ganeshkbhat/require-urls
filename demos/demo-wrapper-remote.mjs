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

import { default as requireurls } from "https://github.com/ganeshkbhat/requireurl/blob/main/index.js";

console.log("[requireurls@latest] Testing returns: ", requireurls);
let r = requireurls("https://github.com/ganeshkbhat/requireurl/blob/main/loader.mjs");
console.log(r);

