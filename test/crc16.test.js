var net = require('net');
var _ = require('lodash');

var LOCAL_HOST = 'localhost';

var PORT = 5001;

var ID = _.now();

var client = new net.Socket();

describe('Socket', function(){

    it('isInChannel 3', function(done){
        this.timeout(100000); 
        console.log('Client: >>>> try connectting...');
        client.on('data', (data) => {
            console.log(data.toString());
        });
        client.connect(PORT, LOCAL_HOST, function(){
            data = new Buffer([0x2c, 02, 03, 04, 0x2b, 0xa1], 'hex')
            client.write(data);
            console.log('Client: >>>> connected');
            done();
            
        });
    });

    afterEach(function(done) {
        this.timeout(100000); 
        // runs after each test in this block
        console.log('Client: >>>> destroy');
        try{
            client.destroy();
            done();
        }catch(e){
            done(e);
        }
        
    });
})