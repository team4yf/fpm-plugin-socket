"use strict";
import _ from 'lodash'
import net from 'net'

const SERVER = net.createServer()
let clients = {}

const deviceOnline = (client, message) => {
  client.id = message.id
  clients[ message.id ] = client
}

const deviceOffline = (client) => {
  if(client.id){
    delete clients[ client.id ]  
  }else{
    console.log('No Client Id')
  }
}

const sendData = (client, data) => {
  client.write(JSON.stringify(data));
}

SERVER.on('connection', (client) =>{  
  client.name = client.remoteAddress + ':' + client.remotePort

  client.setTimeout(5000 * 1000)

  client.on('data', function(data){
    let message = data.toString()
    message = JSON.parse(message)
    console.log(message)
    switch(message.channel){
      case 'online':
        deviceOnline(client, message)
        break
      default:
        //TODO: do sth
    }
  })

  client.on('end', function(){
    console.log('onEnd')
    deviceOffline(client)
  })

  client.on('close', function() {  
    console.log('onClose')
    deviceOffline(client)
  }) 

  client.on('timeout',function(){  
    console.log('onTimeout')
    deviceOffline(client)
  })  

  client.on('error', function(error) {
    console.log('onError')
    deviceOffline(client)
  })  
})

export default {
  bind: (fpm) => {
    fpm.registerAction('BEFORE_SERVER_START', () => {
      const config = fpm.getConfig('socket') || {
        port: 10000,
        host: '127.0.0.1'
      }
      const HOST = config.host || 'localhost'
      const PORT = config.port || 10000
      SERVER.listen(PORT, HOST)
      // fpm._socketServer = SERVER
      // fpm._socketClients = clientList

      
      setInterval(function(){
        console.log('Clients:', _.keys(clients))
        const NOW = _.now()
        _.map(clients, (item) => {
          let data = {
            time: NOW,
            channel: 'heartbeat'
          }
          sendData(item, data)
        })
      }, 5000);
    })
  }
}
