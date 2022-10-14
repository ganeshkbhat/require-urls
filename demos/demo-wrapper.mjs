import * as requireurls from '../wrapper.mjs';

console.log(requireurls.default);

requireurls.default("https://github.com/ganeshkbhat/requireurl/blob/main/index.js").then(d => console.log("Testing returns", d));
