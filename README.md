# requireurl
Deno Mode in commonjs require: Replace nodejs require function with requireurls function that can fetch remote urls.

This module has a single simple function `requireurl` for URL (git raw file) resolution and parsing meant to have feature parity with node.js core url module. It also by default allows for cacheing files in the repository. The file will be pulled from the cache file if already cached. You can force update the cache file if needed.

### Installation
`npm install require-urls --save`

```

let requireurl = require("require-urls");

let fileone = requireurl("https://raw.githubusercontent.com/ganeshkbhat/requireurl/main/index.js");
let filetwo = requireurl("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");

let requireurls = require("require-urls");
let c = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");
c.then(d => console.log("testing", d));


```

### TODO
- Does not support ES `import` statement as yet.
- Add `recurisive` imports and cacheing for remote files. Minor changes needed.
- Add options to import a remote published or unpublished package using `https://remoteurl/.../package.json` pack of repository

### Contributions
Contributions, Feature Improvements, Bugs, and Issues are invited.

