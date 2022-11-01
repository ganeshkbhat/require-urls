/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/filelock.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * https://webhookrelay.com/v1/functions/function-crypto-package.html
 * 
 * TODO:
 * Consider checks and function additions for "low-level comparators between versions" and "working with ranges" and a few "functions for working with versions"
 * https://github.com/npm/node-semver
 * 
*/

/* eslint no-console: 0 */

'use strict';


const {
    _writeFileLock, _createSHAHash, _readFileLock,
    _createFileLock, _updateFileLockEntry, _deleteFileLockEntry,
    _fileContentHash, _fileContentDeHash,
    _verifyFilelockFile, _verifyFilelock,
    _verifySHAHash, _verifyFileContentHash
} = require("filelock.json");


module.exports._writeFileLock = _writeFileLock;
module.exports._createSHAHash = _createSHAHash;
module.exports._readFileLock = _readFileLock;
module.exports._createFileLock = _createFileLock;
module.exports._updateFileLockEntry = _updateFileLockEntry;
module.exports._deleteFileLockEntry = _deleteFileLockEntry;
module.exports._fileContentHash = _fileContentHash;
module.exports._fileContentDeHash = _fileContentDeHash;
module.exports._verifyFilelockFile = _verifyFilelockFile;
module.exports._verifyFilelock = _verifyFilelock;
module.exports._verifySHAHash = _verifySHAHash;
module.exports._verifyFileContentHash = _verifyFileContentHash;

