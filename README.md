# requireurl
Deno Mode in commonjs require: Replace nodejs require function with requireurl

This module has a single simple function `requireurl` for URL (git raw file) resolution and parsing meant to have feature parity with node.js core url module. It also by default allows for cacheing files in the repository. The file will be pulled from the cache file if already cached. You can force update the cache file if needed.

### TODO
Does not support ES `import` statement as yet.

### Contributions
Contributions, Feature Improvements, Bugs, and Issues are invited.

