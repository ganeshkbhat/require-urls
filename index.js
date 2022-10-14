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
*/

/* eslint no-console: 0 */

'use strict';

const path = require('path');
const fs = require('fs');

function findGitRoot(start) {
    start = start || module.parent.filename;
    if (typeof start === 'string') {
        if (start[start.length - 1] !== path.sep) {
            start += path.sep;
        }
        start = path.normalize(start);
        start = start.split(path.sep);
    }

    if (!start.length) {
        options.logger('RequireURL: index.js: repo base .git/ or node_modules/ not found in path');
        throw new Error('RequireURL: index.js: repo base .git/ or node_modules/ not found in path');
    }

    start.pop();
    var fullPath = path.join(start.join(path.sep), '.git');

    if (fs.existsSync(fullPath)) {
        if (!fs.lstatSync(fullPath).isDirectory()) {
            var content = fs.readFileSync(fullPath, { encoding: 'utf-8' })
            var match = /^gitdir: (.*)\s*$/.exec(content)
            if (match) {
                return path.normalize(match[1]);
            }
        }
        return path.normalize(fullPath);
    } else {
        return findGitRoot(start);
    }
}

function getRequirePaths(request, options) {
    var gitUrlFetch = request.split("https://")[1];
    var gitUrl = path.join(findGitRoot(process.cwd()).split(".git")[0]);
    var gitCacheUrl = path.join(findGitRoot(process.cwd()).split(".git")[0], ".jscache");

    var gitFileCacheUrl;

    if (options.baseType === "git") {
        console.log(findGitRoot(process.cwd()).split(".git")[0], gitUrlFetch)
        gitFileCacheUrl = path.join(findGitRoot(process.cwd()).split(".git")[0], ".jscache", gitUrlFetch);
        console.log(gitFileCacheUrl)
    } else {
        gitFileCacheUrl = path.join(findGitRoot(process.cwd()).split("node_modules")[0], ".jscache", gitUrlFetch);
    }

    var localGitFile = gitFileCacheUrl.split("\\").pop();
    var localGitDir = gitFileCacheUrl.replace(localGitFile, "");

    var requirePaths = request;
    requirePaths.split("/").pop();

    return {
        gitUrlFetch,
        gitUrl,
        gitCacheUrl,
        gitFileCacheUrl,
        localGitFile,
        localGitDir,
        requirePaths
    };
}

async function fetchWriteRequire(remoteUrl, data, options) {
    options.logger("RequireURLs: index.js: Writing fetched file to .jscache");
    await fs.promises.writeFile(remoteUrl, data.toString());
    options.logger("RequireURLs: index.js: Written fetched file to .jscache");
    try {

        if (!!options.cacheFetch) {
            if (remoteUrl.includes(".mjs")) {
                return import("node:" + remoteUrl);
            }
            return require("node:" + remoteUrl);
        }
        if (remoteUrl.includes(".mjs")) {
            return import(remoteUrl);
        }
        return require(remoteUrl);
    } catch (err) {
        throw new Error("[requireurls] index.js: File type cannot be required or imported.")
    }
}

function fetchOrRequire(request, gitFileCacheUrl, options) {
    if (fs.existsSync(gitFileCacheUrl) && !options.forceUpdate) {
        if (!!options.cacheFetch) {
            return require("node:" + gitFileCacheUrl);
        }
        return require(gitFileCacheUrl);
    }
    return fetch(request).then(response => response.text())
        .then(function (data) {
            // console.log("response ", data);
            return fetchWriteRequire(gitFileCacheUrl, data, options)
        }.bind(fetchWriteRequire));
}

function remoteUrl(request, options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log }) {
    if (!!request.includes("https://github.com/") || !!request.includes("https://www.github.com/")) {
        request = request.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("blob/", "");
    }

    let { gitUrlFetch, gitUrl, gitCacheUrl, gitFileCacheUrl, localGitFile, localGitDir, requirePaths } = getRequirePaths(request, options);
    // require.main.paths.push(requirePaths);

    if (!!global.require) {
        global.require = require;
        global.require.resolve = function (request, options) {
            try {
                return require.resolve(request, options);
            } catch (e) {
                return requireurls(request, { ...options, baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate });
            }
        }
    }

    try {
        fs.access(path.join(localGitDir), (e) => {
            fs.mkdirSync(localGitDir, { recursive: true });
        })
    } catch (err) {
        throw new Error("RequireURLs: index.js: file access error", err.toString());
    }

    options.logger("RequireURLs: index.js: All Paths request, gitUrlFetch, gitUrl, gitCacheUrl,  gitFileCacheUrl, localGitFile, localGitDir: ", request, ",", gitUrlFetch, ",", gitUrl, ",", gitCacheUrl, ",", gitFileCacheUrl, ",", localGitFile, ",", localGitDir);
    options.logger("RequireURLs: index.js: Making Fetch request to ", request);

    return fetchOrRequire(request, gitFileCacheUrl, options);
}

function recursiveUrl(request, options = { baseType: "git", recursive: true, forceUpdate: false, logger: console.log }) {

}

function packageJson(request, options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log }) {
    if (!!request.includes("package.json")) {

    }
}

module.exports.requireurls = function requireurls(request = "", options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log, cacheFetch: false, getMethods: false, noRequire: false }) {
    if (options.getMethods === true) { return { remoteUrl, recursiveUrl, packageJson } };

    if (!request.includes("package.json")) {
        if (!!options.recursive) {
            return recursiveUrl(request, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log });
        } else {
            return remoteUrl(request, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log })
        }
    } else {
        return packageJson(request, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log });
    }
}

