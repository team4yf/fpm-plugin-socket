var net = require('net');  
  
var HOST = '127.0.0.1';  
var PORT = 10000;  
  
var client = new net.Socket();  
client.connect(PORT, HOST, function(){  
    console.log('connect to ' + HOST + ':' + PORT);  
    client.write('connet request from ' + HOST + ':' + PORT + '\n');  
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