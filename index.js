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
    _getRoot, _getGitRoot, _getSvnRoot,
    _getFtpRoot,
    _createJscachePath,
    _getNodeModulesRoot, _getPackageJsonRoot,
    _getRequirePaths
} = require("./src/root.dirs.js");

const {
    _isinbuilt, _createFolders,
    _writeFile, _registerNodeCache
} = require("./src/filesystem.js");

const {
    _writeFileLock,
    _createSHAHash,
    _readFileLock,
    _createFileLock, _updateFileLockEntry, _deleteFileLockEntry,
    _fileContentHash,
    _fileContentDeHash,
    _verifyFilelockFile,
    _verifyFilelock,
    _verifySHAHash,
    _verifyFileContentHash
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
    _isESMFileExtension,
    // _isNodeCompatibleFileExtension,
    _isESMCodeBase, _isCJSCodeBase,
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
async function _getRecursiveRemoteUrl(request, options, _importRemoteUrl = null) {
    let _import = await _getRemoteUrl(request, options).then(function (data) {

        // .js, .cjs, .mjs, .ts, .wasm, ''
        let optionalExtensions = ["js", "cjs", "mjs", "ts", "wasm", "node", "json", "coffee", ""];
        let paths = _getRequirePaths(request, options);
        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: default paths: ", paths);

        let required, recursiveRequires;

        try {

            let required = _checkRequireModuleImports(paths.localGitFileCacheUrl);

            if (required instanceof Error) {
                throw new Error(required.toString());
            }

            if (!!required) {
                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: required: ", required);
                return required;
            }

        } catch (err) {
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: err from _checkRequireModuleImports: ", err.toString());

            let isesm = _isESCode(paths.localGitFileCacheUrl);
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: isesm: ", isesm);

            //
            // Replace this _isESMFileExtension function with _isNodeCompatibleFileExtension in 
            // the next version of get-imported to address the line: 
            // if (ext === "") {
            // 
            let remoteContextFileExtension = paths.localOrRemoteGitFilename.split(".").pop();
            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: remoteContextFileExtension: ", remoteContextFileExtension);

            let requires, imports, importses, importsdynamic;

            if (!!isesm) {
                // Add basepath for the function as an argument
                importses = _importESRegex(paths.localGitFileCacheUrl);
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: importses: ", importses);

                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports (imports:es) from the file ", paths.localGitFileCacheUrl, " are ", importses);
                // Add basepath for the function as an argument
                importsdynamic = _importRegex(paths.localGitFileCacheUrl);
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: importsdynamic: ", importsdynamic);

                imports = { ...importses, ...importsdynamic };
                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: imports: ", imports);
            } else {
                // console.log(requires, paths.localGitFileCacheUrl);
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: requires: ", requires);

                // Add basepath for the function as an argument
                requires = _requireRegex(paths.localGitFileCacheUrl);

                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports (requires) from the file ", paths.localGitFileCacheUrl, " are ", requires);
                // Add basepath for the function as an argument
                importsdynamic = _importRegex(paths.localGitFileCacheUrl);
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: importsdynamic: ", importsdynamic);

                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports (importsdynamic) from the file ", paths.localGitFileCacheUrl, " are ", importsdynamic);
                imports = { ...requires, ...importsdynamic };
                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: imports: ", imports);
            }

            options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all imports (combined imports) from the file ", paths.localGitFileCacheUrl, " are ", imports);

            let importskeys = Object.keys(imports);
            // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: importskeys: ", importskeys);

            // Import files in the list
            for (let i = 0; i < importskeys.length; i++) {

                // importskeys[i]
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: import file key ", importskeys[i]);

                let importedFile = importskeys[i].split("/");
                // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: importskeys: ", importskeys);

                let tmpPath = request.split("/");
                tmpPath.pop();
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: modified folder path tmpPath: ", tmpPath.join("/"));

                let file = importedFile.pop();
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: modified file path file: ", file);

                // 
                // File Extension Methods to be Addressed:
                // 
                // DONE: 
                // .gitignore [ '', 'gitignore' ], 
                // test.file.js, 
                // [ 'test', 'file', 'js' ]
                // file.gitignore
                // [ 'file', 'gitignore' ]
                // :DONE
                //
                //
                // File Types to be addressed:
                // 
                // DONE:
                // file.js, 
                // [ 'file', 'js' ]
                // file.cjs, 
                // [ 'file', 'cjs' ]
                // file.mjs,
                // [ 'file', 'mjs' ]
                // fileblob, 
                // [ 'fileblob' ]
                // :DONE
                // 

                let filearr = file.split(".");
                let ext;

                if (filearr.length > 1) {
                    ext = filearr.pop();
                } else {
                    ext = "";
                }

                file = filearr.join(".");

                if (ext !== "") {
                    const extMatch = /\.(c|m)?js|ts|node|wasm|json|coffee$/.exec(file);
                    if (!!extMatch) { ext = extMatch[0]; }
                }

                if (ext === "" && !!remoteContextFileExtension) {
                    ext = remoteContextFileExtension;
                }

                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: file: ", file);
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: ext: ", ext);

                let returnedImportedFilesArray = [];
                for (let i = 0; i < importedFile.length; i++) {
                    let c = importedFile.shift();

                    if (c === "..") {

                        // "'..', 'filepath'"
                        tmpPath.pop();
                        tmpPath.push((ext !== "") ? file + ((!!ext) ? "." : "") + ext : file);
                    } else if (c !== ".") {

                        // "'.', 'filepath'"
                        tmpPath.push((ext !== "") ? file + ((!!ext) ? "." : "") + ext : file);
                    } else {

                        // "'filepath'"
                        tmpPath.push((ext !== "") ? file + ((!!ext) ? "." : "") + ext : file);
                    }

                    tmpPath = tmpPath.join("/");
                    options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: file tmpPath: ", tmpPath);

                    //
                    // Check if default extension is provided in options object, 
                    //      or else check package.json for allowed extension, 
                    //      or fetch all the optional extensions possible
                    //
                    let exts = optionalExtensions.filter((v) => v !== ext);
                    options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: all extensions to be optionally imported for no extension files: ", exts);

                    for (let i = 0; i < exts.length; i++) {
                        let addPath = tmpPath.split("/");
                        addPath.pop();
                        addPath = addPath.join("/");

                        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: folder addOptionalFolderPath for all extension imports: ", addPath);
                        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: file: ", file);
                        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: extension: ", exts[i]);

                        imports = { ...imports, [file + ((!!exts[i]) ? "." : "") + exts[i]]: (exts !== "") ? addPath + "/" + file + ((!!exts[i]) ? "." : "") + exts[i] : file };
                        importskeys.push(file + ((!!exts[i]) ? "." : "") + exts[i]);
                    }

                    // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: modified imports: ", imports);
                    // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: importskeys: ", importskeys);
                    options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: import file url: ", tmpPath);

                    try {
                        returnedImportedFilesArray[i] = _getRecursiveRemoteUrl(tmpPath, options);
                    } catch (e) {
                        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl Error: ", e);
                        returnedImportedFilesArray[i] = e;
                    }
                }

                // for (let i = 0; i < returnedImportedFilesArray.length; i++) {
                //     if (returnedImportedFilesArray[i] instanceof Error) {
                //         throw Error("[require-urls] index.js: _getRecursiveRemoteUrl: Files cannot be fetched. URL Path of imported modulename or remoteurl", importskeys, tmpPath)
                //     }
                // }

                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: returnedImportedFilesArray with errors instances if any: ", returnedImportedFilesArray);
                options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: paths.localGitFileCacheUrl: ", paths.localGitFileCacheUrl);

                // // 
                // // Retry import once again else err out. 
                // // [TODO] Consolidate this function into a common function
                // // 
                // let errHandlerrequired = _checkRequireModuleImports(paths.localGitFileCacheUrl);
                // if (errHandlerrequired instanceof Error) {
                //     // throw new Error(errHandlerrequired.toString());
                //     console.log(errHandlerrequired);
                // }

                // console.log(5, errHandlerrequired);
                // // if (!!errHandlerrequired) {
                // //     return errHandlerrequired;
                // // }

                // console.log(6);
                // // throw new Error("[require-urls] index.js: _getRecursiveRemoteUrl: Cannot be required due to unhandlable error ", err.toString());
            }
        }
    }).catch(function (error) {
        options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: Errors instances if any: error", error);
    });
    // options.logger("[require-urls] index.js: _getRecursiveRemoteUrl: _import", _import);
    return _import;
}

/**
 *
 *
 * @param {*} rootDir
 * @param {boolean} [production=true]
 * @return {*} 
 */
async function _installPackageDeps(rootDir, production = true, options = { logger: console.log }) {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        // // Install npm for productoon or install all development dependencies
        let prod = (!!production) ? "--prod" : "";

        // // Install dependencies for npm
        const { stdout, stderr } = await exec(`cd ${rootDir} && npm install ${prod}`);
        options.logger("[require-urls] index.js: _installPackageDeps: stdout: ", stdout);
        options.logger("[require-urls] index.js: _installPackageDeps: stderr: ", stderr);

        return { stderr: stderr, stdout: stdout }
    } catch (err) {
        options.logger("[require-urls] index.js: _installPackageDeps: execution error err: ", err);
        return { err: err };
    }
}

