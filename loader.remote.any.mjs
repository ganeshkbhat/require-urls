/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: loadernew.mjs
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * Reference: https://nodejs.org/api/esm.html#import-statements
 * 
*/

/* eslint no-console: 0 */

'use strict';

// loadernew.mjs
export function resolve(specifier, context, nextResolve) {
    const { parentURL = null } = context;


    return nextResolve(specifier);
}

export function load(url, context, nextLoad) {

    if (url.startsWith('https://') || url.startsWith('http://')) {
        return new Promise((resolve, reject) => {
            let frm = url.endsWith(".js") ? "commonjs" : url.endsWith(".cjs") ? "commonjs" : url.endsWith(".json") ? "json" : url.endsWith(".mjs") ? "module" : url.endsWith(".wasm") ? "wasm" : "builtin";
            try {

                if (typeof requireurls.then === "function") {
                    return requireurls(url).then((data) => {
                        resolve({
                            format: frm,
                            shortCircuit: true,
                            source: String(data),
                        })
                    });
                }

                let data = requireurls(url);
                if (typeof data === "object" && ["commonjs", "json"].includes(frm)) {
                    if (frm === "json") {
                        data = JSON.stringify(data);
                    }
                    return () => {
                        resolve({
                            format: frm,
                            shortCircuit: true,
                            source: String(data),
                        })
                    };
                } else {
                    return () => {
                        resolve({
                            format: frm,
                            shortCircuit: true,
                            source: String(data),
                        })
                    }
                }

            } catch (err) {
                console.error("loader.mjs: Fetch err.toString: ", err.toString());
                return () => {
                    reject({
                        format: frm,
                        shortCircuit: true,
                        source: String(err),
                    })
                }
            }
        });
    }
    return nextLoad(url);
}
