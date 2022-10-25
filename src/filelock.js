/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/filelock.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

const { _writeFile } = require("./filesystem.js");
const { _getGitCommitNumber, _getGitSHAHash, _getGitTagName, _getGitBranchName } = require("./git.js");
const { _getRequirePaths } = require("./getroot.js");
const path = require("path");

/**
 *
 *
 * @param {*} filelockOptions
 * @param {*} fileoptions
 * @return {*} 
 */
function _createFileLockJson(filelockOptions, fileoptions) {
    var readFilelock = _readFileLockJson(path.join(filelockOptions.localRepositoryPath, "filelock.json"));

    /** 
     * 
     * metadata:
     * 
     * readFilelock
     * { name, local, repository, sha, commit, tag, dependencies, files }
     * 
     */
    if (!readFilelock) {
        readFilelock = {
            name: filelockOptions.username + "@" + filelockOptions.repository,
            localPath: filelockOptions.localPath,
            repository: filelockOptions.repository,
            sha: filelockOptions.sha || "",
            commit: filelockOptions.commit || "",
            tag: filelockOptions.tag || "",
            dependencies: filelockOptions.dependencies || {},
            files: {}
        }
    }

    /**
     * 
     * metadata:
     * 
     * fileoptions
     * { name, local, remote, sha, digest, dependencies }
     */
    readFilelock.files = { ...readFilelock.files, [fileoptions.name]: { ...fileoptions } };
    return _writeFileLock(path.join(filelockOptions.localPath, "filelock.json", readFilelock));
}

/**
 *
 *
 * @param {*} filelockOptions
 * @param {*} fileoptions
 * @return {*} 
 */
function _updateFileLockJsonEntry(filelockOptions, fileoptions) {
    var readFilelock = _readFileLockJson(path.join(filelockOptions.localPath, "filelock.json"));

    /**
     * 
     * metadata:
     * 
     * fileoptions
     * { name, local, remote, sha, digest, dependencies }
     */
    readFilelock.files[fileoptions.name] = {
        name: fileoptions.name,
        localPath: fileoptions.localPath,
        remote: fileoptions.remote,
        sha: _fileContentSHAHash(fileoptions.data, fileoptions.digest),
        digest: fileoptions.digest,
        dependencies: { ...fileoptions.dependencies }
    }
    return _writeFileLock(filelockOptions.localPath, data);
}

/**
 *
 *
 * @param {*} filelockOptions
 * @param {*} fileoptions
 * @return {*} 
 */
function _deleteFileLockJsonEntry(filelockOptions, fileoptions) {
    var readFilelock = _readFileLockJson(path.join(filelockOptions.localPath, "filelock.json"));
    delete readFilelock.files[fileoptions.name];
    return _writeFileLock(filelockOptions.localPath, readFilelock);
}

/**
 *
 *
 * @param {*} filelockPath
 * @return {*} 
 */
function _readFileLockJson(filelockPath) {
    return require(filelockPath);
}

/**
 *
 *
 * @param {*} data
 * @param {*} digest
 * @return {*} 
 */
function _fileContentSHAHash(data, digest) {
    const crypto = require('crypto');
    var hash;
    if (digest === "base64") {
        hash = crypto.createHash('sha256').update(data).digest('base64');
    } else if (digest === "hex") {
        hash = crypto.createHash('sha256').update(data).digest('hex');
    }
    return hash;
}

/**
 *
 *
 * @param {*} localPath
 * @param {*} data
 * @return {*} 
 */
function _writeFileLock(localPath, data) {
    return _writeFile(localPath, data);
}

module.exports._writeFileLock = _writeFileLock;
module.exports._fileContentSHAHash = _fileContentSHAHash;
module.exports._readFileLockJson = _readFileLockJson;
module.exports._createFileLockJson = _createFileLockJson;
module.exports._updateFileLockJsonEntry = _updateFileLockJsonEntry;
module.exports._deleteFileLockJsonEntry = _deleteFileLockJsonEntry;
