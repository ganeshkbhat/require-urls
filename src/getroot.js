/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/getroot.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

const path = require('path');
const fs = require('fs');
const { _getRoot, _getGitRoot, _getSvnRoot, _getFtpRoot, _getNodeModulesRoot, _getPackageJsonRoot, _createJscachePath } = require("root-dirs");


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
        localFullPath: localFullPath,
        remoteGitRoot: remoteGitRoot,
        remotePackagejsonRoot: remotePackagejsonRoot,
        requireRemotePaths: requireRemotePaths
    };
}


module.exports._getRoot = _getRoot;
module.exports._getGitRoot = _getGitRoot;
module.exports._getSvnRoot = _getSvnRoot;
module.exports._getFtpRoot = _getFtpRoot;
module.exports._getNodeModulesRoot = _getNodeModulesRoot;
module.exports._getPackageJsonRoot = _getPackageJsonRoot;
module.exports._createJscachePath = _createJscachePath;
module.exports._getRequirePaths = _getRequirePaths;
