var should = require("chai").should();
var SC = require('../lib/SocketClient.js').SocketClient;

describe('SocketClient', function(){
  it('isInChannel 1', function(done){
    var sc = new SC();
    sc.addChannel('AREA_1');
    sc.isInChannel(['AREA_1']).should.equal(true)
    done();
  })

  it('isInChannel 2', function(done){
    var sc = new SC();
    sc.addChannel([ 'AREA_1', 'AREA_2' ]);
    sc.isInChannel(['AREA_2']).should.equal(true)
    done();
  })

  it('isInChannel 3', function(done){
    var sc = new SC();
    sc.addChannel('AREA_1');
    sc.addChannel('AREA_2');
    sc.addChannel( [ 'AREA_3' ]);
    sc.isInChannel(['AREA_4']).should.equal(false)
    done();
  })


})