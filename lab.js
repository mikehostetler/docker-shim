var net = require('net'),
  DuplexEmitter = require('duplex-emitter');

var socket = net.connect(3333);

var remote = DuplexEmitter(socket);

remote.on('stderr', function(data) {
  console.log('stderr: ' + data);
});

remote.on('stdout', function(data) {
  console.log('stdout: ' + data);
});

remote.on('close', function(data) {
  console.log('close: ' + data);
});

remote.emit('spawn', 'uptime');