/**
 *
 *
 * @param {*} packagejson
 * @return {*} 
 */
function packageJsonParser(packagejson) {
    let pjson = packagejson;
    options.logger("[require-urls] index.js: packageJsonParser: Parsing package.json file");
    options.logger("[require-urls] index.js: packageJsonParser: package.json file: ", packagejson);

    let pjsonFilesArray = [];

    /**
     * Fill the Array objArr object with the 
     *      key's values of obj passed; handling 
     *      even addition of nested object values
     *
     * @param {*} obj
     * @param {*} objArr
     * @return {*} 
     */
    function getObjectValues(obj, objArr) {
        let k = Object.keys(obj);
        let klen = k.length;

        for (let i = 0; i < klen; i++) {
            if (!!obj[k[i]] && typeof obj[k[i]] === "string") {
                objArr.push(obj[k[i]]);
            } else if (!!obj[k[i]] && typeof obj[k[i]] === "object") {
                objArr = getObjectValues(obj[k[i]], objArr);
            }
        }

        options.logger("[require-urls] index.js: packageJsonParser: getObjectValues: objArr: ", objArr);
        return objArr;
    }

    /**
     * Fill the Array oArr object with values of package.json file's
     *      object `o` with the string values of the object key `k`;
     *      handling both the cases of Object and String value
     *
     * @param {*} o
     * @param {*} k
     * @param {*} oArr
     * @return {*} 
     */
    function pjsonFiller(o, k, oArr) {
        if (!!o[k] && typeof o[k] === "object") {
            oArr.push(...getObjectValues(o[k], oArr));
        } else if (!!o[k] && typeof o[k] === "string") {
            oArr.push(o[k]);
        }

        options.logger("[require-urls] index.js: packageJsonParser: pjsonFiller: oArr: ", oArr);
        return oArr;
    }

    // // Add file values of `main` key
    options.logger("[require-urls] index.js: packageJsonParser: Adding files from the package.json `main` key ");
    pjsonFilesArray.push(...pjsonFiller(pjson, "main", pjsonFilesArray));

    // // Add file values of `module` key
    options.logger("[require-urls] index.js: packageJsonParser: Adding files from the package.json `module` key ");
    pjsonFilesArray.push(...pjsonFiller(pjson, "module", pjsonFilesArray));

    // // Add file values of `exports` key
    options.logger("[require-urls] index.js: packageJsonParser: Adding files from the package.json `exports` key ");
    pjsonFilesArray.push(...pjsonFiller(pjson, "exports", pjsonFilesArray));

    // // Add files from the `remoteurls.files` key in package.json file
    options.logger("[require-urls] index.js: packageJsonParser: Adding files from the package.json `remoteurls.files` key ");
    let pjsonfiles = (!!pjson.remoteurls?.files && Array.isArray(pjson.remoteurls?.files)) ? pjson.remoteurls?.files : (typeof pjson.remoteurls?.files === "string") ? [pjson.remoteurls?.files] : [];
    pjsonFilesArray.push(...pjsonfiles);

    // // Add folders from the `remoteurls.directories` key in package.json file
    options.logger("[require-urls] index.js: packageJsonParser: Adding files from the package.json `remoteurls.directories` key ");
    let pjsondirectories = (!!pjson.remoteurls?.directories && Array.isArray(pjson.remoteurls?.directories)) ? pjson.remoteurls?.files : (typeof pjson.remoturls?.directories === "string") ? [pjson.remoteurl?.directories] : [];
    pjsondirectories = pjsondirectories.map((v) => { if (v[v.length - 1] === "/") { return v + "**"; } else { return v + "/" + "**"; } })
    pjsonFilesArray.push(...pjsondirectories);

    options.logger("[require-urls] index.js: packageJsonParser: Making the files to be fetched unique values in the array ");
    pjsonFilesArray = new Array(...new Set(pjsonFilesArray));

    options.logger("[require-urls] index.js: packageJsonParser: pjsonFilesArray: ", pjsonFilesArray);
    return pjsonFilesArray;
}

