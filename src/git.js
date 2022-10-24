/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/git.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

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

const path = require('path');
const fs = require('fs');
const { _getRoot } = require("./getroot.js");

/** New Structure for Revamped version of index.js with better isolation, and independent functions */

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

function _getPackageJsonRoot(startdirectory, options) {
    function cb(fullPath, options) {
        if ((options.baseType === "package.json")) {

        }
        return path.normalize(fullPath);
    }
    options.baseType = "package.json";
    return _getRoot(startdirectory, { ...options, baseType: options.baseType, getRootCallback: cb });
}

// 
//
// STRUCTURE WITH AUTHORIZATION
//
// GET REQUEST WITH CURL
// 
// curl \
// -u <USERNAME>:<TOKEN>
// -H "User-Agent": <USERNAME>
// -H "Accept: application/vnd.github+json" \
// -H "Authorization: Bearer <YOUR-TOKEN>" \
// https://api.github.com/repos/OWNER/REPO/contents/PATH
// 
// GET REQUEST WITHOUT CURL
// 
// let s = search(
//     { hostname: "https://api.github.com/repos/ganeshkbhat/requireurl/contents/test/test-require.js", port: 80, path: "", method: "GET" },
//     { "User-Agent": "${username}", "Accept": "application/vnd.github+json", 'Authorization': 'Basic ' + btoa('${username}:${token}') },
//     null,
//     "git"
// );
//
// 
//
// STRUCTURE WITHOUT AUTHORIZATION
//
// GET REQUEST WITH CURL
// 
// curl \
// -H "User-Agent": <USERNAME>
// -H "Accept: application/vnd.github+json" \
// https://api.github.com/repos/OWNER/REPO/contents/PATH
//
// GET REQUEST WITHOUT CURL
// 
// let s = search(
//     { hostname: "https://api.github.com/repos/ganeshkbhat/requireurl/contents/test/test-require.js", port: 80, path: "", method: "GET" },
//     { "User-Agent": "${username}", "Accept": "application/vnd.github+json" },
//     null,
//     "git"
// );
//
//

/**
 *
 *
 * @param {*} requestOptions
 * @param {*} [data=null]
 * @param {*} options
 * @return {*} 
 */
function _searchGit(requestOptions, data = null, options) {
    requestOptions["Accept"] = requestOptions["Accept"] || requestOptions["accept"] || "application/vnd.github+json";
    requestOptions["Authorization"] = requestOptions["Authorization"] || requestOptions["authorization"] || undefined;
    requestOptions.headers["User-Agent"] = requestOptions.headers["User-Agent"] || requestOptions.headers["user-agent"] || "require-urls - npmjs.com/package/require-urls";
    requestOptions = { ...requestOptions, method: "GET" };

    // if (options.baseType === "git") {
    //     throw new Error("[require-urls] index.js: gitlab: Not yet implemented.");
    // } else if (options.baseType === "gitlab") {
    //     throw new Error("[require-urls] index.js: gitlab: Not yet implemented.");
    // } else if (options.baseType === "bitbucket") {
    //     throw new Error("[require-urls] index.js: bitbucket: Not yet implemented.");
    // } else {
    //     throw new Error("[require-urls] index.js: generic request: Not yet implemented.");
    // }

    return _getRequest(requestOptions, data, options.protocol || "https").then(function (result) {
        return result;
    });
}

function _findGitRemoteFileUrl(remoteUrl, searchOptions, options) {
    // Implement _getRoot logic into remote url with concurrency
}

function _findGitRemoteRootUrl(remoteUrl, searchOptions, options) {
    // Implement _getRoot logic into remote url with concurrency
}

function _findGitRemotePackageJsonUrl(remoteUrl, options) {
    // Implement _getRoot logic and find the package.json url into remote package.json url with concurrency
}

/**
 *
 *
 * @param {*} results
 * @param {*} options
 * @return {*} 
 */
function _searchGitFilesResultsModifier(results, options) {
    // 
    // each item should be of the structure 
    // {  path, html_url, repository: { id, html_url, tags_url, git_tags_url, git_commits_url, contents_url, releases_url } }
    // 
    // let opt = {
    //     hostname: "api.github.com",
    //     path: `/search/${searchtype}?q=user:${username}+repo:${repo}+extension:${extension}+path:${pathtofile}`,
    //     headers: { "User-Agent": "${username}" }
    // }
    // 

    let items = JSON.parse(results).items;
    let contents;
    for (let i = 0; i < items.length; i++) {
        contents = {
            path: items[i].path, html_url: items[i].html_url,
            repository: {
                id: items[i].repository.id,
                html_url: items[i].repository.html_url,
                tags_url: items[i].repository.tags_url,
                git_tags_url: items[i].repository.git_tags_url,
                git_commits_url: items[i].repository.git_commits_url,
                contents_url: items[i].repository.contents_url,
                releases_url: items[i].repository.releases_url
            }
        }
        // console.log(contents);
    }
    return contents;
}

/**
 *
 *
 * @param {*} results
 * @param {*} options
 * @return {*} 
 */
function _getDirContentResultsModifier(results, options) {
    // 
    // // type:dir
    // let opt = {
    //     hostname: "api.github.com",
    //     path: `/repos/${username}/${repository}/contents/${dirname}`,
    //     headers: { "User-Agent": "${username}" }
    // }
    //
    // // type:file
    // let opt = {
    //     hostname: "api.github.com",
    //     path: `/repos/${username}/${repository}/contents/${filename}`,
    //     headers: { "User-Agent": "${username}" }
    // }
    //

    let items = JSON.parse(results);
    let contents;
    for (let i = 0; i < items.length; i++) {
        contents = {
            name: items[i].name,
            path: items[i].path,
            size: items[i].size,
            url: items[i].url,
            git_url: items[i].git_url,
            html_url: items[i].html_url,
            download_url: items[i].download_url,
            // _links: items[i]._links,
            type: items[i].type,
            sha: items[i].sha
        }
        // console.log(contents);
    }
    return contents;
}

function _getGitCommitNumber(request, options) {}
function _getGitSHAHash(request, options) {}
function _getGitTagName(request, options) {}
function _getGitBranchName(request, options) {}

module.exports._getGitRoot = _getGitRoot;
module.exports._getRequireOrImport = _getRequireOrImport;
module.exports._getPackageJsonRoot = _getPackageJsonRoot;
module.exports._searchGit = _searchGit;
module.exports._findGitRemoteFileUrl = _findGitRemoteFileUrl;
module.exports._findGitRemoteRootUrl = _findGitRemoteRootUrl;
module.exports._findGitRemotePackageJsonUrl = _findGitRemotePackageJsonUrl;
module.exports._searchGitFilesResultsModifier = _searchGitFilesResultsModifier;
module.exports._getDirContentResultsModifier = _getDirContentResultsModifier;
module.exports._getGitCommitNumber = _getGitCommitNumber;
module.exports._getGitSHAHash = _getGitSHAHash;
module.exports._getGitTagName = _getGitTagName;
module.exports._getGitBranchName = _getGitBranchName;
