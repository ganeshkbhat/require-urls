/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: .loader-template.mjs
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * Reference: https://nodejs.org/api/esm.html#import-statements
 * 
*/

/* eslint no-console: 0 */

'use strict';

// .loader-template.mjs
export function resolve(specifier, context, nextResolve) {
    const { parentURL = null } = context;


    return nextResolve(specifier);
}

export function load(url, context, nextLoad) {


    return nextLoad(url);
}

