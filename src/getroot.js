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


const { _getRoot, _getGitRoot, _getSvnRoot, _getFtpRoot, _getNodeModulesRoot, _getPackageJsonRoot, _createJscachePath } = require("root-dirs");

module.exports._getRoot = _getRoot;
module.exports._getGitRoot = _getGitRoot;
module.exports._getSvnRoot = _getSvnRoot;
module.exports._getFtpRoot = _getFtpRoot;
module.exports._getNodeModulesRoot = _getNodeModulesRoot;
module.exports._getPackageJsonRoot = _getPackageJsonRoot;
module.exports._createJscachePath = _createJscachePath;

