import requireurls from '../wrapper.mjs';

console.log(requireurls);

// import * as requireurls from "https://github.com/ganeshkbhat/requireurl/blob/main/index.mjs";

requireurls("https://github.com/ganeshkbhat/requireurl/blob/main/index.js").then(d => console.log("Testing returns", d));
