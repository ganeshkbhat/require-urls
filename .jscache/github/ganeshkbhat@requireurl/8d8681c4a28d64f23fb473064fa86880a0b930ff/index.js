/**
 * 
 * Package: requireurl
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: 
 * File: index.js
 * File Description: Using requireurl instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
*/


function requireurl(pathFetch = "https://raw.githubusercontent.com/sinonjs/sinon/main/lib/sinon.js", options = { baseType: "git", forceUpdate: false, recursive: true }) {
    if (!!pathFetch.includes("https://github.com/") || !!pathFetch.includes("https://www.github.com/")) {
        pathFetch = pathFetch.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("blob/", "");
    }

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

    var gitUrlFetch = pathFetch.split("https://raw.githubusercontent.com/")[1];
    var gitUrl = path.join(findGitRoot(process.cwd()).split(".git")[0]);
    var gitCacheUrl = path.join(findGitRoot(process.cwd()).split(".git")[0], ".jscache");

    var gitFileCacheUrl;

    if (options.baseType === "git") {
        gitFileCacheUrl = path.join(findGitRoot(process.cwd()).split(".git")[0], ".jscache", gitUrlFetch);
    } else {
        gitFileCacheUrl = path.join(findGitRoot(process.cwd()).split("node_modules")[0], ".jscache", gitUrlFetch);
    }

    var localGitFile = gitFileCacheUrl.split("\\").pop();
    var localGitDir = gitFileCacheUrl.replace(localGitFile, "");

    try {
        fs.access(path.join(localGitDir), (e) => {
            fs.mkdirSync(localGitDir, { recursive: true });
        })
    } catch (err) {
        console.log("RequireURL: index.js: file access error", err);
    }

    return fetch(pathFetch).then(response => response.text())
        .then(function (data) {

            function fetchAndWrite(u) {
                return fs.writeFile(u, data, function (err) {
                    if (err) { return console.log("RequireURL: index.js: ", err); }
                    return require(u);
                });
            }

            if (!!options.forceUpdate) {
                return fetchAndWrite(gitFileCacheUrl);
            }

            try {
                if (fs.existsSync(gitFileCacheUrl)) {
                    return require(gitFileCacheUrl);
                }
            } catch (err) {
                return fetchAndWrite(gitFileCacheUrl);
            }
        });
}

module.exports = requireurl;
