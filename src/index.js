"use strict";
import _ from 'lodash'
import net from 'net'

const HOST = 'localhost'
const PORT = 10000

const SERVER = net.createServer()
let clientList = []


SERVER.on('connection', (client) =>{  
  client.name = client.remoteAddress + ':' + client.remotePort;  
  console.log('connect request from ' + client.name)  

  client.setTimeout(5000 * 1000);  

  client.write('Hi!\n');  
  clientList.push(client);  

  client.on('data', function(data){  
    console.log(data.toString());
      // broadcast(data, client);  
  });  

  client.on('end', function(){  
      clientList.splice(clientList.indexOf(client), 1);  
  });  

  client.on('close', function() {  
      console.log('close:' + client.name);  
  });  

  client.on('timeout',function(){  
      client.end();  
  })  

  client.on('error', function(error) {  
    
      console.log('onError', error);  
  });  
})

export default {
  bind: (fpm) => {
    SERVER.listen(PORT, HOST)
    fpm.registerAction('BEFORE_SERVER_START', () => {
      fpm._socketServer = SERVER
      fpm._socketClients = clientList

      
      setInterval(function(){
        console.log(clientList.length);
        clientList.map((item) => {
          item.write('Hi!\n' + _.now());
        })
      }, 10000);
    })
  }
}
