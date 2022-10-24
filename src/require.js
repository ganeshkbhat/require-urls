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
 * @param {*} localGitFileCacheUrl
 * @param {*} options
 * @return {*} 
 */
function _requireImportNodeCache(localGitFileCacheUrl, options) {
    return _getRequireOrImport("node:" + localGitFileCacheUrl)
}

/**
 *
 *
 * @param {*} request
 * @param {*} localGitFileCacheUrl
 * @param {*} options
 * @return {*} 
 */
function _requireImport(request, localGitFileCacheUrl, options) {
    try {
        if (!!fs.existsSync(localGitFileCacheUrl) && !options.forceUpdate) {
            localGitFileCacheUrl = (os.type() === "Windows_NT" && !localGitFileCacheUrl.includes("file://")) ? ("file://" + localGitFileCacheUrl) : localGitFileCacheUrl;
            if (!!options.cacheFetch) return _requireImportNodeCache(localGitFileCacheUrl);
            return _getRequireOrImport(localGitFileCacheUrl);
        }
        return false;
    } catch (err) {
        throw new Error("[require-urls]: index.js: File type cannot be required or imported.\n", err.toString())
    }
}

/**
 *
 *
 * @param {*} request
 * @param {*} localGitFileCacheUrl
 * @param {*} data
 * @param {*} options
 * @return {*} 
 */
async function _requireWriteImport(request, localGitFileCacheUrl, data, options) {
    try {
        options.logger("[require-urls] index.js: Writing fetched file to .jscache, File:", localGitFileCacheUrl);
        await fs.promises.writeFile(localGitFileCacheUrl, data.toString());
        options.logger("[require-urls] index.js: Written fetched file to .jscache, File:", localGitFileCacheUrl);
        return _requireImport(request, localGitFileCacheUrl, options);
    } catch (err) {
        throw new Error("[require-urls] index.js: File type cannot be required or imported.\n", err.toString())
    }
}

/**
 *
 *
 * @param {*} request
 * @param {*} localGitFileCacheUrl
 * @param {*} options
 * @return {*} 
 */
function _require(request, localGitFileCacheUrl, options) {
    let _import = _requireImport(request, localGitFileCacheUrl, options);
    if (!!_import) return _import;
    return fetch(request).then(response => {
        if (!!response.status) { if (response.status === 404) { throw new Error("[require-urls] index.js: \n[ERROR]: 404 Error.\n[DETAILS]: The file or package does not exist in the repository.\nPlease check if any dependenecies were not available or installed in your project needed for the package.\nDependency File or Package path and name: " + request) } }
        return response.text()
    })
        .then(function (data) {
            // options.logger("[require-urls] index.js: Data from fetched file", data, "\n");
            return _requireWriteImport(request, localGitFileCacheUrl, data, options);
        }.bind(_requireWriteImport));
}


/**
 *
 *
 * @param {*} request
 * @param {*} options
 * @return {*} 
 */
 function _getRequirePaths(request, options) {
    if (!!request.includes("https://github.com/") || !!request.includes("https://www.github.com/")) {
        request = request.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("blob/", "");
    }

    let urlFetch = request.split("https://")[1];
    let git = _getGitRoot(process.cwd(), options);

    let localGitRoot = path.join(git.split(".git")[0]);
    let jsCacheUrl = path.join(localGitRoot, ".jscache");
    let localGitFileCacheUrl;
    let remoteGitRoot, remotePackagejsonRoot, remoteFullPath;

    if (options.baseType === "git") {
        let tmpUrl = urlFetch.replace("raw.githubusercontent.com", "github");
        let arrUrl = tmpUrl.split("github");
        let bArrUrl = arrUrl[1].split("/");

        bArrUrl[0] = bArrUrl[1] + "@" + bArrUrl[2];
        bArrUrl.splice(1, 2);

        urlFetch = [...arrUrl[0], "github", ...bArrUrl].join("/");

        options.logger("[require-urls]: index.js: Base directory", localGitRoot);
        options.logger("[require-urls]: index.js: Fetch to URL: urlFetch:", urlFetch);

        localGitFileCacheUrl = path.join(jsCacheUrl, urlFetch);
        options.logger("[require-urls]: index.js: Local cache URL: localGitFileCacheUrl:", localGitFileCacheUrl);
    } else if (options.baseType === "svn") {
        // localGitFileCacheUrl = path.join(_getGitRoot(process.cwd().toString(), options).split(".svn")[0], ".jscache", urlFetch);
    } else {
        // localGitFileCacheUrl = path.join(_getGitRoot(process.cwd().toString(), options).split("node_modules")[0], ".jscache", urlFetch);
    }

    var localOrRemoteGitFilename = localGitFileCacheUrl.split("\\").pop();
    var localFullPath = localGitFileCacheUrl.replace(localOrRemoteGitFilename, "");

    var requireRemotePaths = request;
    requireRemotePaths.split("/").pop();

    return {
        localOrRemoteGitFilename: localOrRemoteGitFilename,
        localGitRoot: localGitRoot,
        jsCacheUrl: jsCacheUrl,
        localGitFileCacheUrl: localGitFileCacheUrl,
        localFullPath, localFullPath,
        remoteGitRoot: remoteGitRoot,
        remotePackagejsonRoot: remotePackagejsonRoot,
        requireRemotePaths: requireRemotePaths
    };
}


module.exports._requireImportNodeCache = _requireImportNodeCache;
module.exports._requireImport = _requireImport;
module.exports._requireWriteImport = _requireWriteImport;
module.exports._require = _require;
module.exports._getRequirePaths = _getRequirePaths;
