/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: loader-http.mjs
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * Reference: https://nodejs.org/api/esm.html#import-statements
 * 
*/

/* eslint no-console: 0 */

'use strict';

// loader-http.mjs
import { get } from 'node:https';

export function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  // Normally Node.js would error on specifiers starting with 'https://', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (specifier.startsWith('https://')) {
    return {
      shortCircuit: true,
      url: specifier
    };
  } else if (parentURL && parentURL.startsWith('https://')) {
    return {
      shortCircuit: true,
      url: new URL(specifier, parentURL).href,
    };
  }

  // Let Node.js handle all other specifiers.
  return nextResolve(specifier);
}

export function load(url, context, nextLoad) {
  // For JavaScript to be loaded over the network, we need to fetch and return it.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // This example assumes all network-provided JavaScript is ES module code.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url);
}