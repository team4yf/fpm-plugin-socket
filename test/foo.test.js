var net = require('net');

var LOCAL_HOST = 'localhost';

var PORT = 5001;

var client = new net.Socket();

describe('Send Buffer Data', function(){

    it('isInChannel 3', function(done){
        this.timeout(100000); 
        client.on('data', (data) => {
            console.log(data);
            done();
        });
        client.connect(PORT, LOCAL_HOST, function(){
            data = Buffer.from([0x01, 02, 03, 04, 0x2b, 0xa1], 'hex')
            client.write(data);
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