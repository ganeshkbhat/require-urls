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

/**
 *
 *
 * @param {*} startdirectory
 * @param {string} [options={ baseType: "git" }]
 * @return {*} 
 */
function _getRoot(startdirectory, options = { baseType: "git" }) {
    function cb(fullPath) {
        if (options.fileFolder === "folder" && options.baseType === "git" && !fs.lstatSync(fullPath).isDirectory()) {
            var content = fs.readFileSync(fullPath, { encoding: 'utf-8' });
            var match = /^gitdir: (.*)\s*$/.exec(content);
            if (match) {
                return path.normalize(match[1]);
            }
        }
        return path.normalize(fullPath);
    }

    if (!options.getRootCallback) {
        options["getRootCallback"] = cb
    }

    startdirectory = startdirectory || module.parent.filename;
    if (typeof startdirectory === 'string') {
        if (startdirectory[startdirectory.length - 1] !== path.sep) {
            startdirectory += path.sep;
        }
        startdirectory = path.normalize(startdirectory);
        startdirectory = startdirectory.split(path.sep);
    }

    if (!startdirectory.length) {
        options.logger('[require-urls]: index.js: repo base git/ or node_modules/ or package.json not found in path');
        throw new Error('[require-urls]: index.js: repo base git/ or node_modules/ not found in path');
    }

    startdirectory.pop();
    var fullPath = path.join(startdirectory.join(path.sep), "." + options.baseType);

    if (fs.existsSync(fullPath)) {
        return cb(fullPath);
    } else {
        return _getRoot(startdirectory, options);
    }
}

/**
 *
 *
 * @param {*} startdirectory
 * @param {*} options
 * @return {*} 
 */
function _getNodeModulesRoot(startdirectory, options) {
    function cb(fullPath, options) {
        if (!fs.lstatSync(fullPath).isDirectory()) {
            var content = fs.readFileSync(fullPath, { encoding: 'utf-8' });
            var match = /^node_modulesdir: (.*)\s*$/.exec(content);
            if (match) {
                return path.normalize(match[1]);
            }
        }
        return path.normalize(fullPath);
    }
    return _getRoot(startdirectory, { ...options, baseType: "node_modules", getRootCallback: cb });
}

/**
 *
 *
 * @param {*} startdirectory
 * @param {*} options
 * @return {*} 
 */
function _getGitRoot(startdirectory, options) {
    function cb(fullPath, options) {
        if ((options.baseType === "git" || options.baseType === "gitlab" || options.baseType === "bitbucket") && !fs.lstatSync(fullPath).isDirectory()) {
            var content = fs.readFileSync(fullPath, { encoding: 'utf-8' });
            var match = /^gitdir: (.*)\s*$/.exec(content);
            if (match) {
                return path.normalize(match[1]);
            }
        }
        return path.normalize(fullPath);
    }
    options.baseType = "git";
    return _getRoot(startdirectory, { ...options, baseType: options.baseType, getRootCallback: cb });
}

/**
 *
 *
 * @param {*} startdirectory
 * @param {*} options
 * @return {*} 
 */
function _getPackageJsonRoot(startdirectory, options) {
    function cb(fullPath, options) {
        if (!fs.lstatSync(fullPath).isDirectory()) {
            var content = fs.readFileSync(fullPath, { encoding: 'utf-8' });
            var match = /^node_modulesdir: (.*)\s*$/.exec(content);
            if (match) {
                return path.normalize(match[1]);
            }
        }
        return path.normalize(fullPath);
    }
    return _getRoot(startdirectory, { ...options, baseType: "package.json", getRootCallback: cb });
}

function _createJscachePath(request, baseDirectory, options) { }

module.exports._getRoot = _getRoot;
module.exports._getGitRoot = _getGitRoot;
module.exports._getNodeModulesRoot = _getNodeModulesRoot;
module.exports._getPackageJsonRoot = _getPackageJsonRoot;
module.exports._createJscachePath = _createJscachePath;
