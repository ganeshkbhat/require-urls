/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/request.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';


const path = require('path');
const fs = require('fs');
const { _getRequirePaths } = require("./git.js");

/** New Structure for Revamped version of index.js with better isolation, and independent functions */

/**
 *
 *
 * @param {*} options
 * @param {*} data
 * @return {*} 
 */
function _getRequest(options, data, protocol) {
    return new Promise((resolve, reject) => {
        const { get } = (protocol === "https") ? require("https") : require("http");
        get(options, (res) => {
            let result = '';
            res.on('data', (chunk) => result += chunk);
            res.on('end', () => resolve(JSON.parse(result)));
        }).on('error', (err) => reject(err));
    });
}

/**
 *
 *
 * @param {*} request
 * @param {*} options
 * @param {*} localGitFileCacheUrl
 * @param {*} _requireWriteImport
 * @return {*} 
 */
function _fetch(request, options, localGitFileCacheUrl, _requireWriteImport) {
    return fetch(request).then(response => response.text())
        .then(function (data) {
            return _requireWriteImport(request, localGitFileCacheUrl, data, options)
        }.bind(_requireWriteImport));
}


module.exports._getRequest = _getRequest;
module.exports._fetch = _fetch;
