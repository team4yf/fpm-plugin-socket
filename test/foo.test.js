const { init, Func } = require("fpmc-jssdk");
const assert = require('assert');
init({ appkey:'123123', masterKey:'123123', endpoint: 'http://localhost:9999/api' });

const net = require('net');

const LOCAL_HOST = 'localhost', PORT = 5001;

const client = new net.Socket();

describe('Test The Socket Plugin', function(){
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

  it('sendData to a online client', function(done){
    new Func('socket.send')
      .invoke({id: '0102', message: '010200010506', callback: '0001'})
      .then(function(d){
        assert.strictEqual(d.data, '01020001', 'send error: the reply should be 010200012ba1');
        done();
      }).catch(function(err){
        done(err);
      });
      setTimeout(() => {
        client.write(Buffer.from([0x01, 02, 00, 01, 0x2b, 0xa1], 'hex'), (e) => {
          // console.info('write ok')
        })
      }, 0.01 * 1000)  
  });

  it('sendData to a offline client', function(done){
    new Func('socket.send')
      .invoke({id: '0103', message: '010200010506', callback: '0001'})
      .then(function(d){
        assert.strictEqual(d.data, '01030001', 'send error: the reply should be 010200012ba1');
        done();
      }).catch(function(err){
        assert(err.message, 'offline', 'error message should be offline')
        done();
      });
      setTimeout(() => {
        client.write(Buffer.from([0x01, 03, 00, 01, 0x2b, 0xa1], 'hex'), (e) => {
          // console.info('write ok')
        })
      }, 0.01 * 1000)  
  });

  it('broadcast to channel ?', function(done){
    new Func('socket.broadcast')
      .invoke({ message: '010200010506', channel: '?'})
      .then(function(d){
        assert.strictEqual(d, 0, 'should send no one, there is no one at the ? channel');
        done();
      }).catch(function(err){
        done(err);
      });
  });

  it('broadcast to channel foo and 0102', async ()=> {
    try{
      let data = await new Func('socket.addChannel').invoke({ ids: '0103,0102', channel: 'foo'});
      assert.strictEqual(data, '0102', 'could not add offline client to the channel');
      data = await new Func('socket.broadcast').invoke({ message: '010200010506', channel: 'foo', ids: '0102,0103'})
      assert.strictEqual(data, 1, 'should send one online client');
    }catch(e){
      assert.strictEqual(e, undefined, e);
    }
  });

  it('broadcast to all', function(done){
    new Func('socket.broadcast')
      .invoke({ message: '010200010506'})
      .then(function(d){
        assert.strictEqual(d, 1, 'should send one online client');
        done();
      }).catch(function(err){
        done(err);
      });
  });

  it('addChannel for online client', function(done){
    new Func('socket.addChannel')
      .invoke({ ids: '0102', channel: 'foo'})
      .then(function(d){
        assert.strictEqual(d, '0102', 'add 0102 to channel foo fail');
        done();
      }).catch(function(err){
        done(err)
       })
    })

  it('addChannel for offline client', function(done){
    new Func('socket.addChannel')
      .invoke({ ids: '0103', channel: 'foo'})
      .then(function(d){
        assert.strictEqual(d, '', 'could not add offline client to the channel');
        done();
      }).catch(function(err){
        done(err);
      });
  });

  it('addChannel for online and offline client', function(done){
    new Func('socket.addChannel')
      .invoke({ ids: '0103,0102', channel: 'foo'})
      .then(function(d){
        assert.strictEqual(d, '0102', 'could not add offline client to the channel');
        done();
      }).catch(function(err){
        done(err);
      });
  });


  it('broadcast to channel with clients', async ()=> {
    try{
      let data = await new Func('socket.addChannel').invoke({ ids: '0103,0102', channel: 'foo'});
      assert.strictEqual(data, '0102', 'could not add offline client to the channel');
      data = await new Func('socket.broadcast').invoke({ message: '010200010506', channel: 'foo'})
      assert.strictEqual(data, 1, 'should send one online client');
    }catch(e){
      assert.strictEqual(e, undefined, e);
    }
  });



  after(function(done) {
    this.timeout(100000); 
    // runs after each test in this block
    // Client: >>>> destroy
    client.destroy();
    done();      
  });
})