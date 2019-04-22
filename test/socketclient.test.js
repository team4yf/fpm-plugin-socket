const assert = require('assert');
var SC = require('../src/SocketClient.js').SocketClient;

describe('SocketClient', function(){
  it('isInChannel 1', function(done){
    var sc = new SC();
    sc.addChannel('AREA_1');
    assert(sc.isInChannel(['AREA_1']), 'fail')
    done();
  })

  it('isInChannel 2', function(done){
    var sc = new SC();
    sc.addChannel([ 'AREA_1', 'AREA_2' ]);
    assert(sc.isInChannel(['AREA_2']), 'fail')
    done();
  })

  it('isInChannel 3', function(done){
    var sc = new SC();
    sc.addChannel('AREA_1');
    sc.addChannel('AREA_2');
    sc.addChannel( [ 'AREA_3' ]);
    assert(!sc.isInChannel(['AREA_4']), 'fail')
    done();
  })


})