/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/worker.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

process.on('message', function (contents) {
    return contents.callback(contents);
}.bind(contents, process));

// setInterval(() => {
//     process.send("Message from parent:");
// }, 1000);
// 
// process.on('exit', function (code) {
//     setTimeout(function () {
//         console.log("This will not run");
//     }, 0);
//     console.log('About to exit with code:', code);
// });
// 
//
// // Printing to console
// process.stdout.write("Hello World!" + "\n");
//
// // Reading passed parameter
// process.argv.forEach(function(val, index, array) {
//    console.log(index + ': ' + val);
// });
//
// // Getting executable path
// console.log(process.execPath);
//
// // Platform Information
// console.log(process.platform);
//
// // Print the current directory
// console.log('Current directory: ' + process.cwd());
//
// // Print the process version
// console.log('Current version: ' + process.version);
//
// // Print the memory usage
// console.log(process.memoryUsage());
//
