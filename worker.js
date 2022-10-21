

const { parentPort } = require("worker_threads");

parentPort.on("message", function (contents) {
    return contents.callback(contents);
}.bind(contents, parentPort));
