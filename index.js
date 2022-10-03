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

// resolve: [Function: resolve] { paths: [Function: paths] },
//   main: Module {
//     id: '.',
//     path: 'C:\\Users\\GB\\Documents\\projects\\requireurl',
//     exports: {},
//     filename: 'C:\\Users\\GB\\Documents\\projects\\requireurl\\t.js',
//     loaded: false,
//     children: [],
//     paths: [
//       'C:\\Users\\GB\\Documents\\projects\\requireurl\\node_modules',
//       'C:\\Users\\GB\\Documents\\projects\\node_modules',
//       'C:\\Users\\GB\\Documents\\node_modules',
//       'C:\\Users\\GB\\node_modules',
//       'C:\\Users\\node_modules',
//       'C:\\node_modules'
//     ]
//   },
//   extensions: [Object: null prototype] {
//     '.js': [Function (anonymous)],
//     '.json': [Function (anonymous)],
//     '.node': [Function (anonymous)]
//   },
//   cache: [Object: null prototype] {
//     'C:\\Users\\GB\\Documents\\projects\\requireurl\\t.js': Module {
//       id: '.',
//       path: 'C:\\Users\\GB\\Documents\\projects\\requireurl',
//       exports: {},
//       filename: 'C:\\Users\\GB\\Documents\\projects\\requireurl\\t.js',
//       loaded: false,
//       children: [],
//       paths: [Array]
//     }
//   }
// }


// function moduleIsAvailable(path) {
//     try {
//         require.resolve(path);
//         return true;
//     } catch (e) {
//         return false;
//     }
// }

function requireurl(request = "", options = { baseType: "git", recursive: true, forceUpdate: true, logger: console.log }) {
    if (!!request.includes("https://github.com/") || !!request.includes("https://www.github.com/")) {
        request = request.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("blob/", "");
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

    var gitUrlFetch = request.split("https://")[1];
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
        throw new Error("RequireURLs: index.js: file access error", err.toString());
    }

    var requirePaths = request;
    requirePaths.split("/").pop();
    require.main.paths.push(requirePaths);

    options.logger("RequireURLs: index.js: All Paths request, gitUrlFetch, gitUrl, gitCacheUrl,  gitFileCacheUrl, localGitFile, localGitDir: ", request, ",", gitUrlFetch, ",", gitUrl, ",", gitCacheUrl, ",", gitFileCacheUrl, ",", localGitFile, ",", localGitDir);
    options.logger("RequireURLs: index.js: Making Fetch request to ", request);

    return fetch(request).then(response => response.text())
        .then(function (data) {

            function fetchWriteRequire(u) {
                return fs.writeFile(u, data, function (err) {
                    if (err) {
                        options.logger("RequireURLs: index.js: ", err.toString());
                        throw new Error("RequireURLs: index.js: ", err.toString());
                    }
                    return require(u);
                });
            }

            if (!!options.forceUpdate) {
                return fetchWriteRequire(gitFileCacheUrl);
            }

            try {
                if (fs.existsSync(gitFileCacheUrl)) {
                    return require(gitFileCacheUrl);
                }
            } catch (err) {
                return fetchWriteRequire(gitFileCacheUrl);
            }
        });
}

if (!!global.require) {
    global.require = require;
    global.require.resolve = function (request, options) {
        try {
            return require.resolve(request, options);
        } catch (e) {
            return requireurl(request, { ...options, baseType: options.baseType, recursive: options.recursive, forceUpdate: options.forceUpdate });
        }
    }
}

module.exports = requireurl;
