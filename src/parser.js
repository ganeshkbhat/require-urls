/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/parser.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';


const path = require('path');
const fs = require('fs');

function _checkModuleImports(absPath) {
    try {
        let f;
        if (process.versions.node.split('.')[0] > "14") {
            f = import(absPath);
        } else {
            f = require(absPath);
        }
        return true;
    } catch (e) {
        return false;
    }
}

function _requiresObject() {
    function trim(p) {
        let reqregex = /(.*?).js/;
        let basename = path.basename(p);
        let moduleName = reqregex.exec(basename)[1];
        return [moduleName, p];
    }
    let requireCache = {};
    if (!!require.cache) {
        for (let p in require.cache) {
            let file = trim(p);
            requireCache[file[0]] = file[1];
        }
    }
    return requireCache;
}

function _requireRegex(absPath) {
    var requiredFiles = {};
    var contents = fs.readFileSync(absPath, 'utf8').split('\n');

    contents.forEach(function (line) {
        var reqregex = /(?:require\('?"?)(.*?)(?:'?"?\))/;
        var matches = reqregex.exec(line);

        if (matches) {
            let basename = path.resolve(matches[1]);
            requiredFiles[matches[1]] = basename;
        }
    });
    return requiredFiles;
}

function _importRegex(absPath) {
    var requiredFiles = {};
    var contents = fs.readFileSync(absPath, 'utf8').split('\n');

    contents.forEach(function (line) {
        var importregex = /(?:import\('?"?)(.*?)(?:'?"?\))/;
        var matches = importregex.exec(line);
        if (matches) {
            let basename = path.resolve(matches[1]);
            requiredFiles[matches[1]] = basename;
        }
    });
    return requiredFiles;
}

function _importRegexExtended(absPath) {
    var requiredFiles = {};
    var contents = fs.readFileSync(absPath, 'utf8').split('\n');

    contents.forEach(function (line) {
        var importregex = new RegExp(/import\((?:["'\s]*([\w*{}\n\r\t, ]+)\s*)?["'\s](.*([@\w_-]+))["'\s].*\);$/, 'mg');
        var matches = importregex.exec(line);
        if (matches) {
            matches = matches.filter(function(item) {
                if (item !== undefined || item !== null) return item;
            });
            let basename = path.resolve(matches[1]);
            requiredFiles[matches[1]] = basename;
        }
    });
    return requiredFiles;
}

function _importESRegex(absPath) {
    const regex = /import(?:[\s.*]([\w*{}\n\r\t, ]+)[\s*]from)?[\s*](?:["'](.*[\w]+)["'])?/gm;
    const fileContentString = fs.readFileSync(absPath, 'utf8').split('\n');
    
    // Alternative syntax using RegExp constructor
    // const regex = new RegExp('import(?:[\\s.*]([\\w*{}\\n\\r\\t, ]+)[\\s*]from)?[\\s*](?:["\'](.*[\\w]+)["\'])?', 'gm')

    let m, arr = {};
    while ((m = regex.exec(fileContentString)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach(function (match, groupIndex) {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            if (groupIndex === 2) {
                let basename = path.resolve(match);
                arr[match] = basename;
                // console.log("[basename, match]: ", [basename, match]);
            };
        });

    }
    arr = { ...arr, ..._importRegex(absPath), ..._requirePathsObject(absPath) } ;
    return arr;
}

module.exports._checkModuleImports = _checkModuleImports;
module.exports._requiresObject = _requiresObject;
module.exports._requireRegex = _requireRegex;
module.exports._importRegex = _importRegex;
module.exports._importESRegex = _importESRegex;
module.exports._importRegexExtended = _importRegexExtended;
