/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: loader.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
*/

/* eslint no-console: 0 */

'use strict';

import requireurls from "./src/wrapper.js";

/**
 *
 * resolve
 *
 * @export
 * @param {*} specifier
 * @param {*} context
 * @param {*} nextResolve
 * @return {*} 
 */
export function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  // console.log("context", context);

  /*
   * 
   * Normally Node.js would error on specifiers starting with 'https://', so
   * this hook intercepts them and converts them into absolute URLs to be
   * passed along to the later hooks below
   * 
  */
  if (specifier.startsWith('https://') || specifier.startsWith('http://')) {
    return {
      shortCircuit: true,
      url: specifier
    };
  } else if (parentURL && (parentURL.startsWith('https://') || parentURL.startsWith('http://'))) {
    return {
      shortCircuit: true,
      url: new URL(specifier, parentURL).href,
    };
  }

  /**
   * 
   * Let Node.js handle all other specifiers
   * 
   */
  return nextResolve(specifier);
}


/**
 * 
 * load
 * 
 * @export
 * @param {*} url
 * @param {*} context
 * @param {*} nextLoad
 * @return {*} 
 */
export function load(url, context, nextLoad) {

  /** 
   * 
   * For JavaScript to be loaded over the network, we need to 
   * fetch and return it
   * 
   */
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return new Promise((resolve, reject) => {
      try {

        return requireurls(url).then((data) => {
          resolve({
            format: 'module',
            shortCircuit: true,
            source: data,
          })
        });
      } catch (err) {
        reject(err)
      }
    });
  }

  /**
   * 
   * Let Node.js handle all other specifiers
   *
   */
  return nextLoad(url);
}

