"use strict";
import _ from 'lodash'
import net from 'net'
import { SocketClient } from './SocketClient'

const voidFunc = () =>{
    // do nothing here
}

class SocketServer{
    constructor(options){
        this._options = _.assign({
            timeout: 500 * 1000,
            host: '0.0.0.0',
            port: 5001,
        }, options)
        
        this._clients = {}
        this._events = {}
        this._encoder = (src) => {
            return src
        }

        const self = this
        this._decoder = (data) => {
            let message = data.toString()
            try{
                message = JSON.parse(message)
                return message
            }catch(e){
                self.getEventHandler('decode.error')('Ops, Origin Message:' + message)
                return undefined
            }
        }
    }

    deviceOnline(socketClient, id){
        socketClient.online(id)
        this._clients[ id ] = socketClient
        return id
    }

    deviceOffline(socketClient){
        if(socketClient.isOnline()){
            if(!_.has(this._clients, socketClient.getId())){
              return
            }
            delete this._clients[ socketClient.getId() ]
        }
    }

    sendMessage(id, message){
        const self = this
        return new Promise((rs, rj) => {
            if(!_.has(self._clients, id)){
                rj(-1001)
            }else{
                _clients[id].sendData(message)
                rs(1)
            }
        })
    }

    createClient(id){
        return new SocketClient(undefined, id);
    }

    /* Event Defined */

    bindEvent(eventName, fn){
        this._events[eventName] = fn
    }

    bindConnectEvent(fn){
        this.bindEvent('connect', fn)
    }

    bindTimeoutEvent(fn){
        this.bindEvent('timeout', fn)
    }

    bindCloseEvent(fn){
        this.bindEvent('close', fn)
    }

    bindErrorEvent(fn){
        this.bindEvent('error', fn)
    }

    bindDecodeErrorEvent(fn){
        this.bindEvent('decode.error', fn)
    }

    bindReceiveEvent(fn){
        this.bindEvent('receive', fn)
    }

    getEventHandler(eventName){
        return this._events[eventName] || voidFunc
    }

    setDataDecoder(fn){
        this._encoder = fn
    }

    setDataEncoder(fn){
        this._encoder = fn
    }

    /* Send Data */

    broadcast(message, channel){
        // do nothing when there is no client
        if(_.size(this._clients)<1){
            return Promise.resolve(0)
        }
        const NOW = _.now()
        const self = this
        let data = this._encoder(message)
        let count = 0
        data = _.assign({
            time: NOW,
            channel: channel || 'ALL'
        }, data)

        if(!channel){
            // Send To All Clients
            _.map(this._clients, (client) => {
                client.sendData(data)
                count++
            })
        }else{
            _.map(this._clients, (client) => {
                if(client.isInChannel(channel)){
                    client.sendData(data)
                    count ++
                }                
            })
        }
        return Promise.resolve(count)
    }

    send(message, clientId){
        if(!_.has(this._clients, clientId)){
            return Promise.resolve(0)
        }
        const client = this._clients[clientId]

        const NOW = _.now()
        let data = this._encoder(message)
        data = _.assign({
            time: NOW
        }, data)
        client.sendData(data)

        return Promise.resolve(1)
    }

    /* Socket Start/Shutdown */

    connectionEvent(client){
        const self = this
        client.setTimeout(this._options.timeout)
        
        self.getEventHandler('connect')(client)

        const socketClient = new SocketClient(client)
        // Receive Data From Client
        client.on('data', (data) => {
            // decode the network data
            let message = this._decoder(data)
            if(!message){
                return
            }
            switch(message.event){
                case 'online':
                    self.deviceOnline(socketClient, message.id || _.now())
                    break
                default:
                    //Do sth
            }
            // handle the message
            self.getEventHandler('receive')(message)
        })

        // Do Not Need This Event
        // client.on('end', () =>{
        //     self.deviceOffline(socketClient)
        //     self.getEventHandler('close')(socketClient)            
        // })
    
        client.on('close', () =>{
            self.deviceOffline(socketClient)
            self.getEventHandler('close')(socketClient)
        })
    
        client.on('timeout', () =>{
            self.deviceOffline(socketClient)
            self.getEventHandler('timeout')(socketClient)
        })
    
        client.on('error', (error) =>{
            self.deviceOffline(socketClient)
            self.getEventHandler('error')(error, socketClient)
        })

    }

    init(){
        this._server.on('connection', this.connectionEvent.bind(this))
    }

    start(options){
        this._options = _.assign(this._options, options)
        this._server = net.createServer()
        this.init()
        const self = this
        return new Promise((rs, rj) => {
            self._server.listen(self._options.port, self._options.host, () => {
                rs(self._server.address());
            })
        })
        
    }

}

export { SocketServer }