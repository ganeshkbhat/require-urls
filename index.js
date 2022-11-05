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

const {
    _isValidURL, _getProtocol,
    _checkHttpsProtocol, _fetch,
    _deleteRequest, _getRequest,
    _postRequest, _putRequest,
    _patchRequest, _request
} = require("./src/request.js");

const {
    _concurrencyThreads,
    _concurrencyProcesses
} = require("./src/concurrency.js");

const {
    _getRoot, _getGitRoot, _getSvnRoot, _getFtpRoot,
    _getNodeModulesRoot, _getPackageJsonRoot,
    _createJscachePath, _getRequirePaths
} = require("./src/root.dirs.js");

const {
    _isinbuilt, _createFolders,
    _writeFile, _registerNodeCache
} = require("./src/filesystem.js");

const {
    _writeFileLock, _createSHAHash, _readFileLock,
    _createFileLock, _updateFileLockEntry, _deleteFileLockEntry,
    _fileContentHash, _fileContentDeHash,
    _verifyFilelockFile, _verifyFilelock,
    _verifySHAHash, _verifyFileContentHash
} = require("./src/filelock.js");

const {
    _getRequireOrImport,
    _requireImportNodeCache,
    _requireImport,
    _requireWriteImport,
    _require,
    _isParentModule
} = require("./src/require.js");

const {
    _checkModuleImports, _requiresObject, _requireRegex,
    _importRegex, _importESRegex, _importRegexExtended,
    _isESMFileExtension, _isESMCodeBase, _isCJSCodeBase,
    _isModuleInPackageJson, _checkRequireModuleImports,
    _isESCode
} = require("./src/parser.js");

const {
    _searchGit,
    _findGitRemoteFileUrl,
    _findGitRemoteRootUrl,
    _findGitRemotePackageJsonUrl,
    _searchGitFilesResultsModifier,
    _getDirContentResultsModifier,
    _getGitURLs,
    _getGitCommit,
    _getGitSHAHash,
    _getGitTagName,
    _getGitBranchName,
    _getGitContentFile,
    _getGitContentDir,
    _getGitContentDirRecursive,
    _getGitTree,
    _getGitTreeRecursive,
    _getGitRepositories,
    _getGitIssues,
    _getGitLabels,
    _getGitTopics,
    _getGitUsers,
    _getGitUserRepositories,
    _getGitRepository
} = require("./src/git.js");


const { _getSvnRequest } = require("./src/svn.js");
const { _getMercurialRequest } = require("./src/mercurial.js");
const { _ftpConnect, _getFtpRequest } = require("./src/ftp.js");


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
    let required, recursiveRequires;

    try {
        let required = _checkRequireModuleImports(paths.localGitFileCacheUrl);
        if (required instanceof Error) {
            throw new Error(required.toString());
        }
        if (!!required) {
            return required;
        }
    } catch (err) {
        let isesm = _isESCode(paths.localGitFileCacheUrl);
        let requires, imports, importses, importsdynamic;
        if (!!isesm) {
            importses = _importESRegex(paths.localGitFileCacheUrl);
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports from the file ", paths.localGitFileCacheUrl, " are ", importses);
            importsdynamic = _importRegex(paths.localGitFileCacheUrl);
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports from the file ", paths.localGitFileCacheUrl, " are ", importsdynamic);
            imports = { ...importses, ...importsdynamic };
        } else {
            requires = _requireRegex(paths.localGitFileCacheUrl);
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports from the file ", paths.localGitFileCacheUrl, " are ", requires);
            importsdynamic = _importRegex(paths.localGitFileCacheUrl);
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports from the file ", paths.localGitFileCacheUrl, " are ", importsdynamic);
            imports = { ...requires, ...importsdynamic };
        }

        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports from the file ", paths.localGitFileCacheUrl, " are ", imports);

        let importskeys = Object.keys(imports);
        let importskeyslen = importskeys.length;

        // Import files in the list
        for (let i = 0; i < importskeyslen; i++) {
            // importskeys[i]
            // console.log(importskeys[i].split("/"));
            let importedFile = importskeys[i].split("/");
            let tmpPath = request.split("/");
            let file = tmpPath.pop();
            let ext = file.split(".").pop();
            for (let i = 0; i < importedFile.length; i++) {
                let c = importedFile.shift();
                if (c === "..") {
                    tmpPath.pop();
                } else if (c !== ".") {
                    tmpPath.push(c);
                } else { }
                let extArr = [".js", ".cjs", ".mjs"];
                // 
                // tmpPath.push(ext);
                // for (let i = 0; i < arr.length; i++) { tmpPath = tmpPath.push(extArr[i]).join("/"); _get(tmpPath); }
                // 

            }
        }
    }
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

