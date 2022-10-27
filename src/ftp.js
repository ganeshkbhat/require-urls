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


const path = require('path');
const fs = require('fs');

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

module.exports._ftpConnect = _ftpConnect;
module.exports._getFtpRequest = _getFtpRequest;
