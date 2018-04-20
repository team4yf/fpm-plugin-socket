var net = require('net');
var _ = require('lodash');

var LOCAL_HOST = '127.0.0.1';
var PORT = 5001;

var ID = 1 || _.now();

var client = new net.Socket();

client.connect(PORT, LOCAL_HOST, function(){
    data = {
        id: ID,
        channel: 'online'
    };
    client.write(JSON.stringify(data));
    // client.destroy();
});  
  
client.on('data', (data) => {
    console.log(data.toString());
    // client.end();
});

client.on('close', function(){  
    console.log('connetion closed.');  
});

client.on('error', function(){  
    console.log('connetion error.');  
});