/**
 *
 *
 * @param { Object } request
 * @param { Object } options
 * @return { Object } packagejson 
 */
async function _getRecursiveRemotePackageJsonUrl(request, options) {
    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Running Imports for package.json files and dependencies");

    // 
    // // Get package.json
    // // Get all files starting from (package.json).main 
    // //          or index.*[js|mjs|cjs|json|node|wasm|coffee] 
    // //          or all files in root folder `./[*.*[js|mjs|cjs|json|node|wasm|coffee]]` and folder `src/[*.*[js|mjs|cjs|json|node|wasm|coffee]]`
    // // Add .jscache/path/to/git/repo folder to path
    // // npm install production packages
    // 

    if (!request.includes("package.json")) {
        options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: package.json file not in the URL: ", packagejson);
        return false;
    }

    let packagejson;

    if (request.includes("package.json") && (request.split("//")[0].includes("http:") || request.split("//")[0].includes("https:"))) {
        // // Importing remote package.json from http/s github
        options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Fetching Remote HTTP/s package.json: ", packagejson);
        packagejson = _getRemoteUrl(request, options);
    } else if (request.includes("package.json") && (request.split("//")[0].includes("ftp:") || request.split("//")[0].includes("ftps:"))) {
        // // Importing remote package.json from ftp/s github
        options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Fetching Remote FTP package.json: ", packagejson);
        // packagejson = _getRemoteUrl(request, options);
    } else if (request.includes("package.json") && (request.split("//")[0].includes("svn:") || request.split("//")[0].includes("svn:"))) {
        // // Importing remote package.json from svn/s github
        options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Fetching Remote SVN package.json: ", packagejson);
        // packagejson = _getRemoteUrl(request, options);
    } else {
        // // Importing remote package.json from local
        options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Fetching local folder package.json: ", packagejson);
        packagejson = (!!require) ? require(request) : import(request);
    }

    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: package.json: ", packagejson);

    let remotePackageRoot = _getRequirePaths(request, options);
    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: remotePackageRoot: ", remotePackageRoot);

    // 
    // // Get contents of a Git repository
    // // Get contents of a Git directory
    // // Get all files
    // 

    // 
    // // "main", "module", "exports", "remoteurls.files" ==> Recursive[Array], "remoteurls.directories" ==> "repository"["test", "src", "dist"] ==> Recursive[Array]
    // // options.package["directory"]  ==> Recursive[Array]
    // // options.package["files"], ==> Recursive[Array]
    // // npm install options.package["production"] ==> Recursive[Dev_Array], Recursive[DevDeps_Array]
    // 

    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Fetching list of files to fetch");
    let pjsonFilesArray = packageJsonParser(packagejson);
    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: pjsonFilesArray: ", pjsonFilesArray);

    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: Fetching list of files to install");
    let npmInstallResult = await _installPackageDeps(remotePackageRoot.localFullPath, options.production);
    options.logger("[require-urls] index.js: _getRecursiveRemotePackageJsonUrl: npmInstallResult: ", npmInstallResult);

    // let remoteRootArrayFiles, remoteSrcArrayFiles;

    // // 
    // // get all the in the root folder index.js/index.mjs/index.cjs `./[*.*[js|mjs|cjs|json|node|wasm]]`
    // // 
    //
    // let username = options.packagejson.username;
    // let repository = options.packagejson.repository;
    // let repo = `${username}` + "/" + `${repository}`
    // let filename = options.packagejson.filename; // filename:${filename} , file:${filename} , 
    // let pathtofile = (typeof options.packagejson.path === "string") ? options.packagejson.path || (Array.isArray(options.packagejson.path)) ? options.packagejson.path.join("+or+") : "" : ""; // path:${pathtofile}
    // let infile = options.packagejson.infile;
    // let inpath = options.packagejson.inpath;
    // let extension = options.packagejson.extension || ["js", "mjs", "cjs", "json", "node", "wasm"].join("+extension:");  // extension:${extension}
    // let token = options.packagejson.token;
    //

    // try {
    //     let requestOptions = {
    //         hostname: "api.github.com",
    //         path: `/search/${searchtype}?q=user:${username}+repo:${repo}+extension:${extension}`,
    //         headers: { "User-Agent": "${username}", "Accept": "application/vnd.github+json", "Authorization": "Basic " + "${username}:${token}" }
    //     }
    //     remoteRootArrayFiles = _searchGit(requestOptions, null, options = { protocol: "https", ...options });
    //     remoteRootArrayFiles = _mapGitSearchResult(remoteRootArrayFiles.items, options);
    // } catch (rrafError) {
    //     throw new Error("[require-urls] index.js: Unable to install npm packages.", rrafError.toString());
    // }

    // 
    // try {
    //     let requestOptions = {
    //         hostname: "api.github.com",
    //         path: `/search/${searchtype}?q=user:${username}+repo:${repo}+extension:${extension}`,
    //         headers: { "User-Agent": "${username}", "Accept": "application/vnd.github+json", "Authorization": "Basic " + "${username}:${token}" }
    //     }
    //     remoteSrcArrayFiles = _searchGit(requestOptions, null, options = { protocol: "https", ...options });
    //     remoteSrcArrayFiles = _mapGitSearchResult(remoteSrcArrayFiles.items, options);
    // } catch (rsafError) {
    //     throw new Error("[require-urls] index.js: Unable to install npm packages.", rsafError.toString());
    // }
    //

    return packagejson;
}

