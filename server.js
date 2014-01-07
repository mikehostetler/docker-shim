var net           = require('net'),
  DuplexEmitter = require('duplex-emitter'),
  spawn         = require('child_process').spawn,
  Domain        = require('domain');


var Server = function(port) {
  var self = this;

  this.port = port;
  this.server = net.createServer(onConnection);

  function onConnection(socket) {
    self.socket = socket;
    self.remote = DuplexEmitter(socket);

    self.remote.on('spawn', onSpawn.bind(self));

    socket.once('end', function() {
      console.log('Worker disconnected');
    });

    socket.on('error', function(err) {
      console.error(err.stack);
    });
  }

};


Server.prototype.start = function() {
  this.server.listen(this.port, function() {
    console.log('Server listening!');
  });
};


function onSpawn(command, args, options) {
  var self = this;
  //console.log('Spawning command: %j ARGS: %j, OPTIONS: %j'.yellow, command, args, options);

  var child = spawn(command, args, options);

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(buf) {
    self.remote.emit('stdout', buf);
  });
  
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function(buf) {
    self.remote.emit('stderr', buf);
  });

  child.once('close', function(code) {
    self.remote.emit('close', code);
    //self.socket.end();
    //self.server.close();
  });

  child.on('error', function(buf) {
    self.remote.emit('stderr', buf);
  });
};

module.exports = Server;
