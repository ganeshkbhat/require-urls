/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: index.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';


const path = require('path');
const fs = require('fs');
const os = require("os");

const { _getRequest, _fetch } = require("./src/request.js");
const { _concurrency } = require("./src/concurrency.js");
const { _getRoot, _getGitRoot, _getNodeModulesRoot, _getPackageJsonRoot, _createJscachePath, _getRequirePaths } = require("./src/getroot.js");
const { _createFolders, _writeFile, _registerNodeCache } = require("./src/filesystem.js");
const { _getRequireOrImport, _requireImportNodeCache, _requireImport, _requireWriteImport, _require } = require("./src/require.js");
const { _checkModuleImports, _requiresObject, _requireRegex, _importRegex, _importRegexExtended, _importESRegex } = require("./src/parser.js");
const { _searchGit, _findGitRemoteFileUrl, _findGitRemoteRootUrl, _findGitRemotePackageJsonUrl, _searchGitFilesResultsModifier, _getDirContentResultsModifier } = require("./src/git.js");
// const {  } = require("./src/svn.js");
// const {  } = require("./src/ftp.js");
// const {  } = require("./src/mercurial.js");

/** New Structure for Revamped version of index.js with better isolation, and independent functions */

/**
 *
 *
 * @param { Object } request
 * @param { Object } options
 * @return {*} 
 */
async function _getRemoteUrl(request, options) {
    let paths = _getRequirePaths(request, options);
    // require.main.paths.push(requirePaths);
    options.logger("[require-urls] index.js: Get all paths: ", paths);
    try {
        await _createFolders(paths.localFullPath);
    } catch (err) {
        throw new Error("[require-urls] index.js: file access error: ", err.toString());
    }

    options.logger("[require-urls]: index.js: Making Fetch request to ", request);
    // NOTE: Changing "request" to "paths.requireRemotePaths";
    return _require(paths.requireRemotePaths, paths.localGitFileCacheUrl, options);
}

/**
 *
 *
 * @param { Object } request
 * @param { Object } options
 * @param {*} [_importRemoteUrl=null]
 * @return {*} 
 */
function _concurrent_getRecursiveRemoteUrl(request, options, _importRemoteUrl = null) {
    try {
        if (!!_importRemoteUrl) {
            _getRecursiveRemoteUrl(_importRemoteUrl, options, _importRemoteUrl)
        }
        return _getRemoteUrl(request, options);
    } catch (e) {
        if (e.includes()) {
            // Get the filename from the MODULE_NOT_FOUND error
            let _filename = e.name;
            // Create Remote Path
            let _importRemoteUrl = "path";
            _getRecursiveRemoteUrl(request, options, _importRemoteUrl);
        }
        throw new Error("[require-urls] index.js: The error is not module related. ", e.toString());
    }
}

/**
 *
 *
 * @param { Object } request
 * @param { Object } options
 * @param {*} [_importRemoteUrl=null]
 * @return {*} 
 */
function _getRecursiveRemoteUrl(request, options, _importRemoteUrl = null) {
    let _import = _getRemoteUrl(request, options);
    let paths = _getRequirePaths(request, options);
    let required = _checkModuleImports(paths.localGitFileCacheUrl);
    if (!required) {}
}

/**
 *
 *
 * @param { Object } request
 * @param { Object } options
 * @return { Object } packagejson 
 */
