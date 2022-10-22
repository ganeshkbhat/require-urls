/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/require.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

/**
 *
 *
 * @param {*} module_name
 * @return {*} 
 */
function _getRequireOrImport(module_name) {
    if (process.versions.node.split('.')[0] > "14") {
        return import(module_name);
    }
    return require(module_name);
}


const path = require('path');
const fs = require('fs');
const os = require("os");

const { _getRequest, _fetch } = require("./request.js");

/** New Structure for Revamped version of index.js with better isolation, and independent functions */

/**
 *
 *
 * @param {*} gitFileCacheUrl
 * @param {*} options
 * @return {*} 
 */
function _requireImportNodeCache(gitFileCacheUrl, options) {
    return _getRequireOrImport("node:" + gitFileCacheUrl)
}

/**
 *
 *
 * @param {*} request
 * @param {*} gitFileCacheUrl
 * @param {*} options
 * @return {*} 
 */
function _requireImport(request, gitFileCacheUrl, options) {
    try {
        if (!!fs.existsSync(gitFileCacheUrl) && !options.forceUpdate) {
            gitFileCacheUrl = (os.type() === "Windows_NT" && !gitFileCacheUrl.includes("file://")) ? ("file://" + gitFileCacheUrl) : gitFileCacheUrl;
            if (!!options.cacheFetch) return _requireImportNodeCache(gitFileCacheUrl);
            return _getRequireOrImport(gitFileCacheUrl);
        }
        return false;
    } catch (err) {
        throw new Error("[require-urls] index.js: File type cannot be required or imported.\n", err.toString())
    }
}

/**
 *
 *
 * @param {*} request
 * @param {*} gitFileCacheUrl
 * @param {*} data
 * @param {*} options
 * @return {*} 
 */
async function _requireWriteImport(request, gitFileCacheUrl, data, options) {
    try {
        options.logger("[require-urls] index.js: Writing fetched file to .jscache, File:", gitFileCacheUrl);
        await fs.promises.writeFile(gitFileCacheUrl, data.toString());
        options.logger("[require-urls] index.js: Written fetched file to .jscache, File:", gitFileCacheUrl);
        return _requireImport(request, gitFileCacheUrl, options);
    } catch (err) {
        throw new Error("[require-urls] index.js: File type cannot be required or imported.\n", err.toString())
    }
}

/**
 *
 *
 * @param {*} request
 * @param {*} gitFileCacheUrl
 * @param {*} options
 * @return {*} 
 */
function _require(request, gitFileCacheUrl, options) {
    let _import = _requireImport(request, gitFileCacheUrl, options);
    if (!!_import) return _import;
    return fetch(request).then(response => response.text())
        .then(function (data) {
            // options.logger("[require-urls] index.js: Data from fetched file", data, "\n");
            return _requireWriteImport(request, gitFileCacheUrl, data, options)
        }.bind(_requireWriteImport));
}

module.exports._requireImportNodeCache = _requireImportNodeCache;
module.exports._requireImport = _requireImport;
module.exports._requireWriteImport = _requireWriteImport;
module.exports._require = _require;