module.exports.default = requireurls;


module.exports._concurrencyProcesses = _concurrencyProcesses;
module.exports._concurrencyThreads = _concurrencyThreads;


module.exports._writeFileLock = _writeFileLock;
module.exports._createSHAHash = _createSHAHash
module.exports._readFileLock = _readFileLock
module.exports._createFileLock = _createFileLock
module.exports._updateFileLockEntry = _updateFileLockEntry
module.exports._deleteFileLockEntry = _deleteFileLockEntry
module.exports._fileContentHash = _fileContentHash
module.exports._fileContentDeHash = _fileContentDeHash;
module.exports._verifyFilelockFile = _verifyFilelockFile
module.exports._verifyFilelock = _verifyFilelock
module.exports._verifySHAHash = _verifySHAHash
module.exports._verifyFileContentHash = _verifyFileContentHash


module.exports._isinbuilt = _isinbuilt
module.exports._createFolders = _createFolders
module.exports._writeFile = _writeFile
module.exports._registerNodeCache = _registerNodeCache


module.exports._ftpConnect = _ftpConnect
module.exports._getFtpRequest = _getFtpRequest


module.exports._searchGit = _searchGit
module.exports._findGitRemoteFileUrl = _findGitRemoteFileUrl
module.exports._findGitRemoteRootUrl = _findGitRemoteRootUrl
module.exports._findGitRemotePackageJsonUrl = _findGitRemotePackageJsonUrl
module.exports._searchGitFilesResultsModifier = _searchGitFilesResultsModifier
module.exports._getDirContentResultsModifier = _getDirContentResultsModifier
module.exports._getGitURLs = _getGitURLs
module.exports._getGitCommit = _getGitCommit
module.exports._getGitSHAHash = _getGitSHAHash
module.exports._getGitTagName = _getGitTagName
module.exports._getGitBranchName = _getGitBranchName
module.exports._getGitContentFile = _getGitContentFile
module.exports._getGitContentDir = _getGitContentDir
module.exports._getGitContentDirRecursive = _getGitContentDirRecursive
module.exports._getGitTree = _getGitTree
module.exports._getGitTreeRecursive = _getGitTreeRecursive
module.exports._getGitRepositories = _getGitRepositories
module.exports._getGitIssues = _getGitIssues
module.exports._getGitLabels = _getGitLabels
module.exports._getGitTopics = _getGitTopics
module.exports._getGitUsers = _getGitUsers
module.exports._getGitUserRepositories = _getGitUserRepositories
module.exports._getGitRepository = _getGitRepository


module.exports._getMercurialRequest = _getMercurialRequest


module.exports._checkModuleImports = _checkModuleImports
module.exports._requiresObject = _requiresObject
module.exports._requireRegex = _requireRegex
module.exports._importRegex = _importRegex
module.exports._importESRegex = _importESRegex
module.exports._importRegexExtended = _importRegexExtended
module.exports._isESMFileExtension = _isESMFileExtension
module.exports._isESMCodeBase = _isESMCodeBase
module.exports._isCJSCodeBase = _isCJSCodeBase
module.exports._isModuleInPackageJson = _isModuleInPackageJson
module.exports._checkRequireModuleImports = _checkRequireModuleImports
module.exports._isESCode = _isESCode


module.exports._isValidURL = _isValidURL
module.exports._getProtocol = _getProtocol
module.exports._checkHttpsProtocol = _checkHttpsProtocol
module.exports._getRequest = _getRequest
module.exports._fetch = _fetch
module.exports._deleteRequest = _deleteRequest
module.exports._postRequest = _postRequest
module.exports._putRequest = _putRequest
module.exports._patchRequest = _patchRequest
module.exports._request = _request


module.exports._getRequireOrImport = _getRequireOrImport
module.exports._requireImportNodeCache = _requireImportNodeCache
module.exports._requireImport = _requireImport
module.exports._requireWriteImport = _requireWriteImport
module.exports._require = _require
module.exports._isParentModule = _isParentModule


module.exports._getRoot = _getRoot
module.exports._getGitRoot = _getGitRoot
module.exports._getSvnRoot = _getSvnRoot
module.exports._getFtpRoot = _getFtpRoot
module.exports._getNodeModulesRoot = _getNodeModulesRoot
module.exports._getPackageJsonRoot = _getPackageJsonRoot
module.exports._createJscachePath = _createJscachePath
module.exports._getRequirePaths = _getRequirePaths

module.exports._getSvnRequest = _getSvnRequest