/**
 *
 *
 * @param {*} remoteUrl
 * @param {string} [options={ baseType: "git", recursive: false, forceUpdate: false, package: { production: false, directories: [], files: [] }, logger: console.log, cacheFetch: true, getMethods: false, noRequire: false }]
 * @return {*} 
 */
function requireurls(remoteUrl, options = { baseType: "git", recursive: false, forceUpdate: false, package: { production: false, directories: [], files: [] }, logger: console.log, cacheFetch: true, getMethods: false, noRequire: false }) {
    if (options.getMethods === true) {
        options.logger("[require-urls] index.js: requireurls: [ remoteUrl, recursiveUrl, packageJson ] Functions: ", [remoteUrl, recursiveUrl, packageJson]);
        return { remoteUrl: _getRemoteUrl, recursiveUrl: _getRecursiveRemoteUrl, packageJson: _getRecursiveRemotePackageJsonUrl }
    };

    if (!!options.cacheFetch) {
        // fetch from jscache
    }

    if (!remoteUrl.includes("package.json")) {
        options.logger("[require-urls] index.js: Running Optional function if URL is not a package.json file _getRemoteUrl");
        if (!!options.recursive) {
            options.logger("[require-urls] index.js: Running Functions _getRecursiveRemoteUrl Recursively: remoteUrl", remoteUrl);
            options.logger("[require-urls] index.js: Running Functions _getRemoteUrl: options", { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: options.logger });
            return _getRecursiveRemoteUrl(remoteUrl, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: options.logger });
        } else {
            options.logger("[require-urls] index.js: Running Functions _getRemoteUrl not Recursively: remoteUrl", remoteUrl);
            options.logger("[require-urls] index.js: Running Functions _getRemoteUrl: options", { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: options.logger });
            return _getRemoteUrl(remoteUrl, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: options.logger })
        }
    } else {
        options.logger("[require-urls] index.js: Running Optional function if URL is a package.json file _getRemoteUrl");
        options.logger("[require-urls] index.js: Running Functions _getRecursiveRemotePackageJsonUrl: remoteUrl", remoteUrl);
        options.logger("[require-urls] index.js: Running Functions _getRecursiveRemotePackageJsonUrl: options", { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, package: { production: options.package.production, directories: options.package.directories, files: options.package.files }, logger: options.logger });
        return _getRecursiveRemotePackageJsonUrl(remoteUrl, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, package: { production: options.package.production, directories: options.package.directories, files: options.package.files }, logger: options.logger });
    }
}


