/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: index.mjs
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

import { 
    
    _concurrencyProcesses,
    _concurrencyThreads,

     _writeFileLock,
    _createSHAHash,
    _readFileLock,
    _createFileLock,
    _updateFileLockEntry,
    _deleteFileLockEntry,
    _fileContentHash,
    _fileContentDeHash,
    _verifyFilelockFile,
    _verifyFilelock,
    _verifySHAHash,
    _verifyFileContentHash,

     _isinbuilt,
    _createFolders,
    _writeFile,
    _registerNodeCache,

     _ftpConnect,
    _getFtpRequest,

    
    _searchGit,
    _findGitRemoteFileUrl,
    _findGitRemoteRootUrl,
    _findGitRemotePackageJsonUrl,
    _searchGitFilesResultsModifier,
    _getDirContentResultsModifier,
    _getGitURLs,
    _getGitCommit,
    _getGitSHAHash,
    _getGitTagName,
    _getGitBranchName,
    _getGitContentFile,
    _getGitContentDir,
    _getGitContentDirRecursive,
    _getGitTree,
    _getGitTreeRecursive,
    _getGitRepositories,
    _getGitIssues,
    _getGitLabels,
    _getGitTopics,
    _getGitUsers,
    _getGitUserRepositories,
    _getGitRepository,

    
    _getMercurialRequest,

     _checkModuleImports,
    _requiresObject,
    _requireRegex,
    _importRegex,
    _importESRegex,
    _importRegexExtended,
    _isESMFileExtension,
    _isESMCodeBase,
    _isCJSCodeBase,
    _isModuleInPackageJson,
    _checkRequireModuleImports,
    _isESCode,

    
    _isValidURL, _getProtocol, _checkHttpsProtocol,
    _getRequest, _fetch, _deleteRequest,
    _postRequest, _putRequest, _patchRequest, _request,

     _getRequireOrImport,
    _requireImportNodeCache,
    _requireImport,
    _requireWriteImport,
    _require,
    _isParentModule,

     _getRoot,
    _getGitRoot,
    _getSvnRoot,
    _getFtpRoot,
    _getNodeModulesRoot,
    _getPackageJsonRoot,
    _createJscachePath,
    _getRequirePaths,

    
    _getSvnRequest,

    packageJsonParser
} from './index.js';
// process.env.NODE_OPTIONS = '--experimental-modules --loader ./custom-loader.mjs';

import { default as requireurls } from "./index.js";

export default requireurls;

export { 
    
    _concurrencyProcesses,
    _concurrencyThreads,

     _writeFileLock,
    _createSHAHash,
    _readFileLock,
    _createFileLock,
    _updateFileLockEntry,
    _deleteFileLockEntry,
    _fileContentHash,
    _fileContentDeHash,
    _verifyFilelockFile,
    _verifyFilelock,
    _verifySHAHash,
    _verifyFileContentHash,

     _isinbuilt,
    _createFolders,
    _writeFile,
    _registerNodeCache,

     _ftpConnect,
    _getFtpRequest,

    
    _searchGit,
    _findGitRemoteFileUrl,
    _findGitRemoteRootUrl,
    _findGitRemotePackageJsonUrl,
    _searchGitFilesResultsModifier,
    _getDirContentResultsModifier,
    _getGitURLs,
    _getGitCommit,
    _getGitSHAHash,
    _getGitTagName,
    _getGitBranchName,
    _getGitContentFile,
    _getGitContentDir,
    _getGitContentDirRecursive,
    _getGitTree,
    _getGitTreeRecursive,
    _getGitRepositories,
    _getGitIssues,
    _getGitLabels,
    _getGitTopics,
    _getGitUsers,
    _getGitUserRepositories,
    _getGitRepository,

    
    _getMercurialRequest,

     _checkModuleImports,
    _requiresObject,
    _requireRegex,
    _importRegex,
    _importESRegex,
    _importRegexExtended,
    _isESMFileExtension,
    _isESMCodeBase,
    _isCJSCodeBase,
    _isModuleInPackageJson,
    _checkRequireModuleImports,
    _isESCode,

    
    _isValidURL, _getProtocol, _checkHttpsProtocol,
    _getRequest, _fetch, _deleteRequest,
    _postRequest, _putRequest, _patchRequest, _request,

     _getRequireOrImport,
    _requireImportNodeCache,
    _requireImport,
    _requireWriteImport,
    _require,
    _isParentModule,

     _getRoot,
    _getGitRoot,
    _getSvnRoot,
    _getFtpRoot,
    _getNodeModulesRoot,
    _getPackageJsonRoot,
    _createJscachePath,
    _getRequirePaths,

    
    _getSvnRequest,

    packageJsonParser
}

