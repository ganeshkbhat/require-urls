# require-urls


`Deno Mode in commonjs require`:
Replace nodejs require function with requireurls function that can fetch remote urls.

This module has a single simple function `requireurls` for URL (git raw file) resolution and parsing meant to have feature parity with node.js core url module.

It also, by default, allows for cacheing (rather storing) files in a temporary working folder/repository. The files are stored in `.jscache` temporary folder. The file can be pulled from the cache, if already cached. You can force update the cache file if needed. The `.jscache` looks like the folder in the repository saved. You have an option to cache the files into node cache using the [require.cache](https://nodejs.org/api/modules.html#requirecache) option by specifying `cacheFetch` option. Do have a look at it.


### Installation


`npm install require-urls --save`

npm Package: [require-urls](https://www.npmjs.com/package/require-urls)


### Usage


`let requireurls = require("require-urls"); requireurls(request, options);`

#### options Object


```
/* You can add all inbuilt default options of require's resolve function */
```

The default require options can be found here: [require.resolve](https://nodejs.org/api/modules.html#requireresolverequest-options). All other options customized for `require-urls` function's `options` argument object are as below:


```
/* options: git, bitbucket, etc.*/
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
/* Returns an object { remoteurl, recursiveUrl, packageJson } instead of a requireurls function */

getMethods: false
```


#### Demo Usage Code


```


let requireurls = require("require-urls");

let fileone = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/main/index.js");
let filetwo = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");
let filethree = requireurls("https://github.com/ganeshkbhat/requireurl/blob/main/index.js");


let requireurls = require("require-urls");
let c = requireurls(
        /* request remote url */
        "https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js",
        {
            /* You can add all inbuilt default options of require's resolve function */

            /* options: git, bitbucket */
            baseType: "git",
            /* recursive: will allow for recursive pull and cache of files relative to remote url path */
            recursive: true,
            /* forceUpdate: force update the .jscache folder for the remote url files */
            forceUpdate: true,
            /* logger: provide a logger function to use. default is console.log */
            logger: console.log
        });

c.then(d => console.log("testing", d));


```


### TODO


- Add `recursive` imports and cacheing for remote files. Minor changes needed.
- Add options to import a remote published or unpublished package using `https://remoteurl/.../package.json` pack of repository.
- Does not support ES `import` statement as yet.



### Contributions


Contributions, Feature Improvements, Bugs, and Issues are invited.