/** New Structure for Revamped version of index.js with better isolation, and independent functions */

module.exports = requireurls;
module.exports.default = requireurls;


module.exports._concurrencyProcesses = _concurrencyProcesses;
module.exports._concurrencyThreads = _concurrencyThreads;


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


module.exports._isinbuilt = _isinbuilt;
module.exports._createFolders = _createFolders;
module.exports._writeFile = _writeFile;
module.exports._registerNodeCache = _registerNodeCache;


module.exports._ftpConnect = _ftpConnect;
module.exports._getFtpRequest = _getFtpRequest;


module.exports._searchGit = _searchGit;
module.exports._findGitRemoteFileUrl = _findGitRemoteFileUrl;
module.exports._findGitRemoteRootUrl = _findGitRemoteRootUrl;
module.exports._findGitRemotePackageJsonUrl = _findGitRemotePackageJsonUrl;
module.exports._searchGitFilesResultsModifier = _searchGitFilesResultsModifier;
module.exports._getDirContentResultsModifier = _getDirContentResultsModifier;
module.exports._getGitURLs = _getGitURLs;
module.exports._getGitCommit = _getGitCommit;
module.exports._getGitSHAHash = _getGitSHAHash;
module.exports._getGitTagName = _getGitTagName;
module.exports._getGitBranchName = _getGitBranchName;
module.exports._getGitContentFile = _getGitContentFile;
module.exports._getGitContentDir = _getGitContentDir;
module.exports._getGitContentDirRecursive = _getGitContentDirRecursive;
module.exports._getGitTree = _getGitTree;
module.exports._getGitTreeRecursive = _getGitTreeRecursive;
module.exports._getGitRepositories = _getGitRepositories;
module.exports._getGitIssues = _getGitIssues;
module.exports._getGitLabels = _getGitLabels;
module.exports._getGitTopics = _getGitTopics;
module.exports._getGitUsers = _getGitUsers;
module.exports._getGitUserRepositories = _getGitUserRepositories;
module.exports._getGitRepository = _getGitRepository;


