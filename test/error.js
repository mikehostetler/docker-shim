
var Server = require('../server'),
  expect = require('chai').expect,
  net = require('net'),
  DuplexEmitter = require('duplex-emitter');

var port = 3331;
var s = new Server(port);
s.start();

describe("#run", function() {

  describe("#echo", function() {
    it("should fail", function(done) {
      this.timeout(5000);

      var socket = net.connect(port);
      var remote = DuplexEmitter(socket);

      remote.on('stderr', function(data) {
        expect(data).not.to.be.null;
      });

      remote.on('stdout', function(data) {
        expect(data).to.be.null;
      });

      remote.on('close', function(data) {
        expect(data).to.equal(-1);
        done();
      });

      remote.emit('spawn', 'echo "boom"');
    });
  });
});
