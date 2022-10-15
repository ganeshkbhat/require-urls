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

let c = import("https://github.com/cgi-js/cgi-js/blob/main/src/configs.js");
console.log("[REQUIREURLS] demo-import.mjs ", c.then((d) => {
    console.log(d)
}));


let d = import("https://github.com/cgi-js/cgi-js/blob/main/src/index.js");
console.log("[REQUIREURLS] demo-import.mjs ", d);


// requireurls.then(d => console.log("Testing returns", d));

