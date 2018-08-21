var should = require("chai").should();
var YF = require("yf-fpm-client-js").default;
YF.init({ appkey:'123123', masterKey:'123', domain: 'http://localhost:9999' });

var net = require('net');

var LOCAL_HOST = 'localhost';

var PORT = 5001;

var client = new net.Socket();

describe('Send Buffer Data', function(){
    before(function(done) {
        this.timeout(100 * 1000);
        // handshake message
        client.connect(PORT, LOCAL_HOST, function(){
            data = Buffer.from([0x01, 02, 00, 00, 0x2b, 0xa1], 'hex')
            // client.on('data', (buf) => {
            //     console.info('Receiverd:', buf)
            // })
            client.write(data, (e) => {
                if(e){
                    console.info(e)
                    done(e)
                }else{
                    console.info('Handshake Ok~')
                    done()
                }
                
            });
        });
    });

    it('getOnlineDevice', function(done){
        var func = new YF.Func('socket.getOnlineDevice');
        func.invoke({id: '01020304'})
          .then(function(d){
            console.info(d.data.rows)
            done();
          }).catch(function(err){
            done(err);
          });
    });

    it('isOnline', function(done){
        var func = new YF.Func('socket.isOnline');
        func.invoke({id: '0102'})
          .then(function(d){
            console.info(d)
            done();
          }).catch(function(err){
            done(err);
          });
    });

    it('sendData', function(done){
        var func = new YF.Func('socket.send');
        func.invoke({id: '0102', message: '010200010506', callback: '0001'})
          .then(function(d){
            console.info('The Return Data Of SendData:', d)
            done();
          }).catch(function(err){
            done(err);
          });
          setTimeout(() => {
            client.write(Buffer.from([0x01, 02, 00, 01, 0x2b, 0xa1], 'hex'), (e) => {
                console.info('write ok')
            })
          }, 0.5 * 1000)
          
    });

    after(function(done) {
        this.timeout(100000); 
        // runs after each test in this block
        console.log('Client: >>>> destroy');
        try{
            setTimeout( () => {
                client.destroy();
                done();
            }, 10 * 1000)
            
        }catch(e){
            done(e);
        }
        
    });
})