# ERROR DOCUMENTATION


### 1 - require-urls : Nodejs Network Not Available Error


This error is noticed when there is no internet.


```


node:internal/deps/undici/undici:6406
          p.reject(Object.assign(new TypeError("fetch failed"), { cause: response.error }));
                                 ^

TypeError: fetch failed
    at Object.processResponse (node:internal/deps/undici/undici:6406:34)
    at node:internal/deps/undici/undici:6727:42
    at node:internal/process/task_queues:140:7
    at AsyncResource.runInAsyncScope (node:async_hooks:203:9)
    at AsyncResource.runMicrotask (node:internal/process/task_queues:137:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  cause: ConnectTimeoutError: Connect Timeout Error
      at onConnectTimeout (node:internal/deps/undici/undici:2930:28)
      at node:internal/deps/undici/undici:2888:50
      at Immediate._onImmediate (node:internal/deps/undici/undici:2917:37)
      at process.processImmediate (node:internal/timers:471:21) {
    code: 'UND_ERR_CONNECT_TIMEOUT'
  }
}

Node.js vxx.xx.x


```
