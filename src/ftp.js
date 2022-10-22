/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: src/ftp.js
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

/**
 *
 *
 * @param {*} module_name
 * @return {*} 
 */
 function _getRequireOrImport(module_name) {
  if (process.versions.node.split('.')[0] > "14") {
      return import(module_name);
  }
  return require(module_name);
}

const path = _getRequireOrImport('path');
const fs = _getRequireOrImport('fs');

/**
*
*
* @param {*} startdirectory
* @param {*} options
* @return {*} 
*/
function _getFtpRoot(startdirectory, options) {
  function cb(fullPath, options) {
    if ((options.baseType === "ftp") && !fs.lstatSync(fullPath).isDirectory()) {
      // var content = fs.readFileSync(fullPath, { encoding: 'utf-8' });
      // var match = /^gitdir: (.*)\s*$/.exec(content);
      // if (match) {
      //   return path.normalize(match[1]);
      // }
    }
    return path.normalize(fullPath);
  }
  options.baseType = "ftp";
  return _getRoot(startdirectory, { ...options, baseType: options.baseType, getRootCallback: cb });
}

function _getFtpPackageJsonRoot(startdirectory, options) {
  function cb(fullPath, options) {
    if ((options.baseType === "package.json")) {

    }
    return path.normalize(fullPath);
  }
  options.baseType = "package.json";
  return _getRoot(startdirectory, { ...options, baseType: options.baseType, getRootCallback: cb });
}


function _findFtpRemoteFileUrl(remoteUrl, searchOptions, options) {
  // Implement _getRoot logic into remote url with concurrency
}

function _findFtpRemoteRootUrl(remoteUrl, searchOptions, options) {
  // Implement _getRoot logic into remote url with concurrency
}

function _findFtpRemotePackageJsonUrl(remoteUrl, options) {
  // Implement _getRoot logic and find the package.json url into remote package.json url with concurrency
}


/**
 *
 *
 * @param {*} options
 * @param {*} data
 * @param {*} protocol
 */
function _getFtpRequest(options, data, protocol) {
  // Implement _getFtpRequest logic into remote url
}

function _ftpConnect(request, options) {
  var net = require('net');
  const Socket = net.Socket;

  var cmdSocket = new Socket();
  cmdSocket.setEncoding('binary')

  var server = options.server || undefined;
  var dataSocket = options.dataSocket || undefined;
  var port = options.port || 21;
  var host = options.host || "localhost";
  var user = options.user || "username";
  var password = options.password || "password";
  var active = options.active || true;

  function onConnect() { }

  var str = "";
  function onData(chunk) {
    console.log(chunk.toString('binary'));
    var code = chunk.substring(0, 3);

    //if ftp server return code = 220
    if (code == '220') {
      _send('USER ' + user, function () {
      });
    }

    else if (code == '331') {
      _send('PASS ' + password, function () {
      });
    }

    else if (code == '230') {
      if (active) {
        server = net.createServer(function (socket) {
          dataSocket = socket;
          console.log('new connection');
          socket.setKeepAlive(true, 5000);

          socket.on('connect', function () {
            console.log('socket connect');
          });

          socket.on('data', function (d) {
            console.log('socket data: ' + d);
          });

          socket.on('error', function (err) {
            console.log('socket error: ' + err);
          });

          socket.on('end', function () {
            console.log('socket end');
          });

          socket.on('drain', function () {
            console.log('socket drain');
          });

          socket.on('timeout', function () {
            console.log('socket timeout');
          });

          socket.on('close', function () {
            console.log('socket close');
          });
        });

        server.on('error', function (e) {
          console.log(e);
        });

        server.on('close', function () {
          console.log('server close');
        });

        server.listen(function () {
          console.log('listening');

          var address = server.address();
          var port = address.port;
          var p1 = Math.floor(port / 256);
          var p2 = port % 256;

          _send('PORT 127,0,0,1,' + p1 + ',' + p2, function () {

          });
        });
      } else {
        _send('PASV', function () {

        });
      }
    }

    else if (code == '200') {
      _send('STOR file.txt', function () {

      });
    }

    //ready for data
    else if (code == '150') {
      dataSocket.write('some wonderful file contents\r\n', function () { });
      dataSocket.end(null, function () { });
    }

    //transfer finished
    else if (code == '226') {
      _send('QUIT', function () { console.log("Saying Goodbye"); });
    }

    //session end
    else if (code == '221') {
      cmdSocket.end(null, function () { });
      if (!!server) { server.close(); }
    }
  }

  function onEnd() {
    console.log('half closed');
  }

  function onClose() {
    console.log('closed');
  }

  cmdSocket.once('connect', onConnect);
  cmdSocket.on('data', onData);
  cmdSocket.on('end', onEnd);
  cmdSocket.on('close', onClose);

  cmdSocket.connect(port, host);

  function _send(cmd, callback) {
    cmdSocket.write(cmd + '\r\n', 'binary', callback);
  }

}

function _getFtpRequest() { }

module.exports._getFtpRoot = _getFtpRoot;
module.exports._getFtpPackageJsonRoot = _getFtpPackageJsonRoot;
module.exports._findFtpRemoteFileUrl = _findFtpRemoteFileUrl;
module.exports._findFtpRemoteRootUrl = _findFtpRemoteRootUrl;
module.exports._findFtpRemotePackageJsonUrl = _findFtpRemotePackageJsonUrl;
module.exports._getFtpRequest = _getFtpRequest;
module.exports._ftpConnect = _ftpConnect;
module.exports._getFtpRequest = _getFtpRequest;
