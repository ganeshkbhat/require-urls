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


const { _checkModuleImports, _requiresObject, _requireRegex, _importRegex, _importESRegex, _importRegexExtended, _isESMFileExtension, _isESMCodeBase, _isCJSCodeBase, _isESCode, _isModuleInPackageJson } = require("get-imported");


module.exports._checkModuleImports = _checkModuleImports;
module.exports._requiresObject = _requiresObject;
module.exports._requireRegex = _requireRegex;
module.exports._importRegex = _importRegex;
module.exports._importESRegex = _importESRegex;
module.exports._importRegexExtended = _importRegexExtended;
module.exports._isESMFileExtension = _isESMFileExtension;
module.exports._isESMCodeBase = _isESMCodeBase;
module.exports._isCJSCodeBase = _isCJSCodeBase;
module.exports._isESCode = _isESCode;
module.exports._isModuleInPackageJson = _isModuleInPackageJson;