module.exports._getMercurialRequest = _getMercurialRequest;


module.exports._checkModuleImports = _checkModuleImports;
module.exports._requiresObject = _requiresObject;
module.exports._requireRegex = _requireRegex;
module.exports._importRegex = _importRegex;
module.exports._importESRegex = _importESRegex;
module.exports._importRegexExtended = _importRegexExtended;
module.exports._isESMFileExtension = _isESMFileExtension;
// module.exports._isNodeCompatibleFileExtension = _isNodeCompatibleFileExtension;
module.exports._isESMCodeBase = _isESMCodeBase;
module.exports._isCJSCodeBase = _isCJSCodeBase;
module.exports._isModuleInPackageJson = _isModuleInPackageJson;
module.exports._checkRequireModuleImports = _checkRequireModuleImports;
module.exports._isESCode = _isESCode;


module.exports._isValidURL = _isValidURL;
module.exports._getProtocol = _getProtocol;
module.exports._checkHttpsProtocol = _checkHttpsProtocol;
module.exports._getRequest = _getRequest;
module.exports._fetch = _fetch;
module.exports._deleteRequest = _deleteRequest;
module.exports._postRequest = _postRequest;
module.exports._putRequest = _putRequest;
module.exports._patchRequest = _patchRequest;
module.exports._request = _request;


module.exports._getRequireOrImport = _getRequireOrImport;
module.exports._requireImportNodeCache = _requireImportNodeCache;
module.exports._requireImport = _requireImport;
module.exports._requireWriteImport = _requireWriteImport;
module.exports._require = _require;
module.exports._isParentModule = _isParentModule;


module.exports._getRoot = _getRoot;
module.exports._getGitRoot = _getGitRoot;
module.exports._getSvnRoot = _getSvnRoot;
module.exports._getFtpRoot = _getFtpRoot;
module.exports._createJscachePath = _createJscachePath;
module.exports._getNodeModulesRoot = _getNodeModulesRoot;
module.exports._getPackageJsonRoot = _getPackageJsonRoot;
module.exports._getRequirePaths = _getRequirePaths;

module.exports._getSvnRequest = _getSvnRequest;

module.exports.packageJsonParser = packageJsonParser;

