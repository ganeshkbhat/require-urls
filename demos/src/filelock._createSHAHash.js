/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: demos/src/__.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

const path = require("path");
const _filelock = require("../../src/filelock.js");

let filelockOptions = { username: "cgi-js", repository: "cgi-js", repositoryPath: "https://www.github.com/cgi-js/cgi-js", localPath: "C:\\Users\\GB\\Documents\\projects\\requireurl\\.jscache\\github\\cgi-js@cgi-js\\4fd7793\\", commit: "4fd7793", sha: "", tag: "" };
let fileoptions = { name: "index.js", localPath: "C:\\Users\\GB\\Documents\\projects\\requireurl\\.jscache\\github\\cgi-js@cgi-js\\4fd7793\\index.js", remote: "", sha: "", digest: "base64", dependencies: {} };

let fileHash = _filelock._createSHAHash("sha256", JSON.stringify(require(path.join(filelockOptions.localPath, "filelock.json"))), "base64");

console.log("[require-urls] demos/src/filelock._createFileLockJson.js: filelock - ", fileHash);

