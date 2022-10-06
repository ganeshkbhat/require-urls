/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: 
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
    return require(remoteUrl);
}

function fetchOrRequire(request, gitFileCacheUrl, options) {
    if (fs.existsSync(gitFileCacheUrl) && !!options.forceUpdate) {
        return require(gitFileCacheUrl);
    }
    return fetch(request).then(response => response.text())
        .then(function (data) {
            return fetchWriteRequire(gitFileCacheUrl, data, options)
        }.bind(fetchWriteRequire));
}

function url(request, options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log }) {
    if (!!request.includes("https://github.com/") || !!request.includes("https://www.github.com/")) {
        request = request.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("blob/", "");
    }

    let { gitUrlFetch, gitUrl, gitCacheUrl, gitFileCacheUrl, localGitFile, localGitDir, requirePaths } = getRequirePaths(request, options);
    require.main.paths.push(requirePaths);

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

function recursiveUrl(request = "", options = { baseType: "git", recursive: true, forceUpdate: false, logger: console.log }) {

}

function packageJson(request = "", options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log }) {
    if (!!request.includes("package.json")) {

    }
}


function requireurls(request = "", options = { baseType: "git", recursive: false, forceUpdate: false, logger: console.log, getMethods: false }) {
    if (options.getMethods === true) { return { url, recursiveUrl, packageJson } };

    if (!request.includes("package.json")) {
        if (!!options.recursive) {
            return recursiveUrl(request, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log });
        } else {
            return url(request, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log })
        }
    } else {
        return packageJson(request, options = { baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate, logger: console.log });
    }
}

module.exports = requireurls;
