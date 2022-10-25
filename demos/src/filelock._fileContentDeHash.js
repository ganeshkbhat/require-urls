/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/src/filelock._fileContentDeHash.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

const _filelock = require("../../src/filelock.js");
const salt = "foobar";

let dehash = _filelock._fileContentDeHash({ iv: 'Lpy//7ts6oKFCkv6q47QHQ==', content: 'S4AKOw==' }, "aes-256-ctr", "sha256", salt, "base64", { logger: console.log });
console.log("[require-urls] demos/src/filelock._fileContentHash.js: filelock - ", dehash);