function _getRecursiveRemotePackageJsonUrl(request, options) {
    // 
    // Get package.json
    // Get all files starting from (package.json).main 
    //          or index.*[js|mjs|cjs|json|node|wasm] 
    //          or all files in root folder `./[*.*[js|mjs|cjs|json|node|wasm]]` and folder `src/[*.*[js|mjs|cjs|json|node|wasm]]`
    // Add .jscache/path/to/git/repo folder to path
    // npm install production packages
    // 

    if (!request.includes("package.json")) return false;

    let packagejson = _getRemoteUrl(request, options);
    let remoteRoot = _findRemoteRootUrl(request, options);

    // if packagejson.main => get packagejson.main file recursively
    // install all npm deps for production mode
    if (!!packagejson.main) {
        try {
            if (!!packagejson.exports) {
                let k = Object.keys(packagejson.exports);
                k.map((i) => { _getRecursiveRemoteUrl(packagejson.exports[i]); return i; });
            }
            let pjmain = _getRecursiveRemoteUrl(packagejson.main);
            let npmi = _npminstall(packagejson.dependencies);
            if (!npmi) {
                return pjmain;
            }
            throw new Error("[require-urls] index.js: Unable to install npm packages.");
        } catch (pjmError) {
            throw new Error("[require-urls] index.js: Unable to fetch package.json.main file and package.json.export files correctly.", pjmError.toString());
        }
    }

    let remoteRootArrayFiles, remoteSrcArrayFiles;

    // get all the in the root folder index.js/index.mjs/index.cjs `./[*.*[js|mjs|cjs|json|node|wasm]]`
    let username = options.packagejson.username;
    let repository = options.packagejson.repository;
    let repo = `${username}` + "/" + `${repository}`
    let filename = options.packagejson.filename; // filename:${filename} , file:${filename} , 
    let pathtofile = (typeof options.packagejson.path === "string") ? options.packagejson.path || (Array.isArray(options.packagejson.path)) ? options.packagejson.path.join("+or+") : "" : ""; // path:${pathtofile}
    let infile = options.packagejson.infile;
    let inpath = options.packagejson.inpath;
    let extension = options.packagejson.extension || ["js", "mjs", "cjs", "json", "node", "wasm"].join("+extension:");  // extension:${extension}
    let token = options.packagejson.token;

    try {
        let requestOptions = {
            hostname: "api.github.com",
            path: `/search/${searchtype}?q=user:${username}+repo:${repo}+extension:${extension}`,
            headers: { "User-Agent": "${username}", "Accept": "application/vnd.github+json", "Authorization": "Basic " + "${username}:${token}" }
        }
        remoteRootArrayFiles = _searchGit(requestOptions, null, options = { protocol: "https", ...options });
        remoteRootArrayFiles = _mapGitSearchResult(remoteRootArrayFiles.items, options);
    } catch (rrafError) {
        throw new Error("[require-urls] index.js: Unable to install npm packages.", rrafError.toString());
    }

    try {
        let requestOptions = {
            hostname: "api.github.com",
            path: `/search/${searchtype}?q=user:${username}+repo:${repo}+extension:${extension}`,
            headers: { "User-Agent": "${username}", "Accept": "application/vnd.github+json", "Authorization": "Basic " + "${username}:${token}" }
        }
        remoteSrcArrayFiles = _searchGit(requestOptions, null, options = { protocol: "https", ...options });
        remoteSrcArrayFiles = _mapGitSearchResult(remoteSrcArrayFiles.items, options);
    } catch (rsafError) {
        throw new Error("[require-urls] index.js: Unable to install npm packages.", rsafError.toString());
    }

    return packagejson;
}

/**
 *
 *
 * @param {*} remoteUrl
 * @param {string} [options={ baseType: "git", recursive: false, forceUpdate: false, logger: console.log, cacheFetch: true, getMethods: false, noRequire: false }]
 * @return {*} 
 */
function requireurls(remoteUrl, options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log, cacheFetch: true, getMethods: false, noRequire: false }) {
    if (options.getMethods === true) { return { remoteUrl: _getRemoteUrl, recursiveUrl: _getRecursiveRemoteUrl, packageJson: _getRecursiveRemotePackageJsonUrl } };

    if (!remoteUrl.includes("package.json")) {

        if (!!options.recursive) {
            return _getRecursiveRemoteUrl(remoteUrl, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log });
        } else {
            return _getRemoteUrl(remoteUrl, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log })
        }
    } else {
        return _getRecursiveRemotePackageJsonUrl(remoteUrl, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log });
    }
}

/** New Structure for Revamped version of index.js with better isolation, and independent functions */

module.exports = requireurls;
