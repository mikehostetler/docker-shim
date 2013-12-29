
var Server = require('../server'),
  expect = require('chai').expect,
  net = require('net'),
  DuplexEmitter = require('duplex-emitter');

var port = 3330;
var s = new Server(port);
s.start();

describe("#run", function() {

  describe("#uptime", function() {
    it("should return uptime", function(done) {
      this.timeout(5000);

      var socket = net.connect(port);
      var remote = DuplexEmitter(socket);

      remote.on('stderr', function(data) {
        expect(data).to.be.null;
      });

      remote.on('stdout', function(data) {
        expect(data).to.have.length.above(5);
        expect(data).to.contain('up');
      });

      remote.on('close', function(data) {
        expect(data).to.equal(0);
        done();
      });

      remote.emit('spawn', 'uptime');
    });
  });
});
