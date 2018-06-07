var net = require('net');
var _ = require('lodash');

var YF = require("yf-fpm-client-js").default;
YF.init({ appkey:'123123', masterKey:'123123', domain: 'http://localhost:9999' });

var LOCAL_HOST = 'localhost';

var PORT = 5001;

var ID = _.now();

var client = new net.Socket();

describe('Socket', function(){

    beforeEach(function(done) {
        this.timeout(100000); 
        console.log('Client: >>>> try connectting...');
        client.connect(PORT, LOCAL_HOST, function(){
            data = {
                id: ID,
                event: 'online'
            };
            client.write(JSON.stringify(data));
            console.log('Client: >>>> connected');
            done();
            
        });
        // console.log('Server: >>>> Try Send Message in 5 sec');
        // setTimeout(() => {
        //     console.log('Ready To Send Message')
        //     var func = new YF.Func('socket.send');
        //     func.invoke({ message: { content: 'hi there' }, clientId: ID})
        //         .then((data)=>{
        //             console.log('call socket.send OK!~ ', data);
        //         })
        //         .catch((e) => {
        //             done(e);
        //         })
        // }, 5 * 1000)
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


    describe('Client Test', function(){

        it('Receive Data', function(done){
            this.timeout(100000); 
            var func = new YF.Func('socket.send');
            func.invoke({ message: { content: 'hi there' }, clientId: ID})
                .then((data)=>{
                    console.log('call socket.send OK!~ ', data);
                })
                .catch((e) => {
                    done(e);
                })
            client.on('data', (data) => {
                console.log(data.toString());
                done();
            });
        })

        it('getOnlineDevice', function(done){
            console.log('Start to getOnlineDevice....')
            this.timeout(100000); 
            var func = new YF.Func('socket.getOnlineDevice');
            func.invoke({})
                .then((data)=>{
                    console.log(data);
                    done()
                })
                .catch((e) => {
                    done(e);
                })
        })
    })
})