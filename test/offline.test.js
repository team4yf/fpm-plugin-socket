const assert = require('assert');
const { init, Func } = require("yf-fpm-client-js").default;
const net = require('net');

const LOCAL_HOST = 'localhost', PORT = 5001;

const client = new net.Socket();

init({ appkey:'123123', masterKey:'123', domain: 'http://localhost:9999' });

describe('Offline Test', function(){
  before(function(done) {
    this.timeout(100 * 1000);
    // handshake message
    client.connect(PORT, LOCAL_HOST, function(){
      data = Buffer.from([0x01, 02, 00, 00, 0x2b, 0xa1], 'hex')
      client.write(data, (e) => {
        assert.strictEqual(e, undefined, e);
        done();
      });
    });
  });

  it('getOnlineDevice', function(done){
    new Func('socket.getOnlineDevice').invoke()
      .then(function(d){
        assert.strictEqual(d.data.count, 1, 'socket.getOnlineDevice Error: Count should be 1 ');
        assert.strictEqual(d.data.rows[0].id, '0102', 'socket.getOnlineDevice Error: the only one client.id should be 0102 ');
        done();
      }).catch(function(err){
        done(err);
      });
  });

  it('isOnline', function(done){
    new Func('socket.isOnline')
      .invoke({id: '0102'})
      .then(function(d){
        assert.strictEqual(d, 1, 'the client with id euqal 0102 should be online');
        done();
      }).catch(function(err){
        done(err);
      });
  });

  it('isOffline', function(done){
    new Func('socket.isOnline')
      .invoke({id: '0103'})
      .then(function(d){
        assert.strictEqual(d, 0, 'the client with id euqal 0103 should be online');
        done();
      }).catch(function(err){
        done(err);
      });
  });

  after(function(done) {
    this.timeout(100000); 
    // runs after each test in this block
    // Client: >>>> destroy
    client.destroy();
    done();      
  });
})