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
const { _createFolders } = require("./filesystem.js");
const { _getRequirePaths } = require("./getroot.js");
const path = require("path");

/**
 *
 *
 * @param {*} filelockOptions
 * @param {*} fileoptions
 * @return {*} 
 */
function _createFileLockJson(filelockOptions, fileoptions, options) {
    if (!filelockOptions.name && !filelockOptions.localPath && (!filelockOptions.commit || !filelockOptions.sha || !filelockOptions.tag)) {
        throw new Error("[require-urls]: filelock.js._createFileLockJson: ");
    }
    var readFilelock = {};
    try {
        readFilelock = _readFileLockJson(path.join(filelockOptions.localPath, "filelock.json"));
    } catch (e) {
        options.logger("[require-urls]: filelock.js._createFileLockJson: readFilelock assignation - filelockOptions: ");
    }

    if (Object.keys(readFilelock).length === 0) {
        if ((!(filelockOptions.username && filelockOptions.repository) && !filelockOptions.name) && filelockOptions.localPath && (!filelockOptions.commit && !filelockOptions.sha && !filelockOptions.tag)) {
            throw new Error("[require-urls]: filelock.js._createFileLockJson: filelockOptions options check : ", filelockOptions);
        }
    }

    /** 
     * 
     * metadata:
     * 
     * readFilelock
     * { name, local, repository, sha, commit, tag, dependencies, files }
     * 
     */
    if (Object.keys(readFilelock).length === 0) {
        readFilelock = {
            name: filelockOptions.username + "@" + filelockOptions.repository,
            localPath: filelockOptions.localPath,
            repositoryPath: filelockOptions.repositoryPath,
            sha: filelockOptions.sha,
            commit: filelockOptions.commit,
            tag: filelockOptions.tag || "",
            dependencies: filelockOptions.dependencies || {},
            files: {}
        }
    }

    options.logger("[require-urls]: filelock.js._createFileLockJson: readFilelock ", readFilelock);
    let files = (!!readFilelock.files) ? { ...readFilelock.files } : {};

    /**
     * 
     * metadata:
     * 
     * fileoptions
     * { name, local, remote, sha, digest, dependencies }
     */
    readFilelock["files"] = { ...files };
    let filename = (!!fileoptions.name) ? fileoptions.name : undefined;
    if (!!filename) {
        readFilelock["files"] = { ...readFilelock.files, [filename]: { ...fileoptions } };
    }

    options.logger("[require-urls]: filelock.js: filelock data to be written - ", readFilelock);
    return _writeFileLock(filelockOptions.localPath, readFilelock, options);
}

/**
 *
 *
 * @param {*} filelockOptions
 * @param {*} fileoptions
 * @return {*} 
 */
function _updateFileLockJsonEntry(filelockOptions, fileoptions, options) {
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
    return _writeFileLock(filelockOptions.localPath, data, options);
}

/**
 *
 *
 * @param {*} filelockOptions
 * @param {*} fileoptions
 * @return {*} 
 */
function _deleteFileLockJsonEntry(filelockOptions, fileoptions, options) {
    var readFilelock = _readFileLockJson(path.join(filelockOptions.localPath, "filelock.json"));
    delete readFilelock.files[fileoptions.name];
    return _writeFileLock(filelockOptions.localPath, readFilelock, options);
}

/**
 *
 *
 * @param {*} filelockPath
 * @return {*} 
 */
function _readFileLockJson(filelockPath) {
    return require(path.join(filelockPath, "filelock.json"));
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
async function _writeFileLock(localPath, data, options) {
    try {
        await _createFolders(localPath, options);
        return _writeFile(path.join(localPath, "filelock.json"), JSON.stringify(data), options);
    } catch (e) {
        options.logger("[require-urls]: filelocks.js: _writeFileLock: Folder present");
        return _writeFile(path.join(localPath, "filelock.json"), JSON.stringify(data), options);
    }
    
}

module.exports._writeFileLock = _writeFileLock;
module.exports._fileContentSHAHash = _fileContentSHAHash;
module.exports._readFileLockJson = _readFileLockJson;
module.exports._createFileLockJson = _createFileLockJson;
module.exports._updateFileLockJsonEntry = _updateFileLockJsonEntry;
module.exports._deleteFileLockJsonEntry = _deleteFileLockJsonEntry;
