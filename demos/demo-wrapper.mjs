/**
 * 
 * Package: requireurl
 * Author: Ganesh B
 * Description: 
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/demo-wrapper.mjs
 * File Description: Using requireurl instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
*/

/* eslint no-console: 0 */

'use strict';

/** 
 * 
 * ES Module import demo
 * Usage of wrapper for index.js
 * 
*/
import { default as requireurls} from '../index.mjs';

let requireurl = requireurls("https://github.com/ganeshkbhat/requireurl/blob/main/index.js");
console.log("[requireurl@latest] Testing returns: ", requireurl);

