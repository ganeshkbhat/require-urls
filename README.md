# require-urls

#### `Deno and GoLang Mode in commonjs import (require) and ES import syntax`

Replace nodejs require function with `requireurls` function or `use loader functionality using loader.mjs` replacing import functionality that can fetch remote urls. `require-urls` helps you require remote files (individually or recursively) from `git`, `svn`, `mercurial`, `ftp`, `remote cloud stores` using the `requireurls function. Please check the features section for currently available features.

This module has a single simple function `requireurls` for URL (git raw file) resolution and parsing meant to have feature parity with node.js core url module.

It also, by default, allows for cacheing (rather storing) files in a temporary working folder/repository. The files are stored in `.jscache` temporary folder. The file can be pulled from the cache, if already cached. You can force update the cache file if needed. The `.jscache` looks like the folder in the repository saved. You have an option to cache the files into node cache using the [require.cache](https://nodejs.org/api/modules.html#requirecache) option by specifying `cacheFetch` option. Do have a look at it.

### DEMOS

Find the demos in the [demo folder](./demos/)

### INSTALLATION

`npm install require-urls --save`

npm Package: [require-urls](https://www.npmjs.com/package/require-urls)

### USAGE

```

let requireurls = require("require-urls");
let request = "https://raw.githubusercontent.com/ganeshkbhat/requireurl/main/index.js";
let options = {};
requireurls(request, options);

```

Run the file using the following command:

```
node --experimental-loader=./node_modules/require-urls/src/loaders/loader.mjs ./file.js
```

### FEATURES

Currently, the project is in development and support the following features:

- Import `remote file` from a remote URL (Github support)
- Import `remote file and its dependencies recursively` from from a remote URL (Github support)
- Import files are `cached` in `.jscache` folder in the project
- [TODO] Minor addition of using `package.json` to import entire package installation for use
- [TODO] Support of other repositories like `svn`, `mercurial`, `ftp`, or any `other cloud` stores.


### OBJECT `options` 


You can add all inbuilt default options of require's resolve function. The default require options can be found here: [require.resolve](https://nodejs.org/api/modules.html#requireresolverequest-options). All other options customized for `require-urls` function's `options` argument object are as below:


Following is a sample `options` object. All are options object and everything have defaults.


```

// .... all imports etc

let options  = {
  paths: "", // require.resolve options key
  baseType: "git", // Which repository or store the file is being pulled from
  recursive: false, // Require urls recursively 
  // if forceUpdate is false and files are present then require from jscache folder, if already downloaded. 
  // if forceUpdate is false and files are not present then fetch from remote and save. 
  // if forceUpdate is true and files are present then forceUpdate the files.
  forceUpdate: false, 
  logger: console.log, // Add logger to the require function, gives detailed logging during fetch
  cacheFetch: true, // TODO: ReConsidering feature. require from jscache folder, if already downloaded. Conflicting with forceUpdate
  getMethods: true, // get individual methods of remoteUrl, recursiveUrl, packageJson
  noRequire: false, // TODO: require 
  jscacheDir: '\$pwd\$'
}

requireurls(request, options)

```


### KEY DETAILS `options` 



```
/* options: git, bitbucket, gitlab, svn [TODO], ftp [TODO], etc.*/
/* Default is `git`. */

baseType: "git"
```

```
/* recursive: will allow for recursive pull and cache of files relative to remote url path. */
/* Default is false. */

recursive: false
```

```
/* forceUpdate: force update the .jscache folder for the remote url files.*/
/* Default is false. */

forceUpdate: false
```

```
/* logger: provide a logger function to use.*/
/* Default is console.log */

logger: console.log
```

```
/* Adds the `.jscache` or remotely fetched files using `require.cache` feature of nodejs */
/* Default is false */

cacheFetch: true
```

```
/* getMethods: Get all the methods of require-urls.*/
/* Default is false */
/* Usage: requireurls("", { getMethods: true }) */
/* Returns an object { remoteUrl, recursiveUrl, packageJson } instead of a requireurls function */

getMethods: false
```

```
/* noRequire: Get all the methods of require-urls.*/
/* Default is false */
/* Usage: requireurls("", { noRequire: true }) */
/*  */

noRequire: false
```

```
/* jscacheDir: The directory for .jscache folder. */
/* Default is $pwd$ */
/* Options are $git$, $pwd$, $packagejson$, $svn$, $ftp$, $nodemodules$, './path/to/folder' */
/* Usage: requireurls("", { jscacheDir: '\$git\$' }) */
/*  */

jscacheDir: '\$pwd\$'
```

#### DEMO USAGE CODE

```


let requireurls = require("require-urls");

let fileone = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/main/index.js");
let filetwo = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");
let filethree = requireurls("https://github.com/ganeshkbhat/requireurl/blob/main/index.js");


let requireurls = require("require-urls");
let c = requireurls(
        "https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js", // request remote url 
        {
            /* You can add all inbuilt default options of require's resolve function */
            
            baseType: "git", // options: git, bitbucket
            recursive: true, // recursive: will allow for recursive pull and cache of files relative to remote url path
            forceUpdate: true, // forceUpdate: force update the .jscache folder for the remote url files
            logger: console.log // logger: provide a logger function to use. default is console.log
        });

c.then(d => console.log("testing", d));


```

```


// Importing using the CommonJS and ES import Syntax
// RUN command with --experimental-loader to run the files through the import syntax support for remote url requires or imports:
// node --experimental-loader ./node_modules/require-urls/loader.mjs ./file.mjs
// node --experimental-loader ./node_modules/require-urls/loader.mjs ./file.js

let c = import("https://github.com/cgi-js/cgi-js/blob/main/src/configs.js");
console.log("[require-urls] demo-import.mjs ", cgijs);


```

```


// Importing using the ES import Syntax
// RUN command with --experimental-loader to run the files through the import syntax support for remote url requires or imports:
// node --experimental-loader ./node_modules/require-urls/loader.mjs ./file.mjs

import  cgijs from "https://github.com/cgi-js/cgi-js/blob/main/src/index.js";
console.log("[require-urls] demo.mjs ", cgijs);

import  { default as cgijsd } from "https://github.com/cgi-js/cgi-js/blob/main/src/index.js";
console.log("[require-urls] demo.mjs ", cgijsd);


```


```

// Importing remote files and dependencies files recursively

let requireurls = require("require-urls");
let d = requireurls("https://github.com/cgi-js/cgi-js/blob/main/src/index.js", {
    baseType: "git", recursive: true, forceUpdate: true,
    logger: console.log, cacheFetch: false,
    getMethods: false, noRequire: false
    });
console.log("[require-urls] demo-recursive.js: Getting cgi-js file: ", d.then(r => console.log(r)));

```

# ERRORS DOCUMENTATION

Documented Errors [errors](./docs/errors.md)

### TODO

- [D] Github support for remote files import
  - [D] single file import.
  - [D] file import and dependency file imports recursively.
  - [D] importing project using package.json.
- [T] Gitlab support for remote files import
  - [T] single file import.
  - [T] file import and dependency file imports recursively.
  - [T] importing project using package.json.
- [T] Bitbucket support for remote files import and testing for
  - [T] single file import.
  - [T] file import and dependency file imports recursively.
  - [T] importing project using package.json.
- [P] Naming of folders based on
  - [P] `domain > user@repo > SHA`
  - [D] `domain > user@repo > commit`
  - [P] `domain > user@repo > tag`
  - [D] `domain > user@repo > branch`
- [P] Add options to import a remote published or unpublished package using `https://remoteurl/.../package.json` pack of repository.
- [P] Files imported are documented in `filelock.json` file with their content one-way cryptographic hash.
- [P] Add verify command for files in `.jscache`.
- [P] Add support for `.ts` (typescript) files import with transpiling dynamically during import.
- [P] Add support for `.coffee` (coffeescript) files import with transpiling dynamically during import.
- [T] Add support for FTP.
- [T] Add support for SVN.
- [T] Add support for Mercurial.
- [T] Consider support for S3.
- [T] Consider support for Google Cloud.
- [T] Consider support for Google Drive.

### CONTRIBUTIONS

Contributions, Feature Improvements, Bugs, and Issues are invited. [raising an issue](https://github.com/ganeshkbhat/requireurl/issues)

# LICENSE

[MIT License](./LICENSE)
