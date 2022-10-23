
// // Following needs recursive url import

let c = require("../index");
let d = c("https://github.com/cgi-js/cgi-js/blob/main/src/index.js", { baseType: "git", recursive: true, forceUpdate: true, logger: console.log, cacheFetch: false, getMethods: false, noRequire: false });
console.log("[require-urls] demo-recursive.js: Getting cgi-js file: ", d.then(r => console.log(r)));


// let d = import("https://github.com/cgi-js/cgi-js/blob/main/src/index.js");
// console.log(d.then(r => console.log(r.source)));

// requireurls.then(d => console.log("Testing returns", d));
