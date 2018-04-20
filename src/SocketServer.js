"use strict";
import _ from 'lodash'
import net from 'net'
import Promise from 'bluebird'

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
        console.log(this._options)
        this._server = net.createServer()
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

    deviceOnline(client, id){
        client.id = id
        this._clients[ id ] = client
    }

    deviceOffline(client){
        if(client.id){
            if(!_.has(this._clients, client.id)){
              return
            }
            delete this._clients[ client.id ]   
        }else{
            console.log('No Client Id')
        }
    }

    writeData(client, data){
        if(_.isPlainObject(data)){
            data = JSON.stringify(data)
        }
        client.write(data)
    }

    sendMessage(id, message){
        const self = this
        return new Promise((rs, rj) => {
            if(!_.has(self._clients, id)){
                rj(-1001)
            }else{
                self.writeData(_clients[id], message)
                rs(1)
            }
        })
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
            return
        }
        const NOW = _.now()
        const self = this
        let data = this._encoder(message)
        data = _.assign({
            time: NOW,
            channel: channel || 'ALL'
        }, data)

        if(!channel){
            // Send To All Clients
            _.map(this._clients, (client) => {
                self.writeData(client, data)
            })
        }else{
            //broadcast with channel

        }
    }

    send(message, clientId){
        if(!_.has(this._clients, clientId)){
            return
        }
        const client = this._clients[clientId]

        const NOW = _.now()
        let data = this._encoder(message)
        data = _.assign({
            time: NOW
        }, data)
        this.writeData(client, data)
    }

    /* Socket Start/Shutdown */

    connectionEvent(client){
        const self = this
        client.setTimeout(this._options.timeout)
        
        self.getEventHandler('connect')(client)

        // Receive Data From Client
        client.on('data', (data) => {
            // decode the network data
            let message = this._decoder(data)
            if(!message){
                return
            }
            switch(message.channel){
                case 'online':
                    self.deviceOnline(client, message.id || _.now())
                    break
                default:
                    //Do sth
            }
            // handle the message
            self.getEventHandler('receive')(message)
        })

        client.on('end', () =>{
            self.deviceOffline(client)
            self.getEventHandler('close')(client)
        })
    
        client.on('close', () =>{
            self.deviceOffline(client)
            self.getEventHandler('close')(client)
        })
    
        client.on('timeout', () =>{
            self.deviceOffline(client)
            self.getEventHandler('timeout')(client)
        })
    
        client.on('error', (error) =>{
            self.deviceOffline(client)
            self.getEventHandler('error')(error, client)
        })

    }

    init(){
        this._server.on('connection', this.connectionEvent.bind(this))
    }

    start(){
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