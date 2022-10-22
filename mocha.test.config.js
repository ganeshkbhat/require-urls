/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: mocha.test.config.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

module.exports = {
    spec: [
        './test/*.test.js',
        './test/**/*.test.js',
        './test/**/**/*.test.js',
        './test/**/**/**/*.test.js',
        './test/test.*.js',
        './test/**/test.*.js',
        './test/**/**/test.*.js',
        './test/**/**/**/test.*.js',
        './test/*.test.mjs',
        './test/**/*.test.mjs',
        './test/**/**/*.test.mjs',
        './test/**/**/**/*.test.mjs',
        './test/test.*.mjs',
        './test/**/test.*.mjs',
        './test/**/**/test.*.mjs',
        './test/**/**/**/test.*.mjs',
    ],
};