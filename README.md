# requireurl
Deno Mode in commonjs require: Replace nodejs require function with requireurl

This module has a single simple function `requireurl` for URL (git raw file) resolution and parsing meant to have feature parity with node.js core url module. It also by default allows for cacheing files in the repository. The file will be pulled from the cache file if already cached. You can force update the cache file if needed.


```

var requireurl = require("require-urls");

var fileone = requireurl("https://raw.githubusercontent.com/ganeshkbhat/requireurl/main/index.js");
var filetwo = requireurl("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");

```

### TODO
Does not support ES `import` statement as yet.

### Contributions
Contributions, Feature Improvements, Bugs, and Issues are invited.

