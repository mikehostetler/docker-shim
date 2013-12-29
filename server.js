var net           = require('net'),
  DuplexEmitter = require('duplex-emitter');


var Server = function() {
  var self = this;

  this.server = net.createServer(onConnection);

  function onConnection(socket) {
    self.remote = DuplexEmitter(socket);

    remote.on('spawn', onSpawn.bind(this));

    socket.once('end', function() {
      console.log('worker disconnected');
    });

    socket.on('error', function(err) {
      console.error(err.stack);
      onEnd();
    });
  }

};


Server.prototype.start = function() {
  this.server.listen(3333, function() {
    console.log('Server listening!');
  });
};


function onSpawn(command, args, options) {
  var self = this;
  console.log('Spawning command: %j ARGS: %j, OPTIONS: %j'.yellow, command, args, options);
  
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
  });
}

module.exports = Server;
