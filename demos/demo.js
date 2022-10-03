
let requireurls = require("../index");
let c = requireurls("https://raw.githubusercontent.com/ganeshkbhat/requireurl/8d8681c4a28d64f23fb473064fa86880a0b930ff/index.js");

c.then(d => console.log("testing", d));

