var net = require('net');
var _ = require('lodash');

var REMOTE_HOST = '106.75.67.85';
var PORT = 5001;

var ID = _.now();

var client = new net.Socket();

client.connect(PORT, REMOTE_HOST, function(){
    data = {
        id: ID,
        channel: 'online'
    };
    client.write(JSON.stringify(data));
});  
  
client.on('data', (data) => {
    console.log(data.toString());
});

client.on('close', function(){  
    console.log('connetion closed.');  
});

client.on('error', function(){  
    console.log('connetion error.');  
});