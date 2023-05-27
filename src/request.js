/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/request.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';


const path = require('path');
const fs = require('fs');

const { _isValidURL, _getProtocol, _checkHttpsProtocol, _fetch, _deleteRequest, _getRequest, _postRequest, _putRequest, _patchRequest, _request } = require("request-apis");


// /** New Structure for Revamped version of index.js with better isolation, and independent functions */


// /**
//  *
//  *
//  * @param {*} url
//  * @return {*} 
//  */
// function _checkHttpsProtocol(url) {
//     let givenURL;
//     try {
//         givenURL = new URL(url);
//     } catch (error) {
//         return false;
//     }
//     return givenURL.protocol === "https:";
// }

// /**
//  *
//  *
//  * @param {*} url
//  * @return {*} 
//  */
// function _getProtocol(url) {
//     let givenURL;
//     try {
//         givenURL = new URL(url);
//     } catch (error) {
//         return false;
//     }
//     return givenURL.protocol === "http:" || givenURL.protocol === "https:";
// }

// // // Avoid 
// // function isValidURL(string) {
// //     var res =
// //         string.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-
// //             ]+[a - zA - Z0 - 9]\.[^\s]{ 2,}| www\.[a - zA - Z0 - 9][a - zA - Z0 - 9 -] + [a - zA - Z0 - 9]
// //     \.[^\s]{ 2,}| https ?: \/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|w
// //     ww\.[a - zA - Z0 - 9] +\.[^\s]{ 2,}) /gi);
// //     return (res !== null);
// // };

// /**
//  *
//  *
//  * @param {*} url
//  * @return {*} 
//  */
// function _isValidURL(url) {
//     let givenURL;
//     try {
//         givenURL = new URL(url);
//     } catch (error) {
//         return false;
//     }
//     return true;
// }

// /**
//  *
//  *
//  * @param {*} options
//  * @param {*} data
//  * @return {*} 
//  */
// function _getRequest(options, data, protocol) {
//     return new Promise((resolve, reject) => {
//         const { get } = (protocol === "https") ? require("https") : require("http");
//         get(options, (res) => {
//             let result = '';
//             res.on('data', (chunk) => result += chunk);
//             res.on('end', () => resolve(JSON.parse(result)));
//         }).on('error', (err) => reject(err));
//     });
// }

// /**
//  *
//  *
//  * @param {*} request
//  * @param {*} options
//  * @param {*} localGitFileCacheUrl
//  * @param {*} _requireWriteImport
//  * @return {*} 
//  */
// function _fetch(request, options, localGitFileCacheUrl, _requireWriteImport) {
//     return fetch(request).then(response => response.text())
//         .then(function (data) {
//             return _requireWriteImport(request, localGitFileCacheUrl, data, options)
//         }.bind(_requireWriteImport));
// }


async function fetchMultipleUrls(urls) {
    const fetchUrl = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        return response.text();
    };

    const results = await runFunctionInWorkerThreads(fetchUrl, urls.map((url) => [url]));

    const errors = results.errors.filter((error) => error);
    if (errors.length > 0) {
        throw new Error(`Failed to fetch ${errors.length} URLs`);
    }

    return results.results;
}

// const urls = ['https://www.google.com', 'https://www.google.com/search?q=javascript', 'https://www.google.com/search?q=web+workers'];

// fetchMultipleUrls(urls)
//     .then((results) => {
//         console.log(results);
//     })
//     .catch((error) => {
//         console.error(error);
// });


function fetchUrls(fetchObj = { fetch: [{ url: 'https://www.google.com' }, { url: 'http://www.paytm.com' }] }) {
    const http = require('http');
    const requests = fetchObj.fetch.map(obj => {
        return new Promise((resolve, reject) => {
            http.get(obj.url, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', err => {
                reject(err);
            });
        });
    });
    return Promise.some(requests)
        .then(responses => Promise.revolve(responses))
        .catch(err => Promise.reject(responses));
}




// Make requests

module.exports._deleteRequest = _deleteRequest;
module.exports._getRequest = _getRequest;
module.exports._postRequest = _postRequest;
module.exports._putRequest = _putRequest;
module.exports._patchRequest = _patchRequest;
module.exports._request = _request;


// Make http checks

module.exports._isValidURL = _isValidURL;
module.exports._getProtocol = _getProtocol;
module.exports._checkHttpsProtocol = _checkHttpsProtocol;
module.exports._fetch = _fetch;
module.exports.fetchUrls = fetchUrls